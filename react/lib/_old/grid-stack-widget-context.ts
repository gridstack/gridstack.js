import { createContext, useContext } from "react";

// TODO: support full widget metadata
export const GridStackWidgetContext = createContext<{
  widget: {
    id: string;
  };
} | null>(null);

export function useGridStackWidgetContext() {
  const context = useContext(GridStackWidgetContext);
  if (!context) {
    throw new Error(
      "useGridStackWidgetContext must be used within a GridStackWidgetProvider"
    );
  }
  return context;
}
