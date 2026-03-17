<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
  description?: string
  disabled?: boolean
  error?: string | null
  multiple?: boolean
}>(), {
  label: 'Upload de arquivo',
  description: '',
  disabled: false,
  error: null,
  multiple: false
})

const emit = defineEmits<{
  (e: 'change', files: FileList | null): void
}>()

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('change', target.files)
}
</script>

<template>
  <div class="space-y-1.5 text-sm">
    <div class="flex items-center justify-between">
      <UiAtomsLabel>
        {{ label }}
      </UiAtomsLabel>
      <span
        v-if="description"
        class="text-[0.7rem] text-slate-500"
      >
        {{ description }}
      </span>
    </div>

    <label
      class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-xs text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed"
      :class="[
        disabled && 'opacity-60'
      ]"
    >
      <input
        type="file"
        class="hidden"
        :multiple="multiple"
        :disabled="disabled"
        @change="onChange"
      >
      <span class="text-base">
        ☁️
      </span>
      <span class="font-medium">
        Clique para selecionar arquivos
      </span>
      <span class="text-[0.7rem] text-slate-500">
        ou arraste e solte aqui
      </span>
    </label>

    <p
      v-if="error"
      class="text-[0.7rem] text-red-600"
    >
      {{ error }}
    </p>
  </div>
</template>

