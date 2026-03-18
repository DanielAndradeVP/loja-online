<script setup lang="ts">
import RastreamentoEntregasPage from '~/components/templates/Rastreamento/RastreamentoEntregasPage.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})
</script>

<template>
  <RastreamentoEntregasPage />
</template>

