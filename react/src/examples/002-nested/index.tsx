import { GridStackOptions } from "gridstack";
import { useState } from "react";
import { defaultGridOptions } from "../../default-grid-options";
import {
  GridStackItem,
  GridStackProvider,
  GridStackRender,
  useGridStackContext,
} from "../../lib";
import { newId } from "../../utils";

export function Nested() {
  const [uncontrolledInitialOptions] = useState<GridStackOptions>(() => ({
    ...defaultGridOptions,
    children: [
      { id: "002-item1", h: 2, w: 2, x: 0, y: 0 },
      { id: "002-item2", h: 2, w: 2, x: 2, y: 0 },
      {
        id: "002-sub-grid-1",
        h: 5,
        sizeToContent: true,
        subGridOpts: {
          children: [
            {
              id: "002-sub-grid-1-title",
              locked: true,
              noMove: true,
              noResize: true,
              w: 12,
              x: 0,
              y: 0,
              content: "Sub Grid 1",
            },
            { id: "002-item3", h: 2, w: 2, x: 0, y: 1 },
            { id: "002-item4", h: 2, w: 2, x: 2, y: 0 },
          ],
        },
        w: 12,
        x: 0,
        y: 2,
      },
    ],
  }));

  return (
    <GridStackProvider initialOptions={uncontrolledInitialOptions}>
      <Toolbar />

      <GridStackRender>
        <GridStackItem id="002-item1">
          <div style={{ color: "yellow" }}>hello</div>
        </GridStackItem>

        <GridStackItem id="002-item2">
          <div style={{ color: "blue" }}>grid</div>
        </GridStackItem>

        <GridStackItem id="002-item3">
          <div style={{ color: "brown" }}>nested one</div>
        </GridStackItem>

        <GridStackItem id="002-item4">
          <div style={{ color: "purple" }}>nested two</div>
        </GridStackItem>
      </GridStackRender>
    </GridStackProvider>
  );
}

export function Toolbar() {
  const { addWidget } = useGridStackContext();

  function handleAddText(w: number, h: number) {
    const widgetId = newId();
    addWidget({ id: widgetId, w, h, x: 0, y: 0, content: "text-" + widgetId });
  }

  function handleAddSubGrid() {
    const subGridId = newId();
    const item1Id = newId();
    const item2Id = newId();
    addWidget({
      id: "sub-grid-" + subGridId,
      h: 5,
      sizeToContent: true,
      subGridOpts: {
        children: [
          {
            id: "sub-grid-" + subGridId + "-title",
            locked: true,
            noMove: true,
            noResize: true,
            w: 12,
            x: 0,
            y: 0,
            content: "Sub Grid " + subGridId,
          },
          { id: item1Id, h: 2, w: 2, x: 0, y: 1, content: "item" + item1Id },
          { id: item2Id, h: 2, w: 2, x: 2, y: 0, content: "item" + item2Id },
        ],
      },
      w: 4,
      x: 0,
      y: 0,
    });
  }

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "10px",
        marginBottom: "10px",
        display: "flex",
        flexDirection: "row",
        gap: "10px",
      }}
    >
      <button
        onClick={() => {
          handleAddText(2, 2);
        }}
      >
        Add Text (2x2)
      </button>
      <button
        onClick={() => {
          handleAddSubGrid();
        }}
      >
        Add Sub Grid (4x5)
      </button>
    </div>
  );
}
