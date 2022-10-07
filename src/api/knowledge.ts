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
import { useAxios } from '../libs/axios'
import { useUser } from '../hooks/useUser'
import {
  KnowledgeResponse,
  KnowledgeMembers,
  KnowledgeForm,
  KnowledgeParams,
  KnowledgeExportParams,
} from '../types/knowledge'
import { useErrorMessage } from '../hooks/useErrorMessage'

const queryKeyGetKnowledge = 'getKnowledge'

export const useKnowledge = ({
  page,
  limit,
  searchText,
  sort,
}: KnowledgeParams): {
  data: KnowledgeResponse | undefined
  isLoading: boolean
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<KnowledgeResponse, unknown>>
  isRefetching: boolean
} => {
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const { data, isLoading, refetch, isRefetching } = useQuery(
    [`${queryKeyGetKnowledge}-${channel_id}`, page, limit, searchText, sort],
    () =>
      axios
        .get<KnowledgeResponse>(
          `/channel/${String(channel_id)}/knowledge?page=${String(
            page
          )}&limit=${String(limit)}${
            searchText ? `&searchText=${searchText}` : ''
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

export const useCreateKnowledgeMutation = (): UseMutationResult<
  AxiosResponse<unknown, unknown>,
  unknown,
  KnowledgeForm,
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const mutation = useMutation(
    (knowledgeForm: KnowledgeForm) =>
      axios.post(`/channel/${String(channel_id)}/knowledge`, {
        ...knowledgeForm,
        channel_id,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${queryKeyGetKnowledge}-${channel_id}`)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useUpdateKnowledgeMutation = (): UseMutationResult<
  AxiosResponse<unknown, unknown>,
  unknown,
  { knowledgeForm: KnowledgeForm; id: string },
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const mutation = useMutation(
    ({ knowledgeForm, id }: { knowledgeForm: KnowledgeForm; id: string }) =>
      axios.put(`/channel/${String(channel_id)}/knowledge/${id}`, {
        ...knowledgeForm,
        channel_id,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${queryKeyGetKnowledge}-${channel_id}`)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useDeleteKnowledgeMutation = (): UseMutationResult<
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
      axios.delete(`/channel/${String(channel_id)}/knowledge/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${queryKeyGetKnowledge}-${channel_id}`)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useKnowledgeMembers = (
  id: string
): {
  data: KnowledgeMembers | undefined
  isLoading: boolean
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<KnowledgeMembers, unknown>>
} => {
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const { data, isLoading, refetch } = useQuery({
    queryKey: `getKnowledgeMember-${id}`,
    queryFn: () =>
      axios
        .get<KnowledgeMembers>(`/channel/${String(channel_id)}/knowledge/${id}`)
        .then((response) => response.data),
  })

  return { data, isLoading, refetch }
}

export const useExportKnowledge = ({
  type,
  isExport,
  page,
  limit,
  searchText,
}: KnowledgeExportParams): {
  data: void | Blob | undefined
  isLoading: boolean
  isRefetching: boolean
  isError: boolean
} => {
  const { onError } = useErrorMessage()
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const { data, isLoading, isRefetching, isError } = useQuery({
    queryKey: `exportDataSet-${channel_id}`,
    queryFn: () =>
      axios
        .get<Blob>(
          `/channel/${String(channel_id)}/knowledge/export?type=${String(
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
