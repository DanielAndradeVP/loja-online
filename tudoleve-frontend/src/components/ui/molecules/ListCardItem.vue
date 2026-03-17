<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  description?: string
  meta?: string
}>(), {
  description: '',
  meta: ''
})
</script>

<template>
  <div class="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm">
    <div class="space-y-0.5">
      <UiAtomsTypography variant="body">
        {{ title }}
      </UiAtomsTypography>
      <UiAtomsTypography
        v-if="description"
        variant="caption"
        muted
      >
        {{ description }}
      </UiAtomsTypography>
    </div>
    <div class="flex items-center gap-2">
      <UiAtomsTypography
        v-if="meta"
        variant="caption"
      >
        {{ meta }}
      </UiAtomsTypography>
      <slot name="actions" />
    </div>
  </div>
</template>

