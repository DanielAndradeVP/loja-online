<script setup lang="ts">
definePageMeta({
  layout: 'public'
})

const route = useRoute()
const orderId = computed(() => route.params.id as string)

useHead({
  title: 'Pedido confirmado — TudoLeve'
})
</script>

<template>
  <TemplatesObrigado-obrigado-page :order-id="orderId" />
</template>
