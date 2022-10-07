import { MetaDataPaging } from './common'
import { Permission } from './permission'
import { Channel } from './channel'

export interface UserForm {
  email: string
  email_host?: string
  employee_id: string
  name: string
  role: string
  channel_ids: string[]
}
export interface UserSort {
  sortKey: string
  sortOrder: string | undefined
}
export interface UsersGetParams {
  page: number
  limit: number
  searchText?: string
  sort?: UserSort
}

export interface UsersExportParams extends UsersGetParams {
  type: string | undefined
  isExport: boolean
}

export interface User {
  key?: string
  id: string
  email: string
  employee_id: string
  name: string
  role: string
  channels: Channel[]
  active: boolean
  last_log_on: string
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  permissions: Permission
  reason: string | null
}

export type UsersResponse = {
  items: User[]
  meta_data: MetaDataPaging
}

export type UserRole = {
  role: string
  name: string
  permissions: Permission
}

export interface UserStatusBody {
  reason: string
}
