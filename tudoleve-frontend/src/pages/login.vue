<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'public',
  middleware: ['guest']
})

const identifier = ref('')
const password = ref('')

const { authStore, login } = useAuth()

const handleSubmit = async () => {
  if (!identifier.value || !password.value || authStore.loading) {
    return
  }

  await login({
    identifier: identifier.value,
    password: password.value
  })
}
</script>

<template>
  <section class="mx-auto flex min-h-[calc(100vh-120px)] max-w-md items-center px-4 py-8">
    <div class="w-full rounded-lg bg-white p-6 shadow-sm border border-slate-200">
      <h1 class="text-2xl font-semibold mb-1">
        Login administrativo
      </h1>
      <p class="text-sm text-slate-600 mb-6">
        Acesse a área administrativa da TudoLeve.
      </p>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-1">
          <label for="identifier" class="block text-sm font-medium text-slate-700">
            E-mail ou identificador
          </label>
          <input
            id="identifier"
            v-model="identifier"
            type="text"
            autocomplete="username"
            class="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            placeholder="seu@email.com"
          >
        </div>

        <div class="space-y-1">
          <label for="password" class="block text-sm font-medium text-slate-700">
            Senha
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            placeholder="Digite sua senha"
          >
        </div>

        <div v-if="authStore.loginError" class="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 border border-red-200">
          {{ authStore.loginError }}
        </div>

        <button
          type="submit"
          class="mt-2 inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          :disabled="authStore.loading"
        >
          <span v-if="authStore.loading">
            Entrando...
          </span>
          <span v-else>
            Entrar
          </span>
        </button>
      </form>
    </div>
  </section>
</template>

