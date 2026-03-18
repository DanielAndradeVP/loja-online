<script setup lang="ts">
import MarketingPage from '~/components/templates/Marketing/MarketingPage.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})
</script>

<template>
  <MarketingPage />
</template>

