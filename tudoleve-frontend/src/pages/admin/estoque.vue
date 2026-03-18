<script setup lang="ts">
import EstoquePage from '~/components/templates/Estoque/EstoquePage.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})
</script>

<template>
  <EstoquePage />
</template>

