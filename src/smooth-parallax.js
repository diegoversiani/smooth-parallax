/**
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

(function(){
  
  'use strict';

  // Initialize EventListeners
  window.addEventListener("DOMContentLoaded", init);


  var _container;
  var _width, _height, _scrollHeight;
  var pre = prefix();
  var _scrollPercent = 0;
  var _scrollOffset = 0;
  var _jsPrefix  = ( pre.lowercase == 'moz' ) ? 'Moz' : pre.lowercase;
  var _cssPrefix = pre.css;
  var _movingElements = [];
  var _positions = [];




  function init() {
    var viewPortWidth = document.documentElement.clientWidth || window.innerWidth;

    if ( viewPortWidth >= 750 ) {
      initMovingElements();
      loop();
    }
  };




  /* See shared/which-browser-prefix.js */
  function prefix() {
    var styles = window.getComputedStyle(document.documentElement, ''),
      pre = (Array.prototype.slice
        .call(styles)
        .join('') 
        .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
      )[1],
      dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
    
    return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
      };
  };





  function initMovingElements() {
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





  function getElementContainer( element ) {
    var containerId = element.getAttribute( 'data-container-id' );

    if ( containerId != '' && document.getElementById( containerId ) ) {
      _container = document.getElementById( containerId );
    }
    else {
      _container = element.parentNode;
    }

    return _container;
  };





  function calculateVariables( positionData ) {
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





  function updateElementsPosition() {
    for (var i = 0; i < _movingElements.length; i++) {
      var p = _positions[i],
          baseWidth = _movingElements[i].scrollWidth,
          baseHeight = _movingElements[i].scrollHeight;

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
      _transformValue = 'translate3d(' + p.current.x + 'px, ' + p.current.y + 'px, 0px)';
      _movingElements[i].style[ _jsPrefix + 'Transform' ] = _transformValue;
      _movingElements[i].style.transform = _transformValue;
    }
  };





  function loop() {
    updateElementsPosition();
    requestAnimationFrame(loop);
  };



})();
