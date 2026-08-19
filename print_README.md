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
    orientation: 'landscape'     // Force the printed page (and this widget's own page) to be landscape
  }
}
```

Note: `pageBreak`/`orientation` pull the widget out of the normal float flow so the browser reliably honors
the forced break (floated elements are otherwise ignored by Chrome's forced page-break handling) - the
widget's width is unaffected.

`orientation` stays in effect for that page until something else forces a new page - it doesn't automatically
revert on the next widget. If you have a landscape section followed by widgets that should go back to
portrait, set `orientation: 'portrait'` (or `pageBreak: true`) explicitly on the widget that should resume
portrait, rather than relying on it reverting on its own.

## Utility Classes

GridStack also provides a utility class to hide specific elements (like buttons, links, or a navbar) during
printing - useful for anything interactive that doesn't make sense on paper:

```html
<div class="gs-print-hide">
  <button onClick="window.print()">Print Dashboard</button>
</div>
```

This works anywhere in the document, not just on grid items - for example on buttons/links inside a widget's
own content.
