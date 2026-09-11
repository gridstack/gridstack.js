/**
 * touch.ts 13.3.0
 * Copyright (c) 2021-2025 Alain Dumesny - see GridStack root license
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
    || (navigator.maxTouchPoints > 0 && window.matchMedia('(any-pointer: coarse)').matches)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    || (navigator as any).msMaxTouchPoints > 0
  );

/** ms to wait, while touching an item, before starting a drag - lets a quick swipe scroll the
 * page normally instead of always moving the widget (touch only, no mouse ambiguity - see #2781).
 * Keep this well under the browser's own long-press threshold (~500ms) so we arm - and start
 * swallowing `contextmenu` - before it tries to pop its context menu / selection callout. */
const touchDragDelay = 300;
/** max distance (px, added over x+y) a finger can move while we wait out `touchDragDelay` before we consider it a scroll instead */
const touchDelayMoveThreshold = 10;

export class DDTouch {
  /** set to true while we are handling touch dragging, to prevent accepting browser real mouse events (trusted:true) vs our simulated ones (trusted:false) */
  public static touchHandled?: boolean;
  public static pointerLeaveTimeout?: number;
  /** @internal timer waiting to see if the user pauses (drag) or moves/releases (scroll/tap) */
  public static touchDelayTimer?: number;
  /** @internal true right before we simulate the delayed mousedown, so DDDraggable knows to show the 'armed' drag feedback */
  public static wasDelayed?: boolean;
}

/** @internal used to swallow the browser long-press context menu once we've armed a touch drag */
function preventDefaultEvent(e: Event): void {
  e.preventDefault();
}

/**
 * @internal from the moment we arm (start wiggling) until the touch ends, swallow `contextmenu` so a
 * user holding longer than `touchDragDelay` doesn't lose the drag to the browser's long-press menu.
 * Note we can't just preventDefault() the touchstart: that is only allowed synchronously during its
 * dispatch, and doing it there would also kill the page scrolling we're trying to preserve.
 */
function suppressContextMenu(): void {
  // capture=true so we get a first crack at it
  document.addEventListener('contextmenu', preventDefaultEvent, true);
  document.addEventListener('selectstart', preventDefaultEvent, true); // what Safari long-press does instead
}

function restoreContextMenu(): void {
  document.removeEventListener('contextmenu', preventDefaultEvent, true);
  document.removeEventListener('selectstart', preventDefaultEvent, true);
}

/** cancels a pending delayed touch-drag (called on move/end/cancel while waiting) */
function cancelDelayedTouchStart(target: HTMLElement, onMove: (e: TouchEvent) => void, onEnd: (e: TouchEvent) => void): void {
  target.removeEventListener('touchmove', onMove);
  target.removeEventListener('touchend', onEnd);
  target.removeEventListener('touchcancel', onEnd);
  cancelPendingTouchDrag();
}

/** defensively clears any pending delayed touch-drag timer, e.g. when a draggable is disabled/destroyed mid-wait */
export function cancelPendingTouchDrag(): void {
  if (DDTouch.touchDelayTimer) {
    window.clearTimeout(DDTouch.touchDelayTimer);
    delete DDTouch.touchDelayTimer;
  }
  restoreContextMenu();
}

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
 * Handle the touchstart events - waits for `touchDragDelay` (a pause/long-press) before starting
 * the drag, so a quick swipe scrolls the page instead - see issue #2781
 * @param {Object} e The widget element's touchstart event
 */
export function touchstart(e: TouchEvent): void {
  // Ignore the event if another widget is already being handled
  if (DDTouch.touchHandled) return;

  // wait for the user to pause before treating this as a drag - bail out (letting the browser
  // scroll normally) if they release or move too far before the delay elapses.
  const target = e.currentTarget as HTMLElement;
  const startX = e.touches[0].clientX;
  const startY = e.touches[0].clientY;

  const onEnd = () => cancelDelayedTouchStart(target, onMove, onEnd);
  const onMove = (ev: TouchEvent) => {
    const t = ev.touches[0];
    if (Math.abs(t.clientX - startX) + Math.abs(t.clientY - startY) > touchDelayMoveThreshold) onEnd();
  };
  target.addEventListener('touchmove', onMove, { passive: true });
  target.addEventListener('touchend', onEnd, { passive: true });
  target.addEventListener('touchcancel', onEnd, { passive: true });

  DDTouch.touchDelayTimer = window.setTimeout(() => {
    cancelDelayedTouchStart(target, onMove, onEnd); // NOTE: also restores contextmenu, so suppress AFTER
    DDTouch.touchHandled = true;
    DDTouch.wasDelayed = true;
    suppressContextMenu();
    simulateMouseEvent(e, 'mousedown');
    delete DDTouch.wasDelayed; // consumed synchronously above - don't leak into the next gesture
  }, touchDragDelay);
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
 * Handle the touchend events - also used for `touchcancel` (browser aborting the gesture, which is
 * what we get if something still manages to pop a long-press menu over us) so we always clean up.
 * @param {Object} e The document's touchend event
 */
export function touchend(e: TouchEvent): void {

  // Ignore event if not handled
  if (!DDTouch.touchHandled) return;

  restoreContextMenu();

  // cancel delayed leave event when we release on ourself which happens BEFORE we get this!
  if (DDTouch.pointerLeaveTimeout) {
    window.clearTimeout(DDTouch.pointerLeaveTimeout);
    delete DDTouch.pointerLeaveTimeout;
  }

  const wasDragging = !!DDManager.dragElement;

  simulateMouseEvent(e, 'mouseup');

  // If the touch interaction did not move, it should trigger a click - but not when the browser
  // aborted the gesture on us (touchcancel), where no click is intended.
  if (!wasDragging && e.type !== 'touchcancel') {
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

