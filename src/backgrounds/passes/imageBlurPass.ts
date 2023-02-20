import {
  Geometry,
  passThroughVert,
  ShaderChain,
  ShaderPass,
  UniformObject,
} from 'tiny-shader-lib';

import imageBlur from "../../shaders/imageBlur";

const imageBlurPass = (
  gl: WebGLRenderingContext,
  screenGeom: Geometry,
  blurIntensity: number,
  width?: number,
  height?: number
) => {
  const blurUniforms: UniformObject = {
    map: {
      type: 'texture2D',
      value: null,
    },
    mfp: {
      type: 'float2',
      value: [-1, -1],
    },
    time: {
      type: 'float',
      value: 0.0
    },
    blurMap: {
      type: 'texture2D',
      value: null,
    },
    blurSize: {
      type: 'int',
      value: blurIntensity,
    },
    sigma: {
      type: 'float',
      value: blurIntensity / 2.5,
    },
  };

  const blurH = new ShaderPass(
    gl,
    passThroughVert(),
    imageBlur(),
    screenGeom,
    {
      ...blurUniforms,
      direction: {
        type: 'float2',
        value: [1, 0],
      },
    },
    { width, height }
  );

  const blurV = new ShaderPass(
    gl,
    passThroughVert(),
    imageBlur(),
    screenGeom,
    {
      ...blurUniforms,
      direction: {
        type: 'float2',
        value: [0, 1],
      },
    },
    { width, height }
  );

  blurV.linkPassToUniform(blurH, 'map')

  const chain = new ShaderChain([blurH, blurV]);
  chain.outputPass = blurV;

  return { chain, blurH, blurV };
};

export default imageBlurPass;
