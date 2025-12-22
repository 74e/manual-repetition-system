<script setup>
import ResultScreen from "@/components/ResultScreen.vue";
import ReviewScreen from "@/components/ReviewScreen.vue";
import KanjiSetupScreen from "@/components/KanjiSetupScreen.vue";
import { useFlashcardStore } from "@/stores/flashcard";
import { onMounted } from "vue";

const flashcardStore = useFlashcardStore();

function initializeState() {
  const inProgressReview = localStorage.getItem("kanjiReview");
  if (inProgressReview) {
    // Initialize with data from localStorage
  }

  flashcardStore.initializeNewReviewSession("kanji");
}

onMounted(initializeState);
</script>

<template>
  <main>
    <KanjiSetupScreen v-if="flashcardStore.reviewState == 'setup'" />
    <ReviewScreen v-if="flashcardStore.reviewState == 'active'" />
    <ResultScreen v-if="flashcardStore.reviewState == 'finished'" />
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
}
</style>
