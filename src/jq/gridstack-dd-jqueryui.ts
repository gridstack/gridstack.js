// gridstack-dd-jqueryui.ts 2.0.0-dev @preserve

/** JQuery UI Drag&Drop plugin
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/

import { GridStack, GridStackElement } from '../gridstack';
import { GridStackDD, DDOpts, DDKey, DDDropOpt, DDCallback, DDValue } from '../gridstack-dd';
import { GridItemHTMLElement, DDDragInOpt } from '../types';

// TODO: TEMPORARY until can remove jquery-ui drag&drop and this class and use HTML5 instead !
// see https://stackoverflow.com/questions/35345760/importing-jqueryui-with-typescript-and-requirejs
import * as $ from './jquery';
export { $ };
export * from './jquery-ui';

/**
 * Jquery-ui based drag'n'drop plugin.
 */
export class GridStackDDJQueryUI extends GridStackDD {
  public constructor(grid: GridStack) {
    super(grid);
  }

  public resizable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): GridStackDD {
    let $el: JQuery = $(el);
    if (opts === 'disable' || opts === 'enable') {
      $el.resizable(opts);
    } else if (opts === 'destroy') {
      if ($el.data('ui-resizable')) { // error to call destroy if not there
        $el.resizable(opts);
      }
    } else if (opts === 'option') {
      $el.resizable(opts, key, value);
    } else {
      let handles = $el.data('gs-resize-handles') ? $el.data('gs-resize-handles') : this.grid.opts.resizable.handles;
      $el.resizable({...this.grid.opts.resizable, ...{handles: handles}, ...{ // was using $.extend()
        start: opts.start, // || function() {},
        stop: opts.stop, // || function() {},
        resize: opts.resize // || function() {}
      }});
    }
    return this;
  }

  public draggable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): GridStackDD {
    let $el: JQuery = $(el);
    if (opts === 'disable' || opts === 'enable') {
      $el.draggable(opts);
    } else if (opts === 'destroy') {
      if ($el.data('ui-draggable')) { // error to call destroy if not there
        $el.draggable(opts);
      }
    } else if (opts === 'option') {
      $el.draggable(opts, key, value);
    } else {
      $el.draggable({...this.grid.opts.draggable, ...{ // was using $.extend()
        containment: (this.grid.opts._isNested && !this.grid.opts.dragOut) ?
          $(this.grid.el).parent() : (this.grid.opts.draggable.containment || null),
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
    $el.droppable(opts, key, value);
    return this;
  }

  public isDroppable(el: GridItemHTMLElement): boolean {
    let $el: JQuery = $(el);
    return Boolean($el.data('ui-droppable'));
  }

  public isDraggable(el: GridStackElement): boolean {
    let $el: JQuery = $(el as any); // workaround Type 'string' is not assignable to type 'PlainObject<any>' - see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/29312
    return Boolean($el.data('ui-draggable'));
  }

  public on(el: GridItemHTMLElement, name: string, callback: DDCallback): GridStackDD {
    let $el: JQuery = $(el);
    $el.on(name, (event, ui) => { callback(event as any, ui.draggable ? ui.draggable[0] : event.target, ui.helper ? ui.helper[0] : null) });
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
