import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GridStack,
  useGridStack,
  useWidgetSerializer,
  type GridStackOptions,
  type GridStackWidget,
} from "gridstack/dist/react";

import "gridstack/dist/gridstack.css";
import "./demo.css";

const CELL_HEIGHT = 50;
const BREAKPOINTS = [
  { c: 1, w: 700 },
  { c: 3, w: 850 },
  { c: 6, w: 950 },
  { c: 8, w: 1100 },
];

/** Recommended: declare widgets with `component` + `props` (not `content` JSON strings). */
function Text(props: Record<string, unknown>) {
  const content = String(props.content ?? "");
  return <div className="w-full h-full">{content}</div>;
}

/** Example: merge extra fields into `props` on `grid.save()` via `useWidgetSerializer`. */
function Counter(props: Record<string, unknown>) {
  const label = String(props.label ?? "");
  const [count, setCount] = useState(0);
  useWidgetSerializer({
    serialize: () => ({ count }),
  });
  return (
    <div className="w-full h-full">
      <div>{label}</div>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        count: {count}
      </button>
    </div>
  );
}

const COMPONENTS = {
  Text,
  Counter,
};

function baseOptions(): GridStackOptions {
  return {
    acceptWidgets: true,
    columnOpts: {
      breakpointForWindow: true,
      breakpoints: BREAKPOINTS,
      layout: "moveScale",
      columnMax: 12,
    },
    margin: 8,
    cellHeight: CELL_HEIGHT,
    subGridOpts: {
      acceptWidgets: true,
      columnOpts: {
        breakpoints: BREAKPOINTS,
        layout: "moveScale",
      },
      margin: 8,
      minRow: 2,
      cellHeight: CELL_HEIGHT,
    },
    children: [
      {
        id: "item1",
        h: 2,
        w: 2,
        x: 0,
        y: 0,
        component: "Text",
        props: { content: "Item 1" },
      },
      {
        id: "item2",
        h: 2,
        w: 2,
        x: 2,
        y: 0,
        component: "Text",
        props: { content: "Item 2" },
      },
      {
        id: "item3",
        h: 2,
        w: 2,
        x: 4,
        y: 0,
        component: "Text",
        props: { content: "Item 3" },
      },
      {
        id: "sub-grid-1",
        h: 5,
        sizeToContent: true,
        subGridOpts: {
          acceptWidgets: true,
          cellHeight: CELL_HEIGHT,
          column: "auto",
          minRow: 2,
          margin: 8,
          children: [
            {
              id: "sub-item1",
              h: 2,
              w: 4,
              x: 0,
              y: 0,
              component: "Text",
              props: { content: "Sub-item 1" },
            },
            {
              id: "sub-item2",
              h: 2,
              w: 4,
              x: 4,
              y: 0,
              component: "Text",
              props: { content: "Sub-item 2" },
            },
          ],
        },
        w: 12,
        x: 0,
        y: 2,
      },
    ],
    lazyLoad: true,
  };
}

function GridPanel({
  title,
  options,
}: {
  title: string;
  options: GridStackOptions;
}) {
  const [savedJson, setSavedJson] = useState<string | null>(null);

  return (
    <section style={{ marginBottom: "2rem" }}>
      <h3>{title}</h3>
      <GridStack options={options} components={COMPONENTS}>
        <Toolbar onSaveJson={setSavedJson} savedJson={savedJson} />
        <DebugPanel />
      </GridStack>
    </section>
  );
}

export function GridStackDemo() {
  const options = useMemo(() => baseOptions(), []);

  return (
    <>
      <p>
        Layout uses JSON <code>options.children</code> plus a <code>components</code> map. The
        nested subgrid has several child tiles. Use the toolbar for <strong>save / restore</strong>.
      </p>
      <GridPanel
        title="Grid with nested subgrid (multiple children)"
        options={options}
      />
    </>
  );
}

function Toolbar({
  onSaveJson,
  savedJson,
}: {
  onSaveJson: (json: string) => void;
  savedJson: string | null;
}) {
  const { addWidget, save, grid } = useGridStack();

  const handleSave = useCallback(() => {
    const data = save?.(true, false);
    if (data) onSaveJson(JSON.stringify(data, null, 2));
  }, [save, onSaveJson]);

  const handleRestore = useCallback(() => {
    if (!savedJson || !grid) return;
    try {
      const parsed = JSON.parse(savedJson) as GridStackWidget[];
      grid.load(parsed);
    } catch (e) {
      console.error(e);
    }
  }, [grid, savedJson]);

  return (
    <div className="demo-toolbar">
      <button
        type="button"
        onClick={() => {
          const id = `widget-${Math.random().toString(36).slice(2, 11)}`;
          addWidget?.({
            id,
            w: 2,
            h: 2,
            x: 0,
            y: 0,
            component: "Text",
            props: { content: id },
          });
        }}
      >
        Add Text (2×2)
      </button>

      <button
        type="button"
        onClick={() => {
          const subGridId = `sub-grid-${Math.random().toString(36).slice(2, 11)}`;
          const widgetId = `widget-${Math.random().toString(36).slice(2, 11)}`;
          addWidget?.({
            id: subGridId,
            h: 5,
            noResize: false,
            sizeToContent: true,
            subGridOpts: {
              acceptWidgets: true,
              columnOpts: { breakpoints: BREAKPOINTS, layout: "moveScale" },
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
                  component: "Text",
                  props: { content: `Subgrid ${widgetId}` },
                },
              ],
            },
            w: 12,
            x: 0,
            y: 0,
          });
        }}
      >
        Add subgrid (12×5)
      </button>

      <button type="button" onClick={handleSave}>
        Save layout (JSON)
      </button>
      <button type="button" onClick={handleRestore} disabled={!savedJson}>
        Restore saved JSON
      </button>
    </div>
  );
}

function DebugPanel() {
  const { save, layoutVersion } = useGridStack();
  const [snapshot, setSnapshot] = useState<string>("");

  useEffect(() => {
    const t = setInterval(() => {
      const data = save?.(true, false);
      if (data) setSnapshot(JSON.stringify(data, null, 2));
    }, 2000);
    return () => clearInterval(t);
  }, [save, layoutVersion]);

  return (
    <div className="demo-debug">
      <h4>Live save() snapshot (~2s)</h4>
      <pre className="demo-pre">{snapshot || "…"}</pre>
    </div>
  );
}
