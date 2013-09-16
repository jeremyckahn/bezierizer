// PRIVATE HELPER FUNCTIONS
//

/*!
 * @param {jQuery} $canvasContainer The element that contains the Bezierizer
 * DOM elements.
 * @param {jQuery} $handle The handle to compute X for.
 */
function getHandleX ($canvasContainer, $handle) {
  var handleX = parseInt($handle.css('left'), 10);
  return handleX / ($canvasContainer.width() - $handle.outerWidth(true));
}


/*!
 * @param {jQuery} $canvasContainer The element that contains the Bezierizer
 * DOM elements.
 * @param {jQuery} $handle The handle to compute Y for.
 */
function getHandleY ($canvasContainer, $handle) {
  var handleY = parseInt($handle.css('top'), 10);
  return handleY / ($canvasContainer.height() - $handle.outerHeight(true));
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
  this._$handles = this._$canvasContainer.find('.bezierizer-handle');

  var width = this._$canvas.width();
  var height = this._$canvas.height();
  this._ctx = this._$canvas[0].getContext('2d');
  var ctx = this._ctx;
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#f0f';
  this._$canvas[0].height = height;
  this._$canvas[0].width = width;

  this._$handles.dragon({
    within: this._$canvasContainer
  });
  this._$handles.eq(0).css({
    left: 0
    ,top: height * 0.5
  });
  this._$handles.eq(1).css({
    left: width
    ,top: height * 0.5
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
  var $canvasContainer = this._$canvasContainer;

  this._points = {
     x1: getHandleX($canvasContainer, this._$handles.eq(0))
    ,y1: getHandleY($canvasContainer, this._$handles.eq(0))
    ,x2: getHandleX($canvasContainer, this._$handles.eq(1))
    ,y2: getHandleY($canvasContainer, this._$handles.eq(1))
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
