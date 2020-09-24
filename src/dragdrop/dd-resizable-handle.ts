import { DDUtils } from "./dd-utils";

export interface DDResizableHandleOpt {
  start?: Function;
  move?: Function;
  stop?: Function;
}
export class DDResizableHandle {
  public el: HTMLElement;
  host: HTMLElement;
  option: DDResizableHandleOpt;
  dir: string;
  prefix = 'ui-resizable-';
  mouseMoving = false;
  started = false;
  mouseDownEvent;
  constructor(host: HTMLElement, direction: string, option: DDResizableHandleOpt) {
    this.host = host;
    this.dir = direction;
    this.option = option;
    this.init();
  }
  init() {
    const el = document.createElement('div');
    el.classList.add('ui-resizable-handle');
    el.classList.add(`${this.prefix}${this.dir}`);
    el.style.zIndex = '100';
    el.style.userSelect = 'none';
    this.el = el;
    this.host.appendChild(this.el);
    this.el.addEventListener('mousedown', this.mouseDown);
    this.mouseMoveThrottle = DDUtils.throttle(this.mouseMove, 100);
  }

  mouseDown = (event: MouseEvent) => {
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
  mouseMoveThrottle: (event: MouseEvent) => void;
  mouseMove = (event: MouseEvent) => {
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

  mouseUp = (event: MouseEvent) => {
    if (this.mouseMoving) {
      this.triggleEvent('stop', event);
    }
    document.removeEventListener('mousemove', this.mouseMoveThrottle, true);
    document.removeEventListener('mouseup', this.mouseUp);
    this.mouseMoving = false;
    this.started = false;
    this.mouseDownEvent = undefined;
  }
  hasMoved(event: MouseEvent, oEvent: MouseEvent) {
    const {clientX, clientY} = event;
    const {clientX: oClientX, clientY: oClientY} = oEvent;
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
