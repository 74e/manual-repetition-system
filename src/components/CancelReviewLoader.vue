<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useFlashcardStore } from "@/stores/flashcard";

const flashcardStore = useFlashcardStore();
const showNoticeGuide = ref(false);
const timer = ref(0);
const holdDuration = 65;
let interval;

function startCancelReview(e) {
  if (e.repeat) return;

  if (e.keyCode == 27) {
    interval = setInterval(() => {
      timer.value++;

      if (timer.value >= holdDuration) {
        clearInterval(interval);
        flashcardStore.returnToSetup();
      }
    }, 10);
  }
}

function stopCancelReview(e) {
  if (e.keyCode !== 27) return;
  clearInterval(interval);

  if (timer.value < 20 && showNoticeGuide.value == false) {
    showNoticeGuide.value = true;

    setTimeout(() => {
      showNoticeGuide.value = false;
    }, 1500);
  }

  timer.value = 0;
}

onMounted(() => {
  window.addEventListener("keydown", startCancelReview);
  window.addEventListener("keyup", stopCancelReview);
});

onUnmounted(() => {
  window.removeEventListener("keydown", startCancelReview);
  window.removeEventListener("keyup", stopCancelReview);
});
</script>

<template>
  <TransitionGroup>
    <div class="notice guide" v-if="showNoticeGuide">
      <span>Hold Escape to Cancel Review</span>
    </div>

    <div class="notice" v-if="timer">
      <span>Cancel Review</span>
      <div :style="{ width: `${(timer / holdDuration) * 100}%` }" class="loading-bar" />
    </div>
  </TransitionGroup>
</template>

<style scoped>
.notice {
  overflow: hidden;
  padding: 16px 24px;
  border-radius: 11px;
  background-color: var(--color-background);
  border: 3px solid var(--vue-green-45);
  font-size: 22px;
  align-content: center;
  text-align: center;
  position: absolute;
  bottom: 100px;
  left: 50px;

  &.guide {
    bottom: 200px;
  }
}

@media (min-width: 1960px) {
  .notice {
    left: calc(50% - 960px);
  }
}

.loading-bar {
  height: 4px;
  border-radius: 4px;
  background-color: var(--vue-green);
  position: absolute;
  bottom: 0;
  left: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
