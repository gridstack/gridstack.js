import {
  ComponentProps,
  PropsWithChildren,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import { useGridStackContext } from "./grid-stack-context";
import { GridStack, GridStackOptions } from "gridstack";
import { GridStackRenderContext } from "./grid-stack-render-context";
import { widgetContainers } from "./global";

export type GridStackRenderProps = PropsWithChildren<ComponentProps<"div">>;

export function GridStackRender({ children, ...props }: GridStackRenderProps) {
  const {
    _gridStack: { value: gridStack, set: setGridStack },
    initialOptions,
  } = useGridStackContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<GridStackOptions>(initialOptions);

  const initGrid = useCallback(() => {
    if (containerRef.current) {
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

  const getContainerByWidgetId = useCallback((widgetId: string) => {
    return (
      widgetContainers.find((container) => container.initWidget.id === widgetId)
        ?.element || null
    );
  }, []);

  return (
    <GridStackRenderContext.Provider value={{ getContainerByWidgetId }}>
      <div ref={containerRef} {...props}>
        {gridStack ? children : null}
      </div>
    </GridStackRenderContext.Provider>
  );
}
