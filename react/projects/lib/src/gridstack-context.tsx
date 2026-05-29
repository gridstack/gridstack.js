import { createContext, useContext } from "react";
import type { GridStack } from "gridstack";

export interface GridStackContextValue {
  grid: GridStack | null;
  /** Bumped after GS-driven updates so descendants can re-sync */
  layoutVersion: number;
  /** @internal — used by `useWidgetSerializer` via `<GridStackItem>` */
  registerWidgetSerializer: (
    id: string,
    fn: () => Record<string, unknown> | undefined
  ) => () => void;
}

export const GridStackContext = createContext<GridStackContextValue | null>(
  null
);

export function useGridStackContextValue(): GridStackContextValue {
  const v = useContext(GridStackContext);
  if (!v) {
    throw new Error("useGridStack must be used within <GridStack>");
  }
  return v;
}
