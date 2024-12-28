import type { GridStack, GridStackOptions, GridStackWidget } from "gridstack";
import { createContext, useContext } from "react";

export const GridStackContext = createContext<{
  initialOptions: GridStackOptions;
  gridStack: GridStack | null;
  addWidget: (fn: (id: string) => Omit<GridStackWidget, "id">) => void;
  removeWidget: (id: string) => void;
  addSubGrid: (
    fn: (
      id: string,
      withWidget: (w: Omit<GridStackWidget, "id">) => GridStackWidget
    ) => Omit<GridStackWidget, "id">
  ) => void;
  saveOptions: () => GridStackOptions | GridStackWidget[] | undefined;

  _gridStack: {
    value: GridStack | null;
    set: React.Dispatch<React.SetStateAction<GridStack | null>>;
  };
  _rawWidgetMetaMap: {
    value: Map<string, GridStackWidget>;
    set: React.Dispatch<React.SetStateAction<Map<string, GridStackWidget>>>;
  };
} | null>(null);

export function useGridStackContext() {
  const context = useContext(GridStackContext);
  if (!context) {
    throw new Error(
      "useGridStackContext must be used within a GridStackProvider"
    );
  }
  return context;
}
