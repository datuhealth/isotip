# Isotip

> The javascript tooltip plugin without any dependencies

[![Build Status](https://travis-ci.org/datuhealth/isotip.svg?branch=master)](https://travis-ci.org/datuhealth/isotip)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Isotip is a small (3kb minified and gzipped) and minimal node module to be included in your browserify (or similar) package for use in the browser. Its only dependencies are ES5 and a browser.

It provides a minimal API to configure markup, location, offset, delays, and more. See the [API](#api) below for more details.

## Installation

```
npm install isotip
```

```
bower install isotip
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
    <!-- bundle that requires isotip, or the standalone version -->
    <script src="/js/bundle.js"></script>
    <script src="/js/isotip/dist/isotip.js"></script>
</body>
</html>
```

## API

Isotip (purposefully) has a simple api. It provides a simple helper function to automatically bind certain events and open tooltips when they fire.

Configuring a specific tooltip is done via data attributes on an element.

### **`data-tooltip-content`**

This sets the main body content of the tooltip into a `<p>` tag by default with a class of `tooltip-content`. Content is interpreted as plain text by default. To insert html, set the data-tooltip-html attribute to true.

### **`data-tooltip-title`**

This sets the title of the tooltip into a `<p>` tag by default with a class of `tooltip-title`.

### **`data-tooltip-html`**

Setting this to true will force Isotip to try and interpret the content as HTML. If it fails, it will interpret the content as plain text.

### **`data-tooltip-placement`**

This sets the position of the tooltip. Options are `top`, `right`, `bottom`, and `left`. By default, `top` is used for all tooltips.

### **`data-tooltip-container`**

This sets the element that the tooltip will be prepended to. By default, this is the `<body>` element.

Alternatively, programattic creation and destruction of tooltips is available.

### **`data-tooltip-scrollContainer`**

This sets the element that will have a scroll event bound to it. If your tooltip is inside a scrolling element (`overflow:scroll`), you need to add this!.

### **`init( config )`**

The init method provides automatic event binding for tooltips. It sets up delegated event listeners for `.tooltip-click`, `.tooltip-hover`, and `.tooltip-focus` for click, mouseover, and focus events respectively. You can pass in an optional config object to overwrite any of the default options.

```javascript
var options = {
    html: false, // set to true to always interpret content as HTML
    placement: 'top', // default placement of tooltips
    container: 'body', // default containing element for the tooltip
    scrollContainer: '.scroll-container', // default container for scroll watching
    template: '<div class="tooltip" data-tooltip-target="tooltip"></div>', // default template for the tooltip shell
    removalDelay: 200, // default number of ms before the tooltip is removed
    tooltipOffset: 10, // default number of px the tooltip is offset from the trigger element
    windowPadding: { // window bounds for tooltip repositioning
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    }
};

isotip.init( config );
```

### **`open( trigger, config )`**

The open method will create the tooltip, insert it into the DOM, and position it in relation to it's trigger. The trigger can be an element or a CSS selector. The object to be passed in will serve as a replacement for the data attributes on the trigger.

```javascript
var config = {
    html: false, // set to true to interpret content as HTML
    placement: 'top', // where to place the tooltip in relation to the trigger
    content: 'Tooltip content', // the content to go into the tooltip,
    title: 'Tooltip title', // the text to go in the title, if any
    autoClose: false // set to false if you only want to close the tooltip programmatically
};

isotip.open( '.tooltip', config );
```

### **`close( tooltip )`**

The close method will remove a tooltip from the DOM. The tooltip to remove should be passed in and can be an element or a CSS selector.

```javascript
isotip.close( '.tooltip' );
```

### **`positionTooltip( tooltip, trigger, placement )`**

The positionTooltip method will re-evaluate the position of a tooltip in relation to it's trigger element. Only the tooltip and trigger need to be passed in, and placement will default to what's been configured by `init()`. Tooltip and trigger can be either an element or a CSS selector.

```javascript
isotip.positionTooltip( '.tooltip', '.tooltip-click', 'left' );
```

## [Changelog](CHANGELOG.md)

## [License](LICENSE.md)
