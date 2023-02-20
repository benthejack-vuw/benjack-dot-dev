const reactionDiffusion = () => `
  precision highp float;
  uniform sampler2D backBuffer;
  uniform vec2 resolution;
  uniform float dA;
  uniform float dB;
  uniform float feed;
  uniform float k;
  
  vec2 valuesAtPixelCenter(vec2 uv){
    return texture2D(backBuffer, uv).xy;
  } 
  
  vec2 laplacian(vec2 uv) {
    vec2 ps = 1.0 / resolution * 0.25;
    vec2 valueOut = valuesAtPixelCenter(uv) * -1.0;
    valueOut += valuesAtPixelCenter(uv + vec2(-ps.x, 0)) * 0.2;
    valueOut += valuesAtPixelCenter(uv + vec2(ps.x, 0)) * 0.2;
    valueOut += valuesAtPixelCenter(uv + vec2(0, -ps.y)) * 0.2;
    valueOut += valuesAtPixelCenter(uv + vec2(0, ps.y)) * 0.2;
    valueOut += valuesAtPixelCenter(uv + vec2(-ps.x, -ps.y)) * 0.05;
    valueOut += valuesAtPixelCenter(uv + vec2(-ps.x, ps.y)) * 0.05;
    valueOut += valuesAtPixelCenter(uv + vec2(ps.x, -ps.y)) * 0.05;
    valueOut += valuesAtPixelCenter(uv + vec2(ps.x, ps.y)) * 0.05;
    return valueOut; 
  }
  
  void main() {
     vec2 uv = gl_FragCoord.xy / resolution; 
     
     vec2 prev = valuesAtPixelCenter(uv);
     float a = prev.x;
     float b = prev.y;
     
     vec2 laplace = laplacian(uv);
     
     float nA = a + ((dA * laplace.x) - (a * b * b) + (feed * (1.0 - a)));
     float nB = b + ((dB * laplace.y) + (a * b * b) - ((k + feed) * b));
     
     nA = clamp(nA, 0.0, 1.0);
     nB = clamp(nB, 0.0, 1.0);
     
     gl_FragColor = vec4(nA, nB, 0.0, 1.0);
  }
  
`;
export default reactionDiffusion;