const passthroughVert = () => `
    varying vec3 vUv; 
    attribute float _interpolation;
    varying float interp;

    void main() {
      vUv = position; 
      interp = _interpolation;
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
`;

export default passthroughVert;