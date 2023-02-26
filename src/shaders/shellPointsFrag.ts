const shellPointsFrag = () => `
varying vec2 vUv;
    void main() {
        vec3 col = vec3(0.4);
        gl_FragColor = vec4(col, 1.0);
    }
`;

export default shellPointsFrag;