describe('gridstack', function() {
    'use strict';

    var e;
    var w;

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



});