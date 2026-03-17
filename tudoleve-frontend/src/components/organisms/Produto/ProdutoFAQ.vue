<script setup lang="ts">
import type { ProductFAQItem } from '~/types/entities'

withDefaults(defineProps<{
  items: ProductFAQItem[]
}>(), {
  items: () => []
})

const openIndex = ref<number | null>(null)

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <div v-if="items.length" class="space-y-2">
    <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
      Perguntas frequentes
    </h3>

    <div
      v-for="(item, i) in items"
      :key="i"
      class="rounded-lg border border-slate-200 overflow-hidden"
    >
      <button
        class="w-full flex items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-900"
        @click="toggle(i)"
      >
        <span>{{ item.question }}</span>
        <svg
          class="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200"
          :class="openIndex === i ? 'rotate-180' : ''"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        v-show="openIndex === i"
        class="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100"
      >
        <p class="pt-3">
          {{ item.answer }}
        </p>
      </div>
    </div>
  </div>
</template>
