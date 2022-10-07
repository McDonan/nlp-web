export interface AuthCodeResponse {
  token_type: string
  scope: string
  expires_in: number
  ext_expires_in: number
  access_token: {
    token: string
    expires_at: string
  }
  refresh_token: {
    token: string
    expires_at: string
  }
  id_token: string
}

export interface RefreshTokenResponse {
  access_token:{
    token: string
    expires_at: string
  }
  refresh_token:{
    token: string
    expires_at: string
  }
}


export interface QueueItem {
  resolve: (value: string | PromiseLike<string> ) => void;
  reject: (reason?: any) => void;
}
