"use client";
// demo.tsx

import type {  GridStackOptions } from "gridstack";

import * as React from "react";
import "./demo.css";
import {useGridstackContext, GridstackProvider, GridstackGrid, GridstackItemComponent} from "../../lib";

export const GridstackDemo = () => {
  return (
    <GridstackProvider>
      <GridDemo />
    </GridstackProvider>
  );
};

const GridDemo = () => {
  const { grid, getItemRefFromListById } = useGridstackContext();
  const [displayItem1, setDisplayItem1] = React.useState<boolean>(true);
  const [displayItem2, setDisplayItem2] = React.useState<boolean>(false);
  const gridOptions: GridStackOptions = {
    column: 12,
    acceptWidgets: false,
    removable: false,
    itemClass: "grid-stack-item",
    staticGrid: false,
    cellHeight: "100px",
    margin: "2",
    minRow: 5,
    placeholderClass: "grid-stack-placeholder-custom",
  };

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => {
            grid?.addWidget(`<div style="background-color:rgb(0,0,0,0.4">Item 3</div>`, {
              x: 4,
              y: 0,
              w: 2,
              h: 2,
            });
          }}
        >
          Add widget
        </button>
        <button
          type="button"
          onClick={() => {
            if (grid?.getFloat()) {
              grid?.float(false);
            } else {
              grid?.float(true);
            }
          }}
          //!! THIS STILL DOESN'T WORK
        >
          {grid?.getFloat() ? "Deactivate" : "Activate"} float
        </button>

        <button
          type="button"
          onClick={() => {
            console.log(grid?.getGridItems());
            console.log("GRID", grid);
          }}
        >
          Console log grid Items
        </button>
        <button
          type="button"
          onClick={() => {
            setDisplayItem1((prev) => !prev);
          }}
        >
          {displayItem1 ? "Hide" : "Show"} Item 1
        </button>
        <button
          type="button"
          onClick={() => {
            setDisplayItem2((prev) => !prev);
          }}
        >
          {displayItem2 ? "Hide" : "Show"} Item 2
        </button>
      </div>

      <GridstackGrid options={gridOptions}>
        {displayItem1 && (
          <GridstackItemComponent
            id="item1"
            initOptions={{ x: 0, y: 0, w: 2, h: 2 }}
          >
            <div>Item 1</div>
            <button
              type="button"
              onClick={() => {
                const itemRef = getItemRefFromListById("item1");
                if (itemRef?.current) {
                  grid?.update(itemRef.current, { x: 3 });
                }
              }}
            >
              X = 3
            </button>
            <button
              type="button"
              onClick={() => {
                const itemRef = getItemRefFromListById("item1");
                if (itemRef?.current) {
                  const xPosition = itemRef?.current.gridstackNode?.x;
                  console.log("ITEM REF CURRENT", itemRef.current);

                  grid?.update(itemRef.current, {
                    x: (xPosition ?? 0) + 1,
                  });
                }
              }}
            >
              X + 1
            </button>
          </GridstackItemComponent>
        )}

        {displayItem2 && (
          <GridstackItemComponent id="item2">
            <div>Item 2</div>
          </GridstackItemComponent>
        )}
      </GridstackGrid>
    </>
  );
};
