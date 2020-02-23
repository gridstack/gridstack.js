/** gridstack.js 1.0.0-rc - JQuery UI Drag&Drop plugin @preserve */
/**
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/

import { GridStack } from './gridstack';
import { GridStackDragDropPlugin, DDOpts, DDKey } from './gridstack-dragdrop-plugin';
import { GridStackElement } from './types';

// TODO: TEMPORARY until can remove jquery-ui drag&drop and this class!
// see https://stackoverflow.com/questions/35345760/importing-jqueryui-with-typescript-and-requirejs
import $ from './jquery.js';
import './jquery-ui.js';

/**
 * Jquery-ui based drag'n'drop plugin.
 */
export class JQueryUIGridStackDragDropPlugin extends GridStackDragDropPlugin {
  public constructor(grid: GridStack) {
    super(grid);
  }

  public resizable(el: GridStackElement, opts: DDOpts, key?: DDKey, value?): GridStackDragDropPlugin {
    var $el = $(el);
    if (opts === 'disable' || opts === 'enable') {
        $el.resizable(opts);
    } else if (opts === 'option') {
      $el.resizable(opts, key, value);
    } else {
      var handles = $el.data('gs-resize-handles') ? $el.data('gs-resize-handles') : this.grid.opts.resizable.handles;
      $el.resizable({...this.grid.opts.resizable, ...{handles: handles}, ...{ // was using $.extend()
        start: opts.start || function() {},
        stop: opts.stop || function() {},
        resize: opts.resize || function() {}
      }});
    }
    return this;
  };

  public draggable(el: GridStackElement, opts: DDOpts, key?: DDKey, value?): GridStackDragDropPlugin {
    var $el = $(el);
    if (opts === 'disable' || opts === 'enable') {
      $el.draggable(opts);
    } else {
      $el.draggable({...this.grid.opts.draggable, ...{ // was using $.extend()
        containment: (this.grid.opts._isNested && !this.grid.opts.dragOut) ?
          $(this.grid.el).parent() : (this.grid.opts.draggable.containment || null),
        start: opts.start || function() {},
        stop: opts.stop || function() {},
        drag: opts.drag || function() {}
      }});
    }
    return this;
  };

  public droppable(el: GridStackElement, opts: DDOpts, key?: DDKey, value?): GridStackDragDropPlugin {
    var $el = $(el);
    $el.droppable(opts);
    return this;
  };

  public isDroppable(el: GridStackElement): boolean {
    var $el = $(el);
    return Boolean($el.data('droppable'));
  };

  public on(el: GridStackElement, eventName: string, callback): GridStackDragDropPlugin {
    $(el).on(eventName, callback);
    return this;
  };
}

// finally register ourself
GridStackDragDropPlugin.registerPlugin(JQueryUIGridStackDragDropPlugin);

/* OLD code for reference 
function JQueryUIGridStackDragDropPlugin(grid) {
  GridStack.DragDropPlugin.call(this, grid);
}

GridStack.DragDropPlugin.registerPlugin(JQueryUIGridStackDragDropPlugin);

JQueryUIGridStackDragDropPlugin.prototype = Object.create(GridStack.DragDropPlugin.prototype);
JQueryUIGridStackDragDropPlugin.prototype.constructor = JQueryUIGridStackDragDropPlugin;
....
scope.JQueryUIGridStackDragDropPlugin = JQueryUIGridStackDragDropPlugin;
return JQueryUIGridStackDragDropPlugin;
*/