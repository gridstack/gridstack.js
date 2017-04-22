gridstack.js
============

[![Build Status](https://travis-ci.org/troolee/gridstack.js.svg?branch=master)](https://travis-ci.org/troolee/gridstack.js)
[![Coverage Status](https://coveralls.io/repos/github/troolee/gridstack.js/badge.svg?branch=master)](https://coveralls.io/github/troolee/gridstack.js?branch=master)
[![Dependency Status](https://david-dm.org/troolee/gridstack.js.svg)](https://david-dm.org/troolee/gridstack.js)
[![devDependency Status](https://david-dm.org/troolee/gridstack.js/dev-status.svg)](https://david-dm.org/troolee/gridstack.js#info=devDependencies)
[![Stories in Ready](https://badge.waffle.io/troolee/gridstack.js.png?label=ready&title=Ready)](http://waffle.io/troolee/gridstack.js)

gridstack.js is a jQuery plugin for widget layout. This is drag-and-drop multi-column grid. It allows you to build
draggable responsive bootstrap v3 friendly layouts. It also works great with [knockout.js](http://knockoutjs.com), [angular.js](https://angularjs.org) and touch devices.

Inspired by [gridster.js](https://github.com/ducksboard/gridster.js). Built with love.

Join gridstack.js on Slack: https://gridstackjs.troolee.com

[![Slack Status](https://gridstackjs.troolee.com/badge.svg)](https://gridstackjs.troolee.com)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Demo](#demo)
- [Usage](#usage)
  - [Requirements](#requirements)
      - [Using gridstack.js with jQuery UI](#using-gridstackjs-with-jquery-ui)
  - [Install](#install)
  - [Basic usage](#basic-usage)
  - [Migrating to v0.3.0](#migrating-to-v030)
  - [Migrating to v0.2.5](#migrating-to-v025)
  - [API Documentation](#api-documentation)
  - [Questions and Answers](#questions-and-answers)
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
  - [Use with require.js](#use-with-requirejs)
  - [Nested grids](#nested-grids)
  - [Resizing active grid](#resizing-active-grid)
  - [Using AniJS](#using-anijs)
- [The Team](#the-team)
- [Changes](#changes)
      - [v0.3.0 (2017-04-21)](#v030-2017-04-21)
      - [v0.2.6 (2016-08-17)](#v026-2016-08-17)
      - [v0.2.5 (2016-03-02)](#v025-2016-03-02)
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

Please visit http://troolee.github.io/gridstack.js/ for demo. Or check out [these example](http://troolee.github.io/gridstack.js/demo/).


Usage
=====

## Requirements

* [lodash.js](https://lodash.com) (>= 3.5.0, full build)
* [jQuery](http://jquery.com) (>= 3.1.0)

Note: You can still use [underscore.js](http://underscorejs.org) (>= 1.7.0) instead of lodash.js

#### Using gridstack.js with jQuery UI

* [jQuery UI](http://jqueryui.com) (>= 1.12.0). Minimum required components: Core, Widget, Mouse, Draggable, Resizable
* (Optional) [jquery-ui-touch-punch](https://github.com/furf/jquery-ui-touch-punch) for touch-based devices support

## Install

```html
<link rel="stylesheet" href="gridstack.css" />
<script src="gridstack.js"></script>
<script src="gridstack.jQueryUI.js"></script>
```

* Using CDN:

```html
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/gridstack.js/0.2.6/gridstack.min.css" />
<script type="text/javascript" src='//cdnjs.cloudflare.com/ajax/libs/gridstack.js/0.2.6/gridstack.min.js'></script>
```

* Using bower:

```bash
$ bower install gridstack
```

* Using npm:

[![NPM version](https://img.shields.io/npm/v/gridstack.svg)](https://www.npmjs.com/package/gridstack)

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
        cellHeight: 80,
        verticalMargin: 10
    };
    $('.grid-stack').gridstack(options);
});
</script>
```

## Migrating to v0.3.0

As of v0.3.0, gridstack introduces a new plugin system. The drag'n'drop functionality has been modified to take advantage of this system. Because of this, and to avoid dependency on core code from jQuery UI, the plugin was functionality was moved to a separate file.

To ensure gridstack continues to work, either include the additional `gridstack.jQueryUI.js` file into your HTML or use `gridstack.all.js`:

```html
<script src="gridstack.js"></script>
<script src="gridstack.jQueryUI.js"></script>
```

or

```html
<script src="gridstack.all.js"></script>
```

We're working on implementing support for other drag'n'drop libraries through the new plugin system.

## Migrating to v0.2.5

As of v0.2.5 all methods and parameters are in camel case to respect [JavaScript Style Guide and Coding Conventions](http://www.w3schools.com/js/js_conventions.asp).
All old methods and parameters are marked as deprecated and still available but a warning will be displayed in js console. They will be available until v1.0
when they will be completely removed.

## API Documentation

Please check out `doc/README.md` for more information about gridstack.js API.

## Questions and Answers

Please feel free to as a questions here in issues, using [Stackoverflow](http://stackoverflow.com/search?q=gridstack) or [Slack chat](https://gridstackjs.troolee.com).
We will glad to answer and help you as soon as we can.

Also please check our FAQ `doc/FAQ.md` before asking in case the answer is already there.

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
        alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };
    $('.grid-stack').gridstack(options);
});
```

If you're still experiencing issues on touch devices please check [#444](https://github.com/troolee/gridstack.js/issues/444)

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
            '   <div class="grid-stack-item" data-bind="attr: {\'data-gs-x\': $data.x, \'data-gs-y\': $data.y, \'data-gs-width\': $data.width, \'data-gs-height\': $data.height, \'data-gs-auto-position\': $data.autoPosition}">',
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
        '   <div class="grid-stack-item" data-bind="attr: {\'data-gs-x\': $data.x, \'data-gs-y\': $data.y, \'data-gs-width\': $data.width, \'data-gs-height\': $data.height, \'data-gs-auto-position\': $data.autoPosition}">',
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

## Use with require.js

If you're using require.js and a single file jQueryUI please check out this
[Stackoverflow question](http://stackoverflow.com/questions/35582945/redundant-dependencies-with-requirejs) to get it
working properly.


## Nested grids

Gridstack may be nested. All nested grids have an additional class `grid-stack-nested` which is assigned automatically
during initialization.
See example: [Nested grid demo](http://troolee.github.io/gridstack.js/demo/nested.html)


## Resizing active grid

Resizing on-the-fly is possible, though experimental. This may be used to make gridstack responsive. gridstack will change the total number of columns and will attempt to update the width and x values of each widget to be more logical.
See example: [Responsive grid demo](http://troolee.github.io/gridstack.js/demo/responsive.html)

## Using AniJS

Using AniJS with gridstack is a breeze. In the following example, a listener is added that gets triggered by a widget being added.
See widgets wiggle! [AniJS demo](http://troolee.github.io/gridstack.js/demo/anijs.html)

The Team
========

gridstack.js is currently maintained by [Pavel Reznikov](https://github.com/troolee), [Dylan Weiss](https://github.com/radiolips)
and [Kevin Dietrich](https://github.com/kdietrich). And we appreciate [all contributors](https://github.com/troolee/gridstack.js/graphs/contributors)
for help.


Changes
=======

#### v0.3.0 (2017-04-21)

- remove placeholder when dragging widget below grid (already worked when dragging left, above, and to the right of grid).
- prevent extra checks for removing widget when dragging off grid.
- trigger `added` when a widget is added via dropping from one grid to another.
- trigger `removed` when a widget is removed via dropping from one grid to another.
- trigger `removed` when a widget is removed via dropping on a removable zone ([#607](https://github.com/troolee/gridstack.js/issues/607) and [#550])(https://github.com/troolee/gridstack.js/issues/550)).
- trigger custom event for `resizestop` called `gsresizestop` ([#577](https://github.com/troolee/gridstack.js/issues/577) and [#398](https://github.com/troolee/gridstack.js/issues/398)).
- prevent dragging/resizing in `oneColumnMode` ([#593](https://github.com/troolee/gridstack.js/issues/593)).
- add `oneColumnModeClass` option to grid.
- remove 768px CSS styles, moved to grid-stack-one-column-mode class.
- add max-width override on grid-stck-one-column-mode ([#462](https://github.com/troolee/gridstack.js/issues/462)).
- add internal function`isNodeChangedPosition`, minor optimization to move/drag.
- drag'n'drop plugin system. Move jQuery UI dependencies to separate plugin file.

#### v0.2.6 (2016-08-17)

- update requirements to the latest versions of jQuery (v3.1.0+) and jquery-ui (v1.12.0+).
- fix jQuery `size()` ([#486](https://github.com/troolee/gridstack.js/issues/486)).
- update `destroy([detachGrid])` call ([#422](https://github.com/troolee/gridstack.js/issues/422)).
- don't mutate options when calling `draggable` and `resizable`. ([#505](https://github.com/troolee/gridstack.js/issues/505)).
- update _notify to allow detach ([#411](https://github.com/troolee/gridstack.js/issues/411)).
- fix code that checks for jquery-ui ([#481](https://github.com/troolee/gridstack.js/issues/481)).
- fix `cellWidth` calculation on empty grid

#### v0.2.5 (2016-03-02)

- update names to respect js naming convention.
- `cellHeight` and `verticalMargin` can now be string (e.g. '3em', '20px') (Thanks to @jlowcs).
- add `maxWidth`/`maxHeight` methods.
- add `enableMove`/`enableResize` methods.
- fix window resize issue #331.
- add options `disableDrag` and `disableResize`.
- fix `batchUpdate`/`commit` (Thank to @radiolips)
- remove dependency of FontAwesome
- RTL support
- `'auto'` value for `cellHeight` option
- fix `setStatic` method
- add `setAnimation` method to API
- add `setGridWidth` method ([#227](https://github.com/troolee/gridstack.js/issues/227))
- add `removable`/`removeTimeout` *(experimental)*
- add `detachGrid` parameter to `destroy` method ([#216](https://github.com/troolee/gridstack.js/issues/216)) (thanks @jhpedemonte)
- add `useOffset` parameter to `getCellFromPixel` method ([#237](https://github.com/troolee/gridstack.js/issues/237))
- add `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, `id` parameters to `addWidget` ([#188](https://github.com/troolee/gridstack.js/issues/188))
- add `added` and `removed` events for when a widget is added or removed, respectively. ([#54](https://github.com/troolee/gridstack.js/issues/54))
- add `acceptWidgets` parameter. Widgets can now be draggable between grids or from outside *(experimental)*

#### v0.2.4 (2016-02-15)

- fix closure compiler/linter warnings
- add `static_grid` option.
- add `min_width`/`min_height` methods (Thanks to @cvillemure)
- add `destroy` method (Thanks to @zspitzer)
- add `placeholder_text` option (Thanks to @slauyama)
- add `handle_class` option.
- add `make_widget` method.
- lodash v 4.x support (Thanks to @andrewr88)

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

Copyright (c) 2014-2016 Pavel Reznikov, Dylan Weiss

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
