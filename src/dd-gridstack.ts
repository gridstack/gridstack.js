/**
 * dd-gridstack.ts 7.1.1-dev
 * Copyright (c) 2021 Alain Dumesny - see GridStack root license
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { GridItemHTMLElement, GridStackNode, GridStackElement, DDUIData, DDDragInOpt, GridStackPosition, dragInDefaultOptions, GridStackOptions } from './types';
import { GridStack } from './gridstack';
import { Utils } from './utils';
import { DDManager } from './dd-manager';
import { DDElement, DDElementHost } from './dd-element';

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

// let count = 0; // TEST

/**
 * HTML Native Mouse and Touch Events Drag and Drop functionality.
 */
export class DDGridStack {

  /** get the global (but static to this code) DD implementation */
  static get(): DDGridStack {
    return dd;
  }

  public resizable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): DDGridStack {
    this._getDDElements(el).forEach(dEl => {
      if (opts === 'disable' || opts === 'enable') {
        dEl.ddResizable && dEl.ddResizable[opts](); // can't create DD as it requires options for setupResizable()
      } else if (opts === 'destroy') {
        dEl.ddResizable && dEl.cleanResizable();
      } else if (opts === 'option') {
        dEl.setupResizable({ [key]: value });
      } else {
        const grid = dEl.el.gridstackNode.grid;
        let handles = dEl.el.getAttribute('gs-resize-handles') ? dEl.el.getAttribute('gs-resize-handles') : grid.opts.resizable.handles;
        let autoHide = !grid.opts.alwaysShowResizeHandle;
        dEl.setupResizable({
          ...grid.opts.resizable,
          ...{ handles, autoHide },
          ...{
            start: opts.start,
            stop: opts.stop,
            resize: opts.resize
          }
        });
      }
    });
    return this;
  }

  public draggable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): DDGridStack {
    this._getDDElements(el).forEach(dEl => {
      if (opts === 'disable' || opts === 'enable') {
        dEl.ddDraggable && dEl.ddDraggable[opts](); // can't create DD as it requires options for setupDraggable()
      } else if (opts === 'destroy') {
        dEl.ddDraggable && dEl.cleanDraggable();
      } else if (opts === 'option') {
        dEl.setupDraggable({ [key]: value });
      } else {
        const grid = dEl.el.gridstackNode.grid;
        dEl.setupDraggable({
          ...grid.opts.draggable,
          ...{
            // containment: (grid.parentGridItem && !grid.opts.dragOut) ? grid.el.parentElement : (grid.opts.draggable.containment || null),
            start: opts.start,
            stop: opts.stop,
            drag: opts.drag
          }
        });
      }
    });
    return this;
  }

  public dragIn(el: GridStackElement, opts: DDDragInOpt): DDGridStack {
    this._getDDElements(el).forEach(dEl => dEl.setupDraggable(opts));
    return this;
  }

  public droppable(el: GridItemHTMLElement, opts: DDOpts | DDDropOpt, key?: DDKey, value?: DDValue): DDGridStack {
    if (typeof opts.accept === 'function' && !opts._accept) {
      opts._accept = opts.accept;
      opts.accept = (el) => opts._accept(el);
    }
    this._getDDElements(el).forEach(dEl => {
      if (opts === 'disable' || opts === 'enable') {
        dEl.ddDroppable && dEl.ddDroppable[opts]();
      } else if (opts === 'destroy') {
        if (dEl.ddDroppable) { // error to call destroy if not there
          dEl.cleanDroppable();
        }
      } else if (opts === 'option') {
        dEl.setupDroppable({ [key]: value });
      } else {
        dEl.setupDroppable(opts);
      }
    });
    return this;
  }

  /** true if element is droppable */
  public isDroppable(el: DDElementHost): boolean {
    return !!(el && el.ddElement && el.ddElement.ddDroppable && !el.ddElement.ddDroppable.disabled);
  }

  /** true if element is draggable */
  public isDraggable(el: DDElementHost): boolean {
    return !!(el && el.ddElement && el.ddElement.ddDraggable && !el.ddElement.ddDraggable.disabled);
  }

  /** true if element is draggable */
  public isResizable(el: DDElementHost): boolean {
    return !!(el && el.ddElement && el.ddElement.ddResizable && !el.ddElement.ddResizable.disabled);
  }

  public on(el: GridItemHTMLElement, name: string, callback: DDCallback): DDGridStack {
    this._getDDElements(el).forEach(dEl =>
      dEl.on(name, (event: Event) => {
        callback(
          event,
          DDManager.dragElement ? DDManager.dragElement.el : event.target as GridItemHTMLElement,
          DDManager.dragElement ? DDManager.dragElement.helper : null)
      })
    );
    return this;
  }

  public off(el: GridItemHTMLElement, name: string): DDGridStack {
    this._getDDElements(el).forEach(dEl => dEl.off(name));
    return this;
  }

  /** @internal returns a list of DD elements, creating them on the fly by default */
  protected _getDDElements(els: GridStackElement, create = true): DDElement[] {
    let hosts = Utils.getElements(els) as DDElementHost[];
    if (!hosts.length) return [];
    let list = hosts.map(e => e.ddElement || (create ? DDElement.init(e) : null));
    if (!create) { list.filter(d => d); } // remove nulls
    return list;
  }
}

/** global instance */
const dd = new DDGridStack;

/********************************************************************************
 * GridStack code that is doing drag&drop extracted here so main class is smaller
 * for static grid that don't do any of this work anyway. Saves about 31k (41k -> 72k)
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 * https://www.typescriptlang.org/docs/handbook/mixins.html
 ********************************************************************************/

/** @internal called to add drag over to support widgets being added externally */
GridStack.prototype._setupAcceptWidget = function(this: GridStack): GridStack {

  // check if we need to disable things
  if (this.opts.staticGrid || (!this.opts.acceptWidgets && !this.opts.removable)) {
    dd.droppable(this.el, 'destroy');
    return this;
  }

  // vars shared across all methods
  let cellHeight: number, cellWidth: number;

  let onDrag = (event: DragEvent, el: GridItemHTMLElement, helper: GridItemHTMLElement) => {
    let node = el.gridstackNode;
    if (!node) return;

    helper = helper || el;
    let parent = this.el.getBoundingClientRect();
    let {top, left} = helper.getBoundingClientRect();
    left -= parent.left;
    top -= parent.top;
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
          dd.off(el, 'drag'); // stop calling us
          return; // full grid or can't grow
        }
        if (node._willFitPos) {
          // use the auto position instead #1687
          Utils.copyPos(node, node._willFitPos);
          delete node._willFitPos;
        }
      }

      // re-use the existing node dragging method
      this._onStartMoving(helper, event, ui, node, cellWidth, cellHeight);
    } else {
      // re-use the existing node dragging that does so much of the collision detection
      this._dragOrResize(helper, event, ui, node, cellWidth, cellHeight);
    }
  }

  dd.droppable(this.el, {
    accept: (el: GridItemHTMLElement) => {
      let node: GridStackNode = el.gridstackNode;
      // set accept drop to true on ourself (which we ignore) so we don't get "can't drop" icon in HTML5 mode while moving
      if (node?.grid === this) return true;
      if (!this.opts.acceptWidgets) return false;
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
        let n = {w: node.w, h: node.h, minW: node.minW, minH: node.minH}; // only width/height matters and autoPosition
        canAccept = this.engine.willItFit(n);
      }
      return canAccept;
    }
  })
  /**
   * entering our grid area
   */
    .on(this.el, 'dropover', (event: Event, el: GridItemHTMLElement, helper: GridItemHTMLElement) => {
    // console.log(`over ${this.el.gridstack.opts.id} ${count++}`); // TEST
      let node = el.gridstackNode;
      // ignore drop enter on ourself (unless we temporarily removed) which happens on a simple drag of our item
      if (node?.grid === this && !node._temporaryRemoved) {
      // delete node._added; // reset this to track placeholder again in case we were over other grid #1484 (dropout doesn't always clear)
        return false; // prevent parent from receiving msg (which may be a grid as well)
      }

      // fix #1578 when dragging fast, we may not get a leave on the previous grid so force one now
      if (node?.grid && node.grid !== this && !node._temporaryRemoved) {
      // console.log('dropover without leave'); // TEST
        let otherGrid = node.grid;
        otherGrid._leave(el, helper);
      }

      // cache cell dimensions (which don't change), position can animate if we removed an item in otherGrid that affects us...
      cellWidth = this.cellWidth();
      cellHeight = this.getCellHeight(true);

      // load any element attributes if we don't have a node
      if (!node) {// @ts-ignore private read only on ourself
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
      // console.log('dropover cloning node'); // TEST
        if (!el._gridstackNodeOrig) el._gridstackNodeOrig = node; // shouldn't have multiple nested!
        el.gridstackNode = node = {...node, w, h, grid: this};
        this.engine.cleanupNode(node)
          .nodeBoundFix(node);
        // restore some internal fields we need after clearing them all
        node._initDD =
      node._isExternal =  // DOM needs to be re-parented on a drop
      node._temporaryRemoved = true; // so it can be inserted onDrag below
      } else {
        node.w = w; node.h = h;
        node._temporaryRemoved = true; // so we can insert it
      }

      // clear any marked for complete removal (Note: don't check _isAboutToRemove as that is cleared above - just do it)
      _itemRemoving(node.el, false);

      dd.on(el, 'drag', onDrag);
      // make sure this is called at least once when going fast #1578
      onDrag(event as DragEvent, el, helper);
      return false; // prevent parent from receiving msg (which may be a grid as well)
    })
  /**
   * Leaving our grid area...
   */
    .on(this.el, 'dropout', (event, el: GridItemHTMLElement, helper: GridItemHTMLElement) => {
    // console.log(`out ${this.el.gridstack.opts.id} ${count++}`); // TEST
      let node = el.gridstackNode;
      if (!node) return false;
      // fix #1578 when dragging fast, we might get leave after other grid gets enter (which calls us to clean)
      // so skip this one if we're not the active grid really..
      if (!node.grid || node.grid === this) {
        this._leave(el, helper);
        // if we were created as temporary nested grid, go back to before state
        if (this._isTemp) {
          this.removeAsSubGrid(node);
        }
      }
      return false; // prevent parent from receiving msg (which may be grid as well)
    })
  /**
   * end - releasing the mouse
   */
    .on(this.el, 'drop', (event, el: GridItemHTMLElement, helper: GridItemHTMLElement) => {
      let node = el.gridstackNode;
      // ignore drop on ourself from ourself that didn't come from the outside - dragend will handle the simple move instead
      if (node?.grid === this && !node._isExternal) return false;

      let wasAdded = !!this.placeholder.parentElement; // skip items not actually added to us because of constrains, but do cleanup #1419
      this.placeholder.remove();

      // notify previous grid of removal
      // console.log('drop delete _gridstackNodeOrig') // TEST
      let origNode = el._gridstackNodeOrig;
      delete el._gridstackNodeOrig;
      if (wasAdded && origNode?.grid && origNode.grid !== this) {
        let oGrid = origNode.grid;
        oGrid.engine.removedNodes.push(origNode);
        oGrid._triggerRemoveEvent();
        // if it's an empty sub-grid, to get auto-created, nuke it
        if (oGrid.parentGridItem && !oGrid.engine.nodes.length && oGrid.opts.subGridDynamic) {
          oGrid.removeAsSubGrid();
        }
      }

      if (!node) return false;

      // use existing placeholder node as it's already in our list with drop location
      if (wasAdded) {
        this.engine.cleanupNode(node); // removes all internal _xyz values
        node.grid = this;
      }
      dd.off(el, 'drag');
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
        this._removeDD(el);
      }
      if (!wasAdded) return false;
      el.gridstackNode = node;
      node.el = el;
      let subGrid = (node.subGrid as GridStack)?.el?.gridstack; // set when actual sub-grid present
      // @ts-ignore
      Utils.copyPos(node, this._readAttr(this.placeholder)); // placeholder values as moving VERY fast can throw things off #1578
      Utils.removePositioningStyles(el);// @ts-ignore
      this._writeAttr(el, node);
      this.el.appendChild(el);// @ts-ignore // TODO: now would be ideal time to _removeHelperStyle() overriding floating styles (native only)
      if (subGrid) {
        subGrid.parentGridItem = node;
        if (!subGrid.opts.styleInHead) subGrid._updateStyles(true); // re-create sub-grid styles now that we've moved
      }
      this._updateContainerHeight();
      this.engine.addedNodes.push(node);// @ts-ignore
      this._triggerAddEvent();// @ts-ignore
      this._triggerChangeEvent();

      this.engine.endUpdate();
      if (this._gsEventHandler['dropped']) {
        this._gsEventHandler['dropped']({...event, type: 'dropped'}, origNode && origNode.grid ? origNode : undefined, node);
      }

      // wait till we return out of the drag callback to set the new drag&resize handler or they may get messed up
      window.setTimeout(() => {
      // IFF we are still there (some application will use as placeholder and insert their real widget instead and better call makeWidget())
        if (node.el && node.el.parentElement) {
          this._prepareDragDropByNode(node);
        } else {
          this.engine.removeNode(node);
        }
        delete node.grid._isTemp;
      });

      return false; // prevent parent from receiving msg (which may be grid as well)
    });
  return this;
}

/** @internal mark item for removal */
function _itemRemoving(el: GridItemHTMLElement, remove: boolean) {
  let node = el ? el.gridstackNode : undefined;
  if (!node || !node.grid) return;
  remove ? node._isAboutToRemove = true : delete node._isAboutToRemove;
  remove ? el.classList.add('grid-stack-item-removing') : el.classList.remove('grid-stack-item-removing');
}

/** @internal called to setup a trash drop zone if the user specifies it */
GridStack.prototype._setupRemoveDrop = function(this: GridStack): GridStack {
  if (!this.opts.staticGrid && typeof this.opts.removable === 'string') {
    let trashEl = document.querySelector(this.opts.removable) as HTMLElement;
    if (!trashEl) return this;
    // only register ONE drop-over/dropout callback for the 'trash', and it will
    // update the passed in item and parent grid because the 'trash' is a shared resource anyway,
    // and Native DD only has 1 event CB (having a list and technically a per grid removableOptions complicates things greatly)
    if (!dd.isDroppable(trashEl)) {
      dd.droppable(trashEl, this.opts.removableOptions)
        .on(trashEl, 'dropover', (event, el) => _itemRemoving(el, true))
        .on(trashEl, 'dropout',  (event, el) => _itemRemoving(el, false));
    }
  }
  return this;
}

/**
 * call to setup dragging in from the outside (say toolbar), by specifying the class selection and options.
 * Called during GridStack.init() as options, but can also be called directly (last param are used) in case the toolbar
 * is dynamically create and needs to change later.
 **/
GridStack.setupDragIn = function(this: GridStack, dragIn?: string, dragInOptions?: DDDragInOpt) {
  if (dragInOptions?.pause !== undefined) {
    DDManager.pauseDrag = dragInOptions.pause;
  }

  if (typeof dragIn === 'string') {
    dragInOptions = {...dragInDefaultOptions, ...(dragInOptions || {})};
    Utils.getElements(dragIn).forEach(el => {
      if (!dd.isDraggable(el)) dd.dragIn(el, dragInOptions);
    });
  }
}

/** @internal prepares the element for drag&drop **/
GridStack.prototype._prepareDragDropByNode = function(this: GridStack, node: GridStackNode): GridStack {
  let el = node.el;
  const noMove = node.noMove || this.opts.disableDrag;
  const noResize = node.noResize || this.opts.disableResize;

  // check for disabled grid first
  if (this.opts.staticGrid || (noMove && noResize)) {
    if (node._initDD) {
      this._removeDD(el); // nukes everything instead of just disable, will add some styles back next
      delete node._initDD;
    }
    el.classList.add('ui-draggable-disabled', 'ui-resizable-disabled'); // add styles one might depend on #1435
    return this;
  }

  if (!node._initDD) {
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

      this._onStartMoving(el, event, ui, node, cellWidth, cellHeight);
    }

    /** called when item is being dragged/resized */
    let dragOrResize = (event: Event, ui: DDUIData) => {
      this._dragOrResize(el, event, ui, node, cellWidth, cellHeight);
    }

    /** called when the item stops moving/resizing */
    let onEndMoving = (event: Event) => {
      this.placeholder.remove();
      delete node._moving;
      delete node._event;
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
        this._removeDD(el);
        gridToNotify.engine.removedNodes.push(node);
        gridToNotify._triggerRemoveEvent();
        // break circular links and remove DOM
        delete el.gridstackNode;
        delete node.el;
        el.remove();
      } else {
        Utils.removePositioningStyles(target);
        if (node._temporaryRemoved) {
          // got removed - restore item back to before dragging position
          Utils.copyPos(node, node._orig);// @ts-ignore
          this._writePosAttr(target, node);
          this.engine.addNode(node);
        } else {
          // move to new placeholder location
          this._writePosAttr(target, node);
        }
        if (this._gsEventHandler[event.type]) {
          this._gsEventHandler[event.type](event, target);
        }
      }
      // @ts-ignore
      this._extraDragRow = 0;// @ts-ignore
      this._updateContainerHeight();// @ts-ignore
      this._triggerChangeEvent();

      this.engine.endUpdate();
    }

    dd.draggable(el, {
      start: onStartMoving,
      stop: onEndMoving,
      drag: dragOrResize
    }).resizable(el, {
      start: onStartMoving,
      stop: onEndMoving,
      resize: dragOrResize
    });
    node._initDD = true; // we've set DD support now
  }

  // finally fine tune move vs resize by disabling any part...
  dd.draggable(el, noMove ? 'disable' : 'enable')
    .resizable(el, noResize ? 'disable' : 'enable');

  return this;
}

/** @internal called when item is starting a drag/resize */
GridStack.prototype._onStartMoving = function(this: GridStack, el: GridItemHTMLElement, event: Event, ui: DDUIData, node: GridStackNode, cellWidth: number, cellHeight: number) {
  this.engine.cleanNodes()
    .beginUpdate(node);
  // @ts-ignore
  this._writePosAttr(this.placeholder, node)
  this.el.appendChild(this.placeholder);
  // console.log('_onStartMoving placeholder') // TEST

  node.el = this.placeholder;
  node._lastUiPosition = ui.position;
  node._prevYPix = ui.position.top;
  node._moving = (event.type === 'dragstart'); // 'dropover' are not initially moving so they can go exactly where they enter (will push stuff out of the way)
  delete node._lastTried;

  if (event.type === 'dropover' && node._temporaryRemoved) {
    // console.log('engine.addNode x=' + node.x); // TEST
    this.engine.addNode(node); // will add, fix collisions, update attr and clear _temporaryRemoved
    node._moving = true; // AFTER, mark as moving object (wanted fix location before)
  }

  // set the min/max resize info
  this.engine.cacheRects(cellWidth, cellHeight, this.opts.marginTop as number, this.opts.marginRight as number, this.opts.marginBottom as number, this.opts.marginLeft as number);
  if (event.type === 'resizestart') {
    dd.resizable(el, 'option', 'minWidth', cellWidth * (node.minW || 1))
      .resizable(el, 'option', 'minHeight', cellHeight * (node.minH || 1));
    if (node.maxW) { dd.resizable(el, 'option', 'maxWidth', cellWidth * node.maxW); }
    if (node.maxH) { dd.resizable(el, 'option', 'maxHeight', cellHeight * node.maxH); }
  }
}

/** @internal called when item leaving our area by either cursor dropout event
 * or shape is outside our boundaries. remove it from us, and mark temporary if this was
 * our item to start with else restore prev node values from prev grid it came from.
 **/
GridStack.prototype._leave = function(this: GridStack, el: GridItemHTMLElement, helper?: GridItemHTMLElement)  {
  let node = el.gridstackNode;
  if (!node) return;

  dd.off(el, 'drag'); // no need to track while being outside

  // this gets called when cursor leaves and shape is outside, so only do this once
  if (node._temporaryRemoved) return;
  node._temporaryRemoved = true;

  this.engine.removeNode(node); // remove placeholder as well, otherwise it's a sign node is not in our list, which is a bigger issue
  node.el = node._isExternal && helper ? helper : el; // point back to real item being dragged

  if (this.opts.removable === true) { // boolean vs a class string
    // item leaving us and we are supposed to remove on leave (no need to drag onto trash) mark it so
    _itemRemoving(el, true);
  }

  // finally if item originally came from another grid, but left us, restore things back to prev info
  if (el._gridstackNodeOrig) {
    // console.log('leave delete _gridstackNodeOrig') // TEST
    el.gridstackNode = el._gridstackNodeOrig;
    delete el._gridstackNodeOrig;
  } else if (node._isExternal) {
    // item came from outside (like a toolbar) so nuke any node info
    delete node.el;
    delete el.gridstackNode;
    // and restore all nodes back to original
    this.engine.restoreInitial();
  }
}

/** @internal called when item is being dragged/resized */
GridStack.prototype._dragOrResize = function(this: GridStack, el: GridItemHTMLElement, event: MouseEvent, ui: DDUIData,
  node: GridStackNode, cellWidth: number, cellHeight: number)  {
  let p = {...node._orig}; // could be undefined (_isExternal) which is ok (drag only set x,y and w,h will default to node value)
  let resizing: boolean;
  let mLeft = this.opts.marginLeft as number,
    mRight = this.opts.marginRight as number,
    mTop = this.opts.marginTop as number,
    mBottom = this.opts.marginBottom as number;

  // if margins (which are used to pass mid point by) are large relative to cell height/width, reduce them down #1855
  let mHeight = Math.round(cellHeight * 0.1),
    mWidth = Math.round(cellWidth * 0.1);
  mLeft = Math.min(mLeft, mWidth);
  mRight = Math.min(mRight, mWidth);
  mTop = Math.min(mTop, mHeight);
  mBottom = Math.min(mBottom, mHeight);

  if (event.type === 'drag') {
    if (node._temporaryRemoved) return; // handled by dropover
    let distance = ui.position.top - node._prevYPix;
    node._prevYPix = ui.position.top;
    Utils.updateScrollPosition(el, ui.position, distance);

    // get new position taking into account the margin in the direction we are moving! (need to pass mid point by margin)
    let left = ui.position.left + (ui.position.left > node._lastUiPosition.left  ? -mRight : mLeft);
    let top = ui.position.top + (ui.position.top > node._lastUiPosition.top  ? -mBottom : mTop);
    p.x = Math.round(left / cellWidth);
    p.y = Math.round(top / cellHeight);

    // @ts-ignore// if we're at the bottom hitting something else, grow the grid so cursor doesn't leave when trying to place below others
    let prev = this._extraDragRow;
    if (this.engine.collide(node, p)) {
      let row = this.getRow();
      let extra = Math.max(0, (p.y + node.h) - row);
      if (this.opts.maxRow && row + extra > this.opts.maxRow) {
        extra = Math.max(0, this.opts.maxRow - row);
      }// @ts-ignore
      this._extraDragRow = extra;// @ts-ignore
    } else this._extraDragRow = 0;// @ts-ignore
    if (this._extraDragRow !== prev) this._updateContainerHeight();

    if (node.x === p.x && node.y === p.y) return; // skip same
    // DON'T skip one we tried as we might have failed because of coverage <50% before
    // if (node._lastTried && node._lastTried.x === x && node._lastTried.y === y) return;
  } else if (event.type === 'resize')  {
    if (p.x < 0) return;
    // Scrolling page if needed
    Utils.updateScrollResize(event, el, cellHeight);

    // get new size
    p.w = Math.round((ui.size.width - mLeft) / cellWidth);
    p.h = Math.round((ui.size.height - mTop) / cellHeight);
    if (node.w === p.w && node.h === p.h) return;
    if (node._lastTried && node._lastTried.w === p.w && node._lastTried.h === p.h) return; // skip one we tried (but failed)

    // if we size on left/top side this might move us, so get possible new position as well
    let left = ui.position.left + mLeft;
    let top = ui.position.top + mTop;
    p.x = Math.round(left / cellWidth);
    p.y = Math.round(top / cellHeight);

    resizing = true;
  }

  node._event = event;
  node._lastTried = p; // set as last tried (will nuke if we go there)
  let rect: GridStackPosition = { // screen pix of the dragged box
    x: ui.position.left + mLeft,
    y: ui.position.top + mTop,
    w: (ui.size ? ui.size.width : node.w * cellWidth) - mLeft - mRight,
    h: (ui.size ? ui.size.height : node.h * cellHeight) - mTop - mBottom
  };
  if (this.engine.moveNodeCheck(node, {...p, cellWidth, cellHeight, rect, resizing})) {
    node._lastUiPosition = ui.position;
    this.engine.cacheRects(cellWidth, cellHeight, mTop, mRight, mBottom, mLeft);
    delete node._skipDown;
    if (resizing && node.subGrid) { (node.subGrid as GridStack).onParentResize(); }// @ts-ignore
    this._extraDragRow = 0;// @ts-ignore
    this._updateContainerHeight();

    let target = event.target as GridItemHTMLElement;// @ts-ignore
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
GridStack.prototype.movable = function(this: GridStack, els: GridStackElement, val: boolean): GridStack {
  if (this.opts.staticGrid) return this; // can't move a static grid!
  GridStack.getElements(els).forEach(el => {
    let node = el.gridstackNode;
    if (!node) return;
    if (val) delete node.noMove; else node.noMove = true;
    this._prepareDragDropByNode(node); // init DD if need be, and adjust
  });
  return this;
}

/**
 * Enables/Disables resizing.
 * @param els  widget or selector to modify
 * @param val  if true widget will be resizable.
 */
GridStack.prototype.resizable = function(this: GridStack, els: GridStackElement, val: boolean): GridStack {
  if (this.opts.staticGrid) return this; // can't resize a static grid!
  GridStack.getElements(els).forEach(el => {
    let node = el.gridstackNode;
    if (!node) return;
    if (val) delete node.noResize; else node.noResize = true;
    this._prepareDragDropByNode(node); // init DD if need be, and adjust
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
GridStack.prototype.disable = function(this: GridStack): GridStack {
  if (this.opts.staticGrid) return;
  this.enableMove(false);
  this.enableResize(false);// @ts-ignore
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
GridStack.prototype.enable = function(this: GridStack): GridStack {
  if (this.opts.staticGrid) return;
  this.enableMove(true);
  this.enableResize(true);// @ts-ignore
  this._triggerEvent('enable');
  return this;
}

/** Enables/disables widget moving. No-op for static grids. */
GridStack.prototype.enableMove = function(this: GridStack, doEnable: boolean): GridStack {
  if (this.opts.staticGrid) return this; // can't move a static grid!
  this.opts.disableDrag = !doEnable; // FIRST before we update children as grid overrides #1658
  this.engine.nodes.forEach(n => this.movable(n.el, doEnable));
  return this;
}

/** Enables/disables widget resizing. No-op for static grids. */
GridStack.prototype.enableResize = function(this: GridStack, doEnable: boolean): GridStack {
  if (this.opts.staticGrid) return this; // can't size a static grid!
  this.opts.disableResize = !doEnable; // FIRST before we update children as grid overrides #1658
  this.engine.nodes.forEach(n => this.resizable(n.el, doEnable));
  return this;
}

/** removes any drag&drop present (called during destroy) */
GridStack.prototype._removeDD = function(this: GridStack, el: DDElementHost): GridStack {
  dd.draggable(el, 'destroy').resizable(el, 'destroy');
  if (el.gridstackNode) {
    delete el.gridstackNode._initDD; // reset our DD init flag
  }
  delete el.ddElement;
  return this;
}

