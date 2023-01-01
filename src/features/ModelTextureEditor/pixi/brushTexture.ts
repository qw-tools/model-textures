import type { IRenderer } from "pixi.js";
import { Filter, RenderTexture, Sprite } from "pixi.js";
import { Brush } from "./types";
import { hex2rgb, string2hex } from "@pixi/utils";

const fragment = `
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
  const { size, color, smoothing } = settings;

  const filter = new Filter(undefined, fragment, {
    color: hex2rgb(string2hex(color)),
    size,
    smoothing,
  });

  const sprite = new Sprite();
  sprite.width = size;
  sprite.height = size;
  sprite.filters = [filter];

  const renderTexture = RenderTexture.create({ width: size, height: size });
  renderer.render(sprite, { renderTexture });
  return renderTexture;
}
