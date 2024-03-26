# WebGL Utils

WebGL Utils a helper library for WebGL. this will save your time! <br> 
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
 
### HTMLCanvasElement <br>
- [main](#main)<br>

### WebGLRenderingContext <br>
- [createWebGlContext](#createWebGlContext)<br>
- [createProgramWebGL](#createProgramWebGL)<br>
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
  program = gl.createProgramWebGL(vs,fs);
  ...
}
```

### createWebGlContext()

```html
function main(){
  let canvas = document.getElementById("canvas");
  gl = canvas.createWebGlContext();
 
  ...
}
```
### createProgramWebGL()

```html
function main(){
  let canvas = document.getElementById("canvas");
  gl = canvas.createWebGlContext();
 
  ...
}
```



### impelementBuffers()

```html
function main(){
  let canvas = document.getElementById("canvas");
  gl = canvas.createWebGlContext();
 
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

