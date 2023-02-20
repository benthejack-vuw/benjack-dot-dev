import {clipspaceScreenTri, Geometry, passThroughVert, ShaderPass, UniformObject} from "tiny-shader-lib";
import halftone from "../shaders/halftone";

const halftoneBackground = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  width?: number,
  height?: number
) => {

  const coverScreen = clipspaceScreenTri(gl);

  const halftoneUniforms: UniformObject = {
    map: { type: 'texture2D', value: null },
    frequency: { type: 'float', value: window.innerWidth / 6 },
    radius: { type: 'float', value: 0.4},
    foreground: { type: 'float4', value: [0.85,0.85,0.85,1]},
    background: { type: 'float4', value: [1,1,1,0]},
    mfp: { type: 'float2', value: [-1, -1]}
  };

  const pass = new ShaderPass(
    gl,
    passThroughVert(),
    halftone(),
    coverScreen,
    halftoneUniforms,
    { width, height }
  );

  pass.addUpdateFunction(() => {
    pass.setUniform('frequency', window.innerWidth / 6)
  })

  return pass;
};

export default halftoneBackground;