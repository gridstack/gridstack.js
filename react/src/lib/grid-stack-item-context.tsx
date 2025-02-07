import { GridStackWidget } from "gridstack";
import { createContext, useContext } from "react";

export type GridStackItemContextType = {
  id: string;

  // Native methods
  remove: () => void;
  update: (opt: GridStackWidget) => void;

  // Extended methods
  getBounds: () => {
    current: {
      x: number | undefined;
      y: number | undefined;
      w: number | undefined;
      h: number | undefined;
    };
    original: {
      x: number | undefined;
      y: number | undefined;
      w: number | undefined;
      h: number | undefined;
    };
  } | null;
  setSize: (size: { w: number; h: number }) => void;
  setPosition: (position: { x: number; y: number }) => void;
};

export const GridStackItemContext = createContext<GridStackItemContextType>({
  id: "",
  remove: () => {
    console.error("remove not implemented");
  },
  update: () => {
    console.error("update not implemented");
  },
  getBounds: () => {
    console.error("getBounds not implemented");
    return null;
  },
  setSize: () => {
    console.error("setSize not implemented");
  },
  setPosition: () => {
    console.error("setPosition not implemented");
  },
});

export function useGridStackItemContext() {
  const context = useContext(GridStackItemContext);

  if (!context) {
    throw new Error(
      "useGridStackItemContext must be used within a GridStackItemContext"
    );
  }

  return context;
}
