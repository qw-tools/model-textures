<script lang="ts" setup>
import SiteHeader from "../Site/SiteHeader.vue";
import SiteFooter from "../Site/SiteFooter.vue";
import ModelEditorPage from "../Editor/ModelEditorPage.vue";

import {
  ammo,
  backpack,
  healthPacks,
  powerups,
  projectiles,
} from "../Editor/Item";

const items = healthPacks
  .concat(ammo)
  .concat(powerups)
  .concat(projectiles)
  .concat([backpack]);
</script>

<template>
  <SiteHeader current-page="misc_models" />
  <ModelEditorPage
    :items="items"
    title="Misc models texture editor"
    :editor-height="160"
  />
  <SiteFooter />
</template>
