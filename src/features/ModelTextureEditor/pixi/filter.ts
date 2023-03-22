export interface FilterInput {
  enabled: boolean;
  defaultValue: number;
  minValue: number;
  maxValue: number;
  value: number;
}

export class BlurFilterInput implements FilterInput {
  enabled = false;
  defaultValue = 4;
  minValue = 0;
  maxValue = 16;
  value = this.defaultValue;
}

export class BrightnessFilterInput implements FilterInput {
  enabled = false;
  defaultValue = 1;
  minValue = 0;
  maxValue = 5;
  value = this.defaultValue;
}

export class ContrastFilterInput implements FilterInput {
  enabled = false;
  defaultValue = 1;
  minValue = 0;
  maxValue = 5;
  value = this.defaultValue;
}

export class HueFilterInput implements FilterInput {
  enabled = false;
  defaultValue = 0;
  minValue = -180;
  maxValue = 180;
  value = this.defaultValue;
  colorize = false;
}

export class SaturationFilterInput implements FilterInput {
  enabled = false;
  defaultValue = 0;
  minValue = -1;
  maxValue = 1;
  value = this.defaultValue;
}

export class LightnessFilterInput implements FilterInput {
  enabled = false;
  defaultValue = 0;
  minValue = -1;
  maxValue = 1;
  value = this.defaultValue;
}

export type FilterInputs = {
  blur: BlurFilterInput;
  hue: HueFilterInput;
  saturation: SaturationFilterInput;
  lightness: LightnessFilterInput;
  brightness: BrightnessFilterInput;
  contrast: ContrastFilterInput;
};

export function getDefaultFilterInputs(): FilterInputs {
  return {
    hue: new HueFilterInput(),
    saturation: new SaturationFilterInput(),
    lightness: new LightnessFilterInput(),
    contrast: new ContrastFilterInput(),
    brightness: new BrightnessFilterInput(),
    blur: new BlurFilterInput(),
  };
}
