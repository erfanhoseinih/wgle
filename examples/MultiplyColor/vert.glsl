
attribute vec4 a_Position;

attribute vec2 a_Texcoord;
varying vec2 v_Texcoord;

attribute vec4 a_Color;
varying vec4 v_Color;

void main(){
    v_Color = a_Color;
    v_Texcoord = a_Texcoord;
    gl_Position = a_Position;
}