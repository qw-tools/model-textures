<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { ModelViewerElement } from "@google/model-viewer";

const store = reactive({
  rotate: true,
  color: {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  },
});

const models = [
  {
    id: "armor1",
    filename: "armor",
    texture: "/assets/models/armorout0_tex00.png",
  },
  {
    id: "armor2",
    filename: "armor",
    texture: "/assets/models/armorout0_tex01.png",
  },
  {
    id: "armor3",
    filename: "armor",
    texture: "/assets/models/armorout0_tex02.png",
  },
  {
    id: "backpack",
    filename: "backpack",
    texture: "/assets/models/backpackout0_tex00.png",
  },
  { id: "player", filename: "player" },
  { id: "g_shot", filename: "g_shot" },
  { id: "g_nail", filename: "g_nail" },
  { id: "g_nail2", filename: "g_nail2" },
  { id: "g_rock", filename: "g_rock" },
  { id: "g_rock2", filename: "g_rock2" },
  { id: "g_light", filename: "g_light" },
  { id: "grenade", filename: "grenade" },
  { id: "missile", filename: "missile" },
  { id: "quaddama", filename: "quaddama" },
  { id: "invulner", filename: "invulner" },
];

onMounted(() => {
  const viewers = document.querySelectorAll(
    "model-viewer"
  ) as NodeListOf<ModelViewerElement>;

  viewers.forEach((el) => {
    el.addEventListener("load", async () => {
      const textureSource = el.getAttribute("data-texture");

      if (!textureSource) {
        return;
      }

      const texture = await el.createTexture(textureSource);

      if (!el.model) {
        return;
      }

      el.model.materials[0].pbrMetallicRoughness.baseColorTexture.setTexture(
        texture
      );
    });
  });
});

const baseUrl = import.meta.env.BASE_URL;
</script>

<template>
  <div class="bg-gray-100 border-b border-gray-300">
    <div class="bg-white shadow">
      <div class="container">
        <div class="font-bold text-xl py-4">Item Models</div>
      </div>
    </div>

    <div class="container fadeIn">
      <div style="display: grid; grid-template-rows: 60px auto; height: 95vh">
        <div style="display: flex; align-items: center">
          <div>
            HUEFilterSetting
            <input
              v-model="store.color.r"
              max="360"
              min="0"
              style="width: 200px"
              type="range"
            />
          </div>
        </div>
        <div>
          <div :style="`filter: hue-rotate(${store.color.r}deg)`" class="grid">
            <div
              v-for="model in models"
              class="container"
              style="display: flex"
            >
              <model-viewer
                :id="model.id"
                :auto-rotate="store.rotate"
                :data-texture="`${baseUrl}/${model.texture}`"
                :src="`${baseUrl}/assets/models/${model.filename}out.gltf`"
                auto-rotate-delay="0"
                camera-controls
                disable-zoom
                interaction-prompt="none"
                max-camera-orbit="auto 360deg 100"
                min-camera-orbit="auto 0deg auto"
                orientation="270deg 270deg 45deg"
                rotation-per-second="10deg"
              >
              </model-viewer>
              <div
                v-if="model.texture"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 50%;
                "
              >
                <img
                  :src="`${baseUrl}/${model.texture}`"
                  alt=""
                  height=""
                  width="512"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, auto));
  grid-template-rows: repeat(auto-fill, 300px);
  grid-gap: 1px;
  height: 100%;
}
</style>
