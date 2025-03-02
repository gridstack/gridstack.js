import { GridStackOptions } from "gridstack";
import { useState } from "react";
import { defaultGridOptions } from "../../default-grid-options";
import { GridStackItem } from "../../lib";
import { GridStackContainer } from "../../lib/grid-stack-container";

export function Simple0() {
  const [uncontrolledInitialOptions] = useState<GridStackOptions>(() => ({
    ...defaultGridOptions,
    children: [
      { id: "000-item1", h: 2, w: 2, x: 0, y: 0 },
      { id: "000-item2", h: 2, w: 2, x: 2, y: 0 },
    ],
  }));

  return (
    <GridStackContainer initialOptions={uncontrolledInitialOptions}>
      <GridStackItem id="000-item1">
        <div style={{ color: "yellow" }}>hello</div>
      </GridStackItem>

      <GridStackItem id="000-item2">
        <div style={{ color: "blue" }}>grid</div>
      </GridStackItem>
    </GridStackContainer>
  );
}
