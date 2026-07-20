# types

## Interfaces

### NgGridStackWidget

Defined in: [angular/projects/lib/src/lib/types.ts:13](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L13)

Extended GridStackWidget interface for Angular integration.
Matches the React/Vue convention: `component` identifies the widget type,
`props` carries the data passed to it (via ComponentRef.setInput()).

#### Extends

- [`GridStackWidget`](../../../doc/API.md#gridstackwidget)

#### Properties

| Property | Type | Description | Overrides | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="component"></a> `component?` | `string` | Key used to look up the Angular component in the `componentMap` (defaults to the component's `@Component.selector`, e.g. `'app-chart'`). | - | [angular/projects/lib/src/lib/types.ts:18](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L18) |
| <a id="props"></a> `props?` | [`NgCompInputs`](#ngcompinputs) | Serialized props forwarded to the component via `ComponentRef.setInput()`. | - | [angular/projects/lib/src/lib/types.ts:20](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L20) |
| <a id="subgridopts"></a> `subGridOpts?` | [`NgGridStackOptions`](#nggridstackoptions) | Configuration for nested sub-grids | `GridStackWidget.subGridOpts` | [angular/projects/lib/src/lib/types.ts:22](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L22) |

***

### NgGridStackNode

Defined in: [angular/projects/lib/src/lib/types.ts:29](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L29)

Extended GridStackNode interface for Angular integration.
Adds component key for dynamic content creation.

#### Extends

- [`GridStackNode`](../../../doc/API.md#gridstacknode)

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="component-1"></a> `component?` | `string` | Key used to look up the Angular component in the `componentMap`. | [angular/projects/lib/src/lib/types.ts:31](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L31) |

***

### NgGridStackOptions

Defined in: [angular/projects/lib/src/lib/types.ts:38](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L38)

Extended GridStackOptions interface for Angular integration.
Supports Angular-specific widget definitions and nested grids.

#### Extends

- [`GridStackOptions`](../../../doc/API.md#gridstackoptions)

#### Properties

| Property | Type | Description | Overrides | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="children"></a> `children?` | [`NgGridStackWidget`](#nggridstackwidget)[] | Array of Angular widget definitions for initial grid setup | `GridStackOptions.children` | [angular/projects/lib/src/lib/types.ts:40](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L40) |
| <a id="subgridopts-1"></a> `subGridOpts?` | [`NgGridStackOptions`](#nggridstackoptions) | Configuration for nested sub-grids (Angular-aware) | `GridStackOptions.subGridOpts` | [angular/projects/lib/src/lib/types.ts:42](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L42) |

## Type Aliases

### NgCompInputs

```ts
type NgCompInputs = object;
```

Defined in: [angular/projects/lib/src/lib/types.ts:59](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L59)

Type for component input data serialization.
Maps @Input() property names to their values for widget persistence.

#### Index Signature

```ts
[key: string]: any
```

#### Example

```typescript
const inputs: NgCompInputs = {
  title: 'My Widget',
  value: 42,
  config: { enabled: true }
};
```
