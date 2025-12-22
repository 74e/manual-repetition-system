import dataset from "../data/dataset.json";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useFlashcardStore = defineStore("character", () => {
  const selectedData = ref([]);
  const flashcards = ref([]);
  const passed = ref([]);
  const failed = ref([]);
  const reviewState = ref("setup");
  const reviewType = ref("recognition");
  const selectedKanaType = ref("hiragana");
  const recognitionType = ref("romaji");
  const reviewMethod = ref("flashcard");
  const currentIndex = ref(0);
  const uiFeedback = ref("");
  const disableUiFeedback = ref(false);

  function addSelectedData(data) {
    selectedData.value = data;
  }

  function initializeNewReviewSession() {
    flashcards.value = selectedData.value;
    shuffleFlashcards();
    passed.value = [];
    failed.value = [];
    currentIndex.value = 0;
  }

  function startReview() {
    if (selectedData.value.length < 1) return;
    initializeNewReviewSession();
    reviewState.value = "active";
  }

  function finishReview() {
    reviewState.value = "finished";
  }

  function returnToSetup() {
    selectedData.value = [];
    initializeNewReviewSession();
    reviewState.value = "setup";
  }

  function redoFailedFlashcards() {
    selectedData.value = failed.value;
    startReview();
  }

  let finishSafeGuard = false;
  function getNextFlashcard(result) {
    if (finishSafeGuard) return;

    if (result == "pass") {
      passed.value.push(flashcards.value[currentIndex.value]);
    } else if (result == "fail") {
      failed.value.push(flashcards.value[currentIndex.value]);
    }

    handleUiFeedback(result);

    if (currentIndex.value + 1 >= flashcards.value.length) {
      finishSafeGuard = true;
      setTimeout(finishReview, disableUiFeedback ? 0 : 750);
      finishSafeGuard = false;
      return;
    }

    currentIndex.value++;
  }

  function handleUiFeedback(result) {
    if (disableUiFeedback.value) return;

    uiFeedback.value = result;
    setTimeout(() => {
      uiFeedback.value = "";
    }, 400);
  }

  function shuffleFlashcards() {
    for (let i = flashcards.value.length - 1; i > 0; i--) {
      const randomNum = Math.floor(Math.random() * (i + 1));
      const temprorary = flashcards.value[i];
      flashcards.value[i] = flashcards.value[randomNum];
      flashcards.value[randomNum] = temprorary;
    }
  }

  function resetState() {
    reviewType.value = "recognition";
    reviewMethod.value = "flashcard";
    reviewState.value = "setup";
    selectedData.value = [];
    flashcards.value = [];
    passed.value = [];
    failed.value = [];
    currentIndex.value = 0;
  }

  function setReviewType(type) {
    reviewMethod.value = "flashcard";
    reviewType.value = type;
  }

  function setRecognitionType(type) {
    recognitionType.value = type;
  }

  function setReviewMethod(type) {
    setRecognitionType.value = "kana";
    reviewMethod.value = type;
  }

  function toggleUiFeedbackStatus(status) {
    disableUiFeedback.value = !disableUiFeedback.value;
  }

  function initSettings() {
    const feedbackValue = JSON.parse(localStorage.getItem("feedbackAnimation"));
    if (feedbackValue == null) return;

    disableUiFeedback.value = feedbackValue;
  }

  watch(disableUiFeedback, () => {
    localStorage.setItem("feedbackAnimation", JSON.stringify(disableUiFeedback.value));
  });

  return {
    initializeNewReviewSession,
    redoFailedFlashcards,
    toggleUiFeedbackStatus,
    setRecognitionType,
    disableUiFeedback,
    getNextFlashcard,
    selectedKanaType,
    addSelectedData,
    recognitionType,
    setReviewMethod,
    returnToSetup,
    setReviewType,
    currentIndex,
    reviewMethod,
    selectedData,
    finishReview,
    initSettings,
    startReview,
    reviewState,
    flashcards,
    resetState,
    reviewType,
    uiFeedback,
    passed,
    failed,
    dataset,
  };
});
