<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from '#imports'
import { useProdutosCreateStore } from '~/stores/produtosCreate'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const router = useRouter()
const createStore = useProdutosCreateStore()
const { form, submitting, success } = storeToRefs(createStore)

const handleSubmit = async () => {
  await createStore.submit()

  if (success.value) {
    router.push('/admin/produtos')
  }
}

const handleCancel = () => {
  router.push('/admin/produtos')
}
</script>

<template>
  <ProdutoFormPage
    title="Novo produto"
    :form="form"
    :submitting="submitting"
    primary-label="Salvar produto"
    :primary-action="handleSubmit"
    :secondary-action="handleCancel"
  />
</template>

