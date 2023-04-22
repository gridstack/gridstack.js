/**
 * Simplest Angular Example using GridStack API directly
 */
 import { Component, OnInit } from '@angular/core';

 import { GridStack, GridStackWidget } from 'gridstack';

 @Component({
   selector: 'angular-simple-test',
   template: `
    <p><b>SIMPLEST</b>: angular example using GridStack API directly, so not really using any angular construct per say other than waiting for DOM rendering</p>
     <button (click)="add()">add item</button>
     <button (click)="delete()">remove item</button>
     <button (click)="change()">modify item</button>
     <div class="grid-stack"></div>
     `,
   // gridstack.min.css and other custom styles should be included in global styles.scss
 })
 export class AngularSimpleComponent implements OnInit {
   public items: GridStackWidget[] = [
     { x: 0, y: 0, w: 9, h: 6, content: '0' },
     { x: 9, y: 0, w: 3, h: 3, content: '1' },
     { x: 9, y: 3, w: 3, h: 3, content: '2' },
   ];
   private grid!: GridStack;

   constructor() {}

   // simple div above doesn't require Angular to run, so init gridstack here
   public ngOnInit() {
     this.grid = GridStack.init({
       cellHeight: 70,
     })
     .load(this.items); // and load our content directly (will create DOM)
   }

   public add() {
     this.grid.addWidget({w: 3, content: 'new content'});
   }
   public delete() {
     this.grid.removeWidget(this.grid.engine.nodes[0].el!);
   }
   public change() {
    this.grid.update(this.grid.engine.nodes[0].el!, {w: 1});
   }
 }
