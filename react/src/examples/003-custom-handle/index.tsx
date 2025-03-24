import { GridStackOptions } from "gridstack";
import { useState } from "react";
import {
  CUSTOM_DRAGGABLE_HANDLE_CLASSNAME,
  defaultGridOptions,
} from "../../default-grid-options";
import {
  GridStackHandleReInitializer,
  GridStackItem,
  GridStackProvider,
  GridStackRender,
} from "../../lib";

export function CustomHandle() {
  const [uncontrolledInitialOptions] = useState<GridStackOptions>(() => ({
    ...defaultGridOptions,
    children: [{ id: "003-item1", h: 2, w: 2, x: 0, y: 0 }],
  }));

  return (
    <GridStackProvider initialOptions={uncontrolledInitialOptions}>
      <GridStackRender>
        <GridStackItem id="003-item1">
          <div>Custom Handle</div>

          {/* Experimental: Render item with custom handle */}
          <GridStackHandleReInitializer>
            <button className={CUSTOM_DRAGGABLE_HANDLE_CLASSNAME}>
              Handle ONLY HERE
            </button>
          </GridStackHandleReInitializer>
        </GridStackItem>
      </GridStackRender>
    </GridStackProvider>
  );
}
