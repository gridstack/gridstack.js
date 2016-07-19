Frequently asked questions
==========================

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Gridstack doesn't use bootstrap 3 classes. Why you say it's bootstrap 3 friendly.](#gridstack-doesnt-use-bootstrap-3-classes-why-you-say-its-bootstrap-3-friendly)
- [How can I create a static layout using gridstack.](#how-can-i-create-a-static-layout-using-gridstack)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### Gridstack doesn't use bootstrap 3 classes. Why you say it's bootstrap 3 friendly.

**Q:**

Original issue #390:

> Hi,
>
> Excuse my ignorance but on your site you write "responsive bootstrap v3 friendly layouts" but how?
>
> In none of the examples you actually make use of any bootstrap classes. You add it to head but if you do that with gridster it works exactly the same..
>
> What does gridstack do different then gridster?
>
> Reason I'm asking is because I have bootstrap HTML templates I want to put them in the grid so users can move it all around .. then when done have a normal html page (without the draggable grid). I thought gridstack would help to do that in favor of gridster but so far I have not seen any difference between the 2..
>
> Thanks!

**A:**

We never declare that gridstack uses bootstrap classes. We say that gridstack could be responsive (widgets are not fixed width) it works well on bootstrap 3 pages with fixed or responsive layout. That's why it says bootstrap 3 friendly.

It wasn't a goal for gridstack to create bootstrap 3 layouts. It's not a goal now neither. The goal of gridstack is to create dashboard layouts with draggable/resizable widgets.

Gridstack uses internal grid to implement its logic. DOM nodes are just interpretation of this grid. So we or you probably could create a third party library which exports this internal grid into bootstrap 3/bootstrap 4/absolute divs/whatever layout. But I don't see this as part of gridstack core. As the same as support of angular/knockout/whatever libraries. We're doing all necessary for smooth support but it will never be a part of core.

The main idea is to build as simple and flexible lib as possible.


### How can I create a static layout using gridstack.

**Q:**

How can I create a static layout not using jQuery UI, etc.

**A:**

The main propose of gridstack is creating dashboards with draggable and/or resizable widgets. You could disable this behavior by setting `static` option. At this point you will probably
still need to include jQuery UI. But we will try to decrease dependency of it in near future.
