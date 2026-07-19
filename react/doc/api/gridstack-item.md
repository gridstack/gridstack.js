# gridstack-item

## Interfaces

### GridStackItemProps

Defined in: [react/projects/lib/src/gridstack-item.tsx:16](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack-item.tsx#L16)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="id"></a> `id` | `string` | [react/projects/lib/src/gridstack-item.tsx:17](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack-item.tsx#L17) |
| <a id="options"></a> `options?` | `Partial`\<[`GridStackWidget`](types.md#gridstackwidget)\> | [react/projects/lib/src/gridstack-item.tsx:18](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack-item.tsx#L18) |
| <a id="children"></a> `children?` | `ReactNode` | [react/projects/lib/src/gridstack-item.tsx:19](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack-item.tsx#L19) |

## Functions

### GridStackItem()

```ts
function GridStackItem(__namedParameters): 
  | null
| ReactElement<any, string | JSXElementConstructor<any>>;
```

Defined in: [react/projects/lib/src/gridstack-item.tsx:35](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack-item.tsx#L35)

Portal anchor for one grid item. Owns the React subtree; survives cross-grid DnD
because the component stays mounted and the portal re-points to the new container.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`GridStackItemProps`](#gridstackitemprops) |

#### Returns

  \| `null`
  \| `ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>
