# gridstack v12.4.2

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

Defined in: [gridstack.ts:266](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L266)

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

Defined in: [gridstack.ts:2085](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2085)

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

Defined in: [gridstack.ts:955](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L955)

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

Defined in: [gridstack.ts:432](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L432)

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

Defined in: [gridstack.ts:833](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L833)

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

Defined in: [gridstack.ts:904](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L904)

Update current cell height - see `GridStackOptions.cellHeight` for format by updating eh Browser CSS variable.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `val?` | [`numberOrString`](#numberorstring) | the cell height. Options: - `undefined`: cells content will be made square (match width minus margin) - `0`: the CSS will be generated by the application instead - number: height in pixels - string: height with units (e.g., '70px', '5rem', '2em') |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
grid.cellHeight(100);     // 100px height
grid.cellHeight('70px');  // explicit pixel height
grid.cellHeight('5rem');  // relative to root font size
grid.cellHeight(grid.cellWidth() * 1.2); // aspect ratio
grid.cellHeight('auto');  // auto-size based on content
```

##### cellWidth()

```ts
cellWidth(): number;
```

Defined in: [gridstack.ts:950](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L950)

Gets the current cell width in pixels. This is calculated based on the grid container width divided by the number of columns.

###### Returns

`number`

the cell width in pixels

###### Example

```ts
const width = grid.cellWidth();
console.log('Cell width:', width, 'px');

// Use cell width to calculate widget dimensions
const widgetWidth = width * 3; // For a 3-column wide widget
```

##### checkDynamicColumn()

```ts
protected checkDynamicColumn(): boolean;
```

Defined in: [gridstack.ts:962](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L962)

checks for dynamic column count for our current size, returning true if changed

###### Returns

`boolean`

##### column()

```ts
column(column, layout): GridStack;
```

Defined in: [gridstack.ts:1041](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1041)

Set the number of columns in the grid. Will update existing widgets to conform to new number of columns,
as well as cache the original layout so you can revert back to previous positions without loss.

Requires `gridstack-extra.css` or `gridstack-extra.min.css` for [2-11] columns,
else you will need to generate correct CSS.
See: https://github.com/gridstack/gridstack.js#change-grid-columns

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `column` | `number` | `undefined` | Integer > 0 (default 12) |
| `layout` | [`ColumnOptions`](#columnoptions) | `'moveScale'` | specify the type of re-layout that will happen. Options: - 'moveScale' (default): scale widget positions and sizes - 'move': keep widget sizes, only move positions - 'scale': keep widget positions, only scale sizes - 'none': don't change widget positions or sizes Note: items will never be outside of the current column boundaries. Ignored for `column=1` as we always want to vertically stack. |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Change to 6 columns with default scaling
grid.column(6);

// Change to 4 columns, only move positions
grid.column(4, 'move');

// Single column layout (vertical stack)
grid.column(1);
```

##### compact()

```ts
compact(layout, doSort): GridStack;
```

Defined in: [gridstack.ts:1007](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1007)

Re-layout grid items to reclaim any empty space. This is useful after removing widgets
or when you want to optimize the layout.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `layout` | [`CompactOptions`](#compactoptions) | `'compact'` | layout type. Options: - 'compact' (default): might re-order items to fill any empty space - 'list': keep the widget left->right order the same, even if that means leaving an empty slot if things don't fit |
| `doSort` | `boolean` | `true` | re-sort items first based on x,y position. Set to false to do your own sorting ahead (default: true) |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Compact layout after removing widgets
grid.removeWidget('.widget-to-remove');
grid.compact();

// Use list layout (preserve order)
grid.compact('list');

// Compact without sorting first
grid.compact('compact', false);
```

##### createWidgetDivs()

```ts
createWidgetDivs(n): HTMLElement;
```

Defined in: [gridstack.ts:478](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L478)

Create the default grid item divs and content (possibly lazy loaded) by using GridStack.renderCB().

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n` | [`GridStackNode`](#gridstacknode-2) | GridStackNode definition containing widget configuration |

###### Returns

`HTMLElement`

the created HTML element with proper grid item structure

###### Example

```ts
const element = grid.createWidgetDivs({ w: 2, h: 1, content: 'Hello World' });
```

##### destroy()

```ts
destroy(removeDOM): GridStack;
```

Defined in: [gridstack.ts:1115](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1115)

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

Defined in: [gridstack.ts:2286](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2286)

Temporarily disables widgets moving/resizing.
If you want a more permanent way (which freezes up resources) use `setStatic(true)` instead.

Note: This is a no-op for static grids.

This is a shortcut for:
```typescript
grid.enableMove(false);
grid.enableResize(false);
```

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `recurse` | `boolean` | `true` | if true (default), sub-grids also get updated |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Disable all interactions
grid.disable();

// Disable only this grid, not sub-grids
grid.disable(false);
```

##### enable()

```ts
enable(recurse): GridStack;
```

Defined in: [gridstack.ts:2313](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2313)

Re-enables widgets moving/resizing - see disable().
Note: This is a no-op for static grids.

This is a shortcut for:
```typescript
grid.enableMove(true);
grid.enableResize(true);
```

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `recurse` | `boolean` | `true` | if true (default), sub-grids also get updated |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Re-enable all interactions
grid.enable();

// Enable only this grid, not sub-grids
grid.enable(false);
```

##### enableMove()

```ts
enableMove(doEnable, recurse): GridStack;
```

Defined in: [gridstack.ts:2339](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2339)

Enables/disables widget moving for all widgets. No-op for static grids.
Note: locally defined items (with noMove property) still override this setting.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `doEnable` | `boolean` | `undefined` | if true widgets will be movable, if false moving is disabled |
| `recurse` | `boolean` | `true` | if true (default), sub-grids also get updated |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Enable moving for all widgets
grid.enableMove(true);

// Disable moving for all widgets
grid.enableMove(false);

// Enable only this grid, not sub-grids
grid.enableMove(true, false);
```

##### enableResize()

```ts
enableResize(doEnable, recurse): GridStack;
```

Defined in: [gridstack.ts:2367](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2367)

Enables/disables widget resizing for all widgets. No-op for static grids.
Note: locally defined items (with noResize property) still override this setting.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `doEnable` | `boolean` | `undefined` | if true widgets will be resizable, if false resizing is disabled |
| `recurse` | `boolean` | `true` | if true (default), sub-grids also get updated |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Enable resizing for all widgets
grid.enableResize(true);

// Disable resizing for all widgets
grid.enableResize(false);

// Enable only this grid, not sub-grids
grid.enableResize(true, false);
```

##### float()

```ts
float(val): GridStack;
```

Defined in: [gridstack.ts:1149](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1149)

Enable/disable floating widgets (default: `false`). When enabled, widgets can float up to fill empty spaces.
See [example](http://gridstackjs.com/demo/float.html)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `val` | `boolean` | true to enable floating, false to disable |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
grid.float(true);  // Enable floating
grid.float(false); // Disable floating (default)
```

##### getCellFromPixel()

```ts
getCellFromPixel(position, useDocRelative): CellPosition;
```

Defined in: [gridstack.ts:1179](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1179)

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

Defined in: [gridstack.ts:857](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L857)

Gets the current cell height in pixels. This takes into account the unit type and converts to pixels if necessary.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `forcePixel` | `boolean` | `false` | if true, forces conversion to pixels even when cellHeight is specified in other units |

###### Returns

`number`

the cell height in pixels

###### Example

```ts
const height = grid.getCellHeight();
console.log('Cell height:', height, 'px');

// Force pixel conversion
const pixelHeight = grid.getCellHeight(true);
```

##### getColumn()

```ts
getColumn(): number;
```

Defined in: [gridstack.ts:1078](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1078)

Get the number of columns in the grid (default 12).

###### Returns

`number`

the current number of columns in the grid

###### Example

```ts
const columnCount = grid.getColumn(); // returns 12 by default
```

##### getDD()

```ts
static getDD(): DDGridStack;
```

Defined in: [gridstack.ts:2183](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2183)

Get the global drag & drop implementation instance.
This provides access to the underlying drag & drop functionality.

###### Returns

[`DDGridStack`](#ddgridstack)

the DDGridStack instance used for drag & drop operations

###### Example

```ts
const dd = GridStack.getDD();
// Access drag & drop functionality
```

##### getFloat()

```ts
getFloat(): boolean;
```

Defined in: [gridstack.ts:1166](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1166)

Get the current float mode setting.

###### Returns

`boolean`

true if floating is enabled, false otherwise

###### Example

```ts
const isFloating = grid.getFloat();
console.log('Floating enabled:', isFloating);
```

##### getGridItems()

```ts
getGridItems(): GridItemHTMLElement[];
```

Defined in: [gridstack.ts:1092](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1092)

Returns an array of grid HTML elements (no placeholder) - used to iterate through our children in DOM order.
This method excludes placeholder elements and returns only actual grid items.

###### Returns

[`GridItemHTMLElement`](#griditemhtmlelement)[]

array of GridItemHTMLElement instances representing all grid items

###### Example

```ts
const items = grid.getGridItems();
items.forEach(item => {
  console.log('Item ID:', item.gridstackNode.id);
});
```

##### getMargin()

```ts
getMargin(): number;
```

Defined in: [gridstack.ts:1791](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1791)

Returns the current margin value as a number (undefined if the 4 sides don't match).
This only returns a number if all sides have the same margin value.

###### Returns

`number`

the margin value in pixels, or undefined if sides have different values

###### Example

```ts
const margin = grid.getMargin();
if (margin !== undefined) {
  console.log('Uniform margin:', margin, 'px');
} else {
  console.log('Margins are different on different sides');
}
```

##### getRow()

```ts
getRow(): number;
```

Defined in: [gridstack.ts:1209](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1209)

Returns the current number of rows, which will be at least `minRow` if set.
The row count is based on the highest positioned widget in the grid.

###### Returns

`number`

the current number of rows in the grid

###### Example

```ts
const rowCount = grid.getRow();
console.log('Grid has', rowCount, 'rows');
```

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

Defined in: [gridstack.ts:1228](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1228)

Checks if the specified rectangular area is empty (no widgets occupy any part of it).

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | the x coordinate (column) of the area to check |
| `y` | `number` | the y coordinate (row) of the area to check |
| `w` | `number` | the width in columns of the area to check |
| `h` | `number` | the height in rows of the area to check |

###### Returns

`boolean`

true if the area is completely empty, false if any widget overlaps

###### Example

```ts
// Check if a 2x2 area at position (1,1) is empty
if (grid.isAreaEmpty(1, 1, 2, 2)) {
  console.log('Area is available for placement');
}
```

##### isIgnoreChangeCB()

```ts
isIgnoreChangeCB(): boolean;
```

Defined in: [gridstack.ts:1109](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1109)

Returns true if change callbacks should be ignored due to column change, sizeToContent, loading, etc.
This is useful for callers who want to implement dirty flag functionality.

###### Returns

`boolean`

true if change callbacks are currently being ignored

###### Example

```ts
if (!grid.isIgnoreChangeCB()) {
  // Process the change event
  console.log('Grid layout changed');
}
```

##### load()

```ts
load(items, addRemove): GridStack;
```

Defined in: [gridstack.ts:722](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L722)

Load widgets from a list. This will call update() on each (matching by id) or add/remove widgets that are not there.
Used to restore a grid layout for a saved layout list (see `save()`).

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `items` | [`GridStackWidget`](#gridstackwidget)[] | list of widgets definition to update/create |
| `addRemove` | `boolean` \| [`AddRemoveFcn`](#addremovefcn) | boolean (default true) or callback method can be passed to control if and how missing widgets can be added/removed, giving the user control of insertion. |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Basic usage with saved layout
const savedLayout = grid.save(); // Save current layout
// ... later restore it
grid.load(savedLayout);

// Load with custom add/remove callback
grid.load(layout, (items, grid, add) => {
  if (add) {
    // Custom logic for adding new widgets
    items.forEach(item => {
      const el = document.createElement('div');
      el.innerHTML = item.content || '';
      grid.addWidget(el, item);
    });
  } else {
    // Custom logic for removing widgets
    items.forEach(item => grid.removeWidget(item.el));
  }
});

// Load without adding/removing missing widgets
grid.load(layout, false);
```

###### See

[http://gridstackjs.com/demo/serialization.html](http://gridstackjs.com/demo/serialization.html) for complete example

##### makeSubGrid()

```ts
makeSubGrid(
   el, 
   ops?, 
   nodeToAdd?, 
   saveContent?): GridStack;
```

Defined in: [gridstack.ts:506](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L506)

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

Defined in: [gridstack.ts:1256](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1256)

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

the converted GridItemHTMLElement

###### Example

```ts
const grid = GridStack.init();

// Create HTML content manually, possibly looking like:
// <div id="item-1" gs-x="0" gs-y="0" gs-w="3" gs-h="2"></div>
grid.el.innerHTML = '<div id="item-1" gs-w="3"></div><div id="item-2"></div>';

// Convert existing elements to widgets
grid.makeWidget('#item-1'); // Uses gs-* attributes from DOM
grid.makeWidget('#item-2', {w: 2, h: 1, content: 'Hello World'});

// Or pass DOM element directly
const element = document.getElementById('item-3');
grid.makeWidget(element, {x: 0, y: 1, w: 4, h: 2});
```

##### margin()

```ts
margin(value): GridStack;
```

Defined in: [gridstack.ts:1762](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1762)

Updates the margins which will set all 4 sides at once - see `GridStackOptions.margin` for format options.
Supports CSS string format of 1, 2, or 4 values or a single number.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`numberOrString`](#numberorstring) | margin value - can be: - Single number: `10` (applies to all sides) - Two values: `'10px 20px'` (top/bottom, left/right) - Four values: `'10px 20px 5px 15px'` (top, right, bottom, left) |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
grid.margin(10);           // 10px all sides
grid.margin('10px 20px');  // 10px top/bottom, 20px left/right
grid.margin('5px 10px 15px 20px'); // Different for each side
```

##### movable()

```ts
movable(els, val): GridStack;
```

Defined in: [gridstack.ts:2227](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2227)

Enables/Disables dragging by the user for specific grid elements.
For all items and future items, use enableMove() instead. No-op for static grids.

Note: If you want to prevent an item from moving due to being pushed around by another
during collision, use the 'locked' property instead.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `els` | [`GridStackElement`](#gridstackelement) | widget element(s) or selector to modify |
| `val` | `boolean` | if true widget will be draggable, assuming the parent grid isn't noMove or static |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Make specific widgets draggable
grid.movable('.my-widget', true);

// Disable dragging for specific widgets
grid.movable('#fixed-widget', false);
```

##### off()

```ts
off(name): GridStack;
```

Defined in: [gridstack.ts:1352](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1352)

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

Defined in: [gridstack.ts:1379](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1379)

Remove all event handlers from the grid. This is useful for cleanup when destroying a grid.

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
grid.offAll(); // Remove all event listeners
```

##### on()

###### Call Signature

```ts
on(name, callback): GridStack;
```

Defined in: [gridstack.ts:1315](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1315)

Register event handler for grid events. You can call this on a single event name, or space separated list.

Supported events:
- `added`: Called when widgets are being added to a grid
- `change`: Occurs when widgets change their position/size due to constraints or direct changes
- `disable`: Called when grid becomes disabled
- `dragstart`: Called when grid item starts being dragged
- `drag`: Called while grid item is being dragged (for each new row/column value)
- `dragstop`: Called after user is done moving the item, with updated DOM attributes
- `dropped`: Called when an item has been dropped and accepted over a grid
- `enable`: Called when grid becomes enabled
- `removed`: Called when items are being removed from the grid
- `resizestart`: Called before user starts resizing an item
- `resize`: Called while grid item is being resized (for each new row/column value)
- `resizestop`: Called after user is done resizing the item, with updated DOM attributes

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `"dropped"` | event name(s) to listen for (space separated for multiple) |
| `callback` | [`GridStackDroppedHandler`](#gridstackdroppedhandler) | function to call when event occurs |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Listen to multiple events at once
grid.on('added removed change', (event, items) => {
  items.forEach(item => console.log('Item changed:', item));
});

// Listen to individual events
grid.on('added', (event, items) => {
  items.forEach(item => console.log('Added item:', item));
});
```

###### Call Signature

```ts
on(name, callback): GridStack;
```

Defined in: [gridstack.ts:1316](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1316)

Register event handler for grid events. You can call this on a single event name, or space separated list.

Supported events:
- `added`: Called when widgets are being added to a grid
- `change`: Occurs when widgets change their position/size due to constraints or direct changes
- `disable`: Called when grid becomes disabled
- `dragstart`: Called when grid item starts being dragged
- `drag`: Called while grid item is being dragged (for each new row/column value)
- `dragstop`: Called after user is done moving the item, with updated DOM attributes
- `dropped`: Called when an item has been dropped and accepted over a grid
- `enable`: Called when grid becomes enabled
- `removed`: Called when items are being removed from the grid
- `resizestart`: Called before user starts resizing an item
- `resize`: Called while grid item is being resized (for each new row/column value)
- `resizestop`: Called after user is done resizing the item, with updated DOM attributes

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `"enable"` \| `"disable"` | event name(s) to listen for (space separated for multiple) |
| `callback` | [`GridStackEventHandler`](#gridstackeventhandler) | function to call when event occurs |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Listen to multiple events at once
grid.on('added removed change', (event, items) => {
  items.forEach(item => console.log('Item changed:', item));
});

// Listen to individual events
grid.on('added', (event, items) => {
  items.forEach(item => console.log('Added item:', item));
});
```

###### Call Signature

```ts
on(name, callback): GridStack;
```

Defined in: [gridstack.ts:1317](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1317)

Register event handler for grid events. You can call this on a single event name, or space separated list.

Supported events:
- `added`: Called when widgets are being added to a grid
- `change`: Occurs when widgets change their position/size due to constraints or direct changes
- `disable`: Called when grid becomes disabled
- `dragstart`: Called when grid item starts being dragged
- `drag`: Called while grid item is being dragged (for each new row/column value)
- `dragstop`: Called after user is done moving the item, with updated DOM attributes
- `dropped`: Called when an item has been dropped and accepted over a grid
- `enable`: Called when grid becomes enabled
- `removed`: Called when items are being removed from the grid
- `resizestart`: Called before user starts resizing an item
- `resize`: Called while grid item is being resized (for each new row/column value)
- `resizestop`: Called after user is done resizing the item, with updated DOM attributes

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `"change"` \| `"added"` \| `"removed"` \| `"resizecontent"` | event name(s) to listen for (space separated for multiple) |
| `callback` | [`GridStackNodesHandler`](#gridstacknodeshandler) | function to call when event occurs |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Listen to multiple events at once
grid.on('added removed change', (event, items) => {
  items.forEach(item => console.log('Item changed:', item));
});

// Listen to individual events
grid.on('added', (event, items) => {
  items.forEach(item => console.log('Added item:', item));
});
```

###### Call Signature

```ts
on(name, callback): GridStack;
```

Defined in: [gridstack.ts:1318](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1318)

Register event handler for grid events. You can call this on a single event name, or space separated list.

Supported events:
- `added`: Called when widgets are being added to a grid
- `change`: Occurs when widgets change their position/size due to constraints or direct changes
- `disable`: Called when grid becomes disabled
- `dragstart`: Called when grid item starts being dragged
- `drag`: Called while grid item is being dragged (for each new row/column value)
- `dragstop`: Called after user is done moving the item, with updated DOM attributes
- `dropped`: Called when an item has been dropped and accepted over a grid
- `enable`: Called when grid becomes enabled
- `removed`: Called when items are being removed from the grid
- `resizestart`: Called before user starts resizing an item
- `resize`: Called while grid item is being resized (for each new row/column value)
- `resizestop`: Called after user is done resizing the item, with updated DOM attributes

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | \| `"drag"` \| `"dragstart"` \| `"resize"` \| `"resizestart"` \| `"resizestop"` \| `"dragstop"` | event name(s) to listen for (space separated for multiple) |
| `callback` | [`GridStackElementHandler`](#gridstackelementhandler) | function to call when event occurs |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Listen to multiple events at once
grid.on('added removed change', (event, items) => {
  items.forEach(item => console.log('Item changed:', item));
});

// Listen to individual events
grid.on('added', (event, items) => {
  items.forEach(item => console.log('Added item:', item));
});
```

###### Call Signature

```ts
on(name, callback): GridStack;
```

Defined in: [gridstack.ts:1319](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1319)

Register event handler for grid events. You can call this on a single event name, or space separated list.

Supported events:
- `added`: Called when widgets are being added to a grid
- `change`: Occurs when widgets change their position/size due to constraints or direct changes
- `disable`: Called when grid becomes disabled
- `dragstart`: Called when grid item starts being dragged
- `drag`: Called while grid item is being dragged (for each new row/column value)
- `dragstop`: Called after user is done moving the item, with updated DOM attributes
- `dropped`: Called when an item has been dropped and accepted over a grid
- `enable`: Called when grid becomes enabled
- `removed`: Called when items are being removed from the grid
- `resizestart`: Called before user starts resizing an item
- `resize`: Called while grid item is being resized (for each new row/column value)
- `resizestop`: Called after user is done resizing the item, with updated DOM attributes

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | event name(s) to listen for (space separated for multiple) |
| `callback` | [`GridStackEventHandlerCallback`](#gridstackeventhandlercallback) | function to call when event occurs |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Listen to multiple events at once
grid.on('added removed change', (event, items) => {
  items.forEach(item => console.log('Item changed:', item));
});

// Listen to individual events
grid.on('added', (event, items) => {
  items.forEach(item => console.log('Added item:', item));
});
```

##### onResize()

```ts
onResize(clientWidth): GridStack;
```

Defined in: [gridstack.ts:2024](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2024)

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

Defined in: [gridstack.ts:2710](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2710)

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

Defined in: [gridstack.ts:1428](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1428)

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

Defined in: [gridstack.ts:599](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L599)

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

Defined in: [gridstack.ts:1390](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1390)

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

Defined in: [gridstack.ts:2253](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2253)

Enables/Disables user resizing for specific grid elements.
For all items and future items, use enableResize() instead. No-op for static grids.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `els` | [`GridStackElement`](#gridstackelement) | widget element(s) or selector to modify |
| `val` | `boolean` | if true widget will be resizable, assuming the parent grid isn't noResize or static |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Make specific widgets resizable
grid.resizable('.my-widget', true);

// Disable resizing for specific widgets
grid.resizable('#fixed-size-widget', false);
```

##### resizeToContent()

```ts
resizeToContent(el): void;
```

Defined in: [gridstack.ts:1652](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1652)

Updates widget height to match the content height to avoid vertical scrollbars or dead space.
This automatically adjusts the widget height based on its content size.

Note: This assumes only 1 child under resizeToContentParent='.grid-stack-item-content'
(sized to gridItem minus padding) that represents the entire content size.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) | the grid item element to resize |

###### Returns

`void`

###### Example

```ts
// Resize a widget to fit its content
const widget = document.querySelector('.grid-stack-item');
grid.resizeToContent(widget);

// This is commonly used with dynamic content:
widget.querySelector('.content').innerHTML = 'New longer content...';
grid.resizeToContent(widget);
```

##### rotate()

```ts
rotate(els, relative?): GridStack;
```

Defined in: [gridstack.ts:1727](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1727)

Rotate widgets by swapping their width and height. This is typically called when the user presses 'r' during dragging.
The rotation swaps the w/h dimensions and adjusts min/max constraints accordingly.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `els` | [`GridStackElement`](#gridstackelement) | widget element(s) or selector to rotate |
| `relative?` | [`Position`](#position-1) | optional pixel coordinate relative to upper/left corner to rotate around (keeps that cell under cursor) |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Rotate a specific widget
grid.rotate('.my-widget');

// Rotate with relative positioning during drag
grid.rotate(widget, { left: 50, top: 30 });
```

##### save()

```ts
save(
   saveContent, 
   saveGridOpt, 
   saveCB, 
   column?): 
  | GridStackOptions
  | GridStackWidget[];
```

Defined in: [gridstack.ts:634](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L634)

saves the current layout returning a list of widgets for serialization which might include any nested grids.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `saveContent` | `boolean` | `true` | if true (default) the latest html inside .grid-stack-content will be saved to GridStackWidget.content field, else it will be removed. |
| `saveGridOpt` | `boolean` | `false` | if true (default false), save the grid options itself, so you can call the new GridStack.addGrid() to recreate everything from scratch. GridStackOptions.children would then contain the widget list instead. |
| `saveCB` | [`SaveFcn`](#savefcn) | `GridStack.saveCB` | callback for each node -> widget, so application can insert additional data to be saved into the widget data structure. |
| `column?` | `number` | `undefined` | if provided, the grid will be saved for the given column size (IFF we have matching internal saved layout, or current layout). Otherwise it will use the largest possible layout (say 12 even if rendering at 1 column) so we can restore to all layouts. NOTE: if you want to save to currently display layout, pass this.getColumn() as column. NOTE2: nested grids will ALWAYS save to the container size to be in sync with parent. |

###### Returns

  \| [`GridStackOptions`](#gridstackoptions)
  \| [`GridStackWidget`](#gridstackwidget)[]

list of widgets or full grid option, including .children list of widgets

##### setAnimation()

```ts
setAnimation(doAnimate, delay?): GridStack;
```

Defined in: [gridstack.ts:1447](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1447)

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

Defined in: [gridstack.ts:1470](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1470)

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

Defined in: [gridstack.ts:2196](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2196)

call to setup dragging in from the outside (say toolbar), by specifying the class selection and options.
Called during GridStack.init() as options, but can also be called directly (last param are used) in case the toolbar
is dynamically create and needs to be set later.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `dragIn?` | `string` \| `HTMLElement`[] | `undefined` | string selector (ex: '.sidebar-item') or list of dom elements |
| `dragInOptions?` | [`DDDragOpt`](#dddragopt) | `undefined` | options - see DDDragOpt. (default: {handle: '.grid-stack-item-content', appendTo: 'body'} |
| `widgets?` | [`GridStackWidget`](#gridstackwidget)[] | `undefined` | GridStackWidget def to assign to each element which defines what to create on drop |
| `root?` | `HTMLElement` \| `Document` | `document` | optional root which defaults to document (for shadow dom pass the parent HTMLDocument) |

###### Returns

`void`

##### triggerEvent()

```ts
protected triggerEvent(event, target): void;
```

Defined in: [gridstack.ts:2964](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L2964)

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

Defined in: [gridstack.ts:1548](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1548)

Updates widget position/size and other info. This is used to change widget properties after creation.
Can update position, size, content, and other widget properties.

Note: If you need to call this on all nodes, use load() instead which will update what changed.
Setting the same x,y for multiple items will be indeterministic and likely unwanted.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `els` | [`GridStackElement`](#gridstackelement) | widget element(s) or selector to modify |
| `opt` | [`GridStackWidget`](#gridstackwidget) | new widget options (x,y,w,h, etc.). Only those set will be updated. |

###### Returns

[`GridStack`](#gridstack-1)

the grid instance for chaining

###### Example

```ts
// Update widget size and position
grid.update('.my-widget', { x: 2, y: 1, w: 3, h: 2 });

// Update widget content
grid.update(widget, { content: '<p>New content</p>' });

// Update multiple properties
grid.update('#my-widget', {
  w: 4,
  h: 3,
  noResize: true,
  locked: true
});
```

##### updateOptions()

```ts
updateOptions(o): GridStack;
```

Defined in: [gridstack.ts:1488](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1488)

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

Defined in: [gridstack.ts:1805](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L1805)

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
| <a id="el-4"></a> `el` | `public` | [`GridHTMLElement`](#gridhtmlelement) | `undefined` | the HTML element tied to this grid after it's been initialized | [gridstack.ts:266](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L266) |
| <a id="engine"></a> `engine` | `public` | [`GridStackEngine`](#gridstackengine-2) | `undefined` | engine used to implement non DOM grid functionality | [gridstack.ts:212](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L212) |
| <a id="engine-1"></a> `Engine` | `static` | *typeof* [`GridStackEngine`](#gridstackengine-2) | `GridStackEngine` | scoping so users can call new GridStack.Engine(12) for example | [gridstack.ts:209](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L209) |
| <a id="engineclass"></a> `engineClass` | `static` | *typeof* [`GridStackEngine`](#gridstackengine-2) | `undefined` | - | [gridstack.ts:220](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L220) |
| <a id="opts"></a> `opts` | `public` | [`GridStackOptions`](#gridstackoptions) | `{}` | grid options - public for classes to access, but use methods to modify! | [gridstack.ts:266](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L266) |
| <a id="parentgridnode"></a> `parentGridNode?` | `public` | [`GridStackNode`](#gridstacknode-2) | `undefined` | point to a parent grid item if we're nested (inside a grid-item in between 2 Grids) | [gridstack.ts:215](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L215) |
| <a id="rendercb"></a> `renderCB?` | `static` | [`RenderFcn`](#renderfcn) | `undefined` | callback to create the content of widgets so the app can control how to store and restore it By default this lib will do 'el.textContent = w.content' forcing text only support for avoiding potential XSS issues. | [gridstack.ts:195](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L195) |
| <a id="resizeobserver"></a> `resizeObserver` | `protected` | `ResizeObserver` | `undefined` | - | [gridstack.ts:221](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L221) |
| <a id="resizetocontentcb"></a> `resizeToContentCB?` | `static` | [`ResizeToContentFcn`](#resizetocontentfcn) | `undefined` | callback to use for resizeToContent instead of the built in one | [gridstack.ts:201](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L201) |
| <a id="resizetocontentparent"></a> `resizeToContentParent` | `static` | `string` | `'.grid-stack-item-content'` | parent class for sizing content. defaults to '.grid-stack-item-content' | [gridstack.ts:203](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L203) |
| <a id="responselayout"></a> `responseLayout` | `protected` | [`ColumnOptions`](#columnoptions) | `undefined` | - | [gridstack.ts:258](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L258) |
| <a id="savecb"></a> `saveCB?` | `static` | [`SaveFcn`](#savefcn) | `undefined` | callback during saving to application can inject extra data for each widget, on top of the grid layout properties | [gridstack.ts:189](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L189) |
| <a id="updatecb"></a> `updateCB?` | `static` | (`w`) => `void` | `undefined` | called after a widget has been updated (eg: load() into an existing list of children) so application can do extra work | [gridstack.ts:198](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L198) |
| <a id="utils"></a> `Utils` | `static` | *typeof* [`Utils`](#utils-1) | `Utils` | scoping so users can call GridStack.Utils.sort() for example | [gridstack.ts:206](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack.ts#L206) |

***

<a id="gridstackengine"></a>
### GridStackEngine

Defined in: [gridstack-engine.ts:34](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L34)

Defines the GridStack engine that handles all grid layout calculations and node positioning.
This is the core engine that performs grid manipulation without any DOM operations.

The engine manages:
- Node positioning and collision detection
- Layout algorithms (compact, float, etc.)
- Grid resizing and column changes
- Widget movement and resizing logic

NOTE: Values should not be modified directly - use the main GridStack API instead
to ensure proper DOM updates and event triggers.

#### Accessors

##### float

###### Get Signature

```ts
get float(): boolean;
```

Defined in: [gridstack-engine.ts:438](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L438)

Get the current floating mode setting.

###### Example

```ts
const isFloating = engine.float;
console.log('Floating enabled:', isFloating);
```

###### Returns

`boolean`

true if floating is enabled, false otherwise

###### Set Signature

```ts
set float(val): void;
```

Defined in: [gridstack-engine.ts:421](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L421)

Enable/disable floating widgets (default: `false`).
When floating is enabled, widgets can move up to fill empty spaces.
See [example](http://gridstackjs.com/demo/float.html)

###### Example

```ts
engine.float = true;  // Enable floating
engine.float = false; // Disable floating (default)
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `val` | `boolean` | true to enable floating, false to disable |

###### Returns

`void`

#### Constructors

##### Constructor

```ts
new GridStackEngine(opts): GridStackEngine;
```

Defined in: [gridstack-engine.ts:61](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L61)

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

Defined in: [gridstack-engine.ts:103](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L103)

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

Defined in: [gridstack-engine.ts:756](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L756)

Add the given node to the grid, handling collision detection and re-packing.
This is the main method for adding new widgets to the engine.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) | `undefined` | the node to add to the grid |
| `triggerAddEvent` | `boolean` | `false` | if true, adds node to addedNodes list for event triggering |
| `after?` | [`GridStackNode`](#gridstacknode-2) | `undefined` | optional node to place this node after (for ordering) |

###### Returns

[`GridStackNode`](#gridstacknode-2)

the added node (or existing node if duplicate)

###### Example

```ts
const node = { x: 0, y: 0, w: 2, h: 1, content: 'Hello' };
const added = engine.addNode(node, true);
```

##### batchUpdate()

```ts
batchUpdate(flag, doPack): GridStackEngine;
```

Defined in: [gridstack-engine.ts:85](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L85)

Enable/disable batch mode for multiple operations to optimize performance.
When enabled, layout updates are deferred until batch mode is disabled.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `flag` | `boolean` | `true` | true to enable batch mode, false to disable and apply changes |
| `doPack` | `boolean` | `true` | if true (default), pack/compact nodes when disabling batch mode |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

the engine instance for chaining

###### Example

```ts
// Start batch mode for multiple operations
engine.batchUpdate(true);
engine.addNode(node1);
engine.addNode(node2);
engine.batchUpdate(false); // Apply all changes at once
```

##### beginUpdate()

```ts
beginUpdate(node): GridStackEngine;
```

Defined in: [gridstack-engine.ts:993](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L993)

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

Defined in: [gridstack-engine.ts:1199](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L1199)

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

Defined in: [gridstack-engine.ts:1219](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L1219)

call to cache the given node layout internally to the given location so we can restore back when column changes size

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n` | [`GridStackNode`](#gridstacknode-2) | - |
| `column` | `number` | corresponding column index to save it under |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

##### changedPosConstrain()

```ts
changedPosConstrain(node, p): boolean;
```

Defined in: [gridstack-engine.ts:915](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L915)

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

Defined in: [gridstack-engine.ts:1250](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L1250)

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

Defined in: [gridstack-engine.ts:182](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L182)

Return the first node that intercepts/collides with the given node or area.
Used for collision detection during drag and drop operations.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `skip` | [`GridStackNode`](#gridstacknode-2) | `undefined` | the node to skip in collision detection (usually the node being moved) |
| `area` | [`GridStackNode`](#gridstacknode-2) | `skip` | the area to check for collisions (defaults to skip node's area) |
| `skip2?` | [`GridStackNode`](#gridstacknode-2) | `undefined` | optional second node to skip in collision detection |

###### Returns

[`GridStackNode`](#gridstacknode-2)

the first colliding node, or undefined if no collision

###### Example

```ts
const colliding = engine.collide(draggedNode, {x: 2, y: 1, w: 2, h: 1});
if (colliding) {
  console.log('Would collide with:', colliding.id);
}
```

##### collideAll()

```ts
collideAll(
   skip, 
   area, 
   skip2?): GridStackNode[];
```

Defined in: [gridstack-engine.ts:200](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L200)

Return all nodes that intercept/collide with the given node or area.
Similar to collide() but returns all colliding nodes instead of just the first.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `skip` | [`GridStackNode`](#gridstacknode-2) | `undefined` | the node to skip in collision detection |
| `area` | [`GridStackNode`](#gridstacknode-2) | `skip` | the area to check for collisions (defaults to skip node's area) |
| `skip2?` | [`GridStackNode`](#gridstacknode-2) | `undefined` | optional second node to skip in collision detection |

###### Returns

[`GridStackNode`](#gridstacknode-2)[]

array of all colliding nodes

###### Example

```ts
const allCollisions = engine.collideAll(draggedNode);
console.log('Colliding with', allCollisions.length, 'nodes');
```

##### compact()

```ts
compact(layout, doSort): GridStackEngine;
```

Defined in: [gridstack-engine.ts:388](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L388)

Re-layout grid items to reclaim any empty space.
This optimizes the grid layout by moving items to fill gaps.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `layout` | [`CompactOptions`](#compactoptions) | `'compact'` | layout algorithm to use: - 'compact' (default): find truly empty spaces, may reorder items - 'list': keep the sort order exactly the same, move items up sequentially |
| `doSort` | `boolean` | `true` | if true (default), sort nodes by position before compacting |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

the engine instance for chaining

###### Example

```ts
// Compact to fill empty spaces
engine.compact();

// Compact preserving item order
engine.compact('list');
```

##### directionCollideCoverage()

```ts
protected directionCollideCoverage(
   node, 
   o, 
   collides): GridStackNode;
```

Defined in: [gridstack-engine.ts:207](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L207)

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

Defined in: [gridstack-engine.ts:1002](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L1002)

###### Returns

[`GridStackEngine`](#gridstackengine-2)

##### findCacheLayout()

```ts
protected findCacheLayout(n, column): number;
```

Defined in: [gridstack-engine.ts:1233](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L1233)

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

Defined in: [gridstack-engine.ts:722](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L722)

Find the first available empty spot for the given node dimensions.
Updates the node's x,y attributes with the found position.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) | the node to find a position for (w,h must be set) |
| `nodeList` | [`GridStackNode`](#gridstacknode-2)[] | optional list of nodes to check against (defaults to engine nodes) |
| `column` | `number` | optional column count (defaults to engine column count) |
| `after?` | [`GridStackNode`](#gridstacknode-2) | optional node to start search after (maintains order) |

###### Returns

`boolean`

true if an empty position was found and node was updated

###### Example

```ts
const node = { w: 2, h: 1 };
if (engine.findEmptyPosition(node)) {
  console.log('Found position at:', node.x, node.y);
}
```

##### getDirtyNodes()

```ts
getDirtyNodes(verify?): GridStackNode[];
```

Defined in: [gridstack-engine.ts:636](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L636)

Returns a list of nodes that have been modified from their original values.
This is used to track which nodes need DOM updates.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `verify?` | `boolean` | if true, performs additional verification by comparing current vs original positions |

###### Returns

[`GridStackNode`](#gridstacknode-2)[]

array of nodes that have been modified

###### Example

```ts
const changed = engine.getDirtyNodes();
console.log('Modified nodes:', changed.length);

// Get verified dirty nodes
const verified = engine.getDirtyNodes(true);
```

##### getRow()

```ts
getRow(): number;
```

Defined in: [gridstack-engine.ts:989](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L989)

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

Defined in: [gridstack-engine.ts:366](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L366)

Check if the specified rectangular area is empty (no nodes occupy any part of it).

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | the x coordinate (column) of the area to check |
| `y` | `number` | the y coordinate (row) of the area to check |
| `w` | `number` | the width in columns of the area to check |
| `h` | `number` | the height in rows of the area to check |

###### Returns

`boolean`

true if the area is completely empty, false if any node overlaps

###### Example

```ts
if (engine.isAreaEmpty(2, 1, 3, 2)) {
  console.log('Area is available for placement');
}
```

##### moveNode()

```ts
moveNode(node, o): boolean;
```

Defined in: [gridstack-engine.ts:929](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L929)

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

Defined in: [gridstack-engine.ts:843](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L843)

Check if a node can be moved to a new position, considering layout constraints.
This is a safer version of moveNode() that validates the move first.

For complex cases (like maxRow constraints), it simulates the move in a clone first,
then applies the changes only if they meet all specifications.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) | the node to move |
| `o` | [`GridStackMoveOpts`](#gridstackmoveopts) | move options including target position |

###### Returns

`boolean`

true if the node was successfully moved

###### Example

```ts
const canMove = engine.moveNodeCheck(node, { x: 2, y: 1 });
if (canMove) {
  console.log('Node moved successfully');
}
```

##### nodeBoundFix()

```ts
nodeBoundFix(node, resizing?): GridStackEngine;
```

Defined in: [gridstack-engine.ts:560](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L560)

Part 2 of preparing a node to fit inside the grid - validates and fixes coordinates and dimensions.
This ensures the node fits within grid boundaries and respects min/max constraints.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) | the node to validate and fix |
| `resizing?` | `boolean` | if true, resize the node to fit; if false, move the node to fit |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

the engine instance for chaining

###### Example

```ts
// Fix a node that might be out of bounds
engine.nodeBoundFix(node, true); // Resize to fit
engine.nodeBoundFix(node, false); // Move to fit
```

##### prepareNode()

```ts
prepareNode(node, resizing?): GridStackNode;
```

Defined in: [gridstack-engine.ts:507](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L507)

Prepare and validate a node's coordinates and values for the current grid.
This ensures the node has valid position, size, and properties before being added to the grid.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) | the node to prepare and validate |
| `resizing?` | `boolean` | if true, resize the node down if it's out of bounds; if false, move it to fit |

###### Returns

[`GridStackNode`](#gridstacknode-2)

the prepared node with valid coordinates

###### Example

```ts
const node = { w: 3, h: 2, content: 'Hello' };
const prepared = engine.prepareNode(node);
console.log('Node prepared at:', prepared.x, prepared.y);
```

##### removeAll()

```ts
removeAll(removeDOM, triggerEvent): GridStackEngine;
```

Defined in: [gridstack-engine.ts:816](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L816)

Remove all nodes from the grid.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `removeDOM` | `boolean` | `true` | if true (default), marks all nodes for DOM removal |
| `triggerEvent` | `boolean` | `true` | if true (default), triggers removal events |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

the engine instance for chaining

###### Example

```ts
engine.removeAll(); // Remove all nodes
```

##### removeNode()

```ts
removeNode(
   node, 
   removeDOM, 
   triggerEvent): GridStackEngine;
```

Defined in: [gridstack-engine.ts:790](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L790)

Remove the given node from the grid.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) | `undefined` | the node to remove |
| `removeDOM` | `boolean` | `true` | if true (default), marks node for DOM removal |
| `triggerEvent` | `boolean` | `false` | if true, adds node to removedNodes list for event triggering |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

the engine instance for chaining

###### Example

```ts
engine.removeNode(node, true, true);
```

##### removeNodeFromLayoutCache()

```ts
removeNodeFromLayoutCache(n): void;
```

Defined in: [gridstack-engine.ts:1237](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L1237)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | [`GridStackNode`](#gridstacknode-2) |

###### Returns

`void`

##### save()

```ts
save(
   saveElement, 
   saveCB?, 
   column?): GridStackNode[];
```

Defined in: [gridstack-engine.ts:1018](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L1018)

saves a copy of the largest column layout (eg 12 even when rendering 1 column) so we don't loose orig layout, unless explicity column
count to use is given. returning a list of widgets for serialization

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `saveElement` | `boolean` | `true` | if true (default), the element will be saved to GridStackWidget.el field, else it will be removed. |
| `saveCB?` | [`SaveFcn`](#savefcn) | `undefined` | callback for each node -> widget, so application can insert additional data to be saved into the widget data structure. |
| `column?` | `number` | `undefined` | if provided, the grid will be saved for the given column count (IFF we have matching internal saved layout, or current layout). Note: nested grids will ALWAYS save the container w to match overall layouts (parent + child) to be consistent. |

###### Returns

[`GridStackNode`](#gridstacknode-2)[]

##### sortNodes()

```ts
sortNodes(dir): GridStackEngine;
```

Defined in: [gridstack-engine.ts:451](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L451)

Sort the nodes array from first to last, or reverse.
This is called during collision/placement operations to enforce a specific order.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `dir` | `-1` \| `1` | `1` | sort direction: 1 for ascending (first to last), -1 for descending (last to first) |

###### Returns

[`GridStackEngine`](#gridstackengine-2)

the engine instance for chaining

###### Example

```ts
engine.sortNodes();    // Sort ascending (default)
engine.sortNodes(-1);  // Sort descending
```

##### swap()

```ts
swap(a, b): boolean;
```

Defined in: [gridstack-engine.ts:314](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L314)

Attempt to swap the positions of two nodes if they meet swapping criteria.
Nodes can swap if they are the same size or in the same column/row, not locked, and touching.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | [`GridStackNode`](#gridstacknode-2) | first node to swap |
| `b` | [`GridStackNode`](#gridstacknode-2) | second node to swap |

###### Returns

`boolean`

true if swap was successful, false if not possible, undefined if not applicable

###### Example

```ts
const swapped = engine.swap(nodeA, nodeB);
if (swapped) {
  console.log('Nodes swapped successfully');
}
```

##### willItFit()

```ts
willItFit(node): boolean;
```

Defined in: [gridstack-engine.ts:894](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L894)

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
| <a id="addednodes"></a> `addedNodes` | `public` | [`GridStackNode`](#gridstacknode-2)[] | `[]` | - | [gridstack-engine.ts:38](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L38) |
| <a id="batchmode"></a> `batchMode` | `public` | `boolean` | `undefined` | - | [gridstack-engine.ts:40](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L40) |
| <a id="column-2"></a> `column` | `public` | `number` | `undefined` | - | [gridstack-engine.ts:35](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L35) |
| <a id="defaultcolumn"></a> `defaultColumn` | `public` | `number` | `12` | - | [gridstack-engine.ts:41](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L41) |
| <a id="maxrow"></a> `maxRow` | `public` | `number` | `undefined` | - | [gridstack-engine.ts:36](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L36) |
| <a id="nodes"></a> `nodes` | `public` | [`GridStackNode`](#gridstacknode-2)[] | `undefined` | - | [gridstack-engine.ts:37](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L37) |
| <a id="removednodes"></a> `removedNodes` | `public` | [`GridStackNode`](#gridstacknode-2)[] | `[]` | - | [gridstack-engine.ts:39](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L39) |
| <a id="skipcacheupdate"></a> `skipCacheUpdate?` | `public` | `boolean` | `undefined` | true when grid.load() already cached the layout and can skip out of bound caching info | [gridstack-engine.ts:55](https://github.com/adumesny/gridstack.js/blob/master/src/gridstack-engine.ts#L55) |

***

<a id="utils"></a>
### Utils

Defined in: [utils.ts:97](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L97)

Collection of utility methods used throughout GridStack.
These are general-purpose helper functions for DOM manipulation,
positioning calculations, object operations, and more.

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

Defined in: [utils.ts:701](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L701)

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

Defined in: [utils.ts:683](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L683)

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

Defined in: [utils.ts:297](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L297)

Calculate the total area of a grid position.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | [`GridStackPosition`](#gridstackposition) | position with width and height |

###### Returns

`number`

the total area (width * height)

###### Example

```ts
const area = Utils.area({x: 0, y: 0, w: 3, h: 2}); // returns 6
```

##### areaIntercept()

```ts
static areaIntercept(a, b): number;
```

Defined in: [utils.ts:278](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L278)

Calculate the overlapping area between two grid positions.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | [`GridStackPosition`](#gridstackposition) | first position |
| `b` | [`GridStackPosition`](#gridstackposition) | second position |

###### Returns

`number`

the area of overlap (0 if no overlap)

###### Example

```ts
const overlap = Utils.areaIntercept(
  {x: 0, y: 0, w: 3, h: 2},
  {x: 1, y: 0, w: 3, h: 2}
); // returns 4 (2x2 overlap)
```

##### canBeRotated()

```ts
static canBeRotated(n): boolean;
```

Defined in: [utils.ts:804](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L804)

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

Defined in: [utils.ts:646](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L646)

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

Defined in: [utils.ts:662](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L662)

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

Defined in: [utils.ts:677](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L677)

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

Defined in: [utils.ts:474](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L474)

Copy position and size properties from one widget to another.
Copies x, y, w, h and optionally min/max constraints.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `a` | [`GridStackWidget`](#gridstackwidget) | `undefined` | target widget to copy to |
| `b` | [`GridStackWidget`](#gridstackwidget) | `undefined` | source widget to copy from |
| `doMinMax` | `boolean` | `false` | if true, also copy min/max width/height constraints |

###### Returns

[`GridStackWidget`](#gridstackwidget)

the target widget (a)

###### Example

```ts
Utils.copyPos(widget1, widget2); // Copy position/size
Utils.copyPos(widget1, widget2, true); // Also copy constraints
```

##### createDiv()

```ts
static createDiv(classes, parent?): HTMLElement;
```

Defined in: [utils.ts:206](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L206)

Create a div element with the specified CSS classes.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `classes` | `string`[] | array of CSS class names to add |
| `parent?` | `HTMLElement` | optional parent element to append the div to |

###### Returns

`HTMLElement`

the created div element

###### Example

```ts
const div = Utils.createDiv(['grid-item', 'draggable']);
const nested = Utils.createDiv(['content'], parentDiv);
```

##### defaults()

```ts
static defaults(target, ...sources): object;
```

Defined in: [utils.ts:421](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L421)

Copy unset fields from source objects to target object (shallow merge with defaults).
Similar to Object.assign but only sets undefined/null fields.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | the object to copy defaults into |
| ...`sources` | `any`[] | one or more source objects to copy defaults from |

###### Returns

`object`

the modified target object

###### Example

```ts
const config = { width: 100 };
Utils.defaults(config, { width: 200, height: 50 });
// config is now { width: 100, height: 50 }
```

##### find()

```ts
static find(nodes, id): GridStackNode;
```

Defined in: [utils.ts:332](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L332)

Find a grid node by its ID.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `nodes` | [`GridStackNode`](#gridstacknode-2)[] | array of nodes to search |
| `id` | `string` | the ID to search for |

###### Returns

[`GridStackNode`](#gridstacknode-2)

the node with matching ID, or undefined if not found

###### Example

```ts
const node = Utils.find(nodes, 'widget-1');
if (node) console.log('Found node at:', node.x, node.y);
```

##### getElement()

```ts
static getElement(els, root): HTMLElement;
```

Defined in: [utils.ts:155](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L155)

Convert a potential selector into a single HTML element.
Similar to getElements() but returns only the first match.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `els` | [`GridStackElement`](#gridstackelement) | `undefined` | selector string or HTMLElement |
| `root` | `HTMLElement` \| `Document` | `document` | optional root element to search within (defaults to document) |

###### Returns

`HTMLElement`

the first HTML element matching the selector, or null if not found

###### Example

```ts
const element = Utils.getElement('#myWidget');
const first = Utils.getElement('.grid-item');
```

##### getElements()

```ts
static getElements(els, root): HTMLElement[];
```

Defined in: [utils.ts:112](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L112)

Convert a potential selector into an actual list of HTML elements.
Supports CSS selectors, element references, and special ID handling.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `els` | [`GridStackElement`](#gridstackelement) | `undefined` | selector string, HTMLElement, or array of elements |
| `root` | `HTMLElement` \| `Document` | `document` | optional root element to search within (defaults to document, useful for shadow DOM) |

###### Returns

`HTMLElement`[]

array of HTML elements matching the selector

###### Example

```ts
const elements = Utils.getElements('.grid-item');
const byId = Utils.getElements('#myWidget');
const fromShadow = Utils.getElements('.item', shadowRoot);
```

##### getValuesFromTransformedElement()

```ts
static getValuesFromTransformedElement(parent): DragTransform;
```

Defined in: [utils.ts:761](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L761)

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

Defined in: [utils.ts:718](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L718)

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

Defined in: [utils.ts:244](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L244)

Check if two grid positions overlap/intersect.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | [`GridStackPosition`](#gridstackposition) | first position with x, y, w, h properties |
| `b` | [`GridStackPosition`](#gridstackposition) | second position with x, y, w, h properties |

###### Returns

`boolean`

true if the positions overlap

###### Example

```ts
const overlaps = Utils.isIntercepted(
  {x: 0, y: 0, w: 2, h: 1},
  {x: 1, y: 0, w: 2, h: 1}
); // true - they overlap
```

##### isTouching()

```ts
static isTouching(a, b): boolean;
```

Defined in: [utils.ts:261](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L261)

Check if two grid positions are touching (edges or corners).

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | [`GridStackPosition`](#gridstackposition) | first position |
| `b` | [`GridStackPosition`](#gridstackposition) | second position |

###### Returns

`boolean`

true if the positions are touching

###### Example

```ts
const touching = Utils.isTouching(
  {x: 0, y: 0, w: 2, h: 1},
  {x: 2, y: 0, w: 1, h: 1}
); // true - they share an edge
```

##### lazyLoad()

```ts
static lazyLoad(n): boolean;
```

Defined in: [utils.ts:191](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L191)

Check if a widget should be lazy loaded based on node or grid settings.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n` | [`GridStackNode`](#gridstacknode-2) | the grid node to check |

###### Returns

`boolean`

true if the item should be lazy loaded

###### Example

```ts
if (Utils.lazyLoad(node)) {
  // Set up intersection observer for lazy loading
}
```

##### parseHeight()

```ts
static parseHeight(val): HeightData;
```

Defined in: [utils.ts:388](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L388)

Parse a height value with units into numeric value and unit string.
Supports px, em, rem, vh, vw, %, cm, mm units.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `val` | [`numberOrString`](#numberorstring) | height value as number or string with units |

###### Returns

[`HeightData`](#heightdata)

object with h (height) and unit properties

###### Example

```ts
Utils.parseHeight('100px');  // {h: 100, unit: 'px'}
Utils.parseHeight('2rem');   // {h: 2, unit: 'rem'}
Utils.parseHeight(50);       // {h: 50, unit: 'px'}
```

##### removeInternalAndSame()

```ts
static removeInternalAndSame(a, b): void;
```

Defined in: [utils.ts:503](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L503)

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

Defined in: [utils.ts:520](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L520)

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

Defined in: [utils.ts:553](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L553)

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

Defined in: [utils.ts:450](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L450)

Compare two objects for equality (shallow comparison).
Checks if objects have the same fields and values at one level deep.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | `unknown` | first object to compare |
| `b` | `unknown` | second object to compare |

###### Returns

`boolean`

true if objects have the same values

###### Example

```ts
Utils.same({x: 1, y: 2}, {x: 1, y: 2}); // true
Utils.same({x: 1}, {x: 1, y: 2}); // false
```

##### samePos()

```ts
static samePos(a, b): boolean;
```

Defined in: [utils.ts:489](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L489)

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

Defined in: [utils.ts:494](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L494)

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

Defined in: [utils.ts:225](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L225)

Check if a widget should resize to fit its content.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `n` | [`GridStackNode`](#gridstacknode-2) | `undefined` | the grid node to check (can be undefined) |
| `strict` | `boolean` | `false` | if true, only returns true for explicit sizeToContent:true (not numbers) |

###### Returns

`boolean`

true if the widget should resize to content

###### Example

```ts
if (Utils.shouldSizeToContent(node)) {
  // Trigger content-based resizing
}
```

##### simulateMouseEvent()

```ts
static simulateMouseEvent(
   e, 
   simulatedType, 
   target?): void;
```

Defined in: [utils.ts:734](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L734)

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

Defined in: [utils.ts:312](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L312)

Sort an array of grid nodes by position (y first, then x).

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `nodes` | [`GridStackNode`](#gridstacknode-2)[] | `undefined` | array of nodes to sort |
| `dir` | `-1` \| `1` | `1` | sort direction: 1 for ascending (top-left first), -1 for descending |

###### Returns

[`GridStackNode`](#gridstacknode-2)[]

the sorted array (modifies original)

###### Example

```ts
const sorted = Utils.sort(nodes); // Sort top-left to bottom-right
const reverse = Utils.sort(nodes, -1); // Sort bottom-right to top-left
```

##### swap()

```ts
static swap(
   o, 
   a, 
   b): void;
```

Defined in: [utils.ts:785](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L785)

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

Defined in: [utils.ts:543](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L543)

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

Defined in: [utils.ts:350](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L350)

Convert various value types to boolean.
Handles strings like 'false', 'no', '0' as false.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | `unknown` | value to convert |

###### Returns

`boolean`

boolean representation

###### Example

```ts
Utils.toBool('true');  // true
Utils.toBool('false'); // false
Utils.toBool('no');    // false
Utils.toBool('1');     // true
```

##### toNumber()

```ts
static toNumber(value): number;
```

Defined in: [utils.ts:372](https://github.com/adumesny/gridstack.js/blob/master/src/utils.ts#L372)

Convert a string value to a number, handling null and empty strings.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | string or null value to convert |

###### Returns

`number`

number value, or undefined for null/empty strings

###### Example

```ts
Utils.toNumber('42');  // 42
Utils.toNumber('');    // undefined
Utils.toNumber(null);  // undefined
```

## Interfaces

<a id="gridstackoptions"></a>
### GridStackOptions

Defined in: [types.ts:184](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L184)

Defines the options for a Grid

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="acceptwidgets"></a> `acceptWidgets?` | `string` \| `boolean` \| (`element`) => `boolean` | Accept widgets dragged from other grids or from outside (default: `false`). Can be: - `true`: will accept HTML elements having 'grid-stack-item' as class attribute - `false`: will not accept any external widgets - string: explicit class name to accept instead of default - function: callback called before an item will be accepted when entering a grid **Example** `// Accept all grid items acceptWidgets: true // Accept only items with specific class acceptWidgets: 'my-draggable-item' // Custom validation function acceptWidgets: (el) => { return el.getAttribute('data-accept') === 'true'; }` **See** [http://gridstack.github.io/gridstack.js/demo/two.html](http://gridstack.github.io/gridstack.js/demo/two.html) for complete example | [types.ts:206](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L206) |
| <a id="alwaysshowresizehandle"></a> `alwaysShowResizeHandle?` | `boolean` \| `"mobile"` | possible values (default: `mobile`) - does not apply to non-resizable widgets `false` the resizing handles are only shown while hovering over a widget `true` the resizing handles are always shown 'mobile' if running on a mobile device, default to `true` (since there is no hovering per say), else `false`. See [example](http://gridstack.github.io/gridstack.js/demo/mobile.html) | [types.ts:213](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L213) |
| <a id="animate"></a> `animate?` | `boolean` | turns animation on (default?: true) | [types.ts:216](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L216) |
| <a id="auto"></a> `auto?` | `boolean` | if false gridstack will not initialize existing items (default?: true) | [types.ts:219](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L219) |
| <a id="cellheight-3"></a> `cellHeight?` | [`numberOrString`](#numberorstring) | One cell height (default: 'auto'). Can be: - an integer (px): fixed pixel height - a string (ex: '100px', '10em', '10rem'): CSS length value - 0: library will not generate styles for rows (define your own CSS) - 'auto': height calculated for square cells (width / column) and updated live on window resize - 'initial': similar to 'auto' but stays fixed size during window resizing Note: % values don't work correctly - see demo/cell-height.html **Example** `// Fixed 100px height cellHeight: 100 // CSS units cellHeight: '5rem' cellHeight: '100px' // Auto-sizing for square cells cellHeight: 'auto' // No CSS generation (custom styles) cellHeight: 0` | [types.ts:245](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L245) |
| <a id="cellheightthrottle"></a> `cellHeightThrottle?` | `number` | throttle time delay (in ms) used when cellHeight='auto' to improve performance vs usability (default?: 100). A value of 0 will make it instant at a cost of re-creating the CSS file at ever window resize event! | [types.ts:250](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L250) |
| <a id="cellheightunit"></a> `cellHeightUnit?` | `string` | (internal) unit for cellHeight (default? 'px') which is set when a string cellHeight with a unit is passed (ex: '10rem') | [types.ts:253](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L253) |
| <a id="children"></a> `children?` | [`GridStackWidget`](#gridstackwidget)[] | list of children item to create when calling load() or addGrid() | [types.ts:256](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L256) |
| <a id="class"></a> `class?` | `string` | additional class on top of '.grid-stack' (which is required for our CSS) to differentiate this instance. Note: only used by addGrid(), else your element should have the needed class | [types.ts:269](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L269) |
| <a id="column-4"></a> `column?` | `number` \| `"auto"` | number of columns (default?: 12). Note: IF you change this, CSS also have to change. See https://github.com/gridstack/gridstack.js#change-grid-columns. Note: for nested grids, it is recommended to use 'auto' which will always match the container grid-item current width (in column) to keep inside and outside items always the same. flag is NOT supported for regular non-nested grids. | [types.ts:262](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L262) |
| <a id="columnopts"></a> `columnOpts?` | [`Responsive`](#responsive) | responsive column layout for width:column behavior | [types.ts:265](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L265) |
| <a id="disabledrag"></a> `disableDrag?` | `boolean` | disallows dragging of widgets (default?: false) | [types.ts:272](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L272) |
| <a id="disableresize"></a> `disableResize?` | `boolean` | disallows resizing of widgets (default?: false). | [types.ts:275](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L275) |
| <a id="draggable-3"></a> `draggable?` | [`DDDragOpt`](#dddragopt) | allows to override UI draggable options. (default?: { handle?: '.grid-stack-item-content', appendTo?: 'body' }) | [types.ts:278](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L278) |
| <a id="engineclass-1"></a> `engineClass?` | *typeof* [`GridStackEngine`](#gridstackengine-2) | the type of engine to create (so you can subclass) default to GridStackEngine | [types.ts:284](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L284) |
| <a id="float-4"></a> `float?` | `boolean` | enable floating widgets (default?: false) See example (http://gridstack.github.io/gridstack.js/demo/float.html) | [types.ts:287](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L287) |
| <a id="handle-1"></a> `handle?` | `string` | draggable handle selector (default?: '.grid-stack-item-content') | [types.ts:290](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L290) |
| <a id="handleclass"></a> `handleClass?` | `string` | draggable handle class (e.g. 'grid-stack-item-content'). If set 'handle' is ignored (default?: null) | [types.ts:293](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L293) |
| <a id="itemclass"></a> `itemClass?` | `string` | additional widget class (default?: 'grid-stack-item') | [types.ts:296](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L296) |
| <a id="layout-1"></a> `layout?` | [`ColumnOptions`](#columnoptions) | re-layout mode when we're a subgrid and we are being resized. default to 'list' | [types.ts:299](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L299) |
| <a id="lazyload-1"></a> `lazyLoad?` | `boolean` | true when widgets are only created when they scroll into view (visible) | [types.ts:302](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L302) |
| <a id="margin-2"></a> `margin?` | [`numberOrString`](#numberorstring) | gap between grid item and content (default?: 10). This will set all 4 sides and support the CSS formats below an integer (px) a string with possible units (ex: '2em', '20px', '2rem') string with space separated values (ex: '5px 10px 0 20px' for all 4 sides, or '5em 10em' for top/bottom and left/right pairs like CSS). Note: all sides must have same units (last one wins, default px) | [types.ts:311](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L311) |
| <a id="marginbottom-1"></a> `marginBottom?` | [`numberOrString`](#numberorstring) | - | [types.ts:316](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L316) |
| <a id="marginleft-1"></a> `marginLeft?` | [`numberOrString`](#numberorstring) | - | [types.ts:317](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L317) |
| <a id="marginright-1"></a> `marginRight?` | [`numberOrString`](#numberorstring) | - | [types.ts:315](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L315) |
| <a id="margintop-1"></a> `marginTop?` | [`numberOrString`](#numberorstring) | OLD way to optionally set each side - use margin: '5px 10px 0 20px' instead. Used internally to store each side. | [types.ts:314](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L314) |
| <a id="marginunit"></a> `marginUnit?` | `string` | (internal) unit for margin (default? 'px') set when `margin` is set as string with unit (ex: 2rem') | [types.ts:320](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L320) |
| <a id="maxrow-2"></a> `maxRow?` | `number` | maximum rows amount. Default? is 0 which means no maximum rows | [types.ts:323](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L323) |
| <a id="minrow"></a> `minRow?` | `number` | minimum rows amount which is handy to prevent grid from collapsing when empty. Default is `0`. When no set the `min-height` CSS attribute on the grid div (in pixels) can be used, which will round to the closest row. | [types.ts:328](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L328) |
| <a id="nonce"></a> `nonce?` | `string` | If you are using a nonce-based Content Security Policy, pass your nonce here and GridStack will add it to the `<style>` elements it creates. | [types.ts:332](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L332) |
| <a id="placeholderclass"></a> `placeholderClass?` | `string` | class for placeholder (default?: 'grid-stack-placeholder') | [types.ts:335](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L335) |
| <a id="placeholdertext"></a> `placeholderText?` | `string` | placeholder default content (default?: '') | [types.ts:338](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L338) |
| <a id="removable"></a> `removable?` | `string` \| `boolean` | if true widgets could be removed by dragging outside of the grid. It could also be a selector string (ex: ".trash"), in this case widgets will be removed by dropping them there (default?: false) See example (http://gridstack.github.io/gridstack.js/demo/two.html) | [types.ts:348](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L348) |
| <a id="removableoptions"></a> `removableOptions?` | [`DDRemoveOpt`](#ddremoveopt) | allows to override UI removable options. (default?: { accept: '.grid-stack-item' }) | [types.ts:351](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L351) |
| <a id="resizable-4"></a> `resizable?` | [`DDResizeOpt`](#ddresizeopt) | allows to override UI resizable options. default is { handles: 'se', autoHide: true on desktop, false on mobile } | [types.ts:341](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L341) |
| <a id="row"></a> `row?` | `number` | fix grid number of rows. This is a shortcut of writing `minRow:N, maxRow:N`. (default `0` no constrain) | [types.ts:354](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L354) |
| <a id="rtl"></a> `rtl?` | `boolean` \| `"auto"` | if true turns grid to RTL. Possible values are true, false, 'auto' (default?: 'auto') See [example](http://gridstack.github.io/gridstack.js/demo/right-to-left(rtl).html) | [types.ts:360](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L360) |
| <a id="sizetocontent-1"></a> `sizeToContent?` | `boolean` | set to true if all grid items (by default, but item can also override) height should be based on content size instead of WidgetItem.h to avoid v-scrollbars. Note: this is still row based, not pixels, so it will use ceil(getBoundingClientRect().height / getCellHeight()) | [types.ts:365](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L365) |
| <a id="staticgrid"></a> `staticGrid?` | `boolean` | makes grid static (default?: false). If `true` widgets are not movable/resizable. You don't even need draggable/resizable. A CSS class 'grid-stack-static' is also added to the element. | [types.ts:372](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L372) |
| <a id="styleinhead"></a> ~~`styleInHead?`~~ | `boolean` | **Deprecated** Not used anymore, styles are now implemented with local CSS variables | [types.ts:377](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L377) |
| <a id="subgriddynamic"></a> `subGridDynamic?` | `boolean` | enable/disable the creation of sub-grids on the fly by dragging items completely over others (nest) vs partially (push). Forces `DDDragOpt.pause=true` to accomplish that. | [types.ts:384](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L384) |
| <a id="subgridopts-1"></a> `subGridOpts?` | [`GridStackOptions`](#gridstackoptions) | list of differences in options for automatically created sub-grids under us (inside our grid-items) | [types.ts:380](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L380) |

***

<a id="abstract-ddbaseimplement"></a>
### `abstract` DDBaseImplement

Defined in: [dd-base-impl.ts:17](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L17)

Abstract base class for all drag & drop implementations.
Provides common functionality for event handling, enable/disable state,
and lifecycle management used by draggable, droppable, and resizable implementations.

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

Defined in: [dd-base-impl.ts:22](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L22)

Returns the current disabled state.
Note: Use enable()/disable() methods to change state as other operations need to happen.

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

Defined in: [dd-base-impl.ts:70](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L70)

Destroy this drag & drop implementation and clean up resources.
Removes all event handlers and clears internal state.

###### Returns

`void`

##### disable()

```ts
disable(): void;
```

Defined in: [dd-base-impl.ts:62](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L62)

Disable this drag & drop implementation.
Subclasses should override to perform additional cleanup.

###### Returns

`void`

##### enable()

```ts
enable(): void;
```

Defined in: [dd-base-impl.ts:54](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L54)

Enable this drag & drop implementation.
Subclasses should override to perform additional setup.

###### Returns

`void`

##### off()

```ts
off(event): void;
```

Defined in: [dd-base-impl.ts:46](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L46)

Unregister an event callback for the specified event.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `string` | Event name to stop listening for |

###### Returns

`void`

##### on()

```ts
on(event, callback): void;
```

Defined in: [dd-base-impl.ts:37](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L37)

Register an event callback for the specified event.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `string` | Event name to listen for |
| `callback` | [`EventCallback`](#eventcallback) | Function to call when event occurs |

###### Returns

`void`

##### triggerEvent()

```ts
triggerEvent(eventName, event): boolean | void;
```

Defined in: [dd-base-impl.ts:81](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L81)

Trigger a registered event callback if one exists and the implementation is enabled.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | Name of the event to trigger |
| `event` | `Event` | DOM event object to pass to the callback |

###### Returns

`boolean` \| `void`

Result from the callback function, if any

***

<a id="dddraggable"></a>
### DDDraggable

Defined in: [dd-draggable.ts:34](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L34)

Interface for HTML elements extended with drag & drop options.
Used to associate DD configuration with DOM elements.

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

Defined in: [dd-base-impl.ts:22](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L22)

Returns the current disabled state.
Note: Use enable()/disable() methods to change state as other operations need to happen.

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

Destroy this drag & drop implementation and clean up resources.
Removes all event handlers and clears internal state.

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`destroy`](#destroy)

##### disable()

```ts
disable(forDestroy): void;
```

Defined in: [dd-draggable.ts:105](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L105)

Disable this drag & drop implementation.
Subclasses should override to perform additional cleanup.

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

Enable this drag & drop implementation.
Subclasses should override to perform additional setup.

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`enable`](#enable)

##### off()

```ts
off(event): void;
```

Defined in: [dd-draggable.ts:87](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L87)

Unregister an event callback for the specified event.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `DDDragEvent` | Event name to stop listening for |

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`off`](#off)

##### on()

```ts
on(event, callback): void;
```

Defined in: [dd-draggable.ts:83](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L83)

Register an event callback for the specified event.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `DDDragEvent` | Event name to listen for |
| `callback` | (`event`) => `void` | Function to call when event occurs |

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`on`](#on)

##### triggerEvent()

```ts
triggerEvent(eventName, event): boolean | void;
```

Defined in: [dd-base-impl.ts:81](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L81)

Trigger a registered event callback if one exists and the implementation is enabled.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | Name of the event to trigger |
| `event` | `Event` | DOM event object to pass to the callback |

###### Returns

`boolean` \| `void`

Result from the callback function, if any

###### Inherited from

[`DDBaseImplement`](#ddbaseimplement).[`triggerEvent`](#triggerevent)

##### updateOption()

```ts
updateOption(opts): DDDraggable;
```

Defined in: [dd-draggable.ts:129](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L129)

Method to update the options and return the DD implementation

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`DDDragOpt`](#dddragopt) |

###### Returns

[`DDDraggable`](#dddraggable)

###### Implementation of

[`HTMLElementExtendOpt`](#htmlelementextendopt).[`updateOption`](#updateoption-6)

#### Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="el"></a> `el` | `public` | [`GridItemHTMLElement`](#griditemhtmlelement) | `undefined` | The HTML element being extended | [dd-draggable.ts:65](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L65) |
| <a id="helper"></a> `helper` | `public` | `HTMLElement` | `undefined` | - | [dd-draggable.ts:35](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L35) |
| <a id="option"></a> `option` | `public` | [`DDDragOpt`](#dddragopt) | `{}` | The drag & drop options/configuration | [dd-draggable.ts:65](https://github.com/adumesny/gridstack.js/blob/master/src/dd-draggable.ts#L65) |

***

<a id="dddroppable"></a>
### DDDroppable

Defined in: [dd-droppable.ts:23](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L23)

Interface for HTML elements extended with drag & drop options.
Used to associate DD configuration with DOM elements.

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

Defined in: [dd-base-impl.ts:22](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L22)

Returns the current disabled state.
Note: Use enable()/disable() methods to change state as other operations need to happen.

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

Destroy this drag & drop implementation and clean up resources.
Removes all event handlers and clears internal state.

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`destroy`](#destroy)

##### disable()

```ts
disable(forDestroy): void;
```

Defined in: [dd-droppable.ts:57](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L57)

Disable this drag & drop implementation.
Subclasses should override to perform additional cleanup.

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

Defined in: [dd-droppable.ts:143](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L143)

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

Enable this drag & drop implementation.
Subclasses should override to perform additional setup.

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`enable`](#enable)

##### off()

```ts
off(event): void;
```

Defined in: [dd-droppable.ts:40](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L40)

Unregister an event callback for the specified event.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `"drop"` \| `"dropover"` \| `"dropout"` | Event name to stop listening for |

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`off`](#off)

##### on()

```ts
on(event, callback): void;
```

Defined in: [dd-droppable.ts:36](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L36)

Register an event callback for the specified event.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `"drop"` \| `"dropover"` \| `"dropout"` | Event name to listen for |
| `callback` | (`event`) => `void` | Function to call when event occurs |

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`on`](#on)

##### triggerEvent()

```ts
triggerEvent(eventName, event): boolean | void;
```

Defined in: [dd-base-impl.ts:81](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L81)

Trigger a registered event callback if one exists and the implementation is enabled.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | Name of the event to trigger |
| `event` | `Event` | DOM event object to pass to the callback |

###### Returns

`boolean` \| `void`

Result from the callback function, if any

###### Inherited from

[`DDBaseImplement`](#ddbaseimplement).[`triggerEvent`](#triggerevent)

##### updateOption()

```ts
updateOption(opts): DDDroppable;
```

Defined in: [dd-droppable.ts:77](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L77)

Method to update the options and return the DD implementation

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`DDDroppableOpt`](#dddroppableopt) |

###### Returns

[`DDDroppable`](#dddroppable)

###### Implementation of

[`HTMLElementExtendOpt`](#htmlelementextendopt).[`updateOption`](#updateoption-6)

#### Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="accept-1"></a> `accept` | `public` | (`el`) => `boolean` | `undefined` | - | [dd-droppable.ts:25](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L25) |
| <a id="el-1"></a> `el` | `public` | `HTMLElement` | `undefined` | The HTML element being extended | [dd-droppable.ts:27](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L27) |
| <a id="option-1"></a> `option` | `public` | [`DDDroppableOpt`](#dddroppableopt) | `{}` | The drag & drop options/configuration | [dd-droppable.ts:27](https://github.com/adumesny/gridstack.js/blob/master/src/dd-droppable.ts#L27) |

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

Defined in: [dd-gridstack.ts:57](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L57)

HTML Native Mouse and Touch Events Drag and Drop functionality.

This class provides the main drag & drop implementation for GridStack,
handling resizing, dragging, and dropping of grid items using native HTML5 events.
It manages the interaction between different DD components and the grid system.

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

Defined in: [dd-gridstack.ts:120](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L120)

Enable/disable/configure dragging for grid elements.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) | Grid item element(s) to configure |
| `opts` | `any` | Drag options or command ('enable', 'disable', 'destroy', 'option', or config object) |
| `key?` | [`DDKey`](#ddkey) | Option key when using 'option' command |
| `value?` | [`DDValue`](#ddvalue) | Option value when using 'option' command |

###### Returns

[`DDGridStack`](#ddgridstack)

this instance for chaining

###### Example

```ts
dd.draggable(element, 'enable');  // Enable dragging
dd.draggable(element, {handle: '.drag-handle'});  // Configure drag handle
```

##### dragIn()

```ts
dragIn(el, opts): DDGridStack;
```

Defined in: [dd-gridstack.ts:144](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L144)

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

Defined in: [dd-gridstack.ts:149](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L149)

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

Defined in: [dd-gridstack.ts:174](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L174)

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

Defined in: [dd-gridstack.ts:169](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L169)

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

Defined in: [dd-gridstack.ts:179](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L179)

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

Defined in: [dd-gridstack.ts:195](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L195)

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

Defined in: [dd-gridstack.ts:183](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L183)

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

Defined in: [dd-gridstack.ts:72](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L72)

Enable/disable/configure resizing for grid elements.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) | Grid item element(s) to configure |
| `opts` | `any` | Resize options or command ('enable', 'disable', 'destroy', 'option', or config object) |
| `key?` | [`DDKey`](#ddkey) | Option key when using 'option' command |
| `value?` | [`DDValue`](#ddvalue) | Option value when using 'option' command |

###### Returns

[`DDGridStack`](#ddgridstack)

this instance for chaining

###### Example

```ts
dd.resizable(element, 'enable');  // Enable resizing
dd.resizable(element, 'option', 'minWidth', 100);  // Set minimum width
```

***

<a id="ddmanager"></a>
### DDManager

Defined in: [dd-manager.ts:17](https://github.com/adumesny/gridstack.js/blob/master/src/dd-manager.ts#L17)

Global state manager for all Drag & Drop instances.

This class maintains shared state across all drag & drop operations,
ensuring proper coordination between multiple grids and drag/drop elements.
All properties are static to provide global access throughout the DD system.

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
| <a id="dragelement"></a> `dragElement` | `static` | [`DDDraggable`](#dddraggable) | Reference to the element currently being dragged. Used to track the active drag operation across the system. | [dd-manager.ts:36](https://github.com/adumesny/gridstack.js/blob/master/src/dd-manager.ts#L36) |
| <a id="dropelement"></a> `dropElement` | `static` | [`DDDroppable`](#dddroppable) | Reference to the drop target element currently under the cursor. Used to handle drop operations and hover effects. | [dd-manager.ts:42](https://github.com/adumesny/gridstack.js/blob/master/src/dd-manager.ts#L42) |
| <a id="mousehandled"></a> `mouseHandled` | `static` | `boolean` | Flag indicating if a mouse down event was already handled. Prevents multiple handlers from processing the same mouse event. | [dd-manager.ts:30](https://github.com/adumesny/gridstack.js/blob/master/src/dd-manager.ts#L30) |
| <a id="overresizeelement"></a> `overResizeElement` | `static` | [`DDResizable`](#ddresizable-1) | Reference to the element currently being resized. Helps ignore nested grid resize handles during resize operations. | [dd-manager.ts:48](https://github.com/adumesny/gridstack.js/blob/master/src/dd-manager.ts#L48) |
| <a id="pausedrag"></a> `pauseDrag` | `static` | `number` \| `boolean` | Controls drag operation pausing behavior. If set to true or a number (milliseconds), dragging placement and collision detection will only happen after the user pauses movement. This improves performance during rapid mouse movements. | [dd-manager.ts:24](https://github.com/adumesny/gridstack.js/blob/master/src/dd-manager.ts#L24) |

***

<a id="ddresizable-1"></a>
### DDResizable

Defined in: [dd-resizable.ts:32](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L32)

Interface for HTML elements extended with drag & drop options.
Used to associate DD configuration with DOM elements.

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

Defined in: [dd-base-impl.ts:22](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L22)

Returns the current disabled state.
Note: Use enable()/disable() methods to change state as other operations need to happen.

###### Returns

`boolean`

###### Inherited from

[`DDBaseImplement`](#ddbaseimplement).[`disabled`](#disabled)

#### Constructors

##### Constructor

```ts
new DDResizable(el, option): DDResizable;
```

Defined in: [dd-resizable.ts:59](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L59)

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

Defined in: [dd-resizable.ts:89](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L89)

Destroy this drag & drop implementation and clean up resources.
Removes all event handlers and clears internal state.

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`destroy`](#destroy)

##### disable()

```ts
disable(): void;
```

Defined in: [dd-resizable.ts:83](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L83)

Disable this drag & drop implementation.
Subclasses should override to perform additional cleanup.

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`disable`](#disable)

##### enable()

```ts
enable(): void;
```

Defined in: [dd-resizable.ts:77](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L77)

Enable this drag & drop implementation.
Subclasses should override to perform additional setup.

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`enable`](#enable)

##### off()

```ts
off(event): void;
```

Defined in: [dd-resizable.ts:73](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L73)

Unregister an event callback for the specified event.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `"resize"` \| `"resizestart"` \| `"resizestop"` | Event name to stop listening for |

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`off`](#off)

##### on()

```ts
on(event, callback): void;
```

Defined in: [dd-resizable.ts:69](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L69)

Register an event callback for the specified event.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `"resize"` \| `"resizestart"` \| `"resizestop"` | Event name to listen for |
| `callback` | (`event`) => `void` | Function to call when event occurs |

###### Returns

`void`

###### Overrides

[`DDBaseImplement`](#ddbaseimplement).[`on`](#on)

##### triggerEvent()

```ts
triggerEvent(eventName, event): boolean | void;
```

Defined in: [dd-base-impl.ts:81](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L81)

Trigger a registered event callback if one exists and the implementation is enabled.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | Name of the event to trigger |
| `event` | `Event` | DOM event object to pass to the callback |

###### Returns

`boolean` \| `void`

Result from the callback function, if any

###### Inherited from

[`DDBaseImplement`](#ddbaseimplement).[`triggerEvent`](#triggerevent)

##### updateOption()

```ts
updateOption(opts): DDResizable;
```

Defined in: [dd-resizable.ts:96](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L96)

Method to update the options and return the DD implementation

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`DDResizableOpt`](#ddresizableopt) |

###### Returns

[`DDResizable`](#ddresizable-1)

###### Implementation of

[`HTMLElementExtendOpt`](#htmlelementextendopt).[`updateOption`](#updateoption-6)

#### Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="el-3"></a> `el` | `public` | [`GridItemHTMLElement`](#griditemhtmlelement) | `undefined` | The HTML element being extended | [dd-resizable.ts:59](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L59) |
| <a id="option-2"></a> `option` | `public` | [`DDResizableOpt`](#ddresizableopt) | `{}` | The drag & drop options/configuration | [dd-resizable.ts:59](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L59) |

***

<a id="ddresizablehandle"></a>
### DDResizableHandle

Defined in: [dd-resizable-handle.ts:16](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L16)

#### Constructors

##### Constructor

```ts
new DDResizableHandle(
   host, 
   dir, 
   option): DDResizableHandle;
```

Defined in: [dd-resizable-handle.ts:26](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L26)

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

Defined in: [dd-resizable-handle.ts:70](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L70)

call this when resize handle needs to be removed and cleaned up

###### Returns

[`DDResizableHandle`](#ddresizablehandle)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="dir"></a> `dir` | `protected` | `string` | [dd-resizable-handle.ts:26](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L26) |
| <a id="host"></a> `host` | `protected` | [`GridItemHTMLElement`](#griditemhtmlelement) | [dd-resizable-handle.ts:26](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L26) |
| <a id="option-3"></a> `option` | `protected` | [`DDResizableHandleOpt`](#ddresizablehandleopt) | [dd-resizable-handle.ts:26](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L26) |

***

<a id="breakpoint"></a>
### Breakpoint

Defined in: [types.ts:170](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L170)

Defines a responsive breakpoint for automatic column count changes.
Used with the responsive.breakpoints option.

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="c"></a> `c` | `number` | Number of columns to use when this breakpoint is active | [types.ts:174](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L174) |
| <a id="layout"></a> `layout?` | [`ColumnOptions`](#columnoptions) | Layout mode for this specific breakpoint (overrides global responsive.layout) | [types.ts:176](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L176) |
| <a id="w"></a> `w?` | `number` | Maximum width (in pixels) for this breakpoint to be active | [types.ts:172](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L172) |

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

Defined in: [types.ts:483](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L483)

Drag&Drop dragging options

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="appendto"></a> `appendTo?` | `string` | default to 'body' | [types.ts:487](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L487) |
| <a id="cancel"></a> `cancel?` | `string` | prevents dragging from starting on specified elements, listed as comma separated selectors (eg: '.no-drag'). default built in is 'input,textarea,button,select,option' | [types.ts:493](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L493) |
| <a id="drag"></a> `drag?` | (`event`, `ui`) => `void` | - | [types.ts:499](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L499) |
| <a id="handle"></a> `handle?` | `string` | class selector of items that can be dragged. default to '.grid-stack-item-content' | [types.ts:485](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L485) |
| <a id="helper-1"></a> `helper?` | `"clone"` \| (`el`) => `HTMLElement` | helper function when dropping: 'clone' or your own method | [types.ts:495](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L495) |
| <a id="pause"></a> `pause?` | `number` \| `boolean` | if set (true | msec), dragging placement (collision) will only happen after a pause by the user. Note: this is Global | [types.ts:489](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L489) |
| <a id="scroll"></a> `scroll?` | `boolean` | default to `true` | [types.ts:491](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L491) |
| <a id="start"></a> `start?` | (`event`, `ui`) => `void` | callbacks | [types.ts:497](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L497) |
| <a id="stop"></a> `stop?` | (`event`) => `void` | - | [types.ts:498](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L498) |

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

Extended HTMLElement interface for grid items.
All grid item DOM elements implement this interface to provide access to their grid data.

#### Extends

- [`GridItemHTMLElement`](#griditemhtmlelement)

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="ddelement-1"></a> `ddElement?` | [`DDElement`](#ddelement) | - | - | [dd-element.ts:12](https://github.com/adumesny/gridstack.js/blob/master/src/dd-element.ts#L12) |
| <a id="gridstacknode"></a> `gridstackNode?` | [`GridStackNode`](#gridstacknode-2) | Pointer to the associated grid node instance containing position, size, and other widget data | [`GridItemHTMLElement`](#griditemhtmlelement).[`gridstackNode`](#gridstacknode-1) | [types.ts:78](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L78) |

***

<a id="ddremoveopt"></a>
### DDRemoveOpt

Defined in: [types.ts:475](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L475)

Drag&Drop remove options

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="accept-3"></a> `accept?` | `string` | class that can be removed (default?: opts.itemClass) | [types.ts:477](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L477) |
| <a id="decline"></a> `decline?` | `string` | class that cannot be removed (default: 'grid-stack-non-removable') | [types.ts:479](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L479) |

***

<a id="ddresizablehandleopt"></a>
### DDResizableHandleOpt

Defined in: [dd-resizable-handle.ts:9](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L9)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="element"></a> `element?` | `string` \| `HTMLElement` | [dd-resizable-handle.ts:10](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L10) |
| <a id="move"></a> `move?` | (`event`) => `void` | [dd-resizable-handle.ts:12](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L12) |
| <a id="start-1"></a> `start?` | (`event`) => `void` | [dd-resizable-handle.ts:11](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L11) |
| <a id="stop-1"></a> `stop?` | (`event`) => `void` | [dd-resizable-handle.ts:13](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable-handle.ts#L13) |

***

<a id="ddresizableopt"></a>
### DDResizableOpt

Defined in: [dd-resizable.ts:15](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L15)

Drag&Drop resize options

#### Extends

- [`DDResizeOpt`](#ddresizeopt)

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="autohide"></a> `autoHide?` | `boolean` | do resize handle hide by default until mouse over. default: true on desktop, false on mobile | [`DDResizeOpt`](#ddresizeopt).[`autoHide`](#autohide-1) | [types.ts:461](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L461) |
| <a id="element-1"></a> `element?` | `string` \| `HTMLElement` | Custom element or query inside the widget node that is used instead of the generated resize handle. | [`DDResizeOpt`](#ddresizeopt).[`element`](#element-2) | [types.ts:471](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L471) |
| <a id="handles"></a> `handles?` | `string` | sides where you can resize from (ex: 'e, se, s, sw, w') - default 'se' (south-east) Note: it is not recommended to resize from the top sides as weird side effect may occur. | [`DDResizeOpt`](#ddresizeopt).[`handles`](#handles-1) | [types.ts:466](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L466) |
| <a id="maxheight"></a> `maxHeight?` | `number` | - | - | [dd-resizable.ts:16](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L16) |
| <a id="maxheightmoveup"></a> `maxHeightMoveUp?` | `number` | - | - | [dd-resizable.ts:17](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L17) |
| <a id="maxwidth"></a> `maxWidth?` | `number` | - | - | [dd-resizable.ts:18](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L18) |
| <a id="maxwidthmoveleft"></a> `maxWidthMoveLeft?` | `number` | - | - | [dd-resizable.ts:19](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L19) |
| <a id="minheight"></a> `minHeight?` | `number` | - | - | [dd-resizable.ts:20](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L20) |
| <a id="minwidth"></a> `minWidth?` | `number` | - | - | [dd-resizable.ts:21](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L21) |
| <a id="resize"></a> `resize?` | (`event`, `ui`) => `void` | - | - | [dd-resizable.ts:24](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L24) |
| <a id="start-2"></a> `start?` | (`event`, `ui`) => `void` | - | - | [dd-resizable.ts:22](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L22) |
| <a id="stop-2"></a> `stop?` | (`event`) => `void` | - | - | [dd-resizable.ts:23](https://github.com/adumesny/gridstack.js/blob/master/src/dd-resizable.ts#L23) |

***

<a id="ddresizeopt"></a>
### DDResizeOpt

Defined in: [types.ts:459](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L459)

Drag&Drop resize options

#### Extended by

- [`DDResizableOpt`](#ddresizableopt)

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="autohide-1"></a> `autoHide?` | `boolean` | do resize handle hide by default until mouse over. default: true on desktop, false on mobile | [types.ts:461](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L461) |
| <a id="element-2"></a> `element?` | `string` \| `HTMLElement` | Custom element or query inside the widget node that is used instead of the generated resize handle. | [types.ts:471](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L471) |
| <a id="handles-1"></a> `handles?` | `string` | sides where you can resize from (ex: 'e, se, s, sw, w') - default 'se' (south-east) Note: it is not recommended to resize from the top sides as weird side effect may occur. | [types.ts:466](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L466) |

***

<a id="dduidata"></a>
### DDUIData

Defined in: [types.ts:512](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L512)

data that is passed during drag and resizing callbacks

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="draggable-2"></a> `draggable?` | `HTMLElement` | [types.ts:515](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L515) |
| <a id="position"></a> `position?` | [`Position`](#position-1) | [types.ts:513](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L513) |
| <a id="size"></a> `size?` | [`Size`](#size-1) | [types.ts:514](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L514) |

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

Defined in: [types.ts:76](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L76)

Extended HTMLElement interface for grid items.
All grid item DOM elements implement this interface to provide access to their grid data.

#### Extends

- `HTMLElement`

#### Extended by

- [`DDElementHost`](#ddelementhost)

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="gridstacknode-1"></a> `gridstackNode?` | [`GridStackNode`](#gridstacknode-2) | Pointer to the associated grid node instance containing position, size, and other widget data | [types.ts:78](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L78) |

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

Defined in: [types.ts:388](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L388)

options used during GridStackEngine.moveNode()

#### Extends

- [`GridStackPosition`](#gridstackposition)

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cellheight-2"></a> `cellHeight?` | `number` | - | - | [types.ts:397](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L397) |
| <a id="cellwidth-2"></a> `cellWidth?` | `number` | vars to calculate other cells coordinates | - | [types.ts:396](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L396) |
| <a id="collide-2"></a> `collide?` | [`GridStackNode`](#gridstacknode-2) | best node (most coverage) we collied with | - | [types.ts:407](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L407) |
| <a id="forcecollide"></a> `forceCollide?` | `boolean` | for collision check even if we don't move | - | [types.ts:409](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L409) |
| <a id="h"></a> `h?` | `number` | widget dimension height (default?: 1) | [`GridStackPosition`](#gridstackposition).[`h`](#h-2) | [types.ts:420](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L420) |
| <a id="marginbottom"></a> `marginBottom?` | `number` | - | - | [types.ts:399](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L399) |
| <a id="marginleft"></a> `marginLeft?` | `number` | - | - | [types.ts:400](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L400) |
| <a id="marginright"></a> `marginRight?` | `number` | - | - | [types.ts:401](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L401) |
| <a id="margintop"></a> `marginTop?` | `number` | - | - | [types.ts:398](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L398) |
| <a id="nested"></a> `nested?` | `boolean` | true if we are calling this recursively to prevent simple swap or coverage collision - default false | - | [types.ts:394](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L394) |
| <a id="pack"></a> `pack?` | `boolean` | do we pack (default true) | - | [types.ts:392](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L392) |
| <a id="rect"></a> `rect?` | [`GridStackPosition`](#gridstackposition) | position in pixels of the currently dragged items (for overlap check) | - | [types.ts:403](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L403) |
| <a id="resizing"></a> `resizing?` | `boolean` | true if we're live resizing | - | [types.ts:405](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L405) |
| <a id="skip"></a> `skip?` | [`GridStackNode`](#gridstacknode-2) | node to skip collision | - | [types.ts:390](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L390) |
| <a id="w-1"></a> `w?` | `number` | widget dimension width (default?: 1) | [`GridStackPosition`](#gridstackposition).[`w`](#w-3) | [types.ts:418](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L418) |
| <a id="x-1"></a> `x?` | `number` | widget position x (default?: 0) | [`GridStackPosition`](#gridstackposition).[`x`](#x-3) | [types.ts:414](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L414) |
| <a id="y-1"></a> `y?` | `number` | widget position y (default?: 0) | [`GridStackPosition`](#gridstackposition).[`y`](#y-3) | [types.ts:416](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L416) |

***

<a id="gridstacknode-2"></a>
### GridStackNode

Defined in: [types.ts:529](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L529)

internal runtime descriptions describing the widgets in the grid

#### Extends

- [`GridStackWidget`](#gridstackwidget)

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="autoposition"></a> `autoPosition?` | `boolean` | if true then x, y parameters will be ignored and widget will be places on the first available position (default?: false) | [`GridStackWidget`](#gridstackwidget).[`autoPosition`](#autoposition-1) | [types.ts:428](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L428) |
| <a id="content"></a> `content?` | `string` | html to append inside as content | [`GridStackWidget`](#gridstackwidget).[`content`](#content-1) | [types.ts:446](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L446) |
| <a id="el-5"></a> `el?` | [`GridItemHTMLElement`](#griditemhtmlelement) | pointer back to HTML element | - | [types.ts:531](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L531) |
| <a id="grid"></a> `grid?` | [`GridStack`](#gridstack-1) | pointer back to parent Grid instance | - | [types.ts:533](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L533) |
| <a id="h-1"></a> `h?` | `number` | widget dimension height (default?: 1) | [`GridStackWidget`](#gridstackwidget).[`h`](#h-3) | [types.ts:420](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L420) |
| <a id="id"></a> `id?` | `string` | value for `gs-id` stored on the widget (default?: undefined) | [`GridStackWidget`](#gridstackwidget).[`id`](#id-1) | [types.ts:444](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L444) |
| <a id="lazyload"></a> `lazyLoad?` | `boolean` | true when widgets are only created when they scroll into view (visible) | [`GridStackWidget`](#gridstackwidget).[`lazyLoad`](#lazyload-2) | [types.ts:448](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L448) |
| <a id="locked"></a> `locked?` | `boolean` | prevents being pushed by other widgets or api (default?: undefined = un-constrained), which is different from `noMove` (user action only) | [`GridStackWidget`](#gridstackwidget).[`locked`](#locked-1) | [types.ts:442](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L442) |
| <a id="maxh"></a> `maxH?` | `number` | maximum height allowed during resize/creation (default?: undefined = un-constrained) | [`GridStackWidget`](#gridstackwidget).[`maxH`](#maxh-1) | [types.ts:436](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L436) |
| <a id="maxw"></a> `maxW?` | `number` | maximum width allowed during resize/creation (default?: undefined = un-constrained) | [`GridStackWidget`](#gridstackwidget).[`maxW`](#maxw-1) | [types.ts:432](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L432) |
| <a id="minh"></a> `minH?` | `number` | minimum height allowed during resize/creation (default?: undefined = un-constrained) | [`GridStackWidget`](#gridstackwidget).[`minH`](#minh-1) | [types.ts:434](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L434) |
| <a id="minw"></a> `minW?` | `number` | minimum width allowed during resize/creation (default?: undefined = un-constrained) | [`GridStackWidget`](#gridstackwidget).[`minW`](#minw-1) | [types.ts:430](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L430) |
| <a id="nomove"></a> `noMove?` | `boolean` | prevents direct moving by the user (default?: undefined = un-constrained) | [`GridStackWidget`](#gridstackwidget).[`noMove`](#nomove-1) | [types.ts:440](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L440) |
| <a id="noresize"></a> `noResize?` | `boolean` | prevent direct resizing by the user (default?: undefined = un-constrained) | [`GridStackWidget`](#gridstackwidget).[`noResize`](#noresize-1) | [types.ts:438](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L438) |
| <a id="resizetocontentparent-1"></a> `resizeToContentParent?` | `string` | local override of GridStack.resizeToContentParent that specify the class to use for the parent (actual) vs child (wanted) height | [`GridStackWidget`](#gridstackwidget).[`resizeToContentParent`](#resizetocontentparent-2) | [types.ts:453](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L453) |
| <a id="sizetocontent"></a> `sizeToContent?` | `number` \| `boolean` | local (vs grid) override - see GridStackOptions. Note: This also allow you to set a maximum h value (but user changeable during normal resizing) to prevent unlimited content from taking too much space (get scrollbar) | [`GridStackWidget`](#gridstackwidget).[`sizeToContent`](#sizetocontent-2) | [types.ts:451](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L451) |
| <a id="subgrid"></a> `subGrid?` | [`GridStack`](#gridstack-1) | actual sub-grid instance | - | [types.ts:535](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L535) |
| <a id="subgridopts"></a> `subGridOpts?` | [`GridStackOptions`](#gridstackoptions) | optional nested grid options and list of children, which then turns into actual instance at runtime to get options from | [`GridStackWidget`](#gridstackwidget).[`subGridOpts`](#subgridopts-2) | [types.ts:455](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L455) |
| <a id="visibleobservable"></a> `visibleObservable?` | `IntersectionObserver` | allow delay creation when visible | - | [types.ts:537](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L537) |
| <a id="w-2"></a> `w?` | `number` | widget dimension width (default?: 1) | [`GridStackWidget`](#gridstackwidget).[`w`](#w-4) | [types.ts:418](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L418) |
| <a id="x-2"></a> `x?` | `number` | widget position x (default?: 0) | [`GridStackWidget`](#gridstackwidget).[`x`](#x-4) | [types.ts:414](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L414) |
| <a id="y-2"></a> `y?` | `number` | widget position y (default?: 0) | [`GridStackWidget`](#gridstackwidget).[`y`](#y-4) | [types.ts:416](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L416) |

***

<a id="gridstackposition"></a>
### GridStackPosition

Defined in: [types.ts:412](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L412)

#### Extended by

- [`GridStackMoveOpts`](#gridstackmoveopts)
- [`GridStackWidget`](#gridstackwidget)

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="h-2"></a> `h?` | `number` | widget dimension height (default?: 1) | [types.ts:420](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L420) |
| <a id="w-3"></a> `w?` | `number` | widget dimension width (default?: 1) | [types.ts:418](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L418) |
| <a id="x-3"></a> `x?` | `number` | widget position x (default?: 0) | [types.ts:414](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L414) |
| <a id="y-3"></a> `y?` | `number` | widget position y (default?: 0) | [types.ts:416](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L416) |

***

<a id="gridstackwidget"></a>
### GridStackWidget

Defined in: [types.ts:426](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L426)

GridStack Widget creation options

#### Extends

- [`GridStackPosition`](#gridstackposition)

#### Extended by

- [`GridStackNode`](#gridstacknode-2)

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="autoposition-1"></a> `autoPosition?` | `boolean` | if true then x, y parameters will be ignored and widget will be places on the first available position (default?: false) | - | [types.ts:428](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L428) |
| <a id="content-1"></a> `content?` | `string` | html to append inside as content | - | [types.ts:446](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L446) |
| <a id="h-3"></a> `h?` | `number` | widget dimension height (default?: 1) | [`GridStackPosition`](#gridstackposition).[`h`](#h-2) | [types.ts:420](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L420) |
| <a id="id-1"></a> `id?` | `string` | value for `gs-id` stored on the widget (default?: undefined) | - | [types.ts:444](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L444) |
| <a id="lazyload-2"></a> `lazyLoad?` | `boolean` | true when widgets are only created when they scroll into view (visible) | - | [types.ts:448](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L448) |
| <a id="locked-1"></a> `locked?` | `boolean` | prevents being pushed by other widgets or api (default?: undefined = un-constrained), which is different from `noMove` (user action only) | - | [types.ts:442](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L442) |
| <a id="maxh-1"></a> `maxH?` | `number` | maximum height allowed during resize/creation (default?: undefined = un-constrained) | - | [types.ts:436](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L436) |
| <a id="maxw-1"></a> `maxW?` | `number` | maximum width allowed during resize/creation (default?: undefined = un-constrained) | - | [types.ts:432](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L432) |
| <a id="minh-1"></a> `minH?` | `number` | minimum height allowed during resize/creation (default?: undefined = un-constrained) | - | [types.ts:434](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L434) |
| <a id="minw-1"></a> `minW?` | `number` | minimum width allowed during resize/creation (default?: undefined = un-constrained) | - | [types.ts:430](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L430) |
| <a id="nomove-1"></a> `noMove?` | `boolean` | prevents direct moving by the user (default?: undefined = un-constrained) | - | [types.ts:440](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L440) |
| <a id="noresize-1"></a> `noResize?` | `boolean` | prevent direct resizing by the user (default?: undefined = un-constrained) | - | [types.ts:438](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L438) |
| <a id="resizetocontentparent-2"></a> `resizeToContentParent?` | `string` | local override of GridStack.resizeToContentParent that specify the class to use for the parent (actual) vs child (wanted) height | - | [types.ts:453](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L453) |
| <a id="sizetocontent-2"></a> `sizeToContent?` | `number` \| `boolean` | local (vs grid) override - see GridStackOptions. Note: This also allow you to set a maximum h value (but user changeable during normal resizing) to prevent unlimited content from taking too much space (get scrollbar) | - | [types.ts:451](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L451) |
| <a id="subgridopts-2"></a> `subGridOpts?` | [`GridStackOptions`](#gridstackoptions) | optional nested grid options and list of children, which then turns into actual instance at runtime to get options from | - | [types.ts:455](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L455) |
| <a id="w-4"></a> `w?` | `number` | widget dimension width (default?: 1) | [`GridStackPosition`](#gridstackposition).[`w`](#w-3) | [types.ts:418](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L418) |
| <a id="x-4"></a> `x?` | `number` | widget position x (default?: 0) | [`GridStackPosition`](#gridstackposition).[`x`](#x-3) | [types.ts:414](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L414) |
| <a id="y-4"></a> `y?` | `number` | widget position y (default?: 0) | [`GridStackPosition`](#gridstackposition).[`y`](#y-3) | [types.ts:416](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L416) |

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

Defined in: [dd-base-impl.ts:91](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L91)

Interface for HTML elements extended with drag & drop options.
Used to associate DD configuration with DOM elements.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Methods

##### updateOption()

```ts
updateOption(T): DDBaseImplement;
```

Defined in: [dd-base-impl.ts:97](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L97)

Method to update the options and return the DD implementation

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `T` | `any` |

###### Returns

[`DDBaseImplement`](#ddbaseimplement)

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="el-6"></a> `el` | `HTMLElement` | The HTML element being extended | [dd-base-impl.ts:93](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L93) |
| <a id="option-4"></a> `option` | `T` | The drag & drop options/configuration | [dd-base-impl.ts:95](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L95) |

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

Defined in: [types.ts:505](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L505)

#### Extended by

- [`Rect`](#rect-1)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="left-1"></a> `left` | `number` | [types.ts:507](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L507) |
| <a id="top-1"></a> `top` | `number` | [types.ts:506](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L506) |

***

<a id="rect-1"></a>
### Rect

Defined in: [types.ts:509](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L509)

#### Extends

- [`Size`](#size-1).[`Position`](#position-1)

#### Properties

| Property | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="height"></a> `height` | `number` | [`Size`](#size-1).[`height`](#height-1) | [types.ts:503](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L503) |
| <a id="left-2"></a> `left` | `number` | [`Position`](#position-1).[`left`](#left-1) | [types.ts:507](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L507) |
| <a id="top-2"></a> `top` | `number` | [`Position`](#position-1).[`top`](#top-1) | [types.ts:506](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L506) |
| <a id="width"></a> `width` | `number` | [`Size`](#size-1).[`width`](#width-1) | [types.ts:502](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L502) |

***

<a id="responsive"></a>
### Responsive

Defined in: [types.ts:153](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L153)

Configuration for responsive grid behavior.

Defines how the grid responds to different screen sizes by changing column counts.
NOTE: Make sure to include the appropriate CSS (gridstack-extra.css) to support responsive behavior.

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="breakpointforwindow"></a> `breakpointForWindow?` | `boolean` | specify if breakpoints are for window size or grid size (default:false = grid) | [types.ts:161](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L161) |
| <a id="breakpoints"></a> `breakpoints?` | [`Breakpoint`](#breakpoint)[] | explicit width:column breakpoints instead of automatic 'columnWidth'. NOTE: make sure to have correct extra CSS to support this. | [types.ts:159](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L159) |
| <a id="columnmax"></a> `columnMax?` | `number` | maximum number of columns allowed (default: 12). NOTE: make sure to have correct extra CSS to support this. | [types.ts:157](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L157) |
| <a id="columnwidth"></a> `columnWidth?` | `number` | wanted width to maintain (+-50%) to dynamically pick a column count. NOTE: make sure to have correct extra CSS to support this. | [types.ts:155](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L155) |
| <a id="layout-2"></a> `layout?` | [`ColumnOptions`](#columnoptions) | global re-layout mode when changing columns | [types.ts:163](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L163) |

***

<a id="size-1"></a>
### Size

Defined in: [types.ts:501](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L501)

#### Extended by

- [`Rect`](#rect-1)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="height-1"></a> `height` | `number` | [types.ts:503](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L503) |
| <a id="width-1"></a> `width` | `number` | [types.ts:502](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L502) |

## Variables

<a id="griddefaults"></a>
### gridDefaults

```ts
const gridDefaults: GridStackOptions;
```

Defined in: [types.ts:13](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L13)

Default values for grid options - used during initialization and when saving out grid configuration.
These values are applied when options are not explicitly provided.

## Type Aliases

<a id="addremovefcn"></a>
### AddRemoveFcn()

```ts
type AddRemoveFcn = (parent, w, add, grid) => HTMLElement | undefined;
```

Defined in: [types.ts:119](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L119)

Optional callback function called during load() operations.
Allows custom handling of widget addition/removal for framework integration.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parent` | `HTMLElement` | The parent HTML element |
| `w` | [`GridStackWidget`](#gridstackwidget) | The widget definition |
| `add` | `boolean` | True if adding, false if removing |
| `grid` | `boolean` | True if this is a grid operation |

#### Returns

`HTMLElement` \| `undefined`

The created/modified HTML element, or undefined

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

Defined in: [types.ts:59](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L59)

Different layout options when changing the number of columns.

These options control how widgets are repositioned when the grid column count changes.
Note: The new list may be partially filled if there's a cached layout for that size.

Options:
- `'list'`: Treat items as a sorted list, keeping them sequentially without resizing (unless too big)
- `'compact'`: Similar to list, but uses compact() method to fill empty slots by reordering
- `'moveScale'`: Scale and move items by the ratio of newColumnCount / oldColumnCount
- `'move'`: Only move items, keep their sizes
- `'scale'`: Only scale items, keep their positions
- `'none'`: Leave items unchanged unless they don't fit in the new column count
- Custom function: Provide your own layout logic

***

<a id="compactoptions"></a>
### CompactOptions

```ts
type CompactOptions = "list" | "compact";
```

Defined in: [types.ts:66](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L66)

Options for the compact() method to reclaim empty space.
- `'list'`: Keep items in order, move them up sequentially
- `'compact'`: Find truly empty spaces, may reorder items for optimal fit

***

<a id="ddcallback"></a>
### DDCallback()

```ts
type DDCallback = (event, arg2, helper?) => void;
```

Defined in: [dd-gridstack.ts:46](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L46)

Callback function type for drag & drop events.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `Event` | The DOM event that triggered the callback |
| `arg2` | [`GridItemHTMLElement`](#griditemhtmlelement) | The grid item element being dragged/dropped |
| `helper?` | [`GridItemHTMLElement`](#griditemhtmlelement) | Optional helper element used during drag operations |

#### Returns

`void`

***

<a id="dddropopt"></a>
### DDDropOpt

```ts
type DDDropOpt = object;
```

Defined in: [dd-gridstack.ts:17](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L17)

Drag & Drop options for drop targets.
Configures which elements can be dropped onto a grid.

#### Properties

##### accept()?

```ts
optional accept: (el) => boolean;
```

Defined in: [dd-gridstack.ts:19](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L19)

Function to determine if an element can be dropped (see GridStackOptions.acceptWidgets)

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

Defined in: [dd-gridstack.ts:32](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L32)

Keys for DD configuration options that can be set via the 'option' command.

***

<a id="ddopts"></a>
### DDOpts

```ts
type DDOpts = "enable" | "disable" | "destroy" | "option" | string | any;
```

Defined in: [dd-gridstack.ts:27](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L27)

Drag & Drop operation types used throughout the DD system.
Can be control commands or configuration objects.

***

<a id="ddvalue"></a>
### DDValue

```ts
type DDValue = number | string;
```

Defined in: [dd-gridstack.ts:37](https://github.com/adumesny/gridstack.js/blob/master/src/dd-gridstack.ts#L37)

Values for DD configuration options (numbers or strings with units).

***

<a id="eventcallback"></a>
### EventCallback()

```ts
type EventCallback = (event) => boolean | void;
```

Defined in: [dd-base-impl.ts:10](https://github.com/adumesny/gridstack.js/blob/master/src/dd-base-impl.ts#L10)

Type for event callback functions used in drag & drop operations.
Can return boolean to indicate if the event should continue propagation.

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

Defined in: [types.ts:104](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L104)

Drop event handler that receives previous and new node states

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
type GridStackElement = string | GridItemHTMLElement;
```

Defined in: [types.ts:87](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L87)

Type representing various ways to specify grid elements.
Can be a CSS selector string, GridItemHTMLElement (HTML element with GS variables when loaded).

***

<a id="gridstackelementhandler"></a>
### GridStackElementHandler()

```ts
type GridStackElementHandler = (event, el) => void;
```

Defined in: [types.ts:98](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L98)

Element-specific event handler that receives event and affected element

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

Defined in: [types.ts:95](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L95)

General event handler that receives only the event

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

Defined in: [types.ts:107](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L107)

Union type of all possible event handler types

***

<a id="gridstacknodeshandler"></a>
### GridStackNodesHandler()

```ts
type GridStackNodesHandler = (event, nodes) => void;
```

Defined in: [types.ts:101](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L101)

Node-based event handler that receives event and array of affected nodes

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

Defined in: [types.ts:71](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L71)

Type representing values that can be either numbers or strings (e.g., dimensions with units).
Used for properties like width, height, margins that accept both numeric and string values.

***

<a id="renderfcn"></a>
### RenderFcn()

```ts
type RenderFcn = (el, w) => void;
```

Defined in: [types.ts:137](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L137)

Optional callback function for custom widget content rendering.
Called during load()/addWidget() to create custom content beyond plain text.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `el` | `HTMLElement` | The widget's content container element |
| `w` | [`GridStackWidget`](#gridstackwidget) | The widget definition with content and other properties |

#### Returns

`void`

***

<a id="resizetocontentfcn"></a>
### ResizeToContentFcn()

```ts
type ResizeToContentFcn = (el) => void;
```

Defined in: [types.ts:145](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L145)

Optional callback function for custom resize-to-content behavior.
Called when a widget needs to resize to fit its content.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `el` | [`GridItemHTMLElement`](#griditemhtmlelement) | The grid item element to resize |

#### Returns

`void`

***

<a id="savefcn"></a>
### SaveFcn()

```ts
type SaveFcn = (node, w) => void;
```

Defined in: [types.ts:128](https://github.com/adumesny/gridstack.js/blob/master/src/types.ts#L128)

Optional callback function called during save() operations.
Allows adding custom data to the saved widget structure.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | [`GridStackNode`](#gridstacknode-2) | The internal grid node |
| `w` | [`GridStackWidget`](#gridstackwidget) | The widget structure being saved (can be modified) |

#### Returns

`void`
