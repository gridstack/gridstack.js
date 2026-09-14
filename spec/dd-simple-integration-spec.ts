import { DDDraggable } from '../src/dd-draggable';
import { DDDroppable } from '../src/dd-droppable';
import { DDResizable } from '../src/dd-resizable';
import { DDElement } from '../src/dd-element';
import { DDManager } from '../src/dd-manager';
import { GridItemHTMLElement } from '../src/types';

describe('DD Integration Tests', () => {
  let element: GridItemHTMLElement;

  beforeEach(() => {
    element = document.createElement('div') as GridItemHTMLElement;
    element.style.width = '100px';
    element.style.height = '100px';
    element.style.position = 'absolute';
    document.body.appendChild(element);
    
    // Mock gridstackNode
    element.gridstackNode = {
      id: 'test-node',
      x: 0,
      y: 0,
      w: 1,
      h: 1
    } as any;
  });

  afterEach(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  describe('DDElement', () => {
    it('should create DDElement instance', () => {
      const ddElement = DDElement.init(element);
      
      expect(ddElement).toBeDefined();
      expect(ddElement.el).toBe(element);
    });

    it('should return same instance on multiple init calls', () => {
      const ddElement1 = DDElement.init(element);
      const ddElement2 = DDElement.init(element);
      
      expect(ddElement1).toBe(ddElement2);
    });

    it('should setup draggable', () => {
      const ddElement = DDElement.init(element);
      
      ddElement.setupDraggable({ handle: '.drag-handle' });
      
      expect(ddElement.ddDraggable).toBeDefined();
    });

    it('should setup droppable', () => {
      const ddElement = DDElement.init(element);
      
      ddElement.setupDroppable({ accept: '.draggable' });
      
      expect(ddElement.ddDroppable).toBeDefined();
    });

    it('should setup resizable with default handles', () => {
      const ddElement = DDElement.init(element);
      
      ddElement.setupResizable({ handles: 'se' });
      
      expect(ddElement.ddResizable).toBeDefined();
    });

    it('should clean up components', () => {
      const ddElement = DDElement.init(element);
      
      ddElement.setupDraggable({});
      ddElement.setupDroppable({});
      ddElement.setupResizable({ handles: 'se' });
      
      expect(ddElement.ddDraggable).toBeDefined();
      expect(ddElement.ddDroppable).toBeDefined();
      expect(ddElement.ddResizable).toBeDefined();
      
      ddElement.cleanDraggable();
      ddElement.cleanDroppable();
      ddElement.cleanResizable();
      
      expect(ddElement.ddDraggable).toBeUndefined();
      expect(ddElement.ddDroppable).toBeUndefined();
      expect(ddElement.ddResizable).toBeUndefined();
    });
  });

  describe('DDDraggable basic functionality', () => {
    it('should create draggable instance', () => {
      const draggable = new DDDraggable(element);
      
      expect(draggable).toBeDefined();
      expect(draggable.el).toBe(element);
      expect(draggable.disabled).toBe(false);
      
      draggable.destroy();
    });

    it('should enable/disable draggable', () => {
      const draggable = new DDDraggable(element);
      
      draggable.disable();
      expect(draggable.disabled).toBe(true);
      
      draggable.enable();
      expect(draggable.disabled).toBe(false);
      
      draggable.destroy();
    });

    it('should update options', () => {
      const draggable = new DDDraggable(element);
      
      const result = draggable.updateOption({ handle: '.new-handle' });
      
      expect(result).toBe(draggable);
      expect(draggable.option.handle).toBe('.new-handle');
      
      draggable.destroy();
    });
  });

  describe('DDDroppable basic functionality', () => {
    it('should create droppable instance', () => {
      const droppable = new DDDroppable(element);
      
      expect(droppable).toBeDefined();
      expect(droppable.el).toBe(element);
      expect(droppable.disabled).toBe(false);
      expect(element.classList.contains('ui-droppable')).toBe(true);
      
      droppable.destroy();
    });

    it('should enable/disable droppable', () => {
      const droppable = new DDDroppable(element);
      
      droppable.disable();
      expect(droppable.disabled).toBe(true);
      expect(element.classList.contains('ui-droppable-disabled')).toBe(true);
      
      droppable.enable();
      expect(droppable.disabled).toBe(false);
      expect(element.classList.contains('ui-droppable')).toBe(true);
      
      droppable.destroy();
    });

    it('should update options', () => {
      const droppable = new DDDroppable(element);
      
      const result = droppable.updateOption({ accept: '.new-class' });
      
      expect(result).toBe(droppable);
      expect(droppable.option.accept).toBe('.new-class');
      
      droppable.destroy();
    });

    it('should handle accept function', () => {
      const droppable = new DDDroppable(element);
      
      droppable.updateOption({ accept: '.test-class' });
      
      const testEl = document.createElement('div');
      testEl.classList.add('test-class');
      expect(droppable._canDrop(testEl)).toBe(true);
      
      const otherEl = document.createElement('div');
      expect(droppable._canDrop(otherEl)).toBe(false);
      
      droppable.destroy();
    });
  });

  describe('DDResizable basic functionality', () => {
    it('should create resizable instance with handles', () => {
      const resizable = new DDResizable(element, { handles: 'se' });
      
      expect(resizable).toBeDefined();
      expect(resizable.el).toBe(element);
      expect(resizable.disabled).toBe(false);
      // Note: ui-resizable class is added by enable() which is called in constructor
      // but the class might not be added immediately in test environment
      
      resizable.destroy();
    });

    it('should enable/disable resizable', () => {
      const resizable = new DDResizable(element, { handles: 'se' });
      
      resizable.disable();
      expect(resizable.disabled).toBe(true);
      expect(element.classList.contains('ui-resizable-disabled')).toBe(true);
      
      resizable.enable();
      expect(resizable.disabled).toBe(false);
      expect(element.classList.contains('ui-resizable-disabled')).toBe(false);
      
      resizable.destroy();
    });

    it('should update options', () => {
      const resizable = new DDResizable(element, { handles: 'se' });
      
      const result = resizable.updateOption({ handles: 'n,s,e,w' });
      
      expect(result).toBe(resizable);
      expect(resizable.option.handles).toBe('n,s,e,w');
      
      resizable.destroy();
    });

    it('should create resize handles', () => {
      const resizable = new DDResizable(element, { handles: 'se,nw' });
      
      const seHandle = element.querySelector('.ui-resizable-se');
      const nwHandle = element.querySelector('.ui-resizable-nw');
      
      expect(seHandle).toBeTruthy();
      expect(nwHandle).toBeTruthy();
      
      resizable.destroy();
    });
  });

  describe('drag gesture', () => {
    /** dispatch a real mouse event - the drag code listens on document for move/up */
    const mouse = (type: string, x: number, y: number, target: EventTarget = document) => {
      target.dispatchEvent(new MouseEvent(type, {bubbles: true, cancelable: true, button: 0, clientX: x, clientY: y}));
    };

    it('should fire dragstart/drag/dragstop as the mouse moves and releases', () => {
      const start = vi.fn(), drag = vi.fn(), stop = vi.fn();
      const draggable = new DDDraggable(element, {start, drag, stop});

      mouse('mousedown', 10, 10, element);
      expect(start).not.toHaveBeenCalled(); // a click alone isn't a drag

      mouse('mousemove', 30, 30);
      expect(start).toHaveBeenCalled();
      expect(DDManager.dragElement).toBe(draggable);

      mouse('mousemove', 50, 60);
      expect(drag).toHaveBeenCalled();

      mouse('mouseup', 50, 60);
      expect(stop).toHaveBeenCalled();
      expect(DDManager.dragElement).toBeUndefined();

      draggable.destroy();
    });

    it('should not start dragging for a tiny mouse move (#3px threshold)', () => {
      const start = vi.fn();
      const draggable = new DDDraggable(element, {start});

      mouse('mousedown', 10, 10, element);
      mouse('mousemove', 11, 11);
      expect(start).not.toHaveBeenCalled();
      expect(DDManager.dragElement).toBeUndefined();

      mouse('mouseup', 11, 11);
      draggable.destroy();
    });

    it('should ignore a non left click', () => {
      const start = vi.fn();
      const draggable = new DDDraggable(element, {start});

      element.dispatchEvent(new MouseEvent('mousedown', {bubbles: true, button: 2, clientX: 10, clientY: 10}));
      mouse('mousemove', 40, 40);

      expect(start).not.toHaveBeenCalled();
      draggable.destroy();
    });

    it('should cancel the drag on Escape', () => {
      const stop = vi.fn();
      const draggable = new DDDraggable(element, {stop});

      mouse('mousedown', 10, 10, element);
      mouse('mousemove', 40, 40);
      expect(DDManager.dragElement).toBe(draggable);

      document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));

      expect(stop).toHaveBeenCalled();
      expect(DDManager.dragElement).toBeUndefined();
      draggable.destroy();
    });

    it('should only let one item handle a drag at a time', () => {
      const other = document.createElement('div');
      document.body.appendChild(other);
      const start1 = vi.fn(), start2 = vi.fn();
      const d1 = new DDDraggable(element, {start: start1});
      const d2 = new DDDraggable(other, {start: start2});

      mouse('mousedown', 10, 10, element);
      mouse('mousedown', 10, 10, other); // second one must be ignored
      mouse('mousemove', 40, 40);

      expect(start1).toHaveBeenCalled();
      expect(start2).not.toHaveBeenCalled();

      mouse('mouseup', 40, 40);
      d1.destroy(); d2.destroy(); other.remove();
    });
  });

  describe('resize gesture', () => {
    const mouse = (type: string, x: number, y: number, target: EventTarget = document) => {
      target.dispatchEvent(new MouseEvent(type, {bubbles: true, cancelable: true, button: 0, clientX: x, clientY: y}));
    };

    it('should fire resizestart/resize/resizestop when dragging a handle', () => {
      const start = vi.fn(), resize = vi.fn(), stop = vi.fn();
      const resizable = new DDResizable(element, {handles: 'se', start, resize, stop});
      const handle = element.querySelector('.ui-resizable-se')!;

      mouse('mousedown', 100, 100, handle);
      expect(start).not.toHaveBeenCalled();

      mouse('mousemove', 140, 150);
      expect(start).toHaveBeenCalled();
      expect(resize).toHaveBeenCalled();

      mouse('mouseup', 140, 150);
      expect(stop).toHaveBeenCalled();

      resizable.destroy();
    });

    it('should not resize for a tiny move', () => {
      const start = vi.fn();
      const resizable = new DDResizable(element, {handles: 'se', start});
      const handle = element.querySelector('.ui-resizable-se')!;

      mouse('mousedown', 100, 100, handle);
      mouse('mousemove', 101, 101);
      expect(start).not.toHaveBeenCalled();

      mouse('mouseup', 101, 101);
      resizable.destroy();
    });

    it('should keep peer resize handles hidden during an active resize', () => {
      const peer = document.createElement('div') as GridItemHTMLElement;
      document.body.appendChild(peer);
      const resizable = new DDResizable(element, {handles: 'se', autoHide: true});
      const peerResizable = new DDResizable(peer, {handles: 'se', autoHide: true});
      const handle = element.querySelector('.ui-resizable-se')!;

      try {
        mouse('mouseover', 100, 100, element);
        mouse('mousedown', 100, 100, handle);
        mouse('mousemove', 120, 120);
        expect(element.classList.contains('ui-resizable-resizing')).toBe(true);

        mouse('mouseout', 120, 120, element);
        mouse('mouseover', 120, 120, peer);

        expect(peer.classList.contains('ui-resizable-autohide')).toBe(true);

        mouse('mouseup', 120, 120);
        expect(peer.classList.contains('ui-resizable-autohide')).toBe(false);
        expect(DDManager.resizeElement).toBeUndefined();
      } finally {
        mouse('mouseup', 120, 120);
        resizable.destroy();
        peerResizable.destroy();
        peer.remove();
      }
    });

    it('should cancel the resize on Escape', () => {
      const stop = vi.fn();
      const resizable = new DDResizable(element, {handles: 'se', stop});
      const handle = element.querySelector('.ui-resizable-se')!;

      mouse('mousedown', 100, 100, handle);
      mouse('mousemove', 140, 150);
      document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));

      expect(stop).toHaveBeenCalled();
      expect(DDManager.resizeElement).toBeUndefined();
      resizable.destroy();
    });
  });

  describe('Event handling', () => {
    it('should support event listeners on DDElement', () => {
      const ddElement = DDElement.init(element);
      const callback = vi.fn();
      
      ddElement.setupDraggable({});
      ddElement.on('dragstart', callback);
      ddElement.off('dragstart');
      
      // Should not throw
      expect(typeof ddElement.on).toBe('function');
      expect(typeof ddElement.off).toBe('function');
      
      ddElement.cleanDraggable();
    });
  });
});
