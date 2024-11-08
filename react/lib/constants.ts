import { GridStackOptions } from 'gridstack';

export const BREAKPOINTS = [
  { c: 1, w: 700 },
  { c: 3, w: 850 },
  { c: 6, w: 950 },
  { c: 8, w: 1100 },
];

export const SUB_GRID_OPTIONS: GridStackOptions = {
  acceptWidgets: true,
  column: 12,
  columnOpts: {
    breakpoints: BREAKPOINTS,
    layout: 'moveScale',
  },
  margin: 8,
  minRow: 2,
} as const;

export const GRID_OPTIONS: GridStackOptions = {
  acceptWidgets: true,
  columnOpts: {
    breakpointForWindow: true,
    breakpoints: BREAKPOINTS,
    layout: 'moveScale',
  },
  float: false,
  margin: 8,
  subGridOpts: SUB_GRID_OPTIONS,
} as const;
