/**
 * gridstack-item.component.ts 13.0.0
 * Copyright (c) 2022-2024 Alain Dumesny - see GridStack root license
 */

/**
 * Abstract base class that all custom widgets should extend.
 *
 * This class provides the interface needed for GridstackItemComponent to:
 * - Serialize/deserialize widget data
 * - Save/restore widget state
 * - Integrate with Angular lifecycle
 *
 * Extend this class when creating custom widgets for dynamic grids.
 *
 * @example
 * ```typescript
 * @Component({
 *   selector: 'app-my-widget',
 *   template: '<div>{{data}}</div>'
 * })
 * export class MyWidget extends BaseWidget {
 *   data = input(''); // signal input (Angular 17+) — or @Input() data = ''
 *
 *   override serialize() {
 *     return { data: this.data() };
 *   }
 * }
 * // Register so the widget JSON { component: 'app-my-widget', props: { data: 'hello' } } works:
 * GridstackComponent.registerComponents([MyWidget]);
 * ```
 */

import { ComponentRef, Injectable } from '@angular/core';
import { NgCompInputs, NgGridStackWidget } from './types';

/**
 * Base widget class for GridStack Angular integration.
 */
@Injectable()
export abstract class BaseWidget {

  /**
   * Complete widget definition including position, size, and Angular-specific data.
   * Populated automatically when the widget is loaded or saved.
   */
  public widgetItem?: NgGridStackWidget;

  /** @internal set by GridstackComponent to enable signal-based input support via setInput() */
  public _compRef?: ComponentRef<BaseWidget>;

  /**
   * Override this method to return serializable data for this widget.
   *
   * Return an object with properties that map to your component's @Input() fields.
   * The selector is handled automatically, so only include component-specific data.
   *
   * @returns Object containing serializable component data
   *
   * @example
   * ```typescript
   * serialize() {
   *   return {
   *     title: this.title,
   *     value: this.value,
   *     settings: this.settings
   *   };
   * }
   * ```
   */
  public serialize(): NgCompInputs | undefined  { return; }

  /**
   * Override this method to handle widget restoration from saved data.
   *
   * Use this for complex initialization that goes beyond simple @Input() mapping.
   * The default implementation automatically assigns input data to component properties.
   *
   * @param w The saved widget data including input properties
   *
 * @example
 * ```typescript
 * override deserialize(w: NgGridStackWidget) {
 *   super.deserialize(w); // Call parent for basic setup
 *
 *   // Custom initialization logic
 *   if (w.props?.complexData) {
 *     this.processComplexData(w.props.complexData);
 *   }
 * }
 * ```
   */
  public deserialize(w: NgGridStackWidget)  {
    // save full description for meta data
    this.widgetItem = w;
    if (!w?.props) return;

    if (this._compRef) {
      // Use setInput() to correctly handle both @Input() decorator and signal-based inputs (Angular 17+).
      // Direct Object.assign overwrites signal functions with plain values, breaking signal inputs.
      Object.keys(w.props).forEach(key => this._compRef!.setInput(key, (w.props as any)[key]));
    } else {
      Object.assign(this, w.props);
    }
  }
}
