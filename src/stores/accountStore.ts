import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Account, CreateAccountForm, AccountType } from '@/types/account'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>([])

  const accountsCount = computed(() => accounts.value.length)

  const addAccount = (formData: CreateAccountForm) => {
    const newAccount: Account = {
      id: crypto.randomUUID(),
      label: formData.label.trim() || undefined,
      type: formData.type,
      login: formData.login.trim(),
      password: formData.type === 'LDAP' ? null : formData.password.trim()
    }
    
    accounts.value.push(newAccount)
  }

  const deleteAccount = (id: string) => {
    const index = accounts.value.findIndex(account => account.id === id)
    if (index > -1) {
      accounts.value.splice(index, 1)
    }
  }

  return {
    accounts,
    accountsCount,
    addAccount,
    deleteAccount
  }
}) 