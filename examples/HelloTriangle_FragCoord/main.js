let vs = `
attribute vec4 a_Position;
void main(){
  gl_Position = a_Position;
}
`;

let fs = `
precision mediump float;
uniform vec2 u_wh;
void main(){
   gl_FragColor = vec4(gl_FragCoord.x/u_wh.x, 0.0, gl_FragCoord.y/u_wh.y, 1.0);
}
`;

let gl, program;
function main() {
  let canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  gl = canvas.createWebGlContext();
  program = gl.createProgram(vs, fs);

  gl.background(0);

  gl.uniform2f(program.u_wh, gl.width, gl.height);

  // create data and buffers
  let triangle = createTriangle();

  // bind and active buffers
  gl.bindBuffers(triangle);

  // draw buffers
  gl.draw(triangle, gl.TRIANGLES);

  // disable buffers
  gl.disableBuffers(triangle);
}

function createTriangle() {
  var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  return [gl.createAttribObject(vertices, program.a_Position, 2, gl.FLOAT)];
}
