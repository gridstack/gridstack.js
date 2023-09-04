/**
 * types.ts 9.0.2-dev
 * Copyright (c) 2021 Alain Dumesny - see GridStack root license
 */

import { GridStack } from './gridstack';
import { GridStackEngine } from './gridstack-engine';

// default values for grid options - used during init and when saving out
export const gridDefaults: GridStackOptions = {
  alwaysShowResizeHandle: 'mobile',
  animate: true,
  auto: true,
  cellHeight: 'auto',
  cellHeightThrottle: 100,
  cellHeightUnit: 'px',
  column: 12,
  draggable: { handle: '.grid-stack-item-content', appendTo: 'body', scroll: true },
  handle: '.grid-stack-item-content',
  itemClass: 'grid-stack-item',
  margin: 10,
  marginUnit: 'px',
  maxRow: 0,
  minRow: 0,
  oneColumnSize: 768,
  placeholderClass: 'grid-stack-placeholder',
  placeholderText: '',
  removableOptions: { accept: 'grid-stack-item', decline: 'grid-stack-non-removable'},
  resizable: { handles: 'se' },
  rtl: 'auto',

  // **** same as not being set ****
  // disableDrag: false,
  // disableOneColumnMode: false,
  // disableResize: false,
  // float: false,
  // handleClass: null,
  // oneColumnModeDomSort: false,
  // removable: false,
  // staticGrid: false,
  // styleInHead: false,
  //removable
};

/** default dragIn options */
export const dragInDefaultOptions: DDDragInOpt = {
  handle: '.grid-stack-item-content',
  appendTo: 'body',
  // revert: 'invalid',
  // scroll: false,
};

/** 
 * different layout options when changing # of columns, including a custom function that takes new/old column count, and array of new/old positions
 * Note: new list may be partially already filled if we have a cache of the layout at that size and new items were added later.
 * Options are:
 * 'list' - treat items as sorted list, keeping items (un-sized unless too big for column count) sequentially reflowing them
 * 'compact' - similar to list, but using compact() method which will possibly re-order items if an empty slots are available due to a larger item needing to be pushed to next row
 * 'moveScale' - will scale and move items by the ratio new newColumnCount / oldColumnCount
 * 'move' | 'scale' - will only size or move items
 * 'none' will leave items unchanged, unless they don't fit in column count
 */
export type ColumnOptions = 'list' | 'compact' | 'moveScale' | 'move' | 'scale' | 'none' |
  ((column: number, oldColumn: number, nodes: GridStackNode[], oldNodes: GridStackNode[]) => void);
export type CompactOptions = 'list' | 'compact';
export type numberOrString = number | string;
export interface GridItemHTMLElement extends HTMLElement {
  /** pointer to grid node instance */
  gridstackNode?: GridStackNode;
  /** @internal */
  _gridstackNodeOrig?: GridStackNode;
}

export type GridStackElement = string | HTMLElement | GridItemHTMLElement;

/** specific and general event handlers for the .on() method */
export type GridStackEventHandler = (event: Event) => void;
export type GridStackElementHandler = (event: Event, el: GridItemHTMLElement) => void;
export type GridStackNodesHandler = (event: Event, nodes: GridStackNode[]) => void;
export type GridStackDroppedHandler = (event: Event, previousNode: GridStackNode, newNode: GridStackNode) => void;
export type GridStackEventHandlerCallback = GridStackEventHandler | GridStackElementHandler | GridStackNodesHandler | GridStackDroppedHandler;

/** optional function called during load() to callback the user on new added/remove grid items | grids */
export type AddRemoveFcn = (parent: HTMLElement, w: GridStackWidget, add: boolean, grid: boolean) => HTMLElement | undefined;

/** optional function called during save() to let the caller add additional custom data to the GridStackWidget structure that will get returned */
export type SaveFcn = (node: GridStackNode, w: GridStackWidget) => void;

export type ResizeToContentFcn = (els: GridItemHTMLElement) => void;

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

  /** possible values (default: `mobile`) - does not apply to non-resizable widgets
    * `false` the resizing handles are only shown while hovering over a widget
    * `true` the resizing handles are always shown
    * 'mobile' if running on a mobile device, default to `true` (since there is no hovering per say), else `false`.
    See [example](http://gridstack.github.io/gridstack.js/demo/mobile.html) */
  alwaysShowResizeHandle?: true | false | 'mobile';

  /** turns animation on (default?: true) */
  animate?: boolean;

  /** if false gridstack will not initialize existing items (default?: true) */
  auto?: boolean;

  /**
   * one cell height (default?: 'auto'). Can be:
   *  an integer (px)
   *  a string (ex: '100px', '10em', '10rem'). Note: % doesn't right - see demo/cell-height.html
   *  0, in which case the library will not generate styles for rows. Everything must be defined in your own CSS files.
   *  'auto' - height will be calculated for square cells (width / column) and updated live as you resize the window - also see `cellHeightThrottle`
   *  'initial' - similar to 'auto' (start at square cells) but stay that size during window resizing.
   */
  cellHeight?: numberOrString;

  /** throttle time delay (in ms) used when cellHeight='auto' to improve performance vs usability (default?: 100).
   * A value of 0 will make it instant at a cost of re-creating the CSS file at ever window resize event!
   * */
  cellHeightThrottle?: number;

  /** (internal) unit for cellHeight (default? 'px') which is set when a string cellHeight with a unit is passed (ex: '10rem') */
  cellHeightUnit?: string;

  /** list of children item to create when calling load() or addGrid() */
  children?: GridStackWidget[];

  /** number of columns (default?: 12). Note: IF you change this, CSS also have to change. See https://github.com/gridstack/gridstack.js#change-grid-columns.
   * Note: for nested grids, it is recommended to use 'auto' which will always match the container grid-item current width (in column) to keep inside and outside
   * items always to same. flag is not supported for regular non-nested grids.
   */
  column?: number | 'auto';

  /** additional class on top of '.grid-stack' (which is required for our CSS) to differentiate this instance.
  Note: only used by addGrid(), else your element should have the needed class */
  class?: string;

  /** disallows dragging of widgets (default?: false) */
  disableDrag?: boolean;

  /** disables the onColumnMode when the grid width is less than oneColumnSize (default?: false) */
  disableOneColumnMode?: boolean;

  /** disallows resizing of widgets (default?: false). */
  disableResize?: boolean;

  /** allows to override UI draggable options. (default?: { handle?: '.grid-stack-item-content', appendTo?: 'body' }) */
  draggable?: DDDragOpt;

  /** let user drag nested grid items out of a parent or not (default true - not supported yet) */
  //dragOut?: boolean;

  /** the type of engine to create (so you can subclass) default to GridStackEngine */
  engineClass?: typeof GridStackEngine;

  /** set to true if all grid items (by default, but item can also override) height should be based on content size instead of WidgetItem.h to avoid v-scrollbars.
   Note: this is still row based, not pixels, so it will use ceil(getBoundingClientRect().height / getCellHeight()) */
  sizeToContent?: boolean;

  /** enable floating widgets (default?: false) See example (http://gridstack.github.io/gridstack.js/demo/float.html) */
  float?: boolean;

  /** draggable handle selector (default?: '.grid-stack-item-content') */
  handle?: string;

  /** draggable handle class (e.g. 'grid-stack-item-content'). If set 'handle' is ignored (default?: null) */
  handleClass?: string;

  /** additional widget class (default?: 'grid-stack-item') */
  itemClass?: string;

  /**
   * gap between grid item and content (default?: 10). This will set all 4 sides and support the CSS formats below
   *  an integer (px)
   *  a string with possible units (ex: '2em', '20px', '2rem')
   *  string with space separated values (ex: '5px 10px 0 20px' for all 4 sides, or '5em 10em' for top/bottom and left/right pairs like CSS).
   * Note: all sides must have same units (last one wins, default px)
   */
  margin?: numberOrString;

  /** OLD way to optionally set each side - use margin: '5px 10px 0 20px' instead. Used internally to store each side. */
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

  /** If you are using a nonce-based Content Security Policy, pass your nonce here and
   * GridStack will add it to the <style> elements it creates. */
  nonce?: string;

  /** minimal width before grid will be shown in one column mode (default?: 768) */
  oneColumnSize?: number;

  /**
   * set to true if you want oneColumnMode to use the DOM order and ignore x,y from normal multi column
   * layouts during sorting. This enables you to have custom 1 column layout that differ from the rest. (default?: false)
   */
  oneColumnModeDomSort?: boolean;

  /** class for placeholder (default?: 'grid-stack-placeholder') */
  placeholderClass?: string;

  /** placeholder default content (default?: '') */
  placeholderText?: string;

  /** allows to override UI resizable options. (default?: { handles: 'se' }) */
  resizable?: DDResizeOpt;

  /**
   * if true widgets could be removed by dragging outside of the grid. It could also be a selector string (ex: ".trash"),
   * in this case widgets will be removed by dropping them there (default?: false)
   * See example (http://gridstack.github.io/gridstack.js/demo/two.html)
   */
  removable?: boolean | string;

  /** allows to override UI removable options. (default?: { accept: '.grid-stack-item' }) */
  removableOptions?: DDRemoveOpt;

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

  /** list of differences in options for automatically created sub-grids under us (inside our grid-items) */
  subGridOpts?: GridStackOptions;

  /** enable/disable the creation of sub-grids on the fly by dragging items completely
   * over others (nest) vs partially (push). Forces `DDDragOpt.pause=true` to accomplish that. */
  subGridDynamic?: boolean;
}

/** options used during GridStackEngine.moveNode() */
export interface GridStackMoveOpts extends GridStackPosition {
  /** node to skip collision */
  skip?: GridStackNode;
  /** do we pack (default true) */
  pack?: boolean;
  /** true if we are calling this recursively to prevent simple swap or coverage collision - default false*/
  nested?: boolean;
  /** vars to calculate other cells coordinates */
  cellWidth?: number;
  cellHeight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  /** position in pixels of the currently dragged items (for overlap check) */
  rect?: GridStackPosition;
  /** true if we're live resizing */
  resizing?: boolean;
  /** best node (most coverage) we collied with */
  collide?: GridStackNode;
}

export interface GridStackPosition {
  /** widget position x (default?: 0) */
  x?: number;
  /** widget position y (default?: 0) */
  y?: number;
  /** widget dimension width (default?: 1) */
  w?: number;
  /** widget dimension height (default?: 1) */
  h?: number;
}

/**
 * GridStack Widget creation options
 */
export interface GridStackWidget extends GridStackPosition {
  /** if true then x, y parameters will be ignored and widget will be places on the first available position (default?: false) */
  autoPosition?: boolean;
  /** minimum width allowed during resize/creation (default?: undefined = un-constrained) */
  minW?: number;
  /** maximum width allowed during resize/creation (default?: undefined = un-constrained) */
  maxW?: number;
  /** minimum height allowed during resize/creation (default?: undefined = un-constrained) */
  minH?: number;
  /** maximum height allowed during resize/creation (default?: undefined = un-constrained) */
  maxH?: number;
  /** prevent resizing (default?: undefined = un-constrained) */
  noResize?: boolean;
  /** prevents moving (default?: undefined = un-constrained) */
  noMove?: boolean;
  /** prevents being moved by others during their (default?: undefined = un-constrained) */
  locked?: boolean;
  /** value for `gs-id` stored on the widget (default?: undefined) */
  id?: string;
  /** html to append inside as content */
  content?: string;
  /** local (vs grid) override - see GridStackOptions. 
   * Note: This also allow you to set a maximum h value (but user changeable during normal resizing) to prevent unlimited content from taking too much space (get scrollbar) */
  sizeToContent?: boolean | number;
  /** optional nested grid options and list of children, which then turns into actual instance at runtime to get options from */
  subGridOpts?: GridStackOptions;
}

/** Drag&Drop resize options */
export interface DDResizeOpt {
  /** do resize handle hide by default until mouse over ? - default: true on desktop, false on mobile*/
  autoHide?: boolean;
  /**
   * sides where you can resize from (ex: 'e, se, s, sw, w') - default 'se' (south-east)
   * Note: it is not recommended to resize from the top sides as weird side effect may occur.
  */
  handles?: string;
}

/** Drag&Drop remove options */
export interface DDRemoveOpt {
  /** class that can be removed (default?: opts.itemClass) */
  accept?: string;
  /** class that cannot be removed (default: 'grid-stack-non-removable') */
  decline?: string;
}

/** Drag&Drop dragging options */
export interface DDDragOpt {
  /** class selector of items that can be dragged. default to '.grid-stack-item-content' */
  handle?: string;
  /** default to 'body' */
  appendTo?: string;
  /** if set (true | msec), dragging placement (collision) will only happen after a pause by the user. Note: this is Global */
  pause?: boolean | number;
  /** default to `true` */
  scroll?: boolean;
  /** prevents dragging from starting on specified elements, listed as comma separated selectors (eg: '.no-drag'). default built in is 'input,textarea,button,select,option' */
  cancel?: string;
}
export interface DDDragInOpt extends DDDragOpt {
  /** helper function when dropping: 'clone' or your own method */
  helper?: 'clone' | ((event: Event) => HTMLElement);
  /** used when dragging item from the outside, and canceling (ex: 'invalid' or your own method)*/
  // revert?: string | ((event: Event) => HTMLElement);
}

export interface Size {
  width: number;
  height: number;
}
export interface Position {
  top: number;
  left: number;
}
export interface Rect extends Size, Position {}

/** data that is passed during drag and resizing callbacks */
export interface DDUIData {
  position?: Position;
  size?: Size;
  draggable?: HTMLElement;
  /* fields not used by GridStack but sent by jq ? leave in case we go back to them...
  originalPosition? : Position;
  offset?: Position;
  originalSize?: Size;
  element?: HTMLElement[];
  helper?: HTMLElement[];
  originalElement?: HTMLElement[];
  */
}

/**
 * internal descriptions describing the items in the grid
 */
export interface GridStackNode extends GridStackWidget {
  /** pointer back to HTML element */
  el?: GridItemHTMLElement;
  /** pointer back to parent Grid instance */
  grid?: GridStack;
  /** actual sub-grid instance */
  subGrid?: GridStack;
  /** @internal internal id used to match when cloning engines or saving column layouts */
  _id?: number;
  /** @internal */
  _dirty?: boolean;
  /** @internal */
  _updating?: boolean;
  /** @internal true when over trash/another grid so we don't bother removing drag CSS style that would animate back to old position */
  _isAboutToRemove?: boolean;
  /** @internal true if item came from outside of the grid -> actual item need to be moved over */
  _isExternal?: boolean;
  /** @internal Mouse event that's causing moving|resizing */
  _event?: MouseEvent;
  /** @internal moving vs resizing */
  _moving?: boolean;
  /** @internal true if we jumped down past item below (one time jump so we don't have to totally pass it) */
  _skipDown?: boolean;
  /** @internal original values before a drag/size */
  _orig?: GridStackPosition;
  /** @internal position in pixels used during collision check  */
  _rect?: GridStackPosition;
  /** @internal top/left pixel location before a drag so we can detect direction of move from last position*/
  _lastUiPosition?: Position;
  /** @internal set on the item being dragged/resized remember the last positions we've tried (but failed) so we don't try again during drag/resize */
  _lastTried?: GridStackPosition;
  /** @internal position willItFit() will use to position the item */
  _willFitPos?: GridStackPosition;
  /** @internal last drag Y pixel position used to incrementally update V scroll bar */
  _prevYPix?: number;
  /** @internal true if we've remove the item from ourself (dragging out) but might revert it back (release on nothing -> goes back) */
  _temporaryRemoved?: boolean;
  /** @internal true if we should remove DOM element on _notify() rather than clearing _id (old way) */
  _removeDOM?: boolean;
  /** @internal */
  _initDD?: boolean;
}
