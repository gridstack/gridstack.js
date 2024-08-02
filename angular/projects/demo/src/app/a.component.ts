/**
 * gridstack.component.ts 8.2.1
 * Copyright (c) 2022 Alain Dumesny - see GridStack root license
 */

// dummy testing component that will be grid items content

import { Component, OnDestroy, Input } from '@angular/core';
import { BaseWidget } from 'gridstack/dist/angular';

@Component({
  selector: 'app-a',
  templateUrl: './a.component.html',
})
export class AComponent extends BaseWidget implements OnDestroy {
  ngOnDestroy() { console.log('Comp A destroyed'); } // test to make sure cleanup happens
}

