const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// CPF/CNPJ bem simplificado para frontend (apenas formato básico)
const documentDigitsRegex = /^\d{11}$|^\d{14}$/

const phoneDigitsRegex = /^\d{10,11}$/

const cepRegex = /^\d{8}$/

export const useValidation = () => {
  const isEmail = (value: string | null | undefined) => {
    if (!value) return false
    return emailRegex.test(String(value).toLowerCase())
  }

  const isDocument = (value: string | null | undefined) => {
    if (!value) return false
    const digits = value.replace(/\D/g, '')
    return documentDigitsRegex.test(digits)
  }

  const isPhone = (value: string | null | undefined) => {
    if (!value) return false
    const digits = value.replace(/\D/g, '')
    return phoneDigitsRegex.test(digits)
  }

  const isCep = (value: string | null | undefined) => {
    if (!value) return false
    const digits = value.replace(/\D/g, '')
    return cepRegex.test(digits)
  }

  const isCurrency = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return false
    const normalized = typeof value === 'number' ? value.toString() : value
    return /^-?\d+([.,]\d{1,2})?$/.test(normalized.replace(/\s/g, ''))
  }

  return {
    isEmail,
    isDocument,
    isPhone,
    isCep,
    isCurrency
  }
}

