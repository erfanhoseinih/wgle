import { defineWGLEConstants } from "./utils/constants.js";

const glslAttriTypeStrings = [
  "attribute bool",
  "attribute int",
  "attribute float",

  "attribute vec2",
  "attribute vec3",
  "attribute vec4",

  "attribute ivec2",
  "attribute ivec3",
  "attribute ivec4",

  "attribute bvec2",
  "attribute bvec3",
  "attribute bvec4",

  "attribute mat2",
  "attribute mat3",
  "attribute mat4",
];

const glslUniTypeStrings = [
  "uniform bool",
  "uniform int",
  "uniform float",

  "uniform vec2",
  "uniform vec3",
  "uniform vec4",

  "uniform ivec2",
  "uniform ivec3",
  "uniform ivec4",

  "uniform bvec2",
  "uniform bvec3",
  "uniform bvec4",

  "uniform mat2",
  "uniform mat3",
  "uniform mat4",

  "uniform sampler2D",
  "uniform samplerCube",
];

class WGLE {
  constructor(canvas, ...args) {
    function createWebGlContext(canvas, ...args) {
      var width_Context, height_Context;
      var webgl_versions = [
        "webgl2",
        "webgl",
        "experimental-webgl",
        "webkit-3d",
        "moz-webgl",
      ];
      var context = null;
      var attribs_Context = {};

      args.forEach((e) => {
        if (typeof e == "string") {
          if (webgl_versions.indexOf(e) < 0) {
            let er = new Error("Failed create webgl context. wrong version! ");
            er.stack = er.stack.slice(
              er.stack.indexOf("\n") + 1,
              er.stack.length
            );
            er.stack = er.stack.slice(
              er.stack.indexOf("\n") + 1,
              er.stack.length
            );
            throw er;
          } else {
            webgl_versions.unshift(webgl_versions[webgl_versions.indexOf(e)]);
          }
        } else if (e.constructor.name == "Object") {
          attribs_Context = e;
        }
      });

      if (Number.isInteger(args[0]) && Number.isInteger(args[1])) {
        width_Context = parseInt(args[0]);
        height_Context = parseInt(args[1]);
      } else {
        width_Context = height_Context = 500;
      }
      canvas.width = width_Context;
      canvas.height = height_Context;
      for (var ii = 0; ii < webgl_versions.length; ++ii) {
        try {
          context = canvas.getContext(webgl_versions[ii], attribs_Context);
        } catch (e) {}
        if (context) {
          break;
        }
      }

      context.width = canvas.width;
      context.height = canvas.height;

      return context;
    }

    this.gl = createWebGlContext(canvas, ...args);
    console.log(this.gl);
    this.canvas = canvas;
  }

  get getGLContext() {
    return this.gl || this;
  }

  createProgram(vertCode, fragCode) {
    const gl = this.getGLContext;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);

    gl.shaderSource(vertexShader, vertCode);
    gl.compileShader(vertexShader);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragCode);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      throw (
        ("Vertex shader compilation error:", gl.getShaderInfoLog(vertexShader))
      );
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      throw (
        ("Fragment shader compilation error:",
        gl.getShaderInfoLog(fragmentShader))
      );
    }

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    program.vertCode = vertCode.split("\n").join("").split(";");
    program.fragCode = fragCode.split("\n").join("").split(";");

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw `Could not compile WebGL program. \n\n${info}`;
    }

    var getLocString = (c, s) => {
      let startStr;
      let endStr;
      if (c.indexOf(s) > -1) {
        startStr = c.indexOf(s);
        if (c.indexOf("[") > -1) {
          endStr = c.indexOf("[");
        } else {
          endStr = c.length;
        }
        let result = c.slice(startStr + s.length + 1, endStr);
        let strings = result.split(",");
        strings.forEach((e, i) => {
          strings[i] = strings[i].trim();
        });
        return strings;
      }
    };

    let codeVertFragLocations = vertCode.concat(fragCode);
    codeVertFragLocations = codeVertFragLocations
      .split("\n")
      .join("")
      .split(";");

    let attribLocations = [];
    let uniformLocations = [];

    for (let ik = 0; ik < codeVertFragLocations.length; ik++) {
      glslAttriTypeStrings.forEach((e) => {
        let locStrA = getLocString(codeVertFragLocations[ik], e);
        if (locStrA) attribLocations.push(...locStrA);
      });
      glslUniTypeStrings.forEach((e) => {
        let locStrU = getLocString(codeVertFragLocations[ik], e);
        if (locStrU) uniformLocations.push(...locStrU);
      });
    }

    attribLocations.forEach((e) => {
      program[e] = gl.getAttribLocation(program, e);
    });
    uniformLocations.forEach((e) => {
      program[e] = gl.getUniformLocation(program, e);
    });

    gl.useProgram(program);

    return program;
  }

  draw(buffers = [], mode = this.TRIANGLES, first = 0, count = this.DRAW_ALL) {
    // check buffer argument is array
    if (!Array.isArray(buffers)) {
      throw "first arguments is not array!";
    } else if (buffers.length > 0) {
      if (count == this.DRAW_ALL) {
        count = buffers[0].length;
      }
    }
    // draw buffers
    this.drawArrays(mode, first, count);
  }

  disableProgram(program) {
    this.useProgram(null);

    for (let i = 0; i < this.getParameter(this.MAX_TEXTURE_IMAGE_UNITS); i++) {
      // gl.activeTextureWebGL(gl.TEXTURE0 + i);
      // gl.bindBufferWebGL(gl.TEXTURE_2D, null);
    }

    this.bindBufferWebGL(this.ARRAY_BUFFER, null);
    this.bindBufferWebGL(this.ELEMENT_ARRAY_BUFFER, null);

    this.bindVertexArray?.(null);

    this.deleteProgram(program);
  }

  disableBuffers(buffers) {
    buffers.forEach((b) => {
      if (b instanceof WebGLTexture) {
        this.bindTexture(this.TEXTURE_2D, null);
      } else {
        this.disableVertexAttribArray(b.location);
      }
    });
  }

  deleteBuffers(buffers) {
    buffers.forEach((b) => {
      if (b instanceof WebGLTexture) {
        this.deleteTexture(b);
      } else {
        this.deleteBuffer(b.buffer);
        this.bindBufferWebGL(this.ARRAY_BUFFER, null);
        this.bindBufferWebGL(this.ELEMENT_ARRAY_BUFFER, null);
      }
    });
  }

  bindBuffers(buffers) {
    buffers.forEach((b) => {
      this.bindBuffer(b);
    });
  }

  bindBuffer(b) {
    if (b instanceof WebGLTexture) {
      this.activeTexture(b);
    } else {
      if (b.buffer == null) {
        b.initBuffer(this.gl);
      }
      this.gl.bindBuffer(this.ARRAY_BUFFER, b.buffer);
      this.gl.vertexAttribPointer(b.location, b.num, this.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(b.location);
    }
  }

  createAttribObject(data, location, num, type) {
    let obj = new Object();
    obj.data = data;
    obj.location = location;
    obj.num = num;
    obj.type = type;
    obj.length = parseInt(data.length / num);
    obj.buffer = null;
    obj.initBuffer = function (gl) {
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(this.data),
        gl.STATIC_DRAW
      );
    };
    return obj;
  }

  initBufferObjects(obj) {
    for (let i = 0; i < obj.length; i++) {
      obj[i].initBuffer(this);
    }
  }

  concatAttribObject(o0, o1) {
    var checkSameObject = function (o0, o1) {
      let maxLenLoc = Math.max(o0.length, o1.length);
      let sameLocNum = 0;
      for (let i = 0; i < o0.length; i++) {
        for (let j = 0; j < o1.length; j++) {
          if (o0[i].location == o1[j].location) {
            sameLocNum++;
          }
        }
      }

      if (sameLocNum != maxLenLoc) {
        console.error("Objects not same location");
      }
    };

    checkSameObject(o0, o1);
    // const obj0Len = o0.length;
    for (let i = 0; i < o0.length; i++) {
      for (let j = 0; j < o1.length; j++) {
        if (o0[i].location == o1[j].location) {
          o0[i].data.push(...o1[j].data);
          o0[i].length = parseInt(o0[i].data.length / o0[i].num);
        }
      }
    }

    return o0;
  }
  concatAttribObjects(objs) {
    let attribObject = objs[0];
    for (let i = 1; i < objs.length; i++) {
      attribObject = this.concatAttribObject(attribObject, objs[i]);
    }
    return attribObject;
  }
  createAttribBuffer(data, location, num, type) {
    let obj = new Object();
    obj.buffer = this.createBuffer();
    obj.data = data;
    this.bindBufferWebGL(this.ARRAY_BUFFER, obj.buffer);
    this.bufferData(
      this.ARRAY_BUFFER,
      new Float32Array(data),
      this.STATIC_DRAW
    );
    obj.location = location;
    obj.num = num;
    obj.type = type;
    obj.length = parseInt(data.length / num);
    return obj;
  }

  concatAttribBuffer(b0, b1) {
    if (b0.loc != b1.loc) {
      throw "buffers not same location";
    }
  }

  background(r = 0, g = r, b = r, a = 255) {
    const gl = this.getGLContext;
    let red, blue, green, alpha;

    if (gl.isEnabled(gl.BLEND)) {
      this.canvas.style.backgroundColor = `rgba( ${r} , ${g} , ${b} ,1.0)`;
    } else {
      this.canvas.style.backgroundColor = `rgba( ${0} , ${0} , ${0} ,1.0)`;
    }

    if (r.length == 3 || r.length == 4) {
      red = r[0] / 255;
      blue = r[1] / 255;
      green = r[2] / 255;
      r.length == 4 ? (alpha = r[3] / 255) : (alpha = 1);
    } else {
      red = r / 255;
      blue = g / 255;
      green = b / 255;
      alpha = a / 255;
    }

    gl.clearColor(red, blue, green, alpha);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  setFrameBuffer(fbo_gl) {
    if (fbo_gl == undefined && fbo_gl != null) {
      throw new SyntaxError("fbo is not selected");
    }
    this.bindFramebuffer(this.FRAMEBUFFER, fbo_gl);
    if (arguments.length > 1) {
      this.viewport(arguments[1], arguments[2], arguments[3], arguments[4]);
    }
  }

  createFramebuffer(options = {}) {
    let {
      width = this.width,
      height = this.height,
      useDepthTexture = false,
      useStencil = false,
      numColorAttachments = 1,
    } = options;

    let frameBuffer = this.createFramebufferWebGL();
    this.bindFramebuffer(this.FRAMEBUFFER, frameBuffer);

    frameBuffer.textures = [];

    for (let i = 0; i < numColorAttachments; i++) {
      let texture = this.createTextureWebGL();
      this.bindTexture(this.TEXTURE_2D, texture);
      this.texImage2D(
        this.TEXTURE_2D,
        0,
        this.RGBA,
        width,
        height,
        0,
        this.RGBA,
        this.UNSIGNED_BYTE,
        null
      );
      this.texParameteri(
        this.TEXTURE_2D,
        this.TEXTURE_MIN_FILTER,
        this.NEAREST
      );
      this.texParameteri(
        this.TEXTURE_2D,
        this.TEXTURE_MAG_FILTER,
        this.NEAREST
      );
      this.texParameteri(
        this.TEXTURE_2D,
        this.TEXTURE_WRAP_S,
        this.CLAMP_TO_EDGE
      );
      this.texParameteri(
        this.TEXTURE_2D,
        this.TEXTURE_WRAP_T,
        this.CLAMP_TO_EDGE
      );
      this.framebufferTexture2D(
        this.FRAMEBUFFER,
        this.COLOR_ATTACHMENT0 + i,
        this.TEXTURE_2D,
        texture,
        0
      );
      frameBuffer.textures.push(texture);
    }

    let depthStencilBuffer;
    if (useDepthTexture) {
      let depthTexture = this.createTextureWebGL();
      this.bindTexture(this.TEXTURE_2D, depthTexture);
      this.texImage2D(
        this.TEXTURE_2D,
        0,
        this.DEPTH_COMPONENT24,
        width,
        height,
        0,
        this.DEPTH_COMPONENT,
        this.UNSIGNED_INT,
        null
      );
      this.texParameteri(
        this.TEXTURE_2D,
        this.TEXTURE_MIN_FILTER,
        this.NEAREST
      );
      this.texParameteri(
        this.TEXTURE_2D,
        this.TEXTURE_MAG_FILTER,
        this.NEAREST
      );
      this.texParameteri(
        this.TEXTURE_2D,
        this.TEXTURE_WRAP_S,
        this.CLAMP_TO_EDGE
      );
      this.texParameteri(
        this.TEXTURE_2D,
        this.TEXTURE_WRAP_T,
        this.CLAMP_TO_EDGE
      );
      this.framebufferTexture2D(
        this.FRAMEBUFFER,
        this.DEPTH_ATTACHMENT,
        this.TEXTURE_2D,
        depthTexture,
        0
      );
      frameBuffer.depthTexture = depthTexture;
    } else {
      depthStencilBuffer = this.createRenderbuffer();
      this.bindRenderbuffer(this.RENDERBUFFER, depthStencilBuffer);
      this.renderbufferStorage(
        this.RENDERBUFFER,
        useStencil ? this.DEPTH_STENCIL : this.DEPTH_COMPONENT16,
        width,
        height
      );
      this.framebufferRenderbuffer(
        this.FRAMEBUFFER,
        useStencil ? this.DEPTH_STENCIL_ATTACHMENT : this.DEPTH_ATTACHMENT,
        this.RENDERBUFFER,
        depthStencilBuffer
      );
    }

    let status = this.checkFramebufferStatus(this.FRAMEBUFFER);
    if (status !== this.FRAMEBUFFER_COMPLETE) {
      console.error("Framebuffer is incomplete: ", status);
      return null;
    }

    this.bindFramebuffer(this.FRAMEBUFFER, null);
    // this.bindTexture(this.TEXTURE_2D, null);
    // this.bindRenderbuffer(this.RENDERBUFFER, null);

    return frameBuffer;
  }

  checkProgramLocation(v) {
    if (v == undefined || v == null || v < 0) {
      let e = new Error("Failed to get the storage location");
      e.stack = e.stack.slice(e.stack.indexOf("\n") + 1, e.stack.length);
      e.lineNumber = null;
      let filename = e.stack.slice(0, e.stack.indexOf("\n") + 1);
      let indexStr = filename.search(".js");
      while (!(filename[indexStr] == "/")) {
        indexStr--;
      }
      e.fileName = filename.slice(5, filename.length);
      throw e;
    } else {
      return true;
    }
  }

  createTexture(image, textureLocation, texUnit = 0) {
    let texture;
    if (
      image instanceof HTMLImageElement ||
      image instanceof HTMLCanvasElement ||
      image instanceof HTMLVideoElement ||
      image instanceof ImageBitmap
    ) {
      texture = this.createTextureWebGL();
      this.bindTexture(this.TEXTURE_2D, texture);
      this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, 1);
      this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.LINEAR);
      this.texImage2D(
        this.TEXTURE_2D,
        0,
        this.RGBA,
        this.RGBA,
        this.UNSIGNED_BYTE,
        image
      );
    } else if (image instanceof WebGLTexture) {
      texture = image;
    }

    texture.texUnit = texUnit;
    texture.location = textureLocation;
    return texture;
  }

  activeTexture(texture) {
    this.activeTextureWebGL(this.TEXTURE0 + texture.texUnit);
    this.bindTexture(this.TEXTURE_2D, texture);
    this.uniform1i(texture.location, texture.texUnit);
  }

  resizeCanvas(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.width = w;
    this.height = h;
    this.viewport(0, 0, w, h);
  }

  saveCanvas(name) {
    const link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);
    link.href = this.canvas.toDataURL("image/jpeg");
    link.download = name;
    link.click();
  }

  normalizeVertexForglsl(v, step) {
    let vert = v;
    for (let jkm = 0; jkm < vert.length; jkm += step) {
      if (step == 2) {
        vert[jkm] = (vert[jkm] / width) * 2 - 1;
        vert[jkm + 1] = (vert[jkm + 1] / height) * 2 - 1;
      } else if (step == 3) {
        vert[jkm] = (vert[jkm] / width) * 2 - 1;
        vert[jkm + 1] = (vert[jkm + 1] / height) * 2 - 1;
        vert[jkm + 2] = vert[jkm + 2] / (((height + width) / 2) * 2) - 1;
      } else if (step == 4) {
        vert[jkm] = (vert[jkm] / width) * 2 - 1;
        vert[jkm + 1] = (vert[jkm + 1] / height) * 2 - 1;
        vert[jkm + 2] = vert[jkm + 2] / (width * 2) - 1;
      }
    }
    return vert;
  }

  normalizeColorForglsl(v, step) {
    let vert = v;
    for (let jkm = 0; jkm < vert.length; jkm += step) {
      for (let ikm = 0; ikm < step; ikm++) {
        vert[jkm + ikm] = vert[jkm + ikm] / 255;
      }
    }
    return vert;
  }

  uniform1f(location, x) {
    this.gl.uniform1f(location, x);
  }

  uniform2f(location, x, y) {
    this.gl.uniform2f(location, x, y);
  }

  uniform3f(location, x, y, z) {
    this.gl.uniform3f(location, x, y, z);
  }

  uniform4f(location, x, y, z, w) {
    this.gl.uniform4f(location, x, y, z, w);
  }

  uniform1i(location, x) {
    this.gl.uniform1i(location, x);
  }

  uniform2i(location, x, y) {
    this.gl.uniform2i(location, x, y);
  }

  uniform3i(location, x, y, z) {
    this.gl.uniform3i(location, x, y, z);
  }

  uniform4i(location, x, y, z, w) {
    this.gl.uniform4i(location, x, y, z, w);
  }

  uniform1fv(location, value) {
    this.gl.uniform1fv(location, value);
  }

  uniform2fv(location, value) {
    this.gl.uniform2fv(location, value);
  }

  uniform3fv(location, value) {
    this.gl.uniform3fv(location, value);
  }

  uniform4fv(location, value) {
    this.gl.uniform4fv(location, value);
  }

  uniform1iv(location, value) {
    this.gl.uniform1iv(location, value);
  }

  uniform2iv(location, value) {
    this.gl.uniform2iv(location, value);
  }

  uniform3iv(location, value) {
    this.gl.uniform3iv(location, value);
  }

  uniform4iv(location, value) {
    this.gl.uniform4iv(location, value);
  }

  uniformMatrix2fv(location, transpose, value) {
    this.gl.uniformMatrix2fv(location, transpose, value);
  }

  uniformMatrix3fv(location, transpose, value) {
    this.gl.uniformMatrix3fv(location, transpose, value);
  }

  uniformMatrix4fv(location, transpose, value) {
    this.gl.uniformMatrix4fv(location, transpose, value);
  }

  loadShader = async function (fileName) {
    function headerGlsl(headerString, headerFileName, startHeader, endHeader) {
      this.headerString = headerString;
      this.headerFileName = headerFileName;
      this.startHeader = startHeader;
      this.endHeader = endHeader;
    }

    function insertAt(original, insert, index) {
      return original.slice(0, index) + insert + original.slice(index);
    }

    let loadOtherGlslHeader = async function (shaderString) {
      let headers = [];

      let headersFound = Array.from(shaderString.matchAll("#include"));
      for (let i = 0; i < headersFound.length; i++) {
        let startHeader = headersFound[i].index;

        let endHeader = startHeader;
        let spaceCharCounter = 0;
        let currentChar = shaderString[startHeader];

        while (spaceCharCounter < 2) {
          if (currentChar == " " || currentChar == "\n") {
            spaceCharCounter++;
          }
          endHeader++;
          currentChar = shaderString[endHeader];
        }
        let headerString = shaderString.slice(startHeader, endHeader);

        let headerFileName = headerString
          .replaceAll("#include", "")
          .replaceAll('"', "")
          .replaceAll("\n", "")
          .replaceAll(" ", "");

        headers.push(
          new headerGlsl(headerString, headerFileName, startHeader, endHeader)
        );
      }

      for (let i = 0; i < headers.length; i++) {
        let data = await loadFile(headers[i].headerFileName);
        shaderString = shaderString.replace(headers[i].headerString, "\n");
        shaderString = insertAt(shaderString, data, headers[i].startHeader);
      }

      return shaderString;
    };

    let loadFile = async function (fileName) {
      let data;
      const response = await fetch(fileName);
      if (!response.ok) throw new Error(response.status);
      let shaderContents = async function () {
        return await response.text();
      };
      await shaderContents().then((res) => {
        data = res;
      });
      return data;
    };

    let data = await loadFile(fileName);

    data = loadOtherGlslHeader(data);

    return data;
  };

  loadImage(src) {
    return new Promise((resolve, reject) => {
      let img = document.createElement("img");
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  }
}

defineWGLEConstants(WGLE.prototype);

export default WGLE;
