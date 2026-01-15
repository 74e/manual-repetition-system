<script setup>
import { useFlashcardStore } from "@/stores/flashcard";
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";

const props = defineProps({
  currentFlashcard: {
    require: true,
  },
  cardFlipped: {
    type: Boolean,
    require: true,
  },
  uiFeedback: {
    type: String,
    require: true,
  },
});

const romajiInput = ref("");
const romajiInputEl = useTemplateRef("romajiInputEl");
const flashcardStore = useFlashcardStore();
const showStrokeOrder = ref(false);

const { getNextFlashcard } = flashcardStore;

watch(romajiInput, () => {
  if (romajiInput.value.length > 3) romajiInput.value = romajiInput.value.slice(0, 3);
});

function handleSubmitAnswer() {
  if (romajiInput.value == "") return;
  const answer = romajiInput.value.toLowerCase();
  let answerStatus = "";

  if (props.currentFlashcard.romaji == answer) {
    answerStatus = "correct";
  } else {
    answerStatus = "incorrect";
  }

  props.currentFlashcard.answer = answer;
  getNextFlashcard(answerStatus == "correct" ? "pass" : "fail");
  answerStatus = "";
  romajiInput.value = "";
}

const displayReviewKana = computed(() => props.currentFlashcard[flashcardStore.selectedKanaType]);

const displayReviewAnswer = computed(() => {
  if (flashcardStore.recognitionType == "romaji") {
    return props.currentFlashcard.romaji;
  } else {
    return props.currentFlashcard[{ hiragana: "katakana", katakana: "hiragana" }[flashcardStore.selectedKanaType]];
  }
});

const displayTitle = computed(() => {
  if (flashcardStore.reviewType == "recall") {
    return props.cardFlipped ? "Front Side" : "Back Side";
  } else {
    return !props.cardFlipped ? "Front Side" : "Back Side";
  }
});

function toggleShowStrokeOrder() {
  showStrokeOrder.value = !showStrokeOrder.value;
}

function handleShift(e) {
  if (e.key !== "Shift") return;

  if (e.type === "keydown") {
    if (e.repeat) return;
    showStrokeOrder.value = true;
  }

  if (e.type === "keyup") {
    showStrokeOrder.value = false;
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleShift);
  window.addEventListener("keyup", handleShift);

  if (flashcardStore.reviewMethod == "write") romajiInputEl.value.focus();
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleShift);
  window.removeEventListener("keyup", handleShift);
});
</script>

<template>
  <template v-if="flashcardStore.reviewMethod == 'flashcard'">
    <div v-if="!cardFlipped" class="flashcard-side">
      <div :class="['frame-container', uiFeedback]">
        <div class="label">{{ displayTitle }}</div>
        <div :class="['character', showStrokeOrder && 'stroke-order']" @click="toggleShowStrokeOrder">
          <span class="centering-char"> {{ displayReviewKana }}</span>
        </div>
      </div>
    </div>

    <div v-else class="flashcard-side answer-side">
      <div :class="['frame-container', uiFeedback]">
        <div class="label">{{ displayTitle }}</div>
        <div
          :class="['character', showStrokeOrder && 'stroke-order', flashcardStore.recognitionType == 'romaji' && 'normal-size']"
          @click="toggleShowStrokeOrder"
        >
          <span class="centering-char">{{ displayReviewAnswer }}</span>
        </div>
      </div>
    </div>
  </template>

  <template v-else>
    <div class="flashcard-side">
      <div :class="['frame-container', uiFeedback]">
        <div :class="['character', showStrokeOrder && 'stroke-order']" @click="toggleShowStrokeOrder">
          <span class="centering-char">{{ displayReviewKana }}</span>
        </div>
      </div>

      <input
        ref="romajiInputEl"
        :class="['romaji-input', uiFeedback]"
        v-model="romajiInput"
        @keydown.enter="handleSubmitAnswer"
      />
    </div>
  </template>
</template>

<style scoped>
.flashcard-side {
  font-size: 30px;
  color: var(--vue-green);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  flex: 1;

  &.answer-side {
    span {
      font-size: 180px;
      font-family: HGRKK;
    }
  }

  .onyomi,
  .kunyomi {
    display: flex;
    align-items: center;
    border: 2px solid var(--vue-green);
    border-radius: 11px;
    min-width: 390px;
    max-width: 620px;

    .label {
      height: 100%;
      padding: 16px;
      border-right: 2px solid var(--vue-green);
      align-content: center;
      text-transform: capitalize;
    }

    .reading-list {
      padding: 16px;
      text-align: center;
      width: 100%;
    }
  }

  .onyomi {
    .label {
      padding: 16px 22px 16px 22px;
    }
  }

  .frame-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid var(--vue-green);
    border-radius: 11px;
    min-width: 500px;
    margin-bottom: 24px;
    transition: all 0.6s ease;

    &.pass {
      filter: brightness(1.3);
    }

    &.fail {
      border-color: var(--vue-red);
      color: var(--vue-red);
      .label {
        border-color: var(--vue-red);
      }
    }

    .label {
      text-align: center;
      border-bottom: 2px solid var(--vue-green);
      font-size: 24px;
      width: 100%;
      padding: 4px;
      transition: all 0.6s ease;
    }

    .character {
      position: relative;
      padding: 34px;
      font-size: 100px;
      height: 200px;

      &.normal-size {
        .centering-char {
          font-size: 68px !important;
          font-family: Archivo !important;
        }
      }

      .centering-char {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .romaji-input {
    padding: 12px 16px;
    background: none;
    border: 3px solid var(--vue-green-75);
    border-radius: 11px;
    font-size: 28px;
    color: var(--vue-green);
    outline: none;
    margin-top: 100px;
    width: 140px;
    text-align: center;
    transition: all 0.3s;

    &.pass {
      filter: brightness(1.2);
      border-color: var(--vue-green);
    }

    &.fail {
      border-color: var(--vue-red);
    }
  }
}

.stroke-order {
  font-family: "KanjiStrokeOrders";
  font-size: 180px !important;
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
