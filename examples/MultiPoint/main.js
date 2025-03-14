let vs = `
attribute vec4 a_Position;
void main(){
   gl_Position = a_Position;
   gl_PointSize = 10.0;
}
`;

let fs = `
precision mediump float;
uniform vec4 u_FragColor;
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

  gl.background(0);

  let points = createPoints();

  gl.bindBuffers(points);

  gl.draw(points, gl.POINTS);
}

function createPoints() {
  var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  return [gl.createAttribObject(vertices, program.a_Position, 2, gl.FLOAT)];
}
