import {
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  Teleport,
  watch,
  type PropType,
} from 'vue'
import type { GridStack, GridStackNode } from 'gridstack'
import { GS_CONTEXT_KEY, GS_ITEM_CONTEXT_KEY } from './gridstack-context'
import type { GridStackWidget } from './types'

/** Recursively find a node by id across the grid and all nested sub-grids. */
function findNodeInGrid(g: GridStack, id: string): GridStackNode | undefined {
  const hit = g.engine.nodes.find((n) => String(n.id) === id)
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
 * Teleport anchor for one grid item.
 * Owns Vue subtree; survives cross-grid DnD while this component stays mounted.
 *
 * The slot content is teleported into the GS-owned `.grid-stack-item-content` element,
 * so widget components never need to know about GS DOM internals.
 */
export const GridStackItem = defineComponent({
  name: 'GridStackItem',

  props: {
    id: {
      type: String,
      required: true,
    },
    options: {
      type: Object as PropType<Partial<GridStackWidget>>,
      default: () => ({}),
    },
  },

  setup(props, { slots }) {
    const ctx = inject(GS_CONTEXT_KEY)
    if (!ctx) throw new Error('<GridStackItem> must be used inside <GridStack>')

    /** The `.grid-stack-item-content` element to teleport into — null until GS creates it. */
    const containerEl = ref<HTMLElement | null>(null)

    /** True once we are fully mounted and have not yet started unmounting. */
    let alive = false

    function syncContainer() {
      const g = ctx!.grid
      if (!g) return
      const node = findNodeInGrid(g, props.id)
      const cont = (node?.el?.querySelector('.grid-stack-item-content') as HTMLElement | null) ?? null
      containerEl.value = cont
    }

    onMounted(() => {
      alive = true
      const g = ctx!.grid
      if (!g) return

      const node = findNodeInGrid(g, props.id)
      if (!node?.el) {
        // Item not yet in any grid — add it.
        g.addWidget({ ...props.options, id: props.id } as GridStackWidget)
      } else if (node.grid === g) {
        // Already in the outer grid — update position/opts.
        g.update(node.el, { ...props.options, id: props.id } as GridStackWidget)
      }
      // Items owned by a nested sub-grid are left alone (sub-grid manages them).

      syncContainer()

      // After teleport content renders, refresh drag handles to pick up
      // any custom handle selectors the slot content may have introduced.
      void Promise.resolve().then(() => {
        if (!alive) return
        const n = findNodeInGrid(g, props.id)
        if (n?.el) g.refreshDragHandles(n.el)
      })
    })

    // Re-sync the container whenever layoutVersion changes (GS rearranged the DOM).
    watch(() => ctx!.layoutVersion.value, syncContainer)

    onBeforeUnmount(() => {
      alive = false
      const g = ctx!.grid
      if (!g?.engine) return
      const node = findNodeInGrid(g, props.id)
      if (!node?.el || !node.grid) return
      if (node.grid === g) {
        try {
          g.removeWidget(node.el, false)
        } catch {
          // already removed
        }
      }
    })

    // Expose id + serialize registration to child composables via item context.
    const serializers = new Map<string, () => Record<string, unknown> | undefined>()

    function registerSerializer(fn: () => Record<string, unknown> | undefined) {
      serializers.set(props.id, fn)
      return () => { serializers.delete(props.id) }
    }

    // Merge serializer output into props during grid.save() — called by registry.
    // We stamp this onto the context so the host GridStack can reach it.
    const gridComp = ctx!.grid ? (ctx as unknown as { _hostApi?: unknown })._hostApi : null
    void gridComp // accessed via _gridComp on the DOM; here we register with parent ctx.

    // Also register with parent grid's serializer registry.
    ctx!.registerWidgetSerializer(props.id, () => {
      const fn = serializers.get(props.id)
      return fn?.()
    })

    provide(GS_ITEM_CONTEXT_KEY, {
      id: props.id,
      registerSerializer,
    })

    return () => {
      const target = containerEl.value
      if (!target || !slots.default) return null
      return h(Teleport, { to: target }, slots.default())
    }
  },
})
