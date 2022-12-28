/**
 * Example using Angular ngFor to loop through items and create DOM items
 */

import { Component, AfterViewInit, Input, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { GridItemHTMLElement, GridStack, GridStackNode, GridStackWidget, Utils } from 'gridstack';

// unique ids sets for each item for correct ngFor updating
let ids = 1;

@Component({
  selector: "angular-ng-for-test",
  template: `
    <p>Example using Angular ngFor to loop through items and create DOM items. This track changes made to the array of items, waits for DOM rendering, then update GS</p>
    <button (click)="add()">add item</button>
    <button (click)="delete()">remove item</button>
    <button (click)="change()">modify item</button>
    <div class="grid-stack">
      <!-- using angular templating to create DOM, otherwise an easier way is to simply call grid.load(items) -->
      <div *ngFor="let n of items; trackBy: identify"
        class="grid-stack-item"
        [attr.gs-id]="n.id"
        [attr.gs-x]="n.x"
        [attr.gs-y]="n.y"
        [attr.gs-w]="n.w"
        [attr.gs-h]="n.h"
        #gridStackItem
      >
        <div class="grid-stack-item-content">item {{ n.id }}</div>
      </div>
    </div>
  `,
  // gridstack.min.css and other custom styles should be included in global styles.scss
})
export class AngularNgForTestComponent implements AfterViewInit {
  /** list of HTML items that we track to know when the DOM has been updated to make/remove GS widgets */
  @ViewChildren("gridStackItem") gridstackItems!: QueryList<ElementRef<GridItemHTMLElement>>;

  /** set the items to display. */
  @Input() public set items(list: GridStackWidget[]) {
    this._items = list || [];
    this._items.forEach(w => w.id = w.id || String(ids++)); // make sure a unique id is generated for correct ngFor loop update
  }
  public get items(): GridStackWidget[] { return this._items}

  private grid!: GridStack;
  public _items!: GridStackWidget[];

  constructor() {
    this.items = [
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 2, y: 2},
    ];
  }

  // wait until after DOM is ready to init gridstack - can't be ngOnInit() as angular ngFor needs to run first!
  public ngAfterViewInit() {
    this.grid = GridStack.init({
      margin: 5,
      float: true,
    })
    // Optional: called when widgets are changed (moved/resized/added) - update our list to match ?
    .on('change added', (event, list) => {
      setTimeout(() => { // prevent added items from ExpressionChangedAfterItHasBeenCheckedError
        (list as GridStackNode[]).forEach(n => {
          const item = this._items.find(i => i.id === n.id);
          if (item) Utils.copyPos(item, n);
        })
      }, 0);
    });

    /**
     * this is called when the list of items changes - get a list of nodes and
     * update the layout accordingly (which will take care of adding/removing/updating items to match DOM done by Angular)
     */
    this.gridstackItems.changes.subscribe(() => {
      const layout: GridStackWidget[] = [];
      this.gridstackItems.forEach(ref => {
        const n = ref.nativeElement.gridstackNode || this.grid.makeWidget(ref.nativeElement).gridstackNode;
        if (n) layout.push(n);
      });
      this.grid.load(layout);
    })
  }

  /**
   * CRUD operations
   */
  public add() {
    this.items.push({ x: 3, y: 0, w: 3, id: String(ids++) });
  }

  public delete() {
    this.items.pop();
  }

  public change() {
    // this.items[0].w = 2; // this will not update GS internal data, only DOM values even thought array doesn't grow/shrink, so call GS update()
    const n = this.grid.engine.nodes[0];
    if (n) this.grid.update(n.el!, { w: 2 });
  }

  // ngFor unique node id to have correct match between our items used and GS
  identify(i: number, w: GridStackWidget) {
    return w.id;
  }
}
