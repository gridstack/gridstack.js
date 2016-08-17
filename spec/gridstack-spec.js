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
        it('should return 1/12th of container width.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                width: 12
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var res = Math.round($('.grid-stack').outerWidth() / 12);
            expect(grid.cellWidth()).toBe(res);
        });
        it('should return 1/10th of container width.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                width: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var res = Math.round($('.grid-stack').outerWidth() / 10);
            expect(grid.cellWidth()).toBe(res);
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

    describe('grid.isAreaEmpty', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should set return false.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var shouldBeFalse = grid.isAreaEmpty(1, 1, 1, 1);
            expect(shouldBeFalse).toBe(false);
        });
        it('should set return true.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var shouldBeTrue = grid.isAreaEmpty(5, 5, 1, 1);
            expect(shouldBeTrue).toBe(true);
        });
    });

    describe('grid method obsolete warnings', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should log a warning if set_static is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid.set_static(true);
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `set_static` is deprecated as of v0.2.5 and has been replaced with `setStatic`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if _set_static_class is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid._set_static_class();
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `_set_static_class` is deprecated as of v0.2.5 and has been replaced with `_setStaticClass`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if is_area_empty is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid.is_area_empty(1, 1, 1, 1);
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `is_area_empty` is deprecated as of v0.2.5 and has been replaced with `isAreaEmpty`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if batch_update is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid.batch_update();
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `batch_update` is deprecated as of v0.2.5 and has been replaced with `batchUpdate`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if get_cell_from_pixel is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var pixel = {top: 100, left: 72};
            grid.get_cell_from_pixel(pixel);
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `get_cell_from_pixel` is deprecated as of v0.2.5 and has been replaced with `getCellFromPixel`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if cell_width is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid.cell_width();
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `cell_width` is deprecated as of v0.2.5 and has been replaced with `cellWidth`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if cell_height is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid.cell_height();
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `cell_height` is deprecated as of v0.2.5 and has been replaced with `cellHeight`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if _update_element is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid._update_element();
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `_update_element` is deprecated as of v0.2.5 and has been replaced with `_updateElement`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if min_width is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid.min_width(items[i], 2);
            }
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `min_width` is deprecated as of v0.2.5 and has been replaced with `minWidth`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if min_height is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid.min_height(items[i], 2);
            }
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `min_height` is deprecated as of v0.2.5 and has been replaced with `minHeight`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if remove_all is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid.remove_all();
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `remove_all` is deprecated as of v0.2.5 and has been replaced with `removeAll`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if remove_widget is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid.remove_widget(items[i]);
            }
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `remove_widget` is deprecated as of v0.2.5 and has been replaced with `removeWidget`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if will_it_fit is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid.will_it_fit(0, 0, 1, 1, false);
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `will_it_fit` is deprecated as of v0.2.5 and has been replaced with `willItFit`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if make_widget is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid.make_widget(items[i]);
            }
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `make_widget` is deprecated as of v0.2.5 and has been replaced with `makeWidget`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if add_widget is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid.add_widget(items[i]);
            }
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `add_widget` is deprecated as of v0.2.5 and has been replaced with `addWidget`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if set_animation is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid.set_animation(true);
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `set_animation` is deprecated as of v0.2.5 and has been replaced with `setAnimation`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if _prepare_element is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid._prepare_element(items[i]);
            }
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `_prepare_element` is deprecated as of v0.2.5 and has been replaced with `_prepareElement`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if _is_one_column_mode is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid._is_one_column_mode();
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `_is_one_column_mode` is deprecated as of v0.2.5 and has been replaced with `_isOneColumnMode`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if _update_container_height is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid._update_container_height();
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `_update_container_height` is deprecated as of v0.2.5 and has been replaced with `_updateContainerHeight`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if _update_styles is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid._update_styles();
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `_update_styles` is deprecated as of v0.2.5 and has been replaced with `_updateStyles`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if _init_styles is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid._init_styles();
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `_init_styles` is deprecated as of v0.2.5 and has been replaced with `_initStyles`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if _trigger_change_event is called.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid._trigger_change_event();
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `_trigger_change_event` is deprecated as of v0.2.5 and has been replaced with `_triggerChangeEvent`. It will be **completely** removed in v1.0.');
        });
    });

    describe('grid opts obsolete warnings', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should log a warning if handle_class is set.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                handle_class: 'grid-stack-header'

            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `handle_class` is deprecated as of v0.2.5 and has been replaced with `handleClass`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if item_class is set.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                item_class: 'grid-stack-item'

            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `item_class` is deprecated as of v0.2.5 and has been replaced with `itemClass`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if placeholder_class is set.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                placeholder_class: 'grid-stack-placeholder'

            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `placeholder_class` is deprecated as of v0.2.5 and has been replaced with `placeholderClass`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if placeholder_text is set.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                placeholder_text: 'placeholder'

            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `placeholder_text` is deprecated as of v0.2.5 and has been replaced with `placeholderText`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if cell_height is set.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cell_height: 80,
                verticalMargin: 10

            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `cell_height` is deprecated as of v0.2.5 and has been replaced with `cellHeight`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if vertical_margin is set.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                vertical_margin: 10

            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `vertical_margin` is deprecated as of v0.2.5 and has been replaced with `verticalMargin`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if min_width is set.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                min_width: 2

            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `min_width` is deprecated as of v0.2.5 and has been replaced with `minWidth`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if static_grid is set.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                static_grid: false

            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `static_grid` is deprecated as of v0.2.5 and has been replaced with `staticGrid`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if is_nested is set.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                is_nested: false

            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `is_nested` is deprecated as of v0.2.5 and has been replaced with `isNested`. It will be **completely** removed in v1.0.');
        });
        it('should log a warning if always_show_resize_handle is set.', function() {
            console.warn = jasmine.createSpy('log');
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                always_show_resize_handle: false

            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `always_show_resize_handle` is deprecated as of v0.2.5 and has been replaced with `alwaysShowResizeHandle`. It will be **completely** removed in v1.0.');
        });
    });

    describe('grid method _packNodes with float', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should allow same x, y coordinates for widgets.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                float: true
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should allow same x, y coordinates for widgets.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                float: true
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var widgetHTML =
                '   <div class="grid-stack-item">' +
                '       <div class="grid-stack-item-content"></div>' +
                '   </div>';
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
        });
    });

    describe('grid method addWidget with autoPosition true', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should change x, y coordinates for widgets.', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var widgetHTML =
                '   <div class="grid-stack-item">' +
                '       <div class="grid-stack-item-content"></div>' +
                '   </div>';
            var widget = grid.addWidget(widgetHTML, 9, 7, 2, 3, true);
            var $widget = $(widget);
            expect(parseInt($widget.attr('data-gs-x'), 10)).not.toBe(6);
            expect(parseInt($widget.attr('data-gs-y'), 10)).not.toBe(7);
        });
    });

    describe('grid.destroy', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            //document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should cleanup gridstack', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid.destroy();
            expect($('.grid-stack').length).toBe(0);
            expect(grid.grid).toBe(null);
        });
        it('should cleanup gridstack but leave elements', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid.destroy(false);
            expect($('.grid-stack').length).toBe(1);
            expect($('.grid-stack-item').length).toBe(2);
            expect(grid.grid).toBe(null);
            grid.destroy();
        });
    });

    describe('grid.resize', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should resize widget', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            grid.resize(items[0], 5, 5);
            expect(parseInt($(items[0]).attr('data-gs-width'), 10)).toBe(5);
            expect(parseInt($(items[0]).attr('data-gs-height'), 10)).toBe(5);
        });
    });

    describe('grid.move', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should move widget', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                float: true
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            grid.move(items[0], 5, 5);
            expect(parseInt($(items[0]).attr('data-gs-x'), 10)).toBe(5);
            expect(parseInt($(items[0]).attr('data-gs-y'), 10)).toBe(5);
        });
    });

    describe('grid.moveNode', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should do nothing and return node', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            grid._updateElement(items[0], function(el, node) {
                var newNode = grid.grid.moveNode(node);
                expect(newNode).toBe(node);
            });
        });
        it('should do nothing and return node', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            grid.minWidth(items[0], 1);
            grid.maxWidth(items[0], 2);
            grid.minHeight(items[0], 1);
            grid.maxHeight(items[0], 2);
            grid._updateElement(items[0], function(el, node) {
                var newNode = grid.grid.moveNode(node);
                expect(newNode).toBe(node);
            });
        });
    });

    describe('grid.update', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should move and resize widget', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                float: true
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should return verticalMargin', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var vm = grid.verticalMargin();
            expect(vm).toBe(10);
        });
        it('should return update verticalMargin', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            grid.verticalMargin(11);
            expect(grid.verticalMargin()).toBe(11);
        });
        it('should do nothing', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var vm = grid.verticalMargin(10);
            expect(grid.verticalMargin()).toBe(10);
        });
        it('should do nothing', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                height: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var vm = grid.verticalMargin(10);
            expect(grid.verticalMargin()).toBe(10);
        });
        it('should not update styles', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');

            spyOn(grid, '_updateStyles');
            grid.verticalMargin(11, true);
            expect(grid._updateStyles).not.toHaveBeenCalled();
        });
    });

    describe('grid.opts.rtl', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should add grid-stack-rtl class', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                rtl: true
            };
            $('.grid-stack').gridstack(options);
            expect($('.grid-stack').hasClass('grid-stack-rtl')).toBe(true);
        });
        it('should not add grid-stack-rtl class', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            expect($('.grid-stack').hasClass('grid-stack-rtl')).toBe(false);
        });
    });

    describe('grid.enableMove', function() {
        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should enable move', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1,
                disableDrag: true
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should enable resize', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1,
                disableResize: true
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should enable movable and resizable', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10,
                minWidth: 1
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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
            document.body.insertAdjacentHTML(
                'afterbegin', gridstackHTML);
        });
        afterEach(function() {
            document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
        });
        it('should lock widgets', function() {
            var options = {
                cellHeight: 80,
                verticalMargin: 10
            };
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
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
            $('.grid-stack').gridstack(options);
            var grid = $('.grid-stack').data('gridstack');
            var items = $('.grid-stack-item');
            for (var i = 0; i < items.length; i++) {
                grid.locked(items[i], false);
                expect($(items[i]).attr('data-gs-locked')).toBe(undefined);
            }
        });
    });
});
