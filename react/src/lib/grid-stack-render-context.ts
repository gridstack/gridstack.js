import { createContext, useContext } from "react";

export type GridStackRenderContextType = {
  getWidgetContainer: (widgetId: string) => HTMLElement | null;
};

export const GridStackRenderContext = createContext<GridStackRenderContextType>(
  {
    getWidgetContainer: () => {
      console.error("getWidgetContainer not implemented");
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
