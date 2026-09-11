# GridStack Printing Support

GridStack v13.1+ introduces native printing support.

## The Problem

GridStack normally positions widgets with `position: absolute` and inline `top`/`left` coordinates. Browsers
cannot paginate absolutely-positioned content at all - it's removed from the normal document flow, so a
printed grid would either get clipped at the page edge or overlap across pages.

## The Solution

For `@media print`, GridStack switches widgets to `display: block` with `float: left` instead. This puts them
back in the normal document flow, which browsers know how to paginate correctly:

- Items auto-size their height to fit their content (no scrollbars, no clipping - nothing on a printed page
  is interactive anyway).
- Items flow left to right and wrap to the next line based on their width, in the same order they appear
  visually on screen.
- A widget that doesn't fit in the remaining space on a page is moved to start cleanly on the next page,
  instead of being sliced in half across the two pages.
- A hidden widget (`print.hide`) takes no space at all, so the widgets that follow move up to reclaim it -
  there's no empty gap left behind.

**The one remaining trade-off:** this is a left-to-right/top-to-bottom flow, not a pixel-perfect 2D packing.
If one widget in a row is much taller than its neighbors, the next row still can't start higher than that
tall widget's bottom edge (plain CSS has no print-safe masonry layout). Hidden widgets aren't affected by
this - only different-height *visible* neighbors sharing a row are.

## Widget PrintOptions

You can customize how individual widgets print by passing a `print` object to the widget options.

```javascript
{
  x: 0, y: 0, w: 12, h: 2,
  content: 'My Widget',
  print: {
    hide: true,                  // Prevent this widget from printing
    pageBreak: true,             // Force a page break before this widget
    orientation: 'landscape',    // Force the printed page (and this widget's own page) to be landscape
    breakInside: true            // Allow this widget's content to fragment across pages instead of
                                  // being kept together as one unbreakable block
  }
}
```

Note: `pageBreak`/`orientation`/`breakInside` all pull the widget out of the normal float flow so the browser
reliably honors them (floated elements are otherwise ignored/mishandled by Chrome's print pagination) - for
`pageBreak`/`orientation` the widget's width is unaffected, but `breakInside` also widens the widget to the
full print width (see below).

`orientation` stays in effect for that page until something else forces a new page - it doesn't automatically
revert on the next widget. If you have a landscape section followed by widgets that should go back to
portrait, set `orientation: 'portrait'` (or `pageBreak: true`) explicitly on the widget that should resume
portrait, rather than relying on it reverting on its own.

### Tall content that doesn't fit on one page

The base layout keeps every widget together with `break-inside: avoid`, so a widget that's taller than the
remaining space on a page moves whole to the next page - normally the right behavior, but a widget containing
a long table/datagrid (or a section wrapping a nested sub-grid) can easily be taller than an *entire* page.
Forcing it to stay in one piece then just leaves the current page mostly blank.

Set `print.breakInside: true` on that widget to opt out: it's allowed to fragment naturally across as many
pages as it needs, and is widened to the full print width (rather than its on-screen column width) since a
floated box that's allowed to break across pages can otherwise overlap the next floated sibling in Chrome.

```javascript
{ x: 0, y: 0, w: 6, h: 20, content: '<table>...many rows...</table>', print: { breakInside: true } }
```

### Keeping a header with the content that follows it (sections / nested sub-grids)

A "section" widget - typically a header/title bar followed by a nested sub-grid - has the same needs: the
outer widget should use `breakInside: true` so the section as a whole can span pages, while the header
itself should never be separated from the row of widgets right after it.

The natural tool for that is `break-after: avoid` on the header, but Chrome's print engine ignores
`break-after`/`page-break-after` set directly on a `display: flex` (or `grid`) element - a common case for
headers that lay out a title next to actions/icons. Put the [`gs-print-avoid-break-after`](#utility-classes)
utility class on a plain block-level wrapper around the header instead of on the flex element itself:

```html
<div class="grid-stack-item-content">
  <div class="gs-print-avoid-break-after">
    <div class="my-section-header" style="display:flex">Section Title <span>...icons...</span></div>
  </div>
  <div class="grid-stack">...nested sub-grid widgets...</div>
</div>
```

## Utility Classes

GridStack also provides a utility class to hide specific elements (like buttons, links, or a navbar) during
printing - useful for anything interactive that doesn't make sense on paper, and reverse only during content

```html
<div class="gs-print-hide">
  <button onClick="window.print()">Print Dashboard</button>
</div>
<div class="gs-print-show">
  content for print only...
</div>

```

This works anywhere in the document, not just on grid items - for example on buttons/links inside a widget's
own content.

`gs-print-avoid-break-after` is another such class - put it on a plain block-level element to stop a page
break from landing right after it. See [Keeping a header with the content that follows it](#keeping-a-header-with-the-content-that-follows-it-sections--nested-sub-grids)
above.
