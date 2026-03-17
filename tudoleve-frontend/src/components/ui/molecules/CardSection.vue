<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  description?: string
  compact?: boolean
}>(), {
  title: '',
  description: '',
  compact: false
})
</script>

<template>
  <UiAtomsCard :padded="!compact">
    <div class="flex items-start justify-between gap-4">
      <div class="space-y-1">
        <UiAtomsTypography
          v-if="title"
          variant="subtitle"
        >
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
      <div v-if="$slots.actions">
        <slot name="actions" />
      </div>
    </div>

    <div class="mt-4">
      <slot />
    </div>
  </UiAtomsCard>
</template>

