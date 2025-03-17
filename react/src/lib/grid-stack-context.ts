import type {
  GridStack,
  GridStackElement,
  GridStackOptions,
  GridStackWidget,
} from "gridstack";
import { createContext, useContext } from "react";

export interface GridStackContextType {
  initialOptions: GridStackOptions;
  addWidget: (widget: GridStackWidget) => void;
  removeWidget: (el: GridStackElement) => void;
  saveOptions: () => ReturnType<GridStack["save"]> | undefined;

  _gridStack: {
    value: GridStack | null;
    set: React.Dispatch<React.SetStateAction<GridStack | null>>;
  };
}

export const GridStackContext = createContext<GridStackContextType | null>(
  null
);

export function useGridStackContext() {
  const context = useContext(GridStackContext);
  if (!context) {
    throw new Error(
      "useGridStackContext must be used within a GridStackProvider"
    );
  }
  return context;
}
