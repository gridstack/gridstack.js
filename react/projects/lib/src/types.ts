/**
 * React wrapper type extensions — same identifiers as core `gridstack`, extended when imported from `gridstack/dist/react`.
 * Angular parity: `component`/`props` ⇄ `selector`/`input`.
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
    fn: () => Record<string, unknown> | undefined
  ) => () => void;
  /** Merge `useWidgetSerializer` results into `w.props` during `grid.save()` */
  mergeWidgetPropsForSave(id: string, w: GridStackWidget): void;
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
}

export interface GridStackNode extends CoreGridStackNode {
  component?: string;
}

export interface GridStackOptions extends Omit<CoreGridStackOptions, "children" | "subGridOpts"> {
  children?: GridStackWidget[];
  subGridOpts?: GridStackOptions;
}

export interface GridHTMLElement extends CoreGridHTMLElement {
  _gridComp?: GridStackHostApi;
}

export interface GridItemHTMLElement extends CoreGridItemHTMLElement {
  _gridItemRef?: { id: string; gridComp: GridStackHostApi };
}
