<script setup lang="ts">
import type { RastreioStatus } from '~/stores/rastreio'

const props = withDefaults(defineProps<{
  status?: RastreioStatus
}>(), {
  status: 'idle'
})

/**
 * Truck translate positions:
 * idle    → translateX(55%)  — half visible on the right edge
 * loading → translateX(28%)  — entering the screen
 * success → translateX(0%)   — fully visible
 * error   → translateX(10%)  — slightly retreated
 */
const truckTranslate = computed(() => {
  switch (props.status) {
    case 'loading': return 'translateX(28%)'
    case 'success': return 'translateX(0%)'
    case 'error':   return 'translateX(10%)'
    default:        return 'translateX(55%)'
  }
})

const wheelAnimating = computed(() => props.status === 'loading')
</script>

<template>
  <div class="relative w-full overflow-hidden select-none" aria-hidden="true">
    <!-- Road surface -->
    <div class="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-200" />
    <!-- Dashed center line -->
    <div class="absolute bottom-[1px] left-0 right-0 flex gap-3 overflow-hidden">
      <div v-for="n in 20" :key="n" class="h-[1px] w-8 shrink-0 bg-slate-300/60" />
    </div>

    <!-- Truck wrapper — transition-transform drives the animation -->
    <div
      class="relative inline-flex flex-col items-start pb-[2px] transition-transform duration-700 ease-in-out"
      :style="{ transform: truckTranslate }"
    >
      <!-- Body row: cab (left/front) + cargo (right/back) -->
      <div class="flex items-end">

        <!-- === CAB (front / left) === -->
        <div class="relative flex flex-col items-stretch w-[72px]">
          <!-- Cab roof with rounded front-left corner -->
          <div class="h-[52px] bg-slate-700 rounded-tl-xl rounded-tr-sm relative overflow-hidden">
            <!-- Windshield -->
            <div class="absolute right-2 top-3 w-[22px] h-[28px] bg-sky-200/80 rounded-sm border border-slate-500/40" />
            <!-- Front glass tint -->
            <div class="absolute left-0 top-0 bottom-0 w-[14px] bg-slate-800 rounded-tl-xl" />
            <!-- Headlight -->
            <div class="absolute left-[3px] bottom-[10px] w-[6px] h-[6px] rounded-full bg-amber-300 shadow shadow-amber-400/60" />
            <!-- Side mirror -->
            <div class="absolute -left-[5px] top-[10px] w-[5px] h-[8px] bg-slate-600 rounded-l-sm" />
          </div>
          <!-- Cab undercarriage / chassis -->
          <div class="h-[10px] bg-slate-600 rounded-bl-sm" />
        </div>

        <!-- === CARGO BOX (back / right) === -->
        <div class="relative w-[180px] h-[72px] bg-slate-600 rounded-tr-md overflow-hidden">
          <!-- Cargo vertical ribs -->
          <div class="absolute inset-0 flex">
            <div v-for="n in 5" :key="n" class="flex-1 border-r border-slate-500/30 last:border-r-0" />
          </div>
          <!-- Cargo top highlight stripe -->
          <div class="absolute top-0 left-0 right-0 h-[4px] bg-slate-500/50" />
          <!-- Brand stripe -->
          <div class="absolute top-[10px] left-[12px] right-[12px] h-[28px] bg-slate-800/30 rounded flex items-center justify-center">
            <span class="text-[9px] font-bold tracking-widest text-slate-200/60 uppercase">TudoLeve</span>
          </div>
          <!-- Rear door outline -->
          <div class="absolute right-0 top-0 bottom-0 w-[8px] bg-slate-800/20 border-l border-slate-500/40" />
          <!-- Cargo undercarriage -->
          <div class="absolute -bottom-[10px] left-[8px] right-[8px] h-[10px] bg-slate-700 rounded-b-sm" />
        </div>
      </div>

      <!-- === WHEELS === -->
      <div class="flex w-full mt-[1px]">
        <!-- Front wheel (under cab, offset left) -->
        <div class="ml-[10px]">
          <div
            class="w-[26px] h-[26px] rounded-full bg-slate-800 border-[4px] border-slate-400 flex items-center justify-center"
            :class="wheelAnimating ? 'animate-spin' : ''"
          >
            <div class="w-[8px] h-[8px] rounded-full bg-slate-500" />
          </div>
        </div>

        <!-- Rear wheels (twin axle under cargo) -->
        <div class="ml-auto flex gap-[3px] mr-[16px]">
          <div
            class="w-[26px] h-[26px] rounded-full bg-slate-800 border-[4px] border-slate-400 flex items-center justify-center"
            :class="wheelAnimating ? 'animate-spin' : ''"
          >
            <div class="w-[8px] h-[8px] rounded-full bg-slate-500" />
          </div>
          <div
            class="w-[26px] h-[26px] rounded-full bg-slate-800 border-[4px] border-slate-400 flex items-center justify-center"
            :class="wheelAnimating ? 'animate-spin' : ''"
          >
            <div class="w-[8px] h-[8px] rounded-full bg-slate-500" />
          </div>
        </div>
      </div>

      <!-- Status label under truck -->
      <div class="mt-2 text-center w-full transition-opacity duration-500" :class="status === 'idle' ? 'opacity-0' : 'opacity-100'">
        <span
          class="text-[10px] font-medium uppercase tracking-wider"
          :class="{
            'text-blue-500 animate-pulse': status === 'loading',
            'text-emerald-600': status === 'success',
            'text-red-500': status === 'error'
          }"
        >
          <template v-if="status === 'loading'">Em trânsito…</template>
          <template v-else-if="status === 'success'">Localizado</template>
          <template v-else-if="status === 'error'">Não encontrado</template>
        </span>
      </div>
    </div>
  </div>
</template>
