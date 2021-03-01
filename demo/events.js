function addEvents(grid, id) {
  let g = (id !== undefined ? 'grid' + id + ' ' : '');

  grid.on('added removed change', function(event, items) {
    let str = '';
    items.forEach(function(item) { str += ' (' + item.x + ',' + item.y + ' ' + item.w + 'x' + item.h + ')'; });
    console.log(g + event.type + ' ' + items.length + ' items (x,y w h):' + str );
  });

  grid.on('enable', function(event) {
    let grid = event.target;
    console.log(g + 'enable');
  });

  grid.on('disable', function(event) {
    let grid = event.target;
    console.log(g + 'disable');
  });

  grid.on('dragstart', function(event, el) {
    let node = el.gridstackNode;
    let x = el.getAttribute('gs-x'); // verify node (easiest) and attr are the same
    let y = el.getAttribute('gs-y');
    console.log(g + 'dragstart ' + el.textContent + ' pos: (' + node.x + ',' + node.y + ') = (' + x + ',' + y + ')');
  });

  grid.on('drag', function(event, el) {
    let node = el.gridstackNode;
    let x = el.getAttribute('gs-x'); // verify node (easiest) and attr are the same
    let y = el.getAttribute('gs-y');
    // console.log(g + 'drag ' + el.textContent + ' pos: (' + node.x + ',' + node.y + ') = (' + x + ',' + y + ')');
  });

  grid.on('dragstop', function(event, el) {
    let node = el.gridstackNode;
    let x = el.getAttribute('gs-x'); // verify node (easiest) and attr are the same
    let y = el.getAttribute('gs-y');
    console.log(g + 'dragstop ' + el.textContent + ' pos: (' + node.x + ',' + node.y + ') = (' + x + ',' + y + ')');
  });

  grid.on('dropped', function(event, previousWidget, newWidget) {
    if (previousWidget) {
      console.log(g + 'dropped - Removed widget from grid:', previousWidget);
    }
    if (newWidget) {
      console.log(g + 'dropped - Added widget in grid:', newWidget);
    }
  });

  grid.on('resizestart', function(event, el) {
    let node = el.gridstackNode;
    let w = el.getAttribute('gs-w');  // verify node (easiest) and attr are the same
    let h = el.getAttribute('gs-h');
    console.log(g + 'resizestart ' + el.textContent + ' size: (' + node.w + 'x' + node.h + ') = (' + w + 'x' + h + ')');
  });

  grid.on('resize', function(event, el) {
    let node = el.gridstackNode;
    let w = el.getAttribute('gs-w');  // verify node (easiest) and attr are the same
    let h = el.getAttribute('gs-h');
    // console.log(g + 'resize ' + el.textContent + ' size: (' + node.w + 'x' + node.h + ') = (' + w + 'x' + h + ')');
  });

  grid.on('resizestop', function(event, el) {
    let node = el.gridstackNode;
    let w = el.getAttribute('gs-w'); // verify node (easiest) and attr are the same
    let h = el.getAttribute('gs-h');
    console.log(g + 'resizestop ' + el.textContent + ' size: (' + node.w + 'x' + node.h + ') = (' + w + 'x' + h + ')');
  });
}