const SpikePointShader = () => `
    varying float interp;
    varying vec2 vUv;

    void main() {
        float d = 0.5 - length(gl_PointCoord - vec2(0.5, 0.5));
        float t = smoothstep(0.0, 0.1, d);
        vec3 col = vec3(0);
        gl_FragColor = vec4(col, smoothstep(0.2,5.0, interp) * t);
    }
`;

export default SpikePointShader;