import React, { useRef, useState } from 'react';
import { GRID_OPTIONS, SUB_GRID_OPTIONS } from '../../lib/constants';
import { GridstackItem, GridstackProvider } from '../../lib';
import { GridStackOptions } from 'gridstack';
import './demo.css';

const gridOptions: GridStackOptions = {
  children: [
    { h: 2, id: 'item1', w: 2, x: 0, y: 0 },
    { h: 2, id: 'item2', w: 2, x: 0, y: 0 },
    {
      h: 5,
      id: 'sub-grid-1',
      noResize: true,
      sizeToContent: true,
      subGridOpts: {
        ...SUB_GRID_OPTIONS,
        children: [
          {
            h: 1,
            id: 'sub-grid-1-title',
            locked: true,
            noMove: true,
            noResize: true,
            w: 12,
            x: 0,
            y: 0,
          },
          { h: 2, id: 'item3', w: 2, x: 0, y: 0 },
          { h: 2, id: 'item4', w: 2, x: 0, y: 0 },
        ],
      },
      w: 12,
      x: 0,
      y: 0,
    },
  ],
  ...GRID_OPTIONS,
};


const gridOptions2: GridStackOptions = {
  children: [
    { h: 2, id: 'item6', w: 4, x: 0, y: 0 },
    { h: 2, id: 'item7', w: 6, x: 0, y: 0 },
    {
      h: 5,
      id: 'sub-grid-2',
      noResize: true,
      sizeToContent: true,
      subGridOpts: {
        ...SUB_GRID_OPTIONS,
        children: [
          {
            h: 1,
            id: 'sub-grid-2-title',
            locked: true,
            noMove: true,
            noResize: true,
            w: 12,
            x: 0,
            y: 0,
          },
          { h: 2, id: 'item8', w: 4, x: 0, y: 0 },
          { h: 2, id: 'item9', w: 6, x: 0, y: 0 },
        ],
      },
      w: 12,
      x: 0,
      y: 0,
    },
  ],
  ...GRID_OPTIONS,
};

const WIDGETS_NODE_MAP: Record<string, React.ReactNode> = {
  item1: <div className="w-full h-full">Item 1</div>,
  item2: <div className="w-full h-full">Item 2</div>,
  'sub-grid-1': (
    <>
      <GridstackItem id="sub-grid-1-title">
        <div className="w-full h-full flex items-center justify-center">
          <span>Section Title Locked</span>
        </div>
      </GridstackItem>
      <GridstackItem id="item3">
        <div className="w-full h-full">Item 3</div>
      </GridstackItem>
      <GridstackItem id="item4">
        <div className="w-full h-full">Item 4</div>
      </GridstackItem>
    </>
  ),
  item6: <div className="w-full h-full">Item 6</div>,
  item7: <div className="w-full h-full">Item 7</div>,
  'sub-grid-2': (
    <>
      <GridstackItem id="sub-grid-2-title">
        <div className="w-full h-full flex items-center justify-center">
          <span>Section Title Locked</span>
        </div>
      </GridstackItem>
      <GridstackItem id="item8">
        <div className="w-full h-full">Item 8</div>
      </GridstackItem>
      <GridstackItem id="item9">
        <div className="w-full h-full">Item 9</div>
      </GridstackItem>
    </>
  ),
};

export const GridStackDemo = () => {
  const [currentGridOptions, setCurrentGridOptions] = useState(gridOptions);
  const currentGridName = useRef('Grid A');


  return (
    <div>
      <button onClick={() => {
        if(currentGridName.current === 'Grid A') {
          setCurrentGridOptions(gridOptions2);
          currentGridName.current = 'Grid B';
        } else {
          setCurrentGridOptions(gridOptions);
          currentGridName.current = 'Grid A';
        }
      }}>Change Grid To New Grid</button>
      <span>{currentGridName.current}</span>
      <GridstackProvider options={currentGridOptions}>
        <GridDemo options={currentGridOptions} />
      </GridstackProvider>
    </div>
  );
};

const GridDemo = ({ options }: {options: GridStackOptions}) => {
  return (
    <>
      {options.children?.map((widget) => {
        if (!widget.id) {
          return null;
        }

        if (widget.subGridOpts) {
          return WIDGETS_NODE_MAP[widget.id];
        }

        return (
          <GridstackItem key={widget.id} id={widget.id}>
            {WIDGETS_NODE_MAP[widget.id]}
          </GridstackItem>
        );
      })}
    </>
  );
};
