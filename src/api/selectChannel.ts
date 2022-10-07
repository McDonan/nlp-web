import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
} from 'react-query'
import { useAxios } from '../libs/axios'
import { User } from '../types/users'

const queryKeyGetChannel = 'getSelectChannel'

export const useGetChannel = (
  id: string
): {
  data: User | undefined
  isLoading: boolean
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<User, unknown>>
  isRefetching: boolean
} => {
  const axios = useAxios()
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: [queryKeyGetChannel],
    queryFn: () =>
      axios.get<User>(`/users/${id}`).then((response) => response.data)
  })
  return { data, isLoading, refetch, isRefetching }
}
