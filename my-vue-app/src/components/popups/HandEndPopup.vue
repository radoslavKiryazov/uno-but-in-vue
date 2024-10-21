<template>
  <Popup>
    <h2>Winner!</h2>
    <p>{{ store.winnerName }} has won the hand!</p>
    <p>Score: {{ store.winnerScore }}</p>
    <button @click="onStartNewHand">Start new hand</button>
  </Popup>
</template>

<script setup>
import Popup from "./Popup.vue";
import { useGameStore } from "../../stores/gameStore";

const props = defineProps({
  isVisible: Boolean,
  winnerName: String,
  winnerScore: Number,
});

const store = useGameStore();

const onStartNewHand = () => {
  store.startNewHand();
};
</script>
