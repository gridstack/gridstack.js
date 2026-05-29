# gridstack-vue

Official Vue 3 wrapper for [GridStack.js](https://gridstackjs.com/).

Mirrors the `gridstack-react` wrapper API while feeling native to Vue:
Composition API, `provide`/`inject`, composables, and `<Teleport>` for zero-destroy widget reparenting.

---

## Quick Start

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { GridStack, type GridStackOptions } from 'gridstack/dist/vue'
import 'gridstack/dist/gridstack.css'

const Text = defineComponent({
  props: { content: { type: String, default: '' } },
  setup(props) { return () => h('div', props.content) },
})

const options: GridStackOptions = {
  cellHeight: 50,
  children: [
    { id: 'a', x: 0, y: 0, w: 3, h: 2, component: 'Text', props: { content: 'Hello!' } },
  ],
}
</script>

<template>
  <GridStack :options="options" :components="{ Text }" />
</template>
```

---

## API

### `<GridStack>`

| Prop | Type | Description |
|---|---|---|
| `options` | `GridStackOptions` | GridStack init options, including `children` for the initial layout |
| `components` | `ComponentMap` | Map `component` string keys → Vue components |

**Emits:** `added`, `change`, `removed`, `drag`, `dragstart`, `dragstop`, `dropped`, `resize`, `resizestart`, `resizestop`

**Exposed:** `getGrid()` → `GridStack | null` (for imperative access via template ref)

**Default slot:** rendered _outside_ the `.grid-stack` div — use for toolbars, debug panels, etc.

```vue
<GridStack :options="opts" :components="comps">
  <Toolbar />   <!-- rendered beside the grid, not inside it -->
</GridStack>
```

---

### `useGridStack()`

Composable for children of `<GridStack>`:

```ts
const { grid, addWidget, removeWidget, removeAll, save, load, layoutVersion } = useGridStack()
```

---

### `useGridStackItem()`

Composable for components rendered _inside_ a widget slot:

```ts
const { id, node } = useGridStackItem()
// node is the live GridStackNode (position, size, etc.)
```

---

### `useWidgetSerializer()`

Persist extra widget state into `grid.save()`:

```ts
const count = ref(0)
useWidgetSerializer({
  serialize: () => ({ count: count.value }),
  // deserialize: (data) => { count.value = data.count }  // optional
})
```

---

### Widget JSON schema

Widgets are described by `GridStackWidget` objects (extends the core type):

```ts
interface GridStackWidget {
  id?: string
  x?: number; y?: number; w?: number; h?: number
  component?: string   // key in the `components` map
  props?: Record<string, unknown>  // passed as props to the component
  subGridOpts?: GridStackOptions   // for nested sub-grids
  // ... all standard GridStack widget options
}
```

---

## Widget reparenting (cross-grid DnD)

Widget components are mounted once and survive being dragged between grids.
`<GridStackItem>` uses Vue's `<Teleport>` to move slot content into whichever
`.grid-stack-item-content` element currently owns the widget — no destroy/remount.

---

## Development

```sh
cd vue
npm install
npm run dev        # Vite dev server (demo app)
npm run build      # production build of the demo
npm run build:lib  # compile the library to dist/vue/
npm run test       # vitest
```

---

## How it compares to the Angular wrapper

| | Angular | Vue |
|---|---|---|
| Component key | `selector` | `component` |
| Component data | `input` | `props` |
| Serialization | `BaseWidget.serialize()` | `useWidgetSerializer()` (or `BaseWidget`) |
| Context | `@Input()` / DI | `provide`/`inject` + composables |
| DOM injection | `ViewContainerRef` | `<Teleport>` |
