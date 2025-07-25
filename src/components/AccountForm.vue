<template>
  <div class="bg-white rounded-lg shadow border">
    <div class="flex items-center justify-between p-4 border-b">
      <h2 class="text-lg font-semibold text-gray-900">Учетные записи</h2>
      <Button @click="addEmptyAccount" variant="primary" size="sm" class="w-8 h-8 rounded-full p-0 flex items-center justify-center">
        +
      </Button>
    </div>
    
    <div class="px-4 py-3 bg-blue-50 border-b">
      <div class="flex items-start">
        <div class="flex-shrink-0 mt-0.5">
          <svg class="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="ml-2">
          <p class="text-sm text-blue-700">
            Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/stores/accountStore'
import Button from '@/components/ui/button/Button.vue'

const accountStore = useAccountStore()

const addEmptyAccount = () => {
  accountStore.addEmptyAccount()
}
</script> 