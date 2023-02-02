export interface FilterInput {
  name: string;
  enabled: boolean;
  defaultValue: number;
  minValue: number;
  maxValue: number;
  value: number;
}

export class BlurFilterInput implements FilterInput {
  name = "blur";
  enabled = false;
  defaultValue = 0;
  minValue = 0;
  maxValue = 16;
  value = this.defaultValue;
}

export class BrightnessFilterInput implements FilterInput {
  name = "brightness";
  enabled = false;
  defaultValue = 1;
  minValue = 0;
  maxValue = 5;
  value = this.defaultValue;
}

export class ContrastFilterInput implements FilterInput {
  name = "contrast";
  enabled = false;
  defaultValue = 1;
  minValue = 0;
  maxValue = 5;
  value = this.defaultValue;
}

export class HueFilterInput implements FilterInput {
  name = "hue-rotate";
  enabled = false;
  defaultValue = 0;
  minValue = 0;
  maxValue = 360;
  value = this.defaultValue;
  colorize = false;
}

export class SaturationFilterInput implements FilterInput {
  name = "saturation";
  enabled = false;
  defaultValue = 1;
  minValue = 0;
  maxValue = 5;
  value = this.defaultValue;
}

export type FilterInputs = {
  blur: BlurFilterInput;
  hue: HueFilterInput;
  saturation: SaturationFilterInput;
  brightness: BrightnessFilterInput;
  contrast: ContrastFilterInput;
};

export function getDefaultFilterInputs(): FilterInputs {
  return {
    blur: new BlurFilterInput(),
    hue: new HueFilterInput(),
    saturation: new SaturationFilterInput(),
    brightness: new BrightnessFilterInput(),
    contrast: new ContrastFilterInput(),
  };
}
