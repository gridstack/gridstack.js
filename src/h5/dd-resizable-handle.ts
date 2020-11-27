// dd-resizable-handle.ts 2.2.0-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2020 rhlin, Alain Dumesny
 * gridstack.js may be freely distributed under the MIT license.
*/
export interface DDResizableHandleOpt {
  start?: (event) => void;
  move?: (event) => void;
  stop?: (event) => void;
}

export class DDResizableHandle {
  /** @internal */
  private el: HTMLElement;
  /** @internal */
  private host: HTMLElement;
  /** @internal */
  private option: DDResizableHandleOpt;
  /** @internal */
  private dir: string;
  /** @internal */
  private mouseMoving = false;
  /** @internal */
  private started = false;
  /** @internal */
  private mouseDownEvent: MouseEvent;
  /** @internal */
  private static prefix = 'ui-resizable-';

  constructor(host: HTMLElement, direction: string, option: DDResizableHandleOpt) {
    this.host = host;
    this.dir = direction;
    this.option = option;
    // create var event binding so we can easily remove and still look like TS methods (unlike anonymous functions)
    this._mouseDown = this._mouseDown.bind(this);
    this._mouseMove = this._mouseMove.bind(this);
    this._mouseUp = this._mouseUp.bind(this);

    this.init();
  }

  public init(): DDResizableHandle {
    const el = document.createElement('div');
    el.classList.add('ui-resizable-handle');
    el.classList.add(`${DDResizableHandle.prefix}${this.dir}`);
    el.style.zIndex = '100';
    el.style.userSelect = 'none';
    this.el = el;
    this.host.appendChild(this.el);
    this.el.addEventListener('mousedown', this._mouseDown);
    return this;
  }

  public destroy(): DDResizableHandle {
    this.host.removeChild(this.el);
    return this;
  }

  /** @internal */
  private _mouseDown(event: MouseEvent): void {
    this.mouseDownEvent = event;
    setTimeout(() => {
      document.addEventListener('mousemove', this._mouseMove, true);
      document.addEventListener('mouseup', this._mouseUp);
      setTimeout(() => {
        if (!this.mouseMoving) {
          document.removeEventListener('mousemove', this._mouseMove, true);
          document.removeEventListener('mouseup', this._mouseUp);
          delete this.mouseDownEvent;
        }
      }, 300);
    }, 100);
  }

  /** @internal */
  private _mouseMove(event: MouseEvent): void {
    if (!this.started && !this.mouseMoving) {
      if (this._hasMoved(event, this.mouseDownEvent)) {
        this.mouseMoving = true;
        this._triggerEvent('start', this.mouseDownEvent);
        this.started = true;
      }
    }
    if (this.started) {
      this._triggerEvent('move', event);
    }
  }

  /** @internal */
  private _mouseUp(event: MouseEvent): void {
    if (this.mouseMoving) {
      this._triggerEvent('stop', event);
    }
    document.removeEventListener('mousemove', this._mouseMove, true);
    document.removeEventListener('mouseup', this._mouseUp);
    this.mouseMoving = false;
    this.started = false;
    delete this.mouseDownEvent;
  }

  /** @internal */
  private _hasMoved(event: MouseEvent, oEvent: MouseEvent): boolean {
    const { clientX, clientY } = event;
    const { clientX: oClientX, clientY: oClientY } = oEvent;
    return (
      Math.abs(clientX - oClientX) > 1
      || Math.abs(clientY - oClientY) > 1
    );
  }

  /** @internal */
  private _triggerEvent(name: string, event: MouseEvent): DDResizableHandle {
    if (this.option[name]) {
      this.option[name](event);
    }
    return this;
  }
}
