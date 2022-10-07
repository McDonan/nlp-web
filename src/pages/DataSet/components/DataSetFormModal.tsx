import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Col, Form, Input, Modal, Row, Space, Alert } from 'antd'
import Button from 'antd-button-color'
import { DataSet, DataSetForm } from '../../../types/dataset'
import { useErrorMessage } from '../../../hooks/useErrorMessage'
import DefinitionSelectField from './DefinitionSelectField'
import CloseModalButton from '../../../components/CloseModalButton'
import { DefinitionOnly } from '../../../types/definition'

type Props = {
  data?: DataSet | undefined
  showModal: boolean
  modalLoading: boolean
  onSubmit: (data: DataSetForm | undefined, id?: string) => void
  onCloseModal: () => void
  onLoadingModal: (isLoading: boolean) => void
  definitionList: DefinitionOnly[] | undefined
  definitionLoading: boolean
}

const StyledColContainer = styled(Col)`
  text-align: center;
`

const StyledAlert = styled(Alert)`
  text-align: center;
  margin-top: 20px;
`

const DataSetFormModal = ({
  data,
  showModal,
  modalLoading,
  onSubmit,
  onCloseModal,
  onLoadingModal,
  definitionList,
  definitionLoading,
}: Props) => {
  const { errMsg, clearErrMsg } = useErrorMessage()
  const isEdit = Boolean(data?.id ?? false)
  const [form] = Form.useForm()

  const [, setSelectedDefinitionField] = useState<string>('')

  //state check form have edited or not
  const [haveEdit, setHaveEdit] = useState<boolean>(false)

  const handleChange = (value: string) => {
    setSelectedDefinitionField(value)
  }

  const handleCreateOrUpdateDefinition = () => {
    onLoadingModal(true)
    form
      .validateFields()
      .then((values: DataSetForm) => {
        onSubmit(values, data?.id)
      })
      .catch(() => {
        onLoadingModal(false)
      })
  }

  const initialValues = isEdit ? { ...data } : {}

  useEffect(() => {
    form.resetFields()
  }, [])
  return (
    <Modal
      title={`${isEdit ? 'Update' : 'Create'} Dataset`}
      width={'50%'}
      maskClosable={false}
      closable={false}
      footer={null}
      visible={showModal}
      confirmLoading={modalLoading}
      getContainer={false}
    >
      <Row>
        <Col span={24}>
          <Form
            form={form}
            onFinish={handleCreateOrUpdateDefinition}
            onFieldsChange={() => {
              setHaveEdit(true)
            }}
            name="dataset-form"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={initialValues}
          >
            <Form.Item
              label="Text"
              name="text"
              rules={[
                {
                  required: true,
                  message: 'Text is required.',
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Dataset text" />
            </Form.Item>
            <Form.Item
              label="Definition"
              name="definition_id"
              rules={[
                {
                  required: true,
                  message: 'Definition is required.',
                  whitespace: true,
                },
              ]}
            >
              <DefinitionSelectField
                value={isEdit ? initialValues?.definition : ''}
                onChange={handleChange}
                definitionList={definitionList}
                isLoading={definitionLoading}
              />
            </Form.Item>
          </Form>
        </Col>
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

export default DataSetFormModal
