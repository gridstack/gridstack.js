import { GridStackOptions } from "gridstack";

export const CELL_HEIGHT = 50;
export const BREAKPOINTS = [
  { c: 1, w: 700 },
  { c: 3, w: 850 },
  { c: 6, w: 950 },
  { c: 8, w: 1100 },
];

export const CUSTOM_DRAGGABLE_HANDLE_CLASSNAME = "custom-draggable-handle";

export const defaultGridOptions: GridStackOptions = {
  handleClass: CUSTOM_DRAGGABLE_HANDLE_CLASSNAME,
  acceptWidgets: true,
  columnOpts: {
    breakpointForWindow: true,
    breakpoints: BREAKPOINTS,
    layout: "moveScale",
    columnMax: 12,
  },
  margin: 8,
  cellHeight: CELL_HEIGHT,
  subGridOpts: {
    acceptWidgets: true,
    columnOpts: {
      breakpoints: BREAKPOINTS,
      layout: "moveScale",
    },
    margin: 8,
    minRow: 2,
    cellHeight: CELL_HEIGHT,
    alwaysShowResizeHandle: false,
    column: "auto",
    layout: "list",
  },
};
