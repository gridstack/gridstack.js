/**
 * Static GridStack callbacks for React — same pattern as Angular gsCreateNgComponents.
 * Dispatches via DOM `_gridComp` / `_gridItemRef` back-refs (no closure over per-grid state).
 */
import { GridStack, Utils } from "gridstack";
import type { GridStackNode, GridStackWidget as CoreGridStackWidget } from "gridstack";
import type {
  GridHTMLElement,
  GridItemHTMLElement,
  GridStackWidget,
} from "./types";

export function installGridStackReactCallbacks(): void {
  if (!GridStack.addRemoveCB) {
    GridStack.addRemoveCB = gsCreateReactComponents;
  }
  if (!GridStack.saveCB) {
    GridStack.saveCB = gsSaveAdditionalReactInfo;
  }
  if (!GridStack.updateCB) {
    GridStack.updateCB = gsUpdateReactComponents;
  }
}

/** @internal Walk up from `el` to find the nearest `_gridComp` back-ref. */
function nearestGridComp(el: HTMLElement | null): GridHTMLElement["_gridComp"] | undefined {
  let node: HTMLElement | null = el;
  while (node) {
    const comp = (node as GridHTMLElement)._gridComp;
    if (comp) return comp;
    node = node.parentElement;
  }
  return undefined;
}

/** @internal */
export function gsCreateReactComponents(
  parent: HTMLElement,
  w: CoreGridStackWidget,
  add: boolean,
  isGrid: boolean
): HTMLElement | undefined {
  if (add) {
    if (isGrid) {
      const opt = w as GridStackWidget;
      const classes = ["grid-stack"];
      if (opt.class) classes.push(...String(opt.class).split(" ").filter(Boolean));
      const el = Utils.createDiv(classes) as GridHTMLElement;
      // Inherit the host's _gridComp so nested-grid children can register portals.
      const inherited = nearestGridComp(parent);
      if (inherited) el._gridComp = inherited;
      // Must append to parent — mirrors what Utils.createDiv(classes, parent) does in the
      // non-React code path (gridstack.ts addGrid) so the subgrid is in the DOM.
      parent?.appendChild(el);
      return el;
    }

    const gridHost = (parent as GridHTMLElement)._gridComp;
    if (!gridHost) return undefined;

    const opt = w as GridStackWidget;
    const itemClasses = ["grid-stack-item"];
    if (opt.class) itemClasses.push(...String(opt.class).split(" ").filter(Boolean));
    const el = Utils.createDiv(itemClasses) as GridItemHTMLElement;
    Utils.createDiv(["grid-stack-item-content"], el);

    const id = opt.id != null ? String(opt.id) : undefined;
    if (id) {
      el._gridItemRef = { id, gridComp: gridHost };
      if (opt.component) gridHost.registerSyntheticItemId(id);
    }
    if (opt.content != null && opt.content !== "") {
      const content = el.querySelector(".grid-stack-item-content") as HTMLElement;
      if (content) content.textContent = String(opt.content);
    }
    return el;
  }

  const el = (w as GridStackWidget).el as GridItemHTMLElement | undefined;
  if (el?._gridItemRef) {
    const { id, gridComp } = el._gridItemRef;
    gridComp.unregisterSyntheticItemId(id);
    delete el._gridItemRef;
  }
  el?.remove();
  return undefined;
}

export function gsSaveAdditionalReactInfo(
  node: GridStackNode,
  w: CoreGridStackWidget
): void {
  const n = node as GridStackNode & { component?: string; props?: Record<string, unknown> };
  const out = w as GridStackWidget;
  if (n.component != null) out.component = n.component;
  if (n.props != null) out.props = { ...n.props };
  // Strip runtime-only fields that must never appear in serialized output.
  delete (out as Record<string, unknown>).visibleObservable;
  const el = node.el as GridItemHTMLElement | undefined;
  const id = n.id != null ? String(n.id) : undefined;
  if (id && el?._gridItemRef?.gridComp?.mergeWidgetPropsForSave) {
    el._gridItemRef.gridComp.mergeWidgetPropsForSave(id, out);
  }
}

export function gsUpdateReactComponents(node: GridStackNode): void {
  const el = node.el as GridItemHTMLElement | undefined;
  el?._gridItemRef?.gridComp?.requestUpdate?.();
}
