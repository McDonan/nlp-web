import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Modal, Row, Space, Tag } from 'antd'
import Button from 'antd-button-color'
import { PlusOutlined } from '@ant-design/icons'
import { KnowledgeForm, Knowledge } from '../../../types/knowledge'
import KnowledgeMembersTable from './KnowledgeMembersTable'
import CloseModalButton from '../../../components/CloseModalButton'
import { useErrorMessage } from '../../../hooks/useErrorMessage'

import {
  StyledAlert,
  StyledColContainer,
} from '../../../components/StyledComponents'

type Props = {
  data?: Knowledge | undefined
  showModal: boolean
  modalLoading: boolean
  onSubmit: (data: KnowledgeForm | undefined, id?: string) => void
  onCloseModal: () => void
  onLoadingModal: (isLoading: boolean) => void
}

const KnowledgeModal = ({
  data,
  showModal,
  modalLoading,
  onSubmit,
  onCloseModal,
  onLoadingModal,
}: Props) => {
  const { errMsg, onError, clearErrMsg } = useErrorMessage()
  const [haveEdit, setHaveEdit] = useState<boolean>(false)
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [form] = Form.useForm()
  const isEdit = Boolean(data?.id ?? false)
  const initialValues = isEdit ? { ...data } : {}
  const [values, setValues] = useState(initialValues?.members || [])

  const showInput = () => {
    setInputVisible(true)
  }

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value)
  }

  const handleClose = (removedTag: string) => {
    const newTags = values?.filter((tag) => tag !== removedTag)
    setValues(newTags)
    form.setFieldsValue({
      members: newTags,
    })
  }

  const handleInputConfirm = () => {
    if (inputValue) {
      let valuesArr = [] as string[]
      let result = [] as string[]
      const trimmedInputValue = inputValue?.replace(/(^,)|(,$)/g, '')
      const separator = trimmedInputValue?.indexOf(',') !== -1 ? ',' : null
      if (separator) {
        valuesArr = trimmedInputValue
          ?.split(separator)
          ?.map((item) => {
            return item?.trim()
          })
          .filter((item) => {
            return item !== ''
          })
        const combineOldNewValues = [...values, ...valuesArr]
        const findDuplicate = combineOldNewValues?.filter(
          (item: string, index: number) =>
            combineOldNewValues?.indexOf(item) != index
        )
        if (findDuplicate?.length > 0) {
          const uniqueDuplicate = [...new Set(findDuplicate)]
          let isOrAre = 'is'
          if (uniqueDuplicate?.length > 1) isOrAre = 'are'
          onError(`${uniqueDuplicate?.join(',')} ${isOrAre} duplicated`)
        }
        result = [...new Set(combineOldNewValues)]
        setValues(result)
      } else {
        if (values?.indexOf(trimmedInputValue) !== -1) {
          onError(`${trimmedInputValue} is duplicated`)
        }
        result = [...new Set([...values, trimmedInputValue])]
        setValues(result)
      }
      form.setFieldsValue({
        members: result,
      })
    }
    setInputVisible(false)
    setInputValue('')
  }

  const handleCreateOrUpdateKnowledge = () => {
    onLoadingModal(true)
    form
      .validateFields()
      .then((values: KnowledgeForm) => {
        onSubmit(values, data?.id)
      })
      .catch(() => {
        onLoadingModal(false)
      })
  }

  useEffect(() => {
    form.resetFields()
  }, [])

  return (
    <Modal
      title={`${isEdit ? 'Update' : 'Create'} Knowledge`}
      width={isEdit ? '75%' : '50%'}
      maskClosable={false}
      closable={false}
      footer={null}
      visible={showModal}
      confirmLoading={modalLoading}
      getContainer={false}
    >
      <Row>
        <Col span={isEdit ? 12 : 24}>
          <Form
            form={form}
            onFinish={handleCreateOrUpdateKnowledge}
            onFieldsChange={() => {
              setHaveEdit(true)
            }}
            name="knowledge-form"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={initialValues}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Knowledge name is required.',
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Knowledge name" />
            </Form.Item>

            <Form.Item label="Members" name="members">
              {values?.map((tag: string) => (
                <Tag
                  className="members-tag"
                  key={tag}
                  closable={true}
                  onClose={() => handleClose(tag)}
                >
                  {tag}
                </Tag>
              ))}
              {inputVisible && (
                <Input
                  type="text"
                  size="small"
                  className="tag-input"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag className="site-tag-plus" onClick={showInput}>
                  <PlusOutlined /> New Member
                </Tag>
              )}
            </Form.Item>
          </Form>
        </Col>
        {isEdit && (
          <Col span={12}>
            <KnowledgeMembersTable id={data ? data.id : ''} />
          </Col>
        )}
      </Row>
      <Row justify="center">
        <StyledColContainer>
          <Space size="middle">
            <Button
              type={isEdit ? 'primary' : 'success'}
              onClick={() => form.submit()}
              loading={modalLoading}
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
            <CloseModalButton
              onCloseModal={onCloseModal}
              disable={modalLoading}
              haveEdit={haveEdit}
            />
          </Space>
        </StyledColContainer>
      </Row>
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

export default KnowledgeModal
