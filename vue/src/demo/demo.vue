<script setup lang="ts">
import { defineComponent, ref, h, onBeforeUnmount } from 'vue'
import {
  GridStack,
  useGridStack,
  useWidgetSerializer,
  type GridStackOptions,
  type GridStackWidget,
} from 'gridstack/dist/vue'

import 'gridstack/dist/gridstack.css'
import './demo.css'

// ---------------------------------------------------------------------------
// Widget components
// ---------------------------------------------------------------------------

/** Simple text display widget. Receives `content` via `props` in the widget JSON. */
const TextWidget = defineComponent({
  name: 'TextWidget',
  props: {
    content: { type: String, default: '' },
  },
  setup(props) {
    return () =>
      h('div', { class: 'w-full h-full' }, props.content)
  },
})

/** Counter widget — persists `count` back into `props.count` on `grid.save()`. */
const CounterWidget = defineComponent({
  name: 'CounterWidget',
  props: {
    label: { type: String, default: '' },
  },
  setup(props) {
    const count = ref(0)

    useWidgetSerializer({
      serialize: () => ({ count: count.value }),
    })

    return () =>
      h('div', { class: 'w-full h-full' }, [
        h('div', props.label),
        h('button', { type: 'button', onClick: () => count.value++ }, `count: ${count.value}`),
      ])
  },
})

// Component map — keys match the `component` field in widget JSON.
const COMPONENTS = { Text: TextWidget, Counter: CounterWidget }

// ---------------------------------------------------------------------------
// Grid options
// ---------------------------------------------------------------------------

const CELL_HEIGHT = 50
const BREAKPOINTS = [
  { c: 1, w: 700 },
  { c: 3, w: 850 },
  { c: 6, w: 950 },
  { c: 8, w: 1100 },
]

function baseOptions(): GridStackOptions {
  return {
    acceptWidgets: true,
    columnOpts: {
      breakpointForWindow: true,
      breakpoints: BREAKPOINTS,
      layout: 'moveScale',
      columnMax: 12,
    },
    margin: 8,
    cellHeight: CELL_HEIGHT,
    subGridOpts: {
      acceptWidgets: true,
      columnOpts: {
        breakpoints: BREAKPOINTS,
        layout: 'moveScale',
      },
      margin: 8,
      minRow: 2,
      cellHeight: CELL_HEIGHT,
    },
    children: [
      { id: 'item1', h: 2, w: 2, x: 0, y: 0, component: 'Text', props: { content: 'Item 1' } },
      { id: 'item2', h: 2, w: 2, x: 2, y: 0, component: 'Text', props: { content: 'Item 2' } },
      { id: 'item3', h: 2, w: 2, x: 4, y: 0, component: 'Text', props: { content: 'Item 3' } },
      {
        id: 'sub-grid-1',
        h: 5,
        sizeToContent: true,
        subGridOpts: {
          acceptWidgets: true,
          cellHeight: CELL_HEIGHT,
          column: 'auto',
          minRow: 2,
          margin: 8,
          children: [
            { id: 'sub-item1', h: 2, w: 4, x: 0, y: 0, component: 'Text', props: { content: 'Sub-item 1' } },
            { id: 'sub-item2', h: 2, w: 4, x: 4, y: 0, component: 'Text', props: { content: 'Sub-item 2' } },
          ],
        },
        w: 12,
        x: 0,
        y: 2,
      },
    ],
    lazyLoad: true,
  }
}

const gridOptions = baseOptions()

// ---------------------------------------------------------------------------
// Toolbar (uses useGridStack composable)
// ---------------------------------------------------------------------------

const Toolbar = defineComponent({
  name: 'Toolbar',
  props: {
    savedJson: { type: String as () => string | null, default: null },
  },
  emits: ['save-json'],
  setup(props, { emit }) {
    const { addWidget, save, grid } = useGridStack()

    function handleAddText() {
      const id = `widget-${Math.random().toString(36).slice(2, 11)}`
      addWidget({ id, w: 2, h: 2, x: 0, y: 0, component: 'Text', props: { content: id } })
    }

    function handleAddSubgrid() {
      const subGridId = `sub-grid-${Math.random().toString(36).slice(2, 11)}`
      const widgetId = `widget-${Math.random().toString(36).slice(2, 11)}`
      addWidget({
        id: subGridId,
        h: 5,
        noResize: false,
        sizeToContent: true,
        subGridOpts: {
          acceptWidgets: true,
          columnOpts: { breakpoints: BREAKPOINTS, layout: 'moveScale' },
          margin: 8,
          minRow: 2,
          cellHeight: CELL_HEIGHT,
          children: [
            {
              id: widgetId,
              h: 1,
              locked: true,
              noMove: true,
              noResize: true,
              w: 12,
              x: 0,
              y: 0,
              component: 'Text',
              props: { content: `Subgrid ${widgetId}` },
            },
          ],
        },
        w: 12,
        x: 0,
        y: 0,
      })
    }

    function handleSave() {
      const data = save(true, false)
      if (data) emit('save-json', JSON.stringify(data, null, 2))
    }

    function handleRestore() {
      if (!props.savedJson || !grid) return
      try {
        const parsed = JSON.parse(props.savedJson) as GridStackWidget[]
        grid.load(parsed)
      } catch (e) {
        console.error(e)
      }
    }

    return () =>
      h('div', { class: 'demo-toolbar' }, [
        h('button', { type: 'button', onClick: handleAddText }, 'Add Text (2×2)'),
        h('button', { type: 'button', onClick: handleAddSubgrid }, 'Add subgrid (12×5)'),
        h('button', { type: 'button', onClick: handleSave }, 'Save layout (JSON)'),
        h('button', {
          type: 'button',
          onClick: handleRestore,
          disabled: !props.savedJson,
        }, 'Restore saved JSON'),
      ])
  },
})

// ---------------------------------------------------------------------------
// DebugPanel (polls save() every 2s)
// ---------------------------------------------------------------------------

const DebugPanel = defineComponent({
  name: 'DebugPanel',
  setup() {
    const { save } = useGridStack()
    const snapshot = ref('')

    const timer = setInterval(() => {
      const data = save(true, false)
      if (data) snapshot.value = JSON.stringify(data, null, 2)
    }, 2000)

    onBeforeUnmount(() => clearInterval(timer))

    return () =>
      h('div', { class: 'demo-debug' }, [
        h('h4', 'Live save() snapshot (~2s)'),
        h('pre', { class: 'demo-pre' }, snapshot.value || '…'),
      ])
  },
})

// ---------------------------------------------------------------------------
// GridPanel (one self-contained grid with toolbar + debug)
// ---------------------------------------------------------------------------

const GridPanel = defineComponent({
  name: 'GridPanel',
  props: {
    title: { type: String, required: true },
    options: { type: Object as () => GridStackOptions, required: true },
  },
  setup(props) {
    const savedJson = ref<string | null>(null)

    return () =>
      h('section', { style: 'margin-bottom: 2rem' }, [
        h('h3', props.title),
        h(GridStack, { options: props.options, components: COMPONENTS }, {
          default: () => [
            h(Toolbar, {
              savedJson: savedJson.value,
              onSaveJson: (json: string) => { savedJson.value = json },
            }),
            h(DebugPanel),
          ],
        }),
      ])
  },
})
</script>

<template>
  <div>
    <p>
      Layout uses JSON <code>options.children</code> plus a <code>components</code> map. The
      nested subgrid has several child tiles. Use the toolbar for
      <strong>save / restore</strong>.
    </p>
    <GridPanel
      title="Grid with nested subgrid (multiple children)"
      :options="gridOptions"
    />
  </div>
</template>
