<script setup lang="ts">
const props = withDefaults(defineProps<{
  hover?: boolean
  padded?: boolean
}>(), {
  hover: false,
  padded: true
})
</script>

<template>
  <div
    :class="[
      'rounded-lg border border-slate-200 bg-white shadow-sm',
      hover && 'hover:shadow-md transition-shadow',
      padded && 'p-4'
    ]"
  >
    <slot />
  </div>
</template>

