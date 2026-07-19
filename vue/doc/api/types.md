# types

## Interfaces

### GridStackHostApi

Defined in: [vue/projects/lib/src/types.ts:14](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L14)

Host API stamped on `.grid-stack` element as `_gridComp` for `addRemoveCB` dispatch.

#### Methods

##### registerSyntheticItemId()

```ts
registerSyntheticItemId(id): void;
```

Defined in: [vue/projects/lib/src/types.ts:15](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L15)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`void`

##### unregisterSyntheticItemId()

```ts
unregisterSyntheticItemId(id): void;
```

Defined in: [vue/projects/lib/src/types.ts:16](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`void`

##### requestUpdate()

```ts
requestUpdate(): void;
```

Defined in: [vue/projects/lib/src/types.ts:18](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L18)

Notify Vue to re-read node props after GS `update()` / `updateCB`.

###### Returns

`void`

##### registerWidgetSerializer()

```ts
registerWidgetSerializer(
   id, 
   serialize, 
   deserialize?): () => void;
```

Defined in: [vue/projects/lib/src/types.ts:19](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L19)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `serialize` | () => `Record`\<`string`, `unknown`\> |
| `deserialize?` | (`data`) => `void` |

###### Returns

```ts
(): void;
```

###### Returns

`void`

##### mergeWidgetPropsForSave()

```ts
mergeWidgetPropsForSave(id, w): void;
```

Defined in: [vue/projects/lib/src/types.ts:25](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L25)

Merge `useWidgetSerializer` results into `w.props` during `grid.save()`.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `w` | [`GridStackWidget`](#gridstackwidget) |

###### Returns

`void`

##### deserializeWidget()

```ts
deserializeWidget(id, w): void;
```

Defined in: [vue/projects/lib/src/types.ts:27](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L27)

Call widget's deserialize callback with updated props (invoked by `updateCB`).

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `w` | [`GridStackWidget`](#gridstackwidget) |

###### Returns

`void`

***

### GridStackWidget

Defined in: [vue/projects/lib/src/types.ts:32](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L32)

#### Extends

- `Omit`\<`CoreGridStackWidget`, `"subGridOpts"`\>

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="x"></a> `x?` | `number` | widget position x (default?: 0) | [`GridStackNode`](#gridstacknode).[`x`](#x-1) | dist/types.d.ts:321 |
| <a id="y"></a> `y?` | `number` | widget position y (default?: 0) | [`GridStackNode`](#gridstacknode).[`y`](#y-1) | dist/types.d.ts:323 |
| <a id="w"></a> `w?` | `number` | widget dimension width (default?: 1) | [`GridStackNode`](#gridstacknode).[`w`](#w-1) | dist/types.d.ts:325 |
| <a id="h"></a> `h?` | `number` | widget dimension height (default?: 1) | [`GridStackNode`](#gridstacknode).[`h`](#h-1) | dist/types.d.ts:327 |
| <a id="autoposition"></a> `autoPosition?` | `boolean` | if true then x, y parameters will be ignored and widget will be places on the first available position (default?: false) | [`GridStackNode`](#gridstacknode).[`autoPosition`](#autoposition-1) | dist/types.d.ts:334 |
| <a id="minw"></a> `minW?` | `number` | minimum width allowed during resize/creation (default?: undefined = un-constrained) | [`GridStackNode`](#gridstacknode).[`minW`](#minw-1) | dist/types.d.ts:336 |
| <a id="maxw"></a> `maxW?` | `number` | maximum width allowed during resize/creation (default?: undefined = un-constrained) | [`GridStackNode`](#gridstacknode).[`maxW`](#maxw-1) | dist/types.d.ts:338 |
| <a id="minh"></a> `minH?` | `number` | minimum height allowed during resize/creation (default?: undefined = un-constrained) | [`GridStackNode`](#gridstacknode).[`minH`](#minh-1) | dist/types.d.ts:340 |
| <a id="maxh"></a> `maxH?` | `number` | maximum height allowed during resize/creation (default?: undefined = un-constrained) | [`GridStackNode`](#gridstacknode).[`maxH`](#maxh-1) | dist/types.d.ts:342 |
| <a id="noresize"></a> `noResize?` | `boolean` | prevent direct resizing by the user (default?: undefined = un-constrained) | [`GridStackNode`](#gridstacknode).[`noResize`](#noresize-1) | dist/types.d.ts:344 |
| <a id="nomove"></a> `noMove?` | `boolean` | prevents direct moving by the user (default?: undefined = un-constrained) | [`GridStackNode`](#gridstacknode).[`noMove`](#nomove-1) | dist/types.d.ts:346 |
| <a id="locked"></a> `locked?` | `boolean` | prevents being pushed by other widgets or api (default?: undefined = un-constrained), which is different from `noMove` (user action only) | [`GridStackNode`](#gridstacknode).[`locked`](#locked-1) | dist/types.d.ts:348 |
| <a id="id"></a> `id?` | `string` | value for `gs-id` stored on the widget (default?: undefined) | [`GridStackNode`](#gridstacknode).[`id`](#id-1) | dist/types.d.ts:350 |
| <a id="content"></a> `content?` | `string` | html to append inside as content | [`GridStackNode`](#gridstacknode).[`content`](#content-1) | dist/types.d.ts:352 |
| <a id="lazyload"></a> `lazyLoad?` | `boolean` | true when widgets are only created when they scroll into view (visible) | [`GridStackNode`](#gridstacknode).[`lazyLoad`](#lazyload-1) | dist/types.d.ts:354 |
| <a id="sizetocontent"></a> `sizeToContent?` | `number` \| `boolean` | local (vs grid) override - see GridStackOptions. Note: This also allow you to set a maximum h value (but user changeable during normal resizing) to prevent unlimited content from taking too much space (get scrollbar) | [`GridStackNode`](#gridstacknode).[`sizeToContent`](#sizetocontent-1) | dist/types.d.ts:357 |
| <a id="resizetocontentparent"></a> `resizeToContentParent?` | `string` | local override of GridStack.resizeToContentParent that specify the class to use for the parent (actual) vs child (wanted) height | [`GridStackNode`](#gridstacknode).[`resizeToContentParent`](#resizetocontentparent-1) | dist/types.d.ts:359 |
| <a id="component"></a> `component?` | `string` | Key in the `components` map passed to `<GridStack :components="...">` | - | [vue/projects/lib/src/types.ts:34](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L34) |
| <a id="props"></a> `props?` | [`GridStackWidgetProps`](#gridstackwidgetprops) | - | - | [vue/projects/lib/src/types.ts:35](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L35) |
| <a id="class"></a> `class?` | `string` | Extra CSS classes on the widget root. | - | [vue/projects/lib/src/types.ts:37](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L37) |
| <a id="el"></a> `el?` | `HTMLElement` | Runtime DOM node when removing via `addRemoveCB` (not serialized). | - | [vue/projects/lib/src/types.ts:39](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L39) |
| <a id="subgridopts"></a> `subGridOpts?` | [`GridStackOptions`](#gridstackoptions) | Nested grid options (recursive; uses Vue-extended widget children). | - | [vue/projects/lib/src/types.ts:41](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L41) |

***

### GridStackNode

Defined in: [vue/projects/lib/src/types.ts:44](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L44)

#### Extends

- `GridStackNode`

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="x-1"></a> `x?` | `number` | widget position x (default?: 0) | `CoreGridStackNode.x` | dist/types.d.ts:321 |
| <a id="y-1"></a> `y?` | `number` | widget position y (default?: 0) | `CoreGridStackNode.y` | dist/types.d.ts:323 |
| <a id="w-1"></a> `w?` | `number` | widget dimension width (default?: 1) | `CoreGridStackNode.w` | dist/types.d.ts:325 |
| <a id="h-1"></a> `h?` | `number` | widget dimension height (default?: 1) | `CoreGridStackNode.h` | dist/types.d.ts:327 |
| <a id="autoposition-1"></a> `autoPosition?` | `boolean` | if true then x, y parameters will be ignored and widget will be places on the first available position (default?: false) | `CoreGridStackNode.autoPosition` | dist/types.d.ts:334 |
| <a id="minw-1"></a> `minW?` | `number` | minimum width allowed during resize/creation (default?: undefined = un-constrained) | `CoreGridStackNode.minW` | dist/types.d.ts:336 |
| <a id="maxw-1"></a> `maxW?` | `number` | maximum width allowed during resize/creation (default?: undefined = un-constrained) | `CoreGridStackNode.maxW` | dist/types.d.ts:338 |
| <a id="minh-1"></a> `minH?` | `number` | minimum height allowed during resize/creation (default?: undefined = un-constrained) | `CoreGridStackNode.minH` | dist/types.d.ts:340 |
| <a id="maxh-1"></a> `maxH?` | `number` | maximum height allowed during resize/creation (default?: undefined = un-constrained) | `CoreGridStackNode.maxH` | dist/types.d.ts:342 |
| <a id="noresize-1"></a> `noResize?` | `boolean` | prevent direct resizing by the user (default?: undefined = un-constrained) | `CoreGridStackNode.noResize` | dist/types.d.ts:344 |
| <a id="nomove-1"></a> `noMove?` | `boolean` | prevents direct moving by the user (default?: undefined = un-constrained) | `CoreGridStackNode.noMove` | dist/types.d.ts:346 |
| <a id="locked-1"></a> `locked?` | `boolean` | prevents being pushed by other widgets or api (default?: undefined = un-constrained), which is different from `noMove` (user action only) | `CoreGridStackNode.locked` | dist/types.d.ts:348 |
| <a id="id-1"></a> `id?` | `string` | value for `gs-id` stored on the widget (default?: undefined) | `CoreGridStackNode.id` | dist/types.d.ts:350 |
| <a id="content-1"></a> `content?` | `string` | html to append inside as content | `CoreGridStackNode.content` | dist/types.d.ts:352 |
| <a id="lazyload-1"></a> `lazyLoad?` | `boolean` | true when widgets are only created when they scroll into view (visible) | `CoreGridStackNode.lazyLoad` | dist/types.d.ts:354 |
| <a id="sizetocontent-1"></a> `sizeToContent?` | `number` \| `boolean` | local (vs grid) override - see GridStackOptions. Note: This also allow you to set a maximum h value (but user changeable during normal resizing) to prevent unlimited content from taking too much space (get scrollbar) | `CoreGridStackNode.sizeToContent` | dist/types.d.ts:357 |
| <a id="resizetocontentparent-1"></a> `resizeToContentParent?` | `string` | local override of GridStack.resizeToContentParent that specify the class to use for the parent (actual) vs child (wanted) height | `CoreGridStackNode.resizeToContentParent` | dist/types.d.ts:359 |
| <a id="subgridopts-1"></a> `subGridOpts?` | `GridStackOptions` | optional nested grid options and list of children, which then turns into actual instance at runtime to get options from | `CoreGridStackNode.subGridOpts` | dist/types.d.ts:361 |
| <a id="el-1"></a> `el?` | `GridItemHTMLElement` | pointer back to HTML element | `CoreGridStackNode.el` | dist/types.d.ts:431 |
| <a id="grid"></a> `grid?` | `GridStack` | pointer back to parent Grid instance | `CoreGridStackNode.grid` | dist/types.d.ts:433 |
| <a id="subgrid"></a> `subGrid?` | `GridStack` | actual sub-grid instance | `CoreGridStackNode.subGrid` | dist/types.d.ts:435 |
| <a id="visibleobservable"></a> `visibleObservable?` | `IntersectionObserver` | allow delay creation when visible | `CoreGridStackNode.visibleObservable` | dist/types.d.ts:437 |
| <a id="component-1"></a> `component?` | `string` | - | - | [vue/projects/lib/src/types.ts:45](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L45) |

***

### GridStackOptions

Defined in: [vue/projects/lib/src/types.ts:48](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L48)

#### Extends

- `Omit`\<`CoreGridStackOptions`, `"children"` \| `"subGridOpts"`\>

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="acceptwidgets"></a> `acceptWidgets?` | `string` \| `boolean` \| (`element`) => `boolean` | Accept widgets dragged from other grids or from outside (default: `false`). Can be: - `true`: will accept HTML elements having 'grid-stack-item' as class attribute - `false`: will not accept any external widgets - string: explicit class name to accept instead of default - function: callback called before an item will be accepted when entering a grid **Example** `// Accept all grid items acceptWidgets: true // Accept only items with specific class acceptWidgets: 'my-draggable-item' // Custom validation function acceptWidgets: (el) => { return el.getAttribute('data-accept') === 'true'; }` **See** [http://gridstack.github.io/gridstack.js/demo/two.html](http://gridstack.github.io/gridstack.js/demo/two.html) for complete example | `Omit.acceptWidgets` | dist/types.d.ts:155 |
| <a id="alwaysshowresizehandle"></a> `alwaysShowResizeHandle?` | `boolean` \| `"mobile"` | possible values (default: `mobile`) - does not apply to non-resizable widgets `false` the resizing handles are only shown while hovering over a widget `true` the resizing handles are always shown 'mobile' if running on a mobile device, default to `true` (since there is no hovering per say), else `false`. See [example](http://gridstack.github.io/gridstack.js/demo/mobile.html) | `Omit.alwaysShowResizeHandle` | dist/types.d.ts:161 |
| <a id="animate"></a> `animate?` | `boolean` | turns animation on (default?: true) | `Omit.animate` | dist/types.d.ts:163 |
| <a id="auto"></a> `auto?` | `boolean` | if false gridstack will not initialize existing items (default?: true) | `Omit.auto` | dist/types.d.ts:165 |
| <a id="cellheight"></a> `cellHeight?` | `numberOrString` | One cell height (default: 'auto'). Can be: - an integer (px): fixed pixel height - a string (ex: '100px', '10em', '10rem'): CSS length value - 0: library will not generate styles for rows (define your own CSS) - 'auto': height calculated for square cells (width / column) and updated live on window resize - 'initial': similar to 'auto' but stays fixed size during window resizing Note: % values don't work correctly - see demo/cell-height.html **Example** `// Fixed 100px height cellHeight: 100 // CSS units cellHeight: '5rem' cellHeight: '100px' // Auto-sizing for square cells cellHeight: 'auto' // No CSS generation (custom styles) cellHeight: 0` | `Omit.cellHeight` | dist/types.d.ts:190 |
| <a id="cellheightthrottle"></a> `cellHeightThrottle?` | `number` | throttle time delay (in ms) used when cellHeight='auto' to improve performance vs usability (default?: 100). A value of 0 will make it instant at a cost of re-creating the CSS file at ever window resize event! | `Omit.cellHeightThrottle` | dist/types.d.ts:194 |
| <a id="cellheightunit"></a> `cellHeightUnit?` | `string` | (internal) unit for cellHeight (default? 'px') which is set when a string cellHeight with a unit is passed (ex: '10rem') | `Omit.cellHeightUnit` | dist/types.d.ts:196 |
| <a id="column"></a> `column?` | `number` \| `"auto"` | number of columns (default?: 12). Note: IF you change this, CSS also have to change. See https://github.com/gridstack/gridstack.js#change-grid-columns. Note: for nested grids, it is recommended to use 'auto' which will always match the container grid-item current width (in column) to keep inside and outside items always the same. flag is NOT supported for regular non-nested grids. | `Omit.column` | dist/types.d.ts:203 |
| <a id="columnopts"></a> `columnOpts?` | `Responsive` | responsive column layout for width:column behavior | `Omit.columnOpts` | dist/types.d.ts:205 |
| <a id="class-1"></a> `class?` | `string` | additional class on top of '.grid-stack' (which is required for our CSS) to differentiate this instance. Note: only used by addGrid(), else your element should have the needed class | `Omit.class` | dist/types.d.ts:208 |
| <a id="disabledrag"></a> `disableDrag?` | `boolean` | disallows dragging of widgets (default?: false) | `Omit.disableDrag` | dist/types.d.ts:210 |
| <a id="disableresize"></a> `disableResize?` | `boolean` | disallows resizing of widgets (default?: false). | `Omit.disableResize` | dist/types.d.ts:212 |
| <a id="draggable"></a> `draggable?` | `DDDragOpt` | allows to override UI draggable options. (default?: { handle?: '.grid-stack-item-content', appendTo?: 'body' }) | `Omit.draggable` | dist/types.d.ts:214 |
| <a id="engineclass"></a> `engineClass?` | *typeof* `GridStackEngine` | the type of engine to create (so you can subclass) default to GridStackEngine | `Omit.engineClass` | dist/types.d.ts:217 |
| <a id="float"></a> `float?` | `boolean` | enable floating widgets (default?: false) See example (http://gridstack.github.io/gridstack.js/demo/float.html) | `Omit.float` | dist/types.d.ts:219 |
| <a id="handle"></a> `handle?` | `string` | draggable handle selector (default?: '.grid-stack-item-content') | `Omit.handle` | dist/types.d.ts:221 |
| <a id="handleclass"></a> `handleClass?` | `string` | draggable handle class (e.g. 'grid-stack-item-content'). If set 'handle' is ignored (default?: null) | `Omit.handleClass` | dist/types.d.ts:223 |
| <a id="itemclass"></a> `itemClass?` | `string` | additional widget class (default?: 'grid-stack-item') | `Omit.itemClass` | dist/types.d.ts:225 |
| <a id="layout"></a> `layout?` | `ColumnOptions` | re-layout mode when we're a subgrid and we are being resized. default to 'list' | `Omit.layout` | dist/types.d.ts:227 |
| <a id="lazyload-2"></a> `lazyLoad?` | `boolean` | true when widgets are only created when they scroll into view (visible) | `Omit.lazyLoad` | dist/types.d.ts:229 |
| <a id="margin"></a> `margin?` | `numberOrString` | gap between grid item and content (default?: 10). This will set all 4 sides and support the CSS formats below an integer (px) a string with possible units (ex: '2em', '20px', '2rem') string with space separated values (ex: '5px 10px 0 20px' for all 4 sides, or '5em 10em' for top/bottom and left/right pairs like CSS). Note: all sides must have same units (last one wins, default px) | `Omit.margin` | dist/types.d.ts:237 |
| <a id="margintop"></a> `marginTop?` | `numberOrString` | OLD way to optionally set each side - use margin: '5px 10px 0 20px' instead. Used internally to store each side. | `Omit.marginTop` | dist/types.d.ts:239 |
| <a id="marginright"></a> `marginRight?` | `numberOrString` | - | `Omit.marginRight` | dist/types.d.ts:240 |
| <a id="marginbottom"></a> `marginBottom?` | `numberOrString` | - | `Omit.marginBottom` | dist/types.d.ts:241 |
| <a id="marginleft"></a> `marginLeft?` | `numberOrString` | - | `Omit.marginLeft` | dist/types.d.ts:242 |
| <a id="marginunit"></a> `marginUnit?` | `string` | (internal) unit for margin (default? 'px') set when `margin` is set as string with unit (ex: 2rem') | `Omit.marginUnit` | dist/types.d.ts:244 |
| <a id="maxrow"></a> `maxRow?` | `number` | maximum rows amount. Default? is 0 which means no maximum rows | `Omit.maxRow` | dist/types.d.ts:246 |
| <a id="minrow"></a> `minRow?` | `number` | minimum rows amount which is handy to prevent grid from collapsing when empty. Default is `0`. When no set the `min-height` CSS attribute on the grid div (in pixels) can be used, which will round to the closest row. | `Omit.minRow` | dist/types.d.ts:250 |
| <a id="nonce"></a> `nonce?` | `string` | If you are using a nonce-based Content Security Policy, pass your nonce here and GridStack will add it to the `<style>` elements it creates. | `Omit.nonce` | dist/types.d.ts:253 |
| <a id="placeholderclass"></a> `placeholderClass?` | `string` | class for placeholder (default?: 'grid-stack-placeholder') | `Omit.placeholderClass` | dist/types.d.ts:255 |
| <a id="placeholdertext"></a> `placeholderText?` | `string` | placeholder default content (default?: '') | `Omit.placeholderText` | dist/types.d.ts:257 |
| <a id="resizable"></a> `resizable?` | `DDResizeOpt` | allows to override UI resizable options. default is { handles: 'se', autoHide: true on desktop, false on mobile } | `Omit.resizable` | dist/types.d.ts:259 |
| <a id="removable"></a> `removable?` | `string` \| `boolean` | if true widgets could be removed by dragging outside of the grid. It could also be a selector string (ex: ".trash"), in this case widgets will be removed by dropping them there (default?: false) See example (http://gridstack.github.io/gridstack.js/demo/two.html) | `Omit.removable` | dist/types.d.ts:265 |
| <a id="removableoptions"></a> `removableOptions?` | `DDRemoveOpt` | allows to override UI removable options. (default?: { accept: '.grid-stack-item' }) | `Omit.removableOptions` | dist/types.d.ts:267 |
| <a id="row"></a> `row?` | `number` | fix grid number of rows. This is a shortcut of writing `minRow:N, maxRow:N`. (default `0` no constrain) | `Omit.row` | dist/types.d.ts:269 |
| <a id="rtl"></a> `rtl?` | `boolean` \| `"auto"` | if true turns grid to RTL, and applies the `grid-stack-rtl class`. Possible values are true, false, 'auto' (default?: 'auto') See [example](http://gridstack.github.io/gridstack.js/demo/right-to-left(rtl).html) | `Omit.rtl` | dist/types.d.ts:274 |
| <a id="sizetocontent-2"></a> `sizeToContent?` | `boolean` | set to true if all grid items (by default, but item can also override) height should be based on content size instead of WidgetItem.h to avoid v-scrollbars. Note: this is still row based, not pixels, so it will use ceil(getBoundingClientRect().height / getCellHeight()) | `Omit.sizeToContent` | dist/types.d.ts:278 |
| <a id="staticgrid"></a> `staticGrid?` | `boolean` | makes grid static (default?: false). If `true` widgets are not movable/resizable. You don't even need draggable/resizable. A CSS class 'grid-stack-static' is also added to the element. | `Omit.staticGrid` | dist/types.d.ts:284 |
| <a id="styleinhead"></a> ~~`styleInHead?`~~ | `boolean` | **Deprecated** Not used anymore, styles are now implemented with local CSS variables | `Omit.styleInHead` | dist/types.d.ts:288 |
| <a id="subgriddynamic"></a> `subGridDynamic?` | `boolean` | enable/disable the creation of sub-grids on the fly by dragging items completely over others (nest) vs partially (push). Forces `DDDragOpt.pause=true` to accomplish that. | `Omit.subGridDynamic` | dist/types.d.ts:293 |
| <a id="children"></a> `children?` | [`GridStackWidget`](#gridstackwidget)[] | - | - | [vue/projects/lib/src/types.ts:49](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L49) |
| <a id="subgridopts-2"></a> `subGridOpts?` | [`GridStackOptions`](#gridstackoptions) | - | - | [vue/projects/lib/src/types.ts:50](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L50) |

***

### GridHTMLElement

Defined in: [vue/projects/lib/src/types.ts:53](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L53)

#### Extends

- `GridHTMLElement`

#### Methods

##### animate()

```ts
animate(keyframes, options?): Animation;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:2146

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `keyframes` | `Keyframe`[] \| `PropertyIndexedKeyframes` |
| `options?` | `number` \| `KeyframeAnimationOptions` |

###### Returns

`Animation`

###### Inherited from

```ts
CoreGridHTMLElement.animate
```

##### getAnimations()

```ts
getAnimations(options?): Animation[];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:2147

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `GetAnimationsOptions` |

###### Returns

`Animation`[]

###### Inherited from

```ts
CoreGridHTMLElement.getAnimations
```

##### after()

```ts
after(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3747

Inserts nodes just after node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` \| `Node`)[] |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.after
```

##### before()

```ts
before(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3753

Inserts nodes just before node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` \| `Node`)[] |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.before
```

##### remove()

```ts
remove(): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3755

Removes node.

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.remove
```

##### replaceWith()

```ts
replaceWith(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3761

Replaces node with nodes, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` \| `Node`)[] |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.replaceWith
```

##### attachShadow()

```ts
attachShadow(init): ShadowRoot;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5074

Creates a shadow root for element and returns it.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `init` | `ShadowRootInit` |

###### Returns

`ShadowRoot`

###### Inherited from

```ts
CoreGridHTMLElement.attachShadow
```

##### checkVisibility()

```ts
checkVisibility(options?): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5075

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `CheckVisibilityOptions` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridHTMLElement.checkVisibility
```

##### closest()

###### Call Signature

```ts
closest<K>(selector): HTMLElementTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5077

Returns the first (starting at element) inclusive ancestor that matches selectors, and null otherwise.

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selector` | `K` |

###### Returns

`HTMLElementTagNameMap`\[`K`\]

###### Inherited from

```ts
CoreGridHTMLElement.closest
```

###### Call Signature

```ts
closest<K>(selector): SVGElementTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5078

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `SVGElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selector` | `K` |

###### Returns

`SVGElementTagNameMap`\[`K`\]

###### Inherited from

```ts
CoreGridHTMLElement.closest
```

###### Call Signature

```ts
closest<K>(selector): MathMLElementTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5079

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `MathMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selector` | `K` |

###### Returns

`MathMLElementTagNameMap`\[`K`\]

###### Inherited from

```ts
CoreGridHTMLElement.closest
```

###### Call Signature

```ts
closest<E>(selectors): E;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5080

###### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `E` *extends* `Element`\<`E`\> | `Element` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `string` |

###### Returns

`E`

###### Inherited from

```ts
CoreGridHTMLElement.closest
```

##### getAttribute()

```ts
getAttribute(qualifiedName): string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5082

Returns element's first attribute whose qualified name is qualifiedName, and null if there is no such attribute otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

###### Returns

`string`

###### Inherited from

```ts
CoreGridHTMLElement.getAttribute
```

##### getAttributeNS()

```ts
getAttributeNS(namespace, localName): string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5084

Returns element's attribute whose namespace is namespace and local name is localName, and null if there is no such attribute otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `localName` | `string` |

###### Returns

`string`

###### Inherited from

```ts
CoreGridHTMLElement.getAttributeNS
```

##### getAttributeNames()

```ts
getAttributeNames(): string[];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5086

Returns the qualified names of all element's attributes. Can contain duplicates.

###### Returns

`string`[]

###### Inherited from

```ts
CoreGridHTMLElement.getAttributeNames
```

##### getAttributeNode()

```ts
getAttributeNode(qualifiedName): Attr;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5087

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

###### Returns

`Attr`

###### Inherited from

```ts
CoreGridHTMLElement.getAttributeNode
```

##### getAttributeNodeNS()

```ts
getAttributeNodeNS(namespace, localName): Attr;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5088

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `localName` | `string` |

###### Returns

`Attr`

###### Inherited from

```ts
CoreGridHTMLElement.getAttributeNodeNS
```

##### getBoundingClientRect()

```ts
getBoundingClientRect(): DOMRect;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5089

###### Returns

`DOMRect`

###### Inherited from

```ts
CoreGridHTMLElement.getBoundingClientRect
```

##### getClientRects()

```ts
getClientRects(): DOMRectList;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5090

###### Returns

`DOMRectList`

###### Inherited from

```ts
CoreGridHTMLElement.getClientRects
```

##### getElementsByClassName()

```ts
getElementsByClassName(classNames): HTMLCollectionOf<Element>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5092

Returns a HTMLCollection of the elements in the object on which the method was invoked (a document or an element) that have all the classes given by classNames. The classNames argument is interpreted as a space-separated list of classes.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `classNames` | `string` |

###### Returns

`HTMLCollectionOf`\<`Element`\>

###### Inherited from

```ts
CoreGridHTMLElement.getElementsByClassName
```

##### getElementsByTagName()

###### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5093

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `K` |

###### Returns

`HTMLCollectionOf`\<`HTMLElementTagNameMap`\[`K`\]\>

###### Inherited from

```ts
CoreGridHTMLElement.getElementsByTagName
```

###### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<SVGElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5094

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `SVGElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `K` |

###### Returns

`HTMLCollectionOf`\<`SVGElementTagNameMap`\[`K`\]\>

###### Inherited from

```ts
CoreGridHTMLElement.getElementsByTagName
```

###### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5095

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `MathMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `K` |

###### Returns

`HTMLCollectionOf`\<`MathMLElementTagNameMap`\[`K`\]\>

###### Inherited from

```ts
CoreGridHTMLElement.getElementsByTagName
```

###### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5097

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementDeprecatedTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `K` |

###### Returns

`HTMLCollectionOf`\<`HTMLElementDeprecatedTagNameMap`\[`K`\]\>

###### Deprecated

###### Inherited from

```ts
CoreGridHTMLElement.getElementsByTagName
```

###### Call Signature

```ts
getElementsByTagName(qualifiedName): HTMLCollectionOf<Element>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5098

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

###### Returns

`HTMLCollectionOf`\<`Element`\>

###### Inherited from

```ts
CoreGridHTMLElement.getElementsByTagName
```

##### getElementsByTagNameNS()

###### Call Signature

```ts
getElementsByTagNameNS(namespaceURI, localName): HTMLCollectionOf<HTMLElement>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5099

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespaceURI` | `"http://www.w3.org/1999/xhtml"` |
| `localName` | `string` |

###### Returns

`HTMLCollectionOf`\<`HTMLElement`\>

###### Inherited from

```ts
CoreGridHTMLElement.getElementsByTagNameNS
```

###### Call Signature

```ts
getElementsByTagNameNS(namespaceURI, localName): HTMLCollectionOf<SVGElement>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5100

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespaceURI` | `"http://www.w3.org/2000/svg"` |
| `localName` | `string` |

###### Returns

`HTMLCollectionOf`\<`SVGElement`\>

###### Inherited from

```ts
CoreGridHTMLElement.getElementsByTagNameNS
```

###### Call Signature

```ts
getElementsByTagNameNS(namespaceURI, localName): HTMLCollectionOf<MathMLElement>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5101

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespaceURI` | `"http://www.w3.org/1998/Math/MathML"` |
| `localName` | `string` |

###### Returns

`HTMLCollectionOf`\<`MathMLElement`\>

###### Inherited from

```ts
CoreGridHTMLElement.getElementsByTagNameNS
```

###### Call Signature

```ts
getElementsByTagNameNS(namespace, localName): HTMLCollectionOf<Element>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5102

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `localName` | `string` |

###### Returns

`HTMLCollectionOf`\<`Element`\>

###### Inherited from

```ts
CoreGridHTMLElement.getElementsByTagNameNS
```

##### hasAttribute()

```ts
hasAttribute(qualifiedName): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5104

Returns true if element has an attribute whose qualified name is qualifiedName, and false otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridHTMLElement.hasAttribute
```

##### hasAttributeNS()

```ts
hasAttributeNS(namespace, localName): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5106

Returns true if element has an attribute whose namespace is namespace and local name is localName.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `localName` | `string` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridHTMLElement.hasAttributeNS
```

##### hasAttributes()

```ts
hasAttributes(): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5108

Returns true if element has attributes, and false otherwise.

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridHTMLElement.hasAttributes
```

##### hasPointerCapture()

```ts
hasPointerCapture(pointerId): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5109

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `pointerId` | `number` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridHTMLElement.hasPointerCapture
```

##### insertAdjacentElement()

```ts
insertAdjacentElement(where, element): Element;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5110

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `where` | `InsertPosition` |
| `element` | `Element` |

###### Returns

`Element`

###### Inherited from

```ts
CoreGridHTMLElement.insertAdjacentElement
```

##### insertAdjacentHTML()

```ts
insertAdjacentHTML(position, text): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5111

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `position` | `InsertPosition` |
| `text` | `string` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.insertAdjacentHTML
```

##### insertAdjacentText()

```ts
insertAdjacentText(where, data): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5112

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `where` | `InsertPosition` |
| `data` | `string` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.insertAdjacentText
```

##### matches()

```ts
matches(selectors): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5114

Returns true if matching selectors against element's root yields element, and false otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `string` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridHTMLElement.matches
```

##### releasePointerCapture()

```ts
releasePointerCapture(pointerId): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5115

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `pointerId` | `number` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.releasePointerCapture
```

##### removeAttribute()

```ts
removeAttribute(qualifiedName): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5117

Removes element's first attribute whose qualified name is qualifiedName.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.removeAttribute
```

##### removeAttributeNS()

```ts
removeAttributeNS(namespace, localName): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5119

Removes element's attribute whose namespace is namespace and local name is localName.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `localName` | `string` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.removeAttributeNS
```

##### removeAttributeNode()

```ts
removeAttributeNode(attr): Attr;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5120

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `attr` | `Attr` |

###### Returns

`Attr`

###### Inherited from

```ts
CoreGridHTMLElement.removeAttributeNode
```

##### requestFullscreen()

```ts
requestFullscreen(options?): Promise<void>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5126

Displays element fullscreen and resolves promise when done.

When supplied, options's navigationUI member indicates whether showing navigation UI while in fullscreen is preferred or not. If set to "show", navigation simplicity is preferred over screen space, and if set to "hide", more screen space is preferred. User agents are always free to honor user preference over the application's. The default value "auto" indicates no application preference.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `FullscreenOptions` |

###### Returns

`Promise`\<`void`\>

###### Inherited from

```ts
CoreGridHTMLElement.requestFullscreen
```

##### requestPointerLock()

```ts
requestPointerLock(): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5127

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.requestPointerLock
```

##### scroll()

###### Call Signature

```ts
scroll(options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5128

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `ScrollToOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.scroll
```

###### Call Signature

```ts
scroll(x, y): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5129

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.scroll
```

##### scrollBy()

###### Call Signature

```ts
scrollBy(options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5130

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `ScrollToOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.scrollBy
```

###### Call Signature

```ts
scrollBy(x, y): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5131

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.scrollBy
```

##### scrollIntoView()

```ts
scrollIntoView(arg?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5132

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `arg?` | `boolean` \| `ScrollIntoViewOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.scrollIntoView
```

##### scrollTo()

###### Call Signature

```ts
scrollTo(options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5133

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `ScrollToOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.scrollTo
```

###### Call Signature

```ts
scrollTo(x, y): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5134

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.scrollTo
```

##### setAttribute()

```ts
setAttribute(qualifiedName, value): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5136

Sets the value of element's first attribute whose qualified name is qualifiedName to value.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |
| `value` | `string` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.setAttribute
```

##### setAttributeNS()

```ts
setAttributeNS(
   namespace, 
   qualifiedName, 
   value): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5138

Sets the value of element's attribute whose namespace is namespace and local name is localName to value.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `qualifiedName` | `string` |
| `value` | `string` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.setAttributeNS
```

##### setAttributeNode()

```ts
setAttributeNode(attr): Attr;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5139

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `attr` | `Attr` |

###### Returns

`Attr`

###### Inherited from

```ts
CoreGridHTMLElement.setAttributeNode
```

##### setAttributeNodeNS()

```ts
setAttributeNodeNS(attr): Attr;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5140

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `attr` | `Attr` |

###### Returns

`Attr`

###### Inherited from

```ts
CoreGridHTMLElement.setAttributeNodeNS
```

##### setPointerCapture()

```ts
setPointerCapture(pointerId): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5141

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `pointerId` | `number` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.setPointerCapture
```

##### toggleAttribute()

```ts
toggleAttribute(qualifiedName, force?): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5147

If force is not given, "toggles" qualifiedName, removing it if it is present and adding it if it is not present. If force is true, adds qualifiedName. If force is false, removes qualifiedName.

Returns true if qualifiedName is now present, and false otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |
| `force?` | `boolean` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridHTMLElement.toggleAttribute
```

##### ~~webkitMatchesSelector()~~

```ts
webkitMatchesSelector(selectors): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5149

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `string` |

###### Returns

`boolean`

###### Deprecated

This is a legacy alias of `matches`.

###### Inherited from

```ts
CoreGridHTMLElement.webkitMatchesSelector
```

##### dispatchEvent()

```ts
dispatchEvent(event): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5344

Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `Event` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridHTMLElement.dispatchEvent
```

##### attachInternals()

```ts
attachInternals(): ElementInternals;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6573

###### Returns

`ElementInternals`

###### Inherited from

```ts
CoreGridHTMLElement.attachInternals
```

##### click()

```ts
click(): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6574

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.click
```

##### addEventListener()

###### Call Signature

```ts
addEventListener<K>(
   type, 
   listener, 
   options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6575

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementEventMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `K` |
| `listener` | (`this`, `ev`) => `any` |
| `options?` | `boolean` \| `AddEventListenerOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.addEventListener
```

###### Call Signature

```ts
addEventListener(
   type, 
   listener, 
   options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6576

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |
| `listener` | `EventListenerOrEventListenerObject` |
| `options?` | `boolean` \| `AddEventListenerOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.addEventListener
```

##### removeEventListener()

###### Call Signature

```ts
removeEventListener<K>(
   type, 
   listener, 
   options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6577

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementEventMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `K` |
| `listener` | (`this`, `ev`) => `any` |
| `options?` | `boolean` \| `EventListenerOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.removeEventListener
```

###### Call Signature

```ts
removeEventListener(
   type, 
   listener, 
   options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6578

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |
| `listener` | `EventListenerOrEventListenerObject` |
| `options?` | `boolean` \| `EventListenerOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.removeEventListener
```

##### blur()

```ts
blur(): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:7768

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.blur
```

##### focus()

```ts
focus(options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:7769

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `FocusOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.focus
```

##### appendChild()

```ts
appendChild<T>(node): T;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10274

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Node`\<`T`\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | `T` |

###### Returns

`T`

###### Inherited from

```ts
CoreGridHTMLElement.appendChild
```

##### cloneNode()

```ts
cloneNode(deep?): Node;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10276

Returns a copy of node. If deep is true, the copy also includes the node's descendants.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deep?` | `boolean` |

###### Returns

`Node`

###### Inherited from

```ts
CoreGridHTMLElement.cloneNode
```

##### compareDocumentPosition()

```ts
compareDocumentPosition(other): number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10278

Returns a bitmask indicating the position of other relative to node.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `Node` |

###### Returns

`number`

###### Inherited from

```ts
CoreGridHTMLElement.compareDocumentPosition
```

##### contains()

```ts
contains(other): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10280

Returns true if other is an inclusive descendant of node, and false otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `Node` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridHTMLElement.contains
```

##### getRootNode()

```ts
getRootNode(options?): Node;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10282

Returns node's root.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `GetRootNodeOptions` |

###### Returns

`Node`

###### Inherited from

```ts
CoreGridHTMLElement.getRootNode
```

##### hasChildNodes()

```ts
hasChildNodes(): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10284

Returns whether node has children.

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridHTMLElement.hasChildNodes
```

##### insertBefore()

```ts
insertBefore<T>(node, child): T;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10285

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Node`\<`T`\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | `T` |
| `child` | `Node` |

###### Returns

`T`

###### Inherited from

```ts
CoreGridHTMLElement.insertBefore
```

##### isDefaultNamespace()

```ts
isDefaultNamespace(namespace): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10286

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridHTMLElement.isDefaultNamespace
```

##### isEqualNode()

```ts
isEqualNode(otherNode): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10288

Returns whether node and otherNode have the same properties.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `otherNode` | `Node` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridHTMLElement.isEqualNode
```

##### isSameNode()

```ts
isSameNode(otherNode): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10289

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `otherNode` | `Node` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridHTMLElement.isSameNode
```

##### lookupNamespaceURI()

```ts
lookupNamespaceURI(prefix): string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10290

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `prefix` | `string` |

###### Returns

`string`

###### Inherited from

```ts
CoreGridHTMLElement.lookupNamespaceURI
```

##### lookupPrefix()

```ts
lookupPrefix(namespace): string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10291

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |

###### Returns

`string`

###### Inherited from

```ts
CoreGridHTMLElement.lookupPrefix
```

##### normalize()

```ts
normalize(): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10293

Removes empty exclusive Text nodes and concatenates the data of remaining contiguous exclusive Text nodes into the first of their nodes.

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.normalize
```

##### removeChild()

```ts
removeChild<T>(child): T;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10294

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Node`\<`T`\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `child` | `T` |

###### Returns

`T`

###### Inherited from

```ts
CoreGridHTMLElement.removeChild
```

##### replaceChild()

```ts
replaceChild<T>(node, child): T;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10295

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Node`\<`T`\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | `Node` |
| `child` | `T` |

###### Returns

`T`

###### Inherited from

```ts
CoreGridHTMLElement.replaceChild
```

##### append()

```ts
append(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10697

Inserts nodes after the last child of node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` \| `Node`)[] |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.append
```

##### prepend()

```ts
prepend(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10703

Inserts nodes before the first child of node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` \| `Node`)[] |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.prepend
```

##### querySelector()

###### Call Signature

```ts
querySelector<K>(selectors): HTMLElementTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10705

Returns the first element that is a descendant of node that matches selectors.

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`HTMLElementTagNameMap`\[`K`\]

###### Inherited from

```ts
CoreGridHTMLElement.querySelector
```

###### Call Signature

```ts
querySelector<K>(selectors): SVGElementTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10706

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `SVGElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`SVGElementTagNameMap`\[`K`\]

###### Inherited from

```ts
CoreGridHTMLElement.querySelector
```

###### Call Signature

```ts
querySelector<K>(selectors): MathMLElementTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10707

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `MathMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`MathMLElementTagNameMap`\[`K`\]

###### Inherited from

```ts
CoreGridHTMLElement.querySelector
```

###### Call Signature

```ts
querySelector<K>(selectors): HTMLElementDeprecatedTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10709

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementDeprecatedTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`HTMLElementDeprecatedTagNameMap`\[`K`\]

###### Deprecated

###### Inherited from

```ts
CoreGridHTMLElement.querySelector
```

###### Call Signature

```ts
querySelector<E>(selectors): E;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10710

###### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `E` *extends* `Element`\<`E`\> | `Element` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `string` |

###### Returns

`E`

###### Inherited from

```ts
CoreGridHTMLElement.querySelector
```

##### querySelectorAll()

###### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<HTMLElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10712

Returns all element descendants of node that match selectors.

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`NodeListOf`\<`HTMLElementTagNameMap`\[`K`\]\>

###### Inherited from

```ts
CoreGridHTMLElement.querySelectorAll
```

###### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<SVGElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10713

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `SVGElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`NodeListOf`\<`SVGElementTagNameMap`\[`K`\]\>

###### Inherited from

```ts
CoreGridHTMLElement.querySelectorAll
```

###### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<MathMLElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10714

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `MathMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`NodeListOf`\<`MathMLElementTagNameMap`\[`K`\]\>

###### Inherited from

```ts
CoreGridHTMLElement.querySelectorAll
```

###### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10716

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementDeprecatedTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`NodeListOf`\<`HTMLElementDeprecatedTagNameMap`\[`K`\]\>

###### Deprecated

###### Inherited from

```ts
CoreGridHTMLElement.querySelectorAll
```

###### Call Signature

```ts
querySelectorAll<E>(selectors): NodeListOf<E>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10717

###### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `E` *extends* `Element`\<`E`\> | `Element` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `string` |

###### Returns

`NodeListOf`\<`E`\>

###### Inherited from

```ts
CoreGridHTMLElement.querySelectorAll
```

##### replaceChildren()

```ts
replaceChildren(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10723

Replace all children of node with nodes, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` \| `Node`)[] |

###### Returns

`void`

###### Inherited from

```ts
CoreGridHTMLElement.replaceChildren
```

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="gridstack"></a> `gridstack?` | `public` | `GridStack` | - | `CoreGridHTMLElement.gridstack` | dist/gridstack.d.ts:24 |
| <a id="ariaatomic"></a> `ariaAtomic` | `public` | `string` | - | `CoreGridHTMLElement.ariaAtomic` | node\_modules/typescript/lib/lib.dom.d.ts:2020 |
| <a id="ariaautocomplete"></a> `ariaAutoComplete` | `public` | `string` | - | `CoreGridHTMLElement.ariaAutoComplete` | node\_modules/typescript/lib/lib.dom.d.ts:2021 |
| <a id="ariabusy"></a> `ariaBusy` | `public` | `string` | - | `CoreGridHTMLElement.ariaBusy` | node\_modules/typescript/lib/lib.dom.d.ts:2022 |
| <a id="ariachecked"></a> `ariaChecked` | `public` | `string` | - | `CoreGridHTMLElement.ariaChecked` | node\_modules/typescript/lib/lib.dom.d.ts:2023 |
| <a id="ariacolcount"></a> `ariaColCount` | `public` | `string` | - | `CoreGridHTMLElement.ariaColCount` | node\_modules/typescript/lib/lib.dom.d.ts:2024 |
| <a id="ariacolindex"></a> `ariaColIndex` | `public` | `string` | - | `CoreGridHTMLElement.ariaColIndex` | node\_modules/typescript/lib/lib.dom.d.ts:2025 |
| <a id="ariacolspan"></a> `ariaColSpan` | `public` | `string` | - | `CoreGridHTMLElement.ariaColSpan` | node\_modules/typescript/lib/lib.dom.d.ts:2026 |
| <a id="ariacurrent"></a> `ariaCurrent` | `public` | `string` | - | `CoreGridHTMLElement.ariaCurrent` | node\_modules/typescript/lib/lib.dom.d.ts:2027 |
| <a id="ariadisabled"></a> `ariaDisabled` | `public` | `string` | - | `CoreGridHTMLElement.ariaDisabled` | node\_modules/typescript/lib/lib.dom.d.ts:2028 |
| <a id="ariaexpanded"></a> `ariaExpanded` | `public` | `string` | - | `CoreGridHTMLElement.ariaExpanded` | node\_modules/typescript/lib/lib.dom.d.ts:2029 |
| <a id="ariahaspopup"></a> `ariaHasPopup` | `public` | `string` | - | `CoreGridHTMLElement.ariaHasPopup` | node\_modules/typescript/lib/lib.dom.d.ts:2030 |
| <a id="ariahidden"></a> `ariaHidden` | `public` | `string` | - | `CoreGridHTMLElement.ariaHidden` | node\_modules/typescript/lib/lib.dom.d.ts:2031 |
| <a id="ariainvalid"></a> `ariaInvalid` | `public` | `string` | - | `CoreGridHTMLElement.ariaInvalid` | node\_modules/typescript/lib/lib.dom.d.ts:2032 |
| <a id="ariakeyshortcuts"></a> `ariaKeyShortcuts` | `public` | `string` | - | `CoreGridHTMLElement.ariaKeyShortcuts` | node\_modules/typescript/lib/lib.dom.d.ts:2033 |
| <a id="arialabel"></a> `ariaLabel` | `public` | `string` | - | `CoreGridHTMLElement.ariaLabel` | node\_modules/typescript/lib/lib.dom.d.ts:2034 |
| <a id="arialevel"></a> `ariaLevel` | `public` | `string` | - | `CoreGridHTMLElement.ariaLevel` | node\_modules/typescript/lib/lib.dom.d.ts:2035 |
| <a id="arialive"></a> `ariaLive` | `public` | `string` | - | `CoreGridHTMLElement.ariaLive` | node\_modules/typescript/lib/lib.dom.d.ts:2036 |
| <a id="ariamodal"></a> `ariaModal` | `public` | `string` | - | `CoreGridHTMLElement.ariaModal` | node\_modules/typescript/lib/lib.dom.d.ts:2037 |
| <a id="ariamultiline"></a> `ariaMultiLine` | `public` | `string` | - | `CoreGridHTMLElement.ariaMultiLine` | node\_modules/typescript/lib/lib.dom.d.ts:2038 |
| <a id="ariamultiselectable"></a> `ariaMultiSelectable` | `public` | `string` | - | `CoreGridHTMLElement.ariaMultiSelectable` | node\_modules/typescript/lib/lib.dom.d.ts:2039 |
| <a id="ariaorientation"></a> `ariaOrientation` | `public` | `string` | - | `CoreGridHTMLElement.ariaOrientation` | node\_modules/typescript/lib/lib.dom.d.ts:2040 |
| <a id="ariaplaceholder"></a> `ariaPlaceholder` | `public` | `string` | - | `CoreGridHTMLElement.ariaPlaceholder` | node\_modules/typescript/lib/lib.dom.d.ts:2041 |
| <a id="ariaposinset"></a> `ariaPosInSet` | `public` | `string` | - | `CoreGridHTMLElement.ariaPosInSet` | node\_modules/typescript/lib/lib.dom.d.ts:2042 |
| <a id="ariapressed"></a> `ariaPressed` | `public` | `string` | - | `CoreGridHTMLElement.ariaPressed` | node\_modules/typescript/lib/lib.dom.d.ts:2043 |
| <a id="ariareadonly"></a> `ariaReadOnly` | `public` | `string` | - | `CoreGridHTMLElement.ariaReadOnly` | node\_modules/typescript/lib/lib.dom.d.ts:2044 |
| <a id="ariarequired"></a> `ariaRequired` | `public` | `string` | - | `CoreGridHTMLElement.ariaRequired` | node\_modules/typescript/lib/lib.dom.d.ts:2045 |
| <a id="ariaroledescription"></a> `ariaRoleDescription` | `public` | `string` | - | `CoreGridHTMLElement.ariaRoleDescription` | node\_modules/typescript/lib/lib.dom.d.ts:2046 |
| <a id="ariarowcount"></a> `ariaRowCount` | `public` | `string` | - | `CoreGridHTMLElement.ariaRowCount` | node\_modules/typescript/lib/lib.dom.d.ts:2047 |
| <a id="ariarowindex"></a> `ariaRowIndex` | `public` | `string` | - | `CoreGridHTMLElement.ariaRowIndex` | node\_modules/typescript/lib/lib.dom.d.ts:2048 |
| <a id="ariarowspan"></a> `ariaRowSpan` | `public` | `string` | - | `CoreGridHTMLElement.ariaRowSpan` | node\_modules/typescript/lib/lib.dom.d.ts:2049 |
| <a id="ariaselected"></a> `ariaSelected` | `public` | `string` | - | `CoreGridHTMLElement.ariaSelected` | node\_modules/typescript/lib/lib.dom.d.ts:2050 |
| <a id="ariasetsize"></a> `ariaSetSize` | `public` | `string` | - | `CoreGridHTMLElement.ariaSetSize` | node\_modules/typescript/lib/lib.dom.d.ts:2051 |
| <a id="ariasort"></a> `ariaSort` | `public` | `string` | - | `CoreGridHTMLElement.ariaSort` | node\_modules/typescript/lib/lib.dom.d.ts:2052 |
| <a id="ariavaluemax"></a> `ariaValueMax` | `public` | `string` | - | `CoreGridHTMLElement.ariaValueMax` | node\_modules/typescript/lib/lib.dom.d.ts:2053 |
| <a id="ariavaluemin"></a> `ariaValueMin` | `public` | `string` | - | `CoreGridHTMLElement.ariaValueMin` | node\_modules/typescript/lib/lib.dom.d.ts:2054 |
| <a id="ariavaluenow"></a> `ariaValueNow` | `public` | `string` | - | `CoreGridHTMLElement.ariaValueNow` | node\_modules/typescript/lib/lib.dom.d.ts:2055 |
| <a id="ariavaluetext"></a> `ariaValueText` | `public` | `string` | - | `CoreGridHTMLElement.ariaValueText` | node\_modules/typescript/lib/lib.dom.d.ts:2056 |
| <a id="role"></a> `role` | `public` | `string` | - | `CoreGridHTMLElement.role` | node\_modules/typescript/lib/lib.dom.d.ts:2057 |
| <a id="attributes"></a> `attributes` | `readonly` | `NamedNodeMap` | - | `CoreGridHTMLElement.attributes` | node\_modules/typescript/lib/lib.dom.d.ts:5041 |
| <a id="classlist"></a> `classList` | `readonly` | `DOMTokenList` | Allows for manipulation of element's class content attribute as a set of whitespace-separated tokens through a DOMTokenList object. | `CoreGridHTMLElement.classList` | node\_modules/typescript/lib/lib.dom.d.ts:5043 |
| <a id="classname"></a> `className` | `public` | `string` | Returns the value of element's class content attribute. Can be set to change it. | `CoreGridHTMLElement.className` | node\_modules/typescript/lib/lib.dom.d.ts:5045 |
| <a id="clientheight"></a> `clientHeight` | `readonly` | `number` | - | `CoreGridHTMLElement.clientHeight` | node\_modules/typescript/lib/lib.dom.d.ts:5046 |
| <a id="clientleft"></a> `clientLeft` | `readonly` | `number` | - | `CoreGridHTMLElement.clientLeft` | node\_modules/typescript/lib/lib.dom.d.ts:5047 |
| <a id="clienttop"></a> `clientTop` | `readonly` | `number` | - | `CoreGridHTMLElement.clientTop` | node\_modules/typescript/lib/lib.dom.d.ts:5048 |
| <a id="clientwidth"></a> `clientWidth` | `readonly` | `number` | - | `CoreGridHTMLElement.clientWidth` | node\_modules/typescript/lib/lib.dom.d.ts:5049 |
| <a id="id-2"></a> `id` | `public` | `string` | Returns the value of element's id content attribute. Can be set to change it. | `CoreGridHTMLElement.id` | node\_modules/typescript/lib/lib.dom.d.ts:5051 |
| <a id="localname"></a> `localName` | `readonly` | `string` | Returns the local name. | `CoreGridHTMLElement.localName` | node\_modules/typescript/lib/lib.dom.d.ts:5053 |
| <a id="namespaceuri"></a> `namespaceURI` | `readonly` | `string` | Returns the namespace. | `CoreGridHTMLElement.namespaceURI` | node\_modules/typescript/lib/lib.dom.d.ts:5055 |
| <a id="onfullscreenchange"></a> `onfullscreenchange` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onfullscreenchange` | node\_modules/typescript/lib/lib.dom.d.ts:5056 |
| <a id="onfullscreenerror"></a> `onfullscreenerror` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onfullscreenerror` | node\_modules/typescript/lib/lib.dom.d.ts:5057 |
| <a id="outerhtml"></a> `outerHTML` | `public` | `string` | - | `CoreGridHTMLElement.outerHTML` | node\_modules/typescript/lib/lib.dom.d.ts:5058 |
| <a id="ownerdocument"></a> `ownerDocument` | `readonly` | `Document` | Returns the node document. Returns null for documents. | `CoreGridHTMLElement.ownerDocument` | node\_modules/typescript/lib/lib.dom.d.ts:5059 |
| <a id="part"></a> `part` | `readonly` | `DOMTokenList` | - | `CoreGridHTMLElement.part` | node\_modules/typescript/lib/lib.dom.d.ts:5060 |
| <a id="prefix"></a> `prefix` | `readonly` | `string` | Returns the namespace prefix. | `CoreGridHTMLElement.prefix` | node\_modules/typescript/lib/lib.dom.d.ts:5062 |
| <a id="scrollheight"></a> `scrollHeight` | `readonly` | `number` | - | `CoreGridHTMLElement.scrollHeight` | node\_modules/typescript/lib/lib.dom.d.ts:5063 |
| <a id="scrollleft"></a> `scrollLeft` | `public` | `number` | - | `CoreGridHTMLElement.scrollLeft` | node\_modules/typescript/lib/lib.dom.d.ts:5064 |
| <a id="scrolltop"></a> `scrollTop` | `public` | `number` | - | `CoreGridHTMLElement.scrollTop` | node\_modules/typescript/lib/lib.dom.d.ts:5065 |
| <a id="scrollwidth"></a> `scrollWidth` | `readonly` | `number` | - | `CoreGridHTMLElement.scrollWidth` | node\_modules/typescript/lib/lib.dom.d.ts:5066 |
| <a id="shadowroot"></a> `shadowRoot` | `readonly` | `ShadowRoot` | Returns element's shadow root, if any, and if shadow root's mode is "open", and null otherwise. | `CoreGridHTMLElement.shadowRoot` | node\_modules/typescript/lib/lib.dom.d.ts:5068 |
| <a id="slot"></a> `slot` | `public` | `string` | Returns the value of element's slot content attribute. Can be set to change it. | `CoreGridHTMLElement.slot` | node\_modules/typescript/lib/lib.dom.d.ts:5070 |
| <a id="tagname"></a> `tagName` | `readonly` | `string` | Returns the HTML-uppercased qualified name. | `CoreGridHTMLElement.tagName` | node\_modules/typescript/lib/lib.dom.d.ts:5072 |
| <a id="style"></a> `style` | `readonly` | `CSSStyleDeclaration` | - | `CoreGridHTMLElement.style` | node\_modules/typescript/lib/lib.dom.d.ts:5162 |
| <a id="contenteditable"></a> `contentEditable` | `public` | `string` | - | `CoreGridHTMLElement.contentEditable` | node\_modules/typescript/lib/lib.dom.d.ts:5166 |
| <a id="enterkeyhint"></a> `enterKeyHint` | `public` | `string` | - | `CoreGridHTMLElement.enterKeyHint` | node\_modules/typescript/lib/lib.dom.d.ts:5167 |
| <a id="inputmode"></a> `inputMode` | `public` | `string` | - | `CoreGridHTMLElement.inputMode` | node\_modules/typescript/lib/lib.dom.d.ts:5168 |
| <a id="iscontenteditable"></a> `isContentEditable` | `readonly` | `boolean` | - | `CoreGridHTMLElement.isContentEditable` | node\_modules/typescript/lib/lib.dom.d.ts:5169 |
| <a id="onabort"></a> `onabort` | `public` | (`this`, `ev`) => `any` | Fires when the user aborts the download. | `CoreGridHTMLElement.onabort` | node\_modules/typescript/lib/lib.dom.d.ts:5856 |
| <a id="onanimationcancel"></a> `onanimationcancel` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onanimationcancel` | node\_modules/typescript/lib/lib.dom.d.ts:5857 |
| <a id="onanimationend"></a> `onanimationend` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onanimationend` | node\_modules/typescript/lib/lib.dom.d.ts:5858 |
| <a id="onanimationiteration"></a> `onanimationiteration` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onanimationiteration` | node\_modules/typescript/lib/lib.dom.d.ts:5859 |
| <a id="onanimationstart"></a> `onanimationstart` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onanimationstart` | node\_modules/typescript/lib/lib.dom.d.ts:5860 |
| <a id="onauxclick"></a> `onauxclick` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onauxclick` | node\_modules/typescript/lib/lib.dom.d.ts:5861 |
| <a id="onbeforeinput"></a> `onbeforeinput` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onbeforeinput` | node\_modules/typescript/lib/lib.dom.d.ts:5862 |
| <a id="onblur"></a> `onblur` | `public` | (`this`, `ev`) => `any` | Fires when the object loses the input focus. | `CoreGridHTMLElement.onblur` | node\_modules/typescript/lib/lib.dom.d.ts:5867 |
| <a id="oncancel"></a> `oncancel` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.oncancel` | node\_modules/typescript/lib/lib.dom.d.ts:5868 |
| <a id="oncanplay"></a> `oncanplay` | `public` | (`this`, `ev`) => `any` | Occurs when playback is possible, but would require further buffering. | `CoreGridHTMLElement.oncanplay` | node\_modules/typescript/lib/lib.dom.d.ts:5873 |
| <a id="oncanplaythrough"></a> `oncanplaythrough` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.oncanplaythrough` | node\_modules/typescript/lib/lib.dom.d.ts:5874 |
| <a id="onchange"></a> `onchange` | `public` | (`this`, `ev`) => `any` | Fires when the contents of the object or selection have changed. | `CoreGridHTMLElement.onchange` | node\_modules/typescript/lib/lib.dom.d.ts:5879 |
| <a id="onclick"></a> `onclick` | `public` | (`this`, `ev`) => `any` | Fires when the user clicks the left mouse button on the object | `CoreGridHTMLElement.onclick` | node\_modules/typescript/lib/lib.dom.d.ts:5884 |
| <a id="onclose"></a> `onclose` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onclose` | node\_modules/typescript/lib/lib.dom.d.ts:5885 |
| <a id="oncontextmenu"></a> `oncontextmenu` | `public` | (`this`, `ev`) => `any` | Fires when the user clicks the right mouse button in the client area, opening the context menu. | `CoreGridHTMLElement.oncontextmenu` | node\_modules/typescript/lib/lib.dom.d.ts:5890 |
| <a id="oncopy"></a> `oncopy` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.oncopy` | node\_modules/typescript/lib/lib.dom.d.ts:5891 |
| <a id="oncuechange"></a> `oncuechange` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.oncuechange` | node\_modules/typescript/lib/lib.dom.d.ts:5892 |
| <a id="oncut"></a> `oncut` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.oncut` | node\_modules/typescript/lib/lib.dom.d.ts:5893 |
| <a id="ondblclick"></a> `ondblclick` | `public` | (`this`, `ev`) => `any` | Fires when the user double-clicks the object. | `CoreGridHTMLElement.ondblclick` | node\_modules/typescript/lib/lib.dom.d.ts:5898 |
| <a id="ondrag"></a> `ondrag` | `public` | (`this`, `ev`) => `any` | Fires on the source object continuously during a drag operation. | `CoreGridHTMLElement.ondrag` | node\_modules/typescript/lib/lib.dom.d.ts:5903 |
| <a id="ondragend"></a> `ondragend` | `public` | (`this`, `ev`) => `any` | Fires on the source object when the user releases the mouse at the close of a drag operation. | `CoreGridHTMLElement.ondragend` | node\_modules/typescript/lib/lib.dom.d.ts:5908 |
| <a id="ondragenter"></a> `ondragenter` | `public` | (`this`, `ev`) => `any` | Fires on the target element when the user drags the object to a valid drop target. | `CoreGridHTMLElement.ondragenter` | node\_modules/typescript/lib/lib.dom.d.ts:5913 |
| <a id="ondragleave"></a> `ondragleave` | `public` | (`this`, `ev`) => `any` | Fires on the target object when the user moves the mouse out of a valid drop target during a drag operation. | `CoreGridHTMLElement.ondragleave` | node\_modules/typescript/lib/lib.dom.d.ts:5918 |
| <a id="ondragover"></a> `ondragover` | `public` | (`this`, `ev`) => `any` | Fires on the target element continuously while the user drags the object over a valid drop target. | `CoreGridHTMLElement.ondragover` | node\_modules/typescript/lib/lib.dom.d.ts:5923 |
| <a id="ondragstart"></a> `ondragstart` | `public` | (`this`, `ev`) => `any` | Fires on the source object when the user starts to drag a text selection or selected object. | `CoreGridHTMLElement.ondragstart` | node\_modules/typescript/lib/lib.dom.d.ts:5928 |
| <a id="ondrop"></a> `ondrop` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.ondrop` | node\_modules/typescript/lib/lib.dom.d.ts:5929 |
| <a id="ondurationchange"></a> `ondurationchange` | `public` | (`this`, `ev`) => `any` | Occurs when the duration attribute is updated. | `CoreGridHTMLElement.ondurationchange` | node\_modules/typescript/lib/lib.dom.d.ts:5934 |
| <a id="onemptied"></a> `onemptied` | `public` | (`this`, `ev`) => `any` | Occurs when the media element is reset to its initial state. | `CoreGridHTMLElement.onemptied` | node\_modules/typescript/lib/lib.dom.d.ts:5939 |
| <a id="onended"></a> `onended` | `public` | (`this`, `ev`) => `any` | Occurs when the end of playback is reached. | `CoreGridHTMLElement.onended` | node\_modules/typescript/lib/lib.dom.d.ts:5944 |
| <a id="onerror"></a> `onerror` | `public` | `OnErrorEventHandlerNonNull` | Fires when an error occurs during object loading. **Param** The event. | `CoreGridHTMLElement.onerror` | node\_modules/typescript/lib/lib.dom.d.ts:5949 |
| <a id="onfocus"></a> `onfocus` | `public` | (`this`, `ev`) => `any` | Fires when the object receives focus. | `CoreGridHTMLElement.onfocus` | node\_modules/typescript/lib/lib.dom.d.ts:5954 |
| <a id="onformdata"></a> `onformdata` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onformdata` | node\_modules/typescript/lib/lib.dom.d.ts:5955 |
| <a id="ongotpointercapture"></a> `ongotpointercapture` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.ongotpointercapture` | node\_modules/typescript/lib/lib.dom.d.ts:5956 |
| <a id="oninput"></a> `oninput` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.oninput` | node\_modules/typescript/lib/lib.dom.d.ts:5957 |
| <a id="oninvalid"></a> `oninvalid` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.oninvalid` | node\_modules/typescript/lib/lib.dom.d.ts:5958 |
| <a id="onkeydown"></a> `onkeydown` | `public` | (`this`, `ev`) => `any` | Fires when the user presses a key. | `CoreGridHTMLElement.onkeydown` | node\_modules/typescript/lib/lib.dom.d.ts:5963 |
| <a id="onkeypress"></a> ~~`onkeypress`~~ | `public` | (`this`, `ev`) => `any` | Fires when the user presses an alphanumeric key. **Deprecated** | `CoreGridHTMLElement.onkeypress` | node\_modules/typescript/lib/lib.dom.d.ts:5969 |
| <a id="onkeyup"></a> `onkeyup` | `public` | (`this`, `ev`) => `any` | Fires when the user releases a key. | `CoreGridHTMLElement.onkeyup` | node\_modules/typescript/lib/lib.dom.d.ts:5974 |
| <a id="onload"></a> `onload` | `public` | (`this`, `ev`) => `any` | Fires immediately after the browser loads the object. | `CoreGridHTMLElement.onload` | node\_modules/typescript/lib/lib.dom.d.ts:5979 |
| <a id="onloadeddata"></a> `onloadeddata` | `public` | (`this`, `ev`) => `any` | Occurs when media data is loaded at the current playback position. | `CoreGridHTMLElement.onloadeddata` | node\_modules/typescript/lib/lib.dom.d.ts:5984 |
| <a id="onloadedmetadata"></a> `onloadedmetadata` | `public` | (`this`, `ev`) => `any` | Occurs when the duration and dimensions of the media have been determined. | `CoreGridHTMLElement.onloadedmetadata` | node\_modules/typescript/lib/lib.dom.d.ts:5989 |
| <a id="onloadstart"></a> `onloadstart` | `public` | (`this`, `ev`) => `any` | Occurs when Internet Explorer begins looking for media data. | `CoreGridHTMLElement.onloadstart` | node\_modules/typescript/lib/lib.dom.d.ts:5994 |
| <a id="onlostpointercapture"></a> `onlostpointercapture` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onlostpointercapture` | node\_modules/typescript/lib/lib.dom.d.ts:5995 |
| <a id="onmousedown"></a> `onmousedown` | `public` | (`this`, `ev`) => `any` | Fires when the user clicks the object with either mouse button. | `CoreGridHTMLElement.onmousedown` | node\_modules/typescript/lib/lib.dom.d.ts:6000 |
| <a id="onmouseenter"></a> `onmouseenter` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onmouseenter` | node\_modules/typescript/lib/lib.dom.d.ts:6001 |
| <a id="onmouseleave"></a> `onmouseleave` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onmouseleave` | node\_modules/typescript/lib/lib.dom.d.ts:6002 |
| <a id="onmousemove"></a> `onmousemove` | `public` | (`this`, `ev`) => `any` | Fires when the user moves the mouse over the object. | `CoreGridHTMLElement.onmousemove` | node\_modules/typescript/lib/lib.dom.d.ts:6007 |
| <a id="onmouseout"></a> `onmouseout` | `public` | (`this`, `ev`) => `any` | Fires when the user moves the mouse pointer outside the boundaries of the object. | `CoreGridHTMLElement.onmouseout` | node\_modules/typescript/lib/lib.dom.d.ts:6012 |
| <a id="onmouseover"></a> `onmouseover` | `public` | (`this`, `ev`) => `any` | Fires when the user moves the mouse pointer into the object. | `CoreGridHTMLElement.onmouseover` | node\_modules/typescript/lib/lib.dom.d.ts:6017 |
| <a id="onmouseup"></a> `onmouseup` | `public` | (`this`, `ev`) => `any` | Fires when the user releases a mouse button while the mouse is over the object. | `CoreGridHTMLElement.onmouseup` | node\_modules/typescript/lib/lib.dom.d.ts:6022 |
| <a id="onpaste"></a> `onpaste` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onpaste` | node\_modules/typescript/lib/lib.dom.d.ts:6023 |
| <a id="onpause"></a> `onpause` | `public` | (`this`, `ev`) => `any` | Occurs when playback is paused. | `CoreGridHTMLElement.onpause` | node\_modules/typescript/lib/lib.dom.d.ts:6028 |
| <a id="onplay"></a> `onplay` | `public` | (`this`, `ev`) => `any` | Occurs when the play method is requested. | `CoreGridHTMLElement.onplay` | node\_modules/typescript/lib/lib.dom.d.ts:6033 |
| <a id="onplaying"></a> `onplaying` | `public` | (`this`, `ev`) => `any` | Occurs when the audio or video has started playing. | `CoreGridHTMLElement.onplaying` | node\_modules/typescript/lib/lib.dom.d.ts:6038 |
| <a id="onpointercancel"></a> `onpointercancel` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onpointercancel` | node\_modules/typescript/lib/lib.dom.d.ts:6039 |
| <a id="onpointerdown"></a> `onpointerdown` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onpointerdown` | node\_modules/typescript/lib/lib.dom.d.ts:6040 |
| <a id="onpointerenter"></a> `onpointerenter` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onpointerenter` | node\_modules/typescript/lib/lib.dom.d.ts:6041 |
| <a id="onpointerleave"></a> `onpointerleave` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onpointerleave` | node\_modules/typescript/lib/lib.dom.d.ts:6042 |
| <a id="onpointermove"></a> `onpointermove` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onpointermove` | node\_modules/typescript/lib/lib.dom.d.ts:6043 |
| <a id="onpointerout"></a> `onpointerout` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onpointerout` | node\_modules/typescript/lib/lib.dom.d.ts:6044 |
| <a id="onpointerover"></a> `onpointerover` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onpointerover` | node\_modules/typescript/lib/lib.dom.d.ts:6045 |
| <a id="onpointerup"></a> `onpointerup` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onpointerup` | node\_modules/typescript/lib/lib.dom.d.ts:6046 |
| <a id="onprogress"></a> `onprogress` | `public` | (`this`, `ev`) => `any` | Occurs to indicate progress while downloading media data. | `CoreGridHTMLElement.onprogress` | node\_modules/typescript/lib/lib.dom.d.ts:6051 |
| <a id="onratechange"></a> `onratechange` | `public` | (`this`, `ev`) => `any` | Occurs when the playback rate is increased or decreased. | `CoreGridHTMLElement.onratechange` | node\_modules/typescript/lib/lib.dom.d.ts:6056 |
| <a id="onreset"></a> `onreset` | `public` | (`this`, `ev`) => `any` | Fires when the user resets a form. | `CoreGridHTMLElement.onreset` | node\_modules/typescript/lib/lib.dom.d.ts:6061 |
| <a id="onresize"></a> `onresize` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onresize` | node\_modules/typescript/lib/lib.dom.d.ts:6062 |
| <a id="onscroll"></a> `onscroll` | `public` | (`this`, `ev`) => `any` | Fires when the user repositions the scroll box in the scroll bar on the object. | `CoreGridHTMLElement.onscroll` | node\_modules/typescript/lib/lib.dom.d.ts:6067 |
| <a id="onsecuritypolicyviolation"></a> `onsecuritypolicyviolation` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onsecuritypolicyviolation` | node\_modules/typescript/lib/lib.dom.d.ts:6068 |
| <a id="onseeked"></a> `onseeked` | `public` | (`this`, `ev`) => `any` | Occurs when the seek operation ends. | `CoreGridHTMLElement.onseeked` | node\_modules/typescript/lib/lib.dom.d.ts:6073 |
| <a id="onseeking"></a> `onseeking` | `public` | (`this`, `ev`) => `any` | Occurs when the current playback position is moved. | `CoreGridHTMLElement.onseeking` | node\_modules/typescript/lib/lib.dom.d.ts:6078 |
| <a id="onselect"></a> `onselect` | `public` | (`this`, `ev`) => `any` | Fires when the current selection changes. | `CoreGridHTMLElement.onselect` | node\_modules/typescript/lib/lib.dom.d.ts:6083 |
| <a id="onselectionchange"></a> `onselectionchange` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onselectionchange` | node\_modules/typescript/lib/lib.dom.d.ts:6084 |
| <a id="onselectstart"></a> `onselectstart` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onselectstart` | node\_modules/typescript/lib/lib.dom.d.ts:6085 |
| <a id="onslotchange"></a> `onslotchange` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onslotchange` | node\_modules/typescript/lib/lib.dom.d.ts:6086 |
| <a id="onstalled"></a> `onstalled` | `public` | (`this`, `ev`) => `any` | Occurs when the download has stopped. | `CoreGridHTMLElement.onstalled` | node\_modules/typescript/lib/lib.dom.d.ts:6091 |
| <a id="onsubmit"></a> `onsubmit` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onsubmit` | node\_modules/typescript/lib/lib.dom.d.ts:6092 |
| <a id="onsuspend"></a> `onsuspend` | `public` | (`this`, `ev`) => `any` | Occurs if the load operation has been intentionally halted. | `CoreGridHTMLElement.onsuspend` | node\_modules/typescript/lib/lib.dom.d.ts:6097 |
| <a id="ontimeupdate"></a> `ontimeupdate` | `public` | (`this`, `ev`) => `any` | Occurs to indicate the current playback position. | `CoreGridHTMLElement.ontimeupdate` | node\_modules/typescript/lib/lib.dom.d.ts:6102 |
| <a id="ontoggle"></a> `ontoggle` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.ontoggle` | node\_modules/typescript/lib/lib.dom.d.ts:6103 |
| <a id="ontouchcancel"></a> `ontouchcancel?` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.ontouchcancel` | node\_modules/typescript/lib/lib.dom.d.ts:6104 |
| <a id="ontouchend"></a> `ontouchend?` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.ontouchend` | node\_modules/typescript/lib/lib.dom.d.ts:6105 |
| <a id="ontouchmove"></a> `ontouchmove?` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.ontouchmove` | node\_modules/typescript/lib/lib.dom.d.ts:6106 |
| <a id="ontouchstart"></a> `ontouchstart?` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.ontouchstart` | node\_modules/typescript/lib/lib.dom.d.ts:6107 |
| <a id="ontransitioncancel"></a> `ontransitioncancel` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.ontransitioncancel` | node\_modules/typescript/lib/lib.dom.d.ts:6108 |
| <a id="ontransitionend"></a> `ontransitionend` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.ontransitionend` | node\_modules/typescript/lib/lib.dom.d.ts:6109 |
| <a id="ontransitionrun"></a> `ontransitionrun` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.ontransitionrun` | node\_modules/typescript/lib/lib.dom.d.ts:6110 |
| <a id="ontransitionstart"></a> `ontransitionstart` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.ontransitionstart` | node\_modules/typescript/lib/lib.dom.d.ts:6111 |
| <a id="onvolumechange"></a> `onvolumechange` | `public` | (`this`, `ev`) => `any` | Occurs when the volume is changed, or playback is muted or unmuted. | `CoreGridHTMLElement.onvolumechange` | node\_modules/typescript/lib/lib.dom.d.ts:6116 |
| <a id="onwaiting"></a> `onwaiting` | `public` | (`this`, `ev`) => `any` | Occurs when playback stops because the next frame of a video resource is not available. | `CoreGridHTMLElement.onwaiting` | node\_modules/typescript/lib/lib.dom.d.ts:6121 |
| <a id="onwebkitanimationend"></a> ~~`onwebkitanimationend`~~ | `public` | (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `onanimationend`. | `CoreGridHTMLElement.onwebkitanimationend` | node\_modules/typescript/lib/lib.dom.d.ts:6123 |
| <a id="onwebkitanimationiteration"></a> ~~`onwebkitanimationiteration`~~ | `public` | (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `onanimationiteration`. | `CoreGridHTMLElement.onwebkitanimationiteration` | node\_modules/typescript/lib/lib.dom.d.ts:6125 |
| <a id="onwebkitanimationstart"></a> ~~`onwebkitanimationstart`~~ | `public` | (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `onanimationstart`. | `CoreGridHTMLElement.onwebkitanimationstart` | node\_modules/typescript/lib/lib.dom.d.ts:6127 |
| <a id="onwebkittransitionend"></a> ~~`onwebkittransitionend`~~ | `public` | (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `ontransitionend`. | `CoreGridHTMLElement.onwebkittransitionend` | node\_modules/typescript/lib/lib.dom.d.ts:6129 |
| <a id="onwheel"></a> `onwheel` | `public` | (`this`, `ev`) => `any` | - | `CoreGridHTMLElement.onwheel` | node\_modules/typescript/lib/lib.dom.d.ts:6130 |
| <a id="accesskey"></a> `accessKey` | `public` | `string` | - | `CoreGridHTMLElement.accessKey` | node\_modules/typescript/lib/lib.dom.d.ts:6555 |
| <a id="accesskeylabel"></a> `accessKeyLabel` | `readonly` | `string` | - | `CoreGridHTMLElement.accessKeyLabel` | node\_modules/typescript/lib/lib.dom.d.ts:6556 |
| <a id="autocapitalize"></a> `autocapitalize` | `public` | `string` | - | `CoreGridHTMLElement.autocapitalize` | node\_modules/typescript/lib/lib.dom.d.ts:6557 |
| <a id="dir"></a> `dir` | `public` | `string` | - | `CoreGridHTMLElement.dir` | node\_modules/typescript/lib/lib.dom.d.ts:6558 |
| <a id="draggable-1"></a> `draggable` | `public` | `boolean` | - | `CoreGridHTMLElement.draggable` | node\_modules/typescript/lib/lib.dom.d.ts:6559 |
| <a id="hidden"></a> `hidden` | `public` | `boolean` | - | `CoreGridHTMLElement.hidden` | node\_modules/typescript/lib/lib.dom.d.ts:6560 |
| <a id="inert"></a> `inert` | `public` | `boolean` | - | `CoreGridHTMLElement.inert` | node\_modules/typescript/lib/lib.dom.d.ts:6561 |
| <a id="innertext"></a> `innerText` | `public` | `string` | - | `CoreGridHTMLElement.innerText` | node\_modules/typescript/lib/lib.dom.d.ts:6562 |
| <a id="lang"></a> `lang` | `public` | `string` | - | `CoreGridHTMLElement.lang` | node\_modules/typescript/lib/lib.dom.d.ts:6563 |
| <a id="offsetheight"></a> `offsetHeight` | `readonly` | `number` | - | `CoreGridHTMLElement.offsetHeight` | node\_modules/typescript/lib/lib.dom.d.ts:6564 |
| <a id="offsetleft"></a> `offsetLeft` | `readonly` | `number` | - | `CoreGridHTMLElement.offsetLeft` | node\_modules/typescript/lib/lib.dom.d.ts:6565 |
| <a id="offsetparent"></a> `offsetParent` | `readonly` | `Element` | - | `CoreGridHTMLElement.offsetParent` | node\_modules/typescript/lib/lib.dom.d.ts:6566 |
| <a id="offsettop"></a> `offsetTop` | `readonly` | `number` | - | `CoreGridHTMLElement.offsetTop` | node\_modules/typescript/lib/lib.dom.d.ts:6567 |
| <a id="offsetwidth"></a> `offsetWidth` | `readonly` | `number` | - | `CoreGridHTMLElement.offsetWidth` | node\_modules/typescript/lib/lib.dom.d.ts:6568 |
| <a id="outertext"></a> `outerText` | `public` | `string` | - | `CoreGridHTMLElement.outerText` | node\_modules/typescript/lib/lib.dom.d.ts:6569 |
| <a id="spellcheck"></a> `spellcheck` | `public` | `boolean` | - | `CoreGridHTMLElement.spellcheck` | node\_modules/typescript/lib/lib.dom.d.ts:6570 |
| <a id="title"></a> `title` | `public` | `string` | - | `CoreGridHTMLElement.title` | node\_modules/typescript/lib/lib.dom.d.ts:6571 |
| <a id="translate"></a> `translate` | `public` | `boolean` | - | `CoreGridHTMLElement.translate` | node\_modules/typescript/lib/lib.dom.d.ts:6572 |
| <a id="autofocus"></a> `autofocus` | `public` | `boolean` | - | `CoreGridHTMLElement.autofocus` | node\_modules/typescript/lib/lib.dom.d.ts:7764 |
| <a id="dataset"></a> `dataset` | `readonly` | `DOMStringMap` | - | `CoreGridHTMLElement.dataset` | node\_modules/typescript/lib/lib.dom.d.ts:7765 |
| <a id="nonce-1"></a> `nonce?` | `public` | `string` | - | `CoreGridHTMLElement.nonce` | node\_modules/typescript/lib/lib.dom.d.ts:7766 |
| <a id="tabindex"></a> `tabIndex` | `public` | `number` | - | `CoreGridHTMLElement.tabIndex` | node\_modules/typescript/lib/lib.dom.d.ts:7767 |
| <a id="innerhtml"></a> `innerHTML` | `public` | `string` | - | `CoreGridHTMLElement.innerHTML` | node\_modules/typescript/lib/lib.dom.d.ts:9130 |
| <a id="baseuri"></a> `baseURI` | `readonly` | `string` | Returns node's node document's document base URL. | `CoreGridHTMLElement.baseURI` | node\_modules/typescript/lib/lib.dom.d.ts:10249 |
| <a id="childnodes"></a> `childNodes` | `readonly` | `NodeListOf`\<`ChildNode`\> | Returns the children. | `CoreGridHTMLElement.childNodes` | node\_modules/typescript/lib/lib.dom.d.ts:10251 |
| <a id="firstchild"></a> `firstChild` | `readonly` | `ChildNode` | Returns the first child. | `CoreGridHTMLElement.firstChild` | node\_modules/typescript/lib/lib.dom.d.ts:10253 |
| <a id="isconnected"></a> `isConnected` | `readonly` | `boolean` | Returns true if node is connected and false otherwise. | `CoreGridHTMLElement.isConnected` | node\_modules/typescript/lib/lib.dom.d.ts:10255 |
| <a id="lastchild"></a> `lastChild` | `readonly` | `ChildNode` | Returns the last child. | `CoreGridHTMLElement.lastChild` | node\_modules/typescript/lib/lib.dom.d.ts:10257 |
| <a id="nextsibling"></a> `nextSibling` | `readonly` | `ChildNode` | Returns the next sibling. | `CoreGridHTMLElement.nextSibling` | node\_modules/typescript/lib/lib.dom.d.ts:10259 |
| <a id="nodename"></a> `nodeName` | `readonly` | `string` | Returns a string appropriate for the type of node. | `CoreGridHTMLElement.nodeName` | node\_modules/typescript/lib/lib.dom.d.ts:10261 |
| <a id="nodetype"></a> `nodeType` | `readonly` | `number` | Returns the type of node. | `CoreGridHTMLElement.nodeType` | node\_modules/typescript/lib/lib.dom.d.ts:10263 |
| <a id="nodevalue"></a> `nodeValue` | `public` | `string` | - | `CoreGridHTMLElement.nodeValue` | node\_modules/typescript/lib/lib.dom.d.ts:10264 |
| <a id="parentelement"></a> `parentElement` | `readonly` | `HTMLElement` | Returns the parent element. | `CoreGridHTMLElement.parentElement` | node\_modules/typescript/lib/lib.dom.d.ts:10268 |
| <a id="parentnode"></a> `parentNode` | `readonly` | `ParentNode` | Returns the parent. | `CoreGridHTMLElement.parentNode` | node\_modules/typescript/lib/lib.dom.d.ts:10270 |
| <a id="previoussibling"></a> `previousSibling` | `readonly` | `ChildNode` | Returns the previous sibling. | `CoreGridHTMLElement.previousSibling` | node\_modules/typescript/lib/lib.dom.d.ts:10272 |
| <a id="textcontent"></a> `textContent` | `public` | `string` | - | `CoreGridHTMLElement.textContent` | node\_modules/typescript/lib/lib.dom.d.ts:10273 |
| <a id="element_node"></a> `ELEMENT_NODE` | `readonly` | `1` | node is an element. | `CoreGridHTMLElement.ELEMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10297 |
| <a id="attribute_node"></a> `ATTRIBUTE_NODE` | `readonly` | `2` | - | `CoreGridHTMLElement.ATTRIBUTE_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10298 |
| <a id="text_node"></a> `TEXT_NODE` | `readonly` | `3` | node is a Text node. | `CoreGridHTMLElement.TEXT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10300 |
| <a id="cdata_section_node"></a> `CDATA_SECTION_NODE` | `readonly` | `4` | node is a CDATASection node. | `CoreGridHTMLElement.CDATA_SECTION_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10302 |
| <a id="entity_reference_node"></a> `ENTITY_REFERENCE_NODE` | `readonly` | `5` | - | `CoreGridHTMLElement.ENTITY_REFERENCE_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10303 |
| <a id="entity_node"></a> `ENTITY_NODE` | `readonly` | `6` | - | `CoreGridHTMLElement.ENTITY_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10304 |
| <a id="processing_instruction_node"></a> `PROCESSING_INSTRUCTION_NODE` | `readonly` | `7` | node is a ProcessingInstruction node. | `CoreGridHTMLElement.PROCESSING_INSTRUCTION_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10306 |
| <a id="comment_node"></a> `COMMENT_NODE` | `readonly` | `8` | node is a Comment node. | `CoreGridHTMLElement.COMMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10308 |
| <a id="document_node"></a> `DOCUMENT_NODE` | `readonly` | `9` | node is a document. | `CoreGridHTMLElement.DOCUMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10310 |
| <a id="document_type_node"></a> `DOCUMENT_TYPE_NODE` | `readonly` | `10` | node is a doctype. | `CoreGridHTMLElement.DOCUMENT_TYPE_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10312 |
| <a id="document_fragment_node"></a> `DOCUMENT_FRAGMENT_NODE` | `readonly` | `11` | node is a DocumentFragment node. | `CoreGridHTMLElement.DOCUMENT_FRAGMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10314 |
| <a id="notation_node"></a> `NOTATION_NODE` | `readonly` | `12` | - | `CoreGridHTMLElement.NOTATION_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10315 |
| <a id="document_position_disconnected"></a> `DOCUMENT_POSITION_DISCONNECTED` | `readonly` | `1` | Set when node and other are not in the same tree. | `CoreGridHTMLElement.DOCUMENT_POSITION_DISCONNECTED` | node\_modules/typescript/lib/lib.dom.d.ts:10317 |
| <a id="document_position_preceding"></a> `DOCUMENT_POSITION_PRECEDING` | `readonly` | `2` | Set when other is preceding node. | `CoreGridHTMLElement.DOCUMENT_POSITION_PRECEDING` | node\_modules/typescript/lib/lib.dom.d.ts:10319 |
| <a id="document_position_following"></a> `DOCUMENT_POSITION_FOLLOWING` | `readonly` | `4` | Set when other is following node. | `CoreGridHTMLElement.DOCUMENT_POSITION_FOLLOWING` | node\_modules/typescript/lib/lib.dom.d.ts:10321 |
| <a id="document_position_contains"></a> `DOCUMENT_POSITION_CONTAINS` | `readonly` | `8` | Set when other is an ancestor of node. | `CoreGridHTMLElement.DOCUMENT_POSITION_CONTAINS` | node\_modules/typescript/lib/lib.dom.d.ts:10323 |
| <a id="document_position_contained_by"></a> `DOCUMENT_POSITION_CONTAINED_BY` | `readonly` | `16` | Set when other is a descendant of node. | `CoreGridHTMLElement.DOCUMENT_POSITION_CONTAINED_BY` | node\_modules/typescript/lib/lib.dom.d.ts:10325 |
| <a id="document_position_implementation_specific"></a> `DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` | `readonly` | `32` | - | `CoreGridHTMLElement.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` | node\_modules/typescript/lib/lib.dom.d.ts:10326 |
| <a id="nextelementsibling"></a> `nextElementSibling` | `readonly` | `Element` | Returns the first following sibling that is an element, and null otherwise. | `CoreGridHTMLElement.nextElementSibling` | node\_modules/typescript/lib/lib.dom.d.ts:10416 |
| <a id="previouselementsibling"></a> `previousElementSibling` | `readonly` | `Element` | Returns the first preceding sibling that is an element, and null otherwise. | `CoreGridHTMLElement.previousElementSibling` | node\_modules/typescript/lib/lib.dom.d.ts:10418 |
| <a id="childelementcount"></a> `childElementCount` | `readonly` | `number` | - | `CoreGridHTMLElement.childElementCount` | node\_modules/typescript/lib/lib.dom.d.ts:10685 |
| <a id="children-1"></a> `children` | `readonly` | `HTMLCollection` | Returns the child elements. | `CoreGridHTMLElement.children` | node\_modules/typescript/lib/lib.dom.d.ts:10687 |
| <a id="firstelementchild"></a> `firstElementChild` | `readonly` | `Element` | Returns the first child that is an element, and null otherwise. | `CoreGridHTMLElement.firstElementChild` | node\_modules/typescript/lib/lib.dom.d.ts:10689 |
| <a id="lastelementchild"></a> `lastElementChild` | `readonly` | `Element` | Returns the last child that is an element, and null otherwise. | `CoreGridHTMLElement.lastElementChild` | node\_modules/typescript/lib/lib.dom.d.ts:10691 |
| <a id="assignedslot"></a> `assignedSlot` | `readonly` | `HTMLSlotElement` | - | `CoreGridHTMLElement.assignedSlot` | node\_modules/typescript/lib/lib.dom.d.ts:13933 |
| <a id="_gridcomp"></a> `_gridComp?` | `public` | [`GridStackHostApi`](#gridstackhostapi) | - | - | [vue/projects/lib/src/types.ts:54](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L54) |

***

### GridItemHTMLElement

Defined in: [vue/projects/lib/src/types.ts:57](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L57)

#### Extends

- `GridItemHTMLElement`

#### Methods

##### animate()

```ts
animate(keyframes, options?): Animation;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:2146

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `keyframes` | `Keyframe`[] \| `PropertyIndexedKeyframes` |
| `options?` | `number` \| `KeyframeAnimationOptions` |

###### Returns

`Animation`

###### Inherited from

```ts
CoreGridItemHTMLElement.animate
```

##### getAnimations()

```ts
getAnimations(options?): Animation[];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:2147

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `GetAnimationsOptions` |

###### Returns

`Animation`[]

###### Inherited from

```ts
CoreGridItemHTMLElement.getAnimations
```

##### after()

```ts
after(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3747

Inserts nodes just after node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` \| `Node`)[] |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.after
```

##### before()

```ts
before(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3753

Inserts nodes just before node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` \| `Node`)[] |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.before
```

##### remove()

```ts
remove(): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3755

Removes node.

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.remove
```

##### replaceWith()

```ts
replaceWith(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:3761

Replaces node with nodes, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` \| `Node`)[] |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.replaceWith
```

##### attachShadow()

```ts
attachShadow(init): ShadowRoot;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5074

Creates a shadow root for element and returns it.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `init` | `ShadowRootInit` |

###### Returns

`ShadowRoot`

###### Inherited from

```ts
CoreGridItemHTMLElement.attachShadow
```

##### checkVisibility()

```ts
checkVisibility(options?): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5075

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `CheckVisibilityOptions` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridItemHTMLElement.checkVisibility
```

##### closest()

###### Call Signature

```ts
closest<K>(selector): HTMLElementTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5077

Returns the first (starting at element) inclusive ancestor that matches selectors, and null otherwise.

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selector` | `K` |

###### Returns

`HTMLElementTagNameMap`\[`K`\]

###### Inherited from

```ts
CoreGridItemHTMLElement.closest
```

###### Call Signature

```ts
closest<K>(selector): SVGElementTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5078

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `SVGElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selector` | `K` |

###### Returns

`SVGElementTagNameMap`\[`K`\]

###### Inherited from

```ts
CoreGridItemHTMLElement.closest
```

###### Call Signature

```ts
closest<K>(selector): MathMLElementTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5079

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `MathMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selector` | `K` |

###### Returns

`MathMLElementTagNameMap`\[`K`\]

###### Inherited from

```ts
CoreGridItemHTMLElement.closest
```

###### Call Signature

```ts
closest<E>(selectors): E;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5080

###### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `E` *extends* `Element`\<`E`\> | `Element` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `string` |

###### Returns

`E`

###### Inherited from

```ts
CoreGridItemHTMLElement.closest
```

##### getAttribute()

```ts
getAttribute(qualifiedName): string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5082

Returns element's first attribute whose qualified name is qualifiedName, and null if there is no such attribute otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

###### Returns

`string`

###### Inherited from

```ts
CoreGridItemHTMLElement.getAttribute
```

##### getAttributeNS()

```ts
getAttributeNS(namespace, localName): string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5084

Returns element's attribute whose namespace is namespace and local name is localName, and null if there is no such attribute otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `localName` | `string` |

###### Returns

`string`

###### Inherited from

```ts
CoreGridItemHTMLElement.getAttributeNS
```

##### getAttributeNames()

```ts
getAttributeNames(): string[];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5086

Returns the qualified names of all element's attributes. Can contain duplicates.

###### Returns

`string`[]

###### Inherited from

```ts
CoreGridItemHTMLElement.getAttributeNames
```

##### getAttributeNode()

```ts
getAttributeNode(qualifiedName): Attr;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5087

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

###### Returns

`Attr`

###### Inherited from

```ts
CoreGridItemHTMLElement.getAttributeNode
```

##### getAttributeNodeNS()

```ts
getAttributeNodeNS(namespace, localName): Attr;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5088

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `localName` | `string` |

###### Returns

`Attr`

###### Inherited from

```ts
CoreGridItemHTMLElement.getAttributeNodeNS
```

##### getBoundingClientRect()

```ts
getBoundingClientRect(): DOMRect;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5089

###### Returns

`DOMRect`

###### Inherited from

```ts
CoreGridItemHTMLElement.getBoundingClientRect
```

##### getClientRects()

```ts
getClientRects(): DOMRectList;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5090

###### Returns

`DOMRectList`

###### Inherited from

```ts
CoreGridItemHTMLElement.getClientRects
```

##### getElementsByClassName()

```ts
getElementsByClassName(classNames): HTMLCollectionOf<Element>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5092

Returns a HTMLCollection of the elements in the object on which the method was invoked (a document or an element) that have all the classes given by classNames. The classNames argument is interpreted as a space-separated list of classes.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `classNames` | `string` |

###### Returns

`HTMLCollectionOf`\<`Element`\>

###### Inherited from

```ts
CoreGridItemHTMLElement.getElementsByClassName
```

##### getElementsByTagName()

###### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5093

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `K` |

###### Returns

`HTMLCollectionOf`\<`HTMLElementTagNameMap`\[`K`\]\>

###### Inherited from

```ts
CoreGridItemHTMLElement.getElementsByTagName
```

###### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<SVGElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5094

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `SVGElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `K` |

###### Returns

`HTMLCollectionOf`\<`SVGElementTagNameMap`\[`K`\]\>

###### Inherited from

```ts
CoreGridItemHTMLElement.getElementsByTagName
```

###### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5095

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `MathMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `K` |

###### Returns

`HTMLCollectionOf`\<`MathMLElementTagNameMap`\[`K`\]\>

###### Inherited from

```ts
CoreGridItemHTMLElement.getElementsByTagName
```

###### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5097

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementDeprecatedTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `K` |

###### Returns

`HTMLCollectionOf`\<`HTMLElementDeprecatedTagNameMap`\[`K`\]\>

###### Deprecated

###### Inherited from

```ts
CoreGridItemHTMLElement.getElementsByTagName
```

###### Call Signature

```ts
getElementsByTagName(qualifiedName): HTMLCollectionOf<Element>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5098

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

###### Returns

`HTMLCollectionOf`\<`Element`\>

###### Inherited from

```ts
CoreGridItemHTMLElement.getElementsByTagName
```

##### getElementsByTagNameNS()

###### Call Signature

```ts
getElementsByTagNameNS(namespaceURI, localName): HTMLCollectionOf<HTMLElement>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5099

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespaceURI` | `"http://www.w3.org/1999/xhtml"` |
| `localName` | `string` |

###### Returns

`HTMLCollectionOf`\<`HTMLElement`\>

###### Inherited from

```ts
CoreGridItemHTMLElement.getElementsByTagNameNS
```

###### Call Signature

```ts
getElementsByTagNameNS(namespaceURI, localName): HTMLCollectionOf<SVGElement>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5100

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespaceURI` | `"http://www.w3.org/2000/svg"` |
| `localName` | `string` |

###### Returns

`HTMLCollectionOf`\<`SVGElement`\>

###### Inherited from

```ts
CoreGridItemHTMLElement.getElementsByTagNameNS
```

###### Call Signature

```ts
getElementsByTagNameNS(namespaceURI, localName): HTMLCollectionOf<MathMLElement>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5101

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespaceURI` | `"http://www.w3.org/1998/Math/MathML"` |
| `localName` | `string` |

###### Returns

`HTMLCollectionOf`\<`MathMLElement`\>

###### Inherited from

```ts
CoreGridItemHTMLElement.getElementsByTagNameNS
```

###### Call Signature

```ts
getElementsByTagNameNS(namespace, localName): HTMLCollectionOf<Element>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5102

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `localName` | `string` |

###### Returns

`HTMLCollectionOf`\<`Element`\>

###### Inherited from

```ts
CoreGridItemHTMLElement.getElementsByTagNameNS
```

##### hasAttribute()

```ts
hasAttribute(qualifiedName): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5104

Returns true if element has an attribute whose qualified name is qualifiedName, and false otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridItemHTMLElement.hasAttribute
```

##### hasAttributeNS()

```ts
hasAttributeNS(namespace, localName): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5106

Returns true if element has an attribute whose namespace is namespace and local name is localName.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `localName` | `string` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridItemHTMLElement.hasAttributeNS
```

##### hasAttributes()

```ts
hasAttributes(): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5108

Returns true if element has attributes, and false otherwise.

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridItemHTMLElement.hasAttributes
```

##### hasPointerCapture()

```ts
hasPointerCapture(pointerId): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5109

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `pointerId` | `number` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridItemHTMLElement.hasPointerCapture
```

##### insertAdjacentElement()

```ts
insertAdjacentElement(where, element): Element;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5110

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `where` | `InsertPosition` |
| `element` | `Element` |

###### Returns

`Element`

###### Inherited from

```ts
CoreGridItemHTMLElement.insertAdjacentElement
```

##### insertAdjacentHTML()

```ts
insertAdjacentHTML(position, text): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5111

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `position` | `InsertPosition` |
| `text` | `string` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.insertAdjacentHTML
```

##### insertAdjacentText()

```ts
insertAdjacentText(where, data): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5112

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `where` | `InsertPosition` |
| `data` | `string` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.insertAdjacentText
```

##### matches()

```ts
matches(selectors): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5114

Returns true if matching selectors against element's root yields element, and false otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `string` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridItemHTMLElement.matches
```

##### releasePointerCapture()

```ts
releasePointerCapture(pointerId): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5115

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `pointerId` | `number` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.releasePointerCapture
```

##### removeAttribute()

```ts
removeAttribute(qualifiedName): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5117

Removes element's first attribute whose qualified name is qualifiedName.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.removeAttribute
```

##### removeAttributeNS()

```ts
removeAttributeNS(namespace, localName): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5119

Removes element's attribute whose namespace is namespace and local name is localName.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `localName` | `string` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.removeAttributeNS
```

##### removeAttributeNode()

```ts
removeAttributeNode(attr): Attr;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5120

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `attr` | `Attr` |

###### Returns

`Attr`

###### Inherited from

```ts
CoreGridItemHTMLElement.removeAttributeNode
```

##### requestFullscreen()

```ts
requestFullscreen(options?): Promise<void>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5126

Displays element fullscreen and resolves promise when done.

When supplied, options's navigationUI member indicates whether showing navigation UI while in fullscreen is preferred or not. If set to "show", navigation simplicity is preferred over screen space, and if set to "hide", more screen space is preferred. User agents are always free to honor user preference over the application's. The default value "auto" indicates no application preference.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `FullscreenOptions` |

###### Returns

`Promise`\<`void`\>

###### Inherited from

```ts
CoreGridItemHTMLElement.requestFullscreen
```

##### requestPointerLock()

```ts
requestPointerLock(): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5127

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.requestPointerLock
```

##### scroll()

###### Call Signature

```ts
scroll(options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5128

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `ScrollToOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.scroll
```

###### Call Signature

```ts
scroll(x, y): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5129

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.scroll
```

##### scrollBy()

###### Call Signature

```ts
scrollBy(options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5130

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `ScrollToOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.scrollBy
```

###### Call Signature

```ts
scrollBy(x, y): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5131

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.scrollBy
```

##### scrollIntoView()

```ts
scrollIntoView(arg?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5132

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `arg?` | `boolean` \| `ScrollIntoViewOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.scrollIntoView
```

##### scrollTo()

###### Call Signature

```ts
scrollTo(options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5133

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `ScrollToOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.scrollTo
```

###### Call Signature

```ts
scrollTo(x, y): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5134

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.scrollTo
```

##### setAttribute()

```ts
setAttribute(qualifiedName, value): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5136

Sets the value of element's first attribute whose qualified name is qualifiedName to value.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |
| `value` | `string` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.setAttribute
```

##### setAttributeNS()

```ts
setAttributeNS(
   namespace, 
   qualifiedName, 
   value): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5138

Sets the value of element's attribute whose namespace is namespace and local name is localName to value.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `qualifiedName` | `string` |
| `value` | `string` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.setAttributeNS
```

##### setAttributeNode()

```ts
setAttributeNode(attr): Attr;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5139

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `attr` | `Attr` |

###### Returns

`Attr`

###### Inherited from

```ts
CoreGridItemHTMLElement.setAttributeNode
```

##### setAttributeNodeNS()

```ts
setAttributeNodeNS(attr): Attr;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5140

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `attr` | `Attr` |

###### Returns

`Attr`

###### Inherited from

```ts
CoreGridItemHTMLElement.setAttributeNodeNS
```

##### setPointerCapture()

```ts
setPointerCapture(pointerId): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5141

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `pointerId` | `number` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.setPointerCapture
```

##### toggleAttribute()

```ts
toggleAttribute(qualifiedName, force?): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5147

If force is not given, "toggles" qualifiedName, removing it if it is present and adding it if it is not present. If force is true, adds qualifiedName. If force is false, removes qualifiedName.

Returns true if qualifiedName is now present, and false otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |
| `force?` | `boolean` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridItemHTMLElement.toggleAttribute
```

##### ~~webkitMatchesSelector()~~

```ts
webkitMatchesSelector(selectors): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5149

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `string` |

###### Returns

`boolean`

###### Deprecated

This is a legacy alias of `matches`.

###### Inherited from

```ts
CoreGridItemHTMLElement.webkitMatchesSelector
```

##### dispatchEvent()

```ts
dispatchEvent(event): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5344

Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `Event` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridItemHTMLElement.dispatchEvent
```

##### attachInternals()

```ts
attachInternals(): ElementInternals;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6573

###### Returns

`ElementInternals`

###### Inherited from

```ts
CoreGridItemHTMLElement.attachInternals
```

##### click()

```ts
click(): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6574

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.click
```

##### addEventListener()

###### Call Signature

```ts
addEventListener<K>(
   type, 
   listener, 
   options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6575

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementEventMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `K` |
| `listener` | (`this`, `ev`) => `any` |
| `options?` | `boolean` \| `AddEventListenerOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.addEventListener
```

###### Call Signature

```ts
addEventListener(
   type, 
   listener, 
   options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6576

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |
| `listener` | `EventListenerOrEventListenerObject` |
| `options?` | `boolean` \| `AddEventListenerOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.addEventListener
```

##### removeEventListener()

###### Call Signature

```ts
removeEventListener<K>(
   type, 
   listener, 
   options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6577

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementEventMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `K` |
| `listener` | (`this`, `ev`) => `any` |
| `options?` | `boolean` \| `EventListenerOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.removeEventListener
```

###### Call Signature

```ts
removeEventListener(
   type, 
   listener, 
   options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:6578

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |
| `listener` | `EventListenerOrEventListenerObject` |
| `options?` | `boolean` \| `EventListenerOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.removeEventListener
```

##### blur()

```ts
blur(): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:7768

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.blur
```

##### focus()

```ts
focus(options?): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:7769

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `FocusOptions` |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.focus
```

##### appendChild()

```ts
appendChild<T>(node): T;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10274

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Node`\<`T`\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | `T` |

###### Returns

`T`

###### Inherited from

```ts
CoreGridItemHTMLElement.appendChild
```

##### cloneNode()

```ts
cloneNode(deep?): Node;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10276

Returns a copy of node. If deep is true, the copy also includes the node's descendants.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deep?` | `boolean` |

###### Returns

`Node`

###### Inherited from

```ts
CoreGridItemHTMLElement.cloneNode
```

##### compareDocumentPosition()

```ts
compareDocumentPosition(other): number;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10278

Returns a bitmask indicating the position of other relative to node.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `Node` |

###### Returns

`number`

###### Inherited from

```ts
CoreGridItemHTMLElement.compareDocumentPosition
```

##### contains()

```ts
contains(other): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10280

Returns true if other is an inclusive descendant of node, and false otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `Node` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridItemHTMLElement.contains
```

##### getRootNode()

```ts
getRootNode(options?): Node;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10282

Returns node's root.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `GetRootNodeOptions` |

###### Returns

`Node`

###### Inherited from

```ts
CoreGridItemHTMLElement.getRootNode
```

##### hasChildNodes()

```ts
hasChildNodes(): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10284

Returns whether node has children.

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridItemHTMLElement.hasChildNodes
```

##### insertBefore()

```ts
insertBefore<T>(node, child): T;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10285

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Node`\<`T`\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | `T` |
| `child` | `Node` |

###### Returns

`T`

###### Inherited from

```ts
CoreGridItemHTMLElement.insertBefore
```

##### isDefaultNamespace()

```ts
isDefaultNamespace(namespace): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10286

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridItemHTMLElement.isDefaultNamespace
```

##### isEqualNode()

```ts
isEqualNode(otherNode): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10288

Returns whether node and otherNode have the same properties.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `otherNode` | `Node` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridItemHTMLElement.isEqualNode
```

##### isSameNode()

```ts
isSameNode(otherNode): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10289

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `otherNode` | `Node` |

###### Returns

`boolean`

###### Inherited from

```ts
CoreGridItemHTMLElement.isSameNode
```

##### lookupNamespaceURI()

```ts
lookupNamespaceURI(prefix): string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10290

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `prefix` | `string` |

###### Returns

`string`

###### Inherited from

```ts
CoreGridItemHTMLElement.lookupNamespaceURI
```

##### lookupPrefix()

```ts
lookupPrefix(namespace): string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10291

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |

###### Returns

`string`

###### Inherited from

```ts
CoreGridItemHTMLElement.lookupPrefix
```

##### normalize()

```ts
normalize(): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10293

Removes empty exclusive Text nodes and concatenates the data of remaining contiguous exclusive Text nodes into the first of their nodes.

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.normalize
```

##### removeChild()

```ts
removeChild<T>(child): T;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10294

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Node`\<`T`\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `child` | `T` |

###### Returns

`T`

###### Inherited from

```ts
CoreGridItemHTMLElement.removeChild
```

##### replaceChild()

```ts
replaceChild<T>(node, child): T;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10295

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Node`\<`T`\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | `Node` |
| `child` | `T` |

###### Returns

`T`

###### Inherited from

```ts
CoreGridItemHTMLElement.replaceChild
```

##### append()

```ts
append(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10697

Inserts nodes after the last child of node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` \| `Node`)[] |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.append
```

##### prepend()

```ts
prepend(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10703

Inserts nodes before the first child of node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` \| `Node`)[] |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.prepend
```

##### querySelector()

###### Call Signature

```ts
querySelector<K>(selectors): HTMLElementTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10705

Returns the first element that is a descendant of node that matches selectors.

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`HTMLElementTagNameMap`\[`K`\]

###### Inherited from

```ts
CoreGridItemHTMLElement.querySelector
```

###### Call Signature

```ts
querySelector<K>(selectors): SVGElementTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10706

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `SVGElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`SVGElementTagNameMap`\[`K`\]

###### Inherited from

```ts
CoreGridItemHTMLElement.querySelector
```

###### Call Signature

```ts
querySelector<K>(selectors): MathMLElementTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10707

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `MathMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`MathMLElementTagNameMap`\[`K`\]

###### Inherited from

```ts
CoreGridItemHTMLElement.querySelector
```

###### Call Signature

```ts
querySelector<K>(selectors): HTMLElementDeprecatedTagNameMap[K];
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10709

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementDeprecatedTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`HTMLElementDeprecatedTagNameMap`\[`K`\]

###### Deprecated

###### Inherited from

```ts
CoreGridItemHTMLElement.querySelector
```

###### Call Signature

```ts
querySelector<E>(selectors): E;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10710

###### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `E` *extends* `Element`\<`E`\> | `Element` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `string` |

###### Returns

`E`

###### Inherited from

```ts
CoreGridItemHTMLElement.querySelector
```

##### querySelectorAll()

###### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<HTMLElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10712

Returns all element descendants of node that match selectors.

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`NodeListOf`\<`HTMLElementTagNameMap`\[`K`\]\>

###### Inherited from

```ts
CoreGridItemHTMLElement.querySelectorAll
```

###### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<SVGElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10713

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `SVGElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`NodeListOf`\<`SVGElementTagNameMap`\[`K`\]\>

###### Inherited from

```ts
CoreGridItemHTMLElement.querySelectorAll
```

###### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<MathMLElementTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10714

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `MathMLElementTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`NodeListOf`\<`MathMLElementTagNameMap`\[`K`\]\>

###### Inherited from

```ts
CoreGridItemHTMLElement.querySelectorAll
```

###### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10716

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementDeprecatedTagNameMap` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

###### Returns

`NodeListOf`\<`HTMLElementDeprecatedTagNameMap`\[`K`\]\>

###### Deprecated

###### Inherited from

```ts
CoreGridItemHTMLElement.querySelectorAll
```

###### Call Signature

```ts
querySelectorAll<E>(selectors): NodeListOf<E>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10717

###### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `E` *extends* `Element`\<`E`\> | `Element` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `string` |

###### Returns

`NodeListOf`\<`E`\>

###### Inherited from

```ts
CoreGridItemHTMLElement.querySelectorAll
```

##### replaceChildren()

```ts
replaceChildren(...nodes): void;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10723

Replace all children of node with nodes, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` \| `Node`)[] |

###### Returns

`void`

###### Inherited from

```ts
CoreGridItemHTMLElement.replaceChildren
```

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="gridstacknode-1"></a> `gridstackNode?` | `public` | `GridStackNode` | Pointer to the associated grid node instance containing position, size, and other widget data | `CoreGridItemHTMLElement.gridstackNode` | dist/types.d.ts:45 |
| <a id="ariaatomic-1"></a> `ariaAtomic` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaAtomic` | node\_modules/typescript/lib/lib.dom.d.ts:2020 |
| <a id="ariaautocomplete-1"></a> `ariaAutoComplete` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaAutoComplete` | node\_modules/typescript/lib/lib.dom.d.ts:2021 |
| <a id="ariabusy-1"></a> `ariaBusy` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaBusy` | node\_modules/typescript/lib/lib.dom.d.ts:2022 |
| <a id="ariachecked-1"></a> `ariaChecked` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaChecked` | node\_modules/typescript/lib/lib.dom.d.ts:2023 |
| <a id="ariacolcount-1"></a> `ariaColCount` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaColCount` | node\_modules/typescript/lib/lib.dom.d.ts:2024 |
| <a id="ariacolindex-1"></a> `ariaColIndex` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaColIndex` | node\_modules/typescript/lib/lib.dom.d.ts:2025 |
| <a id="ariacolspan-1"></a> `ariaColSpan` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaColSpan` | node\_modules/typescript/lib/lib.dom.d.ts:2026 |
| <a id="ariacurrent-1"></a> `ariaCurrent` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaCurrent` | node\_modules/typescript/lib/lib.dom.d.ts:2027 |
| <a id="ariadisabled-1"></a> `ariaDisabled` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaDisabled` | node\_modules/typescript/lib/lib.dom.d.ts:2028 |
| <a id="ariaexpanded-1"></a> `ariaExpanded` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaExpanded` | node\_modules/typescript/lib/lib.dom.d.ts:2029 |
| <a id="ariahaspopup-1"></a> `ariaHasPopup` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaHasPopup` | node\_modules/typescript/lib/lib.dom.d.ts:2030 |
| <a id="ariahidden-1"></a> `ariaHidden` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaHidden` | node\_modules/typescript/lib/lib.dom.d.ts:2031 |
| <a id="ariainvalid-1"></a> `ariaInvalid` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaInvalid` | node\_modules/typescript/lib/lib.dom.d.ts:2032 |
| <a id="ariakeyshortcuts-1"></a> `ariaKeyShortcuts` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaKeyShortcuts` | node\_modules/typescript/lib/lib.dom.d.ts:2033 |
| <a id="arialabel-1"></a> `ariaLabel` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaLabel` | node\_modules/typescript/lib/lib.dom.d.ts:2034 |
| <a id="arialevel-1"></a> `ariaLevel` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaLevel` | node\_modules/typescript/lib/lib.dom.d.ts:2035 |
| <a id="arialive-1"></a> `ariaLive` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaLive` | node\_modules/typescript/lib/lib.dom.d.ts:2036 |
| <a id="ariamodal-1"></a> `ariaModal` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaModal` | node\_modules/typescript/lib/lib.dom.d.ts:2037 |
| <a id="ariamultiline-1"></a> `ariaMultiLine` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaMultiLine` | node\_modules/typescript/lib/lib.dom.d.ts:2038 |
| <a id="ariamultiselectable-1"></a> `ariaMultiSelectable` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaMultiSelectable` | node\_modules/typescript/lib/lib.dom.d.ts:2039 |
| <a id="ariaorientation-1"></a> `ariaOrientation` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaOrientation` | node\_modules/typescript/lib/lib.dom.d.ts:2040 |
| <a id="ariaplaceholder-1"></a> `ariaPlaceholder` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaPlaceholder` | node\_modules/typescript/lib/lib.dom.d.ts:2041 |
| <a id="ariaposinset-1"></a> `ariaPosInSet` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaPosInSet` | node\_modules/typescript/lib/lib.dom.d.ts:2042 |
| <a id="ariapressed-1"></a> `ariaPressed` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaPressed` | node\_modules/typescript/lib/lib.dom.d.ts:2043 |
| <a id="ariareadonly-1"></a> `ariaReadOnly` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaReadOnly` | node\_modules/typescript/lib/lib.dom.d.ts:2044 |
| <a id="ariarequired-1"></a> `ariaRequired` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaRequired` | node\_modules/typescript/lib/lib.dom.d.ts:2045 |
| <a id="ariaroledescription-1"></a> `ariaRoleDescription` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaRoleDescription` | node\_modules/typescript/lib/lib.dom.d.ts:2046 |
| <a id="ariarowcount-1"></a> `ariaRowCount` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaRowCount` | node\_modules/typescript/lib/lib.dom.d.ts:2047 |
| <a id="ariarowindex-1"></a> `ariaRowIndex` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaRowIndex` | node\_modules/typescript/lib/lib.dom.d.ts:2048 |
| <a id="ariarowspan-1"></a> `ariaRowSpan` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaRowSpan` | node\_modules/typescript/lib/lib.dom.d.ts:2049 |
| <a id="ariaselected-1"></a> `ariaSelected` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaSelected` | node\_modules/typescript/lib/lib.dom.d.ts:2050 |
| <a id="ariasetsize-1"></a> `ariaSetSize` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaSetSize` | node\_modules/typescript/lib/lib.dom.d.ts:2051 |
| <a id="ariasort-1"></a> `ariaSort` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaSort` | node\_modules/typescript/lib/lib.dom.d.ts:2052 |
| <a id="ariavaluemax-1"></a> `ariaValueMax` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaValueMax` | node\_modules/typescript/lib/lib.dom.d.ts:2053 |
| <a id="ariavaluemin-1"></a> `ariaValueMin` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaValueMin` | node\_modules/typescript/lib/lib.dom.d.ts:2054 |
| <a id="ariavaluenow-1"></a> `ariaValueNow` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaValueNow` | node\_modules/typescript/lib/lib.dom.d.ts:2055 |
| <a id="ariavaluetext-1"></a> `ariaValueText` | `public` | `string` | - | `CoreGridItemHTMLElement.ariaValueText` | node\_modules/typescript/lib/lib.dom.d.ts:2056 |
| <a id="role-1"></a> `role` | `public` | `string` | - | `CoreGridItemHTMLElement.role` | node\_modules/typescript/lib/lib.dom.d.ts:2057 |
| <a id="attributes-1"></a> `attributes` | `readonly` | `NamedNodeMap` | - | `CoreGridItemHTMLElement.attributes` | node\_modules/typescript/lib/lib.dom.d.ts:5041 |
| <a id="classlist-1"></a> `classList` | `readonly` | `DOMTokenList` | Allows for manipulation of element's class content attribute as a set of whitespace-separated tokens through a DOMTokenList object. | `CoreGridItemHTMLElement.classList` | node\_modules/typescript/lib/lib.dom.d.ts:5043 |
| <a id="classname-1"></a> `className` | `public` | `string` | Returns the value of element's class content attribute. Can be set to change it. | `CoreGridItemHTMLElement.className` | node\_modules/typescript/lib/lib.dom.d.ts:5045 |
| <a id="clientheight-1"></a> `clientHeight` | `readonly` | `number` | - | `CoreGridItemHTMLElement.clientHeight` | node\_modules/typescript/lib/lib.dom.d.ts:5046 |
| <a id="clientleft-1"></a> `clientLeft` | `readonly` | `number` | - | `CoreGridItemHTMLElement.clientLeft` | node\_modules/typescript/lib/lib.dom.d.ts:5047 |
| <a id="clienttop-1"></a> `clientTop` | `readonly` | `number` | - | `CoreGridItemHTMLElement.clientTop` | node\_modules/typescript/lib/lib.dom.d.ts:5048 |
| <a id="clientwidth-1"></a> `clientWidth` | `readonly` | `number` | - | `CoreGridItemHTMLElement.clientWidth` | node\_modules/typescript/lib/lib.dom.d.ts:5049 |
| <a id="id-3"></a> `id` | `public` | `string` | Returns the value of element's id content attribute. Can be set to change it. | `CoreGridItemHTMLElement.id` | node\_modules/typescript/lib/lib.dom.d.ts:5051 |
| <a id="localname-1"></a> `localName` | `readonly` | `string` | Returns the local name. | `CoreGridItemHTMLElement.localName` | node\_modules/typescript/lib/lib.dom.d.ts:5053 |
| <a id="namespaceuri-1"></a> `namespaceURI` | `readonly` | `string` | Returns the namespace. | `CoreGridItemHTMLElement.namespaceURI` | node\_modules/typescript/lib/lib.dom.d.ts:5055 |
| <a id="onfullscreenchange-1"></a> `onfullscreenchange` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onfullscreenchange` | node\_modules/typescript/lib/lib.dom.d.ts:5056 |
| <a id="onfullscreenerror-1"></a> `onfullscreenerror` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onfullscreenerror` | node\_modules/typescript/lib/lib.dom.d.ts:5057 |
| <a id="outerhtml-1"></a> `outerHTML` | `public` | `string` | - | `CoreGridItemHTMLElement.outerHTML` | node\_modules/typescript/lib/lib.dom.d.ts:5058 |
| <a id="ownerdocument-1"></a> `ownerDocument` | `readonly` | `Document` | Returns the node document. Returns null for documents. | `CoreGridItemHTMLElement.ownerDocument` | node\_modules/typescript/lib/lib.dom.d.ts:5059 |
| <a id="part-1"></a> `part` | `readonly` | `DOMTokenList` | - | `CoreGridItemHTMLElement.part` | node\_modules/typescript/lib/lib.dom.d.ts:5060 |
| <a id="prefix-1"></a> `prefix` | `readonly` | `string` | Returns the namespace prefix. | `CoreGridItemHTMLElement.prefix` | node\_modules/typescript/lib/lib.dom.d.ts:5062 |
| <a id="scrollheight-1"></a> `scrollHeight` | `readonly` | `number` | - | `CoreGridItemHTMLElement.scrollHeight` | node\_modules/typescript/lib/lib.dom.d.ts:5063 |
| <a id="scrollleft-1"></a> `scrollLeft` | `public` | `number` | - | `CoreGridItemHTMLElement.scrollLeft` | node\_modules/typescript/lib/lib.dom.d.ts:5064 |
| <a id="scrolltop-1"></a> `scrollTop` | `public` | `number` | - | `CoreGridItemHTMLElement.scrollTop` | node\_modules/typescript/lib/lib.dom.d.ts:5065 |
| <a id="scrollwidth-1"></a> `scrollWidth` | `readonly` | `number` | - | `CoreGridItemHTMLElement.scrollWidth` | node\_modules/typescript/lib/lib.dom.d.ts:5066 |
| <a id="shadowroot-1"></a> `shadowRoot` | `readonly` | `ShadowRoot` | Returns element's shadow root, if any, and if shadow root's mode is "open", and null otherwise. | `CoreGridItemHTMLElement.shadowRoot` | node\_modules/typescript/lib/lib.dom.d.ts:5068 |
| <a id="slot-1"></a> `slot` | `public` | `string` | Returns the value of element's slot content attribute. Can be set to change it. | `CoreGridItemHTMLElement.slot` | node\_modules/typescript/lib/lib.dom.d.ts:5070 |
| <a id="tagname-1"></a> `tagName` | `readonly` | `string` | Returns the HTML-uppercased qualified name. | `CoreGridItemHTMLElement.tagName` | node\_modules/typescript/lib/lib.dom.d.ts:5072 |
| <a id="style-1"></a> `style` | `readonly` | `CSSStyleDeclaration` | - | `CoreGridItemHTMLElement.style` | node\_modules/typescript/lib/lib.dom.d.ts:5162 |
| <a id="contenteditable-1"></a> `contentEditable` | `public` | `string` | - | `CoreGridItemHTMLElement.contentEditable` | node\_modules/typescript/lib/lib.dom.d.ts:5166 |
| <a id="enterkeyhint-1"></a> `enterKeyHint` | `public` | `string` | - | `CoreGridItemHTMLElement.enterKeyHint` | node\_modules/typescript/lib/lib.dom.d.ts:5167 |
| <a id="inputmode-1"></a> `inputMode` | `public` | `string` | - | `CoreGridItemHTMLElement.inputMode` | node\_modules/typescript/lib/lib.dom.d.ts:5168 |
| <a id="iscontenteditable-1"></a> `isContentEditable` | `readonly` | `boolean` | - | `CoreGridItemHTMLElement.isContentEditable` | node\_modules/typescript/lib/lib.dom.d.ts:5169 |
| <a id="onabort-1"></a> `onabort` | `public` | (`this`, `ev`) => `any` | Fires when the user aborts the download. | `CoreGridItemHTMLElement.onabort` | node\_modules/typescript/lib/lib.dom.d.ts:5856 |
| <a id="onanimationcancel-1"></a> `onanimationcancel` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onanimationcancel` | node\_modules/typescript/lib/lib.dom.d.ts:5857 |
| <a id="onanimationend-1"></a> `onanimationend` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onanimationend` | node\_modules/typescript/lib/lib.dom.d.ts:5858 |
| <a id="onanimationiteration-1"></a> `onanimationiteration` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onanimationiteration` | node\_modules/typescript/lib/lib.dom.d.ts:5859 |
| <a id="onanimationstart-1"></a> `onanimationstart` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onanimationstart` | node\_modules/typescript/lib/lib.dom.d.ts:5860 |
| <a id="onauxclick-1"></a> `onauxclick` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onauxclick` | node\_modules/typescript/lib/lib.dom.d.ts:5861 |
| <a id="onbeforeinput-1"></a> `onbeforeinput` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onbeforeinput` | node\_modules/typescript/lib/lib.dom.d.ts:5862 |
| <a id="onblur-1"></a> `onblur` | `public` | (`this`, `ev`) => `any` | Fires when the object loses the input focus. | `CoreGridItemHTMLElement.onblur` | node\_modules/typescript/lib/lib.dom.d.ts:5867 |
| <a id="oncancel-1"></a> `oncancel` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.oncancel` | node\_modules/typescript/lib/lib.dom.d.ts:5868 |
| <a id="oncanplay-1"></a> `oncanplay` | `public` | (`this`, `ev`) => `any` | Occurs when playback is possible, but would require further buffering. | `CoreGridItemHTMLElement.oncanplay` | node\_modules/typescript/lib/lib.dom.d.ts:5873 |
| <a id="oncanplaythrough-1"></a> `oncanplaythrough` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.oncanplaythrough` | node\_modules/typescript/lib/lib.dom.d.ts:5874 |
| <a id="onchange-1"></a> `onchange` | `public` | (`this`, `ev`) => `any` | Fires when the contents of the object or selection have changed. | `CoreGridItemHTMLElement.onchange` | node\_modules/typescript/lib/lib.dom.d.ts:5879 |
| <a id="onclick-1"></a> `onclick` | `public` | (`this`, `ev`) => `any` | Fires when the user clicks the left mouse button on the object | `CoreGridItemHTMLElement.onclick` | node\_modules/typescript/lib/lib.dom.d.ts:5884 |
| <a id="onclose-1"></a> `onclose` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onclose` | node\_modules/typescript/lib/lib.dom.d.ts:5885 |
| <a id="oncontextmenu-1"></a> `oncontextmenu` | `public` | (`this`, `ev`) => `any` | Fires when the user clicks the right mouse button in the client area, opening the context menu. | `CoreGridItemHTMLElement.oncontextmenu` | node\_modules/typescript/lib/lib.dom.d.ts:5890 |
| <a id="oncopy-1"></a> `oncopy` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.oncopy` | node\_modules/typescript/lib/lib.dom.d.ts:5891 |
| <a id="oncuechange-1"></a> `oncuechange` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.oncuechange` | node\_modules/typescript/lib/lib.dom.d.ts:5892 |
| <a id="oncut-1"></a> `oncut` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.oncut` | node\_modules/typescript/lib/lib.dom.d.ts:5893 |
| <a id="ondblclick-1"></a> `ondblclick` | `public` | (`this`, `ev`) => `any` | Fires when the user double-clicks the object. | `CoreGridItemHTMLElement.ondblclick` | node\_modules/typescript/lib/lib.dom.d.ts:5898 |
| <a id="ondrag-1"></a> `ondrag` | `public` | (`this`, `ev`) => `any` | Fires on the source object continuously during a drag operation. | `CoreGridItemHTMLElement.ondrag` | node\_modules/typescript/lib/lib.dom.d.ts:5903 |
| <a id="ondragend-1"></a> `ondragend` | `public` | (`this`, `ev`) => `any` | Fires on the source object when the user releases the mouse at the close of a drag operation. | `CoreGridItemHTMLElement.ondragend` | node\_modules/typescript/lib/lib.dom.d.ts:5908 |
| <a id="ondragenter-1"></a> `ondragenter` | `public` | (`this`, `ev`) => `any` | Fires on the target element when the user drags the object to a valid drop target. | `CoreGridItemHTMLElement.ondragenter` | node\_modules/typescript/lib/lib.dom.d.ts:5913 |
| <a id="ondragleave-1"></a> `ondragleave` | `public` | (`this`, `ev`) => `any` | Fires on the target object when the user moves the mouse out of a valid drop target during a drag operation. | `CoreGridItemHTMLElement.ondragleave` | node\_modules/typescript/lib/lib.dom.d.ts:5918 |
| <a id="ondragover-1"></a> `ondragover` | `public` | (`this`, `ev`) => `any` | Fires on the target element continuously while the user drags the object over a valid drop target. | `CoreGridItemHTMLElement.ondragover` | node\_modules/typescript/lib/lib.dom.d.ts:5923 |
| <a id="ondragstart-1"></a> `ondragstart` | `public` | (`this`, `ev`) => `any` | Fires on the source object when the user starts to drag a text selection or selected object. | `CoreGridItemHTMLElement.ondragstart` | node\_modules/typescript/lib/lib.dom.d.ts:5928 |
| <a id="ondrop-1"></a> `ondrop` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.ondrop` | node\_modules/typescript/lib/lib.dom.d.ts:5929 |
| <a id="ondurationchange-1"></a> `ondurationchange` | `public` | (`this`, `ev`) => `any` | Occurs when the duration attribute is updated. | `CoreGridItemHTMLElement.ondurationchange` | node\_modules/typescript/lib/lib.dom.d.ts:5934 |
| <a id="onemptied-1"></a> `onemptied` | `public` | (`this`, `ev`) => `any` | Occurs when the media element is reset to its initial state. | `CoreGridItemHTMLElement.onemptied` | node\_modules/typescript/lib/lib.dom.d.ts:5939 |
| <a id="onended-1"></a> `onended` | `public` | (`this`, `ev`) => `any` | Occurs when the end of playback is reached. | `CoreGridItemHTMLElement.onended` | node\_modules/typescript/lib/lib.dom.d.ts:5944 |
| <a id="onerror-1"></a> `onerror` | `public` | `OnErrorEventHandlerNonNull` | Fires when an error occurs during object loading. **Param** The event. | `CoreGridItemHTMLElement.onerror` | node\_modules/typescript/lib/lib.dom.d.ts:5949 |
| <a id="onfocus-1"></a> `onfocus` | `public` | (`this`, `ev`) => `any` | Fires when the object receives focus. | `CoreGridItemHTMLElement.onfocus` | node\_modules/typescript/lib/lib.dom.d.ts:5954 |
| <a id="onformdata-1"></a> `onformdata` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onformdata` | node\_modules/typescript/lib/lib.dom.d.ts:5955 |
| <a id="ongotpointercapture-1"></a> `ongotpointercapture` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.ongotpointercapture` | node\_modules/typescript/lib/lib.dom.d.ts:5956 |
| <a id="oninput-1"></a> `oninput` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.oninput` | node\_modules/typescript/lib/lib.dom.d.ts:5957 |
| <a id="oninvalid-1"></a> `oninvalid` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.oninvalid` | node\_modules/typescript/lib/lib.dom.d.ts:5958 |
| <a id="onkeydown-1"></a> `onkeydown` | `public` | (`this`, `ev`) => `any` | Fires when the user presses a key. | `CoreGridItemHTMLElement.onkeydown` | node\_modules/typescript/lib/lib.dom.d.ts:5963 |
| <a id="onkeypress-1"></a> ~~`onkeypress`~~ | `public` | (`this`, `ev`) => `any` | Fires when the user presses an alphanumeric key. **Deprecated** | `CoreGridItemHTMLElement.onkeypress` | node\_modules/typescript/lib/lib.dom.d.ts:5969 |
| <a id="onkeyup-1"></a> `onkeyup` | `public` | (`this`, `ev`) => `any` | Fires when the user releases a key. | `CoreGridItemHTMLElement.onkeyup` | node\_modules/typescript/lib/lib.dom.d.ts:5974 |
| <a id="onload-1"></a> `onload` | `public` | (`this`, `ev`) => `any` | Fires immediately after the browser loads the object. | `CoreGridItemHTMLElement.onload` | node\_modules/typescript/lib/lib.dom.d.ts:5979 |
| <a id="onloadeddata-1"></a> `onloadeddata` | `public` | (`this`, `ev`) => `any` | Occurs when media data is loaded at the current playback position. | `CoreGridItemHTMLElement.onloadeddata` | node\_modules/typescript/lib/lib.dom.d.ts:5984 |
| <a id="onloadedmetadata-1"></a> `onloadedmetadata` | `public` | (`this`, `ev`) => `any` | Occurs when the duration and dimensions of the media have been determined. | `CoreGridItemHTMLElement.onloadedmetadata` | node\_modules/typescript/lib/lib.dom.d.ts:5989 |
| <a id="onloadstart-1"></a> `onloadstart` | `public` | (`this`, `ev`) => `any` | Occurs when Internet Explorer begins looking for media data. | `CoreGridItemHTMLElement.onloadstart` | node\_modules/typescript/lib/lib.dom.d.ts:5994 |
| <a id="onlostpointercapture-1"></a> `onlostpointercapture` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onlostpointercapture` | node\_modules/typescript/lib/lib.dom.d.ts:5995 |
| <a id="onmousedown-1"></a> `onmousedown` | `public` | (`this`, `ev`) => `any` | Fires when the user clicks the object with either mouse button. | `CoreGridItemHTMLElement.onmousedown` | node\_modules/typescript/lib/lib.dom.d.ts:6000 |
| <a id="onmouseenter-1"></a> `onmouseenter` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onmouseenter` | node\_modules/typescript/lib/lib.dom.d.ts:6001 |
| <a id="onmouseleave-1"></a> `onmouseleave` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onmouseleave` | node\_modules/typescript/lib/lib.dom.d.ts:6002 |
| <a id="onmousemove-1"></a> `onmousemove` | `public` | (`this`, `ev`) => `any` | Fires when the user moves the mouse over the object. | `CoreGridItemHTMLElement.onmousemove` | node\_modules/typescript/lib/lib.dom.d.ts:6007 |
| <a id="onmouseout-1"></a> `onmouseout` | `public` | (`this`, `ev`) => `any` | Fires when the user moves the mouse pointer outside the boundaries of the object. | `CoreGridItemHTMLElement.onmouseout` | node\_modules/typescript/lib/lib.dom.d.ts:6012 |
| <a id="onmouseover-1"></a> `onmouseover` | `public` | (`this`, `ev`) => `any` | Fires when the user moves the mouse pointer into the object. | `CoreGridItemHTMLElement.onmouseover` | node\_modules/typescript/lib/lib.dom.d.ts:6017 |
| <a id="onmouseup-1"></a> `onmouseup` | `public` | (`this`, `ev`) => `any` | Fires when the user releases a mouse button while the mouse is over the object. | `CoreGridItemHTMLElement.onmouseup` | node\_modules/typescript/lib/lib.dom.d.ts:6022 |
| <a id="onpaste-1"></a> `onpaste` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onpaste` | node\_modules/typescript/lib/lib.dom.d.ts:6023 |
| <a id="onpause-1"></a> `onpause` | `public` | (`this`, `ev`) => `any` | Occurs when playback is paused. | `CoreGridItemHTMLElement.onpause` | node\_modules/typescript/lib/lib.dom.d.ts:6028 |
| <a id="onplay-1"></a> `onplay` | `public` | (`this`, `ev`) => `any` | Occurs when the play method is requested. | `CoreGridItemHTMLElement.onplay` | node\_modules/typescript/lib/lib.dom.d.ts:6033 |
| <a id="onplaying-1"></a> `onplaying` | `public` | (`this`, `ev`) => `any` | Occurs when the audio or video has started playing. | `CoreGridItemHTMLElement.onplaying` | node\_modules/typescript/lib/lib.dom.d.ts:6038 |
| <a id="onpointercancel-1"></a> `onpointercancel` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onpointercancel` | node\_modules/typescript/lib/lib.dom.d.ts:6039 |
| <a id="onpointerdown-1"></a> `onpointerdown` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onpointerdown` | node\_modules/typescript/lib/lib.dom.d.ts:6040 |
| <a id="onpointerenter-1"></a> `onpointerenter` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onpointerenter` | node\_modules/typescript/lib/lib.dom.d.ts:6041 |
| <a id="onpointerleave-1"></a> `onpointerleave` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onpointerleave` | node\_modules/typescript/lib/lib.dom.d.ts:6042 |
| <a id="onpointermove-1"></a> `onpointermove` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onpointermove` | node\_modules/typescript/lib/lib.dom.d.ts:6043 |
| <a id="onpointerout-1"></a> `onpointerout` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onpointerout` | node\_modules/typescript/lib/lib.dom.d.ts:6044 |
| <a id="onpointerover-1"></a> `onpointerover` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onpointerover` | node\_modules/typescript/lib/lib.dom.d.ts:6045 |
| <a id="onpointerup-1"></a> `onpointerup` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onpointerup` | node\_modules/typescript/lib/lib.dom.d.ts:6046 |
| <a id="onprogress-1"></a> `onprogress` | `public` | (`this`, `ev`) => `any` | Occurs to indicate progress while downloading media data. | `CoreGridItemHTMLElement.onprogress` | node\_modules/typescript/lib/lib.dom.d.ts:6051 |
| <a id="onratechange-1"></a> `onratechange` | `public` | (`this`, `ev`) => `any` | Occurs when the playback rate is increased or decreased. | `CoreGridItemHTMLElement.onratechange` | node\_modules/typescript/lib/lib.dom.d.ts:6056 |
| <a id="onreset-1"></a> `onreset` | `public` | (`this`, `ev`) => `any` | Fires when the user resets a form. | `CoreGridItemHTMLElement.onreset` | node\_modules/typescript/lib/lib.dom.d.ts:6061 |
| <a id="onresize-1"></a> `onresize` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onresize` | node\_modules/typescript/lib/lib.dom.d.ts:6062 |
| <a id="onscroll-1"></a> `onscroll` | `public` | (`this`, `ev`) => `any` | Fires when the user repositions the scroll box in the scroll bar on the object. | `CoreGridItemHTMLElement.onscroll` | node\_modules/typescript/lib/lib.dom.d.ts:6067 |
| <a id="onsecuritypolicyviolation-1"></a> `onsecuritypolicyviolation` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onsecuritypolicyviolation` | node\_modules/typescript/lib/lib.dom.d.ts:6068 |
| <a id="onseeked-1"></a> `onseeked` | `public` | (`this`, `ev`) => `any` | Occurs when the seek operation ends. | `CoreGridItemHTMLElement.onseeked` | node\_modules/typescript/lib/lib.dom.d.ts:6073 |
| <a id="onseeking-1"></a> `onseeking` | `public` | (`this`, `ev`) => `any` | Occurs when the current playback position is moved. | `CoreGridItemHTMLElement.onseeking` | node\_modules/typescript/lib/lib.dom.d.ts:6078 |
| <a id="onselect-1"></a> `onselect` | `public` | (`this`, `ev`) => `any` | Fires when the current selection changes. | `CoreGridItemHTMLElement.onselect` | node\_modules/typescript/lib/lib.dom.d.ts:6083 |
| <a id="onselectionchange-1"></a> `onselectionchange` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onselectionchange` | node\_modules/typescript/lib/lib.dom.d.ts:6084 |
| <a id="onselectstart-1"></a> `onselectstart` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onselectstart` | node\_modules/typescript/lib/lib.dom.d.ts:6085 |
| <a id="onslotchange-1"></a> `onslotchange` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onslotchange` | node\_modules/typescript/lib/lib.dom.d.ts:6086 |
| <a id="onstalled-1"></a> `onstalled` | `public` | (`this`, `ev`) => `any` | Occurs when the download has stopped. | `CoreGridItemHTMLElement.onstalled` | node\_modules/typescript/lib/lib.dom.d.ts:6091 |
| <a id="onsubmit-1"></a> `onsubmit` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onsubmit` | node\_modules/typescript/lib/lib.dom.d.ts:6092 |
| <a id="onsuspend-1"></a> `onsuspend` | `public` | (`this`, `ev`) => `any` | Occurs if the load operation has been intentionally halted. | `CoreGridItemHTMLElement.onsuspend` | node\_modules/typescript/lib/lib.dom.d.ts:6097 |
| <a id="ontimeupdate-1"></a> `ontimeupdate` | `public` | (`this`, `ev`) => `any` | Occurs to indicate the current playback position. | `CoreGridItemHTMLElement.ontimeupdate` | node\_modules/typescript/lib/lib.dom.d.ts:6102 |
| <a id="ontoggle-1"></a> `ontoggle` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.ontoggle` | node\_modules/typescript/lib/lib.dom.d.ts:6103 |
| <a id="ontouchcancel-1"></a> `ontouchcancel?` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.ontouchcancel` | node\_modules/typescript/lib/lib.dom.d.ts:6104 |
| <a id="ontouchend-1"></a> `ontouchend?` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.ontouchend` | node\_modules/typescript/lib/lib.dom.d.ts:6105 |
| <a id="ontouchmove-1"></a> `ontouchmove?` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.ontouchmove` | node\_modules/typescript/lib/lib.dom.d.ts:6106 |
| <a id="ontouchstart-1"></a> `ontouchstart?` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.ontouchstart` | node\_modules/typescript/lib/lib.dom.d.ts:6107 |
| <a id="ontransitioncancel-1"></a> `ontransitioncancel` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.ontransitioncancel` | node\_modules/typescript/lib/lib.dom.d.ts:6108 |
| <a id="ontransitionend-1"></a> `ontransitionend` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.ontransitionend` | node\_modules/typescript/lib/lib.dom.d.ts:6109 |
| <a id="ontransitionrun-1"></a> `ontransitionrun` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.ontransitionrun` | node\_modules/typescript/lib/lib.dom.d.ts:6110 |
| <a id="ontransitionstart-1"></a> `ontransitionstart` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.ontransitionstart` | node\_modules/typescript/lib/lib.dom.d.ts:6111 |
| <a id="onvolumechange-1"></a> `onvolumechange` | `public` | (`this`, `ev`) => `any` | Occurs when the volume is changed, or playback is muted or unmuted. | `CoreGridItemHTMLElement.onvolumechange` | node\_modules/typescript/lib/lib.dom.d.ts:6116 |
| <a id="onwaiting-1"></a> `onwaiting` | `public` | (`this`, `ev`) => `any` | Occurs when playback stops because the next frame of a video resource is not available. | `CoreGridItemHTMLElement.onwaiting` | node\_modules/typescript/lib/lib.dom.d.ts:6121 |
| <a id="onwebkitanimationend-1"></a> ~~`onwebkitanimationend`~~ | `public` | (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `onanimationend`. | `CoreGridItemHTMLElement.onwebkitanimationend` | node\_modules/typescript/lib/lib.dom.d.ts:6123 |
| <a id="onwebkitanimationiteration-1"></a> ~~`onwebkitanimationiteration`~~ | `public` | (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `onanimationiteration`. | `CoreGridItemHTMLElement.onwebkitanimationiteration` | node\_modules/typescript/lib/lib.dom.d.ts:6125 |
| <a id="onwebkitanimationstart-1"></a> ~~`onwebkitanimationstart`~~ | `public` | (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `onanimationstart`. | `CoreGridItemHTMLElement.onwebkitanimationstart` | node\_modules/typescript/lib/lib.dom.d.ts:6127 |
| <a id="onwebkittransitionend-1"></a> ~~`onwebkittransitionend`~~ | `public` | (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `ontransitionend`. | `CoreGridItemHTMLElement.onwebkittransitionend` | node\_modules/typescript/lib/lib.dom.d.ts:6129 |
| <a id="onwheel-1"></a> `onwheel` | `public` | (`this`, `ev`) => `any` | - | `CoreGridItemHTMLElement.onwheel` | node\_modules/typescript/lib/lib.dom.d.ts:6130 |
| <a id="accesskey-1"></a> `accessKey` | `public` | `string` | - | `CoreGridItemHTMLElement.accessKey` | node\_modules/typescript/lib/lib.dom.d.ts:6555 |
| <a id="accesskeylabel-1"></a> `accessKeyLabel` | `readonly` | `string` | - | `CoreGridItemHTMLElement.accessKeyLabel` | node\_modules/typescript/lib/lib.dom.d.ts:6556 |
| <a id="autocapitalize-1"></a> `autocapitalize` | `public` | `string` | - | `CoreGridItemHTMLElement.autocapitalize` | node\_modules/typescript/lib/lib.dom.d.ts:6557 |
| <a id="dir-1"></a> `dir` | `public` | `string` | - | `CoreGridItemHTMLElement.dir` | node\_modules/typescript/lib/lib.dom.d.ts:6558 |
| <a id="draggable-2"></a> `draggable` | `public` | `boolean` | - | `CoreGridItemHTMLElement.draggable` | node\_modules/typescript/lib/lib.dom.d.ts:6559 |
| <a id="hidden-1"></a> `hidden` | `public` | `boolean` | - | `CoreGridItemHTMLElement.hidden` | node\_modules/typescript/lib/lib.dom.d.ts:6560 |
| <a id="inert-1"></a> `inert` | `public` | `boolean` | - | `CoreGridItemHTMLElement.inert` | node\_modules/typescript/lib/lib.dom.d.ts:6561 |
| <a id="innertext-1"></a> `innerText` | `public` | `string` | - | `CoreGridItemHTMLElement.innerText` | node\_modules/typescript/lib/lib.dom.d.ts:6562 |
| <a id="lang-1"></a> `lang` | `public` | `string` | - | `CoreGridItemHTMLElement.lang` | node\_modules/typescript/lib/lib.dom.d.ts:6563 |
| <a id="offsetheight-1"></a> `offsetHeight` | `readonly` | `number` | - | `CoreGridItemHTMLElement.offsetHeight` | node\_modules/typescript/lib/lib.dom.d.ts:6564 |
| <a id="offsetleft-1"></a> `offsetLeft` | `readonly` | `number` | - | `CoreGridItemHTMLElement.offsetLeft` | node\_modules/typescript/lib/lib.dom.d.ts:6565 |
| <a id="offsetparent-1"></a> `offsetParent` | `readonly` | `Element` | - | `CoreGridItemHTMLElement.offsetParent` | node\_modules/typescript/lib/lib.dom.d.ts:6566 |
| <a id="offsettop-1"></a> `offsetTop` | `readonly` | `number` | - | `CoreGridItemHTMLElement.offsetTop` | node\_modules/typescript/lib/lib.dom.d.ts:6567 |
| <a id="offsetwidth-1"></a> `offsetWidth` | `readonly` | `number` | - | `CoreGridItemHTMLElement.offsetWidth` | node\_modules/typescript/lib/lib.dom.d.ts:6568 |
| <a id="outertext-1"></a> `outerText` | `public` | `string` | - | `CoreGridItemHTMLElement.outerText` | node\_modules/typescript/lib/lib.dom.d.ts:6569 |
| <a id="spellcheck-1"></a> `spellcheck` | `public` | `boolean` | - | `CoreGridItemHTMLElement.spellcheck` | node\_modules/typescript/lib/lib.dom.d.ts:6570 |
| <a id="title-1"></a> `title` | `public` | `string` | - | `CoreGridItemHTMLElement.title` | node\_modules/typescript/lib/lib.dom.d.ts:6571 |
| <a id="translate-1"></a> `translate` | `public` | `boolean` | - | `CoreGridItemHTMLElement.translate` | node\_modules/typescript/lib/lib.dom.d.ts:6572 |
| <a id="autofocus-1"></a> `autofocus` | `public` | `boolean` | - | `CoreGridItemHTMLElement.autofocus` | node\_modules/typescript/lib/lib.dom.d.ts:7764 |
| <a id="dataset-1"></a> `dataset` | `readonly` | `DOMStringMap` | - | `CoreGridItemHTMLElement.dataset` | node\_modules/typescript/lib/lib.dom.d.ts:7765 |
| <a id="nonce-2"></a> `nonce?` | `public` | `string` | - | `CoreGridItemHTMLElement.nonce` | node\_modules/typescript/lib/lib.dom.d.ts:7766 |
| <a id="tabindex-1"></a> `tabIndex` | `public` | `number` | - | `CoreGridItemHTMLElement.tabIndex` | node\_modules/typescript/lib/lib.dom.d.ts:7767 |
| <a id="innerhtml-1"></a> `innerHTML` | `public` | `string` | - | `CoreGridItemHTMLElement.innerHTML` | node\_modules/typescript/lib/lib.dom.d.ts:9130 |
| <a id="baseuri-1"></a> `baseURI` | `readonly` | `string` | Returns node's node document's document base URL. | `CoreGridItemHTMLElement.baseURI` | node\_modules/typescript/lib/lib.dom.d.ts:10249 |
| <a id="childnodes-1"></a> `childNodes` | `readonly` | `NodeListOf`\<`ChildNode`\> | Returns the children. | `CoreGridItemHTMLElement.childNodes` | node\_modules/typescript/lib/lib.dom.d.ts:10251 |
| <a id="firstchild-1"></a> `firstChild` | `readonly` | `ChildNode` | Returns the first child. | `CoreGridItemHTMLElement.firstChild` | node\_modules/typescript/lib/lib.dom.d.ts:10253 |
| <a id="isconnected-1"></a> `isConnected` | `readonly` | `boolean` | Returns true if node is connected and false otherwise. | `CoreGridItemHTMLElement.isConnected` | node\_modules/typescript/lib/lib.dom.d.ts:10255 |
| <a id="lastchild-1"></a> `lastChild` | `readonly` | `ChildNode` | Returns the last child. | `CoreGridItemHTMLElement.lastChild` | node\_modules/typescript/lib/lib.dom.d.ts:10257 |
| <a id="nextsibling-1"></a> `nextSibling` | `readonly` | `ChildNode` | Returns the next sibling. | `CoreGridItemHTMLElement.nextSibling` | node\_modules/typescript/lib/lib.dom.d.ts:10259 |
| <a id="nodename-1"></a> `nodeName` | `readonly` | `string` | Returns a string appropriate for the type of node. | `CoreGridItemHTMLElement.nodeName` | node\_modules/typescript/lib/lib.dom.d.ts:10261 |
| <a id="nodetype-1"></a> `nodeType` | `readonly` | `number` | Returns the type of node. | `CoreGridItemHTMLElement.nodeType` | node\_modules/typescript/lib/lib.dom.d.ts:10263 |
| <a id="nodevalue-1"></a> `nodeValue` | `public` | `string` | - | `CoreGridItemHTMLElement.nodeValue` | node\_modules/typescript/lib/lib.dom.d.ts:10264 |
| <a id="parentelement-1"></a> `parentElement` | `readonly` | `HTMLElement` | Returns the parent element. | `CoreGridItemHTMLElement.parentElement` | node\_modules/typescript/lib/lib.dom.d.ts:10268 |
| <a id="parentnode-1"></a> `parentNode` | `readonly` | `ParentNode` | Returns the parent. | `CoreGridItemHTMLElement.parentNode` | node\_modules/typescript/lib/lib.dom.d.ts:10270 |
| <a id="previoussibling-1"></a> `previousSibling` | `readonly` | `ChildNode` | Returns the previous sibling. | `CoreGridItemHTMLElement.previousSibling` | node\_modules/typescript/lib/lib.dom.d.ts:10272 |
| <a id="textcontent-1"></a> `textContent` | `public` | `string` | - | `CoreGridItemHTMLElement.textContent` | node\_modules/typescript/lib/lib.dom.d.ts:10273 |
| <a id="element_node-1"></a> `ELEMENT_NODE` | `readonly` | `1` | node is an element. | `CoreGridItemHTMLElement.ELEMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10297 |
| <a id="attribute_node-1"></a> `ATTRIBUTE_NODE` | `readonly` | `2` | - | `CoreGridItemHTMLElement.ATTRIBUTE_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10298 |
| <a id="text_node-1"></a> `TEXT_NODE` | `readonly` | `3` | node is a Text node. | `CoreGridItemHTMLElement.TEXT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10300 |
| <a id="cdata_section_node-1"></a> `CDATA_SECTION_NODE` | `readonly` | `4` | node is a CDATASection node. | `CoreGridItemHTMLElement.CDATA_SECTION_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10302 |
| <a id="entity_reference_node-1"></a> `ENTITY_REFERENCE_NODE` | `readonly` | `5` | - | `CoreGridItemHTMLElement.ENTITY_REFERENCE_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10303 |
| <a id="entity_node-1"></a> `ENTITY_NODE` | `readonly` | `6` | - | `CoreGridItemHTMLElement.ENTITY_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10304 |
| <a id="processing_instruction_node-1"></a> `PROCESSING_INSTRUCTION_NODE` | `readonly` | `7` | node is a ProcessingInstruction node. | `CoreGridItemHTMLElement.PROCESSING_INSTRUCTION_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10306 |
| <a id="comment_node-1"></a> `COMMENT_NODE` | `readonly` | `8` | node is a Comment node. | `CoreGridItemHTMLElement.COMMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10308 |
| <a id="document_node-1"></a> `DOCUMENT_NODE` | `readonly` | `9` | node is a document. | `CoreGridItemHTMLElement.DOCUMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10310 |
| <a id="document_type_node-1"></a> `DOCUMENT_TYPE_NODE` | `readonly` | `10` | node is a doctype. | `CoreGridItemHTMLElement.DOCUMENT_TYPE_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10312 |
| <a id="document_fragment_node-1"></a> `DOCUMENT_FRAGMENT_NODE` | `readonly` | `11` | node is a DocumentFragment node. | `CoreGridItemHTMLElement.DOCUMENT_FRAGMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10314 |
| <a id="notation_node-1"></a> `NOTATION_NODE` | `readonly` | `12` | - | `CoreGridItemHTMLElement.NOTATION_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10315 |
| <a id="document_position_disconnected-1"></a> `DOCUMENT_POSITION_DISCONNECTED` | `readonly` | `1` | Set when node and other are not in the same tree. | `CoreGridItemHTMLElement.DOCUMENT_POSITION_DISCONNECTED` | node\_modules/typescript/lib/lib.dom.d.ts:10317 |
| <a id="document_position_preceding-1"></a> `DOCUMENT_POSITION_PRECEDING` | `readonly` | `2` | Set when other is preceding node. | `CoreGridItemHTMLElement.DOCUMENT_POSITION_PRECEDING` | node\_modules/typescript/lib/lib.dom.d.ts:10319 |
| <a id="document_position_following-1"></a> `DOCUMENT_POSITION_FOLLOWING` | `readonly` | `4` | Set when other is following node. | `CoreGridItemHTMLElement.DOCUMENT_POSITION_FOLLOWING` | node\_modules/typescript/lib/lib.dom.d.ts:10321 |
| <a id="document_position_contains-1"></a> `DOCUMENT_POSITION_CONTAINS` | `readonly` | `8` | Set when other is an ancestor of node. | `CoreGridItemHTMLElement.DOCUMENT_POSITION_CONTAINS` | node\_modules/typescript/lib/lib.dom.d.ts:10323 |
| <a id="document_position_contained_by-1"></a> `DOCUMENT_POSITION_CONTAINED_BY` | `readonly` | `16` | Set when other is a descendant of node. | `CoreGridItemHTMLElement.DOCUMENT_POSITION_CONTAINED_BY` | node\_modules/typescript/lib/lib.dom.d.ts:10325 |
| <a id="document_position_implementation_specific-1"></a> `DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` | `readonly` | `32` | - | `CoreGridItemHTMLElement.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` | node\_modules/typescript/lib/lib.dom.d.ts:10326 |
| <a id="nextelementsibling-1"></a> `nextElementSibling` | `readonly` | `Element` | Returns the first following sibling that is an element, and null otherwise. | `CoreGridItemHTMLElement.nextElementSibling` | node\_modules/typescript/lib/lib.dom.d.ts:10416 |
| <a id="previouselementsibling-1"></a> `previousElementSibling` | `readonly` | `Element` | Returns the first preceding sibling that is an element, and null otherwise. | `CoreGridItemHTMLElement.previousElementSibling` | node\_modules/typescript/lib/lib.dom.d.ts:10418 |
| <a id="childelementcount-1"></a> `childElementCount` | `readonly` | `number` | - | `CoreGridItemHTMLElement.childElementCount` | node\_modules/typescript/lib/lib.dom.d.ts:10685 |
| <a id="children-2"></a> `children` | `readonly` | `HTMLCollection` | Returns the child elements. | `CoreGridItemHTMLElement.children` | node\_modules/typescript/lib/lib.dom.d.ts:10687 |
| <a id="firstelementchild-1"></a> `firstElementChild` | `readonly` | `Element` | Returns the first child that is an element, and null otherwise. | `CoreGridItemHTMLElement.firstElementChild` | node\_modules/typescript/lib/lib.dom.d.ts:10689 |
| <a id="lastelementchild-1"></a> `lastElementChild` | `readonly` | `Element` | Returns the last child that is an element, and null otherwise. | `CoreGridItemHTMLElement.lastElementChild` | node\_modules/typescript/lib/lib.dom.d.ts:10691 |
| <a id="assignedslot-1"></a> `assignedSlot` | `readonly` | `HTMLSlotElement` | - | `CoreGridItemHTMLElement.assignedSlot` | node\_modules/typescript/lib/lib.dom.d.ts:13933 |
| <a id="_griditemref"></a> `_gridItemRef?` | `public` | `object` | - | - | [vue/projects/lib/src/types.ts:58](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L58) |
| `_gridItemRef.id` | `public` | `string` | - | - | [vue/projects/lib/src/types.ts:58](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L58) |
| `_gridItemRef.gridComp` | `public` | [`GridStackHostApi`](#gridstackhostapi) | - | - | [vue/projects/lib/src/types.ts:58](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L58) |

## Type Aliases

### GridStackWidgetProps

```ts
type GridStackWidgetProps = Record<string, unknown>;
```

Defined in: [vue/projects/lib/src/types.ts:30](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/types.ts#L30)
