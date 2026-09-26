/**
 * #2666 - touch drag listener lifetime + iOS visible-viewport clipping
 */
import { Utils } from '../src/utils';

// force the touch code path (jsdom has no ontouchstart so isTouch is false by default)
vi.mock('../src/dd-touch', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/dd-touch')>();
  return { ...actual, isTouch: true };
});

describe('2666 touch drag >', () => {
  'use strict';

  it('un-binds the touch handlers it bound, on the same element', async () => {
    const { DDDraggable } = await import('../src/dd-draggable');
    const el = document.createElement('div');
    el.className = 'grid-stack-item';
    document.body.appendChild(el);

    const added: [string, unknown, unknown][] = [];
    const removed: [string, unknown, unknown][] = [];
    const origAdd = el.addEventListener.bind(el);
    const origRemove = el.removeEventListener.bind(el);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    el.addEventListener = ((t: string, f: any, o: any) => { added.push([t, f, o]); return origAdd(t, f, o); }) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    el.removeEventListener = ((t: string, f: any, o: any) => { removed.push([t, f, o]); return origRemove(t, f, o); }) as any;

    const dd = new DDDraggable(el, {});
    const down = new MouseEvent('mousedown', { button: 0, bubbles: true });
    Object.defineProperty(down, 'currentTarget', { value: el });
    Object.defineProperty(down, 'target', { value: el });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (dd as any)._mouseDown(down);

    const touchAdds = added.filter(([t]) => t.startsWith('touch') && t !== 'touchstart');
    expect(touchAdds.length).toBe(3); // touchmove, touchend, touchcancel

    // _mouseUp is a *document* handler, so its currentTarget is not `el` - it must still clean up `el`
    const up = new MouseEvent('mouseup', { bubbles: true });
    Object.defineProperty(up, 'currentTarget', { value: document });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (dd as any)._mouseUp(up);

    for (const [type, fn, opt] of touchAdds) {
      const match = removed.find(([t, f, o]) => t === type && f === fn && !!o === !!opt);
      expect(match, `${type} listener was never removed from the element it was added to`).toBeTruthy();
    }

    dd.destroy();
    document.body.removeChild(el);
  });

  it('getVisibleViewport() uses visualViewport (iOS bars/pinch-zoom) with innerHeight fallback', () => {
    const orig = window.visualViewport;
    Object.defineProperty(window, 'visualViewport', { value: { offsetTop: 30, height: 500 }, configurable: true });
    expect(Utils.getVisibleViewport()).toEqual({ top: 30, bottom: 530 });

    Object.defineProperty(window, 'visualViewport', { value: undefined, configurable: true });
    expect(Utils.getVisibleViewport()).toEqual({ top: 0, bottom: window.innerHeight });

    Object.defineProperty(window, 'visualViewport', { value: orig, configurable: true });
  });
});
