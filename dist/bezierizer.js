/*! bezierizer - v0.1.0 - 2015-01-30 - https://github.com/jeremyckahn/bezierizer */
define(['jquery', 'jquery-dragon'], function ($) {

var HTML_TEMPLATE = [
  '<div class="bezierizer-container">'
    ,'<div class="bezierizer-canvas-container">'
      ,'<canvas></canvas>'
      ,'<div class="bezierizer-handle-container">'
        ,'<button class="bezierizer-handle bezierizer-handle-1">'
        ,'<button class="bezierizer-handle bezierizer-handle-2">'
      ,'</div>'
    ,'</div>'
  ,'</div>'
].join('');

/* global define: true */
// PRIVATE HELPER FUNCTIONS
//

/*!
 * @param {jQuery} $handleContainer The element that contains the Bezierizer
 * DOM elements.
 * @param {jQuery} $handle The handle to compute X for.
 */
function getHandleX ($handleContainer, $handle) {
  return parseInt($handle.css('left'), 10) / (
      $handleContainer.outerWidth(true) - $handle.outerWidth(true));
}


/*!
 * @param {jQuery} $handleContainer The element that contains the Bezierizer
 * DOM elements.
 * @param {jQuery} $handle The handle to compute Y for.
 */
function getHandleY ($handleContainer, $handle) {
  return parseInt($handle.css('top'), 10) / (
      $handleContainer.outerHeight(true)  - $handle.outerHeight(true));
}


/**
 * Creates a Bezierizer widget and inserts it into the DOM.
 * @param {Element} container The container element to insert the Bezierizer widget into.
 * @constructor
 */
function Bezierizer (container) {
  this.$el = $(container);
  this.$el.append($(HTML_TEMPLATE));

  this._$canvasContainer = this.$el.find('.bezierizer-canvas-container');
  this._$canvas = this._$canvasContainer.find('canvas');
  this._$handleContainer = this.$el.find('.bezierizer-handle-container');
  this._$handles = this._$handleContainer.find('.bezierizer-handle');

  this._ctx = this._$canvas[0].getContext('2d');
  this._$canvas[0].height = this._$canvas.height();
  this._$canvas[0].width = this._$canvas.width();

  this._$handles.dragon({
    within: this._$handleContainer
  });

  this._points = {};
  this.setHandlePositions({
     x1: 0.25
    ,y1: 0.5
    ,x2: 0.75
    ,y2: 0.5
  });

  this._initBindings();
}


/*!
 * @private
 */
Bezierizer.prototype._initBindings = function () {
  this._$canvasContainer.on(
      'drag', '.bezierizer-handle', $.proxy(function (evt) {
    this._updateInternalStateFromDOM();
    this._redraw();
    this.$el.trigger('change');
  }, this));
};


/*!
 * @private
 */
Bezierizer.prototype._updateInternalStateFromDOM = function () {
  var $handleContainer = this._$handleContainer;

  this._points = {
     x1: getHandleX($handleContainer, this._$handles.eq(0))
    ,y1: getHandleY($handleContainer, this._$handles.eq(0))
    ,x2: getHandleX($handleContainer, this._$handles.eq(1))
    ,y2: getHandleY($handleContainer, this._$handles.eq(1))
  };
};


/*!
 * @private
 */
Bezierizer.prototype._redraw = function () {
  var points = this._points;
  var height = this._$canvas[0].height;
  var width = this._$canvas[0].width;
  var x1 = points.x1 * width;
  var y1 = points.y1 * height;
  var x2 = points.x2 * width;
  var y2 = points.y2 * height;

  // This fixes a bizarre rendering issue in Chrome:
  //
  // CanvasRenderingContext2D#bezierCurveTo doesn't render when x1 and y1 are
  // exactly 0.  To prevent this, force the rendered value to be just a bit
  // more than 0.
  if (x1 === 0) {
    x1 = 1e-5;
  }

  if (y1 === 0) {
    y1 = 1e-5;
  }

  var ctx = this._ctx;
  var handleStrokeColor = '#888';
  var handleLineWidth = 2;
  ctx.clearRect(0, 0, width, height);

  ctx.beginPath();
  ctx.lineWidth = handleLineWidth;
  ctx.moveTo(x1, y1);
  ctx.lineTo(0, 0);
  ctx.strokeStyle = handleStrokeColor;
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(x1, y1, x2, y2, width, height);
  ctx.strokeStyle = '#ccc';
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.lineWidth = handleLineWidth;
  ctx.moveTo(width, height);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = handleStrokeColor;
  ctx.stroke();
  ctx.closePath();
};


/**
 * Gets an object that contains normalized (between 0 and 1) x1, y1, x2 and y2 numbers.
 * @return {Object}
 */
Bezierizer.prototype.getHandlePositions = function () {
  return $.extend({}, this._points);
};


/**
 * Sets the handle positions.  `points` does not require all of the points, just the ones you want to set.  `points` properties should represent the normalized values that the Bezier curve should have.
 * @param {Object} points An object that may contain numbers representing any or all of x1, y1, x2, and y2.
 */
Bezierizer.prototype.setHandlePositions = function (points) {
  $.extend(this._points, points);
  var handleContainerOuterHeight = this._$handleContainer.outerHeight(true);
  var handleContainerOuterWidth = this._$handleContainer.outerWidth(true);
  var handleOuterWidth = this._$handles.outerWidth(true);
  var handleOuterHeight = this._$handles.outerHeight(true);

  this._$handles.eq(0).css({
    left: Math.floor(
        this._points.x1 * (handleContainerOuterWidth - handleOuterWidth))
    ,top: Math.floor(
        this._points.y1 * (handleContainerOuterHeight - handleOuterHeight))
  });
  this._$handles.eq(1).css({
    left: Math.floor(
        this._points.x2 * (handleContainerOuterWidth - handleOuterWidth))
    ,top: Math.floor(
        this._points.y2 * (handleContainerOuterHeight - handleOuterHeight))
  });

  this._redraw();
};

return Bezierizer;

});
