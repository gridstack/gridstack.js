# gridstack

## Variables

### GridStackComponent

```ts
const GridStackComponent: DefineComponent<ExtractPropTypes<{
  options: {
     type: PropType<GridStackOptions>;
     required: true;
  };
  components: {
     type: PropType<ComponentMap>;
     default: () => object;
  };
}>, () => VNode<RendererNode, RendererElement, {
[key: string]: any;
}>, {
}, {
}, {
}, ComponentOptionsMixin, ComponentOptionsMixin, (
  | "change"
  | "drag"
  | "dragstart"
  | "resize"
  | "added"
  | "removed"
  | "enable"
  | "disable"
  | "dragstop"
  | "dropped"
  | "resizestart"
  | "resizestop")[], 
  | "change"
  | "drag"
  | "dragstart"
  | "resize"
  | "added"
  | "removed"
  | "enable"
  | "disable"
  | "dragstop"
  | "dropped"
  | "resizestart"
  | "resizestop", PublicProps, ToResolvedProps<ExtractPropTypes<{
  options: {
     type: PropType<GridStackOptions>;
     required: true;
  };
  components: {
     type: PropType<ComponentMap>;
     default: () => object;
  };
}>, (
  | "change"
  | "drag"
  | "dragstart"
  | "resize"
  | "added"
  | "removed"
  | "enable"
  | "disable"
  | "dragstop"
  | "dropped"
  | "resizestart"
  | "resizestop")[]>, {
  components: ComponentMap;
}, {
}, {
}, {
}, string, ComponentProvideOptions, true, {
}, any>;
```

Defined in: [vue/projects/lib/src/gridstack.ts:41](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/gridstack.ts#L41)

`<GridStack>` — root component.

- Pass `options` (with `children`) to seed the initial layout.
- Pass `components` to map `component` strings in widget JSON to Vue components.
- Listens to all GS events via emits; also exposes `getGrid()` for imperative access.
- Use the `#empty` slot to render content when the grid has no items.
- Slot content (default) is rendered _outside_ the `.grid-stack` div (host chrome: toolbars etc.).

## Type Aliases

### ComponentMap

```ts
type ComponentMap = Record<string, Component>;
```

Defined in: [vue/projects/lib/src/gridstack.ts:30](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/gridstack.ts#L30)

Maps `component` JSON keys to Vue components (props merged from saved `props`).
