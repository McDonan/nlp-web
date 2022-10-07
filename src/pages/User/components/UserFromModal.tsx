import React, { useState } from 'react'
import { Form, Select, Input, Modal, Row, Space, Alert, Spin, Tag } from 'antd'
import Button from 'antd-button-color'
import { useErrorMessage } from '../../../hooks/useErrorMessage'
import { User, UserRole, UserForm } from '../../../types/users'
import CloseModalButton from '../../../components/CloseModalButton'
import styled from 'styled-components'
import { useGetChannel } from '../../../api/channel'
import { PAGES, LIMIT } from '../../../configs/constants'
import { DefaultOptionType } from 'antd/lib/select'
import { CustomTagProps } from 'rc-select/lib/BaseSelect'
import config from '../../../configs/configs'

const { Option } = Select

type Props = {
  data?: User | undefined
  showModal: boolean
  userRolesData: UserRole[] | undefined
  isModalLoading: boolean
  onCreateUser: (userData: UserForm | undefined) => void
  onUpdateUser: (userData: UserForm | undefined, id: string) => void
  onCloseModal: () => void
  onLoadingModal: (isLoading: boolean) => void
}

const StyledAlert = styled(Alert)`
  text-align: center;
  margin-top: 20px;
`

const UserFromModal = ({
  data,
  showModal,
  userRolesData,
  isModalLoading,
  onCreateUser,
  onUpdateUser,
  onCloseModal,
  onLoadingModal,
}: Props) => {
  const [form] = Form.useForm()
  const { errMsg, clearErrMsg } = useErrorMessage()
  const isEdit = Boolean(data?.id ?? false)

  const dataEmail: string[] = data?.email
    ? data.email.split('@', 2)
    : ['', 'kbtg.tech']

  const initialData = isEdit
    ? {
        employee_id: data?.employee_id,
        email: dataEmail[0] ?? '',
        email_host: `@${dataEmail[1] ?? 'kbtg.tech'}`,
        name: data?.name,
        role: data?.role,
        channel_ids: data?.channels.map((channel) => {
          return channel.id
        }),
      }
    : {
        email_host: '@kbtg.tech',
      }

  //got channel
  const {
    data: channelData,
    isLoading: isChannelLoading,
    isRefetching: isChannelRefetching,
  } = useGetChannel({
    page: PAGES,
    limit: LIMIT,
    searchText: '',
  })
  // mapping
  const childrenChannel: object[] = []
  const [selectedChannel, setSelectedChannel] = useState<Array<string>>(
    initialData.channel_ids ?? []
  )
  channelData?.items.map((channl) => {
    if (channl.active) {
      childrenChannel.push(
        <Option value={channl.id} key={channl.id}>
          {channl.name}
        </Option>
      )
    } else if (initialData.channel_ids?.includes(channl.id)) {
      childrenChannel.push(
        <>
          {selectedChannel.includes(channl.id) && (
            <Option value={channl.id} key={channl.id} disabled>
              {channl.name}
            </Option>
          )}
        </>
      )
    }
  })
  const tagRender = ({ label, onClose, disabled }: CustomTagProps) => {
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag
        color={disabled ? 'grey' : 'green'}
        onMouseDown={onPreventMouseDown}
        closable={true}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    )
  }

  //Permission Role Check
  const mapRoleToRolePermission: {
    [key: string]: boolean
  } =
    userRolesData?.reduce((prev, role) => {
      return {
        ...prev,
        [role.role]: !role.permissions.bind_channels,
      }
    }, {}) || {}

  //State
  const [isNeedChannel, setIsNeedChannel] = useState<boolean>(
    isEdit ? !mapRoleToRolePermission[data?.role ?? ''] ?? false : false
  )
  //state check form have edited or not
  const [haveEdit, setHaveEdit] = useState<boolean>(false)

  const roleOption = []
  for (const rol of userRolesData ?? []) {
    roleOption.push(
      <Option key={rol.name} value={rol.role}>
        {rol.name}
      </Option>
    )
  }

  const selectAfterEmail = (
    <Select
      className="select-after-email"
      style={{ width: 200, textAlign: 'left' }}
    >
      <Option key="kbtg.tech" value="@kbtg.tech">
        @kbtg.tech
      </Option>
      <Option key="kasikornbank.com" value="@kasikornbank.com">
        @kasikornbank.com
      </Option>
      {config.REACT_APP_ENV !== 'prod' && (
        <Option key="kasikornthaibank.in.th" value="@kasikornthaibank.in.th">
          @kasikornthaibank.in.th
        </Option>
      )}
    </Select>
  )
  const handleCreateOrUpdateUser = (values: UserForm) => {
    if (values.email && values.email_host && values.employee_id) {
      onLoadingModal(true)
      const sendUserData: UserForm = {
        email: `${values.email}${values.email_host}`,
        role: values.role ?? '',
        employee_id: values.employee_id,
        name: values.name,
        channel_ids: values.channel_ids ?? [],
      }
      if (!isEdit) {
        onCreateUser(sendUserData)
      } else {
        onUpdateUser(sendUserData, data?.id ?? '')
      }
    }
  }
  const onRoleChange = (value: string) => {
    setIsNeedChannel(!mapRoleToRolePermission[value] ?? false)
  }

  return (
    <Modal
      title={`${isEdit ? 'Update' : 'Create'} User`}
      visible={showModal}
      closable={false}
      footer={null}
      width={'50%'}
    >
      <Spin spinning={isModalLoading}>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          form={form}
          name="user-manage-form"
          onFinish={handleCreateOrUpdateUser}
          onFieldsChange={() => {
            setHaveEdit(true)
          }}
          initialValues={initialData}
        >
          <Form.Item
            name="employee_id"
            label="Employee ID"
            rules={[
              { required: true, message: 'Employee ID is required!' },
              {
                pattern: new RegExp(/^[a-zA-Z]+[0-9]+$/),
                message:
                  'Must begin with a letter followed by a number, example K012345.',
              },
            ]}
          >
            <Input placeholder="Employee ID" disabled={isEdit} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: 'Email is required',
              },
              {
                pattern: new RegExp(/^[a-z0-9_.+-]+$/),
                message: 'Please enter a valid email',
              },
            ]}
          >
            <Input
              addonAfter={
                <Form.Item name="email_host" noStyle>
                  {selectAfterEmail}
                </Form.Item>
              }
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'Name is required!' },
              {
                pattern: new RegExp(/^[a-zA-Zก-๏0-9 ]*$/),
                message: 'Please enter a valid name',
              },
            ]}
          >
            <Input placeholder="Firstname-Surname" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Role is required!' }]}
          >
            <Select placeholder="Select user role" onChange={onRoleChange}>
              {roleOption}
            </Select>
          </Form.Item>
          {isNeedChannel && (
            <Form.Item name="channel_ids" label="Channel">
              <Select
                mode="multiple"
                allowClear
                tagRender={tagRender}
                style={{ width: '100%' }}
                placeholder="Select user Channel"
                loading={isChannelLoading || isChannelRefetching}
                filterOption={(
                  input: string,
                  option: DefaultOptionType | undefined
                ) => {
                  return option?.children
                    ? option?.children
                        ?.toString()
                        ?.toLowerCase()
                        ?.indexOf(input ? input?.toLowerCase() : '') >= 0
                    : false
                }}
                optionFilterProp="children"
                onChange={(value: string[]) => {
                  setSelectedChannel(value)
                }}
              >
                {childrenChannel}
              </Select>
            </Form.Item>
          )}

          <Row justify="center">
            <Space size="middle">
              <Button type={isEdit ? 'primary' : 'success'} htmlType="submit">
                {isEdit ? 'Edit' : 'Create'}
              </Button>
              <CloseModalButton
                onCloseModal={onCloseModal}
                disable={isModalLoading}
                haveEdit={haveEdit}
              />
            </Space>
          </Row>
        </Form>
      </Spin>
      {errMsg && (
        <StyledAlert
          message={errMsg}
          type="error"
          showIcon
          closable
          onClose={clearErrMsg}
        />
      )}
    </Modal>
  )
}
export default UserFromModal
