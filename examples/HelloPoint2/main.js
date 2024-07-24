
let vs = `

attribute vec4 a_Position;
void main(){
   gl_Position = a_Position;
   gl_PointSize = 10.0;
}

`;

let fs = `
void main(){
   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

function main() {
   let canvas = document.createElement("canvas");
   document.body.appendChild(canvas)
   gl = canvas.createWebGlContext();
   program = gl.createProgramWebGL(vs, fs)
   program.getProgramLocations()

   gl.background(0)
   gl.vertexAttrib3f(program.a_Position, 0.0, 0.0, 0.0);
   gl.drawArrays(gl.POINTS, 0, 1);
}