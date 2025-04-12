import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GridStack, GridStackOptions, GridStackWidget } from 'gridstack';
import { AngularSimpleComponent } from './simple';
import { AngularNgForTestComponent } from './ngFor';
import { AngularNgForCmdTestComponent } from './ngFor_cmd';

// TEST: local testing of file
// import { GridstackComponent, NgGridStackOptions, NgGridStackWidget, elementCB, gsCreateNgComponents, nodesCB } from './gridstack.component';
import { GridstackComponent, NgGridStackOptions, NgGridStackWidget, elementCB, gsCreateNgComponents, nodesCB } from 'gridstack/dist/angular';

// unique ids sets for each item for correct ngFor updating
let ids = 1;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild(AngularSimpleComponent) case0Comp?: AngularSimpleComponent;
  @ViewChild(AngularNgForTestComponent) case1Comp?: AngularNgForTestComponent;
  @ViewChild(AngularNgForCmdTestComponent) case2Comp?: AngularNgForCmdTestComponent;
  @ViewChild(GridstackComponent) gridComp?: GridstackComponent;
  @ViewChild('origTextArea', {static: true}) origTextEl?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('textArea', {static: true}) textEl?: ElementRef<HTMLTextAreaElement>;

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
    // float: true,
    minRow: 1,
    cellHeight: 70,
    columnOpts: { breakpoints: [{w:768, c:1}] },
  }
  public sub0: NgGridStackWidget[] = [{x:0, y:0, selector:'app-a'}, {x:1, y:0, selector:'app-a', input: {text: 'bar'}}, {x:1, y:1, content:'plain html'}, {x:0, y:1, selector:'app-b'} ];
  public gridOptionsFull: NgGridStackOptions = {
    ...this.gridOptions,
    children: this.sub0,
  }

  public lazyChildren: NgGridStackWidget[] = [];
  public gridOptionsDelay: NgGridStackOptions = {
    ...this.gridOptions,
    lazyLoad: true,
    children: this.lazyChildren,
  }

  // nested grid options
  private subOptions: GridStackOptions = {
    cellHeight: 50, // should be 50 - top/bottom
    column: 'auto', // size to match container
    acceptWidgets: true, // will accept .grid-stack-item by default
    margin: 5,
  };
  public sub1: NgGridStackWidget[] = [ {x:0, y:0, selector:'app-a'}, {x:1, y:0, selector:'app-b'}, {x:2, y:0, selector:'app-c'}, {x:3, y:0}, {x:0, y:1}, {x:1, y:1}];
  public sub2: NgGridStackWidget[] = [ {x:0, y:0}, {x:0, y:1, w:2}];
  public sub3: NgGridStackWidget = { selector: 'app-n', w:2, h:2, subGridOpts: { children: [{selector: 'app-a'}, {selector: 'app-b', y:0, x:1}]}};
  private subChildren: NgGridStackWidget[] = [
    {x:0, y:0, content: 'regular item'},
    {x:1, y:0, w:4, h:4, subGridOpts: {children: this.sub1}},
    // {x:5, y:0, w:3, h:4, subGridOpts: {children: this.sub2}},
    this.sub3,
  ]
  public nestedGridOptions: NgGridStackOptions = { // main grid options
    cellHeight: 50,
    margin: 5,
    minRow: 2, // don't collapse when empty
    acceptWidgets: true,
    subGridOpts: this.subOptions, // all sub grids will default to those
    children: this.subChildren,
  };
  public twoGridOpt1: NgGridStackOptions = {
    column: 6,
    cellHeight: 50,
    margin: 5,
    minRow: 1, // don't collapse when empty
    removable: '.trash',
    acceptWidgets: true,
    float: true,
    children: [
      {x: 0, y: 0, w: 2, h: 2, selector: 'app-a'},
      {x: 3, y: 1, h: 2, selector: 'app-b'},
      {x: 4, y: 1},
      {x: 2, y: 3, w: 3, maxW: 3, id: 'special', content: 'has maxW=3'},
    ]
  };
  public twoGridOpt2: NgGridStackOptions = { ...this.twoGridOpt1, float: false }
  private serializedData?: NgGridStackOptions;

  // sidebar content to create storing the Widget description to be used on drop
  public sidebarContent6: NgGridStackWidget[] = [
    { w:2, h:2, subGridOpts: { children: [{content: 'nest 1'}, {content: 'nest 2'}]}},
    this.sub3,
  ];
  public sidebarContent7: NgGridStackWidget[] = [
    {selector: 'app-a'},
    {selector: 'app-b', w:2, maxW: 3},
  ];

  constructor() {
    for (let y = 0; y <= 5; y++) this.lazyChildren.push({x:0, y, id:String(y), selector: y%2 ? 'app-b' : 'app-a'});

    // give them content and unique id to make sure we track them during changes below...
    [...this.items, ...this.subChildren, ...this.sub1, ...this.sub2, ...this.sub0].forEach((w: NgGridStackWidget) => {
      if (!w.selector && !w.content && !w.subGridOpts) w.content = `item ${ids++}`;
    });
  }

  ngOnInit(): void {
    this.onShow(this.show);

    // TEST
    // setTimeout(() => {
    //   if (!this.gridComp) return;
    //   this.saveGrid();
    //   // this.clearGrid();
    //   this.delete();
    //   this.delete();
    //   this.loadGrid();
    //   this.delete();
    //   this.delete();
    // }, 500)
  }

  public onShow(val: number) {
    this.show = val;

    // set globally our method to create the right widget type
    if (val < 3) GridStack.addRemoveCB = undefined;
    else GridStack.addRemoveCB = gsCreateNgComponents;

    // let the switch take affect then load the starting values (since we sometimes save())
    setTimeout(() => {
      let data;
      switch(val) {
        case 0: data = this.case0Comp?.items; break;
        case 1: data = this.case1Comp?.items; break;
        case 2: data = this.case2Comp?.items; break;
        case 3: data = this.gridComp?.grid?.save(true, true); break;
        case 4: data = this.items; break;
        case 5: data = this.gridOptionsFull; break;
        case 6: data = this.nestedGridOptions;
          GridStack.setupDragIn('.sidebar-item', undefined, this.sidebarContent6);
          break;
        case 7: data = this.twoGridOpt1;
          GridStack.setupDragIn('.sidebar-item', undefined, this.sidebarContent7);
          break;
      }
      if (this.origTextEl) this.origTextEl.nativeElement.value = JSON.stringify(data, null, '  ');
    });
    if (this.textEl) this.textEl.nativeElement.value = '';
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
  public add() {
    // TODO: BUG the content doesn't appear until widget is moved around (or another created). Need to force
    // angular detection changes...
    this.gridComp?.grid?.addWidget({x:3, y:0, w:2, content:`item ${ids}`, id:String(ids++)});
  }
  public delete() {
    let grid = this.gridComp?.grid;
    if (!grid) return;
    let node = grid.engine.nodes[0];
    // delete any children first before subGrid itself...
    if (node?.subGrid && node.subGrid.engine.nodes.length) {
      grid = node.subGrid;
      node = grid.engine.nodes[0];
    }
    if (node) grid.removeWidget(node.el!);
  }
  public modify() {
    this.gridComp?.grid?.update(this.gridComp?.grid.engine.nodes[0]?.el!, {w:3})
  }
  public newLayout() {
    this.gridComp?.grid?.load([
      {x:0, y:1, id:'1', minW:1, w:1}, // new size/constrain
      {x:1, y:1, id:'2'},
      // {x:2, y:1, id:'3'}, // delete item
      {x:3, y:0, w:2, content:'new item'}, // new item
    ]);
  }
  public load(layout: GridStackWidget[]) {
    this.gridComp?.grid?.load(layout);
  }

  /**
   * ngFor case: TEST TEMPLATE operations - NOT recommended unless you have no GS creating/re-parenting
   */
  public addNgFor() {
    // new array isn't required as Angular detects changes to content with trackBy:identify()
    // this.items = [...this.items, { x:3, y:0, w:3, content:`item ${ids}`, id:String(ids++) }];
    this.items.push({w:2, content:`item ${ids}`, id:String(ids++)});
  }
  public deleteNgFor() {
    this.items.pop();
  }
  public modifyNgFor() {
    // this will not update the DOM nor trigger gridstackItems.changes for GS to auto-update, so set new option of the gridItem instead
    // this.items[0].w = 3;
    const gridItem = this.gridComp?.gridstackItems?.get(0);
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
  public clearGrid() {
    if (!this.gridComp) return;
    this.gridComp.grid?.removeAll();
  }
  public saveGrid() {
    this.serializedData = this.gridComp?.grid?.save(false, true) as GridStackOptions || ''; // no content, full options
    if (this.textEl) this.textEl.nativeElement.value = JSON.stringify(this.serializedData, null, '  ');
  }
  public loadGrid() {
    if (!this.gridComp) return;
    GridStack.addGrid(this.gridComp.el, this.serializedData);
  }

  // ngFor TEMPLATE unique node id to have correct match between our items used and GS
  public identify(index: number, w: GridStackWidget) {
    return w.id; // or use index if no id is set and you only modify at the end...
  }
}
