<script setup lang="ts">
import ProdutoAdminFormPage from '~/components/templates/Produtos/ProdutoAdminFormPage.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})

const route = useRoute()
const produtoId = computed(() => Number(route.params.id))
</script>

<template>
  <ProdutoAdminFormPage :produto-id="produtoId" />
</template>
