/**
 * gridstack-item.component.ts 12.0.0-dev
 * Copyright (c) 2025 Alain Dumesny - see GridStack root license
 */

import { GridStackNode, GridStackOptions, GridStackWidget } from "gridstack";

/** extends to store Ng Component selector, instead/inAddition to content */
export interface NgGridStackWidget extends GridStackWidget {
  /** Angular tag selector for this component to create at runtime */
  selector?: string;
  /** serialized data for the component input fields */
  input?: NgCompInputs;
  /** nested grid options */
  subGridOpts?: NgGridStackOptions;
}

export interface NgGridStackNode extends GridStackNode {
  selector?: string; // component type to create as content
}

export interface NgGridStackOptions extends GridStackOptions {
  children?: NgGridStackWidget[];
  subGridOpts?: NgGridStackOptions;
}

export type NgCompInputs = {[key: string]: any};
