<script setup></script>

<template>
  <main>
    <section>
      <h1>Manual Repetition System</h1>

      <div class="review-items">
        <RouterLink class="review-box" to="/kana-review#hiragana"><span>ひらがな</span></RouterLink>
        <RouterLink class="review-box" to="/kana-review#katakana"><span>カタカナ</span></RouterLink>
        <RouterLink class="review-box" to="/kanji-review"><span class="kanji">漢字</span></RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

section {
  transform: translateY(-50px);
}

.review-items {
  margin-top: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;

  @media (max-width: 880px) {
    flex-direction: column;
    gap: 32px;
  }

  .review-box {
    height: 250px;
    width: 250px;
    align-content: center;
    text-align: center;
    border: 2px solid var(--vue-green);
    border-radius: 11px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;

    &:hover {
      background-color: var(--vue-green-45);
    }

    span {
      font-family: Meiryo;
      font-size: 32px;
      color: var(--vue-green);
    }

    span.kanji {
      font-family: HGRKK;
      font-size: 48px;
    }

    @media (max-width: 880px) {
      height: 124px;
      width: 250px;
    }
  }
}

h1 {
  color: var(--vue-green);
  font-size: 48px;
  font-weight: bold;
  text-align: center;

  @media (max-width: 670px) {
    font-size: 32px;
  }
}
</style>
