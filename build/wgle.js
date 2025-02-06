"use strict";
let width, height;

HTMLCanvasElement.prototype.createWebGlContext = function (...args) {
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
        er.stack = er.stack.slice(er.stack.indexOf("\n") + 1, er.stack.length);
        er.stack = er.stack.slice(er.stack.indexOf("\n") + 1, er.stack.length);
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
  this.width = width_Context;
  this.height = height_Context;
  for (var ii = 0; ii < webgl_versions.length; ++ii) {
    try {
      context = this.getContext(webgl_versions[ii], attribs_Context);
    } catch (e) {}
    if (context) {
      break;
    }
  }
  width = this.width;
  height = this.height;

  return context;
};
let glslAttriTypeStrings = [
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
let glslUniTypeStrings = [
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

const WebGLContextUtils = {
  createProgramWebGL: function (vertCode, fragCode) {
    var vertexShader = this.createShader(this.VERTEX_SHADER);

    this.shaderSource(vertexShader, vertCode);
    this.compileShader(vertexShader);
    var fragmentShader = this.createShader(this.FRAGMENT_SHADER);
    this.shaderSource(fragmentShader, fragCode);
    this.compileShader(fragmentShader);

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

    let program = this.createProgram();
    this.attachShader(program, vertexShader);
    this.attachShader(program, fragmentShader);

    this.linkProgram(program);
    program.vertCode = vertCode.split("\n").join("").split(";");
    program.fragCode = fragCode.split("\n").join("").split(";");

    if (!this.getProgramParameter(program, this.LINK_STATUS)) {
      const info = this.getProgramInfoLog(program);
      throw `Could not compile WebGL program. \n\n${info}`;
    }

    WebGLProgram.prototype.getProgramLocations = function () {
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

      return program;
    };

    this.useProgram(program);

    return program;
  },

  drawBuffers: function (buffers, mode, disableImplements, disablePointers) {
    // implement buffers
    if (disableImplements) {
      buffers.forEach((e) => {
        this.implementBuffer(e);
      });
    }

    // implement texture

    // draw buffers
    this.drawArrays(mode, 0, buffers[0].len);

    // disable and unbind buffers
    if (disablePointers) {
      // buffers.forEach((e) => {
      //   gl.deleteBuffer(e.buffer);
      // });
      buffers.forEach((e) => {
        this.disableVertexAttribArray(e.loc);
      });
    }
  },
  
  disableProgramPointers: function (program){
    let programPointers =  Object.values(program);
    programPointers.forEach((e)=>{
      if(Number.isInteger(e)){
        this.disableVertexAttribArray(e);
      }
    })

  },
  disablePointers: function (buffers) {
    buffers.forEach((e) => {
      this.disableVertexAttribArray(e.loc);
    });
  },

  implementBuffers: function (buffers) {
    buffers.forEach((e) => {
      this.bindBuffer(this.ARRAY_BUFFER, e.buffer);
      this.vertexAttribPointer(e.loc, e.num, this.FLOAT, false, 0, 0);
      this.enableVertexAttribArray(e.loc);
    });
  },

  implementBuffer: function (buffer) {
    this.bindBuffer(this.ARRAY_BUFFER, buffer.buffer);
    this.vertexAttribPointer(buffer.loc, buffer.num, this.FLOAT, false, 0, 0);
    this.enableVertexAttribArray(buffer.loc);
  },

  createAttribObject: function (loc, data, num, type) {
    let obj = new Object();
    obj.data = new Float32Array(data);
    obj.loc = loc;
    obj.num = num;
    obj.type = type;
    obj.len = parseInt(data.length / num);
    obj.buffer = null;
    obj.initBuffer = function (gl) {
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.STATIC_DRAW);
    };
    return obj;
  },

  initBufferObjects: function (obj) {
    for (let i = 0; i < obj.length; i++) {
      obj[i].initBuffer(this);
    }
  },

  concatAttribObject: function (o0, o1) {
    var checkSameObject = function (o0, o1) {
      let maxLenLoc = Math.max(o0.length, o1.length);
      let sameLocNum = 0;
      for (let i = 0; i < o0.length; i++) {
        for (let j = 0; j < o1.length; j++) {
          if (o0[i].loc == o1[j].loc) {
            sameLocNum++;
          }
        }
      }

      if (sameLocNum != maxLenLoc) {
        console.error("Objects not same location");
      }
    };

    checkSameObject(o0, o1);
    for (let i = 0; i < o0.length; i++) {
      for (let j = 0; j < o1.length; j++) {
        if (o0[i].loc == o1[j].loc) {
          o0[i].data = new Float32Array([...o0[i].data, ...o1[j].data]);
          o0[i].len = parseInt(o0[i].data.length / o0[i].num);
        }
      }
    }

    return o0;
  },

  concatAttribObjects: function (objs) {
    let attribObject = objs[0];
    for (let i = 1; i < objs.length; i++) {
      attribObject = this.concatAttribObject(attribObject, objs[i]);
    }
    return attribObject;
  },

  createAttribBuffer: function (loc, data, num, type) {
    let obj = new Object();
    obj.buffer = this.createBuffer();
    obj.data = new Float32Array(data);
    this.bindBuffer(this.ARRAY_BUFFER, obj.buffer);
    this.bufferData(
      this.ARRAY_BUFFER,
      new Float32Array(data),
      this.STATIC_DRAW
    );
    obj.loc = loc;
    obj.num = num;
    obj.type = type;
    obj.len = parseInt(data.length / num);
    return obj;
  },

  concatAttribBuffer: function (b0, b1) {
    if (b0.loc != b1.loc) {
      throw "buffers not same location";
    }
  },

  background: function (r, g = r, b = r, a = 255) {
    let red, blue, green, alpha;
    if (this.isEnabled(this.BLEND)) {
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
    this.clearColor(red, blue, green, alpha);
    this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
  },

  setFrameBuffer: function (fbo_gl) {
    if (fbo_gl == undefined && fbo_gl != null) {
      throw new SyntaxError("fbo is not selected");
    }
    this.bindFramebuffer(gl.FRAMEBUFFER, fbo_gl);
    if (arguments.length > 1) {
      this.viewport(arguments[1], arguments[2], arguments[3], arguments[4]);
    }
  },

  createFramebufferObject: function (fbo_w, fbo_h) {
    var frameBuffer, texture, depthBuffer;
    let OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT;
    var error = function () {
      if (frameBuffer) this.deleteFramebuffer(frameBuffer);
      if (texture) this.deleteTexture(texture);
      if (depthBuffer) this.deleteRenderbuffer(depthBuffer);
      return null;
    };

    if (!fbo_h && !fbo_w) {
      OFFSCREEN_WIDTH = width;
      OFFSCREEN_HEIGHT = height;
    } else if (!fbo_h) {
      OFFSCREEN_WIDTH = OFFSCREEN_HEIGHT = fbo_w;
    } else {
      OFFSCREEN_WIDTH = fbo_w;
      OFFSCREEN_HEIGHT = fbo_h;
    }

    frameBuffer = this.createFramebuffer();
    texture = this.createTexture();

    this.bindTexture(this.TEXTURE_2D, texture);
    this.texImage2D(
      this.TEXTURE_2D,
      0,
      this.RGBA,
      OFFSCREEN_WIDTH,
      OFFSCREEN_HEIGHT,
      0,
      this.RGBA,
      this.UNSIGNED_BYTE,
      null
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
    this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.NEAREST);
    this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.NEAREST);

    frameBuffer.texture = texture;

    depthBuffer = this.createRenderbuffer();
    this.bindRenderbuffer(this.RENDERBUFFER, depthBuffer);
    this.renderbufferStorage(
      this.RENDERBUFFER,
      this.DEPTH_COMPONENT16,
      OFFSCREEN_WIDTH,
      OFFSCREEN_HEIGHT
    );

    this.bindFramebuffer(this.FRAMEBUFFER, frameBuffer);
    this.framebufferTexture2D(
      this.FRAMEBUFFER,
      this.COLOR_ATTACHMENT0,
      this.TEXTURE_2D,
      texture,
      0
    );
    this.framebufferRenderbuffer(
      this.FRAMEBUFFER,
      this.DEPTH_ATTACHMENT,
      this.RENDERBUFFER,
      depthBuffer
    );

    var e = this.checkFramebufferStatus(this.FRAMEBUFFER);
    if (this.FRAMEBUFFER_COMPLETE !== e) {
      console.log("Frame buffer object is incomplete: " + e.toString());
      return error();
    }

    this.bindFramebuffer(this.FRAMEBUFFER, null);
    this.bindTexture(this.TEXTURE_2D, null);
    this.bindRenderbuffer(this.RENDERBUFFER, null);

    return frameBuffer;
  },

  checkProgramLocation: function (v) {
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
  },

  normalizeVertexForglsl: function (v, step) {
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
  },

  normalizeColorForglsl: function (v, step) {
    let vert = v;
    for (let jkm = 0; jkm < vert.length; jkm += step) {
      for (let ikm = 0; ikm < step; ikm++) {
        vert[jkm + ikm] = vert[jkm + ikm] / 255;
      }
    }
    return vert;
  },
};

Object.keys(WebGLContextUtils).forEach((e) => {
  WebGL2RenderingContext.prototype[e] = WebGLContextUtils[e];
  WebGLRenderingContext.prototype[e] = WebGLContextUtils[e];
});

const WebGLProgramUtils = {
  updateProgramWebGL: function () {},
};

Object.keys(WebGLProgramUtils).forEach((e) => {
  WebGLProgram.prototype[e] = WebGLProgramUtils[e];
});

window.addEventListener("load", function () {
  if (window["main"]) {
    try {
      window["main"]();
    } catch (e) {
      let err;
      if (e.stack) {
        let stack = e.stack;

        let indexStr0 = stack.search("EventListener");
        if (indexStr0 < 0) {
          indexStr0 = stack.search("EventListener");
        }
        stack = stack.slice(0, indexStr0);

        let linenumber;
        let indexStr = e.stack.search(".js");
        let filename = e.stack.slice(0, e.stack.indexOf("\n"));
        while (
          !(filename[indexStr] == "/" || filename[indexStr] == "(") &&
          indexStr >= 0
        ) {
          indexStr--;
        }

        filename = filename.slice(indexStr + 1, filename.length);

        indexStr = filename.search(":");
        linenumber = filename.slice(indexStr + 1, filename.length);
        filename = filename.slice(0, indexStr);

        indexStr = linenumber.search(":");
        linenumber = linenumber.slice(0, indexStr);

        err = new Error(e.message, filename, linenumber);
        err.stack = stack;
      } else {
        err = e;
      }

      throw err;
    }
  }
});

async function loadShader(fileName) {
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

      // console.log(shaderString);
    }

    // console.log(headers);
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
}
