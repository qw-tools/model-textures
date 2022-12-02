<script lang="ts" setup>
import SiteHeader from "../Site/SiteHeader.vue";
import SiteFooter from "../Site/SiteFooter.vue";
import ModelEditorPage from "../Editor/ModelEditorPage.vue";

import { weapons } from "../../pkg/quake/Item";

const items = weapons;
</script>

<template>
  <SiteHeader current-page="weapon_models" />
  <ModelEditorPage
    :items="items"
    title="Weapon models texture editor"
    :editor-height="160"
  />
  <SiteFooter />
</template>
