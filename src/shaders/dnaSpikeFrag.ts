const dnaSpikeFrag = () => `
    varying float interp;
    varying vec2 vUv;
    uniform float anim;
    uniform float opacity;
    varying float distFromCenter;

    void main() {
        float d = 0.5 - length(gl_PointCoord - vec2(0.5, 0.5));
        float t = smoothstep(0.0, 0.1, d);
        vec3 col = vec3(0.2);
        gl_FragColor = vec4(col * opacity, (1.0 - interp) * distFromCenter * (opacity));
    }
`;

export default dnaSpikeFrag;