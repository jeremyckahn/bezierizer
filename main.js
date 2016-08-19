// require.js module to drive demo index.html

define(['bezierizer','shifty'], function (Bezierizer,Tweenable) {
    var bezierizerTestEl = document.getElementById('bezierizer-test');
      var bezierizer = new Bezierizer(bezierizerTestEl);

      bezierizer.$el.on('change', function () {
        var handlePositions = bezierizer.getHandlePositions();
        Tweenable.setBezierFunction('testCurve',
            handlePositions.x1, handlePositions.y1,
            handlePositions.x2, handlePositions.y2);
      }).trigger('change');

      var tweenable = new Tweenable();
      var $tweenableEl = $('#tweenable');

      var $testCurveBtn = $('#test-curve');
      $testCurveBtn.on('click', function () {
        tweenable.stop();
        $tweenableEl.css('transform', 'translateX(0px)');
        tweenable.tween({
          from:  { x: 0   }
          ,to:   { x: 400 }
          ,duration: 1500
          ,easing: 'testCurve'
          ,step: function (step) {
            $tweenableEl.css('transform', 'translateX(' + step.x + 'px)');
          }
        });
      });
});