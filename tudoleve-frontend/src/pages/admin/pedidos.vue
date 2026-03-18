<script setup lang="ts">
import PedidosListPage from '~/components/templates/Pedidos/PedidosListPage.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})
</script>

<template>
  <PedidosListPage />
</template>

