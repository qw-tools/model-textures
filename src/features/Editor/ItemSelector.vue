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
} from "../../pkg/quake/Item";

interface ItemSelection {
  isSelected: boolean;
  item: Item;
}
</script>
<template>
  <div>
    <div class="flex gap-8">
      <div>
        <strong>Armors</strong>
        <ul>
          <li v-for="item in armors" :key="item.id">
            <label><input type="checkbox" /> {{ item.name }}</label>
          </li>
        </ul>
      </div>
      <div>
        <strong>Weapons</strong>
        <ul>
          <li v-for="item in weapons" :key="item.id">
            <label><input type="checkbox" /> {{ item.name }}</label>
          </li>
        </ul>
      </div>
      <div>
        <strong>Powerups</strong>
        <ul>
          <li v-for="item in powerups" :key="item.id">
            <label><input type="checkbox" /> {{ item.name }}</label>
          </li>
        </ul>
      </div>
      <div>
        <strong>Ammo</strong>
        <ul>
          <li v-for="item in ammo" :key="item.id">
            <label><input type="checkbox" /> {{ item.name }}</label>
          </li>
        </ul>
      </div>
      <div>
        <strong>Health packs</strong>
        <ul>
          <li v-for="item in healthPacks" :key="item.id">
            <label><input type="checkbox" /> {{ item.name }}</label>
          </li>
        </ul>
      </div>
      <div>
        <strong>Projectiles</strong>
        <ul>
          <li v-for="item in projectiles" :key="item.id">
            <label><input type="checkbox" /> {{ item.name }}</label>
          </li>
        </ul>
      </div>
      <div>
        <strong>Backpack</strong>
        <ul>
          <li>
            <label><input type="checkbox" /> {{ backpack.name }}</label>
          </li>
        </ul>
      </div>
      <div>
        <strong>Units</strong>
        <ul>
          <li>
            <label><input type="checkbox" /> {{ player.name }}</label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
