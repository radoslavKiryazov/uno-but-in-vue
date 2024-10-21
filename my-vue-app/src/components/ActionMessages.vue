<template>
  <div class="flex flex-col justify-center items-center bg-white h-fit">
    <h1 class="">Action Log</h1>
    <div class="overflow">
      <div v-for="(message, index) in messages" :key="index">
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from "../stores/gameStore";
import { computed } from "vue";

const gameStore = useGameStore();

const messages = computed(() => gameStore.actionMessages);
</script>

<style scoped>
.message {
  padding: 5px 10px;
  margin-bottom: 5px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
</style>
