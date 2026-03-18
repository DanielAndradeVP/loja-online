<script setup lang="ts">
import AdminDashboardPage from '~/components/templates/Dashboard/AdminDashboardPage.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})
</script>

<template>
  <AdminDashboardPage />
</template>

