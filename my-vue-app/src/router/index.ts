// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import StartGameScreen from "../components/StartGameScreen.vue";
import GameBoard from "../components/GameBoard.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "StartGame",
    component: StartGameScreen,
  },
  {
    path: "/play",
    name: "GameBoard",
    component: GameBoard,
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
