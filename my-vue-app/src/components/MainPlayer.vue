<template>
  <div class="flex flex-col gap-3 items-center">
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
        <p class="text-lg font-semibold text-gray-800">
          Score: {{ gameStore.players[0].score }}
        </p>
      </div>

      <div
        class="flex relative h-full pt-1 rounded-lg space-x-1 w-full px-4 py-4 items-center justify-center"
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
      <div class="flex gap-5 w-full h-[40px] items-center justify-center">
        <button
          v-if="true"
          class="bg-blue-500 text-white font-bold py-2 px-4 gap-2 rounded-lg shadow-md hover:bg-blue-600 transition flex flex-row justify-center items-center"
          :disabled="!isPlayerTurn"
          @click="() => gameStore.drawCard(gameStore.playerAtHandIndex)"
        >
          <img src="/assets/draw-card.png" class="h-[35px] w-[35px]" />
          DRAW CARD
        </button>
      </div>
    </div>
    <div class="flex w-[250px] items-center justify-center">
      <button
        v-if="showUNOButton"
        class="bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition w-full"
        :disabled="false"
        @click="
          () => {
            gameStore.callUNO(gameStore.players[0]);
            gameStore.addActionMessage(
              `${gameStore.players[0].name} called UNO!`
            );
          }
        "
      >
        UNO!
      </button>
      <button
        v-if="showInterruptUNOButton"
        class="bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition w-full"
        :disabled="false"
        @click="
          () => {
            gameStore.interruptUNO(botWithOneCard);
            gameStore.addActionMessage(
              `${gameStore.players[0].name} interrupted UNO!`
            );
          }
        "
      >
        Interrupt UNO!
      </button>
    </div>
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

const showUNOButton = computed(() => {
  return (
    playerHand.value.length === 1 && gameStore.players[0].calledUNO === false
  );
});

const showInterruptUNOButton = computed(() => {
  return botWithOneCard.value !== undefined && gameStore.playerCanInterrupt;
});
const botWithOneCard = computed(() => {
  return gameStore.players.find(
    (player) => player.isBot && player.hand.length === 1
  );
});

// Create unique keys for each card
const cardKey = (card: Card) => {
  return card.type === "NUMBERED"
    ? `${card.colour}-${card.value}`
    : `${card.type}-${card.colour || "no-colour"}`;
};
</script>
