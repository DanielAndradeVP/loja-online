<script setup lang="ts">
/**
 * Checkout page — frontend only collects data and submits to the backend.
 * All payment processing, order creation and fraud check happens server-side.
 */
import type { CheckoutPayload, CheckoutResult } from '~/types/entities'
import { useFormatters } from '~/composables/useFormatters'
import { useApi } from '~/composables/useApi'

const props = defineProps<{
  slug: string
}>()

const api = useApi()
const { formatCurrencyBRL } = useFormatters()
const router = useRouter()

// — Product summary loaded from backend (public endpoint) —
const productName = ref('')
const productPrice = ref(0)
const productImage = ref<string | null>(null)
const productLoading = ref(true)
const productError = ref<string | null>(null)

// — Form state —
const form = reactive<CheckoutPayload>({
  product_slug: props.slug,
  quantity: 1,
  customer_name: '',
  customer_email: '',
  customer_document: '',
  customer_phone: '',
  address_cep: '',
  address_street: '',
  address_number: '',
  address_complement: '',
  address_neighborhood: '',
  address_city: '',
  address_state: '',
  coupon_code: ''
})

const fieldErrors = ref<Record<string, string>>({})
const submitting = ref(false)
const submitError = ref<string | null>(null)

// — Load product summary —
onMounted(async () => {
  const { data, message } = await api.get<{
    name: string; price: number; image?: string | null
  }>(`/public/products/${props.slug}/summary`, { softError: true })

  productLoading.value = false

  if (!data) {
    productError.value = message ?? 'Produto não encontrado.'
    return
  }

  productName.value = data.name
  productPrice.value = data.price
  productImage.value = data.image ?? null
})

// — Submit checkout to backend —
const handleSubmit = async () => {
  fieldErrors.value = {}
  submitError.value = null
  submitting.value = true

  try {
    const { data, success, message, fieldErrors: fe } = await api.post<CheckoutResult>(
      '/public/checkout',
      form,
      { softError: true }
    )

    if (!success || !data) {
      if (fe) {
        Object.entries(fe).forEach(([field, msgs]) => {
          fieldErrors.value[field] = Array.isArray(msgs) ? msgs[0] : String(msgs)
        })
      }
      submitError.value = message ?? 'Erro ao processar o pedido. Verifique os dados e tente novamente.'
      return
    }

    // If backend returns a payment URL (e.g. Pix / card gateway), redirect there
    if (data.payment_url) {
      window.location.href = data.payment_url
      return
    }

    // Otherwise go to post-sale page
    router.push(`/obrigado/${data.order_id}`)
  } finally {
    submitting.value = false
  }
}

const totalPrice = computed(() => productPrice.value * form.quantity)
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8">
    <h1 class="text-xl font-semibold text-slate-900 mb-6">
      Finalizar pedido
    </h1>

    <!-- Product loading / error -->
    <div v-if="productLoading" class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 mb-6 animate-pulse">
      <div class="h-16 w-16 rounded-lg bg-slate-200 shrink-0" />
      <div class="space-y-2 flex-1">
        <div class="h-4 w-1/2 rounded bg-slate-200" />
        <div class="h-3 w-1/4 rounded bg-slate-200" />
      </div>
    </div>

    <div v-else-if="productError" class="rounded-xl border border-red-200 bg-red-50 p-4 mb-6 text-sm text-red-700">
      {{ productError }}
    </div>

    <!-- Product summary bar -->
    <div
      v-else
      class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 mb-6 shadow-sm"
    >
      <div class="h-16 w-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
        <img v-if="productImage" :src="productImage" :alt="productName" class="h-full w-full object-cover">
        <span v-else class="text-2xl">📦</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-slate-900 truncate">
          {{ productName }}
        </p>
        <p class="text-xs text-slate-500 mt-0.5">
          Qtd: {{ form.quantity }} ×  {{ formatCurrencyBRL(productPrice) }}
        </p>
      </div>
      <div class="text-right shrink-0">
        <p class="text-lg font-bold text-slate-900">
          {{ formatCurrencyBRL(totalPrice) }}
        </p>
      </div>
    </div>

    <form class="grid gap-6 lg:grid-cols-3" @submit.prevent="handleSubmit">
      <!-- Left: form fields (2 columns) -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Customer data -->
        <fieldset class="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <legend class="px-1 text-sm font-semibold text-slate-700">
            Seus dados
          </legend>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Nome completo *</label>
              <input v-model="form.customer_name" type="text" required class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
              <p v-if="fieldErrors.customer_name" class="mt-1 text-xs text-red-600">{{ fieldErrors.customer_name }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">E-mail *</label>
              <input v-model="form.customer_email" type="email" required class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
              <p v-if="fieldErrors.customer_email" class="mt-1 text-xs text-red-600">{{ fieldErrors.customer_email }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">CPF / CNPJ *</label>
              <input v-model="form.customer_document" type="text" required class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
              <p v-if="fieldErrors.customer_document" class="mt-1 text-xs text-red-600">{{ fieldErrors.customer_document }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Telefone *</label>
              <input v-model="form.customer_phone" type="tel" required class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
              <p v-if="fieldErrors.customer_phone" class="mt-1 text-xs text-red-600">{{ fieldErrors.customer_phone }}</p>
            </div>
          </div>
        </fieldset>

        <!-- Address -->
        <fieldset class="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <legend class="px-1 text-sm font-semibold text-slate-700">
            Endereço de entrega
          </legend>
          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">CEP *</label>
              <input v-model="form.address_cep" type="text" required placeholder="00000-000" class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
              <p v-if="fieldErrors.address_cep" class="mt-1 text-xs text-red-600">{{ fieldErrors.address_cep }}</p>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-slate-600 mb-1">Rua / Logradouro *</label>
              <input v-model="form.address_street" type="text" required class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
              <p v-if="fieldErrors.address_street" class="mt-1 text-xs text-red-600">{{ fieldErrors.address_street }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Número *</label>
              <input v-model="form.address_number" type="text" required class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Complemento</label>
              <input v-model="form.address_complement" type="text" class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Bairro *</label>
              <input v-model="form.address_neighborhood" type="text" required class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-slate-600 mb-1">Cidade *</label>
              <input v-model="form.address_city" type="text" required class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Estado *</label>
              <input v-model="form.address_state" type="text" maxlength="2" required placeholder="SP" class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
            </div>
          </div>
        </fieldset>

        <!-- Coupon -->
        <div class="flex gap-2 items-end">
          <div class="flex-1">
            <label class="block text-xs font-medium text-slate-600 mb-1">Cupom de desconto</label>
            <input v-model="form.coupon_code" type="text" placeholder="Código do cupom" class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
          </div>
          <UiAtomsButton variant="secondary" size="md" type="button">
            Aplicar
          </UiAtomsButton>
        </div>
      </div>

      <!-- Right: order summary + submit -->
      <div class="lg:col-span-1 space-y-4">
        <div class="sticky top-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
          <h2 class="text-sm font-semibold text-slate-700">
            Resumo do pedido
          </h2>
          <div class="space-y-2 text-sm border-b border-slate-100 pb-3">
            <div class="flex justify-between">
              <span class="text-slate-600">Subtotal</span>
              <span class="font-medium">{{ formatCurrencyBRL(totalPrice) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600">Frete</span>
              <span class="text-slate-500 text-xs">Calculado no próximo passo</span>
            </div>
          </div>
          <div class="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{{ formatCurrencyBRL(totalPrice) }}</span>
          </div>

          <p
            v-if="submitError"
            class="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700"
          >
            {{ submitError }}
          </p>

          <UiAtomsButton
            variant="primary"
            size="lg"
            full-width
            type="submit"
            :loading="submitting"
            :disabled="productLoading || !!productError"
          >
            🔒 Continuar para pagamento
          </UiAtomsButton>

          <p class="text-center text-[10px] text-slate-400">
            Seus dados são criptografados e protegidos.
          </p>
        </div>
      </div>
    </form>
  </div>
</template>
