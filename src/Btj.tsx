import { ComponentProps, useEffect, useRef } from "react";
import WebFont from 'webfontloader';
import {GLCanvas, loadTexture} from "tiny-shader-lib";
import {rdTextMix} from "./backgrounds/rdTextMix";

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

  textCtx.font = '800 230px Raleway';
  textCtx.textBaseline = 'middle';

  //@ts-ignore
  textCtx.fillStyle = '#FFFFFF';
  textCtx.fillRect(0,0, size, size);
  textCtx.fillStyle = '#000000';
  textCtx.textAlign = 'center';

  textCtx.fillText(
    "Ben",
    size/2,
    size/2 - 95,
  );


  textCtx.fillText(
    "Jack",
    size/2,
    size/2 + 95,
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

type BtjProps = ComponentProps<'div'>;

const Btj = ({...props}: BtjProps) => {
  const glCanvas = useRef<HTMLCanvasElement>(null);

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
      const shaderCanvas = new GLCanvas(glCanvas.current);
      const textLayer = textCanvas(512);
      if(!textLayer) return;

      const seedTex = await seedTexture(shaderCanvas.gl);


      const bg = rdTextMix(
        textLayer,
        seedTex,
        shaderCanvas.gl
      );

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
    <div 
      {...props}
    >
      <div className="flex flex-col">
        <canvas className="max-w-[100vw] max-h-[100vw] w-[500px] h-[500px]" width={1024} height={1024} ref={glCanvas} />
        <span className="text-[#b2b2b2] text-4xl font-[Raleway] text-center w-full">Creative web development</span>
      </div>
    </div>
);
}

export default Btj;