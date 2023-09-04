/**
 * dd-draggable.ts 9.0.2-dev
 * Copyright (c) 2021-2022 Alain Dumesny - see GridStack root license
 */

import { DDManager } from './dd-manager';
import { Utils } from './utils';
import { DDBaseImplement, HTMLElementExtendOpt } from './dd-base-impl';
import { GridItemHTMLElement, DDUIData } from './types';
import { DDElementHost } from './dd-element';
import { isTouch, touchend, touchmove, touchstart, pointerdown } from './dd-touch';

// TODO: merge with DDDragOpt ?
export interface DDDraggableOpt {
  appendTo?: string | HTMLElement;
  handle?: string;
  helper?: 'clone' | HTMLElement | ((event: Event) => HTMLElement);
  cancel?: string;
  // containment?: string | HTMLElement; // TODO: not implemented yet
  // revert?: string | boolean | unknown; // TODO: not implemented yet
  // scroll?: boolean;
  start?: (event: Event, ui: DDUIData) => void;
  stop?: (event: Event) => void;
  drag?: (event: Event, ui: DDUIData) => void;
}

type DDDragEvent = 'drag' | 'dragstart' | 'dragstop';

// make sure we are not clicking on known object that handles mouseDown
const skipMouseDown = 'input,textarea,button,select,option,[contenteditable="true"],.ui-resizable-handle';

// let count = 0; // TEST

export class DDDraggable extends DDBaseImplement implements HTMLElementExtendOpt<DDDraggableOpt> {
  public el: HTMLElement;
  public option: DDDraggableOpt;
  public helper: HTMLElement; // used by GridStackDDNative

  /** @internal */
  protected mouseDownEvent: MouseEvent;
  /** @internal */
  protected dragElementOriginStyle: Array<string>;
  /** @internal */
  protected dragEl: HTMLElement;
  /** @internal true while we are dragging an item around */
  protected dragging: boolean;
  /** @internal */
  protected parentOriginStylePosition: string;
  /** @internal */
  protected helperContainment: HTMLElement;
  /** @internal properties we change during dragging, and restore back */
  protected static originStyleProp = ['transition', 'pointerEvents', 'position', 'left', 'top', 'minWidth', 'willChange'];
  /** @internal pause before we call the actual drag hit collision code */
  protected dragTimeout: number;
  protected _originalMousePositionInsideElement: { x: number; y: number; };

  constructor(el: HTMLElement, option: DDDraggableOpt = {}) {
    super();
    this.el = el;
    this.option = option;

    // get the element that is actually supposed to be dragged by
    let handleName = option.handle.substring(1);
    this.dragEl = el.classList.contains(handleName) ? el : el.querySelector(option.handle) || el;
    // create var event binding so we can easily remove and still look like TS methods (unlike anonymous functions)
    this._mouseDown = this._mouseDown.bind(this);
    this._mouseMove = this._mouseMove.bind(this);
    this._mouseUp = this._mouseUp.bind(this);
    this.enable();
  }

  public on(event: DDDragEvent, callback: (event: DragEvent) => void): void {
    super.on(event, callback);
  }

  public off(event: DDDragEvent): void {
    super.off(event);
  }

  public enable(): void {
    if (this.disabled === false) return;
    super.enable();
    this.dragEl.addEventListener('mousedown', this._mouseDown);
    if (isTouch) {
      this.dragEl.addEventListener('touchstart', touchstart);
      this.dragEl.addEventListener('pointerdown', pointerdown);
      // this.dragEl.style.touchAction = 'none'; // not needed unlike pointerdown doc comment
    }
    this.el.classList.remove('ui-draggable-disabled');
  }

  public disable(forDestroy = false): void {
    if (this.disabled === true) return;
    super.disable();
    this.dragEl.removeEventListener('mousedown', this._mouseDown);
    if (isTouch) {
      this.dragEl.removeEventListener('touchstart', touchstart);
      this.dragEl.removeEventListener('pointerdown', pointerdown);
    }
    if (!forDestroy) this.el.classList.add('ui-draggable-disabled');
  }

  public destroy(): void {
    if (this.dragTimeout) window.clearTimeout(this.dragTimeout);
    delete this.dragTimeout;
    if (this.dragging) this._mouseUp(this.mouseDownEvent);
    this.disable(true);
    delete this.el;
    delete this.helper;
    delete this.option;
    super.destroy();
  }

  public updateOption(opts: DDDraggableOpt): DDDraggable {
    Object.keys(opts).forEach(key => this.option[key] = opts[key]);
    return this;
  }

  /** @internal call when mouse goes down before a dragstart happens */
  protected _mouseDown(e: MouseEvent): boolean {
    // don't let more than one widget handle mouseStart
    if (DDManager.mouseHandled) return;
    if (e.button !== 0) return true; // only left click

    // make sure we are not clicking on known object that handles mouseDown, or ones supplied by the user
    if ((e.target as HTMLElement).closest(skipMouseDown)) return true;
    if (this.option.cancel) {
      if ((e.target as HTMLElement).closest(this.option.cancel)) return true;
    }

    // REMOVE: why would we get the event if it wasn't for us or child ?
    // make sure we are clicking on a drag handle or child of it...
    // Note: we don't need to check that's handle is an immediate child, as mouseHandled will prevent parents from also handling it (lowest wins)
    // let className = this.option.handle.substring(1);
    // let el = e.target as HTMLElement;
    // while (el && !el.classList.contains(className)) { el = el.parentElement; }
    // if (!el) return;

    this.mouseDownEvent = e;
    delete this.dragging;
    delete DDManager.dragElement;
    delete DDManager.dropElement;
    // document handler so we can continue receiving moves as the item is 'fixed' position, and capture=true so WE get a first crack
    document.addEventListener('mousemove', this._mouseMove, true); // true=capture, not bubble
    document.addEventListener('mouseup', this._mouseUp, true);
    if (isTouch) {
      this.dragEl.addEventListener('touchmove', touchmove);
      this.dragEl.addEventListener('touchend', touchend);
    }

    e.preventDefault();
    // preventDefault() prevents blur event which occurs just after mousedown event.
    // if an editable content has focus, then blur must be call
    if (document.activeElement) (document.activeElement as HTMLElement).blur();

    DDManager.mouseHandled = true;
    return true;
  }

  /** @internal method to call actual drag event */
  protected _callDrag(e: DragEvent): void {
    if (!this.dragging) return;
    const ev = Utils.initEvent<DragEvent>(e, { target: this.el, type: 'drag' });
    if (this.option.drag) {
      this.option.drag(ev, this.ui());
    }
    this.triggerEvent('drag', ev);
  }

  /** @internal called when the main page (after successful mousedown) receives a move event to drag the item around the screen */
  protected _mouseMove(e: DragEvent): boolean {
    // console.log(`${count++} move ${e.x},${e.y}`)
    let s = this.mouseDownEvent;

    if (this.dragging) {
      this._dragFollow(e);
      // delay actual grid handling drag until we pause for a while if set
      if (DDManager.pauseDrag) {
        const pause = Number.isInteger(DDManager.pauseDrag) ? DDManager.pauseDrag as number : 100;
        if (this.dragTimeout) window.clearTimeout(this.dragTimeout);
        this.dragTimeout = window.setTimeout(() => this._callDrag(e), pause);
      } else {
        this._callDrag(e);
      }
    } else if (Math.abs(e.x - s.x) + Math.abs(e.y - s.y) > 3) {
      let node = (this.el as GridItemHTMLElement)?.gridstackNode;
      if (node) {
        const rect = this.el.getBoundingClientRect();
        node._originalMousePositionInsideElement = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }
      /**
       * don't start unless we've moved at least 3 pixels
       */
      this.dragging = true;
      DDManager.dragElement = this;
      // if we're dragging an actual grid item, set the current drop as the grid (to detect enter/leave)
      let grid = (this.el as GridItemHTMLElement).gridstackNode?.grid;
      if (grid) {
        DDManager.dropElement = (grid.el as DDElementHost).ddElement.ddDroppable;
      } else {
        delete DDManager.dropElement;
      }
      if (node) {
        const rect = this.el.getBoundingClientRect();
        this._originalMousePositionInsideElement = { x: s.clientX - rect.left, y: s.clientY - rect.top };
      }
      this.helper = this._createHelper(e);
      this._setupHelperContainmentStyle();
      const ev = Utils.initEvent<DragEvent>(e, { target: this.el, type: 'dragstart' });

      this._setupHelperStyle(e);
      if (this.option.start) {
        this.option.start(ev, this.ui());
      }
      this.triggerEvent('dragstart', ev);
    }
    e.preventDefault(); // needed otherwise we get text sweep text selection as we drag around
    return true;
  }

  /** @internal call when the mouse gets released to drop the item at current location */
  protected _mouseUp(e: MouseEvent): void {
    document.removeEventListener('mousemove', this._mouseMove, true);
    document.removeEventListener('mouseup', this._mouseUp, true);
    if (isTouch) {
      this.dragEl.removeEventListener('touchmove', touchmove, true);
      this.dragEl.removeEventListener('touchend', touchend, true);
    }
    if (this.dragging) {
      delete this.dragging;

      // reset the drop target if dragging over ourself (already parented, just moving during stop callback below)
      if (DDManager.dropElement?.el === this.el.parentElement) {
        delete DDManager.dropElement;
      }

      this.helperContainment.style.position = this.parentOriginStylePosition || null;
      if (this.helper === this.el) {
        this._removeHelperStyle();
      } else {
        this.helper.remove();
      }
      const ev = Utils.initEvent<DragEvent>(e, { target: this.el, type: 'dragstop' });
      if (this.option.stop) {
        this.option.stop(ev); // NOTE: destroy() will be called when removing item, so expect NULL ptr after!
      }
      this.triggerEvent('dragstop', ev);

      // call the droppable method to receive the item
      if (DDManager.dropElement) {
        DDManager.dropElement.drop(e);
      }
    }
    delete this.helper;
    delete this.mouseDownEvent;
    delete DDManager.dragElement;
    delete DDManager.dropElement;
    delete DDManager.mouseHandled;
    e.preventDefault();
  }

  /** @internal create a clone copy (or user defined method) of the original drag item if set */
  protected _createHelper(event: DragEvent): HTMLElement {
    let helper = this.el;
    if (typeof this.option.helper === 'function') {
      helper = this.option.helper(event);
    } else if (this.option.helper === 'clone') {
      helper = Utils.cloneNode(this.el);
    }
    if (!document.body.contains(helper)) {
      Utils.appendTo(helper, this.option.appendTo === 'parent' ? this.el.parentElement : this.option.appendTo);
    }
    if (helper === this.el) {
      this.dragElementOriginStyle = DDDraggable.originStyleProp.map(prop => this.el.style[prop]);
    }
    return helper;
  }

  /** @internal set the fix position of the dragged item */
  protected _setupHelperStyle(e: DragEvent): DDDraggable {
    this.helper.classList.add('ui-draggable-dragging');
    // TODO: set all at once with style.cssText += ... ? https://stackoverflow.com/questions/3968593
    const style = this.helper.style;
    style.pointerEvents = 'none'; // needed for over items to get enter/leave
    // style.cursor = 'move'; //  TODO: can't set with pointerEvents=none ! (done in CSS as well)
    style.width = this.el.offsetWidth + 'px';
    style.height = this.el.offsetHeight + 'px';

    style.willChange = 'left, top';
    style.position = 'fixed'; // let us drag between grids by not clipping as parent .grid-stack is position: 'relative'
    this._dragFollow(e); // now position it
    style.transition = 'none'; // show up instantly
    setTimeout(() => {
      if (this.helper) {
        style.transition = null; // recover animation
      }
    }, 0);
    return this;
  }

  /** @internal restore back the original style before dragging */
  protected _removeHelperStyle(): DDDraggable {
    this.helper.classList.remove('ui-draggable-dragging');
    let node = (this.helper as GridItemHTMLElement)?.gridstackNode;
    // don't bother restoring styles if we're gonna remove anyway...
    if (!node?._isAboutToRemove && this.dragElementOriginStyle) {
      let helper = this.helper;
      // don't animate, otherwise we animate offseted when switching back to 'absolute' from 'fixed'.
      // TODO: this also removes resizing animation which doesn't have this issue, but others.
      // Ideally both would animate ('move' would immediately restore 'absolute' and adjust coordinate to match,
      // then trigger a delay (repaint) to restore to final dest with animate) but then we need to make sure 'resizestop'
      // is called AFTER 'transitionend' event is received (see https://github.com/gridstack/gridstack.js/issues/2033)
      let transition = this.dragElementOriginStyle['transition'] || null;
      helper.style.transition = this.dragElementOriginStyle['transition'] = 'none'; // can't be NULL #1973
      DDDraggable.originStyleProp.forEach(prop => helper.style[prop] = this.dragElementOriginStyle[prop] || null);
      setTimeout(() => helper.style.transition = transition, 50); // recover animation from saved vars after a pause (0 isn't enough #1973)
    }
    delete this.dragElementOriginStyle;
    return this;
  }

  /** @internal updates the top/left position to follow the mouse */
  protected _dragFollow(e: DragEvent): void {
    const style = this.helper.style;
    const { scaleX, scaleY } = Utils.getScaleForElement(this.helper);
    // when an element is scaled, the helper is positioned relative to it's parent, so we need to remove the extra offset
    const containementRect = this.helperContainment.getBoundingClientRect();
    const offsetX = scaleX === 1 ? 0 : containementRect.left;
    const offsetY = scaleY === 1 ? 0 : containementRect.top;

    // Position the element under the mouse
    const x = (e.clientX - offsetX - (this._originalMousePositionInsideElement?.x || 0)) / scaleX;
    const y = (e.clientY - offsetY - (this._originalMousePositionInsideElement?.y || 0)) / scaleY;
    style.left = `${x}px`;
    style.top = `${y}px`;
  }

  /** @internal */
  protected _setupHelperContainmentStyle(): DDDraggable {
    this.helperContainment = this.helper.parentElement;
    if (this.helper.style.position !== 'fixed') {
      this.parentOriginStylePosition = this.helperContainment.style.position;
      if (window.getComputedStyle(this.helperContainment).position.match(/static/)) {
        this.helperContainment.style.position = 'relative';
      }
    }
    return this;
  }

  /** @internal TODO: set to public as called by DDDroppable! */
  public ui(): DDUIData {
    const containmentEl = this.el.parentElement;
    const containmentRect = containmentEl.getBoundingClientRect();
    const offset = this.helper.getBoundingClientRect();
    const { scaleX, scaleY } = Utils.getScaleForElement(this.helper);

    return {
      position: { // Current CSS position of the helper as { top, left } object
        top: (offset.top - containmentRect.top) / scaleY,
        left: (offset.left - containmentRect.left) / scaleX,
      }
      /* not used by GridStack for now...
      helper: [this.helper], //The object arr representing the helper that's being dragged.
      offset: { top: offset.top, left: offset.left } // Current offset position of the helper as { top, left } object.
      */
    };
  }
}
