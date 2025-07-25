<template>
  <div class="bg-white rounded-lg shadow border mt-4">
    <div v-if="accountStore.accounts.length === 0" class="p-8 text-center text-gray-500">
      Нет добавленных учетных записей
    </div>

    <div v-else>
      <!-- Заголовки таблицы -->
      <div class="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-sm font-medium text-gray-700">
        <div class="col-span-3">Метка</div>
        <div class="col-span-2">Тип записи</div>
        <div class="col-span-3">Логин</div>
        <div class="col-span-3">Пароль</div>
        <div class="col-span-1"></div>
      </div>

      <!-- Строки данных -->
      <div class="divide-y">
        <div
          v-for="account in accountStore.accounts"
          :key="account.id"
          class="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors items-start"
        >
          <!-- Метка -->
          <div class="col-span-3">
            <div class="min-h-[60px]">
              <input
                :value="accountStore.labelsToString(account.label)"
                @blur="handleLabelBlur(account.id, $event)"
                @input="clearError(account.id, 'label')"
                type="text"
                placeholder="XXX"
                maxlength="50"
                :class="[
                  'w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
                  errors[account.id]?.label ? 'border-red-500' : 'border-gray-300'
                ]"
              >
              <!-- Отображение меток как тегов под полем ввода -->
              <div v-if="account.label && account.label.length > 0" class="mt-1 flex flex-wrap gap-1">
                <span
                  v-for="(label, index) in account.label"
                  :key="index"
                  class="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded"
                >
                  {{ label.text }}
                </span>
              </div>
              <!-- Зарезервированное место для ошибки -->
              <div class="h-4 mt-1">
                <p v-if="errors[account.id]?.label" class="text-xs text-red-600">
                  {{ errors[account.id].label }}
                </p>
              </div>
            </div>
          </div>

          <!-- Тип записи -->
          <div class="col-span-2">
            <div class="min-h-[60px]">
              <select
                :value="account.type"
                @change="handleTypeChange(account.id, $event)"
                :class="[
                  'w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
                  errors[account.id]?.type ? 'border-red-500' : 'border-gray-300'
                ]"
              >
                <option value="">Значение</option>
                <option value="LDAP">LDAP</option>
                <option value="Локальная">Локальная</option>
              </select>
              <!-- Зарезервированное место для ошибки -->
              <div class="h-4 mt-1">
                <p v-if="errors[account.id]?.type" class="text-xs text-red-600">
                  {{ errors[account.id].type }}
                </p>
              </div>
            </div>
          </div>

          <!-- Логин -->
          <div class="col-span-3">
            <div class="min-h-[60px]">
              <input
                :value="account.login"
                @blur="handleLoginBlur(account.id, $event)"
                @input="clearError(account.id, 'login')"
                type="text"
                placeholder="Значение"
                maxlength="100"
                :class="[
                  'w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
                  errors[account.id]?.login ? 'border-red-500' : 'border-gray-300'
                ]"
              >
              <!-- Зарезервированное место для ошибки -->
              <div class="h-4 mt-1">
                <p v-if="errors[account.id]?.login" class="text-xs text-red-600">
                  {{ errors[account.id].login }}
                </p>
              </div>
            </div>
          </div>

          <!-- Пароль -->
          <div class="col-span-3">
            <div class="min-h-[60px]">
              <div v-if="account.type === 'LDAP'" class="text-sm text-gray-400 italic py-1">
                —
              </div>
              <div v-else class="relative">
                <input
                  :value="account.password || ''"
                  @blur="handlePasswordBlur(account.id, $event)"
                  @input="clearError(account.id, 'password')"
                  :type="showPasswords[account.id] ? 'text' : 'password'"
                  placeholder="••••••"
                  maxlength="100"
                  :class="[
                    'w-full px-2 py-1 pr-8 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
                    errors[account.id]?.password ? 'border-red-500' : 'border-gray-300'
                  ]"
                >
                <button
                  @click="togglePassword(account.id)"
                  type="button"
                  class="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <svg v-if="showPasswords[account.id]" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                  <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <!-- Зарезервированное место для ошибки -->
              <div class="h-4 mt-1">
                <p v-if="errors[account.id]?.password" class="text-xs text-red-600">
                  {{ errors[account.id].password }}
                </p>
              </div>
            </div>
          </div>

          <!-- Кнопка удаления -->
          <div class="col-span-1 flex justify-center items-start pt-1">
            <button
              @click="deleteAccount(account.id)"
              class="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Удалить"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAccountStore } from '@/stores/accountStore'
import { AccountType } from '@/types/account'

const accountStore = useAccountStore()
const showPasswords = ref<Record<string, boolean>>({})
const errors = reactive<Record<string, Record<string, string>>>({})

const clearError = (accountId: string, field: string) => {
  if (errors[accountId]) {
    delete errors[accountId][field]
    if (Object.keys(errors[accountId]).length === 0) {
      delete errors[accountId]
    }
  }
}

const validateAndSave = (accountId: string) => {
  const account = accountStore.accounts.find(acc => acc.id === accountId)
  if (!account) return

  const validation = accountStore.validateAccount(account)
  
  if (validation.isValid) {
    // Очистить ошибки для этой записи
    delete errors[accountId]
  } else {
    // Установить ошибки
    errors[accountId] = validation.errors
  }
}

const handleLabelBlur = (accountId: string, event: Event) => {
  const value = (event.target as HTMLInputElement).value
  const labels = accountStore.parseLabels(value)
  
  accountStore.updateAccount(accountId, { label: labels })
  validateAndSave(accountId)
}

const handleTypeChange = (accountId: string, event: Event) => {
  const value = (event.target as HTMLSelectElement).value as AccountType
  const updates: any = { type: value }
  
  // Если изменили на LDAP, очистить пароль
  if (value === 'LDAP') {
    updates.password = null
  }
  // Если изменили на Локальная и пароля нет, установить пустую строку
  else if (value === 'Локальная') {
    const account = accountStore.accounts.find(acc => acc.id === accountId)
    if (!account?.password) {
      updates.password = ''
    }
  }
  
  accountStore.updateAccount(accountId, updates)
  validateAndSave(accountId)
}

const handleLoginBlur = (accountId: string, event: Event) => {
  const value = (event.target as HTMLInputElement).value
  accountStore.updateAccount(accountId, { login: value })
  validateAndSave(accountId)
}

const handlePasswordBlur = (accountId: string, event: Event) => {
  const value = (event.target as HTMLInputElement).value
  accountStore.updateAccount(accountId, { password: value })
  validateAndSave(accountId)
}

const togglePassword = (accountId: string) => {
  showPasswords.value[accountId] = !showPasswords.value[accountId]
}

const deleteAccount = (id: string) => {
  if (confirm('Вы уверены, что хотите удалить эту учетную запись?')) {
    accountStore.deleteAccount(id)
    delete errors[id]
    delete showPasswords.value[id]
  }
}
</script> 