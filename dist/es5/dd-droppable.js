"use strict";
/**
 * dd-droppable.ts 8.3.0-dev
 * Copyright (c) 2021-2022 Alain Dumesny - see GridStack root license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDDroppable = void 0;
var dd_manager_1 = require("./dd-manager");
var dd_base_impl_1 = require("./dd-base-impl");
var utils_1 = require("./utils");
var dd_touch_1 = require("./dd-touch");
// let count = 0; // TEST
var DDDroppable = /** @class */ (function (_super) {
    __extends(DDDroppable, _super);
    function DDDroppable(el, opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this) || this;
        _this.el = el;
        _this.option = opts;
        // create var event binding so we can easily remove and still look like TS methods (unlike anonymous functions)
        _this._mouseEnter = _this._mouseEnter.bind(_this);
        _this._mouseLeave = _this._mouseLeave.bind(_this);
        _this.enable();
        _this._setupAccept();
        return _this;
    }
    DDDroppable.prototype.on = function (event, callback) {
        _super.prototype.on.call(this, event, callback);
    };
    DDDroppable.prototype.off = function (event) {
        _super.prototype.off.call(this, event);
    };
    DDDroppable.prototype.enable = function () {
        if (this.disabled === false)
            return;
        _super.prototype.enable.call(this);
        this.el.classList.add('ui-droppable');
        this.el.classList.remove('ui-droppable-disabled');
        this.el.addEventListener('mouseenter', this._mouseEnter);
        this.el.addEventListener('mouseleave', this._mouseLeave);
        if (dd_touch_1.isTouch) {
            this.el.addEventListener('pointerenter', dd_touch_1.pointerenter);
            this.el.addEventListener('pointerleave', dd_touch_1.pointerleave);
        }
    };
    DDDroppable.prototype.disable = function (forDestroy) {
        if (forDestroy === void 0) { forDestroy = false; }
        if (this.disabled === true)
            return;
        _super.prototype.disable.call(this);
        this.el.classList.remove('ui-droppable');
        if (!forDestroy)
            this.el.classList.add('ui-droppable-disabled');
        this.el.removeEventListener('mouseenter', this._mouseEnter);
        this.el.removeEventListener('mouseleave', this._mouseLeave);
        if (dd_touch_1.isTouch) {
            this.el.removeEventListener('pointerenter', dd_touch_1.pointerenter);
            this.el.removeEventListener('pointerleave', dd_touch_1.pointerleave);
        }
    };
    DDDroppable.prototype.destroy = function () {
        this.disable(true);
        this.el.classList.remove('ui-droppable');
        this.el.classList.remove('ui-droppable-disabled');
        _super.prototype.destroy.call(this);
    };
    DDDroppable.prototype.updateOption = function (opts) {
        var _this = this;
        Object.keys(opts).forEach(function (key) { return _this.option[key] = opts[key]; });
        this._setupAccept();
        return this;
    };
    /** @internal called when the cursor enters our area - prepare for a possible drop and track leaving */
    DDDroppable.prototype._mouseEnter = function (e) {
        // console.log(`${count++} Enter ${this.el.id || (this.el as GridHTMLElement).gridstack.opts.id}`); // TEST
        if (!dd_manager_1.DDManager.dragElement)
            return;
        if (!this._canDrop(dd_manager_1.DDManager.dragElement.el))
            return;
        e.preventDefault();
        e.stopPropagation();
        // make sure when we enter this, that the last one gets a leave FIRST to correctly cleanup as we don't always do
        if (dd_manager_1.DDManager.dropElement && dd_manager_1.DDManager.dropElement !== this) {
            dd_manager_1.DDManager.dropElement._mouseLeave(e);
        }
        dd_manager_1.DDManager.dropElement = this;
        var ev = utils_1.Utils.initEvent(e, { target: this.el, type: 'dropover' });
        if (this.option.over) {
            this.option.over(ev, this._ui(dd_manager_1.DDManager.dragElement));
        }
        this.triggerEvent('dropover', ev);
        this.el.classList.add('ui-droppable-over');
        // console.log('tracking'); // TEST
    };
    /** @internal called when the item is leaving our area, stop tracking if we had moving item */
    DDDroppable.prototype._mouseLeave = function (e) {
        var _a;
        // console.log(`${count++} Leave ${this.el.id || (this.el as GridHTMLElement).gridstack.opts.id}`); // TEST
        if (!dd_manager_1.DDManager.dragElement || dd_manager_1.DDManager.dropElement !== this)
            return;
        e.preventDefault();
        e.stopPropagation();
        var ev = utils_1.Utils.initEvent(e, { target: this.el, type: 'dropout' });
        if (this.option.out) {
            this.option.out(ev, this._ui(dd_manager_1.DDManager.dragElement));
        }
        this.triggerEvent('dropout', ev);
        if (dd_manager_1.DDManager.dropElement === this) {
            delete dd_manager_1.DDManager.dropElement;
            // console.log('not tracking'); // TEST
            // if we're still over a parent droppable, send it an enter as we don't get one from leaving nested children
            var parentDrop = void 0;
            var parent_1 = this.el.parentElement;
            while (!parentDrop && parent_1) {
                parentDrop = (_a = parent_1.ddElement) === null || _a === void 0 ? void 0 : _a.ddDroppable;
                parent_1 = parent_1.parentElement;
            }
            if (parentDrop) {
                parentDrop._mouseEnter(e);
            }
        }
    };
    /** item is being dropped on us - called by the drag mouseup handler - this calls the client drop event */
    DDDroppable.prototype.drop = function (e) {
        e.preventDefault();
        var ev = utils_1.Utils.initEvent(e, { target: this.el, type: 'drop' });
        if (this.option.drop) {
            this.option.drop(ev, this._ui(dd_manager_1.DDManager.dragElement));
        }
        this.triggerEvent('drop', ev);
    };
    /** @internal true if element matches the string/method accept option */
    DDDroppable.prototype._canDrop = function (el) {
        return el && (!this.accept || this.accept(el));
    };
    /** @internal */
    DDDroppable.prototype._setupAccept = function () {
        var _this = this;
        if (!this.option.accept)
            return this;
        if (typeof this.option.accept === 'string') {
            this.accept = function (el) { return el.matches(_this.option.accept); };
        }
        else {
            this.accept = this.option.accept;
        }
        return this;
    };
    /** @internal */
    DDDroppable.prototype._ui = function (drag) {
        return __assign({ draggable: drag.el }, drag.ui());
    };
    return DDDroppable;
}(dd_base_impl_1.DDBaseImplement));
exports.DDDroppable = DDDroppable;
//# sourceMappingURL=dd-droppable.js.map