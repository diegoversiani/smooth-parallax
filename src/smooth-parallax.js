/**
 * SmoothParallax 1.1.0
 * 
 * File smooth-parallax.js.
 *
 * Yet another parallax script. Smooth parallax is intended to make it a lot easier to
 * make objects move vertically or horizontally when scroll, being it images,
 * divs or what-have-you. Use this script to add background or foreground parallax
 * effect to your website.
 *
 * Website: http://diegoversiani.me/smooth-parallax
 * Github: https://github.com/diegoversiani/smooth-parallax
 *
 * Author: Diego Versiani
 * Contact: http://diegoversiani.me
 * 
 * Based on the work of:
 * Rachel Smith: https://codepen.io/rachsmith/post/how-to-move-elements-on-scroll-in-a-way-that-doesn-t-suck-too-bad
 */
(function (root, factory) {
  if ( typeof define === 'function' && define.amd ) {
    define([], factory(root));
  } else if ( typeof exports === 'object' ) {
    module.exports = factory(root);
  } else {
    root.SmoothParallax = factory(root);
  }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

  'use strict';

  //
  // Variables
  //

  var _container;
  var _width, _height, _scrollHeight, _viewPortWidth;
  var _prefix;
  var _scrollPercent = 0;
  var _scrollOffset = 0;
  var _jsPrefix, _cssPrefix;
  var _movingElements = [];
  var _positions = [];
  var window = root; // Map window to root to avoid confusion
  var publicMethods = {}; // Placeholder for public methods

  // Default settings
  var defaults = {
    turkey: true,
    mayo: false,
    bread: 'wheat',
  };


  //
  // Methods
  //

  /**
   * Merge two or more objects. Returns a new object.
   * @private
   * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
   * @param {Object}   objects  The objects to merge together
   * @returns {Object}          Merged values of defaults and options
   */
  var extend = function () {
    // Variables
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;

    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
      deep = arguments[0];
      i++;
    }

    // Merge the object into the extended object
    var merge = function (obj) {
      for ( var prop in obj ) {
        if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
          // If deep merge and property is an object, merge properties
          if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
            extended[prop] = extend( true, extended[prop], obj[prop] );
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    // Loop through each object and conduct a merge
    for ( ; i < length; i++ ) {
      var obj = arguments[i];
      merge(obj);
    }

    return extended;
  };

  /**
   * Keep updating elements position infinitelly.
   * @private
   */
  var loopUpdatePositions = function () {
    updateElementsPosition();
    requestAnimationFrame(loopUpdatePositions);
  };

  /**
   * Get browser prefix
   * @private
   */
  var getBrowserPrefix = function () {
    var styles = window.getComputedStyle(document.documentElement, ''),
      _prefix = (Array.prototype.slice
        .call(styles)
        .join('') 
        .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
      )[1],
      dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + _prefix + ')', 'i'))[1];
    
    return {
        dom: dom,
        lowercase: _prefix,
        css: '-' + _prefix + '-',
        js: _prefix[0].toUpperCase() + _prefix.substr(1)
      };
  };

  /**
   * Get movable element container
   * @private
   */
  var getElementContainer = function ( element ) {
    var containerId = element.getAttribute( 'data-container-id' );

    if ( containerId != '' && document.getElementById( containerId ) ) {
      _container = document.getElementById( containerId );
    }
    else {
      _container = element.parentNode;
    }

    return _container;
  };

  /**
   * Calculate variables used to determine elements position
   * @private
   */
  var calculateVariables = function ( positionData ) {
    _width = positionData.container.scrollWidth;
    _height = positionData.container.scrollHeight;
    _scrollHeight = _height + window.innerHeight;
    _scrollOffset = window.innerHeight - positionData.container.getBoundingClientRect().top;
    _scrollPercent = _scrollOffset/_scrollHeight || 0;

    if ( _scrollPercent < 0 ) {
      _scrollPercent = 0;
    }
    else if ( _scrollPercent > 1 ) {
      _scrollPercent = 1;
    }
  };

  /**
   * Initializes positions for each moving element.
   * @private
   */
  var initializeMovingElementsPosition = function () {
    var startPercent,
        startX,
        startY,
        endPercent,
        endX,
        endY;

    _movingElements = document.querySelectorAll('[data-smooth-parallax-element]');

    for (var i = 0; i < _movingElements.length; i++) {
      startPercent = parseFloat(_movingElements[i].getAttribute( 'data-start-percent' )) || 0;
      startX = parseFloat(_movingElements[i].getAttribute( 'data-start-x' )) || 0;
      startY = parseFloat(_movingElements[i].getAttribute( 'data-start-y' )) || 0;
      endPercent = parseFloat(_movingElements[i].getAttribute( 'data-end-percent' )) || 1;
      endX = parseFloat(_movingElements[i].getAttribute( 'data-end-x' )) || 0;
      endY = parseFloat(_movingElements[i].getAttribute( 'data-end-y' )) || 0;

      var _elementPosition = {
        container: getElementContainer( _movingElements[i] ),
        start: {
          percent: startPercent,
          x: startX,
          y: startY
        },
        end: {
          percent: endPercent,
          x: endX,
          y: endY
        },
        diff: {
          percent: endPercent - startPercent,
          x: endX - startX,
          y: endY - startY,
        },
        target: {},
        current: {}
      };

      _positions.push( _elementPosition );
    }
  };

  /**
   * Updates moving elements position.
   * @private
   */
  var updateElementsPosition = function () {
    for (var i = 0; i < _movingElements.length; i++) {
      var p = _positions[i],
          baseWidth = _movingElements[i].scrollWidth,
          baseHeight = _movingElements[i].scrollHeight,
          transformValue;

      calculateVariables( p );
      
      // calculate target position
      if(_scrollPercent <= p.start.percent) {
        p.target.x = p.start.x * baseWidth;
        p.target.y = p.start.y * baseHeight;
      }
      else if(_scrollPercent >= p.end.percent) {
        p.target.x = p.end.x * baseWidth;
        p.target.y = p.end.y * baseHeight;
      }
      else {
        p.target.x = p.start.x * baseWidth + ( p.diff.x * ( _scrollPercent - p.start.percent ) / p.diff.percent * baseWidth );
        p.target.y = p.start.y * baseHeight + ( p.diff.y * ( _scrollPercent - p.start.percent ) / p.diff.percent * baseHeight );
      }
      
      // linear interpolation
      if(!p.current.x) {
        p.current.x = p.target.x;
        p.current.y = p.target.y;
      } else {
        p.current.x = p.current.x + (p.target.x - p.current.x) * 0.1;
        p.current.y = p.current.y + (p.target.y - p.current.y) * 0.1;
      }

      // update element style
      transformValue = 'translate3d(' + p.current.x + 'px, ' + p.current.y + 'px, 0px)';
      _movingElements[i].style[ _jsPrefix + 'Transform' ] = transformValue;
      _movingElements[i].style.transform = transformValue;
    }
  };

  /**
   * Get movable element container
   * @private
   */
  var initializeVariables = function () {
    _viewPortWidth = document.documentElement.clientWidth || window.innerWidth;
    _prefix = getBrowserPrefix();
    _jsPrefix = ( _prefix.lowercase == 'moz' ) ? 'Moz' : _prefix.lowercase;
    _cssPrefix = _prefix.css;
  };


  /**
   * Initializes plugin
   */
  publicMethods.init = function ( options ) {
      // Merge user options with defaults
      var settings = extend( defaults, options || {} );

      // Initialize variables
      initializeVariables();
      console.log('initializeVariables');

      if ( _viewPortWidth >= 750 ) {
        initializeMovingElementsPosition();
        loopUpdatePositions();
      }
  };


  //
  // Public APIs
  //
  return publicMethods;

});


// TODO: Remove load event listener, to allow developer to choose when to init plugin
window.addEventListener("DOMContentLoaded", function () { window.SmoothParallax.init() });





