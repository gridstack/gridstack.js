import type {
  GridStack,
  GridStackElement,
  GridStackOptions,
  GridStackWidget,
} from "gridstack";
import { type PropsWithChildren, useCallback, useState } from "react";
import { GridStackContext } from "./grid-stack-context";

export type GridStackProviderProps = PropsWithChildren<{
  initialOptions: GridStackOptions;
}>;

export function GridStackProvider({
  children,
  initialOptions,
}: GridStackProviderProps) {
  const [gridStack, setGridStack] = useState<GridStack | null>(null);

  const addWidget = useCallback(
    (widget: GridStackWidget) => {
      gridStack?.addWidget(widget);
    },
    [gridStack]
  );

  const removeWidget = useCallback(
    (el: GridStackElement) => {
      gridStack?.removeWidget(el);
    },
    [gridStack]
  );

  const saveOptions = useCallback(() => {
    return gridStack?.save(true, true, (_, widget) => widget);
  }, [gridStack]);

  return (
    <GridStackContext.Provider
      value={{
        initialOptions,

        addWidget,
        removeWidget,
        saveOptions,

        _gridStack: {
          value: gridStack,
          set: setGridStack,
        },
      }}
    >
      {children}
    </GridStackContext.Provider>
  );
}
