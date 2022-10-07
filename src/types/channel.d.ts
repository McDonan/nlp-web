import { MetaDataPaging } from './common'

export interface Channel {
  key?: string
  id: string
  name: string
  active: boolean
}
//for Atom
export interface ChannelJSON {
  key?: string | null
  id: string | null | undefined
  name: string | null
  active: boolean | null | undefined
}

export interface ChannelsResponse {
  meta_data: MetaDataPaging
  items: Channel[]
}
export interface ChannelSort {
  sortKey: string
  sortOrder: string | undefined
}
export interface ChannelGetParams {
  page: number
  limit: number
  searchText?: string
  sort?: ChannelSort
}

export interface ChannelForm {
  name: string
}

export interface UpdateChannel {
  name?: string
  activate?: boolean
}
