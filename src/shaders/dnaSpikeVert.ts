import { rand } from "./snippets/rand";

const dnaSpikeVert = () => `
uniform float anim;
varying vec3 vUv; 
varying float interp;
varying float distFromCenter;

${rand()}

void main() {
  vUv = position;
  distFromCenter = length(position) / 5.58947563;
  interp = smoothstep(anim, anim + 0.2, distFromCenter);
  vec3 offset = vec3((rand(position.xy) - 0.5) * 2.0, (rand(position.xz) - 0.5) * 2.0, (rand(position.yz) - 0.5) * 2.0);
  vec3 pos = mix(position, offset,  interp);
  vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
  gl_PointSize = 1.5;
}
`;

export default dnaSpikeVert;
