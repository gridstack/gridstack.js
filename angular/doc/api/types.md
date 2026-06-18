# types

## Interfaces

### NgGridStackWidget

Defined in: [angular/projects/lib/src/lib/types.ts:12](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L12)

Extended GridStackWidget interface for Angular integration.
Adds Angular-specific properties for dynamic component creation.

#### Extends

- `GridStackWidget`

#### Properties

| Property | Type | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="x"></a> `x?` | `number` | widget position x (default?: 0) | - | `GridStackWidget.x` | dist/types.d.ts:321 |
| <a id="y"></a> `y?` | `number` | widget position y (default?: 0) | - | `GridStackWidget.y` | dist/types.d.ts:323 |
| <a id="w"></a> `w?` | `number` | widget dimension width (default?: 1) | - | `GridStackWidget.w` | dist/types.d.ts:325 |
| <a id="h"></a> `h?` | `number` | widget dimension height (default?: 1) | - | `GridStackWidget.h` | dist/types.d.ts:327 |
| <a id="autoposition"></a> `autoPosition?` | `boolean` | if true then x, y parameters will be ignored and widget will be places on the first available position (default?: false) | - | `GridStackWidget.autoPosition` | dist/types.d.ts:334 |
| <a id="minw"></a> `minW?` | `number` | minimum width allowed during resize/creation (default?: undefined = un-constrained) | - | `GridStackWidget.minW` | dist/types.d.ts:336 |
| <a id="maxw"></a> `maxW?` | `number` | maximum width allowed during resize/creation (default?: undefined = un-constrained) | - | `GridStackWidget.maxW` | dist/types.d.ts:338 |
| <a id="minh"></a> `minH?` | `number` | minimum height allowed during resize/creation (default?: undefined = un-constrained) | - | `GridStackWidget.minH` | dist/types.d.ts:340 |
| <a id="maxh"></a> `maxH?` | `number` | maximum height allowed during resize/creation (default?: undefined = un-constrained) | - | `GridStackWidget.maxH` | dist/types.d.ts:342 |
| <a id="noresize"></a> `noResize?` | `boolean` | prevent direct resizing by the user (default?: undefined = un-constrained) | - | `GridStackWidget.noResize` | dist/types.d.ts:344 |
| <a id="nomove"></a> `noMove?` | `boolean` | prevents direct moving by the user (default?: undefined = un-constrained) | - | `GridStackWidget.noMove` | dist/types.d.ts:346 |
| <a id="locked"></a> `locked?` | `boolean` | prevents being pushed by other widgets or api (default?: undefined = un-constrained), which is different from `noMove` (user action only) | - | `GridStackWidget.locked` | dist/types.d.ts:348 |
| <a id="id"></a> `id?` | `string` | value for `gs-id` stored on the widget (default?: undefined) | - | `GridStackWidget.id` | dist/types.d.ts:350 |
| <a id="content"></a> `content?` | `string` | html to append inside as content | - | `GridStackWidget.content` | dist/types.d.ts:352 |
| <a id="lazyload"></a> `lazyLoad?` | `boolean` | true when widgets are only created when they scroll into view (visible) | - | `GridStackWidget.lazyLoad` | dist/types.d.ts:354 |
| <a id="sizetocontent"></a> `sizeToContent?` | `number` \| `boolean` | local (vs grid) override - see GridStackOptions. Note: This also allow you to set a maximum h value (but user changeable during normal resizing) to prevent unlimited content from taking too much space (get scrollbar) | - | `GridStackWidget.sizeToContent` | dist/types.d.ts:357 |
| <a id="resizetocontentparent"></a> `resizeToContentParent?` | `string` | local override of GridStack.resizeToContentParent that specify the class to use for the parent (actual) vs child (wanted) height | - | `GridStackWidget.resizeToContentParent` | dist/types.d.ts:359 |
| <a id="selector"></a> `selector?` | `string` | Angular component selector for dynamic creation (e.g., 'my-widget') | - | - | [angular/projects/lib/src/lib/types.ts:14](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L14) |
| <a id="input"></a> `input?` | [`NgCompInputs`](#ngcompinputs) | Serialized data for component @Input() properties | - | - | [angular/projects/lib/src/lib/types.ts:16](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L16) |
| <a id="subgridopts"></a> `subGridOpts?` | [`NgGridStackOptions`](#nggridstackoptions) | Configuration for nested sub-grids | `GridStackWidget.subGridOpts` | - | [angular/projects/lib/src/lib/types.ts:18](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L18) |

***

### NgGridStackNode

Defined in: [angular/projects/lib/src/lib/types.ts:25](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L25)

Extended GridStackNode interface for Angular integration.
Adds component selector for dynamic content creation.

#### Extends

- `GridStackNode`

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="x-1"></a> `x?` | `number` | widget position x (default?: 0) | `GridStackNode.x` | dist/types.d.ts:321 |
| <a id="y-1"></a> `y?` | `number` | widget position y (default?: 0) | `GridStackNode.y` | dist/types.d.ts:323 |
| <a id="w-1"></a> `w?` | `number` | widget dimension width (default?: 1) | `GridStackNode.w` | dist/types.d.ts:325 |
| <a id="h-1"></a> `h?` | `number` | widget dimension height (default?: 1) | `GridStackNode.h` | dist/types.d.ts:327 |
| <a id="autoposition-1"></a> `autoPosition?` | `boolean` | if true then x, y parameters will be ignored and widget will be places on the first available position (default?: false) | `GridStackNode.autoPosition` | dist/types.d.ts:334 |
| <a id="minw-1"></a> `minW?` | `number` | minimum width allowed during resize/creation (default?: undefined = un-constrained) | `GridStackNode.minW` | dist/types.d.ts:336 |
| <a id="maxw-1"></a> `maxW?` | `number` | maximum width allowed during resize/creation (default?: undefined = un-constrained) | `GridStackNode.maxW` | dist/types.d.ts:338 |
| <a id="minh-1"></a> `minH?` | `number` | minimum height allowed during resize/creation (default?: undefined = un-constrained) | `GridStackNode.minH` | dist/types.d.ts:340 |
| <a id="maxh-1"></a> `maxH?` | `number` | maximum height allowed during resize/creation (default?: undefined = un-constrained) | `GridStackNode.maxH` | dist/types.d.ts:342 |
| <a id="noresize-1"></a> `noResize?` | `boolean` | prevent direct resizing by the user (default?: undefined = un-constrained) | `GridStackNode.noResize` | dist/types.d.ts:344 |
| <a id="nomove-1"></a> `noMove?` | `boolean` | prevents direct moving by the user (default?: undefined = un-constrained) | `GridStackNode.noMove` | dist/types.d.ts:346 |
| <a id="locked-1"></a> `locked?` | `boolean` | prevents being pushed by other widgets or api (default?: undefined = un-constrained), which is different from `noMove` (user action only) | `GridStackNode.locked` | dist/types.d.ts:348 |
| <a id="id-1"></a> `id?` | `string` | value for `gs-id` stored on the widget (default?: undefined) | `GridStackNode.id` | dist/types.d.ts:350 |
| <a id="content-1"></a> `content?` | `string` | html to append inside as content | `GridStackNode.content` | dist/types.d.ts:352 |
| <a id="lazyload-1"></a> `lazyLoad?` | `boolean` | true when widgets are only created when they scroll into view (visible) | `GridStackNode.lazyLoad` | dist/types.d.ts:354 |
| <a id="sizetocontent-1"></a> `sizeToContent?` | `number` \| `boolean` | local (vs grid) override - see GridStackOptions. Note: This also allow you to set a maximum h value (but user changeable during normal resizing) to prevent unlimited content from taking too much space (get scrollbar) | `GridStackNode.sizeToContent` | dist/types.d.ts:357 |
| <a id="resizetocontentparent-1"></a> `resizeToContentParent?` | `string` | local override of GridStack.resizeToContentParent that specify the class to use for the parent (actual) vs child (wanted) height | `GridStackNode.resizeToContentParent` | dist/types.d.ts:359 |
| <a id="subgridopts-1"></a> `subGridOpts?` | `GridStackOptions` | optional nested grid options and list of children, which then turns into actual instance at runtime to get options from | `GridStackNode.subGridOpts` | dist/types.d.ts:361 |
| <a id="el"></a> `el?` | `GridItemHTMLElement` | pointer back to HTML element | `GridStackNode.el` | dist/types.d.ts:431 |
| <a id="grid"></a> `grid?` | `GridStack` | pointer back to parent Grid instance | `GridStackNode.grid` | dist/types.d.ts:433 |
| <a id="subgrid"></a> `subGrid?` | `GridStack` | actual sub-grid instance | `GridStackNode.subGrid` | dist/types.d.ts:435 |
| <a id="visibleobservable"></a> `visibleObservable?` | `IntersectionObserver` | allow delay creation when visible | `GridStackNode.visibleObservable` | dist/types.d.ts:437 |
| <a id="selector-1"></a> `selector?` | `string` | Angular component selector for this node's content | - | [angular/projects/lib/src/lib/types.ts:27](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L27) |

***

### NgGridStackOptions

Defined in: [angular/projects/lib/src/lib/types.ts:34](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L34)

Extended GridStackOptions interface for Angular integration.
Supports Angular-specific widget definitions and nested grids.

#### Extends

- `GridStackOptions`

#### Properties

| Property | Type | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="acceptwidgets"></a> `acceptWidgets?` | `string` \| `boolean` \| (`element`) => `boolean` | Accept widgets dragged from other grids or from outside (default: `false`). Can be: - `true`: will accept HTML elements having 'grid-stack-item' as class attribute - `false`: will not accept any external widgets - string: explicit class name to accept instead of default - function: callback called before an item will be accepted when entering a grid **Example** `// Accept all grid items acceptWidgets: true // Accept only items with specific class acceptWidgets: 'my-draggable-item' // Custom validation function acceptWidgets: (el) => { return el.getAttribute('data-accept') === 'true'; }` **See** [http://gridstack.github.io/gridstack.js/demo/two.html](http://gridstack.github.io/gridstack.js/demo/two.html) for complete example | - | `GridStackOptions.acceptWidgets` | dist/types.d.ts:155 |
| <a id="alwaysshowresizehandle"></a> `alwaysShowResizeHandle?` | `boolean` \| `"mobile"` | possible values (default: `mobile`) - does not apply to non-resizable widgets `false` the resizing handles are only shown while hovering over a widget `true` the resizing handles are always shown 'mobile' if running on a mobile device, default to `true` (since there is no hovering per say), else `false`. See [example](http://gridstack.github.io/gridstack.js/demo/mobile.html) | - | `GridStackOptions.alwaysShowResizeHandle` | dist/types.d.ts:161 |
| <a id="animate"></a> `animate?` | `boolean` | turns animation on (default?: true) | - | `GridStackOptions.animate` | dist/types.d.ts:163 |
| <a id="auto"></a> `auto?` | `boolean` | if false gridstack will not initialize existing items (default?: true) | - | `GridStackOptions.auto` | dist/types.d.ts:165 |
| <a id="cellheight"></a> `cellHeight?` | `numberOrString` | One cell height (default: 'auto'). Can be: - an integer (px): fixed pixel height - a string (ex: '100px', '10em', '10rem'): CSS length value - 0: library will not generate styles for rows (define your own CSS) - 'auto': height calculated for square cells (width / column) and updated live on window resize - 'initial': similar to 'auto' but stays fixed size during window resizing Note: % values don't work correctly - see demo/cell-height.html **Example** `// Fixed 100px height cellHeight: 100 // CSS units cellHeight: '5rem' cellHeight: '100px' // Auto-sizing for square cells cellHeight: 'auto' // No CSS generation (custom styles) cellHeight: 0` | - | `GridStackOptions.cellHeight` | dist/types.d.ts:190 |
| <a id="cellheightthrottle"></a> `cellHeightThrottle?` | `number` | throttle time delay (in ms) used when cellHeight='auto' to improve performance vs usability (default?: 100). A value of 0 will make it instant at a cost of re-creating the CSS file at ever window resize event! | - | `GridStackOptions.cellHeightThrottle` | dist/types.d.ts:194 |
| <a id="cellheightunit"></a> `cellHeightUnit?` | `string` | (internal) unit for cellHeight (default? 'px') which is set when a string cellHeight with a unit is passed (ex: '10rem') | - | `GridStackOptions.cellHeightUnit` | dist/types.d.ts:196 |
| <a id="column"></a> `column?` | `number` \| `"auto"` | number of columns (default?: 12). Note: IF you change this, CSS also have to change. See https://github.com/gridstack/gridstack.js#change-grid-columns. Note: for nested grids, it is recommended to use 'auto' which will always match the container grid-item current width (in column) to keep inside and outside items always the same. flag is NOT supported for regular non-nested grids. | - | `GridStackOptions.column` | dist/types.d.ts:203 |
| <a id="columnopts"></a> `columnOpts?` | `Responsive` | responsive column layout for width:column behavior | - | `GridStackOptions.columnOpts` | dist/types.d.ts:205 |
| <a id="class"></a> `class?` | `string` | additional class on top of '.grid-stack' (which is required for our CSS) to differentiate this instance. Note: only used by addGrid(), else your element should have the needed class | - | `GridStackOptions.class` | dist/types.d.ts:208 |
| <a id="disabledrag"></a> `disableDrag?` | `boolean` | disallows dragging of widgets (default?: false) | - | `GridStackOptions.disableDrag` | dist/types.d.ts:210 |
| <a id="disableresize"></a> `disableResize?` | `boolean` | disallows resizing of widgets (default?: false). | - | `GridStackOptions.disableResize` | dist/types.d.ts:212 |
| <a id="draggable"></a> `draggable?` | `DDDragOpt` | allows to override UI draggable options. (default?: { handle?: '.grid-stack-item-content', appendTo?: 'body' }) | - | `GridStackOptions.draggable` | dist/types.d.ts:214 |
| <a id="engineclass"></a> `engineClass?` | *typeof* `GridStackEngine` | the type of engine to create (so you can subclass) default to GridStackEngine | - | `GridStackOptions.engineClass` | dist/types.d.ts:217 |
| <a id="float"></a> `float?` | `boolean` | enable floating widgets (default?: false) See example (http://gridstack.github.io/gridstack.js/demo/float.html) | - | `GridStackOptions.float` | dist/types.d.ts:219 |
| <a id="handle"></a> `handle?` | `string` | draggable handle selector (default?: '.grid-stack-item-content') | - | `GridStackOptions.handle` | dist/types.d.ts:221 |
| <a id="handleclass"></a> `handleClass?` | `string` | draggable handle class (e.g. 'grid-stack-item-content'). If set 'handle' is ignored (default?: null) | - | `GridStackOptions.handleClass` | dist/types.d.ts:223 |
| <a id="itemclass"></a> `itemClass?` | `string` | additional widget class (default?: 'grid-stack-item') | - | `GridStackOptions.itemClass` | dist/types.d.ts:225 |
| <a id="layout"></a> `layout?` | `ColumnOptions` | re-layout mode when we're a subgrid and we are being resized. default to 'list' | - | `GridStackOptions.layout` | dist/types.d.ts:227 |
| <a id="lazyload-2"></a> `lazyLoad?` | `boolean` | true when widgets are only created when they scroll into view (visible) | - | `GridStackOptions.lazyLoad` | dist/types.d.ts:229 |
| <a id="margin"></a> `margin?` | `numberOrString` | gap between grid item and content (default?: 10). This will set all 4 sides and support the CSS formats below an integer (px) a string with possible units (ex: '2em', '20px', '2rem') string with space separated values (ex: '5px 10px 0 20px' for all 4 sides, or '5em 10em' for top/bottom and left/right pairs like CSS). Note: all sides must have same units (last one wins, default px) | - | `GridStackOptions.margin` | dist/types.d.ts:237 |
| <a id="margintop"></a> `marginTop?` | `numberOrString` | OLD way to optionally set each side - use margin: '5px 10px 0 20px' instead. Used internally to store each side. | - | `GridStackOptions.marginTop` | dist/types.d.ts:239 |
| <a id="marginright"></a> `marginRight?` | `numberOrString` | - | - | `GridStackOptions.marginRight` | dist/types.d.ts:240 |
| <a id="marginbottom"></a> `marginBottom?` | `numberOrString` | - | - | `GridStackOptions.marginBottom` | dist/types.d.ts:241 |
| <a id="marginleft"></a> `marginLeft?` | `numberOrString` | - | - | `GridStackOptions.marginLeft` | dist/types.d.ts:242 |
| <a id="marginunit"></a> `marginUnit?` | `string` | (internal) unit for margin (default? 'px') set when `margin` is set as string with unit (ex: 2rem') | - | `GridStackOptions.marginUnit` | dist/types.d.ts:244 |
| <a id="maxrow"></a> `maxRow?` | `number` | maximum rows amount. Default? is 0 which means no maximum rows | - | `GridStackOptions.maxRow` | dist/types.d.ts:246 |
| <a id="minrow"></a> `minRow?` | `number` | minimum rows amount which is handy to prevent grid from collapsing when empty. Default is `0`. When no set the `min-height` CSS attribute on the grid div (in pixels) can be used, which will round to the closest row. | - | `GridStackOptions.minRow` | dist/types.d.ts:250 |
| <a id="nonce"></a> `nonce?` | `string` | If you are using a nonce-based Content Security Policy, pass your nonce here and GridStack will add it to the `<style>` elements it creates. | - | `GridStackOptions.nonce` | dist/types.d.ts:253 |
| <a id="placeholderclass"></a> `placeholderClass?` | `string` | class for placeholder (default?: 'grid-stack-placeholder') | - | `GridStackOptions.placeholderClass` | dist/types.d.ts:255 |
| <a id="placeholdertext"></a> `placeholderText?` | `string` | placeholder default content (default?: '') | - | `GridStackOptions.placeholderText` | dist/types.d.ts:257 |
| <a id="resizable"></a> `resizable?` | `DDResizeOpt` | allows to override UI resizable options. default is { handles: 'se', autoHide: true on desktop, false on mobile } | - | `GridStackOptions.resizable` | dist/types.d.ts:259 |
| <a id="removable"></a> `removable?` | `string` \| `boolean` | if true widgets could be removed by dragging outside of the grid. It could also be a selector string (ex: ".trash"), in this case widgets will be removed by dropping them there (default?: false) See example (http://gridstack.github.io/gridstack.js/demo/two.html) | - | `GridStackOptions.removable` | dist/types.d.ts:265 |
| <a id="removableoptions"></a> `removableOptions?` | `DDRemoveOpt` | allows to override UI removable options. (default?: { accept: '.grid-stack-item' }) | - | `GridStackOptions.removableOptions` | dist/types.d.ts:267 |
| <a id="row"></a> `row?` | `number` | fix grid number of rows. This is a shortcut of writing `minRow:N, maxRow:N`. (default `0` no constrain) | - | `GridStackOptions.row` | dist/types.d.ts:269 |
| <a id="rtl"></a> `rtl?` | `boolean` \| `"auto"` | if true turns grid to RTL. Possible values are true, false, 'auto' (default?: 'auto') See [example](http://gridstack.github.io/gridstack.js/demo/right-to-left(rtl).html) | - | `GridStackOptions.rtl` | dist/types.d.ts:274 |
| <a id="sizetocontent-2"></a> `sizeToContent?` | `boolean` | set to true if all grid items (by default, but item can also override) height should be based on content size instead of WidgetItem.h to avoid v-scrollbars. Note: this is still row based, not pixels, so it will use ceil(getBoundingClientRect().height / getCellHeight()) | - | `GridStackOptions.sizeToContent` | dist/types.d.ts:278 |
| <a id="staticgrid"></a> `staticGrid?` | `boolean` | makes grid static (default?: false). If `true` widgets are not movable/resizable. You don't even need draggable/resizable. A CSS class 'grid-stack-static' is also added to the element. | - | `GridStackOptions.staticGrid` | dist/types.d.ts:284 |
| <a id="styleinhead"></a> ~~`styleInHead?`~~ | `boolean` | **Deprecated** Not used anymore, styles are now implemented with local CSS variables | - | `GridStackOptions.styleInHead` | dist/types.d.ts:288 |
| <a id="subgriddynamic"></a> `subGridDynamic?` | `boolean` | enable/disable the creation of sub-grids on the fly by dragging items completely over others (nest) vs partially (push). Forces `DDDragOpt.pause=true` to accomplish that. | - | `GridStackOptions.subGridDynamic` | dist/types.d.ts:293 |
| <a id="children"></a> `children?` | [`NgGridStackWidget`](#nggridstackwidget)[] | Array of Angular widget definitions for initial grid setup | `GridStackOptions.children` | - | [angular/projects/lib/src/lib/types.ts:36](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L36) |
| <a id="subgridopts-2"></a> `subGridOpts?` | [`NgGridStackOptions`](#nggridstackoptions) | Configuration for nested sub-grids (Angular-aware) | `GridStackOptions.subGridOpts` | - | [angular/projects/lib/src/lib/types.ts:38](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L38) |

## Type Aliases

### NgCompInputs

```ts
type NgCompInputs = object;
```

Defined in: [angular/projects/lib/src/lib/types.ts:55](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L55)

Type for component input data serialization.
Maps @Input() property names to their values for widget persistence.

#### Index Signature

```ts
[key: string]: any
```

#### Example

```typescript
const inputs: NgCompInputs = {
  title: 'My Widget',
  value: 42,
  config: { enabled: true }
};
```
