<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  disabled?: boolean
}>(), {
  modelValue: '',
  placeholder: 'Buscar...',
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
}>()

const onInput = (value: string) => {
  emit('update:modelValue', value)
}

const onSubmit = () => {
  emit('search', props.modelValue || '')
}
</script>

<template>
  <form
    class="flex items-center gap-2"
    @submit.prevent="onSubmit"
  >
    <UiAtomsInput
      :model-value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="flex-1"
      @update:model-value="onInput"
    />
    <UiAtomsButton
      type="submit"
      variant="secondary"
      :disabled="disabled"
    >
      Buscar
    </UiAtomsButton>
  </form>
</template>

