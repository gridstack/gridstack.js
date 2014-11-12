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

* http://underscorejs.org
* http://jquery.com
* http://jqueryui.com

Coming soon...

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
                        if (item.data('_gridstack_node'))
                            return;

                        if (grid == null) {
                            grid = $(componentInfo.element).find('.grid-stack').gridstack({
                                auto: false
                            }).data('gridstack');
                        }

                        grid.add_widget(item);
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

