import { test, expect } from '@playwright/test';
import path from 'node:path';

test('cancelled cross-grid drag preserves the saved position after returning', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 850 });
  await page.setContent(`<style>
    body { padding: 30px; }
    main { display: flex; gap: 30px; margin-top: 150px; }
    .grid-stack { width: 500px; min-height: 300px; }
    .grid-stack-item-content { background: lightblue; }
  </style><main><div id="left" class="grid-stack"></div><div id="right" class="grid-stack"></div></main>`);
  await page.addStyleTag({ path: path.resolve('dist/gridstack.css') });
  await page.addScriptTag({ path: path.resolve('dist/gridstack-all.js') });
  await page.evaluate(() => {
    const w = window as any;
    const options = { column: 4, cellHeight: 100, minRow: 3, float: true, acceptWidgets: true, animate: false, margin: 6 };
    w.grids = [w.GridStack.init(options, '#left'), w.GridStack.init(options, '#right')];
    w.grids[0].load([{ id: 'a', x: 0, y: 0, w: 2, h: 1 }, { id: 'b', x: 2, y: 1, w: 1, h: 1 }]);
    w.grids[1].load([{ id: 'c', x: 0, y: 1, w: 2, h: 1 }]);
    w.drops = 0;
    w.grids.forEach(g => g.on('dropped', () => w.drops++));
  });
  const saved = () => page.evaluate(() => (window as any).grids.map(g => g.save(false)));
  const initial = await saved();
  const card = page.locator('[gs-id="a"]');
  const original = (await card.boundingBox())!;
  const right = (await page.locator('#right').boundingBox())!;
  const left = (await page.locator('#left').boundingBox())!;
  await page.mouse.move(original.x + original.width / 2, original.y + original.height / 2);
  await page.mouse.down();
  await page.mouse.move(original.x + original.width / 2 + 25, original.y + original.height / 2 + 5, { steps: 10 });
  await page.mouse.move(right.x + 150, right.y + 150, { steps: 20 });
  await expect(page.locator('#right .grid-stack-placeholder')).toHaveCount(1);
  await page.mouse.move(left.x + 220, left.y + 20, { steps: 20 });
  await expect(page.locator('#left .grid-stack-placeholder')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await page.mouse.up();
  await expect(page.locator('.grid-stack-placeholder')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).drops)).toBe(0);
  expect(await saved()).toEqual(initial);
  await page.evaluate(() => (window as any).grids.forEach(g => g.load(g.save(false))));
  expect(await saved()).toEqual(initial);
  const restored = (await card.boundingBox())!;
  expect(restored.x).toBeCloseTo(original.x, 0);
  expect(restored.y).toBeCloseTo(original.y, 0);
});
