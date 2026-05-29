import type { GridItemHTMLElement, GridStack, GridStackOptions, GridStackWidget } from "gridstack";
import { type PropsWithChildren, useCallback, useState } from "react";
import { GridStackContext } from "./grid-stack-context";

export function GridStackProvider({
  children,
  initialOptions,
}: PropsWithChildren<{ initialOptions: GridStackOptions }>) {
  const [gridStack, setGridStack] = useState<GridStack | null>(null);
  const [rawWidgetMetaMap, setRawWidgetMetaMap] = useState(() => {
    const map = new Map<string, GridStackWidget>();
    const deepFindNodeWithContent = (obj: GridStackWidget) => {
      if (obj.id && obj.content) {
        map.set(obj.id, obj);
      }
      if (obj.subGridOpts?.children) {
        obj.subGridOpts.children.forEach((child: GridStackWidget) => {
          deepFindNodeWithContent(child);
        });
      }
    };
    initialOptions.children?.forEach((child: GridStackWidget) => {
      deepFindNodeWithContent(child);
    });
    return map;
  });

  const addWidget = useCallback(
    (widget: GridStackWidget & { id: Required<GridStackWidget>["id"] })  => {
      gridStack?.addWidget(widget);
      setRawWidgetMetaMap((prev) => {
        const newMap = new Map<string, GridStackWidget>(prev);
        newMap.set(widget.id, widget);
        return newMap;
      });
    },
    [gridStack]
  );

  const addSubGrid = useCallback(
    (subGrid: GridStackWidget & { 
      id: Required<GridStackWidget>["id"]; 
      subGridOpts: Required<GridStackWidget>["subGridOpts"] & { 
        children: Array<GridStackWidget & { id: Required<GridStackWidget>["id"] }> 
      } 
    }) => {
      gridStack?.addWidget(subGrid);

      setRawWidgetMetaMap((prev) => {
        const newMap = new Map<string, GridStackWidget>(prev);
        subGrid.subGridOpts?.children?.forEach((meta: GridStackWidget & { id: Required<GridStackWidget>["id"] }) => {
          newMap.set(meta.id, meta);
        });
        return newMap;
      });
    },
    [gridStack]
  );

  const removeWidget = useCallback(
    (id: string) => {
      const element = document.body.querySelector<GridItemHTMLElement>(`[gs-id="${id}"]`);
      if (element) gridStack?.removeWidget(element);

      setRawWidgetMetaMap((prev) => {
        const newMap = new Map<string, GridStackWidget>(prev);
        newMap.delete(id);
        return newMap;
      });
    },
    [gridStack]
  );

  const saveOptions = useCallback(() => {
    return gridStack?.save(true, true, (_, widget) => widget);
  }, [gridStack]);

  const removeAll = useCallback(() => {
    gridStack?.removeAll();
    setRawWidgetMetaMap(new Map<string, GridStackWidget>());
  }, [gridStack]);

  return (
    <GridStackContext.Provider
      value={{
        initialOptions,
        gridStack,

        addWidget,
        removeWidget,
        addSubGrid,
        saveOptions,
        removeAll,

        _gridStack: {
          value: gridStack,
          set: setGridStack,
        },
        _rawWidgetMetaMap: {
          value: rawWidgetMetaMap,
          set: setRawWidgetMetaMap,
        },
      }}
    >
      {children}
    </GridStackContext.Provider>
  );
}
