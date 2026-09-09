import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { useState } from "react";
import type { GridHTMLElement, GridItemHTMLElement, GridStack as GridStackInstance } from "gridstack";
import type { GridStackWidget } from "gridstack";
import { GridStack } from "./src/gridstack";
import { useWidgetSerializer } from "./src/hooks";

function flush(): Promise<void> {
  return new Promise((r) => {
    setTimeout(r, 0);
  });
}

/**
 * Replicates the DOM/engine bookkeeping GS core does in the `drop` handler when an
 * item is dragged from one live grid into another (gridstack.ts `.on(this.el, 'drop', ...)`):
 * the item element is reused via `appendChild` (no `addRemoveCB` call) and the node object
 * is moved from one engine's node list to the other's. Used to reproduce cross-grid DnD
 * without driving the real pointer-based drag/drop implementation through jsdom.
 */
function simulateCrossGridDrop(from: GridStackInstance, to: GridStackInstance, el: GridItemHTMLElement) {
  const node = el.gridstackNode!;
  const f = from as unknown as { engine: { nodes: unknown[]; removedNodes: unknown[]; removeNodeFromLayoutCache(n: unknown): void }; _triggerRemoveEvent(): unknown; _triggerChangeEvent(): unknown };
  const t = to as unknown as { engine: { nodes: unknown[]; addedNodes: unknown[] }; el: HTMLElement; _triggerAddEvent(): unknown; _triggerChangeEvent(): unknown };

  f.engine.removeNodeFromLayoutCache(node);
  f.engine.nodes = f.engine.nodes.filter((n) => n !== node);
  f.engine.removedNodes.push(node);
  f._triggerRemoveEvent();
  f._triggerChangeEvent();

  node.grid = to;
  t.engine.nodes.push(node);
  t.el.appendChild(el);
  t.engine.addedNodes.push(node);
  t._triggerAddEvent();
  t._triggerChangeEvent();
}

function Num({ start }: { start: number }) {
  const [n] = useState(start);
  useWidgetSerializer({ serialize: () => ({ extra: n }) });
  return <span data-testid="num">{n}</span>;
}

describe("GridStack React wrapper", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("renders component mode into .grid-stack-item-content via portal", async () => {
    await act(async () => {
      root.render(
        <GridStack
          options={{
            column: 12,
            cellHeight: 50,
            margin: 0,
            children: [
              {
                id: "a",
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                component: "T",
                props: { label: "hello" },
              },
            ],
          }}
          components={{
            T: (p: Record<string, unknown>) => (
              <span data-testid="portal">{String(p.label ?? "")}</span>
            ),
          }}
        />
      );
    });
    await act(flush);
    expect(document.querySelector("[data-testid=\"portal\"]")?.textContent).toBe(
      "hello"
    );
  });

  it("save() merges useWidgetSerializer into widget props", async () => {
    await act(async () => {
      root.render(
        <GridStack
          options={{
            column: 12,
            cellHeight: 50,
            margin: 0,
            children: [
              {
                id: "c1",
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                component: "Num",
                props: { start: 7 },
              },
            ],
          }}
          components={{
            Num: (p: Record<string, unknown>) => (
              <Num start={Number(p.start ?? 0)} />
            ),
          }}
        />
      );
    });
    await act(flush);

    const gridEl = container.querySelector(".grid-stack") as GridHTMLElement;
    const g = gridEl?.gridstack;
    expect(g).toBeTruthy();
    const saved = g!.save(true, false) as GridStackWidget[];
    const w = saved.find((n) => String(n.id) === "c1");
    expect(w?.props?.extra).toBe(7);
  });

  it("supports two sibling grids", async () => {
    await act(async () => {
      root.render(
        <>
          <GridStack
            options={{ column: 12, cellHeight: 40, margin: 0, children: [] }}
            components={{}}
          />
          <GridStack
            options={{ column: 6, cellHeight: 40, margin: 0, children: [] }}
            components={{}}
          />
        </>
      );
    });
    await act(flush);
    expect(container.querySelectorAll(".grid-stack").length).toBe(2);
  });

  it("keeps React host chrome outside the .grid-stack root (no overlap with items)", async () => {
    await act(async () => {
      root.render(
        <GridStack
          options={{ column: 12, cellHeight: 40, margin: 0, children: [] }}
          components={{}}
        >
          <div data-testid="host-chrome">toolbar</div>
        </GridStack>
      );
    });
    await act(flush);
    const chrome = container.querySelector("[data-testid=\"host-chrome\"]");
    const stack = container.querySelector(".grid-stack");
    expect(chrome).toBeTruthy();
    expect(stack).toBeTruthy();
    expect(stack?.contains(chrome)).toBe(false);
  });

  it("unmount destroys without throwing", async () => {
    await act(async () => {
      root.render(
        <GridStack
          options={{
            column: 12,
            cellHeight: 40,
            children: [
              {
                id: "x",
                x: 0,
                y: 0,
                w: 1,
                h: 1,
                component: "T",
                props: { t: "x" },
              },
            ],
          }}
          components={{
            T: (p: Record<string, unknown>) => (
              <span>{String(p.t ?? "")}</span>
            ),
          }}
        />
      );
    });
    await act(flush);
    await act(async () => {
      root.render(<div />);
    });
    await act(flush);
    expect(container.querySelector(".grid-stack")).toBeNull();
  });

  it("keeps component content rendered after cross-grid drag & drop (#3371)", async () => {
    const T = (p: Record<string, unknown>) => (
      <span data-testid="portal">{String(p.label ?? "")}</span>
    );

    await act(async () => {
      root.render(
        <>
          <GridStack
            options={{
              column: 12,
              cellHeight: 50,
              margin: 0,
              acceptWidgets: true,
              children: [
                { id: "a1", x: 0, y: 0, w: 2, h: 2, component: "T", props: { label: "hello" } },
              ],
            }}
            components={{ T }}
          />
          <GridStack
            options={{ column: 12, cellHeight: 50, margin: 0, acceptWidgets: true, children: [] }}
            components={{ T }}
          />
        </>
      );
    });
    await act(flush);

    expect(document.querySelector("[data-testid=\"portal\"]")?.textContent).toBe("hello");

    const [gridElA, gridElB] = Array.from(
      container.querySelectorAll(".grid-stack")
    ) as GridHTMLElement[];
    const gridA = gridElA.gridstack!;
    const gridB = gridElB.gridstack!;
    const itemEl = gridElA.querySelector(".grid-stack-item") as GridItemHTMLElement;

    await act(async () => {
      simulateCrossGridDrop(gridA, gridB, itemEl);
    });
    await act(flush);

    // The item's DOM element physically moved into grid B's container...
    expect(gridElB.contains(itemEl)).toBe(true);
    // ...and its React-rendered content must have followed, not been unmounted.
    expect(document.querySelector("[data-testid=\"portal\"]")?.textContent).toBe("hello");
  });
});
