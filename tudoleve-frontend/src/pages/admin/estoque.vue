<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})
</script>

<template>
  <section class="space-y-2">
    <h2 class="text-xl font-semibold">
      Estoque
    </h2>
    <p class="text-sm text-slate-600 max-w-2xl">
      Estrutura base para visão de estoque. Em breve serão adicionadas movimentações, alertas e relatórios de disponibilidade.
    </p>
  </section>
</template>

