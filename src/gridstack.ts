/*!
 * GridStack 7.1.1-dev
 * https://gridstackjs.com/
 *
 * Copyright (c) 2021-2022 Alain Dumesny
 * see root license https://github.com/gridstack/gridstack.js/tree/master/LICENSE
 */
import { GridStackEngine } from './gridstack-engine';
import { Utils, HeightData, obsolete } from './utils';
import { gridDefaults, ColumnOptions, GridItemHTMLElement, GridStackElement, GridStackEventHandlerCallback,
  GridStackNode, GridStackWidget, numberOrString, DDUIData, DDDragInOpt, GridStackPosition, GridStackOptions, dragInDefaultOptions } from './types';

/*
 * and include D&D by default
 * TODO: while we could generate a gridstack-static.js at smaller size - saves about 31k (41k -> 72k)
 * I don't know how to generate the DD only code at the remaining 31k to delay load as code depends on Gridstack.ts
 * also it caused loading issues in prod - see https://github.com/gridstack/gridstack.js/issues/2039
 */
import { DDGridStack } from './dd-gridstack';
import { isTouch } from './dd-touch';
import { DDManager } from './dd-manager';
import { DDElementHost } from './dd-element';
/** global instance */
const dd = new DDGridStack;

// export all dependent file as well to make it easier for users to just import the main file
export * from './types';
export * from './utils';
export * from './gridstack-engine';
export * from './dd-gridstack';

export interface GridHTMLElement extends HTMLElement {
  gridstack?: GridStack; // grid's parent DOM element points back to grid class
}
/** list of possible events, or space separated list of them */
export type GridStackEvent = 'added' | 'change' | 'disable' | 'drag' | 'dragstart' | 'dragstop' | 'dropped' |
  'enable' | 'removed' | 'resize' | 'resizestart' | 'resizestop' | string;

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

/** optional function called during load() to callback the user on new added/remove items */
export type AddRemoveFcn = (g: GridStack, w: GridStackWidget, add: boolean) => GridItemHTMLElement;

interface GridCSSStyleSheet extends CSSStyleSheet {
  _max?: number; // internal tracker of the max # of rows we created
}

// extend with internal fields we need - TODO: move other items in here
interface InternalGridStackOptions extends GridStackOptions {
  _alwaysShowResizeHandle?: true | false | 'mobile'; // so we can restore for save
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

  /**
   * initializing the HTML element, or selector string, into a grid will return the grid. Calling it again will
   * simply return the existing instance (ignore any passed options). There is also an initAll() version that support
   * multiple grids initialization at once. Or you can use addGrid() to create the entire grid from JSON.
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
      el.gridstack = new GridStack(el, Utils.cloneDeep(options));
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
        el.gridstack = new GridStack(el, Utils.cloneDeep(options));
        delete options.dragIn; delete options.dragInOptions; // only need to be done once (really a static global thing, not per grid)
      }
      grids.push(el.gridstack);
    });
    if (grids.length === 0) {
      console.error('GridStack.initAll() no grid was found with selector "' + selector + '" - element missing or wrong selector ?' +
      '\nNote: ".grid-stack" is required for proper CSS styling and drag/drop, and is the default selector.');
    }
    return grids;
  }

  /**
   * call to create a grid with the given options, including loading any children from JSON structure. This will call GridStack.init(), then
   * grid.load() on any passed children (recursively). Great alternative to calling init() if you want entire grid to come from
   * JSON serialized data, including options.
   * @param parent HTML element parent to the grid
   * @param opt grids options used to initialize the grid, and list of children
   */
  public static addGrid(parent: HTMLElement, opt: GridStackOptions = {}): GridStack {
    if (!parent) return null;

    // create the grid element, but check if the passed 'parent' already has grid styling and should be used instead
    let el = parent;
    if (!parent.classList.contains('grid-stack')) {
      let doc = document.implementation.createHTMLDocument(''); // IE needs a param
      doc.body.innerHTML = `<div class="grid-stack ${opt.class || ''}"></div>`;
      el = doc.body.children[0] as HTMLElement;
      parent.appendChild(el);
    }

    // create grid class and load any children
    let grid = GridStack.init(opt, el);
    if (grid.opts.children) {
      let children = grid.opts.children;
      delete grid.opts.children;
      grid.load(children);
    }
    return grid;
  }

  /** call this method to register your engine instead of the default one.
   * See instead `GridStackOptions.engineClass` if you only need to
   * replace just one instance.
   */
  static registerEngine(engineClass: typeof GridStackEngine): void {
    GridStack.engineClass = engineClass;
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

  /** point to a parent grid item if we're nested (inside a grid-item in between 2 Grids) */
  public parentGridItem?: GridStackNode;

  protected static engineClass: typeof GridStackEngine;

  /** @internal unique class name for our generated CSS style sheet */
  protected _styleSheetClass?: string;
  /** @internal true if we got created by drag over gesture, so we can removed on drag out (temporary) */
  public _isTemp?: boolean;


  /** @internal create placeholder DIV as needed */
  public get placeholder(): HTMLElement {
    if (!this._placeholder) {
      let placeholderChild = document.createElement('div'); // child so padding match item-content
      placeholderChild.className = 'placeholder-content';
      if (this.opts.placeholderText) {
        placeholderChild.innerHTML = this.opts.placeholderText;
      }
      this._placeholder = document.createElement('div');
      this._placeholder.classList.add(this.opts.placeholderClass, gridDefaults.itemClass, this.opts.itemClass);
      this.placeholder.appendChild(placeholderChild);
    }
    return this._placeholder;
  }
  /** @internal */
  protected _placeholder: HTMLElement;
  /** @internal */
  protected _prevColumn: number;
  /** @internal prevent cached layouts from being updated when loading into small column layouts */
  protected _ignoreLayoutsNodeChange: boolean;
  /** @internal */
  public _gsEventHandler = {};
  /** @internal */
  protected _styles: GridCSSStyleSheet;
  /** @internal flag to keep cells square during resize */
  protected _isAutoCellHeight: boolean;
  /** @internal track event binding to window resize so we can remove */
  protected _windowResizeBind: () => void;
  /** @internal limit auto cell resizing method */
  protected _cellHeightThrottle: () => void;
  /** @internal true when loading items to insert first rather than append */
  protected _insertNotAppend: boolean;
  /** @internal extra row added when dragging at the bottom of the grid */
  protected _extraDragRow = 0;
  /** @internal true if nested grid should get column count from our width */
  protected _autoColumn?: boolean;

  /**
   * Construct a grid item from the given element and options
   * @param el
   * @param opts
   */
  public constructor(el: GridHTMLElement, opts: GridStackOptions = {}) {
    this.el = el; // exposed HTML element to the user
    opts = opts || {}; // handles null/undefined/0

    // if row property exists, replace minRow and maxRow instead
    if (opts.row) {
      opts.minRow = opts.maxRow = opts.row;
      delete opts.row;
    }
    let rowAttr = Utils.toNumber(el.getAttribute('gs-row'));

    // flag only valid in sub-grids (handled by parent, not here)
    if (opts.column === 'auto') {
      delete opts.column;
    }
    // 'minWidth' legacy support in 5.1
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    let anyOpts = opts as any;
    if (anyOpts.minWidth !== undefined) {
      opts.oneColumnSize = opts.oneColumnSize || anyOpts.minWidth;
      delete anyOpts.minWidth;
    }
    // save original setting so we can restore on save
    if (opts.alwaysShowResizeHandle !== undefined) {
      (opts as InternalGridStackOptions)._alwaysShowResizeHandle = opts.alwaysShowResizeHandle;
    }

    // elements DOM attributes override any passed options (like CSS style) - merge the two together
    let defaults: GridStackOptions = {...Utils.cloneDeep(gridDefaults),
      column: Utils.toNumber(el.getAttribute('gs-column')) || gridDefaults.column,
      minRow: rowAttr ? rowAttr : Utils.toNumber(el.getAttribute('gs-min-row')) || gridDefaults.minRow,
      maxRow: rowAttr ? rowAttr : Utils.toNumber(el.getAttribute('gs-max-row')) || gridDefaults.maxRow,
      staticGrid: Utils.toBool(el.getAttribute('gs-static')) || gridDefaults.staticGrid,
      draggable: {
        handle: (opts.handleClass ? '.' + opts.handleClass : (opts.handle ? opts.handle : '')) || gridDefaults.draggable.handle,
      },
      removableOptions: {
        accept: opts.itemClass ? '.' + opts.itemClass : gridDefaults.removableOptions.accept,
      },
    };
    if (el.getAttribute('gs-animate')) { // default to true, but if set to false use that instead
      defaults.animate = Utils.toBool(el.getAttribute('gs-animate'))
    }

    this.opts = Utils.defaults(opts, defaults);
    opts = null; // make sure we use this.opts instead
    this._initMargin(); // part of settings defaults...

    // Now check if we're loading into 1 column mode FIRST so we don't do un-necessary work (like cellHeight = width / 12 then go 1 column)
    if (this.opts.column !== 1 && !this.opts.disableOneColumnMode && this._widthOrContainer() <= this.opts.oneColumnSize) {
      this._prevColumn = this.getColumn();
      this.opts.column = 1;
    }

    if (this.opts.rtl === 'auto') {
      this.opts.rtl = (el.style.direction === 'rtl');
    }
    if (this.opts.rtl) {
      this.el.classList.add('grid-stack-rtl');
    }

    // check if we're been nested, and if so update our style and keep pointer around (used during save)
    let parentGridItem = (Utils.closestUpByClass(this.el, gridDefaults.itemClass) as GridItemHTMLElement)?.gridstackNode;
    if (parentGridItem) {
      parentGridItem.subGrid = this;
      this.parentGridItem = parentGridItem;
      this.el.classList.add('grid-stack-nested');
      parentGridItem.el.classList.add('grid-stack-sub-grid');
    }

    this._isAutoCellHeight = (this.opts.cellHeight === 'auto');
    if (this._isAutoCellHeight || this.opts.cellHeight === 'initial') {
      // make the cell content square initially (will use resize/column event to keep it square)
      this.cellHeight(undefined, false);
    } else {
      // append unit if any are set
      if (typeof this.opts.cellHeight == 'number' && this.opts.cellHeightUnit && this.opts.cellHeightUnit !== gridDefaults.cellHeightUnit) {
        this.opts.cellHeight = this.opts.cellHeight + this.opts.cellHeightUnit;
        delete this.opts.cellHeightUnit;
      }
      this.cellHeight(this.opts.cellHeight, false);
    }

    // see if we need to adjust auto-hide
    if (this.opts.alwaysShowResizeHandle === 'mobile') {
      this.opts.alwaysShowResizeHandle = isTouch;
    }

    this._styleSheetClass = 'grid-stack-instance-' + GridStackEngine._idSeq++;
    this.el.classList.add(this._styleSheetClass);

    this._setStaticClass();

    let engineClass = this.opts.engineClass || GridStack.engineClass || GridStackEngine;
    this.engine = new engineClass({
      column: this.getColumn(),
      float: this.opts.float,
      maxRow: this.opts.maxRow,
      onChange: (cbNodes) => {
        let maxH = 0;
        this.engine.nodes.forEach(n => { maxH = Math.max(maxH, n.y + n.h) });
        cbNodes.forEach(n => {
          let el = n.el;
          if (!el) return;
          if (n._removeDOM) {
            if (el) el.remove();
            delete n._removeDOM;
          } else {
            this._writePosAttr(el, n);
          }
        });
        this._updateStyles(false, maxH); // false = don't recreate, just append if need be
      }
    });

    if (this.opts.auto) {
      this.batchUpdate(); // prevent in between re-layout #1535 TODO: this only set float=true, need to prevent collision check...
      let elements: {el: HTMLElement; i: number}[] = [];
      let column = this.getColumn();
      if (column === 1 && this._prevColumn) column = this._prevColumn; // do 12 column when reading into 1 column mode
      this.getGridItems().forEach(el => { // get dom elements (not nodes yet)
        let x = parseInt(el.getAttribute('gs-x'));
        let y = parseInt(el.getAttribute('gs-y'));
        elements.push({
          el,
          // if x,y are missing (autoPosition) add them to end of list - but keep their respective DOM order
          i: (Number.isNaN(x) ? 1000 : x) + (Number.isNaN(y) ? 1000 : y) * column
        });
      });
      elements.sort((a, b) => b.i - a.i).forEach(e => this._prepareElement(e.el)); // revert sort so lowest item wins
      this.batchUpdate(false);
    }

    this.setAnimation(this.opts.animate);

    this._updateStyles();
    if (this.opts.column != 12) {
      this.el.classList.add('grid-stack-' + this.opts.column);
    }

    // legacy support to appear 'per grid` options when really global.
    if (this.opts.dragIn) GridStack.setupDragIn(this.opts.dragIn, this.opts.dragInOptions);
    delete this.opts.dragIn;
    delete this.opts.dragInOptions;

    // dynamic grids require pausing during drag to detect over to nest vs push
    if (this.opts.subGridDynamic && !DDManager.pauseDrag) DDManager.pauseDrag = true;
    if (this.opts.draggable?.pause !== undefined) DDManager.pauseDrag = this.opts.draggable.pause;

    this._setupRemoveDrop();
    this._setupAcceptWidget();
    this._updateWindowResizeEvent();
  }

  /**
   * add a new widget and returns it.
   *
   * Widget will be always placed even if result height is more than actual grid height.
   * You need to use `willItFit()` before calling addWidget for additional check.
   * See also `makeWidget()`.
   *
   * @example
   * let grid = GridStack.init();
   * grid.addWidget({w: 3, content: 'hello'});
   * grid.addWidget('<div class="grid-stack-item"><div class="grid-stack-item-content">hello</div></div>', {w: 3});
   *
   * @param el  GridStackWidget (which can have content string as well), html element, or string definition to add
   * @param options widget position/size options (optional, and ignore if first param is already option) - see GridStackWidget
   */
  public addWidget(els?: GridStackWidget | GridStackElement, options?: GridStackWidget): GridItemHTMLElement {
    function isGridStackWidget(w: GridStackWidget): w is GridStackWidget { // https://medium.com/ovrsea/checking-the-type-of-an-object-in-typescript-the-type-guards-24d98d9119b0
      return w.x !== undefined || w.y !== undefined || w.w !== undefined || w.h !== undefined || w.content !== undefined ? true : false;
    }

    let el: HTMLElement;
    if (typeof els === 'string') {
      let doc = document.implementation.createHTMLDocument(''); // IE needs a param
      doc.body.innerHTML = els;
      el = doc.body.children[0] as HTMLElement;
    } else if (arguments.length === 0 || arguments.length === 1 && isGridStackWidget(els)) {
      let content = els ? (els as GridStackWidget).content || '' : '';
      options = els;
      let doc = document.implementation.createHTMLDocument(''); // IE needs a param
      doc.body.innerHTML = `<div class="grid-stack-item ${this.opts.itemClass || ''}"><div class="grid-stack-item-content">${content}</div></div>`;
      el = doc.body.children[0] as HTMLElement;
    } else {
      el = els as HTMLElement;
    }

    // Tempting to initialize the passed in opt with default and valid values, but this break knockout demos
    // as the actual value are filled in when _prepareElement() calls el.getAttribute('gs-xyz) before adding the node.
    // So make sure we load any DOM attributes that are not specified in passed in options (which override)
    let domAttr = this._readAttr(el);
    options = Utils.cloneDeep(options) || {};  // make a copy before we modify in case caller re-uses it
    Utils.defaults(options, domAttr);
    let node = this.engine.prepareNode(options);
    this._writeAttr(el, options);

    if (this._insertNotAppend) {
      this.el.prepend(el);
    } else {
      this.el.appendChild(el);
    }

    // similar to makeWidget() that doesn't read attr again and worse re-create a new node and loose any _id
    this._prepareElement(el, true, options);
    this._updateContainerHeight();

    // see if there is a sub-grid to create too
    if (node.subGrid) {
      this.makeSubGrid(node.el, undefined, undefined, false);
    }

    // if we're adding an item into 1 column (_prevColumn is set only when going to 1) make sure
    // we don't override the larger 12 column layout that was already saved. #1985
    if (this._prevColumn && this.opts.column === 1) {
      this._ignoreLayoutsNodeChange = true;
    }
    this._triggerAddEvent();
    this._triggerChangeEvent();
    delete this._ignoreLayoutsNodeChange;

    return el;
  }

  /**
   * Convert an existing gridItem element into a sub-grid with the given (optional) options, else inherit them
   * from the parent subGrid options.
   * @param el gridItem element to convert
   * @param ops (optional) sub-grid options, else default to node, then parent settings, else defaults
   * @param nodeToAdd (optional) node to add to the newly created sub grid (used when dragging over existing regular item)
   * @returns newly created grid
   */
  public makeSubGrid(el: GridItemHTMLElement, ops?: GridStackOptions, nodeToAdd?: GridStackNode, saveContent = true): GridStack {
    let node = el.gridstackNode;
    if (!node) {
      node = this.makeWidget(el).gridstackNode;
    }
    if ((node.subGrid as GridStack)?.el) return node.subGrid as GridStack; // already done

    ops = Utils.cloneDeep(ops || node.subGrid as GridStackOptions || {...this.opts.subGrid, children: undefined});
    ops.subGrid = Utils.cloneDeep(ops); // carry nesting settings to next one down
    node.subGrid = ops;

    // if column special case it set, remember that flag and set default
    let autoColumn: boolean;
    if (ops.column === 'auto') {
      autoColumn = true;
      ops.column = Math.max(node.w || 1, nodeToAdd?.w || 1);
      ops.disableOneColumnMode = true; // driven by parent
    }

    // if we're converting an existing full item, move over the content to be the first sub item in the new grid
    let content = node.el.querySelector('.grid-stack-item-content') as HTMLElement;
    let newItem: HTMLElement;
    let newItemOpt: GridStackNode;
    if (saveContent) {
      this._removeDD(node.el); // remove D&D since it's set on content div
      let doc = document.implementation.createHTMLDocument(''); // IE needs a param
      doc.body.innerHTML = `<div class="grid-stack-item"></div>`;
      newItem = doc.body.children[0] as HTMLElement;
      newItem.appendChild(content);
      newItemOpt = {...node, x:0, y:0};
      Utils.removeInternalForSave(newItemOpt);
      delete newItemOpt.subGrid;
      if (node.content) {
        newItemOpt.content = node.content;
        delete node.content;
      }
      doc.body.innerHTML = `<div class="grid-stack-item-content"></div>`;
      content = doc.body.children[0] as HTMLElement;
      node.el.appendChild(content);
      this._prepareDragDropByNode(node); // ... and restore original D&D
    }

    // if we're adding an additional item, make the container large enough to have them both
    if (nodeToAdd) {
      let w = autoColumn ? ops.column : node.w;
      let h = node.h + nodeToAdd.h;
      let style = node.el.style;
      style.transition = 'none'; // show up instantly so we don't see scrollbar with nodeToAdd
      this.update(node.el, {w, h});
      setTimeout(() =>  style.transition = null); // recover animation
    }

    let subGrid = node.subGrid = GridStack.addGrid(content, ops);
    if (nodeToAdd?._moving) subGrid._isTemp = true; // prevent re-nesting as we add over
    if (autoColumn) subGrid._autoColumn = true;

    // add the original content back as a child of hte newly created grid
    if (saveContent) {
      subGrid.addWidget(newItem, newItemOpt);
    }

    // now add any additional node
    if (nodeToAdd) {
      if (nodeToAdd._moving) {
        // create an artificial event even for the just created grid to receive this item
        window.setTimeout(() => Utils.simulateMouseEvent(nodeToAdd._event, 'mouseenter', subGrid.el), 0);
      } else {
        subGrid.addWidget(node.el, node);
      }
    }
    return subGrid;
  }

  /**
   * called when an item was converted into a nested grid to accommodate a dragged over item, but then item leaves - return back
   * to the original grid-item. Also called to remove empty sub-grids when last item is dragged out (since re-creating is simple)
   */
  public removeAsSubGrid(nodeThatRemoved?: GridStackNode): void {
    let pGrid = this.parentGridItem?.grid;
    if (!pGrid) return;

    pGrid.batchUpdate();
    pGrid.removeWidget(this.parentGridItem.el, true, true);
    this.engine.nodes.forEach(n => {
      // migrate any children over and offsetting by our location
      n.x += this.parentGridItem.x;
      n.y += this.parentGridItem.y;
      pGrid.addWidget(n.el, n);
    });
    pGrid.batchUpdate(false);
    delete this.parentGridItem;

    // create an artificial event for the original grid now that this one is gone (got a leave, but won't get enter)
    if (nodeThatRemoved) {
      window.setTimeout(() => Utils.simulateMouseEvent(nodeThatRemoved._event, 'mouseenter', pGrid.el), 0);
    }
  }

  /**
  /**
   * saves the current layout returning a list of widgets for serialization which might include any nested grids.
   * @param saveContent if true (default) the latest html inside .grid-stack-content will be saved to GridStackWidget.content field, else it will
   * be removed.
   * @param saveGridOpt if true (default false), save the grid options itself, so you can call the new GridStack.addGrid()
   * to recreate everything from scratch. GridStackOptions.children would then contain the widget list instead.
   * @returns list of widgets or full grid option, including .children list of widgets
   */
  public save(saveContent = true, saveGridOpt = false): GridStackWidget[] | GridStackOptions {
    // return copied nodes we can modify at will...
    let list = this.engine.save(saveContent);

    // check for HTML content and nested grids
    list.forEach(n => {
      if (saveContent && n.el && !n.subGrid) { // sub-grid are saved differently, not plain content
        let sub = n.el.querySelector('.grid-stack-item-content');
        n.content = sub ? sub.innerHTML : undefined;
        if (!n.content) delete n.content;
      } else {
        if (!saveContent) { delete n.content; }
        // check for nested grid
        if (n.subGrid) {
          n.subGrid = (n.subGrid as GridStack).save(saveContent, true) as GridStackOptions;
        }
      }
      delete n.el;
    });

    // check if save entire grid options (needed for recursive) + children...
    if (saveGridOpt) {
      let o: InternalGridStackOptions = Utils.cloneDeep(this.opts);
      // delete default values that will be recreated on launch
      if (o.marginBottom === o.marginTop && o.marginRight === o.marginLeft && o.marginTop === o.marginRight) {
        o.margin = o.marginTop;
        delete o.marginTop; delete o.marginRight; delete o.marginBottom; delete o.marginLeft;
      }
      if (o.rtl === (this.el.style.direction === 'rtl')) { o.rtl = 'auto' }
      if (this._isAutoCellHeight) {
        o.cellHeight = 'auto'
      }
      if (this._autoColumn) {
        o.column = 'auto';
        delete o.disableOneColumnMode;
      }
      const origShow = o._alwaysShowResizeHandle;
      delete o._alwaysShowResizeHandle;
      if (origShow !== undefined) {
        o.alwaysShowResizeHandle = origShow;
      } else {
        delete o.alwaysShowResizeHandle;
      }
      Utils.removeInternalAndSame(o, gridDefaults);
      o.children = list;
      return o;
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
  public load(layout: GridStackWidget[], addAndRemove: boolean | AddRemoveFcn = true): GridStack {
    let items = GridStack.Utils.sort([...layout], -1, this._prevColumn || this.getColumn()); // make copy before we mod/sort
    this._insertNotAppend = true; // since create in reverse order...

    // if we're loading a layout into for example 1 column (_prevColumn is set only when going to 1) and items don't fit, make sure to save
    // the original wanted layout so we can scale back up correctly #1471
    if (this._prevColumn && this._prevColumn !== this.opts.column && items.some(n => (n.x + n.w) > this.opts.column)) {
      this._ignoreLayoutsNodeChange = true; // skip layout update
      this.engine.cacheLayout(items, this._prevColumn, true);
    }

    let removed: GridStackNode[] = [];
    this.batchUpdate();

    // see if any items are missing from new layout and need to be removed first
    if (addAndRemove) {
      let copyNodes = [...this.engine.nodes]; // don't loop through array you modify
      copyNodes.forEach(n => {
        let item = items.find(w => n.id === w.id);
        if (!item) {
          if (typeof(addAndRemove) === 'function') {
            addAndRemove(this, n, false);
          } else {
            removed.push(n); // batch keep track
            this.removeWidget(n.el, true, false);
          }
        }
      });
    }

    // now add/update the widgets
    items.forEach(w => {
      let item = (w.id || w.id === 0) ? this.engine.nodes.find(n => n.id === w.id) : undefined;
      if (item) {
        this.update(item.el, w);
        if (w.subGrid && (w.subGrid as GridStackOptions).children) { // update any sub grid as well
          let sub = item.el.querySelector('.grid-stack') as GridHTMLElement;
          if (sub && sub.gridstack) {
            sub.gridstack.load((w.subGrid as GridStackOptions).children); // TODO: support updating grid options ?
            this._insertNotAppend = true; // got reset by above call
          }
        }
      } else if (addAndRemove) {
        if (typeof(addAndRemove) === 'function') {
          w = addAndRemove(this, w, true).gridstackNode;
        } else {
          w = this.addWidget(w).gridstackNode;
        }
      }
    });

    this.engine.removedNodes = removed;
    this.batchUpdate(false);

    // after commit, clear that flag
    delete this._ignoreLayoutsNodeChange;
    delete this._insertNotAppend;
    return this;
  }

  /**
   * use before calling a bunch of `addWidget()` to prevent un-necessary relayouts in between (more efficient)
   * and get a single event callback. You will see no changes until `batchUpdate(false)` is called.
   */
  public batchUpdate(flag = true): GridStack {
    this.engine.batchUpdate(flag);
    if (!flag) {
      this._triggerRemoveEvent();
      this._triggerAddEvent();
      this._triggerChangeEvent();
    }
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
    let el = this.el.querySelector('.' + this.opts.itemClass) as HTMLElement;
    if (el) {
      let height = Utils.toNumber(el.getAttribute('gs-h'));
      return Math.round(el.offsetHeight / height);
    }
    // else do entire grid and # of rows (but doesn't work if min-height is the actual constrain)
    let rows = parseInt(this.el.getAttribute('gs-current-row'));
    return rows ? Math.round(this.el.getBoundingClientRect().height / rows) : this.opts.cellHeight as number;
  }

  /**
   * Update current cell height - see `GridStackOptions.cellHeight` for format.
   * This method rebuilds an internal CSS style sheet.
   * Note: You can expect performance issues if call this method too often.
   *
   * @param val the cell height. If not passed (undefined), cells content will be made square (match width minus margin),
   * if pass 0 the CSS will be generated by the application instead.
   * @param update (Optional) if false, styles will not be updated
   *
   * @example
   * grid.cellHeight(100); // same as 100px
   * grid.cellHeight('70px');
   * grid.cellHeight(grid.cellWidth() * 1.2);
   */
  public cellHeight(val?: numberOrString, update = true): GridStack {

    // if not called internally, check if we're changing mode
    if (update && val !== undefined) {
      if (this._isAutoCellHeight !== (val === 'auto')) {
        this._isAutoCellHeight = (val === 'auto');
        this._updateWindowResizeEvent();
      }
    }
    if (val === 'initial' || val === 'auto') { val = undefined; }

    // make item content be square
    if (val === undefined) {
      let marginDiff = - (this.opts.marginRight as number) - (this.opts.marginLeft as number)
        + (this.opts.marginTop as number) + (this.opts.marginBottom as number);
      val = this.cellWidth() + marginDiff;
    }

    let data = Utils.parseHeight(val);
    if (this.opts.cellHeightUnit === data.unit && this.opts.cellHeight === data.h) {
      return this;
    }
    this.opts.cellHeightUnit = data.unit;
    this.opts.cellHeight = data.h;

    if (update) {
      this._updateStyles(true); // true = force re-create for current # of rows
    }
    return this;
  }

  /** Gets current cell width. */
  public cellWidth(): number {
    return this._widthOrContainer() / this.getColumn();
  }
  /** return our expected width (or parent) for 1 column check */
  protected _widthOrContainer(): number {
    // use `offsetWidth` or `clientWidth` (no scrollbar) ?
    // https://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively
    return (this.el.clientWidth || this.el.parentElement.clientWidth || window.innerWidth);
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
    if (column < 1 || this.opts.column === column) return this;
    let oldColumn = this.getColumn();

    // if we go into 1 column mode (which happens if we're sized less than minW unless disableOneColumnMode is on)
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
      this.getGridItems().forEach(el => { // get dom elements in order
        if (el.gridstackNode) { domNodes.push(el.gridstackNode); }
      });
      if (!domNodes.length) { domNodes = undefined; }
    }
    this.engine.updateNodeWidths(oldColumn, column, domNodes, layout);
    if (this._isAutoCellHeight) this.cellHeight();

    // and trigger our event last...
    this._ignoreLayoutsNodeChange = true; // skip layout update
    this._triggerChangeEvent();
    delete this._ignoreLayoutsNodeChange;

    return this;
  }

  /**
   * get the number of columns in the grid (default 12)
   */
  public getColumn(): number {
    return this.opts.column as number;
  }

  /** returns an array of grid HTML elements (no placeholder) - used to iterate through our children in DOM order */
  public getGridItems(): GridItemHTMLElement[] {
    return Array.from(this.el.children)
      .filter((el: HTMLElement) => el.matches('.' + this.opts.itemClass) && !el.matches('.' + this.opts.placeholderClass)) as GridItemHTMLElement[];
  }

  /**
   * Destroys a grid instance. DO NOT CALL any methods or access any vars after this as it will free up members.
   * @param removeDOM if `false` grid and items HTML elements will not be removed from the DOM (Optional. Default `true`).
   */
  public destroy(removeDOM = true): GridStack {
    if (!this.el) return; // prevent multiple calls
    this._updateWindowResizeEvent(true);
    this.setStatic(true, false); // permanently removes DD but don't set CSS class (we're going away)
    this.setAnimation(false);
    if (!removeDOM) {
      this.removeAll(removeDOM);
      this.el.classList.remove(this._styleSheetClass);
    } else {
      this.el.parentNode.removeChild(this.el);
    }
    this._removeStylesheet();
    this.el.removeAttribute('gs-current-row');
    delete this.parentGridItem;
    delete this.opts;
    delete this._placeholder;
    delete this.engine;
    delete this.el.gridstack; // remove circular dependency that would prevent a freeing
    delete this.el;
    return this;
  }

  /**
   * enable/disable floating widgets (default: `false`) See [example](http://gridstackjs.com/demo/float.html)
   */
  public float(val: boolean): GridStack {
    if (this.opts.float !== val) {
      this.opts.float = this.engine.float = val;
      this._triggerChangeEvent();
    }
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
    // console.log(`getBoundingClientRect left: ${box.left} top: ${box.top} w: ${box.w} h: ${box.h}`)
    let containerPos: {top: number, left: number};
    if (useDocRelative) {
      containerPos = {top: box.top + document.documentElement.scrollTop, left: box.left};
      // console.log(`getCellFromPixel scrollTop: ${document.documentElement.scrollTop}`)
    } else {
      containerPos = {top: this.el.offsetTop, left: this.el.offsetLeft}
      // console.log(`getCellFromPixel offsetTop: ${containerPos.left} offsetLeft: ${containerPos.top}`)
    }
    let relativeLeft = position.left - containerPos.left;
    let relativeTop = position.top - containerPos.top;

    let columnWidth = (box.width / this.getColumn());
    let rowHeight = (box.height / parseInt(this.el.getAttribute('gs-current-row')));

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
   * @param w the width of to check
   * @param h the height of to check
   */
  public isAreaEmpty(x: number, y: number, w: number, h: number): boolean {
    return this.engine.isAreaEmpty(x, y, w, h);
  }

  /**
   * If you add elements to your grid by hand, you have to tell gridstack afterwards to make them widgets.
   * If you want gridstack to add the elements for you, use `addWidget()` instead.
   * Makes the given element a widget and returns it.
   * @param els widget or single selector to convert.
   *
   * @example
   * let grid = GridStack.init();
   * grid.el.appendChild('<div id="gsi-1" gs-w="3"></div>');
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
  public on(name: GridStackEvent, callback: GridStackEventHandlerCallback): GridStack {
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
    } else if (name === 'drag' || name === 'dragstart' || name === 'dragstop' || name === 'resizestart' || name === 'resize' || name === 'resizestop' || name === 'dropped') {
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
      if (el.parentElement && el.parentElement !== this.el) return; // not our child!
      let node = el.gridstackNode;
      // For Meteor support: https://github.com/gridstack/gridstack.js/pull/272
      if (!node) {
        node = this.engine.nodes.find(n => el === n.el);
      }
      if (!node) return;

      // remove our DOM data (circular link) and drag&drop permanently
      delete el.gridstackNode;
      this._removeDD(el);

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
      this._removeDD(n.el);
    });
    this.engine.removeAll(removeDOM);
    this._triggerRemoveEvent();
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
   * @param updateClass true (default) if css class gets updated
   * @param recurse true (default) if sub-grids also get updated
   */
  public setStatic(val: boolean, updateClass = true, recurse = true): GridStack {
    if (this.opts.staticGrid === val) return this;
    this.opts.staticGrid = val;
    this._setupRemoveDrop();
    this._setupAcceptWidget();
    this.engine.nodes.forEach(n => {
      this._prepareDragDropByNode(n); // either delete or init Drag&drop
      if (n.subGrid && recurse) (n.subGrid as GridStack).setStatic(val, updateClass, recurse);
    });
    if (updateClass) { this._setStaticClass(); }
    return this;
  }

  /**
   * Updates widget position/size and other info. Note: if you need to call this on all nodes, use load() instead which will update what changed.
   * @param els  widget or selector of objects to modify (note: setting the same x,y for multiple items will be indeterministic and likely unwanted)
   * @param opt new widget options (x,y,w,h, etc..). Only those set will be updated.
   */
  public update(els: GridStackElement, opt: GridStackWidget): GridStack {

    // support legacy call for now ?
    if (arguments.length > 2) {
      console.warn('gridstack.ts: `update(el, x, y, w, h)` is deprecated. Use `update(el, {x, w, content, ...})`. It will be removed soon');
      // eslint-disable-next-line prefer-rest-params
      let a = arguments, i = 1;
      opt = { x:a[i++], y:a[i++], w:a[i++], h:a[i++] };
      return this.update(els, opt);
    }

    GridStack.getElements(els).forEach(el => {
      if (!el || !el.gridstackNode) return;
      let n = el.gridstackNode;
      let w = Utils.cloneDeep(opt); // make a copy we can modify in case they re-use it or multiple items
      delete w.autoPosition;

      // move/resize widget if anything changed
      let keys = ['x', 'y', 'w', 'h'];
      let m: GridStackWidget;
      if (keys.some(k => w[k] !== undefined && w[k] !== n[k])) {
        m = {};
        keys.forEach(k => {
          m[k] = (w[k] !== undefined) ? w[k] : n[k];
          delete w[k];
        });
      }
      // for a move as well IFF there is any min/max fields set
      if (!m && (w.minW || w.minH || w.maxW || w.maxH)) {
        m = {}; // will use node position but validate values
      }

      // check for content changing
      if (w.content) {
        let sub = el.querySelector('.grid-stack-item-content');
        if (sub && sub.innerHTML !== w.content) {
          sub.innerHTML = w.content;
        }
        delete w.content;
      }

      // any remaining fields are assigned, but check for dragging changes, resize constrain
      let changed = false;
      let ddChanged = false;
      for (const key in w) {
        if (key[0] !== '_' && n[key] !== w[key]) {
          n[key] = w[key];
          changed = true;
          ddChanged = ddChanged || (!this.opts.staticGrid && (key === 'noResize' || key === 'noMove' || key === 'locked'));
        }
      }

      // finally move the widget
      if (m) {
        this.engine.cleanNodes()
          .beginUpdate(n)
          .moveNode(n, m);
        this._updateContainerHeight();
        this._triggerChangeEvent();
        this.engine.endUpdate();
      }
      if (changed) { // move will only update x,y,w,h so update the rest too
        this._writeAttr(el, n);
      }
      if (ddChanged) {
        this._prepareDragDropByNode(n);
      }
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
      if (this.opts.marginUnit === data.unit && this.opts.margin === data.h) return;
    }
    // re-use existing margin handling
    this.opts.margin = value;
    this.opts.marginTop = this.opts.marginBottom = this.opts.marginLeft = this.opts.marginRight = undefined;
    this._initMargin();

    this._updateStyles(true); // true = force re-create

    return this;
  }

  /** returns current margin number value (undefined if 4 sides don't match) */
  public getMargin(): number { return this.opts.margin as number; }

  /**
   * Returns true if the height of the grid will be less than the vertical
   * constraint. Always returns true if grid doesn't have height constraint.
   * @param node contains x,y,w,h,auto-position options
   *
   * @example
   * if (grid.willItFit(newWidget)) {
   *   grid.addWidget(newWidget);
   * } else {
   *   alert('Not enough free space to place the widget');
   * }
   */
  public willItFit(node: GridStackWidget): boolean {
    // support legacy call for now
    if (arguments.length > 1) {
      console.warn('gridstack.ts: `willItFit(x,y,w,h,autoPosition)` is deprecated. Use `willItFit({x, y,...})`. It will be removed soon');
      // eslint-disable-next-line prefer-rest-params
      let a = arguments, i = 0,
        w: GridStackWidget = { x:a[i++], y:a[i++], w:a[i++], h:a[i++], autoPosition:a[i++] };
      return this.willItFit(w);
    }
    return this.engine.willItFit(node);
  }

  /** @internal */
  protected _triggerChangeEvent(): GridStack {
    if (this.engine.batchMode) return this;
    let elements = this.engine.getDirtyNodes(true); // verify they really changed
    if (elements && elements.length) {
      if (!this._ignoreLayoutsNodeChange) {
        this.engine.layoutsNodesChange(elements);
      }
      this._triggerEvent('change', elements);
    }
    this.engine.saveInitial(); // we called, now reset initial values & dirty flags
    return this;
  }

  /** @internal */
  protected _triggerAddEvent(): GridStack {
    if (this.engine.batchMode) return this;
    if (this.engine.addedNodes && this.engine.addedNodes.length > 0) {
      if (!this._ignoreLayoutsNodeChange) {
        this.engine.layoutsNodesChange(this.engine.addedNodes);
      }
      // prevent added nodes from also triggering 'change' event (which is called next)
      this.engine.addedNodes.forEach(n => { delete n._dirty; });
      this._triggerEvent('added', this.engine.addedNodes);
      this.engine.addedNodes = [];
    }
    return this;
  }

  /** @internal */
  public _triggerRemoveEvent(): GridStack {
    if (this.engine.batchMode) return this;
    if (this.engine.removedNodes && this.engine.removedNodes.length > 0) {
      this._triggerEvent('removed', this.engine.removedNodes);
      this.engine.removedNodes = [];
    }
    return this;
  }

  /** @internal */
  protected _triggerEvent(type: string, data?: GridStackNode[]): GridStack {
    let event = data ? new CustomEvent(type, {bubbles: false, detail: data}) : new Event(type);
    this.el.dispatchEvent(event);
    return this;
  }

  /** @internal called to delete the current dynamic style sheet used for our layout */
  protected _removeStylesheet(): GridStack {

    if (this._styles) {
      Utils.removeStylesheet(this._styleSheetClass);
      delete this._styles;
    }
    return this;
  }

  /** @internal updated/create the CSS styles for row based layout and initial margin setting */
  protected _updateStyles(forceUpdate = false, maxH?: number): GridStack {
    // call to delete existing one if we change cellHeight / margin
    if (forceUpdate) {
      this._removeStylesheet();
    }

    if (!maxH) maxH = this.getRow();
    this._updateContainerHeight();

    // if user is telling us they will handle the CSS themselves by setting heights to 0. Do we need this opts really ??
    if (this.opts.cellHeight === 0) {
      return this;
    }

    let cellHeight = this.opts.cellHeight as number;
    let cellHeightUnit = this.opts.cellHeightUnit;
    let prefix = `.${this._styleSheetClass} > .${this.opts.itemClass}`;

    // create one as needed
    if (!this._styles) {
      // insert style to parent (instead of 'head' by default) to support WebComponent
      let styleLocation = this.opts.styleInHead ? undefined : this.el.parentNode as HTMLElement;
      this._styles = Utils.createStylesheet(this._styleSheetClass, styleLocation);
      if (!this._styles) return this;
      this._styles._max = 0;

      // these are done once only
      Utils.addCSSRule(this._styles, prefix, `min-height: ${cellHeight}${cellHeightUnit}`);
      // content margins
      let top: string = this.opts.marginTop + this.opts.marginUnit;
      let bottom: string = this.opts.marginBottom + this.opts.marginUnit;
      let right: string = this.opts.marginRight + this.opts.marginUnit;
      let left: string = this.opts.marginLeft + this.opts.marginUnit;
      let content = `${prefix} > .grid-stack-item-content`;
      let placeholder = `.${this._styleSheetClass} > .grid-stack-placeholder > .placeholder-content`;
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
    maxH = maxH || this._styles._max;
    if (maxH > this._styles._max) {
      let getHeight = (rows: number): string => (cellHeight * rows) + cellHeightUnit;
      for (let i = this._styles._max + 1; i <= maxH; i++) { // start at 1
        let h: string = getHeight(i);
        Utils.addCSSRule(this._styles, `${prefix}[gs-y="${i-1}"]`,   `top: ${getHeight(i-1)}`); // start at 0
        Utils.addCSSRule(this._styles, `${prefix}[gs-h="${i}"]`,     `height: ${h}`);
        Utils.addCSSRule(this._styles, `${prefix}[gs-min-h="${i}"]`, `min-height: ${h}`);
        Utils.addCSSRule(this._styles, `${prefix}[gs-max-h="${i}"]`, `max-height: ${h}`);
      }
      this._styles._max = maxH;
    }
    return this;
  }

  /** @internal */
  protected _updateContainerHeight(): GridStack {
    if (!this.engine || this.engine.batchMode) return this;
    let row = this.getRow() + this._extraDragRow; // checks for minRow already
    // check for css min height
    // Note: we don't handle %,rem correctly so comment out, beside we don't need need to create un-necessary
    // rows as the CSS will make us bigger than our set height if needed... not sure why we had this.
    // let cssMinHeight = parseInt(getComputedStyle(this.el)['min-height']);
    // if (cssMinHeight > 0) {
    //   let minRow = Math.round(cssMinHeight / this.getCellHeight(true));
    //   if (row < minRow) {
    //     row = minRow;
    //   }
    // }
    this.el.setAttribute('gs-current-row', String(row));
    if (row === 0) {
      this.el.style.removeProperty('min-height');
      return this;
    }
    let cellHeight = this.opts.cellHeight as number;
    let unit = this.opts.cellHeightUnit;
    if (!cellHeight) return this;
    this.el.style.minHeight = row * cellHeight + unit;
    return this;
  }

  /** @internal */
  protected _prepareElement(el: GridItemHTMLElement, triggerAddEvent = false, node?: GridStackNode): GridStack {
    if (!node) {
      el.classList.add(this.opts.itemClass);
      node = this._readAttr(el);
    }
    el.gridstackNode = node;
    node.el = el;
    node.grid = this;
    let copy = {...node};
    node = this.engine.addNode(node, triggerAddEvent);
    // write node attr back in case there was collision or we have to fix bad values during addNode()
    if (!Utils.same(node, copy)) {
      this._writeAttr(el, node);
    }
    this._prepareDragDropByNode(node);
    return this;
  }

  /** @internal call to write position x,y,w,h attributes back to element */
  protected _writePosAttr(el: HTMLElement, n: GridStackPosition): GridStack {
    if (n.x !== undefined && n.x !== null) { el.setAttribute('gs-x', String(n.x)); }
    if (n.y !== undefined && n.y !== null) { el.setAttribute('gs-y', String(n.y)); }
    if (n.w) { el.setAttribute('gs-w', String(n.w)); }
    if (n.h) { el.setAttribute('gs-h', String(n.h)); }
    return this;
  }

  /** @internal call to write any default attributes back to element */
  protected _writeAttr(el: HTMLElement, node: GridStackWidget): GridStack {
    if (!node) return this;
    this._writePosAttr(el, node);

    let attrs /*: GridStackWidget but strings */ = { // remaining attributes
      autoPosition: 'gs-auto-position',
      minW: 'gs-min-w',
      minH: 'gs-min-h',
      maxW: 'gs-max-w',
      maxH: 'gs-max-h',
      noResize: 'gs-no-resize',
      noMove: 'gs-no-move',
      locked: 'gs-locked',
      id: 'gs-id',
      resizeHandles: 'gs-resize-handles'
    };
    for (const key in attrs) {
      if (node[key]) { // 0 is valid for x,y only but done above already and not in list anyway
        el.setAttribute(attrs[key], String(node[key]));
      } else {
        el.removeAttribute(attrs[key]);
      }
    }
    return this;
  }

  /** @internal call to read any default attributes from element */
  protected _readAttr(el: HTMLElement): GridStackWidget {
    let node: GridStackNode = {};
    node.x = Utils.toNumber(el.getAttribute('gs-x'));
    node.y = Utils.toNumber(el.getAttribute('gs-y'));
    node.w = Utils.toNumber(el.getAttribute('gs-w'));
    node.h = Utils.toNumber(el.getAttribute('gs-h'));
    node.maxW = Utils.toNumber(el.getAttribute('gs-max-w'));
    node.minW = Utils.toNumber(el.getAttribute('gs-min-w'));
    node.maxH = Utils.toNumber(el.getAttribute('gs-max-h'));
    node.minH = Utils.toNumber(el.getAttribute('gs-min-h'));
    node.autoPosition = Utils.toBool(el.getAttribute('gs-auto-position'));
    node.noResize = Utils.toBool(el.getAttribute('gs-no-resize'));
    node.noMove = Utils.toBool(el.getAttribute('gs-no-move'));
    node.locked = Utils.toBool(el.getAttribute('gs-locked'));
    node.resizeHandles = el.getAttribute('gs-resize-handles');
    node.id = el.getAttribute('gs-id');

    // remove any key not found (null or false which is default)
    for (const key in node) {
      if (!node.hasOwnProperty(key)) return;
      if (!node[key] && node[key] !== 0) { // 0 can be valid value (x,y only really)
        delete node[key];
      }
    }

    return node;
  }

  /** @internal */
  protected _setStaticClass(): GridStack {
    let classes = ['grid-stack-static'];

    if (this.opts.staticGrid) {
      this.el.classList.add(...classes);
      this.el.setAttribute('gs-static', 'true');
    } else {
      this.el.classList.remove(...classes);
      this.el.removeAttribute('gs-static');

    }
    return this;
  }

  /**
   * called when we are being resized by the window - check if the one Column Mode needs to be turned on/off
   * and remember the prev columns we used, or get our count from parent, as well as check for auto cell height (square)
   */
  public onParentResize(): GridStack {
    if (!this.el || !this.el.clientWidth) return; // return if we're gone or no size yet (will get called again)
    let changedColumn = false;

    // see if we're nested and take our column count from our parent....
    if (this._autoColumn && this.parentGridItem) {
      if (this.opts.column !== this.parentGridItem.w) {
        changedColumn = true;
        this.column(this.parentGridItem.w, 'none');
      }
    } else {
      // else check for 1 column in/out behavior
      let oneColumn = !this.opts.disableOneColumnMode && this.el.clientWidth <= this.opts.oneColumnSize;
      if ((this.opts.column === 1) !== oneColumn) {
        changedColumn = true;
        if (this.opts.animate) { this.setAnimation(false); } // 1 <-> 12 is too radical, turn off animation
        this.column(oneColumn ? 1 : this._prevColumn);
        if (this.opts.animate) { this.setAnimation(true); }
      }
    }

    // make the cells content square again
    if (this._isAutoCellHeight) {
      if (!changedColumn && this.opts.cellHeightThrottle) {
        if (!this._cellHeightThrottle) {
          this._cellHeightThrottle = Utils.throttle(() => this.cellHeight(), this.opts.cellHeightThrottle);
        }
        this._cellHeightThrottle();
      } else {
        // immediate update if we've changed column count or have no threshold
        this.cellHeight();
      }
    }

    // finally update any nested grids
    this.engine.nodes.forEach(n => {
      if (n.subGrid) {(n.subGrid as GridStack).onParentResize()}
    });

    return this;
  }

  /** add or remove the window size event handler */
  protected _updateWindowResizeEvent(forceRemove = false): GridStack {
    // only add event if we're not nested (parent will call us) and we're auto sizing cells or supporting oneColumn (i.e. doing work)
    const workTodo = (this._isAutoCellHeight || !this.opts.disableOneColumnMode) && !this.parentGridItem;

    if (!forceRemove && workTodo && !this._windowResizeBind) {
      this._windowResizeBind = this.onParentResize.bind(this); // so we can properly remove later
      window.addEventListener('resize', this._windowResizeBind);
    } else if ((forceRemove || !workTodo) && this._windowResizeBind) {
      window.removeEventListener('resize', this._windowResizeBind);
      delete this._windowResizeBind; // remove link to us so we can free
    }

    return this;
  }

  /** @internal convert a potential selector into actual element */
  public static getElement(els: GridStackElement = '.grid-stack-item'): GridItemHTMLElement { return Utils.getElement(els) }
  /** @internal */
  public static getElements(els: GridStackElement = '.grid-stack-item'): GridItemHTMLElement[] { return Utils.getElements(els) }
  /** @internal */
  public static getGridElement(els: GridStackElement): GridHTMLElement { return GridStack.getElement(els) }
  /** @internal */
  public static getGridElements(els: string): GridHTMLElement[] { return Utils.getElements(els) }

  /** @internal initialize margin top/bottom/left/right and units */
  protected _initMargin(): GridStack {

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
      margin = this.opts.margin = data.h;
    }

    // see if top/bottom/left/right need to be set as well
    if (this.opts.marginTop === undefined) {
      this.opts.marginTop = margin;
    } else {
      data = Utils.parseHeight(this.opts.marginTop);
      this.opts.marginTop = data.h;
      delete this.opts.margin;
    }

    if (this.opts.marginBottom === undefined) {
      this.opts.marginBottom = margin;
    } else {
      data = Utils.parseHeight(this.opts.marginBottom);
      this.opts.marginBottom = data.h;
      delete this.opts.margin;
    }

    if (this.opts.marginRight === undefined) {
      this.opts.marginRight = margin;
    } else {
      data = Utils.parseHeight(this.opts.marginRight);
      this.opts.marginRight = data.h;
      delete this.opts.margin;
    }

    if (this.opts.marginLeft === undefined) {
      this.opts.marginLeft = margin;
    } else {
      data = Utils.parseHeight(this.opts.marginLeft);
      this.opts.marginLeft = data.h;
      delete this.opts.margin;
    }
    this.opts.marginUnit = data.unit; // in case side were spelled out, use those units instead...
    if (this.opts.marginTop === this.opts.marginBottom && this.opts.marginLeft === this.opts.marginRight && this.opts.marginTop === this.opts.marginRight) {
      this.opts.margin = this.opts.marginTop; // makes it easier to check for no-ops in setMargin()
    }
    return this;
  }

  static GDRev = '7.1.1-dev';

  /* ===========================================================================================
   * drag&drop methods that used to be stubbed out and implemented in dd-gridstack.ts
   * but caused loading issues in prod - see https://github.com/gridstack/gridstack.js/issues/2039
   * ===========================================================================================
   */

  /** get the global (but static to this code) DD implementation */
  public static getDD(): DDGridStack {
    return dd;
  }

  /**
   * call to setup dragging in from the outside (say toolbar), by specifying the class selection and options.
   * Called during GridStack.init() as options, but can also be called directly (last param are used) in case the toolbar
   * is dynamically create and needs to be set later.
   * @param dragIn string selector (ex: '.sidebar .grid-stack-item')
   * @param dragInOptions options - see DDDragInOpt. (default: {handle: '.grid-stack-item-content', appendTo: 'body'}
   **/
  public static setupDragIn(dragIn?: string, dragInOptions?: DDDragInOpt): void {
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

  /**
   * Enables/Disables dragging by the user of specific grid element. If you want all items, and have it affect future items, use enableMove() instead. No-op for static grids.
   * IF you are looking to prevent an item from moving (due to being pushed around by another during collision) use locked property instead.
   * @param els widget or selector to modify.
   * @param val if true widget will be draggable.
   */
  public movable(els: GridStackElement, val: boolean): GridStack {
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
   * Enables/Disables user resizing of specific grid element. If you want all items, and have it affect future items, use enableResize() instead. No-op for static grids.
   * @param els  widget or selector to modify
   * @param val  if true widget will be resizable.
   */
  public resizable(els: GridStackElement, val: boolean): GridStack {
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
   * @param recurse true (default) if sub-grids also get updated
   */
  public disable(recurse = true): GridStack {
    if (this.opts.staticGrid) return;
    this.enableMove(false, recurse);
    this.enableResize(false, recurse);// @ts-ignore
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
   * @param recurse true (default) if sub-grids also get updated
   */
  public enable(recurse = true): GridStack {
    if (this.opts.staticGrid) return;
    this.enableMove(true, recurse);
    this.enableResize(true, recurse);// @ts-ignore
    this._triggerEvent('enable');
    return this;
  }

  /**
   * Enables/disables widget moving. No-op for static grids.
   * @param recurse true (default) if sub-grids also get updated
   */
  public enableMove(doEnable: boolean, recurse = true): GridStack {
    if (this.opts.staticGrid) return this; // can't move a static grid!
    this.opts.disableDrag = !doEnable; // FIRST before we update children as grid overrides #1658
    this.engine.nodes.forEach(n => {
      this.movable(n.el, doEnable);
      if (n.subGrid && recurse) (n.subGrid as GridStack).enableMove(doEnable, recurse);
    });
    return this;
  }

  /**
   * Enables/disables widget resizing. No-op for static grids.
   * @param recurse true (default) if sub-grids also get updated
   */
  public enableResize(doEnable: boolean, recurse = true): GridStack {
    if (this.opts.staticGrid) return this; // can't size a static grid!
    this.opts.disableResize = !doEnable; // FIRST before we update children as grid overrides #1658
    this.engine.nodes.forEach(n => {
      this.resizable(n.el, doEnable);
      if (n.subGrid && recurse) (n.subGrid as GridStack).enableResize(doEnable, recurse);
    });
    return this;
  }

  /** @internal removes any drag&drop present (called during destroy) */
  protected _removeDD(el: DDElementHost): GridStack {
    dd.draggable(el, 'destroy').resizable(el, 'destroy');
    if (el.gridstackNode) {
      delete el.gridstackNode._initDD; // reset our DD init flag
    }
    delete el.ddElement;
    return this;
  }

  /** @internal called to add drag over to support widgets being added externally */
  protected _setupAcceptWidget(): GridStack {

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
        this._itemRemoving(node.el, false);

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
  private _itemRemoving(el: GridItemHTMLElement, remove: boolean) {
    let node = el ? el.gridstackNode : undefined;
    if (!node || !node.grid) return;
    remove ? node._isAboutToRemove = true : delete node._isAboutToRemove;
    remove ? el.classList.add('grid-stack-item-removing') : el.classList.remove('grid-stack-item-removing');
  }

  /** @internal called to setup a trash drop zone if the user specifies it */
  protected _setupRemoveDrop(): GridStack {
    if (!this.opts.staticGrid && typeof this.opts.removable === 'string') {
      let trashEl = document.querySelector(this.opts.removable) as HTMLElement;
      if (!trashEl) return this;
      // only register ONE drop-over/dropout callback for the 'trash', and it will
      // update the passed in item and parent grid because the 'trash' is a shared resource anyway,
      // and Native DD only has 1 event CB (having a list and technically a per grid removableOptions complicates things greatly)
      if (!dd.isDroppable(trashEl)) {
        dd.droppable(trashEl, this.opts.removableOptions)
          .on(trashEl, 'dropover', (event, el) => this._itemRemoving(el, true))
          .on(trashEl, 'dropout',  (event, el) => this._itemRemoving(el, false));
      }
    }
    return this;
  }

  /** @internal prepares the element for drag&drop **/
  protected _prepareDragDropByNode(node: GridStackNode): GridStack {
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
      let dragOrResize = (event: MouseEvent, ui: DDUIData) => {
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

  /** @internal handles actual drag/resize start **/
  protected _onStartMoving(el: GridItemHTMLElement, event: Event, ui: DDUIData, node: GridStackNode, cellWidth: number, cellHeight: number): void {
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

  /** @internal handles actual drag/resize **/
  protected _dragOrResize(el: GridItemHTMLElement, event: MouseEvent, ui: DDUIData, node: GridStackNode, cellWidth: number, cellHeight: number): void {
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

  /** @internal called when item leaving our area by either cursor dropout event
   * or shape is outside our boundaries. remove it from us, and mark temporary if this was
   * our item to start with else restore prev node values from prev grid it came from.
   **/
  protected _leave(el: GridItemHTMLElement, helper?: GridItemHTMLElement): void {
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
      this._itemRemoving(el, true);
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

  // legacy method removed
  public commit(): GridStack { obsolete(this, this.batchUpdate(false), 'commit', 'batchUpdate', '5.2'); return this; }
}
