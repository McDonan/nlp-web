import { Axios, AxiosResponse } from 'axios'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from 'react-query'

import configs from '../configs/configs'
import { useAxios } from '../libs/axios'
import { useErrorMessage } from '../hooks/useErrorMessage'
import { AuthCodeResponse, RefreshTokenResponse } from '../types/auth'

export const useAuthAzure = (): UseMutationResult<
  AxiosResponse<AuthCodeResponse, unknown>,
  unknown,
  { code: string },
  unknown
> => {
  const { onError } = useErrorMessage()

  const axios = useAxios()
  const mutation = useMutation(
    ({ code }: { code: string }) =>
      axios.post(
        `/login`,
        {
          code: code,
        }
      ),
    {
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useLogin = (): UseMutationResult<
  AxiosResponse<AuthCodeResponse, unknown>,
  unknown,
  { code: string },
  unknown
> => {
  const { onError } = useErrorMessage()

  const axios = useAxios()
  const mutation = useMutation(
    ({ code }: { code: string }) =>
      axios.post(`/login`, {
        auth_code: code,
      }),
    {
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}
