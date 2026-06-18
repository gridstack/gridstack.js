import {
  useContext,
  useLayoutEffect,
  useMemo,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";
import { Utils } from "gridstack";
import { GridStackContext } from "./gridstack-context";
import { GridStackWidgetContext } from "./gridstack-widget-context";
import type { GridStackWidget } from "./types";

export interface GridStackItemProps {
  id: string;
  options?: Partial<GridStackWidget>;
  children?: React.ReactNode;
}

function stableOptsKey(options: Partial<GridStackWidget> | undefined): string {
  if (!options || Object.keys(options).length === 0) return "";
  try {
    return JSON.stringify(options);
  } catch {
    return String(options);
  }
}

/**
 * Portal anchor for one grid item. Owns the React subtree; survives cross-grid DnD
 * because the component stays mounted and the portal re-points to the new container.
 */
export function GridStackItem({
  id,
  options = {},
  children,
}: GridStackItemProps): ReactElement | null {
  const ctx = useContext(GridStackContext);
  const grid = ctx?.grid ?? null;
  const layoutVersion = ctx?.layoutVersion ?? 0;
  const registerWidgetSerializer = ctx?.registerWidgetSerializer;
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const optsKey = stableOptsKey(options);

  const widgetCtx = useMemo(() => {
    if (!registerWidgetSerializer) return { id };
    return {
      id,
      registerSerializer: (
        serialize: () => Record<string, unknown> | undefined,
        deserialize?: (data: Record<string, unknown>) => void
      ) => registerWidgetSerializer(id, serialize, deserialize),
    };
  }, [id, registerWidgetSerializer]);

  useLayoutEffect(() => {
    if (!grid) return;

    const node = Utils.findInGrid(grid, id, true);
    if (!node?.el) {
      // Item not yet in any grid — add it to the outer grid.
      grid.addWidget({ ...options, id } as GridStackWidget);
    } else if (node.grid === grid) {
      // Top-level item already exists — just update position/opts.
      grid.update(node.el, { ...options, id } as GridStackWidget);
    }
    // Subgrid items (node.grid !== grid) are owned by their sub-GridStack; no action needed.
  }, [grid, id, optsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    if (!grid) return;
    const node = Utils.findInGrid(grid, id, true);
    const cont =
      (node?.el?.querySelector(".grid-stack-item-content") as HTMLElement | null) ?? null;
    setContainer((prev) => (prev === cont ? prev : cont));
  }, [grid, id, layoutVersion, optsKey]);

  // Tracks whether the component is "truly unmounting" vs. Strict Mode double-invoke.
  const remountedRef = useRef(false);

  useEffect(() => {
    if (!grid) return () => undefined;
    remountedRef.current = false;
    return () => {
      remountedRef.current = true;
      Promise.resolve().then(() => {
        if (!remountedRef.current) return; // setup re-ran (Strict Mode) — cancel
        if (!grid.engine) return;
        const node = Utils.findInGrid(grid, id, true);
        if (!node?.el || !node.grid) return;
        // Only remove if this item belongs to the outer grid; subgrid items are cleaned up
        // by their own grid when that grid is destroyed.
        if (node.grid === grid) {
          try {
            grid.removeWidget(node.el, false);
          } catch {
            /* already removed */
          }
        }
      });
    };
  }, [grid, id]);

  // Re-scan for custom drag-handle elements after the portal content is committed.
  useEffect(() => {
    if (!grid || !container) return;
    const node = Utils.findInGrid(grid, id, true);
    if (!node?.el) return;
    grid.refreshDragHandles(node.el);
  }, [grid, id, container]);

  if (!grid || !container || children == null) return null;

  return (
    <GridStackWidgetContext.Provider value={widgetCtx}>
      {createPortal(children, container)}
    </GridStackWidgetContext.Provider>
  );
}
