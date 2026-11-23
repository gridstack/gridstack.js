import { test, expect, Page, Locator } from '@playwright/test';
import path from 'node:path';

async function setup(page: Page, rtl: boolean, direction: string, width: number, sourceRtl?: boolean) {
  await page.setViewportSize({ width: 1500, height: 850 });
  await page.setContent(`<style>
    body { margin: 0; padding: 30px; }
    main { display: flex; direction: ltr; gap: 40px; margin-top: 140px; }
    .grid-stack { width: 600px; min-height: 400px; background: #eee; }
    .grid-stack-item-content { background: lightblue; }
    #sidebar { position: absolute; left: 30px; top: 30px; width: ${width * 100}px; height: 100px; background: lightblue; }
  </style>
  <div id="sidebar" class="grid-stack-item">Drag me</div>
  <main><div style="direction: ${direction}"><div id="target" class="grid-stack"></div></div>
  ${sourceRtl === undefined ? '' : '<div id="source" class="grid-stack"></div>'}</main>`);
  await page.addStyleTag({ path: path.resolve('dist/gridstack.css') });
  await page.addScriptTag({ path: path.resolve('dist/gridstack-all.js') });
  await page.evaluate(({ rtl, width, sourceRtl }) => {
    // GridStack emits a CustomEvent named dragstart, not an HTML5 DragEvent.
    // Keep Playwright's native-drag detector from waiting for a nonexistent native drag.
    window.addEventListener('dragstart', event => {
      if (event instanceof CustomEvent) event.stopImmediatePropagation();
    }, true);
    const w = window as any;
    const options = { column: 6, cellHeight: 100, minRow: 4, float: true, margin: 0, animate: false, acceptWidgets: true };
    w.grid = w.GridStack.init({ ...options, rtl }, '#target');
    if (sourceRtl === undefined) {
      w.GridStack.setupDragIn('#sidebar', { helper: 'clone' }, [{ id: 'incoming', w: width, h: 1, content: 'Dropped' }]);
    } else {
      w.source = w.GridStack.init({ ...options, rtl: sourceRtl }, '#source');
      w.source.load([{ id: 'incoming', x: 1, y: 0, w: width, h: 1, content: 'Transfer' }]);
    }
  }, { rtl, width, sourceRtl });
}

async function grab(page: Page, item: Locator, offset: number) {
  const box = (await item.boundingBox())!;
  await page.mouse.move(box.x + offset, box.y + 40);
  await page.mouse.down();
  await page.mouse.move(box.x + offset + 15, box.y + 45, { steps: 5 });
}

async function expectPosition(item: Locator, x: number, y: number, logicalX: number, width: number) {
  await expect(item).toHaveAttribute('gs-x', String(logicalX));
  await expect.poll(async () => (await item.boundingBox())!.x).toBeCloseTo(x, 0);
  const box = (await item.boundingBox())!;
  expect(box.y).toBeCloseTo(y, 0);
  expect(box.width).toBeCloseTo(width * 100, 0);
}

// The pointer is grabbed 30px from the physical left edge, not the center.
// x=0 is the rightmost cell in an RTL grid, regardless of the parent's direction.
for (const rtl of [false, true]) {
  for (const direction of ['ltr', 'rtl']) {
    for (const width of [1, 2]) {
      test(`sidebar drop: rtl=${rtl}, parent=${direction}, width=${width}`, async ({ page }) => {
        await setup(page, rtl, direction, width);
        const target = (await page.locator('#target').boundingBox())!;
        await grab(page, page.locator('#sidebar'), 30);
        await page.mouse.move(target.x + 130, target.y + 140, { steps: 20 });
        const placeholder = page.locator('#target .grid-stack-placeholder');
        await expectPosition(placeholder, target.x + 100, target.y + 100, rtl ? (width === 1 ? 4 : 3) : 1, width);
        await page.mouse.move(target.x + 330, target.y + 140, { steps: 20 });
        const finalX = rtl ? (width === 1 ? 2 : 1) : 3;
        await expectPosition(placeholder, target.x + 300, target.y + 100, finalX, width);
        await page.mouse.up();
        await expect(placeholder).toHaveCount(0);
        await expectPosition(page.locator('#target [gs-id="incoming"]'), target.x + 300, target.y + 100, finalX, width);
        expect(await page.evaluate(() => (window as any).grid.save(false).map(n => ({ ...n, w: n.w ?? 1, h: n.h ?? 1 })))).toEqual([
          expect.objectContaining({ id: 'incoming', x: finalX, y: 1, w: width, h: 1 })
        ]);
      });
    }
  }
}

for (const [sourceRtl, rtl] of [[false, true], [true, false], [true, true]]) {
  test(`cross-grid drop: rtl=${sourceRtl} -> ${rtl}`, async ({ page }) => {
    await setup(page, rtl, 'ltr', 2, sourceRtl);
    const target = (await page.locator('#target').boundingBox())!;
    await grab(page, page.locator('#source [gs-id="incoming"]'), 30);
    await page.mouse.move(target.x + 130, target.y + 140, { steps: 30 });
    const placeholder = page.locator('#target .grid-stack-placeholder');
    await expectPosition(placeholder, target.x + 100, target.y + 100, rtl ? 3 : 1, 2);
    await page.mouse.move(target.x + 330, target.y + 140, { steps: 20 });
    const finalX = rtl ? 1 : 3;
    await expectPosition(placeholder, target.x + 300, target.y + 100, finalX, 2);
    await page.mouse.up();
    await expectPosition(page.locator('#target [gs-id="incoming"]'), target.x + 300, target.y + 100, finalX, 2);
    expect(await page.evaluate(() => (window as any).source.save(false))).toEqual([]);
    expect(await page.evaluate(() => (window as any).grid.save(false).map(n => ({ ...n, w: n.w ?? 1, h: n.h ?? 1 })))).toEqual([
      expect.objectContaining({ id: 'incoming', x: finalX, y: 1, w: 2, h: 1 })
    ]);
  });
}

for (const rtl of [false, true]) {
  test(`internal drag keeps its coordinate convention: rtl=${rtl}`, async ({ page }) => {
    await setup(page, rtl, 'ltr', 2);
    await page.evaluate(() => (window as any).grid.load([{ id: 'internal', x: 1, y: 0, w: 2, h: 1 }]));
    const target = (await page.locator('#target').boundingBox())!;
    await grab(page, page.locator('#target [gs-id="internal"]'), 30);
    await page.mouse.move(target.x + 230, target.y + 140, { steps: 20 });
    const placeholder = page.locator('#target .grid-stack-placeholder');
    await expectPosition(placeholder, target.x + 200, target.y + 100, 2, 2);
    await page.mouse.up();
    await expectPosition(page.locator('#target [gs-id="internal"]'), target.x + 200, target.y + 100, 2, 2);
    expect(await page.evaluate(() => (window as any).grid.save(false).map(n => ({ ...n, w: n.w ?? 1, h: n.h ?? 1 })))).toEqual([
      expect.objectContaining({ id: 'internal', x: 2, y: 1, w: 2, h: 1 })
    ]);
  });
}
