export interface CssFilter {
  readonly name: string;
  readonly defaultValue: number;
  readonly minValue: number;
  readonly maxValue: number;
  value: number;
  enabled: boolean;

  toString(): string;
}

export class Blur implements CssFilter {
  name = "blur";
  defaultValue = 0;
  minValue = 0;
  maxValue = 16;
  value = this.defaultValue;
  enabled = false;

  public toString(): string {
    return `${this.name}(${this.value}px)`;
  }
}

export class Brightness implements CssFilter {
  name = "brightness";
  defaultValue = 100;
  minValue = 0;
  maxValue = 500;
  value = this.defaultValue;
  enabled = false;

  public toString(): string {
    return `${this.name}(${this.value}%)`;
  }
}

export class Contrast implements CssFilter {
  name = "contrast";
  defaultValue = 0;
  minValue = 0;
  maxValue = 500;
  value = this.defaultValue;
  enabled = false;

  public toString(): string {
    return `${this.name}(${this.value})%`;
  }
}

export class Grayscale implements CssFilter {
  name = "grayscale";
  defaultValue = 0;
  minValue = 0;
  maxValue = 100;
  value = this.defaultValue;
  enabled = false;

  public toString(): string {
    return `${this.name}(${this.value})%`;
  }
}

export class HUE implements CssFilter {
  name = "hue-rotate";
  defaultValue = 0;
  minValue = 0;
  maxValue = 360;
  value = this.defaultValue;
  enabled = false;

  public toString(): string {
    return `${this.name}(${this.value}deg)`;
  }
}

export class Invert implements CssFilter {
  name = "invert";
  defaultValue = 0;
  minValue = 0;
  maxValue = 100;
  value = this.defaultValue;
  enabled = false;

  public toString(): string {
    return `${this.name}(${this.value}%)`;
  }
}

export class Opacity implements CssFilter {
  name = "opacity";
  defaultValue = 0;
  minValue = 0;
  maxValue = 100;
  value = this.defaultValue;
  enabled = false;

  public toString(): string {
    return `${this.name}(${this.value}%)`;
  }
}

export class Saturation implements CssFilter {
  name = "saturate";
  defaultValue = 100;
  minValue = 0;
  maxValue = 1000;
  value = this.defaultValue;
  enabled = false;

  public toString(): string {
    return `${this.name}(${this.value}%)`;
  }
}

export interface CssFilterSettings {
  blur: Blur;
  grayscale: Grayscale;
  hue: HUE;
  saturation: Saturation;
  brightness: Brightness;
  contrast: Contrast;
  opacity: Opacity;
  invert: Invert;
}
