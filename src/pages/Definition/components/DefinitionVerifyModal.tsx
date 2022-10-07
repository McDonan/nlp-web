import React, { useState } from 'react'

import styled from 'styled-components'
import { Form, Input, Modal, Select, Table, Spin, Tag, Alert } from 'antd'
import Button from 'antd-button-color'
import { DefinitionVerify, DefinitionForm } from '../../../types/definition'
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons'
import TextWithToolTip from '../../../components/TextWithToolTip'
import { useErrorMessage } from '../../../hooks/useErrorMessage'

const StyledAlert = styled(Alert)`
  text-align: center;
  margin-top: 20px;
`

type Props = {
  data: DefinitionVerify[] | undefined
  isLoading: boolean
  showModal: boolean
  onShowModal: (isOpen: boolean) => void
  onVerify: () => void
  onSubmit: () => void
  onLoadingEdit: (isLoading: boolean) => void
  onSaveEdit: (data: DefinitionForm | undefined, id?: string) => void
  onSetRecord: (record: DefinitionForm) => void
  onSetRecordIndex: (index: number | undefined) => void
  onDelete: () => void
  onAddRow: () => void
}
const DefinitionVerifyModal = ({
  data,
  isLoading,
  showModal,
  onShowModal,
  onVerify,
  onSubmit,
  onLoadingEdit,
  onSaveEdit,
  onSetRecord,
  onSetRecordIndex,
  onDelete,
  onAddRow,
}: Props) => {
  const initialValues = { ...data }

  const [editingRow, setEditingRow] = useState<DefinitionForm>()
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const { errMsg, clearErrMsg } = useErrorMessage()

  const allowSubmit =
    data?.every((data) => data.accepted === true) && data.length
  const allowVerify =
    Array.isArray(data) && data.length && !isEditing && !allowSubmit
  const [form] = Form.useForm()

  const handleEdit = () => {
    onLoadingEdit(true)
    setEditingRow(undefined)

    form
      .validateFields()
      .then((values: DefinitionForm) => {
        onSaveEdit(values)
        onLoadingEdit(false)
        setIsEditing(false)
      })
      .catch(() => {
        onLoadingEdit(false)
        setIsEditing(false)
      })
  }

  const columns = [
    {
      title: 'Name',
      key: 'name',
      width: '10%',
      render: (item: DefinitionVerify) => {
        if (editingRow === item) {
          return (
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Definition name is required.',
                  whitespace: true,
                },
              ]}
            >
              <Input value={editingRow.name ? editingRow.name : '-'} />
            </Form.Item>
          )
        } else return <TextWithToolTip text={item?.name} color="black" />
      },
      sorter: (a: DefinitionVerify, b: DefinitionVerify) =>
        a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string, item: DefinitionVerify) => {
        if (editingRow === item) {
          return (
            <Form.Item name="description">
              <Input />
            </Form.Item>
          )
        } else return <TextWithToolTip text={description ? description : '-'} />
      },
      width: '10%',
      sorter: (a: DefinitionVerify, b: DefinitionVerify) => {
        if (!a.description) {
          a.description = "-"
        }
        if (!b.description) {
          b.description = "-"
        }
        return a.description.localeCompare(b.description)
      }
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[], item: DefinitionVerify) => {
        if (editingRow === item) {
          return (
            <Form.Item name="tags">
              <Select
                placeholder="Tags separate by comma(,) or space( )"
                mode="tags"
                tokenSeparators={[',', ' ', '\n']}
              />
            </Form.Item>
          )
        } else return tags ? tags.map((tag) => <Tag key={tag}>{tag}</Tag>) : '-'
      },
      width: '10%',
    },
    {
      title: 'Rules',
      dataIndex: 'rules',
      key: 'rules',
      render: (rules: string[], item: DefinitionVerify) => {
        if (editingRow === item) {
          return (
            <Form.Item name="rules">
              <Select
                placeholder="rules separate by comma(,) or space( )"
                mode="tags"
                tokenSeparators={[',', ' ', '\n']}
              />
            </Form.Item>
          )
        } else
          return rules ? rules.map((rule) => <Tag key={rule}>{rule}</Tag>) : '-'
      },
      width: '2.5%',
    },
    {
      title: 'RegExes',
      dataIndex: 'reg_exes',
      key: 'reg_exes',
      render: (reg_exes: string[], item: DefinitionVerify) => {
        if (editingRow === item) {
          return (
            <Form.Item name="reg_exes">
              <Select
                placeholder="regExes separate by comma(,) or space( )"
                mode="tags"
                tokenSeparators={[',', ' ', '\n']}
              />
            </Form.Item>
          )
        } else
          return reg_exes
            ? reg_exes.map((regEx) => <Tag key={regEx}>{regEx}</Tag>)
            : '-'
      },
      width: '2.5%',
    },
    {
      title: 'Status',
      dataIndex: 'accepted',
      key: 'status',
      render: (accepted: boolean, item: DefinitionVerify) => (
        <Tag
          color={accepted === undefined ? 'blue' : accepted ? 'green' : 'red'}
        >
          {accepted === undefined
            ? 'pending'
            : accepted
            ? 'accepted'
            : item.error_code}
        </Tag>
      ),
      width: '5%',
      sorter: (a: DefinitionVerify, b: DefinitionVerify) => {
        if (a.accepted) {
          a.error_code = "A"
        }
        return a?.error_code && b?.error_code ? a?.error_code.localeCompare(b?.error_code) : 1
      }
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (item: DefinitionForm) => {
        if (editingRow === item) {
          return (
            <Button
              type="success"
              onClick={(e) => {
                e.stopPropagation()
                handleEdit()
              }}
              icon={<SaveOutlined />}
            />
          )
        } else
          return (
            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation()
                setEditingRow(item)
                onSetRecordIndex(data?.indexOf(item))
                setIsEditing(true)

                form.setFieldsValue({
                  name: item.name,
                  description: item.description,
                  tags: item.tags,
                  rules: item.rules,
                  reg_exes: item.reg_exes,
                })
              }}
              icon={<EditOutlined />}
            />
          )
      },
      width: '2.5%',
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (item: DefinitionForm) => (
        <Button
          type="danger"
          onClick={(e) => {
            e.stopPropagation()
            onSetRecordIndex(data?.indexOf(item))
            onSetRecord(item)
            onDelete()
          }}
          icon={<DeleteOutlined />}
        />
      ),
      width: '2.5%',
    },
  ]

  return (
    <Modal
      title={'Verify Imported Definition'}
      width="80%"
      zIndex={999}
      visible={showModal}
      onCancel={() => onShowModal(false)}
      footer={[
        <Button
          key="verify"
          type="primary"
          onClick={onVerify}
          disabled={!allowVerify}
        >
          Verify
        </Button>,
        <Button
          key="submit"
          type="success"
          disabled={!allowSubmit}
          onClick={onSubmit}
        >
          Submit
        </Button>,
      ]}
    >
      <Button key="verify" type="info" size="small" onClick={onAddRow}>
        Add Row
      </Button>

      <Spin spinning={isLoading}>
        <Form form={form} initialValues={initialValues}>
          <Table
            size="small"
            dataSource={data ? [...data] : []}
            columns={columns}
            scroll={{ y: 'calc(75vh - 4rem)' }}
          />
        </Form>
        {errMsg && (
          <StyledAlert
            message={errMsg}
            type="error"
            showIcon
            closable
            onClose={clearErrMsg}
          />
        )}
      </Spin>
    </Modal>
  )
}

export default DefinitionVerifyModal
