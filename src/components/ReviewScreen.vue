<script setup>
import ReviewProgressBar from "./ReviewProgressBar.vue";
import CancelReviewLoader from "./CancelReviewLoader.vue";
import { useFlashcardStore } from "@/stores/flashcard";
import { ref, computed, onMounted, onUnmounted } from "vue";
import ButtonComponent from "./ButtonComponent.vue";
import KanjiTemplate from "./KanjiTemplate.vue";
import WordTemplate from "./WordTemplate.vue";
import KanaTemplate from "./KanaTemplate.vue";

const flashcardStore = useFlashcardStore();
const { getNextFlashcard } = flashcardStore;

const cardFlippedAction = ref(false);

const currentFlashcard = computed(() => flashcardStore.flashcards[flashcardStore.currentIndex]);

const cardFlipped = computed(() => {
  if (flashcardStore.reviewType == "recall") {
    return !cardFlippedAction.value;
  } else {
    return cardFlippedAction.value;
  }
});

const reviewIsDone = computed(() => {
  return flashcardStore.flashcards.length <= flashcardStore.failed.length + flashcardStore.passed.length;
});

function handleFlashcardFlip() {
  if (reviewIsDone.value) return;

  cardFlippedAction.value = true;
}

function handleNextFlashcard(result) {
  if (cardFlippedAction.value) {
    getNextFlashcard(result);
    cardFlippedAction.value = false;
  }
}

function handleKeyPressDown(e) {
  // space
  if (e.keyCode == 32) {
    handleFlashcardFlip();
    return;
  }

  if (e.key == "1") {
    handleNextFlashcard("fail");
    return;
  }

  if (e.key == "3") {
    handleNextFlashcard("pass");
  }
}

const templates = computed(() => ({ kanji: KanjiTemplate, word: WordTemplate, romaji: KanaTemplate }));

onMounted(() => {
  if (flashcardStore.reviewMethod == "write") return;

  window.addEventListener("keydown", handleKeyPressDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPressDown);
});
</script>

<template>
  <div class="review-area">
    <ReviewProgressBar />

    <template v-for="type in ['kanji', 'word', 'romaji']">
      <component
        v-if="currentFlashcard[type]"
        :is="templates[type]"
        :currentFlashcard="currentFlashcard"
        :cardFlipped="cardFlipped"
        :uiFeedback="flashcardStore.uiFeedback"
        :key="type"
      />
    </template>

    <div v-if="flashcardStore.reviewMethod !== 'write'" class="flashcard-controls">
      <ButtonComponent v-if="!cardFlippedAction" @click="handleFlashcardFlip" :class="flashcardStore.uiFeedback">
        {{ reviewIsDone ? "Done" : "Show Answer" }}
      </ButtonComponent>

      <template v-else>
        <ButtonComponent color="red" @click="handleNextFlashcard('fail')">Fail</ButtonComponent>
        <ButtonComponent @click="handleNextFlashcard('pass')">Pass</ButtonComponent>
      </template>
    </div>

    <Transition>
      <div v-if="flashcardStore.uiFeedback">
        <div :class="[`answer-feedback-${value}`, flashcardStore.uiFeedback]" v-for="value in ['r', 'l']" />
      </div>
    </Transition>
  </div>

  <CancelReviewLoader />
</template>

<style scoped>
.flashcard-controls {
  padding: 16px 16px 62px 16px;
  display: flex;
  justify-content: center;
  gap: 24px;

  button {
    transition: all 0.6s ease;
  }

  .pass {
    filter: brightness(1.3);
  }

  .fail {
    border-color: var(--vue-red);
    color: var(--vue-red);
  }
}

.review-area {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.answer-feedback-l {
  left: 0;
}

.answer-feedback-l,
.answer-feedback-r {
  position: fixed;
  height: 100%;
  width: 28%;
  top: 0;

  &.pass {
    background: linear-gradient(90deg, rgba(79, 150, 135, 0.25) -105%, rgba(79, 150, 135, 0.15) -16%, rgba(0, 0, 0, 0) 91%);
  }

  &.fail {
    background: linear-gradient(90deg, rgba(165, 64, 64, 0.25) -105%, rgba(165, 64, 64, 0.15) -16%, rgba(0, 0, 0, 0) 91%);
  }
}

.answer-feedback-r {
  right: 0;

  &.pass {
    background: linear-gradient(-90deg, rgba(79, 150, 135, 0.25) -105%, rgba(79, 150, 135, 0.15) -16%, rgba(0, 0, 0, 0) 91%);
  }

  &.fail {
    background: linear-gradient(-90deg, rgba(165, 64, 64, 0.25) -105%, rgba(165, 64, 64, 0.15) -16%, rgba(0, 0, 0, 0) 91%);
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
