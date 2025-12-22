<script setup>
defineProps({
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
</script>

<template>
  <div v-if="cardFlipped" :class="['flashcard-side meaning-side', uiFeedback]">
    <div class="meaning">
      <div class="label">Meaning</div>
      <div class="kanji-meaning">{{ currentFlashcard.meaning }}</div>
    </div>

    <div v-if="currentFlashcard.reading.onyomi" class="onyomi">
      <div class="label">Onyomi</div>
      <div class="reading-list">{{ currentFlashcard.reading.onyomi }}</div>
    </div>

    <div v-if="currentFlashcard.reading.kunyomi" class="kunyomi">
      <div class="label">Kunyomi</div>
      <div class="reading-list">{{ currentFlashcard.reading.kunyomi }}</div>
    </div>
  </div>

  <div v-else :class="['flashcard-side kanji-side', uiFeedback]">
    <span>{{ currentFlashcard.kanji }}</span>
  </div>
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

  &.kanji-side {
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

  .meaning {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid var(--vue-green);
    border-radius: 11px;
    min-width: 500px;
    margin-bottom: 24px;
    font-size: 40px;

    .label {
      text-align: center;
      border-bottom: 2px solid var(--vue-green);
      font-size: 24px;
      width: 100%;
      padding: 4px;
    }

    .kanji-meaning {
      padding: 34px;
      text-transform: capitalize;
    }
  }
}
</style>
