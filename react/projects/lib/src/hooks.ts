import { useContext, useEffect, useMemo, useRef } from "react";
import { Utils } from "gridstack";
import type { GridStackNode } from "gridstack";
import { GridStackContext } from "./gridstack-context";
import { GridStackWidgetContext } from "./gridstack-widget-context";
import type { GridStackWidget } from "./types";

export interface UseWidgetSerializerOptions<T extends Record<string, unknown>> {
  serialize?: () => T | undefined;
  deserialize?: (data: T) => void;
}

/**
 * Registers serialize/deserialize for a widget component.
 * `serialize` is called during `grid.save()`; `deserialize` is called when GS
 * updates the node (e.g. after `grid.load()` or `updateCB`).
 */
export function useWidgetSerializer<T extends Record<string, unknown>>(
  _opts: UseWidgetSerializerOptions<T>
): void {
  const ctx = useContext(GridStackWidgetContext);
  const optsRef = useRef(_opts);
  optsRef.current = _opts;

  useEffect(() => {
    if (!ctx?.registerSerializer) return;
    return ctx.registerSerializer(
      () => optsRef.current.serialize?.() as Record<string, unknown> | undefined,
      (data) => optsRef.current.deserialize?.(data as T)
    );
  }, [ctx]);
}

export function useGridStack() {
  const ctx = useContext(GridStackContext);
  if (!ctx) {
    throw new Error("useGridStack must be used within <GridStack>");
  }
  const { grid, layoutVersion, registerWidgetSerializer } = ctx;
  return useMemo(
    () => ({
      grid,
      layoutVersion,
      registerWidgetSerializer,
      addWidget: (w: GridStackWidget) =>
        grid?.addWidget(
          w as Parameters<NonNullable<typeof grid>["addWidget"]>[0]
        ),
      removeWidget: (
        el: Parameters<NonNullable<typeof grid>["removeWidget"]>[0],
        removeDOM?: boolean,
        triggerEvent?: boolean
      ) => grid?.removeWidget(el, removeDOM, triggerEvent),
      removeAll: (removeDOM = true) => grid?.removeAll(removeDOM),
      save: (saveContent = true, saveGridOpt = false) =>
        grid?.save(saveContent, saveGridOpt),
    }),
    [grid, layoutVersion, registerWidgetSerializer]
  );
}

export type UseGridStackItemResult = {
  id: string;
  node: GridStackNode | undefined;
};

export function useGridStackItem(): UseGridStackItemResult {
  const wctx = useContext(GridStackWidgetContext);
  const ctx = useContext(GridStackContext);
  if (!wctx?.id) {
    throw new Error("useGridStackItem must be used inside <GridStackItem> content");
  }
  if (!ctx) {
    throw new Error("useGridStackItem must be used within <GridStack>");
  }
  const { grid, layoutVersion } = ctx;
  // Use recursive search so items dragged to sub-grids are still found.
  const node = useMemo(
    () => (grid ? Utils.findInGrid(grid, String(wctx.id), true) : undefined),
    [grid, wctx.id, layoutVersion]
  );
  return { id: wctx.id, node };
}
