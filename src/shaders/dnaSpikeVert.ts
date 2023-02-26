const dnaSpikeVert = () => `
uniform float anim;
attribute float _interpolation;
attribute vec3 _offset;
varying vec3 vUv; 
varying float interp;
varying float distFromCenter;

void main() {
  vUv = position;
  distFromCenter = smoothstep(0.5, 5.0, _interpolation);
  interp = smoothstep(anim, anim + 0.2, _interpolation / 5.58947563);
  vec3 pos = mix(position, _offset,  interp);
  vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
  gl_PointSize = 1.5;
}
`;

export default dnaSpikeVert;
