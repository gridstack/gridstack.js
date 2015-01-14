(function (scope, _) {

    var Utils = {
        is_intercepted: function (a, b) {
            return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
        },

        sort: function (nodes, dir, width) {
            width = width || _.chain(nodes).map(function (node) { return node.x + node.width; }).max().value();
            dir = dir != -1 ? 1 : -1;
            return _.sortBy(nodes, function (n) { return dir * (n.x + n.y * width); });
        },

        create_stylesheet: function () {
            var style = document.createElement("style");

            // style.setAttribute("media", "screen")
            // style.setAttribute("media", "only screen and (max-width : 1024px)")

            // WebKit hack :(
            //ie8 support
			if(style.styleSheet) { 
				style.styleSheet.cssText = cssText;
			} else { 
				style.appendChild(document.createTextNode(cssText));
			}

            document.getElementsByTagName("head")[0].appendChild(style);
            
			if(style.styleSheet) {
            	return style.styleSheet;
			}
            else {
            	return style.sheet;
            }
        },

        toBool: function (v) {
            if (typeof v == 'boolean')
                return v;
            if (typeof v == 'string') {
                v = v.toLowerCase();
                return !(v == '' || v == 'no' || v == 'false' || v == '0');
            }
            return Boolean(v);
        }
    };

    var id_seq = 0;

    var GridStackEngine = function (width, onchange, float, height, items) {
        this.width = width;
        this.float = float || false;
        this.height = height || 0;

        this.nodes = items || [];
        this.onchange = onchange || function () {};
    };

    GridStackEngine.prototype._fix_collisions = function (node) {
        this._sort_nodes(-1);

        var nn = node, has_locked = Boolean(_.find(this.nodes, function (n) { return n.locked }));
        if (!this.float && !has_locked) {
            nn = {x: 0, y: node.y, width: this.width, height: node.height};
        }

        while (true) {
            var collision_node = _.find(this.nodes, function (n) {
                return n != node && Utils.is_intercepted(n, nn);
            }, this);
            if (typeof collision_node == 'undefined') {
                return;
            }
            this.move_node(collision_node, collision_node.x, node.y + node.height,
                collision_node.width, collision_node.height, true);
        }
    };

    GridStackEngine.prototype._sort_nodes = function (dir) {
        this.nodes = Utils.sort(this.nodes, dir, this.width);
    };

    GridStackEngine.prototype._pack_nodes = function () {
        this._sort_nodes();

        if (this.float) {
            _.each(this.nodes, function (n, i) {
                if (n._updating || typeof n._orig_y == 'undefined' || n.y == n._orig_y)
                    return;

                var new_y = n.y;
                while (new_y >= n._orig_y) {
                    var collision_node = _.chain(this.nodes)
                        .find(function (bn) {
                            return n != bn && Utils.is_intercepted({x: n.x, y: new_y, width: n.width, height: n.height}, bn);
                        })
                        .value();

                    if (!collision_node) {
                        n._dirty = true;
                        n.y = new_y;
                    }
                    --new_y;
                }
            }, this);
        }
        else {
            _.each(this.nodes, function (n, i) {
                if (n.locked)
                    return;
                while (n.y > 0) {
                    var new_y = n.y - 1;
                    var can_be_moved = i == 0;

                    if (i > 0) {
                        var collision_node = _.chain(this.nodes)
                            .first(i)
                            .find(function (bn) {
                                return Utils.is_intercepted({x: n.x, y: new_y, width: n.width, height: n.height}, bn);
                            })
                            .value();
                        can_be_moved = typeof collision_node == 'undefined';
                    }

                    if (!can_be_moved) {
                        break;
                    }
                    n._dirty = n.y != new_y;
                    n.y = new_y;
                }
            }, this);
        }
    };

    GridStackEngine.prototype._prepare_node = function (node, resizing) {
        node = _.defaults(node || {}, {width: 1, height: 1, x: 0, y: 0 });

        node.x = parseInt('' + node.x);
        node.y = parseInt('' + node.y);
        node.width = parseInt('' + node.width);
        node.height = parseInt('' + node.height);
        node.auto_position = node.auto_position || false;
        node.no_resize = node.no_resize || false;
        node.no_move = node.no_move || false;

        if (node.width > this.width) {
            node.width = this.width;
        }
        else if (node.width < 1) {
            node.width = 1;
        }

        if (node.height < 1) {
            node.height = 1;
        }

        if (node.x < 0) {
            node.x = 0;
        }

        if (node.x + node.width > this.width) {
            if (resizing) {
                node.width = this.width - node.x;
            }
            else {
                node.x = this.width - node.width;
            }
        }

        if (node.y < 0) {
            node.y = 0;
        }

        return node;
    };

    GridStackEngine.prototype._notify = function () {
        var deleted_nodes = Array.prototype.slice.call(arguments, 1).concat(this.get_dirty_nodes());
        deleted_nodes = deleted_nodes.concat(this.get_dirty_nodes());
        this.onchange(deleted_nodes);
    };

    GridStackEngine.prototype.clean_nodes = function () {
        _.each(this.nodes, function (n) {n._dirty = false });
    };

    GridStackEngine.prototype.get_dirty_nodes = function () {
        return _.filter(this.nodes, function (n) { return n._dirty; });
    };

    GridStackEngine.prototype.add_node = function(node) {
        node = this._prepare_node(node);

        if (typeof node.max_width != 'undefined') node.width = Math.min(node.width, node.max_width);
        if (typeof node.max_height != 'undefined') node.height = Math.min(node.height, node.max_height);
        if (typeof node.min_width != 'undefined') node.width = Math.max(node.width, node.min_width);
        if (typeof node.min_height != 'undefined') node.height = Math.max(node.height, node.min_height);

        node._id = ++id_seq;
        node._dirty = true;

        if (node.auto_position) {
            this._sort_nodes();

            for (var i = 0; ; ++i) {
                var x = i % this.width, y = Math.floor(i / this.width);
                if (x + node.width > this.width) {
                    continue;
                }
                if (!_.find(this.nodes, function (n) {
                    return Utils.is_intercepted({x: x, y: y, width: node.width, height: node.height}, n);
                })) {
                    node.x = x;
                    node.y = y;
                    break;
                }
            }
        }

        this.nodes.push(node);

        this._fix_collisions(node);
        this._pack_nodes();
        this._notify();
        return node;
    };

    GridStackEngine.prototype.remove_node = function (node) {
        node._id = null;
        this.nodes = _.without(this.nodes, node);
        this._pack_nodes();
        this._notify(node);
    };

    GridStackEngine.prototype.can_move_node = function (node, x, y, width, height) {
        var has_locked = Boolean(_.find(this.nodes, function (n) { return n.locked }));

        if (!this.height && !has_locked)
            return true;

        var cloned_node;
        var clone = new GridStackEngine(
            this.width,
            null,
            this.float,
            0,
            _.map(this.nodes, function (n) { if (n == node) { cloned_node = $.extend({}, n); return cloned_node; } return $.extend({}, n) }));

        clone.move_node(cloned_node, x, y, width, height);

        var res = true;

        if (has_locked)
            res &= !Boolean(_.find(clone.nodes, function (n) { return n != cloned_node && Boolean(n.locked) && Boolean(n._dirty); }));
        if (this.height)
            res &= clone.get_grid_height() <= this.height;

        return res;
    };

    GridStackEngine.prototype.can_be_placed_with_respect_to_height = function (node) {
        if (!this.height)
            return true;

        var clone = new GridStackEngine(
            this.width,
            null,
            this.float,
            0,
            _.map(this.nodes, function (n) { return $.extend({}, n) }));
        clone.add_node(node);
        return clone.get_grid_height() <= this.height;
    };

    GridStackEngine.prototype.move_node = function (node, x, y, width, height, no_pack) {
        if (typeof x != 'number') x = node.x;
        if (typeof y != 'number') y = node.y;
        if (typeof width != 'number') width = node.width;
        if (typeof height != 'number') height = node.height;

        if (typeof node.max_width != 'undefined') width = Math.min(width, node.max_width);
        if (typeof node.max_height != 'undefined') height = Math.min(height, node.max_height);
        if (typeof node.min_width != 'undefined') width = Math.max(width, node.min_width);
        if (typeof node.min_height != 'undefined') height = Math.max(height, node.min_height);

        if (node.x == x && node.y == y && node.width == width && node.height == height) {
            return node;
        }

        var resizing = node.width != width;
        node._dirty = true;

        node.x = x;
        node.y = y;
        node.width = width;
        node.height = height;

        node = this._prepare_node(node, resizing);

        this._fix_collisions(node);
        if (!no_pack) {
            this._pack_nodes();
            this._notify();
        }
        return node;
    };

    GridStackEngine.prototype.get_grid_height = function () {
        return _.reduce(this.nodes, function (memo, n) { return Math.max(memo, n.y + n.height); }, 0);
    };

    GridStackEngine.prototype.begin_update = function (node) {
        _.each(this.nodes, function (n) {
            n._orig_y = n.y;
        });
        node._updating = true;
    };

    GridStackEngine.prototype.end_update = function () {
        var n = _.find(this.nodes, function (n) { return n._updating; });
        if (n) {
            n._updating = false;
        }
    };

    var GridStack = function (el, opts) {
        var self = this, one_column_mode;

        this.container = $(el);

        this.opts = _.defaults(opts || {}, {
            width: parseInt(this.container.attr('data-gs-width')) || 12,
            height: parseInt(this.container.attr('data-gs-height')) || 0,
            item_class: 'grid-stack-item',
            placeholder_class: 'grid-stack-placeholder',
            handle: '.grid-stack-item-content',
            cell_height: 60,
            vertical_margin: 20,
            auto: true,
            min_width: 768,
            float: false,
            _class: 'grid-stack-' + (Math.random() * 10000).toFixed(0),
            animate: Boolean(this.container.attr('data-gs-animate')) || false,
            always_show_resize_handle: opts.always_show_resize_handle || false
        });

        this.container.addClass(this.opts._class);
        this._styles = Utils.create_stylesheet();
        this._styles._max = 0;

        this.grid = new GridStackEngine(this.opts.width, function (nodes) {
            var max_height = 0;
            _.each(nodes, function (n) {
                if (n._id == null) {
                    n.el.remove();
                }
                else {
                    n.el
                        .attr('data-gs-x', n.x)
                        .attr('data-gs-y', n.y)
                        .attr('data-gs-width', n.width)
                        .attr('data-gs-height', n.height);
                    max_height = Math.max(max_height, n.y + n.height);
                }
            });
            self._update_styles(max_height + 10);
        }, this.opts.float, this.opts.height);

        if (this.opts.auto) {
            var elements = [];
            this.container.find('.' + this.opts.item_class).each(function (index, el) {
                el = $(el);
                elements.push({
                    el: el,
                    i: parseInt(el.attr('data-gs-x')) + parseInt(el.attr('data-gs-y')) * parseInt(el.attr('data-gs-width'))
                });
            });
            _.chain(elements).sortBy(function (x) { return x.i; }).each(function (i) {
                self._prepare_element(i.el);
            });
        }

        this.set_animation(this.opts.animate);

        this.placeholder = $('<div class="' + this.opts.placeholder_class + ' ' + this.opts.item_class + '"><div class="placeholder-content" /></div>').hide();
        this.container.append(this.placeholder);
        this.container.height((this.grid.get_grid_height()) * (this.opts.cell_height + this.opts.vertical_margin) - this.opts.vertical_margin);

        var on_resize_handler = function () {
            if (self._is_one_column_mode()) {
                if (one_column_mode)
                    return;

                one_column_mode = true;

                _.each(self.grid.nodes, function (node) {
                    if (!node.no_move) {
                        node.el.draggable('disable');
                    }
                    if (!node.no_resize) {
                        node.el.resizable('disable');
                    }
                });
            }
            else {
                if (!one_column_mode)
                    return;

                one_column_mode = false;

                _.each(self.grid.nodes, function (node) {
                    if (!node.no_move) {
                        node.el.draggable('enable');
                    }
                    if (!node.no_resize) {
                        node.el.resizable('enable');
                    }
                });
            }
        };

        $(window).resize(on_resize_handler);
        on_resize_handler();
    };

    GridStack.prototype._update_styles = function (max_height) {
        if (typeof max_height == 'undefined') {
            max_height = this._styles._max;
            this._styles._max = 0;
            while (this._styles.rules.length) {
                this._styles.removeRule(0);
            }
            this._update_container_height();
        }

        if (max_height > this._styles._max) {
            for (var i = this._styles._max; i < max_height; ++i) {
                //ie8 support
                var selector = '.' + this.opts._class + ' .' + this.opts.item_class + '[data-gs-height="' + (i + 1) + '"]';
                var style = 'height: ' + (this.opts.cell_height * (i + 1) + this.opts.vertical_margin * i) + 'px;';
                
                if(this._styles.insertRule) {
				    this._styles.insertRule(selector + '{' + style + '}', i);
				} else {
				    this._styles.addRule(selector,style, i);
				}
				
                selector = '.' + this.opts._class + ' .' + this.opts.item_class + '[data-gs-y="' + (i) + '"]';
                style = 'top: ' + (this.opts.cell_height * i + this.opts.vertical_margin * i) + 'px; ';
                
                if(this._styles.insertRule) {
				    this._styles.insertRule(selector + '{' + style + '}', i);
				} else {
				    this._styles.addRule(selector,style, i);
				}
            }
            this._styles._max = max_height;
        }
    };

    GridStack.prototype._update_container_height = function () {
        this.container.height(this.grid.get_grid_height() * (this.opts.cell_height + this.opts.vertical_margin) - this.opts.vertical_margin);
    };

    GridStack.prototype._is_one_column_mode = function () {
        return $(window).width() <= this.opts.min_width;
    };

    GridStack.prototype._prepare_element = function (el) {
        var self = this;
        el = $(el);

        el.addClass(this.opts.item_class);

        var node = self.grid.add_node({
            x: el.attr('data-gs-x'),
            y: el.attr('data-gs-y'),
            width: el.attr('data-gs-width'),
            height: el.attr('data-gs-height'),
            max_width: el.attr('data-gs-max-width'),
            min_width: el.attr('data-gs-min-width'),
            max_height: el.attr('data-gs-max-height') || 100,
            min_height: el.attr('data-gs-min-height'),
            auto_position: Utils.toBool(el.attr('data-gs-auto-position')),
            no_resize: Utils.toBool(el.attr('data-gs-no-resize')),
            no_move: Utils.toBool(el.attr('data-gs-no-move')),
            locked: Utils.toBool(el.attr('data-gs-locked')),
            el: el
        });
        el.data('_gridstack_node', node);

        var cell_width, cell_height;

        var on_start_moving = function (event, ui) {
            var o = $(this);
            self.grid.clean_nodes();
            self.grid.begin_update(node);
            cell_width = Math.ceil(o.outerWidth() / o.attr('data-gs-width'));
            cell_height = self.opts.cell_height + self.opts.vertical_margin;
            self.placeholder
                .attr('data-gs-x', o.attr('data-gs-x'))
                .attr('data-gs-y', o.attr('data-gs-y'))
                .attr('data-gs-width', o.attr('data-gs-width'))
                .attr('data-gs-height', o.attr('data-gs-height'))
                .show();
            node.el = self.placeholder;
        };

        var on_end_moving = function (event, ui) {
            var o = $(this);
            node.el = o;
            self.placeholder.hide();
            o
                .attr('data-gs-x', node.x)
                .attr('data-gs-y', node.y)
                .attr('data-gs-width', node.width)
                .attr('data-gs-height', node.height)
                .removeAttr('style');
            self._update_container_height();
            self.container.trigger('change', [self.grid.get_dirty_nodes()]);

            self.grid.end_update();

            self.grid._sort_nodes();
            setTimeout(function() { //if animating, delay detaching & reattaching all elements until animation finishes
                _.each(self.grid.nodes, function (node) {
                    node.el.detach();
                    self.container.append(node.el);
                });
            }, (self.opts.animate ? 300 : 0));
        };

        el.draggable({
            handle: this.opts.handle,
            scroll: true,
            appendTo: 'body',

            start: on_start_moving,
            stop: on_end_moving,
            drag: function (event, ui) {
                var x = Math.round(ui.position.left / cell_width),
                    y = Math.floor((ui.position.top + cell_height/2) / cell_height);
                if (!self.grid.can_move_node(node, x, y, node.width, node.height)) {
                    return;
                }
                self.grid.move_node(node, x, y);
                self._update_container_height();
            }
        }).resizable({
            autoHide: !this.opts.always_show_resize_handle,
            handles: 'se',
            minHeight: this.opts.cell_height - 10,
            minWidth: 70,

            start: on_start_moving,
            stop: on_end_moving,
            resize: function (event, ui) {
                var width = Math.round(ui.size.width / cell_width),
                    height = Math.round(ui.size.height / cell_height);
                if (!self.grid.can_move_node(node, node.x, node.y, width, height)) {
                    return;
                }
                self.grid.move_node(node, node.x, node.y, width, height);
                self._update_container_height();
            }
        });

        if (node.no_move || this._is_one_column_mode()) {
            el.draggable('disable');
        }

        if (node.no_resize || this._is_one_column_mode()) {
            el.resizable('disable');
        }

        el.attr('data-gs-locked', node.locked ? 'yes' : null);
    };

    GridStack.prototype.set_animation = function (enable) {
        if (enable) {
            this.container.addClass('grid-stack-animate');
        }
        else {
            this.container.removeClass('grid-stack-animate');
        }
    };

    GridStack.prototype.add_widget = function (el, x, y, width, height, auto_position) {
        el = $(el);
        if (typeof x != 'undefined') el.attr('data-gs-x', x);
        if (typeof y != 'undefined') el.attr('data-gs-y', y);
        if (typeof width != 'undefined') el.attr('data-gs-width', width);
        if (typeof height != 'undefined') el.attr('data-gs-height', height);
        if (typeof auto_position != 'undefined') el.attr('data-gs-auto-position', auto_position ? 'yes' : null);
        this.container.append(el);
        this._prepare_element(el);
        this._update_container_height();
    };

    GridStack.prototype.will_it_fit = function (x, y, width, height, auto_position) {
        var node = {x: x, y: y, width: width, height: height, auto_position: auto_position};
        return this.grid.can_be_placed_with_respect_to_height(node);
    };

    GridStack.prototype.remove_widget = function (el) {
        el = $(el);
        var node = el.data('_gridstack_node');
        this.grid.remove_node(node);
        el.remove();
        this._update_container_height();
    };

    GridStack.prototype.remove_all = function () {
        _.each(this.grid.nodes, function (node) {
            node.el.remove();
        });
        this.grid.nodes = [];
        this._update_container_height();
    };

    GridStack.prototype.resizable = function (el, val) {
        el = $(el);
        el.each(function (index, el) {
            el = $(el);
            var node = el.data('_gridstack_node');
            if (typeof node == 'undefined') {
                return;
            }

            node.no_resize = !(val || false);
            if (node.no_resize) {
                el.resizable('disable');
            }
            else {
                el.resizable('enable');
            }
        });
        return this;
    };

    GridStack.prototype.movable = function (el, val) {
        el = $(el);
        el.each(function (index, el) {
            el = $(el);
            var node = el.data('_gridstack_node');
            if (typeof node == 'undefined') {
                return;
            }

            node.no_move = !(val || false);
            if (node.no_move) {
                el.draggable('disable');
            }
            else {
                el.draggable('enable');
            }
        });
        return this;
    };

    GridStack.prototype.locked = function (el, val) {
        el = $(el);
        el.each(function (index, el) {
            el = $(el);
            var node = el.data('_gridstack_node');
            if (typeof node == 'undefined') {
                return;
            }

            node.locked = (val || false);
            el.attr('data-gs-locked', node.locked ? 'yes' : null);
        });
        return this;
    };

    GridStack.prototype._update_element = function (el, callback) {
        el = $(el).first();
        var node = el.data('_gridstack_node');
        if (typeof node == 'undefined') {
            return;
        }

        var self = this;

        self.grid.clean_nodes();
        self.grid.begin_update(node);

        callback.call(this, el, node);

        self._update_container_height();
        self.container.trigger('change', [self.grid.get_dirty_nodes()]);

        self.grid.end_update();

        self.grid._sort_nodes();
        _.each(self.grid.nodes, function (node) {
            node.el.detach();
            self.container.append(node.el);
        });
    };

    GridStack.prototype.resize = function (el, width, height) {
        this._update_element(el, function (el, node) {
            width = (width != null && typeof width != 'undefined') ? width : node.width;
            height = (height != null && typeof height != 'undefined') ? height : node.height;

            this.grid.move_node(node, node.x, node.y, width, height);
        });
    };

    GridStack.prototype.move = function (el, x, y) {
        this._update_element(el, function (el, node) {
            x = (x != null && typeof x != 'undefined') ? x : node.x;
            y = (y != null && typeof y != 'undefined') ? y : node.y;

            this.grid.move_node(node, x, y, node.width, node.height);
        });
    };

    GridStack.prototype.cell_height = function (val) {
        if (typeof val == 'undefined') {
            return this.opts.cell_height;
        }
        val = parseInt(val);
        if (val == this.opts.cell_height)
            return;
        this.opts.cell_height = val || this.opts.cell_height;
        this._update_styles();
    };

    GridStack.prototype.cell_width = function () {
        var o = this.container.find('.' + this.opts.item_class).first();
        return Math.ceil(o.outerWidth() / o.attr('data-gs-width'));
    };

    scope.GridStackUI = GridStack;

    scope.GridStackUI.Utils = Utils;

    $.fn.gridstack = function (opts) {
        return this.each(function () {
            if (!$(this).data('gridstack')) {
                $(this).data('gridstack', new GridStack(this, opts));
            }
        });
    };

})(window, _);
