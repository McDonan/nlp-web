import { MetaDataPaging } from './common'
export interface DataSet {
  key?: string
  created_at: string
  definition: string
  definition_id: string
  id: string
  text: string
  updated_at: string
}

export interface DataSetSort {
  sortKey: string
  sortOrder: string | undefined
}
export interface DataSetGetParams {
  page: number
  limit: number
  searchText?: string
  definitionID?: string
  sort?: DataSetSort
}

export interface DataSetExportParams extends DataSetGetParams {
  type: string | undefined
  isExport: boolean
}

export type DataSetResponse = {
  items: DataSet[]
  meta_data: MetaDataPaging
}

export interface DataSetSearchParams {
  type: string
  operation: string
  searchText: string
}

export interface DataSetMutatedSearchParams {
  type: string
  operation: string
  searchText: string[]
}
export interface DataSetForm {
  text: string
  definition_id: string
}
export interface DataSetBulkEditForm {
  ids: string[]
  definition_id: string
}

export interface DataSetBulkEditFormParams {
  definition_id: string
}

export interface DataSetBulkForm {
  ids: string[]
}

export interface DataSetImportForm {
  text: string
  definition: string
}

export interface DataSetVerify {
  text: string
  definition: string
  created_at?: string
  definition_id?: string
  id?: string

  updated_at?: string
  accepted?: boolean | string | undefined
  error_code?: string | undefined
}

export interface DataSetVerifyFull extends DataSetVerify {
  channel_id: string
}
