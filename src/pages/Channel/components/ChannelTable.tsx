import React, { useMemo } from 'react'
import { Empty, Table, Switch } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { Channel, ChannelSort, ChannelsResponse } from '../../../types/channel'
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from '../../../configs/constants'
import { SorterResult } from 'antd/lib/table/interface'

type Props = {
  data: ChannelsResponse | undefined
  canEdit: boolean
  onEdit: (record: Channel) => void
  canSetStatus: boolean
  onSetStatus: (record: Channel) => void
  onChangePage: (page: number) => void
  onChangePageSize: (pageSize: number) => void
  onChangeSort: (sort: ChannelSort) => void
  pageNumber: number
}

const ChannelTable = ({
  data,
  canEdit,
  onEdit,
  canSetStatus,
  onSetStatus,
  onChangePage,
  onChangePageSize,
  onChangeSort,
  pageNumber,
}: Props) => {
  const items = useMemo(() => {
    return data?.items?.map((item: Channel): Channel => {
      return {
        ...item,
      }
    })
  }, [data])

  const columns = [
    {
      title: 'Channel name',
      key: 'name',
      width: '90%',
      dataIndex: 'name',
      sorter: (a: Channel, b: Channel) => a.name.localeCompare(b.name),
    },
    {
      title: 'Status',
      key: 'status',
      render: (item: Channel) => (
        <Switch
          defaultChecked={item?.active}
          checked={item?.active}
          onClick={(c, e) => {
            e.stopPropagation()
            onSetStatus(item)
          }}
        />
      ),
      width: '10%',
    },
  ]
  const columnsNoEdit = [
    {
      title: 'Channel name',
      key: 'name',
      width: '90%',
      dataIndex: 'name',
      sorter: (a: Channel, b: Channel) => a.name.localeCompare(b.name),
    },
    {
      title: 'Status',
      key: 'status',
      render: (item: Channel) => (
        <CheckCircleTwoTone
          twoToneColor={item.active ? '#52c41a' : '#dddddd'}
        />
      ),
      width: '10%',
    },
  ]
  return (
    <Table
      size="small"
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      dataSource={items ?? []}
      columns={canSetStatus ? columns : columnsNoEdit}
      scroll={{ y: 'calc(75vh - 4rem)' }}
      pagination={{
        current: pageNumber + 1,
        showSizeChanger: true,
        showTotal: (totalNumber) => `Total ${totalNumber} items`,
        defaultPageSize: DEFAULT_PAGE_SIZE,
        pageSizeOptions: PAGE_SIZE_OPTIONS,
        total: data?.meta_data.total,
        onChange: (page, pageSize) => {
          onChangePage(page - 1)
          onChangePageSize(pageSize)
        },
      }}
      onRow={(record) => {
        return {
          onClick: () => {
            if (canEdit) {
              onEdit(record)
            }
          },
        }
      }}
      onChange={(_pagination, _filter, sort) => {
        if (pageNumber === (_pagination.current ?? 1) - 1) {
          onChangePage(0)
        }
        const sortCast = sort as SorterResult<Channel>
        onChangeSort({
          sortKey: String(sortCast.columnKey),
          sortOrder: sortCast.order ?? undefined,
        })
      }}
    />
  )
}

export default ChannelTable
