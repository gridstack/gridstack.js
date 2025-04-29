function addEvents(grid, id) {
  let g = (id !== undefined ? 'grid' + id : '');

  grid.on('added removed change', function(event, items) {
    let str = '';
    items.forEach(function(item) { str += ' (' + item.x + ',' + item.y + ' ' + item.w + 'x' + item.h + ')'; });
    console.log((g || items[0].grid.opts.id) + ' ' + event.type + ' ' + items.length + ' items (x,y w h):' + str );
  })
  .on('enable', function(event) {
    let el = event.target;
    console.log((g || el.gridstackNode.grid.opts.id) + ' enable');
  })
  .on('disable', function(event) {
    let el = event.target;
    console.log((g || el.gridstackNode.grid.opts.id) + ' disable');
  })
  .on('dragstart', function(event, el) {
    let n = el.gridstackNode;
    let x = el.getAttribute('gs-x'); // verify node (easiest) and attr are the same
    let y = el.getAttribute('gs-y');
    console.log((g || el.gridstackNode.grid.opts.id) + ' dragstart ' + (n.content || '') + ' pos: (' + n.x + ',' + n.y + ') = (' + x + ',' + y + ')');
  })
  .on('drag', function(event, el) {
    let n = el.gridstackNode;
    let x = el.getAttribute('gs-x'); // verify node (easiest) and attr are the same
    let y = el.getAttribute('gs-y');
    // console.log((g || el.gridstackNode.grid.opts.id) + ' drag ' + (n.content || '') + ' pos: (' + n.x + ',' + n.y + ') = (' + x + ',' + y + ')');
  })
  .on('dragstop', function(event, el) {
    let n = el.gridstackNode;
    let x = el.getAttribute('gs-x'); // verify node (easiest) and attr are the same
    let y = el.getAttribute('gs-y');
    console.log((g || el.gridstackNode.grid.opts.id) + ' dragstop ' + (n.content || '') + ' pos: (' + n.x + ',' + n.y + ') = (' + x + ',' + y + ')');
  })
  .on('dropped', function(event, previousNode, newNode) {
    if (previousNode) {
      console.log((g || previousNode.grid.opts.id) + ' dropped - Removed widget from grid:', previousNode);
    }
    if (newNode) {
      console.log((g || newNode.grid.opts.id) + ' dropped - Added widget in grid:', newNode);
    }
  })
  .on('resizestart', function(event, el) {
    let n = el.gridstackNode;
    let rec = el.getBoundingClientRect();
    console.log(`${g || el.gridstackNode.grid.opts.id} resizestart ${n.content || ''} size: (${n.w}x${n.h}) = (${Math.round(rec.width)}x${Math.round(rec.height)})px`);

  })
  .on('resize', function(event, el) {
    let n = el.gridstackNode;
    let rec = el.getBoundingClientRect();
    console.log(`${g || el.gridstackNode.grid.opts.id} resize ${n.content || ''} size: (${n.w}x${n.h}) = (${Math.round(rec.width)}x${Math.round(rec.height)})px`);
  })
  .on('resizestop', function(event, el) {
    let n = el.gridstackNode;
    let rec = el.getBoundingClientRect();
    console.log(`${g || el.gridstackNode.grid.opts.id} resizestop ${n.content || ''} size: (${n.w}x${n.h}) = (${Math.round(rec.width)}x${Math.round(rec.height)})px`);
  });
}