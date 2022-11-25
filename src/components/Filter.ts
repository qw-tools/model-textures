import { Filter } from "konva/lib/Node";
import { Brighten } from "konva/lib/filters/Brighten";
import { Contrast } from "konva/lib/filters/Contrast";
import { HSV } from "konva/lib/filters/HSV";
import { Grayscale } from "konva/lib/filters/Grayscale";
import { Blur } from "konva/lib/filters/Blur";

export interface FilterSetting {
  filter: Filter;
  name: string;
  key: string;
  enabled: boolean;
  min: number;
  max: number;
  value: number;
}

export class HUEFilterSetting implements FilterSetting {
  filter = HSV;
  name = "HUE";
  key = "hue";
  enabled = false;
  min = 0;
  max = 360;
  value = 180;
}

export class SaturationFilterSetting implements FilterSetting {
  filter = HSV;
  name = "Saturation";
  key = "saturation";
  enabled = false;
  min = -5;
  max = 5;
  value = 0;
}

export class BrightnessFilterSetting implements FilterSetting {
  filter = Brighten;
  name = "Brightness";
  key = "brightness";
  enabled = false;
  min = -1;
  max = 1;
  value = 0;
}

export class BlurFilterSetting implements FilterSetting {
  filter = Blur;
  name = "Blur";
  key = "blur";
  enabled = false;
  min = 0;
  max = 18;
  value = 0;
}

export class ContrastFilterSetting implements FilterSetting {
  filter = Contrast;
  name = "Brightness";
  key = "brightness";
  enabled = false;
  min = -1;
  max = 1;
  value = 0;
}

export class GrayscaleFilterSetting implements FilterSetting {
  filter = Grayscale;
  name = "Grayscale";
  key = "grayscale";
  enabled = false;
  min = 0;
  max = 1;
  value = 0;
}

export interface FilterSettings {
  blur: BlurFilterSetting;
  grayscale: GrayscaleFilterSetting;
  hue: HUEFilterSetting;
  saturation: SaturationFilterSetting;
  brightness: BrightnessFilterSetting;
  contrast: ContrastFilterSetting;
}
