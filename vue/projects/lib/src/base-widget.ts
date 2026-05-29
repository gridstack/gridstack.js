import type { GridStackWidget } from './types'

/**
 * Optional abstract base for widget components that participate in `grid.save()` / `grid.load()`.
 *
 * For Composition API widgets, prefer `useWidgetSerializer()` instead.
 * This class is provided for parity with the Angular wrapper and for Options API users.
 *
 * @example
 * ```ts
 * export default defineComponent({
 *   extends: BaseWidget,
 *   setup(_, { expose }) {
 *     const count = ref(0)
 *     expose({
 *       serialize: () => ({ count: count.value }),
 *       deserialize: (w) => { count.value = w.props?.count as number ?? 0 },
 *     })
 *   },
 * })
 * ```
 */
export abstract class BaseWidget {
  public widgetItem?: GridStackWidget

  public serialize(): Record<string, unknown> | undefined {
    return undefined
  }

  public deserialize(w: GridStackWidget): void {
    this.widgetItem = w
    if (!w) return
    if (w.props) Object.assign(this, w.props)
  }
}
