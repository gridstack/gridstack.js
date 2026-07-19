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
| `addWidget()` | (`w`) => `undefined` \| `GridItemHTMLElement` | [react/projects/lib/src/hooks.ts:45](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L45) |
| `removeWidget()` | (`el`, `removeDOM?`, `triggerEvent?`) => `undefined` \| `GridStack` | [react/projects/lib/src/hooks.ts:49](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L49) |
| `removeAll()` | (`removeDOM`) => `undefined` \| `GridStack` | [react/projects/lib/src/hooks.ts:54](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L54) |
| `save()` | (`saveContent`, `saveGridOpt`) => `undefined` \| `GridStackOptions` \| `GridStackWidget`[] | [react/projects/lib/src/hooks.ts:55](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L55) |

***

### useGridStackItem()

```ts
function useGridStackItem(): UseGridStackItemResult;
```

Defined in: [react/projects/lib/src/hooks.ts:67](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L67)

#### Returns

[`UseGridStackItemResult`](#usegridstackitemresult)

## Type Aliases

### UseGridStackItemResult

```ts
type UseGridStackItemResult = object;
```

Defined in: [react/projects/lib/src/hooks.ts:62](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L62)

#### Properties

##### id

```ts
id: string;
```

Defined in: [react/projects/lib/src/hooks.ts:63](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L63)

##### node

```ts
node: GridStackNode | undefined;
```

Defined in: [react/projects/lib/src/hooks.ts:64](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/hooks.ts#L64)
