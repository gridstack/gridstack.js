# React GridStack Wrapper Demo

A React wrapper component for GridStack that provides better TypeScript support and React integration experience.

## TODO

- [x] Component mapping
- [x] SubGrid support
- [ ] Save and restore layout
- [ ] Publish to npm

## Basic Usage

This is not an npm package, it's just a demo project. Please copy the relevant code to your project to use it.

```tsx
import {
  GridStackProvider,
  GridStackRender,
  GridStackRenderProvider,
} from "path/to/lib";
import "gridstack/dist/gridstack.css";
import "path/to/demo.css";

function Text({ content }: { content: string }) {
  return <div>{content}</div>;
}

const COMPONENT_MAP = {
  Text,
  // ... other components
};

// Grid options
const gridOptions = {
  acceptWidgets: true,
  margin: 8,
  cellHeight: 50,
  children: [
    {
      id: "item1",
      h: 2,
      w: 2,
      content: JSON.stringify({
        name: "Text",
        props: { content: "Item 1" },
      }),
    },
    // ... other grid items
  ],
};

function App() {
  return (
    <GridStackProvider initialOptions={gridOptions}>
      <!-- Maybe a toolbar here. Access to addWidget and addSubGrid by useGridStackContext() -->

      <!-- Grid Stack Root Element -->
      <GridStackRenderProvider>
        <!-- Grid Stack Default Render -->
        <GridStackRender componentMap={COMPONENT_MAP} />
      </GridStackRenderProvider>

      <!-- Maybe other UI here -->
    </GridStackProvider>
  );
}
```

## Advanced Features

### Toolbar Operations

Provide APIs to add new components and sub-grids:

```tsx
function Toolbar() {
  const { addWidget, addSubGrid } = useGridStackContext();

  return (
    <div>
      <button onClick={() => addWidget(/* ... */)}>Add Component</button>
      <button onClick={() => addSubGrid(/* ... */)}>Add SubGrid</button>
    </div>
  );
}
```

### Layout Saving

Get the current layout:

```tsx
const { saveOptions } = useGridStackContext();

const currentLayout = saveOptions();
```

## API Reference

### GridStackProvider

The main context provider, accepts the following properties:

- `initialOptions`: Initial configuration options for GridStack

### GridStackRender

The core component for rendering the grid, accepts the following properties:

- `componentMap`: A mapping from component names to actual React components

### Hooks

- `useGridStackContext()`: Access GridStack context and operations
  - `addWidget`: Add a new component
  - `addSubGrid`: Add a new sub-grid
  - `saveOptions`: Save current layout
  - `initialOptions`: Initial configuration options
