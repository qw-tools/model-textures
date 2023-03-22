<script lang="ts" setup>
import {
  ammo,
  armors,
  backpack,
  healthPacks,
  Items,
  player,
  powerups,
  projectiles,
  runes,
  weapons,
} from "@/pkg/quake/items";

interface Props {
  onItemClick: (item: Items) => void;
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
  { name: "Runes", items: runes },
];

const props = defineProps<Props>();
</script>
<template>
  <div class="container my-6">
    <div
      class="border-2 bg-green-100 border-green-300 p-3 rounded-md font-bold my-4"
    >
      &darr; Click an item to load editor &darr;
    </div>

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
