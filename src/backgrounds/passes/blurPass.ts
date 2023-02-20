import {
  Geometry,
  passThroughVert,
  ShaderChain,
  ShaderPass,
  UniformObject,
} from 'tiny-shader-lib';

import blur from '../../shaders/blur';

const blurPass = (
  gl: WebGLRenderingContext,
  screenGeom: Geometry,
  inputPass: ShaderPass,
  blurIntensity: number,
  width?: number,
  height?: number
) => {
  const blurUniforms: UniformObject = {
    map: {
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
    blur(),
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
    blur(),
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

  blurH.linkPassToUniform(inputPass, 'map');
  blurV.linkPassToUniform(blurH, 'map');

  const chain = new ShaderChain([blurH, blurV]);
  chain.outputPass = blurV;

  return chain;
};

export default blurPass;
