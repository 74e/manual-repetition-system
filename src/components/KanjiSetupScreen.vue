<script setup>
import FlashcardListPreview from "./FlashcardListPreview.vue";
import { useFlashcardStore } from "@/stores/flashcard";
import { computed, onMounted, ref } from "vue";
import ButtonComponent from "./ButtonComponent.vue";
import ReturnButton from "./ReturnButton.vue";
import ShortcutGuide from "./ShortcutGuide.vue";
import FeedbackAnimationButton from "./FeedbackAnimationButton.vue";

const flashcardStore = useFlashcardStore();
const { dataset, addSelectedData } = flashcardStore;

const seletedSets = ref([]);

const flatList = computed(() => {
  let allListItems = {};

  for (const key in dataset) {
    let loseItems = dataset[key];
    allListItems = { ...allListItems, ...loseItems };
  }

  return allListItems;
});

function handleListClick(list) {
  if (seletedSets.value.includes(list)) {
    seletedSets.value = seletedSets.value.filter((l) => l != list);
  } else {
    seletedSets.value.push(list);
  }

  addSelectedData(
    seletedSets.value.reduce((acc, curr) => {
      return [...acc, ...flatList.value[curr]];
    }, [])
  );
}

function initializeReview() {
  flashcardStore.startReview();
}

function setReviewType(type) {
  flashcardStore.reviewType = type;
}

function formatTitle(value, index) {
  return value.substring(0, index) + " " + value.substring(index);
}

onMounted(() => {
  flashcardStore.resetState();
});
</script>

<template>
  <div class="setup-area">
    <ReturnButton />
    <FeedbackAnimationButton />

    <div class="list-container">
      <div class="title">Kanji list</div>

      <div class="selection-box-container" @click="handleListClick(key)" v-for="(value, key) in dataset.kanji" :key="key">
        <div class="selection-box">
          <div :class="['tick-box', seletedSets.includes(key) && 'active']" />
        </div>

        <FlashcardListPreview :title="formatTitle(key.toUpperCase(), 3)" :flashcardItems="value" height="220px" />
      </div>

      <div class="title">Vocab list</div>

      <div class="selection-box-container" @click="handleListClick(key)" v-for="(value, key) in dataset.vocabulary" :key="key">
        <div class="selection-box">
          <div :class="['tick-box', seletedSets.includes(key) && 'active']" />
        </div>

        <FlashcardListPreview :title="key" :flashcardItems="value" height="220px" />
      </div>
    </div>

    <div class="setup-menu-container">
      <div class="setup-menu">
        <div class="setup-data">
          <div class="count-container">
            <span class="value">{{ seletedSets.length }}</span>
            <span class="label">Selected Set(s)</span>
          </div>

          <div class="count-container">
            <span class="value">{{ flashcardStore.selectedData.length }}</span>
            <span class="label">Flashcards</span>
          </div>
        </div>

        <div class="type-selection">
          <button
            :class="['review-type-button', { activeType: value == flashcardStore.reviewType }]"
            v-for="value in ['recall', 'recognition']"
            @click="setReviewType(value)"
            :key="value"
          >
            {{ value }}
          </button>
        </div>

        <ButtonComponent class="start-button" :isDisabled="seletedSets < 1" @click="initializeReview"
          >Start Review</ButtonComponent
        >

        <ShortcutGuide />
      </div>
    </div>
  </div>
</template>

<style scoped>
.setup-area {
  display: flex;
  justify-content: center;
  gap: 78px;
}

@media (min-width: 1960px) {
  .setup-area {
    position: relative;
    max-width: 1960px;
    margin: auto;
  }
}

.selection-area {
  overflow: scroll;
  height: 100%;
  width: 50%;
  padding: 56px;
}

.selection-box-container {
  display: flex;
  cursor: pointer;

  &:hover {
    .selection-box {
      background-color: var(--vue-green-45);
    }
  }

  .selection-box {
    padding: 16px;
    border-radius: 11px;
    transition: all 0.1s ease-in-out;
    margin-right: 8px;
    align-content: center;
  }

  .tick-box {
    border-radius: 5px;
    border: 2px solid var(--vue-green);
    height: 38px;
    width: 38px;

    &.active {
      background-color: var(--vue-green-50);
      position: relative;

      &::after {
        content: "";
        display: block;
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 3px;
        background-color: var(--vue-green);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

.list-container {
  display: flex;
  flex-direction: column;
  width: fit-content;
  gap: 26px;
  padding: 50px 0;
}

.title {
  padding-left: 70px;
  font-size: 28px;
  text-align: center;
  color: var(--vue-green);
}

.setup-menu-container {
  flex: stretch;
  position: relative;
}

.setup-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  height: 100vh;

  .setup-data {
    width: 100%;
    display: flex;
    padding: 0 36px;
    gap: 36px;
    margin: 120px 0 36px 0;

    .count-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: 50%;

      .label {
        font-size: 28px;
      }

      .value {
        font-size: 56px;
        line-height: 48px;
      }
    }
  }

  .type-selection {
    display: flex;
    border-radius: 11px;
    overflow: hidden;
    border: 2px solid var(--vue-green);
    width: 500px;

    .review-type-button {
      width: 100%;
      background: none;
      padding: 20px;
      font-size: 20px;
      color: var(--vue-green);
      border: none;
      text-transform: capitalize;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &.activeType {
        background: var(--vue-green-50);
      }

      &:hover {
        background: var(--vue-green-50);
      }

      &:first-child {
        border-right: 2px solid var(--vue-green);
      }
    }
  }

  .start-button {
    margin-top: 36px;
  }
}
</style>
