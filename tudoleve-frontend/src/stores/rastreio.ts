import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TrackingResult } from '~/types/entities'
import { useApi } from '~/composables/useApi'

export type RastreioStatus = 'idle' | 'loading' | 'success' | 'error'

export const useRastreioStore = defineStore('rastreio', () => {
  const result = ref<TrackingResult | null>(null)
  const status = ref<RastreioStatus>('idle')
  const error = ref<string | null>(null)
  const code = ref('')

  const api = useApi()

  const consultar = async (trackingCode: string) => {
    if (!trackingCode.trim()) {
      error.value = 'Informe um código de rastreio válido.'
      return
    }

    status.value = 'loading'
    error.value = null
    result.value = null
    code.value = trackingCode.trim()

    try {
      const { data, message } = await api.get<TrackingResult>('/shipping/track', {
        params: { code: code.value },
        softError: true
      })

      if (!data) {
        status.value = 'error'
        error.value = message ?? 'Não foi possível localizar o código de rastreio.'
        return
      }

      result.value = data
      status.value = 'success'
    } catch (e: any) {
      status.value = 'error'
      error.value = e?.message ?? 'Erro ao consultar rastreio. Tente novamente.'
    }
  }

  const reset = () => {
    result.value = null
    status.value = 'idle'
    error.value = null
    code.value = ''
  }

  return {
    result,
    status,
    error,
    code,
    consultar,
    reset
  }
})
