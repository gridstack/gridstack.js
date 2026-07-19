# gridstack-context

## Interfaces

### GridStackContextValue

Defined in: [react/projects/lib/src/gridstack-context.tsx:4](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack-context.tsx#L4)

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="grid"></a> `grid` | `null` \| `GridStack` | - | [react/projects/lib/src/gridstack-context.tsx:5](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack-context.tsx#L5) |
| <a id="layoutversion"></a> `layoutVersion` | `number` | Bumped after GS-driven structural changes (add/remove) so portal containers re-sync. | [react/projects/lib/src/gridstack-context.tsx:7](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack-context.tsx#L7) |

## Variables

### GridStackContext

```ts
const GridStackContext: Context<null | GridStackContextValue>;
```

Defined in: [react/projects/lib/src/gridstack-context.tsx:16](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack-context.tsx#L16)

## Functions

### useGridStackContextValue()

```ts
function useGridStackContextValue(): GridStackContextValue;
```

Defined in: [react/projects/lib/src/gridstack-context.tsx:18](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack-context.tsx#L18)

#### Returns

[`GridStackContextValue`](#gridstackcontextvalue)
