import {clipspaceScreenTri, Geometry, passThroughVert, ShaderChain, ShaderPass, UniformObject, canvasTexture} from "tiny-shader-lib";
import blurPass from "./passes/blurPass";
import ripple from "../shaders/ripple";
import rdMix from "../shaders/rdMix";
import imageBlurPass from "./passes/imageBlurPass";
import reactionDiffusion from "../shaders/reactionDiffusion";
import {GlobalMousePositionListener} from "../hooks/useGlobalMousePosition";

const rdMixPass = (
  gl: WebGLRenderingContext,
  textCanvas: HTMLCanvasElement,
  screenGeom: Geometry,
  width?: number,
  height?: number
) => {
  const halftoneUniforms: UniformObject = {
    map: { type: 'texture2D', value: null },
    blurMap: { type: 'texture2D', value: null },
    dotMap: { type: 'texture2D', value: null },
    gridSize: { type: 'float', value: 200 },
    
  };

  const pass = new ShaderPass(
    gl,
    passThroughVert(),
    rdMix(),
    screenGeom,
    halftoneUniforms,
    { width, height }
  );

  return pass;
};

const rdPass = (
  gl: WebGLRenderingContext,
  seedTexture: WebGLTexture,
  screenGeom: Geometry,
  width?: number,
  height?: number,
) => {
  const rdUniforms: UniformObject = {
    backBuffer: {type: 'texture2D', value: null},
    dA: { type: 'float', value: 1.0 },
    dB: { type: 'float', value: 0.5 },
    feed: { type: 'float', value: 0.03250 },
    k: { type: 'float', value: 0.06155 },
    mfp: { type: 'float2', value: [-1, -1]}
  };

  const pass = new ShaderPass(
    gl,
    passThroughVert(),
    reactionDiffusion(),
    screenGeom,
    rdUniforms,
    {
      linearFilter: true,
      width,
      height,
      dataType: gl.FLOAT,
      doubleBuffer: true,
    }
  );

  pass.setUniform('backBuffer', seedTexture);

  const startValue = 0.03250;
  const startTime = Date.now();
  pass.addUpdateFunction(() => {
    const deltaTime = (Date.now() - startTime) / 30000;
    const f = startValue + ((Math.sin(deltaTime) * 0.5 + 0.5) * 0.01);
    pass.setUniform('feed', f);
  })

  return pass;
}

export function rdTextMix(
  textCanvas: HTMLCanvasElement,
  seedTexture: WebGLTexture,
  gl: WebGLRenderingContext,
) {

  const coverScreen = clipspaceScreenTri(gl);

  const canvTex = canvasTexture(gl, textCanvas);

  const mouseFollower = new GlobalMousePositionListener(0.05, gl.canvas as HTMLCanvasElement);

  const imageBlur = imageBlurPass(
    gl,
    coverScreen,
    40,
    Math.floor(512),
    Math.floor(512),
  );

  const rd = rdPass(gl, seedTexture, coverScreen, 1024, 1024);
  const halftone = rdMixPass(gl, textCanvas, coverScreen, window.innerWidth, window.innerWidth);

  for(let i = 0; i < 50; ++i) {
    rd.render();
  }

  imageBlur.blurV.setUniform('map', canvTex);
  imageBlur.blurH.setUniform('map', canvTex);
  imageBlur.chain.render();

  const start = Date.now();
  imageBlur.chain.addUpdateFunction(() => {
    const t = (Date.now() - start) / 10000.0;
    const mfp = mouseFollower.mousePositions.normalizedMouseFollowingPosition;
    imageBlur.blurH.setUniform('mfp', mfp.data);
    imageBlur.blurV.setUniform('mfp', mfp.data);
    imageBlur.blurV.setUniform('time', t);
    imageBlur.blurH.setUniform('time', t);
  });


  // rdMix.addUpdateFunction(() => {
  //   for(let i = 0; i < 50; ++i) {
  //     rd.render();
  //   }
  // })

  halftone.setUniform('map', canvTex);
  halftone.linkPassToUniform(rd, 'dotMap');
  halftone.linkPassToUniform(imageBlur.chain, 'blurMap');

  const chain = new ShaderChain([imageBlur.chain, halftone]);
  chain.outputPass = halftone;

  return chain;
}
