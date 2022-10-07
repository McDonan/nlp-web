import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Col, Form, Input, Modal, Row, Select, Space, Alert } from 'antd'
import Button from 'antd-button-color'
import { Definition, DefinitionForm } from '../../../types/definition'
import DataSetByDefinitionIDTable from './DataSetByDefinitionIDTable'
import { useErrorMessage } from '../../../hooks/useErrorMessage'
import CloseModalButton from '../../../components/CloseModalButton'

const { TextArea } = Input

type Props = {
  data?: Definition | undefined
  showModal: boolean
  modalLoading: boolean
  onSubmit: (data: DefinitionForm | undefined, id?: string) => void
  onCloseModal: () => void
  onLoadingModal: (isLoading: boolean) => void
}

const StyledColContainer = styled(Col)`
  text-align: center;
`
const StyledAlert = styled(Alert)`
  text-align: center;
  margin-top: 20px;
`

const DefinitionFormModal = ({
  data,
  showModal,
  modalLoading,
  onSubmit,
  onCloseModal,
  onLoadingModal,
}: Props) => {
  const { errMsg, clearErrMsg } = useErrorMessage()
  //state check form have edited or not
  const [haveEdit, setHaveEdit] = useState<boolean>(false)

  const [form] = Form.useForm()
  const isEdit = Boolean(data?.id ?? false)
  const handleCreateOrUpdateDefinition = () => {
    onLoadingModal(true)
    form
      .validateFields()
      .then((values: DefinitionForm) => {
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
      title={`${isEdit ? 'Update' : 'Create'} Definition`}
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
            onFinish={handleCreateOrUpdateDefinition}
            onFieldsChange={() => {
              setHaveEdit(true)
            }}
            name="definition-form"
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
                  message: 'Definition name is required.',
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Definition name" />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <TextArea placeholder="Definition description" rows={4} />
            </Form.Item>
            <Form.Item label="Tags" name="tags">
              <Select
                placeholder="Tags separate by comma(,) or space( )"
                mode="tags"
                tokenSeparators={[',', ' ', '\n']}
              />
            </Form.Item>
            <Form.Item label="Rules" name="rules">
              <Select
                placeholder="Press Enter to separate rules"
                mode="tags"
                tokenSeparators={['\n']}
              />
            </Form.Item>
            <Form.Item label="RegExes" name="reg_exes">
              <Select
                placeholder="Press Enter to separate regular expressions"
                mode="tags"
                tokenSeparators={['\n']}
              />
            </Form.Item>
          </Form>
        </Col>
        {isEdit && (
          <Col span={12}>
            <DataSetByDefinitionIDTable definitionID={data?.id} />
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

export default DefinitionFormModal
