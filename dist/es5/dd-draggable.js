"use strict";
/**
 * dd-draggable.ts 8.3.0-dev
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
exports.DDDraggable = void 0;
var dd_manager_1 = require("./dd-manager");
var utils_1 = require("./utils");
var dd_base_impl_1 = require("./dd-base-impl");
var dd_touch_1 = require("./dd-touch");
// make sure we are not clicking on known object that handles mouseDown
var skipMouseDown = 'input,textarea,button,select,option,[contenteditable="true"],.ui-resizable-handle';
// let count = 0; // TEST
var DDDraggable = exports.DDDraggable = /** @class */ (function (_super) {
    __extends(DDDraggable, _super);
    function DDDraggable(el, option) {
        if (option === void 0) { option = {}; }
        var _this = _super.call(this) || this;
        _this.el = el;
        _this.option = option;
        // get the element that is actually supposed to be dragged by
        var handleName = option.handle.substring(1);
        _this.dragEl = el.classList.contains(handleName) ? el : el.querySelector(option.handle) || el;
        // create var event binding so we can easily remove and still look like TS methods (unlike anonymous functions)
        _this._mouseDown = _this._mouseDown.bind(_this);
        _this._mouseMove = _this._mouseMove.bind(_this);
        _this._mouseUp = _this._mouseUp.bind(_this);
        _this.enable();
        return _this;
    }
    DDDraggable.prototype.on = function (event, callback) {
        _super.prototype.on.call(this, event, callback);
    };
    DDDraggable.prototype.off = function (event) {
        _super.prototype.off.call(this, event);
    };
    DDDraggable.prototype.enable = function () {
        if (this.disabled === false)
            return;
        _super.prototype.enable.call(this);
        this.dragEl.addEventListener('mousedown', this._mouseDown);
        if (dd_touch_1.isTouch) {
            this.dragEl.addEventListener('touchstart', dd_touch_1.touchstart);
            this.dragEl.addEventListener('pointerdown', dd_touch_1.pointerdown);
            // this.dragEl.style.touchAction = 'none'; // not needed unlike pointerdown doc comment
        }
        this.el.classList.remove('ui-draggable-disabled');
    };
    DDDraggable.prototype.disable = function (forDestroy) {
        if (forDestroy === void 0) { forDestroy = false; }
        if (this.disabled === true)
            return;
        _super.prototype.disable.call(this);
        this.dragEl.removeEventListener('mousedown', this._mouseDown);
        if (dd_touch_1.isTouch) {
            this.dragEl.removeEventListener('touchstart', dd_touch_1.touchstart);
            this.dragEl.removeEventListener('pointerdown', dd_touch_1.pointerdown);
        }
        if (!forDestroy)
            this.el.classList.add('ui-draggable-disabled');
    };
    DDDraggable.prototype.destroy = function () {
        if (this.dragTimeout)
            window.clearTimeout(this.dragTimeout);
        delete this.dragTimeout;
        if (this.dragging)
            this._mouseUp(this.mouseDownEvent);
        this.disable(true);
        delete this.el;
        delete this.helper;
        delete this.option;
        _super.prototype.destroy.call(this);
    };
    DDDraggable.prototype.updateOption = function (opts) {
        var _this = this;
        Object.keys(opts).forEach(function (key) { return _this.option[key] = opts[key]; });
        return this;
    };
    /** @internal call when mouse goes down before a dragstart happens */
    DDDraggable.prototype._mouseDown = function (e) {
        // don't let more than one widget handle mouseStart
        if (dd_manager_1.DDManager.mouseHandled)
            return;
        if (e.button !== 0)
            return true; // only left click
        // make sure we are not clicking on known object that handles mouseDown, or ones supplied by the user
        if (e.target.closest(skipMouseDown))
            return true;
        if (this.option.cancel) {
            if (e.target.closest(this.option.cancel))
                return true;
        }
        // REMOVE: why would we get the event if it wasn't for us or child ?
        // make sure we are clicking on a drag handle or child of it...
        // Note: we don't need to check that's handle is an immediate child, as mouseHandled will prevent parents from also handling it (lowest wins)
        // let className = this.option.handle.substring(1);
        // let el = e.target as HTMLElement;
        // while (el && !el.classList.contains(className)) { el = el.parentElement; }
        // if (!el) return;
        this.mouseDownEvent = e;
        delete this.dragging;
        delete dd_manager_1.DDManager.dragElement;
        delete dd_manager_1.DDManager.dropElement;
        // document handler so we can continue receiving moves as the item is 'fixed' position, and capture=true so WE get a first crack
        document.addEventListener('mousemove', this._mouseMove, true); // true=capture, not bubble
        document.addEventListener('mouseup', this._mouseUp, true);
        if (dd_touch_1.isTouch) {
            this.dragEl.addEventListener('touchmove', dd_touch_1.touchmove);
            this.dragEl.addEventListener('touchend', dd_touch_1.touchend);
        }
        e.preventDefault();
        // preventDefault() prevents blur event which occurs just after mousedown event.
        // if an editable content has focus, then blur must be call
        if (document.activeElement)
            document.activeElement.blur();
        dd_manager_1.DDManager.mouseHandled = true;
        return true;
    };
    /** @internal method to call actual drag event */
    DDDraggable.prototype._callDrag = function (e) {
        if (!this.dragging)
            return;
        var ev = utils_1.Utils.initEvent(e, { target: this.el, type: 'drag' });
        if (this.option.drag) {
            this.option.drag(ev, this.ui());
        }
        this.triggerEvent('drag', ev);
    };
    /** @internal called when the main page (after successful mousedown) receives a move event to drag the item around the screen */
    DDDraggable.prototype._mouseMove = function (e) {
        var _this = this;
        var _a;
        // console.log(`${count++} move ${e.x},${e.y}`)
        var s = this.mouseDownEvent;
        if (this.dragging) {
            this._dragFollow(e);
            // delay actual grid handling drag until we pause for a while if set
            if (dd_manager_1.DDManager.pauseDrag) {
                var pause = Number.isInteger(dd_manager_1.DDManager.pauseDrag) ? dd_manager_1.DDManager.pauseDrag : 100;
                if (this.dragTimeout)
                    window.clearTimeout(this.dragTimeout);
                this.dragTimeout = window.setTimeout(function () { return _this._callDrag(e); }, pause);
            }
            else {
                this._callDrag(e);
            }
        }
        else if (Math.abs(e.x - s.x) + Math.abs(e.y - s.y) > 3) {
            /**
             * don't start unless we've moved at least 3 pixels
             */
            this.dragging = true;
            dd_manager_1.DDManager.dragElement = this;
            // if we're dragging an actual grid item, set the current drop as the grid (to detect enter/leave)
            var grid = (_a = this.el.gridstackNode) === null || _a === void 0 ? void 0 : _a.grid;
            if (grid) {
                dd_manager_1.DDManager.dropElement = grid.el.ddElement.ddDroppable;
            }
            else {
                delete dd_manager_1.DDManager.dropElement;
            }
            this.helper = this._createHelper(e);
            this._setupHelperContainmentStyle();
            this.dragOffset = this._getDragOffset(e, this.el, this.helperContainment);
            var ev = utils_1.Utils.initEvent(e, { target: this.el, type: 'dragstart' });
            this._setupHelperStyle(e);
            if (this.option.start) {
                this.option.start(ev, this.ui());
            }
            this.triggerEvent('dragstart', ev);
        }
        e.preventDefault(); // needed otherwise we get text sweep text selection as we drag around
        return true;
    };
    /** @internal call when the mouse gets released to drop the item at current location */
    DDDraggable.prototype._mouseUp = function (e) {
        var _a;
        document.removeEventListener('mousemove', this._mouseMove, true);
        document.removeEventListener('mouseup', this._mouseUp, true);
        if (dd_touch_1.isTouch) {
            this.dragEl.removeEventListener('touchmove', dd_touch_1.touchmove, true);
            this.dragEl.removeEventListener('touchend', dd_touch_1.touchend, true);
        }
        if (this.dragging) {
            delete this.dragging;
            // reset the drop target if dragging over ourself (already parented, just moving during stop callback below)
            if (((_a = dd_manager_1.DDManager.dropElement) === null || _a === void 0 ? void 0 : _a.el) === this.el.parentElement) {
                delete dd_manager_1.DDManager.dropElement;
            }
            this.helperContainment.style.position = this.parentOriginStylePosition || null;
            if (this.helper === this.el) {
                this._removeHelperStyle();
            }
            else {
                this.helper.remove();
            }
            var ev = utils_1.Utils.initEvent(e, { target: this.el, type: 'dragstop' });
            if (this.option.stop) {
                this.option.stop(ev); // NOTE: destroy() will be called when removing item, so expect NULL ptr after!
            }
            this.triggerEvent('dragstop', ev);
            // call the droppable method to receive the item
            if (dd_manager_1.DDManager.dropElement) {
                dd_manager_1.DDManager.dropElement.drop(e);
            }
        }
        delete this.helper;
        delete this.mouseDownEvent;
        delete dd_manager_1.DDManager.dragElement;
        delete dd_manager_1.DDManager.dropElement;
        delete dd_manager_1.DDManager.mouseHandled;
        e.preventDefault();
    };
    /** @internal create a clone copy (or user defined method) of the original drag item if set */
    DDDraggable.prototype._createHelper = function (event) {
        var _this = this;
        var helper = this.el;
        if (typeof this.option.helper === 'function') {
            helper = this.option.helper(event);
        }
        else if (this.option.helper === 'clone') {
            helper = utils_1.Utils.cloneNode(this.el);
        }
        if (!document.body.contains(helper)) {
            utils_1.Utils.appendTo(helper, this.option.appendTo === 'parent' ? this.el.parentElement : this.option.appendTo);
        }
        if (helper === this.el) {
            this.dragElementOriginStyle = DDDraggable.originStyleProp.map(function (prop) { return _this.el.style[prop]; });
        }
        return helper;
    };
    /** @internal set the fix position of the dragged item */
    DDDraggable.prototype._setupHelperStyle = function (e) {
        var _this = this;
        this.helper.classList.add('ui-draggable-dragging');
        // TODO: set all at once with style.cssText += ... ? https://stackoverflow.com/questions/3968593
        var style = this.helper.style;
        style.pointerEvents = 'none'; // needed for over items to get enter/leave
        // style.cursor = 'move'; //  TODO: can't set with pointerEvents=none ! (done in CSS as well)
        style.width = this.dragOffset.width + 'px';
        style.height = this.dragOffset.height + 'px';
        style.willChange = 'left, top';
        style.position = 'fixed'; // let us drag between grids by not clipping as parent .grid-stack is position: 'relative'
        this._dragFollow(e); // now position it
        style.transition = 'none'; // show up instantly
        setTimeout(function () {
            if (_this.helper) {
                style.transition = null; // recover animation
            }
        }, 0);
        return this;
    };
    /** @internal restore back the original style before dragging */
    DDDraggable.prototype._removeHelperStyle = function () {
        var _this = this;
        var _a;
        this.helper.classList.remove('ui-draggable-dragging');
        var node = (_a = this.helper) === null || _a === void 0 ? void 0 : _a.gridstackNode;
        // don't bother restoring styles if we're gonna remove anyway...
        if (!(node === null || node === void 0 ? void 0 : node._isAboutToRemove) && this.dragElementOriginStyle) {
            var helper_1 = this.helper;
            // don't animate, otherwise we animate offseted when switching back to 'absolute' from 'fixed'.
            // TODO: this also removes resizing animation which doesn't have this issue, but others.
            // Ideally both would animate ('move' would immediately restore 'absolute' and adjust coordinate to match,
            // then trigger a delay (repaint) to restore to final dest with animate) but then we need to make sure 'resizestop'
            // is called AFTER 'transitionend' event is received (see https://github.com/gridstack/gridstack.js/issues/2033)
            var transition_1 = this.dragElementOriginStyle['transition'] || null;
            helper_1.style.transition = this.dragElementOriginStyle['transition'] = 'none'; // can't be NULL #1973
            DDDraggable.originStyleProp.forEach(function (prop) { return helper_1.style[prop] = _this.dragElementOriginStyle[prop] || null; });
            setTimeout(function () { return helper_1.style.transition = transition_1; }, 50); // recover animation from saved vars after a pause (0 isn't enough #1973)
        }
        delete this.dragElementOriginStyle;
        return this;
    };
    /** @internal updates the top/left position to follow the mouse */
    DDDraggable.prototype._dragFollow = function (e) {
        var containmentRect = { left: 0, top: 0 };
        // if (this.helper.style.position === 'absolute') { // we use 'fixed'
        //   const { left, top } = this.helperContainment.getBoundingClientRect();
        //   containmentRect = { left, top };
        // }
        var style = this.helper.style;
        var offset = this.dragOffset;
        style.left = e.clientX + offset.offsetLeft - containmentRect.left + 'px';
        style.top = e.clientY + offset.offsetTop - containmentRect.top + 'px';
    };
    /** @internal */
    DDDraggable.prototype._setupHelperContainmentStyle = function () {
        this.helperContainment = this.helper.parentElement;
        if (this.helper.style.position !== 'fixed') {
            this.parentOriginStylePosition = this.helperContainment.style.position;
            if (window.getComputedStyle(this.helperContainment).position.match(/static/)) {
                this.helperContainment.style.position = 'relative';
            }
        }
        return this;
    };
    /** @internal */
    DDDraggable.prototype._getDragOffset = function (event, el, parent) {
        // in case ancestor has transform/perspective css properties that change the viewpoint
        var xformOffsetX = 0;
        var xformOffsetY = 0;
        if (parent) {
            var testEl = document.createElement('div');
            utils_1.Utils.addElStyles(testEl, {
                opacity: '0',
                position: 'fixed',
                top: 0 + 'px',
                left: 0 + 'px',
                width: '1px',
                height: '1px',
                zIndex: '-999999',
            });
            parent.appendChild(testEl);
            var testElPosition = testEl.getBoundingClientRect();
            parent.removeChild(testEl);
            xformOffsetX = testElPosition.left;
            xformOffsetY = testElPosition.top;
            // TODO: scale ?
        }
        var targetOffset = el.getBoundingClientRect();
        return {
            left: targetOffset.left,
            top: targetOffset.top,
            offsetLeft: -event.clientX + targetOffset.left - xformOffsetX,
            offsetTop: -event.clientY + targetOffset.top - xformOffsetY,
            width: targetOffset.width,
            height: targetOffset.height
        };
    };
    /** @internal TODO: set to public as called by DDDroppable! */
    DDDraggable.prototype.ui = function () {
        var containmentEl = this.el.parentElement;
        var containmentRect = containmentEl.getBoundingClientRect();
        var offset = this.helper.getBoundingClientRect();
        return {
            position: {
                top: offset.top - containmentRect.top,
                left: offset.left - containmentRect.left
            }
            /* not used by GridStack for now...
            helper: [this.helper], //The object arr representing the helper that's being dragged.
            offset: { top: offset.top, left: offset.left } // Current offset position of the helper as { top, left } object.
            */
        };
    };
    /** @internal properties we change during dragging, and restore back */
    DDDraggable.originStyleProp = ['transition', 'pointerEvents', 'position', 'left', 'top', 'minWidth', 'willChange'];
    return DDDraggable;
}(dd_base_impl_1.DDBaseImplement));
//# sourceMappingURL=dd-draggable.js.map