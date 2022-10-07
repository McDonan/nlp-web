import { atom, useRecoilState } from 'recoil'
import { ErrorResponse } from '../types/common'
import { ErrorCode } from '../configs/constants'

export const AtomErrorMessage = atom<string | null>({
  key: 'ErrorMessage',
  default: '',
})

export const useErrorMessage = () => {
  const [errMsg, setErrMsgState] = useRecoilState(AtomErrorMessage)
  const clearErrMsg = () => {
    setErrMsgState('')
  }

  const onError = (error: unknown) => {
    const errorStatus = JSON.parse(JSON.stringify(error)) as Error
    const errorResp = error as ErrorResponse
    try {
      const {
        error_code,
        message: messageError,
        debug_message,
      } = errorResp.response.data
      if (error_code !== ErrorCode.UNAUTHORIZED) {
        setErrMsgState(
          `${errorStatus?.message}: ${
            debug_message ?? error_code ?? messageError
          }`
        )
      }
    } catch (e) {
      setErrMsgState(`Error: ${String(error)}`)
    }
  }

  return { errMsg, setErrMsgState, clearErrMsg, onError }
}
