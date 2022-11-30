import { publicUrl, slugify } from "../components/util";
import { TextureEditorSettings } from "../konva/TextureEditor";
import { ModelViewerSettings } from "../components/ModelViewer";

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

// armors
const GreenArmor = createArmorItem("Green Armor", 0);
const YellowArmor = createArmorItem("Yellow Armor", 1);
const RedArmor = createArmorItem("Red Armor", 2);

export const armors: Item[] = [GreenArmor, YellowArmor, RedArmor];

// player skin
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
