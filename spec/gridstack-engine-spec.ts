import { GridStackEngine } from '../src/gridstack-engine';
import { GridStackNode } from '../src/types';

describe('gridstack engine', function() {
  'use strict';
  let engine: GridStackEngine;
  // old hacky JS code that's not happy in TS. just cast to `any` and skip warnings
  let e: any = GridStackEngine;
  let w: any = window;

  let findNode = function(engine, id) {
    return engine.nodes.find((i) => i.id === id);
  };

  it('should exist setup function.', function() {
    expect(e).not.toBeNull();
    expect(typeof e).toBe('function');
  });

  describe('test constructor', function() {
  
    it('should be setup properly', function() {
      engine = new GridStackEngine();
      expect(engine.column).toEqual(12);
      expect(engine.float).toEqual(false);
      expect(engine.maxRow).toEqual(undefined);
      expect(engine.nodes).toEqual([]);
      expect(engine.batchMode).toEqual(undefined);
      expect((engine as any).onChange).toEqual(undefined);
    });

    it('should set params correctly.', function() {
      let fkt = function() { };
      let arr: any = [1,2,3];
      engine = new GridStackEngine({column: 1, onChange:fkt, float:true, maxRow:2, nodes:arr});
      expect(engine.column).toEqual(1);
      expect(engine.float).toBe(true);
      expect(engine.maxRow).toEqual(2);
      expect(engine.nodes).toEqual(arr);
      expect(engine.batchMode).toEqual(undefined);
      expect((engine as any).onChange).toEqual(fkt);
    });
  });

  describe('batch update', function() {

    it('should set float and batchMode when calling batchUpdate.', function() {
      engine = new GridStackEngine({float: true});
      engine.batchUpdate();
      expect(engine.float).toBe(true);
      expect(engine.batchMode).toBeTrue();
    });
  });  

  describe('test prepareNode', function() {

    beforeAll(function() {
      engine = new GridStackEngine();
    });
    it('should prepare a node', function() {
      expect(engine.prepareNode({}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
      expect(engine.prepareNode({x: 10}, false)).toEqual(jasmine.objectContaining({x: 10, y: 0, h: 1}));
      expect(engine.prepareNode({x: -10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
      expect(engine.prepareNode({y: 10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 10, h: 1}));
      expect(engine.prepareNode({y: -10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
      expect(engine.prepareNode({w: 3}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, w: 3, h: 1}));
      expect(engine.prepareNode({w: 100}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, w: 12, h: 1}));
      expect(engine.prepareNode({w: 0}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
      expect(engine.prepareNode({w: -190}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
      expect(engine.prepareNode({h: 3}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 3}));
      expect(engine.prepareNode({h: 0}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
      expect(engine.prepareNode({h: -10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
      expect(engine.prepareNode({x: 4, w: 10}, false)).toEqual(jasmine.objectContaining({x: 2, y: 0, w: 10, h: 1}));
      expect(engine.prepareNode({x: 4, w: 10}, true)).toEqual(jasmine.objectContaining({x: 4, y: 0, w: 8, h: 1}));
    });
  });

  describe('sorting of nodes', function() {
    // Note: legacy weird call on global window to hold data
    it('should sort ascending with 12 columns.', function() {
      w.column = 12;
      w.nodes = [{x: 7, y: 0}, {x: 4, y: 4}, {x: 9, y: 0}, {x: 0, y: 1}];
      engine.sortNodes.call(w, 1);
      expect(w.nodes).toEqual([{x: 7, y: 0}, {x: 9, y: 0}, {x: 0, y: 1}, {x: 4, y: 4}]);
    });
  
    it('should sort descending with 12 columns.', function() {
      w.column = 12;
      w.nodes = [{x: 7, y: 0}, {x: 4, y: 4}, {x: 9, y: 0}, {x: 0, y: 1}];
      engine.sortNodes.call(w, -1);
      expect(w.nodes).toEqual([{x: 4, y: 4}, {x: 0, y: 1}, {x: 9, y: 0}, {x: 7, y: 0}]);
    });
  
    it('should sort ascending with 1 columns.', function() {
      w.column = 1;
      w.nodes = [{x: 7, y: 0}, {x: 4, y: 4}, {x: 9, y: 0}, {x: 0, y: 1}];
      engine.sortNodes.call(w, 1);
      expect(w.nodes).toEqual([{x: 0, y: 1}, {x: 7, y: 0}, {x: 4, y: 4}, {x: 9, y: 0}]);
    });
  
    it('should sort descending with 1 columns.', function() {
      w.column = 1;
      w.nodes = [{x: 7, y: 0}, {x: 4, y: 4}, {x: 9, y: 0}, {x: 0, y: 1}];
      engine.sortNodes.call(w, -1);
      expect(w.nodes).toEqual([{x: 9, y: 0}, {x: 4, y: 4}, {x: 7, y: 0}, {x: 0, y: 1}]);
    });
  
    it('should sort ascending without columns.', function() {
      w.column = undefined;
      w.nodes = [{x: 7, y: 0, w: 1}, {x: 4, y: 4, w: 1}, {x: 9, y: 0, w: 1}, {x: 0, y: 1, w: 1}];
      engine.sortNodes.call(w, 1);
      expect(w.nodes).toEqual([{x: 7, y: 0, w: 1}, {x: 9, y: 0, w: 1}, {x: 0, y: 1, w: 1}, {x: 4, y: 4, w: 1}]);
    });
  
    it('should sort descending without columns.', function() {
      w.column = undefined;
      w.nodes = [{x: 7, y: 0, w: 1}, {x: 4, y: 4, w: 1}, {x: 9, y: 0, w: 1}, {x: 0, y: 1, w: 1}];
      engine.sortNodes.call(w, -1);
      expect(w.nodes).toEqual([{x: 4, y: 4, w: 1}, {x: 0, y: 1, w: 1}, {x: 9, y: 0, w: 1}, {x: 7, y: 0, w: 1}]);
    });
  
  });
  
  describe('test isAreaEmpty', function() {

    beforeAll(function() {
      engine = new GridStackEngine({float:true});
      engine.nodes = [
        engine.prepareNode({x: 3, y: 2, w: 3, h: 2})
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
      engine = new GridStackEngine({float:true});
      engine.nodes = [
        engine.prepareNode({x: 0, y: 0, id: 1, _dirty: true}),
        engine.prepareNode({x: 3, y: 2, w: 3, h: 2, id: 2, _dirty: true}),
        engine.prepareNode({x: 3, y: 7, w: 3, h: 2, id: 3})
      ];
    });

    beforeEach(function() {
      delete engine.batchMode;
    });

    it('should return all dirty nodes', function() {
      let nodes = engine.getDirtyNodes();
      expect(nodes.length).toEqual(2);
      expect(nodes[0].id).toEqual(1);
      expect(nodes[1].id).toEqual(2);
    });

    it('should\'n clean nodes if batchMode true', function() {
      engine.batchMode = true;
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
      engine = new GridStackEngine();
    });

    it('should work on not float grids', function() {
      expect(engine.float).toEqual(false);
      engine.batchUpdate();
      engine.batchUpdate(); // double for code coverage
      expect(engine.batchMode).toBeTrue();
      expect(engine.float).toEqual(true);
      engine.batchUpdate(false);
      engine.batchUpdate(false);
      expect(engine.batchMode).not.toBeTrue();
      expect(engine.float).not.toBeTrue;
    });

    it('should work on float grids', function() {
      engine.float = true;
      engine.batchUpdate();
      expect(engine.batchMode).toBeTrue();
      expect(engine.float).toEqual(true);
      engine.batchUpdate(false);
      expect(engine.batchMode).not.toBeTrue();
      expect(engine.float).toEqual(true);
    });
  });

  describe('test batchUpdate/commit', function() {

    beforeAll(function() {
      engine = new GridStackEngine({float:true});
    });

    it('should work on float grids', function() {
      expect(engine.float).toEqual(true);
      engine.batchUpdate();
      expect(engine.batchMode).toBeTrue();
      expect(engine.float).toEqual(true);
      engine.batchUpdate(false);
      expect(engine.batchMode).not.toBeTrue();
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
      engine = new GridStackEngine({float:true, onChange: spy.callback});
      engine.nodes = [
        engine.prepareNode({x: 0, y: 0, id: 1, _dirty: true}),
        engine.prepareNode({x: 3, y: 2, w: 3, h: 2, id: 2, _dirty: true}),
        engine.prepareNode({x: 3, y: 7, w: 3, h: 2, id: 3})
      ];
    });

    it('should\'n be called if batchMode true', function() {
      engine.batchMode = true;
      (engine as any)._notify();
      expect(spy.callback).not.toHaveBeenCalled();
    });

    it('should by called with dirty nodes', function() {
      (engine as any)._notify();
      expect(spy.callback).toHaveBeenCalledWith([engine.nodes[0], engine.nodes[1]]);
    });

    it('should by called with extra passed node to be removed', function() {
      let n1 = {id: -1};
      (engine as any)._notify([n1]);
      expect(spy.callback).toHaveBeenCalledWith([n1, engine.nodes[0], engine.nodes[1]]);
    });
  });

  describe('test _packNodes', function() {
    describe('using not float mode', function() {
      beforeEach(function() {
        engine = new GridStackEngine({float:false});
      });

      it('shouldn\'t pack one node with y coord eq 0', function() {
        engine.nodes = [
          {x: 0, y: 0, w:1, h:1, id: 1},
        ];
        (engine as any)._packNodes();
        expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
        expect(findNode(engine, 1)._dirty).toBeFalsy();
      });

      it('should pack one node correctly', function() {
        engine.nodes = [
          {x: 0, y: 1, w:1, h:1, id: 1},
        ];
        (engine as any)._packNodes();
        expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 0, _dirty: true}));
      });

      it('should pack nodes correctly', function() {
        engine.nodes = [
          {x: 0, y: 1, w:1, h:1, id: 1},
          {x: 0, y: 5, w:1, h:1, id: 2},
        ];
        (engine as any)._packNodes();
        expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 0, _dirty: true}));
        expect(findNode(engine, 2)).toEqual(jasmine.objectContaining({x: 0, y: 1, _dirty: true}));
      });
  
      it('should pack nodes correctly', function() {
        engine.nodes = [
          {x: 0, y: 5, w:1, h:1, id: 1},
          {x: 0, y: 1, w:1, h:1, id: 2},
        ];
        (engine as any)._packNodes();
        expect(findNode(engine, 2)).toEqual(jasmine.objectContaining({x: 0, y: 0, _dirty: true}));
        expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 1, _dirty: true}));
      });
  
      it('should respect locked nodes', function() {
        engine.nodes = [
          {x: 0, y: 1, w:1, h:1, id: 1, locked: true},
          {x: 0, y: 5, w:1, h:1, id: 2},
        ];
        (engine as any)._packNodes();
        expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 0, y: 1, h: 1}));
        expect(findNode(engine, 1)._dirty).toBeFalsy();
        expect(findNode(engine, 2)).toEqual(jasmine.objectContaining({x: 0, y: 2, _dirty: true}));
      });
    });
  });

  describe('test changedPos', function() {
    beforeAll(function() {
      engine = new GridStackEngine();
    });
    it('should return true for changed x', function() {
      let widget = { x: 1, y: 2, w: 3, h: 4 };
      expect(engine.changedPosConstrain(widget, {x:2, y:2})).toEqual(true);
    });
    it('should return true for changed y', function() {
      let widget = { x: 1, y: 2, w: 3, h: 4 };
      expect(engine.changedPosConstrain(widget, {x:1, y:1})).toEqual(true);
    });
    it('should return true for changed width', function() {
      let widget = { x: 1, y: 2, w: 3, h: 4 };
      expect(engine.changedPosConstrain(widget, {x:2, y:2, w:4, h:4})).toEqual(true);
    });
    it('should return true for changed height', function() {
      let widget = { x: 1, y: 2, w: 3, h: 4 };
      expect(engine.changedPosConstrain(widget, {x:1, y:2, w:3, h:3})).toEqual(true);
    });
    it('should return false for unchanged position', function() {
      let widget = { x: 1, y: 2, w: 3, h: 4 };
      expect(engine.changedPosConstrain(widget, {x:1, y:2, w:3, h:4})).toEqual(false);
    });
  });

  describe('test locked widget', function() {
    beforeAll(function() {
      engine = new GridStackEngine();
    });
    it('should add widgets around locked one', function() {
      let nodes: GridStackNode[] = [
        {x: 0, y: 1, w: 12, h: 1, locked: true, noMove: true, noResize: true, id: 0},
        {x: 1, y: 0, w: 2, h: 3, id: 1}
      ];
      // add locked item
      engine.addNode(nodes[0])
      expect(findNode(engine, 0)).toEqual(jasmine.objectContaining({x: 0, y: 1, w: 12, h: 1, locked: true}));
      // add item that moves past locked one
      engine.addNode(nodes[1])
      expect(findNode(engine, 0)).toEqual(jasmine.objectContaining({x: 0, y: 1, w: 12, h: 1, locked: true}));
      expect(findNode(engine, 1)).toEqual(jasmine.objectContaining({x: 1, y: 2, h: 3}));
      // locked item can still be moved directly (what user does)
      let node0 = findNode(engine, 0);
      expect(engine.moveNode(node0, {y:6})).toEqual(true);
      expect(findNode(engine, 0)).toEqual(jasmine.objectContaining({x: 0, y: 6, h: 1, locked: true}));
      // but moves regular one past it
      let node1 = findNode(engine, 1);
      expect(engine.moveNode(node1, {x:6, y:6})).toEqual(true);
      expect(node1).toEqual(jasmine.objectContaining({x: 6, y: 7, w: 2, h: 3}));
      // but moves regular one before (gravity ON)
      engine.float = false;
      expect(engine.moveNode(node1, {x:7, y:3})).toEqual(true);
      expect(node1).toEqual(jasmine.objectContaining({x: 7, y: 0, w: 2, h: 3}));
      // but moves regular one before (gravity OFF)
      engine.float = true;
      expect(engine.moveNode(node1, {x:7, y:3})).toEqual(true);
      expect(node1).toEqual(jasmine.objectContaining({x: 7, y: 3, w: 2, h: 3}));
    });
  });
  
  describe('test compact', function() {
    beforeAll(function() {
      engine = new GridStackEngine();
    });
    it('do nothing', function() {
      engine.compact();
    });
  });

});
