// dd-resizable.ts 2.0.1-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2020 Alain Dumesny, rhlin
 * gridstack.js may be freely distributed under the MIT license.
*/
import { DDResizableHandle } from './dd-resizable-handle';
import { DDBaseImplement, HTMLElementExtendOpt } from './dd-base-impl';
import { DDUtils } from './dd-utils';
export interface DDResizableOpt {
  autoHide?: boolean;
  handles?: string;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
  basePosision?: 'fixed' | 'absolute';
  start?: (event: MouseEvent, ui) => void;
  stop?: (event: MouseEvent, ui) => void;
  resize?: (event: MouseEvent, ui) => void;
}
export class DDResizable extends DDBaseImplement implements HTMLElementExtendOpt<DDResizableOpt> {
  static originStyleProp = ['width', 'height', 'position', 'left', 'top', 'opacity', 'zIndex'];
  el: HTMLElement;
  option: DDResizableOpt;
  handlers: DDResizableHandle[];
  helper: HTMLElement;
  originalRect;
  temporalRect;
  private startEvent: MouseEvent;
  private elOriginStyle;
  private parentOriginStylePosition;
  constructor(el: HTMLElement, opts: DDResizableOpt) {
    super();
    this.el = el;
    this.option = opts || {};
    this.init();
  }
  on(event: 'resizestart' | 'resize' | 'resizestop', callback: (event: DragEvent) => void): void {
    super.on(event, callback);
  }
  off(event: 'resizestart' | 'resize' | 'resizestop') {
    super.off(event);
  }
  enable() {
    if (!this.disabled) { return; }
    super.enable();
    this.el.classList.remove('ui-resizable-disabled');
  }
  disable() {
    if (this.disabled) { return; }
    super.disable();
    this.el.classList.add('ui-resizable-disabled');
  }
  updateOption(opts: DDResizableOpt) {
    let updateHandles = false;
    let updateAutoHide = false;
    if (opts.handles !== this.option.handles) {
      updateHandles = true;
    }
    if (opts.autoHide !== this.option.autoHide) {
      updateAutoHide = true;
    }
    Object.keys(opts).forEach(key => {
      const value = opts[key];
      this.option[key] = value;
    });
    if (updateHandles) {
      this.removeHandlers();
      this.setupHandlers();
    }
    if (updateAutoHide) {
      this.setupAutoHide();
    }
  }

  protected init() {
    this.el.classList.add('ui-resizable');
    this.setupAutoHide();
    this.setupHandlers();
  }

  protected setupAutoHide() {
    if (this.option.autoHide) {
      this.el.classList.add('ui-resizable-autohide');
      this.el.addEventListener('mouseenter', this.showHandlers);
      this.el.addEventListener('mouseleave', this.hideHandlers);
    } else {
      this.el.classList.remove('ui-resizable-autohide');
      this.el.removeEventListener('mouseenter', this.showHandlers);
      this.el.removeEventListener('mouseleave', this.hideHandlers);
    }
  }

  protected showHandlers = () => {
    this.el.classList.remove('ui-resizable-autohide');
  }

  protected hideHandlers = () => {
    this.el.classList.add('ui-resizable-autohide');
  }

  protected setupHandlers() {
    let handlerDirection = this.option.handles || 'e,s,se';
    if (handlerDirection === 'all') {
      handlerDirection = 'n,e,s,w,se,sw,ne,nw';
    }
    this.handlers = handlerDirection.split(',')
      .map(dir => dir.trim())
      .map(dir => new DDResizableHandle(this.el, dir, {
        start: (event: MouseEvent) => {
          this.resizeStart(event);
        },
        stop: (event: MouseEvent) => {
          this.resizeStop(event);
        },
        move: (event: MouseEvent) => {
          this.resizing(event, dir);
        }
      }));
  }

  protected resizeStart(event: MouseEvent) {
    this.originalRect = this.el.getBoundingClientRect();
    this.startEvent = event;
    this.setupHelper();
    this.applyChange();
    const ev = DDUtils.initEvent<MouseEvent>(event, { type: 'resizestart', target: this.el });
    if (this.option.start) {
      this.option.start(ev, this.ui());
    }
    this.triggerEvent('resizestart', ev);
  }

  protected resizing(event: MouseEvent, dir: string) {
    this.temporalRect = this.getChange(event, dir);
    this.applyChange();
    const ev = DDUtils.initEvent<MouseEvent>(event, { type: 'resize', target: this.el });
    if (this.option.resize) {
      this.option.resize(ev, this.ui());
    }
    this.triggerEvent('resize', ev);
  }

  protected resizeStop(event: MouseEvent) {
    const ev = DDUtils.initEvent<MouseEvent>(event, { type: 'resizestop', target: this.el });
    if (this.option.stop) {
      this.option.stop(ev, this.ui());
    }
    this.triggerEvent('resizestop', ev);
    this.cleanHelper();
    this.startEvent = undefined;
    this.originalRect = undefined;
    this.temporalRect = undefined;
  }

  private setupHelper() {
    this.elOriginStyle = DDResizable.originStyleProp.map(prop => this.el.style[prop]);
    this.parentOriginStylePosition = this.el.parentElement.style.position;
    if (window.getComputedStyle(this.el.parentElement).position.match(/static/)) {
      this.el.parentElement.style.position = 'relative';
    }
    this.el.style.position = this.option.basePosision || 'absolute'; // or 'fixed'
    this.el.style.opacity = '0.8';
    this.el.style.zIndex = '1000';
  }
  private cleanHelper() {
    DDResizable.originStyleProp.forEach(prop => {
      this.el.style[prop] = this.elOriginStyle[prop] || null;
    });
    this.el.parentElement.style.position = this.parentOriginStylePosition || null;
  }
  private getChange(event: MouseEvent, dir: string) {
    const oEvent = this.startEvent;
    const newRect = {
      width: this.originalRect.width,
      height: this.originalRect.height,
      left: this.originalRect.left,
      top: this.originalRect.top
    };
    const offsetH = event.clientX - oEvent.clientX;
    const offsetV = event.clientY - oEvent.clientY;

    if (dir.indexOf('e') > -1) {
      newRect.width += event.clientX - oEvent.clientX;
    }
    if (dir.indexOf('s') > -1) {
      newRect.height += event.clientY - oEvent.clientY;
    }
    if (dir.indexOf('w') > -1) {
      newRect.width -= offsetH;
      newRect.left += offsetH;
    }
    if (dir.indexOf('n') > -1) {
      newRect.height -= offsetV;
      newRect.top += offsetV
    }
    const reshape = this.getReShapeSize(newRect.width, newRect.height);
    if (newRect.width !== reshape.width) {
      if (dir.indexOf('w') > -1) {
        newRect.left += reshape.width - newRect.width;
      }
      newRect.width = reshape.width;
    }
    if (newRect.height !== reshape.height) {
      if (dir.indexOf('n') > -1) {
        newRect.top += reshape.height - newRect.height;
      }
      newRect.height = reshape.height;
    }
    return newRect;
  }

  private getReShapeSize(oWidth, oHeight) {
    const maxWidth = this.option.maxWidth || oWidth;
    const minWidth = this.option.minWidth || oWidth;
    const maxHeight = this.option.maxHeight || oHeight;
    const minHeight = this.option.minHeight || oHeight;
    const width = Math.min(maxWidth, Math.max(minWidth, oWidth));
    const height = Math.min(maxHeight, Math.max(minHeight, oHeight));
    return { width, height };
  }

  private applyChange() {
    let containmentRect = { left: 0, top: 0, width: 0, height: 0 };
    if (this.el.style.position === 'absolute') {
      const containmentEl = this.el.parentElement;
      const { left, top } = containmentEl.getBoundingClientRect();
      containmentRect = { left, top, width: 0, height: 0 };
    }
    Object.keys(this.temporalRect || this.originalRect).forEach(key => {
      const value = this.temporalRect[key];
      this.el.style[key] = value - containmentRect[key] + 'px';
    });
  }

  protected removeHandlers() {
    this.handlers.forEach(handle => handle.destory());
    this.handlers = undefined;
  }

  destory() {
    this.removeHandlers();
    if (this.option.autoHide) {
      this.el.removeEventListener('mouseenter', this.showHandlers);
      this.el.removeEventListener('mouseleave', this.hideHandlers);
    }
    this.el.classList.remove('ui-resizable');
    this.el = undefined;
    super.destroy();
  }

  ui = () => {
    const containmentEl = this.el.parentElement;
    const containmentRect = containmentEl.getBoundingClientRect();
    const rect = this.temporalRect || this.originalRect;
    return {
      element: [this.el], // The object representing the element to be resized
      helper: [], // TODO: not support yet // The object representing the helper that's being resized
      originalElement: [this.el],// we dont wrap here, so simplify as this.el //The object representing the original element before it is wrapped
      originalPosition: {
        left: this.originalRect.left - containmentRect.left,
        top: this.originalRect.top - containmentRect.top
      }, // The position represented as { left, top } before the resizable is resized
      originalSize: {
        width: this.originalRect.width,
        height: this.originalRect.height
      },// The size represented as { width, height } before the resizable is resized
      position: {
        left: rect.left - containmentRect.left,
        top: rect.top - containmentRect.top
      }, // The current position represented as { left, top }
      size: {
        width: rect.width,
        height: rect.height
      } // The current size represented as { width, height }
    };
  }
}
