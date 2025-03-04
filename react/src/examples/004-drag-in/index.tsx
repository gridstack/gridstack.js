import { GridStackOptions } from "gridstack";
import { useState } from "react";
import { defaultGridOptions } from "../../default-grid-options";
import { GridStackItem, GridStackDragInItem } from "../../lib";
import { GridStackContainer } from "../../lib/grid-stack-container";

export function DragIn() {
  const [uncontrolledInitialOptions] = useState<GridStackOptions>(() => ({
    ...defaultGridOptions,
    children: [
      { id: "004-item1", h: 2, w: 2, x: 0, y: 0 },
      { id: "004-item2", h: 2, w: 2, x: 2, y: 0 },
    ],
  }));

  return (
    <div>
      <div
        style={{
          padding: "10px",
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          border: "1px solid gray",
          marginBottom: "10px",
        }}
      >
        <GridStackDragInItem widget={{ h: 2, w: 2 }}>
          <div
            style={{
              border: "1px dashed green ",
              backgroundColor: "lime",
              padding: "0 10px",
            }}
          >
            Drag me add to the grid
          </div>
        </GridStackDragInItem>
      </div>

      <GridStackContainer initialOptions={uncontrolledInitialOptions}>
        <GridStackItem id="004-item1">
          <div style={{ color: "yellow" }}>hello</div>
        </GridStackItem>

        <GridStackItem id="004-item2">
          <div style={{ color: "blue" }}>grid</div>
        </GridStackItem>
      </GridStackContainer>
    </div>
  );
}
