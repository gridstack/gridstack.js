/**
 * Example using Angular ngFor to loop through items and create DOM items
 */
 import { Component, AfterViewInit, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';

 import { GridStack, GridStackWidget } from 'gridstack';
 import 'gridstack/dist/h5/gridstack-dd-native';
 
 @Component({
   selector: 'app-angular-ng-for-test',
   template: `
     <button (click)="add()">add item</button><button (click)="delete()">remove item</button><button (click)="change()">modify item</button>
     <div class="grid-stack">
       <!-- using angular templating to create DOM, otherwise an easier way is to simply call grid.load(items) -->
       <div *ngFor="let n of items; let i = index" class="grid-stack-item" [attr.gs-w]="n.w" [attr.gs-h]="n.h" [attr.gs-x]="n.x" [attr.gs-y]="n.y">
         <div class="grid-stack-item-content">item {{i}}</div>
       </div>
     </div>
     `,
   // gridstack.min.css and other custom styles should be included in global styles.scss
 
   // tell Angular only @Input will change - doesn't help
   // changeDetection: ChangeDetectionStrategy.OnPush
 })
 export class AngularNgForTestComponent implements AfterViewInit, OnChanges {
  @Input() public items: GridStackWidget[] = [
     { x: 0, y: 0, w: 9, h: 6},
     { x: 9, y: 0, w: 3, h: 3},
     { x: 9, y: 3, w: 3, h: 3},
   ];
   private grid: GridStack;
 
   constructor() {}
 
   // wait until after DOM is ready to init gridstack - can't be ngOnInit() as angular ngFor needs to run first!
   public ngAfterViewInit() {
     this.grid = GridStack.init({
       cellHeight: 70,
     });
   }
 
   /**
    * this would be easier with addWidget(), removeWidget(), update() but simulating angular change detection instead...
    */
   public add() {
     // this SHOULD trigger ngOnChanges() but not seeing it... and doing ngDoCheck() seem extreme ?
     // https://www.reddit.com/r/angular/comments/azjefs/change_detection_for_arraysobjects/
     // https://angular.io/guide/lifecycle-hooks#docheck
     this.items = [...this.items, {x: 1, y: 6, w: 3}];
     // this.items.push({x: 1, y: 6, w: 3});
   }
   public delete() {
     this.items.pop(); // todo
   }
   public change() {
     this.items[0].w = 1; // todo
   }
 
   public ngOnChanges(changes: SimpleChanges) {
     if (changes.items) {
       // TODO: ... figure what is new and call makeWidget(), old -> removeWidget(el,false) and changed -> update()
       console.log('items changed');
     }
   }
 }
 