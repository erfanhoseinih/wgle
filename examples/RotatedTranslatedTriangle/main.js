
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
   program = gl.createProgramWebGL(vs, fs);
   program.getProgramLocations();

   gl.background(0);


   var modelMatrix = new Matrix4();
   var ANGLE = 60.0; 
   var Tx = 0.5;  
   modelMatrix.setRotate(ANGLE, 0, 0, 1); 
   modelMatrix.translate(Tx, 0, 0); 
   gl.uniformMatrix4fv(program.u_ModelMatrix, false, modelMatrix.elements);
 



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
