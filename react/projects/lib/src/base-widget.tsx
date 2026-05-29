import { Component, type ReactNode } from "react";
import type { GridStackWidget } from "./types";

/**
 * Optional parity with Angular `BaseWidget` for class-based widget components.
 * For functional components, prefer {@link useWidgetSerializer} instead.
 */
export abstract class BaseWidget<
  P extends Record<string, unknown> = Record<string, unknown>,
> extends Component<P> {
  /** Populated by the grid when restoring from saved layout (subclasses may read in lifecycle). */
  widgetItem?: GridStackWidget;

  serialize(): Record<string, unknown> | undefined {
    return undefined;
  }

  /** Optional override — restore widget-specific state from saved layout. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature parity with Angular `BaseWidget`
  deserialize(_: GridStackWidget): void {
    // optional override
  }

  render(): ReactNode {
    return null;
  }
}
