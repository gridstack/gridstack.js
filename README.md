gridstack.js
============

gridstack.js is a jQuery plugin for widget layout. This is drag-and-drop multi-column grid. It allows you to build 
draggable responsive bootstrap v3 friendly layouts. It also works great with [knockout.js](http://knockoutjs.com)

Inspired by [gridster.js](http://gridster.net). Built with love.

Demo
====

Please visit http://troolee.github.io/gridstack.js/ for demo.


Usage
=====

## Requirements

* http://underscorejs.org (>= 1.7.0)
* http://jquery.com (>= 1.11.0)
* http://jqueryui.com (>= 1.11.0)
* (Optional) http://knockoutjs.com (>= 3.2.0)

Coming soon...

## Options

- `width` - amount of columns (default: 12)
- `item_class` - widget class (default: 'grid-stack-item')
- `placeholder_class` - class for placeholder (default: 'grid-stack-placeholder')
- `handle` - draggable handle selector (default: '.grid-stack-item-content')
- `cell_height` - one cell height (default: 60)
- `vertical_margin` - vertical gap size (default: 20)
- `auto` - if `false` it tells to do not initialize existing items (default: true)
- `min_width` - minimal width. If window width is less grid will be shown in one-column mode (default: 768)

## Item attributes

- `data-gs-x`, `data-gs-y` - element position
- `data-gs-width`, `data-gs-height` - element size
- `data-gs-max-width`, `data-gs-min-width`, `data-gs-max-height`, `data-gs-min-height` - element constraints
- `data-gs-no-resize` - disable element resizing
- `data-gs-auto-position` - tells to ignore `data-gs-x` and `data-gs-y` attributes and to place element to the first 
    available position

## Use with knockout.js

```javascript
ko.components.register('dashboard-grid', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            var ViewModel = function (params, componentInfo) {
                var grid = null;

                this.widgets = params.widgets;

                this.afterAddWidget = function (items) {
                    _.each(items, function (item) {
                        item = $(item);

                        if (grid == null) {
                            grid = $(componentInfo.element).find('.grid-stack').gridstack({
                                auto: false
                            }).data('gridstack');
                        }

                        grid.add_widget(item);
                        ko.utils.domNodeDisposal.addDisposeCallback(item[0], function () {
                            grid.remove_widget(item);
                        });
                    }, this);
                };

            };

            return new ViewModel(params, componentInfo);
        }
    },
    template: [
        '<div class="grid-stack">',
        '   <!-- ko foreach: widgets, afterRender: afterAddWidget -->',
        '       <div class="grid-stack-item" data-bind="attr: {',
        '               \'data-gs-x\': x, \'data-gs-y\': y,',
        '               \'data-gs-width\': width, \'data-gs-height\': height}">',
        '           <span data-bind="text: $index"></span>',
        '       </div>',
        '   <!-- /ko -->',
        '</div>'
    ].join('\n')
});
```

and HTML:

```html
<div data-bind="component: {name: 'dashboard-grid', params: $data}"></div>
```


License
=======

The MIT License (MIT)

Copyright (c) 2014 Pavel Reznikov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

