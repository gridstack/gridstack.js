// types.ts 2.0.2-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/

import { GridStack } from './gridstack';
import { GridStackDD } from './gridstack-dd';


/** different layout options when changing # of columns and other re-layouts */
export type LayoutOptions = 'moveScale' | 'move' | 'scale' | 'none';

export type numberOrString = number | string;
export interface GridItemHTMLElement extends HTMLElement {
  /** pointer to grid node instance */
  gridstackNode?: GridStackNode;
  /** @internal */
  _gridstackNodeOrig?: GridStackNode;
}

/**
 * Defines the options for a Grid
 */
export interface GridStackOptions {
  /**
   * accept widgets dragged from other grids or from outside (default: `false`). Can be:
   * `true` (uses `'.grid-stack-item'` class filter) or `false`,
   * string for explicit class name,
   * function returning a boolean. See [example](http://gridstack.github.io/gridstack.js/demo/two.html)
   */
  acceptWidgets?: boolean | string | ((element: Element) => boolean);

  /** if true the resizing handles are shown even if the user is not hovering over the widget (default?: false) */
  alwaysShowResizeHandle?: boolean;

  /** turns animation on (default?: true) */
  animate?: boolean;

  /** if false gridstack will not initialize existing items (default?: true) */
  auto?: boolean;

  /**
   * one cell height (default?: 60). Can be:
   *  an integer (px)
   *  a string (ex: '100px', '10em', '10rem', '10%')
   *  0 or null, in which case the library will not generate styles for rows. Everything must be defined in CSS files.
   *  'auto' - height will be calculated to match cell width (initial square grid).
   */
  cellHeight?: numberOrString;

  /** (internal) unit for cellHeight (default? 'px') which is set when a string cellHeight with a unit is passed (ex: '10rem') */
  cellHeightUnit?: string;

  /** number of columns (default?: 12). Note: IF you change this, CSS also have to change. See https://github.com/gridstack/gridstack.js#change-grid-columns */
  column?: number;

  /** class that implement drag'n'drop functionality for gridstack. If false grid will be static.
   * (default?: undefined - first available plugin will be used)
   */
  ddPlugin?: false | typeof GridStackDD;

  /** disallows dragging of widgets (default?: false) */
  disableDrag?: boolean;

  /** disables the onColumnMode when the grid width is less than minWidth (default?: false) */
  disableOneColumnMode?: boolean;

  /** disallows resizing of widgets (default?: false). */
  disableResize?: boolean;

  /** allows to override UI draggable options. (default?: { handle?: '.grid-stack-item-content', scroll?: true, appendTo?: 'body', containment: null }) */
  draggable?: DDDragOpt;

  /** allows to drag external items using this selector - see dragInOptions. (default: undefined) */
  dragIn?: string;

  /** allows to drag external items using these options. (default?: { handle: '.grid-stack-item-content', revert: 'invalid', scroll: false, appendTo: 'body', helper: 'clone' }) */
  dragInOptions?: DDDragInOpt;

  /** let user drag nested grid items out of a parent or not (default false) */
  dragOut?: boolean;

  /** enable floating widgets (default?: false) See example (http://gridstack.github.io/gridstack.js/demo/float.html) */
  float?: boolean;

  /** draggable handle selector (default?: '.grid-stack-item-content') */
  handle?: string;

  /** draggable handle class (e.g. 'grid-stack-item-content'). If set 'handle' is ignored (default?: null) */
  handleClass?: string;

  /** widget class (default?: 'grid-stack-item') */
  itemClass?: string;

  /**
   * gap size between grid item and content (default?: 10). see also marginTop, marginRight,... Can be:
   *  an integer (px)
   *  a string (ex: '2em', '20px', '2rem')
   */
  margin?: numberOrString;

  /** optional way to specify each individual margin side - default to margin */
  marginTop?: numberOrString;
  marginRight?: numberOrString;
  marginBottom?: numberOrString;
  marginLeft?: numberOrString;

  /** (internal) unit for margin (default? 'px') set when `margin` is set as string with unit (ex: 2rem') */
  marginUnit?: string;

  /** maximum rows amount. Default? is 0 which means no maximum rows */
  maxRow?: number;

  /** minimum rows amount. Default is `0`. You can also do this with `min-height` CSS attribute
   * on the grid div in pixels, which will round to the closest row.
   */
  minRow?: number;

  /** minimal width. If grid width is less, grid will be shown in one column mode (default?: 768) */
  minWidth?: number;

  /**
   * set to true if you want oneColumnMode to use the DOM order and ignore x,y from normal multi column
   * layouts during sorting. This enables you to have custom 1 column layout that differ from the rest. (default?: false)
   */
  oneColumnModeDomSort?: boolean;

  /** class for placeholder (default?: 'grid-stack-placeholder') */
  placeholderClass?: string;

  /** placeholder default content (default?: '') */
  placeholderText?: string;

  /** allows to override UI resizable options. (default?: { autoHide: true, handles: 'se' }) */
  resizable?: DDResizeOpt;

  /**
   * if true widgets could be removed by dragging outside of the grid. It could also be a selector string (ex: ".trash"),
   * in this case widgets will be removed by dropping them there (default?: false)
   * See example (http://gridstack.github.io/gridstack.js/demo/two.html)
   */
  removable?: boolean | string;

  /** allows to override UI removable options. (default?: { accept: '.' + opts.itemClass }) */
  removableOptions?: DDRemoveOpt;

  /** time in milliseconds before widget is being removed while dragging outside of the grid. (default?: 2000) */
  removeTimeout?: number;

  /** fix grid number of rows. This is a shortcut of writing `minRow:N, maxRow:N`. (default `0` no constrain) */
  row?: number;

  /**
   * if true turns grid to RTL. Possible values are true, false, 'auto' (default?: 'auto')
   * See [example](http://gridstack.github.io/gridstack.js/demo/rtl.html)
   */
  rtl?: boolean | 'auto';

  /**
   * makes grid static (default?: false). If `true` widgets are not movable/resizable.
   * You don't even need draggable/resizable. A CSS class
   * 'grid-stack-static' is also added to the element.
   */
  staticGrid?: boolean;

  /** if `true` will add style element to `<head>` otherwise will add it to element's parent node (default `false`). */
  styleInHead?: boolean;

  /** @internal */
  _isNested?: boolean;
  /** @internal */
  _class?: string;
}


/**
 * GridStack Widget creation options
 */
export interface GridStackWidget {
  /** widget position x (default?: 0) */
  x?: number;
  /** widget position y (default?: 0) */
  y?: number;
  /** widget dimension width (default?: 1) */
  width?: number;
  /** widget dimension height (default?: 1) */
  height?: number;
  /** if true then x, y parameters will be ignored and widget will be places on the first available position (default?: false) */
  autoPosition?: boolean;
  /** minimum width allowed during resize/creation (default?: undefined = un-constrained) */
  minWidth?: number;
  /** maximum width allowed during resize/creation (default?: undefined = un-constrained) */
  maxWidth?: number;
  /** minimum height allowed during resize/creation (default?: undefined = un-constrained) */
  minHeight?: number;
  /** maximum height allowed during resize/creation (default?: undefined = un-constrained) */
  maxHeight?: number;
  /** prevent resizing (default?: undefined = un-constrained) */
  noResize?: boolean;
  /** prevents moving (default?: undefined = un-constrained) */
  noMove?: boolean;
  /** prevents moving and resizing (default?: undefined = un-constrained) */
  locked?: boolean;
  /** widgets can have their own resize handles. For example 'e,w' will make the particular widget only resize east and west. */
  resizeHandles?: string;
  /** value for `data-gs-id` stored on the widget (default?: undefined) */
  id?: numberOrString;
  /** html to append inside as content */
  content?: string;
}

/** Drag&Drop resize options */
export interface DDResizeOpt {
  /** do resize handle hide by default until mouse over ? - default: true */
  autoHide?: boolean;
  /**
   * sides where you can resize from (ex: 'e, se, s, sw, w') - default 'se' (south-east)
   * Note: it is not recommended to resize from the top sides as weird side effect may occur.
  */
  handles?: string;
}

/** Drag&Drop remove options */
export interface DDRemoveOpt {
  /** class that can be removed (default?: '.' + opts.itemClass) */
  accept?: string;
}

/** Drag&Drop dragging options */
export interface DDDragOpt {
  /** class selector of items that can be dragged. default to '.grid-stack-item-content' */
  handle?: string;
  /** default to `true` */
  scroll?: boolean;
  /** default to 'body' */
  appendTo?: string;
  /** parent constraining where item can be dragged out from (default: null = no constrain) */
  containment?: string;
}
export interface DDDragInOpt extends DDDragOpt {
    /** used when dragging item from the outside, and canceling (ex: 'invalid' or your own method)*/
    revert?: string | ((event: Event) => HTMLElement);
    /** helper function when dropping (ex: 'clone' or your own method) */
    helper?: string | ((event: Event) => HTMLElement);
}

/**
 * internal descriptions describing the items in the grid
 */
export interface GridStackNode extends GridStackWidget {
  /** pointer back to HTML element */
  el?: GridItemHTMLElement;
  /** pointer back to Grid instance */
  grid?: GridStack;
  /** @internal */
  _id?: number;
  /** @internal */
  _dirty?: boolean;
  /** @internal */
  _updating?: boolean;
  /** @internal */
  _added?: boolean;
  /** @internal */
  _temporary?: boolean;
  /** @internal */
  _isOutOfGrid?: boolean;
  /** @internal */
  _origX?: number;
  /** @internal */
  _origY?: number;
  /** @internal */
  _packY?: number;
  /** @internal */
  _origW?: number;
  /** @internal */
  _origH?: number;
  /** @internal */
  _lastTriedX?: number;
  /** @internal */
  _lastTriedY?: number;
  /** @internal */
  _lastTriedWidth?: number;
  /** @internal */
  _lastTriedHeight?: number;
  /** @internal */
  _isAboutToRemove?: boolean;
  /** @internal */
  _removeTimeout?: number;
  /** @internal */
  _beforeDragX?: number;
  /** @internal */
  _beforeDragY?: number;
  /** @internal */
  _prevYPix?: number;
  /** @internal */
  _temporaryRemoved?: boolean;
  /** @internal */
  _initDD?: boolean;
}
