
precision highp float;

uniform int u_mode ;
varying vec4 v_Color;
varying vec2 v_Texcoord;
uniform sampler2D u_sampler;
uniform vec2 u_resolution ;
void main(){

    vec4 fragColor;

    if(u_mode ==0){
         fragColor = texture2D(u_sampler,v_Texcoord);
    }else if(u_mode ==1 ){
        vec4 color1 = texture2D(u_sampler, gl_FragCoord.xy/u_resolution);
        fragColor  = color1 * v_Color;
 
    }

    gl_FragColor =   fragColor ;
}