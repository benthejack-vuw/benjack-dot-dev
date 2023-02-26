import perlin from "./snippets/perlin";
import simplex from "./snippets/simplex";

const imageBlur = () => `
    precision highp float;
    uniform sampler2D blurMap;
    uniform vec2 mfp;
    uniform float time;
    uniform vec2 resolution;
    uniform sampler2D map;
    uniform vec2 direction;    
    uniform int blurSize;       
    uniform float sigma;        // The sigma value for the gaussian function: higher value means more blur
                                // A good value for 9x9 is around 3 to 5
                                // A good value for 7x7 is around 2.5 to 4
                                // A good value for 5x5 is around 2 to 3.5
                                // ... play around with this based on what you need 
    
    const float pi = 3.14159265;
   
   ${simplex()}
        
    void main() {
      vec2 uv = gl_FragCoord.xy / resolution;
      float numBlurPixelsPerSide = float(blurSize / 2); 
      vec2 oneOverResolution = 1. / resolution;
    
      
    
      // Incremental Gaussian Coefficent Calculation (See GPU Gems 3 pp. 877 - 889)
      vec3 incrementalGaussian;
      incrementalGaussian.x = 1.0 / (sqrt(2.0 * pi) * sigma);
      incrementalGaussian.y = exp(-0.5 / (sigma * sigma));
      incrementalGaussian.z = incrementalGaussian.y * incrementalGaussian.y;
    
      vec4 avgValue = vec4(0.0, 0.0, 0.0, 0.0);
      float coefficientSum = 0.0;
    
      // Take the central sample first...
      avgValue += texture2D(map, uv) * incrementalGaussian.x;
      coefficientSum += incrementalGaussian.x;
      incrementalGaussian.xy *= incrementalGaussian.yz;
    
      // Go through the remaining 8 vertical samples (4 on each side of the center)
      for (float i = 1.0; i <= numBlurPixelsPerSide; i++) { 
        avgValue += texture2D(map, uv - i * oneOverResolution * 
                              direction) * incrementalGaussian.x;         
        avgValue += texture2D(map, uv + i * oneOverResolution * 
                              direction) * incrementalGaussian.x;         
        coefficientSum += 2.0 * incrementalGaussian.x;
        incrementalGaussian.xy *= incrementalGaussian.yz;
      }
      
      vec4 initial = texture2D(map, uv);
      vec4 blurred = avgValue / coefficientSum;
      
      
      
      float simplex = smoothstep(0.0, 0.2, simplex3d(vec3(uv* 1.0, time)));
      float mouse = 1.0 - smoothstep(0.0, 0.6, length(mfp - uv));
      float blurIntensity = clamp(simplex + mouse, 0.0, 1.0);
      
      gl_FragColor = mix(initial, blurred, blurIntensity);
      //gl_FragColor = vec4(vec3(blurIntensity), 1.0);
    }
`;

export default imageBlur;
