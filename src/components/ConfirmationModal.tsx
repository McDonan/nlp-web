import { Modal, Row, Col } from 'antd'
import { LegacyButtonType } from 'antd/lib/button/button'
import React from 'react'

import { StyledExclamationCircleOutlined } from './StyledComponents'

type Props = {
  title: React.ReactNode | string
  description?: string
  showModal: boolean
  modalLoading: boolean
  okText?: string
  onOk?: () => void
  onCancel?: () => void
}

const ConfirmationModal = ({
  title,
  description,
  showModal,
  modalLoading,
  okText = 'Confirm',
  onOk,
  onCancel,
}: Props) => {
  return (
    <Modal
      title={
        <Row align="middle">
          <Col span={2}>
            <StyledExclamationCircleOutlined />
          </Col>
          <Col span={22}>{title}</Col>
        </Row>
      }
      maskClosable={false}
      closable={false}
      okText={okText}
      okType="danger"
      cancelText="Cancel"
      onOk={onOk}
      onCancel={onCancel}
      visible={showModal}
      confirmLoading={modalLoading}
      getContainer={false}
    >
      {description}
    </Modal>
  )
}

export default ConfirmationModal
