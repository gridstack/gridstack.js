# GridStack Printing Support

GridStack v13.1+ introduces native printing support with two distinct layout modes to handle the complexities of browser print engines.

## The Problem: The Flexbox Pagination Bug

Chrome's print engine has a notorious, long-standing bug where it **cannot calculate page breaks inside CSS Grid or Flexbox containers**. 

If a widget is too tall to fit on the remainder of a printed page, instead of cleanly breaking the widget across two pages (or moving it to the next page), Chrome will literally slice your widgets in half across physical pieces of paper, or push entire rows to the next page, leaving massive blank gaps.

To solve this, GridStack offers two print modes:

---

## 1. Flow Mode (Default)
**Best for:** Dashboards with tall widgets that span multiple pages.

In Flow Mode, GridStack forces the widgets to act like words in a standard Word document (`display: block` with `float: left`). This allows Chrome to cleanly push them to the next page without slicing them in half.

**How it works:**
- Items auto-size their height to fit their content.
- Items flow naturally from left to right, wrapping to the next line when they run out of horizontal space.
- Widgets are never sliced across pages.

**The Trade-off (Gaps):**
Because they are flowing like a standard document, they wrap line-by-line. If you have a row with one very tall widget and several short widgets, the next row of widgets *cannot start higher than the bottom of the tallest item in the previous row*. This can result in empty vertical space (gaps) under the shorter widgets.

---

## 2. Exact Mode (`printMode: 'exact'`)
**Best for:** Single-page dashboards or strict layouts where visual fidelity is more important than pagination.

In Exact Mode, GridStack uses native CSS Grid to perfectly pack the widgets exactly as they appear on screen.

**How to enable:**
Pass `printMode: 'exact'` in your `GridStackOptions`:
```javascript
let grid = GridStack.init({
  printMode: 'exact'
});
```

**How it works:**
- Perfectly respects your exact `x`, `y`, `w`, and `h` coordinates.
- Zero vertical gaps (perfect 2D masonry packing).
- Honors manual `PrintOptions` like `pageBreak: true` and `orientation: 'landscape'`.

**The Trade-offs:**
- **Slicing:** Because it uses CSS Grid, Chrome's pagination bug applies. If a tall widget lands on a page boundary, Chrome will likely slice it in half across two pages.
- **Scrollbars:** Widgets do *not* auto-expand their height to fit content. If a widget has more content than its `h` value allows, it will print with a scrollbar (or clip the content) just like it does on screen, rather than expanding and pushing the widgets below it down.

---

## Widget PrintOptions

You can customize how individual widgets print by passing a `print` object to the widget options.

*Note: `pageBreak` and `orientation` require **Exact Mode**. In Flow Mode, items use `float: left` to achieve natural wrapping, and Chrome's print engine ignores forced page breaks on floated elements - `pageBreak` and `orientation` will have no effect there.*

```javascript
{
  x: 0, y: 0, w: 12, h: 2,
  content: 'My Widget',
  print: {
    hide: true,                  // Prevent this widget from printing
    pageBreak: true,             // Force a page break before this widget
    orientation: 'landscape'     // Force the printed page to be landscape
  }
}
```

## Utility Classes

GridStack also provides a utility class to hide specific elements (like buttons or navbars) during printing:

```html
<div class="gs-print-hide">
  <button onClick="window.print()">Print Dashboard</button>
</div>
```