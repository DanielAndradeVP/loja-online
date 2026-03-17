<script setup lang="ts">
withDefaults(defineProps<{
  inStock?: boolean
  stockQuantity?: number | null
}>(), {
  inStock: true,
  stockQuantity: null
})

// Gatilhos visuais (visual trust/urgency triggers)
const triggers = [
  { icon: '🔒', label: 'Compra 100% segura' },
  { icon: '🚚', label: 'Entrega rápida' },
  { icon: '✅', label: 'Produto garantido' },
  { icon: '↩️', label: 'Troca fácil' }
]
</script>

<template>
  <div class="space-y-3">
    <!-- Stock urgency indicator -->
    <div
      v-if="inStock && stockQuantity !== null && stockQuantity <= 10"
      class="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2"
    >
      <span class="text-amber-500 text-sm">⚠️</span>
      <p class="text-xs font-medium text-amber-700">
        Restam apenas <strong>{{ stockQuantity }}</strong> unidade{{ stockQuantity !== 1 ? 's' : '' }} em estoque!
      </p>
    </div>

    <div
      v-else-if="!inStock"
      class="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2"
    >
      <span class="text-red-500 text-sm">❌</span>
      <p class="text-xs font-medium text-red-700">
        Produto esgotado no momento.
      </p>
    </div>

    <!-- Trust triggers row -->
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <div
        v-for="trigger in triggers"
        :key="trigger.label"
        class="flex flex-col items-center gap-1 rounded-lg bg-slate-50 border border-slate-100 px-2 py-3 text-center"
      >
        <span class="text-xl">{{ trigger.icon }}</span>
        <span class="text-[10px] font-medium text-slate-600 leading-tight">{{ trigger.label }}</span>
      </div>
    </div>
  </div>
</template>
