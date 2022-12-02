import { slugify } from "../../pkg/stringUtil";
import { TextureEditorSettings } from "../../pkg/konva/TextureEditor";
import { ModelViewerSettings } from "../../pkg/ModelViewer";
import { publicUrl } from "../../pkg/viteUtil";
import * as quakeModels from "../../pkg/quake/models";
import { Model } from "../../pkg/quake/models";

// types
export interface Item {
  id: string;
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
    containerID: slugify(`viewer ${item.id}`),
    modelPath: modelFilenamePath(item.model.filename),
    texturePath: modelFilenamePath(item.model.textures[0].filename),
  };
}

// items
const GreenArmor: Item = {
  category: "Armors",
  id: slugify(quakeModels.GreenArmor.name),
  model: quakeModels.GreenArmor,
  viewerOrientation: 45,
};
const YellowArmor = {
  category: "Armors",
  id: slugify("Yellow Armor"),
  model: quakeModels.YellowArmor,
  viewerOrientation: 45,
};
const RedArmor = {
  category: "Armors",
  id: slugify(quakeModels.RedArmor.name),
  model: quakeModels.RedArmor,
  viewerOrientation: 45,
};
export const armors: Item[] = [GreenArmor, YellowArmor, RedArmor];

// Units
export const player: Item = {
  category: "Units",
  id: slugify(quakeModels.Player.name),
  model: quakeModels.Player,
  viewerOrientation: 45,
};

// weapon models
const weaponOrientation = 45;

const SuperShotgun: Item = {
  category: "Weapons",
  id: slugify(quakeModels.SuperShotgun.name),
  model: quakeModels.SuperShotgun,
  viewerOrientation: weaponOrientation,
};

const NailGun: Item = {
  category: "Weapons",
  id: slugify(quakeModels.Nailgun.name),
  model: quakeModels.Nailgun,
  viewerOrientation: weaponOrientation,
};

const SuperNailGun: Item = {
  category: "Weapons",
  id: slugify(quakeModels.SuperNailgun.name),
  model: quakeModels.SuperNailgun,
  viewerOrientation: weaponOrientation,
};

const GrenadeLauncher: Item = {
  category: "Weapons",
  id: slugify(quakeModels.GrenadeLauncher.name),
  model: quakeModels.GrenadeLauncher,
  viewerOrientation: weaponOrientation,
};

const RocketLauncher: Item = {
  category: "Weapons",
  id: slugify(quakeModels.RocketLauncher.name),
  model: quakeModels.RocketLauncher,
  viewerOrientation: weaponOrientation,
};

const LightningGun: Item = {
  category: "Weapons",
  id: slugify(quakeModels.LightningGun.name),
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
  id: slugify(quakeModels.Grenade.name),
  model: quakeModels.Grenade,
  viewerOrientation: 90,
};

const Missile: Item = {
  category: "Projectiles",
  id: slugify(quakeModels.Missile.name),
  model: quakeModels.Missile,
  viewerOrientation: 90,
};
export const projectiles: Item[] = [Grenade, Missile];

const Quad: Item = {
  category: "Powerups",
  id: slugify(quakeModels.Quad.name),
  model: quakeModels.Quad,
  viewerOrientation: 30,
};
const Pent: Item = {
  category: "Powerups",
  id: slugify(quakeModels.Pent.name),
  model: quakeModels.Pent,
  viewerOrientation: 30,
};
const Ring: Item = {
  category: "Powerups",
  id: slugify(quakeModels.Ring.name),
  model: quakeModels.Ring,
  viewerOrientation: 30,
};

export const powerups: Item[] = [Quad, Pent, Ring];

// misc

export const backpack: Item = {
  category: "Misc",
  id: slugify(quakeModels.Backpack.name),
  model: quakeModels.Backpack,
  viewerOrientation: 30,
};

// health packs

const MegaHealth = {
  category: "Health packs",
  id: slugify(quakeModels.MegaHealth.name),
  model: quakeModels.MegaHealth,
  viewerOrientation: 45,
};

const LargeHealth = {
  category: "Health packs",
  id: slugify(quakeModels.HealthLarge.name),
  model: quakeModels.HealthLarge,
  viewerOrientation: 45,
};

const SmallHealth = {
  category: "Health packs",
  id: slugify(quakeModels.HealthSmall.name),
  model: quakeModels.HealthSmall,
  viewerOrientation: 45,
};

export const healthPacks: Item[] = [SmallHealth, LargeHealth, MegaHealth];

// ammo

const SmallShells = {
  category: "Ammo",
  id: slugify(quakeModels.ShellsSmall.name),
  model: quakeModels.ShellsSmall,
  viewerOrientation: 45,
};

const LargeShells = {
  category: "Ammo",
  id: slugify(quakeModels.ShellsLarge.name),
  model: quakeModels.ShellsLarge,
  viewerOrientation: 45,
};

const SmallNails = {
  category: "Ammo",
  id: slugify(quakeModels.NailsSmall.name),
  model: quakeModels.NailsSmall,
  viewerOrientation: 45,
};

const LargeNails = {
  category: "Ammo",
  id: slugify(quakeModels.NailsLarge.name),
  model: quakeModels.NailsLarge,
  viewerOrientation: 45,
};

const SmallRockets = {
  category: "Ammo",
  id: slugify(quakeModels.RocketsSmall.name),
  model: quakeModels.RocketsSmall,
  viewerOrientation: 45,
};

const LargeRockets = {
  category: "Ammo",
  id: slugify(quakeModels.RocketsLarge.name),
  model: quakeModels.RocketsLarge,
  viewerOrientation: 45,
};

const SmallCells = {
  category: "Ammo",
  id: slugify(quakeModels.CellsSmall.name),
  model: quakeModels.CellsSmall,
  viewerOrientation: 45,
};

const LargeCells = {
  category: "Ammo",
  id: slugify(quakeModels.CellsLarge.name),
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
