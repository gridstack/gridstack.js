/**
 * dd-resizable.ts 10.0.0-dev
 * Copyright (c) 2021-2022 Alain Dumesny - see GridStack root license
 */

import { DDResizableHandle } from './dd-resizable-handle';
import { DDBaseImplement, HTMLElementExtendOpt } from './dd-base-impl';
import { Utils } from './utils';
import { DDUIData, Rect, Size } from './types';
import { DDManager } from './dd-manager';

// import { GridItemHTMLElement } from './types'; let count = 0; // TEST

// TODO: merge with DDDragOpt
export interface DDResizableOpt {
  autoHide?: boolean;
  handles?: string;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
  start?: (event: Event, ui: DDUIData) => void;
  stop?: (event: Event) => void;
  resize?: (event: Event, ui: DDUIData) => void;
}

interface RectScaleReciprocal {
  x: number;
  y: number;
}

export class DDResizable extends DDBaseImplement implements HTMLElementExtendOpt<DDResizableOpt> {

  // have to be public else complains for HTMLElementExtendOpt ?
  public el: HTMLElement;
  public option: DDResizableOpt;

  /** @internal */
  protected handlers: DDResizableHandle[];
  /** @internal */
  protected originalRect: Rect;
  /** @internal */
  protected rectScale: RectScaleReciprocal = { x: 1, y: 1 };
  /** @internal */
  protected temporalRect: Rect;
  /** @internal */
  protected scrollY: number;
  /** @internal */
  protected scrolled: number;
  /** @internal */
  protected scrollEl: HTMLElement;
  /** @internal */
  protected startEvent: MouseEvent;
  /** @internal value saved in the same order as _originStyleProp[] */
  protected elOriginStyleVal: string[];
  /** @internal */
  protected parentOriginStylePosition: string;
  /** @internal */
  protected static _originStyleProp = ['width', 'height', 'position', 'left', 'top', 'opacity', 'zIndex'];

  constructor(el: HTMLElement, opts: DDResizableOpt = {}) {
    super();
    this.el = el;
    this.option = opts;
    // create var event binding so we can easily remove and still look like TS methods (unlike anonymous functions)
    this._mouseOver = this._mouseOver.bind(this);
    this._mouseOut = this._mouseOut.bind(this);
    this.enable();
    this._setupAutoHide(this.option.autoHide);
    this._setupHandlers();
  }

  public on(event: 'resizestart' | 'resize' | 'resizestop', callback: (event: DragEvent) => void): void {
    super.on(event, callback);
  }

  public off(event: 'resizestart' | 'resize' | 'resizestop'): void {
    super.off(event);
  }

  public enable(): void {
    super.enable();
    this.el.classList.remove('ui-resizable-disabled');
    this._setupAutoHide(this.option.autoHide);
  }

  public disable(): void {
    super.disable();
    this.el.classList.add('ui-resizable-disabled');
    this._setupAutoHide(false);
  }

  public destroy(): void {
    this._removeHandlers();
    this._setupAutoHide(false);
    delete this.el;
    super.destroy();
  }

  public updateOption(opts: DDResizableOpt): DDResizable {
    let updateHandles = (opts.handles && opts.handles !== this.option.handles);
    let updateAutoHide = (opts.autoHide && opts.autoHide !== this.option.autoHide);
    Object.keys(opts).forEach(key => this.option[key] = opts[key]);
    if (updateHandles) {
      this._removeHandlers();
      this._setupHandlers();
    }
    if (updateAutoHide) {
      this._setupAutoHide(this.option.autoHide);
    }
    return this;
  }

  /** @internal turns auto hide on/off */
  protected _setupAutoHide(auto: boolean): DDResizable {
    if (auto) {
      this.el.classList.add('ui-resizable-autohide');
      // use mouseover and not mouseenter to get better performance and track for nested cases
      this.el.addEventListener('mouseover', this._mouseOver);
      this.el.addEventListener('mouseout', this._mouseOut);
    } else {
      this.el.classList.remove('ui-resizable-autohide');
      this.el.removeEventListener('mouseover', this._mouseOver);
      this.el.removeEventListener('mouseout', this._mouseOut);
      if (DDManager.overResizeElement === this) {
        delete DDManager.overResizeElement;
      }
    }
    return this;
  }

  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _mouseOver(e: Event): void {
    // console.log(`${count++} pre-enter ${(this.el as GridItemHTMLElement).gridstackNode._id}`)
    // already over a child, ignore. Ideally we just call e.stopPropagation() but see https://github.com/gridstack/gridstack.js/issues/2018
    if (DDManager.overResizeElement || DDManager.dragElement) return;
    DDManager.overResizeElement = this;
    // console.log(`${count++} enter ${(this.el as GridItemHTMLElement).gridstackNode._id}`)
    this.el.classList.remove('ui-resizable-autohide');
  }

  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _mouseOut(e: Event): void {
    // console.log(`${count++} pre-leave ${(this.el as GridItemHTMLElement).gridstackNode._id}`)
    if (DDManager.overResizeElement !== this) return;
    delete DDManager.overResizeElement;
    // console.log(`${count++} leave ${(this.el as GridItemHTMLElement).gridstackNode._id}`)
    this.el.classList.add('ui-resizable-autohide');
  }

  /** @internal */
  protected _setupHandlers(): DDResizable {
    let handlerDirection = this.option.handles || 'e,s,se';
    if (handlerDirection === 'all') {
      handlerDirection = 'n,e,s,w,se,sw,ne,nw';
    }
    this.handlers = handlerDirection.split(',')
      .map(dir => dir.trim())
      .map(dir => new DDResizableHandle(this.el, dir, {
        start: (event: MouseEvent) => {
          this._resizeStart(event);
        },
        stop: (event: MouseEvent) => {
          this._resizeStop(event);
        },
        move: (event: MouseEvent) => {
          this._resizing(event, dir);
        }
      }));
    return this;
  }

  /** @internal */
  protected _resizeStart(event: MouseEvent): DDResizable {
    this.originalRect = this.el.getBoundingClientRect();
    this.scrollEl = Utils.getScrollElement(this.el);
    this.scrollY = this.scrollEl.scrollTop;
    this.scrolled = 0;
    this.startEvent = event;
    this._setupHelper();
    this._applyChange();
    const ev = Utils.initEvent<MouseEvent>(event, { type: 'resizestart', target: this.el });
    if (this.option.start) {
      this.option.start(ev, this._ui());
    }
    this.el.classList.add('ui-resizable-resizing');
    this.triggerEvent('resizestart', ev);
    return this;
  }

  /** @internal */
  protected _resizing(event: MouseEvent, dir: string): DDResizable {
    this.scrolled = this.scrollEl.scrollTop - this.scrollY;
    this.temporalRect = this._getChange(event, dir);
    this._applyChange();
    const ev = Utils.initEvent<MouseEvent>(event, { type: 'resize', target: this.el });
    if (this.option.resize) {
      this.option.resize(ev, this._ui());
    }
    this.triggerEvent('resize', ev);
    return this;
  }

  /** @internal */
  protected _resizeStop(event: MouseEvent): DDResizable {
    const ev = Utils.initEvent<MouseEvent>(event, { type: 'resizestop', target: this.el });
    if (this.option.stop) {
      this.option.stop(ev); // Note: ui() not used by gridstack so don't pass
    }
    this.el.classList.remove('ui-resizable-resizing');
    this.triggerEvent('resizestop', ev);
    this._cleanHelper();
    delete this.startEvent;
    delete this.originalRect;
    delete this.temporalRect;
    delete this.scrollY;
    delete this.scrolled;
    return this;
  }

  /** @internal */
  protected _setupHelper(): DDResizable {
    this.elOriginStyleVal = DDResizable._originStyleProp.map(prop => this.el.style[prop]);
    this.parentOriginStylePosition = this.el.parentElement.style.position;

    const parent = this.el.parentElement;
    const testEl = document.createElement('div');
    Utils.addElStyles(testEl, {
      opacity: '0',
      position: 'fixed',
      top: 0 + 'px',
      left: 0 + 'px',
      width: '1px',
      height: '1px',
      zIndex: '-999999',
    });
    parent.appendChild(testEl);
    const testElPosition = testEl.getBoundingClientRect();
    parent.removeChild(testEl);
    this.rectScale = {
      x: 1 / testElPosition.width,
      y: 1 / testElPosition.height
    };

    if (getComputedStyle(this.el.parentElement).position.match(/static/)) {
      this.el.parentElement.style.position = 'relative';
    }
    this.el.style.position = 'absolute';
    this.el.style.opacity = '0.8';
    return this;
  }

  /** @internal */
  protected _cleanHelper(): DDResizable {
    DDResizable._originStyleProp.forEach((prop, i) => {
      this.el.style[prop] = this.elOriginStyleVal[i] || null;
    });
    this.el.parentElement.style.position = this.parentOriginStylePosition || null;
    return this;
  }

  /** @internal */
  protected _getChange(event: MouseEvent, dir: string): Rect {
    const oEvent = this.startEvent;
    const newRect = { // Note: originalRect is a complex object, not a simple Rect, so copy out.
      width: this.originalRect.width,
      height: this.originalRect.height + this.scrolled,
      left: this.originalRect.left,
      top: this.originalRect.top - this.scrolled
    };

    const offsetX = event.clientX - oEvent.clientX;
    const offsetY = event.clientY - oEvent.clientY;

    if (dir.indexOf('e') > -1) {
      newRect.width += offsetX;
    } else if (dir.indexOf('w') > -1) {
      newRect.width -= offsetX;
      newRect.left += offsetX;
    }
    if (dir.indexOf('s') > -1) {
      newRect.height += offsetY;
    } else if (dir.indexOf('n') > -1) {
      newRect.height -= offsetY;
      newRect.top += offsetY
    }
    const constrain = this._constrainSize(newRect.width, newRect.height);
    if (Math.round(newRect.width) !== Math.round(constrain.width)) { // round to ignore slight round-off errors
      if (dir.indexOf('w') > -1) {
        newRect.left += newRect.width - constrain.width;
      }
      newRect.width = constrain.width;
    }
    if (Math.round(newRect.height) !== Math.round(constrain.height)) {
      if (dir.indexOf('n') > -1) {
        newRect.top += newRect.height - constrain.height;
      }
      newRect.height = constrain.height;
    }
    return newRect;
  }

  /** @internal constrain the size to the set min/max values */
  protected _constrainSize(oWidth: number, oHeight: number): Size {
    const maxWidth = this.option.maxWidth || Number.MAX_SAFE_INTEGER;
    const minWidth = this.option.minWidth / this.rectScale.x || oWidth;
    const maxHeight = this.option.maxHeight || Number.MAX_SAFE_INTEGER;
    const minHeight = this.option.minHeight / this.rectScale.y || oHeight;
    const width = Math.min(maxWidth, Math.max(minWidth, oWidth));
    const height = Math.min(maxHeight, Math.max(minHeight, oHeight));
    return { width, height };
  }

  /** @internal */
  protected _applyChange(): DDResizable {
    let containmentRect = { left: 0, top: 0, width: 0, height: 0 };
    if (this.el.style.position === 'absolute') {
      const containmentEl = this.el.parentElement;
      const { left, top } = containmentEl.getBoundingClientRect();
      containmentRect = { left, top, width: 0, height: 0 };
    }
    if (!this.temporalRect) return this;
    Object.keys(this.temporalRect).forEach(key => {
      const value = this.temporalRect[key];
      const scaleReciprocal = key === 'width' || key === 'left' ? this.rectScale.x : key === 'height' || key === 'top' ? this.rectScale.y : 1;
      this.el.style[key] = (value - containmentRect[key]) * scaleReciprocal + 'px';
    });
    return this;
  }

  /** @internal */
  protected _removeHandlers(): DDResizable {
    this.handlers.forEach(handle => handle.destroy());
    delete this.handlers;
    return this;
  }

  /** @internal */
  protected _ui = (): DDUIData => {
    const containmentEl = this.el.parentElement;
    const containmentRect = containmentEl.getBoundingClientRect();
    const newRect = { // Note: originalRect is a complex object, not a simple Rect, so copy out.
      width: this.originalRect.width,
      height: this.originalRect.height + this.scrolled,
      left: this.originalRect.left,
      top: this.originalRect.top - this.scrolled
    };
    const rect = this.temporalRect || newRect;
    return {
      position: {
        left: (rect.left - containmentRect.left) * this.rectScale.x,
        top: (rect.top - containmentRect.top) * this.rectScale.y
      },
      size: {
        width: rect.width * this.rectScale.x,
        height: rect.height * this.rectScale.y
      }
      /* Gridstack ONLY needs position set above... keep around in case.
      element: [this.el], // The object representing the element to be resized
      helper: [], // TODO: not support yet - The object representing the helper that's being resized
      originalElement: [this.el],// we don't wrap here, so simplify as this.el //The object representing the original element before it is wrapped
      originalPosition: { // The position represented as { left, top } before the resizable is resized
        left: this.originalRect.left - containmentRect.left,
        top: this.originalRect.top - containmentRect.top
      },
      originalSize: { // The size represented as { width, height } before the resizable is resized
        width: this.originalRect.width,
        height: this.originalRect.height
      }
      */
    };
  }
}
