import { MetaDataPaging } from './common'

export interface Definition {
  key?: string
  created_at: string
  description: string
  id: string
  name: string
  reg_exes: string[]
  rules: string[]
  tags: string[]
  count: number
  updated_at: string
}
export interface DefinitionVerify {
  name: string
  description: string
  reg_exes: string[]
  rules: string[]
  tags: string[]
  key?: string
  created_at?: string
  id?: string
  count?: number
  updated_at?: string
  accepted?: boolean | string | undefined
  error_code?: string | undefined
}

export interface DefinitionVerifyFull extends DefinitionVerify {
  channel_id: string
}

export interface DefinitionImportParams {
  formFile: FormData | undefined
  type: string | undefined
}

export interface DefinitionSort {
  sortKey: string
  sortOrder: string | undefined
}
export interface DefinitionGetParams {
  page: number
  limit: number
  searchText?: string
  sort?: DefinitionSort
}

export interface DefinitionExportParams extends DefinitionGetParams {
  type: string | undefined
  isExport: boolean
}

export type DefinitionResponse = {
  items: Definition[]
  meta_data: MetaDataPaging
}

export interface DefinitionForm {
  name: string
  description: string
  reg_exes: string[]
  rules: string[]
  tags: string[]
}

export interface DefinitionOnly {
  name: string
  id: string
}

export type DefinitionOnlyResponse = {
  items: DefinitionOnly[]
}
