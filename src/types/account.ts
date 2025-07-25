export enum AccountType {
  LDAP = 'LDAP',
  LOCAL = 'Локальная'
}

export interface Label {
  text: string
}

export interface Account {
  id: string
  label?: Label[]
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