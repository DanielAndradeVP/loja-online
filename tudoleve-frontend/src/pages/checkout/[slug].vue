<script setup lang="ts">
definePageMeta({
  layout: 'public'
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)

useHead({
  title: 'Checkout — TudoLeve'
})
</script>

<template>
  <TemplatesCheckout-checkout-page :slug="slug" />
</template>
