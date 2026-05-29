import type { GridStack, GridStackOptions, GridStackWidget } from "gridstack";
import { createContext, useContext } from "react";

export const GridStackContext = createContext<{
  initialOptions: GridStackOptions;
  gridStack: GridStack | null;
  addWidget: (widget: GridStackWidget & { id: Required<GridStackWidget>["id"] }) => void;
  removeWidget: (id: string) => void;
  addSubGrid: (
    subGrid: GridStackWidget & { 
      id: Required<GridStackWidget>["id"]; 
      subGridOpts: Required<GridStackWidget>["subGridOpts"] & { 
        children: Array<GridStackWidget & { id: Required<GridStackWidget>["id"] }> 
      } 
    }
  ) => void;
  saveOptions: () => GridStackOptions | GridStackWidget[] | undefined;
  removeAll: () => void;

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
