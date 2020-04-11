// gridstack-engine.ts 2.0.0-rc @preserve

/**
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/

import { Utils, obsolete } from './utils';
import { GridStackNode } from './types';

export type onChangeCB = (nodes: GridStackNode[], detachNode?: boolean) => void;

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
  public onchange: onChangeCB;
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

  public constructor(column = 12, onchange?: onChangeCB, float = false, maxRow = 0, nodes: GridStackNode[] = []) {
    this.column = column;
    this.onchange = onchange;
    this._float = float;
    this.maxRow = maxRow;
    this.nodes = nodes;
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
    this._packNodes();
    this._notify();
    return this;
  }

  /** @internal */
  private _fixCollisions(node: GridStackNode): GridStackEngine {
    this._sortNodes(-1);

    let nn = node;
    let hasLocked = Boolean(this.nodes.find(n => n.locked));
    if (!this.float && !hasLocked) {
      nn = {x: 0, y: node.y, width: this.column, height: node.height};
    }
    while (true) {
      let collisionNode = this.nodes.find( n => n !== node && Utils.isIntercepted(n, nn), {node: node, nn: nn});
      if (!collisionNode) { return this }
      let moved;
      if (collisionNode.locked) {
        // if colliding with a locked item, move ourself instead
        moved = this.moveNode(node, node.x, collisionNode.y + collisionNode.height,
          node.width, node.height, true);
      } else {
        moved = this.moveNode(collisionNode, collisionNode.x, node.y + node.height,
          collisionNode.width, collisionNode.height, true);
      }
      if (!moved) { return this } // break inf loop if we couldn't move after all (ex: maxRow, fixed)
    }
  }

  public isAreaEmpty(x: number, y: number, width: number, height: number): boolean {
    let nn = {x: x || 0, y: y || 0, width: width || 1, height: height || 1};
    let collisionNode = this.nodes.find(n => {
      return Utils.isIntercepted(n, nn);
    });
    return !collisionNode;
  }

  /** re-layout grid items to reclaim any empty space */
  public compact(): GridStackEngine {
    if (this.nodes.length === 0) { return this }
    this.batchUpdate();
    this._sortNodes();
    let copyNodes = this.nodes;
    this.nodes = []; // pretend we have no nodes to conflict layout to start with...
    copyNodes.forEach(node => {
      if (!node.noMove && !node.locked) {
        node.autoPosition = true;
      }
      this.addNode(node, false); // 'false' for add event trigger
      node._dirty = true; // force attr update
    });
    this.commit();
    return this;
  }

  /** enable/disable floating widgets (default: `false`) See [example](http://gridstackjs.com/demo/float.html) */
  public set float(val: boolean) {
    if (this._float === val) { return; }
    this._float = val || false;
    if (!val) {
      this._packNodes();
      this._notify();
    }
  }

  /** float getter method */
  public get float(): boolean { return this._float || false; }

  /** @internal */
  private _sortNodes(dir?: -1 | 1): GridStackEngine {
    this.nodes = Utils.sort(this.nodes, dir, this.column);
    return this;
  }

  /** @internal */
  private _packNodes(): GridStackEngine {
    this._sortNodes();

    if (this.float) {
      this.nodes.forEach((n, i) => {
        if (n._updating || n._packY === undefined || n.y === n._packY) {
          return this;
        }
        let newY = n.y;
        while (newY >= n._packY) {
          let box = {x: n.x, y: newY, width: n.width, height: n.height};
          let collisionNode = this.nodes
            .slice(0, i)
            .find(bn => Utils.isIntercepted(box, bn), {n: n, newY: newY});
          if (!collisionNode) {
            n._dirty = true;
            n.y = newY;
          }
          --newY;
        }
      });
    } else {
      this.nodes.forEach((n, i) => {
        if (n.locked) { return this }
        while (n.y > 0) {
          let newY = n.y - 1;
          let canBeMoved = i === 0;
          let box = {x: n.x, y: newY, width: n.width, height: n.height};
          if (i > 0) {
            let collisionNode = this.nodes
              .slice(0, i)
              .find(bn => Utils.isIntercepted(box, bn), {n: n, newY: newY});
            canBeMoved = collisionNode === undefined;
          }

          if (!canBeMoved) { break; }
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
    // if we're missing position, have the grid position us automatically (before we set them to 0,0)
    if (node.x === undefined || node.y === undefined || node.x === null || node.y === null) {
      node.autoPosition = true;
    }

    // assign defaults for missing required fields
    let defaults = {width: 1, height: 1, x: 0, y: 0};
    node = Utils.defaults(node, defaults);

    node.autoPosition = node.autoPosition || false;
    node.noResize = node.noResize || false;
    node.noMove = node.noMove || false;

    // check for NaN (in case messed up strings were passed. can't do parseInt() || defaults.x above as 0 is valid #)
    if (Number.isNaN(node.x))      { node.x = defaults.x; node.autoPosition = true; }
    if (Number.isNaN(node.y))      { node.y = defaults.y; node.autoPosition = true; }
    if (Number.isNaN(node.width))  { node.width = defaults.width; }
    if (Number.isNaN(node.height)) { node.height = defaults.height; }

    if (node.maxWidth) { node.width = Math.min(node.width, node.maxWidth); }
    if (node.maxHeight) { node.height = Math.min(node.height, node.maxHeight); }
    if (node.minWidth) { node.width = Math.max(node.width, node.minWidth); }
    if (node.minHeight) { node.height = Math.max(node.height, node.minHeight); }

    if (node.width > this.column) {
      node.width = this.column;
    } else if (node.width < 1) {
      node.width = 1;
    }

    if (this.maxRow && node.height > this.maxRow) {
      node.height = this.maxRow;
    } else if (node.height < 1) {
      node.height = 1;
    }

    if (node.x < 0) {
      node.x = 0;
    }
    if (node.y < 0) {
      node.y = 0;
    }

    if (node.x + node.width > this.column) {
      if (resizing) {
        node.width = this.column - node.x;
      } else {
        node.x = this.column - node.width;
      }
    }
    if (this.maxRow && node.y + node.height > this.maxRow) {
      if (resizing) {
        node.height = this.maxRow - node.y;
      } else {
        node.y = this.maxRow - node.height;
      }
    }

    return node;
  }

  public getDirtyNodes(verify?: boolean): GridStackNode[] {
    // compare original X,Y,W,H (or entire node?) instead as _dirty can be a temporary state
    if (verify) {
      let dirtNodes = [];
      this.nodes.forEach(n => {
        if (n._dirty) {
          if (n.y === n._origY && n.x === n._origX && n.width === n._origW && n.height === n._origH) {
            delete n._dirty;
          } else {
            dirtNodes.push(n);
          }
        }
      });
      return dirtNodes;
    }

    return this.nodes.filter(n => n._dirty);
  }

  /** @internal */
  private _notify(nodes?: GridStackNode | GridStackNode[], detachNode?: boolean): GridStackEngine {
    if (this.batchMode) { return this }
    detachNode = (detachNode === undefined ? true : detachNode);
    nodes = (nodes === undefined ? [] : (Array.isArray(nodes) ? nodes : [nodes]) );
    let dirtyNodes = nodes.concat(this.getDirtyNodes());
    if (this.onchange) {
      this.onchange(dirtyNodes, detachNode);
    }
    return this;
  }

  public cleanNodes(): GridStackEngine {
    if (this.batchMode) { return this }
    this.nodes.forEach(n => { delete n._dirty; });
    return this;
  }

  public addNode(node: GridStackNode, triggerAddEvent = false): GridStackNode {
    node = this.prepareNode(node);

    node._id = node._id || GridStackEngine._idSeq++;

    if (node.autoPosition) {
      this._sortNodes();

      for (let i = 0;; ++i) {
        let x = i % this.column;
        let y = Math.floor(i / this.column);
        if (x + node.width > this.column) {
          continue;
        }
        let box = {x: x, y: y, width: node.width, height: node.height};
        if (!this.nodes.find(n => Utils.isIntercepted(box, n), {x: x, y: y, node: node})) {
          node.x = x;
          node.y = y;
          delete node.autoPosition; // found our slot
          break;
        }
      }
    }

    this.nodes.push(node);
    if (triggerAddEvent) {
      this.addedNodes.push(node);
    }

    this._fixCollisions(node);
    this._packNodes();
    this._notify();
    return node;
  }

  public removeNode(node: GridStackNode, detachNode = true, triggerRemoveEvent = false): GridStackEngine {
    if (triggerRemoveEvent) {
      this.removedNodes.push(node);
    }
    node._id = null; // hint that node is being removed
    this.nodes = this.nodes.filter(n => n !== node);
    this._packNodes();
    this._notify(node, detachNode);
    return this;
  }

  public removeAll(detachNode?: boolean): GridStackEngine {
    delete this._layouts;
    if (this.nodes.length === 0) { return this }
    detachNode = (detachNode === undefined ? true : detachNode);
    this.nodes.forEach(n => { n._id = null; }); // hint that node is being removed
    this.removedNodes = this.nodes;
    this.nodes = [];
    this._notify(this.removedNodes, detachNode);
    return this;
  }

  public canMoveNode(node: GridStackNode, x: number, y: number, width?: number, height?: number): boolean {
    if (!this.isNodeChangedPosition(node, x, y, width, height)) {
      return false;
    }
    let hasLocked = Boolean(this.nodes.find(n => n.locked));

    if (!this.maxRow && !hasLocked) {
      return true;
    }

    let clonedNode;
    let clone = new GridStackEngine(
      this.column,
      null,
      this.float,
      0,
      this.nodes.map(n => {
        if (n === node) {
          clonedNode = Utils.clone(n);
          return clonedNode;
        }
        return Utils.clone(n);
      }));

    if (!clonedNode) {  return true;}

    clone.moveNode(clonedNode, x, y, width, height);

    let canMove = true;
    if (hasLocked) {
      canMove = canMove && !Boolean(clone.nodes.find(n => {
        return n !== clonedNode && Boolean(n.locked) && Boolean(n._dirty);
      }));
    }
    if (this.maxRow) {
      canMove = canMove && (clone.getRow() <= this.maxRow);
    }

    return canMove;
  }

  public canBePlacedWithRespectToHeight(node: GridStackNode): boolean {
    if (!this.maxRow) {
      return true;
    }

    let clone = new GridStackEngine(
      this.column,
      null,
      this.float,
      0,
      this.nodes.map(n => Utils.clone(n)));
    clone.addNode(node);
    return clone.getRow() <= this.maxRow;
  }

  public isNodeChangedPosition(node: GridStackNode, x: number, y: number, width: number, height: number): boolean {
    if (typeof x !== 'number') { x = node.x; }
    if (typeof y !== 'number') { y = node.y; }
    if (typeof width !== 'number') { width = node.width; }
    if (typeof height !== 'number') { height = node.height; }

    if (node.maxWidth) { width = Math.min(width, node.maxWidth); }
    if (node.maxHeight) { height = Math.min(height, node.maxHeight); }
    if (node.minWidth) { width = Math.max(width, node.minWidth); }
    if (node.minHeight) { height = Math.max(height, node.minHeight); }

    if (node.x === x && node.y === y && node.width === width && node.height === height) {
      return false;
    }
    return true;
  }

  public moveNode(node: GridStackNode, x: number, y: number, width?: number, height?: number, noPack?: boolean): GridStackNode {
    if (node.locked) { return null; }
    if (typeof x !== 'number') { x = node.x; }
    if (typeof y !== 'number') { y = node.y; }
    if (typeof width !== 'number') { width = node.width; }
    if (typeof height !== 'number') { height = node.height; }

    // constrain the passed in values and check if we're still changing our node
    let resizing = (node.width !== width || node.height !== height);
    let nn: GridStackNode = { x, y, width, height,
      maxWidth: node.maxWidth, maxHeight: node.maxHeight, minWidth: node.minWidth, minHeight: node.minHeight};
    nn = this.prepareNode(nn, resizing);
    if (node.x === nn.x && node.y === nn.y && node.width === nn.width && node.height === nn.height) {
      return null;
    }

    node._dirty = true;

    node.x = node._lastTriedX = nn.x;
    node.y = node._lastTriedY = nn.y;
    node.width = node._lastTriedWidth = nn.width;
    node.height = node._lastTriedHeight = nn.height;

    this._fixCollisions(node);
    if (!noPack) {
      this._packNodes();
      this._notify();
    }
    return node;
  }

  public getRow(): number {
    return this.nodes.reduce((memo, n) => Math.max(memo, n.y + n.height), 0);
  }

  public beginUpdate(node: GridStackNode): GridStackEngine {
    if (node._updating) return this;
    node._updating = true;
    this.nodes.forEach(n => { n._packY = n.y; });
    return this;
  }

  public endUpdate(): GridStackEngine {
    let n = this.nodes.find(n => n._updating);
    if (n) {
      delete n._updating;
      this.nodes.forEach(n => { delete n._packY; });
    }
    return this;
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
          if (node.y !== node._origY) {
            n.y += (node.y - node._origY);
          }
          // X changed, scale from new position
          if (node.x !== node._origX) {
            n.x = Math.round(node.x * ratio);
          }
          // width changed, scale from new width
          if (node.width !== node._origW) {
            n.width = Math.round(node.width * ratio);
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
   */
  public updateNodeWidths(oldColumn: number, column: number, nodes: GridStackNode[]): GridStackEngine {
    if (!this.nodes.length || oldColumn === column) { return this }

    // cache the current layout in case they want to go back (like 12 -> 1 -> 12) as it requires original data
    let copy: Layout[] = [];
    this.nodes.forEach((n, i) => { copy[i] = {x: n.x, y: n.y, width: n.width, _id: n._id} }); // only thing we change is x,y,w and id to find it back
    this._layouts = this._layouts || []; // use array to find larger quick
    this._layouts[oldColumn] = copy;

    // if we're going to 1 column and using DOM order rather than default sorting, then generate that layout
    if (column === 1 && nodes && nodes.length) {
      let top = 0;
      nodes.forEach(n => {
        n.x = 0;
        n.width = 1;
        n.y = Math.max(n.y, top);
        top = n.y + n.height;
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
            nodes[j].width = cacheNode.width;
          }
        });
        cacheNodes = []; // we still don't have new column cached data... will generate from larger one.
      }
    }

    // if we found cache re-use those nodes that are still current
    let newNodes: GridStackNode[] = [];
    cacheNodes.forEach(cacheNode => {
      let j = nodes.findIndex(n => n && n._id === cacheNode._id);
      if (j !== -1) {
        // still current, use cache info positions
        nodes[j].x = cacheNode.x;
        nodes[j].y = cacheNode.y;
        nodes[j].width = cacheNode.width;
        newNodes.push(nodes[j]);
        nodes[j] = null; // erase it so we know what's left
      }
    });
    // ...and add any extra non-cached ones
    let ratio = column / oldColumn;
    nodes.forEach(node => {
      if (!node) return this;
      node.x = (column === 1 ? 0 : Math.round(node.x * ratio));
      node.width = ((column === 1 || oldColumn === 1) ? 1 : (Math.round(node.width * ratio) || 1));
      newNodes.push(node);
    });

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

  /** @internal called to save initial position/size */
  public saveInitial(): GridStackEngine {
    this.nodes.forEach(n => {
      n._origX = n.x;
      n._origY = n.y;
      n._origW = n.width;
      n._origH = n.height;
      delete n._dirty;
    });
    return this;
  }

  /** called to remove all internal values */
  public cleanupNode(node: GridStackNode) {
    for (let prop in node) {
      if (prop[0] === '_') delete node[prop];
    }
  }

  /** @internal legacy method renames */
  private getGridHeight = obsolete(this, GridStackEngine.prototype.getRow, 'getGridHeight', 'getRow', 'v1.0.0');
}

/** @internal class to store per column layout bare minimal info (subset of GridstackWidget) */
interface Layout {
  x: number;
  y: number;
  width: number;
  _id: number; // so we can find full node back
}
