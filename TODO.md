# Technical Debt / Future Work

Items deferred from the June 2026 code-quality pass. Tackle in order; each builds on the previous.

---

## 1. TypeScript strict mode migration

**Why:** `tsconfig.json` runs with `strict: false` and `noImplicitAny: false`, hiding a whole class of bugs from both the compiler and consumers who rely on the published `.d.ts` declarations.

**Steps:**
1. Enable `"strictNullChecks": true` first (lowest noise). Fix the resulting errors — most are already nullable but were silently untyped.
2. Enable `"noImplicitReturns": true` and `"noImplicitAny": true`. The majority of remaining issues will be in the drag-and-drop internals (`dd-draggable.ts`, `dd-resizable.ts`) and the engine.
3. Finally set `"strict": true` to catch the rest (strict function types, strict property init, etc.).
4. Remove the per-file `// eslint-disable-next-line @typescript-eslint/no-explicit-any` suppressions as each file is cleaned up.

**Estimated scope:** ~50-80 type errors once `strictNullChecks` is on, mostly in `gridstack.ts` and the DD layer.

---

## 2. Break up `gridstack.ts` (~3 100 lines)

**Why:** The single `GridStack` class has grown to cover CSS/cell-height management, responsive/column layout, drag-drop wiring, serialization, and the public API. This makes it hard to navigate and test in isolation.

**Proposed split:**

| New file | Responsibility |
|---|---|
| `gridstack-css.ts` | `cellHeight()`, `_initMargin()`, `_updateStyles()`, CSS variable management |
| `gridstack-column.ts` | `column()`, `checkDynamicColumn()`, `_columnLayouts`, responsive breakpoint logic |
| `gridstack-dnd.ts` | `_setupAcceptWidget()`, `_setupRemoveDrop()`, `_onStartMoving()`, `_onEndMoving()`, drag/resize event wiring |
| `gridstack-serialize.ts` | `save()`, `load()`, `_readAttr()`, `_writePosAttr()` |
| `gridstack.ts` | Public API surface + constructor, thin delegation to the above |

**Approach:** Use mixin-style imports or prototype extension (same pattern the DD layer already uses) so the public class shape is unchanged and no semver break occurs.

---

## 3. Build toolchain consolidation

**Why:** The build currently combines Grunt + webpack + `tsc`. The React/Vue demo apps already use Vite. Consolidating onto a single bundler would simplify CI, reduce dependency surface, and speed up the build.

**Proposed target:** Rollup (or Vite's library mode) for the core `src/` library, keeping the framework wrappers on their own build.

**Steps:**
1. Audit `Gruntfile.js` — identify what it does beyond what `tsc` + webpack already cover (likely banners and legacy UMD output).
2. Replace webpack config with a Rollup config producing ESM + CJS + UMD outputs (same as today).
3. Remove `Gruntfile.js` and the `grunt` dependency once the Rollup outputs match.
4. Update `package.json` `"build"` script.
5. Verify the demo apps still work (`yarn build:ng`, `yarn build:react`).

---

## 4. Accessibility (ARIA) support

**Why:** Grid items are plain `<div>` elements with no ARIA roles or keyboard interaction, making the library unusable for accessibility-sensitive dashboards.

**Minimum viable work:**
- Add `role="grid"` to the container and `role="gridcell"` (or `"group"`) to items.
- Emit `aria-grabbed="true/false"` during drag.
- Document how to layer keyboard-move support on top (arrow keys to move focused item, or provide an optional built-in mode).

---

## 5. `Utils.getValuesFromTransformedElement` — cache per drag session

**Why:** This method creates, appends, reads, and removes a probe `<div>` on every call to calculate CSS transform scale/offset. If called during drag/resize events it triggers repeated forced layout (reflow).

**Fix:** Cache the result on the grid element (or `dragTransform` property) and invalidate only when a `ResizeObserver` or transform change is detected, rather than recomputing each drag tick.
