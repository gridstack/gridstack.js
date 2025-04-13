import { GridItemHTMLElement, GridStack, GridStackWidget } from '../src/gridstack';

describe('regression >', function() {
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

  describe('2492 load() twice >', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('', function() {
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

      expect(el0.getAttribute('gs-x')).toBe(null);
      expect(el0.getAttribute('gs-y')).toBe(null);
      expect(el0.children[0].innerHTML).toBe(items[0].content!);
      expect(parseInt(el1.getAttribute('gs-x'))).toBe(1);
      expect(parseInt(el1.getAttribute('gs-y'))).toBe(1);
      expect(parseInt(el2.getAttribute('gs-x'))).toBe(2);
      expect(el2.getAttribute('gs-y')).toBe(null);

      // loading with changed content should be same positions
      items.forEach(n => n.content += '*')
      grid.load(items);
      expect(el0.getAttribute('gs-x')).toBe(null);
      expect(el0.getAttribute('gs-y')).toBe(null);
      expect(el0.children[0].innerHTML).toBe(items[0].content!);
      expect(parseInt(el1.getAttribute('gs-x'))).toBe(1);
      expect(parseInt(el1.getAttribute('gs-y'))).toBe(1);
      expect(parseInt(el2.getAttribute('gs-x'))).toBe(2);
      expect(el2.getAttribute('gs-y')).toBe(null);
    });
  });

  describe('2865 nested grid resize >', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('', function() {
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
      expect(nested.getAttribute('gs-x')).toBe(null);
      expect(nested.getAttribute('gs-y')).toBe(null);
      expect(parseInt(nested.getAttribute('gs-w'))).toBe(3);
      // TODO: sizeToContent doesn't seem to be called in headless mode ??? works in browser.
      // expect(nested.getAttribute('gs-h')).toBe(null); // sizeToContent 5 -> 1 which is null
      expect(el1.getAttribute('gs-x')).toBe(null);
      expect(el1.getAttribute('gs-y')).toBe(null);
      expect(parseInt(el2.getAttribute('gs-x'))).toBe(1);
      expect(el2.getAttribute('gs-y')).toBe(null);
      expect(parseInt(el3.getAttribute('gs-x'))).toBe(2);
      expect(el3.getAttribute('gs-y')).toBe(null);

      // now resize the nested grid to 2 -> should reflow el3
      grid.update(nested, {w:2});
      expect(nested.getAttribute('gs-x')).toBe(null);
      expect(nested.getAttribute('gs-y')).toBe(null);
      expect(parseInt(nested.getAttribute('gs-w'))).toBe(2);
      // TODO: sizeToContent doesn't seem to be called in headless mode ??? works in browser.
      // expect(parseInt(nested.getAttribute('gs-h'))).toBe(2);
      expect(el1.getAttribute('gs-x')).toBe(null);
      expect(el1.getAttribute('gs-y')).toBe(null);
      expect(parseInt(el2.getAttribute('gs-x'))).toBe(1);
      expect(el2.getAttribute('gs-y')).toBe(null);
      // 3rd item pushed to next row
      expect(el3.getAttribute('gs-x')).toBe(null);
      expect(parseInt(el3.getAttribute('gs-y'))).toBe(1);
    });
  });
});
