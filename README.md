# Bezierizer

__[API documentation](http://localhost:8080/dist/doc/src/bezierizer.core.js.html#Bezierizer)__

Sorry about the terrible name.  I pronounce it as "bez-ee-aye-i-zer."

This is a graphical widget intended to be used by
[Stylie](http://jeremyckahn.github.io/stylie/).  It's built pretty specifically
for Stylie, but if the community requests it (via the [issue
tracker](https://github.com/jeremyckahn/bezierizer/issues)), I am happy to make
changes to Bezierizer to be more flexible.

Bezierizer is inspired greatly by Lea Verou's
[cubic-bezier](http://cubic-bezier.com/) and Matthew Lein's
[Ceaser](http://matthewlein.com/ceaser/).

To use Bezierizer, just call the constructor and give it a container element to
inject itself into:

````javascript
var bezierizerEl = document.getElementById('bezierizer');
var bezierizer = new Bezierizer(bezierizerEl);

bezierizer.$el.on('change', function () {
  console.log(bezierizer.getHandlePositions());
});
````

Dragging either handle of the widget triggers the `change` event on the
`Bezierizer` instance's `$el` (which is the widget that is injected into the
container element).
