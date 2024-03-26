"use strict";
let width, height;

HTMLCanvasElement.prototype.createWebGlContext = function (...args) {

    var width_Context, height_Context;
    var webgl_versions = ["webgl2", "webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    var attribs_Context = {};

    args.forEach(e => {
        if (typeof (e) == "string") {
            if (webgl_versions.indexOf(e) < 0) {
                let er = new Error('Failed create webgl context. wrong version! ');
                er.stack = er.stack.slice(er.stack.indexOf("\n") + 1, er.stack.length);
                er.stack = er.stack.slice(er.stack.indexOf("\n") + 1, er.stack.length);
                throw er;
            } else {
                webgl_versions.unshift(webgl_versions[webgl_versions.indexOf(e)]);
            }
        } else if (e.constructor.name == "Object") {
            attribs_Context = e;
        }
    })

    if (Number.isInteger(args[0]) && Number.isInteger(args[1])) {
        width_Context = parseInt(args[0])
        height_Context = parseInt(args[1])
    } else {
        width_Context = height_Context = 500;
    }
    this.width = width_Context;
    this.height = height_Context;
    for (var ii = 0; ii < webgl_versions.length; ++ii) {
        try {
            context = this.getContext(webgl_versions[ii], attribs_Context);
        } catch (e) { }
        if (context) {
            break;
        }
    }
    width = this.width;
    height = this.height;


    return context;
}
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
    "attribute mat4"

]
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
    "uniform samplerCube"

];

WebGLRenderingContext.prototype.createProgramWebGL =
    WebGL2RenderingContext.prototype.createProgramWebGL = function (vertCode, fragCode) {

        var vertexShader = this.createShader(this.VERTEX_SHADER);
        this.shaderSource(vertexShader, vertCode);
        this.compileShader(vertexShader);

        var fragmentShader = this.createShader(this.FRAGMENT_SHADER);
        this.shaderSource(fragmentShader, fragCode);
        this.compileShader(fragmentShader);


        let program = this.createProgram();
        this.attachShader(program, vertexShader);
        this.attachShader(program, fragmentShader);

        this.linkProgram(program);

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
                    endStr = c.length;
                    let resulte = c.slice(startStr + s.length + 1, endStr);
                    return resulte;
                }

            }

            let codeVertFragLocations = vertCode.concat(fragCode)
            codeVertFragLocations = codeVertFragLocations.split("\n").join("").split(";");

            let attribLocations = [];
            let uniformLocations = [];


            for (let ik = 0; ik < codeVertFragLocations.length; ik++) {
                let locStrA = null
                let locStrU = null
                glslAttriTypeStrings.forEach(e => {

                    locStrA = getLocString(codeVertFragLocations[ik], e)

                    if (locStrA) {
                        attribLocations.push(locStrA)
                    }
                })


                glslUniTypeStrings.forEach(e => {

                    locStrU = getLocString(codeVertFragLocations[ik], e)

                    if (locStrU) {
                        uniformLocations.push(locStrU)
                    }
                })


            }


            attribLocations.forEach(e => {
                program[e] = gl.getAttribLocation(program, e);
            })
            uniformLocations.forEach(e => {
                program[e] = gl.getUniformLocation(program, e);
            })



            return program;
        }

        return program;
    }







WebGLRenderingContext.prototype.impelementBuffers =
    WebGL2RenderingContext.prototype.impelementBuffers = function (...args) {
        args.forEach((e) => {
            let buffer = this.createBuffer();
            this.bindBuffer(this.ARRAY_BUFFER, buffer);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(e[1]), this.STATIC_DRAW);
            this.vertexAttribPointer(e[0], e[2], this.FLOAT, false, 0, 0);
            this.enableVertexAttribArray(e[0]);
        });

    }


WebGLRenderingContext.prototype.impelementBuffers_1 =
    WebGL2RenderingContext.prototype.impelementBuffers_1 = function (args) {
        args.forEach((e) => {
            this.bindBuffer(this.ARRAY_BUFFER, e.buffer);
            this.vertexAttribPointer(e.loc, e.num, this.FLOAT, false, 0, 0);
            this.enableVertexAttribArray(e.loc);
        });

    }



WebGLRenderingContext.prototype.createArrayBuffer =
    WebGL2RenderingContext.prototype.createArrayBuffer = function (loc, data, num, type) {
        let obj = new Object();
        obj.buffer = this.createBuffer();
        this.bindBuffer(this.ARRAY_BUFFER, obj.buffer);
        this.bufferData(this.ARRAY_BUFFER, new Float32Array(data), this.STATIC_DRAW);
        obj.loc = loc;
        obj.num = num;
        obj.type = type;
        obj.len = parseInt(data.length / num);
        return obj;

    }

 
WebGLRenderingContext.prototype.background =
    WebGL2RenderingContext.prototype.background = function (color_data) {
        if (gl.isEnabled(gl.BLEND)) {
            this.canvas.style.backgroundColor = `rgba( ${color_data[0]} , ${color_data[1]} , ${color_data[2]} ,1.0)`;
        } else {
            this.canvas.style.backgroundColor = `rgba( ${0} , ${0} , ${0} ,1.0)`;
        }
        this.clearColor(color_data[0] / 255, color_data[1] / 255, color_data[2] / 255, 1.0);
        this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
    }



WebGLRenderingContext.prototype.setFrameBuffer =
    WebGL2RenderingContext.prototype.setFrameBuffer = function (fbo_gl) {
        if (fbo_gl == undefined && fbo_gl != null) {
            throw new SyntaxError("fbo is not selected");
        }
        this.bindFramebuffer(gl.FRAMEBUFFER, fbo_gl);
        if (arguments.length > 1) {
            this.viewport(arguments[1], arguments[2], arguments[3], arguments[4])
        }
    }

WebGLRenderingContext.prototype.createFramebufferObject =
    WebGL2RenderingContext.prototype.createFramebufferObject = function (fbo_w, fbo_h) {

        var frameBuffer, texture, depthBuffer;
        let OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT;
        var error = function () {
            if (frameBuffer) this.deleteFramebuffer(frameBuffer);
            if (texture) this.deleteTexture(texture);
            if (depthBuffer) this.deleteRenderbuffer(depthBuffer);
            return null;
        }

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
        this.texImage2D(this.TEXTURE_2D, 0, this.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, this.RGBA, this.UNSIGNED_BYTE, null);

        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_S, this.CLAMP_TO_EDGE);
        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_T, this.CLAMP_TO_EDGE);
        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.NEAREST);
        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.NEAREST)

        frameBuffer.texture = texture;

        depthBuffer = this.createRenderbuffer();
        this.bindRenderbuffer(this.RENDERBUFFER, depthBuffer);
        this.renderbufferStorage(this.RENDERBUFFER, this.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);


        this.bindFramebuffer(this.FRAMEBUFFER, frameBuffer);
        this.framebufferTexture2D(this.FRAMEBUFFER, this.COLOR_ATTACHMENT0, this.TEXTURE_2D, texture, 0);
        this.framebufferRenderbuffer(this.FRAMEBUFFER, this.DEPTH_ATTACHMENT, this.RENDERBUFFER, depthBuffer);

 



        var e = this.checkFramebufferStatus(this.FRAMEBUFFER);
        if (this.FRAMEBUFFER_COMPLETE !== e) {
            console.log('Frame buffer object is incomplete: ' + e.toString());
            return error();
        }

        this.bindFramebuffer(this.FRAMEBUFFER, null);
        this.bindTexture(this.TEXTURE_2D, null);
        this.bindRenderbuffer(this.RENDERBUFFER, null);


        return frameBuffer;

    }




WebGLRenderingContext.prototype.checkProgramLocation =
    WebGL2RenderingContext.prototype.checkProgramLocation = function (v) {
        if (v == undefined || v == null || v < 0) {
            let e = new Error('Failed to get the storage location');
            e.stack = e.stack.slice(e.stack.indexOf("\n") + 1, e.stack.length);
            e.lineNumber = null;
            let filename = e.stack.slice(0, e.stack.indexOf("\n") + 1);
            let indexStr = filename.search(".js");
            while (!(filename[indexStr] == "/")) { indexStr--; }
            e.fileName = filename.slice(5, filename.length);
            throw e;
        } else {
            return true;
        }
    }




WebGLRenderingContext.prototype.normalizeVertexForglsl =
    WebGL2RenderingContext.prototype.normalizeVertexForglsl = function (v, step) {
        let vert = v;
        for (let jkm = 0; jkm < vert.length; jkm += step) {
            if (step == 2) {
                vert[jkm] = vert[jkm] / width * 2 - 1;
                vert[jkm + 1] = vert[jkm + 1] / height * 2 - 1;
            } else if (step == 3) {
                vert[jkm] = vert[jkm] / width * 2 - 1;
                vert[jkm + 1] = vert[jkm + 1] / height * 2 - 1;
                vert[jkm + 2] = vert[jkm + 2] / (((height + width) / 2) * 2) - 1;
            }


        }
        return vert;
    }



WebGLRenderingContext.prototype.normalizeColorForglsl =
    WebGL2RenderingContext.prototype.normalizeColorForglsl = function (v, step) {
        let vert = v;
        for (let jkm = 0; jkm < vert.length; jkm += step) {
            for (let ikm = 0; ikm < step; ikm++) {
                vert[jkm + ikm] = vert[jkm + ikm] / 255;

            }


        }
        return vert;
    }


function mainRunner() {
    try {
        window["main"]()
        cancelAnimationFrame(mainRunner)
    } catch (e) {
        if (e.message == "window.main is not a function") {
            requestAnimationFrame(mainRunner)
        } else {
            let err = e;
            if (err.stack) {
                err.stack = err.stack.slice(0, err.stack.indexOf("\n") + 1);
            }
            cancelAnimationFrame(mainRunner)
            throw err;

        }
    }
} mainRunner();




async function loadShaderFile(fileName) {
    let data;
    const response = await fetch(fileName);
    if (!response.ok) throw new Error(response.status);
    contents = async function () { return await response.text(); }
    await contents().then(res => { data = res; })
    return data;
}