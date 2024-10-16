<template>
  <div class="flex flex-col justify-center items-center space-y-3">
    <div class="flex flex-row space-x-2">
      <DiscardPile />
      <Deck />
    </div>
    <div class="flex flex-col justify-center items-center">
      Current color:
      <div
        class="h-[50px] w-[50px] rounded-[50px] inline-block border-white-100 border-5"
        :style="{ backgroundColor: color }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import DiscardPile from "./DiscardPile.vue";
import Deck from "./Deck.vue";
import { useGameStore } from "../stores/gameStore";
import { computed } from "vue";

const gameStore = useGameStore();

const color = computed(() => gameStore.topDiscardCard?.colour || "white");
</script>
