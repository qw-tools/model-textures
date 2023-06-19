<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, onMounted } from "vue";
import { Items } from "@/pkg/quake/items";
import { itemToViewerSettings, ModelViewer } from "@/pkg/ModelViewer";
import { Texture } from "@/pkg/quake/models";
import { itemToEditorSettings, TextureEditor } from "./pixi/TextureEditor";
import { Brush } from "./pixi/brush";
import { FilterInputs } from "./pixi/filter";
import { toCustomTextureUrl } from "@/pkg/stringUtil";

interface Props {
  item: Items;
  filters: FilterInputs;
  brush: Brush;
  onClose: () => void;
}

const props = defineProps<Props>();

let viewer: ModelViewer;
const viewerSettings = itemToViewerSettings(props.item);

const editors: TextureEditor[] = new Array(
  props.item.model.textures.length
).fill(null);
const editorSettings = itemToEditorSettings(props.item);

onMounted(async () => {
  // viewer
  const viewerPromise = new Promise<void>((resolve) => {
    viewer = new ModelViewer({
      ...viewerSettings,
      onLoad: resolve,
    });
  });

  // editors
  const editorPromises: Promise<void>[] = [];

  for (let i = 0; i < props.item.model.textures.length; i++) {
    const ePromise = new Promise<void>((resolve) => {
      const texture: Texture = props.item.model.textures[i];
      const settings = editorSettings[i];

      editors[i] = new TextureEditor({
        ...settings,
        onChange: async () => {
          await viewer.setTextureByURI(editors[i].toDataUrl(), texture.index);
        },
        onReady: () => {
          editors[i].brush = props.brush;
          resolve();
        },
      });

      document
        .getElementById(settings.containerID)
        ?.append(editors[i].getCanvas());
    });
    editorPromises.push(ePromise);
  }

  const allPromises = [viewerPromise].concat(editorPromises);
  await Promise.all(allPromises);

  // trigger change to update modelviewer
  for (let i = 0; i < editors.length; i++) {
    editors[i].filters = props.filters;
  }
});

function onTextureSetChange(e) {
  for (let i = 0; i < editors.length; i++) {
    const newTextureName = e.target.value;

    if ("" === newTextureName) {
      editors[i].resetTexture();
    } else {
      const newTextureUrl = toCustomTextureUrl(
        editorSettings[i].texturePath,
        e.target.value
      );
      editors[i].loadTexture(newTextureUrl);
    }
  }
}

onBeforeUnmount(() => {
  for (let i = 0; i < editors.length; i++) {
    editors[i].destroy();
  }
});

// async function onTextureFileUpload(event: Event): Promise<void> {
//   const files = (event.target as HTMLInputElement).files;
//
//   if (!files) {
//     return;
//   }
//
//   await editor.setTextureByFile(files[0]);
// }

onBeforeMount(() => {
  const dropzoneClass = "app-dropzone";

  const prevent = function (e) {
    e.preventDefault();

    if (!e.target.classList.contains(dropzoneClass)) {
      e.dataTransfer.effectAllowed = "none";
      e.dataTransfer.dropEffect = "none";
    }
  };
  window.addEventListener("dragenter", prevent, false);
  window.addEventListener("dragover", prevent);
  window.addEventListener("drop", prevent);
});
</script>

<template>
  <div class="fadeIn">
    <div class="p-2 bg-gray-300 rounded-md">
      <div class="flex items-center">
        <button
          :title="`Close ${item.model.name} editor`"
          class="px-3 py-1 rounded shadow bg-gray-200 border border-gray-400 hover:bg-gray-100 mr-2"
          @click="props.onClose"
        >
          x
        </button>
        <div class="font-bold">
          {{ item.model.name }}
        </div>

        <div
          v-if="item.model.customTextureSets.length"
          class="ml-12 flex items-center space-x-4 text-xs"
        >
          <div>Texture set</div>
          <select @change="onTextureSetChange">
            <option value="">Quake Original</option>

            <option
              v-for="name in item.model.customTextureSets"
              :key="name"
              :value="name"
            >
              {{ name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <div class="flex">
        <div class="app-border-dashed" style="width: 370px">
          <model-viewer
            :id="viewerSettings.containerID"
            :orientation="`270deg 270deg ${props.item.viewerOrientation}deg`"
            camera-controls
            disable-pan
            disable-tap
            disable-zoom
            interaction-prompt="none"
            loading="eager"
            max-camera-orbit="auto 360deg 100"
            min-camera-orbit="auto 0deg auto"
            rotation-per-second="5deg"
          >
          </model-viewer>
        </div>
        <div class="flex">
          <div
            v-for="(editorSetting, index) in editorSettings"
            :key="editorSetting.containerID"
            class="px-6 border-l border-l-gray-300 first:border-l-0"
          >
            <div class="my-2 flex items-center space-x-4">
              <div class="text-sm font-mono">
                <span class="text-gray-500 text-xs"
                  >{{ props.item.model.textureDirPath }}/</span
                ><strong>{{
                  props.item.model.textures[index].filename
                }}</strong>
                <span class="text-gray-500 text-xs ml-2"
                  >[{{ props.item.model.textures[index].width }}x{{
                    props.item.model.textures[index].height
                  }}]</span
                >
              </div>

              <button
                class="block border border-gray-400 hover:bg-blue-100 rounded-md py-1.5 px-3 bg-sky-100 shadow text-sm ml-auto"
                @click="
                  () =>
                    editors[index]?.download(
                      props.item.model.textures[index].filename
                    )
                "
              >
                Download
              </button>
            </div>

            <div
              :style="`width: ${editorSetting.width + 4}px; height: ${
                editorSetting.height + 4
              }px`"
            >
              <div
                :id="`${editorSetting.containerID}`"
                class="editor-container app-bg-checker app-border-dashed"
              />
            </div>

            <div class="flex mt-2 space-x-4">
              <button
                class="block border border-gray-400 hover:bg-red-100 rounded-md py-1 px-2 bg-gray-200 shadow text-sm"
                @click="() => editors[index]?.paint.clear()"
              >
                Clear paint
              </button>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  @click="() => editors[index]?.toggleOutline()"
                />
                <strong class="text-sm">Show outline</strong>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
