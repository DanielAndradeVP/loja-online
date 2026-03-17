import { useRouter, useAuthStore } from '#imports'
import { useHttpClient } from '~/utils/httpClient'

const USE_FAKE_AUTH = false

interface LoginCredentials {
  identifier: string
  password: string
}

interface LoginResponseUser {
  id: number
  name: string
  email: string
}

interface LoginResponse {
  token: string
  user: LoginResponseUser
}

export const useAuth = () => {
  const authStore = useAuthStore()
  const http = useHttpClient()
  const router = useRouter()

  const getToken = () => {
    if (authStore.token) {
      return authStore.token
    }

    return useCookie('auth_token').value ?? null
  }

  const saveToken = (token: string) => {
    authStore.setToken(token)
    authStore.setAuthenticated(true)
  }

  const removeToken = () => {
    authStore.setToken(null)
    authStore.setAuthenticated(false)
  }

  const loadUserProfile = async () => {
    if (USE_FAKE_AUTH) {
      return
    }

    const token = getToken()

    if (!token) {
      return
    }

    try {
      authStore.setLoading(true)
      authStore.setLoginError(null)

      const user = await http.get<LoginResponseUser>('/auth/me')

      authStore.setUser(user)
      authStore.setAuthenticated(true)
    } catch {
      authStore.reset()
    } finally {
      authStore.setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    authStore.setLoading(true)
    authStore.setLoginError(null)

    if (USE_FAKE_AUTH) {
      const fakeUser: LoginResponseUser = {
        id: 1,
        name: 'Admin TudoLeve (fake)',
        email: credentials.identifier || 'admin@tudoleve.fake'
      }

      saveToken('dev_fake_token')
      authStore.setUser(fakeUser)
      authStore.setAuthenticated(true)

      authStore.setLoading(false)
      await router.push('/admin')
      return
    }

    try {
      const response = await http.post<LoginResponse>('/auth/login', credentials)

      saveToken(response.token)
      authStore.setUser(response.user)
      authStore.setAuthenticated(true)

      await router.push('/admin')
    } catch (error: any) {
      const message =
        error?.message ||
        error?.errors?.email?.[0] ||
        error?.errors?.identifier?.[0] ||
        'Não foi possível entrar. Verifique suas credenciais.'

      authStore.setLoginError(message)
      authStore.setAuthenticated(false)
    } finally {
      authStore.setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await http.post('/auth/logout')
    } catch {
      // Ignora erros de logout remoto
    } finally {
      removeToken()
      authStore.setUser(null)
      authStore.setAuthenticated(false)
      authStore.setLoginError(null)

      if (process.client) {
        await router.push('/login')
      }
    }
  }

  const autoLogoutOn401 = async () => {
    await logout()
  }

  return {
    authStore,
    getToken,
    saveToken,
    removeToken,
    loadUserProfile,
    login,
    logout,
    autoLogoutOn401
  }
}

