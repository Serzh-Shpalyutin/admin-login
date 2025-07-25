export enum AccountType {
  LDAP = 'LDAP',
  LOCAL = 'Локальная'
}

export interface Account {
  id: string
  label?: string
  type: AccountType
  login: string
  password?: string | null
}

export interface CreateAccountForm {
  label: string
  type: AccountType
  login: string
  password: string
} 