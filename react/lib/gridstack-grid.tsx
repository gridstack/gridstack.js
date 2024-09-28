// gridstack-context.tsx
"use client";

import { GridStack, type GridStackOptions } from "gridstack";
import "gridstack/dist/gridstack-extra.css";
import "gridstack/dist/gridstack.css";

import * as React from "react";
import {useGridstackContext} from "./use-gridstack-context";

// Create a context for the GridStack instance

export const GridstackGrid = ({
  options,
  children,
}: {
  options: GridStackOptions;
  children: React.ReactNode;
}) => {
  const { grid, setGrid } = useGridstackContext();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const optionsRef = React.useRef<GridStackOptions>(options);

  React.useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  React.useLayoutEffect(() => {
    if (!grid && containerRef.current) {
      const gridInstance = GridStack.init(optionsRef.current, containerRef.current);
      setGrid(gridInstance);
    }
    return () => {
      if (grid) {
        //? grid.destroy(false);
        grid.removeAll(false);
        grid.destroy(false);
        setGrid(null);
      }
    };
  }, [grid, setGrid]);

  return <div ref={containerRef}>{children}</div>;
};
