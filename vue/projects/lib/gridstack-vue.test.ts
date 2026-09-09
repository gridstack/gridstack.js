import { describe, it, expect, afterEach } from 'vitest'
import { createApp, defineComponent, h, ref, type App } from 'vue'
import type { GridHTMLElement, GridItemHTMLElement, GridStack as GridStackInstance } from 'gridstack'
import type { GridStackWidget } from './src/types'
import { GridStack } from './src/gridstack'
import { useWidgetSerializer } from './src/composables'

function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 50))
}

/** Mount a Vue app into a fresh div and return { app, container }. */
function mountApp(component: ReturnType<typeof defineComponent> | ReturnType<typeof h>) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const app = createApp(typeof component === 'object' && 'setup' in component
    ? component
    : defineComponent({ render: () => component }))
  app.mount(container)
  return { app, container }
}

/**
 * Replicates the DOM/engine bookkeeping GS core does in the `drop` handler when an
 * item is dragged from one live grid into another (gridstack.ts `.on(this.el, 'drop', ...)`):
 * the item element is reused via `appendChild` (no `addRemoveCB` call) and the node object
 * is moved from one engine's node list to the other's. Used to reproduce cross-grid DnD
 * without driving the real pointer-based drag/drop implementation through jsdom.
 */
function simulateCrossGridDrop(from: GridStackInstance, to: GridStackInstance, el: GridItemHTMLElement) {
  const node = el.gridstackNode!
  const f = from as unknown as { engine: { nodes: unknown[]; removedNodes: unknown[]; removeNodeFromLayoutCache(n: unknown): void }; _triggerRemoveEvent(): unknown; _triggerChangeEvent(): unknown }
  const t = to as unknown as { engine: { nodes: unknown[]; addedNodes: unknown[] }; el: HTMLElement; _triggerAddEvent(): unknown; _triggerChangeEvent(): unknown }

  f.engine.removeNodeFromLayoutCache(node)
  f.engine.nodes = f.engine.nodes.filter((n) => n !== node)
  f.engine.removedNodes.push(node)
  f._triggerRemoveEvent()
  f._triggerChangeEvent()

  node.grid = to
  t.engine.nodes.push(node)
  t.el.appendChild(el)
  t.engine.addedNodes.push(node)
  t._triggerAddEvent()
  t._triggerChangeEvent()
}

describe('GridStack Vue wrapper', () => {
  let app: App
  let container: HTMLDivElement

  afterEach(() => {
    app?.unmount()
    container?.remove()
  })

  it('renders component mode into .grid-stack-item-content via teleport', async () => {
    const T = defineComponent({
      props: { label: { type: String, default: '' } },
      setup(props) {
        return () => h('span', { 'data-testid': 'portal' }, props.label)
      },
    })

    const Root = defineComponent({
      setup() {
        const options = {
          column: 12, cellHeight: 50, margin: 0,
          children: [
            { id: 'a', x: 0, y: 0, w: 2, h: 2, component: 'T', props: { label: 'hello' } },
          ],
        }
        return () =>
          h(GridStack, { options, components: { T } })
      },
    })

    ;({ app, container } = mountApp(Root))
    await flush()

    expect(document.querySelector('[data-testid="portal"]')?.textContent).toBe('hello')
  })

  it('save() merges useWidgetSerializer into widget props', async () => {
    const Num = defineComponent({
      props: { start: { type: Number, default: 0 } },
      setup(props) {
        const n = ref(props.start)
        useWidgetSerializer({ serialize: () => ({ extra: n.value }) })
        return () => h('span', { 'data-testid': 'num' }, String(n.value))
      },
    })

    const Root = defineComponent({
      setup() {
        const options = {
          column: 12, cellHeight: 50, margin: 0,
          children: [
            { id: 'c1', x: 0, y: 0, w: 2, h: 2, component: 'Num', props: { start: 7 } },
          ],
        }
        return () =>
          h(GridStack, { options, components: { Num } })
      },
    })

    ;({ app, container } = mountApp(Root))
    await flush()

    const gridEl = container.querySelector('.grid-stack') as GridHTMLElement
    const g = gridEl?.gridstack
    expect(g).toBeTruthy()
    const saved = g!.save(true, false) as GridStackWidget[]
    const w = saved.find((n) => String(n.id) === 'c1')
    expect(w?.props?.extra).toBe(7)
  })

  it('supports two sibling grids', async () => {
    const Root = defineComponent({
      setup() {
        return () =>
          h('div', [
            h(GridStack, { options: { column: 12, cellHeight: 40, margin: 0, children: [] }, components: {} }),
            h(GridStack, { options: { column: 6, cellHeight: 40, margin: 0, children: [] }, components: {} }),
          ])
      },
    })

    ;({ app, container } = mountApp(Root))
    await flush()

    expect(container.querySelectorAll('.grid-stack').length).toBe(2)
  })

  it('keeps slot content outside the .grid-stack root (no overlap with items)', async () => {
    const Root = defineComponent({
      setup() {
        return () =>
          h(
            GridStack,
            { options: { column: 12, cellHeight: 40, margin: 0, children: [] }, components: {} },
            { default: () => h('div', { 'data-testid': 'host-chrome' }, 'toolbar') },
          )
      },
    })

    ;({ app, container } = mountApp(Root))
    await flush()

    const chrome = container.querySelector('[data-testid="host-chrome"]')
    const stack = container.querySelector('.grid-stack')
    expect(chrome).toBeTruthy()
    expect(stack).toBeTruthy()
    expect(stack?.contains(chrome)).toBe(false)
  })

  it('unmount destroys without throwing', async () => {
    const T = defineComponent({
      props: { t: { type: String, default: '' } },
      setup(props) { return () => h('span', props.t) },
    })

    const show = ref(true)
    const Root = defineComponent({
      setup() {
        return () =>
          show.value
            ? h(GridStack, {
                options: {
                  column: 12, cellHeight: 40,
                  children: [{ id: 'x', x: 0, y: 0, w: 1, h: 1, component: 'T', props: { t: 'x' } }],
                },
                components: { T },
              })
            : h('div')
      },
    })

    ;({ app, container } = mountApp(Root))
    await flush()

    show.value = false
    await flush()

    expect(container.querySelector('.grid-stack')).toBeNull()
  })

  it('keeps component content rendered after cross-grid drag & drop (#3371)', async () => {
    const T = defineComponent({
      props: { label: { type: String, default: '' } },
      setup(props) {
        return () => h('span', { 'data-testid': 'portal' }, props.label)
      },
    })

    const Root = defineComponent({
      setup() {
        const optionsA = {
          column: 12, cellHeight: 50, margin: 0, acceptWidgets: true,
          children: [
            { id: 'a1', x: 0, y: 0, w: 2, h: 2, component: 'T', props: { label: 'hello' } },
          ],
        }
        const optionsB = {
          column: 12, cellHeight: 50, margin: 0, acceptWidgets: true,
          children: [] as GridStackWidget[],
        }
        return () =>
          h('div', [
            h(GridStack, { options: optionsA, components: { T } }),
            h(GridStack, { options: optionsB, components: { T } }),
          ])
      },
    })

    ;({ app, container } = mountApp(Root))
    await flush()

    expect(document.querySelector('[data-testid="portal"]')?.textContent).toBe('hello')

    const [gridElA, gridElB] = Array.from(container.querySelectorAll('.grid-stack')) as GridHTMLElement[]
    const gridA = gridElA.gridstack!
    const gridB = gridElB.gridstack!
    const itemEl = gridElA.querySelector('.grid-stack-item') as GridItemHTMLElement

    simulateCrossGridDrop(gridA, gridB, itemEl)
    await flush()

    // The item's DOM element physically moved into grid B's container...
    expect(gridElB.contains(itemEl)).toBe(true)
    // ...and its Vue-rendered content must have followed, not been unmounted.
    expect(document.querySelector('[data-testid="portal"]')?.textContent).toBe('hello')
  })
})
