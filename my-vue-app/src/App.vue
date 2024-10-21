<script setup lang="ts">
import { useGameStore } from "./stores/gameStore";
const gameStore = useGameStore();
import ColourSelectionPopup from "./components/popups/ColourSelectionPopup.vue";
import HandEndPopup from "./components/popups/HandEndPopup.vue";
import GameOverPopup from "./components/popups/GameOverPopup.vue";
</script>

<template>
  <ColourSelectionPopup
    v-if="gameStore.colourPopupTrigger.buttonTrigger"
    :onColourSelected="gameStore.onColourSelection"
  />
  <HandEndPopup v-if="gameStore.handOverPopupTrigger" />
  <GameOverPopup v-if="gameStore.gameOverPopupTrigger" />

  <router-view />
</template>
