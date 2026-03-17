import { defineStore } from 'pinia'

export interface AuthUser {
  id: number
  name: string
  email: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  loginError: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    loginError: null
  }),
  actions: {
    setToken(token: string | null) {
      this.token = token
      const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7, path: '/' })
      tokenCookie.value = token
    },
    setAuthenticated(isAuthenticated: boolean) {
      this.isAuthenticated = isAuthenticated
    },
    setUser(user: AuthUser | null) {
      this.user = user
    },
    setLoading(loading: boolean) {
      this.loading = loading
    },
    setLoginError(message: string | null) {
      this.loginError = message
    },
    reset() {
      this.user = null
      this.setToken(null)
      this.isAuthenticated = false
      this.loading = false
      this.loginError = null
    }
  }
})

