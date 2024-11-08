import { GridStack, GridStackWidget,GridStackOptions } from 'gridstack';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import isEqual from 'react-fast-compare';

type GridStackContextType = {
  getWidgetContent: (widgetId: string) => HTMLElement | null;
};

interface GridstackProviderProps extends PropsWithChildren {
  options: GridStackOptions;
}

export const GridstackContext = createContext<GridStackContextType | null>(null);

export const GridstackProvider = ({ children, options }: GridstackProviderProps) => {
  const widgetContentRef = useRef<Record<string, HTMLElement>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<GridStackOptions>(options);

  const [parentGrid, setParentGrid] = useState<GridStack | null>(null);

  const renderCBFn = useCallback((element: HTMLElement, widget: GridStackWidget) => {
    if (widget.id) {
      widgetContentRef.current[widget.id] = element;
    }
  }, []);

  const getWidgetContent = useCallback((widgetId: string) => {
    return widgetContentRef.current[widgetId] || null;
  }, []);

  const initGrid = useCallback(() => {
    if (containerRef.current) {
      GridStack.renderCB = renderCBFn;
      return GridStack.init(optionsRef.current, containerRef.current);
    }
    return null;
  }, [renderCBFn]);

  useLayoutEffect(() => {
    if (!isEqual(options, optionsRef.current) && parentGrid) {
      try {
        parentGrid.removeAll(false);
        parentGrid.destroy(false);
        widgetContentRef.current = {};
        optionsRef.current = options;

        setParentGrid(initGrid());
      } catch (e) {
        console.error("Error reinitializing gridstack", e);
      }
    }
  }, [options, parentGrid, initGrid]);

  useLayoutEffect(() => {
    if (!parentGrid) {
      try {
        setParentGrid(initGrid());
      } catch (e) {
        console.error("Error initializing gridstack", e);
      }
    }
  }, [parentGrid, initGrid]);

  const value = useMemo(
    () => ({
      getWidgetContent,
    }),
    // parentGrid is required to reinitialize the grid when the options change
    [getWidgetContent, parentGrid],
  );

  return (
    <GridstackContext.Provider value={value}>
      <div ref={containerRef}>{parentGrid ? children : null}</div>
    </GridstackContext.Provider>
  );
};