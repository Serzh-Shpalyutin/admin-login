<template>
  <div class="bg-white p-6 rounded-lg shadow border">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Управление учетными записями</h2>
      <Button @click="toggleForm" :variant="showForm ? 'secondary' : 'primary'">
        {{ showForm ? 'Отмена' : 'Добавить учетную запись' }}
      </Button>
    </div>

    <div v-if="showForm" class="border-t pt-6">
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Метка -->
        <Input
          v-model="form.label"
          label="Метка"
          placeholder="Введите метки через точку с запятой"
          :maxLength="50"
          :error="errors.label"
          hint="Необязательное поле. Максимум 50 символов. Метки разделяются знаком ;"
        />

        <!-- Тип записи -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Тип записи <span class="text-red-500">*</span>
          </label>
          <Select
            v-model="form.type"
            placeholder="Выберите тип записи"
            :error="!!errors.type"
          >
            <option value="LDAP">LDAP</option>
            <option value="Локальная">Локальная</option>
          </Select>
          <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
        </div>

        <!-- Логин -->
        <Input
          v-model="form.login"
          label="Логин"
          placeholder="Введите логин"
          :maxLength="100"
          :required="true"
          :error="errors.login"
        />

        <!-- Пароль (только для локальной записи) -->
        <Input
          v-if="form.type === 'Локальная'"
          v-model="form.password"
          label="Пароль"
          type="password"
          placeholder="Введите пароль"
          :maxLength="100"
          :required="true"
          :error="errors.password"
        />

        <div class="flex gap-3 pt-4">
          <Button type="submit" :disabled="!isFormValid">
            Добавить
          </Button>
          <Button variant="secondary" @click="resetForm">
            Очистить
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useAccountStore } from '@/stores/accountStore'
import { AccountType } from '@/types/account'
import type { CreateAccountForm } from '@/types/account'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Select from '@/components/ui/select/Select.vue'

const accountStore = useAccountStore()
const showForm = ref(false)

const form = reactive<CreateAccountForm>({
  label: '',
  type: '' as AccountType,
  login: '',
  password: ''
})

const errors = reactive({
  label: '',
  type: '',
  login: '',
  password: ''
})

const isFormValid = computed(() => {
  return form.type && form.login.trim() && 
    (form.type === 'LDAP' || (form.type === 'Локальная' && form.password.trim()))
})

const validateForm = (): boolean => {
  // Сброс ошибок
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Валидация метки
  if (form.label && form.label.length > 50) {
    errors.label = 'Максимум 50 символов'
    isValid = false
  }

  // Валидация типа записи
  if (!form.type) {
    errors.type = 'Выберите тип записи'
    isValid = false
  }

  // Валидация логина
  if (!form.login.trim()) {
    errors.login = 'Логин обязателен'
    isValid = false
  } else if (form.login.length > 100) {
    errors.login = 'Максимум 100 символов'
    isValid = false
  }

  // Валидация пароля для локальной записи
  if (form.type === 'Локальная') {
    if (!form.password.trim()) {
      errors.password = 'Пароль обязателен для локальной записи'
      isValid = false
    } else if (form.password.length > 100) {
      errors.password = 'Максимум 100 символов'
      isValid = false
    }
  }

  return isValid
}

const submitForm = () => {
  if (validateForm()) {
    accountStore.addAccount(form)
    resetForm()
    showForm.value = false
  }
}

const resetForm = () => {
  form.label = ''
  form.type = '' as AccountType
  form.login = ''
  form.password = ''
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) {
    resetForm()
  }
}
</script> 