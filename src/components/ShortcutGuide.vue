<script setup>
import { useFlashcardStore } from "@/stores/flashcard";
const flashcardStore = useFlashcardStore();
</script>

<template>
  <div class="setup-information">
    <span class="label">Controls/Shortcuts</span>

    <div class="shortcuts-container">
      <div class="shortcut-item">
        <span class="tooltip">End/Cancel Review</span>
        <div class="key"><span>Esc</span></div>
      </div>

      <template v-if="flashcardStore.reviewMethod == 'flashcard'">
        <div class="shortcut-item">
          <span class="tooltip">Fail Card</span>
          <div class="key"><span>1</span></div>
        </div>

        <div class="shortcut-item">
          <span class="tooltip">Pass Card</span>
          <div class="key"><span>3</span></div>
        </div>

        <div class="shortcut-item">
          <span class="tooltip">Reveal backside</span>
          <div class="key"><span>Space</span></div>
        </div>
      </template>

      <template v-else>
        <div class="shortcut-item">
          <span class="tooltip">Confirm input</span>
          <div class="key"><span>Enter</span></div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.setup-information {
  width: 100%;
  margin: 36px 0;

  .label {
    font-size: 28px;
    text-align: center;
    display: block;
  }

  .shortcuts-container {
    display: flex;
    justify-content: center;
    gap: 24px;
    padding-top: 24px;

    .shortcut-item {
      position: relative;

      &:hover {
        .tooltip {
          display: block;
          opacity: 1;

          @starting-style {
            opacity: 0;
          }
        }
      }

      .tooltip {
        position: absolute;
        bottom: calc(100% + 16px);
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;

        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        background-color: var(--color-background-darker);
        border: 1px solid var(--vue-green-45);
        border-radius: 11px;
        text-wrap: nowrap;
        font-size: 22px;
        padding: 8px 10px;

        display: none;
        opacity: 0;
        transition-property: opacity display;
        transition-duration: 0.4s;
        transition-behavior: allow-discrete;
      }

      .key {
        width: fit-content;
        padding: 16px;
        border-radius: 5px;
        border: 1px solid var(--vue-green-50);
        box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, var(--vue-green-45) 0px 7px 13px -3px, rgba(0, 0, 0, 0.35) 0px -10px 0px inset;
        font-size: 22px;
        min-height: 70px;
        min-width: 70px;
        text-align: center;
        cursor: pointer;
        transition: all 0.15s;

        span {
          display: block;
          transform: translateY(-4px);
          transition: all 0.15s;
        }

        &:hover {
          box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, var(--vue-green-50) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -4px 0px inset;

          span {
            transform: translateY(0);
          }
        }
      }
    }
  }
}
</style>
