import { useFlashcardStore } from "@/stores/flashcard";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import KanjiReviewView from "../views/KanjiReviewView.vue";
import KanaReviewView from "@/views/KanaReviewView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/kanji-review",
      name: "kanjiReview",
      component: KanjiReviewView,
    },
    {
      path: "/Kana-review",
      name: "KanaReview",
      component: KanaReviewView,
    },
  ],
});

router.afterEach(() => {
  const { resetState, reviewState } = useFlashcardStore();
  if (reviewState !== "setup") resetState();
});

export default router;
