# gridstack

## Interfaces

### GridStackProps

Defined in: [react/projects/lib/src/gridstack.tsx:32](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L32)

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="options"></a> `options` | [`GridStackOptions`](types.md#gridstackoptions) | - | [react/projects/lib/src/gridstack.tsx:33](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L33) |
| <a id="components"></a> `components?` | [`ComponentMap`](#componentmap) | Map `component` field in widget JSON to React components (recommended / component mode) | [react/projects/lib/src/gridstack.tsx:35](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L35) |
| <a id="children"></a> `children?` | `ReactNode` | - | [react/projects/lib/src/gridstack.tsx:36](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L36) |
| <a id="emptycontent"></a> `emptyContent?` | `ReactNode` | Content to render when the grid has no items (mirrors Angular `[empty-content]`). | [react/projects/lib/src/gridstack.tsx:38](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L38) |
| <a id="classname"></a> `className?` | `string` | - | [react/projects/lib/src/gridstack.tsx:39](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L39) |
| <a id="style"></a> `style?` | `CSSProperties` | - | [react/projects/lib/src/gridstack.tsx:40](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L40) |
| <a id="onadded"></a> `onAdded?` | (`e`, `nodes`) => `void` | - | [react/projects/lib/src/gridstack.tsx:41](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L41) |
| <a id="onchange"></a> `onChange?` | (`e`, `nodes`) => `void` | - | [react/projects/lib/src/gridstack.tsx:42](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L42) |
| <a id="onremoved"></a> `onRemoved?` | (`e`, `nodes`) => `void` | - | [react/projects/lib/src/gridstack.tsx:43](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L43) |
| <a id="onenable"></a> `onEnable?` | (`e`) => `void` | - | [react/projects/lib/src/gridstack.tsx:44](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L44) |
| <a id="ondisable"></a> `onDisable?` | (`e`) => `void` | - | [react/projects/lib/src/gridstack.tsx:45](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L45) |
| <a id="ondrag"></a> `onDrag?` | `GridStackElementHandler` | - | [react/projects/lib/src/gridstack.tsx:46](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L46) |
| <a id="ondragstart"></a> `onDragStart?` | `GridStackElementHandler` | - | [react/projects/lib/src/gridstack.tsx:47](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L47) |
| <a id="ondragstop"></a> `onDragStop?` | `GridStackElementHandler` | - | [react/projects/lib/src/gridstack.tsx:48](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L48) |
| <a id="ondropped"></a> `onDropped?` | `GridStackDroppedHandler` | - | [react/projects/lib/src/gridstack.tsx:49](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L49) |
| <a id="onresize"></a> `onResize?` | `GridStackElementHandler` | - | [react/projects/lib/src/gridstack.tsx:50](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L50) |
| <a id="onresizestart"></a> `onResizeStart?` | `GridStackElementHandler` | - | [react/projects/lib/src/gridstack.tsx:51](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L51) |
| <a id="onresizestop"></a> `onResizeStop?` | `GridStackElementHandler` | - | [react/projects/lib/src/gridstack.tsx:52](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L52) |

***

### GridStackHandle

Defined in: [react/projects/lib/src/gridstack.tsx:55](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L55)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="getgrid"></a> `getGrid` | () => `null` \| `GridStack` | [react/projects/lib/src/gridstack.tsx:56](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L56) |

## Variables

### GridStackComponent

```ts
const GridStackComponent: ForwardRefExoticComponent<GridStackProps & RefAttributes<GridStackHandle>>;
```

Defined in: [react/projects/lib/src/gridstack.tsx:67](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L67)

## Type Aliases

### ComponentMap

```ts
type ComponentMap = Record<string, ComponentType<Record<string, unknown>>>;
```

Defined in: [react/projects/lib/src/gridstack.tsx:30](https://github.com/adumesny/gridstack.js/blob/master/react/projects/lib/src/gridstack.tsx#L30)

Maps `component` JSON keys to React components (props are merged from saved `props`).
