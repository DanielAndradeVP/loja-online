export const useFormatters = () => {
  const formatCurrencyBRL = (value: number | string | null | undefined) => {
    if (value === null || value === undefined || value === '') return ''
    const numberValue = typeof value === 'number' ? value : Number(String(value).replace(/\./g, '').replace(',', '.'))

    if (Number.isNaN(numberValue)) return ''

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(numberValue)
  }

  const formatDate = (value: string | Date | null | undefined) => {
    if (!value) return ''
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('pt-BR').format(date)
  }

  const formatDateTime = (value: string | Date | null | undefined) => {
    if (!value) return ''
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date)
  }

  const maskDocument = (value: string | null | undefined) => {
    if (!value) return ''
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 11) {
      return digits
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
    }
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d{1,2})/, '$1.$2.$3/$4-$5')
  }

  const maskPhone = (value: string | null | undefined) => {
    if (!value) return ''
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 10) {
      return digits
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    }
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
  }

  const maskCep = (value: string | null | undefined) => {
    if (!value) return ''
    const digits = value.replace(/\D/g, '').slice(0, 8)
    return digits.replace(/^(\d{5})(\d{1,3})/, '$1-$2')
  }

  return {
    formatCurrencyBRL,
    formatDate,
    formatDateTime,
    maskDocument,
    maskPhone,
    maskCep
  }
}

