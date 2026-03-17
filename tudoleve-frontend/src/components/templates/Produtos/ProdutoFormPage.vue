<script setup lang="ts">
import type { UseFormReturn } from './types'
import type { ProdutoFormValues } from './types'

const props = defineProps<{
  title: string
  form: UseFormReturn<ProdutoFormValues>
  submitting: boolean
  primaryLabel: string
  primaryAction: () => Promise<void> | void
  secondaryAction?: () => void
}>()
</script>

<template>
  <section class="space-y-4">
    <UiMoleculesCardSection :title="title">
      <ProdutoForm
        :form="form"
        :submitting="submitting"
      />
    </UiMoleculesCardSection>

    <div class="flex justify-end gap-2">
      <UiAtomsButton
        v-if="secondaryAction"
        variant="secondary"
        @click="secondaryAction?.()"
      >
        Cancelar
      </UiAtomsButton>
      <UiAtomsButton
        :loading="submitting"
        @click="primaryAction"
      >
        {{ primaryLabel }}
      </UiAtomsButton>
    </div>
  </section>
</template>

