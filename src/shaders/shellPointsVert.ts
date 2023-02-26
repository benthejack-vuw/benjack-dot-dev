const shellPointsVert = () => `
varying vec3 vUv; 

void main() {
  vUv = position;
  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
  gl_PointSize = 2.0;
}
`;

export default shellPointsVert;
