import React, { useState } from 'react'

import styled from 'styled-components'
import { Form, Input, Modal, Table, Spin, Tag, Alert } from 'antd'
import Button from 'antd-button-color'
import { DataSetVerify, DataSetImportForm } from '../../../types/dataset'
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons'
import TextWithToolTip from '../../../components/TextWithToolTip'
import DefinitionSelectField from './DefinitionSelectField'
import { useErrorMessage } from '../../../hooks/useErrorMessage'
import { DefinitionOnly } from '../../../types/definition'

const StyledAlert = styled(Alert)`
  text-align: center;
  margin-top: 20px;
`

type Props = {
  data: DataSetVerify[] | undefined
  isLoading: boolean
  showModal: boolean
  onShowModal: (isOpen: boolean) => void
  onVerify: () => void
  onSubmit: () => void
  onLoadingEdit: (isLoading: boolean) => void
  onSaveEdit: (data: DataSetImportForm | undefined, id?: string) => void
  onSetRecord: (record: DataSetImportForm) => void
  onSetRecordIndex: (index: number | undefined) => void
  onDelete: () => void
  onAddRow: () => void
  definitionList: DefinitionOnly[] | undefined
  definitionLoading: boolean
}
const DataSetVerifyModal = ({
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
  definitionList,
  definitionLoading,
}: Props) => {
  const [, setSelectedDefinitionField] = useState<string>('')

  const handleChange = (value: string) => {
    setSelectedDefinitionField(value)
  }

  const initialValues = { ...data }

  const [editingRow, setEditingRow] = useState<DataSetImportForm>()
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const { errMsg, clearErrMsg } = useErrorMessage()

  const allowSubmit =
    data?.every((data) => data.accepted === true) && data.length !== 0
  const allowVerify = Array.isArray(data) && data.length !== 0 && !isEditing
  const [form] = Form.useForm()

  const handleEdit = () => {
    onLoadingEdit(true)
    setEditingRow(undefined)

    form
      .validateFields()
      .then((values: DataSetImportForm) => {
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
      title: 'Text',
      key: 'text',
      width: '10%',
      render: (item: DataSetVerify) => {
        if (editingRow === item) {
          return (
            <Form.Item
              name="text"
              rules={[
                {
                  required: true,
                  message: 'DataSet text is required.',
                  whitespace: true,
                },
              ]}
            >
              <Input value={editingRow.text ? editingRow.text : '-'} />
            </Form.Item>
          )
        } else return <TextWithToolTip text={item?.text} color="black" />
      },
      sorter: (a: DataSetVerify, b: DataSetVerify) => {
        if (!a.text) {
          a.text = "-"
        }
        if (!b.text) {
          b.text = "-"
        }
        return a.text.localeCompare(b.text)
      }
    },
    {
      title: 'Definition',
      dataIndex: 'definition',
      key: 'definition',
      render: (definition: string, item: DataSetVerify) => {
        if (editingRow === item) {
          return (
            <Form.Item
              name="definition"
              rules={[
                {
                  required: true,
                  message: 'Definition is required.',
                  whitespace: true,
                },
              ]}
            >
              <DefinitionSelectField
                isVerify
                onChange={handleChange}
                definitionList={definitionList}
                isLoading={definitionLoading}
              />
            </Form.Item>
          )
        } else return <TextWithToolTip text={definition ? definition : '-'} />
      },
      width: '10%',
      sorter: (a: DataSetVerify, b: DataSetVerify) => {
        if (!a.definition) {
          a.definition = "-"
        }
        if (!b.definition) {
          b.definition = "-"
        }
        return a.definition.localeCompare(b.definition)
      }
    },
    {
      title: 'Status',
      dataIndex: 'accepted',
      key: 'status',
      render: (accepted: boolean, item: DataSetVerify) => (
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
      sorter: (a: DataSetVerify, b: DataSetVerify) => {
        if (a.accepted) {
          a.error_code = "A"
        }
        return a?.error_code && b?.error_code ? a?.error_code.localeCompare(b?.error_code) : 1
      }
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (item: DataSetImportForm) => {
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
                  text: item.text,
                  definition: item.definition,
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
      render: (item: DataSetImportForm) => (
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
      title="Verify Imported DataSet"
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
          disabled={!allowSubmit || isLoading}
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

export default DataSetVerifyModal
