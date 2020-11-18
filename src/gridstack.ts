// gridstack.ts 2.2.0-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/

import { GridStackEngine } from './gridstack-engine';
import { obsoleteOpts, obsoleteOptsDel, obsoleteAttr, obsolete, Utils, HeightData } from './utils';
import { GridItemHTMLElement, GridStackWidget, GridStackNode, GridStackOptions, numberOrString, ColumnOptions, DDUIData } from './types';
import { GridStackDD } from './gridstack-dd';

// export all dependent file as well to make it easier for users to just import the main file
export * from './types';
export * from './utils';
export * from './gridstack-engine';
export * from './gridstack-dd';

export type GridStackElement = string | HTMLElement | GridItemHTMLElement;

export interface GridHTMLElement extends HTMLElement {
  gridstack?: GridStack; // grid's parent DOM element points back to grid class
}
export type GridStackEvent = 'added' | 'change' | 'disable' | 'dragstart' | 'dragstop' | 'dropped' |
  'enable' | 'removed' | 'resizestart' | 'resizestop';

/** Defines the coordinates of an object */
export interface MousePosition {
  top: number;
  left: number;
}

/** Defines the position of a cell inside the grid*/
export interface CellPosition {
  x: number;
  y: number;
}

interface GridCSSStyleSheet extends CSSStyleSheet {
  _id?: string; // random id we will use to style us
  _max?: number; // internal tracker of the max # of rows we created\
}

/** current drag&drop plugin being used - first grid will initialize */
let dd: GridStackDD;

/**
 * Main gridstack class - you will need to call `GridStack.init()` first to initialize your grid.
 * Note: your grid elements MUST have the following classes for the CSS layout to work:
 * @example
 * <div class="grid-stack">
 *   <div class="grid-stack-item">
 *     <div class="grid-stack-item-content">Item 1</div>
 *   </div>
 * </div>
 */
export class GridStack {

  /**
   * initializing the HTML element, or selector string, into a grid will return the grid. Calling it again will
   * simply return the existing instance (ignore any passed options). There is also an initAll() version that support
   * multiple grids initialization at once.
   * @param options grid options (optional)
   * @param elOrString element or CSS selector (first one used) to convert to a grid (default to '.grid-stack' class selector)
   *
   * @example
   * let grid = GridStack.init();
   *
   * Note: the HTMLElement (of type GridHTMLElement) will store a `gridstack: GridStack` value that can be retrieve later
   * let grid = document.querySelector('.grid-stack').gridstack;
   */
  public static init(options: GridStackOptions = {}, elOrString: GridStackElement = '.grid-stack'): GridStack {
    let el = GridStack.getGridElement(elOrString);
    if (!el) {
      if (typeof elOrString === 'string') {
        console.error('GridStack.initAll() no grid was found with selector "' + elOrString + '" - element missing or wrong selector ?' +
        '\nNote: ".grid-stack" is required for proper CSS styling and drag/drop, and is the default selector.');
      } else {
        console.error('GridStack.init() no grid element was passed.');
      }
      return null;
    }
    if (!el.gridstack) {
      el.gridstack = new GridStack(el, Utils.clone(options));
    }
    return el.gridstack
  }

  /**
   * Will initialize a list of elements (given a selector) and return an array of grids.
   * @param options grid options (optional)
   * @param selector elements selector to convert to grids (default to '.grid-stack' class selector)
   *
   * @example
   * let grids = GridStack.initAll();
   * grids.forEach(...)
   */
  public static initAll(options: GridStackOptions = {}, selector = '.grid-stack'): GridStack[] {
    let grids: GridStack[] = [];
    GridStack.getGridElements(selector).forEach(el => {
      if (!el.gridstack) {
        el.gridstack = new GridStack(el, Utils.clone(options));
      }
      grids.push(el.gridstack);
    });
    if (grids.length === 0) {
      console.error('GridStack.initAll() no grid was found with selector "' + selector + '" - element missing or wrong selector ?' +
      '\nNote: ".grid-stack" is required for proper CSS styling and drag/drop, and is the default selector.');
    }
    return grids;
  }

  /** scoping so users can call GridStack.Utils.sort() for example */
  public static Utils = Utils;

  /** scoping so users can call new GridStack.Engine(12) for example */
  public static Engine = GridStackEngine;

  /** the HTML element tied to this grid after it's been initialized */
  public el: GridHTMLElement;

  /** engine used to implement non DOM grid functionality */
  public engine: GridStackEngine;

  /** grid options - public for classes to access, but use methods to modify! */
  public opts: GridStackOptions;

  /** @internal */
  private placeholder: HTMLElement;
  /** @internal */
  private _oneColumnMode: boolean;
  /** @internal */
  private _prevColumn: number;
  /** @internal */
  private _gsEventHandler = {};
  /** @internal */
  private _styles: GridCSSStyleSheet;
  /** @internal flag to keep cells square during resize */
  private _isAutoCellHeight: boolean;
  /** @internal track event binding to window resize so we can remove */
  private _windowResizeBind: () => GridStack;

  /**
   * Construct a grid item from the given element and options
   * @param el
   * @param opts
   */
  public constructor(el: GridHTMLElement, opts: GridStackOptions = {}) {
    this.el = el; // exposed HTML element to the user
    opts = opts || {}; // handles null/undefined/0

    obsoleteOpts(opts, 'width', 'column', 'v0.5.3');
    obsoleteOpts(opts, 'height', 'maxRow', 'v0.5.3');
    obsoleteOpts(opts, 'verticalMargin', 'margin', 'v2.0');
    obsoleteOptsDel(opts, 'oneColumnModeClass', 'v0.6.3', '. Use class `.grid-stack-1` instead');

    // container attributes
    obsoleteAttr(this.el, 'data-gs-width', 'data-gs-column', 'v0.5.3');
    obsoleteAttr(this.el, 'data-gs-height', 'data-gs-max-row', 'v0.5.3');
    obsoleteAttr(this.el, 'data-gs-current-height', 'data-gs-current-row', 'v1.0.0');

    // if row property exists, replace minRow and maxRow instead
    if (opts.row) {
      opts.minRow = opts.maxRow = opts.row;
      delete opts.row;
    }
    let rowAttr = Utils.toNumber(el.getAttribute('data-gs-row'));

    // elements attributes override any passed options (like CSS style) - merge the two together
    let defaults: GridStackOptions = {
      column: Utils.toNumber(el.getAttribute('data-gs-column')) || 12,
      minRow: rowAttr ? rowAttr : Utils.toNumber(el.getAttribute('data-gs-min-row')) || 0,
      maxRow: rowAttr ? rowAttr : Utils.toNumber(el.getAttribute('data-gs-max-row')) || 0,
      itemClass: 'grid-stack-item',
      placeholderClass: 'grid-stack-placeholder',
      placeholderText: '',
      handle: '.grid-stack-item-content',
      handleClass: null,
      styleInHead: false,
      cellHeight: 'auto',
      margin: 10,
      auto: true,
      minWidth: 768,
      float: false,
      staticGrid: Utils.toBool(el.getAttribute('data-gs-static-grid')) || false,
      _class: 'grid-stack-instance-' + (Math.random() * 10000).toFixed(0),
      animate: true,
      alwaysShowResizeHandle: opts.alwaysShowResizeHandle || false,
      resizable: {
        autoHide: !(opts.alwaysShowResizeHandle || false),
        handles: 'se'
      },
      draggable: {
        handle: (opts.handleClass ? '.' + opts.handleClass : (opts.handle ? opts.handle : '')) || '.grid-stack-item-content',
        scroll: false,
        appendTo: 'body'
      },
      dragIn: undefined,
      dragInOptions : {
        revert: 'invalid',
        handle: '.grid-stack-item-content',
        scroll: false,
        appendTo: 'body'
      },
      disableDrag: false,
      disableResize: false,
      rtl: 'auto',
      removable: false,
      removableOptions: {
        accept: '.' + (opts.itemClass || 'grid-stack-item')
      },
      removeTimeout: 2000,
      marginUnit: 'px',
      cellHeightUnit: 'px',
      disableOneColumnMode: false,
      oneColumnModeDomSort: false
    };
    if (el.getAttribute('data-gs-animate')) {
      defaults.animate = Utils.toBool(el.getAttribute('data-gs-animate'))
    }

    this.opts = Utils.defaults(opts, defaults);
    this.initMargin();

    dd = dd || new (GridStackDD.get())();

    if (this.opts.rtl === 'auto') {
      this.opts.rtl = el.style.direction === 'rtl';
    }

    if (this.opts.rtl) {
      this.el.classList.add('grid-stack-rtl');
    }

    this.opts._isNested = Utils.closestByClass(this.el, opts.itemClass) !== null;
    if (this.opts._isNested) {
      this.el.classList.add('grid-stack-nested');
    }

    this._isAutoCellHeight = (this.opts.cellHeight === 'auto');
    if (this._isAutoCellHeight) {
      // make the cell content square initially (will use resize event to keep it square)
      let marginDiff = - (this.opts.marginRight as number) - (this.opts.marginLeft as number)
        + (this.opts.marginTop as number) + (this.opts.marginBottom as number);
      this.cellHeight(this.cellWidth() + marginDiff, false);
    } else {
      this.cellHeight(this.opts.cellHeight, false);
    }

    this.el.classList.add(this.opts._class);

    this._setStaticClass();
    this._updateStyles();

    this.engine = new GridStackEngine(this.opts.column, (cbNodes, removeDOM = true) => {
      let maxHeight = 0;
      this.engine.nodes.forEach(n => { maxHeight = Math.max(maxHeight, n.y + n.height) });
      cbNodes.forEach(n => {
        let el = n.el;
        if (removeDOM && n._id === null) {
          if (el && el.parentNode) { el.parentNode.removeChild(el) }
        } else {
          this._writeAttrs(el, n.x, n.y, n.width, n.height);
        }
      });
      this._updateStyles(false, maxHeight); // false = don't recreate, just append if need be
    },
    this.opts.float,
    this.opts.maxRow);

    if (this.opts.auto) {
      let elements: {el: HTMLElement; i: number}[] = [];
      this.getGridItems().forEach(el => {
        let x = parseInt(el.getAttribute('data-gs-x'));
        let y = parseInt(el.getAttribute('data-gs-y'));
        elements.push({
          el,
          // if x,y are missing (autoPosition) add them to end of list - but keep their respective DOM order
          i: (Number.isNaN(x) ? 1000 : x) + (Number.isNaN(y) ? 1000 : y) * this.opts.column
        });
      });
      elements.sort(e => e.i).forEach(item => { this._prepareElement(item.el) });
    }
    this.engine.saveInitial(); // initial start of items

    this.setAnimation(this.opts.animate);

    let placeholderChild = document.createElement('div');
    placeholderChild.className = 'placeholder-content';
    placeholderChild.innerHTML = this.opts.placeholderText;
    this.placeholder = document.createElement('div');
    this.placeholder.classList.add(this.opts.placeholderClass, this.opts.itemClass);
    this.placeholder.appendChild(placeholderChild);

    this._updateContainerHeight();

    this.onParentResize();

    this._setupDragIn();
    this._setupRemoveDrop();
    this._setupAcceptWidget();
    this._updateWindowResizeEvent();
  }

  /**
   * add a new widget and returns it.
   *
   * Widget will be always placed even if result height is more than actual grid height.
   * You need to use willItFit method before calling addWidget for additional check.
   * See also `makeWidget()`.
   *
   * @example
   * let grid = GridStack.init();
   * grid.addWidget({width: 3, content: 'hello'});
   * grid.addWidget('<div class="grid-stack-item"><div class="grid-stack-item-content">hello</div></div>', {width: 3});
   *
   * @param el html element, or string definition, or GridStackWidget (which can have content string as well) to add
   * @param options widget position/size options (optional, and ignore if first param is already option) - see GridStackWidget
   */
  public addWidget(els?: GridStackWidget | GridStackElement, options?: GridStackWidget): GridItemHTMLElement {

    // support legacy call for now ?
    if (arguments.length > 2) {
      console.warn('gridstack.ts: `addWidget(el, x, y, width...)` is deprecated. Use `addWidget({x, y, width, content, ...})`. It will be removed soon');
      // eslint-disable-next-line prefer-rest-params
      let a = arguments, i = 1,
        opt: GridStackWidget = { x:a[i++], y:a[i++], width:a[i++], height:a[i++], autoPosition:a[i++],
          minWidth:a[i++], maxWidth:a[i++], minHeight:a[i++], maxHeight:a[i++], id:a[i++] };
      return this.addWidget(els, opt);
    }

    function isGridStackWidget(w: GridStackWidget): w is GridStackWidget { // https://medium.com/ovrsea/checking-the-type-of-an-object-in-typescript-the-type-guards-24d98d9119b0
      return w.x !== undefined || w.y !== undefined || w.width !== undefined || w.height !== undefined || w.content !== undefined ? true : false;
    }

    let el: HTMLElement;
    if (typeof els === 'string') {
      let doc = document.implementation.createHTMLDocument();
      doc.body.innerHTML = els;
      el = doc.body.children[0] as HTMLElement;
    } else if (arguments.length === 0 || arguments.length === 1 && isGridStackWidget(els)) {
      let content = els ? (els as GridStackWidget).content || '' : '';
      options = els;
      let doc = document.implementation.createHTMLDocument();
      doc.body.innerHTML = `<div class="grid-stack-item"><div class="grid-stack-item-content">${content}</div></div>`;
      el = doc.body.children[0] as HTMLElement;
    } else {
      el = els as HTMLElement;
    }

    // Tempting to initialize the passed in opt with default and valid values, but this break knockout demos
    // as the actual value are filled in when _prepareElement() calls el.getAttribute('data-gs-xyz) before adding the node.
    if (options) {
      options = {...options};  // make a copy before we modify in case caller re-uses it
      // make sure we load any DOM attributes that are not specified in passed in options (which override)
      let domAttr = this._readAttr(el);
      Utils.defaults(options, domAttr);
      this.engine.prepareNode(options);
      this._writeAttr(el, options);
    }

    this.el.appendChild(el);
    return this.makeWidget(el);
  }

  /** saves the current layout returning a list of widgets for serialization */
  public save(saveContent = true): GridStackWidget[] {
    let list = this.engine.save(saveContent);
    // check for HTML content as well
    if (saveContent) {
      list.forEach(n => {
        if (n.el) {
          let sub = n.el.querySelector('.grid-stack-item-content');
          n.content = sub ? sub.innerHTML : undefined;
          if (!n.content) delete n.content;
          delete n.el;
        }
      });
    }
    return list;
  }

  /**
   * load the widgets from a list. This will call update() on each (matching by id) or add/remove widgets that are not there.
   *
   * @param layout list of widgets definition to update/create
   * @param addAndRemove boolean (default true) or callback method can be passed to control if and how missing widgets can be added/removed, giving
   * the user control of insertion.
   *
   * @example
   * see http://gridstackjs.com/demo/serialization.html
   **/
  public load(layout: GridStackWidget[], addAndRemove: boolean | ((w: GridStackWidget, add: boolean) => void)  = true): GridStack {
    let items = GridStack.Utils.sort(layout);
    let removed: GridStackNode[] = [];
    this.batchUpdate();
    // see if any items are missing from new layout and need to be removed first
    if (addAndRemove) {
      let copyNodes = [...this.engine.nodes]; // don't loop through array you modify
      copyNodes.forEach(n => {
        let item = items.find(w => n.id === w.id);
        if (!item) {
          if (typeof(addAndRemove) === 'function') {
            addAndRemove(n, false);
          } else {
            removed.push(n); // batch keep track
            this.removeWidget(n.el, true, false);
          }
        }
      });
    }
    // now add/update the widgets
    items.forEach(w => {
      let item = this.engine.nodes.find(n => n.id === w.id);
      if (item) {
        this.update(item.el, w.x, w.y, w.width, w.height); // TODO: full update
      } else if (addAndRemove) {
        if (typeof(addAndRemove) === 'function') {
          addAndRemove(w, true);
        } else {
          this.addWidget(w);
        }
      }
    });
    this.engine.removedNodes = removed;
    this.commit();
    return this;
  }

  /**
   * Initializes batch updates. You will see no changes until `commit()` method is called.
   */
  public batchUpdate(): GridStack {
    this.engine.batchUpdate();
    return this;
  }

  /**
   * Gets current cell height.
   */
  public getCellHeight(forcePixel = false): number {
    if (this.opts.cellHeight && this.opts.cellHeight !== 'auto' &&
       (!forcePixel || !this.opts.cellHeightUnit || this.opts.cellHeightUnit === 'px')) {
      return this.opts.cellHeight as number;
    }
    // else get first cell height
    // or do entire grid and # of rows ? (this.el.getBoundingClientRect().height) / parseInt(this.el.getAttribute('data-gs-current-row'))
    let el = this.el.querySelector('.' + this.opts.itemClass) as HTMLElement;
    let height = Utils.toNumber(el.getAttribute('data-gs-height'));
    return Math.round(el.offsetHeight / height);
  }

  /**
   * Update current cell height - see `GridStackOptions.cellHeight` for format.
   * This method rebuilds an internal CSS style sheet.
   * Note: You can expect performance issues if call this method too often.
   *
   * @param val the cell height
   * @param update (Optional) if false, styles will not be updated
   *
   * @example
   * grid.cellHeight(grid.cellWidth() * 1.2);
   */
  public cellHeight(val: numberOrString, update = true): GridStack {
    let data = Utils.parseHeight(val);
    if (this.opts.cellHeightUnit === data.unit && this.opts.cellHeight === data.height) {
      return this;
    }
    this.opts.cellHeightUnit = data.unit;
    this.opts.cellHeight = data.height;

    if (update) {
      this._updateStyles(true); // true = force re-create
    }
    this._resizeNestedGrids(this.el);
    return this;
  }

  /**
   * Gets current cell width.
   */
  public cellWidth(): number {
    return this.el.offsetWidth / this.opts.column;
  }

  /**
   * Finishes batch updates. Updates DOM nodes. You must call it after batchUpdate.
   */
  public commit(): GridStack {
    this.engine.commit();
    this._triggerRemoveEvent();
    this._triggerAddEvent();
    this._triggerChangeEvent();
    return this;
  }

  /** re-layout grid items to reclaim any empty space */
  public compact(): GridStack {
    this.engine.compact();
    this._triggerChangeEvent();
    return this;
  }

  /**
   * set the number of columns in the grid. Will update existing widgets to conform to new number of columns,
   * as well as cache the original layout so you can revert back to previous positions without loss.
   * Requires `gridstack-extra.css` or `gridstack-extra.min.css` for [2-11],
   * else you will need to generate correct CSS (see https://github.com/gridstack/gridstack.js#change-grid-columns)
   * @param column - Integer > 0 (default 12).
   * @param layout specify the type of re-layout that will happen (position, size, etc...).
   * Note: items will never be outside of the current column boundaries. default (moveScale). Ignored for 1 column
   */
  public column(column: number, layout: ColumnOptions = 'moveScale'): GridStack {
    if (this.opts.column === column) { return this; }
    let oldColumn = this.opts.column;

    // if we go into 1 column mode (which happens if we're sized less than minWidth unless disableOneColumnMode is on)
    // then remember the original columns so we can restore.
    if (column === 1) {
      this._prevColumn = oldColumn;
    } else {
      delete this._prevColumn;
    }

    this.el.classList.remove('grid-stack-' + oldColumn);
    this.el.classList.add('grid-stack-' + column);
    this.opts.column = this.engine.column = column;

    // update the items now - see if the dom order nodes should be passed instead (else default to current list)
    let domNodes: GridStackNode[];
    if (column === 1 && this.opts.oneColumnModeDomSort) {
      domNodes = [];
      this.getGridItems().forEach(el => {
        if (el.gridstackNode) { domNodes.push(el.gridstackNode); }
      });
      if (!domNodes.length) { domNodes = undefined; }
    }
    this.engine.updateNodeWidths(oldColumn, column, domNodes, layout);

    // and trigger our event last...
    this._triggerChangeEvent(true); // skip layout update
    return this;
  }

  /**
   * get the number of columns in the grid (default 12)
   */
  public getColumn(): number {
    return this.opts.column;
  }

  /** returns an array of grid HTML elements (no placeholder) - used to iterate through our children */
  public getGridItems(): GridItemHTMLElement[] {
    return Array.from(this.el.children)
      .filter((el: HTMLElement) => el.matches('.' + this.opts.itemClass) && !el.matches('.' + this.opts.placeholderClass)) as GridItemHTMLElement[];
  }

  /**
   * Destroys a grid instance.
   * @param removeDOM if `false` grid and items elements will not be removed from the DOM (Optional. Default `true`).
   */
  public destroy(removeDOM = true): GridStack {
    this._updateWindowResizeEvent(true);
    this.setStatic(true); // permanently removes DD
    if (!removeDOM) {
      this.removeAll(removeDOM);
      this.el.classList.remove(this.opts._class);
      delete this.el.gridstack;
    } else {
      this.el.parentNode.removeChild(this.el);
    }
    this._removeStylesheet();
    delete this.engine;
    return this;
  }

  /**
   * Disables widgets moving/resizing. This is a shortcut for:
   * @example
   *  grid.enableMove(false);
   *  grid.enableResize(false);
   */
  public disable(): GridStack {
    this.enableMove(false);
    this.enableResize(false);
    this._triggerEvent('disable');
    return this;
  }

  /**
   * Enables widgets moving/resizing. This is a shortcut for:
   * @example
   *  grid.enableMove(true);
   *  grid.enableResize(true);
   */
  public enable(): GridStack {
    this.enableMove(true);
    this.enableResize(true);
    this._triggerEvent('enable');
    return this;
  }

  /**
   * Enables/disables widget moving.
   *
   * @param doEnable
   * @param includeNewWidgets will force new widgets to be draggable as per
   * doEnable`s value by changing the disableDrag grid option (default: true).
   */
  public enableMove(doEnable: boolean, includeNewWidgets = true): GridStack {
    if (doEnable && this.opts.staticGrid) { return this; } // can't move a static grid!
    this.getGridItems().forEach(el => this.movable(el, doEnable));
    if (includeNewWidgets) {
      this.opts.disableDrag = !doEnable;
    }
    return this;
  }

  /**
   * Enables/disables widget resizing
   * @param doEnable
   * @param includeNewWidgets will force new widgets to be draggable as per
   * doEnable`s value by changing the disableResize grid option (default: true).
   */
  public enableResize(doEnable: boolean, includeNewWidgets = true): GridStack {
    if (doEnable && this.opts.staticGrid) { return this; } // can't size a static grid!
    this.getGridItems().forEach(el => this.resizable(el, doEnable));
    if (includeNewWidgets) {
      this.opts.disableResize = !doEnable;
    }
    return this;
  }

  /**
   * enable/disable floating widgets (default: `false`) See [example](http://gridstackjs.com/demo/float.html)
   */
  public float(val: boolean): GridStack {
    /*
    if (val === undefined) {
      // TODO: should we support and/or change signature ? figure this soon...
      console.warn('gridstack.ts: getter `float()` is deprecated in 2.x and has been replaced by `getFloat()`. It will be **completely** removed soon');
      return this.getFloat();
    }
    */
    this.engine.float = val;
    this._triggerChangeEvent();
    return this;
  }

  /**
   * get the current float mode
   */
  public getFloat(): boolean {
    return this.engine.float;
  }

  /**
   * Get the position of the cell under a pixel on screen.
   * @param position the position of the pixel to resolve in
   * absolute coordinates, as an object with top and left properties
   * @param useDocRelative if true, value will be based on document position vs parent position (Optional. Default false).
   * Useful when grid is within `position: relative` element
   *
   * Returns an object with properties `x` and `y` i.e. the column and row in the grid.
   */
  public getCellFromPixel(position: MousePosition, useDocRelative = false): CellPosition {
    let box = this.el.getBoundingClientRect();
    // console.log(`getBoundingClientRect left: ${box.left} top: ${box.top} w: ${box.width} h: ${box.height}`)
    let containerPos;
    if (useDocRelative) {
      containerPos = {top: box.top + document.documentElement.scrollTop, left: box.left};
      // console.log(`getCellFromPixel scrollTop: ${document.documentElement.scrollTop}`)
    } else {
      containerPos = {top: this.el.offsetTop, left: this.el.offsetLeft}
      // console.log(`getCellFromPixel offsetTop: ${containerPos.left} offsetLeft: ${containerPos.top}`)
    }
    let relativeLeft = position.left - containerPos.left;
    let relativeTop = position.top - containerPos.top;

    let columnWidth = (box.width / this.opts.column);
    let rowHeight = (box.height / parseInt(this.el.getAttribute('data-gs-current-row')));

    return {x: Math.floor(relativeLeft / columnWidth), y: Math.floor(relativeTop / rowHeight)};
  }

  /** returns the current number of rows, which will be at least `minRow` if set */
  public getRow(): number {
    return Math.max(this.engine.getRow(), this.opts.minRow);
  }

  /**
   * Checks if specified area is empty.
   * @param x the position x.
   * @param y the position y.
   * @param width the width of to check
   * @param height the height of to check
   */
  public isAreaEmpty(x: number, y: number, width: number, height: number): boolean {
    return this.engine.isAreaEmpty(x, y, width, height);
  }

  /**
   * Locks/unlocks widget.
   * @param el element or selector to modify.
   * @param val if true widget will be locked.
   */
  public locked(els: GridStackElement, val: boolean): GridStack {
    GridStack.getElements(els).forEach(el => {
      let node = el.gridstackNode;
      if (!node) return;
      node.locked = (val || false);
      if (node.locked) {
        el.setAttribute('data-gs-locked', 'true');
      } else {
        el.removeAttribute('data-gs-locked');
      }
    });
    return this;
  }

  /**
   * If you add elements to your grid by hand, you have to tell gridstack afterwards to make them widgets.
   * If you want gridstack to add the elements for you, use `addWidget()` instead.
   * Makes the given element a widget and returns it.
   * @param els widget or single selector to convert.
   *
   * @example
   * let grid = GridStack.init();
   * grid.el.appendChild('<div id="gsi-1" data-gs-width="3"></div>');
   * grid.makeWidget('#gsi-1');
   */
  public makeWidget(els: GridStackElement): GridItemHTMLElement {
    let el = GridStack.getElement(els);
    this._prepareElement(el, true);
    this._updateContainerHeight();
    this._triggerAddEvent();
    this._triggerChangeEvent();
    return el;
  }

  /**
   * Set the maxWidth for a widget.
   * @param els widget or selector to modify.
   * @param val A numeric value of the number of columns
   */
  public maxWidth(els: GridStackElement, val: number): GridStack {
    return this._updateAttr(els, val, 'data-gs-max-width', 'maxWidth');
  }

  /**
   * Set the minWidth for a widget.
   * @param els widget or selector to modify.
   * @param val A numeric value of the number of columns
   */
  public minWidth(els: GridStackElement, val: number): GridStack {
    return this._updateAttr(els, val, 'data-gs-min-width', 'minWidth');
  }

  /**
   * Set the maxHeight for a widget.
   * @param els widget or selector to modify.
   * @param val A numeric value of the number of rows
   */
  public maxHeight(els: GridStackElement, val: number): GridStack {
    return this._updateAttr(els, val, 'data-gs-max-height', 'maxHeight');
  }

  /**
   * Set the minHeight for a widget.
   * @param els widget or selector to modify.
   * @param val A numeric value of the number of rows
   */
  public minHeight(els: GridStackElement, val: number): GridStack {
    return this._updateAttr(els, val, 'data-gs-min-height', 'minHeight');
  }

  /**
   * Enables/Disables moving.
   * @param els widget or selector to modify.
   * @param val if true widget will be draggable.
   */
  public movable(els: GridStackElement, val: boolean): GridStack {
    if (val && this.opts.staticGrid) { return this; } // can't move a static grid!
    GridStack.getElements(els).forEach(el => {
      let node = el.gridstackNode;
      if (!node) { return }
      node.noMove = !(val || false);
      if (node.noMove) {
        dd.draggable(el, 'disable');
        el.classList.remove('ui-draggable-handle');
      } else {
        this._prepareDragDropByNode(node); // init DD if need be
        dd.draggable(el, 'enable');
        el.classList.remove('ui-draggable-handle');
      }
    });
    return this;
  }

  /**
   * Changes widget position
   * @param els  widget or singular selector to modify
   * @param x new position x. If value is null or undefined it will be ignored.
   * @param y new position y. If value is null or undefined it will be ignored.
   */
  public move(els: GridStackElement, x?: number, y?: number): GridStack {
    this._updateElement(els, (el, node) => {
      x = (x !== undefined) ? x : node.x;
      y = (y !== undefined) ? y : node.y;

      this.engine.moveNode(node, x, y, node.width, node.height);
    });
    return this;
  }

  /**
   * Event handler that extracts our CustomEvent data out automatically for receiving custom
   * notifications (see doc for supported events)
   * @param name of the event (see possible values) or list of names space separated
   * @param callback function called with event and optional second/third param
   * (see README documentation for each signature).
   *
   * @example
   * grid.on('added', function(e, items) { log('added ', items)} );
   * or
   * grid.on('added removed change', function(e, items) { log(e.type, items)} );
   *
   * Note: in some cases it is the same as calling native handler and parsing the event.
   * grid.el.addEventListener('added', function(event) { log('added ', event.detail)} );
   *
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public on(name: GridStackEvent, callback: (event: Event, arg2?: GridItemHTMLElement | GridStackNode[]) => void): GridStack {
    // check for array of names being passed instead
    if (name.indexOf(' ') !== -1) {
      let names = name.split(' ') as GridStackEvent[];
      names.forEach(name => this.on(name, callback));
      return this;
    }

    if (name === 'change' || name === 'added' || name === 'removed' || name === 'enable' || name === 'disable') {
      // native CustomEvent handlers - cash the generic handlers so we can easily remove
      let noData = (name === 'enable' || name === 'disable');
      if (noData) {
        this._gsEventHandler[name] = (event: Event) => callback(event);
      } else {
        this._gsEventHandler[name] = (event: CustomEvent) => callback(event, event.detail);
      }
      this.el.addEventListener(name, this._gsEventHandler[name]);
    } else if (name === 'dragstart' || name === 'dragstop' || name === 'resizestart' || name === 'resizestop' || name === 'dropped') {
      // drag&drop stop events NEED to be call them AFTER we update node attributes so handle them ourself.
      // do same for start event to make it easier...
      this._gsEventHandler[name] = callback;
    } else {
      console.log('GridStack.on(' + name + ') event not supported, but you can still use $(".grid-stack").on(...) while jquery-ui is still used internally.');
    }
    return this;
  }

  /**
   * unsubscribe from the 'on' event below
   * @param name of the event (see possible values)
   */
  public off(name: GridStackEvent): GridStack {
    // check for array of names being passed instead
    if (name.indexOf(' ') !== -1) {
      let names = name.split(' ') as GridStackEvent[];
      names.forEach(name => this.off(name));
      return this;
    }

    if (name === 'change' || name === 'added' || name === 'removed' || name === 'enable' || name === 'disable') {
      // remove native CustomEvent handlers
      if (this._gsEventHandler[name]) {
        this.el.removeEventListener(name, this._gsEventHandler[name]);
      }
    }
    delete this._gsEventHandler[name];

    return this;
  }

  /**
   * Removes widget from the grid.
   * @param el  widget or selector to modify
   * @param removeDOM if `false` DOM element won't be removed from the tree (Default? true).
   * @param triggerEvent if `false` (quiet mode) element will not be added to removed list and no 'removed' callbacks will be called (Default? true).
   */
  public removeWidget(els: GridStackElement, removeDOM = true, triggerEvent = true): GridStack {
    GridStack.getElements(els).forEach(el => {
      if (el.parentElement !== this.el) return; // not our child!
      let node = el.gridstackNode;
      // For Meteor support: https://github.com/gridstack/gridstack.js/pull/272
      if (!node) {
        node = this.engine.nodes.find(n => el === n.el);
      }
      if (!node) return;

      // remove our DOM data (circular link) and drag&drop permanently
      delete el.gridstackNode;
      dd.remove(el);

      this.engine.removeNode(node, removeDOM, triggerEvent);

      if (removeDOM && el.parentElement) {
        el.remove(); // in batch mode engine.removeNode doesn't call back to remove DOM
      }
    });
    if (triggerEvent) {
      this._triggerRemoveEvent();
      this._triggerChangeEvent();
    }
    return this;
  }

  /**
   * Removes all widgets from the grid.
   * @param removeDOM if `false` DOM elements won't be removed from the tree (Default? `true`).
   */
  public removeAll(removeDOM = true): GridStack {
    // always remove our DOM data (circular link) before list gets emptied and drag&drop permanently
    this.engine.nodes.forEach(n => {
      delete n.el.gridstackNode;
      dd.remove(n.el);
    });
    this.engine.removeAll(removeDOM);
    this._triggerRemoveEvent();
    return this;
  }

  /**
   * Changes widget size
   * @param els  widget or singular selector to modify
   * @param width new dimensions width. If value is null or undefined it will be ignored.
   * @param height  new dimensions height. If value is null or undefined it will be ignored.
   */
  public resize(els: GridStackElement, width?: number, height?: number): GridStack {
    this._updateElement(els, (el, node) => {
      width = (width || node.width);
      height = (height || node.height);

      this.engine.moveNode(node, node.x, node.y, width, height);
    });
    return this;
  }

  /**
   * Enables/Disables resizing.
   * @param els  widget or selector to modify
   * @param val  if true widget will be resizable.
   */
  public resizable(els: GridStackElement, val: boolean): GridStack {
    if (val && this.opts.staticGrid) { return this; } // can't resize a static grid!
    GridStack.getElements(els).forEach(el => {
      let node = el.gridstackNode;
      if (!node) { return; }
      node.noResize = !(val || false);
      if (node.noResize) {
        dd.resizable(el, 'disable');
      } else {
        this._prepareDragDropByNode(node); // init DD if need be
        dd.resizable(el, 'enable');
      }
    });
    return this;
  }

  /**
   * Toggle the grid animation state.  Toggles the `grid-stack-animate` class.
   * @param doAnimate if true the grid will animate.
   */
  public setAnimation(doAnimate: boolean): GridStack {
    if (doAnimate) {
      this.el.classList.add('grid-stack-animate');
    } else {
      this.el.classList.remove('grid-stack-animate');
    }
    return this;
  }

  /**
   * Toggle the grid static state, which permanently removes/add Drag&Drop support, unlike disable()/enable() that just turns it off/on.
   * Also toggle the grid-stack-static class.
   * @param val if true the grid become static.
   */
  public setStatic(val: boolean): GridStack {
    if (this.opts.staticGrid === val) { return this; }
    this.opts.staticGrid = val;
    this.engine.nodes.forEach(n => this._prepareDragDropByNode(n)); // either delete Drag&drop or initialize it
    this._setStaticClass();
    return this;
  }

  /**
   * Updates widget position/size.
   * @param els  widget or singular selector to modify
   * @param x new position x. If value is null or undefined it will be ignored.
   * @param y new position y. If value is null or undefined it will be ignored.
   * @param width new dimensions width. If value is null or undefined it will be ignored.
   * @param height  new dimensions height. If value is null or undefined it will be ignored.
   */
  public update(els: GridStackElement, x?: number, y?: number, width?: number, height?: number): GridStack {
    this._updateElement(els, (el, node) => {
      x = (x !== undefined) ? x : node.x;
      y = (y !== undefined) ? y : node.y;
      width = (width || node.width);
      height = (height || node.height);

      this.engine.moveNode(node, x, y, width, height);
    });
    return this;
  }

  /**
   * Updates the margins which will set all 4 sides at once - see `GridStackOptions.margin` for format options (CSS string format of 1,2,4 values or single number).
   * @param value margin value
   */
  public margin(value: numberOrString): GridStack {
    let isMultiValue = (typeof value === 'string' && value.split(' ').length > 1);
    // check if we can skip re-creating our CSS file... won't check if multi values (too much hassle)
    if (!isMultiValue) {
      let data = Utils.parseHeight(value);
      if (this.opts.marginUnit === data.unit && this.opts.margin === data.height) return;
    }
    // re-use existing margin handling
    this.opts.margin = value;
    this.opts.marginTop = this.opts.marginBottom = this.opts.marginLeft = this.opts.marginRight = undefined;
    this.initMargin();

    this._updateStyles(true); // true = force re-create

    return this;
  }

  /** returns current margin number value (undefined if 4 sides don't match) */
  public getMargin(): number { return this.opts.margin as number; }

  /**
   * Returns true if the height of the grid will be less the vertical
   * constraint. Always returns true if grid doesn't have height constraint.
   * @param x new position x. If value is null or undefined it will be ignored.
   * @param y new position y. If value is null or undefined it will be ignored.
   * @param width new dimensions width. If value is null or undefined it will be ignored.
   * @param height new dimensions height. If value is null or undefined it will be ignored.
   * @param autoPosition if true then x, y parameters will be ignored and widget
   * will be places on the first available position
   *
   * @example
   * if (grid.willItFit(newNode.x, newNode.y, newNode.width, newNode.height, newNode.autoPosition)) {
   *   grid.addWidget(newNode);
   * } else {
   *   alert('Not enough free space to place the widget');
   * }
   */
  public willItFit(x: number, y: number, width: number, height: number, autoPosition: boolean): boolean {
    return this.engine.canBePlacedWithRespectToHeight({x, y, width, height, autoPosition});
  }

  /** @internal */
  private _triggerChangeEvent(skipLayoutChange?: boolean): GridStack {
    if (this.engine.batchMode) { return this; }
    let elements = this.engine.getDirtyNodes(true); // verify they really changed
    if (elements && elements.length) {
      if (!skipLayoutChange) {
        this.engine.layoutsNodesChange(elements);
      }
      this._triggerEvent('change', elements);
    }
    this.engine.saveInitial(); // we called, now reset initial values & dirty flags
    return this;
  }

  /** @internal */
  private _triggerAddEvent(): GridStack {
    if (this.engine.batchMode) { return this }
    if (this.engine.addedNodes && this.engine.addedNodes.length > 0) {
      this.engine.layoutsNodesChange(this.engine.addedNodes);
      // prevent added nodes from also triggering 'change' event (which is called next)
      this.engine.addedNodes.forEach(n => { delete n._dirty; });
      this._triggerEvent('added', this.engine.addedNodes);
      this.engine.addedNodes = [];
    }
    return this;
  }

  /** @internal */
  private _triggerRemoveEvent(): GridStack {
    if (this.engine.batchMode) { return this; }
    if (this.engine.removedNodes && this.engine.removedNodes.length > 0) {
      this._triggerEvent('removed', this.engine.removedNodes);
      this.engine.removedNodes = [];
    }
    return this;
  }

  /** @internal */
  private _triggerEvent(name: string, data?: GridStackNode[]): GridStack {
    let event = data ? new CustomEvent(name, {bubbles: false, detail: data}) : new Event(name);
    this.el.dispatchEvent(event);
    return this;
  }

  /** @internal called to delete the current dynamic style sheet used for our layout */
  private _removeStylesheet(): GridStack {

    if (this._styles) {
      Utils.removeStylesheet(this._styles._id);
      delete this._styles;
    }
    return this;
  }

  /** @internal updated/create the CSS styles for row based layout and initial margin setting */
  private _updateStyles(forceUpdate = false, maxHeight?: number): GridStack {
    // call to delete existing one if we change cellHeight / margin
    if (forceUpdate) {
      this._removeStylesheet();
    }

    this._updateContainerHeight();
    if (!this.opts.cellHeight) { // The rest will be handled by CSS TODO: I don't understand this usage
      return this;
    }

    let cellHeight = this.opts.cellHeight as number;
    let cellHeightUnit = this.opts.cellHeightUnit;
    let prefix = `.${this.opts._class} > .${this.opts.itemClass}`;

    // create one as needed
    if (!this._styles) {
      let id = 'gridstack-style-' + (Math.random() * 100000).toFixed();
      // insert style to parent (instead of 'head' by default) to support WebComponent
      let styleLocation = this.opts.styleInHead ? undefined : this.el.parentNode as HTMLElement;
      this._styles = Utils.createStylesheet(id, styleLocation);
      if (!this._styles) { return this; }
      this._styles._id = id;
      this._styles._max = 0;

      // these are done once only
      Utils.addCSSRule(this._styles, prefix, `min-height: ${cellHeight}${cellHeightUnit}`);
      // content margins
      let top: string = this.opts.marginTop + this.opts.marginUnit;
      let bottom: string = this.opts.marginBottom + this.opts.marginUnit;
      let right: string = this.opts.marginRight + this.opts.marginUnit;
      let left: string = this.opts.marginLeft + this.opts.marginUnit;
      let content = `${prefix} > .grid-stack-item-content`;
      let placeholder = `.${this.opts._class} > .grid-stack-placeholder > .placeholder-content`;
      Utils.addCSSRule(this._styles, content, `top: ${top}; right: ${right}; bottom: ${bottom}; left: ${left};`);
      Utils.addCSSRule(this._styles, placeholder, `top: ${top}; right: ${right}; bottom: ${bottom}; left: ${left};`);
      // resize handles offset (to match margin)
      Utils.addCSSRule(this._styles, `${prefix} > .ui-resizable-ne`, `right: ${right}`);
      Utils.addCSSRule(this._styles, `${prefix} > .ui-resizable-e`, `right: ${right}`);
      Utils.addCSSRule(this._styles, `${prefix} > .ui-resizable-se`, `right: ${right}; bottom: ${bottom}`);
      Utils.addCSSRule(this._styles, `${prefix} > .ui-resizable-nw`, `left: ${left}`);
      Utils.addCSSRule(this._styles, `${prefix} > .ui-resizable-w`, `left: ${left}`);
      Utils.addCSSRule(this._styles, `${prefix} > .ui-resizable-sw`, `left: ${left}; bottom: ${bottom}`);
    }

    // now update the height specific fields
    maxHeight = maxHeight || this._styles._max;
    if (maxHeight > this._styles._max) {
      let getHeight = (rows: number): string => (cellHeight * rows) + cellHeightUnit;
      for (let i = this._styles._max + 1; i <= maxHeight; i++) { // start at 1
        let height: string = getHeight(i);
        Utils.addCSSRule(this._styles, `${prefix}[data-gs-y="${i-1}"]`,        `top: ${getHeight(i-1)}`); // start at 0
        Utils.addCSSRule(this._styles, `${prefix}[data-gs-height="${i}"]`,     `height: ${height}`);
        Utils.addCSSRule(this._styles, `${prefix}[data-gs-min-height="${i}"]`, `min-height: ${height}`);
        Utils.addCSSRule(this._styles, `${prefix}[data-gs-max-height="${i}"]`, `max-height: ${height}`);
      }
      this._styles._max = maxHeight;
    }
    return this;
  }

  /** @internal */
  private _updateContainerHeight(): GridStack {
    if (!this.engine || this.engine.batchMode) { return this; }
    let row = this.getRow(); // checks for minRow already
    // check for css min height
    let cssMinHeight = parseInt(getComputedStyle(this.el)['min-height']);
    if (cssMinHeight > 0) {
      let minRow =  Math.round(cssMinHeight / this.getCellHeight(true));
      if (row < minRow) {
        row = minRow;
      }
    }
    this.el.setAttribute('data-gs-current-row', String(row));
    if (row === 0) {
      this.el.style.removeProperty('height');
      return this;
    }
    let cellHeight = this.opts.cellHeight as number;
    let unit = this.opts.cellHeightUnit;
    if (!cellHeight) { return this }
    this.el.style.height = row * cellHeight + unit;
    return this;
  }

  /** @internal */
  private _setupRemovingTimeout(el: GridItemHTMLElement): GridStack {
    let node = el.gridstackNode;
    if (!node || node._removeTimeout || !this.opts.removable) return this;
    node._removeTimeout = window.setTimeout(() => {
      el.classList.add('grid-stack-item-removing');
      node._isAboutToRemove = true;
    }, this.opts.removeTimeout);
    return this;
  }

  /** @internal */
  private _clearRemovingTimeout(el: GridItemHTMLElement): GridStack {
    let node = el.gridstackNode;
    if (!node || !node._removeTimeout) return this;
    clearTimeout(node._removeTimeout);
    delete node._removeTimeout;
    el.classList.remove('grid-stack-item-removing');
    delete node._isAboutToRemove;
    return this;
  }

  /** @internal prepares the element for drag&drop **/
  private _prepareDragDropByNode(node: GridStackNode): GridStack {
    // check for disabled grid first
    if (this.opts.staticGrid || node.locked ||
      ((node.noMove || this.opts.disableDrag) && (node.noResize || this.opts.disableResize))) {
      if (node._initDD) {
        dd.remove(node.el); // nukes everything instead of just disable, will add some styles back next
        delete node._initDD;
      }
      node.el.classList.add('ui-draggable-disabled', 'ui-resizable-disabled'); // add styles one might depend on #1435
      return this;
    }
    // check if init already done
    if (node._initDD) {
      return this;
    }

    // remove our style that look like D&D
    node.el.classList.remove('ui-draggable-disabled', 'ui-resizable-disabled');

    // variables used/cashed between the 3 start/move/end methods, in addition to node passed above
    let cellWidth: number;
    let cellHeight: number;
    let el = node.el;

    /** called when item starts moving/resizing */
    let onStartMoving = (event: Event, ui: DDUIData): void => {
      let target = event.target as HTMLElement;

      // trigger any 'dragstart' / 'resizestart' manually
      if (this._gsEventHandler[event.type]) {
        this._gsEventHandler[event.type](event, target);
      }

      this.engine.cleanNodes();
      this.engine.beginUpdate(node);
      cellWidth = this.cellWidth();
      cellHeight = this.getCellHeight(true); // force pixels for calculations

      this.placeholder.setAttribute('data-gs-x', target.getAttribute('data-gs-x'));
      this.placeholder.setAttribute('data-gs-y', target.getAttribute('data-gs-y'));
      this.placeholder.setAttribute('data-gs-width', target.getAttribute('data-gs-width'));
      this.placeholder.setAttribute('data-gs-height', target.getAttribute('data-gs-height'));
      this.el.append(this.placeholder);

      node.el = this.placeholder;
      node._beforeDragX = node.x;
      node._beforeDragY = node.y;
      node._prevYPix = ui.position.top;

      dd.resizable(el, 'option', 'minWidth', cellWidth * (node.minWidth || 1));
      dd.resizable(el, 'option', 'minHeight', cellHeight * (node.minHeight || 1));
    }

    /** called when item is being dragged/resized */
    let dragOrResize = (event: Event, ui: DDUIData): void => {
      let x = Math.round(ui.position.left / cellWidth);
      let y = Math.floor((ui.position.top + cellHeight / 2) / cellHeight);
      let width;
      let height;

      if (event.type === 'drag') {
        let distance = ui.position.top - node._prevYPix;
        node._prevYPix = ui.position.top;
        Utils.updateScrollPosition(el, ui.position, distance);
        // if inTrash, outside of the bounds or added to another grid (#393) temporarily remove it from us
        if (el.dataset.inTrashZone || x < 0 || x >= this.engine.column || y < 0 || (!this.engine.float && y > this.engine.getRow()) || node._added) {
          if (node._temporaryRemoved) { return; }
          if (this.opts.removable === true) {
            this._setupRemovingTimeout(el);
          }

          x = node._beforeDragX;
          y = node._beforeDragY;

          if (this.placeholder.parentNode === this.el) {
            this.placeholder.remove();
          }
          this.engine.removeNode(node);
          this._updateContainerHeight();

          node._temporaryRemoved = true;
          delete node._added; // no need for this now
        } else {
          this._clearRemovingTimeout(el);

          if (node._temporaryRemoved) {
            this.engine.addNode(node);
            this._writeAttrs(this.placeholder, x, y, width, height);
            this.el.appendChild(this.placeholder);
            node.el = this.placeholder;
            delete node._temporaryRemoved;
          }
        }
      } else if (event.type === 'resize')  {
        if (x < 0) return;
        width = Math.round(ui.size.width / cellWidth);
        height = Math.round(ui.size.height / cellHeight);
      }
      // width and height are undefined if not resizing
      let _lastTriedWidth = (width || node._lastTriedWidth);
      let _lastTriedHeight = (height || node._lastTriedHeight);
      if (!this.engine.canMoveNode(node, x, y, width, height) ||
        (node._lastTriedX === x && node._lastTriedY === y &&
        node._lastTriedWidth === _lastTriedWidth && node._lastTriedHeight === _lastTriedHeight)) {
        return;
      }
      node._lastTriedX = x;
      node._lastTriedY = y;
      node._lastTriedWidth = width;
      node._lastTriedHeight = height;
      this.engine.moveNode(node, x, y, width, height);
      this._updateContainerHeight();
    }

    /** called when the item stops moving/resizing */
    let onEndMoving = (event: Event): void => {
      if (this.placeholder.parentNode === this.el) {
        this.placeholder.remove();
      }

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
        dd.remove(el);
        delete el.gridstackNode; // hint we're removing it next and break circular link
        gridToNotify._triggerRemoveEvent();
        if (el.parentElement) {
          el.remove(); // finally remove it
        }
      } else {
        this._clearRemovingTimeout(el);
        if (!node._temporaryRemoved) {
          Utils.removePositioningStyles(target);
          this._writeAttrs(target, node.x, node.y, node.width, node.height);
        } else {
          Utils.removePositioningStyles(target);
          this._writeAttrs(target, node._beforeDragX, node._beforeDragY, node.width, node.height);
          node.x = node._beforeDragX;
          node.y = node._beforeDragY;
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

      // if we re-sized a nested grid item, let the children resize as well
      if (event.type === 'resizestop') {
        this._resizeNestedGrids(target);
      }
    }

    dd
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
      dd.draggable(el, 'disable');
    }
    if (node.noResize || this.opts.disableResize) {
      dd.resizable(el, 'disable');
    }
    return this;
  }

  /** called to resize children nested grids when we/item resizes */
  private _resizeNestedGrids(target: HTMLElement): GridStack {
    target.querySelectorAll('.grid-stack').forEach((el: GridHTMLElement) => {
      if (el.gridstack) {
        el.gridstack.onParentResize();
      }});
    return this;
  }


  /** @internal */
  private _prepareElement(el: GridItemHTMLElement, triggerAddEvent = false): GridStack {
    el.classList.add(this.opts.itemClass);
    let node = this._readAttr(el, { el: el, grid: this });
    node = this.engine.addNode(node, triggerAddEvent);
    el.gridstackNode = node;
    this._writeAttr(el, node);
    this._prepareDragDropByNode(node);
    return this;
  }

  /** @internal call to write x,y,w,h attributes back to element */
  private _writeAttrs(el: HTMLElement, x?: number, y?: number, width?: number, height?: number): GridStack {
    if (x !== undefined && x !== null) { el.setAttribute('data-gs-x', String(x)); }
    if (y !== undefined && y !== null) { el.setAttribute('data-gs-y', String(y)); }
    if (width) { el.setAttribute('data-gs-width', String(width)); }
    if (height) { el.setAttribute('data-gs-height', String(height)); }
    return this;
  }

  /** @internal call to write any default attributes back to element */
  private _writeAttr(el: HTMLElement, node: GridStackWidget): GridStack {
    if (!node) return this;
    this._writeAttrs(el, node.x, node.y, node.width, node.height);

    if (node.autoPosition) {
      el.setAttribute('data-gs-auto-position', 'true');
    } else {
      el.removeAttribute('data-gs-auto-position');
    }

    if (node.minWidth) { el.setAttribute('data-gs-min-width', String(node.minWidth)); }
    if (node.maxWidth) { el.setAttribute('data-gs-max-width', String(node.maxWidth)); }
    if (node.minHeight) { el.setAttribute('data-gs-min-height', String(node.minHeight)); }
    if (node.maxHeight) { el.setAttribute('data-gs-max-height', String(node.maxHeight)); }
    if (node.noResize) {
      el.setAttribute('data-gs-no-resize', 'true');
    } else {
      el.removeAttribute('data-gs-no-resize');
    }

    if (node.noMove) {
      el.setAttribute('data-gs-no-move', 'true');
    } else {
      el.removeAttribute('data-gs-no-move');
    }

    if (node.locked) {
      el.setAttribute('data-gs-locked', 'true');
    } else {
      el.removeAttribute('data-gs-locked');
    }

    if (node.resizeHandles) { el.setAttribute('data-gs-resize-handles', node.resizeHandles); }
    if (node.id) { el.setAttribute('data-gs-id', String(node.id)); }
    return this;
  }

  /** @internal call to read any default attributes from element */
  private _readAttr(el: HTMLElement, node: GridStackNode = {}): GridStackWidget {
    node.x = Utils.toNumber(el.getAttribute('data-gs-x'));
    node.y = Utils.toNumber(el.getAttribute('data-gs-y'));
    node.width = Utils.toNumber(el.getAttribute('data-gs-width'));
    node.height = Utils.toNumber(el.getAttribute('data-gs-height'));
    node.maxWidth = Utils.toNumber(el.getAttribute('data-gs-max-width'));
    node.minWidth = Utils.toNumber(el.getAttribute('data-gs-min-width'));
    node.maxHeight = Utils.toNumber(el.getAttribute('data-gs-max-height'));
    node.minHeight = Utils.toNumber(el.getAttribute('data-gs-min-height'));
    node.autoPosition = Utils.toBool(el.getAttribute('data-gs-auto-position'));
    node.noResize = Utils.toBool(el.getAttribute('data-gs-no-resize'));
    node.noMove = Utils.toBool(el.getAttribute('data-gs-no-move'));
    node.locked = Utils.toBool(el.getAttribute('data-gs-locked'));
    node.resizeHandles = el.getAttribute('data-gs-resize-handles');
    node.id = el.getAttribute('data-gs-id');

    return node;
  }

  /** @internal */
  private _updateElement(els: GridStackElement, callback: (el: GridItemHTMLElement, node: GridStackNode) => void): GridStack {
    let el = GridStack.getElement(els);
    if (!el) { return this; }
    let node = el.gridstackNode;
    if (!node) { return this; }

    this.engine.cleanNodes();
    this.engine.beginUpdate(node);

    callback.call(this, el, node);

    this._updateContainerHeight();
    this._triggerChangeEvent();

    this.engine.endUpdate();
    return this;
  }

  /** @internal */
  private _setStaticClass(): GridStack {
    let classes = ['grid-stack-static'];

    if (this.opts.staticGrid) {
      this.el.classList.add(...classes);
      this.el.setAttribute('data-gs-static-grid', 'true');
    } else {
      this.el.classList.remove(...classes);
      this.el.removeAttribute('data-gs-static-grid');

    }
    return this;
  }

  /**
   * called when we are being resized by the window - check if the one Column Mode needs to be turned on/off
   * and remember the prev columns we used, as well as check for auto cell height (square)
   */
  public onParentResize(): GridStack {
    // make the cells content (minus margin) square again
    if (this._isAutoCellHeight) {
      Utils.throttle(() => {
        let marginDiff = - (this.opts.marginRight as number) - (this.opts.marginLeft as number)
          + (this.opts.marginTop as number) + (this.opts.marginBottom as number);
        this.cellHeight(this.cellWidth() + marginDiff);
      }, 100);
    }

    if (!this.opts.disableOneColumnMode && this.el.clientWidth <= this.opts.minWidth) {
      if (this._oneColumnMode) { return this }
      this._oneColumnMode = true;
      this.column(1);
      this._resizeNestedGrids(this.el);
    } else {
      if (!this._oneColumnMode) { return this }
      delete this._oneColumnMode;
      this.column(this._prevColumn);
      this._resizeNestedGrids(this.el);
    }

    return this;
  }

  /** add or remove the window size event handler */
  private _updateWindowResizeEvent(forceRemove = false): GridStack {
    const workTodo = (this._isAutoCellHeight || !this.opts.disableOneColumnMode);

    // only add event if we're not nested (parent will call us) and we're auto sizing cells or supporting oneColumn (i.e. doing work)
    if (workTodo && !forceRemove && !this.opts._isNested && !this._windowResizeBind) {
      this._windowResizeBind = this.onParentResize.bind(this); // so we can properly remove later
      window.addEventListener('resize', this._windowResizeBind);
    } else if ((forceRemove || !workTodo) && this._windowResizeBind) {
      window.removeEventListener('resize', this._windowResizeBind);
      delete this._windowResizeBind; // remove link to us so we can free
    }

    return this;
  }

  /** @internal call to setup dragging in from the outside (say toolbar), with options */
  private _setupDragIn():  GridStack {
    if (!this.opts.staticGrid && typeof this.opts.dragIn === 'string') {
      if (!dd.isDraggable(this.opts.dragIn)) {
        dd.dragIn(this.opts.dragIn, this.opts.dragInOptions);
      }
    }
    return this;
  }

  /** @internal called to setup a trash drop zone if the user specifies it */
  private _setupRemoveDrop(): GridStack {
    if (!this.opts.staticGrid && typeof this.opts.removable === 'string') {
      let trashZone = document.querySelector(this.opts.removable) as HTMLElement;
      if (!trashZone) return this;
      // only register ONE dropover/dropout callback for the 'trash', and it will
      // update the passed in item and parent grid because the 'trash' is a shared resource anyway,
      // and Native DD only has 1 event CB (having a list and technically a per grid removableOptions complicates things greatly)
      if (!dd.isDroppable(trashZone)) {
        dd.droppable(trashZone, this.opts.removableOptions)
          .on(trashZone, 'dropover', function(event, el) { // don't use => notation to avoid using 'this' as grid by mistake...
            let node = el.gridstackNode;
            if (!node || !node.grid) return;
            el.dataset.inTrashZone = 'true';
            node.grid._setupRemovingTimeout(el);
          })
          .on(trashZone, 'dropout', function(event, el) { // same
            let node = el.gridstackNode;
            if (!node || !node.grid) return;
            delete el.dataset.inTrashZone;
            node.grid._clearRemovingTimeout(el);
          });
      }
    }
    return this;
  }

  /** @internal called to add drag over support to support widgets */
  private _setupAcceptWidget(): GridStack {
    if (this.opts.staticGrid || !this.opts.acceptWidgets) return this;

    let onDrag = (event, el: GridItemHTMLElement) => {
      let node = el.gridstackNode;
      let pos = this.getCellFromPixel({left: event.pageX, top: event.pageY}, true);
      let x = Math.max(0, pos.x);
      let y = Math.max(0, pos.y);
      if (!node._added) {
        node._added = true;

        node.el = el;
        node.x = x;
        node.y = y;
        delete node.autoPosition;
        this.engine.cleanNodes();
        this.engine.beginUpdate(node);
        this.engine.addNode(node);

        this._writeAttrs(this.placeholder, node.x, node.y, node.width, node.height);
        this.el.appendChild(this.placeholder);
        node.el = this.placeholder; // dom we update while dragging...
        node._beforeDragX = node.x;
        node._beforeDragY = node.y;

        this._updateContainerHeight();
      } else if ((x !== node.x || y !== node.y) && this.engine.canMoveNode(node, x, y)) {
        this.engine.moveNode(node, x, y);
        this._updateContainerHeight();
      }
    };

    dd
      .droppable(this.el, {
        accept: (el: GridItemHTMLElement) => {
          let node: GridStackNode = el.gridstackNode;
          if (node && node.grid === this) {
            return false;
          }
          if (typeof this.opts.acceptWidgets === 'function') {
            return this.opts.acceptWidgets(el);
          }
          let selector = (this.opts.acceptWidgets === true ? '.grid-stack-item' : this.opts.acceptWidgets as string);
          return el.matches(selector);
        }
      })
      .on(this.el, 'dropover', (event, el: GridItemHTMLElement) => {

        // see if we already have a node with widget/height and check for attributes
        let node = el.gridstackNode || {};
        if (!node.width || !node.height) {
          let w = parseInt(el.getAttribute('data-gs-width'));
          if (w > 0) { node.width = w; }
          let h = parseInt(el.getAttribute('data-gs-height'));
          if (h > 0) { node.height = h; }
        }

        // if the item came from another grid, let it know it was added here to removed duplicate shadow #393
        if (node.grid && node.grid !== this) {
          node._added = true;
        }

        // if not calculate the grid size based on element outer size
        let width = node.width || Math.round(el.offsetWidth / this.cellWidth()) || 1;
        let height = node.height || Math.round(el.offsetHeight / this.getCellHeight(true)) || 1;

        // copy the node original values (min/max/id/etc...) but override width/height/other flags which are this grid specific
        let newNode = this.engine.prepareNode({...node, ...{width, height, _added: false, _temporary: true}});
        newNode._isOutOfGrid = true;
        el.gridstackNode = newNode;
        el._gridstackNodeOrig = node;

        dd.on(el, 'drag', onDrag);
        return false; // prevent parent from receiving msg (which may be grid as well)
      })
      .on(this.el, 'dropout', (event, el: GridItemHTMLElement) => {
        // jquery-ui bug. Must verify widget is being dropped out
        // check node variable that gets set when widget is out of grid
        let node = el.gridstackNode;
        if (!node || !node._isOutOfGrid) {
          return;
        }
        dd.off(el, 'drag');
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
        this.placeholder.remove();

        // notify previous grid of removal
        let origNode = el._gridstackNodeOrig;
        delete el._gridstackNodeOrig;
        if (origNode && origNode.grid && origNode.grid !== this) {
          let oGrid = origNode.grid;
          oGrid.placeholder.remove();
          origNode.el = el; // was using placeholder, have it point to node we've moved instead
          oGrid.engine.removedNodes.push(origNode);
          oGrid._triggerRemoveEvent();
        }

        let node = el.gridstackNode; // use existing placeholder node as it's already in our list with drop location
        const _id = node._id;
        this.engine.cleanupNode(node); // removes all internal _xyz values (including the _id so add that back)
        node._id = _id;
        node.grid = this;
        dd.off(el, 'drag');
        // if we made a copy ('helper' which is temp) of the original node then insert a copy, else we move the original node (#1102)
        // as the helper will be nuked by jqueryui otherwise
        if (helper !== el) {
          helper.remove();
          el.gridstackNode = origNode; // original item (left behind) is re-stored to pre dragging as the node now has drop info
          el = el.cloneNode(true) as GridItemHTMLElement;
        } else {
          el.remove(); // reduce flicker as we change depth here, and size further down
          dd.remove(el);
        }
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

  /** @internal convert a potential selector into actual element */
  private static getElement(els: GridStackElement = '.grid-stack-item'): GridItemHTMLElement {
    if (typeof els === 'string') {
      if (!els.length) { return null}
      if (els[0] === '#') {
        return document.getElementById(els.substring(1));
      }
      if (els[0] === '.') {
        return document.querySelector(els);
      }

      // if we start with a digit, assume it's an id (error calling querySelector('#1')) as class are not valid CSS
      if(!isNaN(+els[0])) { // start with digit
        return document.getElementById(els);
      }

      // finally try string, then id then class
      let el = document.querySelector(els);
      if (!el) { el = document.getElementById(els) }
      if (!el) { el = document.querySelector('.' + els) }
      return el as GridItemHTMLElement;
    }
    return els;
  }

  /** @internal convert a potential selector into actual list of elements */
  private static getElements(els: GridStackElement = '.grid-stack-item'): GridItemHTMLElement[] {
    if (typeof els === 'string') {
      let list = document.querySelectorAll(els);
      if (!list.length && els[0] !== '.' && els[0] !== '#') {
        list = document.querySelectorAll('.' + els);
        if (!list.length) { list = document.querySelectorAll('#' + els) }
      }
      return Array.from(list) as GridItemHTMLElement[];
    }
    return [els];
  }
  /** @internal */
  private static getGridElement(els: string | HTMLElement = '.grid-stack'): GridHTMLElement {
    return GridStack.getElement(els) as GridHTMLElement;
  }
  /** @internal */
  private static getGridElements(els: string | HTMLElement = '.grid-stack'): GridHTMLElement[] {
    return GridStack.getElements(els) as GridHTMLElement[];
  }

  /** @internal initialize margin top/bottom/left/right and units */
  private initMargin(): GridStack {

    let data: HeightData;
    let margin = 0;

    // support passing multiple values like CSS (ex: '5px 10px 0 20px')
    let margins: string[] = [];
    if (typeof this.opts.margin === 'string') {
      margins = this.opts.margin.split(' ')
    }
    if (margins.length === 2) { // top/bot, left/right like CSS
      this.opts.marginTop = this.opts.marginBottom = margins[0];
      this.opts.marginLeft = this.opts.marginRight = margins[1];
    } else if (margins.length === 4) { // Clockwise like CSS
      this.opts.marginTop = margins[0];
      this.opts.marginRight = margins[1];
      this.opts.marginBottom = margins[2];
      this.opts.marginLeft = margins[3];
    } else {
      data = Utils.parseHeight(this.opts.margin);
      this.opts.marginUnit = data.unit;
      margin = this.opts.margin = data.height;
    }

    // see if top/bottom/left/right need to be set as well
    if (this.opts.marginTop === undefined) {
      this.opts.marginTop = margin;
    } else {
      data = Utils.parseHeight(this.opts.marginTop);
      this.opts.marginTop = data.height;
      delete this.opts.margin;
    }

    if (this.opts.marginBottom === undefined) {
      this.opts.marginBottom = margin;
    } else {
      data = Utils.parseHeight(this.opts.marginBottom);
      this.opts.marginBottom = data.height;
      delete this.opts.margin;
    }

    if (this.opts.marginRight === undefined) {
      this.opts.marginRight = margin;
    } else {
      data = Utils.parseHeight(this.opts.marginRight);
      this.opts.marginRight = data.height;
      delete this.opts.margin;
    }

    if (this.opts.marginLeft === undefined) {
      this.opts.marginLeft = margin;
    } else {
      data = Utils.parseHeight(this.opts.marginLeft);
      this.opts.marginLeft = data.height;
      delete this.opts.margin;
    }
    this.opts.marginUnit = data.unit; // in case side were spelled out, use those units instead...
    if (this.opts.marginTop === this.opts.marginBottom && this.opts.marginLeft === this.opts.marginRight && this.opts.marginTop === this.opts.marginRight) {
      this.opts.margin = this.opts.marginTop; // makes it easier to check for no-ops in setMargin()
    }
    return this;
  }

  /** @internal called to update an element(s) attributes and node values */
  private _updateAttr(els: GridStackElement, val: number, attr: string, field: string): GridStack {
    GridStack.getElements(els).forEach(el => {
      if (val) {
        el.setAttribute(attr, String(val));
      } else {
        el.removeAttribute(attr);
      }
      if (el.gridstackNode) {
        el.gridstackNode[field] = (val || undefined);
      }
    });
    return this;
  }

  // legacy method renames
  /** @internal */
  private setGridWidth = obsolete(this, GridStack.prototype.column, 'setGridWidth', 'column', 'v0.5.3');
  /** @internal */
  private setColumn = obsolete(this, GridStack.prototype.column, 'setColumn', 'column', 'v0.6.4');
  /** @internal */
  private getGridHeight =  obsolete(this, GridStackEngine.prototype.getRow, 'getGridHeight', 'getRow', 'v1.0.0');
}
