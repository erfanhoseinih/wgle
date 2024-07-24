
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

function main() {

   let canvas = document.createElement("canvas");
   document.body.appendChild(canvas);
   gl = canvas.createWebGlContext();
   program = gl.createProgramWebGL(vs, fs);
   program.getProgramLocations();

   gl.background(0);


   let buf = initVertexBuffers();
   gl.implementBuffer(buf);

   var currentAngle = 0.0;

   var modelMatrix = new Matrix4();

   var tick = function () {
      currentAngle = animate(currentAngle);
      draw(buf.len, currentAngle, modelMatrix, program.u_ModelMatrix);
      requestAnimationFrame(tick, canvas);
   };
   tick();




}


function initVertexBuffers() {
   var vertices = new Float32Array([
      0, 0.5, -0.5, -0.5, 0.5, -0.5
   ]);
   return gl.createArrayBuffer(program.a_Position, vertices, 2, gl.FLOAT);
}


function draw(n, currentAngle, modelMatrix, u_ModelMatrix) {

   modelMatrix.setRotate(currentAngle, 0, 0, 1);
   modelMatrix.translate(0.35, 0, 0);

   gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);


   gl.drawArrays(gl.TRIANGLES, 0, n);
}


var g_last = Date.now();
function animate(angle) {

   var now = Date.now();
   var elapsed = now - g_last;
   g_last = now;

   var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
   return newAngle %= 360;
}
