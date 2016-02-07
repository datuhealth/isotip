Changelog
=========

# 1.3.0
- Add a configuration option to disallow a tooltip to close by normal mouse/keyboard events.

This should only be used if you're going to close a tooltip programmatically. There are two ways to set this option.

1. On the trigger element. Set the `data-tooltip-autoclose` attribute to false.
2. Programmatically. When calling `isotip.open()`, set `autoClose` to false in the options object.

Additionally,

- A class name can be added by passing `className` to `open`, or setting `data-tooltip-classname`
- Fixed a bug where clicking a child element in a tooltip would close the tooltip
- Fixed tests so they actually run properly

# 1.2.6
- Support passing in a DOM element to content

# 1.2.5
- Fixes a bug where a tooltip opened programmatically wouldn't scroll with the page

# 1.2.4
- Dependency updates

# 1.2.3
- Dependency updates

# 1.2.2
- Fixes an edge case when trying to close a tooltip and it didn't exist

# 1.2.0
- Adds a scrollContainer option for tooltips inside scolling elements

# 1.1.2
- Reduces the default tooltip removal delay to 200ms

# 1.1.1
- Fixes a typo in package.json

# 1.1.0
- Fixed a bug where tooltips on far left or right were not positioned correctly. Top positioning has also been improved.

# 1.0.0
- Fixed many browser bugs and tested in many browsers

# 0.4.0
- Added API documentation and finished the basic demo page. More examples will be added to the demo page later

# 0.3.0
- Added a basic demo page. It still needs desktop styles. Also added a couple extra classes on the tooltip for CSS purposes.

# 0.2.0
- IE8 compatability. Added better event handling so that IE8 doesn't throw errors.

# 0.1.0
- Initial version. This doesn't include browser testing or a standalone version
