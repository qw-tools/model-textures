import { publicUrl } from "../viteUtil";
import * as quakeModels from "./models";
import { Model, modelToId } from "./models";

// types
export interface Items {
  category: string;
  id: string;
  model: Model;
  viewerOrientation: number;
}

export function modelFilenamePath(filename: string): string {
  return publicUrl(`/assets/models/${filename}`);
}

// items
const GreenArmor: Items = {
  category: "Armors",
  id: modelToId(quakeModels.GreenArmor),
  model: quakeModels.GreenArmor,
  viewerOrientation: 45,
};
const YellowArmor = {
  category: "Armors",
  id: modelToId(quakeModels.YellowArmor),
  model: quakeModels.YellowArmor,
  viewerOrientation: 45,
};
const RedArmor = {
  category: "Armors",
  id: modelToId(quakeModels.RedArmor),
  model: quakeModels.RedArmor,
  viewerOrientation: 45,
};
export const armors: Items[] = [GreenArmor, YellowArmor, RedArmor];

// Units
export const player: Items = {
  category: "Units",
  id: modelToId(quakeModels.Player),
  model: quakeModels.Player,
  viewerOrientation: 45,
};

// weapon models
const weaponOrientation = 45;

const SuperShotgun: Items = {
  category: "Weapons",
  id: modelToId(quakeModels.SuperShotgun),
  model: quakeModels.SuperShotgun,
  viewerOrientation: weaponOrientation,
};

const NailGun: Items = {
  category: "Weapons",
  id: modelToId(quakeModels.Nailgun),
  model: quakeModels.Nailgun,
  viewerOrientation: weaponOrientation,
};

const SuperNailGun: Items = {
  category: "Weapons",
  id: modelToId(quakeModels.SuperNailgun),
  model: quakeModels.SuperNailgun,
  viewerOrientation: weaponOrientation,
};

const GrenadeLauncher: Items = {
  category: "Weapons",
  id: modelToId(quakeModels.GrenadeLauncher),
  model: quakeModels.GrenadeLauncher,
  viewerOrientation: weaponOrientation,
};

const RocketLauncher: Items = {
  category: "Weapons",
  id: modelToId(quakeModels.RocketLauncher),
  model: quakeModels.RocketLauncher,
  viewerOrientation: weaponOrientation,
};

const LightningGun: Items = {
  category: "Weapons",
  id: modelToId(quakeModels.LightningGun),
  model: quakeModels.LightningGun,
  viewerOrientation: weaponOrientation,
};

export const weapons: Items[] = [
  SuperShotgun,
  NailGun,
  SuperNailGun,
  GrenadeLauncher,
  RocketLauncher,
  LightningGun,
];

const Grenade: Items = {
  category: "Projectiles",
  id: modelToId(quakeModels.Grenade),
  model: quakeModels.Grenade,
  viewerOrientation: 90,
};

const Missile: Items = {
  category: "Projectiles",
  id: modelToId(quakeModels.Missile),
  model: quakeModels.Missile,
  viewerOrientation: 90,
};
export const projectiles: Items[] = [Grenade, Missile];

const Quad: Items = {
  category: "Powerups",
  id: modelToId(quakeModels.Quad),
  model: quakeModels.Quad,
  viewerOrientation: 30,
};
const Pent: Items = {
  category: "Powerups",
  id: modelToId(quakeModels.Pent),
  model: quakeModels.Pent,
  viewerOrientation: 30,
};
const Ring: Items = {
  category: "Powerups",
  id: modelToId(quakeModels.Ring),
  model: quakeModels.Ring,
  viewerOrientation: 30,
};

export const powerups: Items[] = [Quad, Pent, Ring];

// misc

export const backpack: Items = {
  category: "Misc",
  id: modelToId(quakeModels.Backpack),
  model: quakeModels.Backpack,
  viewerOrientation: 30,
};

// health packs

const MegaHealth = {
  category: "Health packs",
  id: modelToId(quakeModels.MegaHealth),
  model: quakeModels.MegaHealth,
  viewerOrientation: 45,
};

const LargeHealth = {
  category: "Health packs",
  id: modelToId(quakeModels.HealthLarge),
  model: quakeModels.HealthLarge,
  viewerOrientation: 45,
};

const SmallHealth = {
  category: "Health packs",
  id: modelToId(quakeModels.HealthSmall),
  model: quakeModels.HealthSmall,
  viewerOrientation: 45,
};

export const healthPacks: Items[] = [SmallHealth, LargeHealth, MegaHealth];

// ammo

const SmallShells = {
  category: "Ammo",
  id: modelToId(quakeModels.ShellsSmall),
  model: quakeModels.ShellsSmall,
  viewerOrientation: 45,
};

const LargeShells = {
  category: "Ammo",
  id: modelToId(quakeModels.ShellsLarge),
  model: quakeModels.ShellsLarge,
  viewerOrientation: 45,
};

const SmallNails = {
  category: "Ammo",
  id: modelToId(quakeModels.NailsSmall),
  model: quakeModels.NailsSmall,
  viewerOrientation: 45,
};

const LargeNails = {
  category: "Ammo",
  id: modelToId(quakeModels.NailsLarge),
  model: quakeModels.NailsLarge,
  viewerOrientation: 45,
};

const SmallRockets = {
  category: "Ammo",
  id: modelToId(quakeModels.RocketsSmall),
  model: quakeModels.RocketsSmall,
  viewerOrientation: 45,
};

const LargeRockets = {
  category: "Ammo",
  id: modelToId(quakeModels.RocketsLarge),
  model: quakeModels.RocketsLarge,
  viewerOrientation: 45,
};

const SmallCells = {
  category: "Ammo",
  id: modelToId(quakeModels.CellsSmall),
  model: quakeModels.CellsSmall,
  viewerOrientation: 45,
};

const LargeCells = {
  category: "Ammo",
  id: modelToId(quakeModels.CellsLarge),
  model: quakeModels.CellsLarge,
  viewerOrientation: 45,
};

export const ammo: Items[] = [
  SmallShells,
  LargeShells,
  SmallNails,
  LargeNails,
  SmallRockets,
  LargeRockets,
  SmallCells,
  LargeCells,
];

// runes
const RuneResistance = {
  category: "Runes",
  id: modelToId(quakeModels.RuneResistance),
  model: quakeModels.RuneResistance,
  viewerOrientation: 45,
};

const RuneHaste = {
  category: "Runes",
  id: modelToId(quakeModels.RuneHaste),
  model: quakeModels.RuneHaste,
  viewerOrientation: 45,
};

const RuneRegeneration = {
  category: "Runes",
  id: modelToId(quakeModels.RuneRegeneration),
  model: quakeModels.RuneRegeneration,
  viewerOrientation: 45,
};

const RuneStrength = {
  category: "Runes",
  id: modelToId(quakeModels.RuneStrength),
  model: quakeModels.RuneStrength,
  viewerOrientation: 45,
};

export const runes: Items[] = [
  RuneHaste,
  RuneRegeneration,
  RuneResistance,
  RuneStrength,
];
