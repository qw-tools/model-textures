<script lang="ts" setup>
import SiteHeader from "../Site/SiteHeader.vue";
import SiteFooter from "../Site/SiteFooter.vue";
import ModelEditorPage from "../Editor/ModelEditorPage.vue";

import { player } from "../Editor/Item";

const items = [player];
</script>

<template>
  <SiteHeader current-page="index" />
  <ModelEditorPage
    :items="items"
    title="Player model texture editor"
    :editor-height="400"
  />
  <SiteFooter />
</template>
