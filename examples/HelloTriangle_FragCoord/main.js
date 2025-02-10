let vs = `
attribute vec4 a_Position;
void main(){
  gl_Position = a_Position;
}
`;

let fs = `
precision mediump float;
uniform float u_Width;
uniform float u_Height;
void main(){
   gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);
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

  gl.uniform1f(program.u_Width, width);
  gl.uniform1f(program.u_Height, height);

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
  return [gl.createAttribBuffer(program.a_Position, vertices, 2, gl.FLOAT)];
}
