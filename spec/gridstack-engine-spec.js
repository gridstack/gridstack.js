describe('gridstack engine', function() {
    'use strict';

    var e;
    var w;

    beforeEach(function() {
        w = window;
        e = w.GridStackUI.Engine;
    });

    describe('test constructor', function() {
        var engine;

        beforeAll(function() {
            engine = new GridStackUI.Engine(12);
        })

        it('should be setup properly', function() {
            expect(engine.width).toEqual(12);
            expect(engine.float).toEqual(false);
            expect(engine.height).toEqual(0);
            expect(engine.nodes).toEqual([]);
        });
    });

    describe('test _prepareNode', function() {
        var engine;

        beforeAll(function() {
            engine = new GridStackUI.Engine(12);
        })

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

    describe('test isAreaEmpty', function() {
        var engine;

        beforeAll(function() {
            engine = new GridStackUI.Engine(12, null, true);
            engine.nodes = [
                engine._prepareNode({x: 3, y: 2, width: 3, height: 2})
            ];
        })

        it('should be true', function() {
            expect(engine.isAreaEmpty(0, 0, 3, 2)).toEqual(true);
            expect(engine.isAreaEmpty(3, 4, 3, 2)).toEqual(true);
        });

        it('should be false', function() {
            expect(engine.isAreaEmpty(1, 1, 3, 2)).toEqual(false);
            expect(engine.isAreaEmpty(2, 3, 3, 2)).toEqual(false);
        });
    });

    describe('test cleanNodes/getDirtyNodes', function() {
        var engine;

        beforeAll(function() {
            engine = new GridStackUI.Engine(12, null, true);
            engine.nodes = [
                engine._prepareNode({x: 0, y: 0, width: 1, height: 1, idx: 1, _dirty: true}),
                engine._prepareNode({x: 3, y: 2, width: 3, height: 2, idx: 2, _dirty: true}),
                engine._prepareNode({x: 3, y: 7, width: 3, height: 2, idx: 3})
            ];
        });

        beforeEach(function() {
            engine._updateCounter = 0;
        });

        it('should return all dirty nodes', function() {
            var nodes = engine.getDirtyNodes();

            expect(nodes.length).toEqual(2);
            expect(nodes[0].idx).toEqual(1);
            expect(nodes[1].idx).toEqual(2);
        });

        it('should\'n clean nodes if _updateCounter > 0', function() {
            engine._updateCounter = 1;
            engine.cleanNodes();

            expect(engine.getDirtyNodes().length).toBeGreaterThan(0);
        });

        it('should clean all dirty nodes', function() {
            engine.cleanNodes();

            expect(engine.getDirtyNodes().length).toEqual(0);
        });
    });

    describe('test _notify', function() {
        var engine;
        var spy;

        beforeEach(function() {
            spy = {
                callback: function () {}
            }
            spyOn(spy, 'callback');

            engine = new GridStackUI.Engine(12, spy.callback, true);

            engine.nodes = [
                engine._prepareNode({x: 0, y: 0, width: 1, height: 1, idx: 1, _dirty: true}),
                engine._prepareNode({x: 3, y: 2, width: 3, height: 2, idx: 2, _dirty: true}),
                engine._prepareNode({x: 3, y: 7, width: 3, height: 2, idx: 3})
            ];
        });

        it('should\'n be called if _updateCounter > 0', function() {
            engine._updateCounter = 1;
            engine._notify();

            expect(spy.callback).not.toHaveBeenCalled();
        });

        it('should by called with dirty nodes', function() {
            engine._notify();

            expect(spy.callback).toHaveBeenCalledWith([
                engine.nodes[0],
                engine.nodes[1]
            ]);
        });

        it('should by called with extra passed dirty nodes', function() {
            var n1 = {idx: -1},
                n2 = {idx: -2};

            engine._notify(n1, n2);

            expect(spy.callback).toHaveBeenCalledWith([
                n1,
                n2,
                engine.nodes[0],
                engine.nodes[1]
            ]);
        });
    });
});
