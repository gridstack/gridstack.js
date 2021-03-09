// gridstack-GridStackDD.get().ts 3.3.0-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GridStackDDI } from './gridstack-ddi';
import { GridItemHTMLElement, GridStackNode, GridStackElement, DDUIData, DDDragInOpt, GridStackPosition } from './types';
import { GridStack, MousePosition } from './gridstack';
import { Utils } from './utils';

/** Drag&Drop drop options */
export type DDDropOpt = {
  /** function or class type that this grid will accept as dropped items (see GridStackOptions.acceptWidgets) */
  accept?: (el: GridItemHTMLElement) => boolean;
}

/** drag&drop options currently called from the main code, but others can be passed in grid options */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DDOpts = 'enable' | 'disable' | 'destroy' | 'option' | string | any;
export type DDKey = 'minWidth' | 'minHeight' | 'maxWidth' | 'maxHeight';
export type DDValue = number | string;

/** drag&drop events callbacks */
export type DDCallback = (event: Event, arg2: GridItemHTMLElement, helper?: GridItemHTMLElement) => void;

/**
 * Base class implementing common Grid drag'n'drop functionality, with domain specific subclass (h5 vs jq subclasses)
 */
export abstract class GridStackDD extends GridStackDDI {

  /** override to cast to correct type */
  static get(): GridStackDD {
    return GridStackDDI.get() as GridStackDD;
  }

  /** removes any drag&drop present (called during destroy) */
  public remove(el: GridItemHTMLElement): GridStackDD {
    this.draggable(el, 'destroy').resizable(el, 'destroy');
    if (el.gridstackNode) {
      delete el.gridstackNode._initDD; // reset our DD init flag
    }
    return this;
  }

  // APIs that must be implemented by subclasses to do actual darg/drop/resize called by GridStack code below

  public abstract resizable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): GridStackDD;

  public abstract isResizable(el: HTMLElement): boolean;

  public abstract draggable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): GridStackDD;

  public abstract dragIn(el: GridStackElement, opts: DDDragInOpt): GridStackDD;

  public abstract isDraggable(el: HTMLElement): boolean;

  public abstract droppable(el: GridItemHTMLElement, opts: DDOpts | DDDropOpt, key?: DDKey, value?: DDValue): GridStackDD;

  public abstract isDroppable(el: HTMLElement): boolean;

  public abstract on(el: GridItemHTMLElement, eventName: string, callback: DDCallback): GridStackDD;

  public abstract off(el: GridItemHTMLElement, eventName: string): GridStackDD;
}

/********************************************************************************
 * GridStack code that is doing drag&drop extracted here so main class is smaller
 * for static grid that don't do any of this work anyway. Saves about 10k.
 * TODO: no code hint in code below as this is <any> so look at alternatives ?
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 * https://www.typescriptlang.org/docs/handbook/mixins.html
 ********************************************************************************/

/** @internal called to add drag over to support widgets being added externally */
GridStack.prototype._setupAcceptWidget = function(): GridStack {
  if (this.opts.staticGrid) return this;

  // if we don't accept external widgets (default) we still need to accept dragging within our
  // list of items (else we get a no-drop icon on windows)
  if (!this.opts.acceptWidgets) {
    GridStackDD.get().droppable(this.el, {
      accept: (el: GridItemHTMLElement) => el.gridstackNode && el.gridstackNode.grid === this
    })
    return this;
  }

  // vars shared across all methods
  let gridPos: MousePosition;
  let cellHeight: number, cellWidth: number;

  let onDrag = (event: DragEvent, el: GridItemHTMLElement, helper: GridItemHTMLElement) => {
    let node = el.gridstackNode;
    if (!node) return;

    helper = helper || el;
    // let left = event.pageX - gridPos.left;
    // let top = event.pageY - gridPos.top;
    let rec = helper.getBoundingClientRect();
    let left = rec.left - gridPos.left;
    let top = rec.top - gridPos.top;
    let ui: DDUIData = {position: {top, left}};

    if (node._temporaryRemoved) {
      node.x = Math.max(0, Math.round(left / cellWidth));
      node.y = Math.max(0, Math.round(top / cellHeight));
      delete node.autoPosition;
      this.engine.nodeBoundFix(node);

      // don't accept *initial* location if doesn't fit #1419 (locked drop region, or can't grow), but maybe try if it will go somewhere
      if (!this.engine.willItFit(node)) {
        node.autoPosition = true; // ignore x,y and try for any slot...
        if (!this.engine.willItFit(node)) {
          GridStackDD.get().off(el, 'drag'); // stop calling us
          return; // full grid or can't grow
        }
      }

      // re-use the existing node dragging method
      this._onStartMoving(event, ui, node, cellWidth, cellHeight);
    } else {
      // re-use the existing node dragging that does so much of the collision detection
      this._dragOrResize(event, ui, node, cellWidth, cellHeight);
    }
  }

  GridStackDD.get()
    .droppable(this.el, {
      accept: (el: GridItemHTMLElement) => {
        let node: GridStackNode = el.gridstackNode;
        // set accept drop to true on ourself (which we ignore) so we don't get "can't drop" icon in HTML5 mode while moving
        if (node && node.grid === this) return true;
        // check for accept method or class matching
        let canAccept = true;
        if (typeof this.opts.acceptWidgets === 'function') {
          canAccept = this.opts.acceptWidgets(el);
        } else {
          let selector = (this.opts.acceptWidgets === true ? '.grid-stack-item' : this.opts.acceptWidgets as string);
          canAccept = el.matches(selector);
        }
        // finally check to make sure we actually have space left #1571
        if (canAccept && node && this.opts.maxRow) {
          let n = {w: node.w, h: node.h, minW: node.minW, minH: node.minH}; // only width/height matters
          canAccept = this.engine.willItFit(n);
        }
        return canAccept;
      }
    })
    /**
     * entering our grid area
     */
    .on(this.el, 'dropover', (event: Event, el: GridItemHTMLElement, helper: GridItemHTMLElement) => {
      let node = el.gridstackNode;
      // ignore drop enter on ourself (unless we temporarily removed) which happens on a simple drag of our item
      if (node && node.grid === this && !node._temporaryRemoved) {
        // delete node._added; // reset this to track placeholder again in case we were over other grid #1484 (dropout doesn't always clear)
        return false; // prevent parent from receiving msg (which may be a grid as well)
      }

      // fix #1578 when dragging fast, we may not get a leave on the previous grid so force one now
      if (node && node.grid && node.grid !== this && !node._temporaryRemoved) {
        // TEST console.log('dropover without leave');
        let otherGrid = node.grid;
        otherGrid._leave(el.gridstackNode, el, helper, true); // MATCH line 222
      }

      // get grid screen coordinates and cell dimensions
      let box = this.el.getBoundingClientRect();
      gridPos = {top: box.top + document.documentElement.scrollTop, left: box.left};
      cellWidth = this.cellWidth();
      cellHeight = this.getCellHeight(true);

      // load any element attributes if we don't have a node
      if (!node) {
        node = this._readAttr(el);
      }
      if (!node.grid) {
        node._isExternal = true;
        el.gridstackNode = node;
      }

      // calculate the grid size based on element outer size
      helper = helper || el;
      let w = node.w || Math.round(helper.offsetWidth / cellWidth) || 1;
      let h = node.h || Math.round(helper.offsetHeight / cellHeight) || 1;

      // if the item came from another grid, make a copy and save the original info in case we go back there
      if (node.grid && node.grid !== this) {
        // copy the node original values (min/max/id/etc...) but override width/height/other flags which are this grid specific
        // TEST console.log('dropover cloning node');
        if (!el._gridstackNodeOrig) el._gridstackNodeOrig = node; // shouldn't have multiple nested!
        el.gridstackNode = node = {...node, w, h, grid: this};
        this.engine.cleanupNode(node)
          .nodeBoundFix(node);
        // restore some internal fields we need after clearing them all
        node._initDD =
        node._isExternal =  // DOM needs to be re-parented on a drop
        node._temporaryRemoved = true;
      } else {
        node.w = w; node.h = h;
        node._temporaryRemoved = true; // so we can insert it
      }

      // we're entering this grid (even if we left another)
      delete node._isCursorOutside;

      GridStackDD.get().on(el, 'drag', onDrag);
      // make sure this is called at least once when going fast #1578
      onDrag(event as DragEvent, el, helper);
      return false; // prevent parent from receiving msg (which may be a grid as well)
    })
    /**
     * Leaving our grid area...
     */
    .on(this.el, 'dropout', (event, el: GridItemHTMLElement, helper: GridItemHTMLElement) => {
      let node = el.gridstackNode;
      // fix #1578 when dragging fast, we might get leave after other grid gets enter (which calls us to clean)
      // so skip this one if we're not the active grid really..
      if (!node.grid || node.grid === this) {
        this._leave(node, el, helper, true); // MATCH line 166
      }
      return false; // prevent parent from receiving msg (which may be grid as well)
    })
    /**
     * end - releasing the mouse
     */
    .on(this.el, 'drop', (event, el: GridItemHTMLElement, helper: GridItemHTMLElement) => {
      let node = el.gridstackNode;
      // ignore drop on ourself from ourself that didn't come from the outside - dragend will handle the simple move instead
      if (node && node.grid === this && !node._isExternal) return false;

      let wasAdded = !!this.placeholder.parentElement; // skip items not actually added to us because of constrains, but do cleanup #1419
      this.placeholder.remove();

      // notify previous grid of removal
      // TEST console.log('drop delete _gridstackNodeOrig')
      let origNode = el._gridstackNodeOrig;
      delete el._gridstackNodeOrig;
      if (wasAdded && origNode && origNode.grid && origNode.grid !== this) {
        let oGrid = origNode.grid;
        oGrid.engine.removedNodes.push(origNode);
        oGrid._triggerRemoveEvent();
      }

      if (!node) return false;

      // use existing placeholder node as it's already in our list with drop location
      if (wasAdded) {
        this.engine.cleanupNode(node); // removes all internal _xyz values
        node.grid = this;
      }
      GridStackDD.get().off(el, 'drag');
      // if we made a copy ('helper' which is temp) of the original node then insert a copy, else we move the original node (#1102)
      // as the helper will be nuked by jquery-ui otherwise
      if (helper !== el) {
        helper.remove();
        el.gridstackNode = origNode; // original item (left behind) is re-stored to pre dragging as the node now has drop info
        if (wasAdded) {
          el = el.cloneNode(true) as GridItemHTMLElement;
        }
      } else {
        el.remove(); // reduce flicker as we change depth here, and size further down
        GridStackDD.get().remove(el);
      }
      if (!wasAdded) return false;
      el.gridstackNode = node;
      node.el = el;

      Utils.copyPos(node, this._readAttr(this.placeholder)); // placeholder values as moving VERY fast can throw things off #1578
      Utils.removePositioningStyles(el);
      this._writeAttr(el, node);
      this.el.appendChild(el);
      this._updateContainerHeight();
      this.engine.addedNodes.push(node);
      this._triggerAddEvent();
      this._triggerChangeEvent();

      this.engine.endUpdate();
      if (this._gsEventHandler['dropped']) {
        this._gsEventHandler['dropped']({type: 'dropped'}, origNode && origNode.grid ? origNode : undefined, node);
      }

      // wait till we return out of the drag callback to set the new drag&resize handler or they may get messed up
      window.setTimeout(() => {
        // IFF we are still there (some application will use as placeholder and insert their real widget instead and better call makeWidget())
        if (node.el && node.el.parentElement) {
          this._prepareDragDropByNode(node);
        } else {
          this.engine.removeNode(node);
        }
      });

      return false; // prevent parent from receiving msg (which may be grid as well)
    });
  return this;
}

/** @internal called to setup a trash drop zone if the user specifies it */
GridStack.prototype._setupRemoveDrop = function(): GridStack {
  if (!this.opts.staticGrid && typeof this.opts.removable === 'string') {
    let trashEl = document.querySelector(this.opts.removable) as HTMLElement;
    if (!trashEl) return this;
    // only register ONE drop-over/dropout callback for the 'trash', and it will
    // update the passed in item and parent grid because the 'trash' is a shared resource anyway,
    // and Native DD only has 1 event CB (having a list and technically a per grid removableOptions complicates things greatly)
    if (!GridStackDD.get().isDroppable(trashEl)) {
      GridStackDD.get().droppable(trashEl, this.opts.removableOptions)
        .on(trashEl, 'dropover', function(event, el) { // don't use => notation to avoid using 'this' as grid by mistake...
          let node = el.gridstackNode;
          if (!node || !node.grid) return;
          node._isAboutToRemove = true;
          el.classList.add('grid-stack-item-removing');
        })
        .on(trashEl, 'dropout', function(event, el) { // same
          let node = el.gridstackNode;
          if (!node || !node.grid) return;
          delete node._isAboutToRemove;
          el.classList.remove('grid-stack-item-removing');
        });
    }
  }
  return this;
}

/**
 * call to setup dragging in from the outside (say toolbar), by specifying the class selection and options.
 * Called during GridStack.init() as options, but can also be called directly (last param are cached) in case the toolbar
 * is dynamically create and needs to change later.
 **/
GridStack.setupDragIn = function(_dragIn?: string, _dragInOptions?: DDDragInOpt) {
  // cache in the passed in values (form grid init?) so they don't have to resend them each time
  if (_dragIn) {
    dragIn = _dragIn;
    dragInOptions = {...dragInDefaultOptions, ...(_dragInOptions || {})};
  }
  if (typeof dragIn !== 'string') return;
  let dd = GridStackDD.get();
  Utils.getElements(dragIn).forEach(el => {
    if (!dd.isDraggable(el)) dd.dragIn(el, dragInOptions);
  });
}
let dragIn: string;
let dragInOptions: DDDragInOpt;
const dragInDefaultOptions: DDDragInOpt = {
  revert: 'invalid',
  handle: '.grid-stack-item-content',
  scroll: false,
  appendTo: 'body'
};

/** @internal prepares the element for drag&drop **/
GridStack.prototype._prepareDragDropByNode = function(node: GridStackNode): GridStack {
  let el = node.el;

  // check for disabled grid first
  if (this.opts.staticGrid || node.locked ||
    ((node.noMove || this.opts.disableDrag) && (node.noResize || this.opts.disableResize))) {
    if (node._initDD) {
      GridStackDD.get().remove(node.el); // nukes everything instead of just disable, will add some styles back next
      delete node._initDD;
    }
    node.el.classList.add('ui-draggable-disabled', 'ui-resizable-disabled'); // add styles one might depend on #1435
    return this;
  }
  // check if init already done
  if (node._initDD) {
    // fine tune drag vs move by disabling any part...
    if (node.noMove || this.opts.disableDrag) {
      GridStackDD.get().draggable(el, 'disable');
    }
    if (node.noResize || this.opts.disableResize) {
      GridStackDD.get().resizable(el, 'disable');
    }
    return this;
  }

  // remove our style that look like D&D
  node.el.classList.remove('ui-draggable-disabled', 'ui-resizable-disabled');

  // variables used/cashed between the 3 start/move/end methods, in addition to node passed above
  let cellWidth: number;
  let cellHeight: number;

  /** called when item starts moving/resizing */
  let onStartMoving = (event: Event, ui: DDUIData) => {
    // trigger any 'dragstart' / 'resizestart' manually
    if (this._gsEventHandler[event.type]) {
      this._gsEventHandler[event.type](event, event.target);
    }
    cellWidth = this.cellWidth();
    cellHeight = this.getCellHeight(true); // force pixels for calculations

    this._onStartMoving(event, ui, node, cellWidth, cellHeight);
  }

  /** called when item is being dragged/resized */
  let dragOrResize = (event: Event, ui: DDUIData) => {
    this._dragOrResize(event, ui, node, cellWidth, cellHeight);
  }

  /** called when the item stops moving/resizing */
  let onEndMoving = (event: Event) => {
    this.placeholder.remove();
    delete node._moving;
    delete node._lastTried;

    // if the item has moved to another grid, we're done here
    let target: GridItemHTMLElement = event.target as GridItemHTMLElement;
    if (!target.gridstackNode || target.gridstackNode.grid !== this) return;

    node.el = target;

    if (node._isAboutToRemove) {
      let gridToNotify = el.gridstackNode.grid;
      if (gridToNotify._gsEventHandler[event.type]) {
        gridToNotify._gsEventHandler[event.type](event, target);
      }
      GridStackDD.get().remove(el);
      gridToNotify.engine.removedNodes.push(node);
      gridToNotify._triggerRemoveEvent();
      // break circular links and remove DOM
      delete el.gridstackNode;
      delete node.el;
      el.remove();
    } else {
      if (!node._temporaryRemoved) {
        // move to new placeholder location
        Utils.removePositioningStyles(target);
        this._writePosAttr(target, node);
      } else {
        // got removed - restore item back to before dragging position
        Utils.removePositioningStyles(target);
        Utils.copyPos(node, node._beforeDrag);
        delete node._beforeDrag;
        this._writePosAttr(target, node);
        this.engine.addNode(node);
      }
      if (this._gsEventHandler[event.type]) {
        this._gsEventHandler[event.type](event, target);
      }
    }

    this._updateContainerHeight();
    this._triggerChangeEvent();

    this.engine.endUpdate();
  }

  GridStackDD.get()
    .draggable(el, {
      start: onStartMoving,
      stop: onEndMoving,
      drag: dragOrResize
    })
    .resizable(el, {
      start: onStartMoving,
      stop: onEndMoving,
      resize: dragOrResize
    });
  node._initDD = true; // we've set DD support now

  // finally fine tune drag vs move by disabling any part...
  if (node.noMove || this.opts.disableDrag) {
    GridStackDD.get().draggable(el, 'disable');
  }
  if (node.noResize || this.opts.disableResize) {
    GridStackDD.get().resizable(el, 'disable');
  }
  return this;
}

/** @internal called when item is starting a drag/resize */
GridStack.prototype._onStartMoving = function(event: Event, ui: DDUIData, node: GridStackNode, cellWidth: number, cellHeight: number) {
  this.engine.cleanNodes()
    .beginUpdate(node);

  this._writePosAttr(this.placeholder, node)
  this.el.appendChild(this.placeholder);
  // TEST console.log('_onStartMoving placeholder')

  node.el = this.placeholder;
  node._lastUiPosition = ui.position;
  node._prevYPix = ui.position.top;
  node._moving = (event.type === 'dragstart');
  delete node._lastTried;
  delete node._isCursorOutside;

  if (event.type === 'dropover' && node._temporaryRemoved) {
    // TEST console.log('engine.addNode x=' + node.x);
    this.engine.addNode(node); // will add, constrain, update attr and clear _temporaryRemoved
    node._moving = true; // lastly mark as moving object
  }

  // set the min/max resize info
  this.engine.cacheRects(cellWidth, cellHeight, this.opts.marginTop, this.opts.marginRight, this.opts.marginBottom, this.opts.marginLeft);
  if (event.type === 'resizestart') {
    let el = node.el;
    let dd = GridStackDD.get()
      .resizable(el, 'option', 'minWidth', cellWidth * (node.minW || 1))
      .resizable(el, 'option', 'minHeight', cellHeight * (node.minH || 1));
    if (node.maxW) { dd.resizable(el, 'option', 'maxWidth', cellWidth * node.maxW); }
    if (node.maxH) { dd.resizable(el, 'option', 'maxHeight', cellHeight * node.maxH); }
  }
}

/** @internal called when item leaving our area by either cursor dropout event
 * or shape is outside our boundaries. remove it from us, and mark temporary if this was
 * our item to start with else restore prev node values from prev grid it came from.
 **/
GridStack.prototype._leave = function(node: GridStackNode, el: GridItemHTMLElement, helper?: GridItemHTMLElement, dropoutEvent = false)  {
  if (!node) return;

  if (dropoutEvent) {
    node._isCursorOutside = true;
    GridStackDD.get().off(el, 'drag'); // no need to track while being outside
  }

  // this gets called when cursor leaves and shape is outside, so only do this once
  if (node._temporaryRemoved) return;
  node._temporaryRemoved = true;

  this.engine.removeNode(node); // remove placeholder as well
  node.el = node._isExternal && helper ? helper : el; // point back to real item being dragged

  // finally if item originally came from another grid, but left us, restore things back to prev info
  if (el._gridstackNodeOrig) {
    // TEST console.log('leave delete _gridstackNodeOrig')
    el.gridstackNode = el._gridstackNodeOrig;
    delete el._gridstackNodeOrig;
  } else if (node._isExternal) {
    // item came from outside (like a toolbar) so nuke any node info
    delete node.el;
    delete el.gridstackNode;
  }
}

/** @internal called when item is being dragged/resized */
GridStack.prototype._dragOrResize = function(event: Event, ui: DDUIData, node: GridStackNode, cellWidth: number, cellHeight: number)  {
  let el = node.el || event.target as GridItemHTMLElement;
  // calculate the place where we're landing by offsetting margin so actual edge crosses mid point
  let left = ui.position.left + (ui.position.left > node._lastUiPosition.left  ? -this.opts.marginRight : this.opts.marginLeft);
  let top = ui.position.top + (ui.position.top > node._lastUiPosition.top  ? -this.opts.marginBottom : this.opts.marginTop);
  let x = Math.round(left / cellWidth);
  let y = Math.round(top / cellHeight);
  let w = node.w;
  let h = node.h;
  let resizing: boolean;

  if (event.type === 'drag') {
    if (node._isCursorOutside) return; // handled by dropover
    let distance = ui.position.top - node._prevYPix;
    node._prevYPix = ui.position.top;
    Utils.updateScrollPosition(el, ui.position, distance);
    // if inTrash or outside of the bounds (but not external which is handled by 'dropout' event), temporarily remove it from us
    if (node._isAboutToRemove || (!node._isExternal && this.engine.isOutside(x, y, node))) {
      this._leave(node, event.target);
    } else {
      if (node._temporaryRemoved) {
        node.el = this.placeholder;
        this.engine.addNode(node);
        this.el.appendChild(this.placeholder);
        // TEST console.log('drag placeholder');
        delete node._temporaryRemoved;
      }
    }
    if (node.x === x && node.y === y) return; // skip same
    // DON'T skip one we tried as we might have failed because of coverage <50% before
    // if (node._lastTried && node._lastTried.x === x && node._lastTried.y === y) return;
  } else if (event.type === 'resize')  {
    if (x < 0) return;
    // Scrolling page if needed
    Utils.updateScrollResize(event as MouseEvent, el, cellHeight);
    w = Math.round(ui.size.width / cellWidth);
    h = Math.round(ui.size.height / cellHeight);
    if (node.w === w && node.h === h) return;
    if (node._lastTried && node._lastTried.w === w && node._lastTried.h === h) return; // skip one we tried (but failed)
    resizing = true;
  }

  node._lastTried = {x, y, w, h}; // set as last tried (will nuke if we go there)
  let rect: GridStackPosition = { // screen pix of the dragged box
    x: ui.position.left + this.opts.marginLeft,
    y: ui.position.top + this.opts.marginTop,
    w: (ui.size ? ui.size.width : node.w * cellWidth) - this.opts.marginLeft - this.opts.marginRight,
    h: (ui.size ? ui.size.height : node.h * cellHeight) - this.opts.marginTop - this.opts.marginBottom
  };
  if (this.engine.moveNodeCheck(node, {x, y, w, h, cellWidth, cellHeight, rect})) {
    node._lastUiPosition = ui.position;
    this.engine.cacheRects(cellWidth, cellHeight, this.opts.marginTop, this.opts.marginRight, this.opts.marginBottom, this.opts.marginLeft);
    delete node._skipDown;
    if (resizing && node.subGrid) { (node.subGrid as GridStack).onParentResize(); }
    this._updateContainerHeight();

    let target = event.target as GridItemHTMLElement;
    this._writePosAttr(target, node);
    if (this._gsEventHandler[event.type]) {
      this._gsEventHandler[event.type](event, target);
    }
  }
}

/**
 * Enables/Disables moving.
 * @param els widget or selector to modify.
 * @param val if true widget will be draggable.
 */
GridStack.prototype.movable = function(els: GridStackElement, val: boolean): GridStack {
  if (this.opts.staticGrid) return this; // can't move a static grid!
  GridStack.getElements(els).forEach(el => {
    let node = el.gridstackNode;
    if (!node || node.locked) return;
    node.noMove = !(val || false);
    if (node.noMove) {
      GridStackDD.get().draggable(el, 'disable');
      el.classList.remove('ui-draggable-handle');
    } else {
      this._prepareDragDropByNode(node); // init DD if need be
      GridStackDD.get().draggable(el, 'enable');
      el.classList.remove('ui-draggable-handle');
    }
  });
  return this;
}

/**
 * Enables/Disables resizing.
 * @param els  widget or selector to modify
 * @param val  if true widget will be resizable.
 */
GridStack.prototype.resizable = function(els: GridStackElement, val: boolean): GridStack {
  if (this.opts.staticGrid) return this; // can't resize a static grid!
  GridStack.getElements(els).forEach(el => {
    let node = el.gridstackNode;
    if (!node || node.locked) return;
    node.noResize = !(val || false);
    if (node.noResize) {
      GridStackDD.get().resizable(el, 'disable');
    } else {
      this._prepareDragDropByNode(node); // init DD if need be
      GridStackDD.get().resizable(el, 'enable');
    }
  });
  return this;
}


/**
  * Temporarily disables widgets moving/resizing.
  * If you want a more permanent way (which freezes up resources) use `setStatic(true)` instead.
  * Note: no-op for static grid
  * This is a shortcut for:
  * @example
  *  grid.enableMove(false);
  *  grid.enableResize(false);
  */
GridStack.prototype.disable = function(): GridStack {
  if (this.opts.staticGrid) return;
  this.enableMove(false);
  this.enableResize(false);
  this._triggerEvent('disable');
  return this;
}

/**
  * Re-enables widgets moving/resizing - see disable().
  * Note: no-op for static grid.
  * This is a shortcut for:
  * @example
  *  grid.enableMove(true);
  *  grid.enableResize(true);
  */
GridStack.prototype.enable = function(): GridStack {
  if (this.opts.staticGrid) return;
  this.enableMove(true);
  this.enableResize(true);
  this._triggerEvent('enable');
  return this;
}

/**
  * Enables/disables widget moving. No-op for static grids.
  *
  * @param doEnable
  * @param includeNewWidgets will force new widgets to be draggable as per
  * doEnable`s value by changing the disableDrag grid option (default: true).
  */
GridStack.prototype.enableMove = function(doEnable: boolean, includeNewWidgets = true): GridStack {
  if (this.opts.staticGrid) return this; // can't move a static grid!
  this.getGridItems().forEach(el => this.movable(el, doEnable));
  if (includeNewWidgets) {
    this.opts.disableDrag = !doEnable;
  }
  return this;
}

/**
  * Enables/disables widget resizing. No-op for static grids.
  * @param doEnable
  * @param includeNewWidgets will force new widgets to be draggable as per
  * doEnable`s value by changing the disableResize grid option (default: true).
  */
GridStack.prototype.enableResize = function(doEnable: boolean, includeNewWidgets = true): GridStack {
  if (this.opts.staticGrid) return this; // can't size a static grid!
  this.getGridItems().forEach(el => this.resizable(el, doEnable));
  if (includeNewWidgets) {
    this.opts.disableResize = !doEnable;
  }
  return this;
}
