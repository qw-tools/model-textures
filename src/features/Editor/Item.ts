import { slugify } from "../../pkg/stringUtil";
import { TextureEditorSettings } from "../../pkg/konva/TextureEditor";
import { ModelViewerSettings } from "../../pkg/ModelViewer";
import { publicUrl } from "../../pkg/viteUtil";
import * as quakeModels from "../../pkg/quake/models";
import { Model } from "../../pkg/quake/models";

// types
export interface Item {
  category: string;
  model: Model;
  viewerOrientation: number;
}

export function modelFilenamePath(filename: string): string {
  return publicUrl(`/assets/models/${filename}`);
}

// methods
export function itemToEditorSettings(
  item: Item,
  editorHeight = 180
): TextureEditorSettings[] {
  return item.model.textures.map(function (texture) {
    const editorScale = editorHeight / texture.height;

    return {
      containerID: slugify(`editor ${item.model.filename} ${texture.filename}`),
      texturePath: modelFilenamePath(texture.filename),
      width: editorScale * texture.width,
      height: editorScale * texture.height,
    };
  });
}

export function itemToViewerSettings(item: Item): ModelViewerSettings {
  return {
    containerID: slugify(`viewer ${item.model.filename}`),
    modelPath: modelFilenamePath(item.model.filename),
    texturePath: modelFilenamePath(item.model.textures[0].filename),
  };
}

// items
const GreenArmor: Item = {
  category: "Armors",
  model: quakeModels.GreenArmor,
  viewerOrientation: 45,
};
const YellowArmor = {
  category: "Armors",
  model: quakeModels.YellowArmor,
  viewerOrientation: 45,
};
const RedArmor = {
  category: "Armors",
  model: quakeModels.RedArmor,
  viewerOrientation: 45,
};
export const armors: Item[] = [GreenArmor, YellowArmor, RedArmor];

// Units
export const player: Item = {
  category: "Units",
  model: quakeModels.Player,
  viewerOrientation: 45,
};

// weapon models
const weaponOrientation = 45;

const SuperShotgun: Item = {
  category: "Weapons",
  model: quakeModels.SuperShotgun,
  viewerOrientation: weaponOrientation,
};

const NailGun: Item = {
  category: "Weapons",
  model: quakeModels.Nailgun,
  viewerOrientation: weaponOrientation,
};

const SuperNailGun: Item = {
  category: "Weapons",
  model: quakeModels.SuperNailgun,
  viewerOrientation: weaponOrientation,
};

const GrenadeLauncher: Item = {
  category: "Weapons",
  model: quakeModels.GrenadeLauncher,
  viewerOrientation: weaponOrientation,
};

const RocketLauncher: Item = {
  category: "Weapons",
  model: quakeModels.RocketLauncher,
  viewerOrientation: weaponOrientation,
};

const LightningGun: Item = {
  category: "Weapons",
  model: quakeModels.LightningGun,
  viewerOrientation: weaponOrientation,
};

export const weapons: Item[] = [
  SuperShotgun,
  NailGun,
  SuperNailGun,
  GrenadeLauncher,
  RocketLauncher,
  LightningGun,
];

const Grenade: Item = {
  category: "Projectiles",
  model: quakeModels.Grenade,
  viewerOrientation: 90,
};

const Missile: Item = {
  category: "Projectiles",
  model: quakeModels.Missile,
  viewerOrientation: 90,
};
export const projectiles: Item[] = [Grenade, Missile];

const Quad: Item = {
  category: "Powerups",
  model: quakeModels.Quad,
  viewerOrientation: 30,
};
const Pent: Item = {
  category: "Powerups",
  model: quakeModels.Pent,
  viewerOrientation: 30,
};
const Ring: Item = {
  category: "Powerups",
  model: quakeModels.Ring,
  viewerOrientation: 30,
};

export const powerups: Item[] = [Quad, Pent, Ring];

// misc

export const backpack: Item = {
  category: "Misc",
  model: quakeModels.Backpack,
  viewerOrientation: 30,
};

// health packs

const MegaHealth = {
  category: "Health packs",
  model: quakeModels.MegaHealth,
  viewerOrientation: 45,
};

const LargeHealth = {
  category: "Health packs",
  model: quakeModels.HealthLarge,
  viewerOrientation: 45,
};

const SmallHealth = {
  category: "Health packs",
  model: quakeModels.HealthSmall,
  viewerOrientation: 45,
};

export const healthPacks: Item[] = [SmallHealth, LargeHealth, MegaHealth];

// ammo

const SmallShells = {
  category: "Ammo",
  model: quakeModels.ShellsSmall,
  viewerOrientation: 45,
};

const LargeShells = {
  category: "Ammo",
  model: quakeModels.ShellsLarge,
  viewerOrientation: 45,
};

const SmallNails = {
  category: "Ammo",
  model: quakeModels.NailsSmall,
  viewerOrientation: 45,
};

const LargeNails = {
  category: "Ammo",
  model: quakeModels.NailsLarge,
  viewerOrientation: 45,
};

const SmallRockets = {
  category: "Ammo",
  model: quakeModels.RocketsSmall,
  viewerOrientation: 45,
};

const LargeRockets = {
  category: "Ammo",
  model: quakeModels.RocketsLarge,
  viewerOrientation: 45,
};

const SmallCells = {
  category: "Ammo",
  model: quakeModels.CellsSmall,
  viewerOrientation: 45,
};

const LargeCells = {
  category: "Ammo",
  model: quakeModels.CellsLarge,
  viewerOrientation: 45,
};

export const ammo: Item[] = [
  SmallShells,
  LargeShells,
  SmallNails,
  LargeNails,
  SmallRockets,
  LargeRockets,
  SmallCells,
  LargeCells,
];
