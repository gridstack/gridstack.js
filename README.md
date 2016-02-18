gridstack.js
============

gridstack.js is a jQuery plugin for widget layout. This is drag-and-drop multi-column grid. It allows you to build
draggable responsive bootstrap v3 friendly layouts. It also works great with [knockout.js](http://knockoutjs.com), [angular.js](https://angularjs.org) and touch devices.

Inspired by [gridster.js](http://gridster.net). Built with love.

Join gridstack.js on Slack: https://gridstackjs.troolee.com

[![Slack Status](https://gridstackjs.troolee.com/badge.svg)](https://gridstackjs.troolee.com)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Demo](#demo)
- [Usage](#usage)
  - [Requirements](#requirements)
  - [Install](#install)
  - [Basic usage](#basic-usage)
  - [Migrating to v0.2.5](#migrating-to-v025)
  - [Options](#options)
  - [Grid attributes](#grid-attributes)
  - [Item attributes](#item-attributes)
  - [Events](#events)
    - [onchange(items)](#onchangeitems)
    - [ondragstart(event, ui)](#ondragstartevent-ui)
    - [ondragstop(event, ui)](#ondragstopevent-ui)
    - [onresizestart(event, ui)](#onresizestartevent-ui)
    - [onresizestop(event, ui)](#onresizestopevent-ui)
    - [disable(event)](#disableevent)
    - [enable(event)](#enableevent)
  - [API](#api)
    - [addWidget(el, x, y, width, height, autoPosition)](#addwidgetel-x-y-width-height-autoposition)
    - [batchUpdate()](#batchupdate)
    - [cellHeight()](#cellheight)
    - [cellHeight(val)](#cellheightval)
    - [cellWidth()](#cellwidth)
    - [commit()](#commit)
    - [destroy()](#destroy)
    - [disable()](#disable)
    - [enable()](#enable)
    - [getCellFromPixel(position)](#getcellfrompixelposition)
    - [isAreaEmpty(x, y, width, height)](#isareaemptyx-y-width-height)
    - [locked(el, val)](#lockedel-val)
    - [makeWidget(el)](#makewidgetel)
    - [maxHeight(el, val)](#maxheightel-val)
    - [minHeight(el, val)](#minheightel-val)
    - [maxWidth(el, val)](#maxwidthel-val)
    - [minWidth(el, val)](#minwidthel-val)
    - [movable(el, val)](#movableel-val)
    - [move(el, x, y)](#moveel-x-y)
    - [removeWidget(el, detachNode)](#removewidgetel-detachnode)
    - [removeAll()](#removeall)
    - [resize(el, width, height)](#resizeel-width-height)
    - [resizable(el, val)](#resizableel-val)
    - [setStatic(static_value)](#setstaticstatic_value)
    - [update(el, x, y, width, height)](#updateel-x-y-width-height)
    - [willItFit(x, y, width, height, autoPosition)](#willitfitx-y-width-height-autoposition)
  - [Utils](#utils)
    - [GridStackUI.Utils.sort(nodes[, dir[, width]])](#gridstackuiutilssortnodes-dir-width)
  - [Touch devices support](#touch-devices-support)
  - [Use with knockout.js](#use-with-knockoutjs)
  - [Use with angular.js](#use-with-angularjs)
  - [Rails integration](#rails-integration)
  - [Change grid width](#change-grid-width)
  - [Extra CSS](#extra-css)
    - [Different grid widths](#different-grid-widths)
  - [Save grid to array](#save-grid-to-array)
  - [Load grid from array](#load-grid-from-array)
  - [Override resizable/draggable options](#override-resizabledraggable-options)
  - [IE8 support](#ie8-support)
  - [Nested grids](#nested-grids)
- [Changes](#changes)
      - [v0.2.5-dev (Development version)](#v025-dev-development-version)
      - [v0.2.4 (2016-02-15)](#v024-2016-02-15)
      - [v0.2.3 (2015-06-23)](#v023-2015-06-23)
      - [v0.2.2 (2014-12-23)](#v022-2014-12-23)
      - [v0.2.1 (2014-12-09)](#v021-2014-12-09)
      - [v0.2.0 (2014-11-30)](#v020-2014-11-30)
      - [v0.1.0 (2014-11-18)](#v010-2014-11-18)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


Demo
====

Please visit http://troolee.github.io/gridstack.js/ for demo.


Usage
=====

## Requirements

* [lodash.js](https://lodash.com) (>= 3.5.0)
* [jQuery](http://jquery.com) (>= 1.11.0)
* [jQuery UI](http://jqueryui.com) (>= 1.11.0). Minimum required components: Core, Widget, Mouse, Draggable, Resizable
* (Optional) [knockout.js](http://knockoutjs.com) (>= 3.2.0)
* (Optional) [jquery-ui-touch-punch](https://github.com/furf/jquery-ui-touch-punch) for touch-based devices support

Note: You can still use [underscore.js](http://underscorejs.org) (>= 1.7.0) instead of lodash.js

## Install

* Using CDN:

```html
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/gridstack.js/0.2.4/gridstack.min.css" />
<script type="text/javascript" src='//cdnjs.cloudflare.com/ajax/libs/gridstack.js/0.2.4/gridstack.min.js'></script>
```

* Using bower:

```bash
$ bower install gridstack
```

* Using npm:

```bash
$ npm install gridstack
```

You can download files from `dist` directory as well.

## Basic usage

```html
<div class="grid-stack">
    <div class="grid-stack-item"
        data-gs-x="0" data-gs-y="0"
        data-gs-width="4" data-gs-height="2">
            <div class="grid-stack-item-content"></div>
    </div>
    <div class="grid-stack-item"
        data-gs-x="4" data-gs-y="0"
        data-gs-width="4" data-gs-height="4">
            <div class="grid-stack-item-content"></div>
    </div>
</div>

<script type="text/javascript">
$(function () {
    var options = {
        cell_height: 80,
        vertical_margin: 10
    };
    $('.grid-stack').gridstack(options);
});
</script>
```

## Migrating to v0.2.5

As of v0.2.5 all methods and parameters are in camel case to respect [JavaScript Style Guide and Coding Conventions](http://www.w3schools.com/js/js_conventions.asp).
All old methods and parameters are marked as deprecated and still available but a warning will be displayed in js console. They will be available until v1.0
when they will be completely removed.

## Options

- `alwaysShowResizeHandle` - if `true` the resizing handles are shown even if the user is not hovering over the widget
    (default: `false`)
- `animate` - turns animation on (default: `false`)
- `auto` - if `false` gridstack will not initialize existing items (default: `true`)
- `cellHeight` - one cell height (default: `60`). Can be:
 - an integer (px)
 - a string (ex: '10em', '100px', '10rem')
 - 0 or null, in which case the library will not generate styles for rows. Everything will have to be defined in CSS files.
- `draggable` - allows to override jQuery UI draggable options. (default: `{handle: '.grid-stack-item-content', scroll: true, appendTo: 'body'}`)
- `handle` - draggable handle selector (default: `'.grid-stack-item-content'`)
- `handleClass` - draggable handle class (e.g. `'grid-stack-item-content'`). If set `handle` is ignored (default: `null`)
- `height` - maximum rows amount. Default is `0` which means no maximum rows
- `float` - enable floating widgets (default: `false`) See [example](http://troolee.github.io/gridstack.js/demo/float.html)
- `itemClass` - widget class (default: `'grid-stack-item'`)
- `minWidth` - minimal width. If window width is less, grid will be shown in one-column mode. You need also update your css file (`@media (max-width: 768px) {...}`) with corresponding value (default: `768`)
- `placeholderClass` - class for placeholder (default: `'grid-stack-placeholder'`)
- `placeholderText` - placeholder default content (default: `''`)
- `resizable` - allows to override jQuery UI resizable options. (default: `{autoHide: true, handles: 'se'}`)
- `staticGrid` - makes grid static (default `false`). If true widgets are not movable/resizable. You don't even need jQueryUI draggable/resizable.  A CSS class `grid-stack-static` is also added to the container.
- `verticalMargin` - vertical gap size (default: `20`). Can be:
 - an integer (px)
 - a string (ex: '2em', '20px', '2rem')
- `width` - amount of columns (default: `12`)

## Grid attributes

- `data-gs-animate` - turns animation on
- `data-gs-width` - amount of columns
- `data-gs-height` - maximum rows amount. Default is `0` which means no maximum rows.
- `data-gs-current-height` - current rows amount. Set by the library only. Can be used by the CSS rules.

## Item attributes

- `data-gs-x`, `data-gs-y` - element position
- `data-gs-width`, `data-gs-height` - element size
- `data-gs-max-width`, `data-gs-min-width`, `data-gs-max-height`, `data-gs-min-height` - element constraints
- `data-gs-no-resize` - disable element resizing
- `data-gs-no-move` - disable element moving
- `data-gs-auto-position` - tells to ignore `data-gs-x` and `data-gs-y` attributes and to place element to the first
    available position
- `data-gs-locked` - the widget will be locked. It means another widget wouldn't be able to move it during dragging or resizing.
The widget can still be dragged or resized. You need to add `data-gs-no-resize` and `data-gs-no-move` attributes
to completely lock the widget.

## Events

### onchange(items)

Occurs when adding/removing widgets or existing widgets change their position/size

```javascript
var serializeWidgetMap = function (items) {
    console.log(items);
};

$('.grid-stack').on('change', function (e, items) {
    serializeWidgetMap(items);
});
```

### ondragstart(event, ui)

```javascript
$('.grid-stack').on('dragstart', function (event, ui) {
    var grid = this;
    var element = event.target;
});
```

### ondragstop(event, ui)

```javascript
$('.grid-stack').on('dragstop', function (event, ui) {
    var grid = this;
    var element = event.target;
});
```

### onresizestart(event, ui)

```javascript
$('.grid-stack').on('resizestart', function (event, ui) {
    var grid = this;
    var element = event.target;
});
```

### onresizestop(event, ui)

```javascript
$('.grid-stack').on('resizestop', function (event, ui) {
    var grid = this;
    var element = event.target;
});
```

### disable(event)

```javascript
$('.grid-stack').on('disable', function(event) {
    var grid = event.target;
});
```

### enable(event)

```javascript
$('.grid-stack').on('enable', function(event) {
    var grid = event.target;
});
```

## API

### addWidget(el, x, y, width, height, autoPosition)

Creates new widget and returns it.

Parameters:

- `el` - widget to add
- `x`, `y`, `width`, `height` - widget position/dimensions (Optional)
- `autoPosition` - if `true` then `x`, `y` parameters will be ignored and widget will be places on the first available
position

Widget will be always placed even if result height is more than actual grid height. You need to use `will_it_fit` method
before calling `add_widget` for additional check.

```javascript
$('.grid-stack').gridstack();

var grid = $('.grid-stack').data('gridstack');
grid.addWidget(el, 0, 0, 3, 2, true);
```

### batchUpdate()

Initailizes batch updates. You will see no changes until `commit` method is called.

### cellHeight()

Gets current cell height.

### cellHeight(val)

Update current cell height. This method rebuilds an internal CSS stylesheet. Note: You can expect performance issues if
call this method too often.

```javascript
grid.cellHeight(grid.cell_width() * 1.2);
```

### cellWidth()

Gets current cell width.

### commit()

Finishes batch updates. Updates DOM nodes. You must call it after `batchUpdate`.

### destroy()

Destroys a grid instance.

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

### getCellFromPixel(position)

Get the position of the cell under a pixel on screen.

Parameters :

- `position` - the position of the pixel to resolve in absolute coordinates, as an object with `top` and `left`properties

Returns an object with properties `x` and `y` i.e. the column and row in the grid.

### isAreaEmpty(x, y, width, height)

Checks if specified area is empty.

### locked(el, val)

Locks/unlocks widget.

- `el` - widget to modify.
- `val` - if `true` widget will be locked.

### makeWidget(el)

If you add elements to your gridstack container by hand, you have to tell gridstack afterwards to make them widgets. If you want gridstack to add the elements for you, use `add_widget` instead.
Makes the given element a widget and returns it.

Parameters:

- `el` - element to convert to a widget

```javascript
$('.grid-stack').gridstack();

$('.grid-stack').append('<div id="gsi-1" data-gs-x="0" data-gs-y="0" data-gs-width="3" data-gs-height="2" data-gs-auto-position="1"></div>')
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

### removeWidget(el, detachNode)

Removes widget from the grid.

Parameters:

- `el` - widget to remove.
- `detachNode` - if `false` DOM node won't be removed from the tree (Optional. Default `true`).

### removeAll()

Removes all widgets from the grid.

### resize(el, width, height)

Changes widget size

Parameters:

- `el` - widget to resize
- `width`, `height` - new dimensions. If value is `null` or `undefined` it will be ignored.

### resizable(el, val)

Enables/Disables resizing.

- `el` - widget to modify
- `val` - if `true` widget will be resizable.

### setStatic(static_value)

Toggle the grid static state.  Also toggle the `grid-stack-static` class.

- `static_value` - if `true` the grid become static.

### update(el, x, y, width, height)

Parameters:

- `el` - widget to move
- `x`, `y` - new position. If value is `null` or `undefined` it will be ignored.
- `width`, `height` - new dimensions. If value is `null` or `undefined` it will be ignored.

Updates widget position/size.

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

## Touch devices support

Please use [jQuery UI Touch Punch](https://github.com/furf/jquery-ui-touch-punch) to make jQuery UI Draggable/Resizable
working on touch-based devices.

```html
<script src="lodash.min.js"></script>
<script src="jquery.min.js"></script>
<script src="jquery-ui.min.js"></script>
<script src="jquery.ui.touch-punch.min.js"></script>

<script src="gridstack.js"></script>
```

Also `alwaysShowResizeHandle` option may be useful:

```javascript
$(function () {
    var options = {
        always_show_resize_handle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };
    $('.grid-stack').gridstack(options);
});
```

## Use with knockout.js

```javascript
ko.components.register('dashboard-grid', {
    viewModel: {
        createViewModel: function (controller, componentInfo) {
            var ViewModel = function (controller, componentInfo) {
                var grid = null;

                this.widgets = controller.widgets;

                this.afterAddWidget = function (items) {
                    if (grid == null) {
                        grid = $(componentInfo.element).find('.grid-stack').gridstack({
                            auto: false
                        }).data('gridstack');
                    }

                    var item = _.find(items, function (i) { return i.nodeType == 1 });
                    grid.addWidget(item);
                    ko.utils.domNodeDisposal.addDisposeCallback(item, function () {
                        grid.removeWidget(item);
                    });
                };
            };

            return new ViewModel(controller, componentInfo);
        }
    },
    template:
        [
            '<div class="grid-stack" data-bind="foreach: {data: widgets, afterRender: afterAddWidget}">',
            '   <div class="grid-stack-item" data-bind="attr: {\'data-gs-x\': $data.x, \'data-gs-y\': $data.y, \'data-gs-width\': $data.width, \'data-gs-height\': $data.height, \'data-gs-auto-position\': $data.auto_position}">',
            '       <div class="grid-stack-item-content">...</div>',
            '   </div>',
            '</div> '
        ].join('')
});

$(function () {
    var Controller = function (widgets) {
        this.widgets = ko.observableArray(widgets);
    };

    var widgets = [
        {x: 0, y: 0, width: 2, height: 2},
        {x: 2, y: 0, width: 4, height: 2},
        {x: 6, y: 0, width: 2, height: 4},
        {x: 1, y: 2, width: 4, height: 2}
    ];

    ko.applyBindings(new Controller(widgets));
});
```

and HTML:

```html
<div data-bind="component: {name: 'dashboard-grid', params: $data}"></div>
```

See examples: [example 1](http://troolee.github.io/gridstack.js/demo/knockout.html), [example 2](http://troolee.github.io/gridstack.js/demo/knockout2.html).

**Notes:** It's very important to exclude training spaces after widget template:

```javascript
template:
    [
        '<div class="grid-stack" data-bind="foreach: {data: widgets, afterRender: afterAddWidget}">',
        '   <div class="grid-stack-item" data-bind="attr: {\'data-gs-x\': $data.x, \'data-gs-y\': $data.y, \'data-gs-width\': $data.width, \'data-gs-height\': $data.height, \'data-gs-auto-position\': $data.auto_position}">',
        '       ....',
        '   </div>', // <-- NO SPACE **AFTER** </div>
        '</div> '    // <-- NO SPACE **BEFORE** </div>
    ].join('')       // <-- JOIN WITH **EMPTY** STRING
```

Otherwise `addDisposeCallback` won't work.


## Use with angular.js

Please check [gridstack-angular](https://github.com/kdietrich/gridstack-angular)


## Rails integration

For rails users, integration of gridstack.js and its dependencies can be done through [gridstack-js-rails](https://github.com/randoum/gridstack-js-rails)


## Change grid width

To change grid width (columns count), to addition to `width` option, CSS rules
for `.grid-stack-item[data-gs-width="X"]` and  `.grid-stack-item[data-gs-x="X"]` have to be changed accordingly.

For instance for 3-column grid you need to rewrite CSS to be:

```css
.grid-stack-item[data-gs-width="3"]  { width: 100% }
.grid-stack-item[data-gs-width="2"]  { width: 66.66666667% }
.grid-stack-item[data-gs-width="1"]  { width: 33.33333333% }

.grid-stack-item[data-gs-x="2"]  { left: 66.66666667% }
.grid-stack-item[data-gs-x="1"]  { left: 33.33333333% }
```

For 4-column grid it should be:

```css
.grid-stack-item[data-gs-width="4"]  { width: 100% }
.grid-stack-item[data-gs-width="3"]  { width: 75% }
.grid-stack-item[data-gs-width="2"]  { width: 50% }
.grid-stack-item[data-gs-width="1"]  { width: 25% }

.grid-stack-item[data-gs-x="3"]  { left: 75% }
.grid-stack-item[data-gs-x="2"]  { left: 50% }
.grid-stack-item[data-gs-x="1"]  { left: 25% }
```

and so on.

Here is a SASS code snipped which can make life easier (Thanks to @ascendantofrain, [#81](https://github.com/troolee/gridstack.js/issues/81)):

```sass
.grid-stack-item {

    $gridstack-columns: 12;

    @for $i from 1 through $gridstack-columns {
        &[data-gs-width='#{$i}'] { width: (100% / $gridstack-columns) * $i; }
        &[data-gs-x='#{$i}'] { left: (100% / $gridstack-columns) * $i; }
        &.grid-stack-item[data-gs-min-width='#{$i}'] { min-width: (100% / $gridstack-columns) * $i; }
        &.grid-stack-item[data-gs-max-width='#{$i}'] { max-width: (100% / $gridstack-columns) * $i; }
    }
}
```

Or you can include `gridstack-extra.css`. See below for more details.

## Extra CSS

There are few extra CSS batteries in `gridstack-extra.css` (`gridstack-extra.min.css`).

### Different grid widths

You can use other than 12 grid width:

```html
<div class="grid-stack grid-stack-N">...</div>
```
```javascript
$('.grid-stack').gridstack({width: N});
```

See example: [2 grids demo](http://troolee.github.io/gridstack.js/demo/two.html)

## Save grid to array

Because gridstack doesn't track any kind of user-defined widget id there is no reason to make serialization to be part
of gridstack API. To serialize grid you can simply do something like this (let's say you store widget id inside `data-custom-id`
attribute):

```javascript
var res = _.map($('.grid-stack .grid-stack-item:visible'), function (el) {
    el = $(el);
    var node = el.data('_gridstack_node');
    return {
        id: el.attr('data-custom-id'),
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height
    };
});
alert(JSON.stringify(res));
```

See example: [Serialization demo](http://troolee.github.io/gridstack.js/demo/serialization.html)

You can also use `onchange` event if you need to save only changed widgets right away they have been changed.

## Load grid from array

```javascript
var serialization = [
    {x: 0, y: 0, width: 2, height: 2},
    {x: 3, y: 1, width: 1, height: 2},
    {x: 4, y: 1, width: 1, height: 1},
    {x: 2, y: 3, width: 3, height: 1},
    {x: 1, y: 4, width: 1, height: 1},
    {x: 1, y: 3, width: 1, height: 1},
    {x: 2, y: 4, width: 1, height: 1},
    {x: 2, y: 5, width: 1, height: 1}
];

serialization = GridStackUI.Utils.sort(serialization);

var grid = $('.grid-stack').data('gridstack');
grid.removeAll();

_.each(serialization, function (node) {
    grid.addWidget($('<div><div class="grid-stack-item-content" /></div>'),
        node.x, node.y, node.width, node.height);
});
```

See example: [Serialization demo](http://troolee.github.io/gridstack.js/demo/serialization.html)

If you're using knockout there is no need for such method at all.

## Override resizable/draggable options

You can override default `resizable`/`draggable` options. For instance to enable other then bottom right resizing handle
you can init gridsack like:

```javascript
$('.grid-stack').gridstack({
    resizable: {
        handles: 'e, se, s, sw, w'
    }
});
```

Note: It's not recommended to enable `nw`, `n`, `ne` resizing handles. Their behaviour may be unexpected.

## IE8 support

Support of IE8 is quite limited and is not a goal at this time. As far as IE8 doesn't support DOM Level 2 I cannot manipulate with
CSS stylesheet dynamically. As a workaround you can do the following:

- Create `gridstack-ie8.css` for your configuration (sample for grid with cell height of 60px can be found [here](https://gist.github.com/troolee/6edfea5857f4cd73e6f1)).
- Include this CSS:

```html
<!--[if lt IE 9]>
<link rel="stylesheet" href="gridstack-ie8.css"/>
<![endif]-->
```

- You can use this python script to generate such kind of CSS:

```python
#!/usr/bin/env python

height = 60
margin = 20
N = 100

print '.grid-stack > .grid-stack-item { min-height: %(height)spx }' % {'height': height}

for i in range(N):
	h = height * (i + 1) + margin * i
	print '.grid-stack > .grid-stack-item[data-gs-height="%(index)s"] { height: %(height)spx }' % {'index': i + 1, 'height': h}

for i in range(N):
	h = height * (i + 1) + margin * i
	print '.grid-stack > .grid-stack-item[data-gs-min-height="%(index)s"] { min-height: %(height)spx }' % {'index': i + 1, 'height': h}

for i in range(N):
	h = height * (i + 1) + margin * i
	print '.grid-stack > .grid-stack-item[data-gs-max-height="%(index)s"] { max-height: %(height)spx }' % {'index': i + 1, 'height': h}

for i in range(N):
	h = height * i + margin * i
	print '.grid-stack > .grid-stack-item[data-gs-y="%(index)s"] { top: %(height)spx }' % {'index': i , 'height': h}
```

There are at least two more issues with gridstack in IE8 with jQueryUI resizable (it seems it doesn't work) and
droppable. If you have any suggestions about support of IE8 you are welcome here: https://github.com/troolee/gridstack.js/issues/76


## Nested grids

Gridstack may be nested. All nested grids have an additional class `grid-stack-nested` which is assigned automatically
during initialization.
See example: [Nested grid demo](http://troolee.github.io/gridstack.js/demo/nested.html)


Changes
=======

#### v0.2.5-dev (Development version)

- update names to respect js naming convention
- `cellHeight` and `verticalMargin` can now be string (e.g. '3em', '20px') (Thanks to @jlowcs)
- add `maxWidth`/`maxHeight` methods.

#### v0.2.4 (2016-02-15)

- fix closure compiler/linter warnings
- add `static_grid` option.
- add `min_width`/`min_height` methods (Thanks to @cvillemure)
- add `destroy` method (Thanks to @zspitzer)
- add `placeholder_text` option (Thanks to @slauyama)
- add `handle_class` option.
- add `make_widget` method.
- lodash v 4.x support (Thanks to Andy Robbins)

#### v0.2.3 (2015-06-23)

- gridstack-extra.css
- add support of lodash.js
- add `is_area_empty` method
- nested grids
- add `batch_update`/`commit` methods
- add `update` method
- allow to override `resizable`/`draggable` options
- add `disable`/`enable` methods
- add `get_cell_from_pixel` (thanks to @juchi)
- AMD support
- fix nodes sorting
- improved touch devices support
- add `always_show_resize_handle` option
- minor fixes and improvements

#### v0.2.2 (2014-12-23)

- fix grid initialization
- add `cell_height`/`cell_width` API methods
- fix boolean attributes (issue #31)

#### v0.2.1 (2014-12-09)

- add widgets locking (issue #19)
- add `will_it_fit` API method
- fix auto-positioning (issue #20)
- add animation (thanks to @ishields)
- fix `y` coordinate calculation when dragging (issue #18)
- fix `remove_widget` (issue #16)
- minor fixes


#### v0.2.0 (2014-11-30)

- add `height` option
- auto-generate css rules (widgets `height` and `top`)
- add `GridStackUI.Utils.sort` utility function
- add `remove_all` API method
- add `resize` and `move` API methods
- add `resizable` and `movable` API methods
- add `data-gs-no-move` attribute
- add `float` option
- fix default css rule for inner content
- minor fixes

#### v0.1.0 (2014-11-18)

Very first version.


License
=======

The MIT License (MIT)

Copyright (c) 2014-2016 Pavel Reznikov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
