# Design Decisions — GridStack Vue Wrapper

## Why `defineComponent` + `.ts` files instead of `.vue` SFCs?

The library components (`GridStack`, `GridStackItem`) live in `.ts` files using `defineComponent`
with a render function. This mirrors the React wrapper pattern and keeps the library distributable
via `vue-tsc` without requiring a Vue SFC compiler in the library build pipeline.
User-facing widget components (e.g. in demos) are encouraged to use `.vue` SFCs.

---

## Widget identity: `component` + `props`

Widget JSON uses `component: "MyWidget"` and `props: { ... }` — the same API as the React wrapper.
This is intentional: a layout serialized from a React app can be loaded in a Vue app (and vice
versa) without changing the JSON schema. This differs from the Angular wrapper's `selector`/`input`
convention, which uses Angular DI metadata.

---

## No `ref()` for the GridStack instance

Vue 3 `ref()` wraps values in a `Proxy`. GridStack internally compares object references and walks
prototype chains in ways that break under proxy wrapping. This is a known issue documented in the
existing Vue demos (`vue3js.html`). The GridStack instance is stored as a plain `let` variable;
a separate `gridReady: Ref<boolean>` flag is used to make the render function react to grid
initialization without proxying the GS object.

---

## `Teleport` instead of React portals

Vue's built-in `<Teleport>` component is used to render widget content into the
`.grid-stack-item-content` DOM node that GridStack creates. This is the idiomatic Vue equivalent
of `createPortal` in React. It means widget components are always in the Vue component tree (with
full `inject`/`provide` ancestry), and their DOM output appears inside the GS-managed element.

Cross-grid drag-and-drop works without destroying widget subtrees because `<GridStackItem>` stays
mounted (teleporting to whichever `.grid-stack-item-content` element currently owns the widget).

---

## `_gridComp` DOM back-reference

The same pattern used by the React and Angular wrappers: a `GridStackHostApi` object is stamped
onto the `.grid-stack` root element as `el._gridComp`. This lets the static `GridStack.addRemoveCB`
/ `saveCB` / `updateCB` callbacks reach the correct per-grid Vue state without closures or a global
registry. The stamp happens **before** `GridStack.init()` so that callbacks fired during `init()`
(for `options.children`) already see the host API.

---

## `provide`/`inject` for context

Two injection keys are used:
- `GS_CONTEXT_KEY` — provides `{ grid, layoutVersion, registerWidgetSerializer }` to all descendants
- `GS_ITEM_CONTEXT_KEY` — provided by `<GridStackItem>` to its slot content: `{ id, registerSerializer }`

`useGridStack()` and `useGridStackItem()` composables consume these keys, matching the ergonomics
of React's `useGridStack` / `useGridStackItem` hooks.

---

## `useWidgetSerializer`

Widget components that want to persist extra state into `grid.save()` call
`useWidgetSerializer({ serialize: () => ({ ... }) })` in their `setup()`. The serializer is
registered via `GS_ITEM_CONTEXT_KEY` → `GridStackItem`'s local serializer map → the parent
`GridStack`'s `registerWidgetSerializer` call in `gsSaveAdditionalVueInfo`. This mirrors the React
`useWidgetSerializer` hook exactly.

---

## `onVnodeMounted` for the grid root element ref

The `.grid-stack` div uses `onVnodeMounted` (a Vue internal vnode hook) instead of a template
`ref` callback to capture the DOM element reference. This avoids a TypeScript overload conflict
with Vue's `VNodeRef` union type while still firing synchronously before `onMounted`.

---

## `syntheticIds` — GS-driven widget registration

When GS adds a widget (e.g. from `options.children`, `grid.addWidget()`, or DnD between grids)
via `addRemoveCB`, `gsCreateVueComponents` registers the widget ID as a "synthetic ID". The
`<GridStack>` render function renders a `<GridStackItem>` teleport anchor for each synthetic ID,
which in turn teleports the appropriate `component` from the `components` prop into the
GS-created DOM element.

---

## `BaseWidget` abstract class

Provided for parity with the Angular wrapper and for Options API users. Composition API widget
components should use `useWidgetSerializer` instead.
