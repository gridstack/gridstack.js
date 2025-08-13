import { test, expect } from '@playwright/test';

test.describe('GridStack E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the test page
    await page.goto('/e2e/fixtures/gridstack-with-height.html');
    
    // Wait for GridStack to initialize
    await page.waitForFunction(() => window.testReady === true);
    await page.waitForSelector('.grid-stack-item', { state: 'visible' });
  });

  test('should not throw exceptions when dragging widget outside the grid', async ({ page }) => {
    // Clear any existing console messages
    await page.evaluate(() => window.clearConsoleMessages());
    
    // Get the widget and grid container
    const widget = page.locator('#item-1 .grid-stack-item-content');
    const gridContainer = page.locator('#grid');
    const outsideArea = page.locator('#outside-area');
    
    // Verify widget is initially visible
    await expect(widget).toBeVisible();
    
    // Get initial positions
    const widgetBox = await widget.boundingBox();
    const gridBox = await gridContainer.boundingBox();
    const outsideBox = await outsideArea.boundingBox();
    
    expect(widgetBox).toBeTruthy();
    expect(gridBox).toBeTruthy();
    expect(outsideBox).toBeTruthy();
    
    // Perform drag operation from widget to outside area
    await page.mouse.move(widgetBox!.x + widgetBox!.width / 2, widgetBox!.y + widgetBox!.height / 2);
    await page.mouse.down();
    
    // Move to outside area
    await page.mouse.move(outsideBox!.x + outsideBox!.width / 2, outsideBox!.y + outsideBox!.height / 2, { steps: 10 });
    await page.mouse.up();
    
    // Wait a bit for any async operations
    await page.waitForTimeout(500);
    
    // Check for console errors
    const consoleMessages = await page.evaluate(() => window.getConsoleMessages());
    const errors = consoleMessages.filter((msg: any) => msg.type === 'error');
    
    // Should not have any console errors
    expect(errors).toHaveLength(0);
    
    // Widget should still exist in the DOM (even if moved back to grid)
    await expect(widget).toBeVisible();
  });

  test('should handle drag and drop within grid correctly', async ({ page }) => {
    await page.evaluate(() => window.clearConsoleMessages());
    
    const item1 = page.locator('#item-1 .grid-stack-item-content');
    const item2 = page.locator('#item-2 .grid-stack-item-content');
    
    // Get initial positions
    const item1Box = await item1.boundingBox();
    const item2Box = await item2.boundingBox();
    
    expect(item1Box).toBeTruthy();
    expect(item2Box).toBeTruthy();
    
    // Drag item 1 to where item 2 is
    await page.mouse.move(item1Box!.x + item1Box!.width / 2, item1Box!.y + item1Box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(item2Box!.x + item2Box!.width / 2, item2Box!.y + item2Box!.height / 2, { steps: 10 });
    await page.mouse.up();
    
    // Wait for grid to settle
    await page.waitForTimeout(500);
    
    // Check that grid events were fired
    const consoleMessages = await page.evaluate(() => window.getConsoleMessages());
    const hasGridEvents = consoleMessages.some((msg: any) => 
      msg.message.includes('Grid event:') || msg.message.includes('Drag')
    );
    
    expect(hasGridEvents).toBe(true);
    
    // Should not have any errors
    const errors = consoleMessages.filter((msg: any) => msg.type === 'error');
    expect(errors).toHaveLength(0);
  });

  test('should validate auto-positioning HTML page', async ({ page }) => {
    // Navigate to the auto-positioning test
    await page.goto('/spec/e2e/html/1017-items-no-x-y-for-autoPosition.html');
    
    // Wait for GridStack to initialize
    await page.waitForSelector('.grid-stack-item', { state: 'visible' });
    await page.waitForFunction(() => typeof window.GridStack !== 'undefined');
    
    // Get all grid items
    const items = await page.locator('.grid-stack-item').all();
    expect(items).toHaveLength(5);
    
    // Check that item 5 is positioned at x=1, y=1 (it has explicit position)
    const item5 = page.locator('[gs-id="5"]');
    await expect(item5).toBeVisible();
    
    // Check that all items are visible and positioned
    for (let i = 1; i <= 5; i++) {
      const item = page.locator(`[gs-id="${i}"]`);
      await expect(item).toBeVisible();
      
      // Get computed position via data attributes
      const gsX = await item.getAttribute('gs-x');
      const gsY = await item.getAttribute('gs-y');
      
      // Items should have valid positions (not null/undefined)
      // Item 5 should maintain its explicit position
      if (i === 5) {
        expect(gsX).toBe('1');
        expect(gsY).toBe('1');
      }
    }
    
    // Verify no items overlap by checking their computed positions
    const gridInfo = await page.evaluate(() => {
      const gridEl = document.querySelector('.grid-stack');
      if (!gridEl || !window.GridStack) return null;
      
      const gridInstance = (window as any).GridStack.getGrids()[0];
      if (!gridInstance) return null;
      
      return {
        nodes: gridInstance.engine.nodes.map((node: any) => ({
          id: node.id,
          x: node.x,
          y: node.y,
          w: node.w,
          h: node.h
        }))
      };
    });
    
    expect(gridInfo).toBeTruthy();
    expect(gridInfo!.nodes).toHaveLength(5);
    
    // Verify no overlaps
    const nodes = gridInfo!.nodes;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        
        // Check if rectangles overlap
        const overlap = !(
          a.x + a.w <= b.x ||
          b.x + b.w <= a.x ||
          a.y + a.h <= b.y ||
          b.y + b.h <= a.y
        );
        
        expect(overlap).toBe(false);
      }
    }
  });

  test('should handle responsive behavior', async ({ page }) => {
    await page.goto('/e2e/fixtures/gridstack-with-height.html');
    await page.waitForFunction(() => window.testReady === true);
    
    // Test different viewport sizes
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(100);
    
    let gridWidth = await page.locator('#grid').evaluate(el => el.offsetWidth);
    expect(gridWidth).toBeGreaterThan(800);
    
    // Test mobile viewport
    await page.setViewportSize({ width: 400, height: 600 });
    await page.waitForTimeout(100);
    
    gridWidth = await page.locator('#grid').evaluate(el => el.offsetWidth);
    expect(gridWidth).toBeLessThan(500);
    
    // Grid should still be functional
    const items = await page.locator('.grid-stack-item').all();
    expect(items.length).toBeGreaterThan(0);
    
    for (const item of items) {
      await expect(item).toBeVisible();
    }
  });

  test('getCellFromPixel should return correct coordinates', async ({ page }) => {
    await page.goto('/e2e/fixtures/gridstack-with-height.html');
    await page.waitForFunction(() => window.testReady === true);
    
    // Test getCellFromPixel with real browser layout
    const result = await page.evaluate(() => {
      const gridEl = document.querySelector('.grid-stack');
      if (!gridEl || !window.GridStack) return null;
      
      const gridInstance = (window as any).GridStack.getGrids()[0];
      if (!gridInstance) return null;
      
      const rect = gridEl.getBoundingClientRect();
      const cellHeight = 80;
      const smudge = 5;
      
      // Test pixel at column 4, row 5
      const pixel = {
        left: 4 * rect.width / 12 + rect.x + smudge, 
        top: 5 * cellHeight + rect.y + smudge
      };
      
      const cell = gridInstance.getCellFromPixel(pixel);
      
      return {
        cell,
        rectWidth: rect.width,
        rectHeight: rect.height,
        pixel
      };
    });
    
    expect(result).toBeTruthy();
    
    // Verify we got realistic dimensions (not 0 like in jsdom)
    expect(result!.rectWidth).toBeGreaterThan(0);
    expect(result!.rectHeight).toBeGreaterThan(0);
    
    // Verify pixel coordinates are calculated correctly
    expect(result!.cell.x).toBe(4);
    expect(result!.cell.y).toBe(5);
  });

  test('cellWidth should return correct calculation', async ({ page }) => {
    await page.goto('/e2e/fixtures/gridstack-with-height.html');
    await page.waitForFunction(() => window.testReady === true);
    
    // Test cellWidth calculation with real browser layout
    const result = await page.evaluate(() => {
      const gridEl = document.querySelector('.grid-stack');
      if (!gridEl || !window.GridStack) return null;
      
      const gridInstance = (window as any).GridStack.getGrids()[0];
      if (!gridInstance) return null;
      
      const offsetWidth = gridEl.offsetWidth;
      const cellWidth = gridInstance.cellWidth();
      const expectedWidth = offsetWidth / 12; // Default 12 columns
      
      return {
        offsetWidth,
        cellWidth,
        expectedWidth,
        match: Math.abs(cellWidth - expectedWidth) < 0.1 // Allow small floating point differences
      };
    });
    
    expect(result).toBeTruthy();
    
    // Verify we got realistic dimensions
    expect(result!.offsetWidth).toBeGreaterThan(0);
    expect(result!.cellWidth).toBeGreaterThan(0);
    
    // Verify calculation is correct
    expect(result!.match).toBe(true);
    expect(result!.cellWidth).toBeCloseTo(result!.expectedWidth, 1);
  });

  test('cellHeight should affect computed styles', async ({ page }) => {
    await page.goto('/e2e/fixtures/gridstack-with-height.html');
    await page.waitForFunction(() => window.testReady === true);
    
    // Test cellHeight with real browser layout
    const result = await page.evaluate(() => {
      const gridEl = document.querySelector('.grid-stack');
      if (!gridEl || !window.GridStack) return null;
      
      const gridInstance = (window as any).GridStack.getGrids()[0];
      if (!gridInstance) return null;
      
      const initialHeight = gridInstance.getCellHeight();
      const rows = parseInt(gridEl.getAttribute('gs-current-row') || '0');
      const computedHeight = parseInt(getComputedStyle(gridEl)['height']);
      
      // Change cell height
      gridInstance.cellHeight(120);
      const newHeight = gridInstance.getCellHeight();
      const newComputedHeight = parseInt(getComputedStyle(gridEl)['height']);
      
      return {
        initialHeight,
        rows,
        computedHeight,
        newHeight,
        newComputedHeight,
        expectedInitial: rows * initialHeight,
        expectedNew: rows * 120
      };
    });
    
    expect(result).toBeTruthy();
    
    // Verify initial setup
    expect(result!.initialHeight).toBeGreaterThan(0);
    expect(result!.computedHeight).toBeCloseTo(result!.expectedInitial, 10); // Allow some margin for CSS differences
    
    // Verify height change
    expect(result!.newHeight).toBe(120);
    expect(result!.newComputedHeight).toBeCloseTo(result!.expectedNew, 10);
  });

  test('stylesheet should persist through DOM detach/attach', async ({ page }) => {
    await page.goto('/e2e/fixtures/gridstack-with-height.html');
    await page.waitForFunction(() => window.testReady === true);
    
    // Test that CSS styles persist when grid DOM is detached and reattached
    const result = await page.evaluate(() => {
      const gridEl = document.querySelector('.grid-stack');
      if (!gridEl || !window.GridStack) return null;
      
      const gridInstance = (window as any).GridStack.getGrids()[0];
      if (!gridInstance) return null;
      
      // Update cell height to 30px to match original test
      gridInstance.cellHeight(30);
      
      // Get initial computed height of first item (should be 2 * 30 = 60px)
      const item1 = gridEl.querySelector('#item-1') || gridEl.querySelector('.grid-stack-item');
      if (!item1) return null;
      
      const initialHeight = window.getComputedStyle(item1).height;
      
      // Detach and reattach the grid container
      const container = gridEl.parentElement;
      const oldParent = container?.parentElement;
      
      if (!container || !oldParent) return null;
      
      container.remove();
      oldParent.appendChild(container);
      
      // Get height after detach/reattach
      const finalHeight = window.getComputedStyle(item1).height;
      
      return {
        initialHeight,
        finalHeight,
        match: initialHeight === finalHeight
      };
    });
    
    expect(result).toBeTruthy();
    
    // Verify heights are calculated correctly and persist
    expect(result!.initialHeight).toBe('60px'); // 2 rows * 30px cellHeight
    expect(result!.finalHeight).toBe('60px');
    expect(result!.match).toBe(true);
  });
});
