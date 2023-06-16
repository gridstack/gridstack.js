"use strict";
/**
 * dd-elements.ts 8.3.0-dev
 * Copyright (c) 2021 Alain Dumesny - see GridStack root license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDElement = void 0;
var dd_resizable_1 = require("./dd-resizable");
var dd_draggable_1 = require("./dd-draggable");
var dd_droppable_1 = require("./dd-droppable");
var DDElement = /** @class */ (function () {
    function DDElement(el) {
        this.el = el;
    }
    DDElement.init = function (el) {
        if (!el.ddElement) {
            el.ddElement = new DDElement(el);
        }
        return el.ddElement;
    };
    DDElement.prototype.on = function (eventName, callback) {
        if (this.ddDraggable && ['drag', 'dragstart', 'dragstop'].indexOf(eventName) > -1) {
            this.ddDraggable.on(eventName, callback);
        }
        else if (this.ddDroppable && ['drop', 'dropover', 'dropout'].indexOf(eventName) > -1) {
            this.ddDroppable.on(eventName, callback);
        }
        else if (this.ddResizable && ['resizestart', 'resize', 'resizestop'].indexOf(eventName) > -1) {
            this.ddResizable.on(eventName, callback);
        }
        return this;
    };
    DDElement.prototype.off = function (eventName) {
        if (this.ddDraggable && ['drag', 'dragstart', 'dragstop'].indexOf(eventName) > -1) {
            this.ddDraggable.off(eventName);
        }
        else if (this.ddDroppable && ['drop', 'dropover', 'dropout'].indexOf(eventName) > -1) {
            this.ddDroppable.off(eventName);
        }
        else if (this.ddResizable && ['resizestart', 'resize', 'resizestop'].indexOf(eventName) > -1) {
            this.ddResizable.off(eventName);
        }
        return this;
    };
    DDElement.prototype.setupDraggable = function (opts) {
        if (!this.ddDraggable) {
            this.ddDraggable = new dd_draggable_1.DDDraggable(this.el, opts);
        }
        else {
            this.ddDraggable.updateOption(opts);
        }
        return this;
    };
    DDElement.prototype.cleanDraggable = function () {
        if (this.ddDraggable) {
            this.ddDraggable.destroy();
            delete this.ddDraggable;
        }
        return this;
    };
    DDElement.prototype.setupResizable = function (opts) {
        if (!this.ddResizable) {
            this.ddResizable = new dd_resizable_1.DDResizable(this.el, opts);
        }
        else {
            this.ddResizable.updateOption(opts);
        }
        return this;
    };
    DDElement.prototype.cleanResizable = function () {
        if (this.ddResizable) {
            this.ddResizable.destroy();
            delete this.ddResizable;
        }
        return this;
    };
    DDElement.prototype.setupDroppable = function (opts) {
        if (!this.ddDroppable) {
            this.ddDroppable = new dd_droppable_1.DDDroppable(this.el, opts);
        }
        else {
            this.ddDroppable.updateOption(opts);
        }
        return this;
    };
    DDElement.prototype.cleanDroppable = function () {
        if (this.ddDroppable) {
            this.ddDroppable.destroy();
            delete this.ddDroppable;
        }
        return this;
    };
    return DDElement;
}());
exports.DDElement = DDElement;
//# sourceMappingURL=dd-element.js.map