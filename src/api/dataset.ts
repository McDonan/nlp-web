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
import { useErrorMessage } from '../hooks/useErrorMessage'

import {
  DataSetResponse,
  DataSetGetParams,
  DataSetForm,
  DataSetExportParams,
  DataSetBulkEditForm,
  DataSetBulkForm,
  DataSetMutatedSearchParams,
  DataSetVerify,
  DataSetVerifyFull,
} from '../types/dataset'
import { DataSetFilterOperationMap } from '../configs/constants'

const queryKeyGetDataSet = 'getDataset'

export const useGetDataSet = ({
  page,
  limit,
  searchText,
  definitionID,
  sort,
}: DataSetGetParams): {
  data: DataSetResponse | undefined
  isLoading: boolean
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<DataSetResponse, unknown>>
  isRefetching: boolean
} => {
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const { data, isLoading, refetch, isRefetching } = useQuery(
    [
      `${queryKeyGetDataSet}-${channel_id}`,
      page,
      limit,
      searchText,
      definitionID,
      sort,
    ],
    () =>
      axios
        .get<DataSetResponse>(
          `/channel/${String(channel_id)}/data-set?page=${String(
            page
          )}&limit=${String(limit)}${searchText ? `${searchText}` : ''}${
            definitionID ? `&action[eq]=${definitionID}` : ''
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

export const useCreateDataSet = (): UseMutationResult<
  AxiosResponse<unknown, unknown>,
  unknown,
  DataSetForm,
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const mutation = useMutation(
    (dataSetForm: DataSetForm) =>
      axios.post(`/channel/${String(channel_id)}/data-set`, {
        ...dataSetForm,
        channel_id,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${queryKeyGetDataSet}-${channel_id}`)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useUpdateDataSetMutation = (): UseMutationResult<
  AxiosResponse<unknown, unknown>,
  unknown,
  { dataSetForm: DataSetForm; id: string },
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const mutation = useMutation(
    ({ dataSetForm, id }: { dataSetForm: DataSetForm; id: string }) =>
      axios.put(`/channel/${String(channel_id)}/data-set/id/${id}`, {
        ...dataSetForm,
        channel_id,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${queryKeyGetDataSet}-${channel_id}`)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useDeleteDataSetMutation = (): UseMutationResult<
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
      axios.delete(`channel/${String(channel_id)}/data-set/id/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${queryKeyGetDataSet}-${channel_id}`)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useUpdateDataSetBulkMutation = (): UseMutationResult<
  AxiosResponse<unknown, unknown>,
  unknown,
  DataSetBulkEditForm,
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const mutation = useMutation(
    (dataSetEditForm: DataSetBulkEditForm) =>
      axios.put(`/channel/${String(channel_id)}/data-set/bulk`, {
        ...dataSetEditForm,
        channel_id,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${queryKeyGetDataSet}-${channel_id}`)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useDeleteDataSetBulkMutation = (): UseMutationResult<
  AxiosResponse<unknown, unknown>,
  unknown,
  DataSetBulkForm,
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const mutation = useMutation(
    (data: DataSetBulkForm) =>
      axios.delete(`channel/${String(channel_id)}/data-set/bulk`, {
        data: {
          ids: data.ids,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${queryKeyGetDataSet}-${channel_id}`)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useExportDataSet = ({
  type,
  page,
  limit,
  searchText,
  isExport,
}: DataSetExportParams): {
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
          `/channel/${String(channel_id)}/data-set/export?type=${String(
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

export const getParams = (queryList: DataSetMutatedSearchParams[]): string => {
  let param = ``
  while (queryList.length != 0) {
    const temp = queryList.pop()
    if (temp && temp.operation) {
      const operationMap = DataSetFilterOperationMap[temp.operation]
      param += `&${temp?.type}[${
        operationMap ?? ''
      }]=${temp.searchText.toString()}`
    }
  }
  return param
}

export const useExportBulkDataSet = (): UseMutationResult<
  AxiosResponse<Blob, unknown>,
  unknown,
  { type: string; whichExport: DataSetBulkForm },
  unknown
> => {
  const { onError } = useErrorMessage()

  const queryClient = useQueryClient()
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const mutation = useMutation(
    ({ whichExport, type }: { whichExport: DataSetBulkForm; type: string }) =>
      axios.post<Blob>(
        `/channel/${String(channel_id)}/data-set/export?type=${type}`,
        whichExport,
        {
          responseType: 'blob',
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${queryKeyGetDataSet}-${channel_id}`)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useUploadDataSet = (): UseMutationResult<
  AxiosResponse<DataSetVerify[], unknown>,
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
      axios.post<DataSetVerify[]>(
        `/channel/${String(channel_id)}/data-set/upload?type=${type ?? ''}`,
        formFile
      ),
    {
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useVerifyDataSet = (): UseMutationResult<
  AxiosResponse<DataSetVerify[], unknown>,
  unknown,
  { dataSetUploadForm: DataSetVerify[] },
  unknown
> => {
  const { onError } = useErrorMessage()

  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const mutation = useMutation(
    ({ dataSetUploadForm }: { dataSetUploadForm: DataSetVerify[] }) =>
      axios.post<DataSetVerify[]>(
        `/channel/${String(channel_id)}/data-set/verify`,
        dataSetUploadForm.map(
          (uploadForm: DataSetVerify): DataSetVerifyFull => {
            return { ...uploadForm, channel_id }
          }
        )
      ),
    {
      // onSuccess: (data) => {
      //   console.log('data', data)
      //   queryClient.invalidateQueries(`${queryKeyGetDataSet}-${channel_id}`)
      // },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}

export const useSubmitDataSet = (): UseMutationResult<
  AxiosResponse<DataSetVerify[], unknown>,
  unknown,
  { dataSetUploadForm: DataSetVerify[] },
  unknown
> => {
  const queryClient = useQueryClient()
  const { onError } = useErrorMessage()

  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const mutation = useMutation(
    ({ dataSetUploadForm }: { dataSetUploadForm: DataSetVerify[] }) =>
      axios.post<DataSetVerify[]>(
        `/channel/${String(channel_id)}/data-sets`,
        dataSetUploadForm.map(
          (uploadForm: DataSetVerify): DataSetVerifyFull => {
            return { ...uploadForm, channel_id }
          }
        )
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${queryKeyGetDataSet}-${channel_id}`)
      },
      onError: (error) => {
        onError(error)
      },
    }
  )
  return mutation
}
