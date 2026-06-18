import { createContext, useContext } from "react";

export interface GridStackWidgetContextValue {
  id: string;
  registerSerializer?: (
    serialize: () => Record<string, unknown> | undefined,
    deserialize?: (data: Record<string, unknown>) => void
  ) => () => void;
}

export const GridStackWidgetContext =
  createContext<GridStackWidgetContextValue | null>(null);

export function useGridStackWidgetContext(): GridStackWidgetContextValue {
  const v = useContext(GridStackWidgetContext);
  if (!v) {
    throw new Error(
      "useGridStackItem / useWidgetSerializer must be used inside <GridStackItem> content"
    );
  }
  return v;
}
