"use strict";
/**
 * dd-base-impl.ts 8.3.0-dev
 * Copyright (c) 2021-2022 Alain Dumesny - see GridStack root license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDBaseImplement = void 0;
var DDBaseImplement = /** @class */ (function () {
    function DDBaseImplement() {
        /** @internal */
        this._eventRegister = {};
    }
    Object.defineProperty(DDBaseImplement.prototype, "disabled", {
        /** returns the enable state, but you have to call enable()/disable() to change (as other things need to happen) */
        get: function () { return this._disabled; },
        enumerable: false,
        configurable: true
    });
    DDBaseImplement.prototype.on = function (event, callback) {
        this._eventRegister[event] = callback;
    };
    DDBaseImplement.prototype.off = function (event) {
        delete this._eventRegister[event];
    };
    DDBaseImplement.prototype.enable = function () {
        this._disabled = false;
    };
    DDBaseImplement.prototype.disable = function () {
        this._disabled = true;
    };
    DDBaseImplement.prototype.destroy = function () {
        delete this._eventRegister;
    };
    DDBaseImplement.prototype.triggerEvent = function (eventName, event) {
        if (!this.disabled && this._eventRegister && this._eventRegister[eventName])
            return this._eventRegister[eventName](event);
    };
    return DDBaseImplement;
}());
exports.DDBaseImplement = DDBaseImplement;
//# sourceMappingURL=dd-base-impl.js.map