import { rand } from './snippets/rand';

const ripple = () => `

uniform sampler2D inputMap;
uniform vec2 resolution;
uniform int samples;
uniform vec2 mousePosition;
uniform vec3 color;
uniform float contrast;
uniform vec2 lightDirection;
uniform float time;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float offset(float t, float o) 
{
  return sin(t)*0.5+0.5/10.0 + o;
} 

${rand()}

void main () {
  vec2 uv = gl_FragCoord.xy / resolution;

  float maxIntensity = -1.0;
  vec2 maxOffset;
  
  float theta = 3.1415926/float(samples);
  vec2 oneOverRes = 1.0/resolution;
    
  float intensity = texture2D(inputMap, uv).x;
  float wave = 10.0;
  float dx = sin(pow(texture2D(inputMap, uv+oneOverRes.x).x, 2.0) * wave + time+0.01) - sin(pow(texture2D(inputMap, uv-oneOverRes.x).x, 2.0) * wave + time+0.01);
  float dy = sin(pow(texture2D(inputMap, uv+oneOverRes.y).x, 2.0) * wave + time+0.01) - sin(pow(texture2D(inputMap, uv-oneOverRes.y).x, 2.0) * wave + time+0.01);
  vec2 diff = vec2(dx, dy) * 0.0025;
  
  float incidence = dot(normalize(vec3(diff, maxIntensity*0.02)), normalize(vec3(lightDirection,0.0))) + 0.25;
  
  
  vec3 col1 = hsv2rgb(vec3(offset(time *0.01, 0.4), 0.8, 0.5));
  vec3 col2 = hsv2rgb(vec3(offset(time * 0.01 + 0.2, 0.4), 0.8, 0.5));
  vec3 col = vec3(0.1,0.1,0.1);
  
  vec3 powCol = pow(col, vec3(incidence * contrast));
  vec3 outCol = mix(powCol, col, 0.1);
  //vec3 outCol = mix(gradientCol, vec3(1), 1.0 - smoothstep(0.01, 1.0, intensity)); 
  

  gl_FragColor = vec4(outCol, 1.0) + rand(uv+time)*0.01;
}

`;

export default ripple;
