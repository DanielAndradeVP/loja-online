<script setup lang="ts">
const props = withDefaults(defineProps<{
  forId?: string
  required?: boolean
}>(), {
  forId: undefined,
  required: false
})
</script>

<template>
  <label
    :for="forId"
    class="inline-flex items-center gap-1 text-xs font-medium text-slate-700"
  >
    <span>
      <slot />
    </span>
    <span
      v-if="required"
      class="text-red-500"
    >
      *
    </span>
  </label>
</template>

