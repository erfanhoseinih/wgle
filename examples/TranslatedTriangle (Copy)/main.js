import WGLE from "./wgle.module.js";

let vs = `
attribute vec4 a_Position;
uniform vec4 u_Translation;
void main(){
  gl_Position = a_Position + u_Translation;
}
`;

let fs = `
void main(){
   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

let wgle, program;
function main() {
  let canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  wgle = new WGLE(canvas);

  program = wgle.createProgram(vs, fs);

  wgle.background(0);

  var Tx = 0.4,
    Ty = 0.4,
    Tz = 0.0;
  wgle.uniform4f(program.u_Translation, Tx, Ty, Tz, 0.0);

  let buf = initVertexBuffers();
  wgle.bindBuffers(buf);
  wgle.draw(buf, wgle.TRIANGLES);
 
}

function initVertexBuffers() {
  var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  return [wgle.createAttribObject(vertices, program.a_Position, 2, wgle.FLOAT)];
}

main();
