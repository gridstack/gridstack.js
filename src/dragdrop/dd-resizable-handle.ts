// dd-resizable-handle.ts 2.0.2-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2020 Alain Dumesny, rhlin
 * gridstack.js may be freely distributed under the MIT license.
*/
import { DDUtils } from "./dd-utils";

export interface DDResizableHandleOpt {
  start?: (event) => void;
  move?: (event) => void;
  stop?: (event) => void;
}
export class DDResizableHandle {
  static prefix = 'ui-resizable-';
  el: HTMLElement;
  host: HTMLElement;
  option: DDResizableHandleOpt;
  dir: string;
  private mouseMoving = false;
  private started = false;
  private mouseDownEvent: MouseEvent;
  constructor(host: HTMLElement, direction: string, option: DDResizableHandleOpt) {
    this.host = host;
    this.dir = direction;
    this.option = option;
    this.init();
  }

  init() {
    const el = document.createElement('div');
    el.classList.add('ui-resizable-handle');
    el.classList.add(`${DDResizableHandle.prefix}${this.dir}`);
    el.style.zIndex = '100';
    el.style.userSelect = 'none';
    this.el = el;
    this.host.appendChild(this.el);
    this.el.addEventListener('mousedown', this.mouseDown);
    this.mouseMoveThrottle = DDUtils.throttle(this.mouseMove, 100);
  }

  protected mouseDown = (event: MouseEvent) => {
    this.mouseDownEvent = event;
    setTimeout(() => {
      document.addEventListener('mousemove', this.mouseMoveThrottle, true);
      document.addEventListener('mouseup', this.mouseUp);
      setTimeout(() => {
        if (!this.mouseMoving) {
          document.removeEventListener('mousemove', this.mouseMoveThrottle, true);
          document.removeEventListener('mouseup', this.mouseUp);
          this.mouseDownEvent = undefined;
        }
      }, 300);
    }, 100);
  }

  protected mouseMoveThrottle: (event: MouseEvent) => void;
  protected mouseMove = (event: MouseEvent) => {
    if (!this.started && !this.mouseMoving) {
      if (this.hasMoved(event, this.mouseDownEvent)) {
        this.mouseMoving = true;
        this.triggleEvent('start', this.mouseDownEvent);
        this.started = true;
      }
    }
    if (this.started) {
      this.triggleEvent('move', event);
    }
  }

  protected mouseUp = (event: MouseEvent) => {
    if (this.mouseMoving) {
      this.triggleEvent('stop', event);
    }
    document.removeEventListener('mousemove', this.mouseMoveThrottle, true);
    document.removeEventListener('mouseup', this.mouseUp);
    this.mouseMoving = false;
    this.started = false;
    this.mouseDownEvent = undefined;
  }

  private hasMoved(event: MouseEvent, oEvent: MouseEvent) {
    const { clientX, clientY } = event;
    const { clientX: oClientX, clientY: oClientY } = oEvent;
    return (
      Math.abs(clientX - oClientX) > 1
      || Math.abs(clientY - oClientY) > 1
    );
  }

  show() {
    this.el.style.display = 'block';
  }

  hide() {
    this.el.style.display = 'none';
  }

  destory() {
    this.host.removeChild(this.el);
  }

  triggleEvent(name: string, event: MouseEvent) {
    if (this.option[name]) {
      this.option[name](event);
    }
  }

}
