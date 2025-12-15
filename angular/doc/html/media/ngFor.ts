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
    <p><b>ngFor</b>: Example using Angular ngFor to loop through items and create DOM items. This track changes made to the array of items, waits for DOM rendering, then update GS</p>
    <button (click)="add()">add item</button>
    <button (click)="delete()">remove item</button>
    <button (click)="modify()">modify item</button>
    <button (click)="newLayout()">new layout</button>
    <div class="grid-stack">
      <!-- using angular templating to create DOM, otherwise an easier way is to simply call grid.load(items)
      NOTE: this example is NOT complete as there are many more properties than listed (minW, maxW, etc....)
      -->
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
  // gridstack.min.css and other custom styles should be included in global styles.scss or here
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
    .on('change added', (event: Event, nodes: GridStackNode[]) => this.onChange(nodes));

    // sync initial actual valued rendered (in case init() had to merge conflicts)
    this.onChange();

    /**
     * this is called when the list of items changes - get a list of nodes and
     * update the layout accordingly (which will take care of adding/removing items changed by Angular)
     */
    this.gridstackItems.changes.subscribe(() => {
      const layout: GridStackWidget[] = [];
      this.gridstackItems.forEach(ref => {
        const n = ref.nativeElement.gridstackNode || this.grid.makeWidget(ref.nativeElement).gridstackNode;
        if (n) layout.push(n);
      });
      this.grid.load(layout); // efficient that does diffs only
    })
  }

  /** Optional: called when given widgets are changed (moved/resized/added) - update our list to match.
   * Note this is not strictly necessary as demo works without this
   */
  public onChange(list = this.grid.engine.nodes) {
    setTimeout(() => // prevent new 'added' items from ExpressionChangedAfterItHasBeenCheckedError. TODO: find cleaner way to sync outside Angular change detection ?
      list.forEach(n => {
        const item = this._items.find(i => i.id === n.id);
        if (item) Utils.copyPos(item, n);
      })
    , 0);
  }

  /**
   * CRUD operations
   */
  public add() {
    // new array isn't required as Angular seem to detect changes to content
    // this.items = [...this.items, { x:3, y:0, w:3, id:String(ids++) }];
    this.items.push({ x:3, y:0, w:3, id:String(ids++) });
  }

  public delete() {
    this.items.pop();
  }

  public modify() {
    // this will only update the DOM attr (from the ngFor loop in our template above)
    // but not trigger gridstackItems.changes for GS to auto-update, so call GS update() instead
    // this.items[0].w = 2;
    const n = this.grid.engine.nodes[0];
    if (n?.el) this.grid.update(n.el, {w:3});
  }

  public newLayout() {
    this.items = [ // test updating existing and creating new one
      {x:0, y:1, id:'1'},
      {x:1, y:1, id:'2'},
      // {x:2, y:1, id:3}, // delete item
      {x:3, y:0, w:3}, // new item
    ];
  }

  // ngFor unique node id to have correct match between our items used and GS
  identify(index: number, w: GridStackWidget) {
    return w.id;
  }
}
