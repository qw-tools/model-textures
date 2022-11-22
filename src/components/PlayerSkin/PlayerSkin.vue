<script>
import { reactive } from "vue";

const store = reactive({
  rotate: true,
  color: {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  }
});
</script>
<script setup>


import { onMounted } from "vue";

const models = [
  { id: "armor1", filename: "armor", texture: "/assets/models/armorout0_tex00.png" },
  { id: "armor2", filename: "armor", texture: "/assets/models/armorout0_tex01.png" },
  { id: "armor3", filename: "armor", texture: "/assets/models/armorout0_tex02.png" },
  { id: "backpack", filename: "backpack", texture: "/assets/models/backpackout0_tex00.png" },
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
]

onMounted(() => {
  const viewers = document.querySelectorAll("model-viewer");

  viewers.forEach(el => {
    el.addEventListener("load", async () => {
      const textureSource = el.getAttribute("data-texture");

      if (!textureSource) {
        return
      }

      const texture = await el.createTexture(textureSource);
      el.model.materials[0].pbrMetallicRoughness.baseColorTexture.setTexture(texture);
    });
  })

});

const baseUrl = import.meta.env.BASE_URL;

</script>

<template>

  <div style="display: grid; grid-template-rows: 60px auto; height: 95vh">
    <div style="display: flex; align-items: center;">
      <div>
        HUE
        <input type="range" min="0" max="360" style="width: 200px" v-model="store.color.r" />
      </div>

    </div>
    <div>
      <div class="grid" :style="`filter: hue-rotate(${store.color.r}deg)`">
        <div v-for="model in models" class="container" style="display: flex;">
          <model-viewer :src="`${baseUrl}/assets/models/${model.filename}out.gltf`" orientation="270deg 270deg 45deg" interaction-prompt="none"
                        disable-zoom camera-controls
                        min-camera-orbit="auto 0deg auto" max-camera-orbit="auto 360deg 100"
                        :auto-rotate="store.rotate" auto-rotate-delay="0" rotation-per-second="10deg"
                        :data-texture="`${baseUrl}/${model.texture}`"
                        :id="model.id">

          </model-viewer>
          <div style="display: flex; align-items: center; justify-content: center; width: 50%;" v-if="model.texture">
            <img :src="`${baseUrl}/${model.texture}`" alt="" width="512" height="" />
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

.container {
  border: 1px solid #ddd;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, .2) 2px 2px 5px;
}

model-viewer {
  width: 100%;
  height: 100%;
}
</style>
