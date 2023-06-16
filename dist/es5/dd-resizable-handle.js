"use strict";
/**
 * dd-resizable-handle.ts 8.3.0-dev
 * Copyright (c) 2021-2022 Alain Dumesny - see GridStack root license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDResizableHandle = void 0;
var dd_touch_1 = require("./dd-touch");
var DDResizableHandle = exports.DDResizableHandle = /** @class */ (function () {
    function DDResizableHandle(host, direction, option) {
        /** @internal true after we've moved enough pixels to start a resize */
        this.moving = false;
        this.host = host;
        this.dir = direction;
        this.option = option;
        // create var event binding so we can easily remove and still look like TS methods (unlike anonymous functions)
        this._mouseDown = this._mouseDown.bind(this);
        this._mouseMove = this._mouseMove.bind(this);
        this._mouseUp = this._mouseUp.bind(this);
        this._init();
    }
    /** @internal */
    DDResizableHandle.prototype._init = function () {
        var el = document.createElement('div');
        el.classList.add('ui-resizable-handle');
        el.classList.add("".concat(DDResizableHandle.prefix).concat(this.dir));
        el.style.zIndex = '100';
        el.style.userSelect = 'none';
        this.el = el;
        this.host.appendChild(this.el);
        this.el.addEventListener('mousedown', this._mouseDown);
        if (dd_touch_1.isTouch) {
            this.el.addEventListener('touchstart', dd_touch_1.touchstart);
            this.el.addEventListener('pointerdown', dd_touch_1.pointerdown);
            // this.el.style.touchAction = 'none'; // not needed unlike pointerdown doc comment
        }
        return this;
    };
    /** call this when resize handle needs to be removed and cleaned up */
    DDResizableHandle.prototype.destroy = function () {
        if (this.moving)
            this._mouseUp(this.mouseDownEvent);
        this.el.removeEventListener('mousedown', this._mouseDown);
        if (dd_touch_1.isTouch) {
            this.el.removeEventListener('touchstart', dd_touch_1.touchstart);
            this.el.removeEventListener('pointerdown', dd_touch_1.pointerdown);
        }
        this.host.removeChild(this.el);
        delete this.el;
        delete this.host;
        return this;
    };
    /** @internal called on mouse down on us: capture move on the entire document (mouse might not stay on us) until we release the mouse */
    DDResizableHandle.prototype._mouseDown = function (e) {
        this.mouseDownEvent = e;
        document.addEventListener('mousemove', this._mouseMove, true); // capture, not bubble
        document.addEventListener('mouseup', this._mouseUp, true);
        if (dd_touch_1.isTouch) {
            this.el.addEventListener('touchmove', dd_touch_1.touchmove);
            this.el.addEventListener('touchend', dd_touch_1.touchend);
        }
        e.stopPropagation();
        e.preventDefault();
    };
    /** @internal */
    DDResizableHandle.prototype._mouseMove = function (e) {
        var s = this.mouseDownEvent;
        if (this.moving) {
            this._triggerEvent('move', e);
        }
        else if (Math.abs(e.x - s.x) + Math.abs(e.y - s.y) > 2) {
            // don't start unless we've moved at least 3 pixels
            this.moving = true;
            this._triggerEvent('start', this.mouseDownEvent);
            this._triggerEvent('move', e);
        }
        e.stopPropagation();
        e.preventDefault();
    };
    /** @internal */
    DDResizableHandle.prototype._mouseUp = function (e) {
        if (this.moving) {
            this._triggerEvent('stop', e);
        }
        document.removeEventListener('mousemove', this._mouseMove, true);
        document.removeEventListener('mouseup', this._mouseUp, true);
        if (dd_touch_1.isTouch) {
            this.el.removeEventListener('touchmove', dd_touch_1.touchmove);
            this.el.removeEventListener('touchend', dd_touch_1.touchend);
        }
        delete this.moving;
        delete this.mouseDownEvent;
        e.stopPropagation();
        e.preventDefault();
    };
    /** @internal */
    DDResizableHandle.prototype._triggerEvent = function (name, event) {
        if (this.option[name])
            this.option[name](event);
        return this;
    };
    /** @internal */
    DDResizableHandle.prefix = 'ui-resizable-';
    return DDResizableHandle;
}());
//# sourceMappingURL=dd-resizable-handle.js.map