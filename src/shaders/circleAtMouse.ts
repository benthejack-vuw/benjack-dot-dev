const CircleAtMouse = () => `
  uniform sampler2D backBuffer;
  uniform vec2 resolution;
  uniform vec2 mousePos;
  uniform vec3 circleColor;
  uniform vec3 backgroundColor;
  uniform float fadeSpeed;
  uniform float size;
  uniform float feathering;
  
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 ratio = vec2(1, resolution.y / resolution.x);
    float dst = length((mousePos - uv) * ratio);
    float circle = smoothstep(size, size + feathering, dst);
    vec3 lastCol = texture2D(backBuffer, uv).xyz;
    vec3 circCol = mix(circleColor, lastCol, circle);
    vec3 colOut = smoothstep(0.01, 1.0, circCol * fadeSpeed);
    //vec3 colOut = mix(circCol, backgroundColor, fadeSpeed);
    gl_FragColor = vec4(colOut, 1.0);
  }
`;

export default CircleAtMouse;
