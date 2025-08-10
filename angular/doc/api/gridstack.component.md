# gridstack.component

## Classes

### GridstackComponent

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:85](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L85)

Angular component wrapper for GridStack.

This component provides Angular integration for GridStack grids, handling:
- Grid initialization and lifecycle
- Dynamic component creation and management
- Event binding and emission
- Integration with Angular change detection

Use in combination with GridstackItemComponent for individual grid items.

#### Example

```html
<gridstack [options]="gridOptions" (change)="onGridChange($event)">
  <div empty-content>Drag widgets here</div>
</gridstack>
```

#### Implements

- `OnInit`
- `AfterContentInit`
- `OnDestroy`

#### Accessors

##### options

###### Get Signature

```ts
get options(): GridStackOptions;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:120](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L120)

Get the current running grid options

###### Returns

`GridStackOptions`

###### Set Signature

```ts
set options(o): void;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:112](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L112)

Grid configuration options.
Can be set before grid initialization or updated after grid is created.

###### Example

```typescript
gridOptions: GridStackOptions = {
  column: 12,
  cellHeight: 'auto',
  animate: true
};
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `o` | `GridStackOptions` |

###### Returns

`void`

##### el

###### Get Signature

```ts
get el(): GridCompHTMLElement;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:190](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L190)

Get the native DOM element that contains grid-specific fields.
This element has GridStack properties attached to it.

###### Returns

[`GridCompHTMLElement`](#gridcomphtmlelement)

##### grid

###### Get Signature

```ts
get grid(): undefined | GridStack;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:201](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L201)

Get the underlying GridStack instance.
Use this to access GridStack API methods directly.

###### Example

```typescript
this.gridComponent.grid.addWidget({x: 0, y: 0, w: 2, h: 1});
```

###### Returns

`undefined` \| `GridStack`

#### Constructors

##### Constructor

```ts
new GridstackComponent(elementRef): GridstackComponent;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:252](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L252)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `elementRef` | `ElementRef`\<[`GridCompHTMLElement`](#gridcomphtmlelement)\> |

###### Returns

[`GridstackComponent`](#gridstackcomponent)

#### Methods

##### addComponentToSelectorType()

```ts
static addComponentToSelectorType(typeList): void;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:234](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L234)

Register a list of Angular components for dynamic creation.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typeList` | `Type`\<`Object`\>[] | Array of component types to register |

###### Returns

`void`

###### Example

```typescript
GridstackComponent.addComponentToSelectorType([
  MyWidgetComponent,
  AnotherWidgetComponent
]);
```

##### getSelector()

```ts
static getSelector(type): string;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:243](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L243)

Extract the selector string from an Angular component type.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `Type`\<`Object`\> | The component type to get selector from |

###### Returns

`string`

The component's selector string

##### ngOnInit()

```ts
ngOnInit(): void;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:266](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L266)

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

###### Returns

`void`

###### Implementation of

```ts
OnInit.ngOnInit
```

##### ngAfterContentInit()

```ts
ngAfterContentInit(): void;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:276](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L276)

wait until after all DOM is ready to init gridstack children (after angular ngFor and sub-components run first)

###### Returns

`void`

###### Implementation of

```ts
AfterContentInit.ngAfterContentInit
```

##### ngOnDestroy()

```ts
ngOnDestroy(): void;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:284](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L284)

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

###### Returns

`void`

###### Implementation of

```ts
OnDestroy.ngOnDestroy
```

##### updateAll()

```ts
updateAll(): void;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:298](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L298)

called when the TEMPLATE (not recommended) list of items changes - get a list of nodes and
update the layout accordingly (which will take care of adding/removing items changed by Angular)

###### Returns

`void`

##### checkEmpty()

```ts
checkEmpty(): void;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:309](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L309)

check if the grid is empty, if so show alternative content

###### Returns

`void`

##### hookEvents()

```ts
protected hookEvents(grid?): void;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:315](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L315)

get all known events as easy to use Outputs for convenience

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `grid?` | `GridStack` |

###### Returns

`void`

##### unhookEvents()

```ts
protected unhookEvents(grid?): void;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:342](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L342)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `grid?` | `GridStack` |

###### Returns

`void`

#### Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="gridstackitems"></a> `gridstackItems?` | `public` | `QueryList`\<[`GridstackItemComponent`](gridstack-item.component.md#gridstackitemcomponent)\> | `undefined` | List of template-based grid items (not recommended approach). Used to sync between DOM and GridStack internals when items are defined in templates. Prefer dynamic component creation instead. | [angular/projects/lib/src/lib/gridstack.component.ts:92](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L92) |
| <a id="container"></a> `container?` | `public` | `ViewContainerRef` | `undefined` | Container for dynamic component creation (recommended approach). Used to append grid items programmatically at runtime. | [angular/projects/lib/src/lib/gridstack.component.ts:97](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L97) |
| <a id="isempty"></a> `isEmpty?` | `public` | `boolean` | `undefined` | Controls whether empty content should be displayed. Set to true to show ng-content with 'empty-content' selector when grid has no items. **Example** `<gridstack [isEmpty]="gridItems.length === 0"> <div empty-content>Drag widgets here to get started</div> </gridstack>` | [angular/projects/lib/src/lib/gridstack.component.ts:133](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L133) |
| <a id="addedcb"></a> `addedCB` | `public` | `EventEmitter`\<[`nodesCB`](#nodescb)\> | `undefined` | Emitted when widgets are added to the grid | [angular/projects/lib/src/lib/gridstack.component.ts:151](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L151) |
| <a id="changecb"></a> `changeCB` | `public` | `EventEmitter`\<[`nodesCB`](#nodescb)\> | `undefined` | Emitted when grid layout changes | [angular/projects/lib/src/lib/gridstack.component.ts:154](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L154) |
| <a id="disablecb"></a> `disableCB` | `public` | `EventEmitter`\<[`eventCB`](#eventcb)\> | `undefined` | Emitted when grid is disabled | [angular/projects/lib/src/lib/gridstack.component.ts:157](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L157) |
| <a id="dragcb"></a> `dragCB` | `public` | `EventEmitter`\<[`elementCB`](#elementcb)\> | `undefined` | Emitted during widget drag operations | [angular/projects/lib/src/lib/gridstack.component.ts:160](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L160) |
| <a id="dragstartcb"></a> `dragStartCB` | `public` | `EventEmitter`\<[`elementCB`](#elementcb)\> | `undefined` | Emitted when widget drag starts | [angular/projects/lib/src/lib/gridstack.component.ts:163](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L163) |
| <a id="dragstopcb"></a> `dragStopCB` | `public` | `EventEmitter`\<[`elementCB`](#elementcb)\> | `undefined` | Emitted when widget drag stops | [angular/projects/lib/src/lib/gridstack.component.ts:166](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L166) |
| <a id="droppedcb-1"></a> `droppedCB` | `public` | `EventEmitter`\<[`droppedCB`](#droppedcb)\> | `undefined` | Emitted when widget is dropped | [angular/projects/lib/src/lib/gridstack.component.ts:169](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L169) |
| <a id="enablecb"></a> `enableCB` | `public` | `EventEmitter`\<[`eventCB`](#eventcb)\> | `undefined` | Emitted when grid is enabled | [angular/projects/lib/src/lib/gridstack.component.ts:172](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L172) |
| <a id="removedcb"></a> `removedCB` | `public` | `EventEmitter`\<[`nodesCB`](#nodescb)\> | `undefined` | Emitted when widgets are removed from the grid | [angular/projects/lib/src/lib/gridstack.component.ts:175](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L175) |
| <a id="resizecb"></a> `resizeCB` | `public` | `EventEmitter`\<[`elementCB`](#elementcb)\> | `undefined` | Emitted during widget resize operations | [angular/projects/lib/src/lib/gridstack.component.ts:178](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L178) |
| <a id="resizestartcb"></a> `resizeStartCB` | `public` | `EventEmitter`\<[`elementCB`](#elementcb)\> | `undefined` | Emitted when widget resize starts | [angular/projects/lib/src/lib/gridstack.component.ts:181](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L181) |
| <a id="resizestopcb"></a> `resizeStopCB` | `public` | `EventEmitter`\<[`elementCB`](#elementcb)\> | `undefined` | Emitted when widget resize stops | [angular/projects/lib/src/lib/gridstack.component.ts:184](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L184) |
| <a id="ref"></a> `ref` | `public` | \| `undefined` \| `ComponentRef`\<[`GridstackComponent`](#gridstackcomponent)\> | `undefined` | Component reference for dynamic component removal. Used internally when this component is created dynamically. | [angular/projects/lib/src/lib/gridstack.component.ts:207](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L207) |
| <a id="selectortotype-1"></a> `selectorToType` | `static` | [`SelectorToType`](#selectortotype) | `{}` | Mapping of component selectors to their types for dynamic creation. This enables dynamic component instantiation from string selectors. Angular doesn't provide public access to this mapping, so we maintain our own. **Example** `GridstackComponent.addComponentToSelectorType([MyWidgetComponent]);` | [angular/projects/lib/src/lib/gridstack.component.ts:220](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L220) |
| <a id="_options"></a> `_options?` | `protected` | `GridStackOptions` | `undefined` | - | [angular/projects/lib/src/lib/gridstack.component.ts:247](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L247) |
| <a id="_grid"></a> `_grid?` | `protected` | `GridStack` | `undefined` | - | [angular/projects/lib/src/lib/gridstack.component.ts:248](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L248) |
| <a id="_sub"></a> `_sub` | `protected` | `undefined` \| `Subscription` | `undefined` | - | [angular/projects/lib/src/lib/gridstack.component.ts:249](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L249) |
| <a id="loaded"></a> `loaded?` | `protected` | `boolean` | `undefined` | - | [angular/projects/lib/src/lib/gridstack.component.ts:250](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L250) |
| <a id="elementref"></a> `elementRef` | `readonly` | `ElementRef`\<[`GridCompHTMLElement`](#gridcomphtmlelement)\> | `undefined` | - | [angular/projects/lib/src/lib/gridstack.component.ts:252](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L252) |

## Interfaces

### GridCompHTMLElement

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:39](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L39)

Extended HTMLElement interface for the grid container.
Stores a back-reference to the Angular component for integration purposes.

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
| `keyframes` | `null` \| `Keyframe`[] \| `PropertyIndexedKeyframes` |
| `options?` | `number` \| `KeyframeAnimationOptions` |

###### Returns

`Animation`

###### Inherited from

```ts
GridHTMLElement.animate
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
GridHTMLElement.getAnimations
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
GridHTMLElement.after
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
GridHTMLElement.before
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
GridHTMLElement.remove
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
GridHTMLElement.replaceWith
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
GridHTMLElement.attachShadow
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
GridHTMLElement.checkVisibility
```

##### closest()

###### Call Signature

```ts
closest<K>(selector): null | HTMLElementTagNameMap[K];
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

`null` \| `HTMLElementTagNameMap`\[`K`\]

###### Inherited from

```ts
GridHTMLElement.closest
```

###### Call Signature

```ts
closest<K>(selector): null | SVGElementTagNameMap[K];
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

`null` \| `SVGElementTagNameMap`\[`K`\]

###### Inherited from

```ts
GridHTMLElement.closest
```

###### Call Signature

```ts
closest<K>(selector): null | MathMLElementTagNameMap[K];
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

`null` \| `MathMLElementTagNameMap`\[`K`\]

###### Inherited from

```ts
GridHTMLElement.closest
```

###### Call Signature

```ts
closest<E>(selectors): null | E;
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

`null` \| `E`

###### Inherited from

```ts
GridHTMLElement.closest
```

##### getAttribute()

```ts
getAttribute(qualifiedName): null | string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5082

Returns element's first attribute whose qualified name is qualifiedName, and null if there is no such attribute otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

###### Returns

`null` \| `string`

###### Inherited from

```ts
GridHTMLElement.getAttribute
```

##### getAttributeNS()

```ts
getAttributeNS(namespace, localName): null | string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5084

Returns element's attribute whose namespace is namespace and local name is localName, and null if there is no such attribute otherwise.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `null` \| `string` |
| `localName` | `string` |

###### Returns

`null` \| `string`

###### Inherited from

```ts
GridHTMLElement.getAttributeNS
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
GridHTMLElement.getAttributeNames
```

##### getAttributeNode()

```ts
getAttributeNode(qualifiedName): null | Attr;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5087

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

###### Returns

`null` \| `Attr`

###### Inherited from

```ts
GridHTMLElement.getAttributeNode
```

##### getAttributeNodeNS()

```ts
getAttributeNodeNS(namespace, localName): null | Attr;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5088

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `null` \| `string` |
| `localName` | `string` |

###### Returns

`null` \| `Attr`

###### Inherited from

```ts
GridHTMLElement.getAttributeNodeNS
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
GridHTMLElement.getBoundingClientRect
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
GridHTMLElement.getClientRects
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
GridHTMLElement.getElementsByClassName
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
GridHTMLElement.getElementsByTagName
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
GridHTMLElement.getElementsByTagName
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
GridHTMLElement.getElementsByTagName
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
GridHTMLElement.getElementsByTagName
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
GridHTMLElement.getElementsByTagName
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
GridHTMLElement.getElementsByTagNameNS
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
GridHTMLElement.getElementsByTagNameNS
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
GridHTMLElement.getElementsByTagNameNS
```

###### Call Signature

```ts
getElementsByTagNameNS(namespace, localName): HTMLCollectionOf<Element>;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5102

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `null` \| `string` |
| `localName` | `string` |

###### Returns

`HTMLCollectionOf`\<`Element`\>

###### Inherited from

```ts
GridHTMLElement.getElementsByTagNameNS
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
GridHTMLElement.hasAttribute
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
| `namespace` | `null` \| `string` |
| `localName` | `string` |

###### Returns

`boolean`

###### Inherited from

```ts
GridHTMLElement.hasAttributeNS
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
GridHTMLElement.hasAttributes
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
GridHTMLElement.hasPointerCapture
```

##### insertAdjacentElement()

```ts
insertAdjacentElement(where, element): null | Element;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5110

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `where` | `InsertPosition` |
| `element` | `Element` |

###### Returns

`null` \| `Element`

###### Inherited from

```ts
GridHTMLElement.insertAdjacentElement
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
GridHTMLElement.insertAdjacentHTML
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
GridHTMLElement.insertAdjacentText
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
GridHTMLElement.matches
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
GridHTMLElement.releasePointerCapture
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
GridHTMLElement.removeAttribute
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
| `namespace` | `null` \| `string` |
| `localName` | `string` |

###### Returns

`void`

###### Inherited from

```ts
GridHTMLElement.removeAttributeNS
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
GridHTMLElement.removeAttributeNode
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
GridHTMLElement.requestFullscreen
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
GridHTMLElement.requestPointerLock
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
GridHTMLElement.scroll
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
GridHTMLElement.scroll
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
GridHTMLElement.scrollBy
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
GridHTMLElement.scrollBy
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
GridHTMLElement.scrollIntoView
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
GridHTMLElement.scrollTo
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
GridHTMLElement.scrollTo
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
GridHTMLElement.setAttribute
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
| `namespace` | `null` \| `string` |
| `qualifiedName` | `string` |
| `value` | `string` |

###### Returns

`void`

###### Inherited from

```ts
GridHTMLElement.setAttributeNS
```

##### setAttributeNode()

```ts
setAttributeNode(attr): null | Attr;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5139

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `attr` | `Attr` |

###### Returns

`null` \| `Attr`

###### Inherited from

```ts
GridHTMLElement.setAttributeNode
```

##### setAttributeNodeNS()

```ts
setAttributeNodeNS(attr): null | Attr;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5140

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `attr` | `Attr` |

###### Returns

`null` \| `Attr`

###### Inherited from

```ts
GridHTMLElement.setAttributeNodeNS
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
GridHTMLElement.setPointerCapture
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
GridHTMLElement.toggleAttribute
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
GridHTMLElement.webkitMatchesSelector
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
GridHTMLElement.dispatchEvent
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
GridHTMLElement.attachInternals
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
GridHTMLElement.click
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
GridHTMLElement.addEventListener
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
GridHTMLElement.addEventListener
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
GridHTMLElement.removeEventListener
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
GridHTMLElement.removeEventListener
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
GridHTMLElement.blur
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
GridHTMLElement.focus
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
GridHTMLElement.appendChild
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
GridHTMLElement.cloneNode
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
GridHTMLElement.compareDocumentPosition
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
| `other` | `null` \| `Node` |

###### Returns

`boolean`

###### Inherited from

```ts
GridHTMLElement.contains
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
GridHTMLElement.getRootNode
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
GridHTMLElement.hasChildNodes
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
| `child` | `null` \| `Node` |

###### Returns

`T`

###### Inherited from

```ts
GridHTMLElement.insertBefore
```

##### isDefaultNamespace()

```ts
isDefaultNamespace(namespace): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10286

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `null` \| `string` |

###### Returns

`boolean`

###### Inherited from

```ts
GridHTMLElement.isDefaultNamespace
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
| `otherNode` | `null` \| `Node` |

###### Returns

`boolean`

###### Inherited from

```ts
GridHTMLElement.isEqualNode
```

##### isSameNode()

```ts
isSameNode(otherNode): boolean;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10289

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `otherNode` | `null` \| `Node` |

###### Returns

`boolean`

###### Inherited from

```ts
GridHTMLElement.isSameNode
```

##### lookupNamespaceURI()

```ts
lookupNamespaceURI(prefix): null | string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10290

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `prefix` | `null` \| `string` |

###### Returns

`null` \| `string`

###### Inherited from

```ts
GridHTMLElement.lookupNamespaceURI
```

##### lookupPrefix()

```ts
lookupPrefix(namespace): null | string;
```

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:10291

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `null` \| `string` |

###### Returns

`null` \| `string`

###### Inherited from

```ts
GridHTMLElement.lookupPrefix
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
GridHTMLElement.normalize
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
GridHTMLElement.removeChild
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
GridHTMLElement.replaceChild
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
GridHTMLElement.append
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
GridHTMLElement.prepend
```

##### querySelector()

###### Call Signature

```ts
querySelector<K>(selectors): null | HTMLElementTagNameMap[K];
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

`null` \| `HTMLElementTagNameMap`\[`K`\]

###### Inherited from

```ts
GridHTMLElement.querySelector
```

###### Call Signature

```ts
querySelector<K>(selectors): null | SVGElementTagNameMap[K];
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

`null` \| `SVGElementTagNameMap`\[`K`\]

###### Inherited from

```ts
GridHTMLElement.querySelector
```

###### Call Signature

```ts
querySelector<K>(selectors): null | MathMLElementTagNameMap[K];
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

`null` \| `MathMLElementTagNameMap`\[`K`\]

###### Inherited from

```ts
GridHTMLElement.querySelector
```

###### Call Signature

```ts
querySelector<K>(selectors): null | HTMLElementDeprecatedTagNameMap[K];
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

`null` \| `HTMLElementDeprecatedTagNameMap`\[`K`\]

###### Deprecated

###### Inherited from

```ts
GridHTMLElement.querySelector
```

###### Call Signature

```ts
querySelector<E>(selectors): null | E;
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

`null` \| `E`

###### Inherited from

```ts
GridHTMLElement.querySelector
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
GridHTMLElement.querySelectorAll
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
GridHTMLElement.querySelectorAll
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
GridHTMLElement.querySelectorAll
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
GridHTMLElement.querySelectorAll
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
GridHTMLElement.querySelectorAll
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
GridHTMLElement.replaceChildren
```

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_gridcomp"></a> `_gridComp?` | `public` | [`GridstackComponent`](#gridstackcomponent) | Back-reference to the Angular GridStack component | - | [angular/projects/lib/src/lib/gridstack.component.ts:41](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L41) |
| <a id="ariaatomic"></a> `ariaAtomic` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaAtomic` | node\_modules/typescript/lib/lib.dom.d.ts:2020 |
| <a id="ariaautocomplete"></a> `ariaAutoComplete` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaAutoComplete` | node\_modules/typescript/lib/lib.dom.d.ts:2021 |
| <a id="ariabusy"></a> `ariaBusy` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaBusy` | node\_modules/typescript/lib/lib.dom.d.ts:2022 |
| <a id="ariachecked"></a> `ariaChecked` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaChecked` | node\_modules/typescript/lib/lib.dom.d.ts:2023 |
| <a id="ariacolcount"></a> `ariaColCount` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaColCount` | node\_modules/typescript/lib/lib.dom.d.ts:2024 |
| <a id="ariacolindex"></a> `ariaColIndex` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaColIndex` | node\_modules/typescript/lib/lib.dom.d.ts:2025 |
| <a id="ariacolspan"></a> `ariaColSpan` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaColSpan` | node\_modules/typescript/lib/lib.dom.d.ts:2026 |
| <a id="ariacurrent"></a> `ariaCurrent` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaCurrent` | node\_modules/typescript/lib/lib.dom.d.ts:2027 |
| <a id="ariadisabled"></a> `ariaDisabled` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaDisabled` | node\_modules/typescript/lib/lib.dom.d.ts:2028 |
| <a id="ariaexpanded"></a> `ariaExpanded` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaExpanded` | node\_modules/typescript/lib/lib.dom.d.ts:2029 |
| <a id="ariahaspopup"></a> `ariaHasPopup` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaHasPopup` | node\_modules/typescript/lib/lib.dom.d.ts:2030 |
| <a id="ariahidden"></a> `ariaHidden` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaHidden` | node\_modules/typescript/lib/lib.dom.d.ts:2031 |
| <a id="ariainvalid"></a> `ariaInvalid` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaInvalid` | node\_modules/typescript/lib/lib.dom.d.ts:2032 |
| <a id="ariakeyshortcuts"></a> `ariaKeyShortcuts` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaKeyShortcuts` | node\_modules/typescript/lib/lib.dom.d.ts:2033 |
| <a id="arialabel"></a> `ariaLabel` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaLabel` | node\_modules/typescript/lib/lib.dom.d.ts:2034 |
| <a id="arialevel"></a> `ariaLevel` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaLevel` | node\_modules/typescript/lib/lib.dom.d.ts:2035 |
| <a id="arialive"></a> `ariaLive` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaLive` | node\_modules/typescript/lib/lib.dom.d.ts:2036 |
| <a id="ariamodal"></a> `ariaModal` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaModal` | node\_modules/typescript/lib/lib.dom.d.ts:2037 |
| <a id="ariamultiline"></a> `ariaMultiLine` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaMultiLine` | node\_modules/typescript/lib/lib.dom.d.ts:2038 |
| <a id="ariamultiselectable"></a> `ariaMultiSelectable` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaMultiSelectable` | node\_modules/typescript/lib/lib.dom.d.ts:2039 |
| <a id="ariaorientation"></a> `ariaOrientation` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaOrientation` | node\_modules/typescript/lib/lib.dom.d.ts:2040 |
| <a id="ariaplaceholder"></a> `ariaPlaceholder` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaPlaceholder` | node\_modules/typescript/lib/lib.dom.d.ts:2041 |
| <a id="ariaposinset"></a> `ariaPosInSet` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaPosInSet` | node\_modules/typescript/lib/lib.dom.d.ts:2042 |
| <a id="ariapressed"></a> `ariaPressed` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaPressed` | node\_modules/typescript/lib/lib.dom.d.ts:2043 |
| <a id="ariareadonly"></a> `ariaReadOnly` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaReadOnly` | node\_modules/typescript/lib/lib.dom.d.ts:2044 |
| <a id="ariarequired"></a> `ariaRequired` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaRequired` | node\_modules/typescript/lib/lib.dom.d.ts:2045 |
| <a id="ariaroledescription"></a> `ariaRoleDescription` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaRoleDescription` | node\_modules/typescript/lib/lib.dom.d.ts:2046 |
| <a id="ariarowcount"></a> `ariaRowCount` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaRowCount` | node\_modules/typescript/lib/lib.dom.d.ts:2047 |
| <a id="ariarowindex"></a> `ariaRowIndex` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaRowIndex` | node\_modules/typescript/lib/lib.dom.d.ts:2048 |
| <a id="ariarowspan"></a> `ariaRowSpan` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaRowSpan` | node\_modules/typescript/lib/lib.dom.d.ts:2049 |
| <a id="ariaselected"></a> `ariaSelected` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaSelected` | node\_modules/typescript/lib/lib.dom.d.ts:2050 |
| <a id="ariasetsize"></a> `ariaSetSize` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaSetSize` | node\_modules/typescript/lib/lib.dom.d.ts:2051 |
| <a id="ariasort"></a> `ariaSort` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaSort` | node\_modules/typescript/lib/lib.dom.d.ts:2052 |
| <a id="ariavaluemax"></a> `ariaValueMax` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaValueMax` | node\_modules/typescript/lib/lib.dom.d.ts:2053 |
| <a id="ariavaluemin"></a> `ariaValueMin` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaValueMin` | node\_modules/typescript/lib/lib.dom.d.ts:2054 |
| <a id="ariavaluenow"></a> `ariaValueNow` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaValueNow` | node\_modules/typescript/lib/lib.dom.d.ts:2055 |
| <a id="ariavaluetext"></a> `ariaValueText` | `public` | `null` \| `string` | - | `GridHTMLElement.ariaValueText` | node\_modules/typescript/lib/lib.dom.d.ts:2056 |
| <a id="role"></a> `role` | `public` | `null` \| `string` | - | `GridHTMLElement.role` | node\_modules/typescript/lib/lib.dom.d.ts:2057 |
| <a id="attributes"></a> `attributes` | `readonly` | `NamedNodeMap` | - | `GridHTMLElement.attributes` | node\_modules/typescript/lib/lib.dom.d.ts:5041 |
| <a id="classlist"></a> `classList` | `readonly` | `DOMTokenList` | Allows for manipulation of element's class content attribute as a set of whitespace-separated tokens through a DOMTokenList object. | `GridHTMLElement.classList` | node\_modules/typescript/lib/lib.dom.d.ts:5043 |
| <a id="classname"></a> `className` | `public` | `string` | Returns the value of element's class content attribute. Can be set to change it. | `GridHTMLElement.className` | node\_modules/typescript/lib/lib.dom.d.ts:5045 |
| <a id="clientheight"></a> `clientHeight` | `readonly` | `number` | - | `GridHTMLElement.clientHeight` | node\_modules/typescript/lib/lib.dom.d.ts:5046 |
| <a id="clientleft"></a> `clientLeft` | `readonly` | `number` | - | `GridHTMLElement.clientLeft` | node\_modules/typescript/lib/lib.dom.d.ts:5047 |
| <a id="clienttop"></a> `clientTop` | `readonly` | `number` | - | `GridHTMLElement.clientTop` | node\_modules/typescript/lib/lib.dom.d.ts:5048 |
| <a id="clientwidth"></a> `clientWidth` | `readonly` | `number` | - | `GridHTMLElement.clientWidth` | node\_modules/typescript/lib/lib.dom.d.ts:5049 |
| <a id="id"></a> `id` | `public` | `string` | Returns the value of element's id content attribute. Can be set to change it. | `GridHTMLElement.id` | node\_modules/typescript/lib/lib.dom.d.ts:5051 |
| <a id="localname"></a> `localName` | `readonly` | `string` | Returns the local name. | `GridHTMLElement.localName` | node\_modules/typescript/lib/lib.dom.d.ts:5053 |
| <a id="namespaceuri"></a> `namespaceURI` | `readonly` | `null` \| `string` | Returns the namespace. | `GridHTMLElement.namespaceURI` | node\_modules/typescript/lib/lib.dom.d.ts:5055 |
| <a id="onfullscreenchange"></a> `onfullscreenchange` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onfullscreenchange` | node\_modules/typescript/lib/lib.dom.d.ts:5056 |
| <a id="onfullscreenerror"></a> `onfullscreenerror` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onfullscreenerror` | node\_modules/typescript/lib/lib.dom.d.ts:5057 |
| <a id="outerhtml"></a> `outerHTML` | `public` | `string` | - | `GridHTMLElement.outerHTML` | node\_modules/typescript/lib/lib.dom.d.ts:5058 |
| <a id="ownerdocument"></a> `ownerDocument` | `readonly` | `Document` | Returns the node document. Returns null for documents. | `GridHTMLElement.ownerDocument` | node\_modules/typescript/lib/lib.dom.d.ts:5059 |
| <a id="part"></a> `part` | `readonly` | `DOMTokenList` | - | `GridHTMLElement.part` | node\_modules/typescript/lib/lib.dom.d.ts:5060 |
| <a id="prefix"></a> `prefix` | `readonly` | `null` \| `string` | Returns the namespace prefix. | `GridHTMLElement.prefix` | node\_modules/typescript/lib/lib.dom.d.ts:5062 |
| <a id="scrollheight"></a> `scrollHeight` | `readonly` | `number` | - | `GridHTMLElement.scrollHeight` | node\_modules/typescript/lib/lib.dom.d.ts:5063 |
| <a id="scrollleft"></a> `scrollLeft` | `public` | `number` | - | `GridHTMLElement.scrollLeft` | node\_modules/typescript/lib/lib.dom.d.ts:5064 |
| <a id="scrolltop"></a> `scrollTop` | `public` | `number` | - | `GridHTMLElement.scrollTop` | node\_modules/typescript/lib/lib.dom.d.ts:5065 |
| <a id="scrollwidth"></a> `scrollWidth` | `readonly` | `number` | - | `GridHTMLElement.scrollWidth` | node\_modules/typescript/lib/lib.dom.d.ts:5066 |
| <a id="shadowroot"></a> `shadowRoot` | `readonly` | `null` \| `ShadowRoot` | Returns element's shadow root, if any, and if shadow root's mode is "open", and null otherwise. | `GridHTMLElement.shadowRoot` | node\_modules/typescript/lib/lib.dom.d.ts:5068 |
| <a id="slot"></a> `slot` | `public` | `string` | Returns the value of element's slot content attribute. Can be set to change it. | `GridHTMLElement.slot` | node\_modules/typescript/lib/lib.dom.d.ts:5070 |
| <a id="tagname"></a> `tagName` | `readonly` | `string` | Returns the HTML-uppercased qualified name. | `GridHTMLElement.tagName` | node\_modules/typescript/lib/lib.dom.d.ts:5072 |
| <a id="style"></a> `style` | `readonly` | `CSSStyleDeclaration` | - | `GridHTMLElement.style` | node\_modules/typescript/lib/lib.dom.d.ts:5162 |
| <a id="contenteditable"></a> `contentEditable` | `public` | `string` | - | `GridHTMLElement.contentEditable` | node\_modules/typescript/lib/lib.dom.d.ts:5166 |
| <a id="enterkeyhint"></a> `enterKeyHint` | `public` | `string` | - | `GridHTMLElement.enterKeyHint` | node\_modules/typescript/lib/lib.dom.d.ts:5167 |
| <a id="inputmode"></a> `inputMode` | `public` | `string` | - | `GridHTMLElement.inputMode` | node\_modules/typescript/lib/lib.dom.d.ts:5168 |
| <a id="iscontenteditable"></a> `isContentEditable` | `readonly` | `boolean` | - | `GridHTMLElement.isContentEditable` | node\_modules/typescript/lib/lib.dom.d.ts:5169 |
| <a id="onabort"></a> `onabort` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user aborts the download. **Param** The event. | `GridHTMLElement.onabort` | node\_modules/typescript/lib/lib.dom.d.ts:5856 |
| <a id="onanimationcancel"></a> `onanimationcancel` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onanimationcancel` | node\_modules/typescript/lib/lib.dom.d.ts:5857 |
| <a id="onanimationend"></a> `onanimationend` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onanimationend` | node\_modules/typescript/lib/lib.dom.d.ts:5858 |
| <a id="onanimationiteration"></a> `onanimationiteration` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onanimationiteration` | node\_modules/typescript/lib/lib.dom.d.ts:5859 |
| <a id="onanimationstart"></a> `onanimationstart` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onanimationstart` | node\_modules/typescript/lib/lib.dom.d.ts:5860 |
| <a id="onauxclick"></a> `onauxclick` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onauxclick` | node\_modules/typescript/lib/lib.dom.d.ts:5861 |
| <a id="onbeforeinput"></a> `onbeforeinput` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onbeforeinput` | node\_modules/typescript/lib/lib.dom.d.ts:5862 |
| <a id="onblur"></a> `onblur` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the object loses the input focus. **Param** The focus event. | `GridHTMLElement.onblur` | node\_modules/typescript/lib/lib.dom.d.ts:5867 |
| <a id="oncancel"></a> `oncancel` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.oncancel` | node\_modules/typescript/lib/lib.dom.d.ts:5868 |
| <a id="oncanplay"></a> `oncanplay` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when playback is possible, but would require further buffering. **Param** The event. | `GridHTMLElement.oncanplay` | node\_modules/typescript/lib/lib.dom.d.ts:5873 |
| <a id="oncanplaythrough"></a> `oncanplaythrough` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.oncanplaythrough` | node\_modules/typescript/lib/lib.dom.d.ts:5874 |
| <a id="onchange"></a> `onchange` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the contents of the object or selection have changed. **Param** The event. | `GridHTMLElement.onchange` | node\_modules/typescript/lib/lib.dom.d.ts:5879 |
| <a id="onclick"></a> `onclick` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user clicks the left mouse button on the object **Param** The mouse event. | `GridHTMLElement.onclick` | node\_modules/typescript/lib/lib.dom.d.ts:5884 |
| <a id="onclose"></a> `onclose` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onclose` | node\_modules/typescript/lib/lib.dom.d.ts:5885 |
| <a id="oncontextmenu"></a> `oncontextmenu` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user clicks the right mouse button in the client area, opening the context menu. **Param** The mouse event. | `GridHTMLElement.oncontextmenu` | node\_modules/typescript/lib/lib.dom.d.ts:5890 |
| <a id="oncopy"></a> `oncopy` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.oncopy` | node\_modules/typescript/lib/lib.dom.d.ts:5891 |
| <a id="oncuechange"></a> `oncuechange` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.oncuechange` | node\_modules/typescript/lib/lib.dom.d.ts:5892 |
| <a id="oncut"></a> `oncut` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.oncut` | node\_modules/typescript/lib/lib.dom.d.ts:5893 |
| <a id="ondblclick"></a> `ondblclick` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user double-clicks the object. **Param** The mouse event. | `GridHTMLElement.ondblclick` | node\_modules/typescript/lib/lib.dom.d.ts:5898 |
| <a id="ondrag"></a> `ondrag` | `public` | `null` \| (`this`, `ev`) => `any` | Fires on the source object continuously during a drag operation. **Param** The event. | `GridHTMLElement.ondrag` | node\_modules/typescript/lib/lib.dom.d.ts:5903 |
| <a id="ondragend"></a> `ondragend` | `public` | `null` \| (`this`, `ev`) => `any` | Fires on the source object when the user releases the mouse at the close of a drag operation. **Param** The event. | `GridHTMLElement.ondragend` | node\_modules/typescript/lib/lib.dom.d.ts:5908 |
| <a id="ondragenter"></a> `ondragenter` | `public` | `null` \| (`this`, `ev`) => `any` | Fires on the target element when the user drags the object to a valid drop target. **Param** The drag event. | `GridHTMLElement.ondragenter` | node\_modules/typescript/lib/lib.dom.d.ts:5913 |
| <a id="ondragleave"></a> `ondragleave` | `public` | `null` \| (`this`, `ev`) => `any` | Fires on the target object when the user moves the mouse out of a valid drop target during a drag operation. **Param** The drag event. | `GridHTMLElement.ondragleave` | node\_modules/typescript/lib/lib.dom.d.ts:5918 |
| <a id="ondragover"></a> `ondragover` | `public` | `null` \| (`this`, `ev`) => `any` | Fires on the target element continuously while the user drags the object over a valid drop target. **Param** The event. | `GridHTMLElement.ondragover` | node\_modules/typescript/lib/lib.dom.d.ts:5923 |
| <a id="ondragstart"></a> `ondragstart` | `public` | `null` \| (`this`, `ev`) => `any` | Fires on the source object when the user starts to drag a text selection or selected object. **Param** The event. | `GridHTMLElement.ondragstart` | node\_modules/typescript/lib/lib.dom.d.ts:5928 |
| <a id="ondrop"></a> `ondrop` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.ondrop` | node\_modules/typescript/lib/lib.dom.d.ts:5929 |
| <a id="ondurationchange"></a> `ondurationchange` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the duration attribute is updated. **Param** The event. | `GridHTMLElement.ondurationchange` | node\_modules/typescript/lib/lib.dom.d.ts:5934 |
| <a id="onemptied"></a> `onemptied` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the media element is reset to its initial state. **Param** The event. | `GridHTMLElement.onemptied` | node\_modules/typescript/lib/lib.dom.d.ts:5939 |
| <a id="onended"></a> `onended` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the end of playback is reached. **Param** The event | `GridHTMLElement.onended` | node\_modules/typescript/lib/lib.dom.d.ts:5944 |
| <a id="onerror"></a> `onerror` | `public` | `OnErrorEventHandler` | Fires when an error occurs during object loading. **Param** The event. | `GridHTMLElement.onerror` | node\_modules/typescript/lib/lib.dom.d.ts:5949 |
| <a id="onfocus"></a> `onfocus` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the object receives focus. **Param** The event. | `GridHTMLElement.onfocus` | node\_modules/typescript/lib/lib.dom.d.ts:5954 |
| <a id="onformdata"></a> `onformdata` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onformdata` | node\_modules/typescript/lib/lib.dom.d.ts:5955 |
| <a id="ongotpointercapture"></a> `ongotpointercapture` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.ongotpointercapture` | node\_modules/typescript/lib/lib.dom.d.ts:5956 |
| <a id="oninput"></a> `oninput` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.oninput` | node\_modules/typescript/lib/lib.dom.d.ts:5957 |
| <a id="oninvalid"></a> `oninvalid` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.oninvalid` | node\_modules/typescript/lib/lib.dom.d.ts:5958 |
| <a id="onkeydown"></a> `onkeydown` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user presses a key. **Param** The keyboard event | `GridHTMLElement.onkeydown` | node\_modules/typescript/lib/lib.dom.d.ts:5963 |
| <a id="onkeypress"></a> ~~`onkeypress`~~ | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user presses an alphanumeric key. **Param** The event. **Deprecated** | `GridHTMLElement.onkeypress` | node\_modules/typescript/lib/lib.dom.d.ts:5969 |
| <a id="onkeyup"></a> `onkeyup` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user releases a key. **Param** The keyboard event | `GridHTMLElement.onkeyup` | node\_modules/typescript/lib/lib.dom.d.ts:5974 |
| <a id="onload"></a> `onload` | `public` | `null` \| (`this`, `ev`) => `any` | Fires immediately after the browser loads the object. **Param** The event. | `GridHTMLElement.onload` | node\_modules/typescript/lib/lib.dom.d.ts:5979 |
| <a id="onloadeddata"></a> `onloadeddata` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when media data is loaded at the current playback position. **Param** The event. | `GridHTMLElement.onloadeddata` | node\_modules/typescript/lib/lib.dom.d.ts:5984 |
| <a id="onloadedmetadata"></a> `onloadedmetadata` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the duration and dimensions of the media have been determined. **Param** The event. | `GridHTMLElement.onloadedmetadata` | node\_modules/typescript/lib/lib.dom.d.ts:5989 |
| <a id="onloadstart"></a> `onloadstart` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when Internet Explorer begins looking for media data. **Param** The event. | `GridHTMLElement.onloadstart` | node\_modules/typescript/lib/lib.dom.d.ts:5994 |
| <a id="onlostpointercapture"></a> `onlostpointercapture` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onlostpointercapture` | node\_modules/typescript/lib/lib.dom.d.ts:5995 |
| <a id="onmousedown"></a> `onmousedown` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user clicks the object with either mouse button. **Param** The mouse event. | `GridHTMLElement.onmousedown` | node\_modules/typescript/lib/lib.dom.d.ts:6000 |
| <a id="onmouseenter"></a> `onmouseenter` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onmouseenter` | node\_modules/typescript/lib/lib.dom.d.ts:6001 |
| <a id="onmouseleave"></a> `onmouseleave` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onmouseleave` | node\_modules/typescript/lib/lib.dom.d.ts:6002 |
| <a id="onmousemove"></a> `onmousemove` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user moves the mouse over the object. **Param** The mouse event. | `GridHTMLElement.onmousemove` | node\_modules/typescript/lib/lib.dom.d.ts:6007 |
| <a id="onmouseout"></a> `onmouseout` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user moves the mouse pointer outside the boundaries of the object. **Param** The mouse event. | `GridHTMLElement.onmouseout` | node\_modules/typescript/lib/lib.dom.d.ts:6012 |
| <a id="onmouseover"></a> `onmouseover` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user moves the mouse pointer into the object. **Param** The mouse event. | `GridHTMLElement.onmouseover` | node\_modules/typescript/lib/lib.dom.d.ts:6017 |
| <a id="onmouseup"></a> `onmouseup` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user releases a mouse button while the mouse is over the object. **Param** The mouse event. | `GridHTMLElement.onmouseup` | node\_modules/typescript/lib/lib.dom.d.ts:6022 |
| <a id="onpaste"></a> `onpaste` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onpaste` | node\_modules/typescript/lib/lib.dom.d.ts:6023 |
| <a id="onpause"></a> `onpause` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when playback is paused. **Param** The event. | `GridHTMLElement.onpause` | node\_modules/typescript/lib/lib.dom.d.ts:6028 |
| <a id="onplay"></a> `onplay` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the play method is requested. **Param** The event. | `GridHTMLElement.onplay` | node\_modules/typescript/lib/lib.dom.d.ts:6033 |
| <a id="onplaying"></a> `onplaying` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the audio or video has started playing. **Param** The event. | `GridHTMLElement.onplaying` | node\_modules/typescript/lib/lib.dom.d.ts:6038 |
| <a id="onpointercancel"></a> `onpointercancel` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onpointercancel` | node\_modules/typescript/lib/lib.dom.d.ts:6039 |
| <a id="onpointerdown"></a> `onpointerdown` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onpointerdown` | node\_modules/typescript/lib/lib.dom.d.ts:6040 |
| <a id="onpointerenter"></a> `onpointerenter` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onpointerenter` | node\_modules/typescript/lib/lib.dom.d.ts:6041 |
| <a id="onpointerleave"></a> `onpointerleave` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onpointerleave` | node\_modules/typescript/lib/lib.dom.d.ts:6042 |
| <a id="onpointermove"></a> `onpointermove` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onpointermove` | node\_modules/typescript/lib/lib.dom.d.ts:6043 |
| <a id="onpointerout"></a> `onpointerout` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onpointerout` | node\_modules/typescript/lib/lib.dom.d.ts:6044 |
| <a id="onpointerover"></a> `onpointerover` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onpointerover` | node\_modules/typescript/lib/lib.dom.d.ts:6045 |
| <a id="onpointerup"></a> `onpointerup` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onpointerup` | node\_modules/typescript/lib/lib.dom.d.ts:6046 |
| <a id="onprogress"></a> `onprogress` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs to indicate progress while downloading media data. **Param** The event. | `GridHTMLElement.onprogress` | node\_modules/typescript/lib/lib.dom.d.ts:6051 |
| <a id="onratechange"></a> `onratechange` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the playback rate is increased or decreased. **Param** The event. | `GridHTMLElement.onratechange` | node\_modules/typescript/lib/lib.dom.d.ts:6056 |
| <a id="onreset"></a> `onreset` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user resets a form. **Param** The event. | `GridHTMLElement.onreset` | node\_modules/typescript/lib/lib.dom.d.ts:6061 |
| <a id="onresize"></a> `onresize` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onresize` | node\_modules/typescript/lib/lib.dom.d.ts:6062 |
| <a id="onscroll"></a> `onscroll` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user repositions the scroll box in the scroll bar on the object. **Param** The event. | `GridHTMLElement.onscroll` | node\_modules/typescript/lib/lib.dom.d.ts:6067 |
| <a id="onsecuritypolicyviolation"></a> `onsecuritypolicyviolation` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onsecuritypolicyviolation` | node\_modules/typescript/lib/lib.dom.d.ts:6068 |
| <a id="onseeked"></a> `onseeked` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the seek operation ends. **Param** The event. | `GridHTMLElement.onseeked` | node\_modules/typescript/lib/lib.dom.d.ts:6073 |
| <a id="onseeking"></a> `onseeking` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the current playback position is moved. **Param** The event. | `GridHTMLElement.onseeking` | node\_modules/typescript/lib/lib.dom.d.ts:6078 |
| <a id="onselect"></a> `onselect` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the current selection changes. **Param** The event. | `GridHTMLElement.onselect` | node\_modules/typescript/lib/lib.dom.d.ts:6083 |
| <a id="onselectionchange"></a> `onselectionchange` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onselectionchange` | node\_modules/typescript/lib/lib.dom.d.ts:6084 |
| <a id="onselectstart"></a> `onselectstart` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onselectstart` | node\_modules/typescript/lib/lib.dom.d.ts:6085 |
| <a id="onslotchange"></a> `onslotchange` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onslotchange` | node\_modules/typescript/lib/lib.dom.d.ts:6086 |
| <a id="onstalled"></a> `onstalled` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the download has stopped. **Param** The event. | `GridHTMLElement.onstalled` | node\_modules/typescript/lib/lib.dom.d.ts:6091 |
| <a id="onsubmit"></a> `onsubmit` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onsubmit` | node\_modules/typescript/lib/lib.dom.d.ts:6092 |
| <a id="onsuspend"></a> `onsuspend` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs if the load operation has been intentionally halted. **Param** The event. | `GridHTMLElement.onsuspend` | node\_modules/typescript/lib/lib.dom.d.ts:6097 |
| <a id="ontimeupdate"></a> `ontimeupdate` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs to indicate the current playback position. **Param** The event. | `GridHTMLElement.ontimeupdate` | node\_modules/typescript/lib/lib.dom.d.ts:6102 |
| <a id="ontoggle"></a> `ontoggle` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.ontoggle` | node\_modules/typescript/lib/lib.dom.d.ts:6103 |
| <a id="ontouchcancel"></a> `ontouchcancel?` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.ontouchcancel` | node\_modules/typescript/lib/lib.dom.d.ts:6104 |
| <a id="ontouchend"></a> `ontouchend?` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.ontouchend` | node\_modules/typescript/lib/lib.dom.d.ts:6105 |
| <a id="ontouchmove"></a> `ontouchmove?` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.ontouchmove` | node\_modules/typescript/lib/lib.dom.d.ts:6106 |
| <a id="ontouchstart"></a> `ontouchstart?` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.ontouchstart` | node\_modules/typescript/lib/lib.dom.d.ts:6107 |
| <a id="ontransitioncancel"></a> `ontransitioncancel` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.ontransitioncancel` | node\_modules/typescript/lib/lib.dom.d.ts:6108 |
| <a id="ontransitionend"></a> `ontransitionend` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.ontransitionend` | node\_modules/typescript/lib/lib.dom.d.ts:6109 |
| <a id="ontransitionrun"></a> `ontransitionrun` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.ontransitionrun` | node\_modules/typescript/lib/lib.dom.d.ts:6110 |
| <a id="ontransitionstart"></a> `ontransitionstart` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.ontransitionstart` | node\_modules/typescript/lib/lib.dom.d.ts:6111 |
| <a id="onvolumechange"></a> `onvolumechange` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the volume is changed, or playback is muted or unmuted. **Param** The event. | `GridHTMLElement.onvolumechange` | node\_modules/typescript/lib/lib.dom.d.ts:6116 |
| <a id="onwaiting"></a> `onwaiting` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when playback stops because the next frame of a video resource is not available. **Param** The event. | `GridHTMLElement.onwaiting` | node\_modules/typescript/lib/lib.dom.d.ts:6121 |
| <a id="onwebkitanimationend"></a> ~~`onwebkitanimationend`~~ | `public` | `null` \| (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `onanimationend`. | `GridHTMLElement.onwebkitanimationend` | node\_modules/typescript/lib/lib.dom.d.ts:6123 |
| <a id="onwebkitanimationiteration"></a> ~~`onwebkitanimationiteration`~~ | `public` | `null` \| (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `onanimationiteration`. | `GridHTMLElement.onwebkitanimationiteration` | node\_modules/typescript/lib/lib.dom.d.ts:6125 |
| <a id="onwebkitanimationstart"></a> ~~`onwebkitanimationstart`~~ | `public` | `null` \| (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `onanimationstart`. | `GridHTMLElement.onwebkitanimationstart` | node\_modules/typescript/lib/lib.dom.d.ts:6127 |
| <a id="onwebkittransitionend"></a> ~~`onwebkittransitionend`~~ | `public` | `null` \| (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `ontransitionend`. | `GridHTMLElement.onwebkittransitionend` | node\_modules/typescript/lib/lib.dom.d.ts:6129 |
| <a id="onwheel"></a> `onwheel` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridHTMLElement.onwheel` | node\_modules/typescript/lib/lib.dom.d.ts:6130 |
| <a id="accesskey"></a> `accessKey` | `public` | `string` | - | `GridHTMLElement.accessKey` | node\_modules/typescript/lib/lib.dom.d.ts:6555 |
| <a id="accesskeylabel"></a> `accessKeyLabel` | `readonly` | `string` | - | `GridHTMLElement.accessKeyLabel` | node\_modules/typescript/lib/lib.dom.d.ts:6556 |
| <a id="autocapitalize"></a> `autocapitalize` | `public` | `string` | - | `GridHTMLElement.autocapitalize` | node\_modules/typescript/lib/lib.dom.d.ts:6557 |
| <a id="dir"></a> `dir` | `public` | `string` | - | `GridHTMLElement.dir` | node\_modules/typescript/lib/lib.dom.d.ts:6558 |
| <a id="draggable"></a> `draggable` | `public` | `boolean` | - | `GridHTMLElement.draggable` | node\_modules/typescript/lib/lib.dom.d.ts:6559 |
| <a id="hidden"></a> `hidden` | `public` | `boolean` | - | `GridHTMLElement.hidden` | node\_modules/typescript/lib/lib.dom.d.ts:6560 |
| <a id="inert"></a> `inert` | `public` | `boolean` | - | `GridHTMLElement.inert` | node\_modules/typescript/lib/lib.dom.d.ts:6561 |
| <a id="innertext"></a> `innerText` | `public` | `string` | - | `GridHTMLElement.innerText` | node\_modules/typescript/lib/lib.dom.d.ts:6562 |
| <a id="lang"></a> `lang` | `public` | `string` | - | `GridHTMLElement.lang` | node\_modules/typescript/lib/lib.dom.d.ts:6563 |
| <a id="offsetheight"></a> `offsetHeight` | `readonly` | `number` | - | `GridHTMLElement.offsetHeight` | node\_modules/typescript/lib/lib.dom.d.ts:6564 |
| <a id="offsetleft"></a> `offsetLeft` | `readonly` | `number` | - | `GridHTMLElement.offsetLeft` | node\_modules/typescript/lib/lib.dom.d.ts:6565 |
| <a id="offsetparent"></a> `offsetParent` | `readonly` | `null` \| `Element` | - | `GridHTMLElement.offsetParent` | node\_modules/typescript/lib/lib.dom.d.ts:6566 |
| <a id="offsettop"></a> `offsetTop` | `readonly` | `number` | - | `GridHTMLElement.offsetTop` | node\_modules/typescript/lib/lib.dom.d.ts:6567 |
| <a id="offsetwidth"></a> `offsetWidth` | `readonly` | `number` | - | `GridHTMLElement.offsetWidth` | node\_modules/typescript/lib/lib.dom.d.ts:6568 |
| <a id="outertext"></a> `outerText` | `public` | `string` | - | `GridHTMLElement.outerText` | node\_modules/typescript/lib/lib.dom.d.ts:6569 |
| <a id="spellcheck"></a> `spellcheck` | `public` | `boolean` | - | `GridHTMLElement.spellcheck` | node\_modules/typescript/lib/lib.dom.d.ts:6570 |
| <a id="title"></a> `title` | `public` | `string` | - | `GridHTMLElement.title` | node\_modules/typescript/lib/lib.dom.d.ts:6571 |
| <a id="translate"></a> `translate` | `public` | `boolean` | - | `GridHTMLElement.translate` | node\_modules/typescript/lib/lib.dom.d.ts:6572 |
| <a id="autofocus"></a> `autofocus` | `public` | `boolean` | - | `GridHTMLElement.autofocus` | node\_modules/typescript/lib/lib.dom.d.ts:7764 |
| <a id="dataset"></a> `dataset` | `readonly` | `DOMStringMap` | - | `GridHTMLElement.dataset` | node\_modules/typescript/lib/lib.dom.d.ts:7765 |
| <a id="nonce"></a> `nonce?` | `public` | `string` | - | `GridHTMLElement.nonce` | node\_modules/typescript/lib/lib.dom.d.ts:7766 |
| <a id="tabindex"></a> `tabIndex` | `public` | `number` | - | `GridHTMLElement.tabIndex` | node\_modules/typescript/lib/lib.dom.d.ts:7767 |
| <a id="innerhtml"></a> `innerHTML` | `public` | `string` | - | `GridHTMLElement.innerHTML` | node\_modules/typescript/lib/lib.dom.d.ts:9130 |
| <a id="baseuri"></a> `baseURI` | `readonly` | `string` | Returns node's node document's document base URL. | `GridHTMLElement.baseURI` | node\_modules/typescript/lib/lib.dom.d.ts:10249 |
| <a id="childnodes"></a> `childNodes` | `readonly` | `NodeListOf`\<`ChildNode`\> | Returns the children. | `GridHTMLElement.childNodes` | node\_modules/typescript/lib/lib.dom.d.ts:10251 |
| <a id="firstchild"></a> `firstChild` | `readonly` | `null` \| `ChildNode` | Returns the first child. | `GridHTMLElement.firstChild` | node\_modules/typescript/lib/lib.dom.d.ts:10253 |
| <a id="isconnected"></a> `isConnected` | `readonly` | `boolean` | Returns true if node is connected and false otherwise. | `GridHTMLElement.isConnected` | node\_modules/typescript/lib/lib.dom.d.ts:10255 |
| <a id="lastchild"></a> `lastChild` | `readonly` | `null` \| `ChildNode` | Returns the last child. | `GridHTMLElement.lastChild` | node\_modules/typescript/lib/lib.dom.d.ts:10257 |
| <a id="nextsibling"></a> `nextSibling` | `readonly` | `null` \| `ChildNode` | Returns the next sibling. | `GridHTMLElement.nextSibling` | node\_modules/typescript/lib/lib.dom.d.ts:10259 |
| <a id="nodename"></a> `nodeName` | `readonly` | `string` | Returns a string appropriate for the type of node. | `GridHTMLElement.nodeName` | node\_modules/typescript/lib/lib.dom.d.ts:10261 |
| <a id="nodetype"></a> `nodeType` | `readonly` | `number` | Returns the type of node. | `GridHTMLElement.nodeType` | node\_modules/typescript/lib/lib.dom.d.ts:10263 |
| <a id="nodevalue"></a> `nodeValue` | `public` | `null` \| `string` | - | `GridHTMLElement.nodeValue` | node\_modules/typescript/lib/lib.dom.d.ts:10264 |
| <a id="parentelement"></a> `parentElement` | `readonly` | `null` \| `HTMLElement` | Returns the parent element. | `GridHTMLElement.parentElement` | node\_modules/typescript/lib/lib.dom.d.ts:10268 |
| <a id="parentnode"></a> `parentNode` | `readonly` | `null` \| `ParentNode` | Returns the parent. | `GridHTMLElement.parentNode` | node\_modules/typescript/lib/lib.dom.d.ts:10270 |
| <a id="previoussibling"></a> `previousSibling` | `readonly` | `null` \| `ChildNode` | Returns the previous sibling. | `GridHTMLElement.previousSibling` | node\_modules/typescript/lib/lib.dom.d.ts:10272 |
| <a id="textcontent"></a> `textContent` | `public` | `null` \| `string` | - | `GridHTMLElement.textContent` | node\_modules/typescript/lib/lib.dom.d.ts:10273 |
| <a id="element_node"></a> `ELEMENT_NODE` | `readonly` | `1` | node is an element. | `GridHTMLElement.ELEMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10297 |
| <a id="attribute_node"></a> `ATTRIBUTE_NODE` | `readonly` | `2` | - | `GridHTMLElement.ATTRIBUTE_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10298 |
| <a id="text_node"></a> `TEXT_NODE` | `readonly` | `3` | node is a Text node. | `GridHTMLElement.TEXT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10300 |
| <a id="cdata_section_node"></a> `CDATA_SECTION_NODE` | `readonly` | `4` | node is a CDATASection node. | `GridHTMLElement.CDATA_SECTION_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10302 |
| <a id="entity_reference_node"></a> `ENTITY_REFERENCE_NODE` | `readonly` | `5` | - | `GridHTMLElement.ENTITY_REFERENCE_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10303 |
| <a id="entity_node"></a> `ENTITY_NODE` | `readonly` | `6` | - | `GridHTMLElement.ENTITY_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10304 |
| <a id="processing_instruction_node"></a> `PROCESSING_INSTRUCTION_NODE` | `readonly` | `7` | node is a ProcessingInstruction node. | `GridHTMLElement.PROCESSING_INSTRUCTION_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10306 |
| <a id="comment_node"></a> `COMMENT_NODE` | `readonly` | `8` | node is a Comment node. | `GridHTMLElement.COMMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10308 |
| <a id="document_node"></a> `DOCUMENT_NODE` | `readonly` | `9` | node is a document. | `GridHTMLElement.DOCUMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10310 |
| <a id="document_type_node"></a> `DOCUMENT_TYPE_NODE` | `readonly` | `10` | node is a doctype. | `GridHTMLElement.DOCUMENT_TYPE_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10312 |
| <a id="document_fragment_node"></a> `DOCUMENT_FRAGMENT_NODE` | `readonly` | `11` | node is a DocumentFragment node. | `GridHTMLElement.DOCUMENT_FRAGMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10314 |
| <a id="notation_node"></a> `NOTATION_NODE` | `readonly` | `12` | - | `GridHTMLElement.NOTATION_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10315 |
| <a id="document_position_disconnected"></a> `DOCUMENT_POSITION_DISCONNECTED` | `readonly` | `1` | Set when node and other are not in the same tree. | `GridHTMLElement.DOCUMENT_POSITION_DISCONNECTED` | node\_modules/typescript/lib/lib.dom.d.ts:10317 |
| <a id="document_position_preceding"></a> `DOCUMENT_POSITION_PRECEDING` | `readonly` | `2` | Set when other is preceding node. | `GridHTMLElement.DOCUMENT_POSITION_PRECEDING` | node\_modules/typescript/lib/lib.dom.d.ts:10319 |
| <a id="document_position_following"></a> `DOCUMENT_POSITION_FOLLOWING` | `readonly` | `4` | Set when other is following node. | `GridHTMLElement.DOCUMENT_POSITION_FOLLOWING` | node\_modules/typescript/lib/lib.dom.d.ts:10321 |
| <a id="document_position_contains"></a> `DOCUMENT_POSITION_CONTAINS` | `readonly` | `8` | Set when other is an ancestor of node. | `GridHTMLElement.DOCUMENT_POSITION_CONTAINS` | node\_modules/typescript/lib/lib.dom.d.ts:10323 |
| <a id="document_position_contained_by"></a> `DOCUMENT_POSITION_CONTAINED_BY` | `readonly` | `16` | Set when other is a descendant of node. | `GridHTMLElement.DOCUMENT_POSITION_CONTAINED_BY` | node\_modules/typescript/lib/lib.dom.d.ts:10325 |
| <a id="document_position_implementation_specific"></a> `DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` | `readonly` | `32` | - | `GridHTMLElement.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` | node\_modules/typescript/lib/lib.dom.d.ts:10326 |
| <a id="nextelementsibling"></a> `nextElementSibling` | `readonly` | `null` \| `Element` | Returns the first following sibling that is an element, and null otherwise. | `GridHTMLElement.nextElementSibling` | node\_modules/typescript/lib/lib.dom.d.ts:10416 |
| <a id="previouselementsibling"></a> `previousElementSibling` | `readonly` | `null` \| `Element` | Returns the first preceding sibling that is an element, and null otherwise. | `GridHTMLElement.previousElementSibling` | node\_modules/typescript/lib/lib.dom.d.ts:10418 |
| <a id="childelementcount"></a> `childElementCount` | `readonly` | `number` | - | `GridHTMLElement.childElementCount` | node\_modules/typescript/lib/lib.dom.d.ts:10685 |
| <a id="children"></a> `children` | `readonly` | `HTMLCollection` | Returns the child elements. | `GridHTMLElement.children` | node\_modules/typescript/lib/lib.dom.d.ts:10687 |
| <a id="firstelementchild"></a> `firstElementChild` | `readonly` | `null` \| `Element` | Returns the first child that is an element, and null otherwise. | `GridHTMLElement.firstElementChild` | node\_modules/typescript/lib/lib.dom.d.ts:10689 |
| <a id="lastelementchild"></a> `lastElementChild` | `readonly` | `null` \| `Element` | Returns the last child that is an element, and null otherwise. | `GridHTMLElement.lastElementChild` | node\_modules/typescript/lib/lib.dom.d.ts:10691 |
| <a id="assignedslot"></a> `assignedSlot` | `readonly` | `null` \| `HTMLSlotElement` | - | `GridHTMLElement.assignedSlot` | node\_modules/typescript/lib/lib.dom.d.ts:13933 |

## Functions

### gsCreateNgComponents()

```ts
function gsCreateNgComponents(
   host, 
   n, 
   add, 
   isGrid): undefined | HTMLElement;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:353](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L353)

can be used when a new item needs to be created, which we do as a Angular component, or deleted (skip)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `host` | `HTMLElement` \| [`GridCompHTMLElement`](#gridcomphtmlelement) |
| `n` | [`NgGridStackNode`](types.md#nggridstacknode) |
| `add` | `boolean` |
| `isGrid` | `boolean` |

#### Returns

`undefined` \| `HTMLElement`

***

### gsSaveAdditionalNgInfo()

```ts
function gsSaveAdditionalNgInfo(n, w): void;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:437](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L437)

called for each item in the grid - check if additional information needs to be saved.
Note: since this is options minus gridstack protected members using Utils.removeInternalForSave(),
this typically doesn't need to do anything. However your custom Component @Input() are now supported
using BaseWidget.serialize()

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | [`NgGridStackNode`](types.md#nggridstacknode) |
| `w` | [`NgGridStackWidget`](types.md#nggridstackwidget) |

#### Returns

`void`

***

### gsUpdateNgComponents()

```ts
function gsUpdateNgComponents(n): void;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:456](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L456)

track when widgeta re updated (rather than created) to make sure we de-serialize them as well

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | [`NgGridStackNode`](types.md#nggridstacknode) |

#### Returns

`void`

## Type Aliases

### eventCB

```ts
type eventCB = object;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:24](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L24)

Callback for general events (enable, disable, etc.)

#### Properties

##### event

```ts
event: Event;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:24](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L24)

***

### elementCB

```ts
type elementCB = object;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:27](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L27)

Callback for element-specific events (resize, drag, etc.)

#### Properties

##### event

```ts
event: Event;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:27](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L27)

##### el

```ts
el: GridItemHTMLElement;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:27](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L27)

***

### nodesCB

```ts
type nodesCB = object;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:30](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L30)

Callback for events affecting multiple nodes (change, etc.)

#### Properties

##### event

```ts
event: Event;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:30](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L30)

##### nodes

```ts
nodes: GridStackNode[];
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:30](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L30)

***

### droppedCB

```ts
type droppedCB = object;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:33](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L33)

Callback for drop events with before/after node state

#### Properties

##### event

```ts
event: Event;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:33](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L33)

##### previousNode

```ts
previousNode: GridStackNode;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:33](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L33)

##### newNode

```ts
newNode: GridStackNode;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:33](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L33)

***

### SelectorToType

```ts
type SelectorToType = object;
```

Defined in: [angular/projects/lib/src/lib/gridstack.component.ts:48](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.component.ts#L48)

Mapping of selector strings to Angular component types.
Used for dynamic component creation based on widget selectors.

#### Index Signature

```ts
[key: string]: Type<Object>
```
