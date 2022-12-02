<script lang="ts" setup>
import {
  ammo,
  armors,
  backpack,
  healthPacks,
  Item,
  player,
  powerups,
  projectiles,
  weapons,
} from "./Item";

interface Props {
  onItemClick: (item: Item) => void;
}

const itemsCategories = [
  { name: "Armors", items: armors },
  { name: "Ammo", items: ammo },
  { name: "Health packs", items: healthPacks },
  { name: "Powerups", items: powerups },
  { name: "Projectiles", items: projectiles },
  { name: "Weapons", items: weapons },
  { name: "Backpack", items: [backpack] },
  { name: "Units", items: [player] },
];

const props = defineProps<Props>();
</script>
<template>
  <div class="container my-6">
    <div class="flex flex-wrap gap-16">
      <div v-for="category in itemsCategories" :key="category.name">
        <strong>{{ category.name }}</strong>
        <ul>
          <li
            v-for="item in category.items"
            :key="item.id"
            class="cursor-pointer hover:text-sky-600 hover:font-bold"
            @click="() => props.onItemClick(item)"
          >
            {{ item.model.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
