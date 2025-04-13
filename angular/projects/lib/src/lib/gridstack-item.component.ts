/**
 * gridstack-item.component.ts 12.0.0-dev
 * Copyright (c) 2022-2024 Alain Dumesny - see GridStack root license
 */

import { Component, ElementRef, Input, ViewChild, ViewContainerRef, OnDestroy, ComponentRef } from '@angular/core';
import { GridItemHTMLElement, GridStackNode } from 'gridstack';
import { BaseWidget } from './base-widget';

/** store element to Ng Class pointer back */
export interface GridItemCompHTMLElement extends GridItemHTMLElement {
  _gridItemComp?: GridstackItemComponent;
}

/**
 * HTML Component Wrapper for gridstack items, in combination with GridstackComponent for parent grid
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

  /** container to append items dynamically */
  @ViewChild('container', { read: ViewContainerRef, static: true}) public container?: ViewContainerRef;

  /** ComponentRef of ourself - used by dynamic object to correctly get removed */
  public ref: ComponentRef<GridstackItemComponent> | undefined;

  /** child component so we can save/restore additional data to be saved along */
  public childWidget: BaseWidget | undefined;

  /** list of options for creating/updating this item */
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
