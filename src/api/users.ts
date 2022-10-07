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
  UsersResponse,
  UsersGetParams,
  UsersExportParams,
  UserRole,
  UserForm,
  UserStatusBody,
} from '../types/users'
import { useAxios } from '../libs/axios'
import { useErrorMessage } from '../hooks/useErrorMessage'

const queryKeyGetUser = 'getUser'

export const useGetUser = ({
  page,
  limit,
  searchText,
  sort,
}: UsersGetParams): {
  data: UsersResponse | undefined
  isLoading: boolean
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<UsersResponse, unknown>>
  isRefetching: boolean
} => {
  const axios = useAxios()
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: [queryKeyGetUser, page, searchText, sort],
    queryFn: () =>
      axios
        .get<UsersResponse>(
          `/users?page=${String(page)}&limit=${String(limit)}${
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
    keepPreviousData: true,
  })
  return { data, isLoading, refetch, isRefetching }
}

export const useGetUserRole = (): {
  data: void | UserRole[] | undefined
  isLoading: boolean
  isRefetching: boolean
  isError: boolean
} => {
  const { onError } = useErrorMessage()

  const axios = useAxios()
  const { data, isLoading, isRefetching, isError } = useQuery({
    queryKey: 'getUserRole',
    queryFn: () =>
      axios
        .get<UserRole[]>(`/users/roles`)
        .then((response) => response.data)
        .catch((err) => onError(err)),
  })
  return { data, isLoading, isRefetching, isError }
}

export const useCreateUserMutation = (): UseMutationResult<
  AxiosResponse<unknown, unknown>,
  unknown,
  UserForm,
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const mutation = useMutation(
    (userForm: UserForm) => axios.post(`/users`, userForm),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeyGetUser)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useUpdateUserMutation = (): UseMutationResult<
  AxiosResponse<unknown, unknown>,
  unknown,
  { userForm: UserForm; id: string },
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const mutation = useMutation(
    ({ userForm, id }: { userForm: UserForm; id: string }) =>
      axios.put(`/users/${id}`, userForm),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeyGetUser)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useUpdateStatusUserMutation = (): UseMutationResult<
  AxiosResponse<unknown, unknown>,
  unknown,
  { body: UserStatusBody | undefined; id: string; active: boolean },
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const mutation = useMutation(
    ({
      body,
      id,
      active,
    }: {
      body: UserStatusBody | undefined
      id: string
      active: boolean
    }) => axios.put(`/users/${id}?active=${active.toString()}`, body),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeyGetUser)
      },
      onError: (error) => {
        onError(error)
        queryClient.invalidateQueries(queryKeyGetUser)
      },
    }
  )
  return mutation
}
export const useExportUser = ({
  type,
  page,
  limit,
  searchText,
  isExport,
}: UsersExportParams): {
  data: void | Blob | undefined
  isLoading: boolean
  isRefetching: boolean
  isError: boolean
} => {
  const { onError } = useErrorMessage()

  const axios = useAxios()
  const { data, isLoading, isRefetching, isError } = useQuery({
    queryKey: 'exportDataSet',
    queryFn: () =>
      axios
        .get<Blob>(
          `/users/export?type=${String(type)}&page=${String(
            page
          )}&limit=${String(limit)}${
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
