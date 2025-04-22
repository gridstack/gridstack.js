/**
 * Simplest Angular Example using GridStack API directly
 */
import { Component, computed, model, ModelSignal, Signal, viewChild } from '@angular/core';

import { GridStack } from 'gridstack';
import { GridstackComponent, NgGridStackOptions, NgGridStackWidget } from 'gridstack/dist/angular';
import { BaseWidget } from '../../../lib/src';

@Component({
  selector: 'angular-signal-based',
  standalone: true,
  template: `
    <div style="color:{{ computedValue() }};">
      <h3>Title:{{ title() }}</h3>
      <p>Description {{ description() }}</p>
    </div>`,
})
export class SignalBasedComponent extends BaseWidget {
  title: ModelSignal<string | undefined> = model<string>();
  description: ModelSignal<string | undefined> = model<string>();
  id: ModelSignal<number> = model<number>(0);

  computedValue: Signal<"#FFF" | "#000"> = computed(() => {
    return this.id() % 2 ? '#FFF' : '#000';
  })
}

@Component({
  selector: 'angular-signal-test',
  template: `
    <p><b>SIMPLEST</b>: angular example using GridStack API directly, so not really using any angular construct per say
      other than waiting for DOM rendering</p>
    <button (click)="add()">add item</button>
    <gridstack [options]="gridOptions"></gridstack>
  `,
  // gridstack.min.css and other custom styles should be included in global styles.scss
})
export class AngularSignalComponent {
  private gridComp = viewChild(GridstackComponent);

  private ids = 0;
  private grid!: GridStack;

  gridOptions: NgGridStackOptions = {
    margin: 5,
    minRow: 1,
    float: true,
    column: 12,
    columnOpts: {
      columnMax: 12,
      breakpoints: [
        {
          w: 800,
          c: 6,
          layout: 'none',
        },
        {
          w: 500,
          c: 3,
          layout: 'none',
        },
      ],
    },
  };

  constructor() {
    GridstackComponent.addComponentToSelectorType([
      SignalBasedComponent,
    ]);
  }

  public add() {
    const id = ++this.ids;
    this.gridComp()?.grid?.addWidget({
      autoPosition: true,
      w: 2,
      h: 1,
      selector: 'angular-signal-based',
      input: {
        title: `Item #${id} (signal)`,
        description: `Description ${id*2}`,
        id
      },
      id: String(this.ids),
    } as NgGridStackWidget);
  }
}
