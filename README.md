gridstack.js
============

[![NPM version](https://img.shields.io/npm/v/gridstack.svg)](https://www.npmjs.com/package/gridstack)
[![Dependency Status](https://david-dm.org/gridstack/gridstack.js.svg)](https://david-dm.org/gridstack/gridstack.js)
[![devDependency Status](https://david-dm.org/gridstack/gridstack.js/dev-status.svg)](https://david-dm.org/gridstack/gridstack.js#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/github/gridstack/gridstack.js/badge.svg?branch=develop)](https://coveralls.io/github/gridstack/gridstack.js?branch=develop)
[![downloads](https://img.shields.io/npm/dm/gridstack.svg)](https://www.npmjs.com/package/gridstack)

Mobile-friendly modern Typescript library for dashboard layout and creation. Making a drag-and-drop, multi-column responsive dashboard has never been easier. Has multiple bindings and works great with [React](https://reactjs.org/), [Vue](https://vuejs.org/), [Angular](https://angular.io/), [Knockout.js](http://knockoutjs.com), [Ember](https://www.emberjs.com/) and others (see [frameworks](#gridstackjs-for-specific-frameworks) section).

Inspired by no-longer maintained gridster, built with love.

Check http://gridstackjs.com and [these demos](http://gridstackjs.com/demo/).

If you find this lib useful, please donate [PayPal](https://www.paypal.me/alaind831) or [Venmo](https://www.venmo.com/adumesny) (adumesny) and help support it!

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/alaind831)
[![Donate](https://img.shields.io/badge/Donate-Venmo-g.svg)](https://www.venmo.com/adumesny)

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
  - [gridstack.js for specific frameworks](#gridstackjs-for-specific-frameworks)
  - [Change grid columns](#change-grid-columns)
  - [Custom columns CSS](#custom-columns-css)
  - [Override resizable/draggable options](#override-resizabledraggable-options)
  - [Touch devices support](#touch-devices-support)
  - [Migrating to v0.6](#migrating-to-v06)
  - [Migrating to v1](#migrating-to-v1)
    - [jQuery Application](#jquery-application)
  - [Migrating to v2](#migrating-to-v2)
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

```js
yarn add gridstack
// or
npm install --save gridstack
```

## Include

ES6 or Typescript

```js
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.css';
```

legacy javascript. If you need to import individual files (see [jquery apps](#jquery-application) section)

```js
import 'gridstack/dist/gridstack.all.js';
import 'gridstack/dist/gridstack.css';
```

alternatively in html

```html
<link rel="stylesheet" href="node_modules/gridstack/dist/gridstack.min.css" />
<script src="node_modules/gridstack/dist/gridstack.all.js"></script>
```

or using CDN (minimized):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gridstack@2.1.0/dist/gridstack.min.css" />
<script src="https://cdn.jsdelivr.net/npm/gridstack@2.1.0/dist/gridstack.all.js"></script>
```

.map files are included for debugging purposes.

## Basic usage

creating items dynamically...

```js
// ...in your HTML
<div class="grid-stack"></div>

// ...in your script
var grid = GridStack.init();
grid.addWidget({width: 2, content: 'item 1'});
```

... or creating from list

```js
// using serialize data instead of .addWidget()
const serializedData = [
  {x: 0, y: 0, width: 2, height: 2},
  {x: 2, y: 3, width: 3, content: 'item 2'},
  {x: 1, y: 3}
];

grid.load(serializedData);
```

... or DOM created items

```js
// ...in your HTML
<div class="grid-stack">
  <div class="grid-stack-item">
    <div class="grid-stack-item-content">Item 1</div>
  </div>
  <div class="grid-stack-item" data-gs-width="2">
    <div class="grid-stack-item-content">Item 2 wider</div>
  </div>
</div>

// ...in your script
GridStack.init();
```

see [jsfiddle sample](https://jsfiddle.net/adumesny/jqhkry7g) as running example too.

## Requirements

GridStack no longer requires external dependencies as of v1.0.0 (lodash was removed in v0.5.0 and jquery API in v1.0.0). All you need to include is `gridstack.all.js` and `gridstack.css` (layouts are done using CSS column based %).

## API Documentation

Documentation can be found [here](https://github.com/gridstack/gridstack.js/tree/develop/doc).


## Extend Library

You can easily extend or patch gridstack with code like this:

```js
// extend gridstack with our own custom method
GridStack.prototype.printCount = function() {
  console.log('grid has ' + this.engine.nodes.length + ' items');
};

let grid = GridStack.init();

// you can now call
grid.printCount();
```

## gridstack.js for specific frameworks

search for ['gridstack' under NPM](https://www.npmjs.com/search?q=gridstack&ranking=popularity) for latest, more to come...

- vue.js: see [demo v3](https://github.com/gridstack/gridstack.js/blob/develop/demo/vue3js.html) or [demo v2](https://github.com/gridstack/gridstack.js/blob/develop/demo/vue2js.html) 
- ember: [ember-gridstack](https://github.com/yahoo/ember-gridstack)
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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gridstack@2.1.0/dist/gridstack-extra.css"/>

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

you can also use the SASS [src/gridstack-extra.scss](https://github.com/gridstack/gridstack.js/blob/develop/src/gridstack-extra.scss) included in NPM package and modify to add more columns
and also have the `.grid-stack-N` prefix to support letting the user change columns dynamically.

Sample gulp command for 30 columns:
```js
gulp.src('node_modules/gridstack/dist/src/gridstack-extra.scss')
        .pipe(replace('$gridstack-columns: 11 !default;','$gridstack-columns: 30;'))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('dist/css'))
```

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

Note: It's not recommended to enable `nw`, `n`, `ne` resizing handles. Their behavior may be unexpected.

## Touch devices support

Please use [jQuery UI Touch Punch](https://github.com/furf/jquery-ui-touch-punch) to make jQuery UI Draggable/Resizable
working on touch-based devices.

```html
<script src="gridstack.all.js"></script>
<script src="jquery.ui.touch-punch.min.js"></script>
```

Also `alwaysShowResizeHandle` option may be useful:

```js
let options = {
  alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
};
GridStack.init(options);
```

If you're still experiencing issues on touch devices please check [#444](https://github.com/gridstack/gridstack.js/issues/444)


## Migrating to v0.6

starting in 0.6.x `change` event are no longer sent (for pretty much most nodes!) when an item is just added/deleted unless it also changes other nodes (was incorrect and causing inefficiencies). You may need to track `added|removed` [events](https://github.com/gridstack/gridstack.js/tree/develop/doc#events) if you didn't and relied on the old broken behavior.

## Migrating to v1

v1.0.0 removed Jquery from the API and external dependencies, which will require some code changes. Here is a list of the changes:

1. see [Migrating to v0.6](#migrating-to-v06) if you didn't already

2. your code only needs to include `gridstack.all.js` and `gristack.css` (don't include other JS) and is recommended you do that as internal dependencies will change over time. If you are jquery based, see [jquery app](#jquery-application) below.

3. code change:

**OLD** initializing code + adding a widget + adding an event:
```js
// initialization returned Jquery element, requiring second call to get GridStack var
var grid = $('.grid-stack').gridstack(opts?).data('gridstack');

// returned Jquery element
grid.addWidget($('<div><div class="grid-stack-item-content"> test </div></div>'), undefined, undefined, 2, undefined, true);

// jquery event handler
$('.grid-stack').on('added', function(e, items) {/* items contains info */});

// grid access after init
var grid = $('.grid-stack').data('gridstack');
```
**NEW**
```js
// element identifier defaults to '.grid-stack', returns the grid
// Note: for Typescript use window.GridStack.init() until next native 2.x TS version
var grid = GridStack.init(opts?, element?);

// returns DOM element
grid.addWidget('<div><div class="grid-stack-item-content"> test </div></div>', {width: 2});

// event handler
grid.on('added', function(e, items) {/* items contains info */});

// grid access after init
var grid = el.gridstack; // where el = document.querySelector('.grid-stack') or other ways...
```
Other changes

```js
`GridStackUI` --> `GridStack`
`GridStackUI.GridStackEngine` --> `GridStack.Engine`
`grid.container` (jquery grid wrapper) --> `grid.el` // (grid DOM element)
`grid.grid` (GridStackEngine) --> `grid.engine`
`grid.setColumn(N)` --> `grid.column(N)` and `grid.column()` // to get value, old API still supported though
```

Recommend looking at the [many samples](./demo) for more code examples.

### jQuery Application

We're working on implementing HTML5 drag'n'drop through the plugin system. Right now it is still jquery-ui based. Because of that we are still bundling `jquery` (3.5.1) + `jquery-ui` (1.12.1 minimal drag|drop|resize) internally in `gridstack.all.js`. IFF your app needs to bring your own version instead, you should **instead** include `gridstack-poly.min.js` (optional IE support) + `gridstack.min.js` + `gridstack.jQueryUI.min.js` after you import your JQ libs. But note that there are issue with jQuery and ES6 import (see [1306](https://github.com/gridstack/gridstack.js/issues/1306)).

Note: v2.0.0 does not currently support importing GridStack Drag&Drop without also including our jquery + jqueryui. Still trying to figure how to make that bundle possible. You will have to use 1.x

As for events, you can still use `$(".grid-stack").on(...)` while jqueryui is used internally for things we don't support, but recommended you don't as that will get dropped at some point.

## Migrating to v2

make sure to read v1 migration first!

v2.x is a Typescript rewrite of 1.x, removing all jquery events, using classes and overall code cleanup to support ES6 modules. Your code might need to change from 1.x

1. In general methods that used no args (getter) vs setter can't be used in TS when the arguments differ (set/get are also not function calls so API would have changed). Instead we decided to have <b>all set methods return</b> `GridStack` to they can be chain-able (ex: `grid.float(true).cellHeight(10).column(6)`). Also legacy methods that used to take many parameters will now take a single object (typically `GridStackOptions` or `GridStackWidget`).

```js
`addWidget(el, x, y, width, height)` --> `addWidget(el, {with: 2})`
// Note: in 2.1.x you can now just do addWidget({with: 2, content: "text"})
`float()` --> `getFloat()` // to get value
`cellHeight()` --> `getCellHeight()` // to get value
`verticalMargin` --> `margin` // grid options and API that applies to all 4 sides.
`verticalMargin()` --> `getMargin()` // to get value
```

2. event signatures are generic and not jquery-ui dependent anymore. `gsresizestop` has been removed as `resizestop|dragstop` are now called **after** the DOM attributes have been updated.

3. `oneColumnMode` would trigger when `window.width` < 768px by default. We now check for grid width instead (more correct and supports nesting). You might need to adjust grid `minWidth` or `disableOneColumnMode`.

**Note:** 2.x no longer support legacy IE11 and older due to using more compact ES6 output and typecsript native code. You will need to stay at 1.x

Changes
=====

View our change log [here](https://github.com/gridstack/gridstack.js/tree/develop/doc/CHANGES.md).


The Team
========

gridstack.js is currently maintained by [Alain Dumesny](https://github.com/adumesny) and [Dylan Weiss](https://github.com/radiolips), originally created by [Pavel Reznikov](https://github.com/troolee). We appreciate [all contributors](https://github.com/gridstack/gridstack.js/graphs/contributors) for help.
