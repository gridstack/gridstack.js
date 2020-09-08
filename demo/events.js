function addEvents(grid, id) {
  var g = (id !== undefined ? 'grid' + id + ' ' : '');

  grid.on('added removed change', function(event, items) {
    var str = '';
    items.forEach(function(item) { str += ' (' + item.x + ',' + item.y + ' ' + item.width + 'x' + item.height + ')'; });
    console.log(g + event.type + ' ' + items.length + ' items (x,y w h):' + str );
  });

  grid.on('disable', function(event) {
    var grid = event.target;
    console.log(g + 'disable');
  });

  grid.on('dragstart', function(event, el) {
    var node = el.gridstackNode;
    var x = el.getAttribute('data-gs-x');
    var y= el.getAttribute('data-gs-y');
    console.log(g + 'dragstart ' + el.textContent + ' pos: (' + node.x + ',' + node.y + ') vs (' + x + ',' + y + ')');
  });

  grid.on('dragstop', function(event, el) {
    var node = el.gridstackNode;
    var x = el.getAttribute('data-gs-x');
    var y= el.getAttribute('data-gs-y');
    console.log(g + 'dragstop ' + el.textContent + ' pos: (' + node.x + ',' + node.y + ') vs (' + x + ',' + y + ')');
  });

  grid.on('dropped', function(event, previousWidget, newWidget) {
    if (previousWidget) {
      console.log(g + 'dropped - Removed widget from grid:', previousWidget);
    }
    if (newWidget) {
      console.log(g + 'dropped - Added widget in grid:', newWidget);
    }
  });

  grid.on('enable', function(event) {
    var grid = event.target;
    console.log(g + 'enable');
  });

  grid.on('resizestart', function(event, el) {
    var w = el.getAttribute('data-gs-width');
    var h = el.getAttribute('data-gs-height');
    console.log(g + 'resizestart ' + el.textContent + ' size: (' + w + ' x ' + h + ')');
  });

  grid.on('resizestop', function(event, el) {
    var w = el.getAttribute('data-gs-width');
    var h = el.getAttribute('data-gs-height');
    console.log(g + 'resizestop ' + el.textContent + ' size: (' + w + ' x ' + h + ')');
  });
}