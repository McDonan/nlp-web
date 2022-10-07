import React, { useMemo } from 'react'
import dayjs from 'dayjs'
import { Empty, Table, Tag } from 'antd'
import Button from 'antd-button-color'
import { CheckCircleTwoTone, DeleteOutlined } from '@ant-design/icons'
import TextWithToolTip from '../../../components/TextWithToolTip'
import {
  Definition,
  DefinitionResponse,
  DefinitionSort,
} from '../../../types/definition'
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from '../../../configs/constants'
import { SorterResult } from 'antd/lib/table/interface'

type Props = {
  data: DefinitionResponse | undefined
  canEdit: boolean
  onEdit: (record: Definition) => void
  canDelete: boolean
  onDelete: (record: Definition) => void
  onChangePage: (page: number) => void
  onChangePageSize: (pageSize: number) => void
  onChangeSort: (sort: DefinitionSort) => void
  pageNumber: number
}

const DefinitionTable = ({
  data,
  canEdit,
  onEdit,
  canDelete,
  onDelete,
  onChangePage,
  onChangePageSize,
  onChangeSort,
  pageNumber,
}: Props) => {
  const items = useMemo(() => {
    return data?.items?.map((item: Definition): Definition => {
      return {
        key: item?.id,
        ...item,
      }
    })
  }, [data])

  const columns = [
    {
      title: 'Name',
      key: 'name',
      width: '10%',
      render: (item: Definition) => (
        <TextWithToolTip
          text={item?.name}
          color={
            item?.count <= 0 ? 'red' : item?.count < 10 ? '#bfbfbf' : 'black'
          }
        />
      ),
      sorter: (a: Definition, b: Definition) => a.name.localeCompare(b.name),
    },
    {
      title: 'Sample',
      dataIndex: 'count',
      key: 'count',
      render: (count: number) => (count ? count : 0),
      width: '5%',
      sorter: (a: Definition, b: Definition) => a.count - b.count,
    },
    {
      title: 'Modified date',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (updated_at: string) => dayjs(updated_at).format('DD/MM/YYYY'),
      width: '5%',
      sorter: (a: Definition, b: Definition) =>
        dayjs(a.updated_at).unix() - dayjs(b.updated_at).unix(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <TextWithToolTip text={description ? description : '-'} />
      ),
      width: '10%',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) =>
        tags ? tags.map((tag) => <Tag key={tag}>{tag}</Tag>) : '-',
      width: '10%',
    },
    {
      title: 'Rules',
      dataIndex: 'rules',
      key: 'rules',
      render: (rules: string[]) =>
        rules ? (
          <CheckCircleTwoTone
            twoToneColor={rules?.length === 0 ? '#dddddd' : '#52c41a'}
          />
        ) : (
          '-'
        ),
      width: '2.5%',
    },
    {
      title: 'RegExes',
      dataIndex: 'reg_exes',
      key: 'reg_exes',
      render: (regExes: string[]) =>
        regExes ? (
          <CheckCircleTwoTone
            twoToneColor={regExes?.length === 0 ? '#dddddd' : '#52c41a'}
          />
        ) : (
          '-'
        ),
      width: '2.75%',
    },
    {
      title: 'Delete',
      key: 'delete',
      hidden: true,
      render: (item: Definition) => (
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
      width: '2.75%',
    },
  ]
  return (
    <Table
      size="small"
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      dataSource={items ?? []}
      columns={canDelete ? columns : columns.filter((col) => !col.hidden)}
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
        const sortCast = sort as SorterResult<Definition>
        onChangeSort({
          sortKey: String(sortCast.columnKey),
          sortOrder: sortCast.order ?? undefined,
        })
      }}
    />
  )
}

export default DefinitionTable
