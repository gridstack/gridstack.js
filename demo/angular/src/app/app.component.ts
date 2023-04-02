import { Component } from '@angular/core';
import { GridStackOptions, GridStackWidget } from 'gridstack';
import { GridstackComponent, elementCB, nodesCB } from './gridstack.component';

// unique ids sets for each item for correct ngFor updating
let ids = 1;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // which sample to show
  public show = 5;

  /** sample grid options and items to load... */
  public items: GridStackWidget[] = [
    {x: 0, y: 0, minW: 2},
    {x: 1, y: 1},
    {x: 2, y: 2},
  ];
  public gridOptions: GridStackOptions = {
    margin: 5,
    float: true,
    minRow: 1,
  }
  public gridOptionsFull: GridStackOptions = {
    ...this.gridOptions,
    children: this.items,
  }

  // nested grid options
  public sub1: GridStackWidget[] = [ {x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}, {x:0, y:1}, {x:1, y:1}];
  public sub2: GridStackWidget[] = [ {x:0, y:0}, {x:0, y:1, w:2}];
  public subOptions: GridStackOptions = {
    cellHeight: 50, // should be 50 - top/bottom
    column: 'auto', // size to match container. make sure to include gridstack-extra.min.css
    acceptWidgets: true, // will accept .grid-stack-item by default
    margin: 5,
  };
  public nestedGridOptions: GridStackOptions = { // main grid options
    cellHeight: 50,
    margin: 5,
    minRow: 2, // don't collapse when empty
    disableOneColumnMode: true,
    acceptWidgets: true,
    id: 'main',
    children: [
      {x:0, y:0, content: 'regular item', id: 0},
      {x:1, y:0, w:4, h:4, subGrid: {children: this.sub1, id:'sub1_grid', class: 'sub1', ...this.subOptions}},
      {x:5, y:0, w:3, h:4, subGrid: {children: this.sub2, id:'sub2_grid', class: 'sub2', ...this.subOptions}},
    ]
  };

  constructor() {
    // give them content and unique id to make sure we track them during changes below...
    [...this.items, ...this.sub1, ...this.sub2].forEach(w => {
      w.content = `item ${ids}`;
      w.id = String(ids++);
    });
  }

  /** called whenever items change size/position/etc.. */
  public onChange(data: nodesCB) {
    // TODO: update our TEMPLATE list to match ?
    // NOTE: no need for dynamic as we can always use grid.save() to get latest layout, or grid.engine.nodes
    console.log('change ', data.nodes.length > 1 ? data.nodes : data.nodes[0]);
  }

  public onResizeStop(data: elementCB) {
    console.log('resizestop ', data.el.gridstackNode);
  }

  /**
   * TEST dynamic grid operations - uses grid API directly (since we don't track structure that gets out of sync)
   */
  public add(gridComp: GridstackComponent) {
    // TODO: BUG the content doesn't appear until widget is moved around (or another created). Need to force
    // angular detection changes...
    gridComp.grid?.addWidget({x:3, y:0, w:2, content:`item ${ids}`, id:String(ids++)});
  }
  public delete(gridComp: GridstackComponent) {
    gridComp.grid?.removeWidget(gridComp.grid.engine.nodes[0]?.el!);
  }
  public modify(gridComp: GridstackComponent) {
    gridComp.grid?.update(gridComp.grid.engine.nodes[0]?.el!, {w:3})
  }
  public newLayout(gridComp: GridstackComponent) {
    gridComp.grid?.load([
      {x:0, y:1, id:'1', minW:1, w:1}, // new size/constrain
      {x:1, y:1, id:'2'},
      // {x:2, y:1, id:'3'}, // delete item
      {x:3, y:0, w:2, content:'new item'}, // new item
    ]);
  }

  /**
   * ngFor case: TEST TEMPLATE operations - NOT recommended unless you have no GS creating/re-parenting
   */
  public addNgFor() {
    // new array isn't required as Angular detects changes to content with trackBy:identify()
    // this.items = [...this.items, { x:3, y:0, w:3, content:`item ${ids}`, id:String(ids++) }];
    this.items.push({x:3, y:0, w:2, content:`item ${ids}`, id:String(ids++)});
  }
  public deleteNgFor() {
    this.items.pop();
  }
  public modifyNgFor(gridComp: GridstackComponent) {
    // this will not update the DOM nor trigger gridstackItems.changes for GS to auto-update, so set new option of the gridItem instead
    // this.items[0].w = 3;
    const gridItem = gridComp.gridstackItems?.get(0);
    if (gridItem) gridItem.options = {w:3};
  }
  public newLayoutNgFor() {
    this.items = [
      {x:0, y:1, id:'1', minW:1, w:1}, // new size/constrain
      {x:1, y:1, id:'2'},
      // {x:2, y:1, id:'3'}, // delete item
      {x:3, y:0, w:2, content:'new item'}, // new item
    ];
  }

  // ngFor TEMPLATE unique node id to have correct match between our items used and GS
  public identify(index: number, w: GridStackWidget) {
    return w.id; // or use index if no id is set and you only modify at the end...
  }
}
