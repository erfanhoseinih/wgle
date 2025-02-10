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
async function main() {
  let canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  gl = canvas.createWebGlContext();
  program = gl.createProgram(vs, fs);
  program.getProgramLocations();

  gl.background(0);

  let image0 = await loadImage("./sky.jpg");
  let image1 = await loadImage("./circle.gif");

  let buffer = initRectImages(image0, image1);

  gl.bindBuffers(buffer);

  gl.draw(buffer, gl.TRIANGLE_STRIP);

  gl.disableBuffers(buffer);
}

function initRectImages(image0, image1) {
  var vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5]);
  var texCoords = new Float32Array([0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0]);

  return [
    gl.createAttribBuffer(program.a_Position, vertices, 2, gl.FLOAT),
    gl.createAttribBuffer(program.a_TexCoord, texCoords, 2, gl.FLOAT),
    gl.createTexture(image0, program.u_Sampler0, 0),
    gl.createTexture(image1, program.u_Sampler1, 1),
  ];
}
