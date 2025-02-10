let vs = `
attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
void main(){
  gl_Position = u_ModelMatrix * a_Position;
}
`;

let fs = `
void main(){
   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

let gl, program;

var ANGLE_STEP = 45.0;
let triangle;
var currentAngle = 0.0;

var modelMatrix = new Matrix4();

function main() {
  let canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  gl = canvas.createWebGlContext();
  program = gl.createProgram(vs, fs);
  program.getProgramLocations();

  gl.background(0);

  triangle = createTriangle();

  modelMatrix.setRotate(currentAngle, 0, 0, 1);
  modelMatrix.translate(0.35, 0, 0);

  gl.uniformMatrix4fv(program.u_ModelMatrix, false, modelMatrix.elements);

  gl.bindBuffers(triangle);

  gl.draw(triangle, gl.TRIANGLES, 0, gl.DRAW_ALL);
}

function animation() {
  currentAngle = (currentAngle + (ANGLE_STEP * 30) / 1000.0) % 360;
  modelMatrix.setRotate(currentAngle, 0, 0, 1);
  modelMatrix.translate(0.35, 0, 0);

  gl.uniformMatrix4fv(program.u_ModelMatrix, false, modelMatrix.elements);

  gl.draw(triangle, gl.TRIANGLES, 0, gl.DRAW_ALL);
}

function createTriangle() {
  var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  return [gl.createAttribBuffer(program.a_Position, vertices, 2, gl.FLOAT)];
}
