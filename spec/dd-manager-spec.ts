import { DDManager } from '../src/dd-manager';

describe('DDManager', () => {
  afterEach(() => {
    // Clean up DDManager state
    delete DDManager.dragElement;
    delete DDManager.dropElement;
    delete DDManager.pauseDrag;
  });

  describe('static properties', () => {
    it('should have dragElement property', () => {
      expect(DDManager.dragElement).toBeUndefined();
      
      const mockDragElement = {} as any;
      DDManager.dragElement = mockDragElement;
      
      expect(DDManager.dragElement).toBe(mockDragElement);
    });

    it('should have dropElement property', () => {
      expect(DDManager.dropElement).toBeUndefined();
      
      const mockDropElement = {} as any;
      DDManager.dropElement = mockDropElement;
      
      expect(DDManager.dropElement).toBe(mockDropElement);
    });

    it('should have pauseDrag property', () => {
      expect(DDManager.pauseDrag).toBeUndefined();
      
      DDManager.pauseDrag = true;
      expect(DDManager.pauseDrag).toBe(true);
      
      DDManager.pauseDrag = 500;
      expect(DDManager.pauseDrag).toBe(500);
    });
  });

  describe('state management', () => {
    it('should allow setting and clearing drag element', () => {
      const mockElement = { id: 'test' } as any;
      
      DDManager.dragElement = mockElement;
      expect(DDManager.dragElement).toBe(mockElement);
      
      delete DDManager.dragElement;
      expect(DDManager.dragElement).toBeUndefined();
    });

    it('should allow setting and clearing drop element', () => {
      const mockElement = { id: 'test' } as any;
      
      DDManager.dropElement = mockElement;
      expect(DDManager.dropElement).toBe(mockElement);
      
      delete DDManager.dropElement;
      expect(DDManager.dropElement).toBeUndefined();
    });
  });
});

