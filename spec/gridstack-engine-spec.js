describe('gridstack engine', function() {
    'use strict';

    var e;
    var w;
    var engine;

    beforeEach(function() {
        w = window;
        e = w.GridStackUI.Engine;
        engine = new w.GridStackUI.Engine(12);
    });

    describe('test constructor', function() {
        it('should be setup properly', function() {
            expect(engine.width).toEqual(12);
            expect(engine.float).toEqual(false);
            expect(engine.height).toEqual(0);
            expect(engine.nodes).toEqual([]);
        });
    });

    describe('test _prepareNode', function() {
        it('should prepare a node', function() {
            expect(engine._prepareNode({}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({x: 10}, false)).toEqual(jasmine.objectContaining({x: 10, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({x: -10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({y: 10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 10, width: 1, height: 1}));
            expect(engine._prepareNode({y: -10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({width: 3}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 3, height: 1}));
            expect(engine._prepareNode({width: 100}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 12, height: 1}));
            expect(engine._prepareNode({width: 0}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({width: -190}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({height: 3}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 3}));
            expect(engine._prepareNode({height: 0}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({height: -10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
            expect(engine._prepareNode({x: 4, width: 10}, false)).toEqual(jasmine.objectContaining({x: 2, y: 0, width: 10, height: 1}));
            expect(engine._prepareNode({x: 4, width: 10}, true)).toEqual(jasmine.objectContaining({x: 4, y: 0, width: 8, height: 1}));
        });
    });
});
