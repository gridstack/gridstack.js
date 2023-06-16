import { NgCompInputs, NgGridStackWidget } from './gridstack.component';
import * as i0 from "@angular/core";
export declare abstract class BaseWidget {
    /**
     * REDEFINE to return an object representing the data needed to re-create yourself, other than `selector` already handled.
     * This should map directly to the @Input() fields of this objects on create, so a simple apply can be used on read
     */
    serialize(): NgCompInputs | undefined;
    /**
     * REDEFINE this if your widget needs to read from saved data and transform it to create itself - you do this for
     * things that are not mapped directly into @Input() fields for example.
     */
    deserialize(w: NgGridStackWidget): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseWidget, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BaseWidget>;
}
