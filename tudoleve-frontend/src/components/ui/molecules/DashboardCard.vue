<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  value?: string | number
  trendLabel?: string
  trendVariant?: 'neutral' | 'up' | 'down'
}>(), {
  value: '',
  trendLabel: '',
  trendVariant: 'neutral'
})

const trendClasses: Record<'neutral' | 'up' | 'down', string> = {
  neutral: 'text-slate-500',
  up: 'text-emerald-600',
  down: 'text-red-600'
}
</script>

<template>
  <UiAtomsCard padded>
    <div class="space-y-3">
      <UiAtomsTypography
        variant="caption"
        muted
      >
        {{ label }}
      </UiAtomsTypography>
      <div class="flex items-baseline justify-between gap-2">
        <UiAtomsTypography variant="h2">
          {{ value }}
        </UiAtomsTypography>
        <UiAtomsTypography
          v-if="trendLabel"
          variant="caption"
          :class="trendClasses[trendVariant]"
        >
          {{ trendLabel }}
        </UiAtomsTypography>
      </div>
    </div>
  </UiAtomsCard>
</template>

