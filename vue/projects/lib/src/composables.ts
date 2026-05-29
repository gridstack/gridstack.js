import { computed, inject, onBeforeUnmount, onMounted } from 'vue'
import type { GridStackNode } from 'gridstack'
import { GS_CONTEXT_KEY, GS_ITEM_CONTEXT_KEY } from './gridstack-context'
import type { GridStackWidget } from './types'

// ---------------------------------------------------------------------------
// useGridStack
// ---------------------------------------------------------------------------

/**
 * Access the parent `<GridStack>`'s grid instance and helpers.
 *
 * Must be called within a component that is a descendant of `<GridStack>`.
 */
export function useGridStack() {
  const ctx = inject(GS_CONTEXT_KEY)
  if (!ctx) throw new Error('useGridStack must be used within <GridStack>')

  return {
    /** Raw GridStack instance (not a Vue ref — never proxy it). */
    get grid() { return ctx.grid },
    /** Bumps whenever the layout changes — use as a reactive dependency. */
    get layoutVersion() { return ctx.layoutVersion.value },
    addWidget(w: GridStackWidget) {
      return ctx.grid?.addWidget(w as Parameters<NonNullable<typeof ctx.grid>['addWidget']>[0])
    },
    removeWidget(
      el: Parameters<NonNullable<typeof ctx.grid>['removeWidget']>[0],
      removeDOM?: boolean,
      triggerEvent?: boolean,
    ) {
      return ctx.grid?.removeWidget(el, removeDOM, triggerEvent)
    },
    removeAll(removeDOM = true) {
      return ctx.grid?.removeAll(removeDOM)
    },
    save(saveContent = true, saveGridOpt = false) {
      return ctx.grid?.save(saveContent, saveGridOpt)
    },
    load(items: GridStackWidget[]) {
      return ctx.grid?.load(items)
    },
  }
}

// ---------------------------------------------------------------------------
// useGridStackItem
// ---------------------------------------------------------------------------

export interface UseGridStackItemResult {
  id: string
  node: GridStackNode | undefined
}

/**
 * Returns the widget `id` and the live `GridStackNode` for the widget that
 * contains the calling component. Must be called inside `<GridStackItem>` slot content.
 *
 * Recomputes whenever `layoutVersion` changes.
 */
export function useGridStackItem(): UseGridStackItemResult {
  const itemCtx = inject(GS_ITEM_CONTEXT_KEY)
  if (!itemCtx) throw new Error('useGridStackItem must be used inside <GridStackItem> content')

  const gsCtx = inject(GS_CONTEXT_KEY)
  if (!gsCtx) throw new Error('useGridStackItem must be used within <GridStack>')

  const node = computed<GridStackNode | undefined>(() => {
    // Access layoutVersion to make this reactive.
    void gsCtx.layoutVersion.value
    return gsCtx.grid?.engine.nodes.find((n) => String(n.id) === String(itemCtx.id))
  })

  return {
    id: itemCtx.id,
    get node() { return node.value },
  }
}

// ---------------------------------------------------------------------------
// useWidgetSerializer
// ---------------------------------------------------------------------------

export interface UseWidgetSerializerOptions<T extends Record<string, unknown>> {
  serialize?: () => T | undefined
  deserialize?: (data: T) => void
}

/**
 * Optional composable for widget components that need to participate in `grid.save()`.
 *
 * Call this inside the `setup()` of a widget component rendered inside `<GridStackItem>`.
 * The `serialize` function is called during `grid.save()` and its return value is merged
 * into the widget's `props` in the serialized JSON.
 *
 * @example
 * ```ts
 * const count = ref(0)
 * useWidgetSerializer({ serialize: () => ({ count: count.value }) })
 * ```
 */
export function useWidgetSerializer<T extends Record<string, unknown>>(
  opts: UseWidgetSerializerOptions<T>,
): void {
  const itemCtx = inject(GS_ITEM_CONTEXT_KEY)

  onMounted(() => {
    if (!itemCtx?.registerSerializer) return
    const cleanup = itemCtx.registerSerializer(
      () => opts.serialize?.() as Record<string, unknown> | undefined,
    )
    onBeforeUnmount(cleanup)
  })
}
