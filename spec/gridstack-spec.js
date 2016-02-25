describe('gridstack', function() {
    'use strict';

    var e;
    var w;
    var gridstackHTML =
        '<div class="grid-stack">' +
        '   <div class="grid-stack-item"' +
        '   data-gs-x="0" data-gs-y="0"' +
        '   data-gs-width="4" data-gs-height="2">' +
        '       <div class="grid-stack-item-content"></div>' +
        '   </div>' +
        '    <div class="grid-stack-item"' +
        '    data-gs-x="4" data-gs-y="0"' +
        '    data-gs-width="4" data-gs-height="4">' +
        '            <div class="grid-stack-item-content"></div>' +
        '    </div>' +
        '</div>';

    beforeEach(function() {
        w = window;
        e = w.GridStackUI.Engine;
    });

    describe('setup of gridstack', function() {

        it('should exist setup function.', function() {

            expect(e).not.toBeNull();
            expect(typeof e).toBe('function');
        });

        it('should set default params correctly.', function() {
            e.call(w);
            expect(w.width).toBeUndefined();
            expect(w.float).toBe(false);
            expect(w.height).toEqual(0);
            expect(w.nodes).toEqual([]);
            expect(typeof w.onchange).toBe('function');
            expect(w._updateCounter).toEqual(0);
            expect(w._float).toEqual(w.float);
        });

        it('should set params correctly.', function() {
            var fkt = function() { };
            var arr = [1,2,3];

            e.call(w, 1, fkt, true, 2, arr);
            expect(w.width).toEqual(1);
            expect(w.float).toBe(true);
            expect(w.height).toEqual(2);
            expect(w.nodes).toEqual(arr);
            expect(w.onchange).toEqual(fkt);
            expect(w._updateCounter).toEqual(0);
            expect(w._float).toEqual(w.float);
        });


    });

    describe('batch update', function() {

        it('should set float and counter when calling batchUpdate.', function() {
            e.prototype.batchUpdate.call(w);
            expect(w.float).toBe(true);
            expect(w._updateCounter).toEqual(1);
        });

        //test commit function

    });

    describe('sorting of nodes', function() {

        it('should sort ascending with width.', function() {
            w.nodes = [{x: 7, y: 0}, {x: 4, y: 4}, {x: 9, y: 0}, {x: 0, y: 1}];
            e.prototype._sortNodes.call(w, 1);
            expect(w.nodes).toEqual([{x: 0, y: 1}, {x: 7, y: 0}, {x: 4, y: 4}, {x: 9, y: 0}]);
        });

        it('should sort descending with width.', function() {
            w.nodes = [{x: 7, y: 0}, {x: 4, y: 4}, {x: 9, y: 0}, {x: 0, y: 1}];
            e.prototype._sortNodes.call(w, -1);
            expect(w.nodes).toEqual([{x: 9, y: 0}, {x: 4, y: 4}, {x: 7, y: 0}, {x: 0, y: 1}]);
        });

        it('should sort ascending without width.', function() {
            w.width = false;
            w.nodes = [{x: 7, y: 0, width: 1}, {x: 4, y: 4, width: 1}, {x: 9, y: 0, width: 1}, {x: 0, y: 1, width: 1}];
            e.prototype._sortNodes.call(w, 1);
            expect(w.nodes).toEqual([{x: 7, y: 0, width: 1}, {x: 9, y: 0, width: 1}, {x: 0, y: 1, width: 1}, {x: 4, y: 4, width: 1}]);
        });

        it('should sort descending without width.', function() {
            w.width = false;
            w.nodes = [{x: 7, y: 0, width: 1}, {x: 4, y: 4, width: 1}, {x: 9, y: 0, width: 1}, {x: 0, y: 1, width: 1}];
            e.prototype._sortNodes.call(w, -1);
            expect(w.nodes).toEqual([{x: 4, y: 4, width: 1}, {x: 0, y: 1, width: 1}, {x: 9, y: 0, width: 1}, {x: 7, y: 0, width: 1}]);
        });

    });

    describe('grid.setAnimation', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should add class grid-stack-animate to the container.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            $('.grid-stack').removeClass('grid-stack-animate');
            var grid = $('.grid-stack').data('gridstack');
            grid.setAnimation(true);
            expect($('.grid-stack').hasClass('grid-stack-animate')).toBe(true);
        });
        it('should remove class grid-stack-animate from the container.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            $('.grid-stack').addClass('grid-stack-animate');
            var grid = $('.grid-stack').data('gridstack');
            grid.setAnimation(false);
            expect($('.grid-stack').hasClass('grid-stack-animate')).toBe(false);
        });
    });

    describe('grid._setStaticClass', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should add class grid-stack-static to the container.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                staticGrid: true
            };
            $('.grid-stack').gridstack(options);
            $('.grid-stack').removeClass('grid-stack-static');
            var grid = $('.grid-stack').data('gridstack');
            grid._setStaticClass();
            expect($('.grid-stack').hasClass('grid-stack-static')).toBe(true);
        });
        it('should remove class grid-stack-static from the container.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                staticGrid: false
            };
            $('.grid-stack').gridstack(options);
            $('.grid-stack').addClass('grid-stack-static');
            var grid = $('.grid-stack').data('gridstack');
            grid._setStaticClass();
            expect($('.grid-stack').hasClass('grid-stack-static')).toBe(false);
        });
    });

    describe('grid.getCellFromPixel', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should return {x: 2, y: 1}.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var pixel = {top: 100, left: 72};
            var cell = grid.getCellFromPixel(pixel);
            expect(cell.x).toBe(2);
            expect(cell.y).toBe(1);
        });
        it('should return {x: 2, y: 1}.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var pixel = {top: 100, left: 72};
            var cell = grid.getCellFromPixel(pixel, false);
            expect(cell.x).toBe(2);
            expect(cell.y).toBe(1);
        });
        it('should return {x: 2, y: 1}.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var pixel = {top: 100, left: 72};
            var cell = grid.getCellFromPixel(pixel, true);
            expect(cell.x).toBe(2);
            expect(cell.y).toBe(1);
        });
    });

    describe('grid.cellWidth', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should return 96.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            expect(grid.cellWidth()).toBe(96);
        });
    });

    describe('grid.minWidth', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should set data-gs-min-width to 2.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should set data-gs-min-width to 2.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should set data-gs-min-height to 2.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should set data-gs-min-height to 2.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid.maxHeight(items[i], 2);
            }
            for (var j = 0; j < items.length; j++) {
                expect(parseInt($(items[j]).attr('data-gs-max-height'), 10)).toBe(2);
            }
        });
    });
});
