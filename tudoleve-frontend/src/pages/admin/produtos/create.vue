<script setup lang="ts">
import ProdutoAdminFormPage from '~/components/templates/Produtos/ProdutoAdminFormPage.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})
</script>

<template>
  <ProdutoAdminFormPage />
</template>
