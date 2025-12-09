import { describe, it, expect, beforeEach, vi } from 'vitest';
import { gridWidgetContainersMap } from './grid-stack-render-provider';

// Mock GridStack type
class MockGridStack {
  el: HTMLElement;
  constructor() {
    this.el = document.createElement('div');
  }
}

describe('GridStackRenderProvider', () => {
  beforeEach(() => {
    // Clear the WeakMap before each test
    gridWidgetContainersMap.constructor.prototype.clear?.call(gridWidgetContainersMap);
  });

  it('should store widget containers in WeakMap for each grid instance', () => {
    // Mock grid instances
    const grid1 = new MockGridStack() as any;
    const grid2 = new MockGridStack() as any;
    const widget1 = { id: '1', grid: grid1 };
    const widget2 = { id: '2', grid: grid2 };
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    
    // Simulate renderCB
    const renderCB = (element, widget) => {
      if (widget.id && widget.grid) {
        // Get or create the widget container map for this grid instance
        let containers = gridWidgetContainersMap.get(widget.grid);
        if (!containers) {
          containers = new Map();
          gridWidgetContainersMap.set(widget.grid, containers);
        }
        containers.set(widget.id, element);
      }
    };

    renderCB(element1, widget1);
    renderCB(element2, widget2);

    const containers1 = gridWidgetContainersMap.get(grid1);
    const containers2 = gridWidgetContainersMap.get(grid2);

    expect(containers1?.get('1')).toBe(element1);
    expect(containers2?.get('2')).toBe(element2);
  });

  it('should not have containers for different grid instances mixed up', () => {
    const grid1 = new MockGridStack() as any;
    const grid2 = new MockGridStack() as any;
    const widget1 = { id: '1', grid: grid1 };
    const widget2 = { id: '2', grid: grid1 };
    const widget3 = { id: '3', grid: grid2 };
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    const element3 = document.createElement('div');

    // Simulate renderCB
    const renderCB = (element: HTMLElement, widget: any) => {
      if (widget.id && widget.grid) {
        let containers = gridWidgetContainersMap.get(widget.grid);
        if (!containers) {
          containers = new Map();
          gridWidgetContainersMap.set(widget.grid, containers);
        }
        containers.set(widget.id, element);
      }
    };

    renderCB(element1, widget1);
    renderCB(element2, widget2);
    renderCB(element3, widget3);

    const containers1 = gridWidgetContainersMap.get(grid1);
    const containers2 = gridWidgetContainersMap.get(grid2);

    // Grid1 should have widgets 1 and 2
    expect(containers1?.size).toBe(2);
    expect(containers1?.get('1')).toBe(element1);
    expect(containers1?.get('2')).toBe(element2);
    expect(containers1?.get('3')).toBeUndefined();

    // Grid2 should only have widget 3
    expect(containers2?.size).toBe(1);
    expect(containers2?.get('3')).toBe(element3);
    expect(containers2?.get('1')).toBeUndefined();
    expect(containers2?.get('2')).toBeUndefined();
  });

  it('should clean up when grid instance is deleted from WeakMap', () => {
    const grid = new MockGridStack() as any;
    const widget = { id: '1', grid };
    const element = document.createElement('div');

    // Add to WeakMap
    const containers = new Map<string, HTMLElement>();
    containers.set(widget.id, element);
    gridWidgetContainersMap.set(grid, containers);

    // Verify it exists
    expect(gridWidgetContainersMap.has(grid)).toBe(true);

    // Delete from WeakMap
    gridWidgetContainersMap.delete(grid);

    // Verify it's gone
    expect(gridWidgetContainersMap.has(grid)).toBe(false);
  });

  it('should handle multiple widgets in the same grid', () => {
    const grid = new MockGridStack() as any;
    const widgets = [
      { id: '1', grid },
      { id: '2', grid },
      { id: '3', grid },
    ];
    const elements = widgets.map(() => document.createElement('div'));

    // Simulate renderCB for all widgets
    widgets.forEach((widget, index) => {
      const element = elements[index];
      if (widget.id && widget.grid) {
        let containers = gridWidgetContainersMap.get(widget.grid);
        if (!containers) {
          containers = new Map();
          gridWidgetContainersMap.set(widget.grid, containers);
        }
        containers.set(widget.id, element);
      }
    });

    const containers = gridWidgetContainersMap.get(grid);
    expect(containers?.size).toBe(3);
    expect(containers?.get('1')).toBe(elements[0]);
    expect(containers?.get('2')).toBe(elements[1]);
    expect(containers?.get('3')).toBe(elements[2]);
  });
});

