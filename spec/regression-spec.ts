import { GridItemHTMLElement, GridStack, GridStackWidget } from '../src/gridstack';
import type { GridStackNode, GridStackMode } from '../src/types';
import { Utils } from '../src/utils';
import { DDElement } from '../src/dd-element';
import { DDDraggable } from '../src/dd-draggable';
import { DDManager } from '../src/dd-manager';
import { DDTouch, touchstart, cancelPendingTouchDrag } from '../src/dd-touch';

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

  describe("2583 cellHeight:'fill' - rows divide the container height >", () => {
    /** a fixed 800x600 container, like the reporter's */
    const container = (h = 600) =>
      `<div style="width: 800px; height: ${h}px" id="gs-cont"><div class="grid-stack" style="height: 100%;"></div></div>`;

    afterEach(() => {
      document.getElementById('gs-cont')?.remove();
    });

    const setHeight = (h: number) => {
      const gs = document.querySelector('.grid-stack') as HTMLElement;
      if (gs) Object.defineProperty(gs, 'clientHeight', {value: h, configurable: true});
    };

    it('divides the container height by the row count', () => {
      document.body.insertAdjacentHTML('afterbegin', container());
      setHeight(600);
      grid = GridStack.init({column: 3, row: 2, cellHeight: 'fill', margin: 0});
      // 2 rows in 600px => 300 each, the same way 3 columns split 800px of width
      expect(grid.getCellHeight(true)).toBe(300);
    });

    it('follows the row count, so fewer items still fill the height', () => {
      document.body.insertAdjacentHTML('afterbegin', container());
      setHeight(600);
      grid = GridStack.init({column: 3, row: 3, cellHeight: 'fill', margin: 0,
        children: [{x: 0, y: 0, w: 1, h: 1}, {x: 1, y: 0, w: 1, h: 1}]});
      expect(grid.getCellHeight(true)).toBe(200); // 600 / 3 rows
    });

    it('includes margins so rows still fit perfectly', () => {
      document.body.insertAdjacentHTML('afterbegin', container());
      setHeight(600);
      grid = GridStack.init({column: 3, row: 2, cellHeight: 'fill', margin: 10});
      expect(grid.getCellHeight(true)).toBe(300);
    });

    it('re-fills when the container resizes', () => {
      document.body.insertAdjacentHTML('afterbegin', container());
      setHeight(600);
      grid = GridStack.init({column: 3, row: 2, cellHeight: 'fill', margin: 0});
      expect(grid.getCellHeight(true)).toBe(300);

      setHeight(400);
      grid.cellHeight();               // what the ResizeObserver path calls
      expect(grid.getCellHeight(true)).toBe(200);
    });

    it("leaves 'auto' and explicit values alone", () => {
      document.body.insertAdjacentHTML('afterbegin', container());
      setHeight(600);
      grid = GridStack.init({column: 3, row: 2, cellHeight: 50, margin: 0});
      expect(grid.getCellHeight(true)).toBe(50);
      grid.cellHeight('fill');
      expect(grid.getCellHeight(true)).toBe(300);
      grid.cellHeight(70);
      expect(grid.getCellHeight(true)).toBe(70); // switched back off
    });
  });

  describe('2627 dragstart/dragstop for sidebar items >', () => {
    let side: HTMLElement;
    afterEach(() => {
      delete DDManager.mouseHandled;
      delete DDManager.dragElement;
      document.getElementById('gs-cont')?.remove();
    });

    const setupSidebar = (opts: Record<string, unknown> = {}) => {
      document.body.insertAdjacentHTML('afterbegin',
        '<div id="gs-cont"><div class="sidebar-item grid-stack-item">drag me</div>' +
        '<div class="grid-stack"></div></div>');
      side = document.querySelector('.sidebar-item') as HTMLElement;
      grid = GridStack.init({acceptWidgets: true, cellHeight: 50});
      GridStack.setupDragIn('.sidebar-item', opts, [{w: 2, h: 2}]);
      return side;
    };

    const dragIt = () => {
      const dd = (side as GridItemHTMLElement).ddElement!.ddDraggable!;
      const down = new MouseEvent('mousedown', {button: 0, bubbles: true, clientX: 0, clientY: 0});
      Object.defineProperty(down, 'target', {value: side});
      Object.defineProperty(down, 'currentTarget', {value: side});
      dd['_mouseDown'](down);
      dd['_mouseMove'](new MouseEvent('mousemove', {clientX: 40, clientY: 40}));
      dd['_mouseUp'](new MouseEvent('mouseup'));
    };

    it('fires DOM dragstart / drag / dragstop on the sidebar element', () => {
      setupSidebar();
      const seen: string[] = [];
      ['dragstart', 'drag', 'dragstop'].forEach(t => side.addEventListener(t, () => seen.push(t)));

      dragIt();

      // v10 dropped native HTML5 DnD and sidebar items had no grid to route through, so
      // addEventListener('dragstart') never fired at all
      expect(seen).toContain('dragstart');
      expect(seen).toContain('dragstop');
      expect(seen.indexOf('dragstart')).toBeLessThan(seen.indexOf('dragstop'));
    });

    it('still calls callbacks the caller passed to setupDragIn', () => {
      const start = vi.fn(), stop = vi.fn();
      setupSidebar({start, stop});
      dragIt();
      expect(start).toHaveBeenCalled();
      expect(stop).toHaveBeenCalled();
    });

    it('hands the drag ui data along on the event detail', () => {
      setupSidebar();
      let detail: {el?: HTMLElement, ui?: unknown} | undefined;
      side.addEventListener('dragstart', (e) => { detail = (e as CustomEvent).detail; });
      dragIt();
      expect(detail?.el).toBe(side);
      expect(detail?.ui).toBeDefined();
    });
  });

  describe('3148 drag handle inside a shadow root >', () => {
    let host: GridItemHTMLElement;
    afterEach(() => {
      delete DDManager.mouseHandled;
      host?.remove();
    });

    /** a card whose drag handle lives inside a web component's shadow root */
    const build = () => {
      document.body.insertAdjacentHTML('afterbegin',
        '<div class="grid-stack-item"><div class="grid-stack-item-content">' +
        '<div class="card"></div></div></div>');
      host = document.querySelector('.grid-stack-item') as GridItemHTMLElement;
      const card = host.querySelector('.card') as HTMLElement;
      const shadow = card.attachShadow({mode: 'open'});
      shadow.innerHTML = '<button class="drag-handle">::</button><div class="body">scroll me</div>';
      const dd = DDElement.init(host).setupDraggable({handle: '.drag-handle'}).ddDraggable!;
      return { dd, shadow };
    };

    it('finds it, instead of falling back to the whole card', () => {
      const { dd, shadow } = build();
      const handle = shadow.querySelector('.drag-handle') as HTMLElement;
      // querySelectorAll() stops at the shadow boundary, so this used to come back empty and
      // dragEls fell back to [the whole item] - the entire card stayed draggable
      expect(dd['dragEls']).toEqual([handle]);
      expect(dd['dragEls']).not.toContain(host);
    });

    it('only the handle starts a drag, so the rest can still scroll', () => {
      const { dd, shadow } = build();
      const started = (target: HTMLElement): boolean => {
        target.dispatchEvent(new MouseEvent('mousedown', {button: 0, bubbles: true, composed: true}));
        const ok = !!dd['mouseDownEvent'];
        dd['_mouseUp'](new MouseEvent('mouseup'));
        delete DDManager.mouseHandled;
        return ok;
      };
      expect(started(shadow.querySelector('.drag-handle') as HTMLElement)).toBe(true);
      expect(started(shadow.querySelector('.body') as HTMLElement)).toBe(false);
    });

    it("does not steal a nested item's handle", () => {
      document.body.insertAdjacentHTML('afterbegin',
        '<div class="grid-stack-item outer"><div class="grid-stack-item-content">' +
        '<div class="grid-stack"><div class="grid-stack-item inner">' +
        '<div class="grid-stack-item-content"><div class="card"></div></div>' +
        '</div></div></div></div>');
      host = document.querySelector('.outer') as GridItemHTMLElement;
      const card = host.querySelector('.card') as HTMLElement;
      const shadow = card.attachShadow({mode: 'open'});
      shadow.innerHTML = '<button class="drag-handle">::</button>';
      const dd = DDElement.init(host).setupDraggable({handle: '.drag-handle'}).ddDraggable!;
      // that handle belongs to .inner (through the shadow host), not to us
      expect(dd['dragEls']).toEqual([host]); // fell back to ourself, correctly
    });
  });

  describe('3188 touch blocked after removing a widget >', () => {
    let el: GridItemHTMLElement;
    afterEach(() => {
      DDTouch.touchHandled = false;
      delete DDManager.mouseHandled;
      delete DDManager.dragElement;
      el?.remove();
    });

    const makeDraggable = (): DDDraggable => {
      document.body.insertAdjacentHTML('afterbegin',
        '<div class="grid-stack-item"><div class="grid-stack-item-content">x</div></div>');
      el = document.querySelector('.grid-stack-item') as GridItemHTMLElement;
      return DDElement.init(el).setupDraggable({handle: '.grid-stack-item-content'}).ddDraggable!;
    };

    it('destroying a widget mid-touch releases the global touch latch', () => {
      const dd = makeDraggable();
      const handle = el.querySelector('.grid-stack-item-content') as HTMLElement;

      // what the delayed touchstart does once the 300ms long-press elapses
      DDTouch.touchHandled = true;
      const down = new MouseEvent('mousedown', {button: 0, bubbles: true});
      Object.defineProperty(down, 'target', {value: handle});
      Object.defineProperty(down, 'currentTarget', {value: handle});
      dd['_mouseDown'](down);
      expect(dd['mouseDownEvent']).toBeTruthy();

      // now the widget gets removed out from under the touch - no touchend will ever arrive
      dd.destroy();

      expect(DDTouch.touchHandled).toBe(false);
      expect(DDManager.mouseHandled).toBeFalsy();
    });

    it('a later touchstart is no longer swallowed', () => {
      const dd = makeDraggable();
      const handle = el.querySelector('.grid-stack-item-content') as HTMLElement;
      DDTouch.touchHandled = true;
      const down = new MouseEvent('mousedown', {button: 0, bubbles: true});
      Object.defineProperty(down, 'target', {value: handle});
      Object.defineProperty(down, 'currentTarget', {value: handle});
      dd['_mouseDown'](down);
      dd.destroy();

      // touchstart() bails out at the top on a set latch, so nothing could ever drag again
      const next = makeDraggable();
      const nextHandle = el.querySelector('.grid-stack-item-content') as HTMLElement;
      const touch = {clientX: 5, clientY: 5} as Touch;
      const ev = {
        type: 'touchstart', currentTarget: nextHandle, touches: [touch], changedTouches: [touch],
        cancelable: true, preventDefault: () => undefined,
      } as unknown as TouchEvent;
      touchstart(ev);
      expect(DDTouch.touchDelayTimer).toBeTruthy(); // it armed, instead of early-returning
      cancelPendingTouchDrag();
      next.destroy();
    });
  });

  describe('2953 maxRow overlap from API >', () => {
    beforeEach(() => {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(() => {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('update() that cannot fit under maxRow is refused, not overlapped', () => {
      grid = GridStack.init({maxRow: 4, cellHeight: 50, children: [
        {id: 'A', x: 0, y: 0, w: 12, h: 2},
        {id: 'B', x: 0, y: 2, w: 12, h: 2},
      ]});
      const A = grid.engine.nodes.find(n => n.id === 'A')!;
      const B = grid.engine.nodes.find(n => n.id === 'B')!;

      // grid is full (maxRow=4): growing A to 3 would need B at y=3..5, past maxRow.
      // interactive resize refuses this, so the API must too rather than overlap B.
      grid.update(A.el!, {h: 3});
      expect(A.h).toBe(2);
      expect(B.y).toBe(2);
      expect(grid.engine.getRow()).toBe(4);
      const overlap = A.y! < B.y! + B.h! && B.y! < A.y! + A.h!;
      expect(overlap).toBe(false);
    });
    it('update() that does fit still pushes items down', () => {
      grid = GridStack.init({maxRow: 6, cellHeight: 50, children: [
        {id: 'A', x: 0, y: 0, w: 12, h: 2},
        {id: 'B', x: 0, y: 2, w: 12, h: 2},
      ]});
      const A = grid.engine.nodes.find(n => n.id === 'A')!;
      const B = grid.engine.nodes.find(n => n.id === 'B')!;
      grid.update(A.el!, {h: 3});
      expect(A.h).toBe(3);
      expect(B.y).toBe(3);
    });
  });

  describe('2703 icon inside a button drag handle >', () => {
    let el: HTMLElement;
    afterEach(() => {
      el?.remove();
    });

    const mouseDown = (target: HTMLElement): boolean => {
      const dd = (el as GridItemHTMLElement).ddElement?.ddDraggable;
      const e = new MouseEvent('mousedown', {button: 0, bubbles: true});
      Object.defineProperty(e, 'target', {value: target});
      Object.defineProperty(e, 'currentTarget', {value: dd!['dragEls'][0]});
      // returns true when it bailed out (did NOT take the drag)
      const skipped = dd!['_mouseDown'](e) === true && !dd!['mouseDownEvent'];
      dd!['_mouseUp'](new MouseEvent('mouseup'));
      delete DDManager.mouseHandled;
      return !skipped; // true = drag was taken
    };

    it('drags from the icon nested in a <button> handle', () => {
      document.body.insertAdjacentHTML('afterbegin',
        '<div class="grid-stack-item"><div class="grid-stack-item-content">' +
        '<button class="my-handle"><i class="icon"></i></button></div></div>');
      el = document.querySelector('.grid-stack-item');
      DDElement.init(el).setupDraggable({handle: '.my-handle'});

      const button = el.querySelector('.my-handle') as HTMLElement;
      const icon = el.querySelector('.icon') as HTMLElement;
      expect(mouseDown(button)).toBe(true); // already worked
      expect(mouseDown(icon)).toBe(true);   // #2703: used to bail on the <button> blocklist
    });

    it('still lets a <button> nested in a larger handle keep its click', () => {
      document.body.insertAdjacentHTML('afterbegin',
        '<div class="grid-stack-item"><div class="grid-stack-item-content">' +
        '<button class="action">go</button></div></div>');
      el = document.querySelector('.grid-stack-item');
      DDElement.init(el).setupDraggable({handle: '.grid-stack-item-content'});

      const action = el.querySelector('.action') as HTMLElement;
      expect(mouseDown(action)).toBe(false); // must NOT start a drag
    });
  });

  describe('2819 diagonal drag stuck on a tall neighbour it barely grazes >', () => {
    const CH = 50, CW = 50;
    beforeEach(() => {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(() => {
      document.body.removeChild(document.getElementById('gs-cont'));
    });

    // reporter's video: dragging mostly sideways, with a small amount of vertical mouse creep,
    // froze completely against a tall neighbour instead of continuing to slide horizontally -
    // even though the row the item started on was completely free the whole way across.
    it('still slides sideways when the vertical component fails 50% coverage', () => {
      grid = GridStack.init({column: 12, cellHeight: CH, mode: 'float', children: [
        {id: 'move', x: 5, y: 0, w: 2, h: 1},
        {id: 'big', x: 0, y: 1, w: 2, h: 6},
      ]});
      const move = grid.engine.nodes.find(n => n.id === 'move')!;
      const big = grid.engine.nodes.find(n => n.id === 'big')!;

      grid.engine.cleanNodes().beginUpdate(move);
      move._moving = true;
      grid.engine.cacheRects(CW, CH, 0, 0, 0, 0);

      // dx=-4 (mostly horizontal), dy=1 (a sliver dipping into 'big' row) - only 1 of 6 rows of
      // overlap (~17%), nowhere near the 50% needed to push 'big' out of the way
      grid.engine.moveNodeCheck(move, {x: 1, y: 1, w: 2, h: 1, cellWidth: CW, cellHeight: CH,
        rect: {x: 1 * CW, y: 1 * CH, w: 2 * CW, h: 1 * CH}});

      expect(big.y).toBe(1); // untouched, correctly - coverage really is too small to push it
      expect(move.y).toBe(0); // stayed on its original free row...
      expect(move.x).toBe(1); // ...but still allowed to slide over sideways, not stuck at x=5
      grid.engine.endUpdate();
    });

    it('does not slide sideways into something actually blocking that row', () => {
      grid = GridStack.init({column: 12, cellHeight: CH, mode: 'float', children: [
        {id: 'move', x: 5, y: 0, w: 2, h: 1},
        {id: 'big', x: 0, y: 1, w: 2, h: 6},
        {id: 'blocker', x: 1, y: 0, w: 2, h: 1},
      ]});
      const move = grid.engine.nodes.find(n => n.id === 'move')!;

      grid.engine.cleanNodes().beginUpdate(move);
      move._moving = true;
      grid.engine.cacheRects(CW, CH, 0, 0, 0, 0);

      grid.engine.moveNodeCheck(move, {x: 1, y: 1, w: 2, h: 1, cellWidth: CW, cellHeight: CH,
        rect: {x: 1 * CW, y: 1 * CH, w: 2 * CW, h: 1 * CH}});

      // the horizontal-only fallback still engaged (not frozen at its starting spot)...
      expect(move.x === 5 && move.y === 0).toBe(false);
      // ...but went through the normal collision/push logic rather than teleporting onto 'blocker'
      const ns = grid.engine.nodes;
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const a = ns[i], b = ns[j];
          const overlap = a.x! < b.x! + b.w! && b.x! < a.x! + a.w! && a.y! < b.y! + b.h! && b.y! < a.y! + a.h!;
          expect(overlap).toBe(false);
        }
      }
      grid.engine.endUpdate();
    });
  });

  describe('2208 cellHeight in viewport units drifts items >', () => {
    beforeEach(() => {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(() => {
      document.body.removeChild(document.getElementById('gs-cont'));
    });

    it('converts vw/vh to pixels instead of guessing from the first item', () => {
      grid = GridStack.init({column: 12, cellHeight: '1vw', margin: 0,
        children: [{x: 0, y: 0, w: 1, h: 1}]});
      expect(grid.opts.cellHeightUnit).toBe('vw');
      // 1vw = 1% of the viewport width. We used to fall through to measuring the first item, which
      // is only approximate - and positions are y*cellHeight, so the error grew with the row index
      expect(grid.getCellHeight(true)).toBeCloseTo(window.innerWidth / 100, 6);

      grid.cellHeight('2vh');
      expect(grid.opts.cellHeightUnit).toBe('vh');
      expect(grid.getCellHeight(true)).toBeCloseTo(2 * window.innerHeight / 100, 6);
    });

    it('still handles the units it already knew', () => {
      grid = GridStack.init({column: 12, cellHeight: '10mm', margin: 0});
      expect(grid.getCellHeight(true)).toBeCloseTo(10 * (96 / 2.54) / 10, 6);
      grid.cellHeight('50px');
      expect(grid.getCellHeight(true)).toBe(50);
    });

    it('a row position is an exact multiple of the cell height, however far down', () => {
      grid = GridStack.init({column: 12, cellHeight: '1vw', margin: 0,
        children: [{id: 'top', x: 0, y: 0, w: 1, h: 1}, {id: 'low', x: 0, y: 40, w: 1, h: 1}]});
      const ch = grid.getCellHeight(true);
      // no accumulating drift: row 40 sits at exactly 40 cells down
      expect(40 * ch).toBeCloseTo(40 * window.innerWidth / 100, 6);
      expect(Number.isFinite(ch)).toBe(true);
      expect(ch).toBeGreaterThan(0);
    });
  });

  describe('1959 update() must not overlap a locked item >', () => {
    beforeEach(() => {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(() => {
      document.body.removeChild(document.getElementById('gs-cont'));
    });

    const overlaps = (a: GridStackNode, b: GridStackNode): boolean =>
      a.y! < b.y! + b.h! && b.y! < a.y! + a.h! && a.x! < b.x! + b.w! && b.x! < a.x! + a.w!;

    const setup = (mode: GridStackMode, lockY: number, startY: number) => {
      grid?.destroy(false);
      document.getElementById('gs-cont')!.innerHTML = '<div class="grid-stack"></div>';
      grid = GridStack.init({column: 12, cellHeight: 50, mode, children: [
        {id: 'lock', x: 0, y: lockY, w: 2, h: 2, locked: true, noMove: true, noResize: true},
        {id: 'move', x: 0, y: startY, w: 2, h: 2},
      ]});
      const move = grid.engine.nodes.find(n => n.id === 'move')!;
      const lock = grid.engine.nodes.find(n => n.id === 'lock')!;
      expect(overlaps(move, lock)).toBe(false); // sane starting layout
      return { move, lock };
    };

    it('stays put rather than overlapping, across modes and targets', () => {
      const bad: string[] = [];
      (['top', 'float', 'list', 'compact'] as GridStackMode[]).forEach(mode => {
        [0, 2, 4].forEach(lockY => {
          [6, 7].forEach(startY => {
            [0, 1, 2, 3, 4, 5].forEach(targetY => {
              const { move, lock } = setup(mode, lockY, startY);
              grid.update(move.el!, {y: targetY});
              if (overlaps(move, lock)) {
                bad.push(`${mode} lock@${lockY} ${startY}->${targetY} landed @${move.y}`);
              }
            });
          });
        });
      });
      expect(bad).toEqual([]);
    });

    it('still moves when the locked item is not in the way', () => {
      const { move, lock } = setup('top', 0, 6);
      grid.update(move.el!, {y: 2}); // right below the locked rows 0-1
      expect(move.y).toBe(2);
      expect(overlaps(move, lock)).toBe(false);
    });

    it('still pushes a plain (unlocked) neighbour out of the way', () => {
      grid?.destroy(false);
      document.getElementById('gs-cont')!.innerHTML = '<div class="grid-stack"></div>';
      grid = GridStack.init({column: 12, cellHeight: 50, mode: 'float', children: [
        {id: 'free', x: 0, y: 0, w: 2, h: 2},
        {id: 'move', x: 0, y: 6, w: 2, h: 2},
      ]});
      const move = grid.engine.nodes.find(n => n.id === 'move')!;
      const free = grid.engine.nodes.find(n => n.id === 'free')!;
      grid.update(move.el!, {y: 0});
      expect(overlaps(move, free)).toBe(false);
      expect(move.y).toBe(0); // took the spot, pushed the other one
      expect(free.y).toBe(2);
    });
  });

  describe('2728 drag + page scroll under a css transform >', () => {
    let host: HTMLElement;
    // jsdom has no layout, so the real probe measures 0x0 -> scale Infinity. Feed it a
    // believable translate(50,100) scale(0.5) reading like demo/transform.html has.
    const SCALED = {xScale: 2, yScale: 2, xOffset: 50, yOffset: 100};

    afterEach(() => {
      delete DDManager.mouseHandled;
      delete DDManager.dragElement;
      vi.restoreAllMocks();
      document.getElementById('gs-cont')?.remove();
    });

    /** get into a live dragging state so helper/dragOffset/dragTransform are all set up */
    const startDrag = (transform = SCALED) => {
      vi.spyOn(Utils, 'getValuesFromTransformedElement').mockReturnValue({...transform});
      document.body.insertAdjacentHTML('afterbegin',
        '<div id="gs-cont"><div class="scaled"><div class="grid-stack">' +
        '<div class="grid-stack-item"><div class="grid-stack-item-content">x</div></div>' +
        '</div></div></div>');
      host = document.querySelector('.grid-stack-item');
      const handle = host.querySelector('.grid-stack-item-content') as HTMLElement;
      const dd = DDElement.init(host as GridItemHTMLElement).setupDraggable({handle: '.grid-stack-item-content'}).ddDraggable!;
      const down = new MouseEvent('mousedown', {button: 0, bubbles: true, clientX: 100, clientY: 100});
      Object.defineProperty(down, 'target', {value: handle});
      Object.defineProperty(down, 'currentTarget', {value: handle});
      dd['_mouseDown'](down);
      dd['_mouseMove'](new MouseEvent('mousemove', {clientX: 120, clientY: 120}));
      expect(dd['dragging']).toBe(true);
      return dd;
    };

    it('backs the helper out by however far the containing block scrolled', () => {
      const dd = startDrag();
      expect(dd['_cbDrift']).toEqual({dx: 0, dy: 0});

      const move = new MouseEvent('mousemove', {clientX: 120, clientY: 120});
      dd['_dragFollow'](move);
      const before = parseFloat(dd['helper']!.style.top);
      expect(Number.isFinite(before)).toBe(true);

      // page scrolls down 200px: the transformed block - and the fixed probe inside it - slides up 200
      vi.mocked(Utils.getValuesFromTransformedElement).mockReturnValue({...SCALED, yOffset: SCALED.yOffset - 200});
      document.dispatchEvent(new Event('scroll'));
      expect(dd['_cbDrift']).toEqual({dx: 0, dy: -200});

      dd['_dragFollow'](move);
      const after = parseFloat(dd['helper']!.style.top);
      // pushed back down by the scroll, expressed in the block's own unscaled units
      expect(after - before).toBeCloseTo(200 * SCALED.yScale, 5);

      dd['_mouseUp'](new MouseEvent('mouseup'));
      expect(dd['_cbDrift']).toEqual({dx: 0, dy: 0});
    });

    it('no transform: the fixed probe reads (0,0) at any scroll, so nothing is corrected', () => {
      const NONE = {xScale: 1, yScale: 1, xOffset: 0, yOffset: 0};
      const dd = startDrag(NONE);
      const move = new MouseEvent('mousemove', {clientX: 120, clientY: 120});
      dd['_dragFollow'](move);
      const before = parseFloat(dd['helper']!.style.top);

      document.dispatchEvent(new Event('scroll')); // probe still (0,0) - viewport is the containing block
      expect(dd['_cbDrift']).toEqual({dx: 0, dy: 0});
      dd['_dragFollow'](move);
      expect(parseFloat(dd['helper']!.style.top)).toBe(before);
      dd['_mouseUp'](new MouseEvent('mouseup'));
    });

    it('stops listening for scroll once the drag ends', () => {
      const dd = startDrag();
      dd['_mouseUp'](new MouseEvent('mouseup'));
      vi.mocked(Utils.getValuesFromTransformedElement).mockReturnValue({...SCALED, yOffset: SCALED.yOffset - 500});
      document.dispatchEvent(new Event('scroll'));
      expect(dd['_cbDrift']).toEqual({dx: 0, dy: 0});
    });
  });

  describe('2729 draggable cancel inside shadow DOM >', () => {
    let host: HTMLElement;
    afterEach(() => {
      delete DDManager.mouseHandled;
      host?.remove();
    });

    /** item whose content holds a web component with `.no-drag` inside its shadow root */
    const build = (cancel: string) => {
      document.body.insertAdjacentHTML('afterbegin',
        '<div class="grid-stack-item"><div class="grid-stack-item-content">' +
        '<div class="wc"></div><span class="plain">plain</span>' +
        '</div></div>');
      host = document.querySelector('.grid-stack-item');
      const wc = host.querySelector('.wc') as HTMLElement;
      const shadow = wc.attachShadow({mode: 'open'});
      shadow.innerHTML = '<div class="no-drag">handle off</div><div class="ok">draggable</div>';
      DDElement.init(host as GridItemHTMLElement).setupDraggable({handle: '.grid-stack-item-content', cancel});
      return shadow;
    };

    /** dispatch a real composed mousedown so the browser/jsdom retargets e.target like it would live */
    const dragStarted = (target: HTMLElement): boolean => {
      const dd = (host as GridItemHTMLElement).ddElement!.ddDraggable!;
      target.dispatchEvent(new MouseEvent('mousedown', {button: 0, bubbles: true, composed: true, cancelable: true}));
      const started = !!dd['mouseDownEvent'];
      dd['_mouseUp'](new MouseEvent('mouseup'));
      delete DDManager.mouseHandled;
      return started;
    };

    it('honors cancel for an element inside a shadow root', () => {
      const shadow = build('.no-drag');
      expect(dragStarted(shadow.querySelector('.ok') as HTMLElement)).toBe(true);
      // #2729: e.target is retargeted to the <div class="wc"> host out here, and closest()
      // does not cross the shadow boundary, so this used to start a drag anyway
      expect(dragStarted(shadow.querySelector('.no-drag') as HTMLElement)).toBe(false);
    });

    it('still honors cancel in the light DOM', () => {
      build('.plain');
      expect(dragStarted(host.querySelector('.plain') as HTMLElement)).toBe(false);
      expect(dragStarted(host.querySelector('.grid-stack-item-content') as HTMLElement)).toBe(true);
    });
  });

  describe('3355 nested scroll containers dead-end the drag >', () => {
    let inner: HTMLElement, outer: HTMLElement, item: HTMLElement;
    afterEach(() => {
      vi.restoreAllMocks();
      document.getElementById('gs-cont')?.remove();
    });

    /** an item inside a scroller inside another scroller, each with its own limits */
    const nest = (innerAtLimit: boolean) => {
      document.body.insertAdjacentHTML('afterbegin',
        '<div id="gs-cont"><div class="outer"><div class="inner">' +
        '<div class="grid-stack-item"><div class="grid-stack-item-content">x</div></div>' +
        '</div></div></div>');
      outer = document.querySelector('.outer') as HTMLElement;
      inner = document.querySelector('.inner') as HTMLElement;
      item = document.querySelector('.grid-stack-item') as HTMLElement;

      const mk = (el: HTMLElement, top: number, max: number) => {
        const box = {top};
        Object.defineProperty(el, 'scrollTop', {
          get: () => box.top,
          set: (v: number) => { box.top = Math.max(0, Math.min(v, max)); },
          configurable: true,
        });
        return box;
      };
      const innerBox = mk(inner, innerAtLimit ? 500 : 0, 500);
      const outerBox = mk(outer, 0, 500);

      const dd = DDElement.init(item as GridItemHTMLElement).setupDraggable({}).ddDraggable!;
      const self = dd as unknown as {
        helper?: HTMLElement; _autoScrollContainer?: HTMLElement; _autoScrollMaxSpeed?: number;
        lastDrag?: MouseEvent;
        _getScrollAmount(el: HTMLElement, s: HTMLElement, y: number): number;
        _autoScrollTick(): void; dragging?: boolean;
      };
      self.helper = item;
      self._autoScrollContainer = inner;
      self._autoScrollMaxSpeed = 10;
      self.lastDrag = { clientY: 0 } as MouseEvent; // tick reads the cursor from here
      // pretend the cursor is near the bottom edge with the item still clipped there, so we want to scroll DOWN
      vi.spyOn(self as unknown as Record<string, () => number>, '_getScrollAmount').mockReturnValue(40);
      // getScrollElement walks up and should find `outer` above `inner`
      vi.spyOn(Utils, 'getScrollElement').mockImplementation(() => outer);
      return { dd, self, innerBox, outerBox };
    };

    it('hands off to the outer container when the inner one is pinned', () => {
      const { self, innerBox, outerBox } = nest(true);
      expect(innerBox.top).toBe(500); // already at its limit

      self._autoScrollTick();

      expect(outerBox.top).toBeGreaterThan(0); // the page behind finally moves
      expect(self._autoScrollContainer).toBe(outer); // and we keep going on that one
    });

    it('stays on the inner container while it can still scroll', () => {
      const { self, innerBox, outerBox } = nest(false);
      self._autoScrollTick();
      expect(innerBox.top).toBeGreaterThan(0);
      expect(outerBox.top).toBe(0); // outer untouched
      expect(self._autoScrollContainer).toBe(inner);
    });

    it('gives up once everything is pinned', () => {
      const { self, outerBox } = nest(true);
      outerBox.top = 500; // both at their limits
      const stop = vi.spyOn(self as unknown as Record<string, () => void>, '_stopScrolling');
      self._autoScrollTick();
      expect(stop).toHaveBeenCalled();
    });
  });

  describe('3356 auto-scroll follows the cursor, not the dragged box >', () => {
    let item: HTMLElement, scrollEl: HTMLElement;
    afterEach(() => {
      vi.restoreAllMocks();
      document.getElementById('gs-cont')?.remove();
    });

    // a 500px-tall visible scroll region ([0,500]); band = max(500*0.08,30) = 40px, maxSpeed = max(500/150,4) = 4
    const setup = (itemTop: number, itemBottom: number) => {
      document.body.insertAdjacentHTML('afterbegin',
        '<div id="gs-cont"><div class="grid-stack-item"><div class="grid-stack-item-content">x</div></div></div>');
      item = document.querySelector('.grid-stack-item') as HTMLElement;
      scrollEl = document.getElementById('gs-cont') as HTMLElement;
      const rect = (top: number, bottom: number) => () =>
        ({ top, bottom, height: bottom - top, left: 0, right: 0, width: 0, x: 0, y: top, toJSON: () => ({}) } as DOMRect);
      item.getBoundingClientRect = rect(itemTop, itemBottom);
      scrollEl.getBoundingClientRect = rect(0, 500);
      vi.spyOn(Utils, 'getVisibleViewport').mockReturnValue({ top: 0, bottom: 1000 }); // viewport bigger than the region

      const dd = DDElement.init(item as GridItemHTMLElement).setupDraggable({}).ddDraggable!;
      const self = dd as unknown as { helper?: HTMLElement; _getScrollAmount(el: HTMLElement, s: HTMLElement, y: number): number };
      self.helper = item;
      return (clientY: number) => self._getScrollAmount(item, scrollEl, clientY);
    };

    it('an oversized item overhanging both edges does NOT scroll while the cursor sits mid-region', () => {
      const scroll = setup(-200, 700); // hangs past top AND bottom the whole drag
      expect(scroll(250)).toBe(0); // old box-based logic scrolled here since the box was always clipped
    });

    it('scrolls down when the cursor nears the bottom edge and the item is clipped below', () => {
      const scroll = setup(-200, 700);
      expect(scroll(480)).toBeGreaterThan(0);
    });

    it('scrolls up when the cursor nears the top edge and the item is clipped above', () => {
      const scroll = setup(-200, 700);
      expect(scroll(20)).toBeLessThan(0);
    });

    it('does NOT scroll toward an edge the item is already clear of (clip guard)', () => {
      const scroll = setup(100, 400); // fully inside the region
      expect(scroll(480)).toBe(0); // cursor at the bottom band, but nothing of the item hangs below
    });

    it('scrolls faster the closer the cursor gets to the edge', () => {
      const scroll = setup(-200, 700);
      expect(Math.abs(scroll(495))).toBeGreaterThan(Math.abs(scroll(470)));
    });

    /** drives updateScrollPosition() for a drag that started at `startY`, with a controllable "wants to scroll"
     * amount. Scroll container visible over [0,500] so the bottom edge is at 500, the top edge at 0 */
    const gate = (startY: number) => {
      document.body.insertAdjacentHTML('afterbegin',
        '<div id="gs-cont"><div class="grid-stack-item"><div class="grid-stack-item-content">x</div></div></div>');
      const el = document.querySelector('.grid-stack-item') as HTMLElement;
      const dd = DDElement.init(el as GridItemHTMLElement).setupDraggable({}).ddDraggable!;
      const self = dd as unknown as {
        helper?: HTMLElement; lastDrag?: MouseEvent; _autoScrollAnimId?: number; _autoScrollContainer?: HTMLElement;
        dragging?: boolean; mouseDownEvent?: MouseEvent;
        _getScrollAmount(el: HTMLElement, s: HTMLElement, y: number): number;
        _mouseMove(e: MouseEvent): boolean;
        updateScrollPosition(g: HTMLElement): void;
      };
      self.helper = el;
      self.mouseDownEvent = { clientY: startY } as MouseEvent;
      el.getBoundingClientRect = () => ({ top: 0, bottom: 500, height: 500, left: 0, right: 0, width: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
      vi.spyOn(Utils, 'getVisibleViewport').mockReturnValue({ top: 0, bottom: 1000 });
      const box = { amount: 5 }; // >0 = wants to scroll DOWN, <0 = UP, 0 = cursor not near an edge
      vi.spyOn(Utils, 'getScrollElement').mockReturnValue(el);
      vi.spyOn(self as unknown as Record<string, () => number>, '_getScrollAmount').mockImplementation(() => box.amount);
      // mocked so the loop never actually runs; we assert on this instance's own anim id (no shared-global pollution)
      vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(123 as unknown as number);
      const move = (clientY: number) => { self.lastDrag = { clientY } as MouseEvent; self.updateScrollPosition(el); };
      return { el, self, move, box };
    };

    it('waits until the cursor has moved 10px toward the edge from where the drag started', () => {
      const { self, move } = gate(460); // started in the bottom band, 40px from the edge
      move(460); move(465);             // not moved / only 5px toward the edge
      expect(self._autoScrollAnimId).toBeUndefined();
      move(455);                        // moved AWAY from the edge
      expect(self._autoScrollAnimId).toBeUndefined();
      move(470);                        // 10px toward the edge since the start -> STARTS
      expect(self._autoScrollAnimId).toBe(123);
    });

    it('sliding sideways along the band with a clipped item does NOT start', () => {
      const { self, move } = gate(470);
      move(472); move(468); move(471); move(470); // a little vertical wobble, but no net move toward the edge
      expect(self._autoScrollAnimId).toBeUndefined();
    });

    it('speed does not matter - a single jump counts, since it is measured from the start', () => {
      const { self, move } = gate(300); // started mid-grid
      move(470);                        // one big move straight into the band
      expect(self._autoScrollAnimId).toBe(123);
    });

    it('already within 10px of the edge (or past it) starts right away', () => {
      const { self, move } = gate(495);
      move(495);                        // hasn't moved, but is right at the edge
      expect(self._autoScrollAnimId).toBe(123);
    });

    it('works the same toward the top edge', () => {
      const { self, move, box } = gate(35);
      box.amount = -5;                  // wants to scroll UP
      move(35); move(30);               // only 5px up from the start, 30px from the top edge
      expect(self._autoScrollAnimId).toBeUndefined();
      move(25);                         // 10px up -> STARTS
      expect(self._autoScrollAnimId).toBe(123);
    });

    it('still STARTS after a quick push takes the cursor off the grid (grid no longer sends drag events)', () => {
      const { el, self } = gate(300);
      vi.spyOn(self as unknown as Record<string, () => void>, '_dragFollow').mockImplementation(() => {});
      vi.spyOn(self as unknown as Record<string, () => void>, '_callDrag').mockImplementation(() => {}); // grid did _leave(): nobody calls updateScrollPosition
      self.dragging = true;
      self._autoScrollContainer = el; // registered by the grid while the cursor was still over it
      const prevDrop = DDManager.dropElement;
      delete DDManager.dropElement;   // cursor is now over empty space
      try {
        self._mouseMove({ clientY: 340 } as MouseEvent); // one fast 40px push toward the bottom edge
        expect(self._autoScrollAnimId).toBe(123);
      } finally {
        DDManager.dropElement = prevDrop;
      }
    });

    it('leaves the start to the grid while the cursor is over one (no double handling)', () => {
      const { el, self } = gate(300);
      vi.spyOn(self as unknown as Record<string, () => void>, '_dragFollow').mockImplementation(() => {});
      vi.spyOn(self as unknown as Record<string, () => void>, '_callDrag').mockImplementation(() => {});
      const check = vi.spyOn(self as unknown as Record<string, () => void>, '_checkAutoScroll');
      self.dragging = true;
      self.mouseDownEvent = { clientY: 300 } as MouseEvent;
      self._autoScrollContainer = el;
      const prevDrop = DDManager.dropElement;
      DDManager.dropElement = {} as typeof DDManager.dropElement; // over some grid's droppable
      try {
        self._mouseMove({ clientY: 340 } as MouseEvent);
        expect(check).not.toHaveBeenCalled();
      } finally {
        DDManager.dropElement = prevDrop;
      }
    });
  });
});
