# wgle

![alt text](http://url/to/wgle.jpg)

wgle is a WebGL Utils and helper library for WebGL. this will save your time! <br> 
and it keeps you away from repetitive operations like any other library.

The main goal is to help the evolution of webgl without adding something useless in the form of a few but useful functions.


# How to use 


```html
function main(){
  let canvas = document.getElementById("canvas");
  gl = canvas.createWebGlContext();
  program = gl.createProgramWebGL(vs,fs);
  ...
}
```



# Documentation Table of Contents 
 

### WebGLRenderingContext <br>
- [main](#main)<br>
- [createWebGlContext](#createWebGlContext)<br>
- [createProgramWebGL](#createProgramWebGL)<br>
- [createArrayBuffer](#createArrayBuffer)<br>
- [impelementBuffers](#impelementBuffers)<br>
- [setFrameBuffer](#setFrameBuffer)<br>
- [createFramebufferObject](#createFramebufferObject)<br>
- [checkProgramLocation](#checkProgramLocation)<br>
 


### main

main function just need to define it's will calling auto in webglutils!
```html
function main(){
  let canvas = document.getElementById("canvas");
  gl = canvas.createWebGlContext();
  ...
}
```

### createWebGlContext()

createWebGlContext() create webgl context 

```html
function main(){
  let canvas = document.getElementById("canvas");
  gl = canvas.createWebGlContext();
  ...
}
```

get parametr width and height 
```html
function main(){
  let canvas = document.getElementById("canvas");
  gl = canvas.createWebGlContext(300,200);
  ...
}
```

and get attribute webgl context 
```html
function main(){
  let canvas = document.getElementById("canvas");
  gl = canvas.createWebGlContext(300, 200, {alpha:true});
  ...
}
```

### createProgramWebGL()


```html
let vShader =`
attribute vec4 a_Position;
void main(){
  gl_Position = a_Position;
}
`;
let fShader =`
void main(){
  gl_FragColor = vec4(1.0);
}
`;

function main(){
  let canvas = document.getElementById("canvas");
  let gl = canvas.createWebGlContext();
  let program = gl.createProgramWebGL(vShader,fShader);

  gl.useProgram(program);
  ...
}
```
access to attribute and uniform locations in program object
```html

let vShader =`
attribute vec4 a_Position;
void main(){
  gl_Position = a_Position;
}
`;
let fShader =`
uniform float u_alpha;
void main(){
  gl_FragColor = vec4(1.0);
}
`;

function main(){
  let canvas = document.getElementById("canvas");
  let gl = canvas.createWebGlContext();


  let program = gl.createProgramWebGL(vShader,fShader);

  program.getProgramLocations(); // finding program locations
 
  gl.useProgram(program);
  program.a_Position // attribute location value
  program.u_alpha // uniform location value
  ...
}
```
### createArrayBuffer()
```html
function main(){
  let canvas = document.getElementById("canvas");
  gl = canvas.createWebGlContext();
  ...
  let positionBuffer = gl.createArrayBuffer(program.a_Position, vertices, 4, gl.FLOAT);
  let colorBuffer = gl.createArrayBuffer(program.a_Color, colors, 4, gl.FLOAT);
  ...
}
```

### impelementBuffers()

```html
function main(){
  let canvas = document.getElementById("canvas");
  gl = canvas.createWebGlContext();
  ...
  let positionBuffer = gl.createArrayBuffer(program.a_Position, vertices, 4, gl.FLOAT);
  let colorBuffer = gl.createArrayBuffer(program.a_Color, colors, 4, gl.FLOAT);

  gl.impelementBuffers(positionBuffer);
  gl.impelementBuffers(colorBuffer);
  gl.drawArrays(gl.TRIANGLES, 0, positionBuffer.len)
  ...
}
```
### setFrameBuffer()

```html
function main(){
  let canvas = document.getElementById("canvas");
  gl = canvas.createWebGlContext();
  ...
}
```

### createFramebufferObject()

```html
function main(){
  let canvas = document.getElementById("canvas");
  gl = canvas.createWebGlContext();
  ...
}
```

### background()

```html
function main(){
  let canvas = document.getElementById("canvas");
  gl = canvas.createWebGlContext();
  ...
}
```

### checkProgramLocation()

```html
function main(){
  let canvas = document.getElementById("canvas");
  gl = canvas.createWebGlContext();
  program = gl.createProgramWebGL(vs,fs);
  let positionLoc = gl.getAttribLocation(program,"a_Position");
  gl.checkProgramLocation(positionLoc) throw an Error in console! 
  ...
}
```

