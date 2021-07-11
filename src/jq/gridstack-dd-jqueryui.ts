// gridstack-dd-jqueryui.ts 4.2.6
// Copyright (c) 2021 Alain Dumesny - see root license
import { GridStackElement } from '../gridstack';
import { GridStackDD, DDOpts, DDKey, DDDropOpt, DDCallback, DDValue } from '../gridstack-dd';
import { GridItemHTMLElement, DDDragInOpt } from '../types';

// export jq symbols see
// https://stackoverflow.com/questions/35345760/importing-jqueryui-with-typescript-and-requirejs
// https://stackoverflow.com/questions/33998262/jquery-ui-and-webpack-how-to-manage-it-into-module
//
// Note: user should be able to bring their own by changing their webpack aliases like
// alias: {
//   'jquery': 'gridstack/dist/jq/jquery.js',
//   'jquery-ui': 'gridstack/dist/jq/jquery-ui.js',
//   'jquery.ui': 'gridstack/dist/jq/jquery-ui.js',
//   'jquery.ui.touch-punch': 'gridstack/dist/jq/jquery.ui.touch-punch.js',
// },
import * as $ from 'jquery'; // compile this in... having issues TS/ES6 app would include instead
export { $ };
import 'jquery-ui';
import 'jquery.ui.touch-punch'; // include for touch mobile devices

// export our base class (what user should use) and all associated types
export * from '../gridstack-dd';

/**
 * legacy Jquery-ui based drag'n'drop plugin.
 */
export class GridStackDDJQueryUI extends GridStackDD {

  public resizable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): GridStackDD {
    let $el: JQuery = $(el);
    if (opts === 'enable') {
      $el.resizable().resizable(opts);
    } else if (opts === 'disable' || opts === 'destroy') {
      if ($el.data('ui-resizable')) { // error to call destroy if not there
        $el.resizable(opts);
      }
    } else if (opts === 'option') {
      $el.resizable(opts, key, value);
    } else {
      const grid = el.gridstackNode.grid;
      let handles = $el.data('gs-resize-handles') ? $el.data('gs-resize-handles') : grid.opts.resizable.handles;
      $el.resizable({
        ...grid.opts.resizable,
        ...{ handles: handles },
        ...{
          start: opts.start, // || function() {},
          stop: opts.stop, // || function() {},
          resize: opts.resize // || function() {}
        }
      });
    }
    return this;
  }

  public draggable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): GridStackDD {
    let $el: JQuery = $(el);
    if (opts === 'enable') {
      $el.draggable().draggable('enable');
    } else if (opts === 'disable' || opts === 'destroy') {
      if ($el.data('ui-draggable')) { // error to call destroy if not there
        $el.draggable(opts);
      }
    } else if (opts === 'option') {
      $el.draggable(opts, key, value);
    } else {
      const grid = el.gridstackNode.grid;
      $el.draggable({...grid.opts.draggable, ...{ // was using $.extend()
        containment: (grid.opts._isNested && !grid.opts.dragOut) ?
          $(grid.el).parent() : (grid.opts.draggable.containment || null),
        start: opts.start, // || function() {},
        stop: opts.stop, // || function() {},
        drag: opts.drag // || function() {}
      }});
    }
    return this;
  }

  public dragIn(el: GridStackElement, opts: DDDragInOpt): GridStackDD {
    let $el: JQuery = $(el as any); // workaround Type 'string' is not assignable to type 'PlainObject<any>' - see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/29312
    $el.draggable(opts);
    return this;
  }

  public droppable(el: GridItemHTMLElement, opts: DDOpts | DDDropOpt, key?: DDKey, value?: DDValue): GridStackDD {
    let $el: JQuery = $(el);
    if (typeof opts.accept === 'function' && !opts._accept) {
      // convert jquery event to generic element
      opts._accept = opts.accept;
      opts.accept = ($el: JQuery) => opts._accept($el.get(0));
    }
    if (opts === 'disable' || opts === 'destroy') {
      if ($el.data('ui-droppable')) { // error to call destroy if not there
        $el.droppable(opts);
      }
    } else {
      $el.droppable(opts, key, value);
    }
    return this;
  }

  public isDroppable(el: HTMLElement): boolean {
    let $el: JQuery = $(el);
    return Boolean($el.data('ui-droppable'));
  }

  public isDraggable(el: HTMLElement): boolean {
    let $el: JQuery = $(el);
    return Boolean($el.data('ui-draggable'));
  }

  public isResizable(el: HTMLElement): boolean {
    let $el: JQuery = $(el);
    return Boolean($el.data('ui-resizable'));
  }

  public on(el: GridItemHTMLElement, name: string, callback: DDCallback): GridStackDD {
    let $el: JQuery = $(el);
    $el.on(name, (event, ui) => { return callback(event as any, ui.draggable ? ui.draggable[0] : event.target, ui.helper ? ui.helper[0] : null) });
    return this;
  }

  public off(el: GridItemHTMLElement, name: string): GridStackDD {
    let $el: JQuery = $(el);
    $el.off(name);
    return this;
  }
}

// finally register ourself
GridStackDD.registerPlugin(GridStackDDJQueryUI);
