let gl, program;
let shapekit;

async function main() {
  let canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  gl = canvas.createWebGlContext();
  let frag = await loadShader("./frag.glsl");
  let vert = await loadShader("./vert.glsl");
  program = gl.createProgram(vert, frag).getProgramLocations();

  gl.uniform2f(program.u_resolution, gl.width, gl.height);

  let fbo = gl.createFramebuffer();
  gl.setFrameBuffer(fbo);

  gl.background(235);
  shapekit = new ShapesKit(
    SHAPE_GL_ARRAY,
    (x) => {
      return (x / gl.width) * 2 - 1;
    },
    (y) => {
      return (y / gl.height) * 2 - 1;
    }
  );

  for (let i = 1; i < 4; i++) {
    let fbo1 = gl.createFramebuffer();
    gl.setFrameBuffer(fbo1);

    gl.uniform1i(program.u_mode, 0);

    let viewport = drawViewPort(fbo.textures[0]);

    gl.bindBuffers(viewport);

    gl.draw(viewport, gl.TRIANGLES);

    gl.uniform1i(program.u_mode, 1);

    let rect0 = drawRect(130 + 30 * i, 130 + 30 * i, 100, 100, [
      1 - 0.25 * i,
      0.2 * i,
      1 - 0.25 * i,
      1,
    ]);

    rect0.push(gl.createTexture(fbo.textures[0], program.u_sampler, 0));

    gl.bindBuffers(rect0);

    gl.draw(rect0, gl.TRIANGLES);

    fbo = fbo1;
  }

  gl.setFrameBuffer(null);
  let viewport = drawViewPort(fbo.textures[0]);
  gl.bindBuffers(viewport);
  gl.uniform1i(program.u_mode, 0);
  gl.draw(viewport, gl.TRIANGLES);
}

function drawRect(x, y, w, h, c) {
  let verts = shapekit.rect(x, y, w, h);
  let colors = [];

  for (let i = 0; i < verts.length; i += 2) {
    colors.push(...c);
  }
  return [
    gl.createAttribObject(program.a_Position, verts, 2, gl.FLOAT),
    gl.createAttribObject(program.a_Color, colors, 4, gl.FLOAT),
  ];
}

function drawViewPort(texture) {
  let verts = shapekit.rect(0, 0, gl.width, gl.height);
  let texcoords = [];
  texcoords.push(0, 0);
  texcoords.push(1, 0);
  texcoords.push(1, 1);
  texcoords.push(1, 1);
  texcoords.push(0, 1);
  texcoords.push(0, 0);
  return [
    gl.createAttribObject(program.a_Position, verts, 2, gl.FLOAT),
    gl.createAttribObject(program.a_Texcoord, texcoords, 2, gl.FLOAT),
    gl.createTexture(texture, program.u_sampler, 0),
  ];
}
