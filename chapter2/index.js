  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = canvas.getContext('webgl');

  // Set clear color
  gl.clearColor(0, 0, 1.0, .6);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);