import { test, expect } from '@playwright/test';
import path from 'node:path';

for (const float of [false, true]) {
  test(`cancelled drag after leaving the grid restores the item and pushed nodes (float: ${float})`, async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 850 });
    await page.setContent(`<style>
      body { padding: 30px; }
      main { margin-top: 200px; }
      .grid-stack { width: 500px; min-height: 300px; }
      .grid-stack-item-content { background: lightblue; }
    </style><main><div id="grid" class="grid-stack"></div></main>`);
    await page.addStyleTag({ path: path.resolve('dist/gridstack.css') });
    await page.addScriptTag({ path: path.resolve('dist/gridstack-all.js') });
    await page.evaluate((float) => {
      const w = window as any;
      w.grid = w.GridStack.init({ column: 4, cellHeight: 100, minRow: 3, float, acceptWidgets: true, animate: false, margin: 6 }, '#grid');
      w.grid.load([{ id: 'a', x: 0, y: 0, w: 2, h: 1 }, { id: 'b', x: 2, y: 0, w: 2, h: 1 }]);
    }, float);
    const saved = () => page.evaluate(() => (window as any).grid.save(false));
    const initial = await saved();
    const card = page.locator('[gs-id="a"]');
    const original = (await card.boundingBox())!;
    const grid = (await page.locator('#grid').boundingBox())!;
    await page.mouse.move(original.x + original.width / 2, original.y + original.height / 2);
    await page.mouse.down();
    // over 'b' so it gets pushed out of the way...
    await page.mouse.move(original.x + original.width * 1.5, original.y + original.height / 2, { steps: 20 });
    await expect.poll(async () => (await saved()).find((n: any) => n.id === 'b')).not.toEqual(initial.find((n: any) => n.id === 'b'));
    // ...then out of the grid entirely (_leave), and cancel
    await page.mouse.move(grid.x + grid.width / 2, grid.y - 150, { steps: 20 });
    await expect(page.locator('.grid-stack-placeholder')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await page.mouse.up();
    expect(await saved()).toEqual(initial);
    const restored = (await card.boundingBox())!;
    expect(restored.x).toBeCloseTo(original.x, 0);
    expect(restored.y).toBeCloseTo(original.y, 0);
  });
}
