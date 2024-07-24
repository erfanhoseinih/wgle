
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

let gl, program;
function main() {

   let canvas = document.createElement("canvas");
   document.body.appendChild(canvas);
   gl = canvas.createWebGlContext();
   program = gl.createProgramWebGL(vs, fs);
   program.getProgramLocations();

 
   gl.background(0);

   
   var Tx = 0.5, Ty = 0.5, Tz = 0.0;
   gl.uniform4f(program.u_Translation, Tx, Ty, Tz, 0.0);


   let buf = initVertexBuffers();
   gl.implementBuffer(buf);
   gl.drawArrays(gl.TRIANGLES, 0, buf.len);

}


function initVertexBuffers() {
   var vertices = new Float32Array([
      0, 0.5, -0.5, -0.5, 0.5, -0.5
   ]);
   return gl.createArrayBuffer(program.a_Position, vertices, 2, gl.FLOAT);
}
