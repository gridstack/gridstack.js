import { PropsWithChildren, useCallback, useLayoutEffect, useRef } from "react";
import { useGridStackContext } from "./grid-stack-context";
import { GridStack, GridStackOptions, GridStackWidget } from "gridstack";
import { GridStackRenderContext } from "./grid-stack-render-context";

export type GridStackRenderProps = PropsWithChildren;

export function GridStackRender({ children }: GridStackRenderProps) {
  const {
    _gridStack: { value: gridStack, set: setGridStack },
    initialOptions,
  } = useGridStackContext();

  const widgetContainersRef = useRef<Map<string, HTMLElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<GridStackOptions>(initialOptions);

  const initGrid = useCallback(() => {
    if (containerRef.current) {
      GridStack.renderCB = (element: HTMLElement, widget: GridStackWidget) => {
        if (widget.id) {
          widgetContainersRef.current.set(widget.id, element);
        }
      };
      return GridStack.init(optionsRef.current, containerRef.current);
    }
    return null;
  }, []);

  useLayoutEffect(() => {
    if (!gridStack) {
      try {
        setGridStack(initGrid());
      } catch (e) {
        console.error("Error initializing gridstack", e);
      }
    }
  }, [gridStack, initGrid, setGridStack]);

  const getWidgetContainer = useCallback((widgetId: string) => {
    return widgetContainersRef.current.get(widgetId) || null;
  }, []);

  return (
    <GridStackRenderContext.Provider value={{ getWidgetContainer }}>
      <div ref={containerRef}>{gridStack ? children : null}</div>
    </GridStackRenderContext.Provider>
  );
}
