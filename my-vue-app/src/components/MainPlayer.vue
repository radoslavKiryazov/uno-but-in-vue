<template>
  <div
    class="flex flex-col justify-between items-center space-y-4"
    :class="{
      'border-cyan-900': isPlayerTurn,
      'border-gray-400 opacity-50 pointer-events-none': !isPlayerTurn,
    }"
  >
    <div
      class="flex flex-row justify-between items-center w-full px-4 py-2 bg-gray-100 rounded-lg shadow-md w-max-20px"
    >
      <p class="text-lg font-semibold text-gray-800">
        Name: {{ gameStore.playerName }}
      </p>
      <p v-if="isPlayerTurn">YOUR TURN!</p>
      <p class="text-lg font-semibold text-gray-800">Score: 0</p>
    </div>

    <div
      class="relative h-full flex pt-1 rounded-lg space-x-1 w-full px-4 py-4"
    >
      <CardComponent
        v-for="(card, index) in playerHand"
        :key="cardKey(card)"
        :card="card"
        :onClick="
          () => {
            canPlayCard(card, gameStore.topDiscardCard) &&
              gameStore.playCard(index);
          }
        "
      />
    </div>

    <button
      v-if="!isThereAPlayableCard"
      class="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition"
      :disabled="!isPlayerTurn"
      @click="() => gameStore.drawCard(gameStore.playerAtHandIndex)"
    >
      DRAW CARD
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from "../stores/gameStore";
import { computed } from "vue";
import CardComponent from "../components/CardComponent.vue";
import type { Card } from "../model/Card_model";
import { canPlayCard } from "../utils/random_utils";

const gameStore = useGameStore();

const playerHand = computed(() => gameStore.getPlayerHand);

const isThereAPlayableCard = computed(() => gameStore.isThereAPlayableCard);

const isPlayerTurn = computed(() => {
  return gameStore.playerAtHandIndex === 0;
});

// Create unique keys for each card
const cardKey = (card: Card) => {
  return card.type === "NUMBERED"
    ? `${card.colour}-${card.value}`
    : `${card.type}-${card.colour || "no-colour"}`;
};
</script>
