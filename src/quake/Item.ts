import { publicUrl, slugify } from "../components/util";
import { TextureEditorSettings } from "../konva/TextureEditor";
import { ModelViewerSettings } from "../components/ModelViewer";

// import playerGLTF from "../models/rock1.gltf?raw";
//
// export interface gltfInfo {
//   model: string;
//   textures: string[];
// }
//
// export function parseGLTF(gltf: string) {
//   const model = JSON.parse(gltf);
//
//   const result = [];
//
//   for (let index = 0; index < model.materials.length; index++) {
//     const textureIndex =
//       model.materials[index].pbrMetallicRoughness.baseColorTexture.index;
//
//     result.push({
//       materialIndex: index,
//       destName: model.materials[index].name.split(" ")[1],
//       sourceURI: model.images[textureIndex].uri,
//     });
//   }
//
//   console.log(result);
// }
//
// parseGLTF(playerGLTF);

// interfaces
export interface Texture {
  index: number;
  filename: string;
  width: number;
  height: number;
}

export interface Model {
  filename: string;
  textures: Texture[];
}

export interface Item {
  name: string;
  id: string;
  category: string;
  model: Model;
  viewerOrientation: number;
}

export function modelFilenamePath(filename: string): string {
  return publicUrl(`/assets/models/${filename}`);
}

// methods

export function itemToEditorSettings(item: Item): TextureEditorSettings[] {
  return item.model.textures.map((texture) => ({
    containerID: slugify(`editor ${texture.filename}`),
    texturePath: modelFilenamePath(texture.filename),
    width: texture.width,
    height: texture.height,
  }));
}

export function itemToViewerSettings(item: Item): ModelViewerSettings {
  return {
    containerID: slugify(`viewer ${item.id}`),
    modelPath: modelFilenamePath(item.model.filename),
    texturePath: modelFilenamePath(item.model.textures[0].filename),
  };
}

function createArmorItem(name: string, textureNumber: number): Item {
  return {
    category: "Armors",
    name,
    id: slugify(name),
    model: {
      filename: "armor.gltf",
      textures: [
        {
          index: 0,
          filename: `armor_${textureNumber}.png`,
          width: 184,
          height: 76,
        },
      ],
    },
    viewerOrientation: 45,
  };
}

// armors
const GreenArmor: Item = createArmorItem("Green Armor", 0);
const YellowArmor = createArmorItem("Yellow Armor", 1);
const RedArmor = createArmorItem("Red Armor", 2);
export const armors: Item[] = [GreenArmor, YellowArmor, RedArmor];

// Units
export const player: Item = {
  category: "Units",
  name: "Player",
  id: "player",
  model: {
    filename: "player.gltf",
    textures: [{ index: 0, filename: "player_0.png", width: 296, height: 194 }],
  },
  viewerOrientation: 45,
};

// weapon models
const weaponOrientation = 45;
const SuperShotgun: Item = {
  category: "Weapons",
  name: "Super Shotgun",
  id: "super_shotgun",
  model: {
    filename: "g_shot.gltf",
    textures: [{ index: 0, filename: "g_shot_0.png", width: 232, height: 132 }],
  },
  viewerOrientation: weaponOrientation,
};

const NailGun: Item = {
  category: "Weapons",
  name: "Nailgun",
  id: "nailgun",
  model: {
    filename: "g_nail.gltf",
    textures: [{ index: 0, filename: "g_nail_0.png", width: 308, height: 94 }],
  },
  viewerOrientation: weaponOrientation,
};

const SuperNailGun: Item = {
  category: "Weapons",
  name: "Super Nailgun",
  id: "super_nailgun",
  model: {
    filename: "g_nail2.gltf",
    textures: [{ index: 0, filename: "g_nail2_0.png", width: 308, height: 79 }],
  },
  viewerOrientation: weaponOrientation,
};

const GrenadeLauncher: Item = {
  category: "Weapons",
  name: "Grenade Launcher",
  id: "grenade_launcher",
  model: {
    filename: "g_rock.gltf",
    textures: [{ index: 0, filename: "g_rock_0.png", width: 224, height: 195 }],
  },
  viewerOrientation: weaponOrientation,
};

const RocketLauncher: Item = {
  category: "Weapons",
  name: "Rocket Launcher",
  id: "rocket_launcher",
  model: {
    filename: "g_rock2.gltf",
    textures: [
      { index: 0, filename: "g_rock2_0.png", width: 232, height: 156 },
    ],
  },
  viewerOrientation: weaponOrientation,
};

const LightningGun: Item = {
  category: "Weapons",
  name: "Lightning Gun",
  id: "lightning_gun",
  model: {
    filename: "g_light.gltf",
    textures: [
      { index: 0, filename: "g_light_0.png", width: 308, height: 144 },
    ],
  },
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

// projectiles
const Grenade: Item = {
  category: "Projectiles",
  name: "Grenade",
  id: "grenade",
  model: {
    filename: "grenade.gltf",
    textures: [
      { index: 0, filename: "grenade_light_0.png", width: 40, height: 44 },
    ],
  },
  viewerOrientation: 90,
};

const Rocket: Item = {
  category: "Projectiles",
  name: "Missile",
  id: "missile",
  model: {
    filename: "missile.gltf",
    textures: [
      { index: 0, filename: "missile_light_0.png", width: 288, height: 195 },
    ],
  },
  viewerOrientation: 90,
};
export const projectiles: Item[] = [Grenade, Rocket];

// powerups
const Quad: Item = {
  category: "Powerups",
  name: "Quad",
  id: "quad",
  model: {
    filename: "quaddama.gltf",
    textures: [
      { index: 0, filename: "quaddama_0.png", width: 308, height: 121 },
    ],
  },
  viewerOrientation: 30,
};
const Pent: Item = {
  category: "Powerups",
  name: "Pent",
  id: "pent",
  model: {
    filename: "invulner.gltf",
    textures: [
      { index: 0, filename: "invulner_0.png", width: 308, height: 67 },
    ],
  },
  viewerOrientation: 30,
};
const Ring: Item = {
  category: "Powerups",
  name: "Ring",
  id: "ring",
  model: {
    filename: "invisibl.gltf",
    textures: [
      { index: 0, filename: "invisibl_0.png", width: 104, height: 52 },
    ],
  },
  viewerOrientation: 30,
};
export const powerups: Item[] = [Quad, Pent, Ring];

// misc
export const backpack = {
  category: "Misc",
  name: "Backpack",
  id: "backpack",
  model: {
    textures: [
      { index: 0, filename: "backpack_0.png", width: 152, height: 108 },
    ],
  },
  viewerOrientation: 30,
};

// health packs
const MegaHealth = {
  category: "Health packs",
  name: "Mega Health",
  id: "Mega Health",
  model: {
    filename: "bh100.gltf",
    textures: [{ index: 0, filename: "", width: 32, height: 32 }],
  },
  viewerOrientation: 45,
};
const LargeHealth = {
  category: "Health packs",
  name: "Large Health",
  id: "Large Health",
  model: {
    filename: "bh25.gltf",
    textures: [{ index: 0, filename: "", width: 32, height: 16 }],
  },
  viewerOrientation: 45,
};
const SmallHealth = {
  category: "Health packs",
  name: "Small Health",
  id: "Small Health",
  model: {
    filename: "bh10.gltf",
    textures: [{ index: 0, filename: "", width: 32, height: 16 }],
  },
  viewerOrientation: 45,
};
export const healthPacks: Item[] = [SmallHealth, LargeHealth, MegaHealth];

// ammo
const SmallShells = {
  category: "Ammo",
  name: "Small shells pack",
  id: "Small shells pack",
  model: {
    filename: "shell0.gltf",
    textures: [{ filename: "shell0.png", index: 0, width: 32, height: 32 }],
  },
  viewerOrientation: 45,
};
const LargeShells = {
  category: "Ammo",
  name: "Large shells pack",
  id: "Large shells pack",
  model: {
    filename: "shell1.gltf",
    textures: [{ filename: "shell1.png", index: 0, width: 32, height: 32 }],
  },
  viewerOrientation: 45,
};
const SmallNails = {
  category: "Ammo",
  name: "Small nails pack",
  id: "Small nails pack",
  model: {
    filename: "nail0.gltf",
    textures: [{ filename: "nail0.png", index: 0, width: 32, height: 32 }],
  },
  viewerOrientation: 45,
};
const LargeNails = {
  category: "Ammo",
  name: "Large nails pack",
  id: "Large nails pack",
  model: {
    filename: "nail1.gltf",
    textures: [{ filename: "nail1.png", index: 0, width: 32, height: 32 }],
  },
  viewerOrientation: 45,
};
const SmallRockets = {
  category: "Ammo",
  name: "Small rockets pack",
  id: "Small rockets pack",
  model: {
    filename: "rock0.gltf",
    textures: [{ filename: "rock0.png", index: 2, width: 32, height: 16 }],
  },
  viewerOrientation: 45,
};
const LargeRockets = {
  category: "Ammo",
  name: "Large rockets pack",
  id: "Large rockets pack",
  model: {
    filename: "rock1.gltf",
    textures: [{ filename: "rock1.png", index: 0, width: 32, height: 16 }],
  },
  viewerOrientation: 45,
};
const SmallCells = {
  category: "Ammo",
  name: "Small cells pack",
  id: "Small cells pack",
  model: {
    filename: "batt0.gltf",
    textures: [{ filename: "batt0.png", index: 0, width: 32, height: 32 }],
  },
  viewerOrientation: 45,
};
const LargeCells = {
  category: "Ammo",
  name: "Large cells pack",
  id: "Large cells pack",
  model: {
    filename: "batt1.gltf",
    textures: [{ filename: "batt1.png", index: 0, width: 32, height: 32 }],
  },
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
