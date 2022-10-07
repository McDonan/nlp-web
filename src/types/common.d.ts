export interface MetaDataPaging {
  limit: number
  page: number
  total: number
}

export interface ErrorResponse {
  response: {
    data: {
      error_raw: object
      error_code: string
      message: string
      source_func: string
      source_line: number
      debug_message: string
      debug_extra_info?: any
      error_level?: string
    }
  }
}
