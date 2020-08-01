/**
 * gridstack.js 1.2.0
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
 * @preserve
*/
(function(factory) {
  /* [alain] we compile jquery with our code, so no need to 'load' externally
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'exports'], factory);
  } else if (typeof exports !== 'undefined') {
    var jQueryModule;

    try { jQueryModule = require('jquery'); } catch (e) {}

    factory(jQueryModule || window.jQuery, exports);
  } else */{
    factory(window.jQuery, window);
  }
})(function($, scope) {

  // checks for obsolete method names
  var obsolete = function(f, oldName, newName, rev) {
    var wrapper = function() {
      console.warn('gridstack.js: Function `' + oldName + '` is deprecated in ' + rev + ' and has been replaced ' +
      'with `' + newName + '`. It will be **completely** removed in v1.0');
      return f.apply(this, arguments);
    };
    wrapper.prototype = f.prototype;

    return wrapper;
  };

  // checks for obsolete grid options (can be used for any fields, but msg is about options)
  var obsoleteOpts = function(opts, oldName, newName, rev) {
    if (opts[oldName] !== undefined) {
      opts[newName] = opts[oldName];
      console.warn('gridstack.js: Option `' + oldName + '` is deprecated in ' + rev + ' and has been replaced with `' +
        newName + '`. It will be **completely** removed in v1.0');
    }
  };

  // checks for obsolete grid options which are gone
  var obsoleteOptsDel = function(opts, oldName, rev, info) {
    if (opts[oldName] !== undefined) {
      console.warn('gridstack.js: Option `' + oldName + '` is deprecated in ' + rev + info);
    }
  };

  // checks for obsolete Jquery element attributes
  var obsoleteAttr = function(el, oldName, newName, rev) {
    var oldAttr = el.attr(oldName);
    if (oldAttr !== undefined) {
      el.attr(newName, oldAttr);
      console.warn('gridstack.js: attribute `' + oldName + '`=' + oldAttr + ' is deprecated on this object in ' + rev + ' and has been replaced with `' +
        newName + '`. It will be **completely** removed in v1.0');
    }
  };

  var Utils = {

    isIntercepted: function(a, b) {
      return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
    },

    sort: function(nodes, dir, column) {
      if (!column) {
        var widths = nodes.map(function(node) { return node.x + node.width; });
        column = Math.max.apply(Math, widths);
      }

      if (dir === -1)
        return Utils.sortBy(nodes, function(n) { return -(n.x + n.y * column); });
      else
        return Utils.sortBy(nodes, function(n) { return (n.x + n.y * column); });
    },

    createStylesheet: function(id, parent) {
      var style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.setAttribute('data-gs-style-id', id);
      if (style.styleSheet) {
        style.styleSheet.cssText = '';
      } else {
        style.appendChild(document.createTextNode(''));
      }
      if (!parent) { parent = document.getElementsByTagName('head')[0]; } // default to head
      parent.insertBefore(style, parent.firstChild);
      return style.sheet;
    },

    removeStylesheet: function(id) {
      $('STYLE[data-gs-style-id=' + id + ']').remove();
    },

    insertCSSRule: function(sheet, selector, rules, index) {
      if (typeof sheet.insertRule === 'function') {
        sheet.insertRule(selector + '{' + rules + '}', index);
      } else if (typeof sheet.addRule === 'function') {
        sheet.addRule(selector, rules, index);
      }
    },

    toBool: function(v) {
      if (typeof v === 'boolean') {
        return v;
      }
      if (typeof v === 'string') {
        v = v.toLowerCase();
        return !(v === '' || v === 'no' || v === 'false' || v === '0');
      }
      return Boolean(v);
    },

    _collisionNodeCheck: function(n) {
      return n !== this.node && Utils.isIntercepted(n, this.nn);
    },

    _didCollide: function(bn) {
      return Utils.isIntercepted({x: this.n.x, y: this.newY, width: this.n.width, height: this.n.height}, bn);
    },

    _isAddNodeIntercepted: function(n) {
      return Utils.isIntercepted({x: this.x, y: this.y, width: this.node.width, height: this.node.height}, n);
    },

    parseHeight: function(val) {
      var height = val;
      var heightUnit = 'px';
      if (height && typeof height === 'string') {
        var match = height.match(/^(-[0-9]+\.[0-9]+|[0-9]*\.[0-9]+|-[0-9]+|[0-9]+)(px|em|rem|vh|vw|%)?$/);
        if (!match) {
          throw new Error('Invalid height');
        }
        heightUnit = match[2] || 'px';
        height = parseFloat(match[1]);
      }
      return {height: height, unit: heightUnit};
    },

    without:  function(array, item) {
      var index = array.indexOf(item);

      if (index !== -1) {
        array = array.slice(0);
        array.splice(index, 1);
      }

      return array;
    },

    sortBy: function(array, getter) {
      return array.slice(0).sort(function(left, right) {
        var valueLeft = getter(left);
        var valueRight = getter(right);

        if (valueRight === valueLeft) {
          return 0;
        }

        return valueLeft > valueRight ? 1 : -1;
      });
    },

    defaults: function(target) {
      var sources = Array.prototype.slice.call(arguments, 1);

      sources.forEach(function(source) {
        for (var prop in source) {
          if (Object.prototype.hasOwnProperty.call(source, prop) && (!Object.prototype.hasOwnProperty.call(target, prop) || target[prop] === undefined)) {
            target[prop] = source[prop];
          }
        }
      });

      return target;
    },

    clone: function(target) {
      return $.extend({}, target);
    },

    throttle: function(callback, delay) {
      var isWaiting = false;

      return function() {
        if (!isWaiting) {
          callback.apply(this, arguments);
          isWaiting = true;
          setTimeout(function() { isWaiting = false; }, delay);
        }
      };
    },

    removePositioningStyles: function(el) {
      var style = el[0].style;
      if (style.position) {
        style.removeProperty('position');
      }
      if (style.left) {
        style.removeProperty('left');
      }
      if (style.top) {
        style.removeProperty('top');
      }
      if (style.width) {
        style.removeProperty('width');
      }
      if (style.height) {
        style.removeProperty('height');
      }
    },
    getScrollParent: function(el) {
      var returnEl;
      if (el === null) {
        returnEl = null;
      } else if (el.scrollHeight > el.clientHeight) {
        returnEl = el;
      } else {
        returnEl = Utils.getScrollParent(el.parentNode);
      }
      return returnEl;
    },
    updateScrollPosition: function(el, ui, distance) {
      // is widget in view?
      var rect = el.getBoundingClientRect();
      var innerHeightOrClientHeight = (window.innerHeight || document.documentElement.clientHeight);
      if (rect.top < 0 ||
        rect.bottom > innerHeightOrClientHeight
      ) {
        // set scrollTop of first parent that scrolls
        // if parent is larger than el, set as low as possible
        // to get entire widget on screen
        var offsetDiffDown = rect.bottom - innerHeightOrClientHeight;
        var offsetDiffUp = rect.top;
        var scrollEl = Utils.getScrollParent(el);
        if (scrollEl !== null) {
          var prevScroll = scrollEl.scrollTop;
          if (rect.top < 0 && distance < 0) {
            // moving up
            if (el.offsetHeight > innerHeightOrClientHeight) {
              scrollEl.scrollTop += distance;
            } else {
              scrollEl.scrollTop += Math.abs(offsetDiffUp) > Math.abs(distance) ? distance : offsetDiffUp;
            }
          } else if (distance > 0) {
            // moving down
            if (el.offsetHeight > innerHeightOrClientHeight) {
              scrollEl.scrollTop += distance;
            } else {
              scrollEl.scrollTop += offsetDiffDown > distance ? distance : offsetDiffDown;
            }
          }
          // move widget y by amount scrolled
          ui.position.top += scrollEl.scrollTop - prevScroll;
        }
      }
    }
  };

  /**
  * @class GridStackDragDropPlugin
  * Base class for drag'n'drop plugin.
  */
  function GridStackDragDropPlugin(grid) {
    this.grid = grid;
  }

  GridStackDragDropPlugin.registeredPlugins = [];

  GridStackDragDropPlugin.registerPlugin = function(pluginClass) {
    GridStackDragDropPlugin.registeredPlugins.push(pluginClass);
  };

  GridStackDragDropPlugin.prototype.resizable = function(el, opts) {
    return this;
  };

  GridStackDragDropPlugin.prototype.draggable = function(el, opts) {
    return this;
  };

  GridStackDragDropPlugin.prototype.droppable = function(el, opts) {
    return this;
  };

  GridStackDragDropPlugin.prototype.isDroppable = function(el) {
    return false;
  };

  GridStackDragDropPlugin.prototype.on = function(el, eventName, callback) {
    return this;
  };


  var idSeq = 0;

  var GridStackEngine = function(column, onchange, float, maxRow, items) {
    this.column = column || 12;
    this.float = float || false;
    this.maxRow = maxRow || 0;

    this.nodes = items || [];
    this.onchange = onchange || function() {};

    this._addedNodes = [];
    this._removedNodes = [];
    this._batchMode = false;
  };

  GridStackEngine.prototype.batchUpdate = function() {
    if (this._batchMode) return;
    this._batchMode = true;
    this._prevFloat = this.float;
    this.float = true; // let things go anywhere for now... commit() will restore and possibly reposition
  };

  GridStackEngine.prototype.commit = function() {
    if (!this._batchMode) return;
    this._batchMode = false;
    this.float = this._prevFloat;
    delete this._prevFloat;
    this._packNodes();
    this._notify();
  };

  // For Meteor support: https://github.com/gridstack/gridstack.js/pull/272
  GridStackEngine.prototype.getNodeDataByDOMEl = function(el) {
    return this.nodes.find(function(node) { return el === node.el });
  };

  GridStackEngine.prototype._fixCollisions = function(node) {
    var self = this;
    this._sortNodes(-1);

    var nn = node;
    var hasLocked = Boolean(this.nodes.find(function(n) { return n.locked; }));
    if (!this.float && !hasLocked) {
      nn = {x: 0, y: node.y, width: this.column, height: node.height};
    }
    while (true) {
      var collisionNode = this.nodes.find(Utils._collisionNodeCheck, {node: node, nn: nn});
      if (!collisionNode) { return; }
      var moved;
      if (collisionNode.locked) {
        // if colliding with a locked item, move ourself instead
        moved = this.moveNode(node, node.x, collisionNode.y + collisionNode.height,
          node.width, node.height, true);
      } else {
        moved = this.moveNode(collisionNode, collisionNode.x, node.y + node.height,
          collisionNode.width, collisionNode.height, true);
      }
      if (!moved) { return; } // break inf loop if we couldn't move after all (ex: maxRow, fixed)
    }
  };

  GridStackEngine.prototype.isAreaEmpty = function(x, y, width, height) {
    var nn = {x: x || 0, y: y || 0, width: width || 1, height: height || 1};
    var collisionNode = this.nodes.find(function(n) {
      return Utils.isIntercepted(n, nn);
    });
    return !collisionNode;
  };

  GridStackEngine.prototype._sortNodes = function(dir) {
    this.nodes = Utils.sort(this.nodes, dir, this.column);
  };

  GridStackEngine.prototype._packNodes = function() {
    this._sortNodes();

    if (this.float) {
      this.nodes.forEach(function(n, i) {
        if (n._updating || n._packY === undefined || n.y === n._packY) {
          return;
        }

        var newY = n.y;
        while (newY >= n._packY) {
          var collisionNode = this.nodes
            .slice(0, i)
            .find(Utils._didCollide, {n: n, newY: newY});

          if (!collisionNode) {
            n._dirty = true;
            n.y = newY;
          }
          --newY;
        }
      }, this);
    } else {
      this.nodes.forEach(function(n, i) {
        if (n.locked) { return; }
        while (n.y > 0) {
          var newY = n.y - 1;
          var canBeMoved = i === 0;

          if (i > 0) {
            var collisionNode = this.nodes
              .slice(0, i)
              .find(Utils._didCollide, {n: n, newY: newY});
            canBeMoved = collisionNode === undefined;
          }

          if (!canBeMoved) { break; }
          // Note: must be dirty (from last position) for GridStack::OnChange CB to update positions
          // and move items back. The user 'change' CB should detect changes from the original
          // starting position instead.
          n._dirty = (n.y !== newY);
          n.y = newY;
        }
      }, this);
    }
  };

  GridStackEngine.prototype._prepareNode = function(node, resizing) {
    node = node || {};
    // if we're missing position, have the grid position us automatically (before we set them to 0,0)
    if (node.x === undefined || node.y === undefined || node.x === null || node.y === null) {
      node.autoPosition = true;
    }

    // assign defaults for missing required fields
    var defaults = {width: 1, height: 1, x: 0, y: 0};
    node = Utils.defaults(node, defaults);

    // convert any strings over
    node.x = parseInt(node.x);
    node.y = parseInt(node.y);
    node.width = parseInt(node.width);
    node.height = parseInt(node.height);
    node.autoPosition = node.autoPosition || false;
    node.noResize = node.noResize || false;
    node.noMove = node.noMove || false;

    // check for NaN (in case messed up strings were passed. can't do parseInt() || defaults.x above as 0 is valid #)
    if (Number.isNaN(node.x))      { node.x = defaults.x; node.autoPosition = true; }
    if (Number.isNaN(node.y))      { node.y = defaults.y; node.autoPosition = true; }
    if (Number.isNaN(node.width))  { node.width = defaults.width; }
    if (Number.isNaN(node.height)) { node.height = defaults.height; }

    if (node.maxWidth !== undefined) { node.width = Math.min(node.width, node.maxWidth); }
    if (node.maxHeight !== undefined) { node.height = Math.min(node.height, node.maxHeight); }
    if (node.minWidth !== undefined) { node.width = Math.max(node.width, node.minWidth); }
    if (node.minHeight !== undefined) { node.height = Math.max(node.height, node.minHeight); }

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
  };

  GridStackEngine.prototype._notify = function() {
    if (this._batchMode) { return; }
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = (args[0] === undefined ? [] : (Array.isArray(args[0]) ? args[0] : [args[0]]) );
    args[1] = (args[1] === undefined ? true : args[1]);
    var dirtyNodes = args[0].concat(this.getDirtyNodes());
    this.onchange(dirtyNodes, args[1]);
  };

  GridStackEngine.prototype.cleanNodes = function() {
    if (this._batchMode) { return; }
    this.nodes.forEach(function(n) { delete n._dirty; });
  };

  GridStackEngine.prototype.getDirtyNodes = function(verify) {
    // compare original X,Y,W,H (or entire node?) instead as _dirty can be a temporary state
    if (verify) {
      var dirtNodes = [];
      this.nodes.forEach(function (n) {
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

    return this.nodes.filter(function(n) { return n._dirty; });
  };

  GridStackEngine.prototype.addNode = function(node, triggerAddEvent) {
    node = this._prepareNode(node);

    node._id = node._id || ++idSeq;

    if (node.autoPosition) {
      this._sortNodes();

      for (var i = 0;; ++i) {
        var x = i % this.column;
        var y = Math.floor(i / this.column);
        if (x + node.width > this.column) {
          continue;
        }
        if (!this.nodes.find(Utils._isAddNodeIntercepted, {x: x, y: y, node: node})) {
          node.x = x;
          node.y = y;
          delete node.autoPosition; // found our slot
          break;
        }
      }
    }

    this.nodes.push(node);
    if (triggerAddEvent) {
      this._addedNodes.push(node);
    }

    this._fixCollisions(node);
    this._packNodes();
    this._notify();
    return node;
  };

  GridStackEngine.prototype.removeNode = function(node, detachNode) {
    detachNode = (detachNode === undefined ? true : detachNode);
    this._removedNodes.push(node);
    node._id = null; // hint that node is being removed
    this.nodes = Utils.without(this.nodes, node);
    this._packNodes();
    this._notify(node, detachNode);
  };

  GridStackEngine.prototype.removeAll = function(detachNode) {
    delete this._layouts;
    if (this.nodes.length === 0) { return; }
    detachNode = (detachNode === undefined ? true : detachNode);
    this.nodes.forEach(function(n) { n._id = null; }); // hint that node is being removed
    this._removedNodes = this.nodes;
    this.nodes = [];
    this._notify(this._removedNodes, detachNode);
  };

  GridStackEngine.prototype.canMoveNode = function(node, x, y, width, height) {
    if (!this.isNodeChangedPosition(node, x, y, width, height)) {
      return false;
    }
    var hasLocked = Boolean(this.nodes.find(function(n) { return n.locked; }));

    if (!this.maxRow && !hasLocked) {
      return true;
    }

    var clonedNode;
    var clone = new GridStackEngine(
      this.column,
      null,
      this.float,
      0,
      this.nodes.map(function(n) {
        if (n === node) {
          clonedNode = $.extend({}, n);
          return clonedNode;
        }
        return $.extend({}, n);
      }));

    if (!clonedNode) {  return true;}

    clone.moveNode(clonedNode, x, y, width, height);

    var res = true;

    if (hasLocked) {
      res &= !Boolean(clone.nodes.find(function(n) {
        return n !== clonedNode && Boolean(n.locked) && Boolean(n._dirty);
      }));
    }
    if (this.maxRow) {
      res &= clone.getRow() <= this.maxRow;
    }

    return res;
  };

  GridStackEngine.prototype.canBePlacedWithRespectToHeight = function(node) {
    if (!this.maxRow) {
      return true;
    }

    var clone = new GridStackEngine(
      this.column,
      null,
      this.float,
      0,
      this.nodes.map(function(n) { return $.extend({}, n); }));
    clone.addNode(node);
    return clone.getRow() <= this.maxRow;
  };

  GridStackEngine.prototype.isNodeChangedPosition = function(node, x, y, width, height) {
    if (typeof x !== 'number') { x = node.x; }
    if (typeof y !== 'number') { y = node.y; }
    if (typeof width !== 'number') { width = node.width; }
    if (typeof height !== 'number') { height = node.height; }

    if (node.maxWidth !== undefined) { width = Math.min(width, node.maxWidth); }
    if (node.maxHeight !== undefined) { height = Math.min(height, node.maxHeight); }
    if (node.minWidth !== undefined) { width = Math.max(width, node.minWidth); }
    if (node.minHeight !== undefined) { height = Math.max(height, node.minHeight); }

    if (node.x === x && node.y === y && node.width === width && node.height === height) {
      return false;
    }
    return true;
  };

  GridStackEngine.prototype.moveNode = function(node, x, y, width, height, noPack) {
    if (node.locked) { return null; }
    if (typeof x !== 'number') { x = node.x; }
    if (typeof y !== 'number') { y = node.y; }
    if (typeof width !== 'number') { width = node.width; }
    if (typeof height !== 'number') { height = node.height; }

    // constrain the passed in values and check if we're still changing our node
    var resizing = (node.width !== width || node.height !== height);
    var nn = { x: x, y: y, width: width, height: height,
      maxWidth: node.maxWidth, maxHeight: node.maxHeight, minWidth: node.minWidth, minHeight: node.minHeight};
    nn = this._prepareNode(nn, resizing);
    if (node.x === nn.x && node.y === nn.y && node.width === nn.width && node.height === nn.height) {
      return null;
    }

    node._dirty = true;

    node.x = node.lastTriedX = nn.x;
    node.y = node.lastTriedY = nn.y;
    node.width = node.lastTriedWidth = nn.width;
    node.height = node.lastTriedHeight = nn.height;

    this._fixCollisions(node);
    if (!noPack) {
      this._packNodes();
      this._notify();
    }
    return node;
  };

  GridStackEngine.prototype.getRow = function() {
    return this.nodes.reduce(function(memo, n) { return Math.max(memo, n.y + n.height); }, 0);
  };

  GridStackEngine.prototype.beginUpdate = function(node) {
    if (node._updating) return;
    node._updating = true;
    this.nodes.forEach(function(n) { n._packY = n.y; });
  };

  GridStackEngine.prototype.endUpdate = function() {
    var n = this.nodes.find(function(n) { return n._updating; });
    if (n) {
      n._updating = false;
      this.nodes.forEach(function(n) { delete n._packY; });
    }
  };

  /**
   * Construct a grid item from the given element and options
   * @param {GridStackElement} el
   * @param {GridstackOptions} opts
   */
  var GridStack = function(el, opts) {
    var self = this;
    var oneColumnMode, _prevColumn, isAutoCellHeight;

    opts = opts || {};

    this.$el = $(el); // TODO: legacy code
    this.el = this.$el.get(0); // exposed HTML element to the user

    obsoleteOpts(opts, 'width', 'column', 'v0.5.3');
    obsoleteOpts(opts, 'height', 'maxRow', 'v0.5.3');
    obsoleteOptsDel(opts, 'oneColumnModeClass', 'v0.6.3', '. Use class `.grid-stack-1` instead');

    // container attributes
    obsoleteAttr(this.$el, 'data-gs-width', 'data-gs-column', 'v0.5.3');
    obsoleteAttr(this.$el, 'data-gs-height', 'data-gs-max-row', 'v0.5.3');
    obsoleteAttr(this.$el, 'data-gs-current-height', 'data-gs-current-row', 'v1.0.0');

    opts.itemClass = opts.itemClass || 'grid-stack-item';
    var isNested = this.$el.closest('.' + opts.itemClass).length > 0;

    // if row property exists, replace minRow and maxRow instead
    if (opts.row) {
      opts.minRow = opts.maxRow = opts.row;
      delete opts.row;
    }
    var rowAttr = parseInt(this.$el.attr('data-gs-row'));

    // elements attributes override any passed options (like CSS style) - merge the two together
    this.opts = Utils.defaults(opts, {
      column: parseInt(this.$el.attr('data-gs-column')) || 12,
      minRow: rowAttr ? rowAttr : parseInt(this.$el.attr('data-gs-min-row')) || 0,
      maxRow: rowAttr ? rowAttr : parseInt(this.$el.attr('data-gs-max-row')) || 0,
      itemClass: 'grid-stack-item',
      placeholderClass: 'grid-stack-placeholder',
      placeholderText: '',
      handle: '.grid-stack-item-content',
      handleClass: null,
      styleInHead: false,
      cellHeight: 60,
      verticalMargin: 20,
      auto: true,
      minWidth: 768,
      float: false,
      staticGrid: false,
      _class: 'grid-stack-instance-' + (Math.random() * 10000).toFixed(0),
      animate: Boolean(this.$el.attr('data-gs-animate')) || false,
      alwaysShowResizeHandle: opts.alwaysShowResizeHandle || false,
      resizable: Utils.defaults(opts.resizable || {}, {
        autoHide: !(opts.alwaysShowResizeHandle || false),
        handles: 'se'
      }),
      draggable: Utils.defaults(opts.draggable || {}, {
        handle: (opts.handleClass ? '.' + opts.handleClass : (opts.handle ? opts.handle : '')) ||
          '.grid-stack-item-content',
        scroll: false,
        appendTo: 'body'
      }),
      disableDrag: opts.disableDrag || false,
      disableResize: opts.disableResize || false,
      rtl: 'auto',
      removable: false,
      removableOptions: Utils.defaults(opts.removableOptions || {}, {
        accept: '.' + opts.itemClass
      }),
      removeTimeout: 2000,
      verticalMarginUnit: 'px',
      cellHeightUnit: 'px',
      disableOneColumnMode: opts.disableOneColumnMode || false,
      oneColumnModeDomSort: opts.oneColumnModeDomSort,
      ddPlugin: null
    });

    if (this.opts.ddPlugin === false) {
      this.opts.ddPlugin = GridStackDragDropPlugin;
    } else if (this.opts.ddPlugin === null) {
      this.opts.ddPlugin = GridStackDragDropPlugin.registeredPlugins[0] || GridStackDragDropPlugin;
    }

    this.dd = new this.opts.ddPlugin(this);

    if (this.opts.rtl === 'auto') {
      this.opts.rtl = this.$el.css('direction') === 'rtl';
    }

    if (this.opts.rtl) {
      this.$el.addClass('grid-stack-rtl');
    }

    this.opts.isNested = isNested;

    isAutoCellHeight = (this.opts.cellHeight === 'auto');
    if (isAutoCellHeight) {
      // make the cell square initially
      self.cellHeight(self.cellWidth(), true);
    } else {
      this.cellHeight(this.opts.cellHeight, true);
    }
    this.verticalMargin(this.opts.verticalMargin, true);

    this.$el.addClass(this.opts._class);

    this._setStaticClass();

    if (isNested) {
      this.$el.addClass('grid-stack-nested');
    }

    this._initStyles();

    this.engine = new GridStackEngine(this.opts.column, function(nodes, detachNode) {
      detachNode = (detachNode === undefined ? true : detachNode);
      var maxHeight = 0;
      this.nodes.forEach(function(n) {
        maxHeight = Math.max(maxHeight, n.y + n.height);
      });
      nodes.forEach(function(n) {
        if (detachNode && n._id === null) {
          if (n.el) {
            $(n.el).remove();
          }
        } else {
          $(n.el)
            .attr('data-gs-x', n.x)
            .attr('data-gs-y', n.y)
            .attr('data-gs-width', n.width)
            .attr('data-gs-height', n.height);
        }
      });
      self._updateStyles(maxHeight + 10);
    }, this.opts.float, this.opts.maxRow);

    if (this.opts.auto) {
      var elements = [];
      var _this = this;
      this.$el.children('.' + this.opts.itemClass + ':not(.' + this.opts.placeholderClass + ')')
        .each(function(index, el) {
          el = $(el);
          var x = parseInt(el.attr('data-gs-x'));
          var y = parseInt(el.attr('data-gs-y'));
          elements.push({
            el: el.get(0),
            // if x,y are missing (autoPosition) add them to end of list - but keep their respective DOM order
            i: (Number.isNaN(x) ? 1000 : x) + (Number.isNaN(y) ? 1000 : y) * _this.opts.column
          });
        });
      Utils.sortBy(elements, function(x) { return x.i; }).forEach(function(item) {
        this._prepareElement(item.el);
      }, this);
    }
    this.engine._saveInitial(); // initial start of items

    this.setAnimation(this.opts.animate);

    this.placeholder = $(
      '<div class="' + this.opts.placeholderClass + ' ' + this.opts.itemClass + '">' +
      '<div class="placeholder-content">' + this.opts.placeholderText + '</div></div>').hide();

    this._updateContainerHeight();

    this._updateHeightsOnResize = Utils.throttle(function() {
      self.cellHeight(self.cellWidth(), false);
    }, 100);

    /**
     * called when we are being resized - check if the one Column Mode needs to be turned on/off
     * and remember the prev columns we used.
     */
    this.onResizeHandler = function() {
      if (isAutoCellHeight) {
        self._updateHeightsOnResize();
      }

      if (!self.opts.disableOneColumnMode && (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) <= self.opts.minWidth) {
        if (self.oneColumnMode) { return }
        self.oneColumnMode = true;
        self.column(1);
      } else {
        if (!self.oneColumnMode) { return }
        self.oneColumnMode = false;
        self.column(self._prevColumn);
      }
    };

    $(window).resize(this.onResizeHandler);
    this.onResizeHandler();

    if (!self.opts.staticGrid && typeof self.opts.removable === 'string') {
      var trashZone = $(self.opts.removable);
      if (!this.dd.isDroppable(trashZone)) {
        this.dd.droppable(trashZone, self.opts.removableOptions);
      }
      this.dd
        .on(trashZone, 'dropover', function(event, ui) {
          var el = $(ui.draggable);
          var node = el.data('_gridstack_node');
          if (!node || node._grid !== self) {
            return;
          }
          el.data('inTrashZone', true);
          self._setupRemovingTimeout(el);
        })
        .on(trashZone, 'dropout', function(event, ui) {
          var el = $(ui.draggable);
          var node = el.data('_gridstack_node');
          if (!node || node._grid !== self) {
            return;
          }
          el.data('inTrashZone', false);
          self._clearRemovingTimeout(el);
        });
    }

    if (!self.opts.staticGrid && self.opts.acceptWidgets) {
      var draggingElement = null;

      var onDrag = function(event, ui) {
        var el = draggingElement;
        var node = el.data('_gridstack_node');
        var pos = self.getCellFromPixel({left: event.pageX, top: event.pageY}, true);
        var x = Math.max(0, pos.x);
        var y = Math.max(0, pos.y);
        if (!node._added) {
          node._added = true;

          node.el = el.get(0);
          node.autoPosition = true;
          node.x = x;
          node.y = y;
          self.engine.cleanNodes();
          self.engine.beginUpdate(node);
          self.engine.addNode(node);

          self.$el.append(self.placeholder);
          self.placeholder
            .attr('data-gs-x', node.x)
            .attr('data-gs-y', node.y)
            .attr('data-gs-width', node.width)
            .attr('data-gs-height', node.height)
            .show();
          node.el = self.placeholder.get(0);
          node._beforeDragX = node.x;
          node._beforeDragY = node.y;

          self._updateContainerHeight();
        }
        if (!self.engine.canMoveNode(node, x, y)) {
          return;
        }
        self.engine.moveNode(node, x, y);
        self._updateContainerHeight();
      };

      this.dd
        .droppable(self.$el, {
          accept: function(el) {
            el = $(el);
            var node = el.data('_gridstack_node');
            if (node && node._grid === self) {
              return false;
            }
            return el.is(self.opts.acceptWidgets === true ? '.grid-stack-item' : self.opts.acceptWidgets);
          }
        })
        .on(self.$el, 'dropover', function(event, ui) {
          var el = $(ui.draggable);
          var width, height;

          // see if we already have a node with widget/height and check for attributes
          var origNode = el.data('_gridstack_node');
          if (!origNode || !origNode.width || !origNode.height) {
            var w = parseInt(el.attr('data-gs-width'));
            if (w > 0) { origNode = origNode || {}; origNode.width = w; }
            var h = parseInt(el.attr('data-gs-height'));
            if (h > 0) { origNode = origNode || {}; origNode.height = h; }
          }

          // if not calculate the grid size based on element outer size
          // height: Each row is cellHeight + verticalMargin, until last one which has no margin below
          var cellWidth = self.cellWidth();
          var cellHeight = self.cellHeight();
          var verticalMargin = self.opts.verticalMargin;
          width = origNode && origNode.width ? origNode.width : Math.ceil(el.outerWidth() / cellWidth);
          height = origNode && origNode.height ? origNode.height : Math.round((el.outerHeight() + verticalMargin) / (cellHeight + verticalMargin));

          draggingElement = el;

          var node = self.engine._prepareNode({width: width, height: height, _added: false, _temporary: true});
          node.isOutOfGrid = true;
          el.data('_gridstack_node', node);
          el.data('_gridstack_node_orig', origNode);

          el.on('drag', onDrag);
          return false; // prevent parent from receiving msg (which may be grid as well)
        })
        .on(self.$el, 'dropout', function(event, ui) {
          // jquery-ui bug. Must verify widget is being dropped out
          // check node variable that gets set when widget is out of grid
          var el = $(ui.draggable);
          if (!el.data('_gridstack_node')) {
            return;
          }
          var node = el.data('_gridstack_node');
          if (!node.isOutOfGrid) {
            return;
          }
          el.unbind('drag', onDrag);
          node.el = null;
          self.engine.removeNode(node);
          self.placeholder.detach();
          self._updateContainerHeight();
          el.data('_gridstack_node', el.data('_gridstack_node_orig'));
          return false; // prevent parent from receiving msg (which may be grid as well)
        })
        .on(self.$el, 'drop', function(event, ui) {
          self.placeholder.detach();

          var node = $(ui.draggable).data('_gridstack_node');
          node.isOutOfGrid = false;
          node._grid = self;
          var el = $(ui.draggable).clone(false);
          el.data('_gridstack_node', node);
          var originalNode = $(ui.draggable).data('_gridstack_node_orig');
          if (originalNode !== undefined && originalNode._grid !== undefined) {
            originalNode._grid._triggerRemoveEvent();
          }
          $(ui.helper).remove();
          node.el = el.get(0);
          self.placeholder.hide();
          Utils.removePositioningStyles(el);
          el.find('div.ui-resizable-handle').remove();

          el
            .attr('data-gs-x', node.x)
            .attr('data-gs-y', node.y)
            .attr('data-gs-width', node.width)
            .attr('data-gs-height', node.height)
            .addClass(self.opts.itemClass)
            .enableSelection()
            .removeData('draggable')
            .removeClass('ui-draggable ui-draggable-dragging ui-draggable-disabled')
            .unbind('drag', onDrag);
          self.$el.append(el);
          self._prepareElementsByNode(el, node);
          self._updateContainerHeight();
          self.engine._addedNodes.push(node);
          self._triggerAddEvent();
          self._triggerChangeEvent();

          self.engine.endUpdate();
          $(ui.draggable).unbind('drag', onDrag);
          $(ui.draggable).removeData('_gridstack_node');
          $(ui.draggable).removeData('_gridstack_node_orig');
          self.$el.trigger('dropped', [originalNode, node]);
          return false; // prevent parent from receiving msg (which may be grid as well)
        });
    }
  };

  GridStack.prototype._triggerChangeEvent = function(/*forceTrigger*/) {
    if (this.engine._batchMode) { return; }
    var elements = this.engine.getDirtyNodes(true); // verify they really changed
    if (elements && elements.length) {
      this.engine._layoutsNodesChange(elements);
      this._triggerEvent('change', elements);
    }
    this.engine._saveInitial(); // we called, now reset initial values & dirty flags
  };

  GridStack.prototype._triggerAddEvent = function() {
    if (this.engine._batchMode) { return; }
    if (this.engine._addedNodes && this.engine._addedNodes.length > 0) {
      this.engine._layoutsNodesChange(this.engine._addedNodes);
      // prevent added nodes from also triggering 'change' event (which is called next)
      this.engine._addedNodes.forEach(function (n) { delete n._dirty; });
      this._triggerEvent('added', this.engine._addedNodes);
      this.engine._addedNodes = [];
    }
  };

  GridStack.prototype._triggerRemoveEvent = function() {
    if (this.engine._batchMode) { return; }
    if (this.engine._removedNodes && this.engine._removedNodes.length > 0) {
      this._triggerEvent('removed', this.engine._removedNodes);
      this.engine._removedNodes = [];
    }
  };

  GridStack.prototype._triggerEvent = function(name, data) {
    var event = new CustomEvent(name, {detail: data});
    this.el.dispatchEvent(event);
  };

  GridStack.prototype._initStyles = function() {
    if (this._stylesId) {
      Utils.removeStylesheet(this._stylesId);
    }
    this._stylesId = 'gridstack-style-' + (Math.random() * 100000).toFixed();
    var styleLocation = this.opts.styleInHead ? undefined : this.el.parentNode
    // if styleInHead === false insert style to parent to support WebComponent
    this._styles = Utils.createStylesheet(this._stylesId, styleLocation);
    if (this._styles !== null) {
      this._styles._max = 0;
    }
  };

  GridStack.prototype._updateStyles = function(maxHeight) {
    if (this._styles === null || this._styles === undefined) {
      return;
    }

    var prefix = '.' + this.opts._class + ' .' + this.opts.itemClass;
    var self = this;
    var getHeight;

    if (maxHeight === undefined) {
      maxHeight = this._styles._max;
    }

    this._initStyles();
    this._updateContainerHeight();
    if (!this.opts.cellHeight) { // The rest will be handled by CSS
      return ;
    }
    if (this._styles._max !== 0 && maxHeight <= this._styles._max) { // Keep this._styles._max increasing
      return ;
    }

    if (!this.opts.verticalMargin || this.opts.cellHeightUnit === this.opts.verticalMarginUnit) {
      getHeight = function(nbRows, nbMargins) {
        return (self.opts.cellHeight * nbRows + self.opts.verticalMargin * nbMargins) +
          self.opts.cellHeightUnit;
      };
    } else {
      getHeight = function(nbRows, nbMargins) {
        if (!nbRows || !nbMargins) {
          return (self.opts.cellHeight * nbRows + self.opts.verticalMargin * nbMargins) +
            self.opts.cellHeightUnit;
        }
        return 'calc(' + ((self.opts.cellHeight * nbRows) + self.opts.cellHeightUnit) + ' + ' +
          ((self.opts.verticalMargin * nbMargins) + self.opts.verticalMarginUnit) + ')';
      };
    }

    if (this._styles._max === 0) {
      Utils.insertCSSRule(this._styles, prefix, 'min-height: ' + getHeight(1, 0) + ';', 0);
    }

    if (maxHeight > this._styles._max) {
      for (var i = this._styles._max; i < maxHeight; ++i) {
        Utils.insertCSSRule(this._styles,
          prefix + '[data-gs-height="' + (i + 1) + '"]',
          'height: ' + getHeight(i + 1, i) + ';',
          i
        );
        Utils.insertCSSRule(this._styles,
          prefix + '[data-gs-min-height="' + (i + 1) + '"]',
          'min-height: ' + getHeight(i + 1, i) + ';',
          i
        );
        Utils.insertCSSRule(this._styles,
          prefix + '[data-gs-max-height="' + (i + 1) + '"]',
          'max-height: ' + getHeight(i + 1, i) + ';',
          i
        );
        Utils.insertCSSRule(this._styles,
          prefix + '[data-gs-y="' + i + '"]',
          'top: ' + getHeight(i, i) + ';',
          i
        );
      }
      this._styles._max = maxHeight;
    }
  };

  GridStack.prototype._updateContainerHeight = function() {
    if (this.engine._batchMode) { return; }
    var row = this.engine.getRow();
    if (row < this.opts.minRow) {
      row = this.opts.minRow;
    }
    // check for css min height. Each row is cellHeight + verticalMargin, until last one which has no margin below
    var cssMinHeight = parseInt(this.$el.css('min-height'));
    if (cssMinHeight > 0) {
      var verticalMargin = this.opts.verticalMargin;
      var minRow =  Math.round((cssMinHeight + verticalMargin) / (this.cellHeight() + verticalMargin));
      if (row < minRow) {
        row = minRow;
      }
    }
    this.$el.attr('data-gs-current-row', row);
    if (!this.opts.cellHeight) {
      return ;
    }
    if (!this.opts.verticalMargin) {
      this.$el.css('height', (row * (this.opts.cellHeight)) + this.opts.cellHeightUnit);
    } else if (this.opts.cellHeightUnit === this.opts.verticalMarginUnit) {
      this.$el.css('height', (row * (this.opts.cellHeight + this.opts.verticalMargin) -
        this.opts.verticalMargin) + this.opts.cellHeightUnit);
    } else {
      this.$el.css('height', 'calc(' + ((row * (this.opts.cellHeight)) + this.opts.cellHeightUnit) +
        ' + ' + ((row * (this.opts.verticalMargin - 1)) + this.opts.verticalMarginUnit) + ')');
    }
  };

  GridStack.prototype._setupRemovingTimeout = function(el) {
    var self = this;
    var node = $(el).data('_gridstack_node');

    if (node._removeTimeout || !self.opts.removable) {
      return;
    }
    node._removeTimeout = setTimeout(function() {
      el.addClass('grid-stack-item-removing');
      node._isAboutToRemove = true;
    }, self.opts.removeTimeout);
  };

  GridStack.prototype._clearRemovingTimeout = function(el) {
    var node = $(el).data('_gridstack_node');

    if (!node._removeTimeout) {
      return;
    }
    clearTimeout(node._removeTimeout);
    node._removeTimeout = null;
    el.removeClass('grid-stack-item-removing');
    node._isAboutToRemove = false;
  };

  GridStack.prototype._prepareElementsByNode = function(el, node) {
    var self = this;

    var cellWidth;
    var cellFullHeight; // internal cellHeight + v-margin

    var dragOrResize = function(event, ui) {
      var x = Math.round(ui.position.left / cellWidth);
      var y = Math.floor((ui.position.top + cellFullHeight / 2) / cellFullHeight);
      var width;
      var height;

      if (event.type === 'drag') {
        var distance = ui.position.top - node._prevYPix;
        node._prevYPix = ui.position.top;
        Utils.updateScrollPosition(el[0], ui, distance);
        if (el.data('inTrashZone') || x < 0 || x >= self.engine.column || y < 0 ||
          (!self.engine.float && y > self.engine.getRow())) {
          if (!node._temporaryRemoved) {
            if (self.opts.removable === true) {
              self._setupRemovingTimeout(el);
            }

            x = node._beforeDragX;
            y = node._beforeDragY;

            self.placeholder.detach();
            self.placeholder.hide();
            self.engine.removeNode(node);
            self._updateContainerHeight();

            node._temporaryRemoved = true;
          } else {
            return;
          }
        } else {
          self._clearRemovingTimeout(el);

          if (node._temporaryRemoved) {
            self.engine.addNode(node);
            self.placeholder
              .attr('data-gs-x', x)
              .attr('data-gs-y', y)
              .attr('data-gs-width', width)
              .attr('data-gs-height', height)
              .show();
            self.$el.append(self.placeholder);
            node.el = self.placeholder.get(0);
            node._temporaryRemoved = false;
          }
        }
      } else if (event.type === 'resize')  {
        if (x < 0) return;
        width = Math.round(ui.size.width / cellWidth);
        height = Math.round((ui.size.height + self.verticalMargin()) / cellFullHeight);
      }
      // width and height are undefined if not resizing
      var lastTriedWidth = width !== undefined ? width : node.lastTriedWidth;
      var lastTriedHeight = height !== undefined ? height : node.lastTriedHeight;
      if (!self.engine.canMoveNode(node, x, y, width, height) ||
        (node.lastTriedX === x && node.lastTriedY === y &&
        node.lastTriedWidth === lastTriedWidth && node.lastTriedHeight === lastTriedHeight)) {
        return;
      }
      node.lastTriedX = x;
      node.lastTriedY = y;
      node.lastTriedWidth = width;
      node.lastTriedHeight = height;
      self.engine.moveNode(node, x, y, width, height);
      self._updateContainerHeight();

      if (event.type === 'resize')  {
        $(event.target).trigger('gsresize', node);
      }
    };

    var onStartMoving = function(event, ui) {
      self.$el.append(self.placeholder);
      var o = $(this);
      self.engine.cleanNodes();
      self.engine.beginUpdate(node);
      cellWidth = self.cellWidth();
      var strictCellHeight = self.cellHeight(); // heigh without v-margin
      // compute height with v-margin (Note: we add 1 margin as last row is missing it)
      cellFullHeight = (self.$el.height() + self.verticalMargin()) / parseInt(self.$el.attr('data-gs-current-row'));
      self.placeholder
        .attr('data-gs-x', o.attr('data-gs-x'))
        .attr('data-gs-y', o.attr('data-gs-y'))
        .attr('data-gs-width', o.attr('data-gs-width'))
        .attr('data-gs-height', o.attr('data-gs-height'))
        .show();
      node.el = self.placeholder.get(0);
      node._beforeDragX = node.x;
      node._beforeDragY = node.y;
      node._prevYPix = ui.position.top;
      var minHeight = (node.minHeight || 1);
      var verticalMargin = self.opts.verticalMargin;

      // mineHeight - Each row is cellHeight + verticalMargin, until last one which has no margin below
      self.dd.resizable(el, 'option', 'minWidth', cellWidth * (node.minWidth || 1));
      self.dd.resizable(el, 'option', 'minHeight', (strictCellHeight * minHeight) + (minHeight - 1) * verticalMargin);

      if (event.type === 'resizestart') {
        o.find('.grid-stack-item').trigger('resizestart');
      }
    };

    var onEndMoving = function(event, ui) {
      var o = $(this);
      if (!o.data('_gridstack_node')) {
        return;
      }

      // var forceNotify = false; what is the point of calling 'change' event with no data, when the 'removed' event is already called ?
      self.placeholder.detach();
      node.el = o.get(0);
      self.placeholder.hide();

      if (node._isAboutToRemove) {
        // forceNotify = true;
        var gridToNotify = el.data('_gridstack_node')._grid;
        gridToNotify._triggerRemoveEvent();
        el.removeData('_gridstack_node');
        el.remove();
      } else {
        self._clearRemovingTimeout(el);
        if (!node._temporaryRemoved) {
          Utils.removePositioningStyles(o);
          o
            .attr('data-gs-x', node.x)
            .attr('data-gs-y', node.y)
            .attr('data-gs-width', node.width)
            .attr('data-gs-height', node.height);
        } else {
          Utils.removePositioningStyles(o);
          o
            .attr('data-gs-x', node._beforeDragX)
            .attr('data-gs-y', node._beforeDragY)
            .attr('data-gs-width', node.width)
            .attr('data-gs-height', node.height);
          node.x = node._beforeDragX;
          node.y = node._beforeDragY;
          node._temporaryRemoved = false;
          self.engine.addNode(node);
        }
      }
      self._updateContainerHeight();
      self._triggerChangeEvent(/*forceNotify*/);

      self.engine.endUpdate();

      var nestedGrids = o.find('.grid-stack');
      if (nestedGrids.length && event.type === 'resizestop') {
        nestedGrids.each(function(index, el) {
          el.gridstack.onResizeHandler();
        });
        o.find('.grid-stack-item').trigger('resizestop');
        o.find('.grid-stack-item').trigger('gsresizestop');
      }
      if (event.type === 'resizestop') {
        self.$el.trigger('gsresizestop', o);
      }
    };

    this.dd
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

    if (node.noMove || this.opts.disableDrag || this.opts.staticGrid) {
      this.dd.draggable(el, 'disable');
    }

    if (node.noResize || this.opts.disableResize || this.opts.staticGrid) {
      this.dd.resizable(el, 'disable');
    }

    this._writeAttr(el, node);
  };

  GridStack.prototype._prepareElement = function(el, triggerAddEvent) {
    triggerAddEvent = triggerAddEvent !== undefined ? triggerAddEvent : false;
    var self = this;
    el = $(el);

    el.addClass(this.opts.itemClass);
    var node = this._readAttr(el, {el: el.get(0), _grid: self});
    node = self.engine.addNode(node, triggerAddEvent);
    el.data('_gridstack_node', node);

    this._prepareElementsByNode(el, node);
  };

  /** call to write any default attributes back to element */
  GridStack.prototype._writeAttr = function(el, node) {
    if (!node) { return; }
    el = $(el);
    // Note: passing null removes the attr in jquery
    if (node.x !== undefined) { el.attr('data-gs-x', node.x); }
    if (node.y !== undefined) { el.attr('data-gs-y', node.y); }
    if (node.width !== undefined) { el.attr('data-gs-width', node.width); }
    if (node.height !== undefined) { el.attr('data-gs-height', node.height); }
    if (node.autoPosition !== undefined) { el.attr('data-gs-auto-position', node.autoPosition ? true : null); }
    if (node.minWidth !== undefined) { el.attr('data-gs-min-width', node.minWidth); }
    if (node.maxWidth !== undefined) { el.attr('data-gs-max-width', node.maxWidth); }
    if (node.minHeight !== undefined) { el.attr('data-gs-min-height', node.minHeight); }
    if (node.maxHeight !== undefined) { el.attr('data-gs-max-height', node.maxHeight); }
    if (node.noResize !== undefined) { el.attr('data-gs-no-resize', node.noResize ? true : null); }
    if (node.noMove !== undefined) { el.attr('data-gs-no-move', node.noMove ? true : null); }
    if (node.locked !== undefined) { el.attr('data-gs-locked', node.locked ? true : null); }
    if (node.resizeHandles !== undefined) { el.attr('data-gs-resize-handles', node.resizeHandles); }
    if (node.id !== undefined) { el.attr('data-gs-id', node.id); }
  };

  /** call to read any default attributes back to element */
  GridStack.prototype._readAttr = function(el, node) {
    el = $(el);
    node = node || {};
    node.x = el.attr('data-gs-x');
    node.y = el.attr('data-gs-y');
    node.width = el.attr('data-gs-width');
    node.height = el.attr('data-gs-height');
    node.autoPosition = Utils.toBool(el.attr('data-gs-auto-position'));
    node.maxWidth = el.attr('data-gs-max-width');
    node.minWidth = el.attr('data-gs-min-width');
    node.maxHeight = el.attr('data-gs-max-height');
    node.minHeight = el.attr('data-gs-min-height');
    node.noResize = Utils.toBool(el.attr('data-gs-no-resize'));
    node.noMove = Utils.toBool(el.attr('data-gs-no-move'));
    node.locked = Utils.toBool(el.attr('data-gs-locked'));
    node.resizeHandles = el.attr('data-gs-resize-handles');
    node.id = el.attr('data-gs-id');
    return node;
  };

  GridStack.prototype.setAnimation = function(enable) {
    if (enable) {
      this.$el.addClass('grid-stack-animate');
    } else {
      this.$el.removeClass('grid-stack-animate');
    }
  };

  GridStack.prototype.addWidget = function(el, opt, y, width, height, autoPosition, minWidth, maxWidth, minHeight, maxHeight, id) {

    // new way of calling with an object - make sure all items have been properly initialized
    if (opt === undefined || typeof opt === 'object') {
      // Tempting to initialize the passed in opt with default and valid values, but this break knockout demos
      // as the actual value are filled in when _prepareElement() calls el.attr('data-gs-xyz) before adding the node.
      // opt = this.engine._prepareNode(opt);
    } else {
      // old legacy way of calling with items spelled out - call us back with single object instead (so we can properly initialized values)
      return this.addWidget(el, {x: opt, y: y, width: width, height: height, autoPosition: autoPosition,
        minWidth: minWidth, maxWidth: maxWidth, minHeight: minHeight, maxHeight: maxHeight, id: id});
    }

    el = $(el);
    if (opt) { // see knockout above
      // make sure we load any DOM attributes that are not specified in passed in options (which override)
      var domAttr = this._readAttr(el);
      Utils.defaults(opt, domAttr);
      this.engine._prepareNode(opt);
    }
    this._writeAttr(el, opt);
    this.$el.append(el);
    return this.makeWidget(el);
  };

  GridStack.prototype.makeWidget = function(el) {
    el = $(el);
    this._prepareElement(el, true);
    this._updateContainerHeight();
    this._triggerAddEvent();
    this._triggerChangeEvent(true); // trigger any other changes

    return el.get(0);
  };

  GridStack.prototype.willItFit = function(x, y, width, height, autoPosition) {
    var node = {x: x, y: y, width: width, height: height, autoPosition: autoPosition};
    return this.engine.canBePlacedWithRespectToHeight(node);
  };

  GridStack.prototype.removeWidget = function(el, detachNode) {
    el = $(el);
    var node = el.data('_gridstack_node');
    // For Meteor support: https://github.com/gridstack/gridstack.js/pull/272
    if (!node) {
      node = this.engine.getNodeDataByDOMEl(el.get(0));
    }
    if (!node || node.el.parentElement !== this.el) return; // not our child!
    // remove our DOM data (circular link) and drag&drop permanently
    el.removeData('_gridstack_node');
    this.dd.draggable(el, 'destroy').resizable(el, 'destroy');

    this.engine.removeNode(node, detachNode);
    this._triggerRemoveEvent();
    this._triggerChangeEvent(true); // trigger any other changes
  };

  GridStack.prototype.removeAll = function(detachNode) {
    // always remove our DOM data (circular link) before list gets emptied and drag&drop permanently
    this.engine.nodes.forEach(function(node) {
      var el = $(node.el);
      el.removeData('_gridstack_node');
      this.dd.draggable(el, 'destroy').resizable(el, 'destroy');
    }, this);

    this.engine.removeAll(detachNode);
    this._triggerRemoveEvent();
  };

  GridStack.prototype.destroy = function(detachGrid) {
    $(window).off('resize', this.onResizeHandler);
    if (detachGrid === false) {
      this.removeAll(false);
      this.$el.removeClass(this.opts._class);
      delete this.$el.get(0).gridstack;
    } else {
      this.$el.remove();
    }
    Utils.removeStylesheet(this._stylesId);
    if (this.engine) {
      this.engine = null;
    }
  };

  GridStack.prototype.resizable = function(el, val) {
    var self = this;
    el = $(el);
    el.each(function(index, el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      if (!node) { return; }
      node.noResize = !(val || false);
      if (node.noResize) {
        self.dd.resizable(el, 'disable');
      } else {
        self.dd.resizable(el, 'enable');
      }
    });
    return this;
  };

  GridStack.prototype.movable = function(el, val) {
    var self = this;
    el = $(el);
    el.each(function(index, el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      if (!node) { return; }
      node.noMove = !(val || false);
      if (node.noMove) {
        self.dd.draggable(el, 'disable');
        el.removeClass('ui-draggable-handle');
      } else {
        self.dd.draggable(el, 'enable');
        el.addClass('ui-draggable-handle');
      }
    });
    return this;
  };

  GridStack.prototype.enableMove = function(doEnable, includeNewWidgets) {
    this.movable(this.$el.children('.' + this.opts.itemClass), doEnable);
    if (includeNewWidgets) {
      this.opts.disableDrag = !doEnable;
    }
  };

  GridStack.prototype.enableResize = function(doEnable, includeNewWidgets) {
    this.resizable(this.$el.children('.' + this.opts.itemClass), doEnable);
    if (includeNewWidgets) {
      this.opts.disableResize = !doEnable;
    }
  };

  GridStack.prototype.disable = function() {
    this.movable(this.$el.children('.' + this.opts.itemClass), false);
    this.resizable(this.$el.children('.' + this.opts.itemClass), false);
    this.$el.trigger('disable');
  };

  GridStack.prototype.enable = function() {
    this.movable(this.$el.children('.' + this.opts.itemClass), true);
    this.resizable(this.$el.children('.' + this.opts.itemClass), true);
    this.$el.trigger('enable');
  };

  GridStack.prototype.locked = function(el, val) {
    el = $(el);
    el.each(function(index, el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      if (!node) { return; }
      node.locked = (val || false);
      el.attr('data-gs-locked', node.locked ? 'yes' : null);
    });
    return this;
  };

  GridStack.prototype.maxHeight = function(el, val) {
    el = $(el);
    el.each(function(index, el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      if (!node) { return; }
      if (!isNaN(val)) {
        node.maxHeight = (val || false);
        el.attr('data-gs-max-height', val);
      }
    });
    return this;
  };

  GridStack.prototype.minHeight = function(el, val) {
    el = $(el);
    el.each(function(index, el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      if (!node) { return; }
      if (!isNaN(val)) {
        node.minHeight = (val || false);
        el.attr('data-gs-min-height', val);
      }
    });
    return this;
  };

  GridStack.prototype.maxWidth = function(el, val) {
    el = $(el);
    el.each(function(index, el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      if (!node) { return; }
      if (!isNaN(val)) {
        node.maxWidth = (val || false);
        el.attr('data-gs-max-width', val);
      }
    });
    return this;
  };

  GridStack.prototype.minWidth = function(el, val) {
    el = $(el);
    el.each(function(index, el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      if (!node) { return; }
      if (!isNaN(val)) {
        node.minWidth = (val || false);
        el.attr('data-gs-min-width', val);
      }
    });
    return this;
  };

  GridStack.prototype._updateElement = function(el, callback) {
    el = $(el).first();
    var node = el.data('_gridstack_node');
    if (!node) { return; }
    var self = this;

    self.engine.cleanNodes();
    self.engine.beginUpdate(node);

    callback.call(this, el, node);

    self._updateContainerHeight();
    self._triggerChangeEvent();

    self.engine.endUpdate();
  };

  GridStack.prototype.resize = function(el, width, height) {
    this._updateElement(el, function(el, node) {
      width = (width !== null && width !== undefined) ? width : node.width;
      height = (height !== null && height !== undefined) ? height : node.height;

      this.engine.moveNode(node, node.x, node.y, width, height);
    });
  };

  GridStack.prototype.move = function(el, x, y) {
    this._updateElement(el, function(el, node) {
      x = (x !== null && x !== undefined) ? x : node.x;
      y = (y !== null && y !== undefined) ? y : node.y;

      this.engine.moveNode(node, x, y, node.width, node.height);
    });
  };

  GridStack.prototype.update = function(el, x, y, width, height) {
    this._updateElement(el, function(el, node) {
      x = (x !== null && x !== undefined) ? x : node.x;
      y = (y !== null && y !== undefined) ? y : node.y;
      width = (width !== null && width !== undefined) ? width : node.width;
      height = (height !== null && height !== undefined) ? height : node.height;

      this.engine.moveNode(node, x, y, width, height);
    });
  };

  /**
   * relayout grid items to reclaim any empty space
   */
  GridStack.prototype.compact = function() {
    if (this.engine.nodes.length === 0) { return; }
    this.batchUpdate();
    this.engine._sortNodes();
    var nodes = this.engine.nodes;
    this.engine.nodes = []; // pretend we have no nodes to conflict layout to start with...
    nodes.forEach(function(node) {
      if (!node.noMove && !node.locked) {
        node.autoPosition = true;
      }
      this.engine.addNode(node, false); // 'false' for add event trigger
      node._dirty = true; // force attr update
    }, this);
    this.commit();
  };

  GridStack.prototype.verticalMargin = function(val, noUpdate) {
    if (val === undefined) {
      return this.opts.verticalMargin;
    }

    var heightData = Utils.parseHeight(val);

    if (this.opts.verticalMarginUnit === heightData.unit && this.opts.maxRow === heightData.height) {
      return ;
    }
    this.opts.verticalMarginUnit = heightData.unit;
    this.opts.verticalMargin = heightData.height;

    if (!noUpdate) {
      this._updateStyles();
    }
  };

  /** set/get the current cell height value */
  GridStack.prototype.cellHeight = function(val, noUpdate) {
    // getter - returns the opts stored height else compute it...
    if (val === undefined) {
      if (this.opts.cellHeight && this.opts.cellHeight !== 'auto') {
        return this.opts.cellHeight;
      }
      // compute the height taking margin into account (each row has margin other than last one)
      var o = this.$el.children('.' + this.opts.itemClass).first();
      var height = o.attr('data-gs-height');
      var verticalMargin = this.opts.verticalMargin;
      return Math.round((o.outerHeight() - (height - 1) * verticalMargin) / height);
    }

    // setter - updates the cellHeight value if they changed
    var heightData = Utils.parseHeight(val);
    if (this.opts.cellHeightUnit === heightData.unit && this.opts.cellHeight === heightData.height) {
      return ;
    }
    this.opts.cellHeightUnit = heightData.unit;
    this.opts.cellHeight = heightData.height;

    if (!noUpdate) {
      this._updateStyles();
    }
  };

  GridStack.prototype.cellWidth = function() {
    // TODO: take margin into account ($horizontal_padding in .scss) to make cellHeight='auto' square ? (see 810-many-columns.html)
    return Math.round(this.$el.outerWidth() / this.opts.column);
  };

  GridStack.prototype.getCellFromPixel = function(position, useOffset) {
    var containerPos = (useOffset !== undefined && useOffset) ?
      this.$el.offset() : this.$el.position();
    var relativeLeft = position.left - containerPos.left;
    var relativeTop = position.top - containerPos.top;

    var columnWidth = Math.floor(this.$el.width() / this.opts.column);
    var rowHeight = Math.floor(this.$el.height() / parseInt(this.$el.attr('data-gs-current-row')));

    return {x: Math.floor(relativeLeft / columnWidth), y: Math.floor(relativeTop / rowHeight)};
  };

  GridStack.prototype.batchUpdate = function() {
    this.engine.batchUpdate();
  };

  GridStack.prototype.commit = function() {
    this.engine.commit();
    this._triggerRemoveEvent();
    this._triggerAddEvent();
    this._triggerChangeEvent();
  };

  GridStack.prototype.isAreaEmpty = function(x, y, width, height) {
    return this.engine.isAreaEmpty(x, y, width, height);
  };

  GridStack.prototype.setStatic = function(staticValue) {
    this.opts.staticGrid = (staticValue === true);
    this.enableMove(!staticValue);
    this.enableResize(!staticValue);
    this._setStaticClass();
  };

  GridStack.prototype._setStaticClass = function() {
    var staticClassName = 'grid-stack-static';

    if (this.opts.staticGrid === true) {
      this.$el.addClass(staticClassName);
    } else {
      this.$el.removeClass(staticClassName);
    }
  };

  /** called whenever a node is added or moved - updates the cached layouts */
  GridStackEngine.prototype._layoutsNodesChange = function(nodes) {
    if (!this._layouts || this._ignoreLayoutsNodeChange) return;
    // remove smaller layouts - we will re-generate those on the fly... larger ones need to update
    this._layouts.forEach(function(layout, column) {
      if (!layout || column === this.column) return;
      if (column < this.column) {
        this._layouts[column] = undefined;
      }
      else {
        // we save the original x,y,w (h isn't cached) to see what actually changed to propagate better.
        // Note: we don't need to check against out of bound scaling/moving as that will be done when using those cache values.
        nodes.forEach(function(node) {
          var n = layout.find(function(l) { return l._id === node._id });
          if (!n) return; // no cache for new nodes. Will use those values.
          var ratio = column / this.column;
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
        }, this);
      }
    }, this);
  }

  /**
   * Called to scale the widget width & position up/down based on the column change.
   * Note we store previous layouts (especially original ones) to make it possible to go
   * from say 12 -> 1 -> 12 and get back to where we were.
   *
   * oldColumn: previous number of columns
   * column:    new column number
   * nodes?:    different sorted list (ex: DOM order) instead of current list
   */
  GridStackEngine.prototype._updateNodeWidths = function(oldColumn, column, nodes) {
    if (!this.nodes.length || oldColumn === column) { return; }

    // cache the current layout in case they want to go back (like 12 -> 1 -> 12) as it requires original data
    var copy = [this.nodes.length];
    this.nodes.forEach(function(n, i) {copy[i] = {x: n.x, y: n.y, width: n.width, _id: n._id}}); // only thing we change is x,y,w and id to find it back
    this._layouts = this._layouts || []; // use array to find larger quick
    this._layouts[oldColumn] = copy;

    // if we're going to 1 column and using DOM order rather than default sorting, then generate that layout
    if (column === 1 && nodes && nodes.length) {
      var top = 0;
      nodes.forEach(function(n) {
        n.x = 0;
        n.width = 1;
        n.y = Math.max(n.y, top);
        top = n.y + n.height;
      });
    } else {
      nodes = Utils.sort(this.nodes, -1, oldColumn); // current column reverse sorting so we can insert last to front (limit collision)
    }

    // see if we have cached previous layout.
    var cacheNodes = this._layouts[column] || [];
    // if not AND we are going up in size start with the largest layout as down-scaling is more accurate
    var lastIndex = this._layouts.length - 1;
    if (cacheNodes.length === 0 && column > oldColumn && column < lastIndex) {
      cacheNodes = this._layouts[lastIndex] || [];
      if (cacheNodes.length) {
        // pretend we came from that larger column by assigning those values as starting point
        oldColumn = lastIndex;
        cacheNodes.forEach(function(cacheNode) {
          var j = nodes.findIndex(function(n) {return n && n._id === cacheNode._id});
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
    var newNodes = [];
    cacheNodes.forEach(function(cacheNode) {
      var j = nodes.findIndex(function(n) {return n && n._id === cacheNode._id});
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
    var ratio = column / oldColumn;
    nodes.forEach(function(node) {
      if (!node) return;
      node.x = (column === 1 ? 0 : Math.round(node.x * ratio));
      node.width = ((column === 1 || oldColumn === 1) ? 1 : (Math.round(node.width * ratio) || 1));
      newNodes.push(node);
    });

    // finally relayout them in reverse order (to get correct placement)
    newNodes = Utils.sort(newNodes, -1, column);
    this._ignoreLayoutsNodeChange = true;
    this.batchUpdate();
    this.nodes = []; // pretend we have no nodes to start with (we use same structures) to simplify layout
    newNodes.forEach(function(node) {
      this.addNode(node, false); // 'false' for add event trigger
      node._dirty = true; // force attr update
    }, this);
    this.commit();
    delete this._ignoreLayoutsNodeChange;
  }

  /** called to save initial position/size */
  GridStackEngine.prototype._saveInitial = function() {
    this.nodes.forEach(function(n) {
      n._origX = n.x;
      n._origY = n.y;
      n._origW = n.width;
      n._origH = n.height;
      delete n._dirty;
    });
  }

  /**
   * set/get number of columns in the grid. Will attempt to update existing widgets
   * to conform to new number of columns. Requires `gridstack-extra.css` or `gridstack-extra.min.css` for [2-11],
   * else you will need to generate correct CSS (see https://github.com/gridstack/gridstack.js#change-grid-columns)
   * @param column - Integer > 0 (default 12).
   * @param doNotPropagate if true existing widgets will not be updated (optional)
   */
  GridStack.prototype.column = function(column, doNotPropagate) {
    // getter - returns the opts stored mode
    if (column === undefined) {
      return this.opts.column;
    }
    // setter
    if (this.opts.column === column) { return; }
    var oldColumn = this.opts.column;

    // if we go into 1 column mode (which happens if we're sized less than minWidth unless disableOneColumnMode is on)
    // then remember the original columns so we can restore.
    if (column === 1) {
      this._prevColumn = oldColumn;
    } else {
      delete this._prevColumn;
    }

    this.$el.removeClass('grid-stack-' + oldColumn);
    this.$el.addClass('grid-stack-' + column);
    this.opts.column = this.engine.column = column;

    if (doNotPropagate === true) { return; }

    // update the items now - see if the dom order nodes should be passed instead (else default to current list)
    var domNodes;
    if (this.opts.oneColumnModeDomSort && column === 1) {
      domNodes = [];
      this.$el.children('.' + this.opts.itemClass).each(function(index, el) {
        var node = $(el).data('_gridstack_node');
        if (node) { domNodes.push(node); }
      });
      if (!domNodes.length) { domNodes = undefined; }
    }
    this.engine._updateNodeWidths(oldColumn, column, domNodes);

    // and trigger our event last...
    this.engine._ignoreLayoutsNodeChange = true;
    this._triggerChangeEvent();
    delete this.engine._ignoreLayoutsNodeChange;
  };

  GridStack.prototype.float = function(val) {
    // getter - returns the opts stored mode
    if (val === undefined) {
      return this.opts.float || false;
    }
    // setter - updates the mode and relayout if gravity is back on
    if (this.opts.float === val) { return; }
    this.opts.float = this.engine.float = val || false;
    if (!val) {
      this.engine._packNodes();
      this.engine._notify();
      this._triggerChangeEvent();
    }
  };

  GridStack.prototype.getRow = function() {
    return this.engine.getRow();
  }

  /** Event handler that extracts our CustomEvent data out automatically for receiving custom
   * notifications (see doc for supported events)
   */
  GridStack.prototype.on = function(eventName, callback) {
    // check for array of names being passed instead
    if (eventName.indexOf(' ') !== -1) {
      var names = eventName.split(' ');
      names.forEach(function(name) { this.on(name, callback) }, this);
      return;
    }

    if (eventName === 'change' || eventName === 'added' || eventName === 'removed') {
      // native CustomEvent handlers - cash the generic handlers so we can remove
      this._gsEventHandler = this._gsEventHandler || {};
      this._gsEventHandler[eventName] = function(event) { callback(event, event.detail) };
      this.el.addEventListener(eventName, this._gsEventHandler[eventName]);
    } else {
      // still JQuery events
      this.$el.on(eventName, callback);
    }
  }

  /** unsubscribe from the 'on' event */
  GridStack.prototype.off = function(eventName) {
    // check for array of names being passed instead
    if (eventName.indexOf(' ') !== -1) {
      var names = eventName.split(' ');
      names.forEach(function(name) { this.off(name, callback) }, this);
      return;
    }

    if (eventName === 'change' || eventName === 'added' || eventName === 'removed') {
      // remove native CustomEvent handlers
      if (this._gsEventHandler && this._gsEventHandler[eventName]) {
        this.el.removeEventListener(eventName, this._gsEventHandler[eventName]);
        delete this._gsEventHandler[eventName];
      }
    } else {
      // still JQuery events
      this.$el.off(eventName);
    }
  }

  // legacy method renames
  GridStack.prototype.setGridWidth = obsolete(GridStack.prototype.column, 'setGridWidth', 'column', 'v0.5.3');
  GridStack.prototype.setColumn = obsolete(GridStack.prototype.column, 'setColumn', 'column', 'v0.6.4');
  GridStackEngine.prototype.getGridHeight = obsolete(GridStackEngine.prototype.getRow, 'getGridHeight', 'getRow', 'v1.0.0');

  scope.GridStack = GridStack;
  scope.GridStack.Utils = Utils;
  scope.GridStack.Engine = GridStackEngine;
  scope.GridStack.DragDropPlugin = GridStackDragDropPlugin;

  /**
   * initializing the HTML element, or selector string, into a grid will return the grid. Calling it again will
   * simply return the existing instance (ignore any passed options).
   */
  GridStack.init = function(opts, elOrString) {
    if (!elOrString) { elOrString = '.grid-stack' }
    var el = $(elOrString).get(0);
    if (!el) return;
    if (!el.gridstack) {
      el.gridstack = new GridStack(el, Utils.clone(opts));
    }
    return el.gridstack
  };

  /**
   * Will initialize a list of elements (given a selector) and return an array of grids.
   */
  GridStack.initAll = function(opts, selector) {
    if (!selector) { selector = '.grid-stack' }
    var grids = [];
    $(selector).each(function(index, el) {
      if (!el.gridstack) {
        el.gridstack = new GridStack(el, Utils.clone(opts));
      }
      grids.push(el.gridstack);
    });
    return grids;
  };

  return scope.GridStack;
});
