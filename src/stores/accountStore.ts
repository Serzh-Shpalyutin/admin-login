import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Account, CreateAccountForm, AccountType, Label } from '@/types/account'

const STORAGE_KEY = 'admin-login-accounts'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>([])

  // Загрузка данных из localStorage при инициализации
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        accounts.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Ошибка загрузки данных из localStorage:', error)
    }
  }

  // Сохранение в localStorage при изменении
  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.value))
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error)
    }
  }

  // Наблюдение за изменениями для автосохранения
  watch(accounts, saveToStorage, { deep: true })

  const accountsCount = computed(() => accounts.value.length)

  const parseLabels = (labelString: string): Label[] => {
    if (!labelString.trim()) return []
    return labelString
      .split(';')
      .map(text => text.trim())
      .filter(text => text.length > 0)
      .map(text => ({ text }))
  }

  const labelsToString = (labels?: Label[]): string => {
    if (!labels || labels.length === 0) return ''
    return labels.map(label => label.text).join(';')
  }

  const addAccount = (formData: CreateAccountForm) => {
    const newAccount: Account = {
      id: crypto.randomUUID(),
      label: parseLabels(formData.label),
      type: formData.type,
      login: formData.login.trim(),
      password: formData.type === 'LDAP' ? null : formData.password.trim()
    }
    
    accounts.value.push(newAccount)
  }

  const addEmptyAccount = () => {
    const newAccount: Account = {
      id: crypto.randomUUID(),
      label: [],
      type: 'LDAP' as AccountType,
      login: '',
      password: null
    }
    
    accounts.value.push(newAccount)
  }

  const updateAccount = (id: string, updates: Partial<Account>) => {
    const index = accounts.value.findIndex(account => account.id === id)
    if (index > -1) {
      accounts.value[index] = { ...accounts.value[index], ...updates }
    }
  }

  const validateAccount = (account: Account): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {}
    
    // Валидация типа записи
    if (!account.type) {
      errors.type = 'Выберите тип записи'
    }
    
    // Валидация логина
    if (!account.login.trim()) {
      errors.login = 'Логин обязателен'
    } else if (account.login.length > 100) {
      errors.login = 'Максимум 100 символов'
    }
    
    // Валидация пароля для локальной записи
    if (account.type === 'Локальная') {
      if (!account.password?.trim()) {
        errors.password = 'Пароль обязателен для локальной записи'
      } else if (account.password.length > 100) {
        errors.password = 'Максимум 100 символов'
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  const deleteAccount = (id: string) => {
    const index = accounts.value.findIndex(account => account.id === id)
    if (index > -1) {
      accounts.value.splice(index, 1)
    }
  }

  // Инициализация при создании store
  loadFromStorage()

  return {
    accounts,
    accountsCount,
    addAccount,
    addEmptyAccount,
    updateAccount,
    validateAccount,
    deleteAccount,
    parseLabels,
    labelsToString
  }
}) 