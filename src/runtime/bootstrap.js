"use strict";
 
import  Core  from '../core/index'; 
 
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

  context.width = this.width;
  context.height = this.height;

  return context;
};

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

WebGL2RenderingContext.prototype.createProgramWebGL =
  WebGL2RenderingContext.prototype.createProgram;
WebGLRenderingContext.prototype.createProgramWebGL =
  WebGLRenderingContext.prototype.createProgram;

WebGL2RenderingContext.prototype.createFramebufferWebGL =
  WebGL2RenderingContext.prototype.createFramebuffer;
WebGLRenderingContext.prototype.createFramebufferWebGL =
  WebGLRenderingContext.prototype.createFramebuffer;

WebGL2RenderingContext.prototype.createTextureWebGL =
  WebGL2RenderingContext.prototype.createTexture;
WebGLRenderingContext.prototype.createTextureWebGL =
  WebGLRenderingContext.prototype.createTexture;

WebGL2RenderingContext.prototype.activeTextureWebGL =
  WebGL2RenderingContext.prototype.activeTexture;
WebGLRenderingContext.prototype.activeTextureWebGL =
  WebGLRenderingContext.prototype.activeTexture;

WebGL2RenderingContext.prototype.bindBufferWebGL =
  WebGL2RenderingContext.prototype.bindBuffer;
WebGLRenderingContext.prototype.bindBufferWebGL =
  WebGLRenderingContext.prototype.bindBuffer;



Object.keys(Core).forEach((e) => {
  WebGL2RenderingContext.prototype[e] = WebGLContextUtils[e];
  WebGLRenderingContext.prototype[e] = WebGLContextUtils[e];
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

  try {
    if (window["animation"]) {
      let animationContent = window["animation"];
      window["animation"] = () => {
        animationContent();
        requestAnimationFrame(animation);
      };
      window["animation"]();
    }
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
});