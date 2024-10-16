<script setup lang="ts">
import { useGameStore } from "./stores/gameStore";
const gameStore = useGameStore();
import ColourSelectionPopup from "./components/popups/ColourSelectionPopup.vue";
</script>

<template>
  <ColourSelectionPopup
    v-if="gameStore.colourPopupTrigger.buttonTrigger"
    :onColourSelected="gameStore.onColourSelection"
  />
  <router-view />
</template>
