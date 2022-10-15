/**
 * Example using Angular ngFor to loop through items and create DOM items
 */

import { Component, AfterViewInit, Input, ViewChildren, QueryList } from "@angular/core";
import { Subject, zip } from "rxjs";

import { GridStack, GridStackWidget } from 'gridstack';

@Component({
  selector: "app-angular-ng-for-test",
  template: `
    <button (click)="add()">add item</button>
    <button (click)="delete()">remove item</button>
    <button (click)="change()">modify item</button>
    <div class="grid-stack">
      <!-- using angular templating to create DOM, otherwise an easier way is to simply call grid.load(items) -->
      <div
        *ngFor="let n of items; let i = index; trackBy: identify"
        [id]="i"
        class="grid-stack-item"
        [attr.gs-w]="n.w"
        [attr.gs-h]="n.h"
        [attr.gs-x]="n.x"
        [attr.gs-y]="n.y"
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
export class AngularNgForTestComponent implements AfterViewInit {
  @ViewChildren("gridStackItem") gridstackItems: QueryList<any>;
  @Input() public items: GridStackWidget[] = [
    { x: 0, y: 0, w: 1, h: 1 },
    { x: 1, y: 1, w: 1, h: 1 },
    { x: 2, y: 2, w: 1, h: 1 },
  ];

  private grid: GridStack;
  private widgetToMake: Subject<{
    action: "add" | "remove" | "update";
    id: number;
  }> = new Subject(); // consider to use a statemanagement like ngrx component store to do this

  constructor() {}

  // wait until after DOM is ready to init gridstack - can't be ngOnInit() as angular ngFor needs to run first!
  public ngAfterViewInit() {
    this.grid = GridStack.init({
      alwaysShowResizeHandle:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ),
      margin: 5,
      float: true,
    });

    // To sync dom manipulation done by Angular and widget manipulation done by gridstack we need to zip the observables
    zip(this.gridstackItems.changes, this.widgetToMake).subscribe(
      ([changedWidget, widgetToMake]) => {
        if (widgetToMake.action === "add") {
          this.grid.makeWidget(`#${widgetToMake.id}`);
        } else if (widgetToMake.action === "remove") {
          const removeEl = this.grid
            .getGridItems()
            .find((el) => el.id === `${widgetToMake.id}`);
          this.grid.removeWidget(removeEl);
        }
      }
    );
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
    this.grid.update(updateEl, { w: 2 });
  }

  identify(index: number) {
    return index;
  }
}
