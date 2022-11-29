import { publicUrl, slugify } from "../components/util";

export interface Texture {
  path: string;
  width: number;
  height: number;
}

export interface Model {
  path: string;
  texture: Texture;
}

export interface Item {
  name: string;
  id: string;
  category: string;
  model: Model;
}

// armors
function createArmorItem(name: string, textureIndex: number): Item {
  return {
    name,
    id: slugify(name),
    category: "Armors",
    model: {
      path: publicUrl("/assets/models/armorout.gltf"),
      texture: {
        path: publicUrl(`/assets/models/armorout0_tex0${textureIndex}.png`),
        width: 184,
        height: 76,
      },
    },
  };
}

const GreenArmor = createArmorItem("Green Armor", 0);
const YellowArmor = createArmorItem("Yellow Armor", 1);
const RedArmor = createArmorItem("Red Armor", 2);

export const armors: Item[] = [GreenArmor, YellowArmor, RedArmor];

// player skin
export const player = {
  name: "Player",
  id: "player",
  category: "Player Skins",
  model: {
    path: publicUrl("/assets/models/playerout.gltf"),
    texture: {
      path: publicUrl("/assets/models/playerout0_tex00.png"),
      width: 296,
      height: 194,
    },
  },
};

// weapon models

function createWeaponItem(
  itemName: string,
  modelName: string,
  width: number,
  height: number
): Item {
  return {
    name: itemName,
    id: slugify(itemName),
    category: "Weapons",
    model: {
      path: publicUrl(`/assets/models/${modelName}out.gltf`),
      texture: {
        path: publicUrl(`/assets/models/${modelName}out0_tex00.png`),
        width,
        height,
      },
    },
  };
}

const SuperShotgun = createWeaponItem("Super Shotgun", "g_shot", 232, 132);
const NailGun = createWeaponItem("Nailgun", "g_nail", 308, 94);
const SuperNailGun = createWeaponItem("Super Nailgun", "g_nail2", 308, 79);
const GrenadeLauncher = createWeaponItem(
  "Grenade Launcher",
  "g_rock",
  224,
  195
);
const RocketLauncher = createWeaponItem("Rocket Launcher", "g_rock", 232, 156);
const LightningGun = createWeaponItem("Lightning Gun", "g_light", 308, 144);

export const weapons: Item[] = [
  SuperShotgun,
  NailGun,
  SuperNailGun,
  GrenadeLauncher,
  RocketLauncher,
  LightningGun,
];
