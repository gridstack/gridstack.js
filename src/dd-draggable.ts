/**
 * dd-draggable.ts 12.2.2-dev
 * Copyright (c) 2021-2024  Alain Dumesny - see GridStack root license
 */

import { DDManager } from './dd-manager';
import { DragTransform, Utils } from './utils';
import { DDBaseImplement, HTMLElementExtendOpt } from './dd-base-impl';
import { GridItemHTMLElement, DDUIData, GridStackNode, GridStackPosition, DDDragOpt } from './types';
import { DDElementHost } from './dd-element';
import { isTouch, touchend, touchmove, touchstart, pointerdown } from './dd-touch';
import { GridHTMLElement } from './gridstack';

interface DragOffset {
  left: number;
  top: number;
  width: number;
  height: number;
  offsetLeft: number;
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
  public helper: HTMLElement; // used by GridStackDDNative

  /** @internal */
  protected mouseDownEvent: MouseEvent;
  /** @internal */
  protected dragOffset: DragOffset;
  /** @internal */
  protected dragElementOriginStyle: Array<string>;
  /** @internal */
  protected dragEls: HTMLElement[];
  /** @internal true while we are dragging an item around */
  protected dragging: boolean;

  /** @internal true while we are dragging an item around */
  protected keyboardSelected: HTMLElement;
  /** @internal last drag event */
  protected lastDrag: DragEvent;
  /** @internal */
  protected parentOriginStylePosition: string;
  /** @internal */
  protected helperContainment: HTMLElement;
  /** @internal properties we change during dragging, and restore back */
  protected static originStyleProp = ['width', 'height', 'transform', 'transform-origin', 'transition', 'pointerEvents', 'position', 'left', 'top', 'minWidth', 'willChange'];
  /** @internal pause before we call the actual drag hit collision code */
  protected dragTimeout: number;
  /** @internal */
  protected dragTransform: DragTransform = {
    xScale: 1,
    yScale: 1,
    xOffset: 0,
    yOffset: 0
  };

  constructor(public el: GridItemHTMLElement, public option: DDDragOpt = {}) {
    super();

    // get the element that is actually supposed to be dragged by
    const handleName = option?.handle?.substring(1);
    const n = el.gridstackNode;
    this.dragEls = !handleName || el.classList.contains(handleName) ? [el] : (n?.subGrid ? [el.querySelector(option.handle) || el] : Array.from(el.querySelectorAll(option.handle)));
    if (this.dragEls.length === 0) {
      this.dragEls = [el];
    }
    // create var event binding so we can easily remove and still look like TS methods (unlike anonymous functions)
    this._mouseDown = this._mouseDown.bind(this);
    this._keyDown = this._keyDown.bind(this);
    this._keyMove = this._keyMove.bind(this);
    this._keyUp = this._keyUp.bind(this);
    this._mouseMove = this._mouseMove.bind(this);
    this._mouseUp = this._mouseUp.bind(this);
    this._keyEvent = this._keyEvent.bind(this);
    this._sortByRow = this._sortByRow.bind(this);
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
    this.dragEls.forEach(dragEl => {
      dragEl.addEventListener('keydown', this._keyDown)
      dragEl.addEventListener('mousedown', this._mouseDown);
      if (isTouch) {
        dragEl.addEventListener('touchstart', touchstart);
        dragEl.addEventListener('pointerdown', pointerdown);
        // dragEl.style.touchAction = 'none'; // not needed unlike pointerdown doc comment
      }
    });
    this.el.classList.remove('ui-draggable-disabled');
  }

  public disable(forDestroy = false): void {
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

  public destroy(): void {
    if (this.dragTimeout) window.clearTimeout(this.dragTimeout);
    delete this.dragTimeout;
    if (this.mouseDownEvent) this._mouseUp(this.mouseDownEvent);
    this.disable(true);
    delete this.el;
    delete this.helper;
    delete this.option;
    super.destroy();
  }

  public updateOption(opts: DDDragOpt): DDDraggable {
    Object.keys(opts).forEach(key => this.option[key] = opts[key]);
    return this;
  }

  protected _elCoordinates(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const clientX = rect.left;
    const clientY = rect.top;
    const offsetX = element.offsetLeft;
    const offsetY = element.offsetTop;
    const pageX = window.scrollX + rect.left;
    const pageY = window.scrollY + rect.top;
    const screenX = window.screenX + rect.left;
    const screenY = window.screenY + rect.top;

    return { clientX: clientX,
      clientY: clientY,
      offsetX: offsetX,
      offsetY: offsetY,
      pageX: pageX,
      pageY: pageY,
      screenX: screenX,
      screenY: screenY }
  }

  _setCoordinates(element: HTMLElement, x: number, y:number) {
    let coordinates = this._elCoordinates(element)

    coordinates.clientX += x || 0;
    coordinates.clientY += y || 0;

    return coordinates
  }

  _node() {
    return this.el.gridstackNode;
  }

  _grid() {
    return this._node().grid
  }

  _itemNode(item) {
    return item['gridstackNode']
  }

  _nodePosition(node) {
    return {
      width: node.w - 1,
      height: node.h,
      column: node.x,
      row: node.y
    }
  }

  _items() {
    return document.querySelectorAll('.grid-stack-item:not(.grid-stack-placeholder)')
  }

  _sortByRow(a, b) {
    return this._itemNode(a).y - this._itemNode(b).y
  }

  // Find the first item above the selectedNode.
  // Add the items row and its height, this should be the same as the selectedNodes row, if so, the item is in the row directly
  // above the selectedNode.
  // Also check if the item column overlaps the selectedNodes columns and include the items width in this calculation
  _findItemAbove () {
    const selectedNode = this._nodePosition(this._node())

    return Array.from(this._items()).filter(item => {
      const itemNode = this._nodePosition(this._itemNode(item))

      if ((itemNode.row + itemNode.height) !== selectedNode.row) { return false }
      if (selectedNode.column < itemNode.column) { return false }
      if (selectedNode.column > (itemNode.column + itemNode.width)) { return false }
      return item
    })[0]
  }

  // When we have not found any items in the row directly above the selectedNode.
  // Look for the first item it can find above the selectedNodes row.
  _findFirstItemAbove () {
    const selectedNode = this._nodePosition(this._node())

    return Array.from(this._items()).filter(item => {
      if (item === this.el) { return false }
      const itemNode = this._nodePosition(this._itemNode(item))

      if (itemNode.row < selectedNode.row) { return item }
    }).sort(this._sortByRow).reverse()[0]
  }

  protected _elNewCoordinates(event: KeyboardEvent, element: HTMLElement) {
    const selectedNode = this._node();
    const cellHeight = this._grid().getCellHeight() * selectedNode.h
    let xCoord: number, yCoord: number

    switch (event.code) {
    case 'ArrowRight':
      const maxColumn = this._grid().opts.column

      if(typeof(maxColumn) == 'number' && selectedNode.x === (maxColumn - 1)) { break }

      xCoord = this._grid().cellWidth()
      break
    case 'ArrowLeft':
      if (selectedNode.x === 0) { break }

      xCoord = -this._grid().cellWidth()
      break
    case 'ArrowUp':
      if (selectedNode.y === 0) { break }

      let itemAbove = this._findItemAbove()
      if (itemAbove === undefined) { itemAbove = this._findFirstItemAbove() }

      yCoord = -(this._itemNode(itemAbove).h * this._grid().getCellHeight())
      break
    case 'ArrowDown':
      yCoord = cellHeight
      break
    }

    return this._setCoordinates(element, xCoord, yCoord);
  }

  protected _keyDown(e: KeyboardEvent): void {
    if(e.code === 'Space') {
      e.preventDefault()

      const handle = e.target as HTMLElement
      const item: HTMLElement = handle?.closest('.grid-stack-item')
      this.keyboardSelected = item
      item.classList.add('grid-stack-item-selected')

      e.target.dispatchEvent(new MouseEvent('mousedown'))
      document.addEventListener('keyup', this._keyUp)
    }
  }

  protected _keyUp() {
    document.removeEventListener('keyup', this._keyUp)
    document.addEventListener('keydown', this._keyMove)
  }

  protected _selectedItem (element: HTMLElement): HTMLElement {
    const items = document.querySelectorAll('.grid-stack-item')

    return Array.from(items).filter(item => item === element)[0] as HTMLElement
  }

  protected _keyMove(e: KeyboardEvent) {
    if (e.code === 'Space') {
      e.preventDefault()

      this.keyboardSelected.classList.remove('grid-stack-item-selected')
      this.keyboardSelected.dispatchEvent(new MouseEvent('mouseup'))
      document.removeEventListener('keydown', this._keyMove)

      return
    }

    if (e.code === 'ArrowRight' ||
      e.code === 'ArrowLeft' ||
      e.code === 'ArrowUp' ||
      e.code === 'ArrowDown') {
      e.preventDefault()

      e.target.dispatchEvent(new MouseEvent('mousemove', { ...this._elCoordinates(this.keyboardSelected)}))
      e.target.dispatchEvent(new MouseEvent('mousemove', { ...this._elNewCoordinates(e, this.keyboardSelected)}))
      e.target.dispatchEvent(new MouseEvent('mouseup'))

      this.keyboardSelected = this._selectedItem(this.keyboardSelected)
      this.keyboardSelected.scrollIntoView({ block: "center" })

      const handle: HTMLElement = this.keyboardSelected.querySelector('.grid-item-handle')

      handle?.dispatchEvent(new MouseEvent('mousedown'))
    }
  }

  /** @internal call when mouse goes down before a dragstart happens */
  protected _mouseDown(e: MouseEvent): boolean {
    // don't let more than one widget handle mouseStart
    if (DDManager.mouseHandled) return;
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
    // document handler so we can continue receiving moves as the item is 'fixed' position, and capture=true so WE get a first crack
    document.addEventListener('mousemove', this._mouseMove, { capture: true, passive: true }); // true=capture, not bubble
    document.addEventListener('mouseup', this._mouseUp, true);
    if (isTouch) {
      e.currentTarget.addEventListener('touchmove', touchmove);
      e.currentTarget.addEventListener('touchend', touchend);
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
    const s = this.mouseDownEvent;
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
        DDManager.dropElement = (grid.el as DDElementHost).ddElement.ddDroppable;
      } else {
        delete DDManager.dropElement;
      }
      this.helper = this._createHelper();
      this._setupHelperContainmentStyle();
      this.dragTransform = Utils.getValuesFromTransformedElement(this.helperContainment);
      this.dragOffset = this._getDragOffset(e, this.el, this.helperContainment);
      this._setupHelperStyle(e);

      const ev = Utils.initEvent<DragEvent>(e, { target: this.el, type: 'dragstart' });
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
    document.removeEventListener('mousemove', this._mouseMove, true);
    document.removeEventListener('mouseup', this._mouseUp, true);
    if (isTouch && e.currentTarget) { // destroy() during nested grid call us again wit fake _mouseUp
      e.currentTarget.removeEventListener('touchmove', touchmove, true);
      e.currentTarget.removeEventListener('touchend', touchend, true);
    }
    if (this.dragging) {
      delete this.dragging;
      delete (this.el.gridstackNode as GridStackNodeRotate)?._origRotate;
      document.removeEventListener('keydown', this._keyEvent);

      // reset the drop target if dragging over ourself (already parented, just moving during stop callback below)
      if (DDManager.dropElement?.el === this.el.parentElement) {
        delete DDManager.dropElement;
      }

      this.helperContainment.style.position = this.parentOriginStylePosition || null;
      if (this.helper !== this.el) this.helper.remove(); // hide now
      this._removeHelperStyle();

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
      this._mouseUp(this.mouseDownEvent);
    } else if (n && grid && (e.key === 'r' || e.key === 'R')) {
      if (!Utils.canBeRotated(n)) return;
      n._origRotate = n._origRotate || { ...n._orig }; // store the real orig size in case we Esc after doing rotation
      delete n._moving; // force rotate to happen (move waits for >50% coverage otherwise)
      grid.setAnimation(false) // immediate rotate so _getDragOffset() gets the right dom size below
        .rotate(n.el, { top: -this.dragOffset.offsetTop, left: -this.dragOffset.offsetLeft })
        .setAnimation();
      n._moving = true;
      this.dragOffset = this._getDragOffset(this.lastDrag, n.el, this.helperContainment);
      this.helper.style.width = this.dragOffset.width + 'px';
      this.helper.style.height = this.dragOffset.height + 'px';
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
      Utils.appendTo(helper, this.option.appendTo === 'parent' ? this.el.parentElement : this.option.appendTo);
    }
    this.dragElementOriginStyle = DDDraggable.originStyleProp.map(prop => this.el.style[prop]);
    return helper;
  }

  /** @internal set the fix position of the dragged item */
  protected _setupHelperStyle(e: DragEvent): DDDraggable {
    this.helper.classList.add('ui-draggable-dragging');
    // TODO: set all at once with style.cssText += ... ? https://stackoverflow.com/questions/3968593
    const style = this.helper.style;
    style.pointerEvents = 'none'; // needed for over items to get enter/leave
    // style.cursor = 'move'; //  TODO: can't set with pointerEvents=none ! (no longer in CSS either as no-op)
    style.width = this.dragOffset.width + 'px';
    style.height = this.dragOffset.height + 'px';
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
    const node = (this.helper as GridItemHTMLElement)?.gridstackNode;
    // don't bother restoring styles if we're gonna remove anyway...
    if (!node?._isAboutToRemove && this.dragElementOriginStyle) {
      const helper = this.helper;
      // don't animate, otherwise we animate offseted when switching back to 'absolute' from 'fixed'.
      // TODO: this also removes resizing animation which doesn't have this issue, but others.
      // Ideally both would animate ('move' would immediately restore 'absolute' and adjust coordinate to match,
      // then trigger a delay (repaint) to restore to final dest with animate) but then we need to make sure 'resizestop'
      // is called AFTER 'transitionend' event is received (see https://github.com/gridstack/gridstack.js/issues/2033)
      const transition = this.dragElementOriginStyle['transition'] || null;
      helper.style.transition = this.dragElementOriginStyle['transition'] = 'none'; // can't be NULL #1973
      DDDraggable.originStyleProp.forEach(prop => helper.style[prop] = this.dragElementOriginStyle[prop] || null);
      setTimeout(() => helper.style.transition = transition, 50); // recover animation from saved vars after a pause (0 isn't enough #1973)
    }
    delete this.dragElementOriginStyle;
    return this;
  }

  /** @internal updates the top/left position to follow the mouse */
  protected _dragFollow(e: DragEvent): void {
    const containmentRect = { left: 0, top: 0 };
    // if (this.helper.style.position === 'absolute') { // we use 'fixed'
    //   const { left, top } = this.helperContainment.getBoundingClientRect();
    //   containmentRect = { left, top };
    // }
    const style = this.helper.style;
    const offset = this.dragOffset;
    style.left = (e.clientX + offset.offsetLeft - containmentRect.left) * this.dragTransform.xScale + 'px';
    style.top = (e.clientY + offset.offsetTop - containmentRect.top) * this.dragTransform.yScale + 'px';
  }

  /** @internal */
  protected _setupHelperContainmentStyle(): DDDraggable {
    this.helperContainment = this.helper.parentElement;
    if (this.helper.style.position !== 'fixed') {
      this.parentOriginStylePosition = this.helperContainment.style.position;
      if (getComputedStyle(this.helperContainment).position.match(/static/)) {
        this.helperContainment.style.position = 'relative';
      }
    }
    return this;
  }

  /** @internal */
  protected _getDragOffset(event: DragEvent, el: HTMLElement, parent: HTMLElement): DragOffset {

    // in case ancestor has transform/perspective css properties that change the viewpoint
    let xformOffsetX = 0;
    let xformOffsetY = 0;
    if (parent) {
      xformOffsetX = this.dragTransform.xOffset;
      xformOffsetY = this.dragTransform.yOffset;
    }

    const targetOffset = el.getBoundingClientRect();
    return {
      left: targetOffset.left,
      top: targetOffset.top,
      offsetLeft: - event.clientX + targetOffset.left - xformOffsetX,
      offsetTop: - event.clientY + targetOffset.top - xformOffsetY,
      width: targetOffset.width * this.dragTransform.xScale,
      height: targetOffset.height * this.dragTransform.yScale
    };
  }

  /** @internal TODO: set to public as called by DDDroppable! */
  public ui(): DDUIData {
    const containmentEl = this.el.parentElement;
    const containmentRect = containmentEl.getBoundingClientRect();
    const offset = this.helper.getBoundingClientRect();
    return {
      position: { //Current CSS position of the helper as { top, left } object
        top: (offset.top - containmentRect.top) * this.dragTransform.yScale,
        left: (offset.left - containmentRect.left) * this.dragTransform.xScale
      }
      /* not used by GridStack for now...
      helper: [this.helper], //The object arr representing the helper that's being dragged.
      offset: { top: offset.top, left: offset.left } // Current offset position of the helper as { top, left } object.
      */
    };
  }
}
