import { useEffect, useRef } from "react";
import WebFont from 'webfontloader';
import {GLCanvas, loadTexture} from "tiny-shader-lib";
import {rdTextMix} from "./backgrounds/rdTextMix";
import halftoneBackground from "./backgrounds/halftoneBackground";
import {rippleBackground} from "./backgrounds/rippleBackground";
import {GlobalMousePositionListener} from "./hooks/useGlobalMousePosition";

const createCanvas = (size: number) => {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', size.toString());
  canvas.setAttribute('height', size.toString());
  return canvas;
}

const textCanvas = (size: number) => {
  const canvas = createCanvas(size);
  const textCtx = canvas.getContext('2d');

  if(!textCtx) return null;

  textCtx.font = '800 150px Raleway';
  textCtx.textBaseline = 'middle';

  //@ts-ignore
  textCtx.fillStyle = '#FFFFFF';
  textCtx.fillRect(0,0, size, size);
  textCtx.fillStyle = '#000000';

  textCtx.textAlign = 'left';
  textCtx.fillText(
    "Ben",
    50,
    size/2 - 75,
  );

  textCtx.textAlign = 'right';
  textCtx.fillText(
    "Jack",
    size - 60,
    size/2 + 75,
  );

  return canvas;
}

// replace with pre-rendered reaction-diffusion image
const seedCanvas = (size: number) => {
  const canvas = createCanvas(size);
  const ctx = canvas.getContext('2d');

  if(!ctx) return;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.fillStyle = '#FF0000';
  ctx.fillRect(0,0, width, height);
  ctx.fillStyle = '#FFFF00';

  for(let i = 0; i < 10; ++i) {
    for(let j = 0; j < 10; ++j){
      ctx.fillRect(width/10 * i, height/10 * j, 10, 10);
    }
  }

  return canvas;
}

const seedTexture = (gl: WebGLRenderingContext | WebGL2RenderingContext) => {
  return loadTexture(gl, '/images/reactionDiffusion1.jpg');
}

const Btj = () => {
  const glCanvas = useRef<HTMLCanvasElement>(null);
  const halftoneCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let anim: number;

    const loadFonts = new Promise((resolve) => {
      WebFont.load({
        google: {
          families: ['Raleway']
        },
        active: () => {
         resolve(null);
        }
      });
    });

    loadFonts.then(async () => {
      if(!glCanvas.current) return;
      // if(!halftoneCanvas.current) return;

      const shaderCanvas = new GLCanvas(glCanvas.current);
      // const halftoneGLCanvas = new GLCanvas(halftoneCanvas.current);

      const textLayer = textCanvas(512);
      if(!textLayer) return;

      const seedTex = await seedTexture(shaderCanvas.gl);

      // const mouseFollower = new GlobalMousePositionListener(0.15);

      const bg = rdTextMix(
        textLayer,
        seedTex,
        shaderCanvas.gl,
        1024,
        1024
      );

      // const hfbg = rippleBackground(
      //   halftoneCanvas.current,
      //   halftoneGLCanvas.gl,
      //   mouseFollower
      // );

      let anim: number;
      const render = () => {
        bg.render({ renderToScreen: true });
        // hfbg.render({ renderToScreen: true });
        anim = requestAnimationFrame(render);
      }

      anim = requestAnimationFrame(render);
    })

    return () => cancelAnimationFrame(anim);
  }, []);

  return (
      <div className="flex w-full h-screen justify-center items-center">
        <canvas className="w-[512px] h-[512px]" ref={glCanvas} />
      </div>
);
}

export default Btj;