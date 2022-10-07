import { AxiosResponse } from 'axios'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from 'react-query'
import {
  DefinitionForm,
  DefinitionResponse,
  DefinitionGetParams,
  DefinitionExportParams,
  DefinitionOnly,
  DefinitionVerify,
  DefinitionVerifyFull,
} from '../types/definition'
import { useAxios } from '../libs/axios'
import { useUser } from '../hooks/useUser'
import { useErrorMessage } from '../hooks/useErrorMessage'

const queryKeyGetDefinition = 'getDefinition'

export const useGetDefinition = ({
  page,
  limit,
  searchText,
  sort,
}: DefinitionGetParams): {
  data: DefinitionResponse | undefined
  isLoading: boolean
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<DefinitionResponse, unknown>>
  isRefetching: boolean
} => {
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const { data, isLoading, refetch, isRefetching } = useQuery(
    [`${queryKeyGetDefinition}-${channel_id}`, page, limit, searchText, sort],
    () =>
      axios
        .get<DefinitionResponse>(
          `/channel/${String(channel_id)}/definition?page=${String(
            page
          )}&limit=${String(limit)}${
            searchText ? `&searchText=${String(searchText)}` : ''
          }${
            sort?.sortOrder
              ? `&sort[${String(sort.sortKey)}]=${String(
                  sort.sortOrder.slice(0, -3)
                )}`
              : ''
          }`
        )
        .then((response) => response.data),

    { keepPreviousData: true }
  )
  return { data, isLoading, refetch, isRefetching }
}

export const useCreateDefinition = (): UseMutationResult<
  AxiosResponse<unknown, unknown>,
  unknown,
  DefinitionForm,
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const mutation = useMutation(
    (definitionForm: DefinitionForm) =>
      axios.post(`/channel/${String(channel_id)}/definition`, {
        ...definitionForm,
        channel_id,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${queryKeyGetDefinition}-${channel_id}`)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useUpdateDefinition = (): UseMutationResult<
  AxiosResponse<unknown, unknown>,
  unknown,
  { definitionForm: DefinitionForm; id: string },
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const mutation = useMutation(
    ({ definitionForm, id }: { definitionForm: DefinitionForm; id: string }) =>
      axios.put(`/channel/${String(channel_id)}/definition/${id}`, {
        ...definitionForm,
        channel_id,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${queryKeyGetDefinition}-${channel_id}`)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useDeleteDefinition = (): UseMutationResult<
  AxiosResponse<unknown, unknown>,
  unknown,
  string,
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const mutation = useMutation(
    (id: string) =>
      axios.delete(`/channel/${String(channel_id)}/definition/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${queryKeyGetDefinition}-${channel_id}`)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useExportDefinition = ({
  type,
  page,
  limit,
  searchText,
  isExport,
}: DefinitionExportParams): {
  data: Blob | undefined | void
  isLoading: boolean
  isRefetching: boolean
  isError: boolean
} => {
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const { onError } = useErrorMessage()
  const { data, isLoading, isRefetching, isError } = useQuery({
    queryKey: 'exportDefinition',
    queryFn: () =>
      axios
        .get<Blob>(
          `/channel/${String(channel_id)}/definition/export?type=${String(
            type
          )}&page=${String(page)}&limit=${String(limit)}${
            searchText ? `&searchText=${searchText}` : ''
          }`,
          {
            responseType: 'blob',
          }
        )
        .then((response) => response.data)
        .catch((err) => onError(err)),
    enabled: Boolean(isExport) && Boolean(type),
  })
  return { data, isLoading, isRefetching, isError }
}

export const useUploadDefinition = (): UseMutationResult<
  AxiosResponse<DefinitionVerify[], unknown>,
  unknown,
  { formFile: FormData; type: string },
  unknown
> => {
  const { onError } = useErrorMessage()
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const mutation = useMutation(
    ({ formFile, type }: { formFile: FormData; type: string }) =>
      axios.post<DefinitionVerify[]>(
        `/channel/${String(channel_id)}/definition/upload?type=${type ?? ''}`,
        formFile
      ),
    {
      // onSuccess: (data) => {
      //   console.log('data inside hook', data)
      //   console.log(mutation.data)
      // },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useVerifyDefinition = (): UseMutationResult<
  AxiosResponse<DefinitionVerify[], unknown>,
  unknown,
  { definitionUploadForm: DefinitionVerify[] },
  unknown
> => {
  const { onError } = useErrorMessage()

  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const mutation = useMutation(
    ({ definitionUploadForm }: { definitionUploadForm: DefinitionVerify[] }) =>
      axios.post<DefinitionVerify[]>(
        `/channel/${String(channel_id)}/definition/verify`,
        definitionUploadForm.map(
          (uploadForm: DefinitionVerify): DefinitionVerifyFull => {
            return { ...uploadForm, channel_id }
          }
        )
      ),
    {
      // onSuccess: (data) => {
      //   console.log('data', data)
      //   queryClient.invalidateQueries(`${queryKeyGetDefinition}-${channel_id}`)
      // },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useSubmitDefinition = (): UseMutationResult<
  AxiosResponse<DefinitionVerify[], unknown>,
  unknown,
  { definitionUploadForm: DefinitionVerify[] },
  unknown
> => {
  const queryClient = useQueryClient()
  const { onError } = useErrorMessage()

  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const mutation = useMutation(
    ({ definitionUploadForm }: { definitionUploadForm: DefinitionVerify[] }) =>
      axios.post<DefinitionVerify[]>(
        `/channel/${String(channel_id)}/definitions`,
        definitionUploadForm.map(
          (uploadForm: DefinitionVerify): DefinitionVerifyFull => {
            return { ...uploadForm, channel_id }
          }
        )
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${queryKeyGetDefinition}-${channel_id}`)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useGetAllDefinition = (
  isSearch: boolean
): {
  data: DefinitionOnly[] | undefined
  isLoading: boolean
  isRefetching: boolean
  isError: boolean
} => {
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const { data, isLoading, isRefetching, isError } = useQuery({
    queryKey: `${queryKeyGetDefinition}-${channel_id}-getAll`,
    queryFn: () =>
      axios
        .get<DefinitionOnly[]>(`/channel/${String(channel_id)}/definition/all`)
        .then((response) => response.data),
    keepPreviousData: true,
    enabled: Boolean(isSearch),
  })
  return { data, isLoading, isRefetching, isError }
}
