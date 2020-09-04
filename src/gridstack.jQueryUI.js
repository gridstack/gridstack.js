/** gridstack.js 1.2.1 - JQuery UI Drag&Drop plugin @preserve */
/**
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'gridstack', 'exports'], factory);
  } else if (typeof exports !== 'undefined') {
    try { jQuery = require('jquery'); } catch (e) {}
    try { gridstack = require('gridstack'); } catch (e) {}
    factory(jQuery, gridstack.GridStack, exports);
  } else {
    factory(jQuery, GridStack, window);
  }
})(function($, GridStack, scope) {
  /**
  * @class JQueryUIGridStackDragDropPlugin
  * jQuery UI implementation of drag'n'drop gridstack plugin.
  */
  function JQueryUIGridStackDragDropPlugin(grid) {
    GridStack.DragDropPlugin.call(this, grid);
  }

  GridStack.DragDropPlugin.registerPlugin(JQueryUIGridStackDragDropPlugin);

  JQueryUIGridStackDragDropPlugin.prototype = Object.create(GridStack.DragDropPlugin.prototype);
  JQueryUIGridStackDragDropPlugin.prototype.constructor = JQueryUIGridStackDragDropPlugin;

  JQueryUIGridStackDragDropPlugin.prototype.resizable = function(el, opts) {
    el = $(el);
    if (opts === 'disable' || opts === 'enable' || opts === 'destroy') {
      el.resizable(opts);
    } else if (opts === 'option') {
      var key = arguments[2];
      var value = arguments[3];
      el.resizable(opts, key, value);
    } else {
      var handles = el.data('gs-resize-handles') ? el.data('gs-resize-handles') :
        this.grid.opts.resizable.handles;
      el.resizable($.extend({}, this.grid.opts.resizable, {
        handles: handles
      }, {
        start: opts.start || function() {},
        stop: opts.stop || function() {},
        resize: opts.resize || function() {}
      }));
    }
    return this;
  };

  JQueryUIGridStackDragDropPlugin.prototype.draggable = function(el, opts) {
    el = $(el);
    if (opts === 'disable' || opts === 'enable' || opts === 'destroy') {
      el.draggable(opts);
    } else {
      el.draggable($.extend({}, this.grid.opts.draggable, {
        containment: (this.grid.opts.isNested && !this.grid.opts.dragOut) ?
          this.grid.$el.parent() :
          (this.grid.opts.draggable.containment || null),
        start: opts.start || function() {},
        stop: opts.stop || function() {},
        drag: opts.drag || function() {}
      }));
    }
    return this;
  };

  JQueryUIGridStackDragDropPlugin.prototype.droppable = function(el, opts) {
    el = $(el);
    el.droppable(opts);
    return this;
  };

  JQueryUIGridStackDragDropPlugin.prototype.isDroppable = function(el, opts) {
    el = $(el);
    return Boolean(el.data('droppable'));
  };

  JQueryUIGridStackDragDropPlugin.prototype.on = function(el, eventName, callback) {
    $(el).on(eventName, callback);
    return this;
  };

  scope.JQueryUIGridStackDragDropPlugin = JQueryUIGridStackDragDropPlugin;

  return JQueryUIGridStackDragDropPlugin;
});
