/**
 * gridstack-item.component.ts 12.4.2
 * Copyright (c) 2022-2024 Alain Dumesny - see GridStack root license
 */

import { Component, ElementRef, Input, ViewChild, ViewContainerRef, OnDestroy, ComponentRef } from '@angular/core';
import { GridItemHTMLElement, GridStackNode } from 'gridstack';
import { BaseWidget } from './base-widget';

/**
 * Extended HTMLElement interface for grid items.
 * Stores a back-reference to the Angular component for integration.
 */
export interface GridItemCompHTMLElement extends GridItemHTMLElement {
  /** Back-reference to the Angular GridStackItem component */
  _gridItemComp?: GridstackItemComponent;
}

/**
 * Angular component wrapper for individual GridStack items.
 *
 * This component represents a single grid item and handles:
 * - Dynamic content creation and management
 * - Integration with parent GridStack component
 * - Component lifecycle and cleanup
 * - Widget options and configuration
 *
 * Use in combination with GridstackComponent for the parent grid.
 *
 * @example
 * ```html
 * <gridstack>
 *   <gridstack-item [options]="{x: 0, y: 0, w: 2, h: 1}">
 *     <my-widget-component></my-widget-component>
 *   </gridstack-item>
 * </gridstack>
 * ```
 */
@Component({
  selector: 'gridstack-item',
  template: `
    <div class="grid-stack-item-content">
      <!-- where dynamic items go based on component selector (recommended way), or sub-grids, etc...) -->
      <ng-template #container></ng-template>
      <!-- any static (defined in DOM - not recommended) content goes here -->
      <ng-content></ng-content>
      <!-- fallback HTML content from GridStackWidget.content if used instead (not recommended) -->
      {{options.content}}
    </div>`,
  styles: [`
    :host { display: block; }
  `],
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush, // IFF you want to optimize and control when ChangeDetection needs to happen...
})
export class GridstackItemComponent implements OnDestroy {

  /**
   * Container for dynamic component creation within this grid item.
   * Used to append child components programmatically.
   */
  @ViewChild('container', { read: ViewContainerRef, static: true}) public container?: ViewContainerRef;

  /**
   * Component reference for dynamic component removal.
   * Used internally when this component is created dynamically.
   */
  public ref: ComponentRef<GridstackItemComponent> | undefined;

  /**
   * Reference to child widget component for serialization.
   * Used to save/restore additional data along with grid position.
   */
  public childWidget: BaseWidget | undefined;

  /**
   * Grid item configuration options.
   * Defines position, size, and behavior of this grid item.
   *
   * @example
   * ```typescript
   * itemOptions: GridStackNode = {
   *   x: 0, y: 0, w: 2, h: 1,
   *   noResize: true,
   *   content: 'Item content'
   * };
   * ```
   */
  @Input() public set options(val: GridStackNode) {
    const grid = this.el.gridstackNode?.grid;
    if (grid) {
      // already built, do an update...
      grid.update(this.el, val);
    } else {
      // store our custom element in options so we can update it and not re-create a generic div!
      this._options = {...val, el: this.el};
    }
  }
  /** return the latest grid options (from GS once built, otherwise initial values) */
  public get options(): GridStackNode {
    return this.el.gridstackNode || this._options || {el: this.el};
  }

  protected _options?: GridStackNode;

  /** return the native element that contains grid specific fields as well */
  public get el(): GridItemCompHTMLElement { return this.elementRef.nativeElement; }

  /** clears the initial options now that we've built */
  public clearOptions() {
    delete this._options;
  }

  constructor(protected readonly elementRef: ElementRef<GridItemCompHTMLElement>) {
    this.el._gridItemComp = this;
  }

  public ngOnDestroy(): void {
    this.clearOptions();
    delete this.childWidget
    delete this.el._gridItemComp;
    delete this.container;
    delete this.ref;
  }
}
