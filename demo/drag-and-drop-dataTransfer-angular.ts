/**
 * Simple Angular Example using GridStack API with event.dataTransfer
 */
 import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
 import { GridStack, GridStackWidget, GridStackNode } from 'gridstack';
 import { DDElement } from "gridstack/dist/h5/dd-element";
 
 @Component({
     selector: 'grid-stack-test',
     template: `
         <div class="grid-stack-item" #dragElement>
             <div class="grid-stack-item-content" style="background-color: #cccccc; padding: 15px;">Drag Me</div>
         </div>
         <hr>
         <div class="grid-stack"></div>
      `,
 })
 export class GridStackTestComponent implements OnInit {
 
     @ViewChild('dragElement') public dragElement: ElementRef<HTMLElement>;
 
     private sampleElement = `<div style="background-color: #eeeeee; padding: 15px; height: 100%;">Sample Element</div>`;
     private items: GridStackWidget[] = [
         { x: 0, y: 0, w: 9, h: 1, content: this.sampleElement },
         { x: 9, y: 0, w: 3, h: 2, content: this.sampleElement }
     ];
     private grid: GridStack;
 
     constructor() { }
     public ngOnInit() {
 
         const _ddElement = DDElement.init(this.dragElement.nativeElement);
         _ddElement.setupDraggable({
             handle: '.sample-drag',
             appendTo: 'body',
             helper: 'clone',
             start: (event: DragEvent) => {
                 if (event.dataTransfer) {
                     event.dataTransfer.setData('message', 'Hello World');
                 }
             },
         });
 
         this.grid = GridStack.init({
             removable: true,
             acceptWidgets: (el) => {
                 return true;
             }
         });
 
         this.grid.on('dropped', this.gridStackDropped.bind(this));
         this.grid.load(this.items); // and load our content directly (will create DOM)
     }
 
     gridStackDropped(event: Event, previousWidget: GridStackNode, newWidget: GridStackNode): void {
         const dragEvent = event as DragEvent;
         if (dragEvent.dataTransfer) {
             console.log('gridstack dropped: ', dragEvent.dataTransfer.getData('message'));
         }
     }
 }
 