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
}
