<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :required="required"
      :class="inputClasses"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  maxLength?: number
  required?: boolean
  error?: string
  hint?: string
  id?: string
}

defineEmits<{
  'update:modelValue': [value: string]
}>()

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  id: `input-${Math.random().toString(36).substr(2, 9)}`
})

const inputClasses = computed(() => {
  const base = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  const errorClass = props.error ? 'border-red-500 focus-visible:ring-red-500' : ''
  
  return `${base} ${errorClass}`
})
</script>
