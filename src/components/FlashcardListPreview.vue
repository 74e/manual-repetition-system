<script setup>
import { useFlashcardStore } from "@/stores/flashcard";
import { computed } from "vue";

const props = defineProps({
  flashcardItems: {
    type: Array,
    default: [],
  },
  color: {
    type: String,
    default: "green",
    validator: (colorType) => ["green", "red"].includes(colorType),
  },
  width: {
    type: String,
    default: "440px",
  },
  height: {
    type: String,
    default: "540px",
  },
  title: {
    type: String,
    default: "",
  },
});

const flashcardStore = useFlashcardStore();

const isWritingReview = computed(() => props.flashcardItems[0].romaji && flashcardStore.reviewMethod == "write");
const isKanaReview = computed(() => props.flashcardItems[0].romaji && flashcardStore.reviewMethod !== "write");

const displayFormat = computed(() => {
  let item = {};

  const oppositeKana = {
    hiragana: "katakana",
    katakana: "hiragana",
  };

  let recognitionValue;
  if (flashcardStore.recognitionType == "kana") {
    recognitionValue = oppositeKana[flashcardStore.selectedKanaType];
  } else {
    recognitionValue = "romaji";
  }

  let isReversed = flashcardStore.reviewType == "recall";

  item[!isReversed ? "front" : "back"] = flashcardStore.selectedKanaType;
  item[isReversed ? "front" : "back"] = recognitionValue;

  return item;
});
</script>

<template>
  <div>
    <div v-if="title" class="title-container">
      <div :class="['label']">{{ title }}</div>
      <div class="flashcard-count">{{ flashcardItems.length }} Flashcards</div>
    </div>

    <div :class="['kanji-set', title && 'alt', color]">
      <ul>
        <li
          :class="['kanji-item', isWritingReview && 'write-review', isKanaReview && 'kana-review']"
          v-for="flashcardItem in flashcardItems"
        >
          <template v-if="flashcardItem.kanji">
            <span class="kanji">{{ flashcardItem.kanji }}</span>
            <span class="keyword">{{ flashcardItem.keyword }}</span>
            <span class="keyword">{{ flashcardItem.reading.onyomi }}</span>
            <span class="keyword">{{ flashcardItem.reading.kunyomi }}</span>
          </template>

          <template v-if="flashcardItem.word">
            <span class="kanji">{{ flashcardItem.word }}</span>
            <span class="keyword">{{ flashcardItem.kana }}</span>
            <span class="keyword">{{ flashcardItem.meaning }}</span>
          </template>

          <template v-if="isKanaReview" v-for="value in ['Front', 'Back']">
            <span class="kana-item">
              {{ value }}side <span class="val">{{ flashcardItem[displayFormat[value.toLowerCase()]] }}</span>
            </span>
          </template>

          <template v-if="isWritingReview">
            <div class="kana-item">
              Kana <span class="val">{{ flashcardItem[flashcardStore.selectedKanaType] }}</span>
            </div>
            <div class="kana-item">
              Reading <span class="val">{{ flashcardItem.romaji }}</span>
            </div>
            <div v-if="flashcardItem.romaji !== flashcardItem.answer" class="kana-item">
              Answer <span class="val">{{ flashcardItem.answer }}</span>
            </div>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.title-container {
  display: flex;
  align-items: center;
  border: solid var(--vue-green);
  border-width: 2px 2px 0 2px;
  border-radius: 11px 11px 0px 0px;
  font-size: 18px;
  padding: 4px 16px;

  .label {
    text-align: center;
    /* border-bottom: 2px solid var(--vue-green); */
    font-size: 24px;
    margin-right: auto;
    text-transform: capitalize;
  }
}

.kanji-set {
  width: v-bind(width);
  border-radius: 11px;
  border: 1px solid;

  &.alt {
    border-radius: 0px 0px 11px 11px;
    border-width: 2px;
  }

  &.green {
    border-color: var(--vue-green);
    background-color: var(--vue-green-40);

    li {
      border-bottom: 1px solid var(--vue-green);
      color: var(--vue-green);
    }
  }

  &.red {
    border-color: var(--vue-red);
    background-color: var(--vue-red-40);

    li {
      border-bottom: 1px solid var(--vue-red);
      color: var(--vue-red);
    }
  }

  ul {
    list-style: none;
    height: v-bind(height);
    overflow: scroll;

    li {
      display: flex;
      align-items: center;
      padding: 12px;
      gap: 16px;
      text-wrap: nowrap;
      overflow: hidden;

      font-size: 18px;
      position: relative;

      .kanji {
        font-size: 22px;
        font-weight: 500;
      }

      .keyword {
        text-transform: capitalize;
      }

      .kana {
        text-transform: none;
      }

      &.write-review,
      &.kana-review {
        justify-content: space-around;
      }

      .kana-item {
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;

        &:nth-child(n + 2) {
          min-width: 100px;
        }

        &:nth-child(2) {
          padding-left: 4px;
        }

        .val {
          font-size: 22px;
          font-weight: bold;
        }
      }
    }

    &.kana-review {
      grid-template-columns: repeat(2, 50%) !important;
    }

    li:last-child {
      border: none;
    }
  }
}
</style>
