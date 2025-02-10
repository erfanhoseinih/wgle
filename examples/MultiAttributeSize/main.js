let vs = `
attribute vec4 a_Position;
attribute float a_PointSize;
void main(){
  gl_Position = a_Position;
  gl_PointSize = a_PointSize;
}
`;

let fs = `
void main(){
   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

let gl, program;
function main() {
  let canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  gl = canvas.createWebGlContext();
  program = gl.createProgram(vs, fs);
  program.getProgramLocations();

  gl.background(0);

  let points = createPoints();

  gl.bindBuffers(points);

  gl.draw(points, gl.POINTS);
}

function createPoints() {
  var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);

  var sizes = new Float32Array([10.0, 20.0, 30.0]);

  return [
    gl.createAttribBuffer(program.a_Position, vertices, 2, gl.FLOAT),
    gl.createAttribBuffer(program.a_PointSize, sizes, 1, gl.FLOAT),
  ];
}
