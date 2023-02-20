const halftone = () => ` 
  uniform vec2 resolution;
  uniform float frequency;
  uniform sampler2D map;
  uniform float radius;
  uniform vec4 foreground;
  uniform vec4 background;
  
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    vec2 uvProportion = vec2(uv.x, uv.y / ratio);
        
    vec2 rotated = mat2(0.707, -0.707, 0.707, 0.707) * uvProportion;    
    
    vec2 nearest = 2.0 * fract(frequency * rotated) - 1.0;
    float dist = length(nearest);
    
    float distFromCenter = 0.5 - length(vec2(0.5, 0.5) - uv);
    
    float toneRad = texture2D(map, uv).r * 2.0 + radius;
    
    vec4 col = mix(foreground, background, smoothstep(toneRad - toneRad / 4.0, toneRad + toneRad / 4.0, dist));
    vec4 outCol = mix(col, background, smoothstep(0.2, 0.5, distFromCenter));
    gl_FragColor = col;
  }  

`;

export default halftone;