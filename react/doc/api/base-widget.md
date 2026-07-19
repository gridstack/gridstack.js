# base-widget

## Classes

### `abstract` BaseWidget\<P\>

Defined in: [react/projects/lib/src/base-widget.tsx:8](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/base-widget.tsx#L8)

Optional parity with Angular `BaseWidget` for class-based widget components.
For functional components, prefer useWidgetSerializer instead.

#### Extends

- `Component`\<`P`\>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `P` *extends* `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Constructors

##### Constructor

```ts
new BaseWidget<P>(props): BaseWidget<P>;
```

Defined in: react/node\_modules/@types/react/ts5.0/index.d.ts:1003

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `P` |

###### Returns

[`BaseWidget`](#basewidget)\<`P`\>

###### Inherited from

```ts
Component<P>.constructor
```

##### Constructor

```ts
new BaseWidget<P>(props, context): BaseWidget<P>;
```

Defined in: react/node\_modules/@types/react/ts5.0/index.d.ts:1008

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `P` |
| `context` | `any` |

###### Returns

[`BaseWidget`](#basewidget)\<`P`\>

###### Deprecated

###### See

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html)

###### Inherited from

```ts
Component<P>.constructor
```

#### Methods

##### serialize()

```ts
serialize(): undefined | Record<string, unknown>;
```

Defined in: [react/projects/lib/src/base-widget.tsx:14](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/base-widget.tsx#L14)

###### Returns

`undefined` \| `Record`\<`string`, `unknown`\>

##### deserialize()

```ts
deserialize(_): void;
```

Defined in: [react/projects/lib/src/base-widget.tsx:20](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/base-widget.tsx#L20)

Optional override — restore widget-specific state from saved layout.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `_` | [`GridStackWidget`](types.md#gridstackwidget) |

###### Returns

`void`

##### render()

```ts
render(): ReactNode;
```

Defined in: [react/projects/lib/src/base-widget.tsx:24](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/base-widget.tsx#L24)

###### Returns

`ReactNode`

###### Overrides

```ts
Component.render
```

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="widgetitem"></a> `widgetItem?` | [`GridStackWidget`](types.md#gridstackwidget) | Populated by the grid when restoring from saved layout (subclasses may read in lifecycle). | [react/projects/lib/src/base-widget.tsx:12](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/base-widget.tsx#L12) |
