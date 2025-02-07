# React GridStack Wrapper Demo

A React wrapper component for GridStack that provides better TypeScript support and React integration experience.

Open in [CodeSandbox](https://codesandbox.io/p/sandbox/github/gridstack/gridstack.js/tree/master/react?file=/src/App.tsx)

## TODO

- [x] Add Widgets
- [x] Add Sub Grid
- [x] Nested Sub Grid
- [x] Remove Widget
- [x] Copy(Duplicate) Widget
- [x] Custom handle
- [ ] Drag between two grid stacks

Welcome to give any suggestions and ideas, you can submit an issue or contact me by email. :)

## Usage

**Simple**

Render item with widget id selector.

```tsx
function App() {
  const [uncontrolledInitialOptions] = useState<GridStackOptions>({
    // ...
    children: [
      { id: "item1", h: 2, w: 2, x: 0, y: 0 },
      { id: "item2", h: 2, w: 2, x: 2, y: 0 },
    ],
  });

  return (
    <GridStackProvider initialOptions={uncontrolledInitialOptions}>
      <Toolbar />

      <GridStackRender>
        <GridStackItem id="item1">
          <div>hello</div>
        </GridStackItem>

        <GridStackItem id="item2">
          <div>grid</div>
        </GridStackItem>
      </GridStackRender>
    </GridStackProvider>
  );
}
```

**Advanced**

Render item with widget map component info.

_ComponentInfoMap is just an example, you can use any way you want to store and retrieve component information._

```tsx
function App() {
  const [uncontrolledInitialOptions] = useState<GridStackOptions>({
    // ...
    children: [
      { id: "item1", h: 2, w: 2, x: 0, y: 0 },
      { id: "item2", h: 2, w: 2, x: 2, y: 0 },
    ],
  });

  const [initialComponentInfoMap] = useState<Record<string, ComponentInfo>>(
    () => ({
      item1: { component: "Text", serializableProps: { content: "Text" } },
      item2: {
        component: "ComplexCard",
        serializableProps: { title: "Complex Card", color: "red" },
      },
    })
  );

  return (
    <ComponentInfoMapProvider initialComponentInfoMap={initialComponentInfoMap}>
      <GridStackProvider initialOptions={uncontrolledInitialOptions}>
        <Toolbar />

        <GridStackRender>
          <DynamicGridStackItems />
        </GridStackRender>
      </GridStackProvider>
    </ComponentInfoMapProvider>
  );
}

export function DynamicGridStackItems() {
  const { componentInfoMap } = useComponentInfoMap();

  return (
    <>
      {Array.from(componentInfoMap.entries()).map(
        ([widgetId, componentInfo]) => {
          const Component = COMPONENT_MAP[componentInfo.component];
          if (!Component) {
            throw new Error(`Component ${componentInfo.component} not found`);
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const props = componentInfo.serializableProps as any;

          if (componentInfo.component === "ComplexCard") {
            return (
              <GridStackItem key={widgetId} id={widgetId}>
                <ComplexCardEditableWrapper
                  key={`complex-card-editable-wrapper-${widgetId}`}
                  serializableProps={componentInfo.serializableProps}
                >
                  <Component {...props} key={`component-${widgetId}`} />
                </ComplexCardEditableWrapper>
              </GridStackItem>
            );
          }

          return (
            <GridStackItem key={widgetId} id={widgetId}>
              <Component {...props} key={`component-${widgetId}`} />
            </GridStackItem>
          );
        }
      )}
    </>
  );
}
```

**Experimental**

Render item with custom handle.

```tsx
<GridStackItem id="xxx">
  <GridStackHandleReInitializer>
    <button className={CUSTOM_DRAGGABLE_HANDLE_CLASSNAME}>
      Handle ONLY HERE
    </button>
  </GridStackHandleReInitializer>
</GridStackItem>
```

## API Reference

### Components

#### GridStackProvider

Top-level component that provides GridStack context.

```typescript
type GridStackProviderProps = {
  initialOptions: GridStackOptions; // GridStack initialization options
  children: React.ReactNode;
};
```

#### GridStackRender

Render GridStack root container component.

```typescript
type GridStackRenderProps = {
  children: React.ReactNode;
};
```

#### GridStackItem

Component representing a single grid item.

```typescript
type GridStackItemProps = {
  id: string; // Grid item unique identifier
  children: React.ReactNode;
};
```

#### GridStackHandleReInitializer

Experimental component for reinitializing the drag handle of a grid item.

```typescript
type GridStackHandleReInitializerProps = {
  children: React.ReactNode;
};
```

### Contexts

#### GridStackContext

Provide GridStack core functionality context.

```typescript
interface GridStackContextType {
  initialOptions: GridStackOptions;
  addWidget: (widget: GridStackWidget) => void;
  removeWidget: (el: GridStackElement) => void;
  saveOptions: () => ReturnType<GridStack["save"]> | undefined;

  _gridStack: {
    value: GridStack | null;
    set: React.Dispatch<React.SetStateAction<GridStack | null>>;
  };
}
```

#### GridStackItemContext

Provide single grid item functionality context.

```typescript
type GridStackItemContextType = {
  id: string;
  // Native methods
  remove: () => void;
  update: (opt: GridStackWidget) => void;

  // Extended methods
  getBounds: () => {
    current: { x?: number; y?: number; w?: number; h?: number };
    original: { x?: number; y?: number; w?: number; h?: number };
  } | null;
  setSize: (size: { w: number; h: number }) => void;
  setPosition: (position: { x: number; y: number }) => void;
};
```

#### GridStackRenderContext

Provide rendering related functionality context.

```typescript
type GridStackRenderContextType = {
  getWidgetContainer: (widgetId: string) => HTMLElement | null;
};
```

### Hooks

#### useGridStackContext

Get GridStack context.

```typescript
function useGridStackContext(): GridStackContextType;
```

#### useGridStackItemContext

Get grid item context.

```typescript
function useGridStackItemContext(): GridStackItemContextType;
```

#### useGridStackRenderContext

Get rendering context.

```typescript
function useGridStackRenderContext(): GridStackRenderContextType;
```

### Type Exports

```typescript
export type {
  GridStackContextType,
  GridStackProviderProps,
  GridStackRenderContextType,
  GridStackRenderProps,
  GridStackItemProps,
  GridStackItemContextType,
  GridStackHandleReInitializerProps,
};
```
