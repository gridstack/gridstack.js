# Angular wrapper

The Angular [wrapper component](./gridstack.component.ts) <gridstack> is a better way to use Gridstack, but alternative raw [NgFor](./ngFor.ts) or [Simple](./simple.ts) demos are also given.

## Dynamic grid items
this is the recommended way if you are going to have multiple grids (alow drag&drop between) or drag from toolbar to create items, or drag to remove items...

I.E. don't use Angular templating to create children as that is harder to sync.

Code

```javascript
import { GridStackOptions, GridStackWidget } from 'gridstack';
import { GridstackComponent, nodesCB } from './gridstack.component';

/** sample grid options and items to load... */
public gridOptions: GridStackOptions = {
  margin: 5,
  float: true,
  children: [ // or call load() with same data
    {x:0, y:0, minW:2, id:'1', content:'Item 1'},
    {x:1, y:1, id:'2', content:'Item 2'},
    {x:2, y:2, id:'3', content:'Item 3'},
  ]
}

// called whenever items change size/position/etc..
public onChange(data: nodesCB) {
  console.log('change ', data.nodes.length > 1 ? data.nodes : data.nodes[0]);
}
```
HTML 
```html
<gridstack [options]="gridOptions" (changeCB)="onChange($event)">
</gridstack>
```

## ngFor with wrapper
For simple case where you control the children creation (gridstack doesn't do create or re-parenting)

Code

```javascript
import { GridStackOptions, GridStackWidget } from 'gridstack';
import { GridstackComponent, nodesCB } from './gridstack.component';

/** sample grid options and items to load... */
public gridOptions: GridStackOptions = {
  margin: 5,
  float: true,
}
public items: GridStackWidget[] = [
  {x:0, y:0, minW:2, id:'1'},
  {x:1, y:1, id:'2'},
  {x:2, y:2, id:'3'},
];

// called whenever items change size/position/etc..
public onChange(data: nodesCB) {
  console.log('change ', data.nodes.length > 1 ? data.nodes : data.nodes[0]);
}

// ngFor unique node id to have correct match between our items used and GS
public identify(index: number, w: GridStackWidget) {
  return w.id; // or use index if no id is set and you only modify at the end...
}
```
HTML 
```html
<gridstack [options]="gridOptions" (changeCB)="onChange($event)">
  <gridstack-item *ngFor="let n of items; trackBy: identify" [options]="n">
    Item {{n.id}}
  </gridstack-item>
</gridstack>
```

## Demo
You can see a fuller example at [app.component.ts](https://github.com/gridstack/gridstack.js/blob/master/demo/angular/src/app/app.component.ts)

to build the demo, go to demo/angular and run `yarn` + `yarn start` and Navigate to `http://localhost:4200/` 

## Caveats 

 - This wrapper needs v7.2+ to run as it needs the latest changes
 - Code isn't compiled into a lib YET. You'll need to copy those files. Let me know (slack) if you are using it...
 - BUG: content doesn't appear on new widget until widget is moved around (or another created that pushes it). Need to force angular detection changes...

 ## ngFor Caveats
 - This wrapper handles well ngFor loops, but if you're using a trackBy function (as I would recommend) and no element id change after an update,
 you must manually update the `GridstackItemComponent.option` directly - see [modifyNgFor()](./app.component.ts#L83) example.
 - The original client list of items is not updated to match **content** changes made by gridstack (TBD later), but adding new item or removing (as shown in demo) will update those new items. Client could use change/added/removed events to sync that list if they wish to do so.


 Would appreciate getting help doing the same for React and Vue (2 other popular frameworks)
