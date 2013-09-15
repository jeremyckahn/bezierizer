function getHandleX (bezierizer, $handle) {
  var handleX = parseInt($handle.css('left'), 10);
  return handleX / (
      bezierizer.$canvasContainer.width() - $handle.outerWidth(true));
}


function getHandleY (bezierizer, $handle) {
  var handleY = parseInt($handle.css('top'), 10);
  return handleY / (
      bezierizer.$canvasContainer.height() - $handle.outerHeight(true));
}


function Bezierizer (container) {
  this.$el = $(container);
  this.$el.append($(HTML_TEMPLATE));

  this.$canvasContainer = this.$el.find('.bezierizer-canvas-container');
  this.$canvas = this.$canvasContainer.find('canvas');
  this.$handles = this.$canvasContainer.find('.bezierizer-handle');
  this.$readout = this.$canvasContainer.find('.bezierizer-coord-readout');

  this.$canvas[0].height = this.$canvas.height();
  this.$canvas[0].width = this.$canvas.width();
  this.$handles.dragon({
    within: this.$canvasContainer
  });

  this.initBindings();
}


Bezierizer.prototype.initBindings = function () {
  this.$canvasContainer.on('drag', '.bezierizer-handle',
      $.proxy(function (evt) {
    //console.log(this.getHandlePositions())
  }, this));
};


Bezierizer.prototype.getHandlePositions = function () {
  return {
    x1: getHandleX(this, this.$handles.eq(0))
    ,y1: getHandleY(this, this.$handles.eq(0))
    ,x2: getHandleX(this, this.$handles.eq(1))
    ,y2: getHandleY(this, this.$handles.eq(1))
  };
};
