const dnaSpikeFrag = () => `
    varying float interp;
    varying vec2 vUv;
    varying float distFromCenter;
    uniform float anim;
    uniform float opacity;

    void main() {
        vec3 col = vec3(1);
        gl_FragColor = vec4(col * opacity, (1.0 - interp) * distFromCenter * (opacity));
    }
`;

export default dnaSpikeFrag;