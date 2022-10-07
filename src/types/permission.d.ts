import {User} from './users'

export interface Permission {
  create_channels: boolean
  create_data_sets: boolean
  create_definitions: boolean
  create_knowledge: boolean
  create_users: boolean
  delete_data_sets: boolean
  delete_definitions: boolean
  delete_knowledge: boolean
  set_channel_status: boolean
  set_users_status: boolean
  edit_channels: boolean
  edit_data_sets: boolean
  edit_definitions: boolean
  edit_knowledge: boolean
  edit_users: boolean
  export_data_sets: boolean
  export_definitions: boolean
  export_users: boolean
  import_data_sets: boolean
  import_definitions: boolean
  manage_roles: boolean
  search_data_sets: boolean
  search_definitions: boolean
  search_knowledge: boolean
  search_users: boolean
  view_channels: boolean
  bind_channels: boolean
  bind_all_channels: boolean
  select_channel: boolean
  view_dashboard: boolean
  view_data_sets: boolean
  view_definitions: boolean
  view_knowledge: boolean
  view_users: boolean
}


interface AccessToken_UserData extends User{
  channel_ids: string[]
  role_name: string
  active: boolean
}

export interface AccessTokenData {
  exp: number
  iat: number
  iss: string
  nbf: number
  token_type: string
  user_data: AccessToken_UserData
}