<script setup>
import { useFlashcardStore } from "./stores/flashcard";
import { onMounted } from "vue";

onMounted(() => useFlashcardStore().initSettings());
</script>

<template>
  <span class="font-preloader HGRKK">日本語</span>
  <span class="font-preloader stroke-order">日本語</span>

  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style scoped>
.font-preloader {
  position: absolute;
  top: -1000px;
  left: -1000px;
  opacity: 0.1;
}

.HGRKK {
  font-family: "HGRKK";
}

.stroke-order {
  font-family: "KanjiStrokeOrders";
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
