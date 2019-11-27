gridstack.js
============

[![Build Status](https://travis-ci.org/gridstack/gridstack.js.svg?branch=develop)](https://travis-ci.org/gridstack/gridstack.js)
[![Coverage Status](https://coveralls.io/repos/github/gridstack/gridstack.js/badge.svg?branch=develop)](https://coveralls.io/github/gridstack/gridstack.js?branch=develop)
[![Dependency Status](https://david-dm.org/gridstack/gridstack.js.svg)](https://david-dm.org/gridstack/gridstack.js)
[![devDependency Status](https://david-dm.org/gridstack/gridstack.js/dev-status.svg)](https://david-dm.org/gridstack/gridstack.js#info=devDependencies)

gridstack.js is a mobile-friendly Javascript library for dashboard layout and creation. Making a drag-and-drop, multi-column dashboard has never been easier. gridstack.js allows you to build draggable, responsive bootstrap v3-friendly layouts. It also works great with [knockout.js](http://knockoutjs.com), [angular.js](https://angularjs.org), [ember](https://www.emberjs.com/).

Join gridstack.js on Slack: https://gridstackjs.troolee.com

[![Slack Status](https://gridstackjs.troolee.com/badge.svg)](https://gridstackjs.troolee.com)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Demo and examples](#demo-and-examples)
- [Usage](#usage)
  - [Requirements](#requirements)
  - [Install](#install)
  - [Basic usage](#basic-usage)
  - [Migrating to v0.3.0](#migrating-to-v030)
  - [API Documentation](#api-documentation)
  - [Touch devices support](#touch-devices-support)
  - [gridstack.js for specific frameworks](#gridstackjs-for-specific-frameworks)
  - [Change grid columns](#change-grid-columns)
  - [Custom columns CSS](#custom-columns-css)
  - [Override resizable/draggable options](#override-resizabledraggable-options)
- [Changes](#changes)
- [The Team](#the-team)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


Demo and examples
====

Please visit http://gridstackjs.com for a demo or check out [these examples](http://gridstackjs.com/demo/).


Usage
=====

## Requirements

* [jQuery](http://jquery.com) (>= 1.8)
* `Array.prototype.find`, and `Number.isNaN()` for IE and older browsers.
  * Note: as of v0.5.4 We supply a separate `gridstack-poly.js` for that 
(part of `gridstack.all.js`) or you can look at other pollyfills 
([core.js](https://github.com/zloirock/core-js#ecmascript-6-array) and [mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)).

Using gridstack.js with jQuery UI

* [jQuery UI](http://jqueryui.com) (>= 1.12.0). Minimum required components: Draggable, Droppable, Resizable (Widget, Mouse, core).
  * Note: as of v0.5.4 we include this subset as `jquery-ui.js` (and min.js) which is part of `gridstack.all.js`. If you wish to bring your own lib, include the individual gridstack parts instead of all.js
* (Optional) [jquery-ui-touch-punch](https://github.com/furf/jquery-ui-touch-punch) for touch-based devices support

## Install

* Using CDN (minimized):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gridstack@0.5.4/dist/gridstack.min.css" />
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/gridstack@0.5.4/dist/gridstack.all.js"></script>
```

* Using CDN (debug):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gridstack@0.5.4/dist/gridstack.css" />
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/gridstack@0.5.4/dist/gridstack.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/gridstack@0.5.4/dist/jquery-ui.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/gridstack@0.5.4/dist/gridstack.jQueryUI.js"></script>
```

* or local:

```html
<link rel="stylesheet" href="gridstack.css" />
<script src="gridstack.js"></script>
<script src="jquery-ui.js"></script>
<script src="gridstack.jQueryUI.js"></script>
```

* Using npm:

[![NPM version](https://img.shields.io/npm/v/gridstack.svg)](https://www.npmjs.com/package/gridstack)

```bash
$ npm install gridstack
```

* Using bower:

```bash
$ bower install gridstack
```

You can also download source and build and use `dist` directory as well for latest non published code.

## Basic usage

```html
<div class="grid-stack">
  <div class="grid-stack-item">
    <div class="grid-stack-item-content">Item 1</div>
  </div>
  <div class="grid-stack-item" data-gs-width="2">
    <div class="grid-stack-item-content">Item 2 wider</div>
  </div>
</div>

<script type="text/javascript">
$(function () {
  $('.grid-stack').gridstack();
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


## API Documentation

Documentation can be found [here](https://github.com/gridstack/gridstack.js/tree/develop/doc).


## Touch devices support

Please use [jQuery UI Touch Punch](https://github.com/furf/jquery-ui-touch-punch) to make jQuery UI Draggable/Resizable
working on touch-based devices.

```html
<script src="core-js/client/shim.min.js"></script>
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

If you're still experiencing issues on touch devices please check [#444](https://github.com/gridstack/gridstack.js/issues/444)


## gridstack.js for specific frameworks

- AngularJS: [gridstack-angular](https://github.com/kdietrich/gridstack-angular)
- Rails: [gridstack-js-rails](https://github.com/randoum/gridstack-js-rails)
- ember: [gridstack-ember](https://github.com/yahoo/ember-gridstack)


## Change grid columns

GridStack makes it very easy if you need [1-12] columns out of the box (default is 12), but you always need **2 things** if you need to customize this:

1) Change the `column` grid option when creating a grid to your number N
```js
$('.grid-stack').gridstack( {column: N} );
```

2) include `gridstack-extra.css` if **N < 12** (else custom CSS - see next). Without these, things will not render/work correctly.
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gridstack@0.5.4/dist/gridstack-extra.css"/>

<div class="grid-stack grid-stack-N">...</div>
```

Note `grid-stack-N` class was added, and extra CSS.

`gridstack-extra.css` (and `gridstack-extra.min.css`) defines CSS for grids with custom [1-12] columns. Anything more and you'll need to generate the SASS/CSS yourself (see next).

See example: [2 grids demo](http://gridstack.github.io/gridstack.js/demo/two.html) with 6 columns

## Custom columns CSS

If you need > 12 columns or want to generate the CSS manually (else see above) you will need to generate CSS rules for `.grid-stack-item[data-gs-width="X"]` and `.grid-stack-item[data-gs-x="X"]`.

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

Better yet, here is a SASS code snippet which can make life much easier (Thanks to @ascendantofrain, [#81](https://github.com/gridstack/gridstack.js/issues/81) and @StefanM98, [#868](https://github.com/gridstack/gridstack.js/issues/868)) and you can use sites like [sassmeister.com](https://www.sassmeister.com/) to generate the CSS for you instead:

```sass
.grid-stack > .grid-stack-item {

  $gridstack-columns: 12;

  min-width: (100% / $gridstack-columns);

  @for $i from 1 through $gridstack-columns {
    &[data-gs-width='#{$i}'] { width: (100% / $gridstack-columns) * $i; }
    &[data-gs-x='#{$i}'] { left: (100% / $gridstack-columns) * $i; }
    &[data-gs-min-width='#{$i}'] { min-width: (100% / $gridstack-columns) * $i; }
    &[data-gs-max-width='#{$i}'] { max-width: (100% / $gridstack-columns) * $i; }
  }
}
```

## Override resizable/draggable options

You can override default `resizable`/`draggable` options. For instance to enable other then bottom right resizing handle
you can init gridstack like:

```javascript
$('.grid-stack').gridstack({
  resizable: {
    handles: 'e, se, s, sw, w'
  }
});
```

Note: It's not recommended to enable `nw`, `n`, `ne` resizing handles. Their behaviour may be unexpected.

Changes
=====

View our change log [here](https://github.com/gridstack/gridstack.js/tree/develop/doc/CHANGES.md).


The Team
========

gridstack.js is currently maintained by [Dylan Weiss](https://github.com/radiolips) and [Alain Dumesny](https://github.com/adumesny), originally created by [Pavel Reznikov](https://github.com/troolee). We appreciate [all contributors](https://github.com/gridstack/gridstack.js/graphs/contributors) for help.
