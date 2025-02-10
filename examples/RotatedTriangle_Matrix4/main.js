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
function main() {
  let canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  gl = canvas.createWebGlContext();
  program = gl.createProgram(vs, fs);
  program.getProgramLocations();

  gl.background(0);

  var modelMatrix = new Matrix4();
  var ANGLE = 90.0;
  modelMatrix.setRotate(ANGLE, 0, 0, 1);
  gl.uniformMatrix4fv(program.u_ModelMatrix, false, modelMatrix.elements);

  let buffer = initVertexBuffers();
  
  gl.bindBuffers(buffer);

  gl.draw(buffer, gl.TRIANGLES);
}

function initVertexBuffers() {
  var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  return [gl.createAttribBuffer(program.a_Position, vertices, 2, gl.FLOAT)];
}
