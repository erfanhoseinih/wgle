let vs = `
attribute vec4 a_Position;
uniform mat4 u_xformMatrix;
void main(){
  gl_Position = u_xformMatrix * a_Position;
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

  gl.background(0);

  var Sx = 1.0,
    Sy = 1.5,
    Sz = 1.0;
  var xformMatrix = new Float32Array([
    Sx,
    0.0,
    0.0,
    0.0,
    0.0,
    Sy,
    0.0,
    0.0,
    0.0,
    0.0,
    Sz,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
  ]);
  gl.uniformMatrix4fv(program.u_xformMatrix, false, xformMatrix);

  let buf = initVertexBuffers();

  gl.bindBuffers(buf);

  gl.draw(buf, gl.TRIANGLES);
}

function initVertexBuffers() {
  var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  return [gl.createAttribObject(vertices, program.a_Position, 2, gl.FLOAT)];
}
