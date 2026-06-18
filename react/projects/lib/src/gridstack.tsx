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
import { GridStack, Utils } from "gridstack";
import type {
  GridStackDroppedHandler,
  GridStackElementHandler,
  GridStackNodesHandler,
} from "gridstack";
import { GridStackContext } from "./gridstack-context";
import { GridStackItem } from "./gridstack-item";
import { installGridStackReactCallbacks } from "./registry";
import type {
  GridStackHostApi,
  GridStackOptions,
  GridStackWidget,
  GridHTMLElement,
  GridItemHTMLElement,
} from "./types";
/** Maps `component` JSON keys to React components (props are merged from saved `props`). */
export type ComponentMap = Record<string, ComponentType<Record<string, unknown>>>;

export interface GridStackProps {
  options: GridStackOptions;
  /** Map `component` field in widget JSON to React components (recommended / component mode) */
  components?: ComponentMap;
  children?: ReactNode;
  /** Content to render when the grid has no items (mirrors Angular `[empty-content]`). */
  emptyContent?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onAdded?: (e: Event, nodes: Parameters<GridStackNodesHandler>[1]) => void;
  onChange?: (e: Event, nodes: Parameters<GridStackNodesHandler>[1]) => void;
  onRemoved?: (e: Event, nodes: Parameters<GridStackNodesHandler>[1]) => void;
  onEnable?: (e: Event) => void;
  onDisable?: (e: Event) => void;
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

export const GridStackComponent = forwardRef<GridStackHandle, GridStackProps>(
  function GridStackComponent(
    {
      options,
      components = {},
      children,
      emptyContent,
      className,
      style,
      onAdded,
      onChange,
      onRemoved,
      onEnable,
      onDisable,
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
    const [gridSession, setGridSession] = useState(0);
    const [isEmpty, setIsEmpty] = useState(false);

    // Ids scheduled for deferred removal — cancelled if the same id re-registers
    // within the same microtask (cross-grid DnD: remove fires before add).
    const pendingRemovalRef = useRef(new Set<string>());

    const serializersRef = useRef(new Map<string, () => Record<string, unknown> | undefined>());
    const deserializersRef = useRef(new Map<string, (data: Record<string, unknown>) => void>());

    const bumpLayout = useCallback(() => setLayoutVersion((v) => v + 1), []);

    const registerSyntheticItemId = useCallback((id: string) => {
      pendingRemovalRef.current.delete(id); // cancel deferred removal for cross-grid DnD
      setSyntheticIds((prev) => {
        if (prev.has(id)) return prev;
        const n = new Set(prev);
        n.add(id);
        return n;
      });
    }, []);

    const unregisterSyntheticItemId = useCallback((id: string) => {
      // Defer by one microtask — if registerSyntheticItemId fires in the same sync block
      // (cross-grid DnD), it cancels this removal and the React subtree never unmounts.
      pendingRemovalRef.current.add(id);
      Promise.resolve().then(() => {
        if (!pendingRemovalRef.current.has(id)) return;
        pendingRemovalRef.current.delete(id);
        setSyntheticIds((prev) => {
          if (!prev.has(id)) return prev;
          const n = new Set(prev);
          n.delete(id);
          return n;
        });
        serializersRef.current.delete(id);
        deserializersRef.current.delete(id);
      });
    }, []);

    const registerWidgetSerializer = useCallback(
      (
        id: string,
        serialize: () => Record<string, unknown> | undefined,
        deserialize?: (data: Record<string, unknown>) => void
      ) => {
        serializersRef.current.set(id, serialize);
        if (deserialize) deserializersRef.current.set(id, deserialize);
        return () => {
          serializersRef.current.delete(id);
          deserializersRef.current.delete(id);
        };
      },
      []
    );

    const mergeWidgetPropsForSave = useCallback((id: string, w: GridStackWidget) => {
      const extra = serializersRef.current.get(id)?.();
      if (extra) w.props = { ...(w.props ?? {}), ...extra };
    }, []);

    const deserializeWidget = useCallback((id: string, w: GridStackWidget) => {
      if (w.props) deserializersRef.current.get(id)?.(w.props);
    }, []);

    // Stable callbacks ref — updated every render so the hostApi always calls fresh closures
    // without the hostApi object itself ever changing identity.
    const callbacksRef = useRef({
      registerSyntheticItemId,
      unregisterSyntheticItemId,
      bumpLayout,
      registerWidgetSerializer,
      mergeWidgetPropsForSave,
      deserializeWidget,
    });
    callbacksRef.current.registerSyntheticItemId = registerSyntheticItemId;
    callbacksRef.current.unregisterSyntheticItemId = unregisterSyntheticItemId;
    callbacksRef.current.bumpLayout = bumpLayout;
    callbacksRef.current.registerWidgetSerializer = registerWidgetSerializer;
    callbacksRef.current.mergeWidgetPropsForSave = mergeWidgetPropsForSave;
    callbacksRef.current.deserializeWidget = deserializeWidget;

    // Created once — delegates to callbacksRef so all callers always get fresh closures.
    const hostApiRef = useRef<GridStackHostApi>({
      registerSyntheticItemId: (id) => callbacksRef.current.registerSyntheticItemId(id),
      unregisterSyntheticItemId: (id) => callbacksRef.current.unregisterSyntheticItemId(id),
      requestUpdate: () => callbacksRef.current.bumpLayout(),
      registerWidgetSerializer: (id, serialize, deserialize) =>
        callbacksRef.current.registerWidgetSerializer(id, serialize, deserialize),
      mergeWidgetPropsForSave: (id, w) => callbacksRef.current.mergeWidgetPropsForSave(id, w),
      deserializeWidget: (id, w) => callbacksRef.current.deserializeWidget(id, w),
    });

    useLayoutEffect(() => {
      installGridStackReactCallbacks();
    }, []);

    const optsSig = optionsSignature(options);
    const prevOptsSig = useRef<string | null>(null);

    // Grid init — runs once on mount, tears down on unmount.
    // Splitting init from the options-update effect prevents destroying + recreating the grid
    // when the caller passes a new options object reference with the same content.
    useLayoutEffect(() => {
      const el = rootRef.current as GridHTMLElement | null;
      if (!el) return;

      el._gridComp = hostApiRef.current;

      const itemClass =
        (options as Record<string, unknown>).itemClass as string | undefined ??
        "grid-stack-item";
      // Remove orphaned items left by a prior destroy(false) / StrictMode cycle.
      Array.from(el.children).forEach((child) => {
        if (
          child.classList.contains(itemClass) &&
          !(child as GridItemHTMLElement).gridstackNode
        ) {
          child.remove();
        }
      });

      gridRef.current = GridStack.init(options, el); // eslint-disable-line react-hooks/exhaustive-deps
      prevOptsSig.current = optsSig;
      setLayoutVersion((v) => v + 1);
      setGridSession((s) => s + 1);
      setIsEmpty(!gridRef.current.engine.nodes.length);

      return () => {
        delete el._gridComp;
        gridRef.current?.destroy(false);
        gridRef.current = null;
        prevOptsSig.current = null;
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps — intentionally init once

    // Options update — calls GS updateOptions when content changes without recreating the grid.
    useLayoutEffect(() => {
      if (!gridRef.current || prevOptsSig.current === null || prevOptsSig.current === optsSig)
        return;
      gridRef.current.updateOptions(options); // eslint-disable-line react-hooks/exhaustive-deps
      prevOptsSig.current = optsSig;
    }, [optsSig]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      const g = gridRef.current;
      if (!g) return;

      const addedHandler: GridStackNodesHandler = (e, nodes) => {
        bumpLayout();
        setIsEmpty(false);
        onAdded?.(e, nodes);
      };
      g.on("added", addedHandler);

      // change = position/size update; portal containers are unaffected so no layoutVersion bump.
      const changeHandler: GridStackNodesHandler = (e, nodes) => {
        onChange?.(e, nodes);
      };
      g.on("change", changeHandler);

      const removedHandler: GridStackNodesHandler = (e, nodes) => {
        bumpLayout();
        setIsEmpty(!g.engine.nodes.length);
        onRemoved?.(e, nodes);
      };
      g.on("removed", removedHandler);

      if (onEnable) g.on("enable", onEnable);
      if (onDisable) g.on("disable", onDisable);
      if (onDrag) g.on("drag", onDrag);
      if (onDragStart) g.on("dragstart", onDragStart);
      if (onDragStop) g.on("dragstop", onDragStop);
      if (onDropped) g.on("dropped", onDropped);
      if (onResize) g.on("resize", onResize);
      if (onResizeStart) g.on("resizestart", onResizeStart);
      if (onResizeStop) g.on("resizestop", onResizeStop);

      return () => {
        g.off("added");
        g.off("change");
        g.off("removed");
        if (onEnable) g.off("enable");
        if (onDisable) g.off("disable");
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
      onEnable,
      onDisable,
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
        const node = Utils.findInGrid(g, synId, true) as GridStackWidget | undefined;
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
          {isEmpty && emptyContent}
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
