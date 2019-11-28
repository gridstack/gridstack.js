Change log
==========================

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [v0.5.5 (2019-11-27)](#v055-2019-11-27)
- [v0.5.4 (2019-11-26)](#v054-2019-11-26)
- [v0.5.3 (2019-11-20)](#v053-2019-11-20)
- [v0.5.2 (2019-11-13)](#v052-2019-11-13)
- [v0.5.1 (2019-11-07)](#v051-2019-11-07)
- [v0.5.0 (2019-11-06)](#v050-2019-11-06)
- [v0.4.0 (2018-05-11)](#v040-2018-05-11)
- [v0.3.0 (2017-04-21)](#v030-2017-04-21)
- [v0.2.6 (2016-08-17)](#v026-2016-08-17)
- [v0.2.5 (2016-03-02)](#v025-2016-03-02)
- [v0.2.4 (2016-02-15)](#v024-2016-02-15)
- [v0.2.3 (2015-06-23)](#v023-2015-06-23)
- [v0.2.2 (2014-12-23)](#v022-2014-12-23)
- [v0.2.1 (2014-12-09)](#v021-2014-12-09)
- [v0.2.0 (2014-11-30)](#v020-2014-11-30)
- [v0.1.0 (2014-11-18)](#v010-2014-11-18)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## v0.5.5 (2019-11-27)

- min files include rev number/license [#1075](https://github.com/gridstack/gridstack.js/pull/1075)
- npm package fix to exclude more temporary content [#1078](https://github.com/gridstack/gridstack.js/pull/1078)
- removed `jquery-ui/*` requirements from AMD packing in `gridstack.jQueryUI.js` as it was causing App compile missing errors now that we include a subset of jquery-ui

## v0.5.4 (2019-11-26)

- fix for griditems with x=0 placement wrong order (introduced by [#1017](https://github.com/gridstack/gridstack.js/issues/10510174)) ([#1054](https://github.com/gridstack/gridstack.js/issues/1054)).
- fix `cellHeight(val)` not working due to style change (introduced by [#937](https://github.com/gridstack/gridstack.js/issues/937)) ([#1068](https://github.com/gridstack/gridstack.js/issues/1068)).
- add `gridstack-poly.js` for IE and older browsers, removed `core-js` lib from samples (<1k vs 85k), and all IE8 mentions ([#1061](https://github.com/gridstack/gridstack.js/pull/1061)).
- add `jquery-ui.js` (and min.js) as minimal subset we need (55k vs 248k), which is now part of `gridstack.all.js`. Include individual parts if you need your own lib instead of all.js
([#1064](https://github.com/gridstack/gridstack.js/pull/1064)).
- changed jquery dependency to lowest we can use (>=1.8) ([#629](https://github.com/gridstack/gridstack.js/issues/629)).
- add advance demo from web site ([#1073](https://github.com/gridstack/gridstack.js/pull/1073)).

## v0.5.3 (2019-11-20)

- grid options `width` is now `column`, `height` now `maxRow`, and `setGridWidth()` now `setColumn()` to match what they are. Old names are still supported (console warnings). Various fixes for custom # of column and re-wrote entire doc section ([#1053](https://github.com/gridstack/gridstack.js/issues/1053)).
- fix widgets not animating when `animate: true` is used. on every move, styles were recreated-fix should slightly improve gridstack.js speed ([#937](https://github.com/gridstack/gridstack.js/issues/937)).
- fix moving widgets when having multiple grids. jquery-ui workaround ([#1043](https://github.com/gridstack/gridstack.js/issues/1043)).
- switch to eslint ([#763](https://github.com/gridstack/gridstack.js/issues/763)) thanks [@rwstoneback](https://github.com/rwstoneback).
- fix null values `addWidget()` options ([#1042](https://github.com/gridstack/gridstack.js/issues/1042)).

## v0.5.2 (2019-11-13)

- undefined `x,y` position messes up grid ([#1017](https://github.com/gridstack/gridstack.js/issues/1017)).
- changed code to 2 spaces.
- fix minHeight during `onStartMoving()` ([#999](https://github.com/gridstack/gridstack.js/issues/999)).
- TypeScript definition file now included - no need to include @types/gridstack, easier to update ([#1036](https://github.com/gridstack/gridstack.js/pull/1036)).
- new `addWidget(el, options)` to pass object so you don't have to spell 10 params. ([#907](https://github.com/gridstack/gridstack.js/issues/907)).

## v0.5.1 (2019-11-07)

- reduced npm package size from 672k to 324k (drop demo, src and extra files)

## v0.5.0 (2019-11-06)

- emit `dropped` event when a widget is dropped from one grid into another ([#823](https://github.com/gridstack/gridstack.js/issues/823)).
- don't throw error if no bounding scroll element is found ([#891](https://github.com/gridstack/gridstack.js/issues/891)).
- don't push locked widgets even if they are at the top of the grid ([#882](https://github.com/gridstack/gridstack.js/issues/882)).
- RequireJS and CommonJS now export on the `exports` module fix ([#643](https://github.com/gridstack/gridstack.js/issues/643)).
- automatically scroll page when widget is moving beyond viewport ([#827](https://github.com/gridstack/gridstack.js/issues/827)).
- removed lodash dependencies ([#693](https://github.com/gridstack/gridstack.js/issues/693)).
- don't overwrite globals jQuery when in a modular environment ([#974](https://github.com/gridstack/gridstack.js/pull/974)).
- removed z-index from `.grid-stack-item-content` causing child modal dialog clipping ([#984](https://github.com/gridstack/gridstack.js/pull/984)).
- convert project to use yarn ([#983](https://github.com/gridstack/gridstack.js/pull/983)).

## v0.4.0 (2018-05-11)

- widgets can have their own resize handles. Use `data-gs-resize-handles` element attribute to use. For example, `data-gs-resize-handles="e,w"` will make the particular widget only resize west and east. ([#494](https://github.com/gridstack/gridstack.js/issues/494)).
- enable sidebar items to be duplicated properly. Pass `helper: 'clone'` in `draggable` options. ([#661](https://github.com/gridstack/gridstack.js/issues/661), [#396](https://github.com/gridstack/gridstack.js/issues/396), [#499](https://github.com/gridstack/gridstack.js/issues/499)).
- fix `staticGrid` grid option ([#743](https://github.com/gridstack/gridstack.js/issues/743))
- preserve inline styles when moving/cloning items (thanks [@silverwind](https://github.com/silverwind))
- fix bug causing heights not to get set ([#744](https://github.com/gridstack/gridstack.js/issues/744))
- allow grid to have min-height, fixes ([#628](https://github.com/gridstack/gridstack.js/issues/628)) thanks [@adumesny](https://github.com/adumesny)
- widget x and y are now ints (thanks [@DonnchaC](https://github.com/donnchac))
- allow all droppable options (thanks [@vigor-vlad](https://github.com/vigor-vlad))
- properly track mouse position in `getCellFromPixel` (thanks [@aletorrado](https://github.com/aletorrado))
- remove instance of `!important` (thanks [@krilllind](https://github.com/krilllind))
- scroll when moving widget up or down out of viewport ([#827](https://github.com/gridstack/gridstack.js/issues/827))

## v0.3.0 (2017-04-21)

- remove placeholder when dragging widget below grid (already worked when dragging left, above, and to the right of grid).
- prevent extra checks for removing widget when dragging off grid.
- trigger `added` when a widget is added via dropping from one grid to another.
- trigger `removed` when a widget is removed via dropping from one grid to another.
- trigger `removed` when a widget is removed via dropping on a removable zone ([#607](https://github.com/gridstack/gridstack.js/issues/607) and [#550](https://github.com/gridstack/gridstack.js/issues/550)).
- trigger custom event for `resizestop` called `gsresizestop` ([#577](https://github.com/gridstack/gridstack.js/issues/577) and [#398](https://github.com/gridstack/gridstack.js/issues/398)).
- prevent dragging/resizing in `oneColumnMode` ([#593](https://github.com/gridstack/gridstack.js/issues/593)).
- add `oneColumnModeClass` option to grid.
- remove 768px CSS styles, moved to grid-stack-one-column-mode class.
- add max-width override on grid-stck-one-column-mode ([#462](https://github.com/gridstack/gridstack.js/issues/462)).
- add internal function`isNodeChangedPosition`, minor optimization to move/drag.
- drag'n'drop plugin system. Move jQuery UI dependencies to separate plugin file.

## v0.2.6 (2016-08-17)

- update requirements to the latest versions of jQuery (v3.1.0+) and jquery-ui (v1.12.0+).
- fix jQuery `size()` ([#486](https://github.com/gridstack/gridstack.js/issues/486)).
- update `destroy([detachGrid])` call ([#422](https://github.com/gridstack/gridstack.js/issues/422)).
- don't mutate options when calling `draggable` and `resizable`. ([#505](https://github.com/gridstack/gridstack.js/issues/505)).
- update _notify to allow detach ([#411](https://github.com/gridstack/gridstack.js/issues/411)).
- fix code that checks for jquery-ui ([#481](https://github.com/gridstack/gridstack.js/issues/481)).
- fix `cellWidth` calculation on empty grid

## v0.2.5 (2016-03-02)

- update names to respect js naming convention.
- `cellHeight` and `verticalMargin` can now be string (e.g. '3em', '20px') (Thanks to @jlowcs).
- add `maxWidth`/`maxHeight` methods.
- add `enableMove`/`enableResize` methods.
- fix window resize issue [#331](https://github.com/gridstack/gridstack.js/issues/331)).
- add options `disableDrag` and `disableResize`.
- fix `batchUpdate`/`commit` (Thank to @radiolips)
- remove dependency of FontAwesome
- RTL support
- `'auto'` value for `cellHeight` option
- fix `setStatic` method
- add `setAnimation` method to API
- add `setGridWidth` method ([#227](https://github.com/gridstack/gridstack.js/issues/227))
- add `removable`/`removeTimeout` *(experimental)*
- add `detachGrid` parameter to `destroy` method ([#216](https://github.com/gridstack/gridstack.js/issues/216)) (thanks @jhpedemonte)
- add `useOffset` parameter to `getCellFromPixel` method ([#237](https://github.com/gridstack/gridstack.js/issues/237))
- add `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, `id` parameters to `addWidget` ([#188](https://github.com/gridstack/gridstack.js/issues/188))
- add `added` and `removed` events for when a widget is added or removed, respectively. ([#54](https://github.com/gridstack/gridstack.js/issues/54))
- add `acceptWidgets` parameter. Widgets can now be draggable between grids or from outside *(experimental)*

## v0.2.4 (2016-02-15)

- fix closure compiler/linter warnings
- add `static_grid` option.
- add `min_width`/`min_height` methods (Thanks to @cvillemure)
- add `destroy` method (Thanks to @zspitzer)
- add `placeholder_text` option (Thanks to @slauyama)
- add `handle_class` option.
- add `make_widget` method.
- lodash v 4.x support (Thanks to @andrewr88)

## v0.2.3 (2015-06-23)

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

## v0.2.2 (2014-12-23)

- fix grid initialization
- add `cell_height`/`cell_width` API methods
- fix boolean attributes ([#31](https://github.com/gridstack/gridstack.js/issues/31))

## v0.2.1 (2014-12-09)

- add widgets locking ([#19](https://github.com/gridstack/gridstack.js/issues/19))
- add `will_it_fit` API method
- fix auto-positioning ([#20](https://github.com/gridstack/gridstack.js/issues/20))
- add animation (thanks to @ishields)
- fix `y` coordinate calculation when dragging ([#18](https://github.com/gridstack/gridstack.js/issues/18))
- fix `remove_widget` ([#16](https://github.com/gridstack/gridstack.js/issues/16))
- minor fixes


## v0.2.0 (2014-11-30)

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

## v0.1.0 (2014-11-18)

Very first version.
