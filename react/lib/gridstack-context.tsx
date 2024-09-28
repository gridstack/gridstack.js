// gridstack-context.tsx
"use client";

import * as React from "react";
import type { GridStack } from "gridstack";
import "gridstack/dist/gridstack-extra.css";
import "gridstack/dist/gridstack.css";
import type { ItemRefType } from "./gridstack-item";

type GridStackContextType = {
  grid: GridStack | null | undefined;
  setGrid: React.Dispatch<React.SetStateAction<GridStack | null>>;
  addItemRefToList: (id: string, ref: ItemRefType) => void;
  removeItemRefFromList: (id: string) => void;
  itemRefList: ItemRefListType;
  getItemRefFromListById: (id: string) => ItemRefType | null;
};

type ItemRefListType = {
  id: string;
  ref: ItemRefType;
}[];

export const GridstackContext = React.createContext<GridStackContextType | null>(null);

export const GridstackProvider = ({ children }: { children: React.ReactNode }) => {
  const [grid, setGrid] = React.useState<GridStack | null>(null);
  const [itemRefList, setItemRefList] = React.useState<ItemRefListType>([]);

  const addItemRefToList = React.useCallback((id: string, ref: ItemRefType) => {
    setItemRefList((prev) => [...prev, { id, ref }]);
  }, []);

  const removeItemRefFromList = React.useCallback((id: string) => {
    setItemRefList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getItemRefFromListById = React.useCallback((id: string) => {
    const item = itemRefList.find((item) => item.id === id);
    return item?.ref ?? null;
  }, [itemRefList]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = React.useMemo(
    () => ({
      grid,
      setGrid,
      addItemRefToList,
      removeItemRefFromList,
      itemRefList,
      getItemRefFromListById,
    }),
    [grid, itemRefList, addItemRefToList, removeItemRefFromList, getItemRefFromListById]
  );

  return (
    <GridstackContext.Provider value={value}>
      {children}
    </GridstackContext.Provider>
  );
};