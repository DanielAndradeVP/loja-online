<script setup lang="ts">
import type { ProductBenefit } from '~/types/entities'

withDefaults(defineProps<{
  benefits: ProductBenefit[]
}>(), {
  benefits: () => []
})
</script>

<template>
  <div v-if="benefits.length" class="space-y-3">
    <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wide">
      Benefícios
    </h3>
    <ul class="space-y-3">
      <li
        v-for="(benefit, i) in benefits"
        :key="i"
        class="flex items-start gap-3"
      >
        <!-- Icon circle -->
        <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-base">
          {{ benefit.icon }}
        </div>
        <div>
          <p class="text-sm font-medium text-slate-800">
            {{ benefit.title }}
          </p>
          <p class="text-xs text-slate-500 mt-0.5">
            {{ benefit.description }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
