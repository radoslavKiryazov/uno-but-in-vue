<template>
  <div class="relative flex items-center">
    <CardComponent
      v-if="topDiscardCard"
      :card="topDiscardCard"
      :key="cardKey"
    />
    <div
      class="absolute bottom-2 left-2 bg-white text-black text-lg font-bold rounded-full h-10 w-10 flex items-center justify-center shadow-lg z-10"
    >
      {{ discardPile && discardPile.length }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import CardComponent from "./CardComponent.vue";
import { useGameStore } from "../stores/gameStore";
import { computed } from "vue";

const gameStore = useGameStore();

const discardPile = computed(() => gameStore.discardPile);
const topDiscardCard = computed(() => gameStore.topDiscardCard);

const cardKey = computed(() => {
  if (!topDiscardCard.value) return "default";
  const card = topDiscardCard.value;
  return card.type === "NUMBERED"
    ? `${card.colour.toLowerCase()}-${card.value}`
    : `${card.type.toLowerCase()}-${
        card.colour ? card.colour.toLowerCase() : ""
      }`;
});
</script>
