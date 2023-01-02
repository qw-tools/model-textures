export interface FilterInput {
  name: string;
  enabled: boolean;
  defaultValue: number;
  minValue: number;
  maxValue: number;
  value: number;
}

export class Blur implements FilterInput {
  name = "blur";
  enabled = false;
  defaultValue = 0;
  minValue = 0;
  maxValue = 16;
  value = this.defaultValue;
}

export class Brightness implements FilterInput {
  name = "brightness";
  enabled = false;
  defaultValue = 1;
  minValue = 0;
  maxValue = 5;
  value = this.defaultValue;
}

export class Contrast implements FilterInput {
  name = "contrast";
  enabled = false;
  defaultValue = 1;
  minValue = 0;
  maxValue = 5;
  value = this.defaultValue;
}

export class Hue implements FilterInput {
  name = "hue-rotate";
  enabled = false;
  defaultValue = 0;
  minValue = 0;
  maxValue = 360;
  value = this.defaultValue;
  colorize = false;
}

export class Saturation implements FilterInput {
  name = "saturation";
  enabled = false;
  defaultValue = 1;
  minValue = 0;
  maxValue = 5;
  value = this.defaultValue;
}

export type FilterInputs = {
  blur: Blur;
  hue: Hue;
  saturation: Saturation;
  brightness: Brightness;
  contrast: Contrast;
};

export function getDefaultFilterInputs(): FilterInputs {
  return {
    blur: new Blur(),
    hue: new Hue(),
    saturation: new Saturation(),
    brightness: new Brightness(),
    contrast: new Contrast(),
  };
}
