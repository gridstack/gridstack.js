import { ComponentProps, useEffect, useState } from "react";
import { GridStackOptions, GridStackWidget } from "gridstack";
import {
  ComponentDataType,
  ComponentMap,
  GridStackProvider,
  GridStackRender,
  GridStackRenderProvider,
  useGridStackContext,
} from "../../lib";

import "gridstack/dist/gridstack.css";
import "./demo.css";

const CELL_HEIGHT = 50;
const BREAKPOINTS = [
  { c: 1, w: 700 },
  { c: 3, w: 850 },
  { c: 6, w: 950 },
  { c: 8, w: 1100 },
];

function Text({ content }: { content: string }) {
  return <div className="w-full h-full">{content}</div>;
}

const COMPONENT_MAP: ComponentMap = {
  Text,
  // ... other components here
};

// ! Content must be json string like this:
// { name: "Text", props: { content: "Item 1" } }
const gridOptions: GridStackOptions = {
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
      content: JSON.stringify({
        name: "Text",
        props: { content: "Item 1" },
      } satisfies ComponentDataType<ComponentProps<typeof Text>>), // if need type check
    },
    {
      id: "item2",
      h: 2,
      w: 2,
      x: 2,
      y: 0,
      content: JSON.stringify({
        name: "Text",
        props: { content: "Item 2" },
      }),
    },
    {
      id: "sub-grid-1",
      h: 5,
      sizeToContent: true,
      subGridOpts: {
        acceptWidgets: true,
        cellHeight: CELL_HEIGHT,
        alwaysShowResizeHandle: false,
        column: "auto",
        minRow: 2,
        layout: "list",
        margin: 8,
        children: [
          {
            id: "sub-grid-1-title",
            locked: true,
            noMove: true,
            noResize: true,
            w: 12,
            x: 0,
            y: 0,
            content: JSON.stringify({
              name: "Text",
              props: { content: "Sub Grid 1 Title" },
            }),
          },
          {
            id: "item3",
            h: 2,
            w: 2,
            x: 0,
            y: 1,
            content: JSON.stringify({
              name: "Text",
              props: { content: "Item 3" },
            }),
          },
          {
            id: "item4",
            h: 2,
            w: 2,
            x: 2,
            y: 0,
            content: JSON.stringify({
              name: "Text",
              props: { content: "Item 4" },
            }),
          },
        ],
      },
      w: 12,
      x: 0,
      y: 2,
    },
  ],
};

export function GridStackDemo() {
  // ! Uncontrolled
  const [initialOptions] = useState(gridOptions);

  return (
    <GridStackProvider initialOptions={initialOptions}>
      <Toolbar />

      <GridStackRenderProvider>
        <GridStackRender componentMap={COMPONENT_MAP} />
      </GridStackRenderProvider>

      <DebugInfo />
    </GridStackProvider>
  );
}

function Toolbar() {
  const { addWidget, addSubGrid } = useGridStackContext();

  return (
    <div
      style={{
        border: "1px solid gray",
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        display: "flex",
        flexDirection: "row",
        gap: "10px",
      }}
    >
      <button
        onClick={() => {
          addWidget((id) => ({
            w: 2,
            h: 2,
            x: 0,
            y: 0,
            content: JSON.stringify({
              name: "Text",
              props: { content: id },
            }),
          }));
        }}
      >
        Add Text (2x2)
      </button>

      <button
        onClick={() => {
          addSubGrid((id, withWidget) => ({
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
                withWidget({
                  h: 1,
                  locked: true,
                  noMove: true,
                  noResize: true,
                  w: 12,
                  x: 0,
                  y: 0,
                  content: JSON.stringify({
                    name: "Text",
                    props: { content: "Sub Grid 1 Title" + id },
                  }),
                }),
              ],
            },
            w: 12,
            x: 0,
            y: 0,
          }));
        }}
      >
        Add Sub Grid (12x1)
      </button>
    </div>
  );
}

function DebugInfo() {
  const { initialOptions, saveOptions } = useGridStackContext();

  const [realtimeOptions, setRealtimeOptions] = useState<
    GridStackOptions | GridStackWidget[] | undefined
  >(undefined);

  useEffect(() => {
    const timer = setInterval(() => {
      if (saveOptions) {
        const data = saveOptions();
        setRealtimeOptions(data);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [saveOptions]);

  return (
    <div>
      <h2>Debug Info</h2>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        <div>
          <h3>Initial Options</h3>
          <pre
            style={{
              backgroundColor: "#f3f4f6",
              padding: "1rem",
              borderRadius: "0.25rem",
              overflow: "auto",
            }}
          >
            {JSON.stringify(initialOptions, null, 2)}
          </pre>
        </div>
        <div>
          <h3>Realtime Options (2s refresh)</h3>
          <pre
            style={{
              backgroundColor: "#f3f4f6",
              padding: "1rem",
              borderRadius: "0.25rem",
              overflow: "auto",
            }}
          >
            {JSON.stringify(realtimeOptions, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
