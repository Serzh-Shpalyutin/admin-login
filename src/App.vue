<script setup lang="ts">
import AccountForm from '@/components/AccountForm.vue'
import AccountList from '@/components/AccountList.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4 space-y-6">
      <AccountForm />
      <AccountList />
    </div>
  </div>
</template>
