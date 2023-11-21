/**
 * dd-base-impl.ts 10.0.0-dev
 * Copyright (c) 2021-2022 Alain Dumesny - see GridStack root license
 */

export type EventCallback = (event: Event) => boolean|void;
export abstract class DDBaseImplement {
  /** returns the enable state, but you have to call enable()/disable() to change (as other things need to happen) */
  public get disabled(): boolean   { return this._disabled; }

  /** @internal */
  protected _disabled: boolean; // initial state to differentiate from false
  /** @internal */
  protected _eventRegister: {
    [eventName: string]: EventCallback;
  } = {};

  public on(event: string, callback: EventCallback): void {
    this._eventRegister[event] = callback;
  }

  public off(event: string): void {
    delete this._eventRegister[event];
  }

  public enable(): void {
    this._disabled = false;
  }

  public disable(): void {
    this._disabled = true;
  }

  public destroy(): void {
    delete this._eventRegister;
  }

  public triggerEvent(eventName: string, event: Event): boolean|void {
    if (!this.disabled && this._eventRegister && this._eventRegister[eventName])
      return this._eventRegister[eventName](event);
  }
}

export interface HTMLElementExtendOpt<T> {
  el: HTMLElement;
  option: T;
  updateOption(T): DDBaseImplement;
}
