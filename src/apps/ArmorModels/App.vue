<script lang="ts" setup>
import SiteHeader from "../../components/Site/SiteHeader.vue";
import SiteFooter from "../../components/Site/SiteFooter.vue";
import ModelEditorPage from "../../components/ModelEditorPage.vue";

import { armors } from "../../quake/Item";

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
