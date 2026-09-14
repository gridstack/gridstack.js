import { 
  isTouch, 
  touchstart, 
  touchmove, 
  touchend, 
  pointerdown, 
  pointerenter, 
  pointerleave,
  cancelPendingTouchDrag,
  DDTouch
} from '../src/dd-touch';
import { DDManager } from '../src/dd-manager';
import { Utils } from '../src/utils';

// Mock Utils.simulateMouseEvent
vi.mock('../src/utils', () => ({
  Utils: {
    simulateMouseEvent: vi.fn()
  }
}));

// Mock DDManager
vi.mock('../src/dd-manager', () => ({
  DDManager: {
    dragElement: null
  }
}));

// Helper function to create mock TouchList
function createMockTouchList(touches: Touch[]): TouchList {
  const touchList = {
    length: touches.length,
    item: (index: number) => touches[index] || null,
    ...touches
  };
  return touchList as TouchList;
}

// Helper function to create mock TouchEvent
function createMockTouchEvent(type: string, touches: Touch[], options: Partial<TouchEvent> = {}): TouchEvent {
  const touchList = createMockTouchList(touches);
  const changedTouchList = options.changedTouches ? 
    createMockTouchList(options.changedTouches as Touch[]) : touchList;
  
  const mockEvent = {
    touches: touchList,
    changedTouches: changedTouchList,
    targetTouches: touchList,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    cancelable: true,
    type,
    target: document.createElement('div'),
    currentTarget: document.createElement('div'),
    bubbles: true,
    composed: false,
    defaultPrevented: false,
    eventPhase: Event.AT_TARGET,
    isTrusted: true,
    timeStamp: Date.now(),
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    detail: 0,
    view: window,
    which: 0,
    ...options
  };
  return mockEvent as TouchEvent;
}

// Helper function to create mock PointerEvent
function createMockPointerEvent(type: string, pointerType: string, options: Partial<PointerEvent> = {}): PointerEvent {
  const mockEvent = {
    pointerId: 1,
    pointerType,
    target: document.createElement('div'),
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    cancelable: true,
    type,
    currentTarget: document.createElement('div'),
    bubbles: true,
    composed: false,
    defaultPrevented: false,
    eventPhase: Event.AT_TARGET,
    isTrusted: true,
    timeStamp: Date.now(),
    clientX: 100,
    clientY: 200,
    pageX: 100,
    pageY: 200,
    screenX: 100,
    screenY: 200,
    button: 0,
    buttons: 1,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
    width: 1,
    height: 1,
    pressure: 0.5,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    isPrimary: true,
    detail: 0,
    view: window,
    which: 0,
    getCoalescedEvents: vi.fn(() => []),
    getPredictedEvents: vi.fn(() => []),
    movementX: 0,
    movementY: 0,
    offsetX: 0,
    offsetY: 0,
    relatedTarget: null,
    ...options
  };
  return mockEvent as PointerEvent;
}

/** touch drags only start after the user pauses on the item - see #2781 */
const TOUCH_DRAG_DELAY = 300;
const pauseToDrag = () => vi.advanceTimersByTime(TOUCH_DRAG_DELAY);

describe('dd-touch', () => {
  let mockUtils: any;
  let mockDDManager: any;

  /** touchstart + wait out the pause, which is what actually starts the drag */
  function startTouchDrag(touch: Touch): void {
    touchstart(createMockTouchEvent('touchstart', [touch]));
    pauseToDrag();
  }

  beforeEach(() => {
    vi.useFakeTimers(); // drags are now delayed, see #2781
    mockUtils = vi.mocked(Utils);
    mockDDManager = vi.mocked(DDManager);
    
    // Reset mocks
    mockUtils.simulateMouseEvent.mockClear();
    mockDDManager.dragElement = null;
    
    // reset leftover state from the previous gesture
    cancelPendingTouchDrag();
    DDTouch.touchHandled = false;
    delete DDTouch.pointerLeaveTimeout;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('isTouch detection', () => {
    it('should be a boolean value', () => {
      expect(typeof isTouch).toBe('boolean');
    });

    it('should detect touch support in current environment', () => {
      // Since we're in jsdom, isTouch should be false unless touch APIs are mocked
      // This test validates that the detection logic runs without errors
      expect(isTouch).toBeDefined();
    });
  });

  describe('touchstart', () => {
    let mockTouch: Touch;

    beforeEach(() => {
      mockTouch = {
        pageX: 100,
        pageY: 200,
        clientX: 100,
        clientY: 200,
        screenX: 100,
        screenY: 200,
        identifier: 1,
        target: document.createElement('div'),
        radiusX: 10,
        radiusY: 10,
        rotationAngle: 0,
        force: 1
      } as Touch;
    });

    it('should simulate mousedown only after pausing on the item (#2781)', () => {
      const mockTouchEvent = createMockTouchEvent('touchstart', [mockTouch]);

      touchstart(mockTouchEvent);
      expect(mockUtils.simulateMouseEvent).not.toHaveBeenCalled(); // still could be a page scroll

      pauseToDrag();
      expect(mockUtils.simulateMouseEvent).toHaveBeenCalledWith(mockTouch, 'mousedown');
    });

    it('should let a quick swipe scroll the page instead of dragging (#2781)', () => {
      const target = document.createElement('div');
      touchstart(createMockTouchEvent('touchstart', [mockTouch], { currentTarget: target } as never));

      // finger moves away before the delay elapses -> this is a scroll, not a drag
      const move: Event & { touches?: unknown } = new Event('touchmove');
      move.touches = [{ ...mockTouch, clientX: mockTouch.clientX + 50 }];
      target.dispatchEvent(move);
      pauseToDrag();

      expect(mockUtils.simulateMouseEvent).not.toHaveBeenCalled();
      expect(DDTouch.touchHandled).toBeFalsy();
    });

    it('should not drag when releasing before the pause elapses (tap)', () => {
      const target = document.createElement('div');
      touchstart(createMockTouchEvent('touchstart', [mockTouch], { currentTarget: target } as never));

      target.dispatchEvent(new Event('touchend'));
      pauseToDrag();

      expect(mockUtils.simulateMouseEvent).not.toHaveBeenCalled();
      expect(DDTouch.touchHandled).toBeFalsy();
    });

    it('should prevent default on cancelable events', () => {
      const mockTouchEvent = createMockTouchEvent('touchstart', [mockTouch], { cancelable: true });

      touchstart(mockTouchEvent);
      pauseToDrag();

      expect(mockTouchEvent.preventDefault).toHaveBeenCalled();
    });

    it('should not prevent default on non-cancelable events', () => {
      const mockTouchEvent = createMockTouchEvent('touchstart', [mockTouch], { cancelable: false });

      touchstart(mockTouchEvent);
      pauseToDrag();

      expect(mockTouchEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should ignore multi-touch events', () => {
      const secondTouch = { ...mockTouch, identifier: 2 };
      const mockTouchEvent = createMockTouchEvent('touchstart', [mockTouch, secondTouch]);

      touchstart(mockTouchEvent);
      pauseToDrag();

      expect(mockUtils.simulateMouseEvent).not.toHaveBeenCalled();
    });
  });

  describe('touchmove', () => {
    let mockTouch: Touch;

    beforeEach(() => {
      mockTouch = {
        pageX: 150,
        pageY: 250,
        clientX: 150,
        clientY: 250,
        screenX: 150,
        screenY: 250,
        identifier: 1,
        target: document.createElement('div'),
        radiusX: 10,
        radiusY: 10,
        rotationAngle: 0,
        force: 1
      } as Touch;
    });

    it('should simulate mousemove for single touch when touch is handled', () => {
      startTouchDrag(mockTouch);
      mockUtils.simulateMouseEvent.mockClear(); // Clear previous calls
      
      const mockTouchEvent = createMockTouchEvent('touchmove', [mockTouch]);
      touchmove(mockTouchEvent);

      expect(mockUtils.simulateMouseEvent).toHaveBeenCalledWith(mockTouch, 'mousemove');
    });

    it('should ignore touchmove when touch is not handled', () => {
      // Don't call touchstart first, so DDTouch.touchHandled remains false
      const mockTouchEvent = createMockTouchEvent('touchmove', [mockTouch]);

      touchmove(mockTouchEvent);

      expect(mockUtils.simulateMouseEvent).not.toHaveBeenCalled();
    });

    it('should ignore multi-touch events', () => {
      startTouchDrag(mockTouch);
      mockUtils.simulateMouseEvent.mockClear(); // Clear previous calls
      
      const secondTouch = { ...mockTouch, identifier: 2 };
      const mockTouchEvent = createMockTouchEvent('touchmove', [mockTouch, secondTouch]);

      touchmove(mockTouchEvent);

      expect(mockUtils.simulateMouseEvent).not.toHaveBeenCalled();
    });
  });

  describe('touchend', () => {
    let mockTouch: Touch;

    beforeEach(() => {
      mockTouch = {
        pageX: 200,
        pageY: 300,
        clientX: 200,
        clientY: 300,
        screenX: 200,
        screenY: 300,
        identifier: 1,
        target: document.createElement('div'),
        radiusX: 10,
        radiusY: 10,
        rotationAngle: 0,
        force: 1
      } as Touch;
    });

    it('should simulate mouseup when touch is handled', () => {
      startTouchDrag(mockTouch);
      mockUtils.simulateMouseEvent.mockClear(); // Clear previous calls
      
      const mockTouchEvent = createMockTouchEvent('touchend', [], { changedTouches: [mockTouch] });
      touchend(mockTouchEvent);

      expect(mockUtils.simulateMouseEvent).toHaveBeenCalledWith(mockTouch, 'mouseup');
    });

    it('should simulate click when not dragging', () => {
      startTouchDrag(mockTouch);
      mockUtils.simulateMouseEvent.mockClear(); // Clear previous calls
      mockDDManager.dragElement = null; // Not dragging
      
      const mockTouchEvent = createMockTouchEvent('touchend', [], { changedTouches: [mockTouch] });
      touchend(mockTouchEvent);

      expect(mockUtils.simulateMouseEvent).toHaveBeenCalledWith(mockTouch, 'mouseup');
      expect(mockUtils.simulateMouseEvent).toHaveBeenCalledWith(mockTouch, 'click');
    });

    it('should not simulate click when dragging', () => {
      startTouchDrag(mockTouch);
      mockUtils.simulateMouseEvent.mockClear(); // Clear previous calls
      mockDDManager.dragElement = {}; // Dragging
      
      const mockTouchEvent = createMockTouchEvent('touchend', [], { changedTouches: [mockTouch] });
      touchend(mockTouchEvent);

      expect(mockUtils.simulateMouseEvent).toHaveBeenCalledWith(mockTouch, 'mouseup');
      expect(mockUtils.simulateMouseEvent).not.toHaveBeenCalledWith(mockTouch, 'click');
    });

    it('should ignore touchend when touch is not handled', () => {
      // Don't call touchstart first, so DDTouch.touchHandled remains false
      const mockTouchEvent = createMockTouchEvent('touchend', [], { changedTouches: [mockTouch] });
      touchend(mockTouchEvent);

      expect(mockUtils.simulateMouseEvent).not.toHaveBeenCalled();
    });

    it('should cancel the pending mouseleave when releasing over ourself', () => {
      startTouchDrag(mockTouch);
      mockDDManager.dragElement = {};
      pointerleave(createMockPointerEvent('pointerleave', 'touch')); // leave we get right before the release
      mockUtils.simulateMouseEvent.mockClear();

      touchend(createMockTouchEvent('touchend', [], { changedTouches: [mockTouch] }));
      vi.advanceTimersByTime(50);

      expect(mockUtils.simulateMouseEvent).not.toHaveBeenCalledWith(expect.anything(), 'mouseleave');
    });
  });

  describe('pointerdown', () => {
    let mockElement: HTMLElement;

    beforeEach(() => {
      mockElement = document.createElement('div');
      mockElement.releasePointerCapture = vi.fn();
    });

    it('should release pointer capture for touch events', () => {
      const mockPointerEvent = createMockPointerEvent('pointerdown', 'touch', { target: mockElement });

      pointerdown(mockPointerEvent);

      expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(1);
    });

    it('should release pointer capture for pen events', () => {
      const mockPointerEvent = createMockPointerEvent('pointerdown', 'pen', { target: mockElement });

      pointerdown(mockPointerEvent);

      expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(1);
    });

    it('should not release pointer capture for mouse events', () => {
      const mockPointerEvent = createMockPointerEvent('pointerdown', 'mouse', { target: mockElement });

      pointerdown(mockPointerEvent);

      expect(mockElement.releasePointerCapture).not.toHaveBeenCalled();
    });
  });

  describe('pointerenter', () => {
    it('should ignore pointerenter when no drag element', () => {
      mockDDManager.dragElement = null;
      const mockPointerEvent = createMockPointerEvent('pointerenter', 'touch');

      pointerenter(mockPointerEvent);

      expect(mockUtils.simulateMouseEvent).not.toHaveBeenCalled();
    });

    it('should ignore pointerenter for mouse events', () => {
      mockDDManager.dragElement = {};
      const mockPointerEvent = createMockPointerEvent('pointerenter', 'mouse');

      pointerenter(mockPointerEvent);

      expect(mockUtils.simulateMouseEvent).not.toHaveBeenCalled();
    });

    it('should simulate mouseenter for touch events when dragging', () => {
      mockDDManager.dragElement = {};
      const mockPointerEvent = createMockPointerEvent('pointerenter', 'touch');

      pointerenter(mockPointerEvent);

      expect(mockUtils.simulateMouseEvent).toHaveBeenCalledWith(mockPointerEvent, 'mouseenter');
    });

    it('should simulate mouseenter for pen events when dragging', () => {
      mockDDManager.dragElement = {};
      const mockPointerEvent = createMockPointerEvent('pointerenter', 'pen');

      pointerenter(mockPointerEvent);

      expect(mockUtils.simulateMouseEvent).toHaveBeenCalledWith(mockPointerEvent, 'mouseenter');
    });

    it('should prevent default on cancelable pointer events', () => {
      mockDDManager.dragElement = {};
      const mockPointerEvent = createMockPointerEvent('pointerenter', 'touch', { cancelable: true });

      pointerenter(mockPointerEvent);

      expect(mockPointerEvent.preventDefault).toHaveBeenCalled();
    });

    it('should not prevent default on non-cancelable pointer events', () => {
      mockDDManager.dragElement = {};
      const mockPointerEvent = createMockPointerEvent('pointerenter', 'touch', { cancelable: false });

      pointerenter(mockPointerEvent);

      expect(mockPointerEvent.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('pointerleave', () => {
    it('should ignore pointerleave when no drag element', () => {
      mockDDManager.dragElement = null;
      const mockPointerEvent = createMockPointerEvent('pointerleave', 'touch');

      pointerleave(mockPointerEvent);
      vi.advanceTimersByTime(50);

      expect(mockUtils.simulateMouseEvent).not.toHaveBeenCalled();
    });

    it('should ignore pointerleave for mouse events', () => {
      mockDDManager.dragElement = {};
      const mockPointerEvent = createMockPointerEvent('pointerleave', 'mouse');

      pointerleave(mockPointerEvent);
      vi.advanceTimersByTime(50);

      expect(mockUtils.simulateMouseEvent).not.toHaveBeenCalled();
    });

    it('should delay mouseleave simulation for touch events when dragging', () => {
      mockDDManager.dragElement = {};
      const mockPointerEvent = createMockPointerEvent('pointerleave', 'touch');

      pointerleave(mockPointerEvent);
      expect(mockUtils.simulateMouseEvent).not.toHaveBeenCalled(); // delayed so a release on ourself can cancel it

      vi.advanceTimersByTime(50);
      expect(mockUtils.simulateMouseEvent).toHaveBeenCalledWith(mockPointerEvent, 'mouseleave');
    });
  });
});