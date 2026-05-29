import type { InjectionKey, Ref } from 'vue'
import { inject } from 'vue'
import type { GridStack } from 'gridstack'

export interface GsContext {
  /** Raw GridStack instance — NOT a Vue ref (GS proxies break internals). */
  grid: GridStack | null
  /** Bumped after GS-driven layout changes so descendants can re-sync. */
  layoutVersion: Ref<number>
  registerWidgetSerializer(id: string, fn: () => Record<string, unknown> | undefined): () => void
}

export interface GsItemContext {
  id: string
  registerSerializer?: (fn: () => Record<string, unknown> | undefined) => () => void
}

export const GS_CONTEXT_KEY: InjectionKey<GsContext> = Symbol('gs-context')
export const GS_ITEM_CONTEXT_KEY: InjectionKey<GsItemContext> = Symbol('gs-item-context')

export function useGsContext(): GsContext {
  const ctx = inject(GS_CONTEXT_KEY)
  if (!ctx) throw new Error('useGridStack must be used within <GridStack>')
  return ctx
}

export function useGsItemContext(): GsItemContext {
  const ctx = inject(GS_ITEM_CONTEXT_KEY)
  if (!ctx) throw new Error('useGridStackItem must be used inside <GridStackItem> content')
  return ctx
}
