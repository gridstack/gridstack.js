# gridstack-widget-context

## Interfaces

### GridStackWidgetContextValue

Defined in: [react/projects/lib/src/gridstack-widget-context.tsx:3](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack-widget-context.tsx#L3)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="id"></a> `id` | `string` | [react/projects/lib/src/gridstack-widget-context.tsx:4](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack-widget-context.tsx#L4) |
| <a id="registerserializer"></a> `registerSerializer?` | (`serialize`, `deserialize?`) => () => `void` | [react/projects/lib/src/gridstack-widget-context.tsx:5](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack-widget-context.tsx#L5) |

## Variables

### GridStackWidgetContext

```ts
const GridStackWidgetContext: Context<null | GridStackWidgetContextValue>;
```

Defined in: [react/projects/lib/src/gridstack-widget-context.tsx:11](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack-widget-context.tsx#L11)

## Functions

### useGridStackWidgetContext()

```ts
function useGridStackWidgetContext(): GridStackWidgetContextValue;
```

Defined in: [react/projects/lib/src/gridstack-widget-context.tsx:14](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack-widget-context.tsx#L14)

#### Returns

[`GridStackWidgetContextValue`](#gridstackwidgetcontextvalue)
