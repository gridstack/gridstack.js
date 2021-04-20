gridstack.js API
================

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Grid Options](#grid-options)
- [Grid attributes](#grid-attributes)
- [Item Options](#item-options)
- [Item attributes](#item-attributes)
- [Events](#events)
  - [added(event, items)](#addedevent-items)
  - [change(event, items)](#changeevent-items)
  - [disable(event)](#disableevent)
  - [dragstart(event, el)](#dragstartevent-el)
  - [drag(event, el)](#dragevent-el)
  - [dragstop(event, el)](#dragstopevent-el)
  - [dropped(event, previousWidget, newWidget)](#droppedevent-previouswidget-newwidget)
  - [enable(event)](#enableevent)
  - [removed(event, items)](#removedevent-items)
  - [resizestart(event, el)](#resizestartevent-el)
  - [resize(event, el)](#resizeevent-el)
  - [resizestop(event, el)](#resizestopevent-el)
- [API Global (static)](#api-global-static)
  - [`init(options: GridStackOptions = {}, elOrString: GridStackElement = '.grid-stack'): GridStack`](#initoptions-gridstackoptions---elorstring-gridstackelement--grid-stack-gridstack)
  - [`initAll(options: GridStackOptions = {}, selector = '.grid-stack'): GridStack[]`](#initalloptions-gridstackoptions---selector--grid-stack-gridstack)
  - [`addGrid(parent: HTMLElement, opt: GridStackOptions = {}): GridStack `](#addgridparent-htmlelement-opt-gridstackoptions---gridstack-)
  - [`setupDragIn(dragIn?: string, dragInOptions?: DDDragInOpt)`](#setupdragindragin-string-draginoptions-dddraginopt)
- [API](#api)
  - [`addWidget(el?: GridStackWidget | GridStackElement, options?: GridStackWidget)`](#addwidgetel-gridstackwidget--gridstackelement-options-gridstackwidget)
  - [`batchUpdate()`](#batchupdate)
  - [`compact()`](#compact)
  - [`cellHeight(val: number, update = true)`](#cellheightval-number-update--true)
  - [`cellWidth()`](#cellwidth)
  - [`commit()`](#commit)
  - [`column(column: number, layout: ColumnOptions = 'moveScale')`](#columncolumn-number-layout-columnoptions--movescale)
  - [`destroy([removeDOM])`](#destroyremovedom)
  - [`disable()`](#disable)
  - [`enable()`](#enable)
  - [`enableMove(doEnable)`](#enablemovedoenable)
  - [`enableResize(doEnable)`](#enableresizedoenable)
  - [`float(val?)`](#floatval)
  - [`getCellHeight()`](#getcellheight)
  - [`getCellFromPixel(position[, useOffset])`](#getcellfrompixelposition-useoffset)
  - [`getGridItems(): GridItemHTMLElement[]`](#getgriditems-griditemhtmlelement)
  - [`getMargin()`](#getmargin)
  - [`isAreaEmpty(x, y, width, height)`](#isareaemptyx-y-width-height)
  - [`load(layout: GridStackWidget[], boolean | ((w: GridStackWidget, add: boolean) => void)  = true)`](#loadlayout-gridstackwidget-boolean--w-gridstackwidget-add-boolean--void---true)
  - [`makeWidget(el)`](#makewidgetel)
  - [`margin(value: numberOrString)`](#marginvalue-numberorstring)
  - [`movable(el, val)`](#movableel-val)
  - [`removeWidget(el, removeDOM = true, triggerEvent = true)`](#removewidgetel-removedom--true-triggerevent--true)
  - [`removeAll(removeDOM = true)`](#removeallremovedom--true)
  - [`resizable(el, val)`](#resizableel-val)
  - [`save(saveContent = true): GridStackWidget[]`](#savesavecontent--true-gridstackwidget)
  - [`setAnimation(doAnimate)`](#setanimationdoanimate)
  - [`setStatic(staticValue)`](#setstaticstaticvalue)
  - [`update(el: GridStackElement, opts: GridStackWidget)`](#updateel-gridstackelement-opts-gridstackwidget)
  - [`willItFit(x, y, width, height, autoPosition)`](#willitfitx-y-width-height-autoposition)
- [Utils](#utils)
  - [`GridStack.Utils.sort(nodes[, dir[, width]])`](#gridstackutilssortnodes-dir-width)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Grid Options

- `acceptWidgets` - accept widgets dragged from other grids or from outside (default: `false`). Can be:
   * `true` (uses `'.grid-stack-item'` class filter) or `false`
   * string for explicit class name
   * `function (i: number, element: Element): boolean` See [example](http://gridstack.github.io/gridstack.js/demo/two.html)
- `alwaysShowResizeHandle` - possible values (default: `false` only show on hover)
   * `true` the resizing handles are always shown even if the user is not hovering over the widget
   * advance condition such as this mobile browser agent check:
   `alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent )`
   See [example](http://gridstack.github.io/gridstack.js/demo/mobile.html)
- `animate` - turns animation on to smooth transitions (default: `true`)
- `auto` - if `false` gridstack will not initialize existing items (default: `true`)
- `cellHeight`- one cell height (default?: 'auto'). Can be:
   *  an integer (px)
   *  a string (ex: '100px', '10em', '10rem'). Note: % doesn't right - see demo/cell-height.html
   *  0, in which case the library will not generate styles for rows. Everything must be defined in your own CSS files.
   *  `auto` - height will be calculated for square cells (width / column) and updated live as you resize the window - also see `cellHeightThrottle`
   *  `initial` - similar to 'auto' (start at square cells) but stay that size during window resizing.
- `cellHeightThrottle`?: number - throttle time delay (in ms) used when cellHeight='auto' to improve performance vs usability (default?: 100).
   * A value of 0 will make it instant at a cost of re-creating the CSS file at ever window resize event!
- `children`?: GridStackWidget[] - list of children item to create when calling load() or addGrid()
- `column` - number of columns (default: `12`) which can change on the fly with `column(N)` as well. See [example](http://gridstackjs.com/demo/column.html)
- `class`?: string - additional class on top of '.grid-stack' (which is required for our CSS) to differentiate this instance
- `disableDrag` - disallows dragging of widgets (default: `false`).
- `disableOneColumnMode` - disables the onColumnMode when the grid width is less than minW (default: 'false')
- `disableResize` - disallows resizing of widgets (default: `false`).
- `dragIn` - specify the class of items that can be dragged into grids
  * example: `dragIn: '.newWidget'`.
  * **Note**: if you have multiple grids, it's best to call `GridStack.setupDragIn()` with same params as it only need to be done once.
- `dragInOptions` - options for items that can be dragged into grids
  * example `dragInOptions: { revert: 'invalid', scroll: false, appendTo: 'body', helper: 'clone', handle: '.grid-stack-item-content' }`
  * **Note**: if you have multiple grids, it's best to call `GridStack.setupDragIn()` with same params as it only need to be done once.
  * **Note2**: instead of 'clone' you can also pass your own function (get passed the event).
- `draggable` - allows to override draggable options. (default: `{handle: '.grid-stack-item-content', scroll: false, appendTo: 'body', containment: null}`)
- `dragOut` to let user drag nested grid items out of a parent or not (default false) See [example](http://gridstackjs.com/demo/nested.html)
- `float` - enable floating widgets (default: `false`) See [example](http://gridstackjs.com/demo/float.html)
- `handle` - draggable handle selector (default: `'.grid-stack-item-content'`)
- `handleClass` - draggable handle class (e.g. `'grid-stack-item-content'`). If set `handle` is ignored (default: `null`)
- `itemClass` - widget class (default: `'grid-stack-item'`)
- `margin` - gap size around grid item and content (default: `10`). Can be:
  * an integer (px)
  * a string (ex: '2em', '20px', '2rem')
- `marginTop`: numberOrString - can set individual settings (defaults to `margin`)
- `marginRight`: numberOrString
- `marginBottom`: numberOrString
- `marginLeft`: numberOrString
- `maxRow` - maximum rows amount. Default is `0` which means no max.
- `minRow` - minimum rows amount which is handy to prevent grid from collapsing when empty. Default is `0`. You can also do this with `min-height` CSS attribute on the grid div in pixels, which will round to the closest row.
- `minW` - minimal width. If grid width is less than or equal to, grid will be shown in one-column mode (default: `768`)
- `oneColumnModeDomSort` - set to `true` if you want oneColumnMode to use the DOM order and ignore x,y from normal multi column layouts during sorting. This enables you to have custom 1 column layout that differ from the rest. (default?: `false`)
- `placeholderClass` - class for placeholder (default: `'grid-stack-placeholder'`)
- `placeholderText` - placeholder default content (default: `''`)
- `resizable` - allows to override resizable options. (default: `{autoHide: true, handles: 'se'}`). `handles` can be any combo of `n,ne,e,se,s,sw,w,nw` or `all`.
- `removable` - if `true` widgets could be removed by dragging outside of the grid. It could also be a selector string, in this case widgets will be removed by dropping them there (default: `false`) See [example](http://gridstackjs.com/demo/two.html)
- `removeTimeout` - time in milliseconds before widget is being removed while dragging outside of the grid. (default: `2000`)
- `row` - fix grid number of rows. This is a shortcut of writing `minRow:N, maxRow:N`. (default `0` no constrain)
- `rtl` - if `true` turns grid to RTL. Possible values are `true`, `false`, `'auto'` (default: `'auto'`) See [example](http://gridstackjs.com/demo/rtl.html)
- `staticGrid` - removes drag|drop|resize (default `false`). If `true` widgets are not movable/resizable by the user, but code can still move and oneColumnMode will still work. You can use the smaller gridstack-static.js lib. A CSS class `grid-stack-static` is also added to the container.
- `styleInHead` - if `true` will add style element to `<head>` otherwise will add it to element's parent node (default `false`).

## Grid attributes

most of the above options are also available as HTML attributes using the `gs-` name prefix with standard dash lower case naming convention (ex: `gs-column`, `gs-min-row`, `gs-static`, etc..).

Extras:
- `gs-current-row` - (internal) current rows amount. Set by the library only. Can be used by the CSS rules.

## Item Options

options you can pass when calling `addWidget()`, `update()`, `load()` and many others

- `autoPosition` - tells to ignore `x` and `y` attributes and to place element to the first available position. Having either one missing will also do that.
- `x`, `y` - (number) element position in column/row. Note: if one is missing this will `autoPosition` the item
- `w`, `h` - (number) element size in column/row (default 1x1)
- `maxW`, `minW`, `maxH`, `minH` - element constraints in column/row (default none)
- `locked` - means another widget wouldn't be able to move it during dragging or resizing.
The widget can still be dragged or resized by the user.
You need to add `noResize` and `noMove` attributes to completely lock the widget.
- `noResize` - disable element resizing
- `noMove` - disable element moving
- `resizeHandles` - widgets can have their own custom resize handles. For example 'e,w' will make that particular widget only resize east and west. See `resizable: {handles: string}` option
- `id`- (number | string) good for quick identification (for example in change event)
- `content` - (string) html content to be added when calling `grid.load()/addWidget()` as content inside the item
- `subGrid`: GridStackOptions - optional nested grid options and list of children

## Item attributes

all item options are also available as HTML attributes using the `gs-` name prefix with standard dash lower case naming convention (ex: `gs-x`, `gs-min-w`, etc..).

## Events

Those are events generated by the grid when items are added/removed/changed or drag&drop interaction. In general they pass list of nodes that changed (id, x, y, width, height, etc...) or individual DOM element
that is affected.

You can call it on a single event name, or space separated list like:
`grid.on('added removed change', ...)`

The Typescript `GridStackEvent` list all possible values, and nothing else is supported by the `grid.on()` method, though it's possible to register directly for other events generated by the drag&drop plugging implementation detail (if jquery-ui based you can still use `$(".grid-stack").on(...)`).

### added(event, items)

Called when widgets are being added to a grid

```js
grid.on('added', function(event: Event, items: GridStackNode[]) {
  items.forEach(function(item) {...});
});
```

### change(event, items)

Occurs when widgets change their position/size due to constrain or direct changes

```js
grid.on('change', function(event: Event, items: GridStackNode[]) {
  items.forEach(function(item) {...});
});
```

### disable(event)

```js
grid.on('disable', function(event: Event) {
  let grid: GridStack = event.target.gridstack;
});
```

### dragstart(event, el)

called when grid item is starting to be dragged

```js
grid.on('dragstart', function(event: Event, el: GridItemHTMLElement) {
});
```

### drag(event, el)

called while grid item is being dragged, for each new row/column value (not every pixel)

```js
grid.on('drag', function(event: Event, el: GridItemHTMLElement) {
});
```

### dragstop(event, el)
called after the user is done moving the item, with updated DOM attributes.

```js
grid.on('dragstop', function(event: Event, el: GridItemHTMLElement) {
  let x = parseInt(el.getAttribute('gs-x')) || 0;
  // or all values...
  let node: GridStackNode = el.gridstackNode; // {x, y, width, height, id, ....}
});
```

### dropped(event, previousWidget, newWidget)

called when an item has been dropped and accepted over a grid. If the item came from another grid, the previous widget node info will also be sent (but dom item long gone).

```js
grid.on('dropped', function(event: Event, previousWidget: GridStackNode, newWidget: GridStackNode) {
  console.log('Removed widget that was dragged out of grid:', previousWidget);
  console.log('Added widget in dropped grid:', newWidget);
});
```

### enable(event)

```js
grid.on('enable', function(event: Event) {
  let grid: GridStack = event.target.gridstack;
});
```

### removed(event, items)

Called when items are being removed from the grid

```js
grid.on('removed', function(event: Event, items: GridStackNode[]) {
  items.forEach(function(item) {...});
});
```

### resizestart(event, el)

called before the user starts resizing an item

```js
grid.on('resizestart', function(event: Event, el: GridItemHTMLElement) {
});
```

### resize(event, el)

called while grid item is being resized, for each new row/column value (not every pixel)

```js
grid.on('resize', function(event: Event, el: GridItemHTMLElement) {
});
```

### resizestop(event, el)

called after the user is done resizing the item, with updated DOM attributes.

```js
grid.on('resizestop', function(event: Event, el: GridItemHTMLElement) {
  let width = parseInt(el.getAttribute('gs-w')) || 0;
  // or all values...
  let node: GridStackNode = el.gridstackNode; // {x, y, width, height, id, ....}
});
```


## API Global (static)

### `init(options: GridStackOptions = {}, elOrString: GridStackElement = '.grid-stack'): GridStack`

* initializing the HTML element, or selector string, into a grid will return the grid. Calling it again will
simply return the existing instance (ignore any passed options). There is also an initAll() version that support multiple grids initialization at once. Or you can use addGrid() to create the entire grid from JSON.
* @param options grid options (optional)
* @param elOrString element or CSS selector (first one used) to convert to a grid (default to `'.grid-stack'` class selector)
```js
let grid = GridStack.init();
// Note: the HTMLElement (of type GridHTMLElement) will store a `gridstack: GridStack` value that can be retrieve later
let grid = document.querySelector('.grid-stack').gridstack;
```

### `initAll(options: GridStackOptions = {}, selector = '.grid-stack'): GridStack[]`

* Will initialize a list of elements (given a selector) and return an array of grids.
* @param options grid options (optional)
* @param selector elements selector to convert to grids (default to '.grid-stack' class selector)

```js
let grids = GridStack.initAll();
grids.forEach(...)
```

### `addGrid(parent: HTMLElement, opt: GridStackOptions = {}): GridStack ` 

* call to create a grid with the given options, including loading any children from JSON structure. This will call `GridStack.init()`, then `grid.load()` on any passed children (recursively). Great alternative to calling `init()` if you want entire grid to come from JSON serialized data, including options.
* @param parent HTML element parent to the grid
* @param opt grids options used to initialize the grid, and list of children
* see [nested.html](https://github.com/gridstack/gridstack.js/tree/master/demo/nested.html) demo

### `setupDragIn(dragIn?: string, dragInOptions?: DDDragInOpt)`

* call to setup dragging in from the outside (say toolbar), by specifying the class selection and options.
Called during `GridStack.init()` as options, but can also be called directly (last param are cached) in case the toolbar is dynamically create and needs to change later.
* @param dragIn string selector (ex: `'.sidebar .grid-stack-item'`)
* @param dragInOptions options - see `DDDragInOpt`. (default: `{revert: 'invalid', handle: '.grid-stack-item-content', scroll: false, appendTo: 'body'}`
but you will probably also want `helper: 'clone'` or your own callback function).

## API

### `addWidget(el?: GridStackWidget | GridStackElement, options?: GridStackWidget)`

Creates new widget and returns it. Options is an object containing the fields x,y,width,height,etc...

Parameters:

- `el`: GridStackWidget | GridStackElement -  html element, or string definition, or GridStackWidget (which can have content string as well) to add
- `options`: GridStackWidget - widget position/size options (optional, and ignore if first param is already option) - see GridStackWidget

Widget will be always placed even if result height is more than actual grid height. You need to use `willItFit` method
before calling `addWidget` for additional check.

```js
let grid = GridStack.init();
grid.addWidget({w: 3, content: 'hello'});
// or
grid.addWidget('<div class="grid-stack-item"><div class="grid-stack-item-content">hello</div></div>', {w: 3});
```

### `batchUpdate()`

starts batch updates. You will see no changes until `commit()` method is called.

### `compact()`

re-layout grid items to reclaim any empty space.

### `cellHeight(val: number, update = true)`

Update current cell height (see - `cellHeight` options format). This method rebuilds an internal CSS stylesheet (unless optional update=false). Note: You can expect performance issues if call this method too often.

```js
grid.cellHeight(grid.cellWidth() * 1.2);
```

### `cellWidth()`

Gets current cell width (grid width / # of columns).

### `commit()`

Ends batch updates. Updates DOM nodes. You must call it after `batchUpdate()`.

### `column(column: number, layout: ColumnOptions = 'moveScale')`

set/get the number of columns in the grid. Will update existing widgets to conform to new number of columns,
as well as cache the original layout so you can revert back to previous positions without loss.
Requires `gridstack-extra.css` or `gridstack-extra.min.css` for [2-11],
else you will need to generate correct CSS (see https://github.com/gridstack/gridstack.js#change-grid-columns)

- `column` - Integer > 0 (default 12), if missing it will return the current count instead.
- `layout` - specify the type of re-layout that will happen (position, size, etc...).
Note: items will never be outside of the current column boundaries. default ('moveScale'). Ignored for 1 column.
Possible values: 'moveScale' | 'move' | 'scale' | 'none' | (column: number, oldColumn: number, nodes: GridStackNode[], oldNodes: GridStackNode[]) => void.
A custom function option takes new/old column count, and array of new/old positions.
Note: new list may be partially already filled if we have a partial cache of the layout at that size (items were added later). If complete cache is present this won't get called at all.

### `destroy([removeDOM])`

Destroys a grid instance.

Parameters:

- `removeDOM` - if `false` nodes and grid will not be removed from the DOM (Optional. Default `true`).

### `disable()`

Disables widgets moving/resizing. This is a shortcut for:

```js
grid.enableMove(false);
grid.enableResize(false);
```

### `enable()`

Enables widgets moving/resizing. This is a shortcut for:

```js
grid.enableMove(true);
grid.enableResize(true);
```

### `enableMove(doEnable)`

Enables/disables widget moving (default: true), and setting the `disableDrag` grid option. This is a shortcut for:

```js
grid.opts.disableDrag = !doEnable;
grid.movable('.grid-stack-item', doEnable);
```

### `enableResize(doEnable)`

Enables/disables widget sizing (default: true), and setting the `disableResize` grid option. This is a shortcut for:

```js
grid.opts.disableResize = !doEnable;
grid.resizable('.grid-stack-item', doEnable);
```

### `float(val?)`

set/get floating widgets (default: `false`)

- `val` - boolean to set true/false, else get the current value

### `getCellHeight()`

Gets current cell height.


### `getCellFromPixel(position[, useOffset])`

Get the position of the cell under a pixel on screen.

Parameters :

- `position` - the position of the pixel to resolve in absolute coordinates, as an object with `top` and `left` properties
- `useOffset` - if `true`, value will be based on offset vs position (Optional. Default `false`). Useful when grid is within `position: relative` element.

Returns an object with properties `x` and `y` i.e. the column and row in the grid.

### `getGridItems(): GridItemHTMLElement[]`

Return list of GridItem HTML elements (excluding temporary placeholder) in DOM order, wether they are node items yet or not (looks by class)

### `getMargin()`

returns current margin value (undefined if all 4 sides don't match).

### `isAreaEmpty(x, y, width, height)`

Checks if specified area is empty.

### `load(layout: GridStackWidget[], boolean | ((w: GridStackWidget, add: boolean) => void)  = true)`

- load the widgets from a list (see `save()`). This will call `update()` on each (matching by id) or add/remove widgets that are not there.
- Optional `addAndRemove` boolean (default true) or callback method can be passed to control if and how missing widgets can be added/removed, giving the user control of insertion.

- used to restore a grid layout for a saved layout list (see `save()`).
- `addAndRemove` boolean (default true) or callback method can be passed to control if and how missing widgets can be added/removed, giving the user control of insertion.
- see [example](http://gridstackjs.com/demo/serialization.html)

### `makeWidget(el)`

If you add elements to your gridstack container by hand, you have to tell gridstack afterwards to make them widgets. If you want gridstack to add the elements for you, use `addWidget` instead.
Makes the given element a widget and returns it.

Parameters:

- `el` - element to convert to a widget

```js
let grid = GridStack.init();
grid.el.appendChild('<div id="gsi-1" gs-x="0" gs-y="0" gs-w="3" gs-h="2" gs-auto-position="true"></div>')
grid.makeWidget('#gsi-1');
```

### `margin(value: numberOrString)`

gap between grid item and content (default?: 10). This will set all 4 sides and support the CSS formats below
 - an `integer` (px)
 - a string with possible units (ex: `'5'`, `'2em'`, `'20px'`, `'2rem'`)
 - string with space separated values (ex: `'5px 10px 0 20px'` for all 4 sides, or `'5em 10em'` for top/bottom and left/right pairs like CSS).
 - Note: all sides must have same units (last one wins, default px)

### `movable(el, val)`

Enables/Disables dragging by the user of specific grid element. If you want all items, and have it affect future items, use enableMove() instead. No-op for static grids.
IF you are looking to prevent an item from moving (due to being pushed around by another during collision) use locked property instead.

- `el` - widget to modify
- `val` - if `true` widget will be draggable.

### `removeWidget(el, removeDOM = true, triggerEvent = true)`

Removes widget from the grid.

Parameters:

- `el` - widget to remove.
- `removeDOM` - if `false` node won't be removed from the DOM (Optional. Default `true`).
- `triggerEvent` if `false` (quiet mode) element will not be added to removed list and no 'removed' callbacks will be called (Default `true`).

### `removeAll(removeDOM = true)`

Removes all widgets from the grid.

Parameters:

- `removeDOM` - if `false` nodes won't be removed from the DOM (Optional. Default `true`).

### `resizable(el, val)`

Enables/Disables user resizing of specific grid element. If you want all items, and have it affect future items, use enableResize() instead. No-op for static grids.

- `el` - widget to modify
- `val` - if `true` widget will be resizable.

### `save(saveContent = true): GridStackWidget[]`

- returns the layout of the grid (and optionally the html content as well) that can be serialized (list of item non default attributes, not just w,y,x,y but also min/max and id). See `load()`
- see [example](http://gridstackjs.com/demo/serialization.html)

### `setAnimation(doAnimate)`

Toggle the grid animation state.  Toggles the `grid-stack-animate` class.

- `doAnimate` - if `true` the grid will animate.

### `setStatic(staticValue)`

Toggle the grid static state.  Also toggle the `grid-stack-static` class.

- `staticValue` - if `true` the grid becomes static.

### `update(el: GridStackElement, opts: GridStackWidget)`

Parameters:

- `el` - widget to move (element or class string)
- `opts` - updates all the possible item attributes passed in the structure (x,y,width,height, etc..). Only those set will be updated.

Updates widget position/size and other info. Note: if you need to call this on all nodes, use load() instead which will update what changed and more.

### `willItFit(x, y, width, height, autoPosition)`

Returns `true` if the `height` of the grid will be less the vertical constraint. Always returns `true` if grid doesn't
have `height` constraint.

```js
if (grid.willItFit(newNode.x, newNode.y, newNode.w, newNode.h, newNode.autoPosition)) {
  grid.addWidget(newNode.el, newNode);
}
else {
  alert('Not enough free space to place the widget');
}
```

## Utils

### `GridStack.Utils.sort(nodes[, dir[, width]])`

Sorts array of nodes

- `nodes` - array to sort
- `dir` - `1` for asc, `-1` for desc (optional)
- `width` - width of the grid. If `undefined` the width will be calculated automatically (optional).
