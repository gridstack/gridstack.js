/**
 * dd-draggable.ts 13.0.1
 * Copyright (c) 2021-2025  Alain Dumesny - see GridStack root license
 */

import { DDManager } from './dd-manager';
import { DragTransform, Utils } from './utils';
import { DDBaseImplement, HTMLElementExtendOpt } from './dd-base-impl';
import { GridItemHTMLElement, DDUIData, GridStackNode, GridStackPosition, DDDragOpt } from './types';
import { DDElementHost } from './dd-element';
import { isTouch, touchend, touchmove, touchstart, pointerdown, DDTouch } from './dd-touch';
import { GridHTMLElement } from './gridstack';

interface DragOffset {
  x: number;
  top: number;
  width: number;
  height: number;
  offsetX: number;
  offsetTop: number;
}

interface GridStackNodeRotate extends GridStackNode {
  _origRotate?: GridStackPosition;
}

type DDDragEvent = 'drag' | 'dragstart' | 'dragstop';

// make sure we are not clicking on known object that handles mouseDown
const skipMouseDown = 'input,textarea,button,select,option,[contenteditable="true"],.ui-resizable-handle';

// let count = 0; // TEST

export class DDDraggable extends DDBaseImplement implements HTMLElementExtendOpt<DDDragOpt> {
  /** @internal set during drag start, cleared on drag stop; also used by GridStackDDNative */
  public helper?: HTMLElement;

  /** @internal set during mousedown, cleared on mouseup */
  protected mouseDownEvent?: MouseEvent;
  /** @internal */
  protected dragOffset!: DragOffset;
  /** @internal set during drag start, cleared on drag stop */
  protected dragElementOriginStyle?: Array<string>;
  /** @internal */
  protected dragEls!: HTMLElement[];
  /** @internal true while we are dragging an item around */
  public dragging?: boolean;
  /** @internal last drag event */
  public lastDrag!: MouseEvent;
  /** @internal */
  protected parentOriginStylePosition!: string;
  /** @internal */
  protected helperContainment!: HTMLElement;
  /** @internal properties we change during dragging, and restore back */
  protected static originStyleProp = ['width', 'height', 'transform', 'transform-origin', 'transition', 'pointerEvents', 'position', 'left', 'right', 'top', 'minWidth', 'willChange'];
  /** @internal pause before we call the actual drag hit collision code */
  protected dragTimeout?: number;
  /** @internal */
  protected dragTransform: DragTransform = {
    xScale: 1,
    yScale: 1,
    xOffset: 0,
    yOffset: 0
  };
  /** @internal auto-scroll animation variables */
  protected _autoScrollAnimId?: number;
  protected _autoScrollContainer?: HTMLElement;
  protected _autoScrollMaxSpeed?: number;

  constructor(public el: GridItemHTMLElement, public option: DDDragOpt = {}) {
    super();

    // get the element that is actually supposed to be dragged by
    const handleName = option?.handle?.substring(1);
    const n = el.gridstackNode;
    this.dragEls = !handleName || el.classList.contains(handleName) ? [el] : (n?.subGrid ? [el.querySelector<HTMLElement>(option.handle!) || el] : this.getAllHandles());
    if (this.dragEls.length === 0) {
      this.dragEls = [el];
    }
    // create var event binding so we can easily remove and still look like TS methods (unlike anonymous functions)
    this._mouseDown = this._mouseDown.bind(this);
    this._mouseMove = this._mouseMove.bind(this);
    this._mouseUp = this._mouseUp.bind(this);
    this._keyEvent = this._keyEvent.bind(this);
    this.enable();
  }

  /** return all handles omitting other nested `.grid-stack-item` children (in case node.subGrid isn't set for some reason) */
  protected getAllHandles(): HTMLElement[] {
    return Array.from(this.el.querySelectorAll(this.option.handle!)).filter((node): node is HTMLElement => {
      if (!(node instanceof HTMLElement)) return false;
      const owner = node.closest('.grid-stack-item');
      return owner === this.el || !owner;
    });
  }

  public override on(event: DDDragEvent, callback: (event: MouseEvent) => void): void {
    super.on(event, callback as (event: Event) => void);
  }

  public override off(event: DDDragEvent): void {
    super.off(event);
  }

  public override enable(): void {
    if (this.disabled === false) return;
    super.enable();
    this.dragEls.forEach(dragEl => {
      dragEl.addEventListener('mousedown', this._mouseDown);
      if (isTouch) {
        dragEl.addEventListener('touchstart', touchstart);
        dragEl.addEventListener('pointerdown', pointerdown);
        // dragEl.style.touchAction = 'none'; // not needed unlike pointerdown doc comment
      }
    });
    this.el.classList.remove('ui-draggable-disabled');
  }

  public override disable(forDestroy = false): void {
    if (this.disabled === true) return;
    super.disable();
    this.dragEls.forEach(dragEl => {
      dragEl.removeEventListener('mousedown', this._mouseDown);
      if (isTouch) {
        dragEl.removeEventListener('touchstart', touchstart);
        dragEl.removeEventListener('pointerdown', pointerdown);
      }
    });
    if (!forDestroy) this.el.classList.add('ui-draggable-disabled');
  }

  public override destroy(): void {
    if (this.dragTimeout) window.clearTimeout(this.dragTimeout);
    delete this.dragTimeout;
    if (this.mouseDownEvent) this._mouseUp(this.mouseDownEvent);
    this.disable(true);
    delete (this as Partial<DDDraggable>).el;
    delete (this as Partial<DDDraggable>).option;
    super.destroy();
  }

  public updateOption(opts: DDDragOpt): DDDraggable {
    Object.assign(this.option, opts);
    return this;
  }

  /**
   * Re-scans the item element for drag-handle elements after delayed content (React portal,
   * Angular component, etc.) has been rendered into the item.  Removes listeners from the
   * previous handle set, re-queries, then re-attaches.
   * Not needed for the default `.grid-stack-item-content` handle which is always present.
   */
  public refreshHandles(): void {
    const wasDisabled = this.disabled;
    // Remove listeners from the current (possibly stale) handle elements.
    if (!wasDisabled) this.disable(true); // forDestroy=true skips the CSS class toggle
    // Re-query handles now that framework content is in the DOM.
    const handleName = this.option?.handle?.substring(1);
    const n = this.el.gridstackNode;
    this.dragEls = !handleName || this.el.classList.contains(handleName)
      ? [this.el]
      : (n?.subGrid ? [this.el.querySelector<HTMLElement>(this.option.handle!) || this.el] : this.getAllHandles());
    if (this.dragEls.length === 0) this.dragEls = [this.el];
    // Restore previous enabled/disabled state with the new handle set.
    if (!wasDisabled) this.enable();
  }

  /** @internal call when mouse goes down before a dragstart happens */
  protected _mouseDown(e: MouseEvent): boolean {
    // if real browser event (trusted:true vs false for our simulated ones) and prior touch/mouse state didn't clean up, reset it.
    // Only reset mouseHandled when the timeStamp differs from the current event — a different timeStamp means this is a new user
    // interaction where a prior drag didn't clean up. The same timeStamp means this _mouseDown is a bubble of the very same click
    // that a deeper nested item already handled, so we must NOT reset the flag (that would let the parent steal the drag).
    if (e.isTrusted) {
      if (DDTouch.touchHandled) DDTouch.touchHandled = false;
      if (DDManager.mouseHandled && e.timeStamp !== DDManager.mouseHandledTimeStamp) delete DDManager.mouseHandled; // stale from incomplete prior drag
    }

    // don't let more than one widget handle mouseStart
    if (DDManager.mouseHandled) return true;
    if (e.button !== 0) return true; // only left click

    // make sure we are not clicking on known object that handles mouseDown, or ones supplied by the user
    if (!this.dragEls.find(el => el === e.target) && (e.target as HTMLElement).closest(skipMouseDown)) return true;
    if (this.option.cancel) {
      if ((e.target as HTMLElement).closest(this.option.cancel)) return true;
    }

    this.mouseDownEvent = e;
    delete this.dragging;
    delete DDManager.dragElement;
    delete DDManager.dropElement;
    delete this._autoScrollMaxSpeed;
    delete this._autoScrollContainer;
    // document handler so we can continue receiving moves as the item is 'fixed' position, and capture=true so WE get a first crack
    document.addEventListener('mousemove', this._mouseMove, { capture: true, passive: true }); // true=capture, not bubble
    document.addEventListener('mouseup', this._mouseUp as EventListener, true);
    if (isTouch && e.currentTarget) {
      (e.currentTarget as HTMLElement).addEventListener('touchmove', touchmove);
      (e.currentTarget as HTMLElement).addEventListener('touchend', touchend);
    }

    e.preventDefault();
    // preventDefault() prevents blur event which occurs just after mousedown event.
    // if an editable content has focus, then blur must be call
    if (document.activeElement) (document.activeElement as HTMLElement).blur();

    DDManager.mouseHandled = true;
    DDManager.mouseHandledTimeStamp = e.timeStamp;
    return true;
  }

  /** @internal method to call actual drag event */
  public _callDrag(e: MouseEvent): void {
    if (!this.dragging) return;
    const ev = Utils.initEvent<MouseEvent>(e, { target: this.el, type: 'drag' });
    if (this.option.drag) {
      this.option.drag(ev, this.ui());
    }
    this.triggerEvent('drag', ev);
  }

  /** @internal called when the main page (after successful mousedown) receives a move event to drag the item around the screen */
  protected _mouseMove(e: MouseEvent): boolean {
    // console.log(`${count++} move ${e.x},${e.y}`)
    const s = this.mouseDownEvent!;
    this.lastDrag = e;

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
      /**
       * don't start unless we've moved at least 3 pixels
       */
      this.dragging = true;
      DDManager.dragElement = this;
      // if we're dragging an actual grid item, set the current drop as the grid (to detect enter/leave)
      const grid = this.el.gridstackNode?.grid;
      if (grid) {
        DDManager.dropElement = (grid.el as DDElementHost).ddElement?.ddDroppable;
      } else {
        delete DDManager.dropElement;
      }
      this.helper = this._createHelper();
      this._setupHelperContainmentStyle();
      this.dragTransform = Utils.getValuesFromTransformedElement(this.helperContainment);
      this.dragOffset = this._getDragOffset(e, this.el, this.helperContainment);
      this._setupHelperStyle(e);

      const ev = Utils.initEvent<MouseEvent>(e, { target: this.el, type: 'dragstart' });
      if (this.option.start) {
        this.option.start(ev, this.ui());
      }
      this.triggerEvent('dragstart', ev);
      // now track keyboard events to cancel or rotate
      document.addEventListener('keydown', this._keyEvent);
    }
    // e.preventDefault(); // passive = true. OLD: was needed otherwise we get text sweep text selection as we drag around
    return true;
  }

  /** @internal call when the mouse gets released to drop the item at current location */
  protected _mouseUp(e: MouseEvent): void {
    this._stopScrolling();
    document.removeEventListener('mousemove', this._mouseMove, true);
    document.removeEventListener('mouseup', this._mouseUp as EventListener, true);
    if (isTouch && e.currentTarget) { // destroy() during nested grid call us again wit fake _mouseUp
      e.currentTarget.removeEventListener('touchmove', touchmove as EventListener, true);
      e.currentTarget.removeEventListener('touchend', touchend as EventListener, true);
    }
    if (this.dragging) {
      delete this.dragging;
      delete (this.el.gridstackNode as GridStackNodeRotate)?._origRotate;
      document.removeEventListener('keydown', this._keyEvent);

      // reset the drop target if dragging over ourself (already parented, just moving during stop callback below)
      if (DDManager.dropElement?.el === this.el.parentElement) {
        delete DDManager.dropElement;
      }

      this.helperContainment.style.position = this.parentOriginStylePosition || null!;
      if (this.helper && this.helper !== this.el) this.helper.remove(); // hide now
      this._removeHelperStyle();

      const ev = Utils.initEvent<MouseEvent>(e, { target: this.el, type: 'dragstop' });
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
    delete DDManager.mouseHandledTimeStamp;
    e.preventDefault();
  }

  /** @internal call when keys are being pressed - use Esc to cancel, R to rotate */
  protected _keyEvent(e: KeyboardEvent): void {
    const n = this.el.gridstackNode as GridStackNodeRotate;
    const grid = n?.grid || (DDManager.dropElement?.el as GridHTMLElement)?.gridstack;

    if (e.key === 'Escape') {
      if (n && n._origRotate) {
        n._orig = n._origRotate;
        delete n._origRotate;
      }
      grid?.cancelDrag();
      this._mouseUp(this.mouseDownEvent!);
    } else if (n && grid && (e.key === 'r' || e.key === 'R')) {
      if (!Utils.canBeRotated(n)) return;
      n._origRotate = n._origRotate || { ...n._orig }; // store the real orig size in case we Esc after doing rotation
      delete n._moving; // force rotate to happen (move waits for >50% coverage otherwise)
      grid.setAnimation(false) // immediate rotate so _getDragOffset() gets the right dom size below
        .rotate(n.el!, {
          top: -this.dragOffset.offsetTop,
          left: -this.dragOffset.offsetX
        })
        .setAnimation();
      n._moving = true;
      this.dragOffset = this._getDragOffset(this.lastDrag, n.el!, this.helperContainment);
      this.helper!.style.width = this.dragOffset.width + 'px';
      this.helper!.style.height = this.dragOffset.height + 'px';
      Utils.swap(n._orig, 'w', 'h');
      delete n._rect;
      this._mouseMove(this.lastDrag);
    }
  }

  /** @internal create a clone copy (or user defined method) of the original drag item if set */
  protected _createHelper(): HTMLElement {
    let helper = this.el;
    if (typeof this.option.helper === 'function') {
      helper = this.option.helper(this.el);
    } else if (this.option.helper === 'clone') {
      helper = Utils.cloneNode(this.el);
    }
    if (!helper.parentElement) {
      Utils.appendTo(helper, this.option.appendTo === 'parent' ? this.el.parentElement! : (this.option.appendTo ?? 'body'));
    }
    this.dragElementOriginStyle = DDDraggable.originStyleProp.map(prop => (this.el.style as unknown as Record<string, string>)[prop]);
    return helper;
  }

  /** @internal set the fix position of the dragged item */
  protected _setupHelperStyle(e: MouseEvent): DDDraggable {
    this.helper!.classList.add('ui-draggable-dragging');
    this.el.gridstackNode?.grid?.el.classList.add('grid-stack-dragging');
    // TODO: set all at once with style.cssText += ... ? https://stackoverflow.com/questions/3968593
    const style = this.helper!.style;
    style.pointerEvents = 'none'; // needed for over items to get enter/leave
    // style.cursor = 'move'; //  TODO: can't set with pointerEvents=none ! (no longer in CSS either as no-op)
    style.width = this.dragOffset.width + 'px';
    style.height = this.dragOffset.height + 'px';
    style.willChange = 'left, right, top';
    style.position = 'fixed'; // let us drag between grids by not clipping as parent .grid-stack is position: 'relative'
    this._dragFollow(e); // now position it
    style.transition = 'none'; // show up instantly
    setTimeout(() => {
      if (this.helper) {
        style.transition = null!; // recover animation
      }
    }, 0);
    return this;
  }

  /** @internal restore back the original style before dragging */
  protected _removeHelperStyle(): DDDraggable {
    this.helper!.classList.remove('ui-draggable-dragging');
    (this.el._gridstackNodeOrig || this.el.gridstackNode)?.grid?.el.classList.remove('grid-stack-dragging');
    const node = (this.helper as GridItemHTMLElement)?.gridstackNode;
    // don't bother restoring styles if we're gonna remove anyway...
    if (!node?._isAboutToRemove && this.dragElementOriginStyle) {
      const helper = this.helper!;
      const originStyle = this.dragElementOriginStyle; // capture before closure so narrowing persists
      // don't animate, otherwise we animate offseted when switching back to 'absolute' from 'fixed'.
      // TODO: this also removes resizing animation which doesn't have this issue, but others.
      // Ideally both would animate ('move' would immediately restore 'absolute' and adjust coordinate to match,
      // then trigger a delay (repaint) to restore to final dest with animate) but then we need to make sure 'resizestop'
      // is called AFTER 'transitionend' event is received (see https://github.com/gridstack/gridstack.js/issues/2033)
      const idxOf = DDDraggable.originStyleProp.indexOf('transition');
      const transition = originStyle[idxOf] || null;
      helper.style.transition = originStyle[idxOf] = 'none'; // can't be NULL #1973
      const hStyle = helper.style as unknown as Record<string, string | null>;
      DDDraggable.originStyleProp.forEach((prop, i) => hStyle[prop] = originStyle[i] || null);
      setTimeout(() => helper.style.transition = transition || '', 50); // recover animation from saved vars after a pause (0 isn't enough #1973)
    }
    delete this.dragElementOriginStyle;
    return this;
  }

  /** @internal updates the top/left position to follow the mouse */
  public _dragFollow(e: MouseEvent): void {
    const style = this.helper!.style;
    const offset = this.dragOffset;
    if (this.option.rtl) {
      style.right = ((window.innerWidth - e.clientX) + offset.offsetX) * this.dragTransform.xScale + 'px';
      if (style.left)
        style.left = '';
    } else {
      style.left = (e.clientX + offset.offsetX) * this.dragTransform.xScale + 'px';
      if (style.right)
        style.right = '';
    }
    style.top = (e.clientY + offset.offsetTop) * this.dragTransform.yScale + 'px';
  }

  /** @internal */
  protected _setupHelperContainmentStyle(): DDDraggable {
    this.helperContainment = this.helper!.parentElement!;
    if (this.helper!.style.position !== 'fixed') {
      this.parentOriginStylePosition = this.helperContainment.style.position;
      if (getComputedStyle(this.helperContainment).position.match(/static/)) {
        this.helperContainment.style.position = 'relative';
      }
    }
    return this;
  }

  /** @internal */
  protected _getDragOffset(event: MouseEvent, el: HTMLElement, parent: HTMLElement): DragOffset {

    // in case ancestor has transform/perspective css properties that change the viewpoint
    let xformOffsetX = 0;
    let xformOffsetY = 0;
    if (parent) {
      xformOffsetX = this.dragTransform.xOffset;
      xformOffsetY = this.dragTransform.yOffset;
    }

    const targetOffset = el.getBoundingClientRect();
    let x = this.option.rtl ? targetOffset.right : targetOffset.left;
    let offsetX = this.option.rtl
      ? (event.clientX - targetOffset.right + xformOffsetX)
      : (-event.clientX + targetOffset.left - xformOffsetX);

    return {
      x,
      top: targetOffset.top,
      offsetX,
      offsetTop: - event.clientY + targetOffset.top - xformOffsetY,
      width: targetOffset.width * this.dragTransform.xScale,
      height: targetOffset.height * this.dragTransform.yScale
    };
  }

  /** @internal starts or continues auto-scroll when the dragged helper is clipped by the scroll container.
   * Takes the grid's own element to find the scroll container so external/sidebar drags work too (#2074). */
   public updateScrollPosition(gridEl: HTMLElement): void {
    this._autoScrollContainer = Utils.getScrollElement(gridEl); // always use latest active grid
    const clipping = this._getClipping(this.helper!, this._autoScrollContainer);
    if (clipping === 0) {
      this._stopScrolling();
    } else if (!this._autoScrollAnimId) {
      this._autoScrollAnimId = requestAnimationFrame(this._autoScrollTick);
    }
  }

  /** @internal compute how many pixels the element is clipped: negative = above, positive = below, 0 = fully inside OR outside (stop scrolling) */
  protected _getClipping(el: HTMLElement, scrollEl: HTMLElement): number {
    const elRect = el.getBoundingClientRect();
    const scrollRect = scrollEl.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    if (elRect.bottom < scrollRect.top || elRect.top > scrollRect.bottom) return 0; // fully outside
    const clippedBelow = elRect.bottom - Math.min(scrollRect.bottom, viewportH);
    const clippedAbove = elRect.top - Math.max(scrollRect.top, 0);
    if (clippedAbove < 0) return clippedAbove;
    if (clippedBelow > 0) return clippedBelow;
    return 0;
  }

  /** @internal single tick of the auto-scroll animation loop */
  protected _autoScrollTick = (): void => {
    const el = this.helper;
    const scrollCont = this._autoScrollContainer;
    if (!el || !scrollCont) { this._stopScrolling(); return; }
    const clipping = this._getClipping(el, scrollCont);
    if (clipping === 0) { this._stopScrolling(); return; }

    if (!this._autoScrollMaxSpeed) {
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      this._autoScrollMaxSpeed = Math.max(viewportH / 150, 4);
    }
    const absPx = Math.abs(clipping);
    const speed = Math.min(absPx * 0.5, this._autoScrollMaxSpeed);
    const scrollAmount = clipping > 0 ? speed : -speed;

    const prevScroll = scrollCont.scrollTop;
    scrollCont.scrollTop += scrollAmount;
    if (scrollCont.scrollTop === prevScroll) { this._stopScrolling(); return; }

    if (this.dragging && this.lastDrag) {
      this._dragFollow(this.lastDrag);
      this._callDrag(this.lastDrag);
    }

    this._autoScrollAnimId = requestAnimationFrame(this._autoScrollTick);
  }

  /** @internal stop any active auto-scroll animation */
  public _stopScrolling(): void {
    if (this._autoScrollAnimId) {
      cancelAnimationFrame(this._autoScrollAnimId);
      delete this._autoScrollAnimId;
    }
  }

  /** @internal TODO: set to public as called by DDDroppable! */
  public ui(): DDUIData {
    const containmentEl = this.el.parentElement!;
    const containmentRect = containmentEl.getBoundingClientRect();
    const offset = this.helper!.getBoundingClientRect();

    // RTL: GridStack measures column positions from the right side of the container,
    // so we report `left` as the distance between the helper's right edge and the
    // container's right edge (both in viewport-left coordinates via getBoundingClientRect).
    const leftPos = this.option.rtl
      ? (containmentRect.right - offset.right) * this.dragTransform.xScale
      : (offset.left - containmentRect.left) * this.dragTransform.xScale;

    return {
      position: { //Current CSS position of the helper as { top, left } object
        top: (offset.top - containmentRect.top) * this.dragTransform.yScale,
        left: leftPos
      }
      /* not used by GridStack for now...
      helper: [this.helper], //The object arr representing the helper that's being dragged.
      offset: { top: offset.top, left: offset.left } // Current offset position of the helper as { top, left } object.
      */
    };
  }
}
