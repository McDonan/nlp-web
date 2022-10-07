import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Col, Form, Input, Modal, Row, Space, Alert } from 'antd'
import Button from 'antd-button-color'
import { Channel, ChannelForm } from '../../../types/channel'
import CloseModalButton from '../../../components/CloseModalButton'
import { useErrorMessage } from '../../../hooks/useErrorMessage'

type Props = {
  data?: Channel | undefined
  showModal: boolean
  modalLoading: boolean
  onSubmit: (data: ChannelForm | undefined, id?: string) => void
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

const ChannelFormModal = ({
  data,
  showModal,
  modalLoading,
  onSubmit,
  onCloseModal,
  onLoadingModal,
}: Props) => {
  //state check form have edited or not
  const [haveEdit, setHaveEdit] = useState<boolean>(false)

  const { errMsg, clearErrMsg } = useErrorMessage()

  const handleCloseAlert = () => {
    clearErrMsg()
  }

  const [form] = Form.useForm()
  const isEdit = Boolean(data?.id ?? false)
  const handleCreateOrUpdateChannel = () => {
    onLoadingModal(true)
    form
      .validateFields()
      .then((values: ChannelForm) => {
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
      title={`${isEdit ? 'Update' : 'Create'} Channel`}
      width={'50%'}
      maskClosable={false}
      closable={false}
      footer={null}
      visible={showModal}
      confirmLoading={modalLoading}
      getContainer={false}
    >
      <Row>
        <Col span={isEdit ? 24 : 24}>
          <Form
            form={form}
            onFinish={handleCreateOrUpdateChannel}
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
                  message: 'Channel name is required.',
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Channel name" />
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
          onClose={handleCloseAlert}
        />
      )}
    </Modal>
  )
}

export default ChannelFormModal
