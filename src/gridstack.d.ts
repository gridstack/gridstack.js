// Type definitions for Gridstack 0.5.5
// Project: https://gridstackjs.com/
// Definitions by: Pascal Senn <https://github.com/PascalSenn>
//                 Ricky Blankenaufulland <https://github.com/ZoolWay>
//                 Sl1MBoy <https://github.com/Sl1MBoy>
//                 John Archer <https://github.com/JohnArcher>
//                 Alain Dumesny <https://github.com/adumesny>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped initially, but now part of gridstack.js
// TypeScript Version: 2.8

interface JQuery {
  gridstack(options: GridstackOptions): JQuery;
  data(key: 'gridstack'): GridStack;
}

/* Other items in https://github.com/gridstack/gridstack.js/blob/develop/doc/README.md
 * Grid attributes
 * Item attributes
 * Events
 */

type GridStackElement = string | HTMLElement | JQuery;

interface GridStack {
  /**
   * Creates new widget and returns it.
   *
   * Widget will be always placed even if result height is more than actual grid height.
   * You need to use willItFit method before calling addWidget for additional check.
   * See also `makeWidget()`.
   *
   * @example
   * $('.grid-stack').gridstack();
   * var grid = $('.grid-stack').data('gridstack');
   * grid.addWidget(el, {width: 3, autoPosition: true});
   *
   * @param el widget to add
   * @param options widget position/size options (optional)
   */
  addWidget(el: GridStackElement, options ? : GridstackWidget): JQuery;

  /**
   * Creates new widget and returns it. 
   * Legacy: Spelled out version of the widgets options, recommend use new version instead.
   *
   * @example
   * $('.grid-stack').gridstack();
   * var grid = $('.grid-stack').data('gridstack');
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
  addWidget(el: GridStackElement, x ? : number, y ? : number, width ? : number, height ? : number, autoPosition ? : boolean,
    minWidth ? : number, maxWidth ? : number, minHeight ? : number, maxHeight ? : number, id ? : number | string): JQuery;

  /**
   * Initializes batch updates. You will see no changes until commit method is called.
   */
  batchUpdate(): void;

  /**
   * Gets current cell height.
   */
  cellHeight(): number;

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
  cellHeight(val: number | string, noUpdate ? : boolean): void;

  /**
   * Gets current cell width.
   */
  cellWidth(): number;

  /**
   * Finishes batch updates. Updates DOM nodes. You must call it after batchUpdate.
   */
  commit(): void;

  /**
   * Destroys a grid instance.
   * @param detachGrid if false nodes and grid will not be removed from the DOM (Optional. Default true).
   */
  destroy(detachGrid ? : boolean): void;

  /**
   * Disables widgets moving/resizing. This is a shortcut for:
   * @example
   *  grid.movable('.grid-stack-item', false);
   *  grid.resizable('.grid-stack-item', false);
   */
  disable(): void;

  /**
   * Enables widgets moving/resizing. This is a shortcut for:
   * @example
   *  grid.movable('.grid-stack-item', true);
   *  grid.resizable('.grid-stack-item', true);
   */
  enable(): void;

  /**
   * Enables/disables widget moving.
   * This is a shortcut for:
   * @example
   * grid.movable(this.container.children('.' + this.opts.itemClass), doEnable);
   *
   * @param doEnable
   * @param includeNewWidgets will force new widgets to be draggable as per
   * doEnable`s value by changing the disableDrag grid option.
   */
  enableMove(doEnable: boolean, includeNewWidgets: boolean): void;

  /**
   * Enables/disables widget resizing
   * @param doEnable
   * @param includeNewWidgets will force new widgets to be draggable as per
   * doEnable`s value by changing the disableResize grid option.
   *
   * This is a shortcut for:
   * @example
   *  grid.resizable(this.container.children('.' + this.opts.itemClass), doEnable);
   */
  enableResize(doEnable: boolean, includeNewWidgets: boolean): void;

  /**
   * Get the position of the cell under a pixel on screen.
   * @param position the position of the pixel to resolve in
   * absolute coordinates, as an object with top and left properties
   * @param useOffset if true, value will be based on offset vs position (Optional. Default false).
   * Useful when grid is within `position: relative` element
   *
   * Returns an object with properties `x` and `y` i.e. the column and row in the grid.
   */
  getCellFromPixel(position: MousePosition, useOffset ? : boolean): CellPosition;

  /**
   * Checks if specified area is empty.
   * @param x the position x.
   * @param y the position y.
   * @param width the width of to check
   * @param height the height of to check
   */
  isAreaEmpty(x: number, y: number, width: number, height: number): void;

  /**
   * Locks/unlocks widget.
   * @param el widget to modify.
   * @param val if true widget will be locked.
   */
  locked(el: GridStackElement, val: boolean): void;

  /**
   * If you add elements to your gridstack container by hand, you have to tell gridstack afterwards to make them widgets.
   * If you want gridstack to add the elements for you, use addWidget instead.
   * Makes the given element a widget and returns it.
   * @param el widget to convert.
   *
   * @example
   * $('.grid-stack').gridstack();
   * $('.grid-stack').append('<div id="gsi-1" data-gs-x="0" data-gs-y="0" data-gs-width="3" data-gs-height="2"
   *                     data-gs-auto-position="1"></div>')
   * var grid = $('.grid-stack').data('gridstack');
   * grid.makeWidget('gsi-1');
   */
  makeWidget(el: GridStackElement): JQuery;

  /**
   * Set the maxWidth for a widget.
   * @param el widget to modify.
   * @param val A numeric value of the number of columns
   */
  maxWidth(el: GridStackElement, val: number): void;

  /**
   * Set the minWidth for a widget.
   * @param el widget to modify.
   * @param val A numeric value of the number of columns
   */
  minWidth(el: GridStackElement, val: number): void;

  /**
   * Set the maxHeight for a widget.
   * @param el widget to modify.
   * @param val A numeric value of the number of rows
   */
  maxHeight(el: GridStackElement, val: number): void;

  /**
   * Set the minHeight for a widget.
   * @param el widget to modify.
   * @param val A numeric value of the number of rows
   */
  minHeight(el: GridStackElement, val: number): void;

  /**
   * Enables/Disables moving.
   * @param el widget to modify.
   * @param val if true widget will be draggable.
   */
  movable(el: GridStackElement, val: boolean): void;

  /**
   * Changes widget position
   * @param el  widget to modify
   * @param x new position x. If value is null or undefined it will be ignored.
   * @param y new position y. If value is null or undefined it will be ignored.
   */
  move(el: GridStackElement, x: number, y: number): void;

  /**
   * Removes widget from the grid.
   * @param el  widget to modify
   * @param detachNode if false DOM node won't be removed from the tree (Default? true).
   */
  removeWidget(el: GridStackElement, detachNode ? : boolean): void;

  /**
   * Removes all widgets from the grid.
   * @param detachNode if false DOM nodes won't be removed from the tree (Default? true).
   */
  removeAll(detachNode ? : boolean): void;

  /**
   * Changes widget size
   * @param el  widget to modify
   * @param width new dimensions width. If value is null or undefined it will be ignored.
   * @param height  new dimensions height. If value is null or undefined it will be ignored.
   */
  resize(el: GridStackElement, width: number, height: number): void;

  /**
   * Enables/Disables resizing.
   * @param el  widget to modify
   * @param val  if true widget will be resizable.
   */
  resizable(el: GridStackElement, val: boolean): void;

  /**
   * Toggle the grid animation state.  Toggles the `grid-stack-animate` class.
   * @param doAnimate if true the grid will animate.
   */
  setAnimation(doAnimate: boolean): void;

  /**
   * (Experimental) Modify number of columns in the grid. Will attempt to update existing widgets
   * to conform to new number of columns. Requires `gridstack-extra.css` or `gridstack-extra.min.css`.
   * @param column - Integer between 1 and 12.
   * @param doNotPropagate if true existing widgets will not be updated (optional) 
   */
  setColumn(column: number, doNotPropagate ? : boolean): void;

  /**
   * Toggle the grid static state. Also toggle the grid-stack-static class.
   * @param staticValue if true the grid become static.
   */
  setStatic(staticValue: boolean): void;

  /**
   * Updates widget position/size.
   * @param el widget to modify
   * @param x new position x. If value is null or undefined it will be ignored.
   * @param y new position y. If value is null or undefined it will be ignored.
   * @param width new dimensions width. If value is null or undefined it will be ignored.
   * @param height  new dimensions height. If value is null or undefined it will be ignored.
   */
  update(el: GridStackElement, x: number, y: number, width: number, height: number): void;

  /**
   * returns current vertical margin value
   */
  verticalMargin(): number;

  /**
   * Updates the vertical margin - see `GridstackOptions.verticalMargin` for format options.
   *
   * @param value new vertical margin value
   * @param noUpdate (optional) if true, styles will not be updated
   */
  verticalMargin(value: number | string, noUpdate ? : boolean): void;

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
  willItFit(x: number, y: number, width: number, height: number, autoPosition: boolean): boolean;
}

/**
 * Defines the coordinates of an object
 */
interface MousePosition {
  top: number;
  left: number;
}

/**
 * Defines the position of a cell inside the grid
 */
interface CellPosition {
  x: number;
  y: number;
}

/**
 * Gridstack Widget creation options
 * @param x widget position x (default?: 0)
 * @param y widget position y (default?: 0)
 * @param width  widget dimension width (default?: 1)
 * @param height widget dimension height (default?: 1)
 * @param autoPosition if true then x, y parameters will be ignored and widget will be places on the first available position (default?: false)
 * @param minWidth minimum width allowed during resize/creation (default?: undefined = un-constrained)
 * @param maxWidth maximum width allowed during resize/creation (default?: undefined = un-constrained)
 * @param minHeight minimum height allowed during resize/creation (default?: undefined = un-constrained)
 * @param maxHeight maximum height allowed during resize/creation (default?: undefined = un-constrained)
 * @param id value for `data-gs-id` stored on the widget (default?: undefined)
 */
interface GridstackWidget {
  x ? : number;
  y ? : number;
  width ? : number;
  height ? : number;
  autoPosition ? : boolean;
  minWidth ? : number;
  maxWidth ? : number;
  minHeight ? : number;
  maxHeight ? : number;
  id ? : number | string;
}

declare namespace GridStackUI {
  interface Utils {
    /**
     * Sorts array of nodes
     * @param nodes array to sort
     * @param dir 1 for asc, -1 for desc (optional)
     * @param width width of the grid. If undefined the width will be calculated automatically (optional).
     **/
    sort(nodes: HTMLElement[], dir ? : number, width ? : number): void;
  }
}

/**
 * Gridstack Options
 * Defines the options for a Gridstack
 */
interface GridstackOptions {
  /**
   * if true of jquery selector the grid will accept widgets dragged from other grids or from
   * outside (default: false) See [example](http://gridstack.github.io/gridstack.js/demo/two.html)
   */
  acceptWidgets ? : boolean | string | ((i: number, element: Element) => boolean | string);

  /**
   * if true the resizing handles are shown even if the user is not hovering over the widget (default?: false)
   */
  alwaysShowResizeHandle ? : boolean;

  /**
   * turns animation on (default?: true)
   */
  animate ? : boolean;

  /**
   * if false gridstack will not initialize existing items (default?: true)
   */
  auto ? : boolean;

  /**
   * one cell height (default?: 60). Can be:
   *  an integer (px)
   *  a string (ex: '10em', '100px', '10rem')
   *  0 or null, in which case the library will not generate styles for rows. Everything must be defined in CSS files.
   *  'auto' - height will be calculated from cell width.
   */
  cellHeight ? : number | string;

  /**
   * (internal?) unit for cellHeight (default? 'px')
   */
  cellHeightUnit ? : string;

  /** class that implement drag'n'drop functionality for gridstack. If false grid will be static.
   * (default?: null - first available plugin will be used)
   */
  ddPlugin ? : boolean | null | any;

  /** disallows dragging of widgets (default?: false) */
  disableDrag ? : boolean;

  /** disallows resizing of widgets (default?: false). */
  disableResize ? : boolean;

  /**
   * allows to override jQuery UI draggable options. (default?: { handle?: '.grid-stack-item-content', scroll?: true, appendTo?: 'body' })
   */
  draggable ? : {};

  /**
   * draggable handle selector (default?: '.grid-stack-item-content')
   */
  handle ? : string;

  /** draggable handle class (e.g. 'grid-stack-item-content'). If set 'handle' is ignored (default?: null) */
  handleClass ? : string;

  /**
   * number of columns (default?: 12). Note: IF you change this, CSS also have to change. See https://github.com/gridstack/gridstack.js#change-grid-columns
   */
  column ? : number;

  /**
   * maximum rows amount. Default? is 0 which means no maximum rows
   */
  maxRow ? : number;

  /**
   * enable floating widgets (default?: false) See example (http://gridstack.github.io/gridstack.js/demo/float.html)
   */
  float ? : boolean;

  /**
   * widget class (default?: 'grid-stack-item')
   */
  itemClass ? : string;

  /**
   * minimal width. If window width is less, grid will be shown in one - column mode (default?: 768)
   */
  minWidth ? : number;

  /** disables the onColumnMode when the window width is less than minWidth (default?: false) */
  disableOneColumnMode ? : boolean;

  /**
   * class set on grid when in one column mode (default?: 'grid-stack-one-column-mode')
   */
  oneColumnModeClass ? : string;

  /**
   * class for placeholder (default?: 'grid-stack-placeholder')
   */
  placeholderClass ? : string;

  /** placeholder default content (default?: '') */
  placeholderText ? : string;

  /**
   * allows to override jQuery UI resizable options. (default?: { autoHide?: true, handles?: 'se' })
   */
  resizable ? : {};

  /**
   * if true widgets could be removed by dragging outside of the grid. It could also be a jQuery selector string,
   * in this case widgets will be removed by dropping them there (default?: false)
   * See example (http://gridstack.github.io/gridstack.js/demo/two.html)
   */
  removable ? : boolean | string;

  /**
   * time in milliseconds before widget is being removed while dragging outside of the grid. (default?: 2000)
   */
  removeTimeout ? : number;

  /**
   * if true turns grid to RTL. Possible values are true, false, 'auto' (default?: 'auto')
   * See [example](http://gridstack.github.io/gridstack.js/demo/rtl.html)
   */
  rtl ? : boolean | 'auto';

  /**
   * makes grid static (default?: false).If true widgets are not movable/resizable.
   * You don't even need jQueryUI draggable/resizable. A CSS class
   * 'grid-stack-static' is also added to the container.
   */
  staticGrid ? : boolean;

  /**
   * vertical gap size (default?: 20). Can be:
   *  an integer (px)
   *  a string (ex: '2em', '20px', '2rem')
   */
  verticalMargin ? : number | string;

  /**
   * (internal?) unit for verticalMargin (default? 'px')
   */
  verticalMarginUnit ? : string;
}