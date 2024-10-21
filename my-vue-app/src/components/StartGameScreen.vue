<template>
  <div
    class="flex flex-col justify-center bg-slate-200 items-center h-[100vh] w-full"
  >
    <div
      class="flex flex-col bg-blue-500 w-[290px] h-[350px] px-5 py-3 max-w-sm rounded overflow-hidden shadow-lg"
    >
      <img src="/assets/unologo.png" />
      <form
        @submit.prevent="startGame"
        class="flex flex-col w-[250px] space-y-5"
      >
        <div>
          <label for="playerName">Your Name: </label>
          <input
            v-model="store.playerName"
            type="text"
            required
            class="w-full px-1"
          />

          <label for="botCount">Number of Bots: </label>
          <select v-model="botCount" required class="w-full px-1">
            <option value="1">1 Bot</option>
            <option value="2">2 Bots</option>
            <option value="3">3 Bots</option>
          </select>
        </div>
        <button
          type="submit"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Start Game
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useGameStore } from "../stores/gameStore";

const botCount = ref("1");

const router = useRouter();
const store = useGameStore();

const startGame = () => {
  store.startGame(store.playerName.value, botCount.value);
  router.push("/play");
};
</script>
