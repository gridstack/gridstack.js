## Angular wrapper example

### Usage

```typescript
gridstackConfig: GridStackOptions = {
    animate: true,
    column: 24,
    cellHeight: 25,
    margin: globalElementSpacingPx,
    alwaysShowResizeHandle: false,
    removable: false,
    resizable: {
        handles: 'n,ne,e,se,s,sw,w,nw',
        autoHide: false,
    },
};

handleDropped(event
:
{
    event: GridStackEvent;
    grid: GridStack
}
)
{
    console.log(event)
}
```

```angular2html

<ef-gridstack [options]="gridstackConfig"
              (gridstackDropped)="handleDropped($event)">
    <ef-gridstack-item [identifier]="'a'"
                       [height]="4"
                       [width]="6"
                       [minH]="2"
                       [minW]="3"
                       [x]="0"
                       [y]="0">
        HELLO
    </ef-gridstack-item>
</ef-gridstack>
```


### Caveats 

 - This wrapper is not complete and might need adjustment to fit your needs. It was written to fit my use case.
 - This wrapper handles well ngFor loops, but if you're using a trackBy function (as I would recommend) and no element identifier change after an update, you must manually call the `update` method from the Gridstack component (using template variable reference or ViewChild() reference).
