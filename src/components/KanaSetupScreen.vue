<script setup>
import FeedbackAnimationButton from "@/components/FeedbackAnimationButton.vue";
import { useFlashcardStore } from "@/stores/flashcard";
import { ref, computed, onMounted } from "vue";
import ButtonComponent from "./ButtonComponent.vue";
import ReturnButton from "./ReturnButton.vue";
import ShortcutGuide from "./ShortcutGuide.vue";

const flashcardStore = useFlashcardStore();
const { dataset, addSelectedData, setReviewMethod, setRecognitionType, setReviewType } = flashcardStore;

const gridItemSize = ref("100px");
const selectedKana = ref([]);
const reverseKanaOption = { hiragana: "katakana", katakana: "hiragana" };

function padKanaGrid(value) {
  switch (value.length) {
    case 3:
      return [value[0], {}, value[1], {}, value[2]];
    case 2:
      return [value[0], {}, {}, {}, value[1]];
    case 1:
      return [value[0], {}, {}, {}, {}];
    default:
      return value;
  }
}

function handleClickIndividualKana(kana) {
  if (!kana.romaji) return;

  if (selectedKana.value.some((k) => k.hiragana == kana.hiragana)) {
    selectedKana.value = selectedKana.value.filter((k) => k.hiragana !== kana.hiragana);
  } else {
    selectedKana.value.push(kana);
  }

  addSelectedData(selectedKana.value);
}

function handleClickKanaGroup(kanaGroupRaw) {
  const kanaGroup = Object.values(kanaGroupRaw)[0];

  if (!kanaGroup[0].romaji) return;

  if (isInSelected(kanaGroup)) {
    const kanaSet = new Set(kanaGroup.map((kg) => kg.hiragana));
    selectedKana.value = selectedKana.value.filter((k) => !kanaSet.has(k.hiragana));
  } else {
    selectedKana.value.push(...kanaGroup);
  }

  addSelectedData(selectedKana.value);
}

function handleSelectType(type = "all") {
  let initial = 0;
  if (type == "youon") initial = 16;

  let acc = [];

  for (let i = initial; i < dataset.kana.length; i++) {
    if (i > 15 && type == "basic") break;
    const group = Object.values(dataset.kana[i]);

    for (let j = 0; j < group.length; j++) {
      acc.push(...group[j]);
    }
  }

  selectedKana.value = acc;

  addSelectedData(selectedKana.value);
}

function handleUnselectAll() {
  selectedKana.value = [];
}

function isInSelected(items) {
  const selectedSet = new Set(selectedKana.value.map((k) => k.hiragana));
  return items.every((item) => selectedSet.has(item.hiragana));
}

function initializeReview() {
  flashcardStore.startReview();
}

const selectedKanaType = computed(() => {
  return flashcardStore.selectedKanaType;
});

const kanaRecognitionLabel = computed(() => {
  return reverseKanaOption[selectedKanaType.value];
});

function displayGuideLabel(kanaItem) {
  if (flashcardStore.recognitionType == "romaji") {
    return kanaItem.romaji;
  } else {
    return kanaItem[kanaRecognitionLabel.value];
  }
}

onMounted(() => {
  let hash = window.location.hash?.split("#")[2];
  if (!["hiragana", "katakana"].includes(hash)) hash = "hiragana";
  flashcardStore.selectedKanaType = hash;
});
</script>

<template>
  <div class="setup-area">
    <ReturnButton />
    <FeedbackAnimationButton />

    <div class="list-container">
      <div class="title">{{ selectedKanaType }}</div>

      <div class="region-selection">
        <button @click="handleSelectType('all')">Select All</button>
        <button @click="handleSelectType('basic')">All Basic Kana</button>
        <button @click="handleSelectType('youon')">All Yōon Kana</button>
        <button @click="handleUnselectAll">Unselect All</button>
      </div>

      <div class="selection-box-container">
        <div class="row">
          <div class="top-labels">
            <div class="grid-item" v-for="vowel in ['a', 'i', 'u', 'e', 'o']">
              {{ vowel }}
            </div>
          </div>
        </div>

        <div class="row" v-for="kanaGroup in dataset.kana">
          <div class="selection-box" @click="handleClickKanaGroup(kanaGroup)">
            <div :class="['tick-box', isInSelected(Object.values(kanaGroup)[0]) && 'active']" />
          </div>

          <template v-for="(value, key) in kanaGroup" :key="key">
            <div class="row-label">{{ !["vowels", "n_final"].includes(key) ? key : key == "n_final" ? "n" : null }}</div>

            <div class="grid-row-container">
              <div
                :class="[
                  'grid-item',
                  selectedKana.some((k) => k[selectedKanaType] == kana[selectedKanaType]) && 'selected',
                  !kana.romaji && 'empty-cell',
                ]"
                @click="handleClickIndividualKana(kana)"
                v-for="kana in padKanaGrid(value)"
              >
                {{ kana[selectedKanaType] }}
                <span class="kana-guide">{{ displayGuideLabel(kana) }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="setup-menu-container">
      <div class="setup-menu">
        <div class="setup-data">
          <div class="count-container">
            <span class="value">{{ selectedKana.length }}</span>
            <span class="label">Kana Selected</span>
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

          <button
            :class="['review-type-button', { activeType: value == flashcardStore.recognitionType }]"
            v-for="value in ['kana', 'romaji']"
            :disabled="flashcardStore.reviewMethod == 'write'"
            @click="setRecognitionType(value)"
            :key="value"
          >
            {{ value == "kana" ? kanaRecognitionLabel : value }}
          </button>

          <button
            :class="['review-type-button', { activeType: value == flashcardStore.reviewMethod }]"
            v-for="value in ['write', 'flashcard']"
            :disabled="flashcardStore.reviewType == 'recall'"
            @click="setReviewMethod(value)"
            :key="value"
          >
            {{ value }}
          </button>
        </div>

        <ButtonComponent class="start-button" :isDisabled="selectedKana.length < 1" @click="initializeReview">
          Start Review
        </ButtonComponent>

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
  .row {
    display: flex;
    position: relative;
    justify-content: end;
    cursor: pointer;

    &:nth-child(1) {
      .grid-item {
        border: none;
      }
    }

    &:nth-child(2) {
      .row-label {
        border: none;
      }
    }

    &:nth-child(3) {
      .row-label {
        border-radius: 11px 0 0 0;
        border-width: 2px 0 0 2px;
      }
    }

    &:last-child {
      .row-label {
        border-radius: 0 0 0 11px;
        border-width: 0 0 2px 2px;
      }

      .grid-row-container {
        border-bottom: 2px solid var(--vue-green);
        border-radius: 0 0 11px 0;
      }
    }
  }

  .row-label {
    height: v-bind(gridItemSize);
    width: 32px;
    font-size: 20px;
    align-content: center;
    text-align: center;
    border: solid var(--vue-green);
    border-width: 0 0 0 2px;
  }

  .grid-row-container {
    display: flex;
    justify-content: space-between;
    width: calc(5 * v-bind(gridItemSize));
    height: v-bind(gridItemSize);
    background-color: var(--vue-green-40);
    border: solid var(--vue-green);
    border-width: 1px 2px 0 2px;
  }

  .grid-item {
    position: relative;
    height: v-bind(gridItemSize);
    width: v-bind(gridItemSize);
    border-right: 1px solid var(--vue-green);
    font-size: 38px;
    align-content: center;
    text-align: center;
    user-select: none;

    .kana-guide {
      font-size: 14px;
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
    }

    &:last-child {
      border-right: none;
    }

    &:hover {
      background-color: var(--vue-green-45);
    }

    &.empty-cell {
      &:hover {
        background: none;
      }
    }

    &.selected {
      background-color: var(--vue-green-45);

      &::after {
        content: "";
        position: absolute;
        top: 8px;
        left: 8px;
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background-color: var(--vue-green);
      }
    }
  }

  .top-labels {
    display: flex;
    width: calc(5 * v-bind(gridItemSize));
    justify-content: space-between;
    border: solid var(--vue-green);
    border-width: 2px 2px 1px 2px;
    border-radius: 11px 11px 0 0;
    margin-left: 60px;

    .grid-item {
      height: auto;
      font-size: 20px;
      border-right: 1px solid var(--vue-green);

      &:hover {
        background: none;
      }
    }
  }

  .selection-box {
    position: absolute;
    inset: 0 2px 0 -32px;
    padding-left: 14px;
    align-content: center;
    border-radius: 11px 0 0 11px;

    &:hover {
      background-color: var(--vue-green-45);
      border: 1px solid var(--vue-green-50);
    }
  }

  .tick-box {
    border-radius: 5px;
    border: 2px solid var(--vue-green);
    height: 32px;
    width: 32px;

    &.active {
      background-color: var(--vue-green-50);
      position: relative;

      &::after {
        content: "";
        display: block;
        position: absolute;
        width: 18px;
        height: 18px;
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
  gap: 16px;
  padding: 50px 0;
}

.region-selection {
  display: flex;
  width: calc(5 * v-bind(gridItemSize));
  margin-left: auto;
  border-radius: 4px;
  border: 1px solid var(--vue-green);

  button {
    flex: 1;
    background: none;
    border: none;
    font-size: 14px;
    color: var(--vue-green);
    padding: 4px;
    align-content: center;
    cursor: pointer;

    &:hover {
      background-color: var(--vue-green-45);
    }
  }
}

.title {
  padding-left: 70px;
  font-size: 28px;
  text-align: center;
  color: var(--vue-green);
  text-transform: capitalize;
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
      margin: auto;

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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    border-radius: 11px;
    border: 2px solid var(--vue-green);
    width: 500px;

    .review-type-button {
      width: 100%;
      background: none;
      padding: 12px;
      font-size: 20px;
      color: var(--vue-green);
      border: none;
      text-transform: capitalize;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &:hover {
        background: var(--vue-green-45);
      }

      &.activeType {
        background: var(--vue-green-50);
      }

      &:nth-child(odd) {
        border-right: 1px solid var(--vue-green);
      }

      &:nth-child(-n + 4) {
        border-bottom: 1px solid var(--vue-green);
      }

      &:disabled {
        color: var(--vue-green-45);
        background: none;
        cursor: default;
      }
    }
  }

  .start-button {
    margin-top: 36px;
  }
}
</style>
