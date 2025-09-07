import { DDBaseImplement } from '../src/dd-base-impl';

describe('DDBaseImplement', () => {
  let baseImpl: DDBaseImplement;

  beforeEach(() => {
    baseImpl = new DDBaseImplement();
  });

  describe('constructor', () => {
    it('should create instance with undefined disabled state', () => {
      expect(baseImpl.disabled).toBeUndefined();
    });
  });

  describe('enable/disable', () => {
    it('should enable when disabled', () => {
      baseImpl.disable();
      expect(baseImpl.disabled).toBe(true);
      
      baseImpl.enable();
      
      expect(baseImpl.disabled).toBe(false);
    });

    it('should disable when enabled', () => {
      baseImpl.enable();
      expect(baseImpl.disabled).toBe(false);
      
      baseImpl.disable();
      
      expect(baseImpl.disabled).toBe(true);
    });

    it('should return undefined (no chaining)', () => {
      expect(baseImpl.enable()).toBeUndefined();
      expect(baseImpl.disable()).toBeUndefined();
    });
  });

  describe('destroy', () => {
    it('should clean up event register', () => {
      baseImpl.enable();
      baseImpl.on('test', () => {});
      
      baseImpl.destroy();
      
      // Should not throw when trying to trigger events after destroy
      expect(() => baseImpl.triggerEvent('test', new Event('test'))).not.toThrow();
    });
  });

  describe('event handling', () => {
    beforeEach(() => {
      baseImpl.enable(); // Need to enable for events to trigger
    });

    it('should handle on/off events', () => {
      const callback = vi.fn();
      
      baseImpl.on('test', callback);
      baseImpl.triggerEvent('test', new Event('test'));
      
      expect(callback).toHaveBeenCalled();
    });

    it('should remove event listeners with off', () => {
      const callback = vi.fn();
      
      baseImpl.on('test', callback);
      baseImpl.off('test');
      baseImpl.triggerEvent('test', new Event('test'));
      
      expect(callback).not.toHaveBeenCalled();
    });

    it('should only keep last listener for same event', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      baseImpl.on('test', callback1);
      baseImpl.on('test', callback2); // This overwrites callback1
      baseImpl.triggerEvent('test', new Event('test'));
      
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('should not trigger events when disabled', () => {
      const callback = vi.fn();
      
      baseImpl.on('test', callback);
      baseImpl.disable();
      baseImpl.triggerEvent('test', new Event('test'));
      
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
