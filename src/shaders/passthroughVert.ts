const passthroughVert = () => `
uniform float anim;
attribute float _interpolation;
varying vec3 vUv; 
varying float interp;

void main() {
  vUv = position; 
  interp = _interpolation;
  vec4 modelViewPosition = modelViewMatrix * vec4(position * anim, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
  gl_PointSize = 5.0;
}
`;

export default passthroughVert;
