"use strict";
/**
 * gridstack-engine.ts 8.3.0-dev
 * Copyright (c) 2021-2022 Alain Dumesny - see GridStack root license
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridStackEngine = void 0;
var utils_1 = require("./utils");
/**
 * Defines the GridStack engine that does most no DOM grid manipulation.
 * See GridStack methods and vars for descriptions.
 *
 * NOTE: values should not be modified directly - call the main GridStack API instead
 */
var GridStackEngine = exports.GridStackEngine = /** @class */ (function () {
    function GridStackEngine(opts) {
        if (opts === void 0) { opts = {}; }
        this.addedNodes = [];
        this.removedNodes = [];
        this.column = opts.column || 12;
        this.maxRow = opts.maxRow;
        this._float = opts.float;
        this.nodes = opts.nodes || [];
        this.onChange = opts.onChange;
    }
    GridStackEngine.prototype.batchUpdate = function (flag, doPack) {
        if (flag === void 0) { flag = true; }
        if (doPack === void 0) { doPack = true; }
        if (!!this.batchMode === flag)
            return this;
        this.batchMode = flag;
        if (flag) {
            this._prevFloat = this._float;
            this._float = true; // let things go anywhere for now... will restore and possibly reposition later
            this.saveInitial(); // since begin update (which is called multiple times) won't do this
        }
        else {
            this._float = this._prevFloat;
            delete this._prevFloat;
            if (doPack)
                this._packNodes();
            this._notify();
        }
        return this;
    };
    // use entire row for hitting area (will use bottom reverse sorted first) if we not actively moving DOWN and didn't already skip
    GridStackEngine.prototype._useEntireRowArea = function (node, nn) {
        return (!this.float || this.batchMode && !this._prevFloat) && !this._hasLocked && (!node._moving || node._skipDown || nn.y <= node.y);
    };
    /** @internal fix collision on given 'node', going to given new location 'nn', with optional 'collide' node already found.
     * return true if we moved. */
    GridStackEngine.prototype._fixCollisions = function (node, nn, collide, opt) {
        if (nn === void 0) { nn = node; }
        if (opt === void 0) { opt = {}; }
        this.sortNodes(-1); // from last to first, so recursive collision move items in the right order
        collide = collide || this.collide(node, nn); // REAL area collide for swap and skip if none...
        if (!collide)
            return false;
        // swap check: if we're actively moving in gravity mode, see if we collide with an object the same size
        if (node._moving && !opt.nested && !this.float) {
            if (this.swap(node, collide))
                return true;
        }
        // during while() collisions MAKE SURE to check entire row so larger items don't leap frog small ones (push them all down starting last in grid)
        var area = nn;
        if (this._useEntireRowArea(node, nn)) {
            area = { x: 0, w: this.column, y: nn.y, h: nn.h };
            collide = this.collide(node, area, opt.skip); // force new hit
        }
        var didMove = false;
        var newOpt = { nested: true, pack: false };
        while (collide = collide || this.collide(node, area, opt.skip)) { // could collide with more than 1 item... so repeat for each
            var moved = void 0;
            // if colliding with a locked item OR moving down with top gravity (and collide could move up) -> skip past the collide,
            // but remember that skip down so we only do this once (and push others otherwise).
            if (collide.locked || node._moving && !node._skipDown && nn.y > node.y && !this.float &&
                // can take space we had, or before where we're going
                (!this.collide(collide, __assign(__assign({}, collide), { y: node.y }), node) || !this.collide(collide, __assign(__assign({}, collide), { y: nn.y - collide.h }), node))) {
                node._skipDown = (node._skipDown || nn.y > node.y);
                moved = this.moveNode(node, __assign(__assign(__assign({}, nn), { y: collide.y + collide.h }), newOpt));
                if (collide.locked && moved) {
                    utils_1.Utils.copyPos(nn, node); // moving after lock become our new desired location
                }
                else if (!collide.locked && moved && opt.pack) {
                    // we moved after and will pack: do it now and keep the original drop location, but past the old collide to see what else we might push way
                    this._packNodes();
                    nn.y = collide.y + collide.h;
                    utils_1.Utils.copyPos(node, nn);
                }
                didMove = didMove || moved;
            }
            else {
                // move collide down *after* where we will be, ignoring where we are now (don't collide with us)
                moved = this.moveNode(collide, __assign(__assign(__assign({}, collide), { y: nn.y + nn.h, skip: node }), newOpt));
            }
            if (!moved) {
                return didMove;
            } // break inf loop if we couldn't move after all (ex: maxRow, fixed)
            collide = undefined;
        }
        return didMove;
    };
    /** return the nodes that intercept the given node. Optionally a different area can be used, as well as a second node to skip */
    GridStackEngine.prototype.collide = function (skip, area, skip2) {
        if (area === void 0) { area = skip; }
        var skipId = skip._id;
        var skip2Id = skip2 === null || skip2 === void 0 ? void 0 : skip2._id;
        return this.nodes.find(function (n) { return n._id !== skipId && n._id !== skip2Id && utils_1.Utils.isIntercepted(n, area); });
    };
    GridStackEngine.prototype.collideAll = function (skip, area, skip2) {
        if (area === void 0) { area = skip; }
        var skipId = skip._id;
        var skip2Id = skip2 === null || skip2 === void 0 ? void 0 : skip2._id;
        return this.nodes.filter(function (n) { return n._id !== skipId && n._id !== skip2Id && utils_1.Utils.isIntercepted(n, area); });
    };
    /** does a pixel coverage collision based on where we started, returning the node that has the most coverage that is >50% mid line */
    GridStackEngine.prototype.directionCollideCoverage = function (node, o, collides) {
        if (!o.rect || !node._rect)
            return;
        var r0 = node._rect; // where started
        var r = __assign({}, o.rect); // where we are
        // update dragged rect to show where it's coming from (above or below, etc...)
        if (r.y > r0.y) {
            r.h += r.y - r0.y;
            r.y = r0.y;
        }
        else {
            r.h += r0.y - r.y;
        }
        if (r.x > r0.x) {
            r.w += r.x - r0.x;
            r.x = r0.x;
        }
        else {
            r.w += r0.x - r.x;
        }
        var collide;
        collides.forEach(function (n) {
            if (n.locked || !n._rect)
                return;
            var r2 = n._rect; // overlapping target
            var yOver = Number.MAX_VALUE, xOver = Number.MAX_VALUE, overMax = 0.5; // need >50%
            // depending on which side we started from, compute the overlap % of coverage
            // (ex: from above/below we only compute the max horizontal line coverage)
            if (r0.y < r2.y) { // from above
                yOver = ((r.y + r.h) - r2.y) / r2.h;
            }
            else if (r0.y + r0.h > r2.y + r2.h) { // from below
                yOver = ((r2.y + r2.h) - r.y) / r2.h;
            }
            if (r0.x < r2.x) { // from the left
                xOver = ((r.x + r.w) - r2.x) / r2.w;
            }
            else if (r0.x + r0.w > r2.x + r2.w) { // from the right
                xOver = ((r2.x + r2.w) - r.x) / r2.w;
            }
            var over = Math.min(xOver, yOver);
            if (over > overMax) {
                overMax = over;
                collide = n;
            }
        });
        o.collide = collide; // save it so we don't have to find it again
        return collide;
    };
    /** does a pixel coverage returning the node that has the most coverage by area */
    /*
    protected collideCoverage(r: GridStackPosition, collides: GridStackNode[]): {collide: GridStackNode, over: number} {
      let collide: GridStackNode;
      let overMax = 0;
      collides.forEach(n => {
        if (n.locked || !n._rect) return;
        let over = Utils.areaIntercept(r, n._rect);
        if (over > overMax) {
          overMax = over;
          collide = n;
        }
      });
      return {collide, over: overMax};
    }
    */
    /** called to cache the nodes pixel rectangles used for collision detection during drag */
    GridStackEngine.prototype.cacheRects = function (w, h, top, right, bottom, left) {
        this.nodes.forEach(function (n) {
            return n._rect = {
                y: n.y * h + top,
                x: n.x * w + left,
                w: n.w * w - left - right,
                h: n.h * h - top - bottom
            };
        });
        return this;
    };
    /** called to possibly swap between 2 nodes (same size or column, not locked, touching), returning true if successful */
    GridStackEngine.prototype.swap = function (a, b) {
        if (!b || b.locked || !a || a.locked)
            return false;
        function _doSwap() {
            var x = b.x, y = b.y;
            b.x = a.x;
            b.y = a.y; // b -> a position
            if (a.h != b.h) {
                a.x = x;
                a.y = b.y + b.h; // a -> goes after b
            }
            else if (a.w != b.w) {
                a.x = b.x + b.w;
                a.y = y; // a -> goes after b
            }
            else {
                a.x = x;
                a.y = y; // a -> old b position
            }
            a._dirty = b._dirty = true;
            return true;
        }
        var touching; // remember if we called it (vs undefined)
        // same size and same row or column, and touching
        if (a.w === b.w && a.h === b.h && (a.x === b.x || a.y === b.y) && (touching = utils_1.Utils.isTouching(a, b)))
            return _doSwap();
        if (touching === false)
            return; // IFF ran test and fail, bail out
        // check for taking same columns (but different height) and touching
        if (a.w === b.w && a.x === b.x && (touching || (touching = utils_1.Utils.isTouching(a, b)))) {
            if (b.y < a.y) {
                var t = a;
                a = b;
                b = t;
            } // swap a <-> b vars so a is first
            return _doSwap();
        }
        if (touching === false)
            return;
        // check if taking same row (but different width) and touching
        if (a.h === b.h && a.y === b.y && (touching || (touching = utils_1.Utils.isTouching(a, b)))) {
            if (b.x < a.x) {
                var t = a;
                a = b;
                b = t;
            } // swap a <-> b vars so a is first
            return _doSwap();
        }
        return false;
    };
    GridStackEngine.prototype.isAreaEmpty = function (x, y, w, h) {
        var nn = { x: x || 0, y: y || 0, w: w || 1, h: h || 1 };
        return !this.collide(nn);
    };
    /** re-layout grid items to reclaim any empty space - optionally keeping the sort order exactly the same ('list' mode) vs truly finding an empty spaces */
    GridStackEngine.prototype.compact = function (layout, doSort) {
        var _this = this;
        if (layout === void 0) { layout = 'compact'; }
        if (doSort === void 0) { doSort = true; }
        if (this.nodes.length === 0)
            return this;
        if (doSort)
            this.sortNodes();
        var wasBatch = this.batchMode;
        if (!wasBatch)
            this.batchUpdate();
        var wasColumnResize = this._inColumnResize;
        if (!wasColumnResize)
            this._inColumnResize = true; // faster addNode()
        var copyNodes = this.nodes;
        this.nodes = []; // pretend we have no nodes to conflict layout to start with...
        copyNodes.forEach(function (n, index, list) {
            var after;
            if (!n.locked) {
                n.autoPosition = true;
                if (layout === 'list' && index)
                    after = list[index - 1];
            }
            _this.addNode(n, false, after); // 'false' for add event trigger
        });
        if (!wasColumnResize)
            delete this._inColumnResize;
        if (!wasBatch)
            this.batchUpdate(false);
        return this;
    };
    Object.defineProperty(GridStackEngine.prototype, "float", {
        /** float getter method */
        get: function () { return this._float || false; },
        /** enable/disable floating widgets (default: `false`) See [example](http://gridstackjs.com/demo/float.html) */
        set: function (val) {
            if (this._float === val)
                return;
            this._float = val || false;
            if (!val) {
                this._packNodes()._notify();
            }
        },
        enumerable: false,
        configurable: true
    });
    /** sort the nodes array from first to last, or reverse. Called during collision/placement to force an order */
    GridStackEngine.prototype.sortNodes = function (dir, column) {
        if (dir === void 0) { dir = 1; }
        if (column === void 0) { column = this.column; }
        this.nodes = utils_1.Utils.sort(this.nodes, dir, column);
        return this;
    };
    /** @internal called to top gravity pack the items back OR revert back to original Y positions when floating */
    GridStackEngine.prototype._packNodes = function () {
        var _this = this;
        if (this.batchMode) {
            return this;
        }
        this.sortNodes(); // first to last
        if (this.float) {
            // restore original Y pos
            this.nodes.forEach(function (n) {
                if (n._updating || n._orig === undefined || n.y === n._orig.y)
                    return;
                var newY = n.y;
                while (newY > n._orig.y) {
                    --newY;
                    var collide = _this.collide(n, { x: n.x, y: newY, w: n.w, h: n.h });
                    if (!collide) {
                        n._dirty = true;
                        n.y = newY;
                    }
                }
            });
        }
        else {
            // top gravity pack
            this.nodes.forEach(function (n, i) {
                if (n.locked)
                    return;
                while (n.y > 0) {
                    var newY = i === 0 ? 0 : n.y - 1;
                    var canBeMoved = i === 0 || !_this.collide(n, { x: n.x, y: newY, w: n.w, h: n.h });
                    if (!canBeMoved)
                        break;
                    // Note: must be dirty (from last position) for GridStack::OnChange CB to update positions
                    // and move items back. The user 'change' CB should detect changes from the original
                    // starting position instead.
                    n._dirty = (n.y !== newY);
                    n.y = newY;
                }
            });
        }
        return this;
    };
    /**
     * given a random node, makes sure it's coordinates/values are valid in the current grid
     * @param node to adjust
     * @param resizing if out of bound, resize down or move into the grid to fit ?
     */
    GridStackEngine.prototype.prepareNode = function (node, resizing) {
        var _a;
        node = node || {};
        node._id = (_a = node._id) !== null && _a !== void 0 ? _a : GridStackEngine._idSeq++;
        // if we're missing position, have the grid position us automatically (before we set them to 0,0)
        if (node.x === undefined || node.y === undefined || node.x === null || node.y === null) {
            node.autoPosition = true;
        }
        // assign defaults for missing required fields
        var defaults = { x: 0, y: 0, w: 1, h: 1 };
        utils_1.Utils.defaults(node, defaults);
        if (!node.autoPosition) {
            delete node.autoPosition;
        }
        if (!node.noResize) {
            delete node.noResize;
        }
        if (!node.noMove) {
            delete node.noMove;
        }
        utils_1.Utils.sanitizeMinMax(node);
        // check for NaN (in case messed up strings were passed. can't do parseInt() || defaults.x above as 0 is valid #)
        if (typeof node.x == 'string') {
            node.x = Number(node.x);
        }
        if (typeof node.y == 'string') {
            node.y = Number(node.y);
        }
        if (typeof node.w == 'string') {
            node.w = Number(node.w);
        }
        if (typeof node.h == 'string') {
            node.h = Number(node.h);
        }
        if (isNaN(node.x)) {
            node.x = defaults.x;
            node.autoPosition = true;
        }
        if (isNaN(node.y)) {
            node.y = defaults.y;
            node.autoPosition = true;
        }
        if (isNaN(node.w)) {
            node.w = defaults.w;
        }
        if (isNaN(node.h)) {
            node.h = defaults.h;
        }
        return this.nodeBoundFix(node, resizing);
    };
    /** part2 of preparing a node to fit inside our grid - checks for x,y,w from grid dimensions */
    GridStackEngine.prototype.nodeBoundFix = function (node, resizing) {
        var before = node._orig || utils_1.Utils.copyPos({}, node);
        if (node.maxW) {
            node.w = Math.min(node.w, node.maxW);
        }
        if (node.maxH) {
            node.h = Math.min(node.h, node.maxH);
        }
        if (node.minW && node.minW <= this.column) {
            node.w = Math.max(node.w, node.minW);
        }
        if (node.minH) {
            node.h = Math.max(node.h, node.minH);
        }
        // if user loaded a larger than allowed widget for current # of columns (or force 1 column mode),
        // remember it's position & width so we can restore back (1 -> 12 column) #1655 #1985
        // IFF we're not in the middle of column resizing!
        var saveOrig = this.column === 1 || node.x + node.w > this.column;
        if (saveOrig && this.column < 12 && !this._inColumnResize && node._id && this.findCacheLayout(node, 12) === -1) {
            var copy = __assign({}, node); // need _id + positions
            if (copy.autoPosition) {
                delete copy.x;
                delete copy.y;
            }
            else
                copy.x = Math.min(11, copy.x);
            copy.w = Math.min(12, copy.w);
            this.cacheOneLayout(copy, 12);
        }
        if (node.w > this.column) {
            node.w = this.column;
        }
        else if (node.w < 1) {
            node.w = 1;
        }
        if (this.maxRow && node.h > this.maxRow) {
            node.h = this.maxRow;
        }
        else if (node.h < 1) {
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
            }
            else {
                node.x = this.column - node.w;
            }
        }
        if (this.maxRow && node.y + node.h > this.maxRow) {
            if (resizing) {
                node.h = this.maxRow - node.y;
            }
            else {
                node.y = this.maxRow - node.h;
            }
        }
        if (!utils_1.Utils.samePos(node, before)) {
            node._dirty = true;
        }
        return node;
    };
    /** returns a list of modified nodes from their original values */
    GridStackEngine.prototype.getDirtyNodes = function (verify) {
        // compare original x,y,w,h instead as _dirty can be a temporary state
        if (verify) {
            return this.nodes.filter(function (n) { return n._dirty && !utils_1.Utils.samePos(n, n._orig); });
        }
        return this.nodes.filter(function (n) { return n._dirty; });
    };
    /** @internal call this to call onChange callback with dirty nodes so DOM can be updated */
    GridStackEngine.prototype._notify = function (removedNodes) {
        if (this.batchMode || !this.onChange)
            return this;
        var dirtyNodes = (removedNodes || []).concat(this.getDirtyNodes());
        this.onChange(dirtyNodes);
        return this;
    };
    /** @internal remove dirty and last tried info */
    GridStackEngine.prototype.cleanNodes = function () {
        if (this.batchMode)
            return this;
        this.nodes.forEach(function (n) {
            delete n._dirty;
            delete n._lastTried;
        });
        return this;
    };
    /** @internal called to save initial position/size to track real dirty state.
     * Note: should be called right after we call change event (so next API is can detect changes)
     * as well as right before we start move/resize/enter (so we can restore items to prev values) */
    GridStackEngine.prototype.saveInitial = function () {
        this.nodes.forEach(function (n) {
            n._orig = utils_1.Utils.copyPos({}, n);
            delete n._dirty;
        });
        this._hasLocked = this.nodes.some(function (n) { return n.locked; });
        return this;
    };
    /** @internal restore all the nodes back to initial values (called when we leave) */
    GridStackEngine.prototype.restoreInitial = function () {
        this.nodes.forEach(function (n) {
            if (utils_1.Utils.samePos(n, n._orig))
                return;
            utils_1.Utils.copyPos(n, n._orig);
            n._dirty = true;
        });
        this._notify();
        return this;
    };
    /** find the first available empty spot for the given node width/height, updating the x,y attributes. return true if found.
     * optionally you can pass your own existing node list and column count, otherwise defaults to that engine data.
     * Optionally pass a widget to start search AFTER, meaning the order will remain the same but possibly have empty slots we skipped
     */
    GridStackEngine.prototype.findEmptyPosition = function (node, nodeList, column, after) {
        if (nodeList === void 0) { nodeList = this.nodes; }
        if (column === void 0) { column = this.column; }
        var start = after ? after.y * column + (after.x + after.w) : 0;
        var found = false;
        var _loop_1 = function (i) {
            var x = i % column;
            var y = Math.floor(i / column);
            if (x + node.w > column) {
                return "continue";
            }
            var box = { x: x, y: y, w: node.w, h: node.h };
            if (!nodeList.find(function (n) { return utils_1.Utils.isIntercepted(box, n); })) {
                if (node.x !== x || node.y !== y)
                    node._dirty = true;
                node.x = x;
                node.y = y;
                delete node.autoPosition;
                found = true;
            }
        };
        for (var i = start; !found; ++i) {
            _loop_1(i);
        }
        return found;
    };
    /** call to add the given node to our list, fixing collision and re-packing */
    GridStackEngine.prototype.addNode = function (node, triggerAddEvent, after) {
        if (triggerAddEvent === void 0) { triggerAddEvent = false; }
        var dup = this.nodes.find(function (n) { return n._id === node._id; });
        if (dup)
            return dup; // prevent inserting twice! return it instead.
        // skip prepareNode if we're in middle of column resize (not new) but do check for bounds!
        node = this._inColumnResize ? this.nodeBoundFix(node) : this.prepareNode(node);
        delete node._temporaryRemoved;
        delete node._removeDOM;
        var skipCollision;
        if (node.autoPosition && this.findEmptyPosition(node, this.nodes, this.column, after)) {
            delete node.autoPosition; // found our slot
            skipCollision = true;
        }
        this.nodes.push(node);
        if (triggerAddEvent) {
            this.addedNodes.push(node);
        }
        if (!skipCollision)
            this._fixCollisions(node);
        if (!this.batchMode) {
            this._packNodes()._notify();
        }
        return node;
    };
    GridStackEngine.prototype.removeNode = function (node, removeDOM, triggerEvent) {
        if (removeDOM === void 0) { removeDOM = true; }
        if (triggerEvent === void 0) { triggerEvent = false; }
        if (!this.nodes.find(function (n) { return n._id === node._id; })) {
            // TEST console.log(`Error: GridStackEngine.removeNode() node._id=${node._id} not found!`)
            return this;
        }
        if (triggerEvent) { // we wait until final drop to manually track removed items (rather than during drag)
            this.removedNodes.push(node);
        }
        if (removeDOM)
            node._removeDOM = true; // let CB remove actual HTML (used to set _id to null, but then we loose layout info)
        // don't use 'faster' .splice(findIndex(),1) in case node isn't in our list, or in multiple times.
        this.nodes = this.nodes.filter(function (n) { return n._id !== node._id; });
        return this._packNodes()
            ._notify([node]);
    };
    GridStackEngine.prototype.removeAll = function (removeDOM) {
        if (removeDOM === void 0) { removeDOM = true; }
        delete this._layouts;
        if (!this.nodes.length)
            return this;
        removeDOM && this.nodes.forEach(function (n) { return n._removeDOM = true; }); // let CB remove actual HTML (used to set _id to null, but then we loose layout info)
        this.removedNodes = this.nodes;
        this.nodes = [];
        return this._notify(this.removedNodes);
    };
    /** checks if item can be moved (layout constrain) vs moveNode(), returning true if was able to move.
     * In more complicated cases (maxRow) it will attempt at moving the item and fixing
     * others in a clone first, then apply those changes if still within specs. */
    GridStackEngine.prototype.moveNodeCheck = function (node, o) {
        var _this = this;
        // if (node.locked) return false;
        if (!this.changedPosConstrain(node, o))
            return false;
        o.pack = true;
        // simpler case: move item directly...
        if (!this.maxRow) {
            return this.moveNode(node, o);
        }
        // complex case: create a clone with NO maxRow (will check for out of bounds at the end)
        var clonedNode;
        var clone = new GridStackEngine({
            column: this.column,
            float: this.float,
            nodes: this.nodes.map(function (n) {
                if (n._id === node._id) {
                    clonedNode = __assign({}, n);
                    return clonedNode;
                }
                return __assign({}, n);
            })
        });
        if (!clonedNode)
            return false;
        // check if we're covering 50% collision and could move
        var canMove = clone.moveNode(clonedNode, o) && clone.getRow() <= this.maxRow;
        // else check if we can force a swap (float=true, or different shapes) on non-resize
        if (!canMove && !o.resizing && o.collide) {
            var collide = o.collide.el.gridstackNode; // find the source node the clone collided with at 50%
            if (this.swap(node, collide)) { // swaps and mark dirty
                this._notify();
                return true;
            }
        }
        if (!canMove)
            return false;
        // if clone was able to move, copy those mods over to us now instead of caller trying to do this all over!
        // Note: we can't use the list directly as elements and other parts point to actual node, so copy content
        clone.nodes.filter(function (n) { return n._dirty; }).forEach(function (c) {
            var n = _this.nodes.find(function (a) { return a._id === c._id; });
            if (!n)
                return;
            utils_1.Utils.copyPos(n, c);
            n._dirty = true;
        });
        this._notify();
        return true;
    };
    /** return true if can fit in grid height constrain only (always true if no maxRow) */
    GridStackEngine.prototype.willItFit = function (node) {
        delete node._willFitPos;
        if (!this.maxRow)
            return true;
        // create a clone with NO maxRow and check if still within size
        var clone = new GridStackEngine({
            column: this.column,
            float: this.float,
            nodes: this.nodes.map(function (n) { return __assign({}, n); })
        });
        var n = __assign({}, node); // clone node so we don't mod any settings on it but have full autoPosition and min/max as well! #1687
        this.cleanupNode(n);
        delete n.el;
        delete n._id;
        delete n.content;
        delete n.grid;
        clone.addNode(n);
        if (clone.getRow() <= this.maxRow) {
            node._willFitPos = utils_1.Utils.copyPos({}, n);
            return true;
        }
        return false;
    };
    /** true if x,y or w,h are different after clamping to min/max */
    GridStackEngine.prototype.changedPosConstrain = function (node, p) {
        // first make sure w,h are set for caller
        p.w = p.w || node.w;
        p.h = p.h || node.h;
        if (node.x !== p.x || node.y !== p.y)
            return true;
        // check constrained w,h
        if (node.maxW) {
            p.w = Math.min(p.w, node.maxW);
        }
        if (node.maxH) {
            p.h = Math.min(p.h, node.maxH);
        }
        if (node.minW) {
            p.w = Math.max(p.w, node.minW);
        }
        if (node.minH) {
            p.h = Math.max(p.h, node.minH);
        }
        return (node.w !== p.w || node.h !== p.h);
    };
    /** return true if the passed in node was actually moved (checks for no-op and locked) */
    GridStackEngine.prototype.moveNode = function (node, o) {
        var _a, _b;
        if (!node || /*node.locked ||*/ !o)
            return false;
        var wasUndefinedPack;
        if (o.pack === undefined) {
            wasUndefinedPack = o.pack = true;
        }
        // constrain the passed in values and check if we're still changing our node
        if (typeof o.x !== 'number') {
            o.x = node.x;
        }
        if (typeof o.y !== 'number') {
            o.y = node.y;
        }
        if (typeof o.w !== 'number') {
            o.w = node.w;
        }
        if (typeof o.h !== 'number') {
            o.h = node.h;
        }
        var resizing = (node.w !== o.w || node.h !== o.h);
        var nn = utils_1.Utils.copyPos({}, node, true); // get min/max out first, then opt positions next
        utils_1.Utils.copyPos(nn, o);
        nn = this.nodeBoundFix(nn, resizing);
        utils_1.Utils.copyPos(o, nn);
        if (utils_1.Utils.samePos(node, o))
            return false;
        var prevPos = utils_1.Utils.copyPos({}, node);
        // check if we will need to fix collision at our new location
        var collides = this.collideAll(node, nn, o.skip);
        var needToMove = true;
        if (collides.length) {
            var activeDrag = node._moving && !o.nested;
            // check to make sure we actually collided over 50% surface area while dragging
            var collide = activeDrag ? this.directionCollideCoverage(node, o, collides) : collides[0];
            // if we're enabling creation of sub-grids on the fly, see if we're covering 80% of either one, if we didn't already do that
            if (activeDrag && collide && ((_b = (_a = node.grid) === null || _a === void 0 ? void 0 : _a.opts) === null || _b === void 0 ? void 0 : _b.subGridDynamic) && !node.grid._isTemp) {
                var over = utils_1.Utils.areaIntercept(o.rect, collide._rect);
                var a1 = utils_1.Utils.area(o.rect);
                var a2 = utils_1.Utils.area(collide._rect);
                var perc = over / (a1 < a2 ? a1 : a2);
                if (perc > .8) {
                    collide.grid.makeSubGrid(collide.el, undefined, node);
                    collide = undefined;
                }
            }
            if (collide) {
                needToMove = !this._fixCollisions(node, nn, collide, o); // check if already moved...
            }
            else {
                needToMove = false; // we didn't cover >50% for a move, skip...
                if (wasUndefinedPack)
                    delete o.pack;
            }
        }
        // now move (to the original ask vs the collision version which might differ) and repack things
        if (needToMove) {
            node._dirty = true;
            utils_1.Utils.copyPos(node, nn);
        }
        if (o.pack) {
            this._packNodes()
                ._notify();
        }
        return !utils_1.Utils.samePos(node, prevPos); // pack might have moved things back
    };
    GridStackEngine.prototype.getRow = function () {
        return this.nodes.reduce(function (row, n) { return Math.max(row, n.y + n.h); }, 0);
    };
    GridStackEngine.prototype.beginUpdate = function (node) {
        if (!node._updating) {
            node._updating = true;
            delete node._skipDown;
            if (!this.batchMode)
                this.saveInitial();
        }
        return this;
    };
    GridStackEngine.prototype.endUpdate = function () {
        var n = this.nodes.find(function (n) { return n._updating; });
        if (n) {
            delete n._updating;
            delete n._skipDown;
        }
        return this;
    };
    /** saves a copy of the largest column layout (eg 12 even when rendering oneColumnMode) so we don't loose orig layout,
     * returning a list of widgets for serialization */
    GridStackEngine.prototype.save = function (saveElement, saveCB) {
        var _a;
        if (saveElement === void 0) { saveElement = true; }
        // use the highest layout for any saved info so we can have full detail on reload #1849
        var len = (_a = this._layouts) === null || _a === void 0 ? void 0 : _a.length;
        var layout = len && this.column !== (len - 1) ? this._layouts[len - 1] : null;
        var list = [];
        this.sortNodes();
        this.nodes.forEach(function (n) {
            var wl = layout === null || layout === void 0 ? void 0 : layout.find(function (l) { return l._id === n._id; });
            var w = __assign({}, n);
            // use layout info instead if set
            if (wl) {
                w.x = wl.x;
                w.y = wl.y;
                w.w = wl.w;
            }
            utils_1.Utils.removeInternalForSave(w, !saveElement);
            if (saveCB)
                saveCB(n, w);
            list.push(w);
        });
        return list;
    };
    /** @internal called whenever a node is added or moved - updates the cached layouts */
    GridStackEngine.prototype.layoutsNodesChange = function (nodes) {
        var _this = this;
        if (!this._layouts || this._inColumnResize)
            return this;
        // remove smaller layouts - we will re-generate those on the fly... larger ones need to update
        this._layouts.forEach(function (layout, column) {
            if (!layout || column === _this.column)
                return _this;
            if (column < _this.column) {
                _this._layouts[column] = undefined;
            }
            else {
                // we save the original x,y,w (h isn't cached) to see what actually changed to propagate better.
                // NOTE: we don't need to check against out of bound scaling/moving as that will be done when using those cache values. #1785
                var ratio_1 = column / _this.column;
                nodes.forEach(function (node) {
                    if (!node._orig)
                        return; // didn't change (newly added ?)
                    var n = layout.find(function (l) { return l._id === node._id; });
                    if (!n)
                        return; // no cache for new nodes. Will use those values.
                    // Y changed, push down same amount
                    // TODO: detect doing item 'swaps' will help instead of move (especially in 1 column mode)
                    if (node.y !== node._orig.y) {
                        n.y += (node.y - node._orig.y);
                    }
                    // X changed, scale from new position
                    if (node.x !== node._orig.x) {
                        n.x = Math.round(node.x * ratio_1);
                    }
                    // width changed, scale from new width
                    if (node.w !== node._orig.w) {
                        n.w = Math.round(node.w * ratio_1);
                    }
                    // ...height always carries over from cache
                });
            }
        });
        return this;
    };
    /**
     * @internal Called to scale the widget width & position up/down based on the column change.
     * Note we store previous layouts (especially original ones) to make it possible to go
     * from say 12 -> 1 -> 12 and get back to where we were.
     *
     * @param prevColumn previous number of columns
     * @param column  new column number
     * @param nodes different sorted list (ex: DOM order) instead of current list
     * @param layout specify the type of re-layout that will happen (position, size, etc...).
     * Note: items will never be outside of the current column boundaries. default (moveScale). Ignored for 1 column
     */
    GridStackEngine.prototype.columnChanged = function (prevColumn, column, nodes, layout) {
        var _this = this;
        var _a;
        if (layout === void 0) { layout = 'moveScale'; }
        if (!this.nodes.length || !column || prevColumn === column)
            return this;
        // simpler shortcuts layouts
        var doCompact = layout === 'compact' || layout === 'list';
        if (doCompact) {
            this.sortNodes(1, prevColumn); // sort with original layout once and only once (new column will affect order otherwise)
        }
        // cache the current layout in case they want to go back (like 12 -> 1 -> 12) as it requires original data IFF we're sizing down (see below)
        if (column < prevColumn)
            this.cacheLayout(this.nodes, prevColumn);
        this.batchUpdate(); // do this EARLY as it will call saveInitial() so we can detect where we started for _dirty and collision
        var newNodes = [];
        // if we're going to 1 column and using DOM order (item passed in) rather than default sorting, then generate that layout
        var domOrder = false;
        if (column === 1 && (nodes === null || nodes === void 0 ? void 0 : nodes.length)) {
            domOrder = true;
            var top_1 = 0;
            nodes.forEach(function (n) {
                n.x = 0;
                n.w = 1;
                n.y = Math.max(n.y, top_1);
                top_1 = n.y + n.h;
            });
            newNodes = nodes;
            nodes = [];
        }
        else {
            nodes = doCompact ? this.nodes : utils_1.Utils.sort(this.nodes, -1, prevColumn); // current column reverse sorting so we can insert last to front (limit collision)
        }
        // see if we have cached previous layout IFF we are going up in size (restore) otherwise always
        // generate next size down from where we are (looks more natural as you gradually size down).
        if (column > prevColumn && this._layouts) {
            var cacheNodes = this._layouts[column] || [];
            // ...if not, start with the largest layout (if not already there) as down-scaling is more accurate
            // by pretending we came from that larger column by assigning those values as starting point
            var lastIndex = this._layouts.length - 1;
            if (!cacheNodes.length && prevColumn !== lastIndex && ((_a = this._layouts[lastIndex]) === null || _a === void 0 ? void 0 : _a.length)) {
                prevColumn = lastIndex;
                this._layouts[lastIndex].forEach(function (cacheNode) {
                    var n = nodes.find(function (n) { return n._id === cacheNode._id; });
                    if (n) {
                        // still current, use cache info positions
                        if (!doCompact) {
                            n.x = cacheNode.x;
                            n.y = cacheNode.y;
                        }
                        n.w = cacheNode.w;
                    }
                });
            }
            // if we found cache re-use those nodes that are still current
            cacheNodes.forEach(function (cacheNode) {
                var j = nodes.findIndex(function (n) { return n._id === cacheNode._id; });
                if (j !== -1) {
                    // still current, use cache info positions
                    if (doCompact) {
                        nodes[j].w = cacheNode.w; // only w is used, and don't trim the list
                        return;
                    }
                    if (cacheNode.autoPosition || isNaN(cacheNode.x) || isNaN(cacheNode.y)) {
                        _this.findEmptyPosition(cacheNode, newNodes);
                    }
                    if (!cacheNode.autoPosition) {
                        nodes[j].x = cacheNode.x;
                        nodes[j].y = cacheNode.y;
                        nodes[j].w = cacheNode.w;
                        newNodes.push(nodes[j]);
                    }
                    nodes.splice(j, 1);
                }
            });
        }
        // much simpler layout that just compacts
        if (doCompact) {
            this.compact(layout, false);
        }
        else {
            // ...and add any extra non-cached ones
            if (nodes.length) {
                if (typeof layout === 'function') {
                    layout(column, prevColumn, newNodes, nodes);
                }
                else if (!domOrder) {
                    var ratio_2 = (doCompact || layout === 'none') ? 1 : column / prevColumn;
                    var move_1 = (layout === 'move' || layout === 'moveScale');
                    var scale_1 = (layout === 'scale' || layout === 'moveScale');
                    nodes.forEach(function (node) {
                        // NOTE: x + w could be outside of the grid, but addNode() below will handle that
                        node.x = (column === 1 ? 0 : (move_1 ? Math.round(node.x * ratio_2) : Math.min(node.x, column - 1)));
                        node.w = ((column === 1 || prevColumn === 1) ? 1 : scale_1 ? (Math.round(node.w * ratio_2) || 1) : (Math.min(node.w, column)));
                        newNodes.push(node);
                    });
                    nodes = [];
                }
            }
            // finally re-layout them in reverse order (to get correct placement)
            if (!domOrder)
                newNodes = utils_1.Utils.sort(newNodes, -1, column);
            this._inColumnResize = true; // prevent cache update
            this.nodes = []; // pretend we have no nodes to start with (add() will use same structures) to simplify layout
            newNodes.forEach(function (node) {
                _this.addNode(node, false); // 'false' for add event trigger
                delete node._orig; // make sure the commit doesn't try to restore things back to original
            });
        }
        this.nodes.forEach(function (n) { return delete n._orig; }); // clear _orig before batch=false so it doesn't handle float=true restore
        this.batchUpdate(false, !doCompact);
        delete this._inColumnResize;
        return this;
    };
    /**
     * call to cache the given layout internally to the given location so we can restore back when column changes size
     * @param nodes list of nodes
     * @param column corresponding column index to save it under
     * @param clear if true, will force other caches to be removed (default false)
     */
    GridStackEngine.prototype.cacheLayout = function (nodes, column, clear) {
        if (clear === void 0) { clear = false; }
        var copy = [];
        nodes.forEach(function (n, i) {
            var _a;
            n._id = (_a = n._id) !== null && _a !== void 0 ? _a : GridStackEngine._idSeq++; // make sure we have an id in case this is new layout, else re-use id already set
            copy[i] = { x: n.x, y: n.y, w: n.w, _id: n._id }; // only thing we change is x,y,w and id to find it back
        });
        this._layouts = clear ? [] : this._layouts || []; // use array to find larger quick
        this._layouts[column] = copy;
        return this;
    };
    /**
     * call to cache the given node layout internally to the given location so we can restore back when column changes size
     * @param node single node to cache
     * @param column corresponding column index to save it under
     */
    GridStackEngine.prototype.cacheOneLayout = function (n, column) {
        var _a;
        n._id = (_a = n._id) !== null && _a !== void 0 ? _a : GridStackEngine._idSeq++;
        var l = { x: n.x, y: n.y, w: n.w, _id: n._id };
        if (n.autoPosition) {
            delete l.x;
            delete l.y;
            l.autoPosition = true;
        }
        this._layouts = this._layouts || [];
        this._layouts[column] = this._layouts[column] || [];
        var index = this.findCacheLayout(n, column);
        if (index === -1)
            this._layouts[column].push(l);
        else
            this._layouts[column][index] = l;
        return this;
    };
    GridStackEngine.prototype.findCacheLayout = function (n, column) {
        var _a, _b, _c;
        return (_c = (_b = (_a = this._layouts) === null || _a === void 0 ? void 0 : _a[column]) === null || _b === void 0 ? void 0 : _b.findIndex(function (l) { return l._id === n._id; })) !== null && _c !== void 0 ? _c : -1;
    };
    /** called to remove all internal values but the _id */
    GridStackEngine.prototype.cleanupNode = function (node) {
        for (var prop in node) {
            if (prop[0] === '_' && prop !== '_id')
                delete node[prop];
        }
        return this;
    };
    /** @internal unique global internal _id counter */
    GridStackEngine._idSeq = 0;
    return GridStackEngine;
}());
//# sourceMappingURL=gridstack-engine.js.map