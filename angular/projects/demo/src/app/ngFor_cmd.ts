/**
 * Example using Angular ngFor to loop through items and create DOM items - this uses a custom command.
 * NOTE: see the simpler and better (tracks all changes) angular-ng-for-test
 */

import { Component, AfterViewInit, Input, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Subject, zip } from "rxjs";

import { GridItemHTMLElement, GridStack, GridStackWidget } from 'gridstack';

@Component({
  selector: "angular-ng-for-cmd-test",
  template: `
    <p><b>ngFor CMD</b>: Example using Angular ngFor to loop through items, but uses an explicity command to let us update GS (see automatic better way)</p>
    <button (click)="add()">add item</button>
    <button (click)="delete()">remove item</button>
    <button (click)="modify()">modify item</button>
    <div class="grid-stack">
      <!-- using angular templating to create DOM, otherwise an easier way is to simply call grid.load(items) -->
      <div
        *ngFor="let n of items; let i = index; trackBy: identify"
        [id]="i"
        class="grid-stack-item"
        [attr.gs-x]="n.x"
        [attr.gs-y]="n.y"
        [attr.gs-w]="n.w"
        [attr.gs-h]="n.h"
        #gridStackItem
      >
        <div class="grid-stack-item-content">item {{ i }}</div>
      </div>
    </div>
  `,
  // gridstack.min.css and other custom styles should be included in global styles.scss or here
})
export class AngularNgForCmdTestComponent implements AfterViewInit {
  /** list of HTML items that we track to know when the DOM has been updated to make/remove GS widgets */
  @ViewChildren("gridStackItem") gridstackItems!: QueryList<ElementRef<GridItemHTMLElement>>;

  /** set the items to display. */
  @Input() public items: GridStackWidget[] = [
    {x: 0, y: 0},
    {x: 1, y: 1},
    {x: 2, y: 2},
  ];

  private grid!: GridStack;
  private widgetToMake: Subject<{
    action: "add" | "remove" | "update";
    id: number;
  }> = new Subject(); // consider to use a state management like ngrx component store to do this

  constructor() {}

  // wait until after DOM is ready to init gridstack - can't be ngOnInit() as angular ngFor needs to run first!
  public ngAfterViewInit() {
    this.grid = GridStack.init({
      margin: 5,
      float: true,
    });

    // To sync dom manipulation done by Angular and widget manipulation done by gridstack we need to zip the observables
    zip(this.gridstackItems.changes, this.widgetToMake).subscribe(
      ([changedWidget, widgetToMake]) => {
        if (widgetToMake.action === "add") {
          this.grid.makeWidget(`#${widgetToMake.id}`);
        } else if (widgetToMake.action === "remove") {
          const id = String(widgetToMake.id);
          // Note: DOM element has been removed by Angular already so look for it through the engine node list
          const removeEl = this.grid.engine.nodes.find((n) => n.el?.id === id)?.el;
          if (removeEl) this.grid.removeWidget(removeEl);
        }
      }
    );

    // TODO: the problem with this code is that our items list does NOT reflect changes made by GS (user directly changing,
    // or conflict during initial layout) and believe the other ngFor example (which does track changes) is also cleaner
    // as it doesn't require user creating special action commands nor track 'both' changes using zip().
    // TODO: identify() uses index which is not guaranteed to match between invocations (insert/delete in
    // middle of list instead of end as demo does)
  }

  /**
   * CRUD operations
   */
  public add() {
    this.items = [...this.items, { x: 3, y: 0, w: 3 }];
    this.widgetToMake.next({ action: "add", id: this.items.length - 1 });
  }

  public delete() {
    this.items.pop();
    this.widgetToMake.next({ action: "remove", id: this.items.length });
  }

  // a change of a widget doesn´t change to amount of items in ngFor therefore we don´t need to do it through the zip function above
  public modify() {
    const updateEl = this.grid.getGridItems().find((el) => el.id === `${0}`);
    this.grid.update(updateEl!, { w: 2 });
  }

  // ngFor lookup indexing
  identify(index: number) {
    return index;
  }
}
