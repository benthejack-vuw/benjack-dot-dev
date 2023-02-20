import {
  clipspaceScreenTri,
  Geometry,
  passThroughVert,
  ShaderChain,
  ShaderPass,
  UniformObject,
} from 'tiny-shader-lib';

import { GlobalMousePositionListener } from '../hooks/useGlobalMousePosition';
import circleAtMouse from '../shaders/circleAtMouse';
import ripple from '../shaders/ripple';
import blurPass from './passes/blurPass';
import halftone from "../shaders/halftone";

const circlePass = (
  canvas: HTMLCanvasElement,
  gl: WebGLRenderingContext,
  screenGeom: Geometry,
  width?: number,
  height?: number
) => {

  const circleUniforms: UniformObject = {
    backBuffer: { type: 'texture2D', value: null },
    mousePos: { type: 'float2', value: [0, 0] },
    circleColor: { type: 'float3', value: [1, 1, 1] },
    backgroundColor: { type: 'float3', value: [0, 0, 0] },
    fadeSpeed: { type: 'float', value: 0.97 },
    size: { type: 'float', value: 0.0 },
    feathering: { type: 'float', value: 0.05 },
  };

  const circlePass = new ShaderPass(
    gl,
    passThroughVert(),
    circleAtMouse(),
    screenGeom,
    circleUniforms,
    { width, height }
  );

  return circlePass;
};

const ripplePass = (
  gl: WebGLRenderingContext,
  screenGeom: Geometry,
  width?: number,
  height?: number
) => {
  const circleUniforms: UniformObject = {
    inputMap: { type: 'texture2D', value: null },
    samples: { type: 'int', value: 15 },
    color: { type: 'float3', value: [0.8, 0.85, 0.95] },
    contrast: { type: 'float', value: 5 },
    lightDirection: { type: 'float2', value: [1, 1] },
    time: { type: 'float', value: 0 },
  };

  const pass = new ShaderPass(
    gl,
    passThroughVert(),
    ripple(),
    screenGeom,
    circleUniforms,
    { width, height }
  );

  const startTime = Date.now();
  pass.addUpdateFunction(() => {
    const time = (Date.now() - startTime) / 200;
    pass.setUniform('time', time);
  });

  return pass;
};

const halftonePass = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  coverScreen: Geometry,
  width?: number,
  height?: number
) => {

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


export function rippleBackground(
  canvas: HTMLCanvasElement,
  gl: WebGLRenderingContext,
  mouseListener: GlobalMousePositionListener,
  width?: number,
  height?: number
) {

  const coverScreen = clipspaceScreenTri(gl);
  const mouseCircle = circlePass(canvas, gl, coverScreen, canvas.clientWidth, canvas.clientHeight);

  mouseCircle.addUpdateFunction(() => {
    mouseCircle.setUniform('mousePos', [
      mouseListener.mousePositions.normalizedMouseFollowingPosition.x,
      mouseListener.mousePositions.normalizedMouseFollowingPosition.y,
    ]);
  });

  const blur = blurPass(
    gl,
    coverScreen,
    mouseCircle,
    30,
    canvas.clientWidth,
    canvas.clientHeight,
  );

  const ripple = ripplePass(gl, coverScreen, canvas.width, canvas.height);

  const halftone = halftonePass(gl, coverScreen, canvas.width, canvas.height);

  mouseCircle.linkPassToUniform(blur, 'backBuffer');
  ripple.linkPassToUniform(blur, 'inputMap');
  halftone.linkPassToUniform(ripple, 'map');
  const chain = new ShaderChain([mouseCircle, blur, ripple, halftone]);
  chain.outputPass = halftone;

  return chain;
}
