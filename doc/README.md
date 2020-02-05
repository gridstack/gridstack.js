gridstack.js API
================

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Options](#options)
- [Grid attributes](#grid-attributes)
- [Item attributes](#item-attributes)
- [Events](#events)
  - [added(event, items)](#addedevent-items)
  - [change(event, items)](#changeevent-items)
  - [disable(event)](#disableevent)
  - [dragstart(event, ui)](#dragstartevent-ui)
  - [dragstop(event, ui)](#dragstopevent-ui)
  - [dropped(event, previousWidget, newWidget)](#droppedevent-previouswidget-newwidget)
  - [enable(event)](#enableevent)
  - [removed(event, items)](#removedevent-items)
  - [resizestart(event, ui)](#resizestartevent-ui)
  - [gsresizestop(event, ui)](#gsresizestopevent-ui)
- [API](#api)
  - [addWidget(el, [options])](#addwidgetel-options)
  - [addWidget(el, [x, y, width, height, autoPosition, minWidth, maxWidth, minHeight, maxHeight, id])](#addwidgetel-x-y-width-height-autoposition-minwidth-maxwidth-minheight-maxheight-id)
  - [batchUpdate()](#batchupdate)
  - [compact()](#compact)
  - [cellHeight()](#cellheight)
  - [cellHeight(val, noUpdate)](#cellheightval-noupdate)
  - [cellWidth()](#cellwidth)
  - [commit()](#commit)
  - [destroy([detachGrid])](#destroydetachgrid)
  - [disable()](#disable)
  - [enable()](#enable)
  - [enableMove(doEnable, includeNewWidgets)](#enablemovedoenable-includenewwidgets)
  - [enableResize(doEnable, includeNewWidgets)](#enableresizedoenable-includenewwidgets)
  - [float(val?)](#floatval)
  - [getCellFromPixel(position[, useOffset])](#getcellfrompixelposition-useoffset)
  - [isAreaEmpty(x, y, width, height)](#isareaemptyx-y-width-height)
  - [locked(el, val)](#lockedel-val)
  - [makeWidget(el)](#makewidgetel)
  - [maxHeight(el, val)](#maxheightel-val)
  - [minHeight(el, val)](#minheightel-val)
  - [maxWidth(el, val)](#maxwidthel-val)
  - [minWidth(el, val)](#minwidthel-val)
  - [movable(el, val)](#movableel-val)
  - [move(el, x, y)](#moveel-x-y)
  - [removeWidget(el[, detachNode])](#removewidgetel-detachnode)
  - [removeAll([detachNode])](#removealldetachnode)
  - [resize(el, width, height)](#resizeel-width-height)
  - [resizable(el, val)](#resizableel-val)
  - [setAnimation(doAnimate)](#setanimationdoanimate)
  - [setColumn(column, doNotPropagate)](#setcolumncolumn-donotpropagate)
  - [setStatic(staticValue)](#setstaticstaticvalue)
  - [update(el, x, y, width, height)](#updateel-x-y-width-height)
  - [verticalMargin()](#verticalmargin)
  - [verticalMargin(value, noUpdate)](#verticalmarginvalue-noupdate)
  - [willItFit(x, y, width, height, autoPosition)](#willitfitx-y-width-height-autoposition)
- [Utils](#utils)
  - [GridStackUI.Utils.sort(nodes[, dir[, width]])](#gridstackuiutilssortnodes-dir-width)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Options

- `acceptWidgets` - accept widgets dragged from other grids or from outside (default: `false`). Can be:
   * `true` (uses `'.grid-stack-item'` class filter) or `false`
   * string for explicit class name
   * function (i: number, element: Element) returning a boolean. See [example](http://gridstack.github.io/gridstack.js/demo/two.html)
- `alwaysShowResizeHandle` - if `true` the resizing handles are shown even if the user is not hovering over the widget
  (default: `false`)
- `animate` - turns animation on (default: `false`)
- `auto` - if `false` gridstack will not initialize existing items (default: `true`)
- `cellHeight` - one cell height (default: `60`). Can be:
  * an integer (px)
  * a string (ex: '100px', '10em', '10rem', '10%')
  * 0 or null, in which case the library will not generate styles for rows. Everything must be defined in CSS files.
  * `'auto'` - height will be calculated to match cell width (initial square grid).
- `column` - number of columns (default: `12`) which can change on the fly with `setColumn()` as well. See [example](http://gridstackjs.com/demo/column.html)
- `ddPlugin` - class that implement drag'n'drop functionallity for gridstack. If `false` grid will be static. (default: `null` - first available plugin will be used)
- `disableDrag` - disallows dragging of widgets (default: `false`).
- `disableOneColumnMode` - disables the onColumnMode when the window width is less than minWidth (default: 'false')
- `disableResize` - disallows resizing of widgets (default: `false`).
- `draggable` - allows to override jQuery UI draggable options. (default: `{handle: '.grid-stack-item-content', scroll: false, appendTo: 'body', containment: null}`)
- `dragOut` to let user drag nested grid items out of a parent or not (default false) See [example](http://gridstackjs.com/demo/nested.html)
- `float` - enable floating widgets (default: `false`) See [example](http://gridstackjs.com/demo/float.html)
- `handle` - draggable handle selector (default: `'.grid-stack-item-content'`)
- `handleClass` - draggable handle class (e.g. `'grid-stack-item-content'`). If set `handle` is ignored (default: `null`)
- `itemClass` - widget class (default: `'grid-stack-item'`)
- `maxRow` - maximum rows amount. Default is `0` which means no maximum rows
- `minWidth` - minimal width. If window width is less than or equal to, grid will be shown in one-column mode (default: `768`)
- `oneColumnModeDomSort` - set to `true` if you want oneColumnMode to use the DOM order and ignore x,y from normal multi column layouts during sorting. This enables you to have custom 1 column layout that differ from the rest. (default?: `false`)
- `placeholderClass` - class for placeholder (default: `'grid-stack-placeholder'`)
- `placeholderText` - placeholder default content (default: `''`)
- `resizable` - allows to override jQuery UI resizable options. (default: `{autoHide: true, handles: 'se'}`)
- `removable` - if `true` widgets could be removed by dragging outside of the grid. It could also be a jQuery selector string, in this case widgets will be removed by dropping them there (default: `false`) See [example](http://gridstackjs.com/demo/two.html)
- `removeTimeout` - time in milliseconds before widget is being removed while dragging outside of the grid. (default: `2000`)
- `rtl` - if `true` turns grid to RTL. Possible values are `true`, `false`, `'auto'` (default: `'auto'`) See [example](http://gridstackjs.com/demo/rtl.html)
- `staticGrid` - makes grid static (default `false`). If true widgets are not movable/resizable. You don't even need jQueryUI draggable/resizable.  A CSS class `grid-stack-static` is also added to the container.
- `verticalMargin` - vertical gap size (default: `20`). Can be:
  * an integer (px)
  * a string (ex: '2em', '20px', '2rem')

## Grid attributes

- `data-gs-animate` - turns animation on
- `data-gs-column` - amount of columns. Setting non-default value must be supported by equivalent change in CSS, [see docs here](https://github.com/gridstack/gridstack.js#change-grid-columns).
- `data-gs-max-row` - maximum rows amount. Default is `0` which means no maximum rows.
- `data-gs-current-height` - current rows amount. Set by the library only. Can be used by the CSS rules.

## Item attributes

- `data-gs-x`, `data-gs-y` - (number) element position in row/column. Note: if one is missing this will `autoPosition` the item
- `data-gs-width`, `data-gs-height` - (number) element size in row/column
- `data-gs-id`- (number | string) good for quick identification (for example in change event)
- `data-gs-max-width`, `data-gs-min-width`, `data-gs-max-height`, `data-gs-min-height` - element constraints in row/column
- `data-gs-no-resize` - disable element resizing
- `data-gs-no-move` - disable element moving
- `data-gs-auto-position` - tells to ignore `data-gs-x` and `data-gs-y` attributes and to place element to the first available position. Having either one missing will also do that.
- `data-gs-locked` - the widget will be locked. It means another widget wouldn't be able to move it during dragging or resizing.
The widget can still be dragged or resized. You need to add `data-gs-no-resize` and `data-gs-no-move` attributes
to completely lock the widget.
- `data-gs-resize-handles` - sets resize handles for a specific widget.

## Events

### added(event, items)

```javascript
$('.grid-stack').on('added', function(event, items) {
  for (var i = 0; i < items.length; i++) {
    console.log('item added');
    console.log(items[i]);
  }
});
```

### change(event, items)

Occurs when adding/removing widgets or existing widgets change their position/size

```javascript
var serializeWidgetMap = function(items) {
  console.log(items);
};

$('.grid-stack').on('change', function(event, items) {
  serializeWidgetMap(items);
});
```

### disable(event)

```javascript
$('.grid-stack').on('disable', function(event) {
  var grid = event.target;
});
```

### dragstart(event, ui)

```javascript
$('.grid-stack').on('dragstart', function(event, ui) {
  var grid = this;
  var element = event.target;
});
```

### dragstop(event, ui)

```javascript
$('.grid-stack').on('dragstop', function(event, ui) {
  var grid = this;
  var element = event.target;
});
```

### dropped(event, previousWidget, newWidget)

```javascript
$('.grid-stack').on('dropped', function(event, previousWidget, newWidget) {
  console.log('Removed widget that was dragged out of grid:', previousWidget);
  console.log('Added widget in dropped grid:', newWidget);
});
```

### enable(event)

```javascript
$('.grid-stack').on('enable', function(event) {
  var grid = event.target;
});
```

### removed(event, items)

```javascript
$('.grid-stack').on('removed', function(event, items) {
  for (var i = 0; i < items.length; i++) {
    console.log('item removed');
    console.log(items[i]);
  }
});
```

### resizestart(event, ui)

```javascript
$('.grid-stack').on('resizestart', function(event, ui) {
  var grid = this;
  var element = event.target;
});
```

### gsresizestop(event, ui)
**Note**: this is a custom event name that is guaranteed to be called
**after** the jqueryui resizestop event where we update `data-gs-width` and `data-gs-height`.

```javascript
$('.grid-stack').on('gsresizestop', function(event, elem) {
  var newHeight = $(elem).attr('data-gs-height');
});
```

## API

### addWidget(el, [options])

Creates new widget and returns it. Options is an object containing the fields x,y,width,height,etc... described below.

### addWidget(el, [x, y, width, height, autoPosition, minWidth, maxWidth, minHeight, maxHeight, id])

Creates new widget and returns it.

Parameters:

- `el` - widget to add
- `x`, `y`, `width`, `height` - widget position/dimensions (optional)
- `autoPosition` - if `true` then `x`, `y` parameters will be ignored and widget will be places on the first available
position (optional)
- `minWidth` minimum width allowed during resize/creation (optional)
- `maxWidth` maximum width allowed during resize/creation (optional)
- `minHeight` minimum height allowed during resize/creation (optional)
- `maxHeight` maximum height allowed during resize/creation (optional)
- `id` value for `data-gs-id` (optional)

Widget will be always placed even if result height is more than actual grid height. You need to use `willItFit` method
before calling `addWidget` for additional check.

```javascript
$('.grid-stack').gridstack();
var grid = $('.grid-stack').data('gridstack');
grid.addWidget(el, 0, 0, 3, 2, true);
```

### batchUpdate()

starts batch updates. You will see no changes until `commit()` method is called.

### compact()

relayout grid items to reclaim any empty space.

### cellHeight()

Gets current cell height.

### cellHeight(val, noUpdate)

Update current cell height. This method rebuilds an internal CSS stylesheet (unless optional noUpdate=true). Note: You can expect performance issues if
call this method too often.

```javascript
grid.cellHeight(grid.cellWidth() * 1.2);
```

### cellWidth()

Gets current cell width.

### commit()

Ends batch updates. Updates DOM nodes. You must call it after `batchUpdate()`.

### destroy([detachGrid])

Destroys a grid instance.

Parameters:

- `detachGrid` - if `false` nodes and grid will not be removed from the DOM (Optional. Default `true`).

### disable()

Disables widgets moving/resizing. This is a shortcut for:

```javascript
grid.movable('.grid-stack-item', false);
grid.resizable('.grid-stack-item', false);
```

### enable()

Enables widgets moving/resizing. This is a shortcut for:

```javascript
grid.movable('.grid-stack-item', true);
grid.resizable('.grid-stack-item', true);
```

### enableMove(doEnable, includeNewWidgets)

Enables/disables widget moving. `includeNewWidgets` will force new widgets to be draggable as per `doEnable`'s value by changing the `disableDrag` grid option. This is a shortcut for:

```javascript
grid.movable(this.container.children('.' + this.opts.itemClass), doEnable);
```

### enableResize(doEnable, includeNewWidgets)

Enables/disables widget resizing. `includeNewWidgets` will force new widgets to be resizable as per `doEnable`'s value by changing the `disableResize` grid option.  This is a shortcut for:

```javascript
grid.resizable(this.container.children('.' + this.opts.itemClass), doEnable);
```

### float(val?)

set/get floating widgets (default: `false`)

- `val` - boolean to set true/false, else get the current value

### getCellFromPixel(position[, useOffset])

Get the position of the cell under a pixel on screen.

Parameters :

- `position` - the position of the pixel to resolve in absolute coordinates, as an object with `top` and `left` properties
- `useOffset` - if `true`, value will be based on offset vs position (Optional. Default `false`). Useful when grid is within `position: relative` element.

Returns an object with properties `x` and `y` i.e. the column and row in the grid.

### isAreaEmpty(x, y, width, height)

Checks if specified area is empty.

### locked(el, val)

Locks/unlocks widget.

- `el` - widget to modify.
- `val` - if `true` widget will be locked.

### makeWidget(el)

If you add elements to your gridstack container by hand, you have to tell gridstack afterwards to make them widgets. If you want gridstack to add the elements for you, use `addWidget` instead.
Makes the given element a widget and returns it.

Parameters:

- `el` - element to convert to a widget

```javascript
$('.grid-stack').gridstack();

$('.grid-stack').append('<div id="gsi-1" data-gs-x="0" data-gs-y="0" data-gs-width="3" data-gs-height="2" data-gs-auto-position="true"></div>')
var grid = $('.grid-stack').data('gridstack');
grid.makeWidget('gsi-1');
```

### maxHeight(el, val)

Set the `maxHeight` for a widget.

- `el` - widget to modify.
- `val` - A numeric value of the number of rows

### minHeight(el, val)

Set the `minHeight` for a widget.

- `el` - widget to modify.
- `val` - A numeric value of the number of rows

### maxWidth(el, val)

Set the `maxWidth` for a widget.

- `el` - widget to modify.
- `val` - A numeric value of the number of columns

### minWidth(el, val)

Set the `minWidth` for a widget.

- `el` - widget to modify.
- `val` - A numeric value of the number of columns

### movable(el, val)

Enables/Disables moving.

- `el` - widget to modify
- `val` - if `true` widget will be draggable.

### move(el, x, y)

Changes widget position

Parameters:

- `el` - widget to move
- `x`, `y` - new position. If value is `null` or `undefined` it will be ignored.

### removeWidget(el[, detachNode])

Removes widget from the grid.

Parameters:

- `el` - widget to remove.
- `detachNode` - if `false` node won't be removed from the DOM (Optional. Default `true`).

### removeAll([detachNode])

Removes all widgets from the grid.

Parameters:

- `detachNode` - if `false` nodes won't be removed from the DOM (Optional. Default `true`).

### resize(el, width, height)

Changes widget size

Parameters:

- `el` - widget to resize
- `width`, `height` - new dimensions. If value is `null` or `undefined` it will be ignored.

### resizable(el, val)

Enables/Disables resizing.

- `el` - widget to modify
- `val` - if `true` widget will be resizable.

### setAnimation(doAnimate)

Toggle the grid animation state.  Toggles the `grid-stack-animate` class.

- `doAnimate` - if `true` the grid will animate.

### setColumn(column, doNotPropagate)

Modify number of columns in the grid. Will update existing widgets to conform to new number of columns,
as well as cache the original layout so you can revert back to previous positions without loss.
Requires `gridstack-extra.css` or `gridstack-extra.min.css` for [1-11],
else you will need to generate correct CSS (see https://github.com/gridstack/gridstack.js#change-grid-columns)

- `column` - Integer > 0 (default 12).
- `doNotPropagate` - if true existing widgets will not be updated.

### setStatic(staticValue)

Toggle the grid static state.  Also toggle the `grid-stack-static` class.

- `staticValue` - if `true` the grid becomes static.

### update(el, x, y, width, height)

Parameters:

- `el` - widget to move
- `x`, `y` - new position. If value is `null` or `undefined` it will be ignored.
- `width`, `height` - new dimensions. If value is `null` or `undefined` it will be ignored.

Updates widget position/size.

### verticalMargin()

returns current vertical margin value.

### verticalMargin(value, noUpdate)

Parameters:

- `value` - new vertical margin value.
- `noUpdate` - if true, styles will not be updated.

### willItFit(x, y, width, height, autoPosition)

Returns `true` if the `height` of the grid will be less the vertical constraint. Always returns `true` if grid doesn't
have `height` constraint.

```javascript
if (grid.willItFit(newNode.x, newNode.y, newNode.width, newNode.height, true)) {
  grid.addWidget(newNode.el, newNode.x, newNode.y, newNode.width, newNode.height, true);
}
else {
  alert('Not enough free space to place the widget');
}
```


## Utils

### GridStackUI.Utils.sort(nodes[, dir[, width]])

Sorts array of nodes

- `nodes` - array to sort
- `dir` - `1` for asc, `-1` for desc (optional)
- `width` - width of the grid. If `undefined` the width will be calculated automatically (optional).
