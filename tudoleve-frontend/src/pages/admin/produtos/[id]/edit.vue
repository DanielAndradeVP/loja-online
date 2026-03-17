<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from '#imports'
import { useProdutosEditStore } from '~/stores/produtosEdit'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const route = useRoute()
const router = useRouter()
const editStore = useProdutosEditStore()
const { form, submitting, loading, success } = storeToRefs(editStore)

onMounted(() => {
  if (route.params.id) {
    editStore.load(route.params.id as string)
  }
})

const handleSubmit = async () => {
  if (!route.params.id) return
  await editStore.submit(route.params.id as string)

  if (success.value) {
    router.push('/admin/produtos')
  }
}

const handleCancel = () => {
  router.push('/admin/produtos')
}
</script>

<template>
  <section class="space-y-4">
    <UiMoleculesCardSection
      title="Editar produto"
      description="Atualize as informações do produto."
    />

    <div v-if="loading">
      <UiAtomsCard>
        <p class="py-4 text-sm text-slate-500">
          Carregando dados do produto...
        </p>
      </UiAtomsCard>
    </div>
    <div v-else>
      <ProdutoFormPage
        title=""
        :form="form"
        :submitting="submitting"
        primary-label="Salvar alterações"
        :primary-action="handleSubmit"
        :secondary-action="handleCancel"
      />
    </div>
  </section>
</template>

