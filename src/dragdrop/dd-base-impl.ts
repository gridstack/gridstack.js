// dd-base-impl.ts 2.2.0-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2020 rhlin, Alain Dumesny
 * gridstack.js may be freely distributed under the MIT license.
*/
export type EventCallback = (event: Event) => boolean|void;
export abstract class DDBaseImplement {
  protected disabled = false;
  private eventRegister: {
    [eventName: string]: EventCallback;
  } = {};

  public on(event: string, callback: EventCallback): void {
    this.eventRegister[event] = callback;
  }

  public off(event: string): void {
    delete this.eventRegister[event];
  }

  public enable(): void {
    this.disabled = false;
  }

  public disable(): void {
    this.disabled = true;
  }

  public destroy(): void {
    delete this.eventRegister;
  }

  public triggerEvent(eventName: string, event: Event): boolean|void {
    if (this.disabled) { return; }
    if (!this.eventRegister) {return; } // used when destroy before triggerEvent fire
    if (this.eventRegister[eventName]) {
      return this.eventRegister[eventName](event);
    }
  }
}

export interface HTMLElementExtendOpt<T> {
  el: HTMLElement;
  option: T;
  updateOption(T): DDBaseImplement;
}
