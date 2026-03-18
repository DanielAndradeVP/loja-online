<script setup lang="ts">
import FinanceiroDashboardPage from '~/components/templates/Financeiro/FinanceiroDashboardPage.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})
</script>

<template>
  <FinanceiroDashboardPage />
</template>

