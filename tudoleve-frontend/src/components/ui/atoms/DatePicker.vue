<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string | null
  placeholder?: string
  disabled?: boolean
  error?: string | null
}>(), {
  placeholder: '',
  disabled: false,
  error: null
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value || null)
}
</script>

<template>
  <div class="relative">
    <input
      type="date"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      class="block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-slate-50"
      :class="[
        error
          ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
          : 'border-slate-300 text-slate-900 focus:border-slate-900 focus:ring-slate-900'
      ]"
      @input="onInput"
    >
  </div>
</template>

