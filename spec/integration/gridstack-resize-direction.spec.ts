import { GridStack } from '../../src/gridstack';
import type { GridStackMouseEvent, DDUIData } from '../../src/types';

// Regression test for https://github.com/gridstack/gridstack.js/issues/3230
// "Horizontal resize unexpectedly changes height when using very high column count and small cellHeight"
//
// _dragOrResize() used to re-derive BOTH w and h from the resize helper's pixel size on every
// 'resize' move event, regardless of which handle was actually being dragged. The dimension the
// user isn't touching is supposed to stay constant in pixels, but re-deriving it via
// Math.round(px / cellSize) is lossy: any subpixel/rounding noise in the measured pixel value can
// flip it by a whole row/column once cellHeight (or cellWidth) is only a few pixels, which is
// exactly the "column: 1000, cellHeight: 1" setup from the issue.
describe('GridStack resize direction isolation (#3230)', () => {
  it('does not change height when only the horizontal (w) handle is dragged', () => {
    document.body.innerHTML = `
      <div class="grid-stack">
        <div class="grid-stack-item" gs-x="0" gs-y="0" gs-w="10" gs-h="10">
          <div class="grid-stack-item-content">item</div>
        </div>
      </div>
    `;
    const grid = GridStack.init({ cellHeight: 1, margin: 3 });
    const node = grid.engine.nodes[0];
    const el = node.el!;

    const cellWidth = 1;
    const cellHeight = 1;

    // simulate dragging only the 'w' (west/left) resize handle
    const event = {
      type: 'resize',
      target: el,
      resizeDir: 'w',
      hasMovedX: true,
      hasMovedY: false,
    } as unknown as GridStackMouseEvent;

    // height carries subpixel rounding noise (10.5 instead of an exact 10) even though the 'w'
    // handle never touches height - DDResizable leaves it as the untouched original pixel height
    const ui = {
      position: { top: 0, left: 2 },
      size: { width: 8, height: 10.5 },
    } as DDUIData;

    (grid as unknown as { _dragOrResize: (...args: unknown[]) => void })
      ._dragOrResize(el, event, ui, node, cellWidth, cellHeight);

    expect(node.w).toBe(8); // the dragged dimension updates correctly
    expect(node.h).toBe(10); // the untouched dimension must not drift because of pixel rounding noise
  });
});
