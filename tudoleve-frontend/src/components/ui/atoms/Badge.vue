<script setup lang="ts">
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'outline'

const props = withDefaults(defineProps<{
  variant?: BadgeVariant
}>(), {
  variant: 'default'
})

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-800',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  outline: 'border border-slate-200 text-slate-700'
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-medium',
      variantClasses[variant]
    ]"
  >
    <slot />
  </span>
</template>

