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

  describe('2625 narrowed sub-grid must still lay out properly >', () => {
    beforeEach(() => {
      document.body.insertAdjacentHTML('afterbegin',
        '<div style="width: 1200px; height: 600px" id="gs-cont"><div class="grid-stack"></div></div>');
    });
    afterEach(() => {
      document.body.removeChild(document.getElementById('gs-cont'));
    });

    // NOTE: re-checked on 2026-09-14 and this no longer reproduces (reported against v10.0.1);
    // locking the behavior in rather than fixing it.
    it('items reflow instead of stacking on top of each other', () => {
      grid = GridStack.init({column: 12, cellHeight: 50, children: [
        {id: 'sub', x: 0, y: 0, w: 4, h: 4, subGridOpts: {column: 'auto', children: [
          {id: '6', x: 0, y: 0, w: 1, h: 1},
          {id: '7', x: 1, y: 0, w: 1, h: 1},
        ]}},
      ]});
      const sub = grid.engine.nodes.find(n => n.id === 'sub')!;
      const sg = sub.subGrid!;
      expect(sg.getColumn()).toBe(4);

      grid.update(sub.el!, {w: 1}); // resize the sub-grid item down to its narrowest

      expect(sg.getColumn()).toBe(1);
      const n6 = sg.engine.nodes.find(n => n.id === '6')!;
      const n7 = sg.engine.nodes.find(n => n.id === '7')!;
      const overlap = n6.x! < n7.x! + n7.w! && n7.x! < n6.x! + n6.w! &&
                      n6.y! < n7.y! + n7.h! && n7.y! < n6.y! + n6.h!;
      expect(overlap).toBe(false);
      expect([n6.y, n7.y].sort()).toEqual([0, 1]); // stacked vertically, not on top of each other

      // and the DOM agrees, so they actually render apart
      expect(n7.el!.getAttribute('gs-y')).toBe('1');
      expect(sg.el.getAttribute('gs-current-row')).toBe('2');
      expect(sg.el.style.minHeight).toBe('100px'); // grew to fit both rows
    });
  });

  describe('3000 float: pushed items restore when dragging back >', () => {
    beforeEach(() => {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(() => {
      document.body.removeChild(document.getElementById('gs-cont'));
    });

    // NOTE: this no longer reproduced when re-checked on 2026-09-14 (the mode:'float' rework in
    // 61e358bf landed after the report), so this locks the reported behavior in rather than fixing it.
    it('two h=2 items, pushed 3 rows down, both come back', () => {
      grid = GridStack.init({mode: 'float', cellHeight: 50, children: [
        {id: 'A', x: 0, y: 0, w: 2, h: 2},
        {id: 'B', x: 0, y: 2, w: 2, h: 2},
      ]});
      const A = grid.engine.nodes.find(n => n.id === 'A')!;
      const B = grid.engine.nodes.find(n => n.id === 'B')!;

      grid.engine.cleanNodes().beginUpdate(A); // dragstart snapshots _orig for everyone
      expect(B._orig!.y).toBe(2);

      [1, 2, 3].forEach(y => grid.engine.moveNode(A, {x: 0, y, w: 2, h: 2}));
      expect(A.y).toBe(3);
      expect(B.y).toBe(5); // pushed the reported 3 rows

      [2, 1, 0].forEach(y => grid.engine.moveNode(A, {x: 0, y, w: 2, h: 2}));
      expect(A.y).toBe(0);
      expect(B.y).toBe(2); // ...and restored, rather than stranded at 5
      grid.engine.endUpdate();
    });

    it('a third item blocking the way only holds items back as far as it must', () => {
      grid = GridStack.init({mode: 'float', cellHeight: 50, children: [
        {id: 'A', x: 0, y: 0, w: 2, h: 2},
        {id: 'B', x: 0, y: 2, w: 2, h: 2},
        {id: 'C', x: 4, y: 0, w: 2, h: 2},
      ]});
      const [A, B, C] = ['A', 'B', 'C'].map(id => grid.engine.nodes.find(n => n.id === id)!);
      grid.engine.cleanNodes().beginUpdate(A);

      [1, 2, 3].forEach(y => grid.engine.moveNode(A, {x: 0, y, w: 2, h: 2}));
      expect(B.y).toBe(5);
      [2, 1, 0].forEach(y => grid.engine.moveNode(A, {x: 0, y, w: 2, h: 2}));
      expect(B.y).toBe(2);
      expect(C.y).toBe(0); // untouched in its own column
      grid.engine.endUpdate();
    });
  });

  describe('3012 update() from inside a drag/resize handler >', () => {
    beforeEach(() => {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(() => {
      document.body.removeChild(document.getElementById('gs-cont'));
    });

    it('keeps node._orig alive so the stop event does not crash', () => {
      grid = GridStack.init({cellHeight: 50, children: [{id: 'A', x: 0, y: 0, w: 3, h: 3}]});
      const A = grid.engine.nodes.find(n => n.id === 'A')!;

      grid.engine.cleanNodes().beginUpdate(A); // resizestart
      expect(A._updating).toBe(true);
      expect(A._orig).toEqual({x: 0, y: 0, w: 3, h: 3});

      // the aspect-ratio handler: update() from inside the 'resize' event
      grid.update(A.el!, {h: 4});
      expect(A.h).toBe(4);
      // used to be deleted here, then onEndMoving did `node._orig!.w` -> TypeError
      expect(A._orig).toEqual({x: 0, y: 0, w: 3, h: 3});
      expect(() => A.w !== A._orig!.w).not.toThrow();

      grid.engine.endUpdate();
    });

    it('still clears _orig for a plain update() outside a gesture (#2669)', () => {
      grid = GridStack.init({cellHeight: 50, children: [{id: 'A', x: 0, y: 0, w: 3, h: 3}]});
      const A = grid.engine.nodes.find(n => n.id === 'A')!;
      grid.engine.saveInitial();
      expect(A._orig).toBeDefined();
      grid.update(A.el!, {h: 4});
      expect(A._updating).toBeFalsy();
      expect(A._orig).toBeUndefined();
    });
  });

  describe('3179 shrink-to-fit during a drag >', () => {
    beforeEach(() => {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(() => {
      document.body.removeChild(document.getElementById('gs-cont'));
    });

    // NOTE: the 'shrinkToFit' feature itself isn't built here - you called that a lot of work in
    // the thread. What IS fixed is the blocker that stopped the reporter doing it themselves:
    // update() during a drag used to wipe node._orig and then throw "missing _orig.w" (see #3012).
    it('lets an app shrink on dragstart and grow back on dragstop', () => {
      grid = GridStack.init({column: 6, cellHeight: 50, mode: 'float', children: [
        {id: 'big', x: 0, y: 0, w: 4, h: 2},
        {id: 'a', x: 4, y: 0, w: 2, h: 1},
        {id: 'b', x: 4, y: 1, w: 1, h: 1}, // leaves a 1x1 gap at (5,1)
      ]});
      const big = grid.engine.nodes.find(n => n.id === 'big')!;
      const orig = {w: big.w!, h: big.h!};

      grid.engine.cleanNodes().beginUpdate(big);   // dragstart
      grid.update(big.el!, {w: 1, h: 1});          // shrink so it can enter the small gap
      expect(big._orig).toBeDefined();             // ...and the drag baseline survives it

      grid.update(big.el!, {x: 5, y: 1});          // drag into the gap
      expect(() => big.w !== big._orig!.w).not.toThrow(); // what onEndMoving does at dragstop

      grid.update(big.el!, orig);                  // grow back
      grid.engine.endUpdate();
      expect(big.w).toBe(orig.w);
      expect(big.h).toBe(orig.h);
    });

    it('leaves no overlap behind after the round trip', () => {
      grid = GridStack.init({column: 6, cellHeight: 50, mode: 'float', children: [
        {id: 'big', x: 0, y: 0, w: 4, h: 2},
        {id: 'a', x: 4, y: 0, w: 2, h: 1},
      ]});
      const big = grid.engine.nodes.find(n => n.id === 'big')!;
      grid.engine.cleanNodes().beginUpdate(big);
      grid.update(big.el!, {w: 1, h: 1});
      grid.update(big.el!, {x: 5, y: 0});
      grid.update(big.el!, {w: 4, h: 2});
      grid.engine.endUpdate();

      const ns = grid.engine.nodes;
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const a = ns[i], b = ns[j];
          const over = a.x! < b.x! + b.w! && b.x! < a.x! + a.w! && a.y! < b.y! + b.h! && b.y! < a.y! + a.h!;
          expect(over).toBe(false);
        }
      }
    });
  });
  describe("2866 mode:'list' inserts between and reflows right >", () => {
    beforeEach(() => {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(() => {
      document.body.removeChild(document.getElementById('gs-cont'));
    });

    /** row-major reading order, which is the order 'list' mode maintains */
    const order = () => grid.engine.nodes.slice()
      .sort((a, b) => (a.y! * 4 + a.x!) - (b.y! * 4 + b.x!))
      .map(n => n.id).join('');

    // NOTE: this is the 'mobile icon rearrange' behavior the issue asked for, and mode:'list'
    // (shipped with the top/float/list/compact rework) already provides it - so this locks it in.
    it('dropping on an item takes its place and shifts the rest right', () => {
      grid = GridStack.init({column: 4, cellHeight: 50, mode: 'list', children: [
        {id: 'A', x: 0, y: 0, w: 1, h: 1}, {id: 'B', x: 1, y: 0, w: 1, h: 1},
        {id: 'C', x: 2, y: 0, w: 1, h: 1}, {id: 'D', x: 3, y: 0, w: 1, h: 1},
        {id: 'E', x: 0, y: 1, w: 1, h: 1},
      ]});
      expect(order()).toBe('ABCDE');

      const E = grid.engine.nodes.find(n => n.id === 'E')!;
      grid.update(E.el!, {x: 1, y: 0}); // drop E onto B's slot

      expect(order()).toBe('AEBCD');    // E takes the slot, B/C/D shift right and wrap
      const D = grid.engine.nodes.find(n => n.id === 'D')!;
      expect(D.y).toBe(1);              // reflowed onto the next row rather than being pushed down
    });

    it('keeps the run gapless as items move', () => {
      grid = GridStack.init({column: 3, cellHeight: 50, mode: 'list', children: [
        {id: 'A', x: 0, y: 0, w: 1, h: 1}, {id: 'B', x: 1, y: 0, w: 1, h: 1},
        {id: 'C', x: 2, y: 0, w: 1, h: 1}, {id: 'D', x: 0, y: 1, w: 1, h: 1},
      ]});
      const D = grid.engine.nodes.find(n => n.id === 'D')!;
      grid.update(D.el!, {x: 0, y: 0}); // all the way to the front
      expect(order()).toBe('DABC');
      // every slot from 0..3 is used exactly once - no holes left behind
      const slots = grid.engine.nodes.map(n => n.y! * 3 + n.x!).sort((a, b) => a - b);
      expect(slots).toEqual([0, 1, 2, 3]);
    });
  });
});
