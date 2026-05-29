import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ComponentType, ReactNode } from "react";
import { GridStack } from "gridstack";
import type {
  GridStackDroppedHandler,
  GridStackElementHandler,
  GridStackNodesHandler,
} from "gridstack";
import { GridStackContext } from "./gridstack-context";
import { GridStackItem } from "./gridstack-item";
import { installGridStackReactCallbacks } from "./registry";
import type { GridStackHostApi, GridStackOptions, GridStackWidget, GridHTMLElement, GridItemHTMLElement } from "./types";

/** Maps `component` JSON keys to React components (props are merged from saved `props`). */
export type ComponentMap = Record<string, ComponentType<Record<string, unknown>>>;

export interface GridStackProps {
  options: GridStackOptions;
  /** Map `component` field in widget JSON to React components (recommended / component mode) */
  components?: ComponentMap;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onAdded?: (e: Event, nodes: Parameters<GridStackNodesHandler>[1]) => void;
  onChange?: (e: Event, nodes: Parameters<GridStackNodesHandler>[1]) => void;
  onRemoved?: (e: Event, nodes: Parameters<GridStackNodesHandler>[1]) => void;
  onDrag?: GridStackElementHandler;
  onDragStart?: GridStackElementHandler;
  onDragStop?: GridStackElementHandler;
  onDropped?: GridStackDroppedHandler;
  onResize?: GridStackElementHandler;
  onResizeStart?: GridStackElementHandler;
  onResizeStop?: GridStackElementHandler;
}

export interface GridStackHandle {
  getGrid: () => GridStack | null;
}

function optionsSignature(o: GridStackOptions): string {
  try {
    return JSON.stringify(o);
  } catch {
    return String(o);
  }
}

/** Recursively find a node by id across the grid and all nested sub-grids. */
function findNodeInGrid(g: GridStack, id: string): GridStackWidget | undefined {
  const hit = g.engine.nodes.find((n) => String(n.id) === id) as GridStackWidget | undefined;
  if (hit) return hit;
  for (const n of g.engine.nodes) {
    if (n.subGrid) {
      const nested = findNodeInGrid(n.subGrid as GridStack, id);
      if (nested) return nested;
    }
  }
  return undefined;
}

export const GridStackComponent = forwardRef<GridStackHandle, GridStackProps>(
  function GridStackComponent(
    {
      options,
      components = {},
      children,
      className,
      style,
      onAdded,
      onChange,
      onRemoved,
      onDrag,
      onDragStart,
      onDragStop,
      onDropped,
      onResize,
      onResizeStart,
      onResizeStop,
    },
    ref
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<GridStack | null>(null);
    const [syntheticIds, setSyntheticIds] = useState<Set<string>>(() => new Set());
    const [layoutVersion, setLayoutVersion] = useState(0);
    /** Bumps only when a new `GridStack` instance is created (not on every layout change). */
    const [gridSession, setGridSession] = useState(0);
    const serializersRef = useRef(
      new Map<string, () => Record<string, unknown> | undefined>()
    );

    const bumpLayout = useCallback(() => {
      setLayoutVersion((v) => v + 1);
    }, []);

    const registerSyntheticItemId = useCallback((id: string) => {
      setSyntheticIds((prev) => {
        const n = new Set(prev);
        n.add(id);
        return n;
      });
    }, []);

    const unregisterSyntheticItemId = useCallback((id: string) => {
      setSyntheticIds((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
      serializersRef.current.delete(id);
    }, []);

    const registerWidgetSerializer = useCallback(
      (id: string, fn: () => Record<string, unknown> | undefined) => {
        serializersRef.current.set(id, fn);
        return () => {
          serializersRef.current.delete(id);
        };
      },
      []
    );

    const mergeWidgetPropsForSave = useCallback((id: string, w: GridStackWidget) => {
      const fn = serializersRef.current.get(id);
      const extra = fn?.();
      if (extra) w.props = { ...(w.props ?? {}), ...extra };
    }, []);

    const hostApiRef = useRef<GridStackHostApi | null>(null);
    if (!hostApiRef.current) {
      hostApiRef.current = {
        registerSyntheticItemId,
        unregisterSyntheticItemId,
        requestUpdate: bumpLayout,
        registerWidgetSerializer,
        mergeWidgetPropsForSave,
      };
    } else {
      const h = hostApiRef.current;
      h.registerSyntheticItemId = registerSyntheticItemId;
      h.unregisterSyntheticItemId = unregisterSyntheticItemId;
      h.requestUpdate = bumpLayout;
      h.registerWidgetSerializer = registerWidgetSerializer;
      h.mergeWidgetPropsForSave = mergeWidgetPropsForSave;
    }

    useLayoutEffect(() => {
      installGridStackReactCallbacks();
    }, []);

    const optsSig = optionsSignature(options);
    const prevOptsSig = useRef<string | null>(null);

    useLayoutEffect(() => {
      const el = rootRef.current as GridHTMLElement | null;
      if (!el) return;

      const host = hostApiRef.current;
      if (!host) return;
      el._gridComp = host;

      if (!gridRef.current) {
        // Remove orphaned .grid-stack-item children left by a previous destroy(false).
        // In React 18 StrictMode the useLayoutEffect cleanup+setup cycle runs before
        // useEffect cleanup, so orphans can accumulate. Clearing them before init
        // prevents the auto-scan (opts.auto) from re-registering stale elements.
        const itemClass = (options as Record<string, unknown>).itemClass as string | undefined ?? 'grid-stack-item';
        Array.from(el.children).forEach(child => {
          if (child.classList.contains(itemClass) && !(child as GridItemHTMLElement).gridstackNode) {
            child.remove();
          }
        });
        gridRef.current = GridStack.init(options, el);
        prevOptsSig.current = optsSig;
        setLayoutVersion((v) => v + 1);
        setGridSession((s) => s + 1);
      } else if (prevOptsSig.current !== optsSig) {
        gridRef.current.updateOptions(options);
        prevOptsSig.current = optsSig;
        setLayoutVersion((v) => v + 1);
      }

      return () => {
        delete el._gridComp;
        // Destroy the grid in the same phase (useLayoutEffect) so that StrictMode's
        // cleanup+remount cycle fully tears down and rebuilds the grid before any
        // useEffect cleanup can run.  This prevents useEffect cleanup from destroying
        // a grid that was just freshly created by the remount's useLayoutEffect setup.
        gridRef.current?.destroy(false);
        gridRef.current = null;
        prevOptsSig.current = null;
      };
    }, [options, optsSig]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      const g = gridRef.current;
      if (!g) return;

      const addedHandler: GridStackNodesHandler = (e, nodes) => {
        bumpLayout();
        onAdded?.(e, nodes);
      };
      g.on("added", addedHandler);

      const changeHandler: GridStackNodesHandler = (e, nodes) => {
        bumpLayout();
        onChange?.(e, nodes);
      };
      g.on("change", changeHandler);

      const removedHandler: GridStackNodesHandler = (e, nodes) => {
        bumpLayout();
        onRemoved?.(e, nodes);
      };
      g.on("removed", removedHandler);
      if (onDrag) {
        g.on("drag", onDrag);
      }
      if (onDragStart) {
        g.on("dragstart", onDragStart);
      }
      if (onDragStop) {
        g.on("dragstop", onDragStop);
      }
      if (onDropped) {
        g.on("dropped", onDropped);
      }
      if (onResize) {
        g.on("resize", onResize);
      }
      if (onResizeStart) {
        g.on("resizestart", onResizeStart);
      }
      if (onResizeStop) {
        g.on("resizestop", onResizeStop);
      }

      return () => {
        g.off("added");
        g.off("change");
        g.off("removed");
        if (onDrag) g.off("drag");
        if (onDragStart) g.off("dragstart");
        if (onDragStop) g.off("dragstop");
        if (onDropped) g.off("dropped");
        if (onResize) g.off("resize");
        if (onResizeStart) g.off("resizestart");
        if (onResizeStop) g.off("resizestop");
      };
    }, [
      gridSession,
      bumpLayout,
      onAdded,
      onChange,
      onRemoved,
      onDrag,
      onDragStart,
      onDragStop,
      onDropped,
      onResize,
      onResizeStart,
      onResizeStop,
    ]);

    useImperativeHandle(ref, () => ({
      getGrid: () => gridRef.current,
    }));

    const ctxValue = useMemo(
      () => ({
        grid: gridRef.current,
        layoutVersion,
        registerWidgetSerializer,
      }),
      [layoutVersion, registerWidgetSerializer]
    );

    const syntheticItems = useMemo(() => {
      const g = gridRef.current;
      if (!g || syntheticIds.size === 0) return null;
      return Array.from(syntheticIds).map((synId) => {
        const node = findNodeInGrid(g, synId);
        if (!node?.component) return null;
        const Comp = components[node.component];
        if (!Comp) return null;
        const props = (node.props ?? {}) as Record<string, unknown>;
        return (
          <GridStackItem key={`__gs_syn__${synId}`} id={synId} options={node}>
            <Comp {...props} />
          </GridStackItem>
        );
      });
    }, [syntheticIds, components, layoutVersion]);

    const rootClass =
      className != null && className.includes("grid-stack")
        ? className
        : ["grid-stack", className].filter(Boolean).join(" ");

    return (
      <GridStackContext.Provider value={ctxValue}>
        <>
          <div ref={rootRef} className={rootClass} style={style}>
            {syntheticItems}
          </div>
          {children}
        </>
      </GridStackContext.Provider>
    );
  }
);

export { GridStackComponent as GridStack };
