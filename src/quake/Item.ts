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
  filename: string;
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
  viewerOrientation: number;
}

// methods
function createItem(
  category: string,
  name: string,
  modelName: string,
  textureIndex: number,
  width: number,
  height: number,
  viewerOrientation = 0
): Item {
  const id = slugify(`${modelName}_${textureIndex}`);
  const filename = `${modelName}_${textureIndex}.png`;

  return {
    name,
    id,
    category,
    model: {
      path: publicUrl(`/assets/models/${modelName}.gltf`),
      texture: {
        filename,
        path: publicUrl(`/assets/models/${filename}`),
        width,
        height,
      },
    },
    viewerOrientation,
  };
}

function createArmorItem(name: string, textureIndex: number): Item {
  return createItem("Armors", name, "armor", textureIndex, 184, 76, 30);
}

export function itemToEditorSettings(item: Item): TextureEditorSettings {
  return {
    containerID: `Editor_${item.id}`,
    texturePath: item.model.texture.path,
    width: item.model.texture.width,
    height: item.model.texture.height,
  };
}

export function itemToViewerSettings(item: Item): ModelViewerSettings {
  return {
    containerID: `Viewer_${item.id}`,
    modelPath: item.model.path,
    texturePath: item.model.texture.path,
  };
}

// armors
const GreenArmor = createArmorItem("Green Armor", 0);
const YellowArmor = createArmorItem("Yellow Armor", 1);
const RedArmor = createArmorItem("Red Armor", 2);

export const armors: Item[] = [GreenArmor, YellowArmor, RedArmor];

// Units
export const player = createItem("Units", "Player", "player", 0, 296, 194, 45);

// weapon models
const weaponOrientation = 45;
const SuperShotgun = createItem(
  "Weapons",
  "Super Shotgun",
  "g_shot",
  0,
  232,
  132,
  weaponOrientation
);
const NailGun = createItem(
  "Weapons",
  "Nailgun",
  "g_nail",
  0,
  308,
  94,
  weaponOrientation
);
const SuperNailGun = createItem(
  "Weapons",
  "Super Nailgun",
  "g_nail2",
  0,
  308,
  79,
  weaponOrientation
);
const GrenadeLauncher = createItem(
  "Weapons",
  "Grenade Launcher",
  "g_rock",
  0,
  224,
  195,
  weaponOrientation
);
const RocketLauncher = createItem(
  "Weapons",
  "Rocket Launcher",
  "g_rock2",
  0,
  232,
  156,
  weaponOrientation
);
const LightningGun = createItem(
  "Weapons",
  "Lightning Gun",
  "g_light",
  0,
  308,
  144,
  weaponOrientation
);

export const weapons: Item[] = [
  SuperShotgun,
  NailGun,
  SuperNailGun,
  GrenadeLauncher,
  RocketLauncher,
  LightningGun,
];

// projectiles
const Grenade = createItem("Projectiles", "Grenade", "grenade", 0, 40, 44, 90);
const Rocket = createItem("Projectiles", "Missile", "missile", 0, 288, 195, 90);
export const projectiles: Item[] = [Grenade, Rocket];

// powerups
const Quad = createItem("Powerups", "Quad", "quaddama", 0, 308, 121, 30);
const Pent = createItem("Powerups", "Pent", "invulner", 0, 308, 67, 30);
const Ring = createItem("Powerups", "Ring", "invisibl", 0, 104, 52, 30);
export const powerups: Item[] = [Quad, Pent, Ring];

// misc
export const backpack = createItem(
  "Misc",
  "Backpack",
  "backpack",
  0,
  152,
  108,
  30
);

// health packs
const MegaHealth = createItem(
  "Health packs",
  "Mega Health",
  "bh100",
  0,
  32,
  32,
  45
);
const LargeHealth = createItem(
  "Health packs",
  "Large Health",
  "bh25",
  0,
  32,
  16,
  45
);
const SmallHealth = createItem(
  "Health packs",
  "Small Health",
  "bh10",
  0,
  32,
  16,
  45
);
export const healthPacks: Item[] = [SmallHealth, LargeHealth, MegaHealth];

// ammo
const SmallShells = createItem(
  "Ammo",
  "Small shells pack",
  "shell0",
  0,
  32,
  32,
  45
);
const LargeShells = createItem(
  "Ammo",
  "Large shells pack",
  "shell1",
  0,
  32,
  32,
  45
);
const SmallNails = createItem(
  "Ammo",
  "Small nails pack",
  "nail0",
  0,
  32,
  32,
  45
);
const LargeNails = createItem(
  "Ammo",
  "Large nails pack",
  "nail1",
  0,
  32,
  32,
  45
);
const SmallRockets = createItem(
  "Ammo",
  "Small rockets pack",
  "rock0",
  2,
  32,
  16,
  45
);
const LargeRockets = createItem(
  "Ammo",
  "Large rockets pack",
  "rock1",
  0,
  32,
  16,
  45
);

const SmallCells = createItem(
  "Ammo",
  "Small cells pack",
  "batt0",
  0,
  32,
  32,
  45
);
const LargeCells = createItem(
  "Ammo",
  "Large cells pack",
  "batt1",
  0,
  32,
  32,
  45
);

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
