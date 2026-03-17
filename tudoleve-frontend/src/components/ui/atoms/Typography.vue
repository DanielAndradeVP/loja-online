<script setup lang="ts">
type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'overline'

const props = withDefaults(defineProps<{
  as?: keyof HTMLElementTagNameMap
  variant?: TypographyVariant
  muted?: boolean
}>(), {
  as: 'p',
  variant: 'body',
  muted: false
})

const variantClasses: Record<TypographyVariant, string> = {
  h1: 'text-3xl font-semibold tracking-tight',
  h2: 'text-2xl font-semibold tracking-tight',
  h3: 'text-xl font-semibold',
  subtitle: 'text-sm font-medium text-slate-700',
  body: 'text-sm text-slate-700',
  caption: 'text-xs text-slate-500',
  overline: 'text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500'
}
</script>

<template>
  <component
    :is="as"
    :class="[
      variantClasses[variant],
      muted && 'text-slate-500'
    ]"
  >
    <slot />
  </component>
</template>

