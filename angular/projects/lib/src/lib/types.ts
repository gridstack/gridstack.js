/**
 * gridstack-item.component.ts 12.4.2
 * Copyright (c) 2025 Alain Dumesny - see GridStack root license
 */

import { GridStackNode, GridStackOptions, GridStackWidget } from "gridstack";

/**
 * Extended GridStackWidget interface for Angular integration.
 * Adds Angular-specific properties for dynamic component creation.
 */
export interface NgGridStackWidget extends GridStackWidget {
  /** Angular component selector for dynamic creation (e.g., 'my-widget') */
  selector?: string;
  /** Serialized data for component @Input() properties */
  input?: NgCompInputs;
  /** Configuration for nested sub-grids */
  subGridOpts?: NgGridStackOptions;
}

/**
 * Extended GridStackNode interface for Angular integration.
 * Adds component selector for dynamic content creation.
 */
export interface NgGridStackNode extends GridStackNode {
  /** Angular component selector for this node's content */
  selector?: string;
}

/**
 * Extended GridStackOptions interface for Angular integration.
 * Supports Angular-specific widget definitions and nested grids.
 */
export interface NgGridStackOptions extends GridStackOptions {
  /** Array of Angular widget definitions for initial grid setup */
  children?: NgGridStackWidget[];
  /** Configuration for nested sub-grids (Angular-aware) */
  subGridOpts?: NgGridStackOptions;
}

/**
 * Type for component input data serialization.
 * Maps @Input() property names to their values for widget persistence.
 *
 * @example
 * ```typescript
 * const inputs: NgCompInputs = {
 *   title: 'My Widget',
 *   value: 42,
 *   config: { enabled: true }
 * };
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NgCompInputs = {[key: string]: any};
