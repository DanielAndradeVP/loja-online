<script setup lang="ts">
import ClientesListPage from '~/components/templates/Clientes/ClientesListPage.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})
</script>

<template>
  <ClientesListPage />
</template>

