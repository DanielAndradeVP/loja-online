<script setup lang="ts">
const props = withDefaults(defineProps<{
  name?: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  name: '',
  size: 'md'
})

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5'
}
</script>

<template>
  <!--
    Icon genérico: por enquanto só um wrapper estilizado.
    Em etapas futuras, pode ser integrado a uma lib de ícones.
  -->
  <span
    aria-hidden="true"
    :data-icon-name="name || undefined"
    :class="[
      'inline-flex items-center justify-center text-slate-500',
      sizeClasses[size]
    ]"
  >
    <slot />
  </span>
</template>

