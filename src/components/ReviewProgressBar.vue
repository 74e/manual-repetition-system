<script setup>
import { useFlashcardStore } from "@/stores/flashcard";
import { computed } from "vue";

const flashcardStore = useFlashcardStore();
const flashcards = computed(() => flashcardStore.flashcards);
const progress = computed(() => flashcardStore.passed.length + flashcardStore.failed.length + 1);
</script>

<template>
  <div class="progress-bar">
    <div class="width-limiter">
      <div class="passed">
        <span class="stat">{{ flashcardStore.passed.length }}</span>
        <span class="label">Passed</span>
      </div>

      <div class="progress">
        <span class="current">{{ progress }}</span>
        <span class="divider">of</span>
        <span class="total">{{ flashcards.length }}</span>
      </div>

      <div class="failed">
        <span class="stat">{{ flashcardStore.failed.length }}</span>
        <span class="label">Failed</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  border-bottom: 1px solid var(--vue-green-75);

  .width-limiter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 22px;
    gap: 22px;
  }

  @media (min-width: 1960px) {
    .width-limiter {
      margin: auto;
      max-width: 1960px;
    }
  }

  .progress {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 22px;
    color: var(--vue-green);
  }

  .divider {
    font-size: 18px;
    color: var(--vue-green-75);
  }

  .passed,
  .failed {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .stat {
      color: var(--vue-green);
    }

    .label {
      font-size: 10px;
      line-height: 4px;
      color: var(--vue-green-75);
    }
  }

  .failed {
    .stat {
      color: var(--vue-red);
    }

    .label {
      color: var(--vue-red-75);
    }
  }
}
</style>
