import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { GridStackOptions } from 'gridstack';

// NOTE: local testing of file
// import { GridstackComponent, NgGridStackOptions, NgGridStackWidget, elementCB, gsCreateNgComponents, nodesCB } from './gridstack.component';
import { GridstackComponent, NgGridStackOptions, NgGridStackWidget, elementCB, nodesCB } from 'gridstack/dist/angular';
import { AComponent } from './a.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild(GridstackComponent) gridComp?: GridstackComponent;

  constructor() {
    GridstackComponent.addComponentToSelectorType([AComponent]);
  }

  public gridOptions: GridStackOptions = {
    margin: 5,
    // float: true,
    minRow: 1,
    cellHeight: 70,
    columnOpts: { breakpoints: [{w:768, c:1}] },
  }
  public gridOptionsFull: NgGridStackOptions = {
    ...this.gridOptions,
  }

  ngAfterViewInit(): void {
    if (!this.gridComp) {
      return;
    }

    this.loadGrid();
  }

  private getTileWidget(tile: any): NgGridStackWidget {
    const widget: NgGridStackWidget = {
      w: tile.width,
      h: tile.height,
      selector: 'app-a',
      id: tile.id,
      locked: false,
      noMove: false,
      noResize: false,
      input: {
        text: tile.text,
      }
    };

    if (tile.left != null) {
      widget.x = tile.left;
    }
    if (tile.top != null) {
      widget.y = tile.top;
    }

    return widget;
  }

  loadWidgets(widgets: NgGridStackWidget[]): void {
    if (!this.gridComp?.grid) {
      return;
    }
    this.gridComp.grid.load(widgets);
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

  public clearGrid() {
    if (!this.gridComp) return;
    this.gridComp.grid?.removeAll();
  }

  getTiles() {
    const tiles = [];
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 12; j++) {
        tiles.push({
          id: 'id' +i + j,
          width: 1,
          height: 1,
          left: j,
          top: i,
        });
      }

    }
    return tiles;
  }

  public loadGrid() {
    this.loadWidgets(this.getTiles().map(tile => this.getTileWidget(tile)));
  }
}
