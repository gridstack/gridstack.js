// gridstack-GridStackDD.get().ts 3.3.0-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/
/* eslint-disable @typescript-eslint/no-unused-vars */

import { GridStackDDI } from './gridstack-ddi';
import { GridItemHTMLElement, GridStackNode, GridStackElement, DDUIData, DDDragInOpt } from './types';
import { GridStack } from './gridstack';
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

  let onDrag = (event, el: GridItemHTMLElement) => {
    let node = el.gridstackNode;
    let pos = this.getCellFromPixel({left: event.pageX, top: event.pageY}, true);
    let x = Math.max(0, pos.x);
    let y = Math.max(0, pos.y);
    if (!node._added) {
      node.x = x;
      node.y = y;
      delete node.autoPosition;

      // don't accept *initial* location if doesn't fit #1419 (locked drop region, or can't grow), but maybe try if it will go somewhere
      if (!this.engine.willItFit(node)) {
        node.autoPosition = true; // ignore x,y and try for any slot...
        if (!this.engine.willItFit(node)) return; // full grid or can't grow
      }
      node._added = true;

      node.el = el;
      this.engine.cleanNodes()
        .beginUpdate(node)
        .addNode(node);

      this._writePosAttr(this.placeholder, node.x, node.y, node.w, node.h);
      this.el.appendChild(this.placeholder);
      node.el = this.placeholder; // dom we update while dragging...

      this._updateContainerHeight();
    } else if (this.engine.moveNodeCheck(node, x, y)) {
      this._updateContainerHeight();
    }
  };

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
    .on(this.el, 'dropover', (event, el: GridItemHTMLElement) => {
      // ignore drop enter on ourself, and prevent parent from receiving event
      let node = el.gridstackNode;
      if (node && node.grid === this) {
        delete node._added; // reset this to track placeholder again in case we were over other grid #1484 (dropout doesn't always clear)
        return false;
      }

      // load any element attributes if we don't have a node
      if (!node) {
        node = this._readAttr(el);
      }

      // if the item came from another grid, let it know it was added here to removed duplicate shadow #393
      if (node.grid && node.grid !== this) {
        node._added = true;
      }

      // if not calculate the grid size based on element outer size
      let w = node.w || Math.round(el.offsetWidth / this.cellWidth()) || 1;
      let h = node.h || Math.round(el.offsetHeight / this.getCellHeight(true)) || 1;

      // copy the node original values (min/max/id/etc...) but override width/height/other flags which are this grid specific
      let newNode = this.engine.prepareNode({...node, ...{w, h, _added: false, _temporary: true}});
      newNode._isOutOfGrid = true;
      el.gridstackNode = newNode;
      el._gridstackNodeOrig = node;

      GridStackDD.get().on(el, 'drag', onDrag);
      return false; // prevent parent from receiving msg (which may be grid as well)
    })
    .on(this.el, 'dropout', (event, el: GridItemHTMLElement) => {
      let node = el.gridstackNode;
      if (!node) return;

      // clear any added flag now that we are leaving #1484
      delete node._added;

      // jquery-ui bug. Must verify widget is being dropped out
      // check node variable that gets set when widget is out of grid
      if (!node._isOutOfGrid) {
        return;
      }

      GridStackDD.get().off(el, 'drag');
      node.el = null;
      this.engine.removeNode(node);
      if (this.placeholder.parentNode === this.el) {
        this.placeholder.remove();
      }
      this._updateContainerHeight();
      el.gridstackNode = el._gridstackNodeOrig;
      return false; // prevent parent from receiving msg (which may be grid as well)
    })
    .on(this.el, 'drop', (event, el: GridItemHTMLElement, helper: GridItemHTMLElement) => {
      let node = el.gridstackNode;
      let wasAdded = !!this.placeholder.parentElement; // skip items not actually added to us because of constrains, but do cleanup #1419
      // ignore drop on ourself from ourself - dragend will handle the simple move instead
      if (node && node.grid === this) return false;

      this.placeholder.remove();

      // notify previous grid of removal
      let origNode = el._gridstackNodeOrig;
      delete el._gridstackNodeOrig;
      if (wasAdded && origNode && origNode.grid && origNode.grid !== this) {
        let oGrid = origNode.grid;
        oGrid.placeholder.remove();
        origNode.el = el; // was using placeholder, have it point to node we've moved instead
        oGrid.engine.removedNodes.push(origNode);
        oGrid._triggerRemoveEvent();
      }

      if (!node) return false;

      // use existing placeholder node as it's already in our list with drop location
      if (wasAdded) {
        const _id = node._id;
        this.engine.cleanupNode(node); // removes all internal _xyz values (including the _id so add that back)
        node._id = _id;
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
      // IFF we are still there (some application will use as placeholder and insert their real widget instead)
      window.setTimeout(() => {
        if (node.el && node.el.parentElement) this._prepareDragDropByNode(node);
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
          el.dataset.inTrashZone = 'true';
          node.grid._setupRemovingTimeout(el);
        })
        .on(trashEl, 'dropout', function(event, el) { // same
          let node = el.gridstackNode;
          if (!node || !node.grid) return;
          delete el.dataset.inTrashZone;
          node.grid._clearRemovingTimeout(el);
        });
    }
  }
  return this;
}

/** @internal */
GridStack.prototype._setupRemovingTimeout = function(el: GridItemHTMLElement): GridStack {
  let node = el.gridstackNode;
  if (!node || node._removeTimeout || !this.opts.removable) return this;
  node._removeTimeout = window.setTimeout(() => {
    el.classList.add('grid-stack-item-removing');
    node._isAboutToRemove = true;
  }, this.opts.removeTimeout);
  return this;
}

/** @internal */
GridStack.prototype._clearRemovingTimeout = function(el: GridItemHTMLElement): GridStack {
  let node = el.gridstackNode;
  if (!node || !node._removeTimeout) return this;
  clearTimeout(node._removeTimeout);
  delete node._removeTimeout;
  el.classList.remove('grid-stack-item-removing');
  delete node._isAboutToRemove;
  return this;
}

/** @internal call to setup dragging in from the outside (say toolbar), with options */
GridStack.prototype._setupDragIn = function():  GridStack {
  if (!this.opts.staticGrid && typeof this.opts.dragIn === 'string') {
    if (!GridStackDD.get().isDraggable(this.opts.dragIn)) {
      GridStackDD.get().dragIn(this.opts.dragIn, this.opts.dragInOptions);
    }
  }
  return this;
}

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
  let onStartMoving = (event: Event, ui: DDUIData): void => {
    let target = event.target as HTMLElement;

    // trigger any 'dragstart' / 'resizestart' manually
    if (this._gsEventHandler[event.type]) {
      this._gsEventHandler[event.type](event, target);
    }

    this.engine.cleanNodes()
      .beginUpdate(node);

    this._writePosAttr(this.placeholder, node.x, node.y, node.w, node.h)
    this.el.append(this.placeholder);

    node.el = this.placeholder;
    node._lastUiPosition = ui.position;
    node._prevYPix = ui.position.top;
    node._moving = (event.type === 'dragstart');
    delete node._lastTried;

    // set the min/max resize info
    cellWidth = this.cellWidth();
    cellHeight = this.getCellHeight(true); // force pixels for calculations
    let dd = GridStackDD.get()
      .resizable(el, 'option', 'minWidth', cellWidth * (node.minW || 1))
      .resizable(el, 'option', 'minHeight', cellHeight * (node.minH || 1));
    if (node.maxW) { dd.resizable(el, 'option', 'maxWidth', cellWidth * node.maxW); }
    if (node.maxH) { dd.resizable(el, 'option', 'maxHeight', cellHeight * node.maxH); }
  }

  /** called when item is being dragged/resized */
  let dragOrResize = (event: Event, ui: DDUIData): void => {
    // calculate the place where we're landing by offsetting margin so actual edge crosses mid point
    let left = ui.position.left + (ui.position.left > node._lastUiPosition.left  ? -this.opts.marginRight : this.opts.marginLeft);
    let top = ui.position.top + (ui.position.top > node._lastUiPosition.top  ? -this.opts.marginBottom : this.opts.marginTop);
    let x = Math.round(left / cellWidth);
    let y = Math.round(top / cellHeight);
    let w: number;
    let h: number;
    let resizing: boolean;

    if (event.type === 'drag') {
      let distance = ui.position.top - node._prevYPix;
      node._prevYPix = ui.position.top;
      Utils.updateScrollPosition(el, ui.position, distance);
      // if inTrash, outside of the bounds or added to another grid (#393) temporarily remove it from us
      if (el.dataset.inTrashZone || node._added || this.engine.isOutside(x, y, node)) {
        if (node._temporaryRemoved) return;
        if (this.opts.removable === true) {
          this._setupRemovingTimeout(el);
        }

        x = node._beforeDrag.x;
        y = node._beforeDrag.y;

        if (this.placeholder.parentNode === this.el) {
          this.placeholder.remove();
        }
        this.engine.removeNode(node);
        this._updateContainerHeight();

        node._temporaryRemoved = true;
        delete node._added; // no need for this now
      } else {
        if (node._removeTimeout) this._clearRemovingTimeout(el);

        if (node._temporaryRemoved) {
          this.engine.addNode(node);
          this._writePosAttr(this.placeholder, x, y, w, h);
          this.el.appendChild(this.placeholder);
          node.el = this.placeholder;
          delete node._temporaryRemoved;
        }
      }
      if (node.x === x && node.y === y) return; // skip same
      if (node._lastTried && node._lastTried.x === x && node._lastTried.y === y) return; // skip one we tried (but failed)
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
    if (this.engine.moveNodeCheck(node, x, y, w, h)) {
      node._lastUiPosition = ui.position;
      delete node._skipDown;
      if (resizing && node.subGrid) { (node.subGrid as GridStack).onParentResize(); }
      this._updateContainerHeight();
    }
  }

  /** called when the item stops moving/resizing */
  let onEndMoving = (event: Event): void => {
    if (this.placeholder.parentNode === this.el) {
      this.placeholder.remove();
    }
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
      gridToNotify.engine.removedNodes.push(node);
      GridStackDD.get().remove(el);
      delete el.gridstackNode; // hint we're removing it next and break circular link
      gridToNotify._triggerRemoveEvent();
      if (el.parentElement) {
        el.remove(); // finally remove it
      }
    } else {
      this._clearRemovingTimeout(el);
      if (!node._temporaryRemoved) {
        Utils.removePositioningStyles(target);
        this._writePosAttr(target, node.x, node.y, node.w, node.h);
      } else {
        Utils.removePositioningStyles(target);
        this._writePosAttr(target, node._beforeDrag.x, node._beforeDrag.y, node.w, node.h);
        node.x = node._beforeDrag.x;
        node.y = node._beforeDrag.y;
        delete node._temporaryRemoved;
        this.engine.addNode(node);
      }
      if (this._gsEventHandler[event.type]) {
        this._gsEventHandler[event.type](event, target);
      }
    }

    this._updateContainerHeight();
    this._triggerChangeEvent();

    this.engine.endUpdate();

    /* doing it on live resize instead
    // if we re-sized a nested grid item, let the children resize as well
    if (event.type === 'resizestop') {
      if (target.gridstackNode.subGrid) {(target.gridstackNode.subGrid as GridStack).onParentResize()}
    }
    */
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
