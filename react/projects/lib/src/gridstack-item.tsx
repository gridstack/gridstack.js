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
import type { GridStack, GridStackNode } from "gridstack";
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

/** Recursively find a node by id across the grid and all nested sub-grids. */
function findNodeInGrid(g: GridStack, id: string): GridStackNode | undefined {
  const hit = g.engine.nodes.find((n) => String(n.id) === id) as GridStackNode | undefined;
  if (hit) return hit;
  for (const n of g.engine.nodes) {
    if (n.subGrid) {
      const nested = findNodeInGrid(n.subGrid as GridStack, id);
      if (nested) return nested;
    }
  }
  return undefined;
}

/**
 * Portal anchor for one grid item. Owns React subtree; survives cross-grid DnD while this component stays mounted.
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
    if (!registerWidgetSerializer) {
      return { id };
    }
    return {
      id,
      registerSerializer: (fn: () => Record<string, unknown> | undefined) =>
        registerWidgetSerializer(id, fn),
    };
  }, [id, registerWidgetSerializer]);

  useLayoutEffect(() => {
    if (!grid) return;

    const node = findNodeInGrid(grid, id);
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
    const syncContainer = () => {
      const node = findNodeInGrid(grid, id);
      const cont =
        (node?.el?.querySelector(
          ".grid-stack-item-content"
        ) as HTMLElement | null) ?? null;
      setContainer((prev) => (prev === cont ? prev : cont));
    };
    syncContainer();
  }, [grid, id, layoutVersion, optsKey]);

  // Tracks whether the component is "truly unmounting" vs. Strict Mode double-invoke.
  const remountedRef = useRef(false);

  useEffect(() => {
    if (!grid) return () => undefined;
    // In React 18 Strict Mode, useEffect is double-invoked: setup → cleanup → setup.
    // The cleanup fires even though the component immediately remounts, which would
    // incorrectly call removeWidget on still-live items.
    // Guard: reset the flag on each setup; the cleanup defers via microtask.
    // If setup re-runs before the microtask fires (Strict Mode), the flag is false
    // and the removal is skipped.  On a real unmount no setup re-runs, so it proceeds.
    remountedRef.current = false;
    return () => {
      remountedRef.current = true;
      Promise.resolve().then(() => {
        if (!remountedRef.current) return; // setup re-ran (Strict Mode) — cancel
        if (!grid.engine) return;
        const node = findNodeInGrid(grid, id);
        if (!node?.el || !node.grid) return;
        // Only remove if this item belongs to the outer grid; subgrid items are cleaned up by their own grid.
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

  // After the portal has been committed to the DOM, re-scan the item element for any
  // custom drag-handle elements that live inside the (now-rendered) React content.
  // This is a no-op for the default `.grid-stack-item-content` handle (always present),
  // but is essential when users configure a `draggable.handle` selector inside the portal.
  useEffect(() => {
    if (!grid || !container) return;
    const node = findNodeInGrid(grid, id);
    if (!node?.el) return;
    grid.refreshDragHandles(node.el);
  }, [grid, id, container]);

  if (!grid || !container || children == null) {
    return null;
  }

  return (
    <GridStackWidgetContext.Provider value={widgetCtx}>
      {createPortal(children, container)}
    </GridStackWidgetContext.Provider>
  );
}
