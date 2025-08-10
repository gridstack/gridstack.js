# base-widget

## Classes

### `abstract` BaseWidget

Defined in: [angular/projects/lib/src/lib/base-widget.ts:39](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/base-widget.ts#L39)

Base widget class for GridStack Angular integration.

#### Constructors

##### Constructor

```ts
new BaseWidget(): BaseWidget;
```

###### Returns

[`BaseWidget`](#basewidget)

#### Methods

##### serialize()

```ts
serialize(): undefined | NgCompInputs;
```

Defined in: [angular/projects/lib/src/lib/base-widget.ts:66](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/base-widget.ts#L66)

Override this method to return serializable data for this widget.

Return an object with properties that map to your component's @Input() fields.
The selector is handled automatically, so only include component-specific data.

###### Returns

`undefined` \| [`NgCompInputs`](types.md#ngcompinputs)

Object containing serializable component data

###### Example

```typescript
serialize() {
  return {
    title: this.title,
    value: this.value,
    settings: this.settings
  };
}
```

##### deserialize()

```ts
deserialize(w): void;
```

Defined in: [angular/projects/lib/src/lib/base-widget.ts:88](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/base-widget.ts#L88)

Override this method to handle widget restoration from saved data.

Use this for complex initialization that goes beyond simple @Input() mapping.
The default implementation automatically assigns input data to component properties.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w` | [`NgGridStackWidget`](types.md#nggridstackwidget) | The saved widget data including input properties |

###### Returns

`void`

###### Example

```typescript
deserialize(w: NgGridStackWidget) {
  super.deserialize(w); // Call parent for basic setup
  
  // Custom initialization logic
  if (w.input?.complexData) {
    this.processComplexData(w.input.complexData);
  }
}
```

#### Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="widgetitem"></a> `widgetItem?` | `public` | [`NgGridStackWidget`](types.md#nggridstackwidget) | Complete widget definition including position, size, and Angular-specific data. Populated automatically when the widget is loaded or saved. | [angular/projects/lib/src/lib/base-widget.ts:45](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/base-widget.ts#L45) |
