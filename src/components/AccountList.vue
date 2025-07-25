<template>
  <div class="bg-white rounded-lg shadow border">
    <div class="p-6 border-b">
      <h3 class="text-lg font-semibold text-gray-900">
        Список учетных записей ({{ accountStore.accountsCount }})
      </h3>
    </div>

    <div v-if="accountStore.accounts.length === 0" class="p-6 text-center text-gray-500">
      Нет добавленных учетных записей
    </div>

    <div v-else class="divide-y">
      <div
        v-for="account in accountStore.accounts"
        :key="account.id"
        class="p-6 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <!-- Метка -->
            <div class="mb-3" v-if="account.label">
              <label class="text-sm font-medium text-gray-500">Метка:</label>
              <div class="mt-1">
                <span
                  v-for="(tag, index) in parseTags(account.label)"
                  :key="index"
                  class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                >
                  {{ tag.trim() }}
                </span>
              </div>
            </div>

            <!-- Тип записи -->
            <div class="mb-3">
              <label class="text-sm font-medium text-gray-500">Тип записи:</label>
              <div class="mt-1">
                <span
                  :class="typeClasses(account.type)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ account.type }}
                </span>
              </div>
            </div>

            <!-- Логин -->
            <div class="mb-3">
              <label class="text-sm font-medium text-gray-500">Логин:</label>
              <div class="mt-1 text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                {{ account.login }}
              </div>
            </div>

            <!-- Пароль -->
            <div class="mb-3">
              <label class="text-sm font-medium text-gray-500">Пароль:</label>
              <div class="mt-1">
                <div v-if="account.type === 'LDAP'" class="text-sm text-gray-400 italic">
                  Не используется (LDAP аутентификация)
                </div>
                <div v-else class="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                  {{ showPasswords[account.id] ? account.password : '••••••••' }}
                  <button
                    @click="togglePassword(account.id)"
                    class="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                  >
                    {{ showPasswords[account.id] ? 'Скрыть' : 'Показать' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Кнопка удаления -->
          <div class="ml-4">
            <Button
              variant="danger"
              size="sm"
              @click="deleteAccount(account.id)"
            >
              Удалить
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAccountStore } from '@/stores/accountStore'
import { AccountType } from '@/types/account'
import Button from '@/components/ui/button/Button.vue'

const accountStore = useAccountStore()
const showPasswords = ref<Record<string, boolean>>({})

const parseTags = (label: string): string[] => {
  return label.split(';').filter(tag => tag.trim().length > 0)
}

const typeClasses = (type: AccountType): string => {
  return type === AccountType.LDAP
    ? 'bg-green-100 text-green-800'
    : 'bg-orange-100 text-orange-800'
}

const togglePassword = (accountId: string) => {
  showPasswords.value[accountId] = !showPasswords.value[accountId]
}

const deleteAccount = (id: string) => {
  if (confirm('Вы уверены, что хотите удалить эту учетную запись?')) {
    accountStore.deleteAccount(id)
  }
}
</script> 