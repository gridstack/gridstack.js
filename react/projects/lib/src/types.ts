/**
 * React wrapper type extensions — same identifiers as core `gridstack`, extended when imported from `gridstack/dist/react`.
 * All three framework wrappers (React, Vue, Angular) use the same `component`/`props` field names for widget JSON.
 */
import type {
  GridStackOptions as CoreGridStackOptions,
  GridStackWidget as CoreGridStackWidget,
  GridStackNode as CoreGridStackNode,
  GridHTMLElement as CoreGridHTMLElement,
  GridItemHTMLElement as CoreGridItemHTMLElement,
} from "gridstack";

/** Host API stamped on `grid-stack` element as `_gridComp` for `addRemoveCB` dispatch */
export interface GridStackHostApi {
  registerSyntheticItemId(id: string): void;
  unregisterSyntheticItemId(id: string): void;
  /** Notify React to re-read node props after GS `update()` / `updateCB` */
  requestUpdate(): void;
  registerWidgetSerializer: (
    id: string,
    serialize: () => Record<string, unknown> | undefined,
    deserialize?: (data: Record<string, unknown>) => void
  ) => () => void;
  /** Merge `useWidgetSerializer` results into `w.props` during `grid.save()` */
  mergeWidgetPropsForSave(id: string, w: GridStackWidget): void;
  /** Invoke the registered deserialize fn for an item after a GS `updateCB`. */
  deserializeWidget(id: string, w: GridStackWidget): void;
}

export type GridStackWidgetProps = Record<string, unknown>;

export interface GridStackWidget extends Omit<CoreGridStackWidget, "subGridOpts"> {
  /** Key in the `components` map passed to `<GridStack components={...} />` */
  component?: string;
  props?: GridStackWidgetProps;
  /** Extra CSS classes on the widget root (mirrors Angular `class` on widget JSON). */
  class?: string;
  /** Runtime DOM node when removing via `addRemoveCB` (not serialized). */
  el?: HTMLElement;
  /** Nested grid options (recursive; uses React-extended widget children). */
  subGridOpts?: GridStackOptions;
  /** Defer rendering the component until the item scrolls into view (mirrors Angular lazyLoad). */
  lazyLoad?: boolean;
}

export interface GridStackNode extends CoreGridStackNode {
  component?: string;
}

export interface GridStackOptions extends Omit<CoreGridStackOptions, "children" | "subGridOpts"> {
  children?: GridStackWidget[];
  subGridOpts?: GridStackOptions;
  /** Defer rendering all item components until they scroll into view. Per-item `lazyLoad` overrides. */
  lazyLoad?: boolean;
}

export interface GridHTMLElement extends CoreGridHTMLElement {
  _gridComp?: GridStackHostApi;
}

export interface GridItemHTMLElement extends CoreGridItemHTMLElement {
  _gridItemRef?: { id: string; gridComp: GridStackHostApi };
  /** IntersectionObserver for lazy-loaded items; cleaned up when item is removed. */
  _lazyObserver?: IntersectionObserver;
}
