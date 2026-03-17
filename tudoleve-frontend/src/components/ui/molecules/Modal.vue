<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
  persistent?: boolean
}>(), {
  title: '',
  size: 'md',
  persistent: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const close = () => {
  if (props.persistent) {
    return
  }
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
        @click.self="close"
      >
        <transition name="scale-fade">
          <div
            class="w-full rounded-lg bg-white shadow-xl border border-slate-200"
            :class="{
              'max-w-sm': size === 'sm',
              'max-w-lg': size === 'md',
              'max-w-2xl': size === 'lg'
            }"
          >
            <div class="flex items-center justify-between border-b px-4 py-3">
              <UiAtomsTypography
                v-if="title"
                as="h3"
                variant="h3"
              >
                {{ title }}
              </UiAtomsTypography>
              <button
                type="button"
                class="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                @click="close"
              >
                ✕
              </button>
            </div>
            <div class="px-4 py-4">
              <slot />
            </div>
            <div
              v-if="$slots.footer"
              class="flex justify-end gap-2 border-t bg-slate-50 px-4 py-3"
            >
              <slot name="footer" />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

