# gridstack.js

[![NPM version](https://img.shields.io/npm/v/gridstack.svg)](https://www.npmjs.com/package/gridstack)
[![Dependency Status](https://david-dm.org/gridstack/gridstack.js.svg)](https://david-dm.org/gridstack/gridstack.js)
[![devDependency Status](https://david-dm.org/gridstack/gridstack.js/dev-status.svg)](https://david-dm.org/gridstack/gridstack.js#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/github/gridstack/gridstack.js/badge.svg?branch=develop)](https://coveralls.io/github/gridstack/gridstack.js?branch=develop)
[![downloads](https://img.shields.io/npm/dm/gridstack.svg)](https://www.npmjs.com/package/gridstack)

Mobile-friendly modern Typescript library for dashboard layout and creation. Making a drag-and-drop, multi-column responsive dashboard has never been easier. Has multiple bindings and works great with [React](https://reactjs.org/), [Vue](https://vuejs.org/), [Angular](https://angular.io/), [Knockout.js](http://knockoutjs.com), [Ember](https://www.emberjs.com/) and others (see [frameworks](#gridstackjs-for-specific-frameworks) section).

Inspired by no-longer maintained gridster, built with love.

Check http://gridstackjs.com and [these demos](http://gridstackjs.com/demo/).

If you find this lib useful, please donate [PayPal](https://www.paypal.me/alaind831) (use **“send to a friend”** to avoid 3% fee) or [Venmo](https://www.venmo.com/adumesny) (adumesny) and help support it!

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
  - [Change grid columns](#change-grid-columns)
  - [Custom columns CSS](#custom-columns-css)
  - [Override resizable/draggable options](#override-resizabledraggable-options)
  - [Touch devices support](#touch-devices-support)
- [gridstack.js for specific frameworks](#gridstackjs-for-specific-frameworks)
- [Migrating](#migrating)
  - [Migrating to v0.6](#migrating-to-v06)
  - [Migrating to v1](#migrating-to-v1)
  - [Migrating to v2](#migrating-to-v2)
  - [Migrating to v3](#migrating-to-v3)
  - [Migrating to v4](#migrating-to-v4)
- [jQuery Application](#jquery-application)
- [Changes](#changes)
- [The Team](#the-team)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Demo and examples

Please visit http://gridstackjs.com and [these demos](http://gridstackjs.com/demo/)


# Usage

## Install
[![NPM version](https://img.shields.io/npm/v/gridstack.svg)](https://www.npmjs.com/package/gridstack)

```js
yarn add gridstack
// or
npm install --save gridstack
```

## Include

ES6 or Typescript

```js
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
// THEN to get HTML5 drag&drop
import 'gridstack/dist/h5/gridstack-dd-native';
// OR to get legacy jquery-ui drag&drop (support Mobile touch devices, h5 does not yet)
import 'gridstack/dist/jq/gridstack-dd-jqueryui';
// OR nothing to get static grids (API driven, no user drag&drop)
```

**Note**: `jquery` & `jquery-ui` are imported by name, so you will have to specify their location in your webpack (or equivalent) config file, 
which means you can possibly bring your own version
```js
  alias: {
    'jquery': 'gridstack/dist/jq/jquery.js',
    'jquery-ui': 'gridstack/dist/jq/jquery-ui.js',
    'jquery.ui': 'gridstack/dist/jq/jquery-ui.js',
    'jquery.ui.touch-punch': 'gridstack/dist/jq/jquery.ui.touch-punch.js',
  },
```

Alternatively in html

```html
<link href="node_modules/gridstack/dist/gridstack.min.css" rel="stylesheet"/>
<!-- HTML5 drag&drop (68k) -->
<script src="node_modules/gridstack/dist/gridstack-h5.js"></script>
<!-- OR jquery-ui drag&drop (193k) -->
<script src="node_modules/gridstack/dist/gridstack-jq.js"></script>
<!-- OR static grid (38k) -->
<script src="node_modules/gridstack/dist/gridstack-static.js"></script>
```

Note: the API is the same, regardless of the plugin (or lack thereof) so you can switch at any time. The Jquery version will export $ that it bundles and currently the only one to support mobile/touch devices through `jquery.ui.touch-punch` (h5 version is planned). Read more at [migrating to v3](#migrating-to-v3)

## Basic usage

creating items dynamically...

```js
// ...in your HTML
<div class="grid-stack"></div>

// ...in your script
var grid = GridStack.init();
grid.addWidget({w: 2, content: 'item 1'});
```

... or creating from list

```js
// using serialize data instead of .addWidget()
const serializedData = [
  {x: 0, y: 0, w: 2, h: 2},
  {x: 2, y: 3, w: 3, content: 'item 2'},
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
  <div class="grid-stack-item" gs-w="2">
    <div class="grid-stack-item-content">Item 2 wider</div>
  </div>
</div>

// ...in your script
GridStack.init();
```

see [jsfiddle sample](https://jsfiddle.net/adumesny/jqhkry7g) as running example too.

## Requirements

GridStack no longer requires external dependencies as of v1.0.0 (lodash was removed in v0.5.0 and jquery API in v1.0.0). v3.0.0 is a complete HTML5 re-write which removes all jquery dependency (still available for legacy apps). All you need to include now is `gridstack-h5.js` and `gridstack.min.css` (layouts are done using CSS column based %).

## API Documentation

Documentation can be found [here](https://github.com/gridstack/gridstack.js/tree/master/doc).


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

## Change grid columns

GridStack makes it very easy if you need [1-12] columns out of the box (default is 12), but you always need **2 things** if you need to customize this:

1) Change the `column` grid option when creating a grid to your number N
```js
GridStack.init( {column: N} );
```

2) include `gridstack-extra.css` if **N < 12** (else custom CSS - see next). Without these, things will not render/work correctly.
```html
<link href="node_modules/gridstack/dist/gridstack-extra.css" rel="stylesheet"/>

<div class="grid-stack grid-stack-N">...</div>
```

Note: class `.grid-stack-N` was added and we include `gridstack-extra.css` which defines CSS for grids with custom [2-11] columns. Anything more and you'll need to generate the SASS/CSS yourself (see next).

See example: [2 grids demo](http://gridstack.github.io/gridstack.js/demo/two.html) with 6 columns

## Custom columns CSS

If you need > 12 columns or want to generate the CSS manually you will need to generate CSS rules for `.grid-stack-item[gs-w="X"]` and `.grid-stack-item[gs-x="X"]`.

For instance for 3-column grid you need to rewrite CSS to be:

```css
.grid-stack-item[gs-w="3"]  { width: 100% }
.grid-stack-item[gs-w="2"]  { width: 66.66666667% }
.grid-stack-item[gs-w="1"]  { width: 33.33333333% }

.grid-stack-item[gs-x="2"]  { left: 66.66666667% }
.grid-stack-item[gs-x="1"]  { left: 33.33333333% }
```

For 4-column grid it should be:

```css
.grid-stack-item[gs-w="4"]  { width: 100% }
.grid-stack-item[gs-w="3"]  { width: 75% }
.grid-stack-item[gs-w="2"]  { width: 50% }
.grid-stack-item[gs-w="1"]  { width: 25% }

.grid-stack-item[gs-x="3"]  { left: 75% }
.grid-stack-item[gs-x="2"]  { left: 50% }
.grid-stack-item[gs-x="1"]  { left: 25% }
```

and so on.

Better yet, here is a SASS code snippet which can make life much easier (Thanks to @ascendantofrain, [#81](https://github.com/gridstack/gridstack.js/issues/81) and @StefanM98, [#868](https://github.com/gridstack/gridstack.js/issues/868)) and you can use sites like [sassmeister.com](https://www.sassmeister.com/) to generate the CSS for you instead:

```sass
.grid-stack > .grid-stack-item {

  $gridstack-columns: 12;

  min-width: (100% / $gridstack-columns);

  @for $i from 1 through $gridstack-columns {
    &[gs-w='#{$i}'] { width: (100% / $gridstack-columns) * $i; }
    &[gs-x='#{$i}'] { left: (100% / $gridstack-columns) * $i; }
    &[gs-min-w='#{$i}'] { min-width: (100% / $gridstack-columns) * $i; }
    &[gs-max-w='#{$i}'] { max-width: (100% / $gridstack-columns) * $i; }
  }
}
```

you can also use the SASS [src/gridstack-extra.scss](https://github.com/gridstack/gridstack.js/tree/master/src/gridstack-extra.scss) included in NPM package and modify to add more columns
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
    handles: 'e,se,s,sw,w'
  }
});
```

## Touch devices support

gridstack v3.2 jq version compiles touch support (html5 version does not yet support `touchmove` events. This will be added in a future release), so it works out of the box, no need for anything.
You **used** to need [jQuery UI Touch Punch](https://github.com/RWAP/jquery-ui-touch-punch) to make jQuery UI Draggable/Resizable
work on touch-based devices (now distributed as `dist/jq/jquery.ui.touch-punch.js` for reference).


This option will be useful:

```js
let options = {
  alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
};
GridStack.init(options);
```

See [example](http://gridstack.github.io/gridstack.js/demo/mobile.html). If you're still experiencing issues on touch devices please check [#444](https://github.com/gridstack/gridstack.js/issues/444)

# gridstack.js for specific frameworks

search for ['gridstack' under NPM](https://www.npmjs.com/search?q=gridstack&ranking=popularity) for latest, more to come...

- **Angular9**: [lb-gridstack](https://github.com/pfms84/lb-gridstack) Note: very old v0.3 gridstack instance so recommend for concept ONLY. You can do component or directive. Working on exposing the Angular component wrapper we use internally.
- **AngularJS**: [gridstack-angular](https://github.com/kdietrich/gridstack-angular)
- **Ember**: [ember-gridstack](https://github.com/yahoo/ember-gridstack)
- **knockout**: see [demo](https://gridstackjs.com/demo/knockout.html) using component, but check [custom bindings ticket](https://github.com/gridstack/gridstack.js/issues/465) which is likely better approach.
- **Rails**: [gridstack-js-rails](https://github.com/randoum/gridstack-js-rails)
- **React**: see [demo](https://gridstackjs.com/demo/react.html) with [src](https://github.com/gridstack/gridstack.js/tree/master/demo/react.html), or  [react-gridstack-example](https://github.com/Inder2108/react-gridstack-example/tree/master/src/App.js), or read on what [hooks to use](https://github.com/gridstack/gridstack.js/issues/735#issuecomment-329888796)
- **Vue**: see [demo](https://gridstackjs.com/demo/vue3js.html) with [v3 src](https://github.com/gridstack/gridstack.js/tree/master/demo/vue3js.html) or [v2 src](https://github.com/gridstack/gridstack.js/tree/master/demo/vue2js.html)

# Migrating
## Migrating to v0.6

starting in 0.6.x `change` event are no longer sent (for pretty much most nodes!) when an item is just added/deleted unless it also changes other nodes (was incorrect and causing inefficiencies). You may need to track `added|removed` [events](https://github.com/gridstack/gridstack.js/tree/master/doc#events) if you didn't and relied on the old broken behavior.

## Migrating to v1

v1.0.0 removed Jquery from the API and external dependencies, which will require some code changes. Here is a list of the changes:

0. see previous step if not on v0.6 already

1. your code only needs to `import GridStack from 'gridstack'` or include `gridstack.all.js` and `gristack.css` (don't include other JS) and is recommended you do that as internal dependencies will change over time. If you are jquery based, see [jquery app](#jquery-application) section.

2. code change:

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
// Note: in 3.x it's ever simpler 
// grid.addWidget({w:2, content: 'test'})

// event handler
grid.on('added', function(e, items) {/* items contains info */});

// grid access after init
var grid = el.gridstack; // where el = document.querySelector('.grid-stack') or other ways...
```
Other rename changes

```js
`GridStackUI` --> `GridStack`
`GridStackUI.GridStackEngine` --> `GridStack.Engine`
`grid.container` (jquery grid wrapper) --> `grid.el` // (grid DOM element)
`grid.grid` (GridStackEngine) --> `grid.engine`
`grid.setColumn(N)` --> `grid.column(N)` and `grid.column()` // to get value, old API still supported though
```

Recommend looking at the [many samples](./demo) for more code examples.

## Migrating to v2

make sure to read v1 migration first!

v2 is a Typescript rewrite of 1.x, removing all jquery events, using classes and overall code cleanup to support ES6 modules. Your code might need to change from 1.x

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

## Migrating to v3

make sure to read v2 migration first!

v3 has a new HTML5 drag&drop plugging (63k total, all native code), while still allowing you to use the legacy jquery-ui version instead (188k), or a new static grid version (34k, no user drag&drop but full API support). You will need to decide which version to use as `gridstack.all.js` no longer exist (same is now `gridstack-jq.js`) - see [include info](#include).

**NOTE**: HTML5 version is almost on parity with the old jquery-ui based drag&drop. the `containment` (prevent a child from being dragged outside it's parent) and `revert` (not clear what it is for yet) are not yet implemented in initial release of v3.0.0.<br>
Also mobile devices don't support h5 `drag` events (will need to handle `touch`) whereas v3.2 jq version now now supports out of the box (see [v3.2 release](https://github.com/gridstack/gridstack.js/releases/tag/v3.2.0))

Breaking changes:

1. include (as mentioned) need to change

2. `GridStack.update(el, opt)` now takes single `GridStackWidget` options instead of only supporting (x,y,w,h) BUT legacy call in JS will continue working the same for now. That method is a complete re-write and does the right constrain and updates now for all the available params.

3. `locked()`, `move()`, `resize()`, `minWidth()`, `minHeight()`, `maxWidth()`, `maxHeight()` methods are hidden from Typescript (JS can still call for now) as they are just 1 liner wrapper around `update(el, opt)` anyway and will go away soon. (ex: `move(el, x, y)` => `update(el, {x, y})`)

4. item attribute like `data-gs-min-width` is now `gs-min-w`. We removed 'data-' from all attributes, and shorten 'width|height' to just 'w|h' to require less typing and more efficient (2k saved in .js alone!).

5. `GridStackWidget` used in most API `width|height|minWidth|minHeight|maxWidth|maxHeight` are now shorter `w|h|minW|minH|maxW|maxH` as well

## Migrating to v4

make sure to read v3 migration first!

v4 is a complete re-write of the collision and drag in/out heuristics to fix some very long standing request & bugs. It also greatly improved usability. Read the release notes for more detail.

**Unlikely** Breaking Changes (internal usage):

1. `removeTimeout` was removed (feedback over trash will be immediate - actual removal still on mouse up)

2. the following `GridStackEngine` methods changed (used internally, doesn't affect `GridStack` public API)

```js
// moved to 3 methods with new option params to support new code and pixel coverage check
`collision()` -> `collide(), collideAll(), collideCoverage()`
`moveNodeCheck(node, x, y, w, h)` -> `moveNodeCheck(node, opt: GridStackMoveOpts)`
`isNodeChangedPosition(node, x, y, w, h)` -> `changedPosConstrain(node, opt: GridStackMoveOpts)`
`moveNode(node, x, y, w, h, noPack)` -> `moveNode(node, opt: GridStackMoveOpts)`
```

3. removed old obsolete (v0.6-v1 methods/attrs) `getGridHeight()`, `verticalMargin`, `data-gs-current-height`,
`locked()`, `maxWidth()`, `minWidth()`, `maxHeight()`, `minHeight()`, `move()`, `resize()`


# jQuery Application

We now have a native HTML5 drag'n'drop through the plugin system (default), but the jquery-ui version can be used instead. It will bundle `jquery` (3.5.1) + `jquery-ui` (1.12.1 minimal drag|drop|resize) + `jquery-ui-touch-punch` (1.0.8 for mobile support) in `gridstack-jq.js`. 

**NOTE: in v4, v3**: we ES6 module import jquery & jquery-ui by name, so you need to specify location of those .js files, which means you might be able to bring your own version as well. See the include instructions.

**NOTE: in v1.x** IFF you want to use gridstack-jq instead and your app needs to bring your own JQ version, you should **instead** include `gridstack-poly.min.js` (optional IE support) + `gridstack.min.js` + `gridstack.jQueryUI.min.js` after you import your JQ libs. But note that there are issue with jQuery and ES6 import (see [1306](https://github.com/gridstack/gridstack.js/issues/1306)).

As for events, you can still use `$(".grid-stack").on(...)` for the version that uses jquery-ui for things we don't support.

# Changes

View our change log [here](https://github.com/gridstack/gridstack.js/tree/master/doc/CHANGES.md).


# The Team

gridstack.js is currently maintained by [Alain Dumesny](https://github.com/adumesny) and [Dylan Weiss](https://github.com/radiolips), originally created by [Pavel Reznikov](https://github.com/troolee). We appreciate [all contributors](https://github.com/gridstack/gridstack.js/graphs/contributors) for help.
