gridstack.js
============

[![NPM version](https://img.shields.io/npm/v/gridstack.svg)](https://www.npmjs.com/package/gridstack)
[![Dependency Status](https://david-dm.org/gridstack/gridstack.js.svg)](https://david-dm.org/gridstack/gridstack.js)
[![devDependency Status](https://david-dm.org/gridstack/gridstack.js/dev-status.svg)](https://david-dm.org/gridstack/gridstack.js#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/github/gridstack/gridstack.js/badge.svg?branch=develop)](https://coveralls.io/github/gridstack/gridstack.js?branch=develop)
[![downloads](https://img.shields.io/npm/dm/gridstack.svg)](https://www.npmjs.com/package/gridstack)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/alaind831)

Mobile-friendly Javascript library for dashboard layout and creation. Making a drag-and-drop, multi-column dashboard has never been easier. Allows you to build draggable, responsive bootstrap v4-friendly layouts. It also has multiple bindings and works great with [React](https://reactjs.org/), [Angular](https://angular.io/), [Knockout.js](http://knockoutjs.com), [Ember](https://www.emberjs.com/) and others, and comes with a Typescript definition out of the box.

Inspired by no-longer maintained gridster.js, built with love.

Please visit http://gridstackjs.com and [these demos](http://gridstackjs.com/demo/).

Join us on Slack: https://gridstackjs.troolee.com

[![Slack Status](https://gridstackjs.troolee.com/badge.svg)](https://gridstackjs.troolee.com)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Demo and examples](#demo-and-examples)
- [Usage](#usage)
  - [Install](#install)
  - [Include](#include)
  - [Basic usage](#basic-usage)
  - [Requirements](#requirements)
  - [API Documentation](#api-documentation)
  - [Extend Library](#extend-library)
  - [Touch devices support](#touch-devices-support)
  - [gridstack.js for specific frameworks](#gridstackjs-for-specific-frameworks)
  - [Change grid columns](#change-grid-columns)
  - [Custom columns CSS](#custom-columns-css)
  - [Override resizable/draggable options](#override-resizabledraggable-options)
  - [Migrating to v1.0.0](#migrating-to-v100)
- [Changes](#changes)
- [The Team](#the-team)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


Demo and examples
====

Please visit http://gridstackjs.com and [these demos](http://gridstackjs.com/demo/)


Usage
=====

## Install

* Using yarn / npm:

[![NPM version](https://img.shields.io/npm/v/gridstack.svg)](https://www.npmjs.com/package/gridstack)

```bash
yarn install gridstack
or
npm install --save gridstack
```

## Include

* local:

```html
<link rel="stylesheet" href="gridstack.css" />
<script src="gridstack.all.js"></script>
```

* Using CDN (minimized):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gridstack@1.0.0/dist/gridstack.min.css" />
<script src="https://cdn.jsdelivr.net/npm/gridstack@1.0.0/dist/gridstack.all.js"></script>
```

## Basic usage

creating items dynamically...

```html
<div class="grid-stack"></div>

<script type="text/javascript">
  var grid = GridStack.init();
  grid.addWidget('<div><div class="grid-stack-item-content"> test </div></div>', {width: 2});
</script>
```

... or DOM created items

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
  GridStack.init();
</script>
```

see [jsfiddle sample](https://jsfiddle.net/adumesny/jqhkry7g) as running example too.

## Requirements

gridstack.js no longer requires external dependencies as of v1.0.0 (lodash was removed in v0.5.0 and jquery API in v1.0.0). All you need to include is `gridstack.all.js` and `gridstack.css` (layouts are done using CSS column based %).

## API Documentation

Documentation can be found [here](https://github.com/gridstack/gridstack.js/tree/develop/doc).


## Extend Library

You can easily extend or patch gridstack with code like this:

```js
// extend gridstack with our own custom method
window.GridStack.prototype.printCount = function() {
  console.log('grid has ' + this.grid.nodes.length + ' items');
};

var grid = GridStack.init();

// you can now call on any grid this...
grid.printCount();
```

## Touch devices support

Please use [jQuery UI Touch Punch](https://github.com/furf/jquery-ui-touch-punch) to make jQuery UI Draggable/Resizable
working on touch-based devices.

```html
<script src="gridstack.all.js"></script>
<script src="jquery.ui.touch-punch.min.js"></script>
```

Also `alwaysShowResizeHandle` option may be useful:

```js
var options = {
  alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
};
GridStack.init(options);
```

If you're still experiencing issues on touch devices please check [#444](https://github.com/gridstack/gridstack.js/issues/444)


## gridstack.js for specific frameworks

search for ['gridstack' under NPM](https://www.npmjs.com/search?q=gridstack&ranking=popularity) for latest, more to come...

- ember: [gridstack-ember](https://github.com/yahoo/ember-gridstack)
- AngularJS: [gridstack-angular](https://github.com/kdietrich/gridstack-angular)
- Angular8: [lb-gridstack](https://github.com/pfms84/lb-gridstack)
- Rails: [gridstack-js-rails](https://github.com/randoum/gridstack-js-rails)
- React: [react-gridstack](https://github.com/pitrho/react-gridstack)

## Change grid columns

GridStack makes it very easy if you need [1-12] columns out of the box (default is 12), but you always need **2 things** if you need to customize this:

1) Change the `column` grid option when creating a grid to your number N
```js
GridStack.init( {column: N} );
```

2) include `gridstack-extra.css` if **N < 12** (else custom CSS - see next). Without these, things will not render/work correctly.
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gridstack@0.6.4/dist/gridstack-extra.css"/>

<div class="grid-stack grid-stack-N">...</div>
```

Note: we added `grid-stack-N` class and `gridstack-extra.css` which defines CSS for grids with custom [1-12] columns. Anything more and you'll need to generate the SASS/CSS yourself (see next).

See example: [2 grids demo](http://gridstack.github.io/gridstack.js/demo/two.html) with 6 columns

## Custom columns CSS

If you need > 12 columns or want to generate the CSS manually you will need to generate CSS rules for `.grid-stack-item[data-gs-width="X"]` and `.grid-stack-item[data-gs-x="X"]`.

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

you can also look at the SASS [src/gridstack-extra.scss](https://github.com/gridstack/gridstack.js/blob/develop/src/gridstack-extra.scss) and modify to add more columns
and also have the `.grid-stack-N` prefix to support letting the user change columns dynamically.

## Override resizable/draggable options

You can override default `resizable`/`draggable` options. For instance to enable other then bottom right resizing handle
you can init gridstack like:

```js
GridStack.init({
  resizable: {
    handles: 'e, se, s, sw, w'
  }
});
```

Note: It's not recommended to enable `nw`, `n`, `ne` resizing handles. Their behaviour may be unexpected.

## Migrating to v1.0.0

v1.0.0 removed Jquery from the API and external dependencies, which will require some code changes. Here is a list of the changes:

1. your code only needs to include `gridstack.all.js` and `gristack.css` (don't include or depend on jquery) and is recommended you do that as internal dependencies will change. Right now jquery+jquery-ui (trimmed versions) are still being used internally for a short while.

2. code change:

**OLD** initializing code + adding a widget + adding an event:
```js
// initialization returned Jquery element, requiring second call to get GridStack var
$('.grid-stack').gridstack(opts?);
var grid = $('.grid-stack').data('gridstack');

// returned Jquery element
grid.addWidget($('<div><div class="grid-stack-item-content"> test </div></div>'), {width: 2});

// jquery event handler
$('.grid-stack').on('added', function(e, items) {/* items contains info */});

```
**NEW**
```js
// element identifier defaults to '.grid-stack', returns the grid
// for Typescript use window.GridStack.init()
var grid = GridStack.init(opts?, element?);

// returns DOM element
grid.addWidget('<div><div class="grid-stack-item-content"> test </div></div>', {width: 2});

// event handler
grid.on('added', function(e, items) {/* items contains info */});

```

Other  vars/global changes
```
`GridStackUI` --> `GridStack`
`GridStackUI.GridStackEngine` --> `GridStack.Engine`
`grid.container` (jquery grid wrapper) --> `grid.el` (grid DOM element)
`grid.grid` (GridStackEngine) --> `grid.engine`
`grid.setColumn(N)` --> `grid.column(N)` and new `grid.column()` to get value, old API still supported though
```

Recommend looking at the [many samples](../demo) for more code examples.

We're working on implementing support for other drag'n'drop libraries through the plugin system. Right now it is still jquery-ui based (but minimal build content)

Changes
=====

View our change log [here](https://github.com/gridstack/gridstack.js/tree/develop/doc/CHANGES.md).


The Team
========

gridstack.js is currently maintained by [Dylan Weiss](https://github.com/radiolips) and [Alain Dumesny](https://github.com/adumesny), originally created by [Pavel Reznikov](https://github.com/troolee). We appreciate [all contributors](https://github.com/gridstack/gridstack.js/graphs/contributors) for help.
