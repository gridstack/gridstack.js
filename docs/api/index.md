# gridstack v12.2.2-dev

## Classes


## Table of Contents

- [GridStack](#gridstack)
- [GridStackEngine](#gridstackengine)
- [Utils](#utils)
- [GridStackOptions](#gridstackoptions)
- [`abstract` DDBaseImplement](#abstract-ddbaseimplement)
- [DDDraggable](#dddraggable)
- [DDDroppable](#dddroppable)
- [DDElement](#ddelement)
- [DDGridStack](#ddgridstack)
- [DDManager](#ddmanager)
- [DDResizable](#ddresizable-1)
- [DDResizableHandle](#ddresizablehandle)
- [Breakpoint](#breakpoint)
- [CellPosition](#cellposition)
- [DDDragOpt](#dddragopt)
- [DDDroppableOpt](#dddroppableopt)
- [DDElementHost](#ddelementhost)
- [DDRemoveOpt](#ddremoveopt)
- [DDResizableHandleOpt](#ddresizablehandleopt)
- [DDResizableOpt](#ddresizableopt)
- [DDResizeOpt](#ddresizeopt)
- [DDUIData](#dduidata)
- [DragTransform](#dragtransform)
- [GridHTMLElement](#gridhtmlelement)
- [GridItemHTMLElement](#griditemhtmlelement)
- [GridStackEngineOptions](#gridstackengineoptions)
- [GridStackMoveOpts](#gridstackmoveopts)
- [GridStackNode](#gridstacknode-2)
- [GridStackPosition](#gridstackposition)
- [GridStackWidget](#gridstackwidget)
- [HeightData](#heightdata)
- [HTMLElementExtendOpt\<T\>](#htmlelementextendoptt)
- [MousePosition](#mouseposition)
- [Position](#position-1)
- [Rect](#rect-1)
- [Responsive](#responsive)
- [Size](#size-1)
- [gridDefaults](#griddefaults)
- [AddRemoveFcn()](#addremovefcn)
- [ColumnOptions](#columnoptions)
- [CompactOptions](#compactoptions)
- [DDCallback()](#ddcallback)
- [DDDropOpt](#dddropopt)
- [DDKey](#ddkey)
- [DDOpts](#ddopts)
- [DDValue](#ddvalue)
- [EventCallback()](#eventcallback)
- [GridStackDroppedHandler()](#gridstackdroppedhandler)
- [GridStackElement](#gridstackelement)
- [GridStackElementHandler()](#gridstackelementhandler)
- [GridStackEvent](#gridstackevent)
- [GridStackEventHandler()](#gridstackeventhandler)
- [GridStackEventHandlerCallback](#gridstackeventhandlercallback)
- [GridStackNodesHandler()](#gridstacknodeshandler)
- [numberOrString](#numberorstring)
- [RenderFcn()](#renderfcn)
- [ResizeToContentFcn()](#resizetocontentfcn)
- [SaveFcn()](#savefcn)

<a id="gridstack"></a>
### GridStack

Defined in: [gridstack.ts:76](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L76)

Main gridstack class - you will need to call `GridStack.init()` first to initialize your grid.
Note: your grid elements MUST have the following classes for the CSS layout to work:

#### Example

```ts
<div class="grid-stack">
  <div class="grid-stack-item">
    <div class="grid-stack-item-content">Item 1</div>
  </div>
</div>
```

#### Constructors

##### Constructor

```ts
new GridStack(el, opts): GridStack;
```

Defined in: [gridstack.ts:263](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L263)

Construct a grid item from the given element and options

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `el` | [`GridHTMLElement`](#gridhtmlelement) | the HTML element tied to this grid after it's been initialized |
| `opts` | [`GridStackOptions`](#gridstackoptions) | grid options - public for classes to access, but use methods to modify! |

###### Returns

[`GridStack`](#gridstack-1)

#### Methods

##### \_updateResizeEvent()

```ts
protected _updateResizeEvent(forceRemove): GridStack;
```

Defined in: [gridstack.ts:1829](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1829)

add or remove the grid element size event handler

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `forceRemove` | `boolean` | `false` |

###### Returns

[`GridStack`](#gridstack-1)

##### \_widthOrContainer()

```ts
protected _widthOrContainer(forBreakpoint): number;
```

Defined in: [gridstack.ts:887](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L887)

return our expected width (or parent) , and optionally of window for dynamic column check

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `forBreakpoint` | `boolean` | `false` |

###### Returns

`number`

##### addGrid()

```ts
static addGrid(parent, opt): GridStack;
```

Defined in: [gridstack.ts:141](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L141)

call to create a grid with the given options, including loading any children from JSON structure. This will call GridStack.init(), then
grid.load() on any passed children (recursively). Great alternative to calling init() if you want entire grid to come from
JSON serialized data, including options.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parent` | `HTMLElement` | HTML element parent to the grid |
| `opt` | [`GridStackOptions`](#gridstackoptions) | grids options used to initialize the grid, and list of children |

###### Returns

[`GridStack`](#gridstack-1)

##### addWidget()

```ts
addWidget(w): GridItemHTMLElement;
```

Defined in: [gridstack.ts:429](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L429)

add a new widget and returns it.

Widget will be always placed even if result height is more than actual grid height.
You need to use `willItFit()` before calling addWidget for additional check.
See also `makeWidget(el)` for DOM element.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w` | [`GridStackWidget`](#gridstackwidget) | GridStackWidget definition. used MakeWidget(el) if you have dom element instead. |

###### Returns

[`GridItemHTMLElement`](#griditemhtmlelement)

###### Example

```ts
const grid = GridStack.init();
grid.addWidget({w: 3, content: 'hello'});
```

##### batchUpdate()

```ts
batchUpdate(flag): GridStack;
```

Defined in: [gridstack.ts:792](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L792)

use before calling a bunch of `addWidget()` to prevent un-necessary relayouts in between (more efficient)
and get a single event callback. You will see no changes until `batchUpdate(false)` is called.

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `flag` | `boolean` | `true` |

###### Returns

[`GridStack`](#gridstack-1)

##### cellHeight()

```ts
cellHeight(val?): GridStack;
```

Defined in: [gridstack.ts:849](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L849)

Update current cell height - see `GridStackOptions.cellHeight` for format.
This method rebuilds an internal CSS style sheet.
Note: You can expect performance issues if call this method too often.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `val?` | [`numberOrString`](#numberorstring) | the cell height. If not passed (undefined), cells content will be made square (match width minus margin), if pass 0 the CSS will be generated by the application instead. |

###### Returns

[`GridStack`](#gridstack-1)

###### Example

```ts
grid.cellHeight(100); // same as 100px
grid.cellHeight('70px');
grid.cellHeight(grid.cellWidth() * 1.2);
```

##### cellWidth()

```ts
cellWidth(): number;
```

Defined in: [gridstack.ts:883](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L883)

Gets current cell width.

###### Returns

`number`

##### checkDynamicColumn()

```ts
protected checkDynamicColumn(): boolean;
```

Defined in: [gridstack.ts:893](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L893)

checks for dynamic column count for our current size, returning true if changed

###### Returns

`boolean`

##### column()

```ts
column(column, layout): GridStack;
```

Defined in: [gridstack.ts:937](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L937)

set the number of columns in the grid. Will update existing widgets to conform to new number of columns,
as well as cache the original layout so you can revert back to previous positions without loss.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `column` | `number` | `undefined` | Integer > 0 (default 12). |
| `layout` | [`ColumnOptions`](#columnoptions) | `'moveScale'` | specify the type of re-layout that will happen (position, size, etc...). Note: items will never be outside of the current column boundaries. default ('moveScale'). Ignored for 1 column |

###### Returns

[`GridStack`](#gridstack-1)

##### commit()

```ts
commit(): GridStack;
```

Defined in: [gridstack.ts:2676](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2676)

###### Returns

[`GridStack`](#gridstack-1)

##### compact()

```ts
compact(layout, doSort): GridStack;
```

Defined in: [gridstack.ts:924](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L924)

re-layout grid items to reclaim any empty space. Options are:
'list' keep the widget left->right order the same, even if that means leaving an empty slot if things don't fit
'compact' might re-order items to fill any empty space

doSort - 'false' to let you do your own sorting ahead in case you need to control a different order. (default to sort)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `layout` | [`CompactOptions`](#compactoptions) | `'compact'` |
| `doSort` | `boolean` | `true` |

###### Returns

[`GridStack`](#gridstack-1)

##### createWidgetDivs()

```ts
createWidgetDivs(n): HTMLElement;
```

Defined in: [gridstack.ts:467](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L467)

create the default grid item divs, and content (possibly lazy loaded) by using GridStack.renderCB()

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | [`GridStackNode`](#gridstacknode-2) |

###### Returns

`HTMLElement`

##### destroy()

```ts
destroy(removeDOM): GridStack;
```

Defined in: [gridstack.ts:984](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L984)

Destroys a grid instance. DO NOT CALL any methods or access any vars after this as it will free up members.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `removeDOM` | `boolean` | `true` | if `false` grid and items HTML elements will not be removed from the DOM (Optional. Default `true`). |

###### Returns

[`GridStack`](#gridstack-1)

##### disable()

```ts
disable(recurse): GridStack;
```

Defined in: [gridstack.ts:1987](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1987)

Temporarily disables widgets moving/resizing.
If you want a more permanent way (which freezes up resources) use `setStatic(true)` instead.
Note: no-op for static grid
This is a shortcut for:

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `recurse` | `boolean` | `true` | true (default) if sub-grids also get updated |

###### Returns

[`GridStack`](#gridstack-1)

###### Example

```ts
grid.enableMove(false);
 grid.enableResize(false);
```

##### enable()

```ts
enable(recurse): GridStack;
```

Defined in: [gridstack.ts:2003](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2003)

Re-enables widgets moving/resizing - see disable().
Note: no-op for static grid.
This is a shortcut for:

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `recurse` | `boolean` | `true` | true (default) if sub-grids also get updated |

###### Returns

[`GridStack`](#gridstack-1)

###### Example

```ts
grid.enableMove(true);
 grid.enableResize(true);
```

##### enableMove()

```ts
enableMove(doEnable, recurse): GridStack;
```

Defined in: [gridstack.ts:2015](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2015)

Enables/disables widget moving. No-op for static grids, and locally defined items still overrule

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `doEnable` | `boolean` | `undefined` | - |
| `recurse` | `boolean` | `true` | true (default) if sub-grids also get updated |

###### Returns

[`GridStack`](#gridstack-1)

##### enableResize()

```ts
enableResize(doEnable, recurse): GridStack;
```

Defined in: [gridstack.ts:2029](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2029)

Enables/disables widget resizing. No-op for static grids.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `doEnable` | `boolean` | `undefined` | - |
| `recurse` | `boolean` | `true` | true (default) if sub-grids also get updated |

###### Returns

[`GridStack`](#gridstack-1)

##### float()

```ts
float(val): GridStack;
```

Defined in: [gridstack.ts:1010](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1010)

enable/disable floating widgets (default: `false`) See [example](http://gridstackjs.com/demo/float.html)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

###### Returns

[`GridStack`](#gridstack-1)

##### getCellFromPixel()

```ts
getCellFromPixel(position, useDocRelative): CellPosition;
```

Defined in: [gridstack.ts:1034](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1034)

Get the position of the cell under a pixel on screen.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `position` | [`MousePosition`](#mouseposition) | `undefined` | the position of the pixel to resolve in absolute coordinates, as an object with top and left properties |
| `useDocRelative` | `boolean` | `false` | if true, value will be based on document position vs parent position (Optional. Default false). Useful when grid is within `position: relative` element Returns an object with properties `x` and `y` i.e. the column and row in the grid. |

###### Returns

[`CellPosition`](#cellposition)

##### getCellHeight()

```ts
getCellHeight(forcePixel): number;
```

Defined in: [gridstack.ts:806](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L806)

Gets current cell height.

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `forcePixel` | `boolean` | `false` |

###### Returns

`number`

##### getColumn()

```ts
getColumn(): number;
```

Defined in: [gridstack.ts:969](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L969)

get the number of columns in the grid (default 12)

###### Returns

`number`

##### getDD()

```ts
static getDD(): DDGridStack;
```

Defined in: [gridstack.ts:1918](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1918)

get the global (but static to this code) DD implementation

###### Returns

[`DDGridStack`](#ddgridstack)

##### getFloat()

```ts
getFloat(): boolean;
```

Defined in: [gridstack.ts:1021](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1021)

get the current float mode

###### Returns

`boolean`

##### getGridItems()

```ts
getGridItems(): GridItemHTMLElement[];
```

Defined in: [gridstack.ts:972](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L972)

returns an array of grid HTML elements (no placeholder) - used to iterate through our children in DOM order

###### Returns

[`GridItemHTMLElement`](#griditemhtmlelement)[]

##### getMargin()

```ts
getMargin(): number;
```

Defined in: [gridstack.ts:1526](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1526)

returns current margin number value (undefined if 4 sides don't match)

###### Returns

`number`

##### getRow()

```ts
getRow(): number;
```

Defined in: [gridstack.ts:1055](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1055)

returns the current number of rows, which will be at least `minRow` if set

###### Returns

`number`

##### init()

```ts
static init(options, elOrString): GridStack;
```

Defined in: [gridstack.ts:91](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L91)

initializing the HTML element, or selector string, into a grid will return the grid. Calling it again will
simply return the existing instance (ignore any passed options). There is also an initAll() version that support
multiple grids initialization at once. Or you can use addGrid() to create the entire grid from JSON.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `options` | [`GridStackOptions`](#gridstackoptions) | `{}` | grid options (optional) |
| `elOrString` | [`GridStackElement`](#gridstackelement) | `'.grid-stack'` | element or CSS selector (first one used) to convert to a grid (default to '.grid-stack' class selector) |

###### Returns

[`GridStack`](#gridstack-1)

###### Example

```ts
const grid = GridStack.init();

Note: the HTMLElement (of type GridHTMLElement) will store a `gridstack: GridStack` value that can be retrieve later
const grid = document.querySelector('.grid-stack').gridstack;
```

##### initAll()

```ts
static initAll(options, selector): GridStack[];
```

Defined in: [gridstack.ts:118](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L118)

Will initialize a list of elements (given a selector) and return an array of grids.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `options` | [`GridStackOptions`](#gridstackoptions) | `{}` | grid options (optional) |
| `selector` | `string` | `'.grid-stack'` | elements selector to convert to grids (default to '.grid-stack' class selector) |

###### Returns

[`GridStack`](#gridstack-1)[]

###### Example

```ts
const grids = GridStack.initAll();
grids.forEach(...)
```

##### isAreaEmpty()

```ts
isAreaEmpty(
   x, 
   y, 
   w, 
   h): boolean;
```

Defined in: [gridstack.ts:1066](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1066)

Checks if specified area is empty.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | the position x. |
| `y` | `number` | the position y. |
| `w` | `number` | the width of to check |
| `h` | `number` | the height of to check |

###### Returns

`boolean`

##### isIgnoreChangeCB()

```ts
isIgnoreChangeCB(): boolean;
```

Defined in: [gridstack.ts:978](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L978)

true if changeCB should be ignored due to column change, sizeToContent, loading, etc... which caller can ignore for dirty flag case

###### Returns

`boolean`

##### load()

```ts
load(items, addRemove): GridStack;
```

Defined in: [gridstack.ts:681](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L681)

load the widgets from a list. This will call update() on each (matching by id) or add/remove widgets that are not there.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `items` | [`GridStackWidget`](#gridstackwidget)[] | list of widgets definition to update/create |
| `addRemove` | `boolean` \| [`AddRemoveFcn`](#addremovefcn) | boolean (default true) or callback method can be passed to control if and how missing widgets can be added/removed, giving the user control of insertion. |

###### Returns

[`GridStack`](#gridstack-1)

###### Example

```ts
see http://gridstackjs.com/demo/serialization.html
```

##### makeSubGrid()

```ts
makeSubGrid(
   el, 
   ops?, 
   nodeToAdd?, 
   saveContent?): GridStack;
```

Defined in: [gridstack.ts:495](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L495)

Convert an existing gridItem element into a sub-grid with the given (optional) options, else inherit them
from the parent's subGrid options.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) | `undefined` | gridItem element to convert |
| `ops?` | [`GridStackOptions`](#gridstackoptions) | `undefined` | (optional) sub-grid options, else default to node, then parent settings, else defaults |
| `nodeToAdd?` | [`GridStackNode`](#gridstacknode-2) | `undefined` | (optional) node to add to the newly created sub grid (used when dragging over existing regular item) |
| `saveContent?` | `boolean` | `true` | if true (default) the html inside .grid-stack-content will be saved to child widget |

###### Returns

[`GridStack`](#gridstack-1)

newly created grid

##### makeWidget()

```ts
makeWidget(els, options?): GridItemHTMLElement;
```

Defined in: [gridstack.ts:1083](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1083)

If you add elements to your grid by hand (or have some framework creating DOM), you have to tell gridstack afterwards to make them widgets.
If you want gridstack to add the elements for you, use `addWidget()` instead.
Makes the given element a widget and returns it.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `els` | [`GridStackElement`](#gridstackelement) | widget or single selector to convert. |
| `options?` | [`GridStackWidget`](#gridstackwidget) | widget definition to use instead of reading attributes or using default sizing values |

###### Returns

[`GridItemHTMLElement`](#griditemhtmlelement)

###### Example

```ts
const grid = GridStack.init();
grid.el.innerHtml = '<div id="1" gs-w="3"></div><div id="2"></div>';
grid.makeWidget('1');
grid.makeWidget('2', {w:2, content: 'hello'});
```

##### margin()

```ts
margin(value): GridStack;
```

Defined in: [gridstack.ts:1510](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1510)

Updates the margins which will set all 4 sides at once - see `GridStackOptions.margin` for format options (CSS string format of 1,2,4 values or single number).

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`numberOrString`](#numberorstring) | margin value |

###### Returns

[`GridStack`](#gridstack-1)

##### movable()

```ts
movable(els, val): GridStack;
```

Defined in: [gridstack.ts:1950](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1950)

Enables/Disables dragging by the user of specific grid element. If you want all items, and have it affect future items, use enableMove() instead. No-op for static grids.
IF you are looking to prevent an item from moving (due to being pushed around by another during collision) use locked property instead.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `els` | [`GridStackElement`](#gridstackelement) | widget or selector to modify. |
| `val` | `boolean` | if true widget will be draggable, assuming the parent grid isn't noMove or static. |

###### Returns

[`GridStack`](#gridstack-1)

##### off()

```ts
off(name): GridStack;
```

Defined in: [gridstack.ts:1163](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1163)

unsubscribe from the 'on' event GridStackEvent

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | of the event (see possible values) or list of names space separated |

###### Returns

[`GridStack`](#gridstack-1)

##### offAll()

```ts
offAll(): GridStack;
```

Defined in: [gridstack.ts:1183](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1183)

remove all event handlers

###### Returns

[`GridStack`](#gridstack-1)

##### on()

###### Call Signature

```ts
on(name, callback): GridStack;
```

Defined in: [gridstack.ts:1126](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1126)

Event handler that extracts our CustomEvent data out automatically for receiving custom
notifications (see doc for supported events)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `"dropped"` | of the event (see possible values) or list of names space separated |
| `callback` | [`GridStackDroppedHandler`](#gridstackdroppedhandler) | function called with event and optional second/third param (see README documentation for each signature). |

###### Returns

[`GridStack`](#gridstack-1)

###### Example

```ts
grid.on('added', function(e, items) { log('added ', items)} );
or
grid.on('added removed change', function(e, items) { log(e.type, items)} );

Note: in some cases it is the same as calling native handler and parsing the event.
grid.el.addEventListener('added', function(event) { log('added ', event.detail)} );
```

###### Call Signature

```ts
on(name, callback): GridStack;
```

Defined in: [gridstack.ts:1127](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1127)

Event handler that extracts our CustomEvent data out automatically for receiving custom
notifications (see doc for supported events)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `"enable"` \| `"disable"` | of the event (see possible values) or list of names space separated |
| `callback` | [`GridStackEventHandler`](#gridstackeventhandler) | function called with event and optional second/third param (see README documentation for each signature). |

###### Returns

[`GridStack`](#gridstack-1)

###### Example

```ts
grid.on('added', function(e, items) { log('added ', items)} );
or
grid.on('added removed change', function(e, items) { log(e.type, items)} );

Note: in some cases it is the same as calling native handler and parsing the event.
grid.el.addEventListener('added', function(event) { log('added ', event.detail)} );
```

###### Call Signature

```ts
on(name, callback): GridStack;
```

Defined in: [gridstack.ts:1128](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1128)

Event handler that extracts our CustomEvent data out automatically for receiving custom
notifications (see doc for supported events)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `"removed"` \| `"change"` \| `"added"` \| `"resizecontent"` | of the event (see possible values) or list of names space separated |
| `callback` | [`GridStackNodesHandler`](#gridstacknodeshandler) | function called with event and optional second/third param (see README documentation for each signature). |

###### Returns

[`GridStack`](#gridstack-1)

###### Example

```ts
grid.on('added', function(e, items) { log('added ', items)} );
or
grid.on('added removed change', function(e, items) { log(e.type, items)} );

Note: in some cases it is the same as calling native handler and parsing the event.
grid.el.addEventListener('added', function(event) { log('added ', event.detail)} );
```

###### Call Signature

```ts
on(name, callback): GridStack;
```

Defined in: [gridstack.ts:1129](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1129)

Event handler that extracts our CustomEvent data out automatically for receiving custom
notifications (see doc for supported events)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | \| `"resize"` \| `"drag"` \| `"dragstart"` \| `"resizestart"` \| `"resizestop"` \| `"dragstop"` | of the event (see possible values) or list of names space separated |
| `callback` | [`GridStackElementHandler`](#gridstackelementhandler) | function called with event and optional second/third param (see README documentation for each signature). |

###### Returns

[`GridStack`](#gridstack-1)

###### Example

```ts
grid.on('added', function(e, items) { log('added ', items)} );
or
grid.on('added removed change', function(e, items) { log(e.type, items)} );

Note: in some cases it is the same as calling native handler and parsing the event.
grid.el.addEventListener('added', function(event) { log('added ', event.detail)} );
```

###### Call Signature

```ts
on(name, callback): GridStack;
```

Defined in: [gridstack.ts:1130](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1130)

Event handler that extracts our CustomEvent data out automatically for receiving custom
notifications (see doc for supported events)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | of the event (see possible values) or list of names space separated |
| `callback` | [`GridStackEventHandlerCallback`](#gridstackeventhandlercallback) | function called with event and optional second/third param (see README documentation for each signature). |

###### Returns

[`GridStack`](#gridstack-1)

###### Example

```ts
grid.on('added', function(e, items) { log('added ', items)} );
or
grid.on('added removed change', function(e, items) { log(e.type, items)} );

Note: in some cases it is the same as calling native handler and parsing the event.
grid.el.addEventListener('added', function(event) { log('added ', event.detail)} );
```

##### onResize()

```ts
onResize(clientWidth): GridStack;
```

Defined in: [gridstack.ts:1768](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1768)

called when we are being resized - check if the one Column Mode needs to be turned on/off
and remember the prev columns we used, or get our count from parent, as well as check for cellHeight==='auto' (square)
or `sizeToContent` gridItem options.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `clientWidth` | `number` |

###### Returns

[`GridStack`](#gridstack-1)

##### prepareDragDrop()

```ts
prepareDragDrop(el, force?): GridStack;
```

Defined in: [gridstack.ts:2372](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2372)

prepares the element for drag&drop - this is normally called by makeWidget() unless are are delay loading

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) | `undefined` | GridItemHTMLElement of the widget |
| `force?` | `boolean` | `false` |  |

###### Returns

[`GridStack`](#gridstack-1)

##### registerEngine()

```ts
static registerEngine(engineClass): void;
```

Defined in: [gridstack.ts:172](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L172)

call this method to register your engine instead of the default one.
See instead `GridStackOptions.engineClass` if you only need to
replace just one instance.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `engineClass` | *typeof* [`GridStackEngine`](#gridstackengine-2) |

###### Returns

`void`

##### removeAll()

```ts
removeAll(removeDOM, triggerEvent): GridStack;
```

Defined in: [gridstack.ts:1232](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1232)

Removes all widgets from the grid.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `removeDOM` | `boolean` | `true` | if `false` DOM elements won't be removed from the tree (Default? `true`). |
| `triggerEvent` | `boolean` | `true` | if `false` (quiet mode) element will not be added to removed list and no 'removed' callbacks will be called (Default? true). |

###### Returns

[`GridStack`](#gridstack-1)

##### removeAsSubGrid()

```ts
removeAsSubGrid(nodeThatRemoved?): void;
```

Defined in: [gridstack.ts:588](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L588)

called when an item was converted into a nested grid to accommodate a dragged over item, but then item leaves - return back
to the original grid-item. Also called to remove empty sub-grids when last item is dragged out (since re-creating is simple)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `nodeThatRemoved?` | [`GridStackNode`](#gridstacknode-2) |

###### Returns

`void`

##### removeWidget()

```ts
removeWidget(
   els, 
   removeDOM, 
   triggerEvent): GridStack;
```

Defined in: [gridstack.ts:1194](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1194)

Removes widget from the grid.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `els` | [`GridStackElement`](#gridstackelement) | `undefined` | - |
| `removeDOM` | `boolean` | `true` | if `false` DOM element won't be removed from the tree (Default? true). |
| `triggerEvent` | `boolean` | `true` | if `false` (quiet mode) element will not be added to removed list and no 'removed' callbacks will be called (Default? true). |

###### Returns

[`GridStack`](#gridstack-1)

##### resizable()

```ts
resizable(els, val): GridStack;
```

Defined in: [gridstack.ts:1966](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1966)

Enables/Disables user resizing of specific grid element. If you want all items, and have it affect future items, use enableResize() instead. No-op for static grids.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `els` | [`GridStackElement`](#gridstackelement) | widget or selector to modify |
| `val` | `boolean` | if true widget will be resizable, assuming the parent grid isn't noResize or static. |

###### Returns

[`GridStack`](#gridstack-1)

##### resizeToContent()

```ts
resizeToContent(el): void;
```

Defined in: [gridstack.ts:1422](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1422)

Updates widget height to match the content height to avoid v-scrollbar or dead space.
Note: this assumes only 1 child under resizeToContentParent='.grid-stack-item-content' (sized to gridItem minus padding) that is at the entire content size wanted.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) | grid item element |

###### Returns

`void`

##### rotate()

```ts
rotate(els, relative?): GridStack;
```

Defined in: [gridstack.ts:1486](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1486)

rotate (by swapping w & h) the passed in node - called when user press 'r' during dragging

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `els` | [`GridStackElement`](#gridstackelement) | widget or selector of objects to modify |
| `relative?` | [`Position`](#position-1) | optional pixel coord relative to upper/left corner to rotate around (will keep that cell under cursor) |

###### Returns

[`GridStack`](#gridstack-1)

##### save()

```ts
save(
   saveContent, 
   saveGridOpt, 
   saveCB): 
  | GridStackOptions
  | GridStackWidget[];
```

Defined in: [gridstack.ts:619](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L619)

saves the current layout returning a list of widgets for serialization which might include any nested grids.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `saveContent` | `boolean` | `true` | if true (default) the latest html inside .grid-stack-content will be saved to GridStackWidget.content field, else it will be removed. |
| `saveGridOpt` | `boolean` | `false` | if true (default false), save the grid options itself, so you can call the new GridStack.addGrid() to recreate everything from scratch. GridStackOptions.children would then contain the widget list instead. |
| `saveCB` | [`SaveFcn`](#savefcn) | `GridStack.saveCB` | callback for each node -> widget, so application can insert additional data to be saved into the widget data structure. |

###### Returns

  \| [`GridStackOptions`](#gridstackoptions)
  \| [`GridStackWidget`](#gridstackwidget)[]

list of widgets or full grid option, including .children list of widgets

##### setAnimation()

```ts
setAnimation(doAnimate, delay?): GridStack;
```

Defined in: [gridstack.ts:1251](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1251)

Toggle the grid animation state.  Toggles the `grid-stack-animate` class.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `doAnimate` | `boolean` | if true the grid will animate. |
| `delay?` | `boolean` | if true setting will be set on next event loop. |

###### Returns

[`GridStack`](#gridstack-1)

##### setStatic()

```ts
setStatic(
   val, 
   updateClass, 
   recurse): GridStack;
```

Defined in: [gridstack.ts:1274](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1274)

Toggle the grid static state, which permanently removes/add Drag&Drop support, unlike disable()/enable() that just turns it off/on.
Also toggle the grid-stack-static class.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `val` | `boolean` | `undefined` | if true the grid become static. |
| `updateClass` | `boolean` | `true` | true (default) if css class gets updated |
| `recurse` | `boolean` | `true` | true (default) if sub-grids also get updated |

###### Returns

[`GridStack`](#gridstack-1)

##### setupDragIn()

```ts
static setupDragIn(
   dragIn?, 
   dragInOptions?, 
   widgets?, 
   root?): void;
```

Defined in: [gridstack.ts:1931](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1931)

call to setup dragging in from the outside (say toolbar), by specifying the class selection and options.
Called during GridStack.init() as options, but can also be called directly (last param are used) in case the toolbar
is dynamically create and needs to be set later.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `dragIn?` | `string` \| `HTMLElement`[] | `undefined` | string selector (ex: '.sidebar-item') or list of dom elements |
| `dragInOptions?` | [`DDDragOpt`](#dddragopt) | `undefined` | options - see DDDragOpt. (default: {handle: '.grid-stack-item-content', appendTo: 'body'} |
| `widgets?` | [`GridStackWidget`](#gridstackwidget)[] | `undefined` | GridStackWidget def to assign to each element which defines what to create on drop |
| `root?` | `Document` \| `HTMLElement` | `document` | optional root which defaults to document (for shadow dom pass the parent HTMLDocument) |

###### Returns

`void`

##### triggerEvent()

```ts
protected triggerEvent(event, target): void;
```

Defined in: [gridstack.ts:2626](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2626)

call given event callback on our main top-most grid (if we're nested)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `Event` |
| `target` | [`GridItemHTMLElement`](#griditemhtmlelement) |

###### Returns

`void`

##### update()

```ts
update(els, opt): GridStack;
```

Defined in: [gridstack.ts:1330](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1330)

Updates widget position/size and other info. Note: if you need to call this on all nodes, use load() instead which will update what changed.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `els` | [`GridStackElement`](#gridstackelement) | widget or selector of objects to modify (note: setting the same x,y for multiple items will be indeterministic and likely unwanted) |
| `opt` | [`GridStackWidget`](#gridstackwidget) | new widget options (x,y,w,h, etc..). Only those set will be updated. |

###### Returns

[`GridStack`](#gridstack-1)

##### updateOptions()

```ts
updateOptions(o): GridStack;
```

Defined in: [gridstack.ts:1292](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1292)

Updates the passed in options on the grid (similar to update(widget) for for the grid options).

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `o` | [`GridStackOptions`](#gridstackoptions) |

###### Returns

[`GridStack`](#gridstack-1)

##### willItFit()

```ts
willItFit(node): boolean;
```

Defined in: [gridstack.ts:1540](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1540)

Returns true if the height of the grid will be less than the vertical
constraint. Always returns true if grid doesn't have height constraint.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | [`GridStackWidget`](#gridstackwidget) | contains x,y,w,h,auto-position options |

###### Returns

`boolean`

###### Example

```ts
if (grid.willItFit(newWidget)) {
  grid.addWidget(newWidget);
} else {
  alert('Not enough free space to place the widget');
}
```

#### Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="addremovecb"></a> `addRemoveCB?` | `static` | [`AddRemoveFcn`](#addremovefcn) | `undefined` | callback method use when new items|grids needs to be created or deleted, instead of the default item: <div class="grid-stack-item"><div class="grid-stack-item-content">w.content</div></div> grid: <div class="grid-stack">grid content...</div> add = true: the returned DOM element will then be converted to a GridItemHTMLElement using makeWidget()|GridStack:init(). add = false: the item will be removed from DOM (if not already done) grid = true|false for grid vs grid-items | [gridstack.ts:184](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L184) |
| <a id="animationdelay"></a> `animationDelay` | `public` | `number` | `undefined` | time to wait for animation (if enabled) to be done so content sizing can happen | [gridstack.ts:218](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L218) |
| <a id="el-4"></a> `el` | `public` | [`GridHTMLElement`](#gridhtmlelement) | `undefined` | the HTML element tied to this grid after it's been initialized | [gridstack.ts:263](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L263) |
| <a id="engine"></a> `engine` | `public` | [`GridStackEngine`](#gridstackengine-2) | `undefined` | engine used to implement non DOM grid functionality | [gridstack.ts:212](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L212) |
| <a id="engine-1"></a> `Engine` | `static` | *typeof* [`GridStackEngine`](#gridstackengine-2) | `GridStackEngine` | scoping so users can call new GridStack.Engine(12) for example | [gridstack.ts:209](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L209) |
| <a id="engineclass"></a> `engineClass` | `static` | *typeof* [`GridStackEngine`](#gridstackengine-2) | `undefined` | - | [gridstack.ts:220](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L220) |
| <a id="opts"></a> `opts` | `public` | [`GridStackOptions`](#gridstackoptions) | `{}` | grid options - public for classes to access, but use methods to modify! | [gridstack.ts:263](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L263) |
| <a id="parentgridnode"></a> `parentGridNode?` | `public` | [`GridStackNode`](#gridstacknode-2) | `undefined` | point to a parent grid item if we're nested (inside a grid-item in between 2 Grids) | [gridstack.ts:215](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L215) |
| <a id="rendercb"></a> `renderCB?` | `static` | [`RenderFcn`](#renderfcn) | `undefined` | callback to create the content of widgets so the app can control how to store and restore it By default this lib will do 'el.textContent = w.content' forcing text only support for avoiding potential XSS issues. | [gridstack.ts:195](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L195) |
| <a id="resizeobserver"></a> `resizeObserver` | `protected` | `ResizeObserver` | `undefined` | - | [gridstack.ts:221](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L221) |
| <a id="resizetocontentcb"></a> `resizeToContentCB?` | `static` | [`ResizeToContentFcn`](#resizetocontentfcn) | `undefined` | callback to use for resizeToContent instead of the built in one | [gridstack.ts:201](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L201) |
| <a id="resizetocontentparent"></a> `resizeToContentParent` | `static` | `string` | `'.grid-stack-item-content'` | parent class for sizing content. defaults to '.grid-stack-item-content' | [gridstack.ts:203](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L203) |
| <a id="responselayout"></a> `responseLayout` | `protected` | [`ColumnOptions`](#columnoptions) | `undefined` | - | [gridstack.ts:255](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L255) |
| <a id="savecb"></a> `saveCB?` | `static` | [`SaveFcn`](#savefcn) | `undefined` | callback during saving to application can inject extra data for each widget, on top of the grid layout properties | [gridstack.ts:189](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L189) |
| <a id="updatecb"></a> `updateCB?` | `static` | (`w`) => `void` | `undefined` | called after a widget has been updated (eg: load() into an existing list of children) so application can do extra work | [gridstack.ts:198](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L198) |
| <a id="utils"></a> `Utils` | `static` | *typeof* [`Utils`](#utils-1) | `Utils` | scoping so users can call GridStack.Utils.sort() for example | [gridstack.ts:206](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L206) |

***

<a id="gridstackengine"></a>
### GridStackEngine

Defined in: [gridstack-engine.ts:27](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L27)

Defines the GridStack engine that does most no DOM grid manipulation.
See GridStack methods and vars for descriptions.

NOTE: values should not be modified directly - call the main GridStack API instead

#### Accessors

##### float

###### Get Signature

```ts
get float(): boolean;
```

Defined in: [gridstack-engine.ts:315](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L315)

float getter method

###### Returns

`boolean`

###### Set Signature

```ts
set float(val): void;
```

Defined in: [gridstack-engine.ts:306](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L306)

enable/disable floating widgets (default: `false`) See [example](http://gridstackjs.com/demo/float.html)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

###### Returns

`void`

#### Constructors

##### Constructor

```ts
new GridStackEngine(opts): GridStackEngine;
```

Defined in: [gridstack-engine.ts:54](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L54)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`GridStackEngineOptions`](#gridstackengineoptions) |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

#### Methods

##### \_useEntireRowArea()

```ts
protected _useEntireRowArea(node, nn): boolean;
```

Defined in: [gridstack-engine.ts:81](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L81)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) |
| `nn` | [`GridStackPosition`](#gridstackposition) |

###### Returns

`boolean`

##### addNode()

```ts
addNode(
   node, 
   triggerAddEvent, 
   after?): GridStackNode;
```

Defined in: [gridstack-engine.ts:545](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L545)

call to add the given node to our list, fixing collision and re-packing

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) | `undefined` |
| `triggerAddEvent` | `boolean` | `false` |
| `after?` | [`GridStackNode`](#gridstacknode-2) | `undefined` |

###### Returns

[`GridStackNode`](#gridstacknode-2)

##### batchUpdate()

```ts
batchUpdate(flag, doPack): GridStackEngine;
```

Defined in: [gridstack-engine.ts:63](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L63)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `flag` | `boolean` | `true` |
| `doPack` | `boolean` | `true` |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

##### beginUpdate()

```ts
beginUpdate(node): GridStackEngine;
```

Defined in: [gridstack-engine.ts:747](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L747)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

##### cacheLayout()

```ts
cacheLayout(
   nodes, 
   column, 
   clear): GridStackEngine;
```

Defined in: [gridstack-engine.ts:937](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L937)

call to cache the given layout internally to the given location so we can restore back when column changes size

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `nodes` | [`GridStackNode`](#gridstacknode-2)[] | `undefined` | list of nodes |
| `column` | `number` | `undefined` | corresponding column index to save it under |
| `clear` | `boolean` | `false` | if true, will force other caches to be removed (default false) |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

##### cacheOneLayout()

```ts
cacheOneLayout(n, column): GridStackEngine;
```

Defined in: [gridstack-engine.ts:957](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L957)

call to cache the given node layout internally to the given location so we can restore back when column changes size

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n` | [`GridStackNode`](#gridstacknode-2) | - |
| `column` | `number` | corresponding column index to save it under |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

##### cacheRects()

```ts
cacheRects(
   w, 
   h, 
   top, 
   right, 
   bottom, 
   left): GridStackEngine;
```

Defined in: [gridstack-engine.ts:225](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L225)

called to cache the nodes pixel rectangles used for collision detection during drag

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `w` | `number` |
| `h` | `number` |
| `top` | `number` |
| `right` | `number` |
| `bottom` | `number` |
| `left` | `number` |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

##### changedPosConstrain()

```ts
changedPosConstrain(node, p): boolean;
```

Defined in: [gridstack-engine.ts:669](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L669)

true if x,y or w,h are different after clamping to min/max

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) |
| `p` | [`GridStackPosition`](#gridstackposition) |

###### Returns

`boolean`

##### cleanupNode()

```ts
cleanupNode(node): GridStackEngine;
```

Defined in: [gridstack-engine.ts:988](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L988)

called to remove all internal values but the _id

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

##### collide()

```ts
collide(
   skip, 
   area, 
   skip2?): GridStackNode;
```

Defined in: [gridstack-engine.ts:146](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L146)

return the nodes that intercept the given node. Optionally a different area can be used, as well as a second node to skip

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `skip` | [`GridStackNode`](#gridstacknode-2) | `undefined` |
| `area` | [`GridStackNode`](#gridstacknode-2) | `skip` |
| `skip2?` | [`GridStackNode`](#gridstacknode-2) | `undefined` |

###### Returns

[`GridStackNode`](#gridstacknode-2)

##### collideAll()

```ts
collideAll(
   skip, 
   area, 
   skip2?): GridStackNode[];
```

Defined in: [gridstack-engine.ts:151](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L151)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `skip` | [`GridStackNode`](#gridstacknode-2) | `undefined` |
| `area` | [`GridStackNode`](#gridstacknode-2) | `skip` |
| `skip2?` | [`GridStackNode`](#gridstacknode-2) | `undefined` |

###### Returns

[`GridStackNode`](#gridstacknode-2)[]

##### compact()

```ts
compact(layout, doSort): GridStackEngine;
```

Defined in: [gridstack-engine.ts:283](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L283)

re-layout grid items to reclaim any empty space - optionally keeping the sort order exactly the same ('list' mode) vs truly finding an empty spaces

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `layout` | [`CompactOptions`](#compactoptions) | `'compact'` |
| `doSort` | `boolean` | `true` |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

##### directionCollideCoverage()

```ts
protected directionCollideCoverage(
   node, 
   o, 
   collides): GridStackNode;
```

Defined in: [gridstack-engine.ts:158](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L158)

does a pixel coverage collision based on where we started, returning the node that has the most coverage that is >50% mid line

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) |
| `o` | [`GridStackMoveOpts`](#gridstackmoveopts) |
| `collides` | [`GridStackNode`](#gridstacknode-2)[] |

###### Returns

[`GridStackNode`](#gridstacknode-2)

##### endUpdate()

```ts
endUpdate(): GridStackEngine;
```

Defined in: [gridstack-engine.ts:756](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L756)

###### Returns

[`GridStackEngine`](#gridstackengine-2)

##### findCacheLayout()

```ts
protected findCacheLayout(n, column): number;
```

Defined in: [gridstack-engine.ts:971](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L971)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | [`GridStackNode`](#gridstacknode-2) |
| `column` | `number` |

###### Returns

`number`

##### findEmptyPosition()

```ts
findEmptyPosition(
   node, 
   nodeList, 
   column, 
   after?): boolean;
```

Defined in: [gridstack-engine.ts:523](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L523)

find the first available empty spot for the given node width/height, updating the x,y attributes. return true if found.
optionally you can pass your own existing node list and column count, otherwise defaults to that engine data.
Optionally pass a widget to start search AFTER, meaning the order will remain the same but possibly have empty slots we skipped

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) |
| `nodeList` | [`GridStackNode`](#gridstacknode-2)[] |
| `column` | `number` |
| `after?` | [`GridStackNode`](#gridstacknode-2) |

###### Returns

`boolean`

##### getDirtyNodes()

```ts
getDirtyNodes(verify?): GridStackNode[];
```

Defined in: [gridstack-engine.ts:470](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L470)

returns a list of modified nodes from their original values

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `verify?` | `boolean` |

###### Returns

[`GridStackNode`](#gridstacknode-2)[]

##### getRow()

```ts
getRow(): number;
```

Defined in: [gridstack-engine.ts:743](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L743)

###### Returns

`number`

##### isAreaEmpty()

```ts
isAreaEmpty(
   x, 
   y, 
   w, 
   h): boolean;
```

Defined in: [gridstack-engine.ts:277](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L277)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `w` | `number` |
| `h` | `number` |

###### Returns

`boolean`

##### moveNode()

```ts
moveNode(node, o): boolean;
```

Defined in: [gridstack-engine.ts:683](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L683)

return true if the passed in node was actually moved (checks for no-op and locked)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) |
| `o` | [`GridStackMoveOpts`](#gridstackmoveopts) |

###### Returns

`boolean`

##### moveNodeCheck()

```ts
moveNodeCheck(node, o): boolean;
```

Defined in: [gridstack-engine.ts:597](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L597)

checks if item can be moved (layout constrain) vs moveNode(), returning true if was able to move.
In more complicated cases (maxRow) it will attempt at moving the item and fixing
others in a clone first, then apply those changes if still within specs.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) |
| `o` | [`GridStackMoveOpts`](#gridstackmoveopts) |

###### Returns

`boolean`

##### nodeBoundFix()

```ts
nodeBoundFix(node, resizing?): GridStackEngine;
```

Defined in: [gridstack-engine.ts:407](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L407)

part2 of preparing a node to fit inside our grid - checks for x,y,w from grid dimensions

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) |
| `resizing?` | `boolean` |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

##### prepareNode()

```ts
prepareNode(node, resizing?): GridStackNode;
```

Defined in: [gridstack-engine.ts:366](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L366)

given a random node, makes sure it's coordinates/values are valid in the current grid

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) | to adjust |
| `resizing?` | `boolean` | if out of bound, resize down or move into the grid to fit ? |

###### Returns

[`GridStackNode`](#gridstacknode-2)

##### removeAll()

```ts
removeAll(removeDOM, triggerEvent): GridStackEngine;
```

Defined in: [gridstack-engine.ts:584](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L584)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `removeDOM` | `boolean` | `true` |
| `triggerEvent` | `boolean` | `true` |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

##### removeNode()

```ts
removeNode(
   node, 
   removeDOM, 
   triggerEvent): GridStackEngine;
```

Defined in: [gridstack-engine.ts:568](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L568)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) | `undefined` |
| `removeDOM` | `boolean` | `true` |
| `triggerEvent` | `boolean` | `false` |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

##### removeNodeFromLayoutCache()

```ts
removeNodeFromLayoutCache(n): void;
```

Defined in: [gridstack-engine.ts:975](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L975)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | [`GridStackNode`](#gridstacknode-2) |

###### Returns

`void`

##### save()

```ts
save(saveElement, saveCB?): GridStackNode[];
```

Defined in: [gridstack-engine.ts:767](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L767)

saves a copy of the largest column layout (eg 12 even when rendering oneColumnMode) so we don't loose orig layout,
returning a list of widgets for serialization

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `saveElement` | `boolean` | `true` |
| `saveCB?` | [`SaveFcn`](#savefcn) | `undefined` |

###### Returns

[`GridStackNode`](#gridstacknode-2)[]

##### sortNodes()

```ts
sortNodes(dir): GridStackEngine;
```

Defined in: [gridstack-engine.ts:318](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L318)

sort the nodes array from first to last, or reverse. Called during collision/placement to force an order

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `dir` | `-1` \| `1` | `1` |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

##### swap()

```ts
swap(a, b): boolean;
```

Defined in: [gridstack-engine.ts:239](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L239)

called to possibly swap between 2 nodes (same size or column, not locked, touching), returning true if successful

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | [`GridStackNode`](#gridstacknode-2) |
| `b` | [`GridStackNode`](#gridstacknode-2) |

###### Returns

`boolean`

##### willItFit()

```ts
willItFit(node): boolean;
```

Defined in: [gridstack-engine.ts:648](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L648)

return true if can fit in grid height constrain only (always true if no maxRow)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) |

###### Returns

`boolean`

#### Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="addednodes"></a> `addedNodes` | `public` | [`GridStackNode`](#gridstacknode-2)[] | `[]` | - | [gridstack-engine.ts:31](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L31) |
| <a id="batchmode"></a> `batchMode` | `public` | `boolean` | `undefined` | - | [gridstack-engine.ts:33](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L33) |
| <a id="column-2"></a> `column` | `public` | `number` | `undefined` | - | [gridstack-engine.ts:28](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L28) |
| <a id="defaultcolumn"></a> `defaultColumn` | `public` | `number` | `12` | - | [gridstack-engine.ts:34](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L34) |
| <a id="maxrow"></a> `maxRow` | `public` | `number` | `undefined` | - | [gridstack-engine.ts:29](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L29) |
| <a id="nodes"></a> `nodes` | `public` | [`GridStackNode`](#gridstacknode-2)[] | `undefined` | - | [gridstack-engine.ts:30](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L30) |
| <a id="removednodes"></a> `removedNodes` | `public` | [`GridStackNode`](#gridstacknode-2)[] | `[]` | - | [gridstack-engine.ts:32](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L32) |
| <a id="skipcacheupdate"></a> `skipCacheUpdate?` | `public` | `boolean` | `undefined` | true when grid.load() already cached the layout and can skip out of bound caching info | [gridstack-engine.ts:48](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L48) |

***

<a id="utils"></a>
### Utils

Defined in: [utils.ts:61](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L61)

Utility methods

#### Constructors

##### Constructor

```ts
new Utils(): Utils;
```

###### Returns

[`Utils`](#utils-1)

#### Methods

##### addElStyles()

```ts
static addElStyles(el, styles): void;
```

Defined in: [utils.ts:469](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L469)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | `HTMLElement` |
| `styles` | \{ \[`prop`: `string`\]: `string` \| `string`[]; \} |

###### Returns

`void`

##### appendTo()

```ts
static appendTo(el, parent): void;
```

Defined in: [utils.ts:451](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L451)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | `HTMLElement` |
| `parent` | `string` \| `HTMLElement` |

###### Returns

`void`

##### area()

```ts
static area(a): number;
```

Defined in: [utils.ts:154](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L154)

returns the area

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | [`GridStackPosition`](#gridstackposition) |

###### Returns

`number`

##### areaIntercept()

```ts
static areaIntercept(a, b): number;
```

Defined in: [utils.ts:143](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L143)

returns the area a and b overlap

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | [`GridStackPosition`](#gridstackposition) |
| `b` | [`GridStackPosition`](#gridstackposition) |

###### Returns

`number`

##### canBeRotated()

```ts
static canBeRotated(n): boolean;
```

Defined in: [utils.ts:572](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L572)

true if the item can be rotated (checking for prop, not space available)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | [`GridStackNode`](#gridstacknode-2) |

###### Returns

`boolean`

##### clone()

```ts
static clone<T>(obj): T;
```

Defined in: [utils.ts:414](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L414)

single level clone, returning a new object with same top fields. This will share sub objects and arrays

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `obj` | `T` |

###### Returns

`T`

##### cloneDeep()

```ts
static cloneDeep<T>(obj): T;
```

Defined in: [utils.ts:430](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L430)

Recursive clone version that returns a full copy, checking for nested objects and arrays ONLY.
Note: this will use as-is any key starting with double __ (and not copy inside) some lib have circular dependencies.

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `obj` | `T` |

###### Returns

`T`

##### cloneNode()

```ts
static cloneNode(el): HTMLElement;
```

Defined in: [utils.ts:445](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L445)

deep clone the given HTML node, removing teh unique id field

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | `HTMLElement` |

###### Returns

`HTMLElement`

##### copyPos()

```ts
static copyPos(
   a, 
   b, 
   doMinMax): GridStackWidget;
```

Defined in: [utils.ts:244](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L244)

copies over b size & position (GridStackPosition), and optionally min/max as well

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `a` | [`GridStackWidget`](#gridstackwidget) | `undefined` |
| `b` | [`GridStackWidget`](#gridstackwidget) | `undefined` |
| `doMinMax` | `boolean` | `false` |

###### Returns

[`GridStackWidget`](#gridstackwidget)

##### createDiv()

```ts
static createDiv(classes, parent?): HTMLElement;
```

Defined in: [utils.ts:118](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L118)

create a div with the given classes

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `classes` | `string`[] |
| `parent?` | `HTMLElement` |

###### Returns

`HTMLElement`

##### defaults()

```ts
static defaults(target, ...sources): object;
```

Defined in: [utils.ts:214](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L214)

copies unset fields in target to use the given default sources values

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | `any` |
| ...`sources` | `any`[] |

###### Returns

`object`

##### find()

```ts
static find(nodes, id): GridStackNode;
```

Defined in: [utils.ts:173](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L173)

find an item by id

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `nodes` | [`GridStackNode`](#gridstacknode-2)[] |
| `id` | `string` |

###### Returns

[`GridStackNode`](#gridstacknode-2)

##### getElement()

```ts
static getElement(els, root): HTMLElement;
```

Defined in: [utils.ts:87](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L87)

convert a potential selector into actual single element. optional root which defaults to document (for shadow dom)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `els` | [`GridStackElement`](#gridstackelement) | `undefined` |
| `root` | `Document` \| `HTMLElement` | `document` |

###### Returns

`HTMLElement`

##### getElements()

```ts
static getElements(els, root): HTMLElement[];
```

Defined in: [utils.ts:64](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L64)

convert a potential selector into actual list of html elements. optional root which defaults to document (for shadow dom)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `els` | [`GridStackElement`](#gridstackelement) | `undefined` |
| `root` | `Document` \| `HTMLElement` | `document` |

###### Returns

`HTMLElement`[]

##### getValuesFromTransformedElement()

```ts
static getValuesFromTransformedElement(parent): DragTransform;
```

Defined in: [utils.ts:529](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L529)

defines an element that is used to get the offset and scale from grid transforms
returns the scale and offsets from said element

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `parent` | `HTMLElement` |

###### Returns

[`DragTransform`](#dragtransform)

##### initEvent()

```ts
static initEvent<T>(e, info): T;
```

Defined in: [utils.ts:486](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L486)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | `MouseEvent` \| `DragEvent` |
| `info` | \{ `target?`: `EventTarget`; `type`: `string`; \} |
| `info.target?` | `EventTarget` |
| `info.type` | `string` |

###### Returns

`T`

##### isIntercepted()

```ts
static isIntercepted(a, b): boolean;
```

Defined in: [utils.ts:133](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L133)

returns true if a and b overlap

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | [`GridStackPosition`](#gridstackposition) |
| `b` | [`GridStackPosition`](#gridstackposition) |

###### Returns

`boolean`

##### isTouching()

```ts
static isTouching(a, b): boolean;
```

Defined in: [utils.ts:138](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L138)

returns true if a and b touch edges or corners

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | [`GridStackPosition`](#gridstackposition) |
| `b` | [`GridStackPosition`](#gridstackposition) |

###### Returns

`boolean`

##### lazyLoad()

```ts
static lazyLoad(n): boolean;
```

Defined in: [utils.ts:113](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L113)

true if widget (or grid) makes this item lazyLoad

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | [`GridStackNode`](#gridstacknode-2) |

###### Returns

`boolean`

##### parseHeight()

```ts
static parseHeight(val): HeightData;
```

Defined in: [utils.ts:193](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L193)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | [`numberOrString`](#numberorstring) |

###### Returns

[`HeightData`](#heightdata)

##### removeInternalAndSame()

```ts
static removeInternalAndSame(a, b): void;
```

Defined in: [utils.ts:273](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L273)

removes field from the first object if same as the second objects (like diffing) and internal '_' for saving

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | `unknown` |
| `b` | `unknown` |

###### Returns

`void`

##### removeInternalForSave()

```ts
static removeInternalForSave(n, removeEl): void;
```

Defined in: [utils.ts:288](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L288)

removes internal fields '_' and default values for saving

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `n` | [`GridStackNode`](#gridstacknode-2) | `undefined` |
| `removeEl` | `boolean` | `true` |

###### Returns

`void`

##### removePositioningStyles()

```ts
static removePositioningStyles(el): void;
```

Defined in: [utils.ts:321](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L321)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | `HTMLElement` |

###### Returns

`void`

##### same()

```ts
static same(a, b): boolean;
```

Defined in: [utils.ts:232](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L232)

given 2 objects return true if they have the same values. Checks for Object {} having same fields and values (just 1 level down)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | `unknown` |
| `b` | `unknown` |

###### Returns

`boolean`

##### samePos()

```ts
static samePos(a, b): boolean;
```

Defined in: [utils.ts:259](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L259)

true if a and b has same size & position

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | [`GridStackPosition`](#gridstackposition) |
| `b` | [`GridStackPosition`](#gridstackposition) |

###### Returns

`boolean`

##### sanitizeMinMax()

```ts
static sanitizeMinMax(node): void;
```

Defined in: [utils.ts:264](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L264)

given a node, makes sure it's min/max are valid

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) |

###### Returns

`void`

##### shouldSizeToContent()

```ts
static shouldSizeToContent(n, strict): boolean;
```

Defined in: [utils.ts:126](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L126)

true if we should resize to content. strict=true when only 'sizeToContent:true' and not a number which lets user adjust

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `n` | [`GridStackNode`](#gridstacknode-2) | `undefined` |
| `strict` | `boolean` | `false` |

###### Returns

`boolean`

##### simulateMouseEvent()

```ts
static simulateMouseEvent(
   e, 
   simulatedType, 
   target?): void;
```

Defined in: [utils.ts:502](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L502)

copies the MouseEvent (or convert Touch) properties and sends it as another event to the given target

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | `MouseEvent` \| `Touch` |
| `simulatedType` | `string` |
| `target?` | `EventTarget` |

###### Returns

`void`

##### sort()

```ts
static sort(nodes, dir): GridStackNode[];
```

Defined in: [utils.ts:163](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L163)

Sorts array of nodes

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `nodes` | [`GridStackNode`](#gridstacknode-2)[] | `undefined` | array to sort |
| `dir` | `-1` \| `1` | `1` | 1 for ascending, -1 for descending (optional) |

###### Returns

[`GridStackNode`](#gridstacknode-2)[]

##### swap()

```ts
static swap(
   o, 
   a, 
   b): void;
```

Defined in: [utils.ts:553](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L553)

swap the given object 2 field values

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `o` | `unknown` |
| `a` | `string` |
| `b` | `string` |

###### Returns

`void`

##### throttle()

```ts
static throttle(func, delay): () => void;
```

Defined in: [utils.ts:311](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L311)

delay calling the given function for given delay, preventing new calls from happening while waiting

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `func` | () => `void` |
| `delay` | `number` |

###### Returns

```ts
(): void;
```

###### Returns

`void`

##### toBool()

```ts
static toBool(v): boolean;
```

Defined in: [utils.ts:178](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L178)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `unknown` |

###### Returns

`boolean`

##### toNumber()

```ts
static toNumber(value): number;
```

Defined in: [utils.ts:189](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L189)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

###### Returns

`number`

## Interfaces

<a id="gridstackoptions"></a>
### GridStackOptions

Defined in: [types.ts:110](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L110)

Defines the options for a Grid

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="acceptwidgets"></a> `acceptWidgets?` | `string` \| `boolean` \| (`element`) => `boolean` | accept widgets dragged from other grids or from outside (default: `false`). Can be: `true` (uses `'.grid-stack-item'` class filter) or `false`, string for explicit class name, function returning a boolean. See [example](http://gridstack.github.io/gridstack.js/demo/two.html) | [types.ts:117](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L117) |
| <a id="alwaysshowresizehandle"></a> `alwaysShowResizeHandle?` | `boolean` \| `"mobile"` | possible values (default: `mobile`) - does not apply to non-resizable widgets `false` the resizing handles are only shown while hovering over a widget `true` the resizing handles are always shown 'mobile' if running on a mobile device, default to `true` (since there is no hovering per say), else `false`. See [example](http://gridstack.github.io/gridstack.js/demo/mobile.html) | [types.ts:124](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L124) |
| <a id="animate"></a> `animate?` | `boolean` | turns animation on (default?: true) | [types.ts:127](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L127) |
| <a id="auto"></a> `auto?` | `boolean` | if false gridstack will not initialize existing items (default?: true) | [types.ts:130](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L130) |
| <a id="cellheight-3"></a> `cellHeight?` | [`numberOrString`](#numberorstring) | one cell height (default?: 'auto'). Can be: an integer (px) a string (ex: '100px', '10em', '10rem'). Note: % doesn't work right - see demo/cell-height.html 0, in which case the library will not generate styles for rows. Everything must be defined in your own CSS files. 'auto' - height will be calculated for square cells (width / column) and updated live as you resize the window - also see `cellHeightThrottle` 'initial' - similar to 'auto' (start at square cells) but stay that size during window resizing. | [types.ts:140](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L140) |
| <a id="cellheightthrottle"></a> `cellHeightThrottle?` | `number` | throttle time delay (in ms) used when cellHeight='auto' to improve performance vs usability (default?: 100). A value of 0 will make it instant at a cost of re-creating the CSS file at ever window resize event! | [types.ts:145](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L145) |
| <a id="cellheightunit"></a> `cellHeightUnit?` | `string` | (internal) unit for cellHeight (default? 'px') which is set when a string cellHeight with a unit is passed (ex: '10rem') | [types.ts:148](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L148) |
| <a id="children"></a> `children?` | [`GridStackWidget`](#gridstackwidget)[] | list of children item to create when calling load() or addGrid() | [types.ts:151](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L151) |
| <a id="class"></a> `class?` | `string` | additional class on top of '.grid-stack' (which is required for our CSS) to differentiate this instance. Note: only used by addGrid(), else your element should have the needed class | [types.ts:164](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L164) |
| <a id="column-4"></a> `column?` | `number` \| `"auto"` | number of columns (default?: 12). Note: IF you change this, CSS also have to change. See https://github.com/gridstack/gridstack.js#change-grid-columns. Note: for nested grids, it is recommended to use 'auto' which will always match the container grid-item current width (in column) to keep inside and outside items always the same. flag is NOT supported for regular non-nested grids. | [types.ts:157](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L157) |
| <a id="columnopts"></a> `columnOpts?` | [`Responsive`](#responsive) | responsive column layout for width:column behavior | [types.ts:160](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L160) |
| <a id="disabledrag"></a> `disableDrag?` | `boolean` | disallows dragging of widgets (default?: false) | [types.ts:167](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L167) |
| <a id="disableresize"></a> `disableResize?` | `boolean` | disallows resizing of widgets (default?: false). | [types.ts:170](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L170) |
| <a id="draggable-3"></a> `draggable?` | [`DDDragOpt`](#dddragopt) | allows to override UI draggable options. (default?: { handle?: '.grid-stack-item-content', appendTo?: 'body' }) | [types.ts:173](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L173) |
| <a id="engineclass-1"></a> `engineClass?` | *typeof* [`GridStackEngine`](#gridstackengine-2) | the type of engine to create (so you can subclass) default to GridStackEngine | [types.ts:179](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L179) |
| <a id="float-4"></a> `float?` | `boolean` | enable floating widgets (default?: false) See example (http://gridstack.github.io/gridstack.js/demo/float.html) | [types.ts:182](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L182) |
| <a id="handle-1"></a> `handle?` | `string` | draggable handle selector (default?: '.grid-stack-item-content') | [types.ts:185](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L185) |
| <a id="handleclass"></a> `handleClass?` | `string` | draggable handle class (e.g. 'grid-stack-item-content'). If set 'handle' is ignored (default?: null) | [types.ts:188](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L188) |
| <a id="itemclass"></a> `itemClass?` | `string` | additional widget class (default?: 'grid-stack-item') | [types.ts:191](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L191) |
| <a id="layout-1"></a> `layout?` | [`ColumnOptions`](#columnoptions) | re-layout mode when we're a subgrid and we are being resized. default to 'list' | [types.ts:194](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L194) |
| <a id="lazyload-1"></a> `lazyLoad?` | `boolean` | true when widgets are only created when they scroll into view (visible) | [types.ts:197](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L197) |
| <a id="margin-2"></a> `margin?` | [`numberOrString`](#numberorstring) | gap between grid item and content (default?: 10). This will set all 4 sides and support the CSS formats below an integer (px) a string with possible units (ex: '2em', '20px', '2rem') string with space separated values (ex: '5px 10px 0 20px' for all 4 sides, or '5em 10em' for top/bottom and left/right pairs like CSS). Note: all sides must have same units (last one wins, default px) | [types.ts:206](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L206) |
| <a id="marginbottom-1"></a> `marginBottom?` | [`numberOrString`](#numberorstring) | - | [types.ts:211](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L211) |
| <a id="marginleft-1"></a> `marginLeft?` | [`numberOrString`](#numberorstring) | - | [types.ts:212](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L212) |
| <a id="marginright-1"></a> `marginRight?` | [`numberOrString`](#numberorstring) | - | [types.ts:210](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L210) |
| <a id="margintop-1"></a> `marginTop?` | [`numberOrString`](#numberorstring) | OLD way to optionally set each side - use margin: '5px 10px 0 20px' instead. Used internally to store each side. | [types.ts:209](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L209) |
| <a id="marginunit"></a> `marginUnit?` | `string` | (internal) unit for margin (default? 'px') set when `margin` is set as string with unit (ex: 2rem') | [types.ts:215](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L215) |
| <a id="maxrow-2"></a> `maxRow?` | `number` | maximum rows amount. Default? is 0 which means no maximum rows | [types.ts:218](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L218) |
| <a id="minrow"></a> `minRow?` | `number` | minimum rows amount which is handy to prevent grid from collapsing when empty. Default is `0`. When no set the `min-height` CSS attribute on the grid div (in pixels) can be used, which will round to the closest row. | [types.ts:223](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L223) |
| <a id="nonce"></a> `nonce?` | `string` | If you are using a nonce-based Content Security Policy, pass your nonce here and GridStack will add it to the <style> elements it creates. | [types.ts:227](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L227) |
| <a id="placeholderclass"></a> `placeholderClass?` | `string` | class for placeholder (default?: 'grid-stack-placeholder') | [types.ts:230](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L230) |
| <a id="placeholdertext"></a> `placeholderText?` | `string` | placeholder default content (default?: '') | [types.ts:233](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L233) |
| <a id="removable"></a> `removable?` | `string` \| `boolean` | if true widgets could be removed by dragging outside of the grid. It could also be a selector string (ex: ".trash"), in this case widgets will be removed by dropping them there (default?: false) See example (http://gridstack.github.io/gridstack.js/demo/two.html) | [types.ts:243](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L243) |
| <a id="removableoptions"></a> `removableOptions?` | [`DDRemoveOpt`](#ddremoveopt) | allows to override UI removable options. (default?: { accept: '.grid-stack-item' }) | [types.ts:246](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L246) |
| <a id="resizable-4"></a> `resizable?` | [`DDResizeOpt`](#ddresizeopt) | allows to override UI resizable options. (default?: { handles: 'se' }) | [types.ts:236](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L236) |
| <a id="row"></a> `row?` | `number` | fix grid number of rows. This is a shortcut of writing `minRow:N, maxRow:N`. (default `0` no constrain) | [types.ts:249](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L249) |
| <a id="rtl"></a> `rtl?` | `boolean` \| `"auto"` | if true turns grid to RTL. Possible values are true, false, 'auto' (default?: 'auto') See [example](http://gridstack.github.io/gridstack.js/demo/right-to-left(rtl).html) | [types.ts:255](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L255) |
| <a id="sizetocontent-1"></a> `sizeToContent?` | `boolean` | set to true if all grid items (by default, but item can also override) height should be based on content size instead of WidgetItem.h to avoid v-scrollbars. Note: this is still row based, not pixels, so it will use ceil(getBoundingClientRect().height / getCellHeight()) | [types.ts:260](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L260) |
| <a id="staticgrid"></a> `staticGrid?` | `boolean` | makes grid static (default?: false). If `true` widgets are not movable/resizable. You don't even need draggable/resizable. A CSS class 'grid-stack-static' is also added to the element. | [types.ts:267](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L267) |
| <a id="styleinhead"></a> ~~`styleInHead?`~~ | `boolean` | **Deprecated** Not used anymore, styles are now implemented with local CSS variables | [types.ts:272](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L272) |
| <a id="subgriddynamic"></a> `subGridDynamic?` | `boolean` | enable/disable the creation of sub-grids on the fly by dragging items completely over others (nest) vs partially (push). Forces `DDDragOpt.pause=true` to accomplish that. | [types.ts:279](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L279) |
| <a id="subgridopts-1"></a> `subGridOpts?` | [`GridStackOptions`](#gridstackoptions) | list of differences in options for automatically created sub-grids under us (inside our grid-items) | [types.ts:275](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L275) |

***

<a id="abstract-ddbaseimplement"></a>
### `abstract` DDBaseImplement

Defined in: [dd-base-impl.ts:7](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L7)

#### Extended by

- [`DDDraggable`](#dddraggable)
- [`DDDroppable`](#dddroppable)
- [`DDResizable`](#ddresizable-1)

#### Accessors

##### disabled

###### Get Signature

```ts
get disabled(): boolean;
```

Defined in: [dd-base-impl.ts:9](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L9)

returns the enable state, but you have to call enable()/disable() to change (as other things need to happen)

###### Returns

`boolean`

#### Constructors

##### Constructor

```ts
new DDBaseImplement(): DDBaseImplement;
```

###### Returns

[`DDBaseImplement`](#ddbaseimplement)

#### Methods

##### destroy()

```ts
destroy(): void;
```

Defined in: [dd-base-impl.ts:34](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L34)

###### Returns

`void`

##### disable()

```ts
disable(): void;
```

Defined in: [dd-base-impl.ts:30](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L30)

###### Returns

`void`

##### enable()

```ts
enable(): void;
```

Defined in: [dd-base-impl.ts:26](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L26)

###### Returns

`void`

##### off()

```ts
off(event): void;
```

Defined in: [dd-base-impl.ts:22](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` |

###### Returns

`void`

##### on()

```ts
on(event, callback): void;
```

Defined in: [dd-base-impl.ts:18](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L18)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` |
| `callback` | [`EventCallback`](#eventcallback) |

###### Returns

`void`

##### triggerEvent()

```ts
triggerEvent(eventName, event): boolean | void;
```

Defined in: [dd-base-impl.ts:38](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L38)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` |
| `event` | `Event` |

###### Returns

`boolean` \| `void`

***

<a id="dddraggable"></a>
### DDDraggable

Defined in: [dd-draggable.ts:34](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L34)

#### Extends

- [`DDBaseImplement`](#ddbaseimplement)

#### Implements

- [`HTMLElementExtendOpt`](#htmlelementextendopt)\<[`DDDragOpt`](#dddragopt)\>

#### Accessors

##### disabled

###### Get Signature

```ts
get disabled(): boolean;
```

Defined in: [dd-base-impl.ts:9](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L9)

returns the enable state, but you have to call enable()/disable() to change (as other things need to happen)

###### Returns

`boolean`

###### Inherited from

[`DDBaseImplement`](#ddbaseimplement).[`disabled`](#disabled)

#### Constructors

##### Constructor

```ts
new DDDraggable(el, option): DDDraggable;
```

Defined in: [dd-draggable.ts:65](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L65)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) |
| `option` | [`DDDragOpt`](#dddragopt) |

###### Returns

[`DDDraggable`](#dddraggable)

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`constructor`](#constructor)

#### Methods

##### destroy()

```ts
destroy(): void;
```

Defined in: [dd-draggable.ts:118](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L118)

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`destroy`](#destroy)

##### disable()

```ts
disable(forDestroy): void;
```

Defined in: [dd-draggable.ts:105](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L105)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `forDestroy` | `boolean` | `false` |

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`disable`](#disable)

##### enable()

```ts
enable(): void;
```

Defined in: [dd-draggable.ts:91](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L91)

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`enable`](#enable)

##### off()

```ts
off(event): void;
```

Defined in: [dd-draggable.ts:87](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L87)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `DDDragEvent` |

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`off`](#off)

##### on()

```ts
on(event, callback): void;
```

Defined in: [dd-draggable.ts:83](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L83)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `DDDragEvent` |
| `callback` | (`event`) => `void` |

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`on`](#on)

##### triggerEvent()

```ts
triggerEvent(eventName, event): boolean | void;
```

Defined in: [dd-base-impl.ts:38](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L38)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` |
| `event` | `Event` |

###### Returns

`boolean` \| `void`

###### Inherited from

[`DDBaseImplement`](#ddbaseimplement).[`triggerEvent`](#triggerevent)

##### updateOption()

```ts
updateOption(opts): DDDraggable;
```

Defined in: [dd-draggable.ts:129](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L129)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`DDDragOpt`](#dddragopt) |

###### Returns

[`DDDraggable`](#dddraggable)

###### Implementation of

[`HTMLElementExtendOpt`](#htmlelementextendopt).[`updateOption`](#updateoption-6)

#### Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="el"></a> `el` | `public` | [`GridItemHTMLElement`](#griditemhtmlelement) | `undefined` | [dd-draggable.ts:65](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L65) |
| <a id="helper"></a> `helper` | `public` | `HTMLElement` | `undefined` | [dd-draggable.ts:35](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L35) |
| <a id="option"></a> `option` | `public` | [`DDDragOpt`](#dddragopt) | `{}` | [dd-draggable.ts:65](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L65) |

***

<a id="dddroppable"></a>
### DDDroppable

Defined in: [dd-droppable.ts:23](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L23)

#### Extends

- [`DDBaseImplement`](#ddbaseimplement)

#### Implements

- [`HTMLElementExtendOpt`](#htmlelementextendopt)\<[`DDDroppableOpt`](#dddroppableopt)\>

#### Accessors

##### disabled

###### Get Signature

```ts
get disabled(): boolean;
```

Defined in: [dd-base-impl.ts:9](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L9)

returns the enable state, but you have to call enable()/disable() to change (as other things need to happen)

###### Returns

`boolean`

###### Inherited from

[`DDBaseImplement`](#ddbaseimplement).[`disabled`](#disabled)

#### Constructors

##### Constructor

```ts
new DDDroppable(el, option): DDDroppable;
```

Defined in: [dd-droppable.ts:27](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L27)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | `HTMLElement` |
| `option` | [`DDDroppableOpt`](#dddroppableopt) |

###### Returns

[`DDDroppable`](#dddroppable)

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`constructor`](#constructor)

#### Methods

##### destroy()

```ts
destroy(): void;
```

Defined in: [dd-droppable.ts:70](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L70)

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`destroy`](#destroy)

##### disable()

```ts
disable(forDestroy): void;
```

Defined in: [dd-droppable.ts:57](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L57)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `forDestroy` | `boolean` | `false` |

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`disable`](#disable)

##### drop()

```ts
drop(e): void;
```

Defined in: [dd-droppable.ts:139](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L139)

item is being dropped on us - called by the drag mouseup handler - this calls the client drop event

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | `MouseEvent` |

###### Returns

`void`

##### enable()

```ts
enable(): void;
```

Defined in: [dd-droppable.ts:44](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L44)

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`enable`](#enable)

##### off()

```ts
off(event): void;
```

Defined in: [dd-droppable.ts:40](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L40)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"drop"` \| `"dropover"` \| `"dropout"` |

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`off`](#off)

##### on()

```ts
on(event, callback): void;
```

Defined in: [dd-droppable.ts:36](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L36)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"drop"` \| `"dropover"` \| `"dropout"` |
| `callback` | (`event`) => `void` |

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`on`](#on)

##### triggerEvent()

```ts
triggerEvent(eventName, event): boolean | void;
```

Defined in: [dd-base-impl.ts:38](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L38)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` |
| `event` | `Event` |

###### Returns

`boolean` \| `void`

###### Inherited from

[`DDBaseImplement`](#ddbaseimplement).[`triggerEvent`](#triggerevent)

##### updateOption()

```ts
updateOption(opts): DDDroppable;
```

Defined in: [dd-droppable.ts:77](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L77)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`DDDroppableOpt`](#dddroppableopt) |

###### Returns

[`DDDroppable`](#dddroppable)

###### Implementation of

[`HTMLElementExtendOpt`](#htmlelementextendopt).[`updateOption`](#updateoption-6)

#### Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="accept-1"></a> `accept` | `public` | (`el`) => `boolean` | `undefined` | [dd-droppable.ts:25](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L25) |
| <a id="el-1"></a> `el` | `public` | `HTMLElement` | `undefined` | [dd-droppable.ts:27](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L27) |
| <a id="option-1"></a> `option` | `public` | [`DDDroppableOpt`](#dddroppableopt) | `{}` | [dd-droppable.ts:27](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L27) |

***

<a id="ddelement"></a>
### DDElement

Defined in: [dd-element.ts:15](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L15)

#### Constructors

##### Constructor

```ts
new DDElement(el): DDElement;
```

Defined in: [dd-element.ts:26](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L26)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | [`DDElementHost`](#ddelementhost) |

###### Returns

[`DDElement`](#ddelement)

#### Methods

##### cleanDraggable()

```ts
cleanDraggable(): DDElement;
```

Defined in: [dd-element.ts:59](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L59)

###### Returns

[`DDElement`](#ddelement)

##### cleanDroppable()

```ts
cleanDroppable(): DDElement;
```

Defined in: [dd-element.ts:93](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L93)

###### Returns

[`DDElement`](#ddelement)

##### cleanResizable()

```ts
cleanResizable(): DDElement;
```

Defined in: [dd-element.ts:76](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L76)

###### Returns

[`DDElement`](#ddelement)

##### init()

```ts
static init(el): DDElement;
```

Defined in: [dd-element.ts:17](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | [`DDElementHost`](#ddelementhost) |

###### Returns

[`DDElement`](#ddelement)

##### off()

```ts
off(eventName): DDElement;
```

Defined in: [dd-element.ts:39](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` |

###### Returns

[`DDElement`](#ddelement)

##### on()

```ts
on(eventName, callback): DDElement;
```

Defined in: [dd-element.ts:28](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L28)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` |
| `callback` | (`event`) => `void` |

###### Returns

[`DDElement`](#ddelement)

##### setupDraggable()

```ts
setupDraggable(opts): DDElement;
```

Defined in: [dd-element.ts:50](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L50)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`DDDragOpt`](#dddragopt) |

###### Returns

[`DDElement`](#ddelement)

##### setupDroppable()

```ts
setupDroppable(opts): DDElement;
```

Defined in: [dd-element.ts:84](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L84)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`DDDroppableOpt`](#dddroppableopt) |

###### Returns

[`DDElement`](#ddelement)

##### setupResizable()

```ts
setupResizable(opts): DDElement;
```

Defined in: [dd-element.ts:67](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L67)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`DDResizableOpt`](#ddresizableopt) |

###### Returns

[`DDElement`](#ddelement)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="dddraggable-1"></a> `ddDraggable?` | `public` | [`DDDraggable`](#dddraggable) | [dd-element.ts:22](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L22) |
| <a id="dddroppable-1"></a> `ddDroppable?` | `public` | [`DDDroppable`](#dddroppable) | [dd-element.ts:23](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L23) |
| <a id="ddresizable"></a> `ddResizable?` | `public` | [`DDResizable`](#ddresizable-1) | [dd-element.ts:24](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L24) |
| <a id="el-2"></a> `el` | `public` | [`DDElementHost`](#ddelementhost) | [dd-element.ts:26](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L26) |

***

<a id="ddgridstack"></a>
### DDGridStack

Defined in: [dd-gridstack.ts:33](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L33)

HTML Native Mouse and Touch Events Drag and Drop functionality.

#### Constructors

##### Constructor

```ts
new DDGridStack(): DDGridStack;
```

###### Returns

[`DDGridStack`](#ddgridstack)

#### Methods

##### draggable()

```ts
draggable(
   el, 
   opts, 
   key?, 
   value?): DDGridStack;
```

Defined in: [dd-gridstack.ts:70](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L70)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) |
| `opts` | `any` |
| `key?` | [`DDKey`](#ddkey) |
| `value?` | [`DDValue`](#ddvalue) |

###### Returns

[`DDGridStack`](#ddgridstack)

##### dragIn()

```ts
dragIn(el, opts): DDGridStack;
```

Defined in: [dd-gridstack.ts:94](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L94)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | [`GridStackElement`](#gridstackelement) |
| `opts` | [`DDDragOpt`](#dddragopt) |

###### Returns

[`DDGridStack`](#ddgridstack)

##### droppable()

```ts
droppable(
   el, 
   opts, 
   key?, 
   value?): DDGridStack;
```

Defined in: [dd-gridstack.ts:99](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L99)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) |
| `opts` | `any` |
| `key?` | [`DDKey`](#ddkey) |
| `value?` | [`DDValue`](#ddvalue) |

###### Returns

[`DDGridStack`](#ddgridstack)

##### isDraggable()

```ts
isDraggable(el): boolean;
```

Defined in: [dd-gridstack.ts:124](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L124)

true if element is draggable

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | [`DDElementHost`](#ddelementhost) |

###### Returns

`boolean`

##### isDroppable()

```ts
isDroppable(el): boolean;
```

Defined in: [dd-gridstack.ts:119](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L119)

true if element is droppable

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | [`DDElementHost`](#ddelementhost) |

###### Returns

`boolean`

##### isResizable()

```ts
isResizable(el): boolean;
```

Defined in: [dd-gridstack.ts:129](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L129)

true if element is draggable

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | [`DDElementHost`](#ddelementhost) |

###### Returns

`boolean`

##### off()

```ts
off(el, name): DDGridStack;
```

Defined in: [dd-gridstack.ts:145](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L145)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) |
| `name` | `string` |

###### Returns

[`DDGridStack`](#ddgridstack)

##### on()

```ts
on(
   el, 
   name, 
   callback): DDGridStack;
```

Defined in: [dd-gridstack.ts:133](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L133)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) |
| `name` | `string` |
| `callback` | [`DDCallback`](#ddcallback) |

###### Returns

[`DDGridStack`](#ddgridstack)

##### resizable()

```ts
resizable(
   el, 
   opts, 
   key?, 
   value?): DDGridStack;
```

Defined in: [dd-gridstack.ts:35](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L35)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) |
| `opts` | `any` |
| `key?` | [`DDKey`](#ddkey) |
| `value?` | [`DDValue`](#ddvalue) |

###### Returns

[`DDGridStack`](#ddgridstack)

***

<a id="ddmanager"></a>
### DDManager

Defined in: [dd-manager.ts:13](https://github.com/adumesny/gridstack.js/blob/master/src/dd-manager.ts#L13)

globals that are shared across Drag & Drop instances

#### Constructors

##### Constructor

```ts
new DDManager(): DDManager;
```

###### Returns

[`DDManager`](#ddmanager)

#### Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="dragelement"></a> `dragElement` | `static` | [`DDDraggable`](#dddraggable) | item being dragged | [dd-manager.ts:21](https://github.com/adumesny/gridstack.js/blob/master/src/dd-manager.ts#L21) |
| <a id="dropelement"></a> `dropElement` | `static` | [`DDDroppable`](#dddroppable) | item we are currently over as drop target | [dd-manager.ts:24](https://github.com/adumesny/gridstack.js/blob/master/src/dd-manager.ts#L24) |
| <a id="mousehandled"></a> `mouseHandled` | `static` | `boolean` | true if a mouse down event was handled | [dd-manager.ts:18](https://github.com/adumesny/gridstack.js/blob/master/src/dd-manager.ts#L18) |
| <a id="overresizeelement"></a> `overResizeElement` | `static` | [`DDResizable`](#ddresizable-1) | current item we're over for resizing purpose (ignore nested grid resize handles) | [dd-manager.ts:27](https://github.com/adumesny/gridstack.js/blob/master/src/dd-manager.ts#L27) |
| <a id="pausedrag"></a> `pauseDrag` | `static` | `number` \| `boolean` | if set (true | in msec), dragging placement (collision) will only happen after a pause by the user | [dd-manager.ts:15](https://github.com/adumesny/gridstack.js/blob/master/src/dd-manager.ts#L15) |

***

<a id="ddresizable-1"></a>
### DDResizable

Defined in: [dd-resizable.ts:34](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L34)

#### Extends

- [`DDBaseImplement`](#ddbaseimplement)

#### Implements

- [`HTMLElementExtendOpt`](#htmlelementextendopt)\<[`DDResizableOpt`](#ddresizableopt)\>

#### Accessors

##### disabled

###### Get Signature

```ts
get disabled(): boolean;
```

Defined in: [dd-base-impl.ts:9](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L9)

returns the enable state, but you have to call enable()/disable() to change (as other things need to happen)

###### Returns

`boolean`

###### Inherited from

[`DDBaseImplement`](#ddbaseimplement).[`disabled`](#disabled)

#### Constructors

##### Constructor

```ts
new DDResizable(el, option): DDResizable;
```

Defined in: [dd-resizable.ts:61](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L61)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) |
| `option` | [`DDResizableOpt`](#ddresizableopt) |

###### Returns

[`DDResizable`](#ddresizable-1)

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`constructor`](#constructor)

#### Methods

##### destroy()

```ts
destroy(): void;
```

Defined in: [dd-resizable.ts:91](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L91)

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`destroy`](#destroy)

##### disable()

```ts
disable(): void;
```

Defined in: [dd-resizable.ts:85](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L85)

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`disable`](#disable)

##### enable()

```ts
enable(): void;
```

Defined in: [dd-resizable.ts:79](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L79)

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`enable`](#enable)

##### off()

```ts
off(event): void;
```

Defined in: [dd-resizable.ts:75](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L75)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"resize"` \| `"resizestart"` \| `"resizestop"` |

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`off`](#off)

##### on()

```ts
on(event, callback): void;
```

Defined in: [dd-resizable.ts:71](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L71)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"resize"` \| `"resizestart"` \| `"resizestop"` |
| `callback` | (`event`) => `void` |

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`on`](#on)

##### triggerEvent()

```ts
triggerEvent(eventName, event): boolean | void;
```

Defined in: [dd-base-impl.ts:38](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L38)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` |
| `event` | `Event` |

###### Returns

`boolean` \| `void`

###### Inherited from

[`DDBaseImplement`](#ddbaseimplement).[`triggerEvent`](#triggerevent)

##### updateOption()

```ts
updateOption(opts): DDResizable;
```

Defined in: [dd-resizable.ts:98](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L98)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`DDResizableOpt`](#ddresizableopt) |

###### Returns

[`DDResizable`](#ddresizable-1)

###### Implementation of

[`HTMLElementExtendOpt`](#htmlelementextendopt).[`updateOption`](#updateoption-6)

#### Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="el-3"></a> `el` | `public` | [`GridItemHTMLElement`](#griditemhtmlelement) | `undefined` | [dd-resizable.ts:61](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L61) |
| <a id="option-2"></a> `option` | `public` | [`DDResizableOpt`](#ddresizableopt) | `{}` | [dd-resizable.ts:61](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L61) |

***

<a id="ddresizablehandle"></a>
### DDResizableHandle

Defined in: [dd-resizable-handle.ts:15](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L15)

#### Constructors

##### Constructor

```ts
new DDResizableHandle(
   host, 
   dir, 
   option): DDResizableHandle;
```

Defined in: [dd-resizable-handle.ts:25](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L25)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `host` | [`GridItemHTMLElement`](#griditemhtmlelement) |
| `dir` | `string` |
| `option` | [`DDResizableHandleOpt`](#ddresizablehandleopt) |

###### Returns

[`DDResizableHandle`](#ddresizablehandle)

#### Methods

##### destroy()

```ts
destroy(): DDResizableHandle;
```

Defined in: [dd-resizable-handle.ts:53](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L53)

call this when resize handle needs to be removed and cleaned up

###### Returns

[`DDResizableHandle`](#ddresizablehandle)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="dir"></a> `dir` | `protected` | `string` | [dd-resizable-handle.ts:25](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L25) |
| <a id="host"></a> `host` | `protected` | [`GridItemHTMLElement`](#griditemhtmlelement) | [dd-resizable-handle.ts:25](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L25) |
| <a id="option-3"></a> `option` | `protected` | [`DDResizableHandleOpt`](#ddresizablehandleopt) | [dd-resizable-handle.ts:25](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L25) |

***

<a id="breakpoint"></a>
### Breakpoint

Defined in: [types.ts:96](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L96)

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="c"></a> `c` | `number` | column count | [types.ts:100](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L100) |
| <a id="layout"></a> `layout?` | [`ColumnOptions`](#columnoptions) | re-layout mode if different from global one | [types.ts:102](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L102) |
| <a id="w"></a> `w?` | `number` | <= width for the breakpoint to trigger | [types.ts:98](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L98) |

***

<a id="cellposition"></a>
### CellPosition

Defined in: [gridstack.ts:56](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L56)

Defines the position of a cell inside the grid

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="x"></a> `x` | `number` | [gridstack.ts:57](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L57) |
| <a id="y"></a> `y` | `number` | [gridstack.ts:58](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L58) |

***

<a id="dddragopt"></a>
### DDDragOpt

Defined in: [types.ts:373](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L373)

Drag&Drop dragging options

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="appendto"></a> `appendTo?` | `string` | default to 'body' | [types.ts:377](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L377) |
| <a id="cancel"></a> `cancel?` | `string` | prevents dragging from starting on specified elements, listed as comma separated selectors (eg: '.no-drag'). default built in is 'input,textarea,button,select,option' | [types.ts:383](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L383) |
| <a id="drag"></a> `drag?` | (`event`, `ui`) => `void` | - | [types.ts:389](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L389) |
| <a id="handle"></a> `handle?` | `string` | class selector of items that can be dragged. default to '.grid-stack-item-content' | [types.ts:375](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L375) |
| <a id="helper-1"></a> `helper?` | `"clone"` \| (`el`) => `HTMLElement` | helper function when dropping: 'clone' or your own method | [types.ts:385](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L385) |
| <a id="pause"></a> `pause?` | `number` \| `boolean` | if set (true | msec), dragging placement (collision) will only happen after a pause by the user. Note: this is Global | [types.ts:379](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L379) |
| <a id="scroll"></a> `scroll?` | `boolean` | default to `true` | [types.ts:381](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L381) |
| <a id="start"></a> `start?` | (`event`, `ui`) => `void` | callbacks | [types.ts:387](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L387) |
| <a id="stop"></a> `stop?` | (`event`) => `void` | - | [types.ts:388](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L388) |

***

<a id="dddroppableopt"></a>
### DDDroppableOpt

Defined in: [dd-droppable.ts:14](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L14)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="accept-2"></a> `accept?` | `string` \| (`el`) => `boolean` | [dd-droppable.ts:15](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L15) |
| <a id="drop-2"></a> `drop?` | (`event`, `ui`) => `void` | [dd-droppable.ts:16](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L16) |
| <a id="out"></a> `out?` | (`event`, `ui`) => `void` | [dd-droppable.ts:18](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L18) |
| <a id="over"></a> `over?` | (`event`, `ui`) => `void` | [dd-droppable.ts:17](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L17) |

***

<a id="ddelementhost"></a>
### DDElementHost

Defined in: [dd-element.ts:11](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L11)

#### Extends

- [`GridItemHTMLElement`](#griditemhtmlelement)

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="ddelement-1"></a> `ddElement?` | [`DDElement`](#ddelement) | - | - | [dd-element.ts:12](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L12) |
| <a id="gridstacknode"></a> `gridstackNode?` | [`GridStackNode`](#gridstacknode-2) | pointer to grid node instance | [`GridItemHTMLElement`](#griditemhtmlelement).[`gridstackNode`](#gridstacknode-1) | [types.ts:57](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L57) |

***

<a id="ddremoveopt"></a>
### DDRemoveOpt

Defined in: [types.ts:365](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L365)

Drag&Drop remove options

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="accept-3"></a> `accept?` | `string` | class that can be removed (default?: opts.itemClass) | [types.ts:367](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L367) |
| <a id="decline"></a> `decline?` | `string` | class that cannot be removed (default: 'grid-stack-non-removable') | [types.ts:369](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L369) |

***

<a id="ddresizablehandleopt"></a>
### DDResizableHandleOpt

Defined in: [dd-resizable-handle.ts:9](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L9)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="move"></a> `move?` | (`event`) => `void` | [dd-resizable-handle.ts:11](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L11) |
| <a id="start-1"></a> `start?` | (`event`) => `void` | [dd-resizable-handle.ts:10](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L10) |
| <a id="stop-1"></a> `stop?` | (`event`) => `void` | [dd-resizable-handle.ts:12](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L12) |

***

<a id="ddresizableopt"></a>
### DDResizableOpt

Defined in: [dd-resizable.ts:15](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L15)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="autohide"></a> `autoHide?` | `boolean` | [dd-resizable.ts:16](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L16) |
| <a id="handles"></a> `handles?` | `string` | [dd-resizable.ts:17](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L17) |
| <a id="maxheight"></a> `maxHeight?` | `number` | [dd-resizable.ts:18](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L18) |
| <a id="maxheightmoveup"></a> `maxHeightMoveUp?` | `number` | [dd-resizable.ts:19](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L19) |
| <a id="maxwidth"></a> `maxWidth?` | `number` | [dd-resizable.ts:20](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L20) |
| <a id="maxwidthmoveleft"></a> `maxWidthMoveLeft?` | `number` | [dd-resizable.ts:21](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L21) |
| <a id="minheight"></a> `minHeight?` | `number` | [dd-resizable.ts:22](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L22) |
| <a id="minwidth"></a> `minWidth?` | `number` | [dd-resizable.ts:23](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L23) |
| <a id="resize"></a> `resize?` | (`event`, `ui`) => `void` | [dd-resizable.ts:26](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L26) |
| <a id="start-2"></a> `start?` | (`event`, `ui`) => `void` | [dd-resizable.ts:24](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L24) |
| <a id="stop-2"></a> `stop?` | (`event`) => `void` | [dd-resizable.ts:25](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L25) |

***

<a id="ddresizeopt"></a>
### DDResizeOpt

Defined in: [types.ts:354](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L354)

Drag&Drop resize options

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="autohide-1"></a> `autoHide?` | `boolean` | do resize handle hide by default until mouse over ? - default: true on desktop, false on mobile | [types.ts:356](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L356) |
| <a id="handles-1"></a> `handles?` | `string` | sides where you can resize from (ex: 'e, se, s, sw, w') - default 'se' (south-east) Note: it is not recommended to resize from the top sides as weird side effect may occur. | [types.ts:361](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L361) |

***

<a id="dduidata"></a>
### DDUIData

Defined in: [types.ts:402](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L402)

data that is passed during drag and resizing callbacks

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="draggable-2"></a> `draggable?` | `HTMLElement` | [types.ts:405](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L405) |
| <a id="position"></a> `position?` | [`Position`](#position-1) | [types.ts:403](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L403) |
| <a id="size"></a> `size?` | [`Size`](#size-1) | [types.ts:404](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L404) |

***

<a id="dragtransform"></a>
### DragTransform

Defined in: [utils.ts:13](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L13)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="xoffset"></a> `xOffset` | `number` | [utils.ts:16](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L16) |
| <a id="xscale"></a> `xScale` | `number` | [utils.ts:14](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L14) |
| <a id="yoffset"></a> `yOffset` | `number` | [utils.ts:17](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L17) |
| <a id="yscale"></a> `yScale` | `number` | [utils.ts:15](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L15) |

***

<a id="gridhtmlelement"></a>
### GridHTMLElement

Defined in: [gridstack.ts:42](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L42)

#### Extends

- `HTMLElement`

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="gridstack"></a> `gridstack?` | [`GridStack`](#gridstack-1) | [gridstack.ts:43](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L43) |

***

<a id="griditemhtmlelement"></a>
### GridItemHTMLElement

Defined in: [types.ts:55](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L55)

#### Extends

- `HTMLElement`

#### Extended by

- [`DDElementHost`](#ddelementhost)

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="gridstacknode-1"></a> `gridstackNode?` | [`GridStackNode`](#gridstacknode-2) | pointer to grid node instance | [types.ts:57](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L57) |

***

<a id="gridstackengineoptions"></a>
### GridStackEngineOptions

Defined in: [gridstack-engine.ts:13](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L13)

options used during creation - similar to GridStackOptions

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="column-3"></a> `column?` | `number` | [gridstack-engine.ts:14](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L14) |
| <a id="float-3"></a> `float?` | `boolean` | [gridstack-engine.ts:16](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L16) |
| <a id="maxrow-1"></a> `maxRow?` | `number` | [gridstack-engine.ts:15](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L15) |
| <a id="nodes-1"></a> `nodes?` | [`GridStackNode`](#gridstacknode-2)[] | [gridstack-engine.ts:17](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L17) |
| <a id="onchange"></a> `onChange?` | `OnChangeCB` | [gridstack-engine.ts:18](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L18) |

***

<a id="gridstackmoveopts"></a>
### GridStackMoveOpts

Defined in: [types.ts:283](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L283)

options used during GridStackEngine.moveNode()

#### Extends

- [`GridStackPosition`](#gridstackposition)

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cellheight-2"></a> `cellHeight?` | `number` | - | - | [types.ts:292](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L292) |
| <a id="cellwidth-2"></a> `cellWidth?` | `number` | vars to calculate other cells coordinates | - | [types.ts:291](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L291) |
| <a id="collide-2"></a> `collide?` | [`GridStackNode`](#gridstacknode-2) | best node (most coverage) we collied with | - | [types.ts:302](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L302) |
| <a id="forcecollide"></a> `forceCollide?` | `boolean` | for collision check even if we don't move | - | [types.ts:304](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L304) |
| <a id="h"></a> `h?` | `number` | widget dimension height (default?: 1) | [`GridStackPosition`](#gridstackposition).[`h`](#h-2) | [types.ts:315](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L315) |
| <a id="marginbottom"></a> `marginBottom?` | `number` | - | - | [types.ts:294](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L294) |
| <a id="marginleft"></a> `marginLeft?` | `number` | - | - | [types.ts:295](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L295) |
| <a id="marginright"></a> `marginRight?` | `number` | - | - | [types.ts:296](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L296) |
| <a id="margintop"></a> `marginTop?` | `number` | - | - | [types.ts:293](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L293) |
| <a id="nested"></a> `nested?` | `boolean` | true if we are calling this recursively to prevent simple swap or coverage collision - default false | - | [types.ts:289](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L289) |
| <a id="pack"></a> `pack?` | `boolean` | do we pack (default true) | - | [types.ts:287](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L287) |
| <a id="rect"></a> `rect?` | [`GridStackPosition`](#gridstackposition) | position in pixels of the currently dragged items (for overlap check) | - | [types.ts:298](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L298) |
| <a id="resizing"></a> `resizing?` | `boolean` | true if we're live resizing | - | [types.ts:300](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L300) |
| <a id="skip"></a> `skip?` | [`GridStackNode`](#gridstacknode-2) | node to skip collision | - | [types.ts:285](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L285) |
| <a id="w-1"></a> `w?` | `number` | widget dimension width (default?: 1) | [`GridStackPosition`](#gridstackposition).[`w`](#w-3) | [types.ts:313](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L313) |
| <a id="x-1"></a> `x?` | `number` | widget position x (default?: 0) | [`GridStackPosition`](#gridstackposition).[`x`](#x-3) | [types.ts:309](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L309) |
| <a id="y-1"></a> `y?` | `number` | widget position y (default?: 0) | [`GridStackPosition`](#gridstackposition).[`y`](#y-3) | [types.ts:311](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L311) |

***

<a id="gridstacknode-2"></a>
### GridStackNode

Defined in: [types.ts:419](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L419)

internal runtime descriptions describing the widgets in the grid

#### Extends

- [`GridStackWidget`](#gridstackwidget)

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="autoposition"></a> `autoPosition?` | `boolean` | if true then x, y parameters will be ignored and widget will be places on the first available position (default?: false) | [`GridStackWidget`](#gridstackwidget).[`autoPosition`](#autoposition-1) | [types.ts:323](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L323) |
| <a id="content"></a> `content?` | `string` | html to append inside as content | [`GridStackWidget`](#gridstackwidget).[`content`](#content-1) | [types.ts:341](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L341) |
| <a id="el-5"></a> `el?` | [`GridItemHTMLElement`](#griditemhtmlelement) | pointer back to HTML element | - | [types.ts:421](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L421) |
| <a id="grid"></a> `grid?` | [`GridStack`](#gridstack-1) | pointer back to parent Grid instance | - | [types.ts:423](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L423) |
| <a id="h-1"></a> `h?` | `number` | widget dimension height (default?: 1) | [`GridStackWidget`](#gridstackwidget).[`h`](#h-3) | [types.ts:315](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L315) |
| <a id="id"></a> `id?` | `string` | value for `gs-id` stored on the widget (default?: undefined) | [`GridStackWidget`](#gridstackwidget).[`id`](#id-1) | [types.ts:339](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L339) |
| <a id="lazyload"></a> `lazyLoad?` | `boolean` | true when widgets are only created when they scroll into view (visible) | [`GridStackWidget`](#gridstackwidget).[`lazyLoad`](#lazyload-2) | [types.ts:343](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L343) |
| <a id="locked"></a> `locked?` | `boolean` | prevents being pushed by other widgets or api (default?: undefined = un-constrained), which is different from `noMove` (user action only) | [`GridStackWidget`](#gridstackwidget).[`locked`](#locked-1) | [types.ts:337](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L337) |
| <a id="maxh"></a> `maxH?` | `number` | maximum height allowed during resize/creation (default?: undefined = un-constrained) | [`GridStackWidget`](#gridstackwidget).[`maxH`](#maxh-1) | [types.ts:331](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L331) |
| <a id="maxw"></a> `maxW?` | `number` | maximum width allowed during resize/creation (default?: undefined = un-constrained) | [`GridStackWidget`](#gridstackwidget).[`maxW`](#maxw-1) | [types.ts:327](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L327) |
| <a id="minh"></a> `minH?` | `number` | minimum height allowed during resize/creation (default?: undefined = un-constrained) | [`GridStackWidget`](#gridstackwidget).[`minH`](#minh-1) | [types.ts:329](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L329) |
| <a id="minw"></a> `minW?` | `number` | minimum width allowed during resize/creation (default?: undefined = un-constrained) | [`GridStackWidget`](#gridstackwidget).[`minW`](#minw-1) | [types.ts:325](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L325) |
| <a id="nomove"></a> `noMove?` | `boolean` | prevents direct moving by the user (default?: undefined = un-constrained) | [`GridStackWidget`](#gridstackwidget).[`noMove`](#nomove-1) | [types.ts:335](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L335) |
| <a id="noresize"></a> `noResize?` | `boolean` | prevent direct resizing by the user (default?: undefined = un-constrained) | [`GridStackWidget`](#gridstackwidget).[`noResize`](#noresize-1) | [types.ts:333](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L333) |
| <a id="resizetocontentparent-1"></a> `resizeToContentParent?` | `string` | local override of GridStack.resizeToContentParent that specify the class to use for the parent (actual) vs child (wanted) height | [`GridStackWidget`](#gridstackwidget).[`resizeToContentParent`](#resizetocontentparent-2) | [types.ts:348](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L348) |
| <a id="sizetocontent"></a> `sizeToContent?` | `number` \| `boolean` | local (vs grid) override - see GridStackOptions. Note: This also allow you to set a maximum h value (but user changeable during normal resizing) to prevent unlimited content from taking too much space (get scrollbar) | [`GridStackWidget`](#gridstackwidget).[`sizeToContent`](#sizetocontent-2) | [types.ts:346](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L346) |
| <a id="subgrid"></a> `subGrid?` | [`GridStack`](#gridstack-1) | actual sub-grid instance | - | [types.ts:425](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L425) |
| <a id="subgridopts"></a> `subGridOpts?` | [`GridStackOptions`](#gridstackoptions) | optional nested grid options and list of children, which then turns into actual instance at runtime to get options from | [`GridStackWidget`](#gridstackwidget).[`subGridOpts`](#subgridopts-2) | [types.ts:350](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L350) |
| <a id="visibleobservable"></a> `visibleObservable?` | `IntersectionObserver` | allow delay creation when visible | - | [types.ts:427](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L427) |
| <a id="w-2"></a> `w?` | `number` | widget dimension width (default?: 1) | [`GridStackWidget`](#gridstackwidget).[`w`](#w-4) | [types.ts:313](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L313) |
| <a id="x-2"></a> `x?` | `number` | widget position x (default?: 0) | [`GridStackWidget`](#gridstackwidget).[`x`](#x-4) | [types.ts:309](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L309) |
| <a id="y-2"></a> `y?` | `number` | widget position y (default?: 0) | [`GridStackWidget`](#gridstackwidget).[`y`](#y-4) | [types.ts:311](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L311) |

***

<a id="gridstackposition"></a>
### GridStackPosition

Defined in: [types.ts:307](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L307)

#### Extended by

- [`GridStackMoveOpts`](#gridstackmoveopts)
- [`GridStackWidget`](#gridstackwidget)

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="h-2"></a> `h?` | `number` | widget dimension height (default?: 1) | [types.ts:315](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L315) |
| <a id="w-3"></a> `w?` | `number` | widget dimension width (default?: 1) | [types.ts:313](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L313) |
| <a id="x-3"></a> `x?` | `number` | widget position x (default?: 0) | [types.ts:309](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L309) |
| <a id="y-3"></a> `y?` | `number` | widget position y (default?: 0) | [types.ts:311](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L311) |

***

<a id="gridstackwidget"></a>
### GridStackWidget

Defined in: [types.ts:321](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L321)

GridStack Widget creation options

#### Extends

- [`GridStackPosition`](#gridstackposition)

#### Extended by

- [`GridStackNode`](#gridstacknode-2)

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="autoposition-1"></a> `autoPosition?` | `boolean` | if true then x, y parameters will be ignored and widget will be places on the first available position (default?: false) | - | [types.ts:323](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L323) |
| <a id="content-1"></a> `content?` | `string` | html to append inside as content | - | [types.ts:341](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L341) |
| <a id="h-3"></a> `h?` | `number` | widget dimension height (default?: 1) | [`GridStackPosition`](#gridstackposition).[`h`](#h-2) | [types.ts:315](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L315) |
| <a id="id-1"></a> `id?` | `string` | value for `gs-id` stored on the widget (default?: undefined) | - | [types.ts:339](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L339) |
| <a id="lazyload-2"></a> `lazyLoad?` | `boolean` | true when widgets are only created when they scroll into view (visible) | - | [types.ts:343](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L343) |
| <a id="locked-1"></a> `locked?` | `boolean` | prevents being pushed by other widgets or api (default?: undefined = un-constrained), which is different from `noMove` (user action only) | - | [types.ts:337](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L337) |
| <a id="maxh-1"></a> `maxH?` | `number` | maximum height allowed during resize/creation (default?: undefined = un-constrained) | - | [types.ts:331](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L331) |
| <a id="maxw-1"></a> `maxW?` | `number` | maximum width allowed during resize/creation (default?: undefined = un-constrained) | - | [types.ts:327](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L327) |
| <a id="minh-1"></a> `minH?` | `number` | minimum height allowed during resize/creation (default?: undefined = un-constrained) | - | [types.ts:329](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L329) |
| <a id="minw-1"></a> `minW?` | `number` | minimum width allowed during resize/creation (default?: undefined = un-constrained) | - | [types.ts:325](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L325) |
| <a id="nomove-1"></a> `noMove?` | `boolean` | prevents direct moving by the user (default?: undefined = un-constrained) | - | [types.ts:335](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L335) |
| <a id="noresize-1"></a> `noResize?` | `boolean` | prevent direct resizing by the user (default?: undefined = un-constrained) | - | [types.ts:333](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L333) |
| <a id="resizetocontentparent-2"></a> `resizeToContentParent?` | `string` | local override of GridStack.resizeToContentParent that specify the class to use for the parent (actual) vs child (wanted) height | - | [types.ts:348](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L348) |
| <a id="sizetocontent-2"></a> `sizeToContent?` | `number` \| `boolean` | local (vs grid) override - see GridStackOptions. Note: This also allow you to set a maximum h value (but user changeable during normal resizing) to prevent unlimited content from taking too much space (get scrollbar) | - | [types.ts:346](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L346) |
| <a id="subgridopts-2"></a> `subGridOpts?` | [`GridStackOptions`](#gridstackoptions) | optional nested grid options and list of children, which then turns into actual instance at runtime to get options from | - | [types.ts:350](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L350) |
| <a id="w-4"></a> `w?` | `number` | widget dimension width (default?: 1) | [`GridStackPosition`](#gridstackposition).[`w`](#w-3) | [types.ts:313](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L313) |
| <a id="x-4"></a> `x?` | `number` | widget position x (default?: 0) | [`GridStackPosition`](#gridstackposition).[`x`](#x-3) | [types.ts:309](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L309) |
| <a id="y-4"></a> `y?` | `number` | widget position y (default?: 0) | [`GridStackPosition`](#gridstackposition).[`y`](#y-3) | [types.ts:311](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L311) |

***

<a id="heightdata"></a>
### HeightData

Defined in: [utils.ts:8](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L8)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="h-4"></a> `h` | `number` | [utils.ts:9](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L9) |
| <a id="unit"></a> `unit` | `string` | [utils.ts:10](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L10) |

***

<a id="htmlelementextendoptt"></a>
### HTMLElementExtendOpt\<T\>

Defined in: [dd-base-impl.ts:44](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L44)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Methods

##### updateOption()

```ts
updateOption(T): DDBaseImplement;
```

Defined in: [dd-base-impl.ts:47](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L47)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `T` | `any` |

###### Returns

[`DDBaseImplement`](#ddbaseimplement)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="el-6"></a> `el` | `HTMLElement` | [dd-base-impl.ts:45](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L45) |
| <a id="option-4"></a> `option` | `T` | [dd-base-impl.ts:46](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L46) |

***

<a id="mouseposition"></a>
### MousePosition

Defined in: [gridstack.ts:50](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L50)

Defines the coordinates of an object

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="left"></a> `left` | `number` | [gridstack.ts:52](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L52) |
| <a id="top"></a> `top` | `number` | [gridstack.ts:51](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L51) |

***

<a id="position-1"></a>
### Position

Defined in: [types.ts:395](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L395)

#### Extended by

- [`Rect`](#rect-1)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="left-1"></a> `left` | `number` | [types.ts:397](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L397) |
| <a id="top-1"></a> `top` | `number` | [types.ts:396](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L396) |

***

<a id="rect-1"></a>
### Rect

Defined in: [types.ts:399](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L399)

#### Extends

- [`Size`](#size-1).[`Position`](#position-1)

#### Properties

| Property | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="height"></a> `height` | `number` | [`Size`](#size-1).[`height`](#height-1) | [types.ts:393](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L393) |
| <a id="left-2"></a> `left` | `number` | [`Position`](#position-1).[`left`](#left-1) | [types.ts:397](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L397) |
| <a id="top-2"></a> `top` | `number` | [`Position`](#position-1).[`top`](#top-1) | [types.ts:396](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L396) |
| <a id="width"></a> `width` | `number` | [`Size`](#size-1).[`width`](#width-1) | [types.ts:392](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L392) |

***

<a id="responsive"></a>
### Responsive

Defined in: [types.ts:83](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L83)

describes the responsive nature of the grid. NOTE: make sure to have correct extra CSS to support this.

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="breakpointforwindow"></a> `breakpointForWindow?` | `boolean` | specify if breakpoints are for window size or grid size (default:false = grid) | [types.ts:91](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L91) |
| <a id="breakpoints"></a> `breakpoints?` | [`Breakpoint`](#breakpoint)[] | explicit width:column breakpoints instead of automatic 'columnWidth'. NOTE: make sure to have correct extra CSS to support this. | [types.ts:89](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L89) |
| <a id="columnmax"></a> `columnMax?` | `number` | maximum number of columns allowed (default: 12). NOTE: make sure to have correct extra CSS to support this. | [types.ts:87](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L87) |
| <a id="columnwidth"></a> `columnWidth?` | `number` | wanted width to maintain (+-50%) to dynamically pick a column count. NOTE: make sure to have correct extra CSS to support this. | [types.ts:85](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L85) |
| <a id="layout-2"></a> `layout?` | [`ColumnOptions`](#columnoptions) | global re-layout mode when changing columns | [types.ts:93](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L93) |

***

<a id="size-1"></a>
### Size

Defined in: [types.ts:391](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L391)

#### Extended by

- [`Rect`](#rect-1)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="height-1"></a> `height` | `number` | [types.ts:393](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L393) |
| <a id="width-1"></a> `width` | `number` | [types.ts:392](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L392) |

## Variables

<a id="griddefaults"></a>
### gridDefaults

```ts
const gridDefaults: GridStackOptions;
```

Defined in: [types.ts:10](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L10)

## Type Aliases

<a id="addremovefcn"></a>
### AddRemoveFcn()

```ts
type AddRemoveFcn = (parent, w, add, grid) => HTMLElement | undefined;
```

Defined in: [types.ts:72](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L72)

optional function called during load() to callback the user on new added/remove grid items | grids

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `parent` | `HTMLElement` |
| `w` | [`GridStackWidget`](#gridstackwidget) |
| `add` | `boolean` |
| `grid` | `boolean` |

#### Returns

`HTMLElement` \| `undefined`

***

<a id="columnoptions"></a>
### ColumnOptions

```ts
type ColumnOptions = 
  | "list"
  | "compact"
  | "moveScale"
  | "move"
  | "scale"
  | "none"
  | (column, oldColumn, nodes, oldNodes) => void;
```

Defined in: [types.ts:51](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L51)

different layout options when changing # of columns, including a custom function that takes new/old column count, and array of new/old positions
Note: new list may be partially already filled if we have a cache of the layout at that size and new items were added later.
Options are:
'list' - treat items as sorted list, keeping items (un-sized unless too big for column count) sequentially reflowing them
'compact' - similar to list, but using compact() method which will possibly re-order items if an empty slots are available due to a larger item needing to be pushed to next row
'moveScale' - will scale and move items by the ratio new newColumnCount / oldColumnCount
'move' | 'scale' - will only size or move items
'none' will leave items unchanged, unless they don't fit in column count

***

<a id="compactoptions"></a>
### CompactOptions

```ts
type CompactOptions = "list" | "compact";
```

Defined in: [types.ts:53](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L53)

***

<a id="ddcallback"></a>
### DDCallback()

```ts
type DDCallback = (event, arg2, helper?) => void;
```

Defined in: [dd-gridstack.ts:26](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L26)

drag&drop events callbacks

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `Event` |
| `arg2` | [`GridItemHTMLElement`](#griditemhtmlelement) |
| `helper?` | [`GridItemHTMLElement`](#griditemhtmlelement) |

#### Returns

`void`

***

<a id="dddropopt"></a>
### DDDropOpt

```ts
type DDDropOpt = object;
```

Defined in: [dd-gridstack.ts:14](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L14)

Drag&Drop drop options

#### Properties

##### accept()?

```ts
optional accept: (el) => boolean;
```

Defined in: [dd-gridstack.ts:16](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L16)

function or class type that this grid will accept as dropped items (see GridStackOptions.acceptWidgets)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) |

###### Returns

`boolean`

***

<a id="ddkey"></a>
### DDKey

```ts
type DDKey = 
  | "minWidth"
  | "minHeight"
  | "maxWidth"
  | "maxHeight"
  | "maxHeightMoveUp"
  | "maxWidthMoveLeft";
```

Defined in: [dd-gridstack.ts:22](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L22)

***

<a id="ddopts"></a>
### DDOpts

```ts
type DDOpts = "enable" | "disable" | "destroy" | "option" | string | any;
```

Defined in: [dd-gridstack.ts:21](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L21)

drag&drop options currently called from the main code, but others can be passed in grid options

***

<a id="ddvalue"></a>
### DDValue

```ts
type DDValue = number | string;
```

Defined in: [dd-gridstack.ts:23](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L23)

***

<a id="eventcallback"></a>
### EventCallback()

```ts
type EventCallback = (event) => boolean | void;
```

Defined in: [dd-base-impl.ts:6](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L6)

dd-base-impl.ts 12.2.2-dev
Copyright (c) 2021-2024  Alain Dumesny - see GridStack root license

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `Event` |

#### Returns

`boolean` \| `void`

***

<a id="gridstackdroppedhandler"></a>
### GridStackDroppedHandler()

```ts
type GridStackDroppedHandler = (event, previousNode, newNode) => void;
```

Defined in: [types.ts:68](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L68)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `Event` |
| `previousNode` | [`GridStackNode`](#gridstacknode-2) |
| `newNode` | [`GridStackNode`](#gridstacknode-2) |

#### Returns

`void`

***

<a id="gridstackelement"></a>
### GridStackElement

```ts
type GridStackElement = string | HTMLElement | GridItemHTMLElement;
```

Defined in: [types.ts:62](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L62)

***

<a id="gridstackelementhandler"></a>
### GridStackElementHandler()

```ts
type GridStackElementHandler = (event, el) => void;
```

Defined in: [types.ts:66](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L66)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `Event` |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) |

#### Returns

`void`

***

<a id="gridstackevent"></a>
### GridStackEvent

```ts
type GridStackEvent = 
  | "added"
  | "change"
  | "disable"
  | "drag"
  | "dragstart"
  | "dragstop"
  | "dropped"
  | "enable"
  | "removed"
  | "resize"
  | "resizestart"
  | "resizestop"
  | "resizecontent";
```

Defined in: [gridstack.ts:46](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L46)

list of possible events, or space separated list of them

***

<a id="gridstackeventhandler"></a>
### GridStackEventHandler()

```ts
type GridStackEventHandler = (event) => void;
```

Defined in: [types.ts:65](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L65)

specific and general event handlers for the .on() method

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `Event` |

#### Returns

`void`

***

<a id="gridstackeventhandlercallback"></a>
### GridStackEventHandlerCallback

```ts
type GridStackEventHandlerCallback = 
  | GridStackEventHandler
  | GridStackElementHandler
  | GridStackNodesHandler
  | GridStackDroppedHandler;
```

Defined in: [types.ts:69](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L69)

***

<a id="gridstacknodeshandler"></a>
### GridStackNodesHandler()

```ts
type GridStackNodesHandler = (event, nodes) => void;
```

Defined in: [types.ts:67](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L67)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `Event` |
| `nodes` | [`GridStackNode`](#gridstacknode-2)[] |

#### Returns

`void`

***

<a id="numberorstring"></a>
### numberOrString

```ts
type numberOrString = number | string;
```

Defined in: [types.ts:54](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L54)

***

<a id="renderfcn"></a>
### RenderFcn()

```ts
type RenderFcn = (el, w) => void;
```

Defined in: [types.ts:78](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L78)

optional function called during load()/addWidget() to let the caller create custom content other than plan text

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | `HTMLElement` |
| `w` | [`GridStackWidget`](#gridstackwidget) |

#### Returns

`void`

***

<a id="resizetocontentfcn"></a>
### ResizeToContentFcn()

```ts
type ResizeToContentFcn = (el) => void;
```

Defined in: [types.ts:80](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L80)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) |

#### Returns

`void`

***

<a id="savefcn"></a>
### SaveFcn()

```ts
type SaveFcn = (node, w) => void;
```

Defined in: [types.ts:75](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L75)

optional function called during save() to let the caller add additional custom data to the GridStackWidget structure that will get returned

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) |
| `w` | [`GridStackWidget`](#gridstackwidget) |

#### Returns

`void`
