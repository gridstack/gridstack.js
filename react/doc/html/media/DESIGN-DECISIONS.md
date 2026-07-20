# React wrapper design decisions

## Two public components

`<GridStack>` and `<GridStackItem>` are the only **required** building blocks. There is no separate React “provider” layer: the grid host installs GridStack’s **static** callbacks once (`installGridStackReactCallbacks`) so `addRemoveCB` / `saveCB` / `updateCB` behave like the Angular wrapper—dispatch through DOM back-refs (`_gridComp` on the grid element, `_gridItemRef` on items) instead of closing over per-app React state.

## Component mode vs templating every cell

**Recommended:** define layout as JSON (`options.children`) plus a `components` map keyed by the `component` field on each widget, mirroring Angular’s `selector` + `input` (`component` + `props`). React content is rendered with **`createPortal`** into `.grid-stack-item-content` so the React tree can stay mounted across drag/reparent when the DOM node moves.

**Not recommended:** driving the grid purely from React with `items.map(() => <GridStackItem>)` as the source of truth for *which* widgets exist. That fights GridStack’s ownership of add/remove and external drops.

## Save / restore

`grid.save()` uses `GridStack.saveCB` to copy `component` / `props` from engine nodes into the serialized widget. `useWidgetSerializer` registers per-item `serialize()` hooks that are merged into `props` during save (via `mergeWidgetPropsForSave` on the host API).

## Types

Public widget/options types extend the core `gridstack` types with optional `component`, `props`, and DOM extensions (`GridHTMLElement`, `GridItemHTMLElement`). Consumers can import from `gridstack/dist/react` after a build that emits `dist/react/`.

## Legacy wrapper

The previous `GridStackProvider` / `GridStackRender` / `GridStackRenderProvider` stack under `react/lib/` has been removed in favor of this API.
