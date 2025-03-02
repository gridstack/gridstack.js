import { createContext, useContext } from "react";

export type GridStackRenderContextType = {
  getContainerByWidgetId: (widgetId: string) => HTMLElement | null;
};

export const GridStackRenderContext = createContext<GridStackRenderContextType>(
  {
    getContainerByWidgetId: () => {
      console.error("getContainerByWidgetId not implemented");
      return null;
    },
  }
);

export function useGridStackRenderContext() {
  const context = useContext(GridStackRenderContext);
  if (!context) {
    throw new Error(
      "useGridStackRenderContext must be used within a GridStackProvider"
    );
  }
  return context;
}
