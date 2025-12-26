/**
 * gridstack-item.component.ts 12.4.2
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
 *   selector: 'my-custom-widget',
 *   template: '<div>{{data}}</div>'
 * })
 * export class MyCustomWidget extends BaseWidget {
 *   @Input() data: string = '';
 *
 *   serialize() {
 *     return { data: this.data };
 *   }
 * }
 * ```
 */

import { Injectable } from '@angular/core';
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
   * deserialize(w: NgGridStackWidget) {
   *   super.deserialize(w); // Call parent for basic setup
   *
   *   // Custom initialization logic
   *   if (w.input?.complexData) {
   *     this.processComplexData(w.input.complexData);
   *   }
   * }
   * ```
   */
  public deserialize(w: NgGridStackWidget)  {
    // save full description for meta data
    this.widgetItem = w;
    if (!w) return;

    if (w.input)  Object.assign(this, w.input);
  }
}
