# types

## Interfaces

### NgGridStackWidget

Defined in: [angular/projects/lib/src/lib/types.ts:12](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L12)

Extended GridStackWidget interface for Angular integration.
Adds Angular-specific properties for dynamic component creation.

#### Extends

- `GridStackWidget`

#### Properties

| Property | Type | Description | Overrides | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="selector"></a> `selector?` | `string` | Angular component selector for dynamic creation (e.g., 'my-widget') | - | [angular/projects/lib/src/lib/types.ts:14](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L14) |
| <a id="input"></a> `input?` | [`NgCompInputs`](#ngcompinputs) | Serialized data for component @Input() properties | - | [angular/projects/lib/src/lib/types.ts:16](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L16) |
| <a id="subgridopts"></a> `subGridOpts?` | [`NgGridStackOptions`](#nggridstackoptions) | Configuration for nested sub-grids | `GridStackWidget.subGridOpts` | [angular/projects/lib/src/lib/types.ts:18](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L18) |

***

### NgGridStackNode

Defined in: [angular/projects/lib/src/lib/types.ts:25](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L25)

Extended GridStackNode interface for Angular integration.
Adds component selector for dynamic content creation.

#### Extends

- `GridStackNode`

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="selector-1"></a> `selector?` | `string` | Angular component selector for this node's content | [angular/projects/lib/src/lib/types.ts:27](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L27) |

***

### NgGridStackOptions

Defined in: [angular/projects/lib/src/lib/types.ts:34](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L34)

Extended GridStackOptions interface for Angular integration.
Supports Angular-specific widget definitions and nested grids.

#### Extends

- `GridStackOptions`

#### Properties

| Property | Type | Description | Overrides | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="children"></a> `children?` | [`NgGridStackWidget`](#nggridstackwidget)[] | Array of Angular widget definitions for initial grid setup | `GridStackOptions.children` | [angular/projects/lib/src/lib/types.ts:36](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L36) |
| <a id="subgridopts-1"></a> `subGridOpts?` | [`NgGridStackOptions`](#nggridstackoptions) | Configuration for nested sub-grids (Angular-aware) | `GridStackOptions.subGridOpts` | [angular/projects/lib/src/lib/types.ts:38](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L38) |

## Type Aliases

### NgCompInputs

```ts
type NgCompInputs = object;
```

Defined in: [angular/projects/lib/src/lib/types.ts:54](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/types.ts#L54)

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
