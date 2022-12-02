import { slugify } from "../stringUtil";
import { TextureEditorSettings } from "../konva/TextureEditor";
import { ModelViewerSettings } from "../ModelViewer";
import { publicUrl } from "../viteUtil";
import { Model } from "./types";

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
    textures: [{ index: 0, filename: "grenade_0.png", width: 40, height: 44 }],
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
      { index: 0, filename: "missile_0.png", width: 288, height: 195 },
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
export const backpack: Item = {
  category: "Misc",
  name: "Backpack",
  id: "backpack",
  model: {
    filename: "backpack.gltf",
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
    textures: [
      { index: 0, filename: "+3_med100.png", width: 240, height: 240 },
      { index: 1, filename: "med100.png", width: 240, height: 240 },
    ],
  },
  viewerOrientation: 45,
};
const LargeHealth = {
  category: "Health packs",
  name: "Large Health",
  id: "Large Health",
  model: {
    filename: "bh25.gltf",
    textures: [
      { index: 0, filename: "+0_med25s.png", width: 32, height: 16 },
      { index: 1, filename: "+0_med25.png", width: 32, height: 32 },
    ],
  },
  viewerOrientation: 45,
};
const SmallHealth = {
  category: "Health packs",
  name: "Small Health",
  id: "Small Health",
  model: {
    filename: "bh10.gltf",
    textures: [
      { index: 0, filename: "med3_1.png", width: 32, height: 16 },
      { index: 1, filename: "med3_0.png", width: 32, height: 32 },
    ],
  },
  viewerOrientation: 45,
};
export const healthPacks: Item[] = [SmallHealth, LargeHealth, MegaHealth];

// ammo
const SmallShells = {
  category: "Ammo",
  name: "Shells (small)",
  id: "Shells (small)",
  model: {
    filename: "shell0.gltf",
    textures: [
      { index: 0, filename: "shot0sid.png", width: 32, height: 32 },
      { index: 1, filename: "shot0top.png", width: 32, height: 32 },
    ],
  },
  viewerOrientation: 45,
};
const LargeShells = {
  category: "Ammo",
  name: "Shells (large)",
  id: "Shells (large)",
  model: {
    filename: "shell1.gltf",
    textures: [
      { index: 0, filename: "shot1sid.png", width: 32, height: 32 },
      { index: 1, filename: "shot1top.png", width: 32, height: 32 },
    ],
  },
  viewerOrientation: 45,
};
const SmallNails = {
  category: "Ammo",
  name: "Nails (small)",
  id: "Nails (small)",
  model: {
    filename: "nail0.gltf",
    textures: [
      { index: 0, filename: "nail0sid.png", width: 32, height: 32 },
      { index: 1, filename: "nail0top.png", width: 32, height: 32 },
    ],
  },
  viewerOrientation: 45,
};
const LargeNails = {
  category: "Ammo",
  name: "Nails (large)",
  id: "Nails (large)",
  model: {
    filename: "nail1.gltf",
    textures: [
      { index: 0, filename: "nail1sid.png", width: 32, height: 32 },
      { index: 1, filename: "nail1top.png", width: 32, height: 32 },
    ],
  },
  viewerOrientation: 45,
};
const SmallRockets = {
  category: "Ammo",
  name: "Rockets (small)",
  id: "Rockets (small)",
  model: {
    filename: "rock0.gltf",
    textures: [
      { index: 1, filename: "rock0sid.png", width: 32, height: 16 },
      { index: 0, filename: "rockettop.png", width: 16, height: 16 },
    ],
  },
  viewerOrientation: 45,
};
const LargeRockets = {
  category: "Ammo",
  name: "Rockets (large)",
  id: "Rockets (large)",
  model: {
    filename: "rock1.gltf",
    textures: [
      { index: 0, filename: "rock1sid.png", width: 32, height: 16 },
      { index: 1, filename: "rockettop.png", width: 16, height: 16 },
    ],
  },
  viewerOrientation: 45,
};
const SmallCells = {
  category: "Ammo",
  name: "Cells (small)",
  id: "Cells (small)",
  model: {
    filename: "batt0.gltf",
    textures: [
      { index: 0, filename: "batt1sid.png", width: 32, height: 32 },
      { index: 1, filename: "batt0top.png", width: 32, height: 32 },
    ],
  },
  viewerOrientation: 45,
};
const LargeCells = {
  category: "Ammo",
  name: "Cells (large)",
  id: "Cells (large)",
  model: {
    filename: "batt1.gltf",
    textures: [
      { index: 0, filename: "batt0sid.png", width: 32, height: 32 },
      { index: 1, filename: "batt1top.png", width: 32, height: 32 },
    ],
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
