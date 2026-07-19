# gridstack-item

## Variables

### GridStackItem

```ts
const GridStackItem: DefineComponent<ExtractPropTypes<{
  id: {
     type: StringConstructor;
     required: true;
  };
  options: {
     type: PropType<Partial<GridStackWidget>>;
     default: () => object;
  };
}>, () => VNode<RendererNode, RendererElement, {
[key: string]: any;
}>, {
}, {
}, {
}, ComponentOptionsMixin, ComponentOptionsMixin, {
}, string, PublicProps, ToResolvedProps<ExtractPropTypes<{
  id: {
     type: StringConstructor;
     required: true;
  };
  options: {
     type: PropType<Partial<GridStackWidget>>;
     default: () => object;
  };
}>, {
}>, {
  options: Partial<GridStackWidget>;
}, {
}, {
}, {
}, string, ComponentProvideOptions, true, {
}, any>;
```

Defined in: [vue/projects/lib/src/gridstack-item.ts:25](https://github.com/adumesny/gridstack.js/blob/master/vue/projects/lib/src/gridstack-item.ts#L25)

Teleport anchor for one grid item.
Owns Vue subtree; survives cross-grid DnD while this component stays mounted.

The slot content is teleported into the GS-owned `.grid-stack-item-content` element,
so widget components never need to know about GS DOM internals.
