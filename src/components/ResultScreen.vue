<script setup>
import { useFlashcardStore } from "@/stores/flashcard";
import FlashcardListPreview from "./FlashcardListPreview.vue";
import ButtonComponent from "./ButtonComponent.vue";

const flashcardStore = useFlashcardStore();
const { returnToSetup, redoFailedFlashcards } = flashcardStore;
</script>

<template>
  <div class="result-area">
    <div class="result-section">
      <div class="results-container">
        <div class="result passed">
          <span class="value">{{ flashcardStore.passed.length }}</span>
          <span class="label">Passed</span>
        </div>

        <FlashcardListPreview :flashcardItems="flashcardStore.passed" width="370px" height="420px" />
      </div>

      <div class="results-container">
        <div class="result failed">
          <span class="value">{{ flashcardStore.failed.length }}</span>
          <span class="label">Failed</span>
        </div>

        <FlashcardListPreview :flashcardItems="flashcardStore.failed" width="370px" height="420px" color="red" />
      </div>
    </div>

    <div class="actions">
      <ButtonComponent @click="returnToSetup()">Return</ButtonComponent>
      <ButtonComponent color="red" :isDisabled="flashcardStore.failed < 1" @click="redoFailedFlashcards()">Redo Failed</ButtonComponent>
    </div>
  </div>
</template>

<style scoped>
.result-area {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 46px;
}

.result-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 56px;
  color: var(--vue-green);

  .results-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 16px;
  }

  .result {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .label {
      font-size: 28px;
    }

    .value {
      font-size: 56px;
      line-height: 48px;
    }

    &.failed {
      .value,
      .label {
        color: var(--vue-red);
      }
    }
  }
}

.actions {
  display: flex;
  gap: 56px;
}
</style>
