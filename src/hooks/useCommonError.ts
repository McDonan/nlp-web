import { message } from 'antd'
import { ErrorResponse } from '../types/common'

export const useCommonError = () => {
  const onError = (error: unknown) => {
    const errorStatus = JSON.parse(JSON.stringify(error)) as Error
    const errorResp = error as ErrorResponse
    const { error_code, message: messageError } = errorResp.response.data
    return message.error({
      content: `${errorStatus?.message}: ${error_code ?? messageError}`,
      style: {
        marginTop: '90vh',
      },
    })
  }
  return { onError }
}
