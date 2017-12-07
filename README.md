# Smooth Parallax

Parallax that doesn't suck! No jQuery required, just plain 'ol javascript.

Smooth Parallax makes it easy to move objects when you scroll, being it images, divs or what-have-you. Use it to add that background or foreground parallax effect to your website or create a [moving scene with a hippie van](https://diegoversiani.me/smooth-parallax/) :)


__Enjoy using Smooth Parallax?__

If you enjoy using Smooth Parallax and want to say thanks, you can leave me a small tip.
All payments are securely handled through [PayPal](https://paypal.com).

<a href='https://ko-fi.com/A0212ZQ' target='_blank'><img height='32' style='border:0px;height:32px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=a' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Installation

Setting up is pretty straight-forward. Just download the script from __dist__ folder and include it in your HTML:

```html
<script type="text/javascript" src="path/to/smooth-parallax.min.js"></script>
```

Smooth Parallax also supports AMD / CommonJS

```js
// AMD
require(["path/to/smooth-parallax"], function(SmoothParallax) {});

// CommonJS
var SmoothParallax = require("smooth-parallax");
```

### NPM / Bower

Smooth Parallax is also available on NPM and Bower:

```sh
npm install smooth-parallax      # npm
bower install smooth-parallax    # bower
```

## Basic Usage

__Init__

Just call `SmoothParallax.init()` to get objects moving and configure elements movement.

```html
<script type="text/javascript">
  window.addEventListener("load", function () {
    SmoothParallax.init();
  });
</script>
```

Smooth Parallax will automatically look for all objects with the attribute `smooth-parallax` (ie.: `<img src="images/hippie-van.png" smooth-parallax="">`).

__Configure elements movement__

You'll also have to set at least one more attribute `start-position` or `end-position`, see options at [standard options](#standard-options).

## Standard Options

__Global Options__

These options are passed to the `init` function when starting Smooth Parallax.

- `basePercentageOn` Set how you want to track scroll percentage:
    - `containerVisibility` __default__: scroll percentage for each moving object is calculated only when the element's container is visible in the viewport. This prevents objects from moving while not visible.
    - `pageScroll`: scroll percentage is based on the page scroll and is the same for all moving objects.

__Elements Options__

These options are passed as html attributes to the moving elements and define how that element movement behaves.

All percentage values are in decimal form, ie.: `1 = 100%`. You can also set values greater than 1 and smaller than 0, ie.: `-0.5 = -50%` or `1.25 = 125%`.

- `start-movement` - define at what scroll percentage to start moving the object. Default value is `0.0`;
- `end-movement` - define at what scroll percentage to stop moving the object. Default value is `1.0`.
- `start-position-x` - define the horizontal start position of the element in percentage of its the base-size (see option below).
- `start-position-y` - define the vertical start position of the element in percentage of its the base-size (see option below).
- `end-position-x` - define the horizontal end position of the element in percentage of its the base-size (see option below).
- `end-position-y` - define the vertical end position of the element in percentage of its the base-size (see option below).
- `container` - change the elements container element user to calculate its position, default is moving element's parent node.
- `base-size` - define how to calculate the base size of the movement, used to calculate the target position.
    - `elementSize`: calculate based on the element size itself.
    - `containerSize`: calculate based on the elements container size.

## Contributing to Development

This isn't a large project by any means, but I'm definitely welcome to any pull requests and contributions.

You can get your copy up and running for development quickly by cloning the repo and running [npm](http://npmjs.org/):

```
$ npm install
```

This will install all the necessary tools for compiling minified files.

## Change Log

__1.1.2__

- Improvement: Extend public method `getScrollPercent` to return scroll percentage for elements.
- Fix position calculation to 2 decimals precision.
- Fix scroll percent calculation based on containerSize.

__1.1.1__

- Fix npm package.json info.

__1.1.0__

__Upgrade Notice:__ This version changes how Smooth Parallax is initiated and how the elements options are set.

- Converted script into a javascript plugin.
- Renamed html attributes:
    - `data-smooth-parallax-element` > `smooth-parallax`
    - `data-start-percent` > `start-movement`
    - `data-end-percent` > `end-movement`
    - `data-start-x` > `start-position-x`
    - `data-start-y` > `start-position-y`
    - `data-end-x` > `end-position-x`
    - `data-end-y` > `end-position-y`
    - `data-smooth-parallax-element` > `smooth-parallax`
    - `data-container-id` > `container`.
- Changed element option __container__ expected value to be a valid css selector instead of element id.
- Added element option __base-size__.
- Added global option __pageScroll__.

__1.0.0__

- Initial release

## License

Licensed under MIT. Enjoy.

## Acknowledgement

Smooth Parallax was created by [Diego Versiani](https://diegoversiani.me) for a better Parallax Effect.
