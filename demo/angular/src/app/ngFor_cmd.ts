/**
 * Example using Angular ngFor to loop through items and create DOM items - this uses a custom command.
 * NOTE: see the simpler and better (tracks all changes) angular-ng-for-test
 */

import { Component, AfterViewInit, Input, ViewChildren, QueryList } from "@angular/core";
import { Subject, zip } from "rxjs";

import { GridStack, GridStackWidget } from 'gridstack';

@Component({
  selector: "angular-ng-for-cmd-test",
  template: `
    <p>Example using Angular ngFor to loop through items, but uses an explicity command to let us update GS (see automatic better way)</p>
    <button (click)="add()">add item</button>
    <button (click)="delete()">remove item</button>
    <button (click)="change()">modify item</button>
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
  styles: [
    `
      // !!!IMPORTANT!!! Import this through your styles.scss or angular.json! This is just for demo purposes
      :host {
        ::ng-deep {
          @import "demo";
        }
      }
    `,
  ],
})
export class AngularNgForCmdTestComponent implements AfterViewInit {
  @ViewChildren("gridStackItem") gridstackItems!: QueryList<any>;
  @Input() public items: GridStackWidget[] = [
    { x: 0, y: 0, w: 1, h: 1 },
    { x: 1, y: 1, w: 1, h: 1 },
    { x: 2, y: 2, w: 1, h: 1 },
  ];

  private grid!: GridStack;
  private widgetToMake: Subject<{
    action: "add" | "remove" | "update";
    id: number;
  }> = new Subject(); // consider to use a statemanagement like ngrx component store to do this

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

    // TODO: the problem with this code is that our items list does NOT reflect changes made by GS (user directly changing, or conflict)
    // and believe the other ngFor example (which does track changes) is also cleaner as it doesn't require special action commands
    // and track both changes to happen using zip().
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
  public change() {
    const updateEl = this.grid.getGridItems().find((el) => el.id === `${0}`);
    this.grid.update(updateEl!, { w: 2 });
  }

  identify(index: number) {
    return index;
  }
}
