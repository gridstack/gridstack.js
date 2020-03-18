describe('gridstack engine', function() {
  'use strict';
  let engine;
  let findNode = function(engine, id) {
    return engine.nodes.find(function(i) { return i._id === id; });
  };

  beforeEach(function() {
  });

  describe('test constructor', function() {
  
    beforeAll(function() {
      engine = new GridStack.Engine(12);
    });
    it('should be setup properly', function() {
      expect(engine.column).toEqual(12);
      expect(engine.float).toEqual(false);
      expect(engine.maxRow).toEqual(0);
      expect(engine.nodes).toEqual([]);
    });
  });

  describe('test _prepareNode', function() {

    beforeAll(function() {
      engine = new GridStack.Engine(12);
    });
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

    beforeAll(function() {
      engine = new GridStack.Engine(12, null, true);
      engine.nodes = [
        engine._prepareNode({x: 3, y: 2, width: 3, height: 2})
      ];
    });

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

    beforeAll(function() {
      engine = new GridStack.Engine(12, null, true);
      engine.nodes = [
        engine._prepareNode({x: 0, y: 0, width: 1, height: 1, idx: 1, _dirty: true}),
        engine._prepareNode({x: 3, y: 2, width: 3, height: 2, idx: 2, _dirty: true}),
        engine._prepareNode({x: 3, y: 7, width: 3, height: 2, idx: 3})
      ];
    });

    beforeEach(function() {
      engine._batchMode = false;
    });

    it('should return all dirty nodes', function() {
      let nodes = engine.getDirtyNodes();
      expect(nodes.length).toEqual(2);
      expect(nodes[0].idx).toEqual(1);
      expect(nodes[1].idx).toEqual(2);
    });

    it('should\'n clean nodes if _batchMode true', function() {
      engine._batchMode = true;
      engine.cleanNodes();
      expect(engine.getDirtyNodes().length).toBeGreaterThan(0);
    });

    it('should clean all dirty nodes', function() {
      engine.cleanNodes();
      expect(engine.getDirtyNodes().length).toEqual(0);
    });
  });

  describe('test batchUpdate/commit', function() {
    beforeAll(function() {
      engine = new GridStack.Engine(12);
    });

    it('should work on not float grids', function() {
      expect(engine.float).toEqual(false);
      engine.batchUpdate();
      expect(engine._batchMode).toBeTrue();
      expect(engine.float).toEqual(true);
      engine.commit();
      expect(engine._batchMode).toBeFalse();
      expect(engine.float).toEqual(false);
    });

    it('should work on float grids', function() {
      engine.float = true;
      engine.batchUpdate();
      expect(engine._batchMode).toBeTrue();
      expect(engine.float).toEqual(true);
      engine.commit();
      expect(engine._batchMode).toBeFalse();
      expect(engine.float).toEqual(true);
    });
  });

  describe('test batchUpdate/commit', function() {

    beforeAll(function() {
      engine = new GridStack.Engine(12, null, true);
    });

    it('should work on float grids', function() {
      expect(engine.float).toEqual(true);
      engine.batchUpdate();
      expect(engine._batchMode).toBeTrue();
      expect(engine.float).toEqual(true);
      engine.commit();
      expect(engine._batchMode).toBeFalse();
      expect(engine.float).toEqual(true);
    });
  });

  describe('test _notify', function() {
    let spy;

    beforeEach(function() {
      spy = {
        callback: function() {}
      };
      spyOn(spy, 'callback');
      engine = new GridStack.Engine(12, spy.callback, true);
      engine.nodes = [
        engine._prepareNode({x: 0, y: 0, width: 1, height: 1, idx: 1, _dirty: true}),
        engine._prepareNode({x: 3, y: 2, width: 3, height: 2, idx: 2, _dirty: true}),
        engine._prepareNode({x: 3, y: 7, width: 3, height: 2, idx: 3})
      ];
    });

    it('should\'n be called if _batchMode true', function() {
      engine._batchMode = true;
      engine._notify();
      expect(spy.callback).not.toHaveBeenCalled();
    });

    it('should by called with dirty nodes', function() {
      engine._notify();
      expect(spy.callback).toHaveBeenCalledWith([
        engine.nodes[0],
        engine.nodes[1]
      ], true);
    });

    it('should by called with extra passed node to be removed', function() {
      let n1 = {idx: -1};
      engine._notify(n1);
      expect(spy.callback).toHaveBeenCalledWith([
        n1,
        engine.nodes[0],
        engine.nodes[1]
      ], true);
    });

    it('should by called with extra passed node to be removed and should maintain false parameter', function() {
      let n1 = {idx: -1};
      engine._notify(n1, false);
      expect(spy.callback).toHaveBeenCalledWith([
        n1,
        engine.nodes[0],
        engine.nodes[1]
      ], false);
    });
  });

  describe('test _packNodes', function() {
    describe('using not float mode', function() {
      beforeEach(function() {
        engine = new GridStack.Engine(12, null, false);
      });

      it('shouldn\'t pack one node with y coord eq 0', function() {
        engine.nodes = [
          {x: 0, y: 0, width: 1, height: 1, _id: 1},
        ];
        engine._packNodes();
        expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1}));
        expect(findNode(engine, 1)._dirty).toBeFalsy();
      });

      it('should pack one node correctly', function() {
        engine.nodes = [
          {x: 0, y: 1, width: 1, height: 1, _id: 1},
        ];
        engine._packNodes();
        expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1, _dirty: true}));
      });

      it('should pack nodes correctly', function() {
        engine.nodes = [
          {x: 0, y: 1, width: 1, height: 1, _id: 1},
          {x: 0, y: 5, width: 1, height: 1, _id: 2},
        ];
        engine._packNodes();
        expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1, _dirty: true}));
        expect(findNode(engine, 2)).toEqual(jasmine.objectContaining({x: 0, y: 1, width: 1, height: 1, _dirty: true}));
      });
  
      it('should pack nodes correctly', function() {
        engine.nodes = [
          {x: 0, y: 5, width: 1, height: 1, _id: 1},
          {x: 0, y: 1, width: 1, height: 1, _id: 2},
        ];
        engine._packNodes();
        expect(findNode(engine, 2)).toEqual(jasmine.objectContaining({x: 0, y: 0, width: 1, height: 1, _dirty: true}));
        expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 1, width: 1, height: 1, _dirty: true}));
      });
  
      it('should respect locked nodes', function() {
        engine.nodes = [
          {x: 0, y: 1, width: 1, height: 1, _id: 1, locked: true},
          {x: 0, y: 5, width: 1, height: 1, _id: 2},
        ];
        engine._packNodes();
        expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 1, width: 1, height: 1}));
        expect(findNode(engine, 1)._dirty).toBeFalsy();
        expect(findNode(engine, 2)).toEqual(jasmine.objectContaining({x: 0, y: 2, width: 1, height: 1, _dirty: true}));
      });
    });
  });

  describe('test isNodeChangedPosition', function() {
    beforeAll(function() {
      engine = new GridStack.Engine(12);
    });
    it('should return true for changed x', function() {
      let widget = { x: 1, y: 2, width: 3, height: 4 };
      expect(engine.isNodeChangedPosition(widget, 2, 2)).toEqual(true);
    });
    it('should return true for changed y', function() {
      let widget = { x: 1, y: 2, width: 3, height: 4 };
      expect(engine.isNodeChangedPosition(widget, 1, 1)).toEqual(true);
    });
    it('should return true for changed width', function() {
      let widget = { x: 1, y: 2, width: 3, height: 4 };
      expect(engine.isNodeChangedPosition(widget, 2, 2, 4, 4)).toEqual(true);
    });
    it('should return true for changed height', function() {
      let widget = { x: 1, y: 2, width: 3, height: 4 };
      expect(engine.isNodeChangedPosition(widget, 1, 2, 3, 3)).toEqual(true);
    });
    it('should return false for unchanged position', function() {
      let widget = { x: 1, y: 2, width: 3, height: 4 };
      expect(engine.isNodeChangedPosition(widget, 1, 2, 3, 4)).toEqual(false);
    });
  });

  describe('test locked widget', function() {
    beforeAll(function() {
      engine = new GridStack.Engine(12);
    });
    it('should add widgets around locked one', function() {
      let nodes = [
        {x: 0, y: 1, width: 12, height: 1, locked: 'yes', noMove: true, noResize: true, _id: 1},
        {x: 1, y: 0, width: 2, height: 3, _id: 2}
      ];
      // add locked item
      engine.addNode(nodes[0])
      expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 1, width: 12, height: 1, locked: 'yes'}));
      engine.addNode(nodes[1])
      // add item that moves past locked one
      expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 1, width: 12, height: 1, locked: 'yes'}));
      expect(findNode(engine, 2)).toEqual(jasmine.objectContaining({x: 1, y: 2}));
      // prevents moving locked item
      let node1 = findNode(engine, 1);
      expect(engine.moveNode(node1, 6, 6)).toEqual(null);
      // but moves regular one (gravity ON)
      let node2 = findNode(engine, 2);
      expect(engine.moveNode(node2, 6, 6)).toEqual(jasmine.objectContaining({x: 6, y: 2, width: 2, height: 3,}));
      // but moves regular one (gravity OFF)
      engine.float = true;
      expect(engine.moveNode(node2, 7, 6)).toEqual(jasmine.objectContaining({x: 7, y: 6, width: 2, height: 3,}));
    });
  });

});
