"use strict";
/**
 * dd-resizable.ts 8.3.0-dev
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDResizable = void 0;
var dd_resizable_handle_1 = require("./dd-resizable-handle");
var dd_base_impl_1 = require("./dd-base-impl");
var utils_1 = require("./utils");
var dd_manager_1 = require("./dd-manager");
var DDResizable = exports.DDResizable = /** @class */ (function (_super) {
    __extends(DDResizable, _super);
    function DDResizable(el, opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this) || this;
        /** @internal */
        _this._ui = function () {
            var containmentEl = _this.el.parentElement;
            var containmentRect = containmentEl.getBoundingClientRect();
            var newRect = {
                width: _this.originalRect.width,
                height: _this.originalRect.height + _this.scrolled,
                left: _this.originalRect.left,
                top: _this.originalRect.top - _this.scrolled
            };
            var rect = _this.temporalRect || newRect;
            return {
                position: {
                    left: rect.left - containmentRect.left,
                    top: rect.top - containmentRect.top
                },
                size: {
                    width: rect.width,
                    height: rect.height
                }
                /* Gridstack ONLY needs position set above... keep around in case.
                element: [this.el], // The object representing the element to be resized
                helper: [], // TODO: not support yet - The object representing the helper that's being resized
                originalElement: [this.el],// we don't wrap here, so simplify as this.el //The object representing the original element before it is wrapped
                originalPosition: { // The position represented as { left, top } before the resizable is resized
                  left: this.originalRect.left - containmentRect.left,
                  top: this.originalRect.top - containmentRect.top
                },
                originalSize: { // The size represented as { width, height } before the resizable is resized
                  width: this.originalRect.width,
                  height: this.originalRect.height
                }
                */
            };
        };
        _this.el = el;
        _this.option = opts;
        // create var event binding so we can easily remove and still look like TS methods (unlike anonymous functions)
        _this._mouseOver = _this._mouseOver.bind(_this);
        _this._mouseOut = _this._mouseOut.bind(_this);
        _this.enable();
        _this._setupAutoHide(_this.option.autoHide);
        _this._setupHandlers();
        return _this;
    }
    DDResizable.prototype.on = function (event, callback) {
        _super.prototype.on.call(this, event, callback);
    };
    DDResizable.prototype.off = function (event) {
        _super.prototype.off.call(this, event);
    };
    DDResizable.prototype.enable = function () {
        _super.prototype.enable.call(this);
        this.el.classList.remove('ui-resizable-disabled');
        this._setupAutoHide(this.option.autoHide);
    };
    DDResizable.prototype.disable = function () {
        _super.prototype.disable.call(this);
        this.el.classList.add('ui-resizable-disabled');
        this._setupAutoHide(false);
    };
    DDResizable.prototype.destroy = function () {
        this._removeHandlers();
        this._setupAutoHide(false);
        delete this.el;
        _super.prototype.destroy.call(this);
    };
    DDResizable.prototype.updateOption = function (opts) {
        var _this = this;
        var updateHandles = (opts.handles && opts.handles !== this.option.handles);
        var updateAutoHide = (opts.autoHide && opts.autoHide !== this.option.autoHide);
        Object.keys(opts).forEach(function (key) { return _this.option[key] = opts[key]; });
        if (updateHandles) {
            this._removeHandlers();
            this._setupHandlers();
        }
        if (updateAutoHide) {
            this._setupAutoHide(this.option.autoHide);
        }
        return this;
    };
    /** @internal turns auto hide on/off */
    DDResizable.prototype._setupAutoHide = function (auto) {
        if (auto) {
            this.el.classList.add('ui-resizable-autohide');
            // use mouseover and not mouseenter to get better performance and track for nested cases
            this.el.addEventListener('mouseover', this._mouseOver);
            this.el.addEventListener('mouseout', this._mouseOut);
        }
        else {
            this.el.classList.remove('ui-resizable-autohide');
            this.el.removeEventListener('mouseover', this._mouseOver);
            this.el.removeEventListener('mouseout', this._mouseOut);
            if (dd_manager_1.DDManager.overResizeElement === this) {
                delete dd_manager_1.DDManager.overResizeElement;
            }
        }
        return this;
    };
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    DDResizable.prototype._mouseOver = function (e) {
        // console.log(`${count++} pre-enter ${(this.el as GridItemHTMLElement).gridstackNode._id}`)
        // already over a child, ignore. Ideally we just call e.stopPropagation() but see https://github.com/gridstack/gridstack.js/issues/2018
        if (dd_manager_1.DDManager.overResizeElement || dd_manager_1.DDManager.dragElement)
            return;
        dd_manager_1.DDManager.overResizeElement = this;
        // console.log(`${count++} enter ${(this.el as GridItemHTMLElement).gridstackNode._id}`)
        this.el.classList.remove('ui-resizable-autohide');
    };
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    DDResizable.prototype._mouseOut = function (e) {
        // console.log(`${count++} pre-leave ${(this.el as GridItemHTMLElement).gridstackNode._id}`)
        if (dd_manager_1.DDManager.overResizeElement !== this)
            return;
        delete dd_manager_1.DDManager.overResizeElement;
        // console.log(`${count++} leave ${(this.el as GridItemHTMLElement).gridstackNode._id}`)
        this.el.classList.add('ui-resizable-autohide');
    };
    /** @internal */
    DDResizable.prototype._setupHandlers = function () {
        var _this = this;
        var handlerDirection = this.option.handles || 'e,s,se';
        if (handlerDirection === 'all') {
            handlerDirection = 'n,e,s,w,se,sw,ne,nw';
        }
        this.handlers = handlerDirection.split(',')
            .map(function (dir) { return dir.trim(); })
            .map(function (dir) { return new dd_resizable_handle_1.DDResizableHandle(_this.el, dir, {
            start: function (event) {
                _this._resizeStart(event);
            },
            stop: function (event) {
                _this._resizeStop(event);
            },
            move: function (event) {
                _this._resizing(event, dir);
            }
        }); });
        return this;
    };
    /** @internal */
    DDResizable.prototype._resizeStart = function (event) {
        this.originalRect = this.el.getBoundingClientRect();
        this.scrollEl = utils_1.Utils.getScrollElement(this.el);
        this.scrollY = this.scrollEl.scrollTop;
        this.scrolled = 0;
        this.startEvent = event;
        this._setupHelper();
        this._applyChange();
        var ev = utils_1.Utils.initEvent(event, { type: 'resizestart', target: this.el });
        if (this.option.start) {
            this.option.start(ev, this._ui());
        }
        this.el.classList.add('ui-resizable-resizing');
        this.triggerEvent('resizestart', ev);
        return this;
    };
    /** @internal */
    DDResizable.prototype._resizing = function (event, dir) {
        this.scrolled = this.scrollEl.scrollTop - this.scrollY;
        this.temporalRect = this._getChange(event, dir);
        this._applyChange();
        var ev = utils_1.Utils.initEvent(event, { type: 'resize', target: this.el });
        if (this.option.resize) {
            this.option.resize(ev, this._ui());
        }
        this.triggerEvent('resize', ev);
        return this;
    };
    /** @internal */
    DDResizable.prototype._resizeStop = function (event) {
        var ev = utils_1.Utils.initEvent(event, { type: 'resizestop', target: this.el });
        if (this.option.stop) {
            this.option.stop(ev); // Note: ui() not used by gridstack so don't pass
        }
        this.el.classList.remove('ui-resizable-resizing');
        this.triggerEvent('resizestop', ev);
        this._cleanHelper();
        delete this.startEvent;
        delete this.originalRect;
        delete this.temporalRect;
        delete this.scrollY;
        delete this.scrolled;
        return this;
    };
    /** @internal */
    DDResizable.prototype._setupHelper = function () {
        var _this = this;
        this.elOriginStyleVal = DDResizable._originStyleProp.map(function (prop) { return _this.el.style[prop]; });
        this.parentOriginStylePosition = this.el.parentElement.style.position;
        if (window.getComputedStyle(this.el.parentElement).position.match(/static/)) {
            this.el.parentElement.style.position = 'relative';
        }
        this.el.style.position = 'absolute';
        this.el.style.opacity = '0.8';
        return this;
    };
    /** @internal */
    DDResizable.prototype._cleanHelper = function () {
        var _this = this;
        DDResizable._originStyleProp.forEach(function (prop, i) {
            _this.el.style[prop] = _this.elOriginStyleVal[i] || null;
        });
        this.el.parentElement.style.position = this.parentOriginStylePosition || null;
        return this;
    };
    /** @internal */
    DDResizable.prototype._getChange = function (event, dir) {
        var oEvent = this.startEvent;
        var newRect = {
            width: this.originalRect.width,
            height: this.originalRect.height + this.scrolled,
            left: this.originalRect.left,
            top: this.originalRect.top - this.scrolled
        };
        var offsetX = event.clientX - oEvent.clientX;
        var offsetY = event.clientY - oEvent.clientY;
        if (dir.indexOf('e') > -1) {
            newRect.width += offsetX;
        }
        else if (dir.indexOf('w') > -1) {
            newRect.width -= offsetX;
            newRect.left += offsetX;
        }
        if (dir.indexOf('s') > -1) {
            newRect.height += offsetY;
        }
        else if (dir.indexOf('n') > -1) {
            newRect.height -= offsetY;
            newRect.top += offsetY;
        }
        var constrain = this._constrainSize(newRect.width, newRect.height);
        if (Math.round(newRect.width) !== Math.round(constrain.width)) { // round to ignore slight round-off errors
            if (dir.indexOf('w') > -1) {
                newRect.left += newRect.width - constrain.width;
            }
            newRect.width = constrain.width;
        }
        if (Math.round(newRect.height) !== Math.round(constrain.height)) {
            if (dir.indexOf('n') > -1) {
                newRect.top += newRect.height - constrain.height;
            }
            newRect.height = constrain.height;
        }
        return newRect;
    };
    /** @internal constrain the size to the set min/max values */
    DDResizable.prototype._constrainSize = function (oWidth, oHeight) {
        var maxWidth = this.option.maxWidth || Number.MAX_SAFE_INTEGER;
        var minWidth = this.option.minWidth || oWidth;
        var maxHeight = this.option.maxHeight || Number.MAX_SAFE_INTEGER;
        var minHeight = this.option.minHeight || oHeight;
        var width = Math.min(maxWidth, Math.max(minWidth, oWidth));
        var height = Math.min(maxHeight, Math.max(minHeight, oHeight));
        return { width: width, height: height };
    };
    /** @internal */
    DDResizable.prototype._applyChange = function () {
        var _a;
        var _this = this;
        var containmentRect = { left: 0, top: 0, width: 0, height: 0 };
        if (this.el.style.position === 'absolute') {
            var containmentEl = this.el.parentElement;
            var left = (_a = containmentEl.getBoundingClientRect(), _a.left), top_1 = _a.top;
            containmentRect = { left: left, top: top_1, width: 0, height: 0 };
        }
        if (!this.temporalRect)
            return this;
        Object.keys(this.temporalRect).forEach(function (key) {
            var value = _this.temporalRect[key];
            _this.el.style[key] = value - containmentRect[key] + 'px';
        });
        return this;
    };
    /** @internal */
    DDResizable.prototype._removeHandlers = function () {
        this.handlers.forEach(function (handle) { return handle.destroy(); });
        delete this.handlers;
        return this;
    };
    /** @internal */
    DDResizable._originStyleProp = ['width', 'height', 'position', 'left', 'top', 'opacity', 'zIndex'];
    return DDResizable;
}(dd_base_impl_1.DDBaseImplement));
//# sourceMappingURL=dd-resizable.js.map