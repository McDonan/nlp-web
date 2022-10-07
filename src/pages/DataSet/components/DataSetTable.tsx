import React, { useMemo, useState } from 'react'
import { Empty, Table } from 'antd'
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from '../../../configs/constants'
import Button from 'antd-button-color'
import { DeleteOutlined } from '@ant-design/icons'
import TextWithToolTip from '../../../components/TextWithToolTip'
import { Key, SorterResult } from 'antd/lib/table/interface'
import {
  DataSet,
  DataSetResponse,
  DataSetBulkForm,
  DataSetSort,
} from '../../../types/dataset'
type Props = {
  data: DataSetResponse | undefined
  canEdit: boolean
  onEdit: (record: DataSet) => void
  canDelete: boolean
  onDelete: (record: DataSet) => void
  isSelectMultiple: (isMultiple: boolean) => void
  setSelectedRecords: (recordsID: DataSetBulkForm) => void
  onChangePage: (page: number) => void
  onChangePageSize: (pageSize: number) => void
  onChangeSort: (sort: DataSetSort) => void
  pageNumber: number
}

const DataSetTable = ({
  data,
  canEdit,
  onEdit,
  canDelete,
  onDelete,
  isSelectMultiple,
  setSelectedRecords,
  onChangePage,
  onChangePageSize,
  onChangeSort,
  pageNumber,
}: Props) => {
  const [selectedRows, setSelectedRows] = useState<Array<DataSet>>([])
  const items = useMemo(() => {
    return data?.items?.map((item: DataSet): DataSet => {
      return {
        key: item?.id,
        ...item,
      }
    })
  }, [data])

  const handleSelectChange = (
    selectedRowKeys: Key[],
    selectedRows: DataSet[]
  ) => {
    setSelectedRows([...selectedRows])
    setSelectedRecords({ ids: selectedRows.map((record) => record.id) })

    if (selectedRows.length <= 1) {
      isSelectMultiple(false)
    } else {
      isSelectMultiple(true)
    }
  }

  const rowSelection = {
    selectedRows,
    onChange: handleSelectChange,
  }

  const columns = [
    {
      title: 'Text',
      key: 'text',
      render: (item: DataSet) => <TextWithToolTip text={item?.text} />,
      sorter: (a: DataSet, b: DataSet) => a.text.localeCompare(b.text),
    },
    {
      title: 'Definition',
      key: 'definition',
      render: (item: DataSet) => <TextWithToolTip text={item?.definition} />,
      sorter: (a: DataSet, b: DataSet) =>
        a.definition.localeCompare(b.definition),
    },
    {
      title: 'Delete',
      key: 'delete',
      hidden: true,
      render: (item: DataSet) => (
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
      rowSelection={rowSelection}
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
        const sortCast = sort as SorterResult<DataSet>
        onChangeSort({
          sortKey: String(sortCast.columnKey),
          sortOrder: sortCast.order ?? undefined,
        })
      }}
    />
  )
}

export default DataSetTable
