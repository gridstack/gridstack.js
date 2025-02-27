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

export function Simple() {
  const [uncontrolledInitialOptions] = useState<GridStackOptions>(() => ({
    ...defaultGridOptions,
    children: [
      { id: "item1", h: 2, w: 2, x: 0, y: 0 },
      { id: "item2", h: 2, w: 2, x: 2, y: 0 },
    ],
  }));

  return (
    <GridStackProvider initialOptions={uncontrolledInitialOptions}>
      <Toolbar />

      <GridStackRender renderRawContent>
        <GridStackItem id="item1">
          <div style={{ color: "yellow" }}>hello</div>
        </GridStackItem>

        <GridStackItem id="item2">
          <div style={{ color: "blue" }}>grid</div>
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
    </div>
  );
}
