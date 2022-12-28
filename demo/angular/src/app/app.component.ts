import { Component } from '@angular/core';
import { GridStackOptions } from 'gridstack';
import { elementCB, nodesCB } from './gridstack.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // which sample to show
  show = 1;

  public gridstackConfig: GridStackOptions = {
    margin: 5,
    float: true,
  }

  public onChange(h: nodesCB) {
    console.log('change ', h.nodes.length > 1 ? h.nodes : h.nodes[0]);
  }

  public onResizeStop(h: elementCB) {
    console.log('resizestop ', h.el.gridstackNode);
  }
}
