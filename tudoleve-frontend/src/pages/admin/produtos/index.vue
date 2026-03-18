<script setup lang="ts">
import ProdutosListPage from '~/components/templates/Produtos/ProdutosListPage.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})
</script>

<template>
  <ProdutosListPage />
</template>

