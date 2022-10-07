import React, { useMemo } from 'react'
import { Table } from 'antd'
import { Channel } from '../../../types/channel'
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from '../../../configs/constants'

type Props = {
  data: Channel[] | undefined
  onSelect: (record: Channel) => void
}

const isActive = (item: Channel) => {
  return item.active
}

const SelectChannelTable = ({ data, onSelect }: Props) => {
  const items = useMemo(() => {
    return data?.filter(isActive).map((item: Channel): Channel => {
      return {
        key: item?.id,
        ...item,
      }
    })
  }, [data])
  const columns = [
    {
      title: 'Channel name',
      key: 'name',
      width: '100%',
      dataIndex: 'name',
      sorter: (a: Channel, b: Channel) =>
        (a.name ?? '').localeCompare(b.name ?? ''),
    },
  ]

  return (
    <Table
      size="small"
      locale={{
        emptyText:
          'Please request channel access permission via ITSM or contact ITID administrator',
      }}
      dataSource={items ?? []}
      columns={columns}
      scroll={{ y: 'calc(75vh - 4rem)' }}
      pagination={{
        defaultPageSize: DEFAULT_PAGE_SIZE,
        pageSizeOptions: PAGE_SIZE_OPTIONS,
      }}
      onRow={(record) => {
        return {
          onClick: () => {
            onSelect(record)
            
          },
        }
      }}
    />
  )
}

export default SelectChannelTable
