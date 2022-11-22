<script lang="ts" setup>
const baseUrl = import.meta.env.BASE_URL;
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
            <img
              :src="`${baseUrl}/assets/models/playerout0_tex00.png`"
              class="w-full"
            />
          </div>

          <div class="col-span-3 ml-8">
            <div class="space-y-4">
              <div class="flex items-center">
                <div class="text-lg font-bold">Settings</div>
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
