<script lang="ts" setup>
import SiteHeader from "../Site/SiteHeader.vue";
import SiteFooter from "../Site/SiteFooter.vue";
import ModelEditorPage from "../Editor/ModelEditorPage.vue";

import { armors } from "../Editor/Item";

const items = armors;
</script>

<template>
  <SiteHeader current-page="Armor_models" />
  <ModelEditorPage
    :items="items"
    title="Armor models texture editor"
    :editor-height="160"
  />
  <SiteFooter />
</template>
