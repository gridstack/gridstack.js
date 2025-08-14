/**
 * dd-base-impl.ts 12.3.3
 * Copyright (c) 2021-2025  Alain Dumesny - see GridStack root license
 */

/**
 * Type for event callback functions used in drag & drop operations.
 * Can return boolean to indicate if the event should continue propagation.
 */
export type EventCallback = (event: Event) => boolean|void;

/**
 * Abstract base class for all drag & drop implementations.
 * Provides common functionality for event handling, enable/disable state,
 * and lifecycle management used by draggable, droppable, and resizable implementations.
 */
export abstract class DDBaseImplement {
  /**
   * Returns the current disabled state.
   * Note: Use enable()/disable() methods to change state as other operations need to happen.
   */
  public get disabled(): boolean   { return this._disabled; }

  /** @internal */
  protected _disabled: boolean; // initial state to differentiate from false
  /** @internal */
  protected _eventRegister: {
    [eventName: string]: EventCallback;
  } = {};

  /**
   * Register an event callback for the specified event.
   *
   * @param event - Event name to listen for
   * @param callback - Function to call when event occurs
   */
  public on(event: string, callback: EventCallback): void {
    this._eventRegister[event] = callback;
  }

  /**
   * Unregister an event callback for the specified event.
   *
   * @param event - Event name to stop listening for
   */
  public off(event: string): void {
    delete this._eventRegister[event];
  }

  /**
   * Enable this drag & drop implementation.
   * Subclasses should override to perform additional setup.
   */
  public enable(): void {
    this._disabled = false;
  }

  /**
   * Disable this drag & drop implementation.
   * Subclasses should override to perform additional cleanup.
   */
  public disable(): void {
    this._disabled = true;
  }

  /**
   * Destroy this drag & drop implementation and clean up resources.
   * Removes all event handlers and clears internal state.
   */
  public destroy(): void {
    delete this._eventRegister;
  }

  /**
   * Trigger a registered event callback if one exists and the implementation is enabled.
   *
   * @param eventName - Name of the event to trigger
   * @param event - DOM event object to pass to the callback
   * @returns Result from the callback function, if any
   */
  public triggerEvent(eventName: string, event: Event): boolean|void {
    if (!this.disabled && this._eventRegister && this._eventRegister[eventName])
      return this._eventRegister[eventName](event);
  }
}

/**
 * Interface for HTML elements extended with drag & drop options.
 * Used to associate DD configuration with DOM elements.
 */
export interface HTMLElementExtendOpt<T> {
  /** The HTML element being extended */
  el: HTMLElement;
  /** The drag & drop options/configuration */
  option: T;
  /** Method to update the options and return the DD implementation */
  updateOption(T): DDBaseImplement;
}
