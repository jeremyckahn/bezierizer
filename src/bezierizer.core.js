// PRIVATE HELPER FUNCTIONS
//

/*!
 * @param {jQuery} $handleContainer The element that contains the Bezierizer
 * DOM elements.
 * @param {jQuery} $handle The handle to compute X for.
 */
function getHandleX ($handleContainer, $handle) {
  var handleX = parseInt($handle.css('left'), 10);
  return handleX / $handleContainer.width();
}


/*!
 * @param {jQuery} $handleContainer The element that contains the Bezierizer
 * DOM elements.
 * @param {jQuery} $handle The handle to compute Y for.
 */
function getHandleY ($handleContainer, $handle) {
  var handleY = parseInt($handle.css('top'), 10);
  return handleY / $handleContainer.height();
}


/**
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
  var ctx = this._ctx;
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#f0f';
  this._$canvas[0].height = this._$canvas.height();
  this._$canvas[0].width = this._$canvas.width();

  this._$handles.dragon({
    within: this._$handleContainer
  });
  var handleContainerOuterHeight = this._$handleContainer.outerHeight(true);
  var handleContainerOuterWidth = this._$handleContainer.outerWidth(true);
  var handleOuterWidth = this._$handles.outerWidth(true);
  this._$handles.eq(0).css({
    left: handleOuterWidth / 2
    ,top: handleContainerOuterHeight * 0.5
  });
  this._$handles.eq(1).css({
    left: handleContainerOuterWidth - handleOuterWidth
    ,top: handleContainerOuterHeight * 0.5
  });

  this._initBindings();
  this._updateInternalStateFromDOM();
  this.redraw();
}


/*!
 * @private
 */
Bezierizer.prototype._initBindings = function () {
  this._$canvasContainer.on(
      'drag', '.bezierizer-handle', $.proxy(function (evt) {
    this._updateInternalStateFromDOM();
    this.redraw();
    this.$el.trigger('change');
  }, this));
};


/*!
 * @private
 */
Bezierizer.prototype._updateInternalStateFromDOM = function () {
  var $handleContainer = this._$canvasContainer;

  this._points = {
     x1: getHandleX($handleContainer, this._$handles.eq(0))
    ,y1: getHandleY($handleContainer, this._$handles.eq(0))
    ,x2: getHandleX($handleContainer, this._$handles.eq(1))
    ,y2: getHandleY($handleContainer, this._$handles.eq(1))
  };
};


/**
 * @return {Object} Contains normalized x1, y1, x2 and y2 numbers.
 */
Bezierizer.prototype.getHandlePositions = function () {
  return $.extend({}, this._points);
};


/**
 * @param {Object} points An object that may contain numbers representing any or all of x1, y1, x2, and y2.
 */
Bezierizer.prototype.setHandlePositions = function (points) {
  $.extend(this._points, points);

  this._$handles.eq(0).css({
    left: this._points.x1
    ,top: this._points.y1
  });
  this._$handles.eq(1).css({
    left: this._points.x2
    ,top: this._points.y2
  });

  this.redraw();
};


Bezierizer.prototype.redraw = function () {
  var points = this._points;
  var height = this._$canvas[0].height;
  var width = this._$canvas[0].width;
  var x1 = points.x1 * width;
  var y1 = points.y1 * height;
  var x2 = points.x2 * width;
  var y2 = points.y2 * height;

  var ctx = this._ctx;
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(0, 0);
  ctx.bezierCurveTo(x1, y1, x2, y2, width, height);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
};
