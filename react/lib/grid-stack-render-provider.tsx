import {
  PropsWithChildren,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { useGridStackContext } from "./grid-stack-context";
import { GridStack, GridStackOptions, GridStackWidget } from "gridstack";
import { GridStackRenderContext } from "./grid-stack-render-context";
import isEqual from "react-fast-compare";

export function GridStackRenderProvider({ children }: PropsWithChildren) {
  const {
    _gridStack: { value: gridStack, set: setGridStack },
    initialOptions,
  } = useGridStackContext();

  const widgetContainersRef = useRef<Map<string, HTMLElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<GridStackOptions>(initialOptions);

  const renderCBFn = useCallback(
    (element: HTMLElement, widget: GridStackWidget) => {
      if (widget.id) {
        widgetContainersRef.current.set(widget.id, element);
      }
    },
    []
  );

  const initGrid = useCallback(() => {
    if (containerRef.current) {
      GridStack.renderCB = renderCBFn;
      return GridStack.init(optionsRef.current, containerRef.current);
      // ! Change event not firing on nested grids (resize, move...) https://github.com/gridstack/gridstack.js/issues/2671
      // .on("change", () => {
      //   console.log("changed");
      // })
      // .on("resize", () => {
      //   console.log("resize");
      // })
    }
    return null;
  }, [renderCBFn]);

  useLayoutEffect(() => {
    if (!isEqual(initialOptions, optionsRef.current) && gridStack) {
      try {
        gridStack.removeAll(false);
        gridStack.destroy(false);
        widgetContainersRef.current.clear();
        optionsRef.current = initialOptions;
        setGridStack(initGrid());
      } catch (e) {
        console.error("Error reinitializing gridstack", e);
      }
    }
  }, [initialOptions, gridStack, initGrid, setGridStack]);

  useLayoutEffect(() => {
    if (!gridStack) {
      try {
        setGridStack(initGrid());
      } catch (e) {
        console.error("Error initializing gridstack", e);
      }
    }
  }, [gridStack, initGrid, setGridStack]);

  return (
    <GridStackRenderContext.Provider
      value={useMemo(
        () => ({
          getWidgetContainer: (widgetId: string) => {
            return widgetContainersRef.current.get(widgetId) || null;
          },
        }),
        // ! gridStack is required to reinitialize the grid when the options change
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [gridStack]
      )}
    >
      <div ref={containerRef}>{gridStack ? children : null}</div>
    </GridStackRenderContext.Provider>
  );
}
