<script setup>
import { useFlashcardStore } from "./stores/flashcard";
import { onMounted } from "vue";

onMounted(() => useFlashcardStore().initSettings());
</script>

<template>
  <span class="HGRKK-preloader">日本語</span>

  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style scoped>
.HGRKK-preloader {
  position: absolute;
  top: -1000px;
  left: -1000px;
  opacity: 0.1;
}
.view-container,
.fade-leave-active,
.fade-enter-active {
  transition: all 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
