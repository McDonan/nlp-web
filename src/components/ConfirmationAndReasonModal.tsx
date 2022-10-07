import { Modal, Row, Col, Input } from 'antd'
import { LegacyButtonType } from 'antd/lib/button/button'
import React, { useEffect, useState } from 'react'

type Props = {
  title: React.ReactNode | string
  description?: string
  icon?: React.ReactNode | null
  showModal: boolean
  modalLoading: boolean
  requireReason: boolean
  okText?: string
  okType?: LegacyButtonType
  cancelText?: string
  onOk?: () => void
  onCancel?: () => void
  setReasonText: (newReasonText: string) => void
}

const ConfirmationAndReasonModal = ({
  title,
  description,
  icon,
  showModal,
  modalLoading,
  requireReason,
  okText = 'Confirm',
  okType = 'primary',
  cancelText = 'Cancel',
  setReasonText,
  onOk,
  onCancel,
}: Props) => {
  const { TextArea } = Input
  const [canSubmit, setCanSubmit] = useState<boolean>(!requireReason)

  const emptyCheck = (text: string | undefined) =>
    text === null || text === undefined || text.match(/^ *$/) !== null

  const onReasonChange = (e: any) => {
    setReasonText(e.target.value)
    setCanSubmit(!emptyCheck(e.target.value))
  }
  useEffect(() => {
    setReasonText('')
  }, [])

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
      okButtonProps={{ disabled: !canSubmit }}
      cancelText={cancelText}
      onOk={onOk}
      onCancel={onCancel}
      visible={showModal}
      confirmLoading={modalLoading}
      getContainer={false}
    >
      {description}
      {requireReason && (
        <TextArea
          onChange={onReasonChange}
          placeholder="Reason"
          autoSize={{ minRows: 2, maxRows: 5 }}
        />
      )}
    </Modal>
  )
}

export default ConfirmationAndReasonModal
