// gridstack.ts 2.0.0-rc @preserve

/**
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/

import { GridStackEngine } from './gridstack-engine'
import { obsoleteOpts, obsoleteOptsDel, obsoleteAttr, obsolete, Utils } from './utils';
import { GridItemHTMLElement, GridstackWidget, GridStackNode, GridstackOptions, numberOrString } from './types';
import { GridStackDragDropPlugin } from './gridstack-dragdrop-plugin';

// TODO: TEMPORARY until we remove all jquery calls
// also see https://stackoverflow.com/questions/35345760/importing-jqueryui-with-typescript-and-requirejs
import * as $ from './jquery.js';

export type GridStackElement = string | HTMLElement | GridItemHTMLElement;

export interface GridHTMLElement extends HTMLElement {
  gridstack?: GridStack; // grid's parent DOM element points back to grid class
}
export type GridStackEvent = 'added' | 'change' | 'disable' | 'dragstart' | 'dragstop' | 'dropped' |
  'enable' | 'removed' | 'resize' | 'resizestart' | 'gsresizestop';

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
  _max?: number; // internal tracker of the max # of rows we created
}

function getElement(els: GridStackElement): GridItemHTMLElement {
  return (typeof els === 'string' ? 
    (document.querySelector(els) || document.querySelector('#' + els) || document.querySelector('.' + els)) : els);
}
function getElements(els: GridStackElement): GridItemHTMLElement[] {
  return (typeof els === 'string' ? Array.from(
    document.querySelectorAll(els) || document.querySelectorAll('#' + els) || document.querySelectorAll('.' + els)
    ) : [els]);
}
function getGridElement(els: string | HTMLElement): GridHTMLElement {
  return (typeof els === 'string' ? 
    (document.querySelector(els) || document.querySelector('#' + els) || document.querySelector('.' + els)) : els);
}
function getGridElements(els: string | HTMLElement): GridHTMLElement[] {
  return (typeof els === 'string' ? Array.from(
    document.querySelectorAll(els) || document.querySelectorAll('#' + els) || document.querySelectorAll('.' + els)
    ) : [els]);
}

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

  /** scoping so users can call GridStack.Utils.sort() for example */
  public static Utils = Utils;

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
  public static init(options?: GridstackOptions, elOrString: GridStackElement = '.grid-stack'): GridStack {
    let el = getGridElement(elOrString);
    if (!el) {
      if (typeof elOrString === 'string') {
        console.error('gridstack.js: init() no grid was found. Did you forget class ' + elOrString + ' on your element ?');
        console.error('".grid-stack" is required for proper CSS styling and drag/drop.');
      } else {
        console.error('gridstack.js: init() no grid element was passed.');
      }
      return;
    }
    if (!el.gridstack) {
      el.gridstack = new GridStack(el, options);
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
  public static initAll(options?: GridstackOptions, selector = '.grid-stack'): GridStack[] {
    let grids: GridStack[] = [];
    getGridElements(selector).forEach(el => {
      if (!el.gridstack) {
        el.gridstack = new GridStack(el, options);
      }
      grids.push(el.gridstack);
    });
    if (grids.length === 0) {
      console.error('gridstack.js: initAll() no grid was found. Did you forget class ' + selector + ' on your element ?');
      console.error('".grid-stack" is required for proper CSS styling and drag/drop.');
    }
    return grids;
  }

  /** the HTML element tied to this grid after it's been initialized */
  public el: GridHTMLElement;

  /** engine used to implement non DOM grid functionality */
  public engine: GridStackEngine;

  /** grid options - public for classes to access, but use methods to modify! */
  public opts: GridstackOptions;

  /** @internal */
  private placeholder: HTMLElement;
  private $el: JQuery; // TODO: legacy code
  private oneColumnMode: boolean;
  private dd: GridStackDragDropPlugin;
  private _prevColumn: number;
  private _stylesId: string;
  private _gsEventHandler: {};
  private _styles: GridCSSStyleSheet;
  private isAutoCellHeight: boolean;

  /**
   * Construct a grid item from the given element and options
   * @param el
   * @param opts
   */
  public constructor(el: GridHTMLElement, opts?: GridstackOptions) {
    this.el = el; // exposed HTML element to the user
    this.$el = $(el); // legacy code
    opts = opts || {}; // handles null/undefined/0

    obsoleteOpts(opts, 'width', 'column', 'v0.5.3');
    obsoleteOpts(opts, 'height', 'maxRow', 'v0.5.3');
    obsoleteOptsDel(opts, 'oneColumnModeClass', 'v0.6.3', '. Use class `.grid-stack-1` instead');

    // container attributes
    obsoleteAttr(this.el, 'data-gs-width', 'data-gs-column', 'v0.5.3');
    obsoleteAttr(this.el, 'data-gs-height', 'data-gs-max-row', 'v0.5.3');
    obsoleteAttr(this.el, 'data-gs-current-height', 'data-gs-current-row', 'v1.0.0');

    opts.itemClass = opts.itemClass || 'grid-stack-item';

    // if row property exists, replace minRow and maxRow instead
    if (opts.row) {
      opts.minRow = opts.maxRow = opts.row;
      delete opts.row;
    }

    let rowAttr = Utils.toNumber(el.getAttribute('data-gs-row'));

    // elements attributes override any passed options (like CSS style) - merge the two together
    let defaults: GridstackOptions = {
      column: Utils.toNumber(el.getAttribute('data-gs-column')) || 12,
      minRow: rowAttr ? rowAttr : Utils.toNumber(el.getAttribute('data-gs-min-row')) || 0,
      maxRow: rowAttr ? rowAttr : Utils.toNumber(el.getAttribute('data-gs-max-row')) || 0,
      itemClass: 'grid-stack-item',
      placeholderClass: 'grid-stack-placeholder',
      placeholderText: '',
      handle: '.grid-stack-item-content',
      handleClass: null,
      cellHeight: 60,
      verticalMargin: 20,
      auto: true,
      minWidth: 768,
      float: false,
      staticGrid: false,
      _class: 'grid-stack-instance-' + (Math.random() * 10000).toFixed(0),
      animate: Utils.toBool(el.getAttribute('data-gs-animate')) || false,
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
    };

    this.opts = Utils.defaults(opts, defaults);

    if (this.opts.ddPlugin === false) {
      this.opts.ddPlugin = GridStackDragDropPlugin;
    } else if (this.opts.ddPlugin === null) {
      this.opts.ddPlugin = GridStackDragDropPlugin.registeredPlugins[0] || GridStackDragDropPlugin;
    }

    this.dd = new this.opts.ddPlugin(this);

    if (this.opts.rtl === 'auto') {
      this.opts.rtl = el.style.direction === 'rtl';
    }

    if (this.opts.rtl) {
      this.el.classList.add('grid-stack-rtl');
    }

    this.opts._isNested = this.$el.closest('.' + opts.itemClass).length > 0;
    if (this.opts._isNested) {
      this.el.classList.add('grid-stack-nested');
    }

    this.isAutoCellHeight = (this.opts.cellHeight === 'auto');
    if (this.isAutoCellHeight) {
      // make the cell square initially
      this.cellHeight(this.cellWidth(), true);
    } else {
      this.cellHeight(this.opts.cellHeight, true);
    }
    this.verticalMargin(this.opts.verticalMargin, true);

    this.el.classList.add(this.opts._class);

    this._setStaticClass();

    this._initStyles();

    this.engine = new GridStackEngine(this.opts.column, (cbNodes, detachNode) => {
      detachNode = (detachNode === undefined ? true : detachNode);
      let maxHeight = 0;
      this.engine.nodes.forEach(n => { maxHeight = Math.max(maxHeight, n.y + n.height) });
      cbNodes.forEach(n => {
        let el = n.el;
        if (detachNode && n._id === null) {
          if (el && el.parentNode) { el.parentNode.removeChild(el) }
        } else {
          this._writeAttrs(el, n.x, n.y, n.width, n.height);
        }
      });
      this._updateStyles(maxHeight + 10);
    },
    this.opts.float,
    this.opts.maxRow);

    if (this.opts.auto) {
      let elements = [];
      let _this = this;
      this.$el.children('.' + this.opts.itemClass + ':not(.' + this.opts.placeholderClass + ')')
        .each((index, el) => {
          let x = parseInt(el.getAttribute('data-gs-x'));
          let y = parseInt(el.getAttribute('data-gs-y'));
          elements.push({
            el: el,
            // if x,y are missing (autoPosition) add them to end of list - but keep their respective DOM order
            i: (Number.isNaN(x) ? 1000 : x) + (Number.isNaN(y) ? 1000 : y) * _this.opts.column
          });
        });
      Utils.sortBy(elements, x => x.i).forEach( item => { this._prepareElement(item.el) });
    }
    this.engine._saveInitial(); // initial start of items

    this.setAnimation(this.opts.animate);

    let placeholderChild = document.createElement('div');
    placeholderChild.className = 'placeholder-content';
    placeholderChild.innerHTML = this.opts.placeholderText;
    this.placeholder = document.createElement('div');
    this.placeholder.classList.add(this.opts.placeholderClass, this.opts.itemClass);
    this.placeholder.appendChild(placeholderChild);

    this._updateContainerHeight();

    $(window).resize(this.onResizeHandler.bind(this));
    this.onResizeHandler();

    if (!this.opts.staticGrid && typeof this.opts.removable === 'string') {
      let trashZone = $(this.opts.removable);
      if (!this.dd.isDroppable(trashZone)) {
        this.dd.droppable(trashZone, this.opts.removableOptions);
      }
      this.dd
        .on(trashZone, 'dropover', (event, ui) => {
          let el: GridItemHTMLElement = ui.draggable.get(0);
          let node = el.gridstackNode;
          if (!node || node._grid !== this) {
            return;
          }
          el.dataset.inTrashZone = 'true';
          this._setupRemovingTimeout(el);
        })
        .on(trashZone, 'dropout', (event, ui) => {
          let el: GridItemHTMLElement = ui.draggable.get(0);
          let node = el.gridstackNode;
          if (!node || node._grid !== this) {
            return;
          }
          el.dataset.inTrashZone = 'false';
          this._clearRemovingTimeout(el);
        });
    }

    this.setupAcceptWidget();
  };


  /**
   * Creates new widget and returns it.
   *
   * Widget will be always placed even if result height is more than actual grid height.
   * You need to use willItFit method before calling addWidget for additional check.
   * See also `makeWidget()`.
   *
   * @example
   * let grid = GridStack.init();
   * grid.addWidget(el, {width: 3, autoPosition: true});
   *
   * @param el widget to add
   * @param options widget position/size options (optional)
   */
  public addWidget(el: GridStackElement, options? : GridstackWidget): HTMLElement;

  /**
   * Creates new widget and returns it.
   * Legacy: Spelled out version of the widgets options, recommend use new version instead.
   *
   * @example
   * let grid = GridStack.init();
   * grid.addWidget(el, 0, 0, 3, 2, true);
   *
   * @param el widget to add
   * @param x widget position x (optional)
   * @param y widget position y (optional)
   * @param width  widget dimension width (optional)
   * @param height widget dimension height (optional)
   * @param autoPosition if true then x, y parameters will be ignored and widget will be places on the first available position (optional)
   * @param minWidth minimum width allowed during resize/creation (optional)
   * @param maxWidth maximum width allowed during resize/creation (optional)
   * @param minHeight minimum height allowed during resize/creation (optional)
   * @param maxHeight maximum height allowed during resize/creation (optional)
   * @param id value for `data-gs-id` (optional)
   */
  public addWidget(el: GridStackElement, x? : number | GridstackWidget, y?: number, width?: number, height?: number, autoPosition?: boolean,
    minWidth?: number, maxWidth?: number, minHeight?: number, maxHeight?: number, id?: numberOrString): HTMLElement {
    // new way of calling with an object - make sure all items have been properly initialized
    if (x === undefined || typeof x === 'object') {
      // Tempting to initialize the passed in opt with default and valid values, but this break knockout demos
      // as the actual value are filled in when _prepareElement() calls el.attr('data-gs-xyz) before adding the node.
      // opt = this.engine._prepareNode(opt);
      x = (x || {}) as GridstackWidget;
    } else {
      // old legacy way of calling with items spelled out - call us back with single object instead (so we can properly initialized values)
      return this.addWidget(el, { x, y, width, height, autoPosition, minWidth, maxWidth, minHeight, maxHeight, id });
    }

    if (typeof el === 'string') {
      let doc = document.implementation.createHTMLDocument();
      doc.body.innerHTML = el;
      el = doc.body.children[0] as HTMLElement;
    }

    this._writeAttr(el, x);
    this.el.appendChild(el);

    return this.makeWidget(el);
  }

  /**
   * Initializes batch updates. You will see no changes until `commit()` method is called.
   */
  public batchUpdate(): void {
    this.engine.batchUpdate();
  }

  /**
   * Gets current cell height.
   */
  public getCellHeight(): number {
    if (this.opts.cellHeight && this.opts.cellHeight !== 'auto') {
      return this.opts.cellHeight as number;
    }
    // compute the height taking margin into account (each row has margin other than last one)
    let el = this.el.querySelector('.' + this.opts.itemClass) as HTMLElement;
    let height = Utils.toNumber(el.getAttribute('data-gs-height'));
    let verticalMargin = this.opts.verticalMargin as number;

    return Math.round((el.offsetHeight - (height - 1) * verticalMargin) / height);
  }

  /**
   * Update current cell height - see `GridstackOptions.cellHeight` for format.
   * This method rebuilds an internal CSS style sheet.
   * Note: You can expect performance issues if call this method too often.
   *
   * @param val the cell height
   * @param noUpdate (Optional) if true, styles will not be updated
   *
   * @example
   * grid.cellHeight(grid.cellWidth() * 1.2);
   */
  public cellHeight(val: numberOrString, noUpdate?: boolean): void {
    let heightData = Utils.parseHeight(val);
    if (this.opts.cellHeightUnit === heightData.unit && this.opts.cellHeight === heightData.height) {
      return ;
    }
    this.opts.cellHeightUnit = heightData.unit;
    this.opts.cellHeight = heightData.height;

    if (!noUpdate) {
      this._updateStyles();
    }
  }

  /**
   * Gets current cell width.
   */
  public cellWidth(): number {
    // TODO: take margin into account ($horizontal_padding in .scss) to make cellHeight='auto' square ? (see 810-many-columns.html)
    return Math.round(this.el.offsetWidth / this.opts.column);
  }

  /**
   * Finishes batch updates. Updates DOM nodes. You must call it after batchUpdate.
   */
  public commit(): void {
    this.engine.commit();
    this._triggerRemoveEvent();
    this._triggerAddEvent();
    this._triggerChangeEvent();
  };

  /** re-layout grid items to reclaim any empty space */
  public compact(): void {
    this.engine.compact();
    this._triggerChangeEvent();
  }

  /**
   * set the number of columns in the grid. Will update existing widgets to conform to new number of columns,
   * as well as cache the original layout so you can revert back to previous positions without loss.
   * Requires `gridstack-extra.css` or `gridstack-extra.min.css` for [1-11],
   * else you will need to generate correct CSS (see https://github.com/gridstack/gridstack.js#change-grid-columns)
   * @param column - Integer > 0 (default 12).
   * @param doNotPropagate if true existing widgets will not be updated (optional)
   */
  public column(column: number, doNotPropagate?: boolean) {
    if (this.opts.column === column) { return; }
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

    if (doNotPropagate === true) { return; }

    // update the items now - see if the dom order nodes should be passed instead (else default to current list)
    let domNodes;
    if (this.opts.oneColumnModeDomSort && column === 1) {
      domNodes = [];
      this.$el.children('.' + this.opts.itemClass).each((index, el: GridItemHTMLElement) => {
        let node = el.gridstackNode;
        if (node) { domNodes.push(node); }
      });
      if (!domNodes.length) { domNodes = undefined; }
    }
    this.engine._updateNodeWidths(oldColumn, column, domNodes);

    // and trigger our event last...
    this._triggerChangeEvent(true); // skip layout update
  }

  /**
   * get the number of columns in the grid (default 12)
   */
  public getColumn(): number {
    return this.opts.column;
  }

  /**
   * Destroys a grid instance.
   * @param detachGrid if false nodes and grid will not be removed from the DOM (Optional. Default true).
   */
  public destroy(detachGrid = true): void {
    $(window).off('resize', this.onResizeHandler);
    this.disable();
    if (!detachGrid) {
      this.removeAll(false);
      this.el.classList.remove(this.opts._class);
      delete this.el.gridstack;
    } else {
      this.el.parentNode.removeChild(this.el);
    }
    Utils.removeStylesheet(this._stylesId);
    if (this.engine) {
      this.engine = null;
    }
  }

  /**
   * Disables widgets moving/resizing. This is a shortcut for:
   * @example
   *  grid.enableMove(false);
   *  grid.enableResize(false);
   */
  public disable(): void {
    this.enableMove(false);
    this.enableResize(false);
    this._triggerEvent('disable');
  }

  /**
   * Enables widgets moving/resizing. This is a shortcut for:
   * @example
   *  grid.enableMove(true);
   *  grid.enableResize(true);
   */
  public enable(): void {
    this.enableMove(true);
    this.enableResize(true);
    this._triggerEvent('enable');
  }

  /**
   * Enables/disables widget moving.
   *
   * @param doEnable
   * @param includeNewWidgets will force new widgets to be draggable as per
   * doEnable`s value by changing the disableDrag grid option (default: true).
   */
  public enableMove(doEnable: boolean, includeNewWidgets = true): void {
    this.$el.children('.' + this.opts.itemClass).each((index, el) => {
      this.movable(el, doEnable);
    });

    if (includeNewWidgets) {
      this.opts.disableDrag = !doEnable;
    }
  }

  /**
   * Enables/disables widget resizing
   * @param doEnable
   * @param includeNewWidgets will force new widgets to be draggable as per
   * doEnable`s value by changing the disableResize grid option (default: true).
   */
  public enableResize(doEnable: boolean, includeNewWidgets = true) {
    this.$el.children('.' + this.opts.itemClass).each((index, el) => {
      this.resizable(el, doEnable);
    })
    if (includeNewWidgets) {
      this.opts.disableResize = !doEnable;
    }
  }

  /**
   * enable/disable floating widgets (default: `false`) See [example](http://gridstackjs.com/demo/float.html)
   */
  public float(val: boolean) {
    this.engine.float = val;
    this._triggerChangeEvent();
  }

  /**
   * get the current float mode
   */
  public getFloat(): boolean {
    return this.engine.float || false;
  }

  /**
   * Get the position of the cell under a pixel on screen.
   * @param position the position of the pixel to resolve in
   * absolute coordinates, as an object with top and left properties
   * @param useOffset if true, value will be based on offset vs position (Optional. Default false).
   * Useful when grid is within `position: relative` element
   *
   * Returns an object with properties `x` and `y` i.e. the column and row in the grid.
   */
  public getCellFromPixel(position: MousePosition, useOffset = false): CellPosition {
    let containerPos = (useOffset ? this.$el.offset() : this.$el.position());
    let relativeLeft = position.left - containerPos.left;
    let relativeTop = position.top - containerPos.top;

    let columnWidth = Math.floor(this.$el.width() / this.opts.column);
    let rowHeight = Math.floor(this.$el.height() / parseInt(this.el.getAttribute('data-gs-current-row')));

    return {x: Math.floor(relativeLeft / columnWidth), y: Math.floor(relativeTop / rowHeight)};
  }

  /** returns the current number of rows */
  public getRow(): number {
    return this.engine.getRow();
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
    getElements(els).forEach(el => {
      let node = el.gridstackNode;
      if (node!) return;
      node.locked = (val || false);
      if (node.locked) {
        el.setAttribute('data-gs-locked', 'yes');
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
   * grid.makeWidget('gsi-1');
   */
  public makeWidget(els: GridStackElement): HTMLElement {
    let el = getElement(els);
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
    if (isNaN(val)) return;
    getElements(els).forEach(el => {
      let node = el.gridstackNode;
      if (!node) { return; }
      node.maxWidth = (val || undefined);
      if (node.maxWidth) {
        el.setAttribute('data-gs-max-width', String(val));
      } else {
        el.removeAttribute('data-gs-max-width');
      }
    });
    return this;
  }

  /**
   * Set the minWidth for a widget.
   * @param els widget or selector to modify.
   * @param val A numeric value of the number of columns
   */
  public minWidth(els: GridStackElement, val: number): GridStack {
    if (isNaN(val)) return;
    getElements(els).forEach(el => {
      let node = el.gridstackNode;
      if (!node) { return; }
      if (node.minWidth) {
        el.setAttribute('data-gs-min-width', String(val));
      } else {
        el.removeAttribute('data-gs-min-width');
      }
    });
    return this;
  }

  /**
   * Set the maxHeight for a widget.
   * @param els widget or selector to modify.
   * @param val A numeric value of the number of rows
   */
  public maxHeight(els: GridStackElement, val: number): GridStack {
    if (isNaN(val)) return;
    getElements(els).forEach(el => {
      let node = el.gridstackNode;
      if (!node) { return; }
      if (node.maxHeight) {
        el.setAttribute('data-gs-max-height', String(val));
      } else {
        el.removeAttribute('data-gs-max-height');
      }
    });
    return this;
  }

  /**
   * Set the minHeight for a widget.
   * @param els widget or selector to modify.
   * @param val A numeric value of the number of rows
   */
  public minHeight(els: GridStackElement, val: number): GridStack {
    if (isNaN(val)) return;
    getElements(els).forEach(el => {
      let node = el.gridstackNode;
      if (!node) { return; }
      if (node.minHeight) {
        el.setAttribute('data-gs-min-height', String(val));
      } else {
        el.removeAttribute('data-gs-min-height');
      }
    });
    return this;
  }

  /**
   * Enables/Disables moving.
   * @param els widget or selector to modify.
   * @param val if true widget will be draggable.
   */
  public movable(els: GridStackElement, val: boolean): GridStack {
    getElements(els).forEach(el => {
      let node = el.gridstackNode;
      if (!node) { return; }
      node.noMove = !(val || false);
      if (node.noMove) {
        this.dd.draggable(el, 'disable');
        el.classList.remove('ui-draggable-handle');
      } else {
        this.dd.draggable(el, 'enable');
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
  public move(els: GridStackElement, x?: number, y?: number): void {
    this._updateElement(els, (el, node) => {
      x = (x !== undefined) ? x : node.x;
      y = (y !== undefined) ? y : node.y;

      this.engine.moveNode(node, x, y, node.width, node.height);
    });
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
  public on(eventName: GridStackEvent, callback: (event: CustomEvent, arg2?: GridStackNode[] | Record<string, any>, arg3?: Record<string, any>) => void) {
    // check for array of names being passed instead
    if (eventName.indexOf(' ') !== -1) {
      var names = eventName.split(' ') as GridStackEvent[];
      names.forEach(name => this.on(name, callback));
      return;
    }

    if (eventName === 'change' || eventName === 'added' || eventName === 'removed' || eventName === 'enable' || eventName === 'disable') {
      // native CustomEvent handlers - cash the generic handlers so we can remove
      let noData = (eventName === 'enable' || eventName === 'disable');
      this._gsEventHandler = this._gsEventHandler || {};
      if (noData) {
        this._gsEventHandler[eventName] = (event) => callback(event);
      } else {
        this._gsEventHandler[eventName] = (event) => callback(event, event.detail);
      }
      this.el.addEventListener(eventName, this._gsEventHandler[eventName]);
    } else {
      // still JQuery events
      this.$el.on(eventName as any, callback);
    }
  }

  /**
   * unsubscribe from the 'on' event below
   * @param eventName of the event (see possible values)
   */
  public off(eventName: GridStackEvent) {
    // check for array of names being passed instead
    if (eventName.indexOf(' ') !== -1) {
      var names = eventName.split(' ') as GridStackEvent[];
      names.forEach(name => this.off(name));
      return;
    }

    if (eventName === 'change' || eventName === 'added' || eventName === 'removed' || eventName === 'enable' || eventName === 'disable') {
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

  /**
   * Removes widget from the grid.
   * @param el  widget or selector to modify
   * @param detachNode if false DOM node won't be removed from the tree (Default? true).
   */
  public removeWidget(els: GridStackElement, detachNode?: boolean) {
    getElements(els).forEach(el => {
      let node = el.gridstackNode;
      // For Meteor support: https://github.com/gridstack/gridstack.js/pull/272
      if (!node) {
        node = this.engine.nodes.find(n => el === n.el);
      }
      if (!node) return;

      // remove our DOM data (circular link) and drag&drop permanently
      delete el.gridstackNode;
      this.dd.draggable(el, 'destroy').resizable(el, 'destroy');

      this.engine.removeNode(node, detachNode);
    });
    this._triggerRemoveEvent();
    this._triggerChangeEvent();
  }

  /**
   * Removes all widgets from the grid.
   * @param detachNode if false DOM nodes won't be removed from the tree (Default? true).
   */
  public removeAll(detachNode?: boolean) {
    // always remove our DOM data (circular link) before list gets emptied and drag&drop permanently
    this.engine.nodes.forEach(n => {
      delete n.el.gridstackNode;
      this.dd.draggable(n.el, 'destroy').resizable(n.el, 'destroy');
    });
    this.engine.removeAll(detachNode);
    this._triggerRemoveEvent();
  }

  /**
   * Changes widget size
   * @param els  widget or singular selector to modify
   * @param width new dimensions width. If value is null or undefined it will be ignored.
   * @param height  new dimensions height. If value is null or undefined it will be ignored.
   */
  public resize(els: GridStackElement, width?: number, height?: number): void {
    this._updateElement(els, (el, node) => {
      width = (width || node.width);
      height = (height || node.height);

      this.engine.moveNode(node, node.x, node.y, width, height);
    });
  }

  /**
   * Enables/Disables resizing.
   * @param els  widget or selector to modify
   * @param val  if true widget will be resizable.
   */
  public resizable(els: GridStackElement, val: boolean): GridStack {
    getElements(els).forEach(el => {
      let node = el.gridstackNode;
      if (!node) { return; }
      node.noResize = !(val || false);
      if (node.noResize) {
        this.dd.resizable(el, 'disable');
      } else {
        this.dd.resizable(el, 'enable');
      }
    });
    return this;
  }

  /**
   * Toggle the grid animation state.  Toggles the `grid-stack-animate` class.
   * @param doAnimate if true the grid will animate.
   */
  public setAnimation(doAnimate: boolean): void {
    if (doAnimate) {
      this.el.classList.add('grid-stack-animate');
    } else {
      this.el.classList.remove('grid-stack-animate');
    }
  }

  /**
   * Toggle the grid static state. Also toggle the grid-stack-static class.
   * @param staticValue if true the grid become static.
   */
  public setStatic(staticValue: boolean): void {
    this.opts.staticGrid = (staticValue === true);
    this.enableMove(!staticValue);
    this.enableResize(!staticValue);
    this._setStaticClass();
  }

  /**
   * Updates widget position/size.
   * @param els  widget or singular selector to modify
   * @param x new position x. If value is null or undefined it will be ignored.
   * @param y new position y. If value is null or undefined it will be ignored.
   * @param width new dimensions width. If value is null or undefined it will be ignored.
   * @param height  new dimensions height. If value is null or undefined it will be ignored.
   */
  public update(els: GridStackElement, x?: number, y?: number, width?: number, height?: number): void {
    this._updateElement(els, (el, node) => {
      x = (x !== undefined) ? x : node.x;
      y = (y !== undefined) ? y : node.y;
      width = (width || node.width);
      height = (height || node.height);

      this.engine.moveNode(node, x, y, width, height);
    });
  }

  /**
   * Updates the vertical margin - see `GridstackOptions.verticalMargin` for format options.
   *
   * @param value new vertical margin value
   * @param noUpdate (optional) if true, styles will not be updated
   */
  public verticalMargin(value: numberOrString, noUpdate?: boolean): void {
    let heightData = Utils.parseHeight(value);

    if (this.opts.verticalMarginUnit === heightData.unit && this.opts.maxRow === heightData.height) {
      return ;
    }
    this.opts.verticalMarginUnit = heightData.unit;
    this.opts.verticalMargin = heightData.height;

    if (!noUpdate) {
      this._updateStyles();
    }
  }

  /**
   * returns current vertical margin value
   */
  public getVerticalMargin(): number { return this.opts.verticalMargin as number; }

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
   * if (grid.willItFit(newNode.x, newNode.y, newNode.width, newNode.height, true)) {
   *   grid.addWidget(newNode.el, newNode.x, newNode.y, newNode.width, newNode.height, true);
   * } else {
   *   alert('Not enough free space to place the widget');
   * }
   */
  public willItFit(x: number, y: number, width: number, height: number, autoPosition: boolean): boolean {
    let node = {x: x, y: y, width: width, height: height, autoPosition: autoPosition};
    return this.engine.canBePlacedWithRespectToHeight(node);
  }

  private _triggerChangeEvent(skipLayoutChange?: boolean): void {
    if (this.engine.batchMode) { return; }
    let elements = this.engine.getDirtyNodes(true); // verify they really changed
    if (elements && elements.length) {
      if (!skipLayoutChange) {
        this.engine._layoutsNodesChange(elements);
      }
      this._triggerEvent('change', elements);
    }
    this.engine._saveInitial(); // we called, now reset initial values & dirty flags
  }

  private _triggerAddEvent() {
    if (this.engine.batchMode) { return; }
    if (this.engine.addedNodes && this.engine.addedNodes.length > 0) {
      this.engine._layoutsNodesChange(this.engine.addedNodes);
      // prevent added nodes from also triggering 'change' event (which is called next)
      this.engine.addedNodes.forEach(n => { delete n._dirty; });
      this._triggerEvent('added', this.engine.addedNodes);
      this.engine.addedNodes = [];
    }
  }

  private _triggerRemoveEvent() {
    if (this.engine.batchMode) { return; }
    if (this.engine.removedNodes && this.engine.removedNodes.length > 0) {
      this._triggerEvent('removed', this.engine.removedNodes);
      this.engine.removedNodes = [];
    }
  }

  private _triggerEvent(name: string, data?: any) {
    let event = data ? new CustomEvent(name, {bubbles: false, detail: data}) : new Event(name);
    this.el.dispatchEvent(event);
  }

  private _initStyles() {
    if (this._stylesId) {
      Utils.removeStylesheet(this._stylesId);
    }
    this._stylesId = 'gridstack-style-' + (Math.random() * 100000).toFixed();
    // insert style to parent (instead of 'head') to support WebComponent
    let parent = this.el.parentNode as HTMLElement;
    this._styles = Utils.createStylesheet(this._stylesId, parent);
    if (this._styles !== null) {
      this._styles._max = 0;
    }
  }

  private _updateStyles(maxHeight?: number) {
    if (this._styles === null || this._styles === undefined) {
      return;
    }

    let prefix = '.' + this.opts._class + ' .' + this.opts.itemClass;
    let getHeight;

    if (maxHeight === undefined) {
      maxHeight = this._styles._max;
    }

    this._initStyles();
    this._updateContainerHeight();
    if (!this.opts.cellHeight) { // The rest will be handled by CSS
      return ;
    }
    if (this._styles._max !== 0 && maxHeight <= this._styles._max) { // Keep it increasing
      return ;
    }
    let height = this.opts.cellHeight as number;
    let margin = this.opts.verticalMargin as number;

    if (!this.opts.verticalMargin || this.opts.cellHeightUnit === this.opts.verticalMarginUnit) {
      getHeight = (nbRows, nbMargins) => {
        return (height * nbRows + margin * nbMargins) + this.opts.cellHeightUnit;
      }
    } else {
      getHeight = (nbRows, nbMargins) => {
        if (!nbRows || !nbMargins) {
          return (height * nbRows + margin * nbMargins) + this.opts.cellHeightUnit;
        }
        return 'calc(' + ((height * nbRows) + this.opts.cellHeightUnit) + ' + ' +
          ((margin * nbMargins) + this.opts.verticalMarginUnit) + ')';
      }
    }

    if (this._styles._max === 0) {
      Utils.insertCSSRule(this._styles, prefix, 'min-height: ' + getHeight(1, 0) + ';', 0);
    }

    if (maxHeight > this._styles._max) {
      for (let i = this._styles._max; i < maxHeight; ++i) {
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
  }

  private _updateContainerHeight() {
    if (this.engine.batchMode) { return; }
    let row = this.engine.getRow();
    if (row < this.opts.minRow) {
      row = this.opts.minRow;
    }
    // check for css min height. Each row is cellHeight + verticalMargin, until last one which has no margin below
    let cssMinHeight = parseInt(getComputedStyle(this.el)['min-height']);
    if (cssMinHeight > 0) {
      let verticalMargin = this.opts.verticalMargin as number;
      let minRow =  Math.round((cssMinHeight + verticalMargin) / (this.getCellHeight() + verticalMargin));
      if (row < minRow) {
        row = minRow;
      }
    }
    this.el.setAttribute('data-gs-current-row', String(row));
    if (row === 0) {
      this.el.style.removeProperty('height');
      return;
    }
    let cellHeight = this.opts.cellHeight as number;
    let vMargin = this.opts.verticalMargin as number;
    let unit = this.opts.cellHeightUnit;
    if (!cellHeight) {  return }

    if (unit === this.opts.verticalMarginUnit) {
      this.el.style.height = (row * (cellHeight + vMargin) - vMargin) + unit;
    } else {
      this.el.style.height = 'calc(' + (row * cellHeight) + unit +
        ' + ' + (row * (vMargin - 1) + this.opts.verticalMarginUnit) + ')';
    }
  }

  private _setupRemovingTimeout(el: GridItemHTMLElement) {
    let node = el.gridstackNode;
    if (node._removeTimeout || !this.opts.removable) { return; }
    node._removeTimeout = setTimeout(() => {
      el.classList.add('grid-stack-item-removing');
      node._isAboutToRemove = true;
    }, this.opts.removeTimeout);
  }

  private _clearRemovingTimeout(el: GridItemHTMLElement) {
    let node = el.gridstackNode;
    if (!node._removeTimeout) { return; }
    clearTimeout(node._removeTimeout);
    node._removeTimeout = null;
    el.classList.remove('grid-stack-item-removing');
    node._isAboutToRemove = false;
  }

  /**
   * prepares the element for drag&drop
   **/
  private _prepareElementsByNode(el: GridItemHTMLElement, node: GridStackNode) {
    // variables used/cashed between the 3 start/move/end methods, in addition to node passed above
    let cellWidth;
    let cellFullHeight; // internal cellHeight + v-margin

    /** called when item starts moving/resizing */
    let onStartMoving = (event, ui) => {
      this.engine.cleanNodes();
      this.engine.beginUpdate(node);
      cellWidth = this.cellWidth();
      let strictCellHeight = this.getCellHeight(); // heigh without v-margin
      // compute height with v-margin (Note: we add 1 margin as last row is missing it)
      cellFullHeight = (this.$el.height() + this.getVerticalMargin()) / parseInt(this.el.getAttribute('data-gs-current-row'));

      let { target } = event;

      this.placeholder.setAttribute('data-gs-x', target.getAttribute('data-gs-x'));
      this.placeholder.setAttribute('data-gs-y', target.getAttribute('data-gs-y'));
      this.placeholder.setAttribute('data-gs-width', target.getAttribute('data-gs-width'));
      this.placeholder.setAttribute('data-gs-height', target.getAttribute('data-gs-height'));
      this.el.append(this.placeholder);

      node.el = this.placeholder;
      node._beforeDragX = node.x;
      node._beforeDragY = node.y;
      node._prevYPix = ui.position.top;
      let minHeight = (node.minHeight || 1);
      let verticalMargin = this.opts.verticalMargin as number;

      // mineHeight - Each row is cellHeight + verticalMargin, until last one which has no margin below
      this.dd.resizable(el, 'option', 'minWidth', cellWidth * (node.minWidth || 1));
      this.dd.resizable(el, 'option', 'minHeight', (strictCellHeight * minHeight) + (minHeight - 1) * verticalMargin);

      if (event.type === 'resizestart') {
        let itemElement = target.querySelector('.grid-stack-item') as HTMLElement;
        if (itemElement) {
          let ev = document.createEvent('HTMLEvents');
          ev.initEvent('resizestart', true, false);
          itemElement.dispatchEvent(event);
        }
      }
    }

    /** called when item is being dragged/resized */
    let dragOrResize = (event, ui) => {
      let x = Math.round(ui.position.left / cellWidth);
      let y = Math.floor((ui.position.top + cellFullHeight / 2) / cellFullHeight);
      let width;
      let height;

      if (event.type === 'drag') {
        let distance = ui.position.top - node._prevYPix;
        node._prevYPix = ui.position.top;
        Utils.updateScrollPosition(el, ui, distance);
        if (el.dataset.inTrashZone || x < 0 || x >= this.engine.column || y < 0 ||
          (!this.engine.float && y > this.engine.getRow())) {
          if (!node._temporaryRemoved) {
            if (this.opts.removable === true) {
              this._setupRemovingTimeout(el);
            }

            x = node._beforeDragX;
            y = node._beforeDragY;

            if (this.placeholder.parentNode === this.el) { this.el.removeChild(this.placeholder) }
            this.engine.removeNode(node);
            this._updateContainerHeight();

            node._temporaryRemoved = true;
          } else {
            return;
          }
        } else {
          this._clearRemovingTimeout(el);

          if (node._temporaryRemoved) {
            this.engine.addNode(node);
            this._writeAttrs(this.placeholder, x, y, width, height);
            this.el.appendChild(this.placeholder);
            node.el = this.placeholder;
            node._temporaryRemoved = false;
          }
        }
      } else if (event.type === 'resize')  {
        if (x < 0) return;
        width = Math.round(ui.size.width / cellWidth);
        height = Math.round((ui.size.height + this.getVerticalMargin()) / cellFullHeight);
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

      if (event.type === 'resize')  {
        $(event.target).trigger('gsresize', node);
      }
    }

    /** called when the item stops moving/resizing */
    let onEndMoving = (event): void => {
      let { target } = event;
      if (!target.gridstackNode) {  return; }

      // let forceNotify = false; what is the point of calling 'change' event with no data, when the 'removed' event is already called ?
      if (this.placeholder.parentNode === this.el) { this.el.removeChild(this.placeholder) }
      node.el = target;

      if (node._isAboutToRemove) {
        // forceNotify = true;
        let gridToNotify = el.gridstackNode._grid;
        gridToNotify._triggerRemoveEvent();
        delete el.gridstackNode;
        el.remove();
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
          node._temporaryRemoved = false;
          this.engine.addNode(node);
        }
      }

      this._updateContainerHeight();
      this._triggerChangeEvent();

      this.engine.endUpdate();

      let nestedGrids = target.querySelectorAll('.grid-stack');
      if (nestedGrids.length && event.type === 'resizestop') {
        nestedGrids.each((index, el: GridHTMLElement) => {
          el.gridstack.onResizeHandler();
        });

        this._triggerNativeEvent(target, '.grid-stack-item', 'resizestop');
        this._triggerNativeEvent(target, '.grid-stack-item', 'gsresizestop');
      }

      if (event.type === 'resizestop') {
        // this.$el.trigger('gsresizestop', o); TODO: missing target ?
        this._triggerNativeEvent(this.el, null, 'gsresizestop');
      }
    }

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
  }

  _triggerNativeEvent(el: HTMLElement, selector: string, eventName: string): void {
    let elements = el.querySelectorAll(selector);
    if (elements.length) {
      let event = document.createEvent('HTMLEvents');
      event.initEvent(eventName, true, false);

      Array.from(elements).map(x => x.dispatchEvent(event));
    }
  }

  private _prepareElement(el: GridItemHTMLElement, triggerAddEvent?: boolean): void {
    triggerAddEvent = (triggerAddEvent !== undefined ? triggerAddEvent : false);

    el.classList.add(this.opts.itemClass);
    let node = this._readAttr(el, { el: el, _grid: this });
    node = this.engine.addNode(node, triggerAddEvent);
    el.gridstackNode = node;

    this._prepareElementsByNode(el, node);
  }

  /** call to write x,y,w,h attributes back to element */
  private _writeAttrs(el: HTMLElement, x?: number, y?: number, width?: number, height?: number): void {
    if (x !== undefined && x !== null) { el.setAttribute('data-gs-x', String(x)); }
    if (y !== undefined && y !== null) { el.setAttribute('data-gs-y', String(y)); }
    if (width) { el.setAttribute('data-gs-width', String(width)); }
    if (height) { el.setAttribute('data-gs-height', String(height)); }
  }

  /** call to write any default attributes back to element */
  private _writeAttr(el: HTMLElement, node: GridstackWidget = {}): void {
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
  }

  /** call to write any default attributes back to element */
  private _readAttr(el: HTMLElement, node: GridStackNode = {}): GridstackWidget {
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

  private _updateElement(els: GridStackElement, callback: (el:GridItemHTMLElement, node: GridStackNode) => void): void {
    let el = getElement(els);
    if (!el) { return; }
    let node = el.gridstackNode;
    if (!node) { return; }

    this.engine.cleanNodes();
    this.engine.beginUpdate(node);

    callback.call(this, el, node);

    this._updateContainerHeight();
    this._triggerChangeEvent();

    this.engine.endUpdate();
  }

  private _setStaticClass() {
    let staticClassName = 'grid-stack-static';

    if (this.opts.staticGrid === true) {
      this.el.classList.add(staticClassName);
    } else {
      this.el.classList.remove(staticClassName);
    }
  }

  /**
   * called when we are being resized - check if the one Column Mode needs to be turned on/off
   * and remember the prev columns we used.
   */
  public onResizeHandler() {
    if (this.isAutoCellHeight) {
      Utils.throttle(() => { this.cellHeight(this.cellWidth(), false)}, 100);
    }

    if (this.opts.staticGrid) { return; }

    if (!this.opts.disableOneColumnMode &&
      (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) <= this.opts.minWidth) {
      if (this.oneColumnMode) {  return; }
      this.oneColumnMode = true;
      this.column(1);
    } else {
      if (!this.oneColumnMode) { return; }
      this.oneColumnMode = false;
      this.column(this._prevColumn);
    }
  }

  /** called to add drag over support to support widgets */
  private setupAcceptWidget() {
    if (this.opts.staticGrid || !this.opts.acceptWidgets) return;

    // vars used by the function callback
    let draggingElement: GridItemHTMLElement;

    let onDrag = (event, ui) => {
      let el = draggingElement;
      let node = el.gridstackNode;
      let pos = this.getCellFromPixel({left: event.pageX, top: event.pageY}, true);
      let x = Math.max(0, pos.x);
      let y = Math.max(0, pos.y);
      if (!node._added) {
        node._added = true;

        node.el = el;
        node.autoPosition = true;
        node.x = x;
        node.y = y;
        this.engine.cleanNodes();
        this.engine.beginUpdate(node);
        this.engine.addNode(node);

        this._writeAttrs(this.placeholder, node.x, node.y, node.width, node.height);
        this.el.appendChild(this.placeholder);
        node.el = this.placeholder;
        node._beforeDragX = node.x;
        node._beforeDragY = node.y;

        this._updateContainerHeight();
      }
      if (!this.engine.canMoveNode(node, x, y)) {
        return;
      }
      this.engine.moveNode(node, x, y);
      this._updateContainerHeight();
    };

    this.dd
      .droppable(this.el, {
        accept: ($el) => { // TODO: jquery
          let el: GridItemHTMLElement = $el.get(0);
          let node: GridStackNode = el.gridstackNode;
          if (node && node._grid === this) {
            return false;
          }
          if (typeof this.opts.acceptWidgets === 'function') {
            return this.opts.acceptWidgets(el);
          }
          let selector = (this.opts.acceptWidgets === true ? '.grid-stack-item' : this.opts.acceptWidgets as string);
          return el.matches(selector);
        }
      })
      .on(this.el, 'dropover', (event, ui) => {
        let el: GridItemHTMLElement = ui.draggable.get(0);
        let width, height;

        // see if we already have a node with widget/height and check for attributes
        let origNode: GridStackNode = el.gridstackNode;
        if (!origNode || !origNode.width || !origNode.height) {
          let w = parseInt(el.getAttribute('data-gs-width'));
          if (w > 0) { origNode = origNode || {}; origNode.width = w; }
          let h = parseInt(el.getAttribute('data-gs-height'));
          if (h > 0) { origNode = origNode || {}; origNode.height = h; }
        }

        // if not calculate the grid size based on element outer size
        // height: Each row is cellHeight + verticalMargin, until last one which has no margin below
        let cellWidth = this.cellWidth();
        let cellHeight = this.getCellHeight();
        let verticalMargin = this.opts.verticalMargin as number;
        width = origNode && origNode.width ? origNode.width : Math.ceil(el.offsetWidth / cellWidth);
        height = origNode && origNode.height ? origNode.height : Math.round((el.offsetHeight + verticalMargin) / (cellHeight + verticalMargin));

        draggingElement = el;

        let node = this.engine._prepareNode({width: width, height: height, _added: false, _temporary: true});
        node._isOutOfGrid = true;
        el.gridstackNode = node;
        el._gridstackNodeOrig = origNode;

        $(el).on('drag', onDrag);
        return false; // prevent parent from receiving msg (which may be grid as well)
      })
      .on(this.el, 'dropout', (event, ui) => {
        // jquery-ui bug. Must verify widget is being dropped out
        // check node variable that gets set when widget is out of grid
        let el: GridItemHTMLElement = ui.draggable.get(0);
        let node = el.gridstackNode;
        if (!node || !node._isOutOfGrid) {
          return;
        }
        $(el).unbind('drag', onDrag);
        node.el = null;
        this.engine.removeNode(node);
        if (this.placeholder.parentNode === this.el) {
          this.el.removeChild(this.placeholder);
        }
        this._updateContainerHeight();
        el.gridstackNode = el._gridstackNodeOrig;
        return false; // prevent parent from receiving msg (which may be grid as well)
      })
      .on(this.el, 'drop', (event, ui) => {
        if (this.placeholder.parentNode === this.el) {
          this.el.removeChild(this.placeholder);
        }
        let el: GridItemHTMLElement = ui.draggable.get(0);
        let node: GridStackNode = el.gridstackNode;
        delete node._isOutOfGrid;
        node._grid = this;

        let $el = ui.draggable.clone(false);

        el = $el.get(0);
        el.gridstackNode = node;
        let originalNode = (ui.draggable.get(0) as GridItemHTMLElement)._gridstackNodeOrig;
        if (originalNode && originalNode._grid) {
          originalNode._grid._triggerRemoveEvent();
        }
        $(ui.helper).remove();
        node.el = el;
        Utils.removePositioningStyles(el);
        $el.find('div.ui-resizable-handle').remove();

        $el
          .attr('data-gs-x', node.x)
          .attr('data-gs-y', node.y)
          .attr('data-gs-width', node.width)
          .attr('data-gs-height', node.height)
          .addClass(this.opts.itemClass)
          .enableSelection()
          .removeData('draggable')
          .removeClass('ui-draggable ui-draggable-dragging ui-draggable-disabled')
          .unbind('drag', onDrag);
        this.$el.append(el);
        this._prepareElementsByNode(el, node);
        this._updateContainerHeight();
        this.engine.addedNodes.push(node);
        this._triggerAddEvent();
        this._triggerChangeEvent();

        this.engine.endUpdate();
        ui.draggable.unbind('drag', onDrag);
        delete ui.draggable.get(0).gridstackNode;
        delete ui.draggable.get(0)._gridstackNodeOrig;
        this.$el.trigger('dropped', [originalNode, node]);
        return false; // prevent parent from receiving msg (which may be grid as well)
      });
  }

  // legacy method renames
  private setGridWidth = obsolete(GridStack.prototype.column, 'setGridWidth', 'column', 'v0.5.3');
  private setColumn = obsolete(GridStack.prototype.column, 'setColumn', 'column', 'v0.6.4');
}
