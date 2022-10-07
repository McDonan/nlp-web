import React, { useMemo, useEffect, useState } from 'react'
import { Empty, Table, Tag } from 'antd'
import Button from 'antd-button-color'
import { DeleteOutlined } from '@ant-design/icons'
import {
  KnowledgeResponse,
  Knowledge,
  KnowledgeSort,
} from '../../../types/knowledge'
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from '../../../configs/constants'
import { SorterResult } from 'antd/lib/table/interface'

type Props = {
  data: KnowledgeResponse | undefined
  canEdit: boolean
  onEdit: (record: Knowledge) => void
  canDelete: boolean
  onDelete: (record: Knowledge) => void
  onChangePage: (page: number) => void
  onChangePageSize: (pageSize: number) => void
  onChangeSort: (sort: KnowledgeSort) => void
  pageNumber: number
}

const KnowledgeTable = ({
  data,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  onChangePage,
  onChangePageSize,
  onChangeSort,
  pageNumber,
}: Props): JSX.Element => {
  const [totalNumber, setTotalNumber] = useState<number>(0)

  const items = useMemo(() => {
    return data?.items?.map((item: Knowledge): Knowledge => {
      return {
        key: item?.id,
        ...item,
      }
    })
  }, [data])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      sorter: (a: Knowledge, b: Knowledge) => a.name.localeCompare(b.name),
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members',
      render: (members: string[]) => (
        <>
          {members
            ? members.map((member: string) => (
                <Tag color="default" key={member}>
                  {member}
                </Tag>
              ))
            : ''}
        </>
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      hidden: true,
      render: (item: Knowledge) => (
        <Button
          type="danger"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(item)
          }}
          icon={<DeleteOutlined />}
          disabled={!canDelete}
        />
      ),
      width: '5%',
    },
  ]

  useEffect(() => {
    setTotalNumber(data?.meta_data.total ?? 0)
  }, [])

  return (
    <Table
      size="small"
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      columns={canDelete ? columns : columns.filter((col) => !col.hidden)}
      dataSource={items ?? []}
      scroll={{ y: 'calc(75vh - 4rem)' }}
      pagination={{
        current: pageNumber + 1,
        showSizeChanger: true,
        showTotal: (totalNumber) => `Total ${totalNumber} items`,
        total: data?.meta_data.total,
        defaultCurrent: 1,
        defaultPageSize: DEFAULT_PAGE_SIZE,
        pageSizeOptions: PAGE_SIZE_OPTIONS,
        onChange: (page, pageSize) => {
          onChangePage(page - 1)
          onChangePageSize(pageSize)
        },
      }}
      onRow={(record) => {
        return {
          onClick: () => {
            if (canEdit) onEdit(record)
          },
        }
      }}
      onChange={(_pagination, _filter, sort) => {
        if (pageNumber === (_pagination.current ?? 1) - 1) {
          onChangePage(0)
        }
        const sortCast = sort as SorterResult<Knowledge>
        onChangeSort({
          sortKey: String(sortCast.columnKey),
          sortOrder: sortCast.order ?? undefined,
        })
      }}
    />
  )
}

export default KnowledgeTable
