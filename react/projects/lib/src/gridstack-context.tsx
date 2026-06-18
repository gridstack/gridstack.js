import { createContext, useContext } from "react";
import type { GridStack } from "gridstack";

export interface GridStackContextValue {
  grid: GridStack | null;
  /** Bumped after GS-driven structural changes (add/remove) so portal containers re-sync. */
  layoutVersion: number;
  /** @internal — used by `useWidgetSerializer` via `<GridStackItem>` */
  registerWidgetSerializer: (
    id: string,
    serialize: () => Record<string, unknown> | undefined,
    deserialize?: (data: Record<string, unknown>) => void
  ) => () => void;
}

export const GridStackContext = createContext<GridStackContextValue | null>(null);

export function useGridStackContextValue(): GridStackContextValue {
  const v = useContext(GridStackContext);
  if (!v) throw new Error("useGridStack must be used within <GridStack>");
  return v;
}
