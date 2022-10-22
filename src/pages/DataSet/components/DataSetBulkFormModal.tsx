import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Col, Form, Modal, Row, Space, Alert } from 'antd'
import Button from 'antd-button-color'
import { DataSetBulkEditFormParams } from '../../../types/dataset'
import DefinitionSelectField from './DefinitionSelectField'
import { DefinitionOnly } from '../../../types/definition'
import CloseModalButton from '../../../components/CloseModalButton'
import { useErrorMessage } from '../../../hooks/useErrorMessage'

import {
  StyledAlert,
  StyledColContainer,
} from '../../../components/StyledComponents'

type Props = {
  showModal: boolean
  modalLoading: boolean
  onSubmit: (data: string) => void
  onCloseModal: () => void
  onLoadingModal: (isLoading: boolean) => void
  definitionList: DefinitionOnly[] | undefined
  definitionLoading: boolean
}

const DataSetBulkFormModal = ({
  showModal,
  modalLoading,
  onSubmit,
  onCloseModal,
  onLoadingModal,
  definitionList,
  definitionLoading,
}: Props) => {
  const { errMsg, clearErrMsg } = useErrorMessage()
  const [form] = Form.useForm()

  //state check form have edited or not
  const [haveEdit, setHaveEdit] = useState<boolean>(false)

  const [selectedDefinitionField, setSelectedDefinitionField] =
    useState<string>('')

  const handleChange = (value: string) => {
    setSelectedDefinitionField(value)
  }

  const handleBulkUpdate = () => {
    onLoadingModal(true)
    form
      .validateFields()
      .then((values: DataSetBulkEditFormParams) => {
        onSubmit(values.definition_id)
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
      title={'Bulk Update DataSet'}
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
            onFinish={handleBulkUpdate}
            onFieldsChange={() => {
              setHaveEdit(true)
            }}
            name="dataset-bulk-form"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
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
                definitionList={definitionList}
                isLoading={definitionLoading}
                onChange={handleChange}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Row justify="center">
        <StyledColContainer>
          <Space size="middle">
            <Button
              type={'primary'}
              onClick={() => form.submit()}
              loading={modalLoading}
            >
              {'Bulk Update'}
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

export default DataSetBulkFormModal
