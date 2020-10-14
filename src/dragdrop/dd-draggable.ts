// dd-draggable.ts 2.0.2-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2020 Alain Dumesny, rhlin
 * gridstack.js may be freely distributed under the MIT license.
*/
import { DDManager } from './dd-manager';
import { DDUtils } from './dd-utils';
import { DDBaseImplement, HTMLElementExtendOpt } from './dd-base-impl';

export interface DDDraggbleOpt {
  appendTo?: string | HTMLElement;
  containment?: string | HTMLElement;
  handle?: string;
  revert?: string | boolean | unknown; // TODO: not impleament yet
  scroll?: boolean; // nature support by HTML5 drag drop, can't be switch to off actually
  helper?: string | ((event: Event) => HTMLElement);
  start?: (event?, ui?) => void;
  stop?: (event?, ui?) => void;
  drag?: (event?, ui?) => void;
};
export class DDDraggble extends DDBaseImplement implements HTMLElementExtendOpt<DDDraggbleOpt> {
  static originStyleProp = ['transition','pointerEvents', 'position',
    'left', 'top', 'opacity', 'zIndex', 'width', 'height'];
  el: HTMLElement;
  helper: HTMLElement;
  option: DDDraggbleOpt;
  dragOffset;
  dragElementOriginStyle;
  dragFollowTimer;
  mouseDownElement: HTMLElement;
  dragging = false;

  constructor(el: HTMLElement, option: DDDraggbleOpt) {
    super();
    this.el = el;
    this.option = option || {};
    this.init();
  }

  on(event: 'drag' | 'dragstart' | 'dragstop', callback: (event: DragEvent) => void): void {
    super.on(event, callback);
  }

  off(event: 'drag' | 'dragstart' | 'dragstop') {
    super.off(event);
  }

  enable() {
    super.enable();
    this.el.draggable = true;
    this.el.classList.remove('ui-draggable-disabled');
  }

  disable() {
    super.disable();
    this.el.draggable = false;
    this.el.classList.add('ui-draggable-disabled');
  }

  updateOption(opts) {
    Object.keys(opts).forEach(key => {
      const value = opts[key];
      this.option[key] = value;
    });
  }

  protected init() {
    this.el.draggable = true;
    this.el.classList.add('ui-draggable');
    this.el.addEventListener('mousedown', this.mouseDown);
    this.el.addEventListener('dragstart', this.dragStart);
    this.el.addEventListener('dragend', this.dragEnd);
    this.dragThrottle = DDUtils.throttle(this.drag, 100);
  }

  protected mouseDown = (event: MouseEvent) => {
    this.mouseDownElement = event.target as HTMLElement;
  }

  protected dragStart = (event: DragEvent) => {
    if (this.option.handle && !(
      this.mouseDownElement
      && this.mouseDownElement.matches(
        `${this.option.handle}, ${this.option.handle} > *`
      )
    )) {
      event.preventDefault();
      return;
    }
    DDManager.dragElement = this;
    this.helper = this.createHelper(event);
    this.dragOffset = this.getDragOffset(event, this.el, this.helper.parentElement);
    const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'dragstart' });
    if (this.helper !== this.el) {
      this.setupDragFollowNodeNNotifyStart(ev);
    } else {
      this.dragFollowTimer = setTimeout(() => {
        this.dragFollowTimer = undefined;
        this.setupDragFollowNodeNNotifyStart(ev);
      }, 0);
    }
    this.cancelDragGhost(event);
  }

  protected setupDragFollowNodeNNotifyStart(ev) {
    this.setupHelperStyle();
    document.addEventListener('dragover', this.dragThrottle, true);
    if (this.option.start) {
      this.option.start(ev, this.ui());
    }
    this.triggerEvent('dragstart', ev);
    this.dragging = true;
    this.el.classList.add('ui-draggable-dragging');
  }

  protected dragThrottle: (event: DragEvent) => void;
  protected drag = (event: DragEvent) => {
    this.dragFollow(event);
    const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'drag' });
    if (this.option.drag) {
      this.option.drag(ev, this.ui());
    }
    this.triggerEvent('drag', ev);
  }

  protected dragEnd = (event: DragEvent) => {
    if (this.dragFollowTimer) {
      clearTimeout(this.dragFollowTimer);
      this.dragFollowTimer = undefined;
      return;
    } else {
      document.removeEventListener('dragover', this.dragThrottle, true);
    }
    this.dragging = false;
    this.el.classList.remove('ui-draggable-dragging');
    if (this.helper === this.el) {
      this.removeHelperStyle();
    } else {
      this.helper.remove();
    }
    const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'dragstop' });
    if (this.option.stop) {
      this.option.stop(ev, this.ui())
    }
    this.triggerEvent('dragstop', ev);
    DDManager.dragElement = undefined;
    this.helper = undefined;
    this.mouseDownElement = undefined;
  }

  private createHelper(event: DragEvent) {
    const helperIsFunction = (typeof this.option.helper) === 'function';
    const helper = (helperIsFunction
      ? (this.option.helper as ((event: Event) => HTMLElement)).apply(this.el, [event])
      : (this.option.helper === "clone" ? DDUtils.clone(this.el) : this.el)
    ) as HTMLElement;
    if (!document.body.contains(helper)) {
      DDUtils.appendTo(helper, (this.option.appendTo === "parent"
        ? this.el.parentNode
        : this.option.appendTo));
    }
    if (helper === this.el) {
      this.dragElementOriginStyle = DDDraggble.originStyleProp.map(prop => this.el.style[prop]);
    }
    return helper;
  }

  private setupHelperStyle() {
    this.helper.style.pointerEvents = 'none';
    this.helper.style.width = this.dragOffset.width + 'px';
    this.helper.style.height = this.dragOffset.height + 'px';
    this.helper.style.transition = 'none'; // show up instancely
    this.helper.style.position = 'fixed';
    this.helper.style.zIndex = '1000';
    // won't be neccessary
    // this.helper.style.opacity = '0.8';
    setTimeout(()=>{
      this.helper.style.transition = null; // recover animation
    }, 100);
  }

  private removeHelperStyle() {
    DDDraggble.originStyleProp.forEach(prop => {
      this.helper.style[prop] = this.dragElementOriginStyle[prop] || null;
    });
    this.dragElementOriginStyle = undefined;
  }

  private dragFollow = (event: DragEvent) => {
    const offset = this.dragOffset;
    this.helper.style.left = event.clientX + offset.offsetLeft + 'px';
    this.helper.style.top = event.clientY + offset.offsetTop + 'px';
  }

  private cancelDragGhost(e: DragEvent) {
    if (e.dataTransfer != null) {
      e.dataTransfer.setData('text', '');
    }
    e.dataTransfer.effectAllowed = 'move';
    if ('function' === typeof DataTransfer.prototype.setDragImage) {
      e.dataTransfer.setDragImage(new Image(), 0, 0);
    } else {
      // ie
      (e.target as HTMLElement).style.display = 'none';
      setTimeout(() => {
        (e.target as HTMLElement).style.display = '';
      });
      e.stopPropagation();
      return;
    }
    e.stopPropagation();
  }

  private getDragOffset(event: DragEvent, el: HTMLElement, attachedParent: HTMLElement) {
    // in case ancestor has transform/perspective css properies that change the viewpoint
    const getViewPointFromParent = (parent) => {
      if (!parent) { return null; }
      const testEl = document.createElement('div');
      DDUtils.addElStyles(testEl, {
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
      return {
        offsetX: testElPosition.left,
        offsetY: testElPosition.top
      };
    }
    const targetOffset = el.getBoundingClientRect();
    const mousePositionXY = {
      x: event.clientX,
      y: event.clientY
    };
    const transformOffset = getViewPointFromParent(attachedParent);
    return {
      left: targetOffset.left,
      top: targetOffset.top,
      offsetLeft: - mousePositionXY.x + targetOffset.left - transformOffset.offsetX,
      offsetTop: - mousePositionXY.y + targetOffset.top - transformOffset.offsetY,
      width: targetOffset.width,
      height: targetOffset.height
    };
  }
  destroy() {
    if (this.dragging) {
      // Destroy while draggging should remove dragend listener and manally trigger
      // dragend, otherwise dragEnd can't perform dragstop becasue eventResistry is
      // destoryed.
      this.el.removeEventListener('dragend', this.dragEnd);
      this.dragEnd({} as DragEvent);
    }
    this.el.draggable = false;
    this.el.classList.remove('ui-draggable');
    this.el.removeEventListener('dragstart', this.dragStart);
    this.el.removeEventListener('dragend', this.dragEnd);
    this.el = undefined;
    this.helper = undefined;
    this.option = undefined;
    super.destroy();
  }

  ui = () => {
    const containmentEl = this.el.parentElement;
    const containmentRect = containmentEl.getBoundingClientRect();
    const offset = this.helper.getBoundingClientRect();
    return {
      helper: [this.helper], //The object arr representing the helper that's being dragged.
      position: {
        top: offset.top - containmentRect.top,
        left: offset.left - containmentRect.left
      }, //Current CSS position of the helper as { top, left } object
      offset: { top: offset.top, left: offset.left }// Current offset position of the helper as { top, left } object.
    };
  }
}


