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
import { useErrorMessage } from '../hooks/useErrorMessage'

import {
  ChannelsResponse,
  ChannelGetParams,
  ChannelForm,
} from '../types/channel'
const queryKeyGetChannel = 'getChannel'

export const useGetChannel = ({
  page,
  limit,
  searchText,
  sort,
}: ChannelGetParams): {
  data: ChannelsResponse | undefined
  isLoading: boolean
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<ChannelsResponse, unknown>>
  isRefetching: boolean
} => {
  const axios = useAxios()
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: [
      queryKeyGetChannel,
      `${queryKeyGetChannel}-${searchText || ''}`,
      sort,
    ],
    queryFn: () =>
      axios
        .get<ChannelsResponse>(
          `/channels?page=${page}&limit=${limit}${
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
  })
  return { data, isLoading, refetch, isRefetching }
}

export const useCreateChannel = (): UseMutationResult<
  AxiosResponse<unknown, unknown>,
  unknown,
  ChannelForm,
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const mutation = useMutation(
    (newChannel: ChannelForm) => axios.post(`/channels`, newChannel),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeyGetChannel)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useUpdateChannel = (): UseMutationResult<
  AxiosResponse<unknown, unknown>,
  unknown,
  { channelForm: ChannelForm; id: string },
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const mutation = useMutation(
    ({ channelForm, id }: { channelForm: ChannelForm; id: string }) =>
      axios.put(`/channels/${id}`, channelForm),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeyGetChannel)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useDeleteChannel = (): UseMutationResult<
  AxiosResponse<unknown, unknown>,
  unknown,
  { id: string; active: boolean },
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const mutation = useMutation(
    ({ id, active }: { id: string; active: boolean }) =>
      axios.put(`/channels/${id}?active=${String(active)}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeyGetChannel)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}
