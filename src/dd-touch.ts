/**
 * touch.ts 12.1.0-dev
 * Copyright (c) 2021-2024 Alain Dumesny - see GridStack root license
 */

import { DDManager } from './dd-manager';
import { Utils } from './utils';

/**
 * Detect touch support - Windows Surface devices and other touch devices
 * should we use this instead ? (what we had for always showing resize handles)
 * /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
 */
export const isTouch: boolean = typeof window !== 'undefined' && typeof document !== 'undefined' &&
  ( 'ontouchstart' in document
    || 'ontouchstart' in window
    // || !!window.TouchEvent // true on Windows 10 Chrome desktop so don't use this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    || ((window as any).DocumentTouch && document instanceof (window as any).DocumentTouch)
    || navigator.maxTouchPoints > 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    || (navigator as any).msMaxTouchPoints > 0
  );

// interface TouchCoord {x: number, y: number};

class DDTouch {
  public static touchHandled: boolean;
  public static pointerLeaveTimeout: number;
}

/**
* Get the x,y position of a touch event
*/
// function getTouchCoords(e: TouchEvent): TouchCoord {
//   return {
//     x: e.changedTouches[0].pageX,
//     y: e.changedTouches[0].pageY
//   };
// }

/**
 * Simulate a mouse event based on a corresponding touch event
 * @param {Object} e A touch event
 * @param {String} simulatedType The corresponding mouse event
 */
function simulateMouseEvent(e: TouchEvent, simulatedType: string) {

  // Ignore multi-touch events
  if (e.touches.length > 1) return;

  // Prevent "Ignored attempt to cancel a touchmove event with cancelable=false" errors
  if (e.cancelable) e.preventDefault();

  // Dispatch the simulated event to the target element
  Utils.simulateMouseEvent(e.changedTouches[0], simulatedType);
}

/**
 * Simulate a mouse event based on a corresponding Pointer event
 * @param {Object} e A pointer event
 * @param {String} simulatedType The corresponding mouse event
 */
function simulatePointerMouseEvent(e: PointerEvent, simulatedType: string) {

  // Prevent "Ignored attempt to cancel a touchmove event with cancelable=false" errors
  if (e.cancelable) e.preventDefault();

  // Dispatch the simulated event to the target element
  Utils.simulateMouseEvent(e, simulatedType);
}


/**
 * Handle the touchstart events
 * @param {Object} e The widget element's touchstart event
 */
export function touchstart(e: TouchEvent): void {
  // Ignore the event if another widget is already being handled
  if (DDTouch.touchHandled) return;
  DDTouch.touchHandled = true;

  // Simulate the mouse events
  // simulateMouseEvent(e, 'mouseover');
  // simulateMouseEvent(e, 'mousemove');
  simulateMouseEvent(e, 'mousedown');
}

/**
 * Handle the touchmove events
 * @param {Object} e The document's touchmove event
 */
export function touchmove(e: TouchEvent): void {
  // Ignore event if not handled by us
  if (!DDTouch.touchHandled) return;

  simulateMouseEvent(e, 'mousemove');
}

/**
 * Handle the touchend events
 * @param {Object} e The document's touchend event
 */
export function touchend(e: TouchEvent): void {

  // Ignore event if not handled
  if (!DDTouch.touchHandled) return;

  // cancel delayed leave event when we release on ourself which happens BEFORE we get this!
  if (DDTouch.pointerLeaveTimeout) {
    window.clearTimeout(DDTouch.pointerLeaveTimeout);
    delete DDTouch.pointerLeaveTimeout;
  }

  const wasDragging = !!DDManager.dragElement;

  // Simulate the mouseup event
  simulateMouseEvent(e, 'mouseup');
  // simulateMouseEvent(event, 'mouseout');

  // If the touch interaction did not move, it should trigger a click
  if (!wasDragging) {
    simulateMouseEvent(e, 'click');
  }

  // Unset the flag to allow other widgets to inherit the touch event
  DDTouch.touchHandled = false;
}

/**
 * Note we don't get touchenter/touchleave (which are deprecated)
 * see https://stackoverflow.com/questions/27908339/js-touch-equivalent-for-mouseenter
 * so instead of PointerEvent to still get enter/leave and send the matching mouse event.
 */
export function pointerdown(e: PointerEvent): void {
  // console.log("pointer down")
  if (e.pointerType === 'mouse') return;
  (e.target as HTMLElement).releasePointerCapture(e.pointerId) // <- Important!
}

export function pointerenter(e: PointerEvent): void {
  // ignore the initial one we get on pointerdown on ourself
  if (!DDManager.dragElement) {
    // console.log('pointerenter ignored');
    return;
  }
  // console.log('pointerenter');
  if (e.pointerType === 'mouse') return;
  simulatePointerMouseEvent(e, 'mouseenter');
}

export function pointerleave(e: PointerEvent): void {
  // ignore the leave on ourself we get before releasing the mouse over ourself
  // by delaying sending the event and having the up event cancel us
  if (!DDManager.dragElement) {
    // console.log('pointerleave ignored');
    return;
  }
  if (e.pointerType === 'mouse') return;
  DDTouch.pointerLeaveTimeout = window.setTimeout(() => {
    delete DDTouch.pointerLeaveTimeout;
    // console.log('pointerleave delayed');
    simulatePointerMouseEvent(e, 'mouseleave');
  }, 10);
}

