import React, { useMemo } from 'react'
import { Table, Empty, Tag, Switch } from 'antd'
import dayjs from 'dayjs'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { UsersResponse, User, UserRole, UserSort } from '../../../types/users'
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from '../../../configs/constants'
import { useUser } from '../../../hooks/useUser'
import { SorterResult } from 'antd/lib/table/interface'

type Props = {
  data: UsersResponse | undefined
  userRole: UserRole[] | undefined
  canEdit: boolean
  onEdit: (record: User) => void
  canSetStatus: boolean
  onSetStatus: (record: User, active: boolean) => void
  onChangePage: (page: number) => void
  onChangePageSize: (pageSize: number) => void
  onChangeSort: (sort: UserSort) => void
  pageNumber: number
}

const UserTable = ({
  data,
  userRole,
  canEdit,
  onEdit,
  canSetStatus,
  onSetStatus,
  onChangePage,
  onChangePageSize,
  onChangeSort,
  pageNumber,
}: Props) => {
  const { userData } = useUser()
  const mapRoleToRoleName: {
    [key: string]: string
  } =
    userRole?.reduce((prev, role) => {
      return { ...prev, [role.role]: role.name }
    }, {}) || {}

  const items = useMemo(() => {
    return data?.items?.map((item: User): User => {
      return {
        key: item?.id,
        ...item,
      }
    })
  }, [data])

  const columns = [
    {
      title: 'Username',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: User, b: User) => a.email.localeCompare(b.email),
    },
    {
      title: 'Employee ID',
      dataIndex: 'employee_id',
      key: 'employee_id',
      width: '7.5%',
      sorter: (a: User, b: User) => a.employee_id.localeCompare(b.employee_id),
    },
    {
      title: 'Fullname',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) =>
        role ? mapRoleToRoleName[role] ?? 'unknown role' : 'unknown role',
      width: '10%',
      sorter: (a: User, b: User) => a.role.localeCompare(b.role),
    },
    {
      title: 'Channel',
      key: 'channels',
      render: (item: User) => {
        if (item.permissions?.bind_all_channels) {
          return <Tag className="allChannel">All Channel</Tag>
        }
        const channels: object[] = []
        item.channels.map((channel) => {
          if (channel.active) {
            channels.push(<Tag className={channel.name}>{channel.name}</Tag>)
          }
        })
        if (channels.length !== 0) {
          return channels
        }
        return '-'
      },
    },
    {
      title: 'User Status',
      key: 'active',
      width: '5%',
      render: (item: User) => {
        if (canSetStatus && userData?.id !== item.id) {
          return (
            <Switch
              defaultChecked={item.active}
              checked={item.active}
              onChange={(c, e) => {
                e.stopPropagation()
                onSetStatus(item, c)
              }}
            />
          )
        }
        return (
          <CheckCircleTwoTone
            twoToneColor={item.active ? '#52c41a' : '#dddddd'}
          />
        )
      },
    },
    {
      title: 'Reason',
      key: 'reason',
      dataIndex: 'reason',
      render: (reason: string) => {
        if (reason === null) return '-'
        return reason
      },
    },
    {
      title: 'Last Log on',
      dataIndex: 'last_log_on',
      key: 'last_log_on',
      render: (lastLogOn: string | null) => {
        if (lastLogOn === null) return '-'
        const dateString = dayjs(lastLogOn).format('DD/MM/YYYY')
        return dateString
      },
      width: '8%',
      sorter: (a: User, b: User) => a.last_log_on.localeCompare(b.last_log_on),
    },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (createAt: string | null) => {
        if (createAt === null) return '-'
        const dateString = dayjs(createAt).format('DD/MM/YYYY')
        return dateString
      },
      width: '8%',
      sorter: (a: User, b: User) => a.created_at.localeCompare(b.created_at),
    },
  ]
  return (
    <Table
      size="small"
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      dataSource={items ?? []}
      columns={columns}
      scroll={{ y: 'calc(65vh - 4rem)' }}
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
            if (canEdit && record.id !== userData?.id) {
              onEdit(record)
            }
          },
        }
      }}
      onChange={(_pagination, _filter, sort) => {
        if (pageNumber === (_pagination.current ?? 1) - 1) {
          onChangePage(0)
        }
        const sortCast = sort as SorterResult<User>
        onChangeSort({
          sortKey: String(sortCast.columnKey),
          sortOrder: sortCast.order ?? undefined,
        })
      }}
    />
  )
}
export default UserTable
