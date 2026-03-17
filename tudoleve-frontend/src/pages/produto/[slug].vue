<script setup lang="ts">
definePageMeta({
  layout: 'public'
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)

useHead({
  title: 'Produto — TudoLeve'
})
</script>

<template>
  <TemplatesProduto-produto-publico-page :slug="slug" />
</template>
