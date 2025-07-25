<template>
  <div class="relative">
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      :class="selectClasses"
      :disabled="disabled"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <slot />
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
}

defineEmits<{
  'update:modelValue': [value: string]
}>()

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Выберите вариант...',
  disabled: false,
  error: false
})

const selectClasses = computed(() => {
  const base = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  const errorClass = props.error ? 'border-red-500 focus-visible:ring-red-500' : ''
  
  return `${base} ${errorClass}`
})
</script> 