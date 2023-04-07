import type { IRenderer } from "pixi.js";
import { Color, Filter, Graphics, RenderTexture, Sprite } from "pixi.js";
import { Brush } from "./brush";

const circleFragment = `
uniform float size;
uniform vec3 color;
uniform float smoothing;
void main(){
	vec2 uv = vec2(gl_FragCoord.xy) / size;
	float dst = distance(uv, vec2(0.5, 0.5)) * 2.;
	float alpha = max(0., 1. - dst);
	alpha = pow(alpha, smoothing);
	gl_FragColor = vec4(color, 1) * alpha;
}
`;

export function generateBrush(
  renderer: IRenderer,
  settings: Brush
): RenderTexture {
  const renderTexture = RenderTexture.create({
    width: settings.size,
    height: settings.size,
  });

  if (settings.shape === "circle") {
    const circleSprite = generateCircle(settings);
    renderer.render(circleSprite, { renderTexture });
  } else {
    const square = generateSquare(settings);
    renderer.render(square, { renderTexture });
  }
  return renderTexture;
}

function generateCircle(settings: Brush): Sprite {
  const { size, color, smoothing } = settings;
  const sprite = new Sprite();
  sprite.width = sprite.height = size;
  const circleFilter = new Filter(undefined, circleFragment, {
    color: new Color(color),
    size,
    smoothing,
  });

  sprite.filters = [circleFilter];
  return sprite;
}

function generateSquare(settings: Brush): Graphics {
  const { size, color } = settings;
  const graphics = new Graphics();
  graphics.beginFill(new Color(color));
  graphics.drawRect(0, 0, size, size);
  graphics.endFill();
  return graphics;
}
