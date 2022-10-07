import { type } from 'os'

export interface Knowledge {
  key?: string
  id: string
  name: string
  members?: string[]
}

export interface KnowledgeSuggestions {
  confidence: number
  word: string
}

export interface KnowledgeMeta {
  total: number
  page: number
  limit: number
}

export interface KnowledgeResponse {
  meta_data: KnowledgeMeta
  items: KnowledgeMembers[]
}

export interface KnowledgeMembers {
  id: string
  members?: string[]
  name: string
  suggestions: KnowledgeSuggestions[]
}

export interface KnowledgeForm {
  name: string
  members?: string[]
}
export interface KnowledgeSort {
  sortKey: string
  sortOrder: string | undefined
}
export interface KnowledgeParams {
  page: number
  limit: number
  searchText?: string
  sort?: KnowledgeSort
}
export interface KnowledgeExportParams extends KnowledgeParams {
  type: string | undefined
  isExport: boolean
}
