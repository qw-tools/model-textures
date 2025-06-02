// types
import { slugify } from "../stringUtil";

export interface Texture {
  index: number;
  filename: string;
  destFilename?: string;
  width: number;
  height: number;
}

export interface Model {
  name: string;
  filename: string;
  textures: Texture[];
  textureDirPath: string;
  customTextureSets: string[];
}

export function modelToId(model: Model): string {
  const textureNames = model.textures.map((t) => t.filename).join(" ");
  return slugify(`${model.filename} ${textureNames}`);
}

// armors
export const GreenArmor: Model = {
  name: "Green Armor",
  filename: "armor.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "armor_0.png", width: 184, height: 76 }],
  customTextureSets: ["primevil", "qrp"],
};

export const YellowArmor: Model = {
  name: "Yellow Armor",
  filename: "armor.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "armor_1.png", width: 184, height: 76 }],
  customTextureSets: ["primevil", "qrp"],
};

export const RedArmor: Model = {
  name: "Red Armor",
  filename: "armor.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "armor_2.png", width: 184, height: 76 }],
  customTextureSets: ["primevil", "qrp"],
};

// weapons
export const SuperShotgun: Model = {
  name: "Super Shotgun",
  filename: "g_shot.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "g_shot_0.png", width: 232, height: 132 }],
  customTextureSets: [],
};

export const Nailgun: Model = {
  name: "Nailgun",
  filename: "g_nail.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "g_nail_0.png", width: 308, height: 94 }],
  customTextureSets: [],
};

export const SuperNailgun: Model = {
  name: "Super Nailgun",
  filename: "g_nail2.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "g_nail2_0.png", width: 308, height: 79 }],
  customTextureSets: [],
};

export const GrenadeLauncher: Model = {
  name: "Grenade Launcher",
  filename: "g_rock.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "g_rock_0.png", width: 224, height: 195 }],
  customTextureSets: [],
};

export const RocketLauncher: Model = {
  name: "Rocket Launcher",
  filename: "g_rock2.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "g_rock2_0.png", width: 232, height: 156 }],
  customTextureSets: [],
};

export const LightningGun: Model = {
  name: "Lightning Gun",
  filename: "g_light.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "g_light_0.png", width: 308, height: 144 }],
  customTextureSets: [],
};

// projectiles
export const Grenade: Model = {
  name: "Grenade",
  filename: "grenade.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "grenade_0.png", width: 40, height: 44 }],
  customTextureSets: [],
};

export const GrenadeV2: Model = {
  name: "Grenade (v2)",
  filename: "grenade_v2.gltf",
  textureDirPath: "qw/textures/models",
  textures: [
    {
      index: 0,
      filename: "grenade_v2_0.png",
      destFilename: "grenade_0.png",
      width: 256,
      height: 256,
    },
  ],
  customTextureSets: [],
};

export const Missile: Model = {
  name: "Missile",
  filename: "missile.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "missile_0.png", width: 288, height: 195 }],
  customTextureSets: [],
};

// powerups
export const Quad: Model = {
  name: "Quad",
  filename: "quaddama.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "quaddama_0.png", width: 308, height: 121 }],
  customTextureSets: [],
};

export const Pent: Model = {
  name: "Pent",
  filename: "invulner.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "invulner_0.png", width: 308, height: 67 }],
  customTextureSets: [],
};

export const Ring: Model = {
  name: "Ring",
  filename: "invisibl.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "invisibl_0.png", width: 104, height: 52 }],
  customTextureSets: [],
};

// misc
export const Backpack: Model = {
  name: "Backpack",
  filename: "backpack.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "backpack_0.png", width: 152, height: 108 }],
  customTextureSets: [],
};

// health packs
export const MegaHealth: Model = {
  name: "Mega health",
  filename: "bh100.gltf",
  textureDirPath: "qw/textures/bmodels",
  textures: [
    { index: 0, filename: "+0_med100.png", width: 240, height: 240 },
    { index: 1, filename: "med100.png", width: 240, height: 240 },
  ],
  customTextureSets: ["colorized qrp", "qrp"],
};

export const HealthLarge: Model = {
  name: "Large health",
  filename: "bh25.gltf",
  textureDirPath: "qw/textures/bmodels",
  textures: [
    { index: 0, filename: "+0_med25s.png", width: 32, height: 16 },
    { index: 1, filename: "+0_med25.png", width: 32, height: 32 },
  ],
  customTextureSets: ["colorized qrp", "qrp"],
};

export const HealthSmall: Model = {
  name: "Small health",
  filename: "bh10.gltf",
  textureDirPath: "qw/textures/bmodels",
  textures: [
    { index: 0, filename: "med3_1.png", width: 32, height: 16 },
    { index: 1, filename: "med3_0.png", width: 32, height: 32 },
  ],
  customTextureSets: ["colorized qrp"],
};

// ammo
export const ShellsSmall: Model = {
  name: "Shells (small)",
  filename: "shell0.gltf",
  textureDirPath: "qw/textures/bmodels",
  textures: [
    { index: 0, filename: "shot0sid.png", width: 32, height: 32 },
    { index: 1, filename: "shot0top.png", width: 32, height: 32 },
  ],
  customTextureSets: ["colorized qrp", "qrp"],
};

export const ShellsLarge: Model = {
  name: "Shells (large)",
  filename: "shell1.gltf",
  textureDirPath: "qw/textures/bmodels",
  textures: [
    { index: 0, filename: "shot1sid.png", width: 32, height: 32 },
    { index: 1, filename: "shot1top.png", width: 32, height: 32 },
  ],
  customTextureSets: ["colorized qrp", "qrp"],
};

export const NailsSmall: Model = {
  name: "Nails (small)",
  filename: "nail0.gltf",
  textureDirPath: "qw/textures/bmodels",
  textures: [
    { index: 0, filename: "nail0sid.png", width: 32, height: 32 },
    { index: 1, filename: "nail0top.png", width: 32, height: 32 },
  ],
  customTextureSets: ["colorized qrp", "qrp"],
};

export const NailsLarge: Model = {
  name: "Nails (large)",
  filename: "nail1.gltf",
  textureDirPath: "qw/textures/bmodels",
  textures: [
    { index: 0, filename: "nail1sid.png", width: 32, height: 32 },
    { index: 1, filename: "nail1top.png", width: 32, height: 32 },
  ],
  customTextureSets: ["colorized qrp", "qrp"],
};

export const RocketsSmall: Model = {
  name: "Rockets (small)",
  filename: "rock0.gltf",
  textureDirPath: "qw/textures/bmodels",
  textures: [
    { index: 1, filename: "rock0sid.png", width: 32, height: 16 },
    { index: 0, filename: "rockettop.png", width: 16, height: 16 },
  ],
  customTextureSets: ["colorized qrp", "qrp"],
};

export const RocketsLarge: Model = {
  name: "Rockets (large)",
  filename: "rock1.gltf",
  textureDirPath: "qw/textures/bmodels",
  textures: [
    { index: 0, filename: "rock1sid.png", width: 32, height: 16 },
    { index: 1, filename: "rockettop.png", width: 16, height: 16 },
  ],
  customTextureSets: ["colorized qrp", "qrp"],
};

export const CellsSmall: Model = {
  name: "Cells (small)",
  filename: "batt0.gltf",
  textureDirPath: "qw/textures/bmodels",
  textures: [
    { index: 0, filename: "batt1sid.png", width: 32, height: 32 },
    { index: 1, filename: "batt0top.png", width: 32, height: 32 },
  ],
  customTextureSets: ["colorized qrp", "qrp"],
};

export const CellsLarge: Model = {
  name: "Cells (large)",
  filename: "batt1.gltf",
  textureDirPath: "qw/textures/bmodels",
  textures: [
    { index: 0, filename: "batt0sid.png", width: 32, height: 32 },
    { index: 1, filename: "batt1top.png", width: 32, height: 32 },
  ],
  customTextureSets: ["colorized qrp", "qrp"],
};

// Units
export const PlayerDefault: Model = {
  name: "Player",
  filename: "player.gltf",
  textureDirPath: "qw/skins",
  textures: [{ index: 0, filename: "player_0.png", width: 296, height: 194 }],
  customTextureSets: ["primevil base", "primevil white"],
};
export const PlayerNew: Model = {
  name: "Player (new)",
  filename: "player_new.gltf",
  textureDirPath: "qw/skins",
  textures: [
    {
      index: 0,
      filename: "player_new_0.png",
      destFilename: "player_0.png",
      width: 256,
      height: 256,
    },
  ],
  customTextureSets: [],
};

// Runes
export const RuneResistance: Model = {
  name: "Resistance",
  filename: "end1.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "end1_0.png", width: 152, height: 124 }],
  customTextureSets: [],
};

export const RuneStrength: Model = {
  name: "Strength",
  filename: "end2.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "end2_0.png", width: 248, height: 156 }],
  customTextureSets: [],
};

export const RuneHaste: Model = {
  name: "Haste",
  filename: "end3.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "end3_0.png", width: 152, height: 116 }],
  customTextureSets: [],
};

export const RuneRegeneration: Model = {
  name: "Regeneration",
  filename: "end4.gltf",
  textureDirPath: "qw/textures/models",
  textures: [{ index: 0, filename: "end4_0.png", width: 184, height: 132 }],
  customTextureSets: [],
};
