import { describe, it, expect, afterEach } from 'vitest'
import { createApp, defineComponent, h, ref, type App } from 'vue'
import type { GridHTMLElement } from 'gridstack'
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
})
