# Angular wrapper

The Angular [wrapper component](projects/lib/src/lib/gridstack.component.ts) <gridstack> is a better way to use Gridstack, but alternative raw [ngFor](projects/demo/src/app/ngFor.ts) or [simple](projects/demo/src/app/simple.ts) demos are also given.

# Dynamic grid items
this is the recommended way if you are going to have multiple grids (alow drag&drop between) or drag from toolbar to create items, or drag to remove items, etc...

I.E. don't use Angular templating to create grid items as that is harder to sync when gridstack will also add/remove items.

HTML 
```html
<gridstack [options]="gridOptions">
</gridstack>
```

CSS
```css
@import "gridstack/dist/gridstack.min.css";

.grid-stack {
  background: #FAFAD2;
}
.grid-stack-item-content {
  text-align: center;
  background-color: #18bc9c;
}
```

in your module Code
```ts
import { GridstackModule } from 'gridstack/dist/angular';

@NgModule({
  imports: [GridstackModule, ...]
  ...
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Component Code
```ts
import { GridStackOptions } from 'gridstack';

// sample grid options + items to load...
public gridOptions: GridStackOptions = {
  margin: 5,
  children: [ // or call load()/addWidget() with same data
    {x:0, y:0, minW:2, content:'Item 1'},
    {x:1, y:0, content:'Item 2'},
    {x:0, y:1, content:'Item 3'},
  ]
}
```

# More Complete example
In this example (build on previous one) will use your actual custom angular components inside each grid item (instead of dummy html content) and have per component saved settings as well (using BaseWidget).

HTML 
```html
<gridstack [options]="gridOptions" (changeCB)="onChange($event)">
  <div empty-content>message when grid is empty</div>
</gridstack>
```

Code
```ts
import { Component } from '@angular/core';
import { GridStack, GridStackOptions } from 'gridstack';
import { GridstackComponent, gsCreateNgComponents, NgGridStackWidget, nodesCB, BaseWidget } from 'gridstack/dist/angular';

// some custom components
@Component({
  selector: 'app-a',
  template: 'Comp A {{text}}',
})
export class AComponent extends BaseWidget implements OnDestroy {
  @Input() text: string = 'foo'; // test custom input data
  public override serialize(): NgCompInputs | undefined  { return this.text ? {text: this.text} : undefined; }
  ngOnDestroy() {
    console.log('Comp A destroyed'); // test to make sure cleanup happens
  }
}

@Component({
  selector: 'app-b',
  template: 'Comp B',
})
export class BComponent extends BaseWidget {
}

// .... in your module for example
constructor() {
  // register all our dynamic components types created by the grid
  GridstackComponent.addComponentToSelectorType([AComponent, BComponent]);
}

// now our content will use Components instead of dummy html content
public gridOptions: NgGridStackOptions = {
  margin: 5,
  minRow: 1, // make space for empty message
  children: [ // or call load()/addWidget() with same data
    {x:0, y:0, minW:2, selector:'app-a'},
    {x:1, y:0, selector:'app-b'},
    {x:0, y:1, content:'plain html content'},
  ]
}

// called whenever items change size/position/etc.. see other events
public onChange(data: nodesCB) {
  console.log('change ', data.nodes.length > 1 ? data.nodes : data.nodes[0]);
}
```

# ngFor with wrapper
For simple case where you control the children creation (gridstack doesn't do create or re-parenting)

HTML 
```html
<gridstack [options]="gridOptions" (changeCB)="onChange($event)">
  <gridstack-item *ngFor="let n of items; trackBy: identify" [options]="n">
    Item {{n.id}}
  </gridstack-item>
</gridstack>
```

Code
```javascript
import { GridStackOptions, GridStackWidget } from 'gridstack';
import { nodesCB } from 'gridstack/dist/angular';

/** sample grid options and items to load... */
public gridOptions: GridStackOptions = { margin: 5 }
public items: GridStackWidget[] = [
  {x:0, y:0, minW:2, id:'1'}, // must have unique id used for trackBy
  {x:1, y:0, id:'2'},
  {x:0, y:1, id:'3'},
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

## Demo
You can see a fuller example at [app.component.ts](projects/demo/src/app/app.component.ts)

to build the demo, go to [angular/projects/demo](projects/demo/) and run `yarn` + `yarn start` and navigate to `http://localhost:4200/` 

Code ship starting with v8.1.2+ in `dist/angular` for people to use directly and is an angular module! (source code under `dist/angular/src`)
## Caveats 

 - This wrapper needs: 
    - gridstack v8 to run as it needs the latest changes (use older version that matches GS versions)
    - Angular 13+ for dynamic createComponent() API

 ## *ngFor Caveats
 - This wrapper handles well ngFor loops, but if you're using a trackBy function (as I would recommend) and no element id change after an update,
 you must manually update the `GridstackItemComponent.option` directly - see [modifyNgFor()](src/app/app.component.ts#L174) example.
 - The original client list of items is not updated to match **content** changes made by gridstack (TBD later), but adding new item or removing (as shown in demo) will update those new items. Client could use change/added/removed events to sync that list if they wish to do so.

 Would appreciate getting help doing the same for React and Vue (2 other popular frameworks)
 
 -Alain
