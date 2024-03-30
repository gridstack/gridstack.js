# gridstack.js

[![NPM version](https://img.shields.io/npm/v/gridstack.svg)](https://www.npmjs.com/package/gridstack)
[![Coverage Status](https://coveralls.io/repos/github/gridstack/gridstack.js/badge.svg?branch=develop)](https://coveralls.io/github/gridstack/gridstack.js?branch=develop)
[![downloads](https://img.shields.io/npm/dm/gridstack.svg)](https://www.npmjs.com/package/gridstack)

Mobile-friendly modern Typescript library for dashboard layout and creation. Making a drag-and-drop, multi-column responsive dashboard has never been easier. Has multiple bindings and works great with [Angular](https://angular.io/) (included), [React](https://reactjs.org/), [Vue](https://vuejs.org/), [Knockout.js](http://knockoutjs.com), [Ember](https://www.emberjs.com/) and others (see [frameworks](#specific-frameworks) section).

Inspired by no-longer maintained gridster, built with love.

Check http://gridstackjs.com and [these demos](http://gridstackjs.com/demo/).

If you find this lib useful, please donate [PayPal](https://www.paypal.me/alaind831) (use **“send to a friend”** to avoid 3% fee) or [Venmo](https://www.venmo.com/adumesny) (adumesny) and help support it!

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/alaind831)
[![Donate](https://img.shields.io/badge/Donate-Venmo-g.svg)](https://www.venmo.com/adumesny)

Join us on Slack: [https://gridstackjs.slack.com](https://join.slack.com/t/gridstackjs/shared_invite/zt-27q0rwf80-5vCt81Z_hfVgpRW7L17MnQ)

<!-- [![Slack Status](https://gridstackjs.com/badge.svg)](https://gridstackjs.slack.com) -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Demo and API Documentation](#demo-and-api-documentation)
- [Usage](#usage)
  - [Install](#install)
  - [Include](#include)
  - [Basic usage](#basic-usage)
  - [Requirements](#requirements)
  - [Specific frameworks](#specific-frameworks)
  - [Extend Library](#extend-library)
  - [Extend Engine](#extend-engine)
  - [Change grid columns](#change-grid-columns)
  - [Custom columns CSS](#custom-columns-css)
  - [Override resizable/draggable options](#override-resizabledraggable-options)
  - [Touch devices support](#touch-devices-support)
- [Migrating](#migrating)
  - [Migrating to v0.6](#migrating-to-v06)
  - [Migrating to v1](#migrating-to-v1)
  - [Migrating to v2](#migrating-to-v2)
  - [Migrating to v3](#migrating-to-v3)
  - [Migrating to v4](#migrating-to-v4)
  - [Migrating to v5](#migrating-to-v5)
  - [Migrating to v6](#migrating-to-v6)
  - [Migrating to v7](#migrating-to-v7)
  - [Migrating to v8](#migrating-to-v8)
  - [Migrating to v9](#migrating-to-v9)
  - [Migrating to v10](#migrating-to-v10)
- [jQuery Application](#jquery-application)
- [Changes](#changes)
- [The Team](#the-team)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Demo and API Documentation

Please visit http://gridstackjs.com and [these demos](http://gridstackjs.com/demo/), and complete [API documentation](https://github.com/gridstack/gridstack.js/tree/master/doc)

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
```

Alternatively (single combined file, notice the -all.js) in html

```html
<link href="node_modules/gridstack/dist/gridstack.min.css" rel="stylesheet"/>
<script src="node_modules/gridstack/dist/gridstack-all.js"></script>
```

**Note**: IE support was dropped in v2, but restored in v4.4 by an external contributor (I have no interest in testing+supporting obsolete browser so this likely will break again in the future).
You can use the es5 files and polyfill (larger) for older browser instead. For example:
```html
<link href="node_modules/gridstack/dist/gridstack.min.css" rel="stylesheet"/>
<script src="node_modules/gridstack/dist/es5/gridstack-poly.js"></script>
<script src="node_modules/gridstack/dist/es5/gridstack-all.js"></script>
```


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

...or see list of all [API and options](https://github.com/gridstack/gridstack.js/tree/master/doc) available.

see [jsfiddle sample](https://jsfiddle.net/adumesny/jqhkry7g) as running example too.

## Requirements

GridStack no longer requires external dependencies as of v1 (lodash was removed in v0.5 and jquery API in v1). v3 is a complete HTML5 re-write removing need for jquery. v6 is native mouse and touch event for mobile support, and no longer have jquery-ui version. All you need to include now is `gridstack-all.js` and `gridstack.min.css` (layouts are done using CSS column based %).

## Specific frameworks

search for ['gridstack' under NPM](https://www.npmjs.com/search?q=gridstack&ranking=popularity) for latest, more to come...

- **Angular**: we now ship out of the box with Angular wrapper components - see <a href="https://github.com/gridstack/gridstack.js/tree/master/angular" target="_blank">Angular Component</a>.
- **Angular9**: [lb-gridstack](https://github.com/pfms84/lb-gridstack) Note: very old v0.3 gridstack instance so recommend for **concept ONLY if you wish to use directive instead**. Code has **not been vented** at as I use components.
- **AngularJS**: [gridstack-angular](https://github.com/kdietrich/gridstack-angular)
- **Ember**: [ember-gridstack](https://github.com/yahoo/ember-gridstack)
- **knockout**: see [demo](https://gridstackjs.com/demo/knockout.html) using component, but check [custom bindings ticket](https://github.com/gridstack/gridstack.js/issues/465) which is likely better approach.
- **Rails**: [gridstack-js-rails](https://github.com/randoum/gridstack-js-rails)
- **React**: see [demo](https://gridstackjs.com/demo/react.html) with [src](https://github.com/gridstack/gridstack.js/tree/master/demo/react.html), or  [react-gridstack-example](https://github.com/Inder2108/react-gridstack-example/tree/master/src/App.js), or read on what [hooks to use](https://github.com/gridstack/gridstack.js/issues/735#issuecomment-329888796)
- **Vue**: see [demo](https://gridstackjs.com/demo/vue3js.html) with [v3 src](https://github.com/gridstack/gridstack.js/tree/master/demo/vue3js.html) or [v2 src](https://github.com/gridstack/gridstack.js/tree/master/demo/vue2js.html)
- **Aurelia**: [aurelia-gridstack](https://github.com/aurelia-ui-toolkits/aurelia-gridstack), see [demo](https://aurelia-ui-toolkits.github.io/aurelia-gridstack/)

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

## Extend Engine

You can now (5.1+) easily create your own layout engine to further customize your usage. Here is a typescript example

```ts
import { GridStack, GridStackEngine, GridStackNod, GridStackMoveOpts } from 'gridstack';

class CustomEngine extends GridStackEngine {

  /** refined this to move the node to the given new location */
  public override moveNode(node: GridStackNode, o: GridStackMoveOpts): boolean {
    // keep the same original X and Width and let base do it all...
    o.x = node.x;
    o.w = node.w;
    return super.moveNode(node, o);
  }
}

GridStack.registerEngine(CustomEngine); // globally set our custom class
```

## Change grid columns

GridStack makes it very easy if you need [1-12] columns out of the box (default is 12), but you always need **2 things** if you need to customize this:

1) Change the `column` grid option when creating a grid to your number N
```js
GridStack.init( {column: N} );
```

2) also include `gridstack-extra.css` if **N < 12** (else custom CSS - see next). Without these, things will not render/work correctly.
```html
<link href="node_modules/gridstack/dist/gridstack.min.css" rel="stylesheet"/>
<link href="node_modules/gridstack/dist/gridstack-extra.min.css" rel="stylesheet"/>

<div class="grid-stack">...</div>
```

Note: class `.grid-stack-N` will automatically be added and we include `gridstack-extra.min.css` which defines CSS for grids with custom [2-11] columns. Anything more and you'll need to generate the SASS/CSS yourself (see next).

See example: [2 grids demo](http://gridstack.github.io/gridstack.js/demo/two.html) with 6 columns

## Custom columns CSS

If you need > 12 columns or want to generate the CSS manually you will need to generate CSS rules for `.grid-stack-item[gs-w="X"]` and `.grid-stack-item[gs-x="X"]`.

For instance for 4-column grid you need CSS to be:

```css
.gs-4 > .grid-stack-item[gs-x="1"]  { left: 25% }
.gs-4 > .grid-stack-item[gs-x="2"]  { left: 50% }
.gs-4 > .grid-stack-item[gs-x="3"]  { left: 75% }

.gs-4 > .grid-stack-item { width: 25% }
.gs-4 > .grid-stack-item[gs-w="2"]  { width: 50% }
.gs-4 > .grid-stack-item[gs-w="3"]  { width: 75% }
.gs-4 > .grid-stack-item[gs-w="4"]  { width: 100% }
```

Better yet, here is a SCSS code snippet, you can use sites like [sassmeister.com](https://www.sassmeister.com/) to generate the CSS for you instead:

```scss
$columns: 20;
@function fixed($float) {
  @return round($float * 1000) / 1000; // total 2+3 digits being %
}
.gs-#{$columns} > .grid-stack-item {

  width: fixed(100% / $columns);

  @for $i from 1 through $columns - 1 {
    &[gs-x='#{$i}'] { left: fixed((100% / $columns) * $i); }
    &[gs-w='#{$i+1}'] { width: fixed((100% / $columns) * ($i+1)); }
  }
}
```

you can also use the SCSS [src/gridstack-extra.scss](https://github.com/gridstack/gridstack.js/tree/master/src/gridstack-extra.scss) included in NPM package and modify to add more columns.

Sample gulp command for 30 columns:
```js
gulp.src('node_modules/gridstack/dist/src/gridstack-extra.scss')
        .pipe(replace('$start: 2 !default;','$start: 30;'))
        .pipe(replace('$end: 11 !default;','$end: 30;'))
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

gridstack v6+ now support mobile out of the box, with the addition of native touch event (along with mouse event) for drag&drop and resize.
Older versions (3.2+) required the jq version with added touch punch, but doesn't work well with nested grids.

This option is now the default:

```js
let options = {
  alwaysShowResizeHandle: 'mobile' // true if we're on mobile devices
};
GridStack.init(options);
```

See [example](http://gridstack.github.io/gridstack.js/demo/mobile.html).

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

3. `oneColumnMode` would trigger when `window.width` < 768px by default. We now check for grid width instead (more correct and supports nesting). You might need to adjust grid `oneColumnSize` or `disableOneColumnMode`.

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


## Migrating to v5

make sure to read v4 migration first!

v5 does not have any breaking changes from v4, but a focus on nested grids in h5 mode:
You can now drag in/out of parent into nested child, with new API parameters values. See the release notes.

## Migrating to v6

the API did not really change from v5, but a complete re-write of Drag&Drop to use native `mouseevent` (instead of HTML draggable=true which is buggy on Mac Safari, and doesn't work on mobile devices) and `touchevent` (mobile), and we no longer have jquery ui option (wasn't working well for nested grids, didn't want to maintain legacy lib).

The main difference is you only need to include gridstack.js and get D&D (desktop and mobile) out of the box for the same size as h5 version.

## Migrating to v7

New addition, no API breakage per say. See release notes about creating sub-grids on the fly.

## Migrating to v8

Possible breaking change if you use nested grid JSON format, or original Angular wrapper, or relied on specific CSS paths. Also target is now ES2020 (see release notes).
* `GridStackOptions.subGrid` -> `GridStackOptions.subGridOpts` rename. We now have `GridStackWidget.subGridOpts` vs `GridStackNode.subGrid` (was both types which is error prone)
* `GridStackOptions.addRemoveCB` -> `GridStack.addRemoveCB` is now global instead of grid option
* removed `GridStackOptions.dragInOptions` since `GridStack.setupDragIn()` has it replaced since 4.0
* remove `GridStackOptions.minWidth` obsolete since 5.1, use `oneColumnSize` instead
* CSS rules removed `.grid-stack` prefix for anything already gs based, 12 column (default) now uses `.gs-12`, extra.css is less than 1/4th it original size!, `gs-min|max_w|h` attribute no longer written (but read)

## Migrating to v9

New addition - see release notes about `sizeToContent` feature.
Possible break:
* `GridStack.onParentResize()` is now called `onResize()` as grid now directly track size change, no longer involving parent per say to tell us anything. Note sure why it was public.

## Migrating to v10

we now support much richer responsive behavior with `GridStackOptions.columnOpts` including any breakpoint width:column pairs, or automatic column sizing.

breaking change: 
* `disableOneColumnMode`, `oneColumnSize` have been removed (thought we temporary convert if you have them). use `columnOpts: { breakpoints: [{w:768, c:1}] }` for the same behavior.
* 1 column mode switch is no longer by default (`columnOpts` is not defined) as too many new users had issues. Instead set it explicitly (see above).
* `oneColumnModeDomSort` has been removed. Planning to support per column layouts at some future times. TBD

# jQuery Application

This is **old and no longer apply to v6+**. You'll need to use v5.1.1 and before

```js
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import 'gridstack/dist/jq/gridstack-dd-jqueryui';
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
Alternatively (single combined file) in html

```html
<link href="node_modules/gridstack/dist/gridstack.min.css" rel="stylesheet"/>
<!-- HTML5 drag&drop (70k) -->
<script src="node_modules/gridstack/dist/gridstack-h5.js"></script>
<!-- OR jquery-ui drag&drop (195k) -->
<script src="node_modules/gridstack/dist/gridstack-jq.js"></script>
<!-- OR static grid (40k) -->
<script src="node_modules/gridstack/dist/gridstack-static.js"></script>
```

We have a native HTML5 drag'n'drop through the plugin system (default), but the jquery-ui version can be used instead. It will bundle `jquery` (3.5.1) + `jquery-ui` (1.13.1 minimal drag|drop|resize) + `jquery-ui-touch-punch` (1.0.8 for mobile support) in `gridstack-jq.js`. 

**NOTE: in v4, v3**: we ES6 module import jquery & jquery-ui by name, so you need to specify location of those .js files, which means you might be able to bring your own version as well. See the include instructions.

**NOTE: in v1.x** IFF you want to use gridstack-jq instead and your app needs to bring your own JQ version, you should **instead** include `gridstack-poly.min.js` (optional IE support) + `gridstack.min.js` + `gridstack.jQueryUI.min.js` after you import your JQ libs. But note that there are issue with jQuery and ES6 import (see [1306](https://github.com/gridstack/gridstack.js/issues/1306)).

As for events, you can still use `$(".grid-stack").on(...)` for the version that uses jquery-ui for things we don't support.

# Changes

View our change log [here](https://github.com/gridstack/gridstack.js/tree/master/doc/CHANGES.md).


# The Team

gridstack.js is currently maintained by [Alain Dumesny](https://github.com/adumesny), before that [Dylan Weiss](https://github.com/radiolips), originally created by [Pavel Reznikov](https://github.com/troolee). We appreciate [all contributors](https://github.com/gridstack/gridstack.js/graphs/contributors) for help.
