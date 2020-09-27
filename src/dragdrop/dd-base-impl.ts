// dd-base-impl.ts 2.0.1-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2020 Alain Dumesny, rhlin
 * gridstack.js may be freely distributed under the MIT license.
*/
export type EventCallback = (event: Event) => boolean|void;
export abstract class DDBaseImplement {
  disabled = false;
  private eventRegister: {
    [eventName: string]: EventCallback;
  } = {};
  on(event: string, callback: EventCallback): void {
    this.eventRegister[event] = callback;
  }
  off(event: string) {
    delete this.eventRegister[event];
  }
  enable(): void {
    this.disabled = false;
  }
  disable(): void {
    this.disabled = true;
  }
  destroy() {
    this.eventRegister = undefined;
  }
  triggerEvent(eventName: string, event: Event): boolean|void {
    if (this.disabled) { return; }
    if (!this.eventRegister) {return; } // used when destory before triggerEvent fire
    if (this.eventRegister[eventName]) {
      return this.eventRegister[eventName](event);
    }
  }
}

export interface HTMLElementExtendOpt<T> {
  el: HTMLElement;
  option: T;
  updateOption(T): void;
}
