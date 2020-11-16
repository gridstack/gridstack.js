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
  public el: HTMLElement;
  public host: HTMLElement;
  public option: DDResizableHandleOpt;
  public dir: string;
  private mouseMoving = false;
  private started = false;
  private mouseDownEvent: MouseEvent;
  private static prefix = 'ui-resizable-';

  constructor(host: HTMLElement, direction: string, option: DDResizableHandleOpt) {
    this.host = host;
    this.dir = direction;
    this.option = option;
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
    this.el.addEventListener('mousedown', this.mouseDown);
    return this;
  }

  private mouseDown = (event: MouseEvent): void => {
    this.mouseDownEvent = event;
    setTimeout(() => {
      document.addEventListener('mousemove', this.mouseMove, true);
      document.addEventListener('mouseup', this.mouseUp);
      setTimeout(() => {
        if (!this.mouseMoving) {
          document.removeEventListener('mousemove', this.mouseMove, true);
          document.removeEventListener('mouseup', this.mouseUp);
          delete this.mouseDownEvent;
        }
      }, 300);
    }, 100);
  }

  private mouseMove = (event: MouseEvent): void => {
    if (!this.started && !this.mouseMoving) {
      if (this.hasMoved(event, this.mouseDownEvent)) {
        this.mouseMoving = true;
        this.triggerEvent('start', this.mouseDownEvent);
        this.started = true;
      }
    }
    if (this.started) {
      this.triggerEvent('move', event);
    }
  }

  private mouseUp = (event: MouseEvent): void => {
    if (this.mouseMoving) {
      this.triggerEvent('stop', event);
    }
    document.removeEventListener('mousemove', this.mouseMove, true);
    document.removeEventListener('mouseup', this.mouseUp);
    this.mouseMoving = false;
    this.started = false;
    delete this.mouseDownEvent;
  }

  private hasMoved(event: MouseEvent, oEvent: MouseEvent): boolean {
    const { clientX, clientY } = event;
    const { clientX: oClientX, clientY: oClientY } = oEvent;
    return (
      Math.abs(clientX - oClientX) > 1
      || Math.abs(clientY - oClientY) > 1
    );
  }

  public destroy(): DDResizableHandle {
    this.host.removeChild(this.el);
    return this;
  }

  private triggerEvent(name: string, event: MouseEvent): DDResizableHandle {
    if (this.option[name]) {
      this.option[name](event);
    }
    return this;
  }
}
