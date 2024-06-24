gridstack.js API
================

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Grid Options](#grid-options)
  - [Responsive](#responsive)
    - [Breakpoint](#breakpoint)
  - [DDDragOpt](#dddragopt)
  - [DDDragInOpt extends DDDragOpt](#dddraginopt-extends-dddragopt)
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
  - [`setupDragIn(dragIn?: string | HTMLElement[], dragInOptions?: DDDragInOpt, root = HTMLElement | Document)`](#setupdragindragin-string--htmlelement-draginoptions-dddraginopt-root--htmlelement--document)
  - [`GridStack.registerEngine(engineClass: typeof GridStackEngine)`](#gridstackregisterengineengineclass-typeof-gridstackengine)
- [API](#api)
  - [`addWidget(el?: GridStackWidget | GridStackElement, options?: GridStackWidget)`](#addwidgetel-gridstackwidget--gridstackelement-options-gridstackwidget)
  - [`batchUpdate(flag = true)`](#batchupdateflag--true)
  - [`compact(layout: CompactOptions = 'compact', doSort = true)`](#compactlayout-compactoptions--compact-dosort--true)
  - [`cellHeight(val: number, update = true)`](#cellheightval-number-update--true)
  - [`cellWidth()`](#cellwidth)
  - [`column(column: number, layout: ColumnOptions = 'moveScale')`](#columncolumn-number-layout-columnoptions--movescale)
  - [`destroy([removeDOM])`](#destroyremovedom)
  - [`disable()`](#disable)
  - [`enable()`](#enable)
  - [`enableMove(doEnable)`](#enablemovedoenable)
  - [`enableResize(doEnable)`](#enableresizedoenable)
  - [`float(val?)`](#floatval)
  - [`getCellHeight()`](#getcellheight)
  - [`getCellFromPixel(position[, useOffset])`](#getcellfrompixelposition-useoffset)
  - [`getColumn(): number`](#getcolumn-number)
  - [`getGridItems(): GridItemHTMLElement[]`](#getgriditems-griditemhtmlelement)
  - [`getMargin()`](#getmargin)
  - [`isAreaEmpty(x, y, width, height)`](#isareaemptyx-y-width-height)
  - [`load(layout: GridStackWidget[], boolean | ((w: GridStackWidget, add: boolean) => void)  = true)`](#loadlayout-gridstackwidget-boolean--w-gridstackwidget-add-boolean--void---true)
  - [`makeWidget(el)`](#makewidgetel)
  - [`makeSubGrid(el)`](#makesubgridel)
  - [`margin(value: numberOrString)`](#marginvalue-numberorstring)
  - [`movable(el, val)`](#movableel-val)
  - [`removeWidget(el, removeDOM = true, triggerEvent = true)`](#removewidgetel-removedom--true-triggerevent--true)
  - [`removeAll(removeDOM = true)`](#removeallremovedom--true)
  - [`resizable(el, val)`](#resizableel-val)
  - [`resizeToContent(el: GridItemHTMLElement, useAttrSize = false)`](#resizetocontentel-griditemhtmlelement-useattrsize--false)
  - [`rotate(els: GridStackElement, relative?: Position)`](#rotateels-gridstackelement-relative-position)
  - [`save(saveContent = true, saveGridOpt = false): GridStackWidget[] | GridStackOptions`](#savesavecontent--true-savegridopt--false-gridstackwidget--gridstackoptions)
  - [`setAnimation(doAnimate)`](#setanimationdoanimate)
  - [`setStatic(staticValue)`](#setstaticstaticvalue)
  - [`update(el: GridStackElement, opts: GridStackWidget)`](#updateel-gridstackelement-opts-gridstackwidget)
  - [`willItFit(x, y, width, height, autoPosition)`](#willitfitx-y-width-height-autoposition)
- [Utils](#utils)
  - [`GridStack.Utils.sort(nodes[, dir])`](#gridstackutilssortnodes-dir)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Grid Options

- `acceptWidgets` - Accept widgets dragged from other grids or from outside (default: `false`). Can be:
   * `true` will accept HTML element having `'grid-stack-item'` as class attribute, else `false`
   * string for explicit class name to accept instead
   * `function (el: Element): boolean` function called before an item will be accepted when entering a grid. the function will be passed the item being dragged, and should return true | false. See [example](https://github.com/gridstack/gridstack.js/blob/master/demo/two.html#L62)
- `alwaysShowResizeHandle` - possible values (default: `mobile`) - does not apply to non-resizable widgets
  * `false` the resizing handles are only shown while hovering over a widget
  * `true` the resizing handles are always shown
  * `'mobile'` if running on a mobile device, default to `true` (since there is no hovering per say), else `false`.
  See [mobile](http://gridstack.github.io/gridstack.js/demo/mobile.html)


- `animate` - turns animation on to smooth transitions (default: `true`)
- `auto` - if `false` gridstack will not initialize existing items (default: `true`)
- `cellHeight`- one cell height (default?: 'auto'). Can be:
   *  an integer (px)
   *  a string (ex: '100px', '10em', '10rem', '10cm'). Note: % doesn't right - see [CellHeight](http://gridstackjs.com/demo/cell-height.html)
   *  0, in which case the library will not generate styles for rows. Everything must be defined in your own CSS files.
   *  `auto` - height will be calculated for square cells (width / column) and updated live as you resize the window - also see `cellHeightThrottle`
   *  `initial` - similar to 'auto' (start at square cells) but stay that size during window resizing.
- `cellHeightThrottle`?: number - throttle time delay (in ms) used when cellHeight='auto' to improve performance vs usability (default?: 100).
   * A value of 0 will make it instant at a cost of re-creating the CSS file at ever window resize event!
- `children`?: GridStackWidget[] - list of children item to create when calling load() or addGrid()
- `column` - Integer > 0 (default 12) which can change on the fly with `column(N)` API, or `'auto'` for nested grids to size themselves to the parent grid container (to make sub-items are the same size). See [column](http://gridstackjs.com/demo/column.html) and [nested](http://gridstackjs.com/demo/nested.html)
- `columnOpts`?:Responsive - describes the responsive nature of the column grid. see `Responsive` interface.
- `class`?: string - additional class on top of '.grid-stack' (which is required for our CSS) to differentiate this instance
- `disableDrag` - disallows dragging of widgets (default: `false`).
- `disableResize` - disallows resizing of widgets (default: `false`).
- `draggable` - allows to override draggable options - see `DDDragOpt`. (default: `{handle: '.grid-stack-item-content', appendTo: 'body', scroll: true}`)
- `engineClass` - the type of engine to create (so you can subclass) default to GridStackEngine
- `sizeToContent`: boolean - make gridItems size themselves to their content, calling `resizeToContent(el)` whenever the grid or item is resized.
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
- `nonce` - If you are using a nonce-based Content Security Policy, pass your nonce here and
GridStack will add it to the `<style>` elements it creates.
- `placeholderClass` - class for placeholder (default: `'grid-stack-placeholder'`)
- `placeholderText` - placeholder default content (default: `''`)
- `resizable` - allows to override resizable options. (default: `{handles: 'se'}`). `handles` can be any combo of `n,ne,e,se,s,sw,w,nw` or `all`.
- `removable` - if `true` widgets could be removed by dragging outside of the grid. It could also be a selector string, in this case widgets will be removed by dropping them there (default: `false`) See [example](http://gridstackjs.com/demo/two.html)
- `removeTimeout` - time in milliseconds before widget is being removed while dragging outside of the grid. (default: `2000`)
- `row` - fix grid number of rows. This is a shortcut of writing `minRow:N, maxRow:N`. (default `0` no constrain)
- `rtl` - if `true` turns grid to RTL. Possible values are `true`, `false`, `'auto'` (default: `'auto'`) See [example](https://gridstackjs.com/demo/right-to-left(rtl).html)
- `staticGrid` - removes drag|drop|resize (default `false`). If `true` widgets are not movable/resizable by the user, but code can still move and oneColumnMode will still work. You can use the smaller gridstack-static.js lib. A CSS class `grid-stack-static` is also added to the container.
- `styleInHead` - if `true` will add style element to `<head>` otherwise will add it to element's parent node (default `false`).

### Responsive
v10.x supports a much richer responsive behavior, you can have breakpoints of width:column, or auto column sizing,  where no code is longer needed.
- `columnWidth`?: number - wanted width to maintain (+-50%) to dynamically pick a column count
- `columnMax`?: number - maximum number of columns allowed (default: 12). Note: make sure to have correct CSS to support this.
- `layout`?: ColumnOptions - global re-layout mode when changing columns
- `breakpointForWindow`?: boolean - specify if breakpoints are for window size or grid size (default:false = grid)
- `breakpoints`?: Breakpoint[] - explicit width:column breakpoints instead of automatic 'columnWidth'. Note: make sure to have correct CSS to support this.

#### Breakpoint
- `w`?: number - width
- `c`: number - column
- `layout`?: ColumnOptions - re-layout mode if different from global one

### DDDragOpt
- `handle`?: string - class selector of items that can be dragged. default to '.grid-stack-item-content'
- `appendTo`?: string - default to 'body' (TODO: is this even used anymore ?)
- `pause`?: boolean | number - if set (true | msec), dragging placement (collision) will only happen after a pause by the user. Note: this is Global
- `scroll`?: boolean - default to 'true', enable or disable the scroll when an element is dragged on bottom or top of the grid.
- `cancel`?: string - prevents dragging from starting on specified elements, listed as comma separated selectors (eg: '.no-drag'). default built in is 'input,textarea,button,select,option'

### DDDragInOpt extends DDDragOpt
- `helper`?: 'clone' | ((event: Event) => HTMLElement) - helper function when dropping (ex: 'clone' or your own method)

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
- `id`- (number | string) good for quick identification (for example in change event)
- `content` - (string) html content to be added when calling `grid.load()/addWidget()` as content inside the item
- `sizeToContent`?: boolean | number - make gridItem size itself to the content, calling `GridStack.resizeToContent(el)` whenever the grid or item is resized.
Note: This also allow you to set a maximum h value (but user changeable during normal resizing) to prevent unlimited content from taking too much space (get scrollbar)
- `subGrid`?: GridStackOptions - optional nested grid options and list of children
- `subGridDynamic`?: boolean - enable/disable the creation of sub-grids on the fly by dragging items completely over others (nest) vs partially (push). Forces `DDDragOpt.pause=true` to accomplish that.

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

### `setupDragIn(dragIn?: string | HTMLElement[], dragInOptions?: DDDragInOpt, root = HTMLElement | Document)`

* call to setup dragging in from the outside (say toolbar), by specifying the class selection and options.
Called during `GridStack.init()` as options, but can also be called directly (last param are cached) in case the toolbar is dynamically create and needs to change later.
* @param dragIn string selector (ex: `'.sidebar .grid-stack-item'`) or list of dom elements
* @param dragInOptions options - see `DDDragInOpt`. (default: `{handle: '.grid-stack-item-content', appendTo: 'body'}`
* @param root - default to document. for shadow dom support pass the parent container.
but you will probably also want `helper: 'clone'` or your own callback function).

### `GridStack.registerEngine(engineClass: typeof GridStackEngine)`

* call to specify global custom engine subclass - see instead `GridStackOptions.engineClass` if you only need to replace just one instance.
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

### `batchUpdate(flag = true)`

use before calling a bunch of `addWidget()` to prevent un-necessary relayouts in between (more efficient) and get a single event callback. You will see no changes until `batchUpdate(false)` is called.

### `compact(layout: CompactOptions = 'compact', doSort = true)`

re-layout grid items to reclaim any empty space. Options are:
- `'list'` keep the widget left->right order the same, even if that means leaving an empty slot if things don't fit
- `'compact'` might re-order items to fill any empty space

- `doSort` - `false` to let you do your own sorting ahead in case you need to control a different order. (default to sort)


### `cellHeight(val: number, update = true)`

Update current cell height (see - `cellHeight` options format). This method rebuilds an internal CSS stylesheet (unless optional update=false). Note: You can expect performance issues if call this method too often.

```js
grid.cellHeight(grid.cellWidth() * 1.2);
```

### `cellWidth()`

Gets current cell width (grid width / # of columns).

### `column(column: number, layout: ColumnOptions = 'moveScale')`

set the number of columns in the grid. Will update existing widgets to conform to new number of columns,
as well as cache the original layout so you can revert back to previous positions without loss.
Requires `gridstack-extra.css` (or minimized version) for [2-11],
else you will need to generate correct CSS (see https://github.com/gridstack/gridstack.js#change-grid-columns)

- `column` - Integer > 0 (default 12)
- `layout` - specify the type of re-layout that will happen (position, size, etc...). Values are: `'list' | 'compact' | 'moveScale' | 'move' | 'scale' | 'none' | ((column: number, oldColumn: number, nodes: GridStackNode[], oldNodes: GridStackNode[]) => void);`

* `'list'` - treat items as sorted list, keeping items (un-sized unless too big for column count) sequentially reflowing them
* `'compact'` - similar to list, but using compact() method which will possibly re-order items if an empty slots are available due to a larger item needing to be pushed to next row
* `'moveScale'` - will scale and move items by the ratio new newColumnCount / oldColumnCount
* `'move'` | `'scale'` - will only size or move items
* `'none'` will leave items unchanged, unless they don't fit in column count
* custom function that takes new/old column count, and array of new/old positions
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

### `getColumn(): number`

returns the number of columns in the grid.

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
### `makeSubGrid(el)`
Used to add a subgrid into an existing grid.
```js
const grid = Gridstack.init()
grid.el.appendChild(`
<div id="gsi-1" gs-x="0" gs-y="0" gs-w="3" gs-h="2" gs-auto-position="true">
      <div class="grid-stack" id="nested-grid">
          <div id="gsi-2" gs-x="0" gs-y="0" gs-w="3" gs-h="2" gs-auto-position="true">
          </div>
      </div>
</div>`)
grid.makeSubGrid(grid.el.getElementById('nested-grid'))
```
Make sure that the subgrid is inside of a grid item. It is important to remember that subgrids are themselves grid items capable of containing other grid items.
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

### `resizeToContent(el: GridItemHTMLElement, useAttrSize = false)`

Updates widget height to match the content height to avoid v-scrollbar or dead space.
Note: this assumes only 1 child under `resizeToContentParent='.grid-stack-item-content'` (sized to gridItem minus padding) that is at the entire content size wanted.
- `useAttrSize` set to `true` if GridStackNode.h should be used instead of actual container height when we don't need to wait for animation to finish to get actual DOM heights

### `rotate(els: GridStackElement, relative?: Position)`
rotate (by swapping w & h) the passed in node - called when user press 'r' during dragging

- `els` - widget or selector of objects to modify
- `relative` - optional pixel coord relative to upper/left corner to rotate around (will keep that cell under cursor)

### `save(saveContent = true, saveGridOpt = false): GridStackWidget[] | GridStackOptions`

saves the current layout returning a list of widgets for serialization which might include any nested grids.
- `saveContent` if true (default) the latest html inside `.grid-stack-content` will be saved to `GridStackWidget.content` field, else it will be removed.
- `saveGridOpt` if true (default `false`), save the grid options itself, so you can call the new `GridStack.addGrid()` to recreate everything from scratch. GridStackOptions.children would then contain the widget list instead.
- returns list of widgets or full grid option, including .children list of widgets
- see [serialization](http://gridstackjs.com/demo/serialization.html) and [nested](http://gridstackjs.com/demo/nested.html)

### `setAnimation(doAnimate)`

Toggle the grid animation state.  Toggles the `grid-stack-animate` class.

- `doAnimate` - if `true` the grid will animate.

### `setStatic(staticValue)`

Toggle the grid static state.  Also toggle the `grid-stack-static` class.

- `staticValue` - if `true` the grid becomes static.

### `update(el: GridStackElement, opts: GridStackWidget)`

Parameters:

- `el` - widget to move (element or class string)
- `opts` - updates all the possible item attributes passed in the structure (x, y, h, w, etc..). Only those set will be updated.

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

### `GridStack.Utils.sort(nodes[, dir])`

Sorts array of nodes

- `nodes` - array to sort
- `dir` - `1` for ascending, `-1` for descending (optional)
