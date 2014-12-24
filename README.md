gridstack.js
============

gridstack.js is a jQuery plugin for widget layout. This is drag-and-drop multi-column grid. It allows you to build 
draggable responsive bootstrap v3 friendly layouts. It also works great with [knockout.js](http://knockoutjs.com)

Inspired by [gridster.js](http://gridster.net). Built with love.

Demo
====

Please visit http://troolee.github.io/gridstack.js/ for demo.


Usage
=====

## Requirements

* http://underscorejs.org (>= 1.7.0)
* http://jquery.com (>= 1.11.0) 
* http://jqueryui.com (>= 1.11.0). Minimum required components: Core, Widget, Mouse, Draggable, Resizable
* (Optional) http://knockoutjs.com (>= 3.2.0)

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

Creates new widget.

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

### resize(el, width, \[height\])

Changes widget size

Parameters:

- `el` - widget to resize
- `width`, `height` - new dimensions. If value is `null` or `undefined` it will be ignored.

### move(el, x, \[y\])

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

### GridStackUI.Utils.sort(nodes, \[dir\], \[width\])

Sorts array of nodes

- `nodes` - array to sort
- `dir` - `1` for asc, `-1` for desc
- `width` - width of the grid. If `undefined` the width will be calculated automatically.

## Use with knockout.js

```javascript
ko.components.register('dashboard-grid', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            var ViewModel = function (params, componentInfo) {
                var grid = null;

                this.widgets = params.widgets;

                this.afterAddWidget = function (items) {
                    _.each(items, function (item) {
                        item = $(item);

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

            return new ViewModel(params, componentInfo);
        }
    },
    template: [
        '<div class="grid-stack">',
        '   <!-- ko foreach: widgets, afterRender: afterAddWidget -->',
        '       <div class="grid-stack-item" data-bind="attr: {',
        '               \'data-gs-x\': x, \'data-gs-y\': y,',
        '               \'data-gs-width\': width, \'data-gs-height\': height}">',
        '           <span data-bind="text: $index"></span>',
        '       </div>',
        '   <!-- /ko -->',
        '</div>'
    ].join('\n')
});
```

and HTML:

```html
<div data-bind="component: {name: 'dashboard-grid', params: $data}"></div>
```


Changes
=======

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

