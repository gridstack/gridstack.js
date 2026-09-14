import { GridStackEngine } from'../src/gridstack-engine';
import { GridStackNode } from'../src/types';

describe('gridstack engine:', () => {
 'use strict';
  let e: GridStackEngine;
  let ePriv: any; // cast engine for private vars access
  let findNode = function(id: string) {
    return e.nodes.find(n => n.id === id);
  };
  /** returns the list of items that overlap each other - should always be empty */
  let overlaps = function(e: GridStackEngine): string[] {
    const bad: string[] = [];
    e.nodes.forEach((a, i) => e.nodes.slice(i + 1).forEach(b => {
      if (a.x! < b.x! + b.w! && b.x! < a.x! + a.w! && a.y! < b.y! + b.h! && b.y! < a.y! + a.h!) bad.push(`${a.id}x${b.id}`);
    }));
    return bad;
  };

  it('should exist setup function.', () => {
    expect(GridStackEngine).not.toBeNull();
    expect(typeof GridStackEngine).toBe('function');
  });

  describe('test constructor >', () => {
  
    it('should be setup properly', () => {
      ePriv = e = new GridStackEngine();
      expect(e.column).toEqual(12);
      expect(e.mode).toEqual('top');
      expect(e.maxRow).toEqual(0);
      expect(e.nodes).toEqual([]);
      expect(e.batchMode).toEqual(undefined!);
      expect(typeof ePriv.onChange).toEqual('function'); // defaults to a no-op
    });

    it('should set params correctly.', () => {
      let fkt = () => { };
      let arr: any = [1,2,3];
      ePriv = e = new GridStackEngine({column: 1, onChange:fkt, mode:'float', maxRow:2, nodes:arr});
      expect(e.column).toEqual(1);
      expect(e.mode).toBe('float');
      expect(e.maxRow).toEqual(2);
      expect(e.nodes).toEqual(arr);
      expect(e.batchMode).toEqual(undefined);
      expect(ePriv.onChange).toEqual(fkt);
    });
  });

  describe('batch update', () => {

    it('should set mode and batchMode when calling batchUpdate.', () => {
      ePriv = e = new GridStackEngine({mode: 'float'});
      e.batchUpdate();
      expect(e.mode).toBe('float');
      expect(e.batchMode).toBe(true);
    });
  });  

  describe('test prepareNode >', () => {

    beforeAll(() => {
      ePriv = e = new GridStackEngine();
    });
    it('should prepare a node', () => {
      expect(e.prepareNode({}, false)).toEqual(expect.objectContaining({x: 0, y: 0, h: 1}));
      expect(e.prepareNode({x: 10}, false)).toEqual(expect.objectContaining({x: 10, y: 0, h: 1}));
      expect(e.prepareNode({x: -10}, false)).toEqual(expect.objectContaining({x: 0, y: 0, h: 1}));
      expect(e.prepareNode({y: 10}, false)).toEqual(expect.objectContaining({x: 0, y: 10, h: 1}));
      expect(e.prepareNode({y: -10}, false)).toEqual(expect.objectContaining({x: 0, y: 0, h: 1}));
      expect(e.prepareNode({w: 3}, false)).toEqual(expect.objectContaining({x: 0, y: 0, w: 3, h: 1}));
      expect(e.prepareNode({w: 100}, false)).toEqual(expect.objectContaining({x: 0, y: 0, w: 12, h: 1}));
      expect(e.prepareNode({w: 0}, false)).toEqual(expect.objectContaining({x: 0, y: 0, h: 1}));
      expect(e.prepareNode({w: -190}, false)).toEqual(expect.objectContaining({x: 0, y: 0, h: 1}));
      expect(e.prepareNode({h: 3}, false)).toEqual(expect.objectContaining({x: 0, y: 0, h: 3}));
      expect(e.prepareNode({h: 0}, false)).toEqual(expect.objectContaining({x: 0, y: 0, h: 1}));
      expect(e.prepareNode({h: -10}, false)).toEqual(expect.objectContaining({x: 0, y: 0, h: 1}));
      expect(e.prepareNode({x: 4, w: 10}, false)).toEqual(expect.objectContaining({x: 2, y: 0, w: 10, h: 1}));
      expect(e.prepareNode({x: 4, w: 10}, true)).toEqual(expect.objectContaining({x: 4, y: 0, w: 8, h: 1}));
    });
  });

  describe('sorting of nodes >', () => {
    beforeAll(() => {
      ePriv = e = new GridStackEngine();
      e.nodes = [{x: 7, y: 0}, {x: 4, y: 4}, {x: 9, y: 0}, {x: 0, y: 1}];
    });

    it('should sort ascending with 12 columns.', () => {
      e.sortNodes(1);
      expect(e.nodes).toEqual([{x: 7, y: 0}, {x: 9, y: 0}, {x: 0, y: 1}, {x: 4, y: 4}]);
    });
  
    it('should sort descending with 12 columns.', () => {
      e.sortNodes(-1);
      expect(e.nodes).toEqual([{x: 4, y: 4}, {x: 0, y: 1}, {x: 9, y: 0}, {x: 7, y: 0}]);
    });
  
    it('should sort ascending without columns.', () => {
      ePriv.column = undefined;
      e.sortNodes(1);
      expect(e.nodes).toEqual([{x: 7, y: 0}, {x: 9, y: 0}, {x: 0, y: 1}, {x: 4, y: 4}]);
    });
  
    it('should sort descending without columns.', () => {
      ePriv.column = undefined;
      e.sortNodes(-1);
      expect(e.nodes).toEqual([{x: 4, y: 4}, {x: 0, y: 1}, {x: 9, y: 0}, {x: 7, y: 0}]);
    });
  
  });
  
  describe('test isAreaEmpty >', () => {

    beforeAll(() => {
      ePriv = e = new GridStackEngine({mode:'float'});
      e.nodes = [
        e.prepareNode({x: 3, y: 2, w: 3, h: 2})
      ];
    });

    it('should be true', () => {
      expect(e.isAreaEmpty(0, 0, 3, 2)).toEqual(true);
      expect(e.isAreaEmpty(3, 4, 3, 2)).toEqual(true);
    });

    it('should be false', () => {
      expect(e.isAreaEmpty(1, 1, 3, 2)).toEqual(false);
      expect(e.isAreaEmpty(2, 3, 3, 2)).toEqual(false);
    });
  });

  describe('test cleanNodes/getDirtyNodes >', () => {

    beforeAll(() => {
      ePriv = e = new GridStackEngine({mode:'float'});
      e.nodes = [
        e.prepareNode({x: 0, y: 0, id: '1', _dirty: true}),
        e.prepareNode({x: 3, y: 2, w: 3, h: 2, id: '2', _dirty: true}),
        e.prepareNode({x: 3, y: 7, w: 3, h: 2, id: '3'})
      ];
    });

    beforeEach(() => {
      delete ePriv.batchMode;
    });

    it('should return all dirty nodes', () => {
      let nodes = e.getDirtyNodes();
      expect(nodes.length).toEqual(2);
      expect(nodes[0].id).toEqual('1');
      expect(nodes[1].id).toEqual('2');
    });

    it('should\'n clean nodes if batchMode true', () => {
      e.batchMode = true;
      e.cleanNodes();
      expect(e.getDirtyNodes().length).toBeGreaterThan(0);
    });

    it('should clean all dirty nodes', () => {
      e.cleanNodes();
      expect(e.getDirtyNodes().length).toEqual(0);
    });
  });

  describe('test batchUpdate/commit >', () => {
    beforeAll(() => {
      ePriv = e = new GridStackEngine();
    });

    it('should work on top gravity grids', () => {
      expect(e.mode).toEqual('top');
      e.batchUpdate();
      e.batchUpdate(); // double for code coverage
      expect(e.batchMode).toBe(true);
      expect(e.mode).toEqual('float');
      e.batchUpdate(false);
      e.batchUpdate(false);
      expect(e.batchMode).not.toBe(true);
      expect(e.mode).not.toBe('float');
    });

    it('should work on float grids', () => {
      e.mode = 'float';
      e.batchUpdate();
      expect(e.batchMode).toBe(true);
      expect(e.mode).toEqual('float');
      e.batchUpdate(false);
      expect(e.batchMode).not.toBe(true);
      expect(e.mode).toEqual('float');
    });
  });

  describe('test batchUpdate/commit >', () => {

    beforeAll(() => {
      ePriv = e = new GridStackEngine({mode:'float'});
    });

    it('should work on float grids', () => {
      expect(e.mode).toEqual('float');
      e.batchUpdate();
      expect(e.batchMode).toBe(true);
      expect(e.mode).toEqual('float');
      e.batchUpdate(false);
      expect(e.batchMode).not.toBe(true);
      expect(e.mode).toEqual('float');
    });
  });

  describe('test _notify >', () => {
    let spy;

    beforeEach(() => {
      spy = {
        callback: () => {}
      };
      vi.spyOn(spy,'callback');
      ePriv = e = new GridStackEngine({mode:'float', onChange: spy.callback});
      e.nodes = [
        e.prepareNode({x: 0, y: 0, id: '1', _dirty: true}),
        e.prepareNode({x: 3, y: 2, w: 3, h: 2, id: '2', _dirty: true}),
        e.prepareNode({x: 3, y: 7, w: 3, h: 2, id: '3'})
      ];
    });

    it('should\'n be called if batchMode true', () => {
      e.batchMode = true;
      ePriv._notify();
      expect(spy.callback).not.toHaveBeenCalled();
    });

    it('should by called with dirty nodes', () => {
      ePriv._notify();
      expect(spy.callback).toHaveBeenCalledWith([e.nodes[0], e.nodes[1]]);
    });

    it('should by called with extra passed node to be removed', () => {
      let n1 = {id: -1};
      ePriv._notify([n1]);
      expect(spy.callback).toHaveBeenCalledWith([n1, e.nodes[0], e.nodes[1]]);
    });
  });

  describe('test _packNodes >', () => {
    describe('using mode: top >', () => {
      beforeEach(() => {
        ePriv = e = new GridStackEngine({mode:'top'});
      });

      it('shouldn\'t pack one node with y coord eq 0', () => {
        e.nodes = [
          e.prepareNode({x: 0, y: 0, w:1, h:1, id: '1'}),
        ];
        ePriv._packNodes();
        expect(findNode('1')).toEqual(expect.objectContaining({x: 0, y: 0, h: 1}));
        expect(findNode('1')!._dirty).toBeFalsy();
      });

      it('should pack one node correctly', () => {
        e.nodes = [
          e.prepareNode({x: 0, y: 1, w:1, h:1, id: '1'}),
        ];
        ePriv._packNodes();
        expect(findNode('1')).toEqual(expect.objectContaining({x: 0, y: 0, _dirty: true}));
      });

      it('should pack nodes correctly', () => {
        e.nodes = [
          e.prepareNode({x: 0, y: 1, w:1, h:1, id: '1'}),
          e.prepareNode({x: 0, y: 5, w:1, h:1, id: '2'}),
        ];
        ePriv._packNodes();
        expect(findNode('1')).toEqual(expect.objectContaining({x: 0, y: 0, _dirty: true}));
        expect(findNode('2')).toEqual(expect.objectContaining({x: 0, y: 1, _dirty: true}));
      });
  
      it('should pack reverse nodes correctly', () => {
        e.nodes = [
          e.prepareNode({x: 0, y: 5, w:1, h:1, id: '1'}),
          e.prepareNode({x: 0, y: 1, w:1, h:1, id: '2'}),
        ];
        ePriv._packNodes();
        expect(findNode('2')).toEqual(expect.objectContaining({x: 0, y: 0, _dirty: true}));
        expect(findNode('1')).toEqual(expect.objectContaining({x: 0, y: 1, _dirty: true}));
      });
  
      it('should respect locked nodes', () => {
        e.nodes = [
          e.prepareNode({x: 0, y: 1, w:1, h:1, id: '1', locked: true}),
          e.prepareNode({x: 0, y: 5, w:1, h:1, id: '2'}),
        ];
        ePriv._packNodes();
        expect(findNode('1')).toEqual(expect.objectContaining({x: 0, y: 1, h: 1}));
        expect(findNode('1')!._dirty).toBeFalsy();
        expect(findNode('2')).toEqual(expect.objectContaining({x: 0, y: 2, _dirty: true}));
      });
    });
  });

  describe('test changedPos >', () => {
    beforeAll(() => {
      ePriv = e = new GridStackEngine();
    });
    it('should return true for changed x', () => {
      let widget = { x: 1, y: 2, w: 3, h: 4 };
      expect(e.changedPosConstrain(widget, {x:2, y:2})).toEqual(true);
    });
    it('should return true for changed y', () => {
      let widget = { x: 1, y: 2, w: 3, h: 4 };
      expect(e.changedPosConstrain(widget, {x:1, y:1})).toEqual(true);
    });
    it('should return true for changed width', () => {
      let widget = { x: 1, y: 2, w: 3, h: 4 };
      expect(e.changedPosConstrain(widget, {x:2, y:2, w:4, h:4})).toEqual(true);
    });
    it('should return true for changed height', () => {
      let widget = { x: 1, y: 2, w: 3, h: 4 };
      expect(e.changedPosConstrain(widget, {x:1, y:2, w:3, h:3})).toEqual(true);
    });
    it('should return false for unchanged position', () => {
      let widget = { x: 1, y: 2, w: 3, h: 4 };
      expect(e.changedPosConstrain(widget, {x:1, y:2, w:3, h:4})).toEqual(false);
    });
  });

  describe('test locked widget >', () => {
    beforeAll(() => {
      ePriv = e = new GridStackEngine();
    });
    it('should add widgets around locked one', () => {
      let nodes: GridStackNode[] = [
        {x: 0, y: 1, w: 12, h: 1, locked: true, noMove: true, noResize: true, id: '0'},
        {x: 1, y: 0, w: 2, h: 3, id: '1'}
      ];
      // add locked item
      e.addNode(nodes[0])
      expect(findNode('0')).toEqual(expect.objectContaining({x: 0, y: 1, w: 12, h: 1, locked: true}));
      // add item that moves past locked one
      e.addNode(nodes[1])
      expect(findNode('0')).toEqual(expect.objectContaining({x: 0, y: 1, w: 12, h: 1, locked: true}));
      expect(findNode('1')).toEqual(expect.objectContaining({x: 1, y: 2, h: 3}));
      // locked item can still be moved directly (what user does)
      let node0 = findNode('0');
      expect(e.moveNode(node0!, {y:6})).toEqual(true);
      expect(findNode('0')).toEqual(expect.objectContaining({x: 0, y: 6, h: 1, locked: true}));
      // but moves regular one past it
      let node1 = findNode('1');
      expect(e.moveNode(node1!, {x:6, y:6})).toEqual(true);
      expect(node1).toEqual(expect.objectContaining({x: 6, y: 7, w: 2, h: 3}));
      // but moves regular one before (gravity ON)
      e.mode = 'top';
      expect(e.moveNode(node1!, {x:7, y:3})).toEqual(true);
      expect(node1).toEqual(expect.objectContaining({x: 7, y: 0, w: 2, h: 3}));
      // but moves regular one before (gravity OFF)
      e.mode = 'float';
      expect(e.moveNode(node1!, {x:7, y:3})).toEqual(true);
      expect(node1).toEqual(expect.objectContaining({x: 7, y: 3, w: 2, h: 3}));
    });
  });
  
  describe('test columnChanged >', () => {
    beforeAll(() => {
    });
    it('12 to 1 and back', () => {
      ePriv = e = new GridStackEngine({ column: 12 });
      // Add two side-by-side components 6+6 = 12 columns
      const left = e.addNode({ x: 0, y: 0, w: 6, h: 1, id: 'left' });
      const right = e.addNode({ x: 6, y: 0, w: 6, h: 1, id: 'right' });
      expect(left).toEqual(expect.objectContaining({x: 0, y: 0, w: 6, h: 1}));
      expect(right).toEqual(expect.objectContaining({x: 6, y: 0, w: 6, h: 1}));
      // Resize to 1 column
      e.column = 1;
      e.columnChanged(12, 1);
      expect(left).toEqual(expect.objectContaining({x: 0, y: 0, w: 1, h: 1}));
      expect(right).toEqual(expect.objectContaining({x: 0, y: 1, w: 1, h: 1}));
      // Resize back to 12 column
      e.column = 12;
      e.columnChanged(1, 12);
      expect(left).toEqual(expect.objectContaining({x: 0, y: 0, w: 6, h: 1}));
      expect(right).toEqual(expect.objectContaining({x: 6, y: 0, w: 6, h: 1}));
    });
    it('24 column to 1 and back', () => {
      ePriv = e = new GridStackEngine({ column: 24 });
      // Add two side-by-side components 12+12 = 24 columns
      const left = e.addNode({ x: 0, y: 0, w: 12, h: 1, id: 'left' });
      const right = e.addNode({ x: 12, y: 0, w: 12, h: 1, id: 'right' });
      expect(left).toEqual(expect.objectContaining({x: 0, y: 0, w: 12, h: 1}));
      expect(right).toEqual(expect.objectContaining({x: 12, y: 0, w: 12, h: 1}));
      // Resize to 1 column
      e.column = 1;
      e.columnChanged(24, 1);
      expect(left).toEqual(expect.objectContaining({x: 0, y: 0, w: 1, h: 1}));
      expect(right).toEqual(expect.objectContaining({x: 0, y: 1, w: 1, h: 1}));
      // Resize back to 24 column
      e.column = 24;
      e.columnChanged(1, 24);
      expect(left).toEqual(expect.objectContaining({x: 0, y: 0, w: 12, h: 1}));
      expect(right).toEqual(expect.objectContaining({x: 12, y: 0, w: 12, h: 1}));
    });
  });

  describe('test compact >', () => {
    beforeAll(() => {
      ePriv = e = new GridStackEngine();
    });
    it('do nothing', () => {
      e.compact();
    });
  });

  describe('test mode >', () => {
    it('list mode continuously reflows on moveNode, preserving order', () => {
      ePriv = e = new GridStackEngine({mode: 'list', column: 4});
      e.nodes = [
        e.prepareNode({x: 0, y: 0, w: 1, h: 1, id: '1'}),
        e.prepareNode({x: 1, y: 0, w: 1, h: 1, id: '2'}),
        e.prepareNode({x: 2, y: 0, w: 1, h: 1, id: '3'}),
        e.prepareNode({x: 3, y: 0, w: 1, h: 1, id: '4'}),
      ];
      // drag first item to the very end -> everyone else shifts back by one, keeping their relative order
      e.moveNode(findNode('1')!, {x: 3, y: 3});
      const sorted = e.nodes.slice().sort((a, b) => (a.y! - b.y!) || (a.x! - b.x!));
      expect(sorted.map(n => n.id)).toEqual(['2', '3', '4', '1']);
      // no gaps: positions are exactly sequential row-major
      sorted.forEach((n, i) => {
        expect(n.x).toEqual(i % 4);
        expect(n.y).toEqual(Math.floor(i / 4));
      });
    });

    it('list mode reflows (not push-down) when addNode lands on an occupied cell', () => {
      ePriv = e = new GridStackEngine({mode: 'list', column: 4});
      e.nodes = [
        e.prepareNode({x: 0, y: 0, w: 1, h: 1, id: '1'}),
        e.prepareNode({x: 1, y: 0, w: 1, h: 1, id: '2'}),
      ];
      e.addNode(e.prepareNode({x: 0, y: 0, w: 1, h: 1, id: 'new'}));
      expect(findNode('new')).toEqual(expect.objectContaining({x: 0, y: 0}));
      expect(findNode('1')).toEqual(expect.objectContaining({x: 1, y: 0}));
      expect(findNode('2')).toEqual(expect.objectContaining({x: 2, y: 0}));
    });

    it('compact mode allows a smaller item to reuse an earlier gap (reorder allowed)', () => {
      ePriv = e = new GridStackEngine({mode: 'compact', column: 4});
      e.nodes = [
        e.prepareNode({x: 1, y: 0, w: 2, h: 1, id: 'big'}),
        e.prepareNode({x: 3, y: 0, w: 1, h: 1, id: 'small'}),
      ];
      // drag small ahead of big -> compact mode lets it tuck into the earlier gap, reordering
      e.moveNode(findNode('small')!, {x: 0, y: 0});
      expect(findNode('small')).toEqual(expect.objectContaining({x: 0, y: 0}));
      expect(findNode('big')).toEqual(expect.objectContaining({x: 1, y: 0}));
    });

    it('switching mode at runtime triggers an immediate re-layout, except when entering float', () => {
      ePriv = e = new GridStackEngine({mode: 'top'});
      e.nodes = [
        e.prepareNode({x: 0, y: 3, w: 1, h: 1, id: '1'}),
      ];
      e.mode = 'float';
      expect(findNode('1')).toEqual(expect.objectContaining({x: 0, y: 3})); // entering float leaves it in place
      findNode('1')!.y = 3; // simulate a direct move while floating (no auto-pack)
      e.mode = 'compact';
      expect(findNode('1')).toEqual(expect.objectContaining({x: 0, y: 0})); // leaving float re-flows immediately
    });

    it('dropping on an item takes its place, dragging up or down', () => {
      // 12 columns, w:2 items -> 6 per row, like the list.html demo
      const load = () => {
        ePriv = e = new GridStackEngine({mode: 'list', column: 12});
        for (let i = 1; i <= 20; i++) e.addNode({w: 2, h: 1, id: String(i), autoPosition: true});
      };
      const order = () => e.nodes.slice().sort((a, b) => (a.y! - b.y!) || (a.x! - b.x!)).map(n => n.id);
      const cellOf = (id: string) => ({x: findNode(id)!.x!, y: findNode(id)!.y!});

      // drag 7 UP onto 1 -> takes the 1st spot, everyone else shifts back one
      load();
      expect(order().slice(0, 8)).toEqual(['1','2','3','4','5','6','7','8']);
      const up = findNode('7')!;
      up._moving = true;
      e.moveNode(up, cellOf('1'));
      expect(order().slice(0, 8)).toEqual(['7','1','2','3','4','5','6','8']);
      expect(overlaps(e)).toEqual([]);
      // ...and back DOWN onto 1 (now 2nd) -> takes the 2nd spot again
      e.moveNode(up, cellOf('1'));
      expect(order().slice(0, 8)).toEqual(['1','7','2','3','4','5','6','8']);

      // drag 1 DOWN onto 7 -> lands on the 7th spot (not the 6th: leaving our spot shifts everyone up one)
      load();
      const down = findNode('1')!;
      down._moving = true;
      e.moveNode(down, cellOf('7'));
      expect(order().slice(0, 8)).toEqual(['2','3','4','5','6','7','1','8']);
      expect(overlaps(e)).toEqual([]);
    });

    it('list keeps the load order (no back-filling), compact re-uses the gap', () => {
      const items = [[4,1],[2,1],[2,2],[4,2],[2,1],[6,1],[2,1],[2,1],[4,1],[2,2],[2,1],[4,1]];
      const load = (mode: 'list' | 'compact') => {
        ePriv = e = new GridStackEngine({mode, column: 12});
        e.batchUpdate(); // load() adds everything in one batch
        items.forEach(([w, h], i) => e.addNode({w, h, id: String(i + 1), autoPosition: true}));
        e.batchUpdate(false);
        return e.nodes.slice().sort((a, b) => (a.y! - b.y!) || (a.x! - b.x!)).map(n => n.id);
      };
      // '6' is w:6 and has to wrap to the next row: 'list' keeps it in order (leaving a gap)...
      expect(load('list')).toEqual(['1','2','3','4','5','6','7','8','9','10','11','12']);
      // ...while 'compact' lets the smaller '7' and '8' fill that gap ahead of it
      expect(load('compact')).toEqual(['1','2','3','4','5','7','8','6','9','10','11','12']);
    });

    it('locked items stay put and are never overlapped by the re-flow', () => {
      ePriv = e = new GridStackEngine({mode: 'list', column: 4});
      e.addNode({x: 2, y: 1, w: 2, h: 1, id: 'LOCK', locked: true, noMove: true});
      for (let i = 0; i < 7; i++) e.addNode({w: 1, h: 1, id: 'i' + i, autoPosition: true});
      e.moveNode(findNode('i6')!, {x: 0, y: 0}); // force a re-flow
      expect(findNode('LOCK')).toEqual(expect.objectContaining({x: 2, y: 1, w: 2, h: 1}));
      expect(overlaps(e)).toEqual([]);
    });

    it('compact uses the cheaper list flow while moving, then compacts on endUpdate()', () => {
      ePriv = e = new GridStackEngine({mode: 'compact', column: 4});
      e.nodes = [
        e.prepareNode({x: 1, y: 0, w: 2, h: 1, id: 'big'}),
        e.prepareNode({x: 3, y: 0, w: 1, h: 1, id: 'small'}),
      ];
      const small = findNode('small')!;
      e.beginUpdate(small);
      e.moveNode(small, {x: 0, y: 0});
      // mid-move: sequential 'list' flow, so no back-filling ahead of 'big'
      expect(findNode('small')).toEqual(expect.objectContaining({x: 0, y: 0}));
      expect(findNode('big')).toEqual(expect.objectContaining({x: 1, y: 0}));
      e.endUpdate(); // ...and the real compact pass happens on drop
      expect(overlaps(e)).toEqual([]);
    });

    it('still creates sub-grids on the fly (subGridDynamic) in every mode', () => {
      (['top', 'float', 'list', 'compact'] as const).forEach(mode => {
        ePriv = e = new GridStackEngine({mode, column: 4});
        const made: string[] = [];
        // fake the grid/DOM bits moveNode() needs to detect the 'dragged over 80% of an item' gesture
        const grid: any = {opts: {subGridDynamic: true}, makeSubGrid: (el, _o, n) => made.push(`${el}<-${n.id}`)};
        e.nodes = [
          e.prepareNode({x: 0, y: 0, w: 1, h: 1, id: 'drag', grid, _rect: {x: 0, y: 0, w: 100, h: 100}}),
          e.prepareNode({x: 1, y: 0, w: 1, h: 1, id: 'target', grid, _rect: {x: 100, y: 0, w: 100, h: 100}}),
        ];
        findNode('target')!.el = 'targetEl' as unknown as HTMLElement;
        findNode('target')!.grid = grid;
        const drag = findNode('drag')!;
        drag._moving = true;
        // move fully over 'target' (>80% coverage) -> should nest instead of pushing/re-flowing
        e.moveNode(drag, {x: 1, y: 0, rect: {x: 100, y: 0, w: 100, h: 100}});
        expect(made).toEqual([`targetEl<-drag`]);
      });
    });

    it('never overlaps items, whatever the sequence of moves/adds/removes', () => {
      (['list', 'compact'] as const).forEach(mode => {
        ePriv = e = new GridStackEngine({mode, column: 6, maxRow: 5});
        let seed = 12345;
        const rnd = (n: number) => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) % n);
        for (let i = 0; i < 12; i++) {
          e.addNode({w: 1 + rnd(3), h: 1 + rnd(2), id: 'i' + i, locked: i % 7 === 0, autoPosition: i % 3 !== 0, x: rnd(6), y: rnd(4)});
          expect(overlaps(e)).toEqual([]);
        }
        for (let i = 0; i < 40; i++) {
          const n = e.nodes[rnd(e.nodes.length)];
          if (!n) continue;
          if (i % 9 === 8) e.removeNode(n);
          else e.moveNode(n, {x: rnd(6), y: rnd(5), w: 1 + rnd(3), h: 1 + rnd(2)});
          expect(overlaps(e)).toEqual([]);
          // and always within the column bounds
          e.nodes.forEach(n2 => expect(n2.x! + n2.w!).toBeLessThanOrEqual(6));
        }
      });
    });
  });

});
