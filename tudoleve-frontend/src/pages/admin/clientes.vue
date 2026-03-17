<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})
</script>

<template>
  <section class="space-y-2">
    <h2 class="text-xl font-semibold">
      Clientes
    </h2>
    <p class="text-sm text-slate-600 max-w-2xl">
      Estrutura base para gestão de clientes. Futuramente aqui ficarão a listagem, segmentações e detalhes de cada cliente.
    </p>
  </section>
</template>

