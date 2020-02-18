import { GridStack, GridstackOptions, MousePosition } from '../src/gridstack';

var options: GridstackOptions = {
    float: true
};

var grid: GridStack = GridStack.init(options);
var gsFromElement: GridStack = GridStack.get();
var gsFromElement2: GridStack = ($('.grid-stack').get(0) as any).gridstack;

if (gsFromElement !== grid) throw Error('These should match!');
if (gsFromElement2 !== grid) throw Error('These should match!');

var gridItem = '<div><div class="grid-stack-item-content"> Hello </div></div>'

grid.addWidget(gridItem, {width: 2});
grid.addWidget(gridItem, 1, 2, 3, 4, true);
grid.makeWidget(document.createElement('div'));
grid.batchUpdate();
grid.cellHeight();;
grid.cellHeight(2);
grid.cellWidth();
grid.getCellFromPixel(<MousePosition>{ left:20, top: 20 });
grid.removeAll(false);
