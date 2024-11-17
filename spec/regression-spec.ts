import { GridItemHTMLElement, GridStack, GridStackWidget } from '../src/gridstack';

describe('regression >', function() {
  'use strict';

  let grid: GridStack;
  let findEl = function(id: string): GridItemHTMLElement {
    return grid.engine.nodes.find(n => n.id === id)!.el!;
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

      expect(parseInt(el0.getAttribute('gs-x'), 10)).toBe(0);
      expect(parseInt(el0.getAttribute('gs-y'), 10)).toBe(0);
      expect(el0.children[0].innerHTML).toBe(items[0].content!);
      expect(parseInt(el1.getAttribute('gs-x'), 10)).toBe(1);
      expect(parseInt(el1.getAttribute('gs-y'), 10)).toBe(1);
      expect(parseInt(el2.getAttribute('gs-x'), 10)).toBe(2);
      expect(parseInt(el2.getAttribute('gs-y'), 10)).toBe(0);

      // loading with changed content should be same positions
      items.forEach(n => n.content += '*')
      grid.load(items);
      expect(parseInt(el0.getAttribute('gs-x'), 10)).toBe(0);
      expect(parseInt(el0.getAttribute('gs-y'), 10)).toBe(0);
      expect(el0.children[0].innerHTML).toBe(items[0].content!);
      expect(parseInt(el1.getAttribute('gs-x'), 10)).toBe(1);
      expect(parseInt(el1.getAttribute('gs-y'), 10)).toBe(1);
      expect(parseInt(el2.getAttribute('gs-x'), 10)).toBe(2);
      expect(parseInt(el2.getAttribute('gs-y'), 10)).toBe(0);
    });
  });
});
