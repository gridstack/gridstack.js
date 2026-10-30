import { test, expect } from '@playwright/test';
import path from 'node:path';

// a setupDragIn() source living inside a grid item starts its drag with the cursor already over the
// parent grid, which never got a mouseenter so it could not be dropped on until leaving & re-entering
test('drag-in source inside a grid item can drop directly on its parent grid', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 850 });
  await page.setContent(`<style>
    body { padding: 30px; }
    .grid-stack { width: 800px; background: #eee; }
    .grid-stack-item-content { background: lightblue; }
  </style><div id="main" class="grid-stack"></div>`);
  await page.addStyleTag({ path: path.resolve('dist/gridstack.css') });
  await page.addScriptTag({ path: path.resolve('dist/gridstack-all.js') });
  await page.evaluate(() => {
    const w = window as any;
    w.GridStack.renderCB = (el: HTMLElement, n: any) => { if (n.content) el.innerHTML = n.content; };
    w.grid = w.GridStack.init({
      cellHeight: 60, minRow: 6, acceptWidgets: true, animate: false,
      children: [
        { id: 'src', x: 0, y: 0, w: 3, h: 2, content: '<div class="sidebar-item grid-stack-item">Drag new widget</div>' },
        { id: 'sub', x: 4, y: 0, w: 4, h: 3, subGridOpts: { children: [{ content: 'a' }] } },
      ],
    }, '#main');
    w.GridStack.setupDragIn('.sidebar-item', undefined, [{ w: 2, h: 1, content: 'dropped' }]);
    w.drops = 0;
    w.grid.on('dropped', () => w.drops++);
  });

  // synthetic events: the cursor never leaves the main grid, so no (real) mouseenter is involved
  const src = (await page.locator('.sidebar-item').boundingBox())!;
  const main = (await page.locator('#main').boundingBox())!;
  const fire = (type: string, x: number, y: number) => page.evaluate(({ type, x, y }) => {
    const target = type === 'mousedown' ? document.querySelector('.sidebar-item')! : document;
    target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX: x, clientY: y }));
  }, { type, x, y });
  let x = src.x + 10, y = src.y + 10;
  await fire('mousedown', x, y);
  const endX = main.x + main.width - 100, endY = main.y + main.height - 60;
  for (let i = 1; i <= 10; i++) {
    await fire('mousemove', x + (endX - x) * i / 10, y + (endY - y) * i / 10);
  }
  await expect(page.locator('#main > .grid-stack-placeholder')).toHaveCount(1);
  await fire('mouseup', endX, endY);

  expect(await page.evaluate(() => (window as any).drops)).toBe(1);
  expect(await page.evaluate(() => (window as any).grid.engine.nodes.length)).toBe(3);
});
