<template>
  <Popup>
    <div class="flex flex-col justify-center items-center gap-3">
      <h1>Pick a color</h1>
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="color in colours"
          :key="color"
          :style="{ backgroundColor: color }"
          class="w-10 h-10 rounded-full"
          @click="selectColour(color)"
        ></button>
      </div>
    </div>
  </Popup>
</template>
<script setup lang="ts">
import Popup from "./Popup.vue";
import type { Colour } from "../../model/Card_model";
import { defineProps } from "vue";

const colours: Colour[] = ["Blue", "Green", "Red", "Yellow"];

const props = defineProps<{
  onColourSelected: (color: Colour) => void;
}>();

const selectColour = (color: Colour) => {
  console.log(color);
  props.onColourSelected(color);
};
</script>
