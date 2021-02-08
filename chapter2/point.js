// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute float a_PoistionSize;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0;
  }
`;

var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`
function loadShader(gl, type, source) {
  // Create shader object
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log('unable to create shader');
    return null;
  }

  // Set the shader program
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the result of compilation
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
function createProgram(gl, vshader, fshader) {
  // Create shader object
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}
function initShaders(gl, vshader, fshader) {
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('Failed to create program');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}

  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = canvas.getContext('webgl');

   // Initialize shaders
   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  var a_PoistionSize = gl.getAttribLocation(gl.program, 'a_PoistionSize')
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

  gl.vertexAttrib3f(a_Position, 0.0, 0, 0.0, 0)
  // gl.vertexAttrib1f(a_PoistionSize, 10.0)
  canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position); };
  var g_points = [];
  var g_colors = [];
  function click(e, gl, canvas, a_Position) {
    var x = e.clientX;
    var y = e.clientY;
    var rect = e.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width/2) / (canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    g_points.push([x, y]);
    if(x >= 0 && y >= 0) {
      g_colors.push([1.0, 0.0, 0.0, 1.0]);
    } else if(x < 0.0 && y < 0.0) {
      g_colors.push([0.0, 1.0, 0.0, 1.0]);
    } else if(x > 0.0 && y < 0.0) {
      g_colors.push([0.0, 1.0, 1.0, 1.0]);
    } else {
      g_colors.push([0.0, 0.0, 1.0, 1.0]);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_points.length;
    for(var i = 0; i < len; i += 1) {
      var rgb = g_colors[i];
      // Pass the position of a point to a_Position variable
      gl.vertexAttrib3f(a_Position, g_points[i][0], g_points[i][1], 0.0);
      gl.uniform4f(u_FragColor, rgb[0], rgb[1], rgb[2], rgb[3])
  
      // Draw
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }

  // Set clear color
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a point
  var len = g_points.length;
  for(var i = 0; i < len; i += 2) {
    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);

    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }