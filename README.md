gridstack.js
============

gridstack.js is a jQuery plugin for widget layout. This is drag-and-drop multi-column grid. It allows you to build 
draggable responsive bootstrap v3 friendly layouts. It also works great with [knockout.js](http://knockoutjs.com) and
touch devices.

Inspired by [gridster.js](http://gridster.net). Built with love.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Demo](#demo)
- [Usage](#usage)
  - [Requirements](#requirements)
  - [Basic usage](#basic-usage)
  - [Options](#options)
  - [Grid attributes](#grid-attributes)
  - [Item attributes](#item-attributes)
  - [Events](#events)
    - [onchange(items)](#onchangeitems)
    - [ondragstart(event, ui)](#ondragstartevent-ui)
    - [ondragstop(event, ui)](#ondragstopevent-ui)
    - [onresizestart(event, ui)](#onresizestartevent-ui)
    - [onresizestop(event, ui)](#onresizestopevent-ui)
  - [API](#api)
    - [add_widget(el, x, y, width, height, auto_position)](#add_widgetel-x-y-width-height-auto_position)
    - [cell_height()](#cell_height)
    - [cell_height(val)](#cell_heightval)
    - [cell_width()](#cell_width)
    - [disable()](#disable)
    - [enable()](#enable)
    - [get_cell_from_pixel(position)](#get_cell_from_pixelposition)
    - [locked(el, val)](#lockedel-val)
    - [remove_widget(el)](#remove_widgetel)
    - [remove_all()](#remove_all)
    - [resize(el, width, height)](#resizeel-width-height)
    - [move(el, x, y)](#moveel-x-y)
    - [resizable(el, val)](#resizableel-val)
    - [movable(el, val)](#movableel-val)
    - [will_it_fit(x, y, width, height, auto_position)](#will_it_fitx-y-width-height-auto_position)
  - [Utils](#utils)
    - [GridStackUI.Utils.sort(nodes, dir, width)](#gridstackuiutilssortnodes-dir-width)
  - [Touch devices support](#touch-devices-support)
  - [Use with knockout.js](#use-with-knockoutjs)
  - [Change grid width](#change-grid-width)
  - [Load grid from array](#load-grid-from-array)
- [Changes](#changes)
      - [v0.2.3 (development version)](#v023-development-version)
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

* [underscore.js](http://underscorejs.org) (>= 1.7.0)
* [jQuery](http://jquery.com) (>= 1.11.0) 
* [jQuery UI](http://jqueryui.com) (>= 1.11.0). Minimum required components: Core, Widget, Mouse, Draggable, Resizable
* (Optional) [knockout.js](http://knockoutjs.com) (>= 3.2.0)
* (Optional) [jquery-ui-touch-punch](https://github.com/furf/jquery-ui-touch-punch) for touch-based devices support

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

## Options

- `always_show_resize_handle` - if `true` the resizing handles are shown even the user is not hovering over the widget 
    (default: `false`) 
- `animate` - turns animation on (default: `false`)
- `auto` - if `false` it tells to do not initialize existing items (default: `true`)
- `cell_height` - one cell height (default: `60`)
- `handle` - draggable handle selector (default: `'.grid-stack-item-content'`)
- `height` - maximum rows amount. Default is `0` which means no maximum rows
- `float` - enable floating widgets (default: `false`)
- `item_class` - widget class (default: `'grid-stack-item'`)
- `min_width` - minimal width. If window width is less grid will be shown in one-column mode (default: `768`)
- `placeholder_class` - class for placeholder (default: `'grid-stack-placeholder'`)
- `vertical_margin` - vertical gap size (default: `20`)
- `width` - amount of columns (default: `12`)

## Grid attributes

- `data-gs-animate` - turns animation on 
- `data-gs-width` - amount of columns
- `data-gs-height` - maximum rows amount. Default is `0` which means no maximum rows.

## Item attributes

- `data-gs-x`, `data-gs-y` - element position
- `data-gs-width`, `data-gs-height` - element size
- `data-gs-max-width`, `data-gs-min-width`, `data-gs-max-height`, `data-gs-min-height` - element constraints
- `data-gs-no-resize` - disable element resizing
- `data-gs-no-move` - disable element moving 
- `data-gs-auto-position` - tells to ignore `data-gs-x` and `data-gs-y` attributes and to place element to the first 
    available position
- `data-gs-locked` - the widget will be locked. It means another widgets couldn't move it during dragging or resizing.
The widget is still can be dragged or resized. You need to add `data-gs-no-resize` and `data-gs-no-move` attributes
to completely lock the widget.
    
## Events

### onchange(items)

Occurs when widgets change their position/size

```javascript
var serialize_widget_map = function (items) {
    console.log(items);
};

$('.grid-stack').on('change', function (e, items) {
    serialize_widget_map(items);
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


## API

### add_widget(el, x, y, width, height, auto_position)

Creates new widget and returns it.

Parameters:

- `el` - widget to add
- `x`, `y`, `width`, `height` - widget position/dimensions (Optional)
- `auto_position` - if `true` then `x`, `y` parameters will be ignored and widget will be places on the first available
position

Widget will be always placed even if result height will be more then grid height. You need to use `will_it_fit` method
before call `add_widget` for additional check.

```javascript
$('.grid-stack').gridstack();

var grid = $('.grid-stack').data('gridstack');
grid.add_widget(el, 0, 0, 3, 2, true);
```

### cell_height()

Gets current cell height.

### cell_height(val)

Update current cell height. This method rebuilds an internal CSS stylesheet. Note: You can expect performance issues if
call this method too often.

```javascript
grid.cell_height(grid.cell_width() * 1.2);
```

### cell_width()

Gets current cell width.

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

### get_cell_from_pixel(position)

Get the position of the cell under a pixel on screen.

Parameters :

- `position` - the position of the pixel to resolve in absolute coordinates, as an object with `top` and `left`properties

Returns an object with properties `x` and `y` i.e. the column and row in the grid.

### locked(el, val)

Locks/unlocks widget.

- `el` - widget to modify.
- `val` - if `true` widget will be locked. 

### remove_widget(el)

Removes widget from the grid.

Parameters:

- `el` - widget to remove

### remove_all()

Removes all widgets from the grid.

### resize(el, width, height)

Changes widget size

Parameters:

- `el` - widget to resize
- `width`, `height` - new dimensions. If value is `null` or `undefined` it will be ignored.

### move(el, x, y)

Changes widget position

Parameters:

- `el` - widget to move
- `x`, `y` - new position. If value is `null` or `undefined` it will be ignored.

### resizable(el, val)

Enables/Disables resizing.

- `el` - widget to modify
- `val` - if `true` widget will be resizable. 

### movable(el, val)

Enables/Disables moving.

- `el` - widget to modify
- `val` - if `true` widget will be draggable.

### will_it_fit(x, y, width, height, auto_position)

Returns `true` if the `height` of the grid will be less the vertical constraint. Always returns `true` if grid doesn't
have `height` constraint.

```javascript
if (grid.will_it_fit(new_node.x, new_node.y, new_node.width, new_node.height, true)) {
    grid.add_widget(new_node.x, new_node.y, new_node.width, new_node.height, true);
}
else {
    alert('Not enough free space to place the widget');
}
```
 

## Utils

### GridStackUI.Utils.sort(nodes, dir, width)

Sorts array of nodes

- `nodes` - array to sort
- `dir` - `1` for asc, `-1` for desc (optional)
- `width` - width of the grid. If `undefined` the width will be calculated automatically (optional).

## Touch devices support

Please use [jQuery UI Touch Punch](https://github.com/furf/jquery-ui-touch-punch) to make jQuery UI Draggable/Resizable
working on touch-based devices.

```html
<script src="underscore-min.js"></script>
<script src="jquery.min.js"></script>
<script src="jquery-ui.min.js"></script>
<script src="jquery.ui.touch-punch.min.js"></script>

<script src="gridstack.js"></script>
```

Also `always_show_resize_handle` option may be useful:

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
                    _.each(items, function (item) {
                        item = $(item);
                        if (item.data('_gridstack_node') || item[0].nodeType != 1)
                            return;

                        if (grid == null) {
                            grid = $(componentInfo.element).find('.grid-stack').gridstack({
                                auto: false
                            }).data('gridstack');
                        }

                        grid.add_widget(item);
                        ko.utils.domNodeDisposal.addDisposeCallback(item[0], function () {
                            grid.remove_widget(item);
                        });
                    }, this);
                };
            };

            return new ViewModel(controller, componentInfo);
        }
    },
    template:
        [
            '<div class="grid-stack" data-bind="foreach: {data: widgets, afterRender: afterAddWidget}">',
            '   <div class="grid-stack-item" data-bind="attr: {\'data-gs-x\': $data.x, \'data-gs-y\': $data.y, \'data-gs-width\': $data.width, \'data-gs-height\': $data.height}">',
            '       <div class="grid-stack-item-content" data-bind="text: $index"></div>',
            '   </div>',
            '</div>'
        ].join('\n')
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

See [example](http://troolee.github.io/gridstack.js/demo/knockout.html).

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
grid.remove_all();

_.each(serialization, function (node) {
    grid.add_widget($('<div><div class="grid-stack-item-content" /><div/>'), 
        node.x, node.y, node.width, node.height);
});
```


Changes
=======

#### v0.2.3 (development version)

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

Copyright (c) 2014 Pavel Reznikov

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

