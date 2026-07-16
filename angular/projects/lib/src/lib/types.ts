/**
 * gridstack-item.component.ts 12.6.0
 * Copyright (c) 2025 Alain Dumesny - see GridStack root license
 */

import { GridStackNode, GridStackOptions, GridStackWidget } from "gridstack";

/**
 * Extended GridStackWidget interface for Angular integration.
 * Matches the React/Vue convention: `component` identifies the widget type,
 * `props` carries the data passed to it (via ComponentRef.setInput()).
 */
export interface NgGridStackWidget extends GridStackWidget {
  /**
   * Key used to look up the Angular component in the `componentMap`
   * (defaults to the component's `@Component.selector`, e.g. `'app-chart'`).
   */
  component?: string;
  /** Serialized props forwarded to the component via `ComponentRef.setInput()`. */
  props?: NgCompInputs;
  /** Configuration for nested sub-grids */
  subGridOpts?: NgGridStackOptions;
}

/**
 * Extended GridStackNode interface for Angular integration.
 * Adds component key for dynamic content creation.
 */
export interface NgGridStackNode extends GridStackNode {
  /** Key used to look up the Angular component in the `componentMap`. */
  component?: string;
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
