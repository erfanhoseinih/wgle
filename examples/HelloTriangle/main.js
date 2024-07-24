
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
   document.body.appendChild(canvas)
   gl = canvas.createWebGlContext();
   program = gl.createProgramWebGL(vs, fs)
   program.getProgramLocations()
   gl.background(0)
   let buf = initVertexBuffers();
   gl.implementBuffer(buf)
   gl.drawArrays(gl.TRIANGLES, 0, buf.len)
}


function initVertexBuffers() {
   var vertices = new Float32Array([
      0, 0.5, -0.5, -0.5, 0.5, -0.5
   ]);
   return gl.createArrayBuffer(program.a_Position, vertices, 2, gl.FLOAT);
}
