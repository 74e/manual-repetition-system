<script setup>
import ButtonComponent from "./ButtonComponent.vue";
</script>

<template>
  <RouterLink class="return-button-link" to="/">
    <ButtonComponent class="return-button" @click="">⇐ Return</ButtonComponent>
  </RouterLink>
</template>

<style scoped>
.return-button-link {
  position: fixed;
  top: 16px;
  left: -2px;
  z-index: 100;

  .return-button {
    font-size: 18px;
    border-radius: 0 9px 9px 0;
    padding: 8px 24px 8px 8px;
    min-width: unset;
    border-left: 0px;
    border-color: var(--vue-green-45);
  }
}

@media (max-width: 1300px) {
  .return-button-link {
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }
}

@media (min-width: 1960px) {
  .return-button-link {
    top: 16px;
    left: calc(50% - 960px);

    .return-button {
      border: 1px solid var(--vue-green-45);
      border-radius: 9px;
      padding: 8px 24px 8px 24px;
    }
  }
}
</style>
