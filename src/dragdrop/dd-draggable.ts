// dd-draggable.ts 2.2.0-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2020 rhlin, Alain Dumesny
 * gridstack.js may be freely distributed under the MIT license.
*/
import { DDManager } from './dd-manager';
import { DDUtils } from './dd-utils';
import { DDBaseImplement, HTMLElementExtendOpt } from './dd-base-impl';

export interface DDDraggableOpt {
  appendTo?: string | HTMLElement;
  containment?: string | HTMLElement; // TODO: not implemented yet
  handle?: string;
  revert?: string | boolean | unknown; // TODO: not implemented yet
  scroll?: boolean; // nature support by HTML5 drag drop, can't be switch to off actually
  helper?: string | ((event: Event) => HTMLElement);
  basePosition?: 'fixed' | 'absolute';
  start?: (event?, ui?) => void;
  stop?: (event?, ui?) => void;
  drag?: (event?, ui?) => void;
};
export class DDDraggable extends DDBaseImplement implements HTMLElementExtendOpt<DDDraggableOpt> {
  static basePosition: 'fixed' | 'absolute' = 'absolute';
  static dragEventListenerOption = DDUtils.isEventSupportPassiveOption ? { capture: true, passive: true } : true;
  static originStyleProp = ['transition', 'pointerEvents', 'position',
    'left', 'top', 'opacity', 'zIndex', 'width', 'height', 'willChange'];
  el: HTMLElement;
  helper: HTMLElement;
  option: DDDraggableOpt;
  dragOffset: {
    left: number;
    top: number;
    width: number;
    height: number;
    offsetLeft: number;
    offsetTop: number;
  };
  dragElementOriginStyle: Array<string>;
  dragFollowTimer: number;
  mouseDownElement: HTMLElement;
  dragging = false;
  paintTimer: number;
  parentOriginStylePosition: string;
  helperContainment: HTMLElement;

  constructor(el: HTMLElement, option: DDDraggableOpt) {
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
    this.setupHelperContainmentStyle();
    this.dragOffset = this.getDragOffset(event, this.el, this.helperContainment);
    const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'dragstart' });
    if (this.helper !== this.el) {
      this.setupDragFollowNodeNNotifyStart(ev);
    } else {
      this.dragFollowTimer = window.setTimeout(() => {
        this.dragFollowTimer = undefined;
        this.setupDragFollowNodeNNotifyStart(ev);
      }, 0);
    }
    this.cancelDragGhost(event);
  }

  protected setupDragFollowNodeNNotifyStart(ev) {
    this.setupHelperStyle();
    document.addEventListener('dragover', this.drag, DDDraggable.dragEventListenerOption);
    this.el.addEventListener('dragend', this.dragEnd);
    if (this.option.start) {
      this.option.start(ev, this.ui());
    }
    this.dragging = true;
    this.helper.classList.add('ui-draggable-dragging');
    this.triggerEvent('dragstart', ev);
  }

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
      if (this.paintTimer) {
        cancelAnimationFrame(this.paintTimer);
      }
      document.removeEventListener('dragover', this.drag, DDDraggable.dragEventListenerOption);
      this.el.removeEventListener('dragend', this.dragEnd);
    }
    this.dragging = false;
    this.helper.classList.remove('ui-draggable-dragging');
    this.helperContainment.style.position = this.parentOriginStylePosition || null;
    if (this.helper === this.el) {
      this.removeHelperStyle();
    } else {
      this.helper.remove();
    }
    const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'dragstop' });
    if (this.option.stop) {
      this.option.stop(ev, this.ui());
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
      this.dragElementOriginStyle = DDDraggable.originStyleProp.map(prop => this.el.style[prop]);
    }
    return helper;
  }

  private setupHelperStyle() {
    this.helper.style.pointerEvents = 'none';
    this.helper.style.width = this.dragOffset.width + 'px';
    this.helper.style.height = this.dragOffset.height + 'px';
    this.helper.style['willChange'] = 'left, top';
    this.helper.style.transition = 'none'; // show up instantly
    this.helper.style.position = this.option.basePosition || DDDraggable.basePosition;
    this.helper.style.zIndex = '1000';
    setTimeout(() => {
      if (this.helper) {
        this.helper.style.transition = null; // recover animation
      }
    }, 0);
  }

  private removeHelperStyle() {
    DDDraggable.originStyleProp.forEach(prop => {
      this.helper.style[prop] = this.dragElementOriginStyle[prop] || null;
    });
    this.dragElementOriginStyle = undefined;
  }

  private dragFollow = (event: DragEvent) => {
    if (this.paintTimer) {
      cancelAnimationFrame(this.paintTimer);
    }
    this.paintTimer = requestAnimationFrame(() => {
      this.paintTimer = undefined;
      const offset = this.dragOffset;
      let containmentRect = { left: 0, top: 0 };
      if (this.helper.style.position === 'absolute') {
        const { left, top } = this.helperContainment.getBoundingClientRect();
        containmentRect = { left, top };
      }
      this.helper.style.left = event.clientX + offset.offsetLeft - containmentRect.left + 'px';
      this.helper.style.top = event.clientY + offset.offsetTop - containmentRect.top + 'px';
    });
  }

  private setupHelperContainmentStyle() {
    this.helperContainment = this.helper.parentElement;
    if (this.option.basePosition !== 'fixed') {
      this.parentOriginStylePosition = this.helperContainment.style.position;
      if (window.getComputedStyle(this.helperContainment).position.match(/static/)) {
        this.helperContainment.style.position = 'relative';
      }
    }
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
    // in case ancestor has transform/perspective css properties that change the viewpoint
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
      // Destroy while dragging should remove dragend listener and manually trigger
      // dragend, otherwise dragEnd can't perform dragstop because eventRegistry is
      // destroyed.
      this.dragEnd({} as DragEvent);
    }
    this.el.draggable = false;
    this.el.classList.remove('ui-draggable');
    this.el.removeEventListener('dragstart', this.dragStart);
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
      offset: { top: offset.top, left: offset.left } // Current offset position of the helper as { top, left } object.
    };
  }
}


