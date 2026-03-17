<script setup lang="ts">
type InputType = 'text' | 'email' | 'password' | 'number' | 'date'

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  type?: InputType
  placeholder?: string
  disabled?: boolean
  error?: string | null
  loading?: boolean
}>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  error: null,
  loading: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="relative">
    <input
      :type="type"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled || loading"
      class="block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-slate-50"
      :class="[
        error
          ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
          : 'border-slate-300 text-slate-900 focus:border-slate-900 focus:ring-slate-900',
        loading && 'pr-8'
      ]"
      @input="onInput"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    >
    <div
      v-if="loading"
      class="pointer-events-none absolute inset-y-0 right-2 flex items-center"
    >
      <span class="inline-flex h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400/60 border-t-transparent" />
    </div>
  </div>
</template>

