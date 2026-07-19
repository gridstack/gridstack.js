# gridstack-context

## Interfaces

### GsContext

Defined in: [vue/projects/lib/src/gridstack-context.ts:5](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/gridstack-context.ts#L5)

#### Methods

##### registerWidgetSerializer()

```ts
registerWidgetSerializer(
   id, 
   serialize, 
   deserialize?): () => void;
```

Defined in: [vue/projects/lib/src/gridstack-context.ts:10](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/gridstack-context.ts#L10)

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

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="grid"></a> `grid` | `GridStack` | Raw GridStack instance — NOT a Vue ref (GS proxies break internals). | [vue/projects/lib/src/gridstack-context.ts:7](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/gridstack-context.ts#L7) |
| <a id="layoutversion"></a> `layoutVersion` | `Ref`\<`number`\> | Bumped after GS-driven layout changes so descendants can re-sync. | [vue/projects/lib/src/gridstack-context.ts:9](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/gridstack-context.ts#L9) |

***

### GsItemContext

Defined in: [vue/projects/lib/src/gridstack-context.ts:17](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/gridstack-context.ts#L17)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="id"></a> `id` | `string` | [vue/projects/lib/src/gridstack-context.ts:18](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/gridstack-context.ts#L18) |
| <a id="registerserializer"></a> `registerSerializer?` | (`serialize`, `deserialize?`) => () => `void` | [vue/projects/lib/src/gridstack-context.ts:19](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/gridstack-context.ts#L19) |

## Variables

### GS\_CONTEXT\_KEY

```ts
const GS_CONTEXT_KEY: InjectionKey<GsContext>;
```

Defined in: [vue/projects/lib/src/gridstack-context.ts:25](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/gridstack-context.ts#L25)

***

### GS\_ITEM\_CONTEXT\_KEY

```ts
const GS_ITEM_CONTEXT_KEY: InjectionKey<GsItemContext>;
```

Defined in: [vue/projects/lib/src/gridstack-context.ts:26](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/gridstack-context.ts#L26)

## Functions

### useGsContext()

```ts
function useGsContext(): GsContext;
```

Defined in: [vue/projects/lib/src/gridstack-context.ts:28](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/gridstack-context.ts#L28)

#### Returns

[`GsContext`](#gscontext)

***

### useGsItemContext()

```ts
function useGsItemContext(): GsItemContext;
```

Defined in: [vue/projects/lib/src/gridstack-context.ts:34](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/gridstack-context.ts#L34)

#### Returns

[`GsItemContext`](#gsitemcontext)
