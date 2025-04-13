/**
 * gridstack-item.component.ts 12.0.0-dev
 * Copyright (c) 2022-2024 Alain Dumesny - see GridStack root license
 */

/**
 * Base interface that all widgets need to implement in order for GridstackItemComponent to correctly save/load/delete/..
 */

import { Injectable } from '@angular/core';
import { NgCompInputs, NgGridStackWidget } from './types';

 @Injectable()
 export abstract class BaseWidget {

  /** variable that holds the complete definition of this widgets (with selector,x,y,w,h) */
  public widgetItem?: NgGridStackWidget;

  /**
   * REDEFINE to return an object representing the data needed to re-create yourself, other than `selector` already handled.
   * This should map directly to the @Input() fields of this objects on create, so a simple apply can be used on read
   */
  public serialize(): NgCompInputs | undefined  { return; }

  /**
   * REDEFINE this if your widget needs to read from saved data and transform it to create itself - you do this for
   * things that are not mapped directly into @Input() fields for example.
   */
  public deserialize(w: NgGridStackWidget)  {
    // save full description for meta data
    this.widgetItem = w;
    if (!w) return;

    if (w.input)  Object.assign(this, w.input);
  }
 }
