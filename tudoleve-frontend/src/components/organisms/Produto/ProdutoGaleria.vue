<script setup lang="ts">
const props = withDefaults(defineProps<{
  images: string[]
  name?: string
}>(), {
  name: 'Produto',
  images: () => []
})

const activeIndex = ref(0)

const activeImage = computed(() => props.images[activeIndex.value] ?? null)

const selectImage = (index: number) => {
  activeIndex.value = index
}

// Reset when images list changes (new product loaded)
watch(() => props.images, () => {
  activeIndex.value = 0
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Main image -->
    <div class="aspect-square w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
      <img
        v-if="activeImage"
        :src="activeImage"
        :alt="name"
        class="h-full w-full object-cover transition-opacity duration-300"
      >
      <div
        v-else
        class="flex flex-col items-center justify-center gap-2 text-slate-400"
      >
        <!-- Placeholder icon -->
        <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-xs">Sem imagem</span>
      </div>
    </div>

    <!-- Thumbnails -->
    <div
      v-if="images.length > 1"
      class="flex gap-2 overflow-x-auto pb-1"
    >
      <button
        v-for="(img, i) in images"
        :key="i"
        class="shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        :class="i === activeIndex ? 'border-slate-900' : 'border-slate-200 hover:border-slate-400'"
        @click="selectImage(i)"
      >
        <img :src="img" :alt="`${name} ${i + 1}`" class="h-full w-full object-cover">
      </button>
    </div>
  </div>
</template>
