import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
  type Component,
  type PropType,
} from 'vue'
import { GridStack, Utils } from 'gridstack'
import type {
  GridStackDroppedHandler,
  GridStackElementHandler,
  GridStackNodesHandler,
} from 'gridstack'
import { GS_CONTEXT_KEY } from './gridstack-context'
import { GridStackItem } from './gridstack-item'
import { installGridStackVueCallbacks } from './registry'
import type {
  GridHTMLElement,
  GridItemHTMLElement,
  GridStackHostApi,
  GridStackOptions,
  GridStackWidget,
} from './types'

/** Maps `component` JSON keys to Vue components (props merged from saved `props`). */
export type ComponentMap = Record<string, Component>

/**
 * `<GridStack>` — root component.
 *
 * - Pass `options` (with `children`) to seed the initial layout.
 * - Pass `components` to map `component` strings in widget JSON to Vue components.
 * - Listens to all GS events via emits; also exposes `getGrid()` for imperative access.
 * - Use the `#empty` slot to render content when the grid has no items.
 * - Slot content (default) is rendered _outside_ the `.grid-stack` div (host chrome: toolbars etc.).
 */
export const GridStackComponent = defineComponent({
  name: 'GridStack',

  props: {
    options: {
      type: Object as PropType<GridStackOptions>,
      required: true,
    },
    components: {
      type: Object as PropType<ComponentMap>,
      default: () => ({}),
    },
  },

  emits: [
    'added',
    'change',
    'removed',
    'enable',
    'disable',
    'drag',
    'dragstart',
    'dragstop',
    'dropped',
    'resize',
    'resizestart',
    'resizestop',
  ],

  setup(props, { slots, emit, expose }) {
    installGridStackVueCallbacks()

    // Raw (non-reactive) reference to the GridStack instance.
    // IMPORTANT: never wrap in Vue ref() — Vue proxies break GS internals.
    let grid: GridStack | null = null

    /**
     * Reactive flag that flips to true once the grid is initialized.
     * Used so the render function reacts to grid availability without proxying the GS instance.
     */
    const gridReady = ref(false)

    /** Bumped after GS-driven structural changes (added/removed) so descendant composables re-compute. */
    const layoutVersion = ref(0)

    /** True when the grid currently has no items. */
    const isEmpty = ref(false)

    /** IDs of widgets added by `addRemoveCB` that need a teleport anchor. */
    const syntheticIds = ref<Set<string>>(new Set())

    // Ids scheduled for deferred removal — cancelled if the same id re-registers
    // within the same microtask (cross-grid DnD: GS fires remove before add).
    const pendingRemoval = new Set<string>()

    const serializersRef = new Map<string, () => Record<string, unknown> | undefined>()
    const deserializersRef = new Map<string, (data: Record<string, unknown>) => void>()

    function registerSyntheticItemId(id: string) {
      pendingRemoval.delete(id) // cancel deferred removal for cross-grid DnD
      const next = new Set(syntheticIds.value)
      next.add(id)
      syntheticIds.value = next
    }

    function unregisterSyntheticItemId(id: string) {
      // Defer by one microtask — if registerSyntheticItemId fires in the same sync block
      // (cross-grid DnD), it cancels this removal and the Vue subtree never unmounts.
      pendingRemoval.add(id)
      void Promise.resolve().then(() => {
        if (!pendingRemoval.has(id)) return
        pendingRemoval.delete(id)
        const next = new Set(syntheticIds.value)
        next.delete(id)
        syntheticIds.value = next
        serializersRef.delete(id)
        deserializersRef.delete(id)
      })
    }

    function requestUpdate() {
      layoutVersion.value++
    }

    function registerWidgetSerializer(
      id: string,
      serialize: () => Record<string, unknown> | undefined,
      deserialize?: (data: Record<string, unknown>) => void,
    ) {
      serializersRef.set(id, serialize)
      if (deserialize) deserializersRef.set(id, deserialize)
      return () => {
        serializersRef.delete(id)
        deserializersRef.delete(id)
      }
    }

    function mergeWidgetPropsForSave(id: string, w: GridStackWidget) {
      const extra = serializersRef.get(id)?.()
      if (extra) w.props = { ...(w.props ?? {}), ...extra }
    }

    function deserializeWidget(id: string, w: GridStackWidget) {
      if (w.props) deserializersRef.get(id)?.(w.props)
    }

    const hostApi: GridStackHostApi = {
      registerSyntheticItemId,
      unregisterSyntheticItemId,
      requestUpdate,
      registerWidgetSerializer,
      mergeWidgetPropsForSave,
      deserializeWidget,
    }

    /** Reference to the `.grid-stack` root div — set via `onVnodeMounted`. */
    let rootEl: GridHTMLElement | null = null

    onMounted(() => {
      if (!rootEl) return

      // Stamp _gridComp BEFORE calling init() so that addRemoveCB fires during
      // init() can already reach the host API to register synthetic item IDs.
      rootEl._gridComp = hostApi

      // Remove orphaned .grid-stack-item children left by prior hot-reload cycles
      // before calling init() so GS doesn't auto-register stale elements.
      const itemClass =
        (props.options as Record<string, unknown>).itemClass as string | undefined ??
        'grid-stack-item'
      Array.from(rootEl.children).forEach((child) => {
        if (
          child.classList.contains(itemClass) &&
          !(child as GridItemHTMLElement).gridstackNode
        ) {
          child.remove()
        }
      })

      grid = GridStack.init(props.options, rootEl)
      gridReady.value = true
      layoutVersion.value++
      isEmpty.value = !grid.engine.nodes.length

      hookEvents()
    })

    onBeforeUnmount(() => {
      unhookEvents()
      if (rootEl) delete rootEl._gridComp
      grid?.destroy(false)
      grid = null
      gridReady.value = false
    })

    // Watch for options reference changes and forward to the live grid instance.
    watch(
      () => props.options,
      (next) => {
        grid?.updateOptions(next)
      },
    )

    function hookEvents() {
      if (!grid) return

      grid.on('added', ((e: Event, nodes: Parameters<GridStackNodesHandler>[1]) => {
        layoutVersion.value++
        isEmpty.value = false
        emit('added', e, nodes)
      }) as GridStackNodesHandler)

      // change = position/resize; portal targets don't move so no layoutVersion bump.
      grid.on('change', ((e: Event, nodes: Parameters<GridStackNodesHandler>[1]) => {
        emit('change', e, nodes)
      }) as GridStackNodesHandler)

      grid.on('removed', ((e: Event, nodes: Parameters<GridStackNodesHandler>[1]) => {
        layoutVersion.value++
        isEmpty.value = !grid!.engine.nodes.length
        emit('removed', e, nodes)
      }) as GridStackNodesHandler)

      grid.on('enable', (e: Event) => emit('enable', e))
      grid.on('disable', (e: Event) => emit('disable', e))

      grid.on('drag', (e: Event, el: HTMLElement) => {
        emit('drag', e, el)
      })
      grid.on('dragstart', (e: Event, el: HTMLElement) => {
        emit('dragstart', e, el)
      })
      grid.on('dragstop', (e: Event, el: HTMLElement) => {
        emit('dragstop', e, el)
      })
      grid.on('dropped', ((e: Event, prev: GridStackWidget, curr: GridStackWidget) => {
        emit('dropped', e, prev, curr)
      }) as GridStackDroppedHandler)
      grid.on('resize', ((e: Event, el: HTMLElement) => {
        emit('resize', e, el)
      }) as GridStackElementHandler)
      grid.on('resizestart', ((e: Event, el: HTMLElement) => {
        emit('resizestart', e, el)
      }) as GridStackElementHandler)
      grid.on('resizestop', ((e: Event, el: HTMLElement) => {
        emit('resizestop', e, el)
      }) as GridStackElementHandler)
    }

    function unhookEvents() {
      if (!grid) return
      ;['added', 'change', 'removed', 'enable', 'disable', 'drag', 'dragstart', 'dragstop',
        'dropped', 'resize', 'resizestart', 'resizestop'].forEach((ev) => grid!.off(ev))
    }

    expose({
      getGrid: () => grid,
    })

    // Provide context so GridStackItem and composables can reach the grid.
    provide(GS_CONTEXT_KEY, {
      get grid() { return grid },
      layoutVersion,
      registerWidgetSerializer,
    })

    return () => {
      // Build teleport anchors for GS-driven (synthetic) widget additions.
      const synItems: ReturnType<typeof h>[] = []
      if (gridReady.value && grid && syntheticIds.value.size > 0) {
        for (const synId of syntheticIds.value) {
          const node = Utils.findInGrid(grid, synId, true) as GridStackWidget | undefined
          if (!node?.component) continue
          const Comp = props.components[node.component]
          if (!Comp) continue
          const wProps = (node.props ?? {}) as Record<string, unknown>
          synItems.push(
            h(GridStackItem, { key: `__gs_syn__${synId}`, id: synId, options: node as Partial<GridStackWidget> },
              { default: () => h(Comp, wProps) },
            ),
          )
        }
      }

      return h('div', { class: 'gs-wrapper' }, [
        // Empty slot — rendered when grid has no items (mirrors Angular [empty-content]).
        isEmpty.value ? slots.empty?.() : undefined,
        // The `.grid-stack` div — onVnodeMounted captures the DOM reference.
        h('div', {
          class: 'grid-stack',
          onVnodeMounted: (vnode) => {
            rootEl = vnode.el as GridHTMLElement | null
          },
        }, synItems),
        // Default slot rendered outside the grid (toolbars, debug panels, etc.).
        slots.default?.(),
      ])
    }
  },
})

export { GridStackComponent as GridStack }
