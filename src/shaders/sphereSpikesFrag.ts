const sphereSpikesFrag = () => `
varying float interp;

void main() {
  float resized = smoothstep(0.0, 5.0, interp);
  gl_FragColor = vec4(0,0,0,resized);
}

`;

export default sphereSpikesFrag;