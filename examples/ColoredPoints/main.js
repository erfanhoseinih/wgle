
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
   gl_FragColor = u_FragColor;
}
`;

function main() {
   
   let canvas = document.createElement("canvas");
   document.body.appendChild(canvas)
   gl = canvas.createWebGlContext();
   program = gl.createProgramWebGL(vs, fs)
   program.getProgramLocations()
   gl.background(0)
   canvas.onmousedown = function (ev) { click(ev, gl, canvas, program.a_Position, program.u_FragColor) };

}


var g_points = [];
var g_colors = [];
function click(ev, gl, canvas, a_Position, u_FragColor) {
   var x = ev.clientX;
   var y = ev.clientY;
   var rect = ev.target.getBoundingClientRect();

   x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
   y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);


   g_points.push([x, y]);

   if (x >= 0.0 && y >= 0.0) {
      g_colors.push([1.0, 0.0, 0.0, 1.0]);
   } else if (x < 0.0 && y < 0.0) {
      g_colors.push([0.0, 1.0, 0.0, 1.0]);
   } else {
      g_colors.push([1.0, 1.0, 1.0, 1.0]);
   }

   gl.background(0)
   

   var len = g_points.length;
   for (var i = 0; i < len; i++) {
      var xy = g_points[i];
      var rgba = g_colors[i];

      gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      gl.drawArrays(gl.POINTS, 0, 1);
   }


}
