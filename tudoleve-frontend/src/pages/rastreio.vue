<script setup lang="ts">
import { useRastreioStore } from '~/stores/rastreio'

definePageMeta({
  layout: 'public'
})

useHead({
  title: 'Rastrear pedido — TudoLeve'
})

// Allow pre-filling code from query param (?code=XXXX)
const route = useRoute()
const store = useRastreioStore()

onMounted(() => {
  const code = route.query.code as string | undefined
  if (code) {
    store.consultar(code)
  }
})

onUnmounted(() => {
  store.reset()
})
</script>

<template>
  <TemplatesRastreio-rastreio-page />
</template>
