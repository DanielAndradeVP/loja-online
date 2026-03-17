<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})
</script>

<template>
  <section class="space-y-2">
    <h2 class="text-xl font-semibold">
      Rastreamento / Entregas
    </h2>
    <p class="text-sm text-slate-600 max-w-2xl">
      Estrutura base para acompanhamento de entregas e status de envio dos pedidos.
    </p>
  </section>
</template>

