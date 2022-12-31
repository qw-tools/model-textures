import type { Renderer } from "pixi.js";
import { Filter, RenderTexture, Sprite } from "pixi.js";
import { BrushSettings } from "./types";
import { hex2rgb } from "@pixi/utils";

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

export default class BrushGenerator {
  _renderer: Renderer;

  constructor(renderer: Renderer) {
    this._renderer = renderer;
  }

  generate(settings: BrushSettings) {
    const { size, color, smoothing } = settings;

    const filter = new Filter(undefined, fragment, {
      color: hex2rgb(color),
      size: size,
      smoothing: smoothing,
    });

    const sprite = new Sprite();
    sprite.width = size;
    sprite.height = size;
    sprite.filters = [filter];

    const renderTexture = RenderTexture.create({ width: size, height: size });
    this._renderer.render(sprite, { renderTexture });
    return renderTexture;
  }
}
