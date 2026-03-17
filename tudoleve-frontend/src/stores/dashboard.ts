import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DashboardSummary, DashboardPeriod } from '~/types/dashboard'
import { useApi } from '~/composables/useApi'

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref<DashboardSummary | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const period = ref<DashboardPeriod>('7d')

  const api = useApi()

  const fetch = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, message } = await api.get<DashboardSummary>('/admin/dashboard', {
        params: { period: period.value },
        softError: true
      })

      if (!data && message) {
        error.value = message
        return
      }

      summary.value = data
    } catch (e: any) {
      error.value = e?.message || 'Não foi possível carregar o dashboard.'
    } finally {
      loading.value = false
    }
  }

  const setPeriod = (value: DashboardPeriod) => {
    period.value = value
  }

  return {
    summary,
    loading,
    error,
    period,
    fetch,
    setPeriod
  }
})

