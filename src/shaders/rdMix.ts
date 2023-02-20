const rdMix = () => `
  precision highp float;
  uniform sampler2D map;
  uniform sampler2D blurMap;
  uniform sampler2D dotMap;
  uniform float gridSize;
  uniform vec2 resolution;
  
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    
    float halftone = uv.y;
   
    float mapVal = texture2D(map, uv).r;
    float blurVal = texture2D(blurMap, uv).r;
    float col = (1.0 - texture2D(dotMap, uv).r);
    col *= 1.0 - blurVal;
    
    float blurStep = smoothstep(0.0, 1.4, blurVal);
    col = smoothstep(blurStep, blurStep + 0.01, col);
    col = 1.0 - col;

    gl_FragColor =  vec4(col, col, col, 1.0 - col);
  }

`;

export default rdMix;