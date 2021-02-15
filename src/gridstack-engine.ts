// gridstack-engine.ts 3.3.0-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/

import { Utils, obsolete } from './utils';
import { GridStackNode, ColumnOptions } from './types';

export type onChangeCB = (nodes: GridStackNode[], removeDOM?: boolean) => void;

/** options used for creations - similar to GridStackOptions */
export interface GridStackEngineOptions {
  column?: number;
  maxRow?: number;
  float?: boolean;
  nodes?: GridStackNode[];
  onChange?: onChangeCB;
}

/**
 * Defines the GridStack engine that does most no DOM grid manipulation.
 * See GridStack methods and vars for descriptions.
 *
 * NOTE: values should not be modified directly - call the main GridStack API instead
 */
export class GridStackEngine {
  public column: number;
  public maxRow: number;
  public nodes: GridStackNode[];
  public onChange: onChangeCB;
  public addedNodes: GridStackNode[] = [];
  public removedNodes: GridStackNode[] = [];
  public batchMode: boolean;
  /** @internal */
  private _float: boolean;
  /** @internal */
  private _prevFloat: boolean;
  /** @internal */
  private _layouts?: Layout[][]; // maps column # to array of values nodes
  /** @internal */
  private _ignoreLayoutsNodeChange: boolean;
  /** @internal */
  private static _idSeq = 1;

  public constructor(opts: GridStackEngineOptions = {}) {
    this.column = opts.column || 12;
    this.onChange = opts.onChange;
    this._float = opts.float;
    this.maxRow = opts.maxRow;
    this.nodes = opts.nodes || [];
  }

  public batchUpdate(): GridStackEngine {
    if (this.batchMode) return this;
    this.batchMode = true;
    this._prevFloat = this._float;
    this._float = true; // let things go anywhere for now... commit() will restore and possibly reposition
    return this;
  }

  public commit(): GridStackEngine {
    if (!this.batchMode) return this;
    this.batchMode = false;
    this._float = this._prevFloat;
    delete this._prevFloat;
    return this._packNodes()
      ._notify();
  }

  /** @internal fix collision on given 'node', going to given new location 'nn', with optional 'collide' node already found.
   * return true if we moved. */
  private _fixCollisions(node: GridStackNode, nn = node, collide?: GridStackNode, disableSwap?: boolean): boolean {
    // this._sortNodes(-1); collision doesn't care about sorting
    collide = collide || this.collision(node, nn);
    if (!collide) return false;

    // swap check: if we're actively moving in gravity mode, see if we collide with an object the same size
    if (node._moving && !disableSwap && !this.float) {
      if (this.swap(node, collide)) return true;
    }

    let didMove = false;
    while (collide = collide || this.collision(node, nn)) { // we could start colliding more than 1 item... so repeat for each
      let moved: boolean;
      // if colliding with locked item, OR moving down to a different sized item (not handle with swap) that could take our place, move ourself past instead
      if (collide.locked || (node._moving && !node._skipDown && nn.y > node.y &&
        !this.float && !this.collision(collide, {...collide, y: node.y}, node)) &&
        Utils.isIntercepted(collide, {x: node.x-0.5, y: node.y-0.5, w: node.w+1, h: node.h+1})) {

        node._skipDown = (node._skipDown || nn.y > node.y);
        moved = this.moveNode(node, nn.x, collide.y + collide.h, nn.w, nn.h, false, false, true); // pack & sanitize = false, disableSwap = true
        nn = moved ? {x: node.x, y: node.y, w: node.w, h: node.h} : nn;
        didMove = didMove || moved;
      } else {
        // move collide down *after* us
        moved = this.moveNode(collide, collide.x, nn.y + nn.h, collide.w, collide.h, false, false, true); // pack & sanitize = false, disableSwap = true
      }
      if (!moved) { return didMove; } // break inf loop if we couldn't move after all (ex: maxRow, fixed)
      collide = undefined;
    }
    return didMove;
  }

  /** return the first node that intercept the given node. Optionally a different area can be used, as well as a second node to skip */
  public collision(skip: GridStackNode, area = skip, skip2?: GridStackNode): GridStackNode {
    return this.nodes.find(n => n !== skip && n !== skip2 && Utils.isIntercepted(n, area))
  }

  /** return any intercepted node with the given area, skipping the passed in node (usually self) */
  public collide(node: GridStackNode, area: GridStackNode = node): GridStackNode {
    return this.nodes.find(n => n !== node && Utils.isIntercepted(n, area));
  }

  /** called to possibly swap between 2 nodes (same size, not locked, touching), returning true if successful */
  public swap(a: GridStackNode, b: GridStackNode): boolean {
    if (!b || b.locked || !a || a.locked) return false;

    function _doSwap(): true {
      let x = a.x, y = a.y;
      a.x = b.x; a.y = b.y;
      b.x = x; b.y = y;
      a._dirty = b._dirty = true;
      return true;
    }

    if (a.w === b.w && a.h === b.h && Utils.isIntercepted(b, {x: a.x-0.5, y:a.y-0.5, w: a.w+1, h: a.h+1})) // same size and touching
      return _doSwap();
    /* different X will be weird (expect vertical swap) and different height overlap, so too complex. user regular layout instead
    // else check if swapping would not collide with anything else (requiring a re-layout)
    if (!this.collision(a, {x: a.x, y: a.y, w: b.w, h: b.h}, b) &&
        !this.collision(a, {x: b.x, y: b.y, w: a.w, h: a.h}, b))
      return _doSwap(); */
    return false;
  }

  public isAreaEmpty(x: number, y: number, w: number, h: number): boolean {
    let nn: GridStackNode = {x: x || 0, y: y || 0, w: w || 1, h: h || 1};
    return !this.collide(nn);
  }

  /** re-layout grid items to reclaim any empty space */
  public compact(): GridStackEngine {
    if (this.nodes.length === 0) return this;
    this.batchUpdate()
      ._sortNodes();
    let copyNodes = this.nodes;
    this.nodes = []; // pretend we have no nodes to conflict layout to start with...
    copyNodes.forEach(node => {
      if (!node.locked) {
        node.autoPosition = true;
      }
      this.addNode(node, false); // 'false' for add event trigger
      node._dirty = true; // will force attr update
    });
    return this.commit();
  }

  /** enable/disable floating widgets (default: `false`) See [example](http://gridstackjs.com/demo/float.html) */
  public set float(val: boolean) {
    if (this._float === val) return;
    this._float = val || false;
    if (!val) {
      this._packNodes()._notify();
    }
  }

  /** float getter method */
  public get float(): boolean { return this._float || false; }

  /** @internal */
  private _sortNodes(dir?: -1 | 1): GridStackEngine {
    this.nodes = Utils.sort(this.nodes, dir, this.column);
    return this;
  }

  /** @internal called to top gravity pack the items back */
  private _packNodes(): GridStackEngine {
    this._sortNodes();

    if (this.float) {
      this.nodes.forEach(n => {
        if (n._updating || n._packY === undefined || n.y === n._packY) return;
        let newY = n.y;
        while (newY >= n._packY) {
          let collide = this.collision(n, {x: n.x, y: newY, w: n.w, h: n.h})
          if (!collide) {
            n._dirty = true;
            n.y = newY;
          }
          --newY;
        }
      });
    } else {
      this.nodes.forEach((n, i) => {
        if (n.locked) return;
        while (n.y > 0) {
          let newY = i === 0 ? 0 : n.y - 1;
          let canBeMoved = i === 0 || !this.collision(n, {x: n.x, y: newY, w: n.w, h: n.h});
          if (!canBeMoved) break;
          // Note: must be dirty (from last position) for GridStack::OnChange CB to update positions
          // and move items back. The user 'change' CB should detect changes from the original
          // starting position instead.
          n._dirty = (n.y !== newY);
          n.y = newY;
        }
      });
    }
    return this;
  }

  /**
   * given a random node, makes sure it's coordinates/values are valid in the current grid
   * @param node to adjust
   * @param resizing if out of bound, resize down or move into the grid to fit ?
   */
  public prepareNode(node: GridStackNode, resizing?: boolean): GridStackNode {
    node = node || {};
    node._id = node._id || GridStackEngine._idSeq++;

    // if we're missing position, have the grid position us automatically (before we set them to 0,0)
    if (node.x === undefined || node.y === undefined || node.x === null || node.y === null) {
      node.autoPosition = true;
    }

    // assign defaults for missing required fields
    let defaults: GridStackNode = { x: 0, y: 0, w: 1, h: 1};
    Utils.defaults(node, defaults);

    if (!node.autoPosition) { delete node.autoPosition; }
    if (!node.noResize) { delete node.noResize; }
    if (!node.noMove) { delete node.noMove; }

    // check for NaN (in case messed up strings were passed. can't do parseInt() || defaults.x above as 0 is valid #)
    if (typeof node.x == 'string')      { node.x = Number(node.x); }
    if (typeof node.y == 'string')      { node.y = Number(node.y); }
    if (typeof node.w == 'string')  { node.w = Number(node.w); }
    if (typeof node.h == 'string') { node.h = Number(node.h); }
    if (isNaN(node.x))      { node.x = defaults.x; node.autoPosition = true; }
    if (isNaN(node.y))      { node.y = defaults.y; node.autoPosition = true; }
    if (isNaN(node.w))  { node.w = defaults.w; }
    if (isNaN(node.h)) { node.h = defaults.h; }

    if (node.maxW) { node.w = Math.min(node.w, node.maxW); }
    if (node.maxH) { node.h = Math.min(node.h, node.maxH); }
    if (node.minW) { node.w = Math.max(node.w, node.minW); }
    if (node.minH) { node.h = Math.max(node.h, node.minH); }

    if (node.w > this.column) {
      node.w = this.column;
    } else if (node.w < 1) {
      node.w = 1;
    }

    if (this.maxRow && node.h > this.maxRow) {
      node.h = this.maxRow;
    } else if (node.h < 1) {
      node.h = 1;
    }

    if (node.x < 0) {
      node.x = 0;
    }
    if (node.y < 0) {
      node.y = 0;
    }

    if (node.x + node.w > this.column) {
      if (resizing) {
        node.w = this.column - node.x;
      } else {
        node.x = this.column - node.w;
      }
    }
    if (this.maxRow && node.y + node.h > this.maxRow) {
      if (resizing) {
        node.h = this.maxRow - node.y;
      } else {
        node.y = this.maxRow - node.h;
      }
    }

    return node;
  }

  public getDirtyNodes(verify?: boolean): GridStackNode[] {
    // compare original x,y,w,h instead as _dirty can be a temporary state
    if (verify) {
      return this.nodes.filter(n => n._dirty && !Utils.samePos(n, n._orig));
    }
    return this.nodes.filter(n => n._dirty);
  }

  /** @internal call this to call onChange CB with dirty nodes */
  private _notify(nodes?: GridStackNode | GridStackNode[], removeDOM = true): GridStackEngine {
    if (this.batchMode) return this;
    nodes = (nodes === undefined ? [] : (Array.isArray(nodes) ? nodes : [nodes]) );
    let dirtyNodes = nodes.concat(this.getDirtyNodes());
    this.onChange && this.onChange(dirtyNodes, removeDOM);
    return this;
  }

  /** @internal remove dirty and last tried info */
  public cleanNodes(): GridStackEngine {
    if (this.batchMode) return this;
    this.nodes.forEach(n => {
      delete n._dirty;
      delete n._lastTried;
    });
    return this;
  }

  /** @internal called to save initial position/size to track real dirty state. Note: should ONLY be called right after we call change event */
  public saveInitial(): GridStackEngine {
    this.nodes.forEach(n => {
      n._orig = {x: n.x, y: n.y, w: n.w, h: n.h};
      delete n._dirty;
    });
    return this;
  }

  public addNode(node: GridStackNode, triggerAddEvent = false): GridStackNode {
    node = this.prepareNode(node);

    if (node.autoPosition) {
      this._sortNodes();

      for (let i = 0;; ++i) {
        let x = i % this.column;
        let y = Math.floor(i / this.column);
        if (x + node.w > this.column) {
          continue;
        }
        let box = {x, y, w: node.w, h: node.h};
        if (!this.nodes.find(n => Utils.isIntercepted(box, n))) {
          node.x = x;
          node.y = y;
          delete node.autoPosition; // found our slot
          break;
        }
      }
    }

    this.nodes.push(node);
    triggerAddEvent && this.addedNodes.push(node);

    this._fixCollisions(node);
    this._packNodes()
      ._notify();
    return node;
  }

  public removeNode(node: GridStackNode, removeDOM = true, triggerEvent = false): GridStackEngine {
    if (triggerEvent) { // we wait until final drop to manually track removed items (rather than during drag)
      this.removedNodes.push(node);
    }
    node._id = null; // hint that node is being removed
    // don't use 'faster' .splice(findIndex(),1) in case node isn't in our list, or in multiple times.
    this.nodes = this.nodes.filter(n => n !== node);
    !this.float && this._packNodes();
    return this._notify(node, removeDOM);
  }

  public removeAll(removeDOM = true): GridStackEngine {
    delete this._layouts;
    if (this.nodes.length === 0) return this;
    removeDOM && this.nodes.forEach(n => n._id = null); // hint that node is being removed
    this.removedNodes = this.nodes;
    this.nodes = [];
    return this._notify(this.removedNodes, removeDOM);
  }

  /** checks if item can be moved (layout constrain) vs moveNode(), returning true if was able to move.
   * In more complicated cases (locked items, or maxRow) it will attempt at moving the item and fixing
   * others in a clone first, then apply those changes if within specs. */
  public moveNodeCheck(node: GridStackNode, x: number, y: number, w = node.w, h = node.h): boolean {
    if (node.locked) return false;
    if (!this.changedPos(node, x, y, w, h)) return false;

    // simpler case: move item directly...
    if (!this.maxRow && !this.nodes.some(n => n.locked)) {
      return this.moveNode(node, x, y, w, h, true, false); // pack=true, sanitize=false
    }

    // complex case: create a clone with NO maxRow (will check for out of bounds at the end)
    let clonedNode: GridStackNode;
    let clone = new GridStackEngine({
      column: this.column,
      float: this.float,
      nodes: this.nodes.map(n => {
        if (n === node) {
          clonedNode = {...n};
          return clonedNode;
        }
        return {...n};
      })
    });
    if (!clonedNode) return false;

    let canMove = clone.moveNode(clonedNode, x, y, w, h, true, false); // pack=true, sanitize=false
    // if maxRow make sure we are still valid size
    if (this.maxRow && canMove) {
      canMove = (clone.getRow() <= this.maxRow);
      // turns out we can't grow, then see if we can swap instead (ex: full grid)
      if (!canMove) {
        let collide = this.collision(node, {x, y, w, h});
        if (collide && this.swap(node, collide)) {
          this._notify();
          return true;
        }
      }
    }
    if (!canMove) return false;

    // if clone was able to move, copy those mods over to us now instead of caller trying to do this all over!
    // Note: we can't use the list directly as elements and other parts point to actual node struct, so copy content
    clone.nodes.filter(n => n._dirty).forEach(c => {
      let n = this.nodes.find(a => a._id === c._id);
      if (!n) return;
      n.x = c.x;
      n.y = c.y;
      n.w = c.w;
      n.h = c.h;
      n._dirty = true;
    });
    this._notify();
    return true;
  }

  /** return true if can fit in grid height constrain only (always true if no maxRow) */
  public willItFit(node: GridStackNode): boolean {
    if (!this.maxRow) return true;
    // create a clone with NO maxRow and check if still within size
    let clone = new GridStackEngine({
      column: this.column,
      float: this.float,
      nodes: this.nodes.map(n => {return {...n}})
    });
    clone.addNode(node);
    return clone.getRow() <= this.maxRow;
  }

  /** return true if the passed in node (x,y) is being dragged outside of the grid, and not added to bottom */
  public isOutside(x: number, y: number, node: GridStackNode): boolean {
    // simple outside boundaries
    if (x < 0 || x >= this.column || y < 0) return true;
    if (this.maxRow) return (y >= this.maxRow);
    else if (this.float) return false; // infinite grow with no maxRow

    // see if dragging PAST bottom (row+1)
    let row = this.getRow();
    if (y < row || y === 0) return false;
    if (y > row) return true;
    // else check to see if we can add that item to the bottom... (y == row)
    if (!node._temporaryRemoved) {
      let clone = new GridStackEngine({
        column: this.column,
        float: this.float,
        nodes: this.nodes.filter(n => n !== node).map(n => {return {...n}})
      });
      let nn = {...node, x, y};
      clone.addNode(nn);
      return nn.y === node.y && nn.x === node.x; // didn't actually move, so last row was a drag out and not a new place...
    }
    return node._temporaryRemoved; // if still outside so we don't flicker back & forth
  }

  /** true if x,y or w,h are different after clamping to min/max */
  public changedPos(node: GridStackNode, x: number, y: number, w = node.w, h = node.h): boolean {
    if (node.x !== x || node.y !== y) return true;
    // check constrained w,h
    if (node.maxW) { w = Math.min(w, node.maxW); }
    if (node.maxH) { h = Math.min(h, node.maxH); }
    if (node.minW) { w = Math.max(w, node.minW); }
    if (node.minH) { h = Math.max(h, node.minH); }
    return (node.w !== w || node.h !== h);
  }

  /** return true if the passed in node was actually moved (checks for no-op and locked) */
  public moveNode(node: GridStackNode, x: number, y: number, w = node.w, h = node.h, pack = true, sanitize = true, disableSwap = false): boolean {
    if (!node || node.locked) return false;
    let nn: GridStackNode;
    if (sanitize) {
      if (typeof x !== 'number') { x = node.x; }
      if (typeof y !== 'number') { y = node.y; }

      // constrain the passed in values and check if we're still changing our node
      let resizing = (node.w !== w || node.h !== h);
      nn = { x, y, w, h, maxW: node.maxW, maxH: node.maxH, minW: node.minW, minH: node.minH};
      nn = this.prepareNode(nn, resizing);
    }
    nn = nn || {x, y, w, h}
    if (Utils.samePos(node, nn)) return false;
    let prevPos: GridStackNode = {...node};

    // check if we will need to fix collision at our new location
    let collide = this.collision(node, nn);
    let moved = false;
    if (collide) {
      moved = this._fixCollisions(node, nn, collide, disableSwap);
    }

    // now move (to the original ask vs the collision version which might differ) and repack things
    if (!moved) {
      node._dirty = true;
      node.x = nn.x;
      node.y = nn.y;
      node.w = nn.w;
      node.h = nn.h;
    }
    if (pack) {
      this._packNodes()
        ._notify();
    }
    return !Utils.samePos(node, prevPos); // pack might have moved things back
  }

  public getRow(): number {
    return this.nodes.reduce((row, n) => Math.max(row, n.y + n.h), 0);
  }

  public beginUpdate(node: GridStackNode): GridStackEngine {
    if (node._updating) return this;
    node._updating = true;
    node._beforeDrag = {x: node.x, y: node.y, w: node.w, h: node.h};
    delete node._skipDown;
    this.nodes.forEach(n => n._packY = n.y);
    return this;
  }

  public endUpdate(): GridStackEngine {
    let n = this.nodes.find(n => n._updating);
    if (n) {
      delete n._updating;
      delete n._beforeDrag;
      delete n._skipDown;
      this.nodes.forEach(n => delete n._packY);
    }
    return this;
  }

  /** saves the current layout returning a list of widgets for serialization */
  public save(saveElement = true): GridStackNode[] {
    let widgets: GridStackNode[] = [];
    this._sortNodes();
    this.nodes.forEach(n => {
      let w: GridStackNode = {};
      for (let key in n) { if (key[0] !== '_' && n[key] !== null && n[key] !== undefined ) w[key] = n[key]; }
      // delete other internals
      if (!saveElement) delete w.el;
      delete w.grid;
      // delete default values (will be re-created on read)
      if (!w.autoPosition) delete w.autoPosition;
      if (!w.noResize) delete w.noResize;
      if (!w.noMove) delete w.noMove;
      if (!w.locked) delete w.locked;
      widgets.push(w);
    });
    return widgets;
  }

  /** @internal called whenever a node is added or moved - updates the cached layouts */
  public layoutsNodesChange(nodes: GridStackNode[]): GridStackEngine {
    if (!this._layouts || this._ignoreLayoutsNodeChange) return this;
    // remove smaller layouts - we will re-generate those on the fly... larger ones need to update
    this._layouts.forEach((layout, column) => {
      if (!layout || column === this.column) return this;
      if (column < this.column) {
        this._layouts[column] = undefined;
      }
      else {
        // we save the original x,y,w (h isn't cached) to see what actually changed to propagate better.
        // Note: we don't need to check against out of bound scaling/moving as that will be done when using those cache values.
        nodes.forEach(node => {
          let n = layout.find(l => l._id === node._id);
          if (!n) return this; // no cache for new nodes. Will use those values.
          let ratio = column / this.column;
          // Y changed, push down same amount
          // TODO: detect doing item 'swaps' will help instead of move (especially in 1 column mode)
          if (node.y !== node._orig.y) {
            n.y += (node.y - node._orig.y);
          }
          // X changed, scale from new position
          if (node.x !== node._orig.x) {
            n.x = Math.round(node.x * ratio);
          }
          // width changed, scale from new width
          if (node.w !== node._orig.w) {
            n.w = Math.round(node.w * ratio);
          }
          // ...height always carries over from cache
        });
      }
    });
    return this;
  }

  /**
   * @internal Called to scale the widget width & position up/down based on the column change.
   * Note we store previous layouts (especially original ones) to make it possible to go
   * from say 12 -> 1 -> 12 and get back to where we were.
   *
   * @param oldColumn previous number of columns
   * @param column  new column number
   * @param nodes different sorted list (ex: DOM order) instead of current list
   * @param layout specify the type of re-layout that will happen (position, size, etc...).
   * Note: items will never be outside of the current column boundaries. default (moveScale). Ignored for 1 column
   */
  public updateNodeWidths(oldColumn: number, column: number, nodes: GridStackNode[], layout: ColumnOptions = 'moveScale'): GridStackEngine {
    if (!this.nodes.length || oldColumn === column) return this;

    // cache the current layout in case they want to go back (like 12 -> 1 -> 12) as it requires original data
    this.cacheLayout(this.nodes, oldColumn);

    // if we're going to 1 column and using DOM order rather than default sorting, then generate that layout
    if (column === 1 && nodes && nodes.length) {
      let top = 0;
      nodes.forEach(n => {
        n.x = 0;
        n.w = 1;
        n.y = Math.max(n.y, top);
        top = n.y + n.h;
      });
    } else {
      nodes = Utils.sort(this.nodes, -1, oldColumn); // current column reverse sorting so we can insert last to front (limit collision)
    }

    // see if we have cached previous layout.
    let cacheNodes = this._layouts[column] || [];
    // if not AND we are going up in size start with the largest layout as down-scaling is more accurate
    let lastIndex = this._layouts.length - 1;
    if (cacheNodes.length === 0 && column > oldColumn && column < lastIndex) {
      cacheNodes = this._layouts[lastIndex] || [];
      if (cacheNodes.length) {
        // pretend we came from that larger column by assigning those values as starting point
        oldColumn = lastIndex;
        cacheNodes.forEach(cacheNode => {
          let j = nodes.findIndex(n => n._id === cacheNode._id);
          if (j !== -1) {
            // still current, use cache info positions
            nodes[j].x = cacheNode.x;
            nodes[j].y = cacheNode.y;
            nodes[j].w = cacheNode.w;
          }
        });
        cacheNodes = []; // we still don't have new column cached data... will generate from larger one.
      }
    }

    // if we found cache re-use those nodes that are still current
    let newNodes: GridStackNode[] = [];
    cacheNodes.forEach(cacheNode => {
      let j = nodes.findIndex(n => n._id === cacheNode._id);
      if (j !== -1) {
        // still current, use cache info positions
        nodes[j].x = cacheNode.x;
        nodes[j].y = cacheNode.y;
        nodes[j].w = cacheNode.w;
        newNodes.push(nodes[j]);
        nodes.splice(j, 1);
      }
    });
    // ...and add any extra non-cached ones
    if (nodes.length) {
      if (typeof layout === 'function') {
        layout(column, oldColumn, newNodes, nodes);
      } else {
        let ratio = column / oldColumn;
        let move = (layout === 'move' || layout === 'moveScale');
        let scale = (layout === 'scale' || layout === 'moveScale');
        nodes.forEach(node => {
          node.x = (column === 1 ? 0 : (move ? Math.round(node.x * ratio) : Math.min(node.x, column - 1)));
          node.w = ((column === 1 || oldColumn === 1) ? 1 :
            scale ? (Math.round(node.w * ratio) || 1) : (Math.min(node.w, column)));
          newNodes.push(node);
        });
        nodes = [];
      }
    }

    // finally re-layout them in reverse order (to get correct placement)
    newNodes = Utils.sort(newNodes, -1, column);
    this._ignoreLayoutsNodeChange = true;
    this.batchUpdate();
    this.nodes = []; // pretend we have no nodes to start with (we use same structures) to simplify layout
    newNodes.forEach(node => {
      this.addNode(node, false); // 'false' for add event trigger
      node._dirty = true; // force attr update
    }, this);
    this.commit();
    delete this._ignoreLayoutsNodeChange;
    return this;
  }

  /**
   * call to cache the given layout internally to the given location so we can restore back when column changes size
   * @param nodes list of nodes
   * @param column corresponding column index to save it under
   * @param clear if true, will force other caches to be removed (default false)
   */
  public cacheLayout(nodes: GridStackNode[], column: number, clear = false): GridStackEngine {
    let copy: Layout[] = [];
    nodes.forEach((n, i) => {
      n._id = n._id || GridStackEngine._idSeq++; // make sure we have an id in case this is new layout, else re-use id already set
      copy[i] = {x: n.x, y: n.y, w: n.w, _id: n._id} // only thing we change is x,y,w and id to find it back
    });
    this._layouts = clear ? [] : this._layouts || []; // use array to find larger quick
    this._layouts[column] = copy;
    return this;
  }


  /** called to remove all internal values */
  public cleanupNode(node: GridStackNode): GridStackEngine {
    for (let prop in node) {
      if (prop[0] === '_') delete node[prop];
    }
    return this;
  }

  /** @internal legacy method renames */
  private getGridHeight = obsolete(this, GridStackEngine.prototype.getRow, 'getGridHeight', 'getRow', 'v1.0.0');
}

/** @internal class to store per column layout bare minimal info (subset of GridStackWidget) */
interface Layout {
  x: number;
  y: number;
  w: number;
  _id: number; // so we can find full node back
}
