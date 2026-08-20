# hooks

## Interfaces

### UseWidgetSerializerOptions\<T\>

Defined in: [react/projects/lib/src/hooks.ts:8](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L8)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> |

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="serialize"></a> `serialize?` | () => `undefined` \| `T` | [react/projects/lib/src/hooks.ts:9](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L9) |
| <a id="deserialize"></a> `deserialize?` | (`data`) => `void` | [react/projects/lib/src/hooks.ts:10](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L10) |

## Functions

### useWidgetSerializer()

```ts
function useWidgetSerializer<T>(_opts): void;
```

Defined in: [react/projects/lib/src/hooks.ts:18](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L18)

Registers serialize/deserialize for a widget component.
`serialize` is called during `grid.save()`; `deserialize` is called when GS
updates the node (e.g. after `grid.load()` or `updateCB`).

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `_opts` | [`UseWidgetSerializerOptions`](#usewidgetserializeroptions)\<`T`\> |

#### Returns

`void`

***

### useGridStack()

```ts
function useGridStack(): object;
```

Defined in: [react/projects/lib/src/hooks.ts:34](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L34)

#### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `grid` | `null` \| `GridStack` | [react/projects/lib/src/hooks.ts:42](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L42) |
| `layoutVersion` | `number` | [react/projects/lib/src/hooks.ts:43](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L43) |
| `registerWidgetSerializer()` | (`id`, `serialize`, `deserialize?`) => () => `void` | [react/projects/lib/src/hooks.ts:44](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L44) |
| `addWidget()` | (`w`) => \| `undefined` \| [`GridItemHTMLElement`](../../../doc/API.md#griditemhtmlelement) | [react/projects/lib/src/hooks.ts:45](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L45) |
| `removeWidget()` | (`el`, `removeDOM?`, `triggerEvent?`) => `undefined` \| `GridStack` | [react/projects/lib/src/hooks.ts:46](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L46) |
| `removeAll()` | (`removeDOM`) => `undefined` \| `GridStack` | [react/projects/lib/src/hooks.ts:51](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L51) |
| `save()` | (`saveContent`, `saveGridOpt`) => \| `undefined` \| [`GridStackOptions`](../../../doc/API.md#gridstackoptions) \| [`GridStackWidget`](../../../doc/API.md#gridstackwidget)[] | [react/projects/lib/src/hooks.ts:52](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L52) |

***

### useGridStackItem()

```ts
function useGridStackItem(): UseGridStackItemResult;
```

Defined in: [react/projects/lib/src/hooks.ts:64](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L64)

#### Returns

[`UseGridStackItemResult`](#usegridstackitemresult)

## Type Aliases

### UseGridStackItemResult

```ts
type UseGridStackItemResult = object;
```

Defined in: [react/projects/lib/src/hooks.ts:59](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L59)

#### Properties

##### id

```ts
id: string;
```

Defined in: [react/projects/lib/src/hooks.ts:60](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L60)

##### node

```ts
node: GridStackNode | undefined;
```

Defined in: [react/projects/lib/src/hooks.ts:61](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L61)
