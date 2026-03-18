<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})
</script>

<template>
  <section class="space-y-4">
    <UiMoleculesCardSection
      title="Logs e sistema"
      description="Área reservada para monitoramento e configurações avançadas do sistema."
    >
      <p class="text-sm text-slate-600">
        Esta seção ainda está em desenvolvimento. Em breve você poderá consultar logs e informações
        avançadas do sistema por aqui.
      </p>
    </UiMoleculesCardSection>
  </section>
</template>

