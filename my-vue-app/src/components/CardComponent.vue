<template>
  <img
    :src="cardImage"
    class="max-h-[200px] max-w-[200px] hover:animate-pulse cursor-pointer animate-fade-up animate-ease-in-out"
    @click="onClick"
    :key="cardImage"
  />
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";
import type { Card } from "../model/Card_model";

const props = defineProps<{
  card: Card;
  onClick?: () => void;
}>();

const { card } = props;

const cardImage = computed(() => {
  if (!props.card) {
    return "/assets/deck/back.png";
  }
  if (card.type === "NUMBERED") {
    return `/assets/deck/${card.colour.toLocaleLowerCase()}-${card.value}.png`;
  }
  if (card.type === "WILD") {
    return `/assets/deck/wild-card.png`;
  }
  if (card.type === "REVERSE") {
    return `/assets/deck/${card.colour.toLocaleLowerCase()}-reverse.png`;
  }
  if (card.type === "SKIP") {
    return `/assets/deck/${card.colour.toLocaleLowerCase()}-skip.png`;
  }
  if (card.type === "DRAWTWO") {
    return `/assets/deck/${card.colour.toLocaleLowerCase()}-draw-two.png`;
  }
  if (card.type === "WILDDRAWFOUR") {
    return `/assets/deck/wild-draw-four.png`;
  }
});
</script>
