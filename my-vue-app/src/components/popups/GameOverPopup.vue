<template>
  <Popup>
    <h2>Winner!</h2>
    <p>
      {{ game?.getWinner()?.name }} is the winner with
      {{ game?.getWinner()?.score }} points!
    </p>
    <button @click="onPlayAgain">Play Again!</button>
  </Popup>
</template>
<script setup lang="ts">
import Popup from "./Popup.vue";
import { useGameStore } from "../../stores/gameStore";

const store = useGameStore();
const { playAgain, game } = store;

const onPlayAgain = () => {
  playAgain();
};
</script>
