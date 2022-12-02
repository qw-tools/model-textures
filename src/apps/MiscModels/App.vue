<script lang="ts" setup>
import SiteHeader from "../../components/Site/SiteHeader.vue";
import SiteFooter from "../../components/Site/SiteFooter.vue";
import ModelEditorPage from "../../components/ModelEditorPage.vue";

import {
  ammo,
  backpack,
  healthPacks,
  powerups,
  projectiles,
} from "../../pkg/quake/Item";

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
