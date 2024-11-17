import { GridStackEngine } from'../src/gridstack-engine';
import { GridStackNode } from'../src/types';

describe('gridstack engine:', function() {
 'use strict';
  let e: GridStackEngine;
  let ePriv: any; // cast engine for private vars access
  let findNode = function(id: string) {
    return e.nodes.find(n => n.id === id);
  };

  it('should exist setup function.', function() {
    expect(GridStackEngine).not.toBeNull();
    expect(typeof GridStackEngine).toBe('function');
  });

  describe('test constructor >', function() {
  
    it('should be setup properly', function() {
      ePriv = e = new GridStackEngine();
      expect(e.column).toEqual(12);
      expect(e.float).toEqual(false);
      expect(e.maxRow).toEqual(undefined!);
      expect(e.nodes).toEqual([]);
      expect(e.batchMode).toEqual(undefined!);
      expect(ePriv.onChange).toEqual(undefined);
    });

    it('should set params correctly.', function() {
      let fkt = function() { };
      let arr: any = [1,2,3];
      ePriv = e = new GridStackEngine({column: 1, onChange:fkt, float:true, maxRow:2, nodes:arr});
      expect(e.column).toEqual(1);
      expect(e.float).toBe(true);
      expect(e.maxRow).toEqual(2);
      expect(e.nodes).toEqual(arr);
      expect(e.batchMode).toEqual(undefined);
      expect(ePriv.onChange).toEqual(fkt);
    });
  });

  describe('batch update', function() {

    it('should set float and batchMode when calling batchUpdate.', function() {
      ePriv = e = new GridStackEngine({float: true});
      e.batchUpdate();
      expect(e.float).toBe(true);
      expect(e.batchMode).toBeTrue();
    });
  });  

  describe('test prepareNode >', function() {

    beforeAll(function() {
      ePriv = e = new GridStackEngine();
    });
    it('should prepare a node', function() {
      expect(e.prepareNode({}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
      expect(e.prepareNode({x: 10}, false)).toEqual(jasmine.objectContaining({x: 10, y: 0, h: 1}));
      expect(e.prepareNode({x: -10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
      expect(e.prepareNode({y: 10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 10, h: 1}));
      expect(e.prepareNode({y: -10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
      expect(e.prepareNode({w: 3}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, w: 3, h: 1}));
      expect(e.prepareNode({w: 100}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, w: 12, h: 1}));
      expect(e.prepareNode({w: 0}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
      expect(e.prepareNode({w: -190}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
      expect(e.prepareNode({h: 3}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 3}));
      expect(e.prepareNode({h: 0}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
      expect(e.prepareNode({h: -10}, false)).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
      expect(e.prepareNode({x: 4, w: 10}, false)).toEqual(jasmine.objectContaining({x: 2, y: 0, w: 10, h: 1}));
      expect(e.prepareNode({x: 4, w: 10}, true)).toEqual(jasmine.objectContaining({x: 4, y: 0, w: 8, h: 1}));
    });
  });

  describe('sorting of nodes >', function() {
    beforeAll(function() {
      ePriv = e = new GridStackEngine();
      e.nodes = [{x: 7, y: 0}, {x: 4, y: 4}, {x: 9, y: 0}, {x: 0, y: 1}];
    });

    it('should sort ascending with 12 columns.', function() {
      e.sortNodes(1);
      expect(e.nodes).toEqual([{x: 7, y: 0}, {x: 9, y: 0}, {x: 0, y: 1}, {x: 4, y: 4}]);
    });
  
    it('should sort descending with 12 columns.', function() {
      e.sortNodes(-1);
      expect(e.nodes).toEqual([{x: 4, y: 4}, {x: 0, y: 1}, {x: 9, y: 0}, {x: 7, y: 0}]);
    });
  
    it('should sort ascending without columns.', function() {
      ePriv.column = undefined;
      e.sortNodes(1);
      expect(e.nodes).toEqual([{x: 7, y: 0}, {x: 9, y: 0}, {x: 0, y: 1}, {x: 4, y: 4}]);
    });
  
    it('should sort descending without columns.', function() {
      ePriv.column = undefined;
      e.sortNodes(-1);
      expect(e.nodes).toEqual([{x: 4, y: 4}, {x: 0, y: 1}, {x: 9, y: 0}, {x: 7, y: 0}]);
    });
  
  });
  
  describe('test isAreaEmpty >', function() {

    beforeAll(function() {
      ePriv = e = new GridStackEngine({float:true});
      e.nodes = [
        e.prepareNode({x: 3, y: 2, w: 3, h: 2})
      ];
    });

    it('should be true', function() {
      expect(e.isAreaEmpty(0, 0, 3, 2)).toEqual(true);
      expect(e.isAreaEmpty(3, 4, 3, 2)).toEqual(true);
    });

    it('should be false', function() {
      expect(e.isAreaEmpty(1, 1, 3, 2)).toEqual(false);
      expect(e.isAreaEmpty(2, 3, 3, 2)).toEqual(false);
    });
  });

  describe('test cleanNodes/getDirtyNodes >', function() {

    beforeAll(function() {
      ePriv = e = new GridStackEngine({float:true});
      e.nodes = [
        e.prepareNode({x: 0, y: 0, id: '1', _dirty: true}),
        e.prepareNode({x: 3, y: 2, w: 3, h: 2, id: '2', _dirty: true}),
        e.prepareNode({x: 3, y: 7, w: 3, h: 2, id: '3'})
      ];
    });

    beforeEach(function() {
      delete ePriv.batchMode;
    });

    it('should return all dirty nodes', function() {
      let nodes = e.getDirtyNodes();
      expect(nodes.length).toEqual(2);
      expect(nodes[0].id).toEqual('1');
      expect(nodes[1].id).toEqual('2');
    });

    it('should\'n clean nodes if batchMode true', function() {
      e.batchMode = true;
      e.cleanNodes();
      expect(e.getDirtyNodes().length).toBeGreaterThan(0);
    });

    it('should clean all dirty nodes', function() {
      e.cleanNodes();
      expect(e.getDirtyNodes().length).toEqual(0);
    });
  });

  describe('test batchUpdate/commit >', function() {
    beforeAll(function() {
      ePriv = e = new GridStackEngine();
    });

    it('should work on not float grids', function() {
      expect(e.float).toEqual(false);
      e.batchUpdate();
      e.batchUpdate(); // double for code coverage
      expect(e.batchMode).toBeTrue();
      expect(e.float).toEqual(true);
      e.batchUpdate(false);
      e.batchUpdate(false);
      expect(e.batchMode).not.toBeTrue();
      expect(e.float).not.toBeTrue;
    });

    it('should work on float grids', function() {
      e.float = true;
      e.batchUpdate();
      expect(e.batchMode).toBeTrue();
      expect(e.float).toEqual(true);
      e.batchUpdate(false);
      expect(e.batchMode).not.toBeTrue();
      expect(e.float).toEqual(true);
    });
  });

  describe('test batchUpdate/commit >', function() {

    beforeAll(function() {
      ePriv = e = new GridStackEngine({float:true});
    });

    it('should work on float grids', function() {
      expect(e.float).toEqual(true);
      e.batchUpdate();
      expect(e.batchMode).toBeTrue();
      expect(e.float).toEqual(true);
      e.batchUpdate(false);
      expect(e.batchMode).not.toBeTrue();
      expect(e.float).toEqual(true);
    });
  });

  describe('test _notify >', function() {
    let spy;

    beforeEach(function() {
      spy = {
        callback: function() {}
      };
      spyOn(spy,'callback');
      ePriv = e = new GridStackEngine({float:true, onChange: spy.callback});
      e.nodes = [
        e.prepareNode({x: 0, y: 0, id: '1', _dirty: true}),
        e.prepareNode({x: 3, y: 2, w: 3, h: 2, id: '2', _dirty: true}),
        e.prepareNode({x: 3, y: 7, w: 3, h: 2, id: '3'})
      ];
    });

    it('should\'n be called if batchMode true', function() {
      e.batchMode = true;
      ePriv._notify();
      expect(spy.callback).not.toHaveBeenCalled();
    });

    it('should by called with dirty nodes', function() {
      ePriv._notify();
      expect(spy.callback).toHaveBeenCalledWith([e.nodes[0], e.nodes[1]]);
    });

    it('should by called with extra passed node to be removed', function() {
      let n1 = {id: -1};
      ePriv._notify([n1]);
      expect(spy.callback).toHaveBeenCalledWith([n1, e.nodes[0], e.nodes[1]]);
    });
  });

  describe('test _packNodes >', function() {
    describe('using float:false mode >', function() {
      beforeEach(function() {
        ePriv = e = new GridStackEngine({float:false});
      });

      it('shouldn\'t pack one node with y coord eq 0', function() {
        e.nodes = [
          e.prepareNode({x: 0, y: 0, w:1, h:1, id: '1'}),
        ];
        ePriv._packNodes();
        expect(findNode('1')).toEqual(jasmine.objectContaining({x: 0, y: 0, h: 1}));
        expect(findNode('1')!._dirty).toBeFalsy();
      });

      it('should pack one node correctly', function() {
        e.nodes = [
          e.prepareNode({x: 0, y: 1, w:1, h:1, id: '1'}),
        ];
        ePriv._packNodes();
        expect(findNode('1')).toEqual(jasmine.objectContaining({x: 0, y: 0, _dirty: true}));
      });

      it('should pack nodes correctly', function() {
        e.nodes = [
          e.prepareNode({x: 0, y: 1, w:1, h:1, id: '1'}),
          e.prepareNode({x: 0, y: 5, w:1, h:1, id: '2'}),
        ];
        ePriv._packNodes();
        expect(findNode('1')).toEqual(jasmine.objectContaining({x: 0, y: 0, _dirty: true}));
        expect(findNode('2')).toEqual(jasmine.objectContaining({x: 0, y: 1, _dirty: true}));
      });
  
      it('should pack reverse nodes correctly', function() {
        e.nodes = [
          e.prepareNode({x: 0, y: 5, w:1, h:1, id: '1'}),
          e.prepareNode({x: 0, y: 1, w:1, h:1, id: '2'}),
        ];
        ePriv._packNodes();
        expect(findNode('2')).toEqual(jasmine.objectContaining({x: 0, y: 0, _dirty: true}));
        expect(findNode('1')).toEqual(jasmine.objectContaining({x: 0, y: 1, _dirty: true}));
      });
  
      it('should respect locked nodes', function() {
        e.nodes = [
          e.prepareNode({x: 0, y: 1, w:1, h:1, id: '1', locked: true}),
          e.prepareNode({x: 0, y: 5, w:1, h:1, id: '2'}),
        ];
        ePriv._packNodes();
        expect(findNode('1')).toEqual(jasmine.objectContaining({x: 0, y: 1, h: 1}));
        expect(findNode('1')!._dirty).toBeFalsy();
        expect(findNode('2')).toEqual(jasmine.objectContaining({x: 0, y: 2, _dirty: true}));
      });
    });
  });

  describe('test changedPos >', function() {
    beforeAll(function() {
      ePriv = e = new GridStackEngine();
    });
    it('should return true for changed x', function() {
      let widget = { x: 1, y: 2, w: 3, h: 4 };
      expect(e.changedPosConstrain(widget, {x:2, y:2})).toEqual(true);
    });
    it('should return true for changed y', function() {
      let widget = { x: 1, y: 2, w: 3, h: 4 };
      expect(e.changedPosConstrain(widget, {x:1, y:1})).toEqual(true);
    });
    it('should return true for changed width', function() {
      let widget = { x: 1, y: 2, w: 3, h: 4 };
      expect(e.changedPosConstrain(widget, {x:2, y:2, w:4, h:4})).toEqual(true);
    });
    it('should return true for changed height', function() {
      let widget = { x: 1, y: 2, w: 3, h: 4 };
      expect(e.changedPosConstrain(widget, {x:1, y:2, w:3, h:3})).toEqual(true);
    });
    it('should return false for unchanged position', function() {
      let widget = { x: 1, y: 2, w: 3, h: 4 };
      expect(e.changedPosConstrain(widget, {x:1, y:2, w:3, h:4})).toEqual(false);
    });
  });

  describe('test locked widget >', function() {
    beforeAll(function() {
      ePriv = e = new GridStackEngine();
    });
    it('should add widgets around locked one', function() {
      let nodes: GridStackNode[] = [
        {x: 0, y: 1, w: 12, h: 1, locked: true, noMove: true, noResize: true, id: '0'},
        {x: 1, y: 0, w: 2, h: 3, id: '1'}
      ];
      // add locked item
      e.addNode(nodes[0])
      expect(findNode('0')).toEqual(jasmine.objectContaining({x: 0, y: 1, w: 12, h: 1, locked: true}));
      // add item that moves past locked one
      e.addNode(nodes[1])
      expect(findNode('0')).toEqual(jasmine.objectContaining({x: 0, y: 1, w: 12, h: 1, locked: true}));
      expect(findNode('1')).toEqual(jasmine.objectContaining({x: 1, y: 2, h: 3}));
      // locked item can still be moved directly (what user does)
      let node0 = findNode('0');
      expect(e.moveNode(node0!, {y:6})).toEqual(true);
      expect(findNode('0')).toEqual(jasmine.objectContaining({x: 0, y: 6, h: 1, locked: true}));
      // but moves regular one past it
      let node1 = findNode('1');
      expect(e.moveNode(node1!, {x:6, y:6})).toEqual(true);
      expect(node1).toEqual(jasmine.objectContaining({x: 6, y: 7, w: 2, h: 3}));
      // but moves regular one before (gravity ON)
      e.float = false;
      expect(e.moveNode(node1!, {x:7, y:3})).toEqual(true);
      expect(node1).toEqual(jasmine.objectContaining({x: 7, y: 0, w: 2, h: 3}));
      // but moves regular one before (gravity OFF)
      e.float = true;
      expect(e.moveNode(node1!, {x:7, y:3})).toEqual(true);
      expect(node1).toEqual(jasmine.objectContaining({x: 7, y: 3, w: 2, h: 3}));
    });
  });
  
  describe('test columnChanged >', function() {
    beforeAll(function() {
    });
    it('12 to 1 and back', function() {
      ePriv = e = new GridStackEngine({ column: 12 });
      // Add two side-by-side components 6+6 = 12 columns
      const left = e.addNode({ x: 0, y: 0, w: 6, h: 1, id: 'left' });
      const right = e.addNode({ x: 6, y: 0, w: 6, h: 1, id: 'right' });
      expect(left).toEqual(jasmine.objectContaining({x: 0, y: 0, w: 6, h: 1}));
      expect(right).toEqual(jasmine.objectContaining({x: 6, y: 0, w: 6, h: 1}));
      // Resize to 1 column
      e.column = 1;
      e.columnChanged(12, 1);
      expect(left).toEqual(jasmine.objectContaining({x: 0, y: 0, w: 1, h: 1}));
      expect(right).toEqual(jasmine.objectContaining({x: 0, y: 1, w: 1, h: 1}));
      // Resize back to 12 column
      e.column = 12;
      e.columnChanged(1, 12);
      expect(left).toEqual(jasmine.objectContaining({x: 0, y: 0, w: 6, h: 1}));
      expect(right).toEqual(jasmine.objectContaining({x: 6, y: 0, w: 6, h: 1}));
    });
    it('24 column to 1 and back', function() {
      ePriv = e = new GridStackEngine({ column: 24 });
      // Add two side-by-side components 12+12 = 24 columns
      const left = e.addNode({ x: 0, y: 0, w: 12, h: 1, id: 'left' });
      const right = e.addNode({ x: 12, y: 0, w: 12, h: 1, id: 'right' });
      expect(left).toEqual(jasmine.objectContaining({x: 0, y: 0, w: 12, h: 1}));
      expect(right).toEqual(jasmine.objectContaining({x: 12, y: 0, w: 12, h: 1}));
      // Resize to 1 column
      e.column = 1;
      e.columnChanged(24, 1);
      expect(left).toEqual(jasmine.objectContaining({x: 0, y: 0, w: 1, h: 1}));
      expect(right).toEqual(jasmine.objectContaining({x: 0, y: 1, w: 1, h: 1}));
      // Resize back to 24 column
      e.column = 24;
      e.columnChanged(1, 24);
      expect(left).toEqual(jasmine.objectContaining({x: 0, y: 0, w: 12, h: 1}));
      expect(right).toEqual(jasmine.objectContaining({x: 12, y: 0, w: 12, h: 1}));
    });
  });

  describe('test compact >', function() {
    beforeAll(function() {
      ePriv = e = new GridStackEngine();
    });
    it('do nothing', function() {
      e.compact();
    });
  });

});
