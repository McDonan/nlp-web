import { useQuery } from 'react-query'
import { useAxios } from '../libs/axios'
import { useUser } from '../hooks/useUser'
import {
  SummaryDefinitionTag,
  SummaryDefinitionMember,
  SummaryDefinitionCount,
  SummaryDatasetCount,
} from '../types/summary'

export const useSummaryDefinitionTag = (): {
  data: SummaryDefinitionTag[] | undefined
  isLoading: boolean
  isRefetching: boolean
} => {
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['getSummaryDefinitionTag', channel_id],
    queryFn: () =>
      axios
        .get<SummaryDefinitionTag[]>(
          `/channel/${String(channel_id)}/definition/tag`
        )
        .then((response) => response.data)
  })
  return { data, isLoading, isRefetching }
}

export const useSummaryDefinitionMember = (): {
  data: SummaryDefinitionMember[] | undefined
  isLoading: boolean
  isRefetching: boolean
} => {
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['getSummaryDefinitionMember', channel_id],
    queryFn: () =>
      axios
        .get<SummaryDefinitionMember[]>(
          `/channel/${String(channel_id)}/definition/member`
        )
        .then((response) => response.data)
  })
  return { data, isLoading, isRefetching }
}

export const useSummaryDefinitionCount = (
  limit: number
): {
  data: SummaryDefinitionCount[] | undefined
  isLoading: boolean
  isRefetching: boolean
} => {
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['getSummaryDefinitionCount', channel_id, limit],
    queryFn: () =>
      axios
        .get<SummaryDefinitionCount[]>(
          `/channel/${String(channel_id)}/definition/summary?limit=${limit}`
        )
        .then((response) => response.data)
  })
  return { data, isLoading, isRefetching }
}

export const useSummaryDatasetCount = (
  limit: number
): {
  data: SummaryDatasetCount[] | undefined
  isLoading: boolean
  isRefetching: boolean
} => {
  const axios = useAxios()
  const { channel } = useUser()
  const channel_id = channel.id ? channel.id : '' //temp data
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['getSummaryDatasetCount', channel_id, limit],
    queryFn: () =>
      axios
        .get<SummaryDatasetCount[]>(
          `/channel/${String(channel_id)}/data-set/summary?limit=${limit}`
        )
        .then((response) => response.data)
  })
  return { data, isLoading, isRefetching }
}
