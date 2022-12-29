# Angular wrapper

The Angular [wrapper component](./gridstack.component.ts) <gridstack> is a better way to use Gridstack, but alternative raw [NgFor](./ngFor.ts) or [Simple](./simple.ts) demos are also given.

## Usage

Code

```typescript
import { GridStackOptions, GridStackWidget } from 'gridstack';
import { GridstackComponent, nodesCB } from './gridstack.component';

/** sample grid options and items to load... */
public gridOptions: GridStackOptions = {
  margin: 5,
  float: true,
}
public items: GridStackWidget[] = [
  {x:0, y:0, minW:2},
  {x:1, y:1},
  {x:2, y:2},
];

// called whenever items change size/position/etc..
public onChange(data: nodesCB) {
  console.log('change ', data.nodes.length > 1 ? data.nodes : data.nodes[0]);
}

// ngFor unique node id to have correct match between our items used and GS
public identify(index: number, w: GridStackWidget) {
  return w.id;
}
```
HTML 
```angular2html
<gridstack [options]="gridOptions" (changeCB)="onChange($event)">
  <gridstack-item *ngFor="let n of items; trackBy: identify" [options]="n">
    Hello
  </gridstack-item>
</gridstack>
```

## Demo
You can see a fuller example at [app.component](https://github.com/gridstack/gridstack.js/blob/master/demo/angular/src/app/app.component.ts).

to build the demo, go to demo/angular and run `yarn` + `yarn start` and Navigate to `http://localhost:4200/` 

### Caveats 

 - This wrapper needs v7.1.2+ to run as it needs the latest changes
 - This wrapper handles well ngFor loops, but if you're using a trackBy function (as I would recommend) and no element id change after an update, you must manually call the `Gridstack.update()` method directly.
 - The original client list of items is not updated to match **content** changes made by gridstack (TBD later), but adding new item or removing (as shown in demo) will update those new items. Client could use change/added/removed events to sync that list if they wish to do so now.
