<script setup lang="ts">
import type { UseFormReturn } from './types'

interface ProdutoFormValues {
  name: string
  sku?: string | null
  price: number | null
  active: boolean
}

const props = defineProps<{
  form: UseFormReturn<ProdutoFormValues>
  submitting: boolean
}>()
</script>

<template>
  <div class="space-y-4">
    <UiMoleculesFormField
      label="Nome do produto"
      for-id="produto-name"
      :required="true"
      :error="(form.errors.value?.name as string) || null"
    >
      <UiAtomsInput
        id="produto-name"
        :model-value="form.values.name"
        placeholder="Ex: Camiseta básica branca"
        @update:model-value="form.setValues({ name: $event as string })"
        @focus="form.clearErrors('name')"
      />
    </UiMoleculesFormField>

    <UiMoleculesFormField
      label="SKU"
      for-id="produto-sku"
      :error="(form.errors.value?.sku as string) || null"
    >
      <UiAtomsInput
        id="produto-sku"
        :model-value="form.values.sku ?? ''"
        placeholder="Código interno do produto"
        @update:model-value="form.setValues({ sku: $event as string })"
        @focus="form.clearErrors('sku')"
      />
    </UiMoleculesFormField>

    <UiMoleculesFormField
      label="Preço"
      for-id="produto-price"
      :required="true"
      :error="(form.errors.value?.price as string) || null"
    >
      <UiAtomsInput
        id="produto-price"
        type="number"
        min="0"
        step="0.01"
        :model-value="form.values.price ?? ''"
        placeholder="0,00"
        @update:model-value="form.setValues({ price: $event ? Number($event) : null })"
        @focus="form.clearErrors('price')"
      />
    </UiMoleculesFormField>

    <div class="flex items-center gap-2 pt-1">
      <input
        id="produto-active"
        v-model="form.values.active"
        type="checkbox"
        class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
      >
      <UiAtomsLabel for-id="produto-active">
        Produto ativo
      </UiAtomsLabel>
    </div>
  </div>
</template>

