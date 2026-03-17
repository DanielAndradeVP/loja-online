<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: string
}>(), {
  title: 'Nada por aqui ainda',
  description: '',
  icon: ''
})
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
    <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-slate-400">
      <UiAtomsIcon :name="icon">
        🗂
      </UiAtomsIcon>
    </div>
    <UiAtomsTypography variant="h3">
      {{ title }}
    </UiAtomsTypography>
    <UiAtomsTypography
      v-if="description"
      variant="body"
      muted
      class="mt-1 max-w-md"
    >
      {{ description }}
    </UiAtomsTypography>
    <div
      v-if="$slots.action"
      class="mt-4"
    >
      <slot name="action" />
    </div>
  </div>
</template>

