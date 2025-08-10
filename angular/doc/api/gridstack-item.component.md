# gridstack-item.component

## Classes

### GridstackItemComponent

Defined in: [angular/projects/lib/src/lib/gridstack-item.component.ts:56](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack-item.component.ts#L56)

Angular component wrapper for individual GridStack items.

This component represents a single grid item and handles:
- Dynamic content creation and management
- Integration with parent GridStack component
- Component lifecycle and cleanup
- Widget options and configuration

Use in combination with GridstackComponent for the parent grid.

#### Example

```html
<gridstack>
  <gridstack-item [options]="{x: 0, y: 0, w: 2, h: 1}">
    <my-widget-component></my-widget-component>
  </gridstack-item>
</gridstack>
```

#### Implements

- `OnDestroy`

#### Accessors

##### options

###### Get Signature

```ts
get options(): GridStackNode;
```

Defined in: [angular/projects/lib/src/lib/gridstack-item.component.ts:100](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack-item.component.ts#L100)

return the latest grid options (from GS once built, otherwise initial values)

###### Returns

`GridStackNode`

###### Set Signature

```ts
set options(val): void;
```

Defined in: [angular/projects/lib/src/lib/gridstack-item.component.ts:89](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack-item.component.ts#L89)

Grid item configuration options.
Defines position, size, and behavior of this grid item.

###### Example

```typescript
itemOptions: GridStackNode = {
  x: 0, y: 0, w: 2, h: 1,
  noResize: true,
  content: 'Item content'
};
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `GridStackNode` |

###### Returns

`void`

##### el

###### Get Signature

```ts
get el(): GridItemCompHTMLElement;
```

Defined in: [angular/projects/lib/src/lib/gridstack-item.component.ts:107](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack-item.component.ts#L107)

return the native element that contains grid specific fields as well

###### Returns

[`GridItemCompHTMLElement`](#griditemcomphtmlelement)

#### Constructors

##### Constructor

```ts
new GridstackItemComponent(elementRef): GridstackItemComponent;
```

Defined in: [angular/projects/lib/src/lib/gridstack-item.component.ts:114](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack-item.component.ts#L114)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `elementRef` | `ElementRef`\<[`GridItemCompHTMLElement`](#griditemcomphtmlelement)\> |

###### Returns

[`GridstackItemComponent`](#gridstackitemcomponent)

#### Methods

##### clearOptions()

```ts
clearOptions(): void;
```

Defined in: [angular/projects/lib/src/lib/gridstack-item.component.ts:110](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack-item.component.ts#L110)

clears the initial options now that we've built

###### Returns

`void`

##### ngOnDestroy()

```ts
ngOnDestroy(): void;
```

Defined in: [angular/projects/lib/src/lib/gridstack-item.component.ts:118](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack-item.component.ts#L118)

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

###### Returns

`void`

###### Implementation of

```ts
OnDestroy.ngOnDestroy
```

#### Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="container"></a> `container?` | `public` | `ViewContainerRef` | Container for dynamic component creation within this grid item. Used to append child components programmatically. | [angular/projects/lib/src/lib/gridstack-item.component.ts:62](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack-item.component.ts#L62) |
| <a id="ref"></a> `ref` | `public` | \| `undefined` \| `ComponentRef`\<[`GridstackItemComponent`](#gridstackitemcomponent)\> | Component reference for dynamic component removal. Used internally when this component is created dynamically. | [angular/projects/lib/src/lib/gridstack-item.component.ts:68](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack-item.component.ts#L68) |
| <a id="childwidget"></a> `childWidget` | `public` | `undefined` \| [`BaseWidget`](base-widget.md#basewidget) | Reference to child widget component for serialization. Used to save/restore additional data along with grid position. | [angular/projects/lib/src/lib/gridstack-item.component.ts:74](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack-item.component.ts#L74) |
| <a id="_options"></a> `_options?` | `protected` | `GridStackNode` | - | [angular/projects/lib/src/lib/gridstack-item.component.ts:104](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack-item.component.ts#L104) |
| <a id="elementref"></a> `elementRef` | `readonly` | `ElementRef`\<[`GridItemCompHTMLElement`](#griditemcomphtmlelement)\> | - | [angular/projects/lib/src/lib/gridstack-item.component.ts:114](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack-item.component.ts#L114) |

## Interfaces

### GridItemCompHTMLElement

Defined in: [angular/projects/lib/src/lib/gridstack-item.component.ts:14](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack-item.component.ts#L14)

Extended HTMLElement interface for grid items.
Stores a back-reference to the Angular component for integration.

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
| `keyframes` | `null` \| `Keyframe`[] \| `PropertyIndexedKeyframes` |
| `options?` | `number` \| `KeyframeAnimationOptions` |

###### Returns

`Animation`

###### Inherited from

```ts
GridItemHTMLElement.animate
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
GridItemHTMLElement.getAnimations
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
GridItemHTMLElement.after
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
GridItemHTMLElement.before
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
GridItemHTMLElement.remove
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
GridItemHTMLElement.replaceWith
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
GridItemHTMLElement.attachShadow
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
GridItemHTMLElement.checkVisibility
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
GridItemHTMLElement.closest
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
GridItemHTMLElement.closest
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
GridItemHTMLElement.closest
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
GridItemHTMLElement.closest
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
GridItemHTMLElement.getAttribute
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
GridItemHTMLElement.getAttributeNS
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
GridItemHTMLElement.getAttributeNames
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
GridItemHTMLElement.getAttributeNode
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
GridItemHTMLElement.getAttributeNodeNS
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
GridItemHTMLElement.getBoundingClientRect
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
GridItemHTMLElement.getClientRects
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
GridItemHTMLElement.getElementsByClassName
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
GridItemHTMLElement.getElementsByTagName
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
GridItemHTMLElement.getElementsByTagName
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
GridItemHTMLElement.getElementsByTagName
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
GridItemHTMLElement.getElementsByTagName
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
GridItemHTMLElement.getElementsByTagName
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
GridItemHTMLElement.getElementsByTagNameNS
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
GridItemHTMLElement.getElementsByTagNameNS
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
GridItemHTMLElement.getElementsByTagNameNS
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
GridItemHTMLElement.getElementsByTagNameNS
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
GridItemHTMLElement.hasAttribute
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
GridItemHTMLElement.hasAttributeNS
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
GridItemHTMLElement.hasAttributes
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
GridItemHTMLElement.hasPointerCapture
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
GridItemHTMLElement.insertAdjacentElement
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
GridItemHTMLElement.insertAdjacentHTML
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
GridItemHTMLElement.insertAdjacentText
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
GridItemHTMLElement.matches
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
GridItemHTMLElement.releasePointerCapture
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
GridItemHTMLElement.removeAttribute
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
GridItemHTMLElement.removeAttributeNS
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
GridItemHTMLElement.removeAttributeNode
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
GridItemHTMLElement.requestFullscreen
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
GridItemHTMLElement.requestPointerLock
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
GridItemHTMLElement.scroll
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
GridItemHTMLElement.scroll
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
GridItemHTMLElement.scrollBy
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
GridItemHTMLElement.scrollBy
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
GridItemHTMLElement.scrollIntoView
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
GridItemHTMLElement.scrollTo
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
GridItemHTMLElement.scrollTo
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
GridItemHTMLElement.setAttribute
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
GridItemHTMLElement.setAttributeNS
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
GridItemHTMLElement.setAttributeNode
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
GridItemHTMLElement.setAttributeNodeNS
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
GridItemHTMLElement.setPointerCapture
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
GridItemHTMLElement.toggleAttribute
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
GridItemHTMLElement.webkitMatchesSelector
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
GridItemHTMLElement.dispatchEvent
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
GridItemHTMLElement.attachInternals
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
GridItemHTMLElement.click
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
GridItemHTMLElement.addEventListener
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
GridItemHTMLElement.addEventListener
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
GridItemHTMLElement.removeEventListener
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
GridItemHTMLElement.removeEventListener
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
GridItemHTMLElement.blur
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
GridItemHTMLElement.focus
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
GridItemHTMLElement.appendChild
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
GridItemHTMLElement.cloneNode
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
GridItemHTMLElement.compareDocumentPosition
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
GridItemHTMLElement.contains
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
GridItemHTMLElement.getRootNode
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
GridItemHTMLElement.hasChildNodes
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
GridItemHTMLElement.insertBefore
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
GridItemHTMLElement.isDefaultNamespace
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
GridItemHTMLElement.isEqualNode
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
GridItemHTMLElement.isSameNode
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
GridItemHTMLElement.lookupNamespaceURI
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
GridItemHTMLElement.lookupPrefix
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
GridItemHTMLElement.normalize
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
GridItemHTMLElement.removeChild
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
GridItemHTMLElement.replaceChild
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
GridItemHTMLElement.append
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
GridItemHTMLElement.prepend
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
GridItemHTMLElement.querySelector
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
GridItemHTMLElement.querySelector
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
GridItemHTMLElement.querySelector
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
GridItemHTMLElement.querySelector
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
GridItemHTMLElement.querySelector
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
GridItemHTMLElement.querySelectorAll
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
GridItemHTMLElement.querySelectorAll
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
GridItemHTMLElement.querySelectorAll
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
GridItemHTMLElement.querySelectorAll
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
GridItemHTMLElement.querySelectorAll
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
GridItemHTMLElement.replaceChildren
```

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_griditemcomp"></a> `_gridItemComp?` | `public` | [`GridstackItemComponent`](#gridstackitemcomponent) | Back-reference to the Angular GridStackItem component | - | [angular/projects/lib/src/lib/gridstack-item.component.ts:16](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack-item.component.ts#L16) |
| <a id="ariaatomic"></a> `ariaAtomic` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaAtomic` | node\_modules/typescript/lib/lib.dom.d.ts:2020 |
| <a id="ariaautocomplete"></a> `ariaAutoComplete` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaAutoComplete` | node\_modules/typescript/lib/lib.dom.d.ts:2021 |
| <a id="ariabusy"></a> `ariaBusy` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaBusy` | node\_modules/typescript/lib/lib.dom.d.ts:2022 |
| <a id="ariachecked"></a> `ariaChecked` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaChecked` | node\_modules/typescript/lib/lib.dom.d.ts:2023 |
| <a id="ariacolcount"></a> `ariaColCount` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaColCount` | node\_modules/typescript/lib/lib.dom.d.ts:2024 |
| <a id="ariacolindex"></a> `ariaColIndex` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaColIndex` | node\_modules/typescript/lib/lib.dom.d.ts:2025 |
| <a id="ariacolspan"></a> `ariaColSpan` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaColSpan` | node\_modules/typescript/lib/lib.dom.d.ts:2026 |
| <a id="ariacurrent"></a> `ariaCurrent` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaCurrent` | node\_modules/typescript/lib/lib.dom.d.ts:2027 |
| <a id="ariadisabled"></a> `ariaDisabled` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaDisabled` | node\_modules/typescript/lib/lib.dom.d.ts:2028 |
| <a id="ariaexpanded"></a> `ariaExpanded` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaExpanded` | node\_modules/typescript/lib/lib.dom.d.ts:2029 |
| <a id="ariahaspopup"></a> `ariaHasPopup` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaHasPopup` | node\_modules/typescript/lib/lib.dom.d.ts:2030 |
| <a id="ariahidden"></a> `ariaHidden` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaHidden` | node\_modules/typescript/lib/lib.dom.d.ts:2031 |
| <a id="ariainvalid"></a> `ariaInvalid` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaInvalid` | node\_modules/typescript/lib/lib.dom.d.ts:2032 |
| <a id="ariakeyshortcuts"></a> `ariaKeyShortcuts` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaKeyShortcuts` | node\_modules/typescript/lib/lib.dom.d.ts:2033 |
| <a id="arialabel"></a> `ariaLabel` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaLabel` | node\_modules/typescript/lib/lib.dom.d.ts:2034 |
| <a id="arialevel"></a> `ariaLevel` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaLevel` | node\_modules/typescript/lib/lib.dom.d.ts:2035 |
| <a id="arialive"></a> `ariaLive` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaLive` | node\_modules/typescript/lib/lib.dom.d.ts:2036 |
| <a id="ariamodal"></a> `ariaModal` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaModal` | node\_modules/typescript/lib/lib.dom.d.ts:2037 |
| <a id="ariamultiline"></a> `ariaMultiLine` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaMultiLine` | node\_modules/typescript/lib/lib.dom.d.ts:2038 |
| <a id="ariamultiselectable"></a> `ariaMultiSelectable` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaMultiSelectable` | node\_modules/typescript/lib/lib.dom.d.ts:2039 |
| <a id="ariaorientation"></a> `ariaOrientation` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaOrientation` | node\_modules/typescript/lib/lib.dom.d.ts:2040 |
| <a id="ariaplaceholder"></a> `ariaPlaceholder` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaPlaceholder` | node\_modules/typescript/lib/lib.dom.d.ts:2041 |
| <a id="ariaposinset"></a> `ariaPosInSet` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaPosInSet` | node\_modules/typescript/lib/lib.dom.d.ts:2042 |
| <a id="ariapressed"></a> `ariaPressed` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaPressed` | node\_modules/typescript/lib/lib.dom.d.ts:2043 |
| <a id="ariareadonly"></a> `ariaReadOnly` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaReadOnly` | node\_modules/typescript/lib/lib.dom.d.ts:2044 |
| <a id="ariarequired"></a> `ariaRequired` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaRequired` | node\_modules/typescript/lib/lib.dom.d.ts:2045 |
| <a id="ariaroledescription"></a> `ariaRoleDescription` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaRoleDescription` | node\_modules/typescript/lib/lib.dom.d.ts:2046 |
| <a id="ariarowcount"></a> `ariaRowCount` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaRowCount` | node\_modules/typescript/lib/lib.dom.d.ts:2047 |
| <a id="ariarowindex"></a> `ariaRowIndex` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaRowIndex` | node\_modules/typescript/lib/lib.dom.d.ts:2048 |
| <a id="ariarowspan"></a> `ariaRowSpan` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaRowSpan` | node\_modules/typescript/lib/lib.dom.d.ts:2049 |
| <a id="ariaselected"></a> `ariaSelected` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaSelected` | node\_modules/typescript/lib/lib.dom.d.ts:2050 |
| <a id="ariasetsize"></a> `ariaSetSize` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaSetSize` | node\_modules/typescript/lib/lib.dom.d.ts:2051 |
| <a id="ariasort"></a> `ariaSort` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaSort` | node\_modules/typescript/lib/lib.dom.d.ts:2052 |
| <a id="ariavaluemax"></a> `ariaValueMax` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaValueMax` | node\_modules/typescript/lib/lib.dom.d.ts:2053 |
| <a id="ariavaluemin"></a> `ariaValueMin` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaValueMin` | node\_modules/typescript/lib/lib.dom.d.ts:2054 |
| <a id="ariavaluenow"></a> `ariaValueNow` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaValueNow` | node\_modules/typescript/lib/lib.dom.d.ts:2055 |
| <a id="ariavaluetext"></a> `ariaValueText` | `public` | `null` \| `string` | - | `GridItemHTMLElement.ariaValueText` | node\_modules/typescript/lib/lib.dom.d.ts:2056 |
| <a id="role"></a> `role` | `public` | `null` \| `string` | - | `GridItemHTMLElement.role` | node\_modules/typescript/lib/lib.dom.d.ts:2057 |
| <a id="attributes"></a> `attributes` | `readonly` | `NamedNodeMap` | - | `GridItemHTMLElement.attributes` | node\_modules/typescript/lib/lib.dom.d.ts:5041 |
| <a id="classlist"></a> `classList` | `readonly` | `DOMTokenList` | Allows for manipulation of element's class content attribute as a set of whitespace-separated tokens through a DOMTokenList object. | `GridItemHTMLElement.classList` | node\_modules/typescript/lib/lib.dom.d.ts:5043 |
| <a id="classname"></a> `className` | `public` | `string` | Returns the value of element's class content attribute. Can be set to change it. | `GridItemHTMLElement.className` | node\_modules/typescript/lib/lib.dom.d.ts:5045 |
| <a id="clientheight"></a> `clientHeight` | `readonly` | `number` | - | `GridItemHTMLElement.clientHeight` | node\_modules/typescript/lib/lib.dom.d.ts:5046 |
| <a id="clientleft"></a> `clientLeft` | `readonly` | `number` | - | `GridItemHTMLElement.clientLeft` | node\_modules/typescript/lib/lib.dom.d.ts:5047 |
| <a id="clienttop"></a> `clientTop` | `readonly` | `number` | - | `GridItemHTMLElement.clientTop` | node\_modules/typescript/lib/lib.dom.d.ts:5048 |
| <a id="clientwidth"></a> `clientWidth` | `readonly` | `number` | - | `GridItemHTMLElement.clientWidth` | node\_modules/typescript/lib/lib.dom.d.ts:5049 |
| <a id="id"></a> `id` | `public` | `string` | Returns the value of element's id content attribute. Can be set to change it. | `GridItemHTMLElement.id` | node\_modules/typescript/lib/lib.dom.d.ts:5051 |
| <a id="localname"></a> `localName` | `readonly` | `string` | Returns the local name. | `GridItemHTMLElement.localName` | node\_modules/typescript/lib/lib.dom.d.ts:5053 |
| <a id="namespaceuri"></a> `namespaceURI` | `readonly` | `null` \| `string` | Returns the namespace. | [`GridCompHTMLElement`](gridstack.component.md#gridcomphtmlelement).[`namespaceURI`](gridstack.component.md#namespaceuri) | node\_modules/typescript/lib/lib.dom.d.ts:5055 |
| <a id="onfullscreenchange"></a> `onfullscreenchange` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onfullscreenchange` | node\_modules/typescript/lib/lib.dom.d.ts:5056 |
| <a id="onfullscreenerror"></a> `onfullscreenerror` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onfullscreenerror` | node\_modules/typescript/lib/lib.dom.d.ts:5057 |
| <a id="outerhtml"></a> `outerHTML` | `public` | `string` | - | `GridItemHTMLElement.outerHTML` | node\_modules/typescript/lib/lib.dom.d.ts:5058 |
| <a id="ownerdocument"></a> `ownerDocument` | `readonly` | `Document` | Returns the node document. Returns null for documents. | `GridItemHTMLElement.ownerDocument` | node\_modules/typescript/lib/lib.dom.d.ts:5059 |
| <a id="part"></a> `part` | `readonly` | `DOMTokenList` | - | `GridItemHTMLElement.part` | node\_modules/typescript/lib/lib.dom.d.ts:5060 |
| <a id="prefix"></a> `prefix` | `readonly` | `null` \| `string` | Returns the namespace prefix. | [`GridCompHTMLElement`](gridstack.component.md#gridcomphtmlelement).[`prefix`](gridstack.component.md#prefix) | node\_modules/typescript/lib/lib.dom.d.ts:5062 |
| <a id="scrollheight"></a> `scrollHeight` | `readonly` | `number` | - | `GridItemHTMLElement.scrollHeight` | node\_modules/typescript/lib/lib.dom.d.ts:5063 |
| <a id="scrollleft"></a> `scrollLeft` | `public` | `number` | - | `GridItemHTMLElement.scrollLeft` | node\_modules/typescript/lib/lib.dom.d.ts:5064 |
| <a id="scrolltop"></a> `scrollTop` | `public` | `number` | - | `GridItemHTMLElement.scrollTop` | node\_modules/typescript/lib/lib.dom.d.ts:5065 |
| <a id="scrollwidth"></a> `scrollWidth` | `readonly` | `number` | - | `GridItemHTMLElement.scrollWidth` | node\_modules/typescript/lib/lib.dom.d.ts:5066 |
| <a id="shadowroot"></a> `shadowRoot` | `readonly` | `null` \| `ShadowRoot` | Returns element's shadow root, if any, and if shadow root's mode is "open", and null otherwise. | [`GridCompHTMLElement`](gridstack.component.md#gridcomphtmlelement).[`shadowRoot`](gridstack.component.md#shadowroot) | node\_modules/typescript/lib/lib.dom.d.ts:5068 |
| <a id="slot"></a> `slot` | `public` | `string` | Returns the value of element's slot content attribute. Can be set to change it. | `GridItemHTMLElement.slot` | node\_modules/typescript/lib/lib.dom.d.ts:5070 |
| <a id="tagname"></a> `tagName` | `readonly` | `string` | Returns the HTML-uppercased qualified name. | `GridItemHTMLElement.tagName` | node\_modules/typescript/lib/lib.dom.d.ts:5072 |
| <a id="style"></a> `style` | `readonly` | `CSSStyleDeclaration` | - | `GridItemHTMLElement.style` | node\_modules/typescript/lib/lib.dom.d.ts:5162 |
| <a id="contenteditable"></a> `contentEditable` | `public` | `string` | - | `GridItemHTMLElement.contentEditable` | node\_modules/typescript/lib/lib.dom.d.ts:5166 |
| <a id="enterkeyhint"></a> `enterKeyHint` | `public` | `string` | - | `GridItemHTMLElement.enterKeyHint` | node\_modules/typescript/lib/lib.dom.d.ts:5167 |
| <a id="inputmode"></a> `inputMode` | `public` | `string` | - | `GridItemHTMLElement.inputMode` | node\_modules/typescript/lib/lib.dom.d.ts:5168 |
| <a id="iscontenteditable"></a> `isContentEditable` | `readonly` | `boolean` | - | `GridItemHTMLElement.isContentEditable` | node\_modules/typescript/lib/lib.dom.d.ts:5169 |
| <a id="onabort"></a> `onabort` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user aborts the download. **Param** The event. | `GridItemHTMLElement.onabort` | node\_modules/typescript/lib/lib.dom.d.ts:5856 |
| <a id="onanimationcancel"></a> `onanimationcancel` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onanimationcancel` | node\_modules/typescript/lib/lib.dom.d.ts:5857 |
| <a id="onanimationend"></a> `onanimationend` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onanimationend` | node\_modules/typescript/lib/lib.dom.d.ts:5858 |
| <a id="onanimationiteration"></a> `onanimationiteration` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onanimationiteration` | node\_modules/typescript/lib/lib.dom.d.ts:5859 |
| <a id="onanimationstart"></a> `onanimationstart` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onanimationstart` | node\_modules/typescript/lib/lib.dom.d.ts:5860 |
| <a id="onauxclick"></a> `onauxclick` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onauxclick` | node\_modules/typescript/lib/lib.dom.d.ts:5861 |
| <a id="onbeforeinput"></a> `onbeforeinput` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onbeforeinput` | node\_modules/typescript/lib/lib.dom.d.ts:5862 |
| <a id="onblur"></a> `onblur` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the object loses the input focus. **Param** The focus event. | `GridItemHTMLElement.onblur` | node\_modules/typescript/lib/lib.dom.d.ts:5867 |
| <a id="oncancel"></a> `oncancel` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.oncancel` | node\_modules/typescript/lib/lib.dom.d.ts:5868 |
| <a id="oncanplay"></a> `oncanplay` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when playback is possible, but would require further buffering. **Param** The event. | `GridItemHTMLElement.oncanplay` | node\_modules/typescript/lib/lib.dom.d.ts:5873 |
| <a id="oncanplaythrough"></a> `oncanplaythrough` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.oncanplaythrough` | node\_modules/typescript/lib/lib.dom.d.ts:5874 |
| <a id="onchange"></a> `onchange` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the contents of the object or selection have changed. **Param** The event. | `GridItemHTMLElement.onchange` | node\_modules/typescript/lib/lib.dom.d.ts:5879 |
| <a id="onclick"></a> `onclick` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user clicks the left mouse button on the object **Param** The mouse event. | `GridItemHTMLElement.onclick` | node\_modules/typescript/lib/lib.dom.d.ts:5884 |
| <a id="onclose"></a> `onclose` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onclose` | node\_modules/typescript/lib/lib.dom.d.ts:5885 |
| <a id="oncontextmenu"></a> `oncontextmenu` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user clicks the right mouse button in the client area, opening the context menu. **Param** The mouse event. | `GridItemHTMLElement.oncontextmenu` | node\_modules/typescript/lib/lib.dom.d.ts:5890 |
| <a id="oncopy"></a> `oncopy` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.oncopy` | node\_modules/typescript/lib/lib.dom.d.ts:5891 |
| <a id="oncuechange"></a> `oncuechange` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.oncuechange` | node\_modules/typescript/lib/lib.dom.d.ts:5892 |
| <a id="oncut"></a> `oncut` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.oncut` | node\_modules/typescript/lib/lib.dom.d.ts:5893 |
| <a id="ondblclick"></a> `ondblclick` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user double-clicks the object. **Param** The mouse event. | `GridItemHTMLElement.ondblclick` | node\_modules/typescript/lib/lib.dom.d.ts:5898 |
| <a id="ondrag"></a> `ondrag` | `public` | `null` \| (`this`, `ev`) => `any` | Fires on the source object continuously during a drag operation. **Param** The event. | `GridItemHTMLElement.ondrag` | node\_modules/typescript/lib/lib.dom.d.ts:5903 |
| <a id="ondragend"></a> `ondragend` | `public` | `null` \| (`this`, `ev`) => `any` | Fires on the source object when the user releases the mouse at the close of a drag operation. **Param** The event. | `GridItemHTMLElement.ondragend` | node\_modules/typescript/lib/lib.dom.d.ts:5908 |
| <a id="ondragenter"></a> `ondragenter` | `public` | `null` \| (`this`, `ev`) => `any` | Fires on the target element when the user drags the object to a valid drop target. **Param** The drag event. | `GridItemHTMLElement.ondragenter` | node\_modules/typescript/lib/lib.dom.d.ts:5913 |
| <a id="ondragleave"></a> `ondragleave` | `public` | `null` \| (`this`, `ev`) => `any` | Fires on the target object when the user moves the mouse out of a valid drop target during a drag operation. **Param** The drag event. | `GridItemHTMLElement.ondragleave` | node\_modules/typescript/lib/lib.dom.d.ts:5918 |
| <a id="ondragover"></a> `ondragover` | `public` | `null` \| (`this`, `ev`) => `any` | Fires on the target element continuously while the user drags the object over a valid drop target. **Param** The event. | `GridItemHTMLElement.ondragover` | node\_modules/typescript/lib/lib.dom.d.ts:5923 |
| <a id="ondragstart"></a> `ondragstart` | `public` | `null` \| (`this`, `ev`) => `any` | Fires on the source object when the user starts to drag a text selection or selected object. **Param** The event. | `GridItemHTMLElement.ondragstart` | node\_modules/typescript/lib/lib.dom.d.ts:5928 |
| <a id="ondrop"></a> `ondrop` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.ondrop` | node\_modules/typescript/lib/lib.dom.d.ts:5929 |
| <a id="ondurationchange"></a> `ondurationchange` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the duration attribute is updated. **Param** The event. | `GridItemHTMLElement.ondurationchange` | node\_modules/typescript/lib/lib.dom.d.ts:5934 |
| <a id="onemptied"></a> `onemptied` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the media element is reset to its initial state. **Param** The event. | `GridItemHTMLElement.onemptied` | node\_modules/typescript/lib/lib.dom.d.ts:5939 |
| <a id="onended"></a> `onended` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the end of playback is reached. **Param** The event | `GridItemHTMLElement.onended` | node\_modules/typescript/lib/lib.dom.d.ts:5944 |
| <a id="onerror"></a> `onerror` | `public` | `OnErrorEventHandler` | Fires when an error occurs during object loading. **Param** The event. | `GridItemHTMLElement.onerror` | node\_modules/typescript/lib/lib.dom.d.ts:5949 |
| <a id="onfocus"></a> `onfocus` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the object receives focus. **Param** The event. | `GridItemHTMLElement.onfocus` | node\_modules/typescript/lib/lib.dom.d.ts:5954 |
| <a id="onformdata"></a> `onformdata` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onformdata` | node\_modules/typescript/lib/lib.dom.d.ts:5955 |
| <a id="ongotpointercapture"></a> `ongotpointercapture` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.ongotpointercapture` | node\_modules/typescript/lib/lib.dom.d.ts:5956 |
| <a id="oninput"></a> `oninput` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.oninput` | node\_modules/typescript/lib/lib.dom.d.ts:5957 |
| <a id="oninvalid"></a> `oninvalid` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.oninvalid` | node\_modules/typescript/lib/lib.dom.d.ts:5958 |
| <a id="onkeydown"></a> `onkeydown` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user presses a key. **Param** The keyboard event | `GridItemHTMLElement.onkeydown` | node\_modules/typescript/lib/lib.dom.d.ts:5963 |
| <a id="onkeypress"></a> ~~`onkeypress`~~ | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user presses an alphanumeric key. **Param** The event. **Deprecated** | `GridItemHTMLElement.onkeypress` | node\_modules/typescript/lib/lib.dom.d.ts:5969 |
| <a id="onkeyup"></a> `onkeyup` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user releases a key. **Param** The keyboard event | `GridItemHTMLElement.onkeyup` | node\_modules/typescript/lib/lib.dom.d.ts:5974 |
| <a id="onload"></a> `onload` | `public` | `null` \| (`this`, `ev`) => `any` | Fires immediately after the browser loads the object. **Param** The event. | `GridItemHTMLElement.onload` | node\_modules/typescript/lib/lib.dom.d.ts:5979 |
| <a id="onloadeddata"></a> `onloadeddata` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when media data is loaded at the current playback position. **Param** The event. | `GridItemHTMLElement.onloadeddata` | node\_modules/typescript/lib/lib.dom.d.ts:5984 |
| <a id="onloadedmetadata"></a> `onloadedmetadata` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the duration and dimensions of the media have been determined. **Param** The event. | `GridItemHTMLElement.onloadedmetadata` | node\_modules/typescript/lib/lib.dom.d.ts:5989 |
| <a id="onloadstart"></a> `onloadstart` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when Internet Explorer begins looking for media data. **Param** The event. | `GridItemHTMLElement.onloadstart` | node\_modules/typescript/lib/lib.dom.d.ts:5994 |
| <a id="onlostpointercapture"></a> `onlostpointercapture` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onlostpointercapture` | node\_modules/typescript/lib/lib.dom.d.ts:5995 |
| <a id="onmousedown"></a> `onmousedown` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user clicks the object with either mouse button. **Param** The mouse event. | `GridItemHTMLElement.onmousedown` | node\_modules/typescript/lib/lib.dom.d.ts:6000 |
| <a id="onmouseenter"></a> `onmouseenter` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onmouseenter` | node\_modules/typescript/lib/lib.dom.d.ts:6001 |
| <a id="onmouseleave"></a> `onmouseleave` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onmouseleave` | node\_modules/typescript/lib/lib.dom.d.ts:6002 |
| <a id="onmousemove"></a> `onmousemove` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user moves the mouse over the object. **Param** The mouse event. | `GridItemHTMLElement.onmousemove` | node\_modules/typescript/lib/lib.dom.d.ts:6007 |
| <a id="onmouseout"></a> `onmouseout` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user moves the mouse pointer outside the boundaries of the object. **Param** The mouse event. | `GridItemHTMLElement.onmouseout` | node\_modules/typescript/lib/lib.dom.d.ts:6012 |
| <a id="onmouseover"></a> `onmouseover` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user moves the mouse pointer into the object. **Param** The mouse event. | `GridItemHTMLElement.onmouseover` | node\_modules/typescript/lib/lib.dom.d.ts:6017 |
| <a id="onmouseup"></a> `onmouseup` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user releases a mouse button while the mouse is over the object. **Param** The mouse event. | `GridItemHTMLElement.onmouseup` | node\_modules/typescript/lib/lib.dom.d.ts:6022 |
| <a id="onpaste"></a> `onpaste` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onpaste` | node\_modules/typescript/lib/lib.dom.d.ts:6023 |
| <a id="onpause"></a> `onpause` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when playback is paused. **Param** The event. | `GridItemHTMLElement.onpause` | node\_modules/typescript/lib/lib.dom.d.ts:6028 |
| <a id="onplay"></a> `onplay` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the play method is requested. **Param** The event. | `GridItemHTMLElement.onplay` | node\_modules/typescript/lib/lib.dom.d.ts:6033 |
| <a id="onplaying"></a> `onplaying` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the audio or video has started playing. **Param** The event. | `GridItemHTMLElement.onplaying` | node\_modules/typescript/lib/lib.dom.d.ts:6038 |
| <a id="onpointercancel"></a> `onpointercancel` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onpointercancel` | node\_modules/typescript/lib/lib.dom.d.ts:6039 |
| <a id="onpointerdown"></a> `onpointerdown` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onpointerdown` | node\_modules/typescript/lib/lib.dom.d.ts:6040 |
| <a id="onpointerenter"></a> `onpointerenter` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onpointerenter` | node\_modules/typescript/lib/lib.dom.d.ts:6041 |
| <a id="onpointerleave"></a> `onpointerleave` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onpointerleave` | node\_modules/typescript/lib/lib.dom.d.ts:6042 |
| <a id="onpointermove"></a> `onpointermove` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onpointermove` | node\_modules/typescript/lib/lib.dom.d.ts:6043 |
| <a id="onpointerout"></a> `onpointerout` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onpointerout` | node\_modules/typescript/lib/lib.dom.d.ts:6044 |
| <a id="onpointerover"></a> `onpointerover` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onpointerover` | node\_modules/typescript/lib/lib.dom.d.ts:6045 |
| <a id="onpointerup"></a> `onpointerup` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onpointerup` | node\_modules/typescript/lib/lib.dom.d.ts:6046 |
| <a id="onprogress"></a> `onprogress` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs to indicate progress while downloading media data. **Param** The event. | `GridItemHTMLElement.onprogress` | node\_modules/typescript/lib/lib.dom.d.ts:6051 |
| <a id="onratechange"></a> `onratechange` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the playback rate is increased or decreased. **Param** The event. | `GridItemHTMLElement.onratechange` | node\_modules/typescript/lib/lib.dom.d.ts:6056 |
| <a id="onreset"></a> `onreset` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user resets a form. **Param** The event. | `GridItemHTMLElement.onreset` | node\_modules/typescript/lib/lib.dom.d.ts:6061 |
| <a id="onresize"></a> `onresize` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onresize` | node\_modules/typescript/lib/lib.dom.d.ts:6062 |
| <a id="onscroll"></a> `onscroll` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the user repositions the scroll box in the scroll bar on the object. **Param** The event. | `GridItemHTMLElement.onscroll` | node\_modules/typescript/lib/lib.dom.d.ts:6067 |
| <a id="onsecuritypolicyviolation"></a> `onsecuritypolicyviolation` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onsecuritypolicyviolation` | node\_modules/typescript/lib/lib.dom.d.ts:6068 |
| <a id="onseeked"></a> `onseeked` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the seek operation ends. **Param** The event. | `GridItemHTMLElement.onseeked` | node\_modules/typescript/lib/lib.dom.d.ts:6073 |
| <a id="onseeking"></a> `onseeking` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the current playback position is moved. **Param** The event. | `GridItemHTMLElement.onseeking` | node\_modules/typescript/lib/lib.dom.d.ts:6078 |
| <a id="onselect"></a> `onselect` | `public` | `null` \| (`this`, `ev`) => `any` | Fires when the current selection changes. **Param** The event. | `GridItemHTMLElement.onselect` | node\_modules/typescript/lib/lib.dom.d.ts:6083 |
| <a id="onselectionchange"></a> `onselectionchange` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onselectionchange` | node\_modules/typescript/lib/lib.dom.d.ts:6084 |
| <a id="onselectstart"></a> `onselectstart` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onselectstart` | node\_modules/typescript/lib/lib.dom.d.ts:6085 |
| <a id="onslotchange"></a> `onslotchange` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onslotchange` | node\_modules/typescript/lib/lib.dom.d.ts:6086 |
| <a id="onstalled"></a> `onstalled` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the download has stopped. **Param** The event. | `GridItemHTMLElement.onstalled` | node\_modules/typescript/lib/lib.dom.d.ts:6091 |
| <a id="onsubmit"></a> `onsubmit` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onsubmit` | node\_modules/typescript/lib/lib.dom.d.ts:6092 |
| <a id="onsuspend"></a> `onsuspend` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs if the load operation has been intentionally halted. **Param** The event. | `GridItemHTMLElement.onsuspend` | node\_modules/typescript/lib/lib.dom.d.ts:6097 |
| <a id="ontimeupdate"></a> `ontimeupdate` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs to indicate the current playback position. **Param** The event. | `GridItemHTMLElement.ontimeupdate` | node\_modules/typescript/lib/lib.dom.d.ts:6102 |
| <a id="ontoggle"></a> `ontoggle` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.ontoggle` | node\_modules/typescript/lib/lib.dom.d.ts:6103 |
| <a id="ontouchcancel"></a> `ontouchcancel?` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.ontouchcancel` | node\_modules/typescript/lib/lib.dom.d.ts:6104 |
| <a id="ontouchend"></a> `ontouchend?` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.ontouchend` | node\_modules/typescript/lib/lib.dom.d.ts:6105 |
| <a id="ontouchmove"></a> `ontouchmove?` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.ontouchmove` | node\_modules/typescript/lib/lib.dom.d.ts:6106 |
| <a id="ontouchstart"></a> `ontouchstart?` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.ontouchstart` | node\_modules/typescript/lib/lib.dom.d.ts:6107 |
| <a id="ontransitioncancel"></a> `ontransitioncancel` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.ontransitioncancel` | node\_modules/typescript/lib/lib.dom.d.ts:6108 |
| <a id="ontransitionend"></a> `ontransitionend` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.ontransitionend` | node\_modules/typescript/lib/lib.dom.d.ts:6109 |
| <a id="ontransitionrun"></a> `ontransitionrun` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.ontransitionrun` | node\_modules/typescript/lib/lib.dom.d.ts:6110 |
| <a id="ontransitionstart"></a> `ontransitionstart` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.ontransitionstart` | node\_modules/typescript/lib/lib.dom.d.ts:6111 |
| <a id="onvolumechange"></a> `onvolumechange` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when the volume is changed, or playback is muted or unmuted. **Param** The event. | `GridItemHTMLElement.onvolumechange` | node\_modules/typescript/lib/lib.dom.d.ts:6116 |
| <a id="onwaiting"></a> `onwaiting` | `public` | `null` \| (`this`, `ev`) => `any` | Occurs when playback stops because the next frame of a video resource is not available. **Param** The event. | `GridItemHTMLElement.onwaiting` | node\_modules/typescript/lib/lib.dom.d.ts:6121 |
| <a id="onwebkitanimationend"></a> ~~`onwebkitanimationend`~~ | `public` | `null` \| (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `onanimationend`. | `GridItemHTMLElement.onwebkitanimationend` | node\_modules/typescript/lib/lib.dom.d.ts:6123 |
| <a id="onwebkitanimationiteration"></a> ~~`onwebkitanimationiteration`~~ | `public` | `null` \| (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `onanimationiteration`. | `GridItemHTMLElement.onwebkitanimationiteration` | node\_modules/typescript/lib/lib.dom.d.ts:6125 |
| <a id="onwebkitanimationstart"></a> ~~`onwebkitanimationstart`~~ | `public` | `null` \| (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `onanimationstart`. | `GridItemHTMLElement.onwebkitanimationstart` | node\_modules/typescript/lib/lib.dom.d.ts:6127 |
| <a id="onwebkittransitionend"></a> ~~`onwebkittransitionend`~~ | `public` | `null` \| (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `ontransitionend`. | `GridItemHTMLElement.onwebkittransitionend` | node\_modules/typescript/lib/lib.dom.d.ts:6129 |
| <a id="onwheel"></a> `onwheel` | `public` | `null` \| (`this`, `ev`) => `any` | - | `GridItemHTMLElement.onwheel` | node\_modules/typescript/lib/lib.dom.d.ts:6130 |
| <a id="accesskey"></a> `accessKey` | `public` | `string` | - | `GridItemHTMLElement.accessKey` | node\_modules/typescript/lib/lib.dom.d.ts:6555 |
| <a id="accesskeylabel"></a> `accessKeyLabel` | `readonly` | `string` | - | `GridItemHTMLElement.accessKeyLabel` | node\_modules/typescript/lib/lib.dom.d.ts:6556 |
| <a id="autocapitalize"></a> `autocapitalize` | `public` | `string` | - | `GridItemHTMLElement.autocapitalize` | node\_modules/typescript/lib/lib.dom.d.ts:6557 |
| <a id="dir"></a> `dir` | `public` | `string` | - | `GridItemHTMLElement.dir` | node\_modules/typescript/lib/lib.dom.d.ts:6558 |
| <a id="draggable"></a> `draggable` | `public` | `boolean` | - | `GridItemHTMLElement.draggable` | node\_modules/typescript/lib/lib.dom.d.ts:6559 |
| <a id="hidden"></a> `hidden` | `public` | `boolean` | - | `GridItemHTMLElement.hidden` | node\_modules/typescript/lib/lib.dom.d.ts:6560 |
| <a id="inert"></a> `inert` | `public` | `boolean` | - | `GridItemHTMLElement.inert` | node\_modules/typescript/lib/lib.dom.d.ts:6561 |
| <a id="innertext"></a> `innerText` | `public` | `string` | - | `GridItemHTMLElement.innerText` | node\_modules/typescript/lib/lib.dom.d.ts:6562 |
| <a id="lang"></a> `lang` | `public` | `string` | - | `GridItemHTMLElement.lang` | node\_modules/typescript/lib/lib.dom.d.ts:6563 |
| <a id="offsetheight"></a> `offsetHeight` | `readonly` | `number` | - | `GridItemHTMLElement.offsetHeight` | node\_modules/typescript/lib/lib.dom.d.ts:6564 |
| <a id="offsetleft"></a> `offsetLeft` | `readonly` | `number` | - | `GridItemHTMLElement.offsetLeft` | node\_modules/typescript/lib/lib.dom.d.ts:6565 |
| <a id="offsetparent"></a> `offsetParent` | `readonly` | `null` \| `Element` | - | [`GridCompHTMLElement`](gridstack.component.md#gridcomphtmlelement).[`offsetParent`](gridstack.component.md#offsetparent) | node\_modules/typescript/lib/lib.dom.d.ts:6566 |
| <a id="offsettop"></a> `offsetTop` | `readonly` | `number` | - | `GridItemHTMLElement.offsetTop` | node\_modules/typescript/lib/lib.dom.d.ts:6567 |
| <a id="offsetwidth"></a> `offsetWidth` | `readonly` | `number` | - | `GridItemHTMLElement.offsetWidth` | node\_modules/typescript/lib/lib.dom.d.ts:6568 |
| <a id="outertext"></a> `outerText` | `public` | `string` | - | `GridItemHTMLElement.outerText` | node\_modules/typescript/lib/lib.dom.d.ts:6569 |
| <a id="spellcheck"></a> `spellcheck` | `public` | `boolean` | - | `GridItemHTMLElement.spellcheck` | node\_modules/typescript/lib/lib.dom.d.ts:6570 |
| <a id="title"></a> `title` | `public` | `string` | - | `GridItemHTMLElement.title` | node\_modules/typescript/lib/lib.dom.d.ts:6571 |
| <a id="translate"></a> `translate` | `public` | `boolean` | - | `GridItemHTMLElement.translate` | node\_modules/typescript/lib/lib.dom.d.ts:6572 |
| <a id="autofocus"></a> `autofocus` | `public` | `boolean` | - | `GridItemHTMLElement.autofocus` | node\_modules/typescript/lib/lib.dom.d.ts:7764 |
| <a id="dataset"></a> `dataset` | `readonly` | `DOMStringMap` | - | `GridItemHTMLElement.dataset` | node\_modules/typescript/lib/lib.dom.d.ts:7765 |
| <a id="nonce"></a> `nonce?` | `public` | `string` | - | `GridItemHTMLElement.nonce` | node\_modules/typescript/lib/lib.dom.d.ts:7766 |
| <a id="tabindex"></a> `tabIndex` | `public` | `number` | - | `GridItemHTMLElement.tabIndex` | node\_modules/typescript/lib/lib.dom.d.ts:7767 |
| <a id="innerhtml"></a> `innerHTML` | `public` | `string` | - | `GridItemHTMLElement.innerHTML` | node\_modules/typescript/lib/lib.dom.d.ts:9130 |
| <a id="baseuri"></a> `baseURI` | `readonly` | `string` | Returns node's node document's document base URL. | `GridItemHTMLElement.baseURI` | node\_modules/typescript/lib/lib.dom.d.ts:10249 |
| <a id="childnodes"></a> `childNodes` | `readonly` | `NodeListOf`\<`ChildNode`\> | Returns the children. | `GridItemHTMLElement.childNodes` | node\_modules/typescript/lib/lib.dom.d.ts:10251 |
| <a id="firstchild"></a> `firstChild` | `readonly` | `null` \| `ChildNode` | Returns the first child. | [`GridCompHTMLElement`](gridstack.component.md#gridcomphtmlelement).[`firstChild`](gridstack.component.md#firstchild) | node\_modules/typescript/lib/lib.dom.d.ts:10253 |
| <a id="isconnected"></a> `isConnected` | `readonly` | `boolean` | Returns true if node is connected and false otherwise. | `GridItemHTMLElement.isConnected` | node\_modules/typescript/lib/lib.dom.d.ts:10255 |
| <a id="lastchild"></a> `lastChild` | `readonly` | `null` \| `ChildNode` | Returns the last child. | [`GridCompHTMLElement`](gridstack.component.md#gridcomphtmlelement).[`lastChild`](gridstack.component.md#lastchild) | node\_modules/typescript/lib/lib.dom.d.ts:10257 |
| <a id="nextsibling"></a> `nextSibling` | `readonly` | `null` \| `ChildNode` | Returns the next sibling. | [`GridCompHTMLElement`](gridstack.component.md#gridcomphtmlelement).[`nextSibling`](gridstack.component.md#nextsibling) | node\_modules/typescript/lib/lib.dom.d.ts:10259 |
| <a id="nodename"></a> `nodeName` | `readonly` | `string` | Returns a string appropriate for the type of node. | `GridItemHTMLElement.nodeName` | node\_modules/typescript/lib/lib.dom.d.ts:10261 |
| <a id="nodetype"></a> `nodeType` | `readonly` | `number` | Returns the type of node. | `GridItemHTMLElement.nodeType` | node\_modules/typescript/lib/lib.dom.d.ts:10263 |
| <a id="nodevalue"></a> `nodeValue` | `public` | `null` \| `string` | - | [`GridCompHTMLElement`](gridstack.component.md#gridcomphtmlelement).[`nodeValue`](gridstack.component.md#nodevalue) | node\_modules/typescript/lib/lib.dom.d.ts:10264 |
| <a id="parentelement"></a> `parentElement` | `readonly` | `null` \| `HTMLElement` | Returns the parent element. | [`GridCompHTMLElement`](gridstack.component.md#gridcomphtmlelement).[`parentElement`](gridstack.component.md#parentelement) | node\_modules/typescript/lib/lib.dom.d.ts:10268 |
| <a id="parentnode"></a> `parentNode` | `readonly` | `null` \| `ParentNode` | Returns the parent. | [`GridCompHTMLElement`](gridstack.component.md#gridcomphtmlelement).[`parentNode`](gridstack.component.md#parentnode) | node\_modules/typescript/lib/lib.dom.d.ts:10270 |
| <a id="previoussibling"></a> `previousSibling` | `readonly` | `null` \| `ChildNode` | Returns the previous sibling. | [`GridCompHTMLElement`](gridstack.component.md#gridcomphtmlelement).[`previousSibling`](gridstack.component.md#previoussibling) | node\_modules/typescript/lib/lib.dom.d.ts:10272 |
| <a id="textcontent"></a> `textContent` | `public` | `null` \| `string` | - | [`GridCompHTMLElement`](gridstack.component.md#gridcomphtmlelement).[`textContent`](gridstack.component.md#textcontent) | node\_modules/typescript/lib/lib.dom.d.ts:10273 |
| <a id="element_node"></a> `ELEMENT_NODE` | `readonly` | `1` | node is an element. | `GridItemHTMLElement.ELEMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10297 |
| <a id="attribute_node"></a> `ATTRIBUTE_NODE` | `readonly` | `2` | - | `GridItemHTMLElement.ATTRIBUTE_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10298 |
| <a id="text_node"></a> `TEXT_NODE` | `readonly` | `3` | node is a Text node. | `GridItemHTMLElement.TEXT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10300 |
| <a id="cdata_section_node"></a> `CDATA_SECTION_NODE` | `readonly` | `4` | node is a CDATASection node. | `GridItemHTMLElement.CDATA_SECTION_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10302 |
| <a id="entity_reference_node"></a> `ENTITY_REFERENCE_NODE` | `readonly` | `5` | - | `GridItemHTMLElement.ENTITY_REFERENCE_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10303 |
| <a id="entity_node"></a> `ENTITY_NODE` | `readonly` | `6` | - | `GridItemHTMLElement.ENTITY_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10304 |
| <a id="processing_instruction_node"></a> `PROCESSING_INSTRUCTION_NODE` | `readonly` | `7` | node is a ProcessingInstruction node. | `GridItemHTMLElement.PROCESSING_INSTRUCTION_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10306 |
| <a id="comment_node"></a> `COMMENT_NODE` | `readonly` | `8` | node is a Comment node. | `GridItemHTMLElement.COMMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10308 |
| <a id="document_node"></a> `DOCUMENT_NODE` | `readonly` | `9` | node is a document. | `GridItemHTMLElement.DOCUMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10310 |
| <a id="document_type_node"></a> `DOCUMENT_TYPE_NODE` | `readonly` | `10` | node is a doctype. | `GridItemHTMLElement.DOCUMENT_TYPE_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10312 |
| <a id="document_fragment_node"></a> `DOCUMENT_FRAGMENT_NODE` | `readonly` | `11` | node is a DocumentFragment node. | `GridItemHTMLElement.DOCUMENT_FRAGMENT_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10314 |
| <a id="notation_node"></a> `NOTATION_NODE` | `readonly` | `12` | - | `GridItemHTMLElement.NOTATION_NODE` | node\_modules/typescript/lib/lib.dom.d.ts:10315 |
| <a id="document_position_disconnected"></a> `DOCUMENT_POSITION_DISCONNECTED` | `readonly` | `1` | Set when node and other are not in the same tree. | `GridItemHTMLElement.DOCUMENT_POSITION_DISCONNECTED` | node\_modules/typescript/lib/lib.dom.d.ts:10317 |
| <a id="document_position_preceding"></a> `DOCUMENT_POSITION_PRECEDING` | `readonly` | `2` | Set when other is preceding node. | `GridItemHTMLElement.DOCUMENT_POSITION_PRECEDING` | node\_modules/typescript/lib/lib.dom.d.ts:10319 |
| <a id="document_position_following"></a> `DOCUMENT_POSITION_FOLLOWING` | `readonly` | `4` | Set when other is following node. | `GridItemHTMLElement.DOCUMENT_POSITION_FOLLOWING` | node\_modules/typescript/lib/lib.dom.d.ts:10321 |
| <a id="document_position_contains"></a> `DOCUMENT_POSITION_CONTAINS` | `readonly` | `8` | Set when other is an ancestor of node. | `GridItemHTMLElement.DOCUMENT_POSITION_CONTAINS` | node\_modules/typescript/lib/lib.dom.d.ts:10323 |
| <a id="document_position_contained_by"></a> `DOCUMENT_POSITION_CONTAINED_BY` | `readonly` | `16` | Set when other is a descendant of node. | `GridItemHTMLElement.DOCUMENT_POSITION_CONTAINED_BY` | node\_modules/typescript/lib/lib.dom.d.ts:10325 |
| <a id="document_position_implementation_specific"></a> `DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` | `readonly` | `32` | - | `GridItemHTMLElement.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` | node\_modules/typescript/lib/lib.dom.d.ts:10326 |
| <a id="nextelementsibling"></a> `nextElementSibling` | `readonly` | `null` \| `Element` | Returns the first following sibling that is an element, and null otherwise. | `GridItemHTMLElement.nextElementSibling` | node\_modules/typescript/lib/lib.dom.d.ts:10416 |
| <a id="previouselementsibling"></a> `previousElementSibling` | `readonly` | `null` \| `Element` | Returns the first preceding sibling that is an element, and null otherwise. | `GridItemHTMLElement.previousElementSibling` | node\_modules/typescript/lib/lib.dom.d.ts:10418 |
| <a id="childelementcount"></a> `childElementCount` | `readonly` | `number` | - | `GridItemHTMLElement.childElementCount` | node\_modules/typescript/lib/lib.dom.d.ts:10685 |
| <a id="children"></a> `children` | `readonly` | `HTMLCollection` | Returns the child elements. | `GridItemHTMLElement.children` | node\_modules/typescript/lib/lib.dom.d.ts:10687 |
| <a id="firstelementchild"></a> `firstElementChild` | `readonly` | `null` \| `Element` | Returns the first child that is an element, and null otherwise. | [`GridCompHTMLElement`](gridstack.component.md#gridcomphtmlelement).[`firstElementChild`](gridstack.component.md#firstelementchild) | node\_modules/typescript/lib/lib.dom.d.ts:10689 |
| <a id="lastelementchild"></a> `lastElementChild` | `readonly` | `null` \| `Element` | Returns the last child that is an element, and null otherwise. | [`GridCompHTMLElement`](gridstack.component.md#gridcomphtmlelement).[`lastElementChild`](gridstack.component.md#lastelementchild) | node\_modules/typescript/lib/lib.dom.d.ts:10691 |
| <a id="assignedslot"></a> `assignedSlot` | `readonly` | `null` \| `HTMLSlotElement` | - | `GridItemHTMLElement.assignedSlot` | node\_modules/typescript/lib/lib.dom.d.ts:13933 |
