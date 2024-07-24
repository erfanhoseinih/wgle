
let vs = `
attribute vec4 a_Position;
uniform float u_CosB, u_SinB;
void main(){
   gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB; 
   gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB; 
   gl_Position.z = a_Position.z; 
   gl_Position.w = 1.0; 
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

   var ANGLE = 90.0; 
   var radian = Math.PI * ANGLE / 180.0;  
   var cosB = Math.cos(radian);
   var sinB = Math.sin(radian);
 
   gl.uniform1f(program.u_CosB, cosB);
   gl.uniform1f(program.u_SinB, sinB);
 


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
