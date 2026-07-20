# composables

## Interfaces

### UseGridStackItemResult

Defined in: [vue/projects/lib/src/composables.ts:51](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L51)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="id"></a> `id` | `string` | [vue/projects/lib/src/composables.ts:52](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L52) |
| <a id="node"></a> `node` | [`GridStackNode`](../../../doc/API.md#gridstacknode) | [vue/projects/lib/src/composables.ts:53](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L53) |

***

### UseWidgetSerializerOptions\<T\>

Defined in: [vue/projects/lib/src/composables.ts:87](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L87)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> |

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="serialize"></a> `serialize?` | () => `T` | [vue/projects/lib/src/composables.ts:88](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L88) |
| <a id="deserialize"></a> `deserialize?` | (`data`) => `void` | [vue/projects/lib/src/composables.ts:89](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L89) |

## Functions

### useGridStack()

```ts
function useGridStack(): object;
```

Defined in: [vue/projects/lib/src/composables.ts:16](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L16)

Access the parent `<GridStack>`'s grid instance and helpers.

Must be called within a component that is a descendant of `<GridStack>`.

#### Returns

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `get grid` | `GridStack` | Raw GridStack instance (not a Vue ref — never proxy it). | [vue/projects/lib/src/composables.ts:22](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L22) |
| `get layoutVersion` | `number` | Bumps whenever the layout changes — use as a reactive dependency. | [vue/projects/lib/src/composables.ts:24](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L24) |
| `addWidget()` | (`w`) => [`GridItemHTMLElement`](../../../doc/API.md#griditemhtmlelement) | - | [vue/projects/lib/src/composables.ts:25](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L25) |
| `removeWidget()` | ( `el`, `removeDOM?`, `triggerEvent?`) => `GridStack` | - | [vue/projects/lib/src/composables.ts:28](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L28) |
| `removeAll()` | (`removeDOM`) => `GridStack` | - | [vue/projects/lib/src/composables.ts:35](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L35) |
| `save()` | (`saveContent`, `saveGridOpt`) => \| [`GridStackOptions`](../../../doc/API.md#gridstackoptions) \| [`GridStackWidget`](../../../doc/API.md#gridstackwidget)[] | - | [vue/projects/lib/src/composables.ts:38](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L38) |
| `load()` | (`items`) => `GridStack` | - | [vue/projects/lib/src/composables.ts:41](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L41) |

***

### useGridStackItem()

```ts
function useGridStackItem(): UseGridStackItemResult;
```

Defined in: [vue/projects/lib/src/composables.ts:63](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L63)

Returns the widget `id` and the live `GridStackNode` for the widget that
contains the calling component. Must be called inside `<GridStackItem>` slot content.

Recomputes whenever `layoutVersion` changes.
Uses recursive grid search so items dragged to sub-grids are still found.

#### Returns

[`UseGridStackItemResult`](#usegridstackitemresult)

***

### useWidgetSerializer()

```ts
function useWidgetSerializer<T>(opts): void;
```

Defined in: [vue/projects/lib/src/composables.ts:109](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/composables.ts#L109)

Optional composable for widget components that need to participate in `grid.save()` / `grid.load()`.

Call this inside the `setup()` of a widget component rendered inside `<GridStackItem>`.
The `serialize` function is called during `grid.save()` and its return value is merged
into the widget's `props` in the serialized JSON.
The `deserialize` function is called when GS updates the node (e.g. after `grid.load()`).

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`UseWidgetSerializerOptions`](#usewidgetserializeroptions)\<`T`\> |

#### Returns

`void`

#### Example

```ts
const count = ref(0)
useWidgetSerializer({
  serialize: () => ({ count: count.value }),
  deserialize: (data) => { count.value = data.count as number ?? 0 },
})
```
