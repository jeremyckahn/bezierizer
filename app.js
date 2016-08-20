// require.js config file for demo index.html

requirejs.config({
  "baseUrl": "",
  "paths": {
    "bezierizer": "dist/bezierizer",
    "jquery": "dist/jquery",
    "jquery-dragon": "dist/jquery.dragon",
    "shifty": "dist/shifty"
  },
  "shim": {
    "jquery-dragon": ["jquery"]
  }
});

requirejs(["main"]);
