
HTMLCanvasElement.prototype.createWebGlContext = function (opt_attribs) {
    var names = ["webgl2", "webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    for (var ii = 0; ii < names.length; ++ii) {
        try {
            context = this.getContext(names[ii], opt_attribs);
        } catch (e) { }
        if (context) {
            break;
        }
    }
    return context;
}

 
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
        // obj.data = new Float32Array(data);
        obj.loc = loc;
        obj.num = num;
        obj.type = type;

        return obj;

    }



 
WebGLRenderingContext.prototype.background =
    WebGL2RenderingContext.prototype.background = function (color_data) {
        this.clearColor(color_data[0] / 255, color_data[1] / 255, color_data[2] / 255, 1.0);
        this.clear(gl.COLOR_BUFFER_BIT);
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
            OFFSCREEN_WIDTH = this.canvas.width;
            OFFSCREEN_HEIGHT = this.canvas.height;
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

        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.LINEAR);
        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.LINEAR);
        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_S, this.CLAMP_TO_EDGE);
        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_T, this.CLAMP_TO_EDGE);

        frameBuffer.texture = texture;  

        depthBuffer = this.createRenderbuffer();  
        this.bindRenderbuffer(this.RENDERBUFFER, depthBuffer);  
        this.renderbufferStorage(this.RENDERBUFFER, this.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

 
        this.bindFramebuffer(this.FRAMEBUFFER, frameBuffer);
        this.framebufferTexture2D(this.FRAMEBUFFER, this.COLOR_ATTACHMENT0, this.TEXTURE_2D, texture, 0);
        this.framebufferRenderbuffer(this.DRAW_FRAMEBUFFER, this.DEPTH_ATTACHMENT, this.RENDERBUFFER, depthBuffer);

 
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
            throw e;
        }
    }

