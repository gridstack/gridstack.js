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
import { GridStack } from 'gridstack'
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

/** Recursively find a node by id across the grid and all nested sub-grids. */
function findNodeInGrid(g: GridStack, id: string): GridStackWidget | undefined {
  const hit = g.engine.nodes.find((n) => String(n.id) === id) as GridStackWidget | undefined
  if (hit) return hit
  for (const n of g.engine.nodes) {
    if (n.subGrid) {
      const nested = findNodeInGrid(n.subGrid as GridStack, id)
      if (nested) return nested
    }
  }
  return undefined
}

/**
 * `<GridStack>` — root component.
 *
 * - Pass `options` (with `children`) to seed the initial layout.
 * - Pass `components` to map `component` strings in widget JSON to Vue components.
 * - Listens to all GS events via emits; also exposes `getGrid()` for imperative access.
 * - Slot content is rendered _outside_ the `.grid-stack` div (host chrome: toolbars etc.).
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

    /** Bumped after GS-driven layout changes so descendant composables re-compute. */
    const layoutVersion = ref(0)

    /** IDs of widgets added by `addRemoveCB` that need a teleport anchor. */
    const syntheticIds = ref<Set<string>>(new Set())

    const serializersRef = new Map<string, () => Record<string, unknown> | undefined>()

    function registerSyntheticItemId(id: string) {
      const next = new Set(syntheticIds.value)
      next.add(id)
      syntheticIds.value = next
    }

    function unregisterSyntheticItemId(id: string) {
      const next = new Set(syntheticIds.value)
      next.delete(id)
      syntheticIds.value = next
      serializersRef.delete(id)
    }

    function requestUpdate() {
      layoutVersion.value++
    }

    function registerWidgetSerializer(id: string, fn: () => Record<string, unknown> | undefined) {
      serializersRef.set(id, fn)
      return () => { serializersRef.delete(id) }
    }

    function mergeWidgetPropsForSave(id: string, w: GridStackWidget) {
      const fn = serializersRef.get(id)
      const extra = fn?.()
      if (extra) w.props = { ...(w.props ?? {}), ...extra }
    }

    const hostApi: GridStackHostApi = {
      registerSyntheticItemId,
      unregisterSyntheticItemId,
      requestUpdate,
      registerWidgetSerializer,
      mergeWidgetPropsForSave,
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

      hookEvents()
    })

    onBeforeUnmount(() => {
      unhookEvents()
      if (rootEl) delete rootEl._gridComp
      grid?.destroy(false)
      grid = null
      gridReady.value = false
    })

    // Watch for options changes and forward them to the live grid instance.
    watch(
      () => props.options,
      (next) => {
        grid?.updateOptions(next)
        layoutVersion.value++
      },
      { deep: true },
    )

    function hookEvents() {
      if (!grid) return

      grid.on('added', ((e: Event, nodes: Parameters<GridStackNodesHandler>[1]) => {
        layoutVersion.value++
        emit('added', e, nodes)
      }) as GridStackNodesHandler)

      grid.on('change', ((e: Event, nodes: Parameters<GridStackNodesHandler>[1]) => {
        layoutVersion.value++
        emit('change', e, nodes)
      }) as GridStackNodesHandler)

      grid.on('removed', ((e: Event, nodes: Parameters<GridStackNodesHandler>[1]) => {
        layoutVersion.value++
        emit('removed', e, nodes)
      }) as GridStackNodesHandler)

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
      ;['added', 'change', 'removed', 'drag', 'dragstart', 'dragstop',
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
          const node = findNodeInGrid(grid, synId)
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
        // The `.grid-stack` div — onVnodeMounted captures the DOM reference.
        h('div', {
          class: 'grid-stack',
          onVnodeMounted: (vnode) => {
            rootEl = vnode.el as GridHTMLElement | null
          },
        }, synItems),
        // Slot content rendered outside the grid (toolbars, debug panels, etc.).
        slots.default?.(),
      ])
    }
  },
})

export { GridStackComponent as GridStack }
