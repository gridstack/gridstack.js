import { DDDroppable } from '../src/dd-droppable';
import { DDManager } from '../src/dd-manager';

describe('DDDroppable', () => {
  let element: HTMLElement;
  let droppable: DDDroppable;

  beforeEach(() => {
    // Create a test element
    element = document.createElement('div');
    element.id = 'test-droppable';
    element.style.width = '100px';
    element.style.height = '100px';
    document.body.appendChild(element);
  });

  afterEach(() => {
    // Clean up
    if (droppable) {
      droppable.destroy();
    }
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
    // Clear DDManager state
    delete DDManager.dragElement;
    delete DDManager.dropElement;
  });

  describe('constructor', () => {
    it('should create a droppable instance with default options', () => {
      droppable = new DDDroppable(element);
      
      expect(droppable).toBeDefined();
      expect(droppable.el).toBe(element);
      expect(droppable.option).toEqual({});
      expect(element.classList.contains('ui-droppable')).toBe(true);
    });

    it('should create a droppable instance with custom options', () => {
      const options = {
        accept: '.draggable-item',
        drop: vi.fn(),
        over: vi.fn(),
        out: vi.fn()
      };
      
      droppable = new DDDroppable(element, options);
      
      expect(droppable.option).toBe(options);
      expect(droppable.accept).toBeDefined();
    });
  });

  describe('enable/disable', () => {
    beforeEach(() => {
      droppable = new DDDroppable(element);
    });

    it('should enable droppable functionality', () => {
      droppable.disable();
      expect(droppable.disabled).toBe(true);
      expect(element.classList.contains('ui-droppable-disabled')).toBe(true);
      
      droppable.enable();
      expect(droppable.disabled).toBe(false);
      expect(element.classList.contains('ui-droppable')).toBe(true);
      expect(element.classList.contains('ui-droppable-disabled')).toBe(false);
    });

    it('should disable droppable functionality', () => {
      expect(droppable.disabled).toBe(false);
      
      droppable.disable();
      expect(droppable.disabled).toBe(true);
      expect(element.classList.contains('ui-droppable')).toBe(false);
      expect(element.classList.contains('ui-droppable-disabled')).toBe(true);
    });

    it('should not enable if already enabled', () => {
      const spy = vi.spyOn(element.classList, 'add');
      droppable.enable(); // Already enabled
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not disable if already disabled', () => {
      droppable.disable();
      const spy = vi.spyOn(element.classList, 'remove');
      droppable.disable(); // Already disabled
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should clean up droppable instance', () => {
      droppable = new DDDroppable(element);
      
      droppable.destroy();
      
      expect(element.classList.contains('ui-droppable')).toBe(false);
      expect(element.classList.contains('ui-droppable-disabled')).toBe(false);
      expect(droppable.disabled).toBe(true);
    });
  });

  describe('updateOption', () => {
    beforeEach(() => {
      droppable = new DDDroppable(element);
    });

    it('should update options', () => {
      const newOptions = {
        accept: '.new-class',
        drop: vi.fn()
      };
      
      const result = droppable.updateOption(newOptions);
      
      expect(result).toBe(droppable);
      expect(droppable.option.accept).toBe('.new-class');
      expect(droppable.option.drop).toBe(newOptions.drop);
    });

    it('should update accept function when accept is a string', () => {
      droppable.updateOption({ accept: '.test-class' });
      
      expect(droppable.accept).toBeDefined();
      
      // Test the accept function
      const testEl = document.createElement('div');
      testEl.classList.add('test-class');
      expect(droppable.accept(testEl)).toBe(true);
      
      const otherEl = document.createElement('div');
      expect(droppable.accept(otherEl)).toBe(false);
    });

    it('should update accept function when accept is a function', () => {
      const acceptFn = vi.fn().mockReturnValue(true);
      droppable.updateOption({ accept: acceptFn });
      
      expect(droppable.accept).toBe(acceptFn);
    });
  });

  describe('mouse events', () => {
    beforeEach(() => {
      droppable = new DDDroppable(element, {
        over: vi.fn(),
        out: vi.fn(),
        drop: vi.fn()
      });

      // Create a mock draggable element
      const mockDraggable = {
        el: document.createElement('div'),
        ui: vi.fn().mockReturnValue({
          helper: document.createElement('div'),
          position: { left: 0, top: 0 }
        })
      };
      DDManager.dragElement = mockDraggable as any;
    });

    describe('_mouseEnter', () => {
      it('should handle mouse enter when dragging', () => {
        const event = new MouseEvent('mouseenter', { bubbles: true });
        const spy = vi.spyOn(event, 'preventDefault');
        
        droppable._mouseEnter(event);
        
        expect(spy).toHaveBeenCalled();
        expect(DDManager.dropElement).toBe(droppable);
        expect(element.classList.contains('ui-droppable-over')).toBe(true);
        expect(droppable.option.over).toHaveBeenCalled();
      });

      it('should not handle mouse enter when not dragging', () => {
        delete DDManager.dragElement;
        const event = new MouseEvent('mouseenter', { bubbles: true });
        
        droppable._mouseEnter(event);
        
        expect(DDManager.dropElement).toBeUndefined();
        expect(element.classList.contains('ui-droppable-over')).toBe(false);
      });

      it('should not handle mouse enter when element cannot be dropped', () => {
        droppable.updateOption({ accept: '.not-matching' });
        const event = new MouseEvent('mouseenter', { bubbles: true });
        
        droppable._mouseEnter(event);
        
        expect(DDManager.dropElement).toBeUndefined();
        expect(element.classList.contains('ui-droppable-over')).toBe(false);
      });
    });

    describe('_mouseLeave', () => {
      beforeEach(() => {
        DDManager.dropElement = droppable;
        element.classList.add('ui-droppable-over');
      });

      it('should handle mouse leave when this is the current drop element', () => {
        const event = new MouseEvent('mouseleave', { bubbles: true });
        const spy = vi.spyOn(event, 'preventDefault');
        
        droppable._mouseLeave(event);
        
        expect(spy).toHaveBeenCalled();
        expect(DDManager.dropElement).toBeUndefined();
        expect(droppable.option.out).toHaveBeenCalled();
      });

      it('should not handle mouse leave when not the current drop element', () => {
        DDManager.dropElement = null as any;
        const event = new MouseEvent('mouseleave', { bubbles: true });
        
        droppable._mouseLeave(event);
        
        expect(droppable.option.out).not.toHaveBeenCalled();
      });

      it('should not handle mouse leave when no drag element', () => {
        delete DDManager.dragElement;
        const event = new MouseEvent('mouseleave', { bubbles: true });
        
        droppable._mouseLeave(event);
        
        expect(droppable.option.out).not.toHaveBeenCalled();
      });
    });

    describe('drop', () => {
      it('should handle drop event', () => {
        const event = new MouseEvent('mouseup', { bubbles: true });
        const spy = vi.spyOn(event, 'preventDefault');
        
        droppable.drop(event);
        
        expect(spy).toHaveBeenCalled();
        expect(droppable.option.drop).toHaveBeenCalled();
      });
    });
  });

  describe('_canDrop', () => {
    beforeEach(() => {
      droppable = new DDDroppable(element);
    });

    it('should return true when no accept filter is set', () => {
      const testEl = document.createElement('div');
      expect(droppable._canDrop(testEl)).toBe(true);
    });

    it('should return false when element is null', () => {
      expect(droppable._canDrop(null as any)).toBeFalsy();
    });

    it('should use accept function when set', () => {
      const acceptFn = vi.fn().mockReturnValue(false);
      droppable.accept = acceptFn;
      
      const testEl = document.createElement('div');
      const result = droppable._canDrop(testEl);
      
      expect(acceptFn).toHaveBeenCalledWith(testEl);
      expect(result).toBe(false);
    });
  });

  describe('event handling', () => {
    beforeEach(() => {
      droppable = new DDDroppable(element);
    });

    it('should support on/off event methods', () => {
      const callback = vi.fn();
      
      droppable.on('drop', callback);
      droppable.off('drop');
      
      // These methods should exist and not throw
      expect(typeof droppable.on).toBe('function');
      expect(typeof droppable.off).toBe('function');
    });
  });

  describe('_ui helper', () => {
    it('should create UI data object', () => {
      droppable = new DDDroppable(element);
      
      const dragEl = document.createElement('div');
      const mockDraggable = {
        el: dragEl,
        ui: vi.fn().mockReturnValue({
          helper: dragEl,
          position: { left: 0, top: 0 }
        })
      };
      
      const result = droppable._ui(mockDraggable as any);
      
      expect(result.draggable).toBe(dragEl);
      expect(result.helper).toBe(dragEl);
      expect(result.position).toEqual({ left: 0, top: 0 });
    });
  });
});
