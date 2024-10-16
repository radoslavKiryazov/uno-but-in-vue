<template>
  <div
    class="flex items-center justify-center fixed top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-xl"
  >
    <div class="flex flex-col justify-center items-center bg-white p-32">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
