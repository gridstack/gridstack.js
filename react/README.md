# React wrapper

The React wrapper lives in `projects/lib/src/` and is published with the main `gridstack` package as **`gridstack/dist/react`** (same idea as `gridstack/dist/angular`).

Live demo app: `cd react && yarn && yarn dev`.

See [DESIGN-DECISIONS.md](DESIGN-DECISIONS.md) for architecture (static callbacks, portals, save/restore).

---

## Basic usage

Use `<GridStack>` with `options` and optional `components` for dynamic widget types.

**CSS**

```css
@import "gridstack/dist/gridstack.css";

.grid-stack {
  background: #fafad2;
}
.grid-stack-item-content {
  text-align: center;
  background-color: #18bc9c;
}
```

**TSX**

```tsx
import { GridStackOptions } from "gridstack";
import { GridStack } from "gridstack/dist/react";

const options: GridStackOptions = {
  margin: 8,
  cellHeight: 50,
  column: 12,
  children: [
    { id: "1", x: 0, y: 0, w: 2, h: 2, content: "Plain HTML item" },
  ],
};

export function Board() {
  return <GridStack options={options} />;
}
```

---

## Component mode (recommended)

Put a `component` key on each child widget and pass a `components` map (like Angular dynamic `selector` types).

```tsx
import { GridStackOptions } from "gridstack";
import { GridStack } from "gridstack/dist/react";

function Text({ text }: { text: string }) {
  return <div>{text}</div>;
}

const options: GridStackOptions = {
  column: 12,
  cellHeight: 50,
  children: [
    { id: "a", x: 0, y: 0, w: 2, h: 2, component: "Text", props: { text: "Hello" } },
  ],
};

export function Board() {
  return <GridStack options={options} components={{ Text }} />;
}
```

---

## Toolbar / API access with `useGridStack`

`useGridStack()` must be used **inside** `<GridStack>` (e.g. in a child component). It exposes `grid`, `addWidget`, `removeWidget`, `save`, etc.

React **`children`** of `<GridStack>` are rendered **after** the grid’s `.grid-stack` root in the DOM, so host UI (toolbars, debug readouts) appears **below** the grid instead of sharing the absolutely positioned canvas.

```tsx
import { GridStack } from "gridstack/dist/react";
import { useGridStack } from "gridstack/dist/react";

function Toolbar() {
  const { addWidget } = useGridStack();
  return (
    <button
      type="button"
      onClick={() =>
        addWidget?.({
          id: "new-" + Date.now(),
          w: 2,
          h: 2,
          x: 0,
          y: 0,
          component: "Text",
          props: { text: "Added" },
        })
      }
    >
      Add
    </button>
  );
}

export function Board() {
  return (
    <GridStack options={options} components={{ Text }}>
      <Toolbar />
    </GridStack>
  );
}
```

---

## Multiple grids

Render several `<GridStack>` instances (e.g. with `acceptWidgets: true`) to drag between grids—same pattern as Angular.

---

## Nested subgrids

Use `subGridOpts.children` on a widget; nested grids use the same `components` map from the parent `<GridStack>`.

---

## Save and restore

```tsx
const { grid, save } = useGridStack();

const json = JSON.stringify(save?.(true, false)); // widget list
// later:
grid?.load(JSON.parse(json));
```

Optional: **`useWidgetSerializer`** inside a widget component merges extra fields into `props` on save.

---

## Migration from legacy `react/lib`

| Legacy | New |
|--------|-----|
| `<GridStackProvider>` + `<GridStackRenderProvider>` + `<GridStackRender>` | Single `<GridStack options={...} components={...}>` |
| `content: JSON.stringify({ name, props })` | `component` + `props` on the widget |
| `useGridStackContext()` | `useGridStack()` |

The old files have been moved to `react/lib/_old/` for reference and are excluded from the bundle.

---

## Custom drag handles inside content

By default GridStack uses the item's outer `.grid-stack-item-content` div as the drag handle.
If you set a custom `draggable.handle` that lives **inside** your React component, call `grid.refreshDragHandles(el)` after the content renders so GridStack can re-scan and attach listeners to the new handle element.

```tsx
import { useEffect, useRef } from "react";
import { useGridStack } from "gridstack/dist/react";

function MyWidget() {
  const { grid } = useGridStack();
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!handleRef.current) return;
    const itemEl = handleRef.current.closest(".grid-stack-item") as HTMLElement | null;
    if (itemEl) grid?.refreshDragHandles(itemEl);
  }, [grid]);

  return (
    <div>
      <div ref={handleRef} className="my-drag-handle" style={{ cursor: "grab", padding: 8 }}>
        ☰ drag here
      </div>
      <p>content</p>
    </div>
  );
}

// Grid must be initialised with draggable.handle pointing at the same selector:
const options: GridStackOptions = {
  draggable: { handle: ".my-drag-handle" },
  children: [{ id: "a", x: 0, y: 0, w: 3, h: 2, component: "MyWidget" }],
};

export function Board() {
  return <GridStack options={options} components={{ MyWidget }} />;
}
```

`refreshDragHandles` is called automatically by `<GridStackItem>` after each portal render, so the above pattern is only needed when you manage the item element yourself (e.g. via `useGridStack().grid` directly).

---

## Building `dist/react`

Uses the TypeScript project [`projects/lib/tsconfig.build.json`](projects/lib/tsconfig.build.json) (ESM `.js` + `.d.ts`).

From the repo root:

```bash
yarn build:react
```

Or from `react/`:

```bash
yarn build:lib
```

Output: `dist/react/` at the **repository root** (alongside `dist/angular/`), so published `gridstack` npm tarball includes it via the `files` field.
