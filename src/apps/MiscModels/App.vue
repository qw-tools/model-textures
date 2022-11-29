<script lang="ts" setup>
import SiteHeader from "../../components/Site/SiteHeader.vue";
import SiteFooter from "../../components/Site/SiteFooter.vue";
import ModelEditorPage from "../../components/ModelEditorPage.vue";

import { powerups, projectiles } from "../../quake/Item";

const items = projectiles.concat(powerups);
</script>

<template>
  <SiteHeader current-page="misc_models" />
  <ModelEditorPage :items="items" title="Misc models texture editor" />
  <SiteFooter />
</template>
