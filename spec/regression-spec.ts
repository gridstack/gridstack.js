import { GridItemHTMLElement, GridStack, GridStackWidget } from '../src/gridstack';
import type { GridStackNode } from '../src/types';
import { Utils } from '../src/utils';

describe('regression >', () => {
  'use strict';

  let grid: GridStack;
  let findEl = function(id: string): GridItemHTMLElement {
    return grid.engine.nodes.find(n => n.id === id)!.el!;
  };
  let findSubEl = function(id: string, index = 0): GridItemHTMLElement {
    return grid.engine.nodes[index].subGrid?.engine.nodes.find(n => n.id === id)!.el!;
  };


  // empty grid
  let gridstackEmptyHTML =
  '<div style="width: 800px; height: 600px" id="gs-cont">' +
  '  <div class="grid-stack"></div>' +
  '</div>';

  describe('2492 load() twice >', () => {
    beforeEach(() => {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(() => {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('', () => {
      let items: GridStackWidget[] = [
        {x: 0, y: 0, w:2, content: '0 wide'},
        {x: 1, y: 0, content: '1 over'},
        {x: 2, y: 1, content: '2 float'},
      ];
      let count = 0;
      items.forEach(n => n.id = String(count++));
      grid = GridStack.init({cellHeight: 70, margin: 5}).load(items);

      let el0 = findEl('0');
      let el1 = findEl('1');
      let el2 = findEl('2');

      expect(el0.getAttribute('gs-x')).toBe('0');
      expect(el0.getAttribute('gs-y')).toBe('0');
      expect(el0.children[0].innerHTML).toBe(items[0].content!);
      expect(parseInt(el1.getAttribute('gs-x'))).toBe(1);
      expect(parseInt(el1.getAttribute('gs-y'))).toBe(1);
      expect(parseInt(el2.getAttribute('gs-x'))).toBe(2);
      expect(el2.getAttribute('gs-y')).toBe('0');

      // loading with changed content should be same positions
      items.forEach(n => n.content += '*')
      grid.load(items);
      expect(el0.getAttribute('gs-x')).toBe('0');
      expect(el0.getAttribute('gs-y')).toBe('0');
      expect(el0.children[0].innerHTML).toBe(items[0].content!);
      expect(parseInt(el1.getAttribute('gs-x'))).toBe(1);
      expect(parseInt(el1.getAttribute('gs-y'))).toBe(1);
      expect(parseInt(el2.getAttribute('gs-x'))).toBe(2);
      expect(el2.getAttribute('gs-y')).toBe('0');
    });
  });

  describe('2865 nested grid resize >', () => {
    beforeEach(() => {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(() => {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('', () => {
      let children: GridStackWidget[] = [{},{},{}];
      let items: GridStackWidget[] = [
        {x: 0, y: 0, w:3, h:5, sizeToContent: true, subGridOpts: {children, column: 'auto'}}
      ];
      let count = 0;
      [...items, ...children].forEach(n => n.id = String(count++));
      grid = GridStack.init({cellHeight: 70, margin: 5, children: items});

      let nested = findEl('0');
      let el1 = findSubEl('1');
      let el2 = findSubEl('2');
      let el3 = findSubEl('3');
      expect(nested.getAttribute('gs-x')).toBe('0');
      expect(nested.getAttribute('gs-y')).toBe('0');
      expect(parseInt(nested.getAttribute('gs-w'))).toBe(3);
      // TODO: sizeToContent doesn't seem to be called in headless mode ??? works in browser.
      // expect(nested.getAttribute('gs-h')).toBe(null); // sizeToContent 5 -> 1 which is null
      expect(el1.getAttribute('gs-x')).toBe('0');
      expect(el1.getAttribute('gs-y')).toBe('0');
      expect(parseInt(el2.getAttribute('gs-x'))).toBe(1);
      expect(el2.getAttribute('gs-y')).toBe('0');
      expect(parseInt(el3.getAttribute('gs-x'))).toBe(2);
      expect(el3.getAttribute('gs-y')).toBe('0');

      // now resize the nested grid to 2 -> should reflow el3
      grid.update(nested, {w:2});
      expect(nested.getAttribute('gs-x')).toBe('0');
      expect(nested.getAttribute('gs-y')).toBe('0');
      expect(parseInt(nested.getAttribute('gs-w'))).toBe(2);
      // TODO: sizeToContent doesn't seem to be called in headless mode ??? works in browser.
      // expect(parseInt(nested.getAttribute('gs-h'))).toBe(2);
      expect(el1.getAttribute('gs-x')).toBe('0');
      expect(el1.getAttribute('gs-y')).toBe('0');
      expect(parseInt(el2.getAttribute('gs-x'))).toBe(1);
      expect(el2.getAttribute('gs-y')).toBe('0');
      // 3rd item pushed to next row
      expect(el3.getAttribute('gs-x')).toBe('0');
      expect(parseInt(el3.getAttribute('gs-y'))).toBe(1);
    });
  });

  describe('3175 hovering to nest must not lose the underlying widget >', () => {
    beforeEach(() => {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(() => {
      delete GridStack.addRemoveCB;
      document.body.removeChild(document.getElementById('gs-cont'));
    });

    // NOTE: the report is a video on the nested_advanced demo with no code reference, and the
    // dynamic-nesting trigger needs real 80%-coverage drag geometry, so this could NOT be
    // reproduced at the API level. These lock in the create -> revert round trip either way.
    const makeGrid = () => GridStack.init({column: 12, cellHeight: 50, subGridDynamic: true,
      children: [{id: 'under', x: 0, y: 0, w: 4, h: 2, content: 'IMPORTANT'}]});

    it('keeps the hovered widget when a sub-grid is created over it', () => {
      grid = makeGrid();
      const under = grid.engine.nodes.find(n => n.id === 'under')!;
      grid.makeSubGrid(under.el!, undefined, {id: 'dropped', w: 2, h: 2, content: 'new'} as GridStackNode);

      const sg = under.subGrid!;
      expect(sg).toBeTruthy();
      expect(sg.engine.nodes.length).toBeGreaterThan(0);
      expect(sg.el.textContent).toContain('IMPORTANT'); // the underlying widget is still there
    });

    it('keeps it through the addRemoveCB path too (framework wrappers)', () => {
      GridStack.addRemoveCB = (parent, w, add, isGrid) => {
        if (!add) return undefined;
        if (isGrid) {
          const e = Utils.createDiv(['grid-stack']);
          parent.appendChild(e);
          return e;
        }
        const e = Utils.createDiv(['grid-stack-item']);
        const c = Utils.createDiv(['grid-stack-item-content'], e);
        if (w.content) c.textContent = w.content;
        return e;
      };
      grid = makeGrid();
      const under = grid.engine.nodes.find(n => n.id === 'under')!;
      grid.makeSubGrid(under.el!, undefined, {id: 'dropped', w: 2, h: 2, content: 'new'} as GridStackNode);
      expect(under.subGrid!.el.textContent).toContain('IMPORTANT');
    });

    it('gives the widget back when the temporary sub-grid is reverted', () => {
      grid = makeGrid();
      const under = grid.engine.nodes.find(n => n.id === 'under')!;
      grid.makeSubGrid(under.el!, undefined, {id: 'dropped', w: 2, h: 2, content: 'new'} as GridStackNode);
      const sg = under.subGrid!;

      sg.removeAsSubGrid(); // what leaving the hover does for a temp sub-grid

      expect(grid.engine.nodes.length).toBeGreaterThan(0);
      expect(grid.el.textContent).toContain('IMPORTANT'); // not swallowed by the revert
    });
  });
});
