<script setup>
import KanaSetupScreen from "@/components/KanaSetupScreen.vue";
import ResultScreen from "@/components/ResultScreen.vue";
import ReviewScreen from "@/components/ReviewScreen.vue";
import { useFlashcardStore } from "@/stores/flashcard";
import { onMounted } from "vue";

const flashcardStore = useFlashcardStore();

onMounted(flashcardStore.initializeNewReviewSession);
</script>

<template>
  <main>
    <KanaSetupScreen v-if="flashcardStore.reviewState == 'setup'" />
    <ReviewScreen v-if="flashcardStore.reviewState == 'active'" />
    <ResultScreen v-if="flashcardStore.reviewState == 'finished'" />
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
}
</style>
