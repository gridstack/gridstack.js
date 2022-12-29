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
  show = 3;

  /** sample grid options and items to load... */
  public gridOptions: GridStackOptions = {
    margin: 5,
    float: true,
  }
  public items: GridStackWidget[] = [
    {x: 0, y: 0, minW: 2},
    {x: 1, y: 1},
    {x: 2, y: 2},
  ];

  constructor() {
    // give them content and unique id to make sure we track them during changes below...
    this.items.forEach(w => {
      w.content = `item ${ids}`;
      w.id = String(ids++);
    })
  }

  /** called whenever items change size/position/etc.. */
  public onChange(data: nodesCB) {
    console.log('change ', data.nodes.length > 1 ? data.nodes : data.nodes[0]);
    // TODO: update our list to match ?
  }

  public onResizeStop(data: elementCB) {
    console.log('resizestop ', data.el.gridstackNode);
  }

  /**
   * CRUD TEST operations
   */
  public add(comp: GridstackComponent) {
    // new array isn't required as Angular seem to detect changes to content
    // this.items = [...this.items, { x:3, y:0, w:3, content:`item ${ids}`, id:String(ids++) }];
    this.items.push({ x:3, y:0, w:3, content:`item ${ids}`, id:String(ids++)});
  }

  public delete(comp: GridstackComponent) {
    this.items.pop();
  }

  public change(comp: GridstackComponent) {
    // this will not update the DOM nor trigger gridstackItems.changes for GS to auto-update, so call GS update() instead
    // this.items[0].w = 3;
    // comp.updateAll();
    const n = comp.grid?.engine.nodes[0];
    if (n?.el) comp.grid?.update(n.el, {w:3});
  }

  /** test updating existing and creating new one */
  public newLayout(comp: GridstackComponent) {
    this.items = [
      {x:0, y:1, id:'1', minW:1, w:1}, // new size/constrain
      {x:1, y:1, id:'2'},
      // {x:2, y:1, id:'3'}, // delete item
      {x:3, y:0, w:3, content:'new item'}, // new item
    ];
  }

  // ngFor unique node id to have correct match between our items used and GS
  public identify(index: number, w: GridStackWidget) {
    return w.id;
  }
}
