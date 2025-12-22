<script setup>
import { useFlashcardStore } from "@/stores/flashcard";
const flashcardStore = useFlashcardStore();
</script>

<template>
  <button class="feedback-animation-button" @click="flashcardStore.toggleUiFeedbackStatus">
    Feedback Animation {{ flashcardStore.disableUiFeedback ? "OFF" : "ON" }}
  </button>
</template>

<style>
.feedback-animation-button {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1;

  padding: 16px;
  font-size: 18px;
  border-radius: 11px;
  border: 1px solid var(--vue-green-75);
  color: var(--vue-green);
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--vue-green-40);
  }
}

@media (min-width: 1960px) {
  .feedback-animation-button {
    right: calc(50% - 960px);
  }
}
</style>
