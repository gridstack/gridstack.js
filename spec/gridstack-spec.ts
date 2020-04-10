import { GridStack } from '../src/gridstack';
import { GridStackDragDropPlugin } from '../src/gridstack-dragdrop-plugin';

describe('gridstack', function() {
  'use strict';

  // grid has 4x2 and 4x4 top-left aligned - used on most test cases
  let gridHTML =
  '<div class="grid-stack">' +
  '  <div class="grid-stack-item" data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="2" id="item1">' +
  '    <div class="grid-stack-item-content">item 1</div>' +
  '  </div>' +
  '  <div class="grid-stack-item" data-gs-x="4" data-gs-y="0" data-gs-width="4" data-gs-height="4" id="item2">' +
  '    <div class="grid-stack-item-content">item 2</div>' +
  '  </div>' +
  '</div>';
  let gridstackHTML =
  '<div style="width: 800px; height: 600px" id="gs-cont">' + gridHTML + '</div>';
  let gridstackSmallHTML =
  '<div style="width: 400px; height: 600px" id="gs-cont">' + gridHTML + '</div>';
  // empty grid
  let gridstackEmptyHTML =
  '<div style="width: 800px; height: 600px" id="gs-cont">' +
  '  <div class="grid-stack">' +
  '  </div>' +
  '</div>';
  // nested empty grids
  let gridstackNestedHTML =
  '<div style="width: 800px; height: 600px" id="gs-cont">' +
  '  <div class="grid-stack">' +
  '    <div class="grid-stack-item">' +
  '      <div class="grid-stack-item-content">item 1</div>' +
  '      <div class="grid-stack-item-content">' +
  '         <div class="grid-stack sub1"></div>' +
  '      </div>' +
  '    </div>' +
  '  </div>' +
  '</div>';
  // generic widget with no param
  let widgetHTML = '<div id="item3"><div class="grid-stack-item-content"> hello </div></div>';

  describe('grid.init() / initAll()', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('use selector', function() {
      let grid = GridStack.init(undefined, '.grid-stack');
      expect(grid).not.toBe(null);
    });
    it('use selector no dot', function() {
      let grid = GridStack.init(null, 'grid-stack');
      expect(grid).not.toBe(null);
    });
    it('use wrong selector', function() {
      let grid = GridStack.init(null, 'FOO');
      expect(grid).toEqual(null);
    });
    it('initAll use selector', function() {
      let grids = GridStack.initAll(undefined, '.grid-stack');
      expect(grids.length).toBe(1);
    });
    it('initAll use selector no dot', function() {
      let grids = GridStack.initAll(undefined, 'grid-stack');
      expect(grids.length).toBe(1);
    });
    it('initAll use wrong selector', function() {
      let grids = GridStack.initAll(undefined, 'FOO');
      expect(grids.length).toBe(0);
    });
  });

  describe('grid.setAnimation', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should add class grid-stack-animate to the container.', function() {
      let grid = GridStack.init();
      $('.grid-stack').removeClass('grid-stack-animate');
      grid.setAnimation(true);
      expect($('.grid-stack').hasClass('grid-stack-animate')).toBe(true);
    });
    it('should remove class grid-stack-animate from the container.', function() {
      let grid = GridStack.init();
      $('.grid-stack').addClass('grid-stack-animate');
      grid.setAnimation(false);
      expect($('.grid-stack').hasClass('grid-stack-animate')).toBe(false);
    });
  });

  describe('grid._setStaticClass', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should add class grid-stack-static to the container.', function() {
      let grid = GridStack.init({staticGrid: true});
      expect($('.grid-stack').hasClass('grid-stack-static')).toBe(true);
      grid.setStatic(false);
      expect($('.grid-stack').hasClass('grid-stack-static')).toBe(false);
      grid.setStatic(true);
      expect($('.grid-stack').hasClass('grid-stack-static')).toBe(true);
    });
    it('should remove class grid-stack-static from the container.', function() {
      let grid = GridStack.init({staticGrid: false});
      expect($('.grid-stack').hasClass('grid-stack-static')).toBe(false);
      grid.setStatic(true);
      expect($('.grid-stack').hasClass('grid-stack-static')).toBe(true);
    });
  });

  describe('grid.getCellFromPixel', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should return {x: 2, y: 5}.', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid = GridStack.init(options);
      let pixel = {top: 500, left: 200};
      let cell = grid.getCellFromPixel(pixel);
      expect(cell.x).toBe(2);
      expect(cell.y).toBe(5);
      cell = grid.getCellFromPixel(pixel, false);
      expect(cell.x).toBe(2);
      expect(cell.y).toBe(5);
      cell = grid.getCellFromPixel(pixel, true);
      expect(cell.x).toBe(2);
      expect(cell.y).toBe(5);
    });
  });

  describe('grid.cellWidth', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should return 1/12th of container width.', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10,
        column: 12
      };
      let grid = GridStack.init(options);
      let res = Math.round($('.grid-stack').outerWidth() / 12);
      expect(grid.cellWidth()).toBe(res);
    });
    it('should return 1/10th of container width.', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10,
        column: 10
      };
      let grid = GridStack.init(options);
      let res = Math.round($('.grid-stack').outerWidth() / 10);
      expect(grid.cellWidth()).toBe(res);
    });
  });

  describe('grid.cellHeight', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should start at 80 then become 120', function() {
      let cellHeight = 80;
      let verticalMargin = 10;
      let options = {
        cellHeight: cellHeight,
        verticalMargin: verticalMargin,
        column: 12
      };
      let grid = GridStack.init(options);
      let container = $('.grid-stack');
      let rows = parseInt(container.attr('data-gs-current-row'));
      
      expect(grid.getRow()).toBe(rows);

      expect(grid.getCellHeight()).toBe(cellHeight);
      expect(parseInt(container.css('height'))).toBe(rows * cellHeight + (rows-1) * verticalMargin);

      grid.cellHeight( grid.getCellHeight() ); // should be no-op
      expect(grid.getCellHeight()).toBe(cellHeight);
      expect(parseInt(container.css('height'))).toBe(rows * cellHeight + (rows-1) * verticalMargin);

      cellHeight = 120; // should change and CSS actual height
      grid.cellHeight( cellHeight );
      expect(grid.getCellHeight()).toBe(cellHeight);
      expect(parseInt(container.css('height'))).toBe(rows * cellHeight + (rows-1) * verticalMargin);

      cellHeight = 20; // should change and CSS actual height
      grid.cellHeight( cellHeight );
      expect(grid.getCellHeight()).toBe(cellHeight);
      expect(parseInt(container.css('height'))).toBe(rows * cellHeight + (rows-1) * verticalMargin);
    });

    it('should be square', function() {
      let grid = GridStack.init({cellHeight: 'auto'});
      expect(grid.cellWidth()).toBe( grid.getCellHeight());
    });

  });

  describe('grid.column', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should have no changes', function() {
      let grid = GridStack.init();
      expect(grid.getColumn()).toBe(12);
      grid.column(12);
      expect(grid.getColumn()).toBe(12);
    }); 
    it('should SMALL change column number, no relayout', function() {
      let options = {
        column: 12
      };
      let grid = GridStack.init(options);
      let items = $('.grid-stack-item');
      grid.column(10, false);
      expect(grid.getColumn()).toBe(10);
      for (let j = 0; j < items.length; j++) {
        expect(parseInt($(items[j]).attr('data-gs-y'), 10)).toBe(0);
      }
      grid.column(9, true);
      expect(grid.getColumn()).toBe(9);
      for (let j = 0; j < items.length; j++) {
        expect(parseInt($(items[j]).attr('data-gs-y'), 10)).toBe(0);
      }
      grid.column(12);
      expect(grid.getColumn()).toBe(12);
      for (let j = 0; j < items.length; j++) {
        expect(parseInt($(items[j]).attr('data-gs-y'), 10)).toBe(0);
      }
    });
    it('should change column number and relayout items', function() {
      let options = {
        column: 12,
        float: true
      };
      let grid = GridStack.init(options);
      let el1 = $('#item1')
      let el2 = $('#item2')

      // items start at 4x2 and 4x4
      expect(parseInt(el1.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-width'))).toBe(4);
      expect(parseInt(el1.attr('data-gs-height'))).toBe(2);

      expect(parseInt(el2.attr('data-gs-x'))).toBe(4);
      expect(parseInt(el2.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el2.attr('data-gs-width'))).toBe(4);
      expect(parseInt(el2.attr('data-gs-height'))).toBe(4);
      // 1 column will have item1, item2
      grid.column(1);
      expect(grid.getColumn()).toBe(1);
      expect(parseInt(el1.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el1.attr('data-gs-height'))).toBe(2);

      expect(parseInt(el2.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el2.attr('data-gs-y'))).toBe(2);
      expect(parseInt(el2.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el2.attr('data-gs-height'))).toBe(4);

      // add default 1x1 item to the end (1 column)
      let el3 = $(grid.addWidget(widgetHTML));
      expect(el3).not.toBe(null);
      expect(parseInt(el3.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(6);
      expect(parseInt(el3.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el3.attr('data-gs-height'))).toBe(1);

      // back to 12 column and initial layout (other than new item3)
      grid.column(12);
      expect(grid.getColumn()).toBe(12);
      expect(parseInt(el1.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-width'))).toBe(4);
      expect(parseInt(el1.attr('data-gs-height'))).toBe(2);

      expect(parseInt(el2.attr('data-gs-x'))).toBe(4);
      expect(parseInt(el2.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el2.attr('data-gs-width'))).toBe(4);
      expect(parseInt(el2.attr('data-gs-height'))).toBe(4);

      expect(parseInt(el3.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(6); // ??? keep same row, but might more intuitive higher
      expect(parseInt(el3.attr('data-gs-width'))).toBe(1); // ??? could take entire width if it did above
      expect(parseInt(el3.attr('data-gs-height'))).toBe(1);

      // back to 1 column, move item2 to beginning to [3][1][2] vertically
      grid.column(1);
      expect(grid.getColumn()).toBe(1);
      grid.move(el3.get(0), 0, 0);
      expect(parseInt(el3.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el3.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el3.attr('data-gs-height'))).toBe(1);

      expect(parseInt(el1.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-y'))).toBe(1);
      expect(parseInt(el1.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el1.attr('data-gs-height'))).toBe(2);

      expect(parseInt(el2.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el2.attr('data-gs-y'))).toBe(3);
      expect(parseInt(el2.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el2.attr('data-gs-height'))).toBe(4);

      // back to 12 column, el3 to be beginning still, but [1][2] to be in 1 columns still but wide 4x2 and 4x still
      grid.column(12);
      expect(grid.getColumn()).toBe(12);
      expect(parseInt(el3.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el3.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el3.attr('data-gs-height'))).toBe(1);

      expect(parseInt(el1.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-y'))).toBe(1);
      expect(parseInt(el1.attr('data-gs-width'))).toBe(4);
      expect(parseInt(el1.attr('data-gs-height'))).toBe(2);

      expect(parseInt(el2.attr('data-gs-x'))).toBe(4);
      expect(parseInt(el2.attr('data-gs-y'))).toBe(1);
      expect(parseInt(el2.attr('data-gs-width'))).toBe(4);
      expect(parseInt(el2.attr('data-gs-height'))).toBe(4);

      // 2 column will have item1, item2, item3 in 1 column still but half the width
      grid.column(1); // test convert from small, should use 12 layout still
      grid.column(2);
      expect(grid.getColumn()).toBe(2);

      expect(parseInt(el3.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el3.attr('data-gs-width'))).toBe(1); // 1 as we scaled from 12 columns
      expect(parseInt(el3.attr('data-gs-height'))).toBe(1);

      expect(parseInt(el1.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-y'))).toBe(1);
      expect(parseInt(el1.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el1.attr('data-gs-height'))).toBe(2);

      expect(parseInt(el2.attr('data-gs-x'))).toBe(1);
      expect(parseInt(el2.attr('data-gs-y'))).toBe(1);
      expect(parseInt(el2.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el2.attr('data-gs-height'))).toBe(4);
    });
  });

  describe('oneColumnModeDomSort', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should support default going to 1 column', function() {
      let options = {
        column: 12,
        float: true
      };
      let grid = GridStack.init(options);
      grid.batchUpdate();
      grid.batchUpdate();
      let el1 = $(grid.addWidget(widgetHTML, {width:1, height:1}));
      let el2 = $(grid.addWidget(widgetHTML, {x:2, y:0, width:2, height:1}));
      let el3 = $(grid.addWidget(widgetHTML, {x:1, y:0, width:1, height:2}));
      grid.commit();
      grid.commit();
      
      // items are item1[1x1], item3[1x1], item2[2x1]
      expect(parseInt(el1.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el1.attr('data-gs-height'))).toBe(1);

      expect(parseInt(el3.attr('data-gs-x'))).toBe(1);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el3.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el3.attr('data-gs-height'))).toBe(2);

      expect(parseInt(el2.attr('data-gs-x'))).toBe(2);
      expect(parseInt(el2.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el2.attr('data-gs-width'))).toBe(2);
      expect(parseInt(el2.attr('data-gs-height'))).toBe(1);

      // items are item1[1x1], item3[1x2], item2[1x1] in 1 column
      grid.column(1);
      expect(parseInt(el1.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el1.attr('data-gs-height'))).toBe(1);

      expect(parseInt(el3.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(1);
      expect(parseInt(el3.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el3.attr('data-gs-height'))).toBe(2);

      expect(parseInt(el2.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el2.attr('data-gs-y'))).toBe(3);
      expect(parseInt(el2.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el2.attr('data-gs-height'))).toBe(1);
    });
    it('should support oneColumnModeDomSort ON going to 1 column', function() {
      let options = {
        column: 12,
        oneColumnModeDomSort: true,
        float: true
      };
      let grid = GridStack.init(options);
      let el1 = $(grid.addWidget(widgetHTML, {width:1, height:1}));
      let el2 = $(grid.addWidget(widgetHTML, {x:2, y:0, width:2, height:1}));
      let el3 = $(grid.addWidget(widgetHTML, {x:1, y:0, width:1, height:2}));

      // items are item1[1x1], item3[1x1], item2[2x1]
      expect(parseInt(el1.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el1.attr('data-gs-height'))).toBe(1);

      expect(parseInt(el3.attr('data-gs-x'))).toBe(1);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el3.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el3.attr('data-gs-height'))).toBe(2);

      expect(parseInt(el2.attr('data-gs-x'))).toBe(2);
      expect(parseInt(el2.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el2.attr('data-gs-width'))).toBe(2);
      expect(parseInt(el2.attr('data-gs-height'))).toBe(1);

      // items are item1[1x1], item2[1x1], item3[1x2] in 1 column dom ordered
      grid.column(1);
      expect(parseInt(el1.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el1.attr('data-gs-height'))).toBe(1);

      expect(parseInt(el2.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el2.attr('data-gs-y'))).toBe(1);
      expect(parseInt(el2.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el2.attr('data-gs-height'))).toBe(1);

      expect(parseInt(el3.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(2);
      expect(parseInt(el3.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el3.attr('data-gs-height'))).toBe(2);
    });
  });

  describe('disableOneColumnMode', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackSmallHTML); // smaller default to 1 column
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should go to 1 column', function() {
      let grid = GridStack.init();
      expect(grid.getColumn()).toBe(1);
    });
    it('should go to 1 column with large minWidth', function() {
      let grid = GridStack.init({minWidth: 1000});
      expect(grid.getColumn()).toBe(1);
    });
    it('should stay at 12 with minWidth', function() {
      let grid = GridStack.init({minWidth: 300});
      expect(grid.getColumn()).toBe(12);
    });
    it('should stay at 12 column', function() {
      let grid = GridStack.init({disableOneColumnMode: true});
      expect(grid.getColumn()).toBe(12);
    });
  });

  describe('grid.minRow', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should default to row 0 when empty', function() {
      let options = {};
      let grid = GridStack.init(options);
      expect(grid.getRow()).toBe(4);
      expect(grid.opts.minRow).toBe(0);
      expect(grid.opts.maxRow).toBe(0);
      grid.removeAll();
      expect(grid.getRow()).toBe(0);
    });
    it('should default to row 2 when empty', function() {
      let options = {minRow: 2};
      let grid = GridStack.init(options);
      expect(grid.getRow()).toBe(4);
      expect(grid.opts.minRow).toBe(2);
      expect(grid.opts.maxRow).toBe(0);
      grid.removeAll();
      expect(grid.engine.getRow()).toBe(0);
      expect(grid.getRow()).toBe(2);
    });
    it('should set min = max = 3 rows', function() {
      let options = {row: 3};
      let grid = GridStack.init(options);
      expect(grid.getRow()).toBe(3); // shrink elements to fit maxRow!
      expect(grid.opts.minRow).toBe(3);
      expect(grid.opts.maxRow).toBe(3);
      grid.removeAll();
      expect(grid.engine.getRow()).toBe(0);
      expect(grid.getRow()).toBe(3);
    });
    it('willItFit()', function() {
      // default 4x2 and 4x4 so anything pushing more than 1 will fail
      let grid = GridStack.init({maxRow: 5});
      expect(grid.willItFit(0, 0, 1, 1, false)).toBe(true);
      expect(grid.willItFit(0, 0, 1, 3, false)).toBe(true);
      expect(grid.willItFit(0, 0, 1, 4, false)).toBe(false);
      expect(grid.willItFit(0, 0, 12, 1, false)).toBe(true);
      expect(grid.willItFit(0, 0, 12, 2, false)).toBe(false);
    });

  });

  describe('grid attributes', function() {
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should have row attr', function() {
      let HTML = 
        '<div style="width: 800px; height: 600px" id="gs-cont">' +
        '  <div class="grid-stack" data-gs-row="4" data-gs-current-height="1"></div>' + // old attr current-height
        '</div>';
      document.body.insertAdjacentHTML('afterbegin', HTML);
      let grid = GridStack.init();
      expect(grid.getRow()).toBe(4);
      expect(grid.opts.minRow).toBe(4);
      expect(grid.opts.maxRow).toBe(4);
      grid.addWidget(widgetHTML, {height: 6});
      expect(grid.engine.getRow()).toBe(4);
      expect(grid.getRow()).toBe(4);
    });
  });

  describe('grid.min/max width/height', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should set data-gs-min-width to 2.', function() {
      let grid = GridStack.init();
      let items = $('.grid-stack-item');
      for (let i = 0; i < items.length; i++) {
        grid
          .minWidth(items[i], 2)
          .maxWidth(items[i], 3)
          .minHeight(items[i], 4)
          .maxHeight(items[i], 5);
      }
      for (let j = 0; j < items.length; j++) {
        expect(parseInt($(items[j]).attr('data-gs-min-width'), 10)).toBe(2);
        expect(parseInt($(items[j]).attr('data-gs-max-width'), 10)).toBe(3);
        expect(parseInt($(items[j]).attr('data-gs-min-height'), 10)).toBe(4);
        expect(parseInt($(items[j]).attr('data-gs-max-height'), 10)).toBe(5);
      }
      // remove all constrain
      grid
        .minWidth('grid-stack-item', 0)
        .maxWidth('.grid-stack-item', null)
        .minHeight('grid-stack-item', undefined)
        .maxHeight(undefined, 0);
      for (let j = 0; j < items.length; j++) {
        expect(items[j].getAttribute('data-gs-min-width')).toBe(null);
        expect(items[j].getAttribute('data-gs-max-width')).toBe(null);
        expect(items[j].getAttribute('data-gs-min-height')).toBe(null);
        expect(items[j].getAttribute('data-gs-max-height')).toBe(null);
      }
    });
  });


  describe('grid.isAreaEmpty', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should set return false.', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid = GridStack.init(options);
      let shouldBeFalse = grid.isAreaEmpty(1, 1, 1, 1);
      expect(shouldBeFalse).toBe(false);
    });
    it('should set return true.', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid = GridStack.init(options);
      let shouldBeTrue = grid.isAreaEmpty(5, 5, 1, 1);
      expect(shouldBeTrue).toBe(true);
    });
  });

  describe('grid.removeAll', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should remove all children by default', function() {
      let grid = GridStack.init();
      grid.removeAll();
      expect(grid.engine.nodes).toEqual([]);
      expect(document.getElementById('item1')).toBe(null);
    });
    it('should remove all children', function() {
      let grid = GridStack.init();
      grid.removeAll(true);
      expect(grid.engine.nodes).toEqual([]);
      expect(document.getElementById('item1')).toBe(null);
    });
    it('should remove gridstack part, leave DOM behind', function() {
      let grid = GridStack.init();
      grid.removeAll(false);
      expect(grid.engine.nodes).toEqual([]);
      expect(document.getElementById('item1')).not.toBe(null);
    });
  });

  describe('grid.removeWidget', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should remove first item (default), then second (true), then third (false)', function() {
      let grid = GridStack.init();
      expect(grid.engine.nodes.length).toEqual(2);

      let el1 = document.getElementById('item1');
      expect(el1).not.toBe(null);
      grid.removeWidget(el1);
      expect(grid.engine.nodes.length).toEqual(1);
      expect(document.getElementById('item1')).toBe(null);
      expect(document.getElementById('item2')).not.toBe(null);

      let el2 = document.getElementById('item2');
      grid.removeWidget(el2, true);
      expect(grid.engine.nodes.length).toEqual(0);
      expect(document.getElementById('item2')).toBe(null);

      let el3 = grid.addWidget(widgetHTML);
      expect(el3).not.toBe(null);
      grid.removeWidget(el3, false);
      expect(grid.engine.nodes.length).toEqual(0);
      expect(document.getElementById('item3')).not.toBe(null);
    });
  });

  describe('grid method _packNodes with float', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should allow same x, y coordinates for widgets.', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10,
        float: true
      };
      let grid = GridStack.init(options);
      let items = $('.grid-stack-item');
      let $el;
      let $oldEl;
      for (let i = 0; i < items.length; i++) {
        $el = $(grid.addWidget(items[i]));
        $oldEl = $(items[i]);
        expect(parseInt($oldEl.attr('data-gs-x'), 10)).toBe(parseInt($el.attr('data-gs-x'), 10));
        expect(parseInt($oldEl.attr('data-gs-y'), 10)).toBe(parseInt($el.attr('data-gs-y'), 10));
      }
    });
    it('should not allow same x, y coordinates for widgets.', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid = GridStack.init(options);
      let items = $('.grid-stack-item');
      let $el;
      let $oldEl;
      let newY;
      let oldY;
      for (let i = 0; i < items.length; i++) {
        $oldEl = $.extend(true, {}, $(items[i]));
        newY = parseInt($oldEl.attr('data-gs-y'), 10) + 5;
        $oldEl.attr('data-gs-y', newY);
        $el = $(grid.addWidget($oldEl.get(0)));
        expect(parseInt($el.attr('data-gs-y'), 10)).not.toBe(newY);
      }
    });
  });

  describe('grid method addWidget with all parameters', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should keep all widget options the same (autoPosition off', function() {
      let grid = GridStack.init({float: true});;
      let widget = grid.addWidget(widgetHTML, {x: 6, y:7, width:2, height:3, autoPosition:false,
        minWidth:1, maxWidth:4, minHeight:2, maxHeight:5, id:'coolWidget'});
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(6);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(7);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(2);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(3);
      expect(widget.getAttribute('data-gs-auto-position')).toBe(null);
      expect(parseInt(widget.getAttribute('data-gs-min-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-max-width'), 10)).toBe(4);
      expect(parseInt(widget.getAttribute('data-gs-min-height'), 10)).toBe(2);
      expect(parseInt(widget.getAttribute('data-gs-max-height'), 10)).toBe(5);
      expect(widget.getAttribute('data-gs-id')).toBe('coolWidget');

      // should move widget to top with float=false
      expect(grid.getFloat()).toBe(true);
      grid.float(false);
      expect(grid.getFloat()).toBe(false);
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(6);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(4); // <--- from 7 to 4 below second original widget
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(2);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(3);
      expect(widget.getAttribute('data-gs-auto-position')).toBe(null);
      expect(parseInt(widget.getAttribute('data-gs-min-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-max-width'), 10)).toBe(4);
      expect(parseInt(widget.getAttribute('data-gs-min-height'), 10)).toBe(2);
      expect(parseInt(widget.getAttribute('data-gs-max-height'), 10)).toBe(5);
      expect(widget.getAttribute('data-gs-id')).toBe('coolWidget');

      // should not move again (no-op)
      grid.float(true);
      expect(grid.getFloat()).toBe(true);
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(6);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(4);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(2);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(3);
      expect(widget.getAttribute('data-gs-auto-position')).toBe(null);
      expect(parseInt(widget.getAttribute('data-gs-min-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-max-width'), 10)).toBe(4);
      expect(parseInt(widget.getAttribute('data-gs-min-height'), 10)).toBe(2);
      expect(parseInt(widget.getAttribute('data-gs-max-height'), 10)).toBe(5);
      expect(widget.getAttribute('data-gs-id')).toBe('coolWidget');
    });
  });

  describe('grid method addWidget with autoPosition true', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should change x, y coordinates for widgets.', function() {
      let grid = GridStack.init({float: true});
      let widget = grid.addWidget(widgetHTML, {x:9, y:7, width:2, height:3, autoPosition:true});
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).not.toBe(9);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).not.toBe(7);
    });
  });

  describe('grid method addWidget with widget options', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should autoPosition (missing X,Y)', function() {
      let grid = GridStack.init();
      let widget = grid.addWidget(widgetHTML, {height: 2, id: 'optionWidget'});
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(8);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(2);
      // expect(widget.getAttribute('data-gs-auto-position')).toBe('true');
      expect(widget.getAttribute('data-gs-min-width')).toBe(null);
      expect(widget.getAttribute('data-gs-max-width')).toBe(null);
      expect(widget.getAttribute('data-gs-min-height')).toBe(null);
      expect(widget.getAttribute('data-gs-max-height')).toBe(null);
      expect(widget.getAttribute('data-gs-id')).toBe('optionWidget');
    });
    it('should autoPosition (missing X)', function() {
      let grid = GridStack.init();
      let widget = grid.addWidget(widgetHTML, {y: 9, height: 2, id: 'optionWidget'});
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(8);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(2);
      // expect(widget.getAttribute('data-gs-auto-position')).toBe('true');
      expect(widget.getAttribute('data-gs-min-width')).toBe(null);
      expect(widget.getAttribute('data-gs-max-width')).toBe(null);
      expect(widget.getAttribute('data-gs-min-height')).toBe(null);
      expect(widget.getAttribute('data-gs-max-height')).toBe(null);
      expect(widget.getAttribute('data-gs-id')).toBe('optionWidget');
    });
    it('should autoPosition (missing Y)', function() {
      let grid = GridStack.init();
      let widget = grid.addWidget(widgetHTML, {x: 9, height: 2, id: 'optionWidget'});
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(8);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(2);
      // expect(widget.getAttribute('data-gs-auto-position')).toBe('true');
      expect(widget.getAttribute('data-gs-min-width')).toBe(null);
      expect(widget.getAttribute('data-gs-max-width')).toBe(null);
      expect(widget.getAttribute('data-gs-min-height')).toBe(null);
      expect(widget.getAttribute('data-gs-max-height')).toBe(null);
      expect(widget.getAttribute('data-gs-id')).toBe('optionWidget');
    });
    it('should autoPosition (correct X, missing Y)', function() {
      let grid = GridStack.init();
      let widget = grid.addWidget(widgetHTML, {x: 8, height: 2, id: 'optionWidget'});
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(8);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(2);
      // expect(widget.getAttribute('data-gs-auto-position')).toBe('true');
      expect(widget.getAttribute('data-gs-min-width')).toBe(null);
      expect(widget.getAttribute('data-gs-max-width')).toBe(null);
      expect(widget.getAttribute('data-gs-min-height')).toBe(null);
      expect(widget.getAttribute('data-gs-max-height')).toBe(null);
      expect(widget.getAttribute('data-gs-id')).toBe('optionWidget');
    });
    it('should autoPosition (empty options)', function() {
      let grid = GridStack.init();
      let widget = grid.addWidget(widgetHTML, {});
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(8);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(1);
      // expect(widget.getAttribute('data-gs-auto-position')).toBe('true');
      expect(widget.getAttribute('data-gs-min-width')).toBe(null);
      expect(widget.getAttribute('data-gs-max-width')).toBe(null);
      expect(widget.getAttribute('data-gs-min-height')).toBe(null);
      expect(widget.getAttribute('data-gs-max-height')).toBe(null);
    });

  });

  describe('addWidget() with bad string value widget options', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should use default', function() {
      let grid = GridStack.init();
      let widget = grid.addWidget(widgetHTML, {x: 'foo', y: null, width: 'bar', height: ''} as any);
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(8);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(1);
    });
  });

  describe('addWidget with null options, ', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should clear x position', function() {
      let grid = GridStack.init({float: true});
      let widgetHTML = '<div class="grid-stack-item" data-gs-x="9"><div class="grid-stack-item-content"></div></div>';
      let widget = grid.addWidget(widgetHTML, {x:null, y:null, width:undefined});
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(8);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(0);
    });
  });

  describe('method getFloat()', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should match true/false only', function() {
      let grid = GridStack.init({float: true});
      expect(grid.getFloat()).toBe(true);
      (grid as any).float(0);
      expect(grid.getFloat()).toBe(false);
      grid.float(null);
      expect(grid.getFloat()).toBe(false);
      grid.float(undefined);
      expect(grid.getFloat()).toBe(false);
      grid.float(false);
      expect(grid.getFloat()).toBe(false);
    });
  });

  describe('grid.destroy', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      //document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
    });
    it('should cleanup gridstack', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid = GridStack.init(options);
      grid.destroy();
      expect($('.grid-stack').length).toBe(0);
      expect(grid.engine).toBe(undefined);
    });
    it('should cleanup gridstack but leave elements', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid = GridStack.init(options);
      grid.destroy(false);
      expect($('.grid-stack').length).toBe(1);
      expect($('.grid-stack-item').length).toBe(2);
      expect(grid.engine).toBe(undefined);
      grid.destroy();
    });
  });

  describe('grid.resize', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should resize widget', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid = GridStack.init(options);
      let items = $('.grid-stack-item');
      grid.resize(items[0], 5, 5);
      expect(parseInt($(items[0]).attr('data-gs-width'), 10)).toBe(5);
      expect(parseInt($(items[0]).attr('data-gs-height'), 10)).toBe(5);
    });
  });

  describe('grid.move', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should move widget', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10,
        float: true
      };
      let grid = GridStack.init(options);
      let items = $('.grid-stack-item');
      grid.move(items[0], 5, 5);
      expect(parseInt($(items[0]).attr('data-gs-x'), 10)).toBe(5);
      expect(parseInt($(items[0]).attr('data-gs-y'), 10)).toBe(5);
    });
  });

  describe('grid.moveNode', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should do nothing and return NULL to mean nothing happened', function() {
      let grid:any = GridStack.init();
      let items = $('.grid-stack-item');
      grid._updateElement(items[0], function(el, node) {
        let hasMoved = grid.engine.moveNode(node);
        expect(hasMoved).toBe(null);
      });
    });
    it('should do nothing and return node', function() {
      let grid: any = GridStack.init();
      let items = $('.grid-stack-item');
      grid.minWidth(items[0], 1);
      grid.maxWidth(items[0], 2);
      grid.minHeight(items[0], 1);
      grid.maxHeight(items[0], 2);
      grid._updateElement(items[0], function(el, node) {
        let newNode = grid.engine.moveNode(node);
        expect(newNode).toBe(node);
      });
    });
  });

  describe('grid.update', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should move and resize widget', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10,
        float: true
      };
      let grid = GridStack.init(options);
      let items = $('.grid-stack-item');
      grid.update(items[0], 5, 5, 5 ,5);
      expect(parseInt($(items[0]).attr('data-gs-width'), 10)).toBe(5);
      expect(parseInt($(items[0]).attr('data-gs-height'), 10)).toBe(5);
      expect(parseInt($(items[0]).attr('data-gs-x'), 10)).toBe(5);
      expect(parseInt($(items[0]).attr('data-gs-y'), 10)).toBe(5);
    });
  });

  describe('grid.verticalMargin', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should return verticalMargin', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid = GridStack.init(options);
      let vm = grid.getVerticalMargin();
      expect(vm).toBe(10);
    });
    it('should return update verticalMargin', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid = GridStack.init(options);
      grid.verticalMargin(11);
      expect(grid.getVerticalMargin()).toBe(11);
    });
    it('should do nothing', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10,
      };
      let grid = GridStack.init(options);
      expect(grid.getVerticalMargin()).toBe(10);
      grid.verticalMargin(10);
      expect(grid.getVerticalMargin()).toBe(10);
    });
    it('should not update styles', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid: any = GridStack.init(options);
      spyOn(grid, '_updateStyles');
      grid.verticalMargin(11, true);
      expect(grid._updateStyles).not.toHaveBeenCalled();
    });
  });

  describe('grid.opts.rtl', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should add grid-stack-rtl class', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10,
        rtl: true
      };
      let grid = GridStack.init(options);
      expect($('.grid-stack').hasClass('grid-stack-rtl')).toBe(true);
    });
    it('should not add grid-stack-rtl class', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid = GridStack.init(options);
      expect($('.grid-stack').hasClass('grid-stack-rtl')).toBe(false);
    });
  });

  describe('grid.enableMove', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should enable move for future also', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10,
        disableDrag: true
      };
      let grid = GridStack.init(options);
      let items = $('.grid-stack-item');
      for (let i = 0; i < items.length; i++) {
        expect($(items[i]).hasClass('ui-draggable-disabled')).toBe(true);
      }
      expect(grid.opts.disableDrag).toBe(true);

      grid.enableMove(true, true);
      for (let i = 0; i < items.length; i++) {
        expect($(items[i]).hasClass('ui-draggable-disabled')).toBe(false);
      }
      expect(grid.opts.disableDrag).toBe(false);
    });
    it('should disable move for existing only', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid = GridStack.init(options);
      let items = $('.grid-stack-item');
      for (let i = 0; i < items.length; i++) {
        expect($(items[i]).hasClass('ui-draggable-disabled')).toBe(false);
      }
      expect(grid.opts.disableDrag).toBe(false);

      grid.enableMove(false, false);
      for (let i = 0; i < items.length; i++) {
        expect($(items[i]).hasClass('ui-draggable-disabled')).toBe(true);
      }
      expect(grid.opts.disableDrag).toBe(false);
    });
  });

  describe('grid.enableResize', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should enable resize', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10,
        disableResize: true
      };
      let grid = GridStack.init(options);
      let items = $('.grid-stack-item');
      expect(grid.opts.disableResize).toBe(true);
      grid.enableResize(true, true);
      for (let i = 0; i < items.length; i++) {
        expect(($(items[i]).resizable('option','disabled'))).toBe(false);
      }
      expect(grid.opts.disableResize).toBe(false);
    });
    it('should disable resize', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid = GridStack.init(options);
      let items = $('.grid-stack-item');
      grid.enableResize(false, false);
      for (let i = 0; i < items.length; i++) {
        expect(($(items[i]).resizable('option','disabled'))).toBe(true);
      }
      expect(grid.opts.disableResize).toBe(false);
    });
  });

  describe('grid.enable', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should enable movable and resizable', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid = GridStack.init(options);
      let items = $('.grid-stack-item');
      grid.enableResize(false);
      grid.enableMove(false);
      for (let i = 0; i < items.length; i++) {
        expect($(items[i]).hasClass('ui-draggable-disabled')).toBe(true);
        expect(($(items[i]).resizable('option','disabled'))).toBe(true);
      }
      grid.enable();
      for (let j = 0; j < items.length; j++) {
        expect($(items[j]).hasClass('ui-draggable-disabled')).toBe(false);
        expect(($(items[j]).resizable('option','disabled'))).toBe(false);
      }
    });
  });

  describe('grid.enable', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should lock widgets', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid = GridStack.init(options);
      grid.locked('.grid-stack-item', true);
      $('.grid-stack-item').each(function (i,item) {
        expect($(item).attr('data-gs-locked')).toBe('yes');
      })
    });
    it('should unlock widgets', function() {
      let options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      let grid = GridStack.init(options);
      grid.locked('.grid-stack-item', false);
      $('.grid-stack-item').each(function (i,item) {
        expect($(item).attr('data-gs-locked')).toBe(undefined);
      })
    });
  });

  describe('custom grid placement #1054', function() {
    let HTML = 
    '<div style="width: 800px; height: 600px" id="gs-cont">' +
    '  <div class="grid-stack">' +
    '    <div class="grid-stack-item" data-gs-x="0" data-gs-y="0" data-gs-width="12" data-gs-height="9">' +
    '      <div class="grid-stack-item-content"></div>' +
    '    </div>' +
    '    <div class="grid-stack-item" data-gs-x="0" data-gs-y="9" data-gs-width="12" data-gs-height="5">' +
    '      <div class="grid-stack-item-content"></div>' +
    '    </div>' +
    '    <div class="grid-stack-item" data-gs-x="0" data-gs-y="14" data-gs-width="7" data-gs-height="6">' +
    '      <div class="grid-stack-item-content"></div>' +
    '    </div>' +
    '    <div class="grid-stack-item" data-gs-x="7" data-gs-y="14" data-gs-width="5" data-gs-height="6">' +
    '      <div class="grid-stack-item-content"></div>' +
    '    </div>' +
    '  </div>' +
    '</div>';
    let pos = [{x:0, y:0, w:12, h:9}, {x:0, y:9, w:12, h:5}, {x:0, y:14, w:7, h:6}, {x:7, y:14, w:5, h:6}];
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', HTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should have correct position', function() {
      let items = $('.grid-stack-item');
      for (let i = 0; i < items.length; i++) {
        let item = $(items[i]);
        expect(parseInt(item.attr('data-gs-x'))).toBe(pos[i].x);
        expect(parseInt(item.attr('data-gs-y'))).toBe(pos[i].y);
        expect(parseInt(item.attr('data-gs-width'))).toBe(pos[i].w);
        expect(parseInt(item.attr('data-gs-height'))).toBe(pos[i].h);
      }
    });
  });

  describe('grid.compact', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should move all 3 items to top-left with no space', function() {
      let grid = GridStack.init({float: true});

      let el3 = $(grid.addWidget(widgetHTML, {x: 3, y: 5}));
      expect(parseInt(el3.attr('data-gs-x'))).toBe(3);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(5);

      grid.compact();
      expect(parseInt(el3.attr('data-gs-x'))).toBe(8);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(0);
    });
    it('not move locked item', function() {
      let grid = GridStack.init({float: true});

      let el3 = $(grid.addWidget(widgetHTML, {x: 3, y: 5, locked: true, noMove: true}));
      expect(parseInt(el3.attr('data-gs-x'))).toBe(3);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(5);

      grid.compact();
      expect(parseInt(el3.attr('data-gs-x'))).toBe(3);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(5);
    });
  });

  describe('gridOption locked #1181', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('not move locked item, size down added one', function() {
      let grid = GridStack.init();
      let el1 = $(grid.addWidget(widgetHTML, {x: 0, y: 1, width: 12, height: 1, locked: true}));
      expect(parseInt(el1.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-y'))).toBe(1);

      let el2 = $(grid.addWidget(widgetHTML, {x: 2, y: 0, height: 3}));
      expect(parseInt(el1.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-y'))).toBe(1);
      expect(parseInt(el2.attr('data-gs-x'))).toBe(2);
      expect(parseInt(el2.attr('data-gs-y'))).toBe(2);
      expect(parseInt(el2.attr('data-gs-height'))).toBe(3);
    });

  });

  describe('nested grids', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackNestedHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should both init, second with nested class', function() {
      let grids = GridStack.initAll();
      expect(grids.length).toBe(2);
      expect($(grids[0].el).hasClass('grid-stack-nested')).toBe(false);
      expect($(grids[1].el).hasClass('grid-stack-nested')).toBe(true);
    });
  });

  describe('two grids', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridHTML);
      document.body.insertAdjacentHTML('afterbegin', gridHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should not remove incorrect child', function() {
      let grids = GridStack.initAll();
      expect(grids.length).toBe(2);
      expect(grids[0].engine.nodes.length).toBe(2);
      expect(grids[1].engine.nodes.length).toBe(2);
      // should do nothing
      grids[0].removeWidget( grids[1].engine.nodes[0].el );
      expect(grids[0].engine.nodes.length).toBe(2);
      expect(grids[0].el.children.length).toBe(2);
      expect(grids[1].engine.nodes.length).toBe(2);
      expect(grids[1].el.children.length).toBe(2);
      // should empty with no errors
      grids[1].removeAll();
      expect(grids[0].engine.nodes.length).toBe(2);
      expect(grids[0].el.children.length).toBe(2);
      expect(grids[1].engine.nodes.length).toBe(0);
      expect(grids[1].el.children.length).toBe(0);
    });
    it('should remove 1 child', function() {
      let grids = GridStack.initAll();
      grids[1].removeWidget( grids[1].engine.nodes[0].el );
      expect(grids[0].engine.nodes.length).toBe(2);
      expect(grids[0].el.children.length).toBe(2);
      expect(grids[1].engine.nodes.length).toBe(1);
      expect(grids[1].el.children.length).toBe(1);
    });
  });

  describe('ddPlugin option', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should not have drag&drop', function() {
      let grid: any = GridStack.init({ddPlugin : false});
      expect(grid.dd.isDroppable()).toBe(false);
      grid.dd.droppable();
      grid.dd.on();
    });
    it('should use class name', function() {
      let grid: any = GridStack.init({ddPlugin : GridStackDragDropPlugin});
      expect(grid.dd.isDroppable()).toBe(false);
    });
  });

  describe('grid.on events', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('add 3 single events', function() {
      let grid = GridStack.init();
      let fcn = (event: Event) => {};
      grid.on('added', fcn).on('enable', fcn).on('dragstart', fcn);
      expect((grid as any)._gsEventHandler.enable).not.toBe(undefined);
      grid.off('added').off('enable').off('dragstart');
      expect((grid as any)._gsEventHandler.enable).toBe(undefined);
    });
    it('add 3 events', function() {
      let grid: any = GridStack.init(); // prevent TS check for string combine...
      let fcn = (event: CustomEvent) => {};
      grid.on('added enable dragstart', fcn);
      expect((grid as any)._gsEventHandler.enable).not.toBe(undefined);
      grid.off('added enable dragstart');
      expect((grid as any)._gsEventHandler.enable).toBe(undefined);
    });

  });

 // ..and finally track log warnings at the end, instead of displaying them....
  describe('obsolete warnings', function() {
    console.warn = jasmine.createSpy('log'); // track warnings instead of displaying them
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('warning if OLD setGridWidth is called', function() {
      let grid: any = GridStack.init();
      grid.setGridWidth(11); // old 0.5.2 API
      expect(grid.getColumn()).toBe(11);
      expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `setGridWidth` is deprecated in v0.5.3 and has been replaced with `column`. It will be **completely** removed in v1.0');
    });
    it('warning if OLD setColumn is called', function() {
      let grid: any = GridStack.init();
      grid.setColumn(10); // old 0.6.4 API
      expect(grid.getColumn()).toBe(10);
      expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `setColumn` is deprecated in v0.6.4 and has been replaced with `column`. It will be **completely** removed in v1.0');
    });
    it('warning if OLD grid height is set', function() {
      let grid = (GridStack as any).init({height: 10}); // old 0.5.2 Opt now maxRow
      expect(grid.opts.maxRow).toBe(10);
      expect(grid.engine.maxRow).toBe(10);
      expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `height` is deprecated in v0.5.3 and has been replaced with `maxRow`. It will be **completely** removed in v1.0');
    });
    it('warning if OLD oneColumnModeClass is set (no changes)', function() {
      (GridStack as any).init({oneColumnModeClass: 'foo'}); // deleted 0.6.3 Opt
      expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `oneColumnModeClass` is deprecated in v0.6.3. Use class `.grid-stack-1` instead');
    });
  });
});
