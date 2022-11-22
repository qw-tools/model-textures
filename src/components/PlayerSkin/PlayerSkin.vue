<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { ModelViewerElement } from "@google/model-viewer";

const baseUrl = import.meta.env.BASE_URL;

const store = reactive({
  rotate: true,
  color: { r: 0, g: 0, b: 0, a: 0 },
  skinTextureURI: `${baseUrl}/assets/models/playerout0_tex00.png`,
});

onMounted(() => {
  let customSkinInput = document.getElementById(
    "custom_skin"
  ) as HTMLInputElement;

  if (!customSkinInput) {
    return;
  }

  customSkinInput.addEventListener("change", function () {
    if (!this.files || 0 === this.files.length) {
      return;
    }

    let viewer = document.getElementById("player") as ModelViewerElement | null;

    const reader = new FileReader();
    reader.addEventListener("load", async function () {
      if (!viewer || !viewer.model || 0 === viewer.model.materials.length) {
        return;
      }

      const texture = await viewer.createTexture(reader.result as string);

      if (!texture) {
        return;
      }

      viewer.model.materials[0].pbrMetallicRoughness.baseColorTexture.setTexture(
        texture
      );
      store.skinTextureURI = reader.result as string;
    });

    const file = this.files[0];
    reader.readAsDataURL(file);
  });
});
</script>

<template>
  <div class="bg-gray-100 border-b border-gray-300">
    <div class="bg-white shadow">
      <div class="container">
        <div class="font-bold text-xl py-4">Player Skin Editor</div>
      </div>
    </div>

    <div class="container fadeIn my-4">
      <div class="flex grow">
        <div class="grid grid-cols-10 gap-4 w-full">
          <div
            class="bg-gradient-to-b from-transparent via-white border-2 col-span-3"
          >
            <model-viewer
              id="player"
              :src="`${baseUrl}/assets/models/playerout.gltf`"
              camera-controls
              disable-zoom
              interaction-prompt="none"
              max-camera-orbit="auto 360deg 100"
              min-camera-orbit="auto 0deg auto"
              orientation="270deg 270deg 0deg"
              rotation-per-second="5deg"
            >
            </model-viewer>
          </div>
          <div class="col-span-4 debug self-center">
            <img :src="store.skinTextureURI" alt="Player Skin" class="w-full" />
          </div>

          <div class="col-span-3 ml-8">
            <div class="space-y-4">
              <div class="flex items-center">
                <div class="text-lg font-bold">Settings</div>
              </div>
              <hr />
              <div class="flex items-center">
                <div class="w-32"><strong>Custom skin</strong></div>
                <input id="custom_skin" type="file" />
              </div>
              <hr />
              <div>foo</div>
              <hr />
              <div>foo</div>
              <hr />
              <div>foo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
