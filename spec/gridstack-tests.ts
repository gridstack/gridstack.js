import { GridStack, GridstackOptions, MousePosition } from '../src/gridstack';

var options: GridstackOptions = {
    float: true
};
var grid: GridStack = $(document).gridstack(options);
var gsFromElement: GridStack = $(document).data("grid");

if (gsFromElement !== grid) throw Error('These should match!');

grid.addWidget("test", 1, 2, 3, 4, true);
grid.addWidget(document.createElement('div'), 1, 2, 3, 4, true);
grid.addWidget($(document.createElement('div')), 1, 2, 3, 4, true);
grid.makeWidget($(document.createElement('div')));
grid.batchUpdate();
grid.cellHeight();;
grid.cellHeight(2);
grid.cellWidth();
grid.getCellFromPixel(<MousePosition>{ left:20, top: 20 });
grid.removeAll(false);
