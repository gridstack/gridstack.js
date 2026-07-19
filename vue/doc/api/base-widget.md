# base-widget

## Classes

### `abstract` BaseWidget

Defined in: [vue/projects/lib/src/base-widget.ts:23](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/base-widget.ts#L23)

Optional abstract base for widget components that participate in `grid.save()` / `grid.load()`.

For Composition API widgets, prefer `useWidgetSerializer()` instead.
This class is provided for parity with the Angular wrapper and for Options API users.

#### Example

```ts
export default defineComponent({
  extends: BaseWidget,
  setup(_, { expose }) {
    const count = ref(0)
    expose({
      serialize: () => ({ count: count.value }),
      deserialize: (w) => { count.value = w.props?.count as number ?? 0 },
    })
  },
})
```

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
serialize(): Record<string, unknown>;
```

Defined in: [vue/projects/lib/src/base-widget.ts:26](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/base-widget.ts#L26)

###### Returns

`Record`\<`string`, `unknown`\>

##### deserialize()

```ts
deserialize(w): void;
```

Defined in: [vue/projects/lib/src/base-widget.ts:30](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/base-widget.ts#L30)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `w` | [`GridStackWidget`](types.md#gridstackwidget) |

###### Returns

`void`

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="widgetitem"></a> `widgetItem?` | `public` | [`GridStackWidget`](types.md#gridstackwidget) | [vue/projects/lib/src/base-widget.ts:24](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/base-widget.ts#L24) |
