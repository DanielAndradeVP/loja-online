<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
  forId?: string
  description?: string
  error?: string | null
  required?: boolean
}>(), {
  label: '',
  forId: undefined,
  description: '',
  error: null,
  required: false
})
</script>

<template>
  <div class="space-y-1.5 text-sm">
    <div v-if="label" class="flex items-center justify-between">
      <UiAtomsLabel
        :for-id="forId"
        :required="required"
      >
        {{ label }}
      </UiAtomsLabel>
      <span
        v-if="description"
        class="text-[0.7rem] text-slate-500"
      >
        {{ description }}
      </span>
    </div>

    <div>
      <slot />
    </div>

    <p
      v-if="error"
      class="text-[0.7rem] text-red-600"
    >
      {{ error }}
    </p>
  </div>
</template>

