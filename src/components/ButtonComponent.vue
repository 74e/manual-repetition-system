<script setup>
defineProps({
  color: {
    type: String,
    default: "green",
    validator: (col) => ["green", "red"].includes(col),
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button :class="color" :disabled="isDisabled">
    <slot />
  </button>
</template>

<style scoped>
button {
  background: none;
  border: 2px solid var(--vue-green);
  color: var(--vue-green);
  border-radius: 11px;
  padding: 18px 24px;
  min-width: 200px;
  font-size: 18px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background: var(--vue-green-45);
  }

  &.red {
    border: 2px solid var(--vue-red);
    color: var(--vue-red);

    &:hover {
      background: var(--vue-red-50);
    }
  }

  &:disabled {
    cursor: auto;
    filter: brightness(0.5);

    &:hover {
      background: none;
    }
  }
}
</style>
