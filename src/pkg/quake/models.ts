// types
export interface Texture {
  index: number;
  filename: string;
  width: number;
  height: number;
}

export interface Model {
  name: string;
  filename: string;
  textures: Texture[];
}

// armors
export const GreenArmor: Model = {
  name: "Green Armor",
  filename: "armor.gltf",
  textures: [{ index: 0, filename: "armor_0.png", width: 184, height: 76 }],
};

export const YellowArmor: Model = {
  name: "Yellow Armor",
  filename: "armor.gltf",
  textures: [{ index: 0, filename: "armor_1.png", width: 184, height: 76 }],
};

export const RedArmor: Model = {
  name: "Red Armor",
  filename: "armor.gltf",
  textures: [{ index: 0, filename: "armor_2.png", width: 184, height: 76 }],
};

// weapons
export const SuperShotgun: Model = {
  name: "Super Shotgun",
  filename: "g_shot.gltf",
  textures: [{ index: 0, filename: "g_shot_0.png", width: 232, height: 132 }],
};

export const Nailgun: Model = {
  name: "Nailgun",
  filename: "g_nail.gltf",
  textures: [{ index: 0, filename: "g_nail_0.png", width: 308, height: 94 }],
};

export const SuperNailgun: Model = {
  name: "Super Nailgun",
  filename: "g_nail2.gltf",
  textures: [{ index: 0, filename: "g_nail2_0.png", width: 308, height: 79 }],
};

export const GrenadeLauncher: Model = {
  name: "Grenade Launcher",
  filename: "g_rock.gltf",
  textures: [{ index: 0, filename: "g_rock_0.png", width: 224, height: 195 }],
};

export const RocketLauncher: Model = {
  name: "Rocket Launcher",
  filename: "g_rock2.gltf",
  textures: [{ index: 0, filename: "g_rock2_0.png", width: 232, height: 156 }],
};

export const LightningGun: Model = {
  name: "Lightning Gun",
  filename: "g_light.gltf",
  textures: [{ index: 0, filename: "g_light_0.png", width: 308, height: 144 }],
};

// projectiles
export const Grenade: Model = {
  name: "Grenade",
  filename: "grenade.gltf",
  textures: [{ index: 0, filename: "grenade_0.png", width: 40, height: 44 }],
};

export const Missile: Model = {
  name: "Missile",
  filename: "missile.gltf",
  textures: [{ index: 0, filename: "missile_0.png", width: 288, height: 195 }],
};

// powerups
export const Quad: Model = {
  name: "Quad",
  filename: "quaddama.gltf",
  textures: [{ index: 0, filename: "quaddama_0.png", width: 308, height: 121 }],
};

export const Pent: Model = {
  name: "Pent",
  filename: "invulner.gltf",
  textures: [{ index: 0, filename: "invulner_0.png", width: 308, height: 67 }],
};

export const Ring: Model = {
  name: "Ring",
  filename: "invisibl.gltf",
  textures: [{ index: 0, filename: "invisibl_0.png", width: 104, height: 52 }],
};

// misc
export const Backpack: Model = {
  name: "Backpack",
  filename: "backpack.gltf",
  textures: [{ index: 0, filename: "backpack_0.png", width: 152, height: 108 }],
};

// health packs
export const MegaHealth: Model = {
  name: "Mega health",
  filename: "bh100.gltf",
  textures: [
    { index: 0, filename: "+3_med100.png", width: 240, height: 240 },
    { index: 1, filename: "med100.png", width: 240, height: 240 },
  ],
};

export const HealthLarge: Model = {
  name: "Large health",
  filename: "bh25.gltf",
  textures: [
    { index: 0, filename: "+0_med25s.png", width: 32, height: 16 },
    { index: 1, filename: "+0_med25.png", width: 32, height: 32 },
  ],
};

export const HealthSmall: Model = {
  name: "Small health",
  filename: "bh10.gltf",
  textures: [
    { index: 0, filename: "med3_1.png", width: 32, height: 16 },
    { index: 1, filename: "med3_0.png", width: 32, height: 32 },
  ],
};

// ammo
export const ShellsSmall: Model = {
  name: "Shells (small)",
  filename: "shell0.gltf",
  textures: [
    { index: 0, filename: "shot0sid.png", width: 32, height: 32 },
    { index: 1, filename: "shot0top.png", width: 32, height: 32 },
  ],
};

export const ShellsLarge: Model = {
  name: "Shells (large)",
  filename: "shell1.gltf",
  textures: [
    { index: 0, filename: "shot1sid.png", width: 32, height: 32 },
    { index: 1, filename: "shot1top.png", width: 32, height: 32 },
  ],
};

export const NailsSmall: Model = {
  name: "Nails (small)",
  filename: "nail0.gltf",
  textures: [
    { index: 0, filename: "nail0sid.png", width: 32, height: 32 },
    { index: 1, filename: "nail0top.png", width: 32, height: 32 },
  ],
};

export const NailsLarge: Model = {
  name: "Nails (large)",
  filename: "nail1.gltf",
  textures: [
    { index: 0, filename: "nail1sid.png", width: 32, height: 32 },
    { index: 1, filename: "nail1top.png", width: 32, height: 32 },
  ],
};

export const RocketsSmall: Model = {
  name: "Rockets (small)",
  filename: "rock0.gltf",
  textures: [
    { index: 1, filename: "rock0sid.png", width: 32, height: 16 },
    { index: 0, filename: "rockettop.png", width: 16, height: 16 },
  ],
};

export const RocketsLarge: Model = {
  name: "Rockets (large)",
  filename: "rock1.gltf",
  textures: [
    { index: 0, filename: "rock1sid.png", width: 32, height: 16 },
    { index: 1, filename: "rockettop.png", width: 16, height: 16 },
  ],
};

export const CellsSmall: Model = {
  name: "Cells (small)",
  filename: "batt0.gltf",
  textures: [
    { index: 0, filename: "batt1sid.png", width: 32, height: 32 },
    { index: 1, filename: "batt0top.png", width: 32, height: 32 },
  ],
};

export const CellsLarge: Model = {
  name: "Cells (large)",
  filename: "batt1.gltf",
  textures: [
    { index: 0, filename: "batt0sid.png", width: 32, height: 32 },
    { index: 1, filename: "batt1top.png", width: 32, height: 32 },
  ],
};

// Units
export const Player: Model = {
  name: "Player",
  filename: "player.gltf",
  textures: [{ index: 0, filename: "player_0.png", width: 296, height: 194 }],
};

// Runes
export const RuneResistance: Model = {
  name: "Resistance",
  filename: "end1.gltf",
  textures: [{ index: 0, filename: "end1_0.png", width: 152, height: 124 }],
};

export const RuneStrength: Model = {
  name: "Strength",
  filename: "end2.gltf",
  textures: [{ index: 0, filename: "end2_0.png", width: 248, height: 156 }],
};

export const RuneHaste: Model = {
  name: "Haste",
  filename: "end3.gltf",
  textures: [{ index: 0, filename: "end3_0.png", width: 152, height: 116 }],
};

export const RuneRegeneration: Model = {
  name: "Regeneration",
  filename: "end4.gltf",
  textures: [{ index: 0, filename: "end4_0.png", width: 184, height: 132 }],
};
