<script lang="ts" setup>
import SiteHeader from "../../components/Site/SiteHeader.vue";
import SiteFooter from "../../components/Site/SiteFooter.vue";
import ModelEditorPage from "../../components/ModelEditorPage.vue";

import { player } from "../../quake/Item";

const items = [player];
</script>

<template>
  <SiteHeader current-page="index" />
  <ModelEditorPage :items="items" title="Player model texture editor" />
  <SiteFooter />
</template>
