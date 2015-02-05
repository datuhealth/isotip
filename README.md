# Isotip

> The javascript tooltip plugin without any dependencies

Isotip is a small (3kb minified and gzipped) and minimal node module to be included in your browserify (or similar) package for use in the browser. It's only dependencies are ES5 and a browser.

It provides a minimal API to configure markup, location, offset, delays, and more. See the [API](#api) below for more details.

## Installation

```
npm install isotip
```

## Browser compatibility

Isotip is meant to be IE8+ compatible (with an ES5 shim). If you find otherwise, please open a new [issue](https://github.com/datuhealth/isotip/issues/new).

## Example

```
<!doctype html>
<html lang="en">
<head></head>
<body>
    <!-- click-based tooltips -->
    <div class="tooltip-click" data-tooltip-content="Click-based tooltip"></div>
    <!-- hover-based tooltips -->
    <div class="tooltip-hover" data-tooltip-content="Hover-based tooltip"></div>
    <!-- focus-based tooltips -->
    <div class="tooltip-focus" data-tooltip-content="Focus-based tooltip"></div>
    <!-- bundle that requires isotip -->
    <script src="/js/bundle.js"></script>
</body>
</html>
```

## API

Todo
- [ ] Options override
- [ ] Tooltip attributes

## Todo

- [ ] Test in other browsers
- [ ] Setup demo page
- [ ] Provide documentation of API
- [x] Provide standalone version for use without a build tool
- [x] Provide a basic CSS sheet for styling the tooltips
- [ ] Add accent (arrow) element to tooltip and adjust based on position

## Changelog

- 0.3.0 - Added a basic demo page. It still needs desktop styles. Also added a couple extra classes on the tooltip for CSS purposes.
- 0.2.0 - IE8 compatability. Added better event handling so that IE8 doesn't throw errors.
- 0.1.0 - Initial version. This doesn't include browser testing or a standalone version

## License

[Apache 2.0](LICENSE.md)
