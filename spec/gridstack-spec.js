describe('gridstack', function() {
  'use strict';

  var e;
  var w;
  // grid has 4x2 and 4x4 top-left aligned - used on most test cases
  var gridstackHTML =
    '<div style="width: 992px; height: 800px" id="gs-cont">' +
    '  <div class="grid-stack">' +
    '    <div class="grid-stack-item" data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="2" id="item1">' +
    '      <div class="grid-stack-item-content"></div>' +
    '    </div>' +
    '    <div class="grid-stack-item" data-gs-x="4" data-gs-y="0" data-gs-width="4" data-gs-height="4" id="item2">' +
    '      <div class="grid-stack-item-content"></div>' +
    '    </div>' +
    '  </div>' +
    '</div>';
  // empty grid
  var gridstackEmptyHTML =
    '<div style="width: 992px; height: 800px" id="gs-cont">' +
    '  <div class="grid-stack">' +
    '  </div>' +
    '</div>';
  // generic widget with no param
  var widgetHTML = '<div class="grid-stack-item" id="item3"><div class="grid-stack-item-content"> hello </div></div>';

  beforeEach(function() {
    w = window;
    e = GridStack.Engine;
  });

  describe('setup of gridstack', function() {

    it('should exist setup function.', function() {

      expect(e).not.toBeNull();
      expect(typeof e).toBe('function');
    });

    it('should set default params correctly.', function() {
      e.call(w);
      expect(w.column).toEqual(12);
      expect(w.float).toBe(false);
      expect(w.maxRow).toEqual(0);
      expect(w.nodes).toEqual([]);
      expect(typeof w.onchange).toBe('function');
      expect(w._batchMode).toBeFalse();
    });

    it('should set params correctly.', function() {
      var fkt = function() { };
      var arr = [1,2,3];

      e.call(w, 1, fkt, true, 2, arr);
      expect(w.column).toEqual(1);
      expect(w.float).toBe(true);
      expect(w.maxRow).toEqual(2);
      expect(w.nodes).toEqual(arr);
      expect(w.onchange).toEqual(fkt);
      expect(w._batchMode).toBeFalse();
    });
  });

  describe('batch update', function() {

    it('should set float and batchMode when calling batchUpdate.', function() {
      e.prototype.batchUpdate.call(w);
      expect(w.float).toBe(true);
      expect(w._batchMode).toBeTrue();
    });

    //test commit function
  });

  describe('sorting of nodes', function() {

    it('should sort ascending with columns.', function() {
      w.nodes = [{x: 7, y: 0}, {x: 4, y: 4}, {x: 9, y: 0}, {x: 0, y: 1}];
      e.prototype._sortNodes.call(w, 1);
      expect(w.nodes).toEqual([{x: 0, y: 1}, {x: 7, y: 0}, {x: 4, y: 4}, {x: 9, y: 0}]);
    });

    it('should sort descending with columns.', function() {
      w.nodes = [{x: 7, y: 0}, {x: 4, y: 4}, {x: 9, y: 0}, {x: 0, y: 1}];
      e.prototype._sortNodes.call(w, -1);
      expect(w.nodes).toEqual([{x: 9, y: 0}, {x: 4, y: 4}, {x: 7, y: 0}, {x: 0, y: 1}]);
    });

    it('should sort ascending without columns.', function() {
      w.column = undefined;
      w.nodes = [{x: 7, y: 0, width: 1}, {x: 4, y: 4, width: 1}, {x: 9, y: 0, width: 1}, {x: 0, y: 1, width: 1}];
      e.prototype._sortNodes.call(w, 1);
      expect(w.nodes).toEqual([{x: 7, y: 0, width: 1}, {x: 9, y: 0, width: 1}, {x: 0, y: 1, width: 1}, {x: 4, y: 4, width: 1}]);
    });

    it('should sort descending without columns.', function() {
      w.column = undefined;
      w.nodes = [{x: 7, y: 0, width: 1}, {x: 4, y: 4, width: 1}, {x: 9, y: 0, width: 1}, {x: 0, y: 1, width: 1}];
      e.prototype._sortNodes.call(w, -1);
      expect(w.nodes).toEqual([{x: 4, y: 4, width: 1}, {x: 0, y: 1, width: 1}, {x: 9, y: 0, width: 1}, {x: 7, y: 0, width: 1}]);
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
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      $('.grid-stack').removeClass('grid-stack-animate');
      grid.setAnimation(true);
      expect($('.grid-stack').hasClass('grid-stack-animate')).toBe(true);
    });
    it('should remove class grid-stack-animate from the container.', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
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
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
        staticGrid: true
      };
      var grid = GridStack.init(options);
      expect($('.grid-stack').hasClass('grid-stack-static')).toBe(true);
      $('.grid-stack').removeClass('grid-stack-static');
      grid._setStaticClass();
      expect($('.grid-stack').hasClass('grid-stack-static')).toBe(true);
    });
    it('should remove class grid-stack-static from the container.', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
        staticGrid: false
      };
      var grid = GridStack.init(options);
      expect($('.grid-stack').hasClass('grid-stack-static')).toBe(false);
      $('.grid-stack').addClass('grid-stack-static');
      grid._setStaticClass();
      expect($('.grid-stack').hasClass('grid-stack-static')).toBe(false);
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
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      var container = $('.grid-stack');
      var pixel = {top: 500, left: 200};
      var cell = grid.getCellFromPixel(pixel);
      expect(cell.x).toBe(2);
      expect(cell.y).toBe(5);
    });
    it('should return {x: 2, y: 5}.', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      var pixel = {top: 500, left: 200};
      var cell = grid.getCellFromPixel(pixel, false);
      expect(cell.x).toBe(2);
      expect(cell.y).toBe(5);
    });
    it('should return {x: 2, y: 5}.', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      var pixel = {top: 500, left: 200};
      var cell = grid.getCellFromPixel(pixel, true);
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
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
        column: 12
      };
      var grid = GridStack.init(options);
      var res = Math.round($('.grid-stack').outerWidth() / 12);
      expect(grid.cellWidth()).toBe(res);
    });
    it('should return 1/10th of container width.', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
        column: 10
      };
      var grid = GridStack.init(options);
      var res = Math.round($('.grid-stack').outerWidth() / 10);
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
      var cellHeight = 80;
      var verticalMargin = 10;
      var options = {
        cellHeight: cellHeight,
        verticalMargin: verticalMargin,
        column: 12
      };
      var grid = GridStack.init(options);
      var container = $('.grid-stack');
      var rows = parseInt(container.attr('data-gs-current-row'));
      
      expect(grid.getRow()).toBe(rows);

      expect(grid.cellHeight()).toBe(cellHeight);
      expect(parseInt(container.css('height'))).toBe(rows * cellHeight + (rows-1) * verticalMargin);

      grid.cellHeight( grid.cellHeight() ); // should be no-op
      expect(grid.cellHeight()).toBe(cellHeight);
      expect(parseInt(container.css('height'))).toBe(rows * cellHeight + (rows-1) * verticalMargin);

      cellHeight = 120; // should change and CSS actual height
      grid.cellHeight( cellHeight );
      expect(grid.cellHeight()).toBe(cellHeight);
      expect(parseInt(container.css('height'))).toBe(rows * cellHeight + (rows-1) * verticalMargin);

      cellHeight = 20; // should change and CSS actual height
      grid.cellHeight( cellHeight );
      expect(grid.cellHeight()).toBe(cellHeight);
      expect(parseInt(container.css('height'))).toBe(rows * cellHeight + (rows-1) * verticalMargin);
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
      var grid = GridStack.init();
      expect(grid.column()).toBe(12);
      grid.column(12);
      expect(grid.column()).toBe(12);
    });
    it('should SMALL change column number, no relayout', function() {
      var options = {
        column: 12
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
      grid.column(10, false);
      expect(grid.column()).toBe(10);
      for (var j = 0; j < items.length; j++) {
        expect(parseInt($(items[j]).attr('data-gs-y'), 10)).toBe(0);
      }
      grid.column(9, true);
      expect(grid.column()).toBe(9);
      for (var j = 0; j < items.length; j++) {
        expect(parseInt($(items[j]).attr('data-gs-y'), 10)).toBe(0);
      }
      grid.column(12);
      expect(grid.column()).toBe(12);
      for (var j = 0; j < items.length; j++) {
        expect(parseInt($(items[j]).attr('data-gs-y'), 10)).toBe(0);
      }
    });
    it('should change column number and relayout items', function() {
      var options = {
        column: 12,
        float: true
      };
      var grid = GridStack.init(options);
      var el1 = $('#item1')
      var el2 = $('#item2')

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
      expect(grid.column()).toBe(1);
      expect(parseInt(el1.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-y'))).toBe(0);
      expect(parseInt(el1.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el1.attr('data-gs-height'))).toBe(2);

      expect(parseInt(el2.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el2.attr('data-gs-y'))).toBe(2);
      expect(parseInt(el2.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el2.attr('data-gs-height'))).toBe(4);

      // add default 1x1 item to the end (1 column)
      var el3 = $(grid.addWidget(widgetHTML));
      expect(el3).not.toBe(null);
      expect(parseInt(el3.attr('data-gs-x'))).toBe(0);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(6);
      expect(parseInt(el3.attr('data-gs-width'))).toBe(1);
      expect(parseInt(el3.attr('data-gs-height'))).toBe(1);

      // back to 12 column and initial layout (other than new item3)
      grid.column(12);
      expect(grid.column()).toBe(12);
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
      expect(grid.column()).toBe(1);
      grid.move(el3, 0, 0);
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
      expect(grid.column()).toBe(12);
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
      expect(grid.column()).toBe(2);

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
      var options = {
        column: 12,
        float: true
      };
      var grid = GridStack.init(options);
      var el1 = $(grid.addWidget(widgetHTML, {width:1, height:1}));
      var el2 = $(grid.addWidget(widgetHTML, {x:2, y:0, width:2, height:1}));
      var el3 = $(grid.addWidget(widgetHTML, {x:1, y:0, width:1, height:2}));

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
      var options = {
        column: 12,
        oneColumnModeDomSort: true,
        float: true
      };
      var grid = GridStack.init(options);
      var el1 = $(grid.addWidget(widgetHTML, {width:1, height:1}));
      var el2 = $(grid.addWidget(widgetHTML, {x:2, y:0, width:2, height:1}));
      var el3 = $(grid.addWidget(widgetHTML, {x:1, y:0, width:1, height:2}));

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

  describe('grid.minWidth', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should set data-gs-min-width to 2.', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
      for (var i = 0; i < items.length; i++) {
        grid.minWidth(items[i], 2);
      }
      for (var j = 0; j < items.length; j++) {
        expect(parseInt($(items[j]).attr('data-gs-min-width'), 10)).toBe(2);
      }
    });
  });

  describe('grid.maxWidth', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should set data-gs-min-width to 2.', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
      for (var i = 0; i < items.length; i++) {
        grid.maxWidth(items[i], 2);
      }
      for (var j = 0; j < items.length; j++) {
        expect(parseInt($(items[j]).attr('data-gs-max-width'), 10)).toBe(2);
      }
    });
  });

  describe('grid.minHeight', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should set data-gs-min-height to 2.', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
      for (var i = 0; i < items.length; i++) {
        grid.minHeight(items[i], 2);
      }
      for (var j = 0; j < items.length; j++) {
        expect(parseInt($(items[j]).attr('data-gs-min-height'), 10)).toBe(2);
      }
    });
  });

  describe('grid.maxHeight', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should set data-gs-min-height to 2.', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
      for (var i = 0; i < items.length; i++) {
        grid.maxHeight(items[i], 2);
      }
      for (var j = 0; j < items.length; j++) {
        expect(parseInt($(items[j]).attr('data-gs-max-height'), 10)).toBe(2);
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
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      var shouldBeFalse = grid.isAreaEmpty(1, 1, 1, 1);
      expect(shouldBeFalse).toBe(false);
    });
    it('should set return true.', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      var shouldBeTrue = grid.isAreaEmpty(5, 5, 1, 1);
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
      var grid = GridStack.init();
      grid.removeAll();
      expect(grid.engine.nodes).toEqual([]);
      expect(document.getElementById('item1')).toBe(null);
    });
    it('should remove all children', function() {
      var grid = GridStack.init();
      grid.removeAll(true);
      expect(grid.engine.nodes).toEqual([]);
      expect(document.getElementById('item1')).toBe(null);
    });
    it('should remove gridstack part, leave DOM behind', function() {
      var grid = GridStack.init();
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
      var grid = GridStack.init();
      expect(grid.engine.nodes.length).toEqual(2);

      var el1 = document.getElementById('item1');
      expect(el1).not.toBe(null);
      grid.removeWidget(el1);
      expect(grid.engine.nodes.length).toEqual(1);
      expect(document.getElementById('item1')).toBe(null);
      expect(document.getElementById('item2')).not.toBe(null);

      var el2 = document.getElementById('item2');
      grid.removeWidget(el2, true);
      expect(grid.engine.nodes.length).toEqual(0);
      expect(document.getElementById('item2')).toBe(null);

      var el3 = grid.addWidget(widgetHTML);
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
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
        float: true
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
      var $el;
      var $oldEl;
      for (var i = 0; i < items.length; i++) {
        $el = $(grid.addWidget(items[i]));
        $oldEl = $(items[i]);
        expect(parseInt($oldEl.attr('data-gs-x'), 10)).toBe(parseInt($el.attr('data-gs-x'), 10));
        expect(parseInt($oldEl.attr('data-gs-y'), 10)).toBe(parseInt($el.attr('data-gs-y'), 10));
      }
    });
    it('should not allow same x, y coordinates for widgets.', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
      var $el;
      var $oldEl;
      var newY;
      var oldY;
      for (var i = 0; i < items.length; i++) {
        $oldEl = $.extend(true, {}, $(items[i]));
        newY = parseInt($oldEl.attr('data-gs-y'), 10) + 5;
        $oldEl.attr('data-gs-y', newY);
        $el = $(grid.addWidget($oldEl));
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
      var grid = GridStack.init({float: true});;
      var widget = grid.addWidget(widgetHTML, 6, 7, 2, 3, false, 1, 4, 2, 5, 'coolWidget');
      var $widget = $(widget);
      expect(parseInt($widget.attr('data-gs-x'), 10)).toBe(6);
      expect(parseInt($widget.attr('data-gs-y'), 10)).toBe(7);
      expect(parseInt($widget.attr('data-gs-width'), 10)).toBe(2);
      expect(parseInt($widget.attr('data-gs-height'), 10)).toBe(3);
      expect($widget.attr('data-gs-auto-position')).toBe(undefined);
      expect(parseInt($widget.attr('data-gs-min-width'), 10)).toBe(1);
      expect(parseInt($widget.attr('data-gs-max-width'), 10)).toBe(4);
      expect(parseInt($widget.attr('data-gs-min-height'), 10)).toBe(2);
      expect(parseInt($widget.attr('data-gs-max-height'), 10)).toBe(5);
      expect($widget.attr('data-gs-id')).toBe('coolWidget');

      // should move widget to top with float=false
      expect(grid.float()).toBe(true);
      grid.float(false);
      expect(grid.float()).toBe(false);
      expect(parseInt($widget.attr('data-gs-x'), 10)).toBe(6);
      expect(parseInt($widget.attr('data-gs-y'), 10)).toBe(4); // <--- from 7 to 4 below second original widget
      expect(parseInt($widget.attr('data-gs-width'), 10)).toBe(2);
      expect(parseInt($widget.attr('data-gs-height'), 10)).toBe(3);
      expect($widget.attr('data-gs-auto-position')).toBe(undefined);
      expect(parseInt($widget.attr('data-gs-min-width'), 10)).toBe(1);
      expect(parseInt($widget.attr('data-gs-max-width'), 10)).toBe(4);
      expect(parseInt($widget.attr('data-gs-min-height'), 10)).toBe(2);
      expect(parseInt($widget.attr('data-gs-max-height'), 10)).toBe(5);
      expect($widget.attr('data-gs-id')).toBe('coolWidget');

      // should not move again (no-op)
      grid.float(true);
      expect(grid.float()).toBe(true);
      expect(parseInt($widget.attr('data-gs-x'), 10)).toBe(6);
      expect(parseInt($widget.attr('data-gs-y'), 10)).toBe(4);
      expect(parseInt($widget.attr('data-gs-width'), 10)).toBe(2);
      expect(parseInt($widget.attr('data-gs-height'), 10)).toBe(3);
      expect($widget.attr('data-gs-auto-position')).toBe(undefined);
      expect(parseInt($widget.attr('data-gs-min-width'), 10)).toBe(1);
      expect(parseInt($widget.attr('data-gs-max-width'), 10)).toBe(4);
      expect(parseInt($widget.attr('data-gs-min-height'), 10)).toBe(2);
      expect(parseInt($widget.attr('data-gs-max-height'), 10)).toBe(5);
      expect($widget.attr('data-gs-id')).toBe('coolWidget');
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
      var grid = GridStack.init({float: true});
      var widget = grid.addWidget(widgetHTML, 9, 7, 2, 3, true);
      var $widget = $(widget);
      expect(parseInt($widget.attr('data-gs-x'), 10)).not.toBe(9);
      expect(parseInt($widget.attr('data-gs-y'), 10)).not.toBe(7);
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
      var grid = GridStack.init();
      var widget = grid.addWidget(widgetHTML, {height: 2, id: 'optionWidget'});
      var $widget = $(widget);
      expect(parseInt($widget.attr('data-gs-x'), 10)).toBe(8);
      expect(parseInt($widget.attr('data-gs-y'), 10)).toBe(0);
      expect(parseInt($widget.attr('data-gs-width'), 10)).toBe(1);
      expect(parseInt($widget.attr('data-gs-height'), 10)).toBe(2);
      expect($widget.attr('data-gs-auto-position')).toBe('true');
      expect($widget.attr('data-gs-min-width')).toBe(undefined);
      expect($widget.attr('data-gs-max-width')).toBe(undefined);
      expect($widget.attr('data-gs-min-height')).toBe(undefined);
      expect($widget.attr('data-gs-max-height')).toBe(undefined);
      expect($widget.attr('data-gs-id')).toBe('optionWidget');
    });
    it('should autoPosition (missing X)', function() {
      var grid = GridStack.init();
      var widget = grid.addWidget(widgetHTML, {y: 9, height: 2, id: 'optionWidget'});
      var $widget = $(widget);
      expect(parseInt($widget.attr('data-gs-x'), 10)).toBe(8);
      expect(parseInt($widget.attr('data-gs-y'), 10)).toBe(0);
      expect(parseInt($widget.attr('data-gs-width'), 10)).toBe(1);
      expect(parseInt($widget.attr('data-gs-height'), 10)).toBe(2);
      expect($widget.attr('data-gs-auto-position')).toBe('true');
      expect($widget.attr('data-gs-min-width')).toBe(undefined);
      expect($widget.attr('data-gs-max-width')).toBe(undefined);
      expect($widget.attr('data-gs-min-height')).toBe(undefined);
      expect($widget.attr('data-gs-max-height')).toBe(undefined);
      expect($widget.attr('data-gs-id')).toBe('optionWidget');
    });
    it('should autoPosition (missing Y)', function() {
      var grid = GridStack.init();
      var widget = grid.addWidget(widgetHTML, {x: 9, height: 2, id: 'optionWidget'});
      var $widget = $(widget);
      expect(parseInt($widget.attr('data-gs-x'), 10)).toBe(8);
      expect(parseInt($widget.attr('data-gs-y'), 10)).toBe(0);
      expect(parseInt($widget.attr('data-gs-width'), 10)).toBe(1);
      expect(parseInt($widget.attr('data-gs-height'), 10)).toBe(2);
      expect($widget.attr('data-gs-auto-position')).toBe('true');
      expect($widget.attr('data-gs-min-width')).toBe(undefined);
      expect($widget.attr('data-gs-max-width')).toBe(undefined);
      expect($widget.attr('data-gs-min-height')).toBe(undefined);
      expect($widget.attr('data-gs-max-height')).toBe(undefined);
      expect($widget.attr('data-gs-id')).toBe('optionWidget');
    });
    it('should autoPosition (correct X, missing Y)', function() {
      var grid = GridStack.init();
      var widget = grid.addWidget(widgetHTML, {x: 8, height: 2, id: 'optionWidget'});
      var $widget = $(widget);
      expect(parseInt($widget.attr('data-gs-x'), 10)).toBe(8);
      expect(parseInt($widget.attr('data-gs-y'), 10)).toBe(0);
      expect(parseInt($widget.attr('data-gs-width'), 10)).toBe(1);
      expect(parseInt($widget.attr('data-gs-height'), 10)).toBe(2);
      expect($widget.attr('data-gs-auto-position')).toBe('true');
      expect($widget.attr('data-gs-min-width')).toBe(undefined);
      expect($widget.attr('data-gs-max-width')).toBe(undefined);
      expect($widget.attr('data-gs-min-height')).toBe(undefined);
      expect($widget.attr('data-gs-max-height')).toBe(undefined);
      expect($widget.attr('data-gs-id')).toBe('optionWidget');
    });
    it('should autoPosition (empty options)', function() {
      var grid = GridStack.init();
      var widget = grid.addWidget(widgetHTML, {});
      var $widget = $(widget);
      expect(parseInt($widget.attr('data-gs-x'), 10)).toBe(8);
      expect(parseInt($widget.attr('data-gs-y'), 10)).toBe(0);
      expect(parseInt($widget.attr('data-gs-width'), 10)).toBe(1);
      expect(parseInt($widget.attr('data-gs-height'), 10)).toBe(1);
      expect($widget.attr('data-gs-auto-position')).toBe('true');
      expect($widget.attr('data-gs-min-width')).toBe(undefined);
      expect($widget.attr('data-gs-max-width')).toBe(undefined);
      expect($widget.attr('data-gs-min-height')).toBe(undefined);
      expect($widget.attr('data-gs-max-height')).toBe(undefined);
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
      var grid = GridStack.init();
      var widget = grid.addWidget(widgetHTML, {x: 'foo', y: null, width: 'bar', height: ''});
      var $widget = $(widget);
      expect(parseInt($widget.attr('data-gs-x'), 10)).toBe(8);
      expect(parseInt($widget.attr('data-gs-y'), 10)).toBe(0);
      expect(parseInt($widget.attr('data-gs-width'), 10)).toBe(1);
      expect(parseInt($widget.attr('data-gs-height'), 10)).toBe(1);
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
      var grid = GridStack.init({float: true});
      var widgetHTML = '<div class="grid-stack-item" data-gs-x="9"><div class="grid-stack-item-content"></div></div>';
      var widget = grid.addWidget(widgetHTML, null, null, undefined);
      var $widget = $(widget);
      expect(parseInt($widget.attr('data-gs-x'), 10)).toBe(8);
      expect(parseInt($widget.attr('data-gs-y'), 10)).toBe(0);
    });
  });

  describe('method float()', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should match true/false only', function() {
      var grid = GridStack.init({float: true});
      expect(grid.float()).toBe(true);
      grid.float(0);
      expect(grid.float()).toBe(false);
      grid.float(null);
      expect(grid.float()).toBe(false);
      grid.float(undefined);
      expect(grid.float()).toBe(false);
      grid.float(false);
      expect(grid.float()).toBe(false);
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
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      grid.destroy();
      expect($('.grid-stack').length).toBe(0);
      expect(grid.engine).toBe(null);
    });
    it('should cleanup gridstack but leave elements', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      grid.destroy(false);
      expect($('.grid-stack').length).toBe(1);
      expect($('.grid-stack-item').length).toBe(2);
      expect(grid.engine).toBe(null);
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
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
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
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
        float: true
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
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
      var grid = GridStack.init();
      var items = $('.grid-stack-item');
      grid._updateElement(items[0], function(el, node) {
        var hasMoved = grid.engine.moveNode(node);
        expect(hasMoved).toBe(null);
      });
    });
    it('should do nothing and return node', function() {
      var grid = GridStack.init();
      var items = $('.grid-stack-item');
      grid.minWidth(items[0], 1);
      grid.maxWidth(items[0], 2);
      grid.minHeight(items[0], 1);
      grid.maxHeight(items[0], 2);
      grid._updateElement(items[0], function(el, node) {
        var newNode = grid.engine.moveNode(node);
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
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
        float: true
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
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
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      var vm = grid.verticalMargin();
      expect(vm).toBe(10);
    });
    it('should return update verticalMargin', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      grid.verticalMargin(11);
      expect(grid.verticalMargin()).toBe(11);
    });
    it('should do nothing', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
      };
      var grid = GridStack.init(options);
      expect(grid.verticalMargin()).toBe(10);
      grid.verticalMargin(10);
      expect(grid.verticalMargin()).toBe(10);
    });
    it('should not update styles', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
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
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
        rtl: true
      };
      var grid = GridStack.init(options);
      expect($('.grid-stack').hasClass('grid-stack-rtl')).toBe(true);
    });
    it('should not add grid-stack-rtl class', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
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
    it('should enable move', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
        minWidth: 1,
        disableDrag: true
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
      expect(grid.opts.disableDrag).toBe(true);
      grid.enableMove(true, true);
      for (var i = 0; i < items.length; i++) {
        expect($(items[i]).hasClass('ui-draggable-handle')).toBe(true);
      }
      expect(grid.opts.disableDrag).toBe(false);
    });
    it('should disable move', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
        minWidth: 1
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
      grid.enableMove(false);
      for (var i = 0; i < items.length; i++) {
        expect($(items[i]).hasClass('ui-draggable-handle')).toBe(false);
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
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
        minWidth: 1,
        disableResize: true
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
      expect(grid.opts.disableResize).toBe(true);
      grid.enableResize(true, true);
      for (var i = 0; i < items.length; i++) {
        expect(($(items[i]).resizable('option','disabled'))).toBe(false);
      }
      expect(grid.opts.disableResize).toBe(false);
    });
    it('should disable resize', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
        minWidth: 1
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
      grid.enableResize(false);
      for (var i = 0; i < items.length; i++) {
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
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
        minWidth: 1
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
      grid.enableResize(false);
      grid.enableMove(false);
      for (var i = 0; i < items.length; i++) {
        expect($(items[i]).hasClass('ui-draggable-handle')).toBe(false);
        expect(($(items[i]).resizable('option','disabled'))).toBe(true);
      }
      grid.enable();
      for (var j = 0; j < items.length; j++) {
        expect($(items[j]).hasClass('ui-draggable-handle')).toBe(true);
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
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
      for (var i = 0; i < items.length; i++) {
        grid.locked(items[i], true);
        expect($(items[i]).attr('data-gs-locked')).toBe('yes');
      }
    });
    it('should unlock widgets', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10
      };
      var grid = GridStack.init(options);
      var items = $('.grid-stack-item');
      for (var i = 0; i < items.length; i++) {
        grid.locked(items[i], false);
        expect($(items[i]).attr('data-gs-locked')).toBe(undefined);
      }
    });
  });

  describe('custom grid placement #1054', function() {
    var HTML = 
    '<div style="width: 992px; height: 800px" id="gs-cont">' +
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
    var pos = [{x:0, y:0, w:12, h:9}, {x:0, y:9, w:12, h:5}, {x:0, y:14, w:7, h:6}, {x:7, y:14, w:5, h:6}];
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', HTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should have correct position', function() {
      var items = $('.grid-stack-item');
      for (var i = 0; i < items.length; i++) {
        var item = $(items[i]);
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
      var grid = GridStack.init({float: true});

      var el3 = $(grid.addWidget(widgetHTML, {x: 3, y: 5}));
      expect(parseInt(el3.attr('data-gs-x'))).toBe(3);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(5);

      grid.compact();
      expect(parseInt(el3.attr('data-gs-x'))).toBe(8);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(0);
    });
    it('not move locked item', function() {
      var grid = GridStack.init({float: true});

      var el3 = $(grid.addWidget(widgetHTML, {x: 3, y: 5, locked: true, noMove: true}));
      expect(parseInt(el3.attr('data-gs-x'))).toBe(3);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(5);

      grid.compact();
      expect(parseInt(el3.attr('data-gs-x'))).toBe(3);
      expect(parseInt(el3.attr('data-gs-y'))).toBe(5);
    });

  });

  /*
  * ...and finally track log warnings at the end, instead of displaying them....
  */
  describe('obsolete warnings', function() {
    console.warn = jasmine.createSpy('log'); // track warnings instead of displaying them
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('warning if OLD setGridWidth is called', function() {
      var grid = GridStack.init();
      grid.setGridWidth(11); // old 0.5.2 API
      expect(grid.column()).toBe(11);
      expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `setGridWidth` is deprecated in v0.5.3 and has been replaced with `column`. It will be **completely** removed in v1.0');
    });
    it('warning if OLD setColumn is called', function() {
      var grid = GridStack.init();
      grid.setColumn(10); // old 0.6.4 API
      expect(grid.column()).toBe(10);
      expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `setColumn` is deprecated in v0.6.4 and has been replaced with `column`. It will be **completely** removed in v1.0');
    });
    it('warning if OLD grid height is set', function() {
      var grid = GridStack.init({height: 10}); // old 0.5.2 Opt now maxRow
      expect(grid.opts.maxRow).toBe(10);
      expect(grid.engine.maxRow).toBe(10);
      expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `height` is deprecated in v0.5.3 and has been replaced with `maxRow`. It will be **completely** removed in v1.0');
    });
    it('warning if OLD oneColumnModeClass is set (no changes)', function() {
      GridStack.init({oneColumnModeClass: 'foo'}); // deleted 0.6.3 Opt
      expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `oneColumnModeClass` is deprecated in v0.6.3. Use class `.grid-stack-1` instead');
    });
  });
});
