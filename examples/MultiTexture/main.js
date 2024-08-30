
let vs = `
attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
void main(){
  gl_Position = a_Position;
  v_TexCoord = a_TexCoord;
}
`;

let fs = `
#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
varying vec2 v_TexCoord;
void main(){
   vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
   vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
   gl_FragColor = color0 * color1;
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

   let buf = initVertexBuffers();
   gl.implementBuffer(buf);

   initTextures()






}
 

function initVertexBuffers() {
   var vertices = new Float32Array([
      -0.5, 0.5,
      -0.5, -0.5,
      0.5, 0.5,
      0.5, -0.5,
   ]);

   var texCoords = new Float32Array([
      0.0, 1.0,
      0.0, 0.0,
      1.0, 1.0,
      1.0, 0.0,
   ]);

   return [gl.createArrayBuffer(program.a_Position, vertices, 2, gl.FLOAT),
   gl.createArrayBuffer(program.a_TexCoord, texCoords, 2, gl.FLOAT)];

}

function initTextures() {

   var texture0 = gl.createTexture();
   var texture1 = gl.createTexture();

   let image0 = document.createElement("img")
   image0.src = "./sky.jpg"

   let image1 = document.createElement("img")
   image1.src = "./circle.gif"

 
   image0.onload = () => {
      loadTexture(texture0, program.u_Sampler0, image0, 0);
   }
   image1.onload = () => {
      loadTexture(texture1, program.u_Sampler1, image1, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
   }



}

var g_texUnit0 = false, g_texUnit1 = false;
function loadTexture(texture, u_Sampler, image, texUnit) {

   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); 
 
   if (texUnit == 0) {
      gl.activeTexture(gl.TEXTURE0);
      g_texUnit0 = true;
   } else {
      gl.activeTexture(gl.TEXTURE1);
      g_texUnit1 = true;
   }
 
   gl.bindTexture(gl.TEXTURE_2D, texture);
 
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

   gl.uniform1i(u_Sampler, texUnit);   

}

