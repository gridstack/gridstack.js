/**
 * dd-resizable-handle.ts 10.0.0-dev
 * Copyright (c) 2021-2022 Alain Dumesny - see GridStack root license
 */

import { isTouch, pointerdown, touchend, touchmove, touchstart } from './dd-touch';

export interface DDResizableHandleOpt {
  start?: (event) => void;
  move?: (event) => void;
  stop?: (event) => void;
}

export class DDResizableHandle {
  /** @internal */
  protected el: HTMLElement;
  /** @internal */
  protected host: HTMLElement;
  /** @internal */
  protected option: DDResizableHandleOpt;
  /** @internal */
  protected dir: string;
  /** @internal true after we've moved enough pixels to start a resize */
  protected moving = false;
  /** @internal */
  protected mouseDownEvent: MouseEvent;
  /** @internal */
  protected static prefix = 'ui-resizable-';

  constructor(host: HTMLElement, direction: string, option: DDResizableHandleOpt) {
    this.host = host;
    this.dir = direction;
    this.option = option;
    // create var event binding so we can easily remove and still look like TS methods (unlike anonymous functions)
    this._mouseDown = this._mouseDown.bind(this);
    this._mouseMove = this._mouseMove.bind(this);
    this._mouseUp = this._mouseUp.bind(this);

    this._init();
  }

  /** @internal */
  protected _init(): DDResizableHandle {
    const el = document.createElement('div');
    el.classList.add('ui-resizable-handle');
    el.classList.add(`${DDResizableHandle.prefix}${this.dir}`);
    el.style.zIndex = '100';
    el.style.userSelect = 'none';
    this.el = el;
    this.host.appendChild(this.el);
    this.el.addEventListener('mousedown', this._mouseDown);
    if (isTouch) {
      this.el.addEventListener('touchstart', touchstart);
      this.el.addEventListener('pointerdown', pointerdown);
      // this.el.style.touchAction = 'none'; // not needed unlike pointerdown doc comment
    }
    return this;
  }

  /** call this when resize handle needs to be removed and cleaned up */
  public destroy(): DDResizableHandle {
    if (this.moving) this._mouseUp(this.mouseDownEvent);
    this.el.removeEventListener('mousedown', this._mouseDown);
    if (isTouch) {
      this.el.removeEventListener('touchstart', touchstart);
      this.el.removeEventListener('pointerdown', pointerdown);
    }
    this.host.removeChild(this.el);
    delete this.el;
    delete this.host;
    return this;
  }

  /** @internal called on mouse down on us: capture move on the entire document (mouse might not stay on us) until we release the mouse */
  protected _mouseDown(e: MouseEvent): void {
    this.mouseDownEvent = e;
    document.addEventListener('mousemove', this._mouseMove, true); // capture, not bubble
    document.addEventListener('mouseup', this._mouseUp, true);
    if (isTouch) {
      this.el.addEventListener('touchmove', touchmove);
      this.el.addEventListener('touchend', touchend);
    }
    e.stopPropagation();
    e.preventDefault();
  }

  /** @internal */
  protected _mouseMove(e: MouseEvent): void {
    let s = this.mouseDownEvent;
    if (this.moving) {
      this._triggerEvent('move', e);
    } else if (Math.abs(e.x - s.x) + Math.abs(e.y - s.y) > 2) {
      // don't start unless we've moved at least 3 pixels
      this.moving = true;
      this._triggerEvent('start', this.mouseDownEvent);
      this._triggerEvent('move', e);
    }
    e.stopPropagation();
    e.preventDefault();
  }

  /** @internal */
  protected _mouseUp(e: MouseEvent): void {
    if (this.moving) {
      this._triggerEvent('stop', e);
    }
    document.removeEventListener('mousemove', this._mouseMove, true);
    document.removeEventListener('mouseup', this._mouseUp, true);
    if (isTouch) {
      this.el.removeEventListener('touchmove', touchmove);
      this.el.removeEventListener('touchend', touchend);
    }
    delete this.moving;
    delete this.mouseDownEvent;
    e.stopPropagation();
    e.preventDefault();
  }

  /** @internal */
  protected _triggerEvent(name: string, event: MouseEvent): DDResizableHandle {
    if (this.option[name]) this.option[name](event);
    return this;
  }
}
