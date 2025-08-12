/**
 * types.ts 12.3.2
 * Copyright (c) 2021-2025 Alain Dumesny - see GridStack root license
 */

import { GridStack } from './gridstack';
import { GridStackEngine } from './gridstack-engine';

/**
 * Default values for grid options - used during initialization and when saving out grid configuration.
 * These values are applied when options are not explicitly provided.
 */
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
  placeholderClass: 'grid-stack-placeholder',
  placeholderText: '',
  removableOptions: { accept: 'grid-stack-item', decline: 'grid-stack-non-removable'},
  resizable: { handles: 'se' },
  rtl: 'auto',

  // **** same as not being set ****
  // disableDrag: false,
  // disableResize: false,
  // float: false,
  // handleClass: null,
  // removable: false,
  // staticGrid: false,
  //removable
};

/**
 * Different layout options when changing the number of columns.
 * 
 * These options control how widgets are repositioned when the grid column count changes.
 * Note: The new list may be partially filled if there's a cached layout for that size.
 * 
 * Options:
 * - `'list'`: Treat items as a sorted list, keeping them sequentially without resizing (unless too big)
 * - `'compact'`: Similar to list, but uses compact() method to fill empty slots by reordering
 * - `'moveScale'`: Scale and move items by the ratio of newColumnCount / oldColumnCount
 * - `'move'`: Only move items, keep their sizes
 * - `'scale'`: Only scale items, keep their positions
 * - `'none'`: Leave items unchanged unless they don't fit in the new column count
 * - Custom function: Provide your own layout logic
 */
export type ColumnOptions = 'list' | 'compact' | 'moveScale' | 'move' | 'scale' | 'none' |
  ((column: number, oldColumn: number, nodes: GridStackNode[], oldNodes: GridStackNode[]) => void);
/**
 * Options for the compact() method to reclaim empty space.
 * - `'list'`: Keep items in order, move them up sequentially
 * - `'compact'`: Find truly empty spaces, may reorder items for optimal fit
 */
export type CompactOptions = 'list' | 'compact';
/**
 * Type representing values that can be either numbers or strings (e.g., dimensions with units).
 * Used for properties like width, height, margins that accept both numeric and string values.
 */
export type numberOrString = number | string;
/**
 * Extended HTMLElement interface for grid items.
 * All grid item DOM elements implement this interface to provide access to their grid data.
 */
export interface GridItemHTMLElement extends HTMLElement {
  /** Pointer to the associated grid node instance containing position, size, and other widget data */
  gridstackNode?: GridStackNode;
  /** @internal Original node data (used for restoring during drag operations) */
  _gridstackNodeOrig?: GridStackNode;
}

/**
 * Type representing various ways to specify grid elements.
 * Can be a CSS selector string, HTMLElement, or GridItemHTMLElement.
 */
export type GridStackElement = string | HTMLElement | GridItemHTMLElement;

/**
 * Event handler function types for the .on() method.
 * Different handlers receive different parameters based on the event type.
 */

/** General event handler that receives only the event */
export type GridStackEventHandler = (event: Event) => void;

/** Element-specific event handler that receives event and affected element */
export type GridStackElementHandler = (event: Event, el: GridItemHTMLElement) => void;

/** Node-based event handler that receives event and array of affected nodes */
export type GridStackNodesHandler = (event: Event, nodes: GridStackNode[]) => void;

/** Drop event handler that receives previous and new node states */
export type GridStackDroppedHandler = (event: Event, previousNode: GridStackNode, newNode: GridStackNode) => void;

/** Union type of all possible event handler types */
export type GridStackEventHandlerCallback = GridStackEventHandler | GridStackElementHandler | GridStackNodesHandler | GridStackDroppedHandler;

/**
 * Optional callback function called during load() operations.
 * Allows custom handling of widget addition/removal for framework integration.
 * 
 * @param parent - The parent HTML element
 * @param w - The widget definition
 * @param add - True if adding, false if removing
 * @param grid - True if this is a grid operation
 * @returns The created/modified HTML element, or undefined
 */
export type AddRemoveFcn = (parent: HTMLElement, w: GridStackWidget, add: boolean, grid: boolean) => HTMLElement | undefined;

/**
 * Optional callback function called during save() operations.
 * Allows adding custom data to the saved widget structure.
 * 
 * @param node - The internal grid node
 * @param w - The widget structure being saved (can be modified)
 */
export type SaveFcn = (node: GridStackNode, w: GridStackWidget) => void;

/**
 * Optional callback function for custom widget content rendering.
 * Called during load()/addWidget() to create custom content beyond plain text.
 * 
 * @param el - The widget's content container element
 * @param w - The widget definition with content and other properties
 */
export type RenderFcn = (el: HTMLElement, w: GridStackWidget) => void;

/**
 * Optional callback function for custom resize-to-content behavior.
 * Called when a widget needs to resize to fit its content.
 * 
 * @param el - The grid item element to resize
 */
export type ResizeToContentFcn = (el: GridItemHTMLElement) => void;

/**
 * Configuration for responsive grid behavior.
 * 
 * Defines how the grid responds to different screen sizes by changing column counts.
 * NOTE: Make sure to include the appropriate CSS (gridstack-extra.css) to support responsive behavior.
 */
export interface Responsive {
  /** wanted width to maintain (+-50%) to dynamically pick a column count. NOTE: make sure to have correct extra CSS to support this. */
  columnWidth?: number;
  /** maximum number of columns allowed (default: 12). NOTE: make sure to have correct extra CSS to support this. */
  columnMax?: number;
  /** explicit width:column breakpoints instead of automatic 'columnWidth'. NOTE: make sure to have correct extra CSS to support this. */
  breakpoints?: Breakpoint[];
  /** specify if breakpoints are for window size or grid size (default:false = grid) */
  breakpointForWindow?: boolean;
  /** global re-layout mode when changing columns */
  layout?: ColumnOptions;
}

/**
 * Defines a responsive breakpoint for automatic column count changes.
 * Used with the responsive.breakpoints option.
 */
export interface Breakpoint {
  /** Maximum width (in pixels) for this breakpoint to be active */
  w?: number;
  /** Number of columns to use when this breakpoint is active */
  c: number;
  /** Layout mode for this specific breakpoint (overrides global responsive.layout) */
  layout?: ColumnOptions;
  /** TODO: Future feature - specific children layout for this breakpoint */
  // children?: GridStackWidget[];
}

/**
 * Defines the options for a Grid
 */
export interface GridStackOptions {
  /**
   * Accept widgets dragged from other grids or from outside (default: `false`). Can be:
   * - `true`: will accept HTML elements having 'grid-stack-item' as class attribute
   * - `false`: will not accept any external widgets
   * - string: explicit class name to accept instead of default
   * - function: callback called before an item will be accepted when entering a grid
   * 
   * @example
   * // Accept all grid items
   * acceptWidgets: true
   * 
   * // Accept only items with specific class
   * acceptWidgets: 'my-draggable-item'
   * 
   * // Custom validation function
   * acceptWidgets: (el) => {
   *   return el.getAttribute('data-accept') === 'true';
   * }
   * 
   * @see {@link http://gridstack.github.io/gridstack.js/demo/two.html} for complete example
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
   * One cell height (default: 'auto'). Can be:
   * - an integer (px): fixed pixel height
   * - a string (ex: '100px', '10em', '10rem'): CSS length value
   * - 0: library will not generate styles for rows (define your own CSS)
   * - 'auto': height calculated for square cells (width / column) and updated live on window resize
   * - 'initial': similar to 'auto' but stays fixed size during window resizing
   * 
   * Note: % values don't work correctly - see demo/cell-height.html
   * 
   * @example
   * // Fixed 100px height
   * cellHeight: 100
   * 
   * // CSS units
   * cellHeight: '5rem'
   * cellHeight: '100px'
   * 
   * // Auto-sizing for square cells
   * cellHeight: 'auto'
   * 
   * // No CSS generation (custom styles)
   * cellHeight: 0
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
   * items always the same. flag is NOT supported for regular non-nested grids.
   */
  column?: number | 'auto';

  /** responsive column layout for width:column behavior */
  columnOpts?: Responsive;

  /** additional class on top of '.grid-stack' (which is required for our CSS) to differentiate this instance.
  Note: only used by addGrid(), else your element should have the needed class */
  class?: string;

  /** disallows dragging of widgets (default?: false) */
  disableDrag?: boolean;

  /** disallows resizing of widgets (default?: false). */
  disableResize?: boolean;

  /** allows to override UI draggable options. (default?: { handle?: '.grid-stack-item-content', appendTo?: 'body' }) */
  draggable?: DDDragOpt;

  /** let user drag nested grid items out of a parent or not (default true - not supported yet) */
  //dragOut?: boolean;

  /** the type of engine to create (so you can subclass) default to GridStackEngine */
  engineClass?: typeof GridStackEngine;

  /** enable floating widgets (default?: false) See example (http://gridstack.github.io/gridstack.js/demo/float.html) */
  float?: boolean;

  /** draggable handle selector (default?: '.grid-stack-item-content') */
  handle?: string;

  /** draggable handle class (e.g. 'grid-stack-item-content'). If set 'handle' is ignored (default?: null) */
  handleClass?: string;

  /** additional widget class (default?: 'grid-stack-item') */
  itemClass?: string;

  /** re-layout mode when we're a subgrid and we are being resized. default to 'list' */
  layout?: ColumnOptions;

  /** true when widgets are only created when they scroll into view (visible) */
  lazyLoad?: boolean;

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

  /** minimum rows amount which is handy to prevent grid from collapsing when empty. Default is `0`.
   * When no set the `min-height` CSS attribute on the grid div (in pixels) can be used, which will round to the closest row.
   */
  minRow?: number;

  /** If you are using a nonce-based Content Security Policy, pass your nonce here and
   * GridStack will add it to the <style> elements it creates. */
  nonce?: string;

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
   * See [example](http://gridstack.github.io/gridstack.js/demo/right-to-left(rtl).html)
   */
  rtl?: boolean | 'auto';

  /** set to true if all grid items (by default, but item can also override) height should be based on content size instead of WidgetItem.h to avoid v-scrollbars.
   * Note: this is still row based, not pixels, so it will use ceil(getBoundingClientRect().height / getCellHeight())
   */
  sizeToContent?: boolean;

  /**
   * makes grid static (default?: false). If `true` widgets are not movable/resizable.
   * You don't even need draggable/resizable. A CSS class
   * 'grid-stack-static' is also added to the element.
   */
  staticGrid?: boolean;

  /**
   * @deprecated Not used anymore, styles are now implemented with local CSS variables
   */
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
  /** for collision check even if we don't move */
  forceCollide?: boolean;
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
  /** prevent direct resizing by the user (default?: undefined = un-constrained) */
  noResize?: boolean;
  /** prevents direct moving by the user (default?: undefined = un-constrained) */
  noMove?: boolean;
  /** prevents being pushed by other widgets or api (default?: undefined = un-constrained), which is different from `noMove` (user action only) */
  locked?: boolean;
  /** value for `gs-id` stored on the widget (default?: undefined) */
  id?: string;
  /** html to append inside as content */
  content?: string;
  /** true when widgets are only created when they scroll into view (visible) */
  lazyLoad?: boolean;
  /** local (vs grid) override - see GridStackOptions.
   * Note: This also allow you to set a maximum h value (but user changeable during normal resizing) to prevent unlimited content from taking too much space (get scrollbar) */
  sizeToContent?: boolean | number;
  /** local override of GridStack.resizeToContentParent that specify the class to use for the parent (actual) vs child (wanted) height */
  resizeToContentParent?: string;
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
  /** helper function when dropping: 'clone' or your own method */
  helper?: 'clone' | ((el: HTMLElement) => HTMLElement);
  /** callbacks */
  start?: (event: Event, ui: DDUIData) => void;
  stop?: (event: Event) => void;
  drag?: (event: Event, ui: DDUIData) => void;
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
 * internal runtime descriptions describing the widgets in the grid
 */
export interface GridStackNode extends GridStackWidget {
  /** pointer back to HTML element */
  el?: GridItemHTMLElement;
  /** pointer back to parent Grid instance */
  grid?: GridStack;
  /** actual sub-grid instance */
  subGrid?: GridStack;
  /** allow delay creation when visible */
  visibleObservable?: IntersectionObserver;
  /** @internal internal id used to match when cloning engines or saving column layouts */
  _id?: number;
  /** @internal does the node attr ned to be updated due to changed x,y,w,h values */
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
  /** @internal is resizing? */
  _resizing?: boolean;
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
  /** @internal original position/size of item if dragged from sidebar */
  _sidebarOrig?: GridStackPosition;
  /** @internal had drag&drop been initialized */
  _initDD?: boolean;
}
