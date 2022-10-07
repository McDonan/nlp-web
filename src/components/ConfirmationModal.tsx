import { Modal, Row, Col } from 'antd'
import { LegacyButtonType } from 'antd/lib/button/button'
import React from 'react'

type Props = {
  title: React.ReactNode | string
  description?: string
  icon?: React.ReactNode | null
  showModal: boolean
  modalLoading: boolean
  okText?: string
  okType?: LegacyButtonType
  cancelText?: string
  onOk?: () => void
  onCancel?: () => void
}

const ConfirmationModal = ({
  title,
  description,
  icon,
  showModal,
  modalLoading,
  okText = 'Confirm',
  okType = 'primary',
  cancelText = 'Cancel',
  onOk,
  onCancel,
}: Props) => {
  return (
    <Modal
      title={
        <Row align="middle">
          {icon && <Col span={2}>{icon}</Col>}
          <Col span={icon ? 22 : 24}>{title}</Col>
        </Row>
      }
      maskClosable={false}
      closable={false}
      okText={okText}
      okType={okType}
      cancelText={cancelText}
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
