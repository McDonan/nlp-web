import { Modal, Row, Col, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { User } from '../types/users'
import { StyledExclamationCircleOutlined } from '../components/StyledComponents'

type Props = {
  selectedRecord?: User
  showModal: boolean
  modalLoading: boolean
  toStatus: boolean
  onOk?: () => void
  onCancel?: () => void
  setReasonText: (newReasonText: string) => void
}

const ConfirmationAndReasonModal = ({
  selectedRecord,
  showModal,
  modalLoading,
  setReasonText,
  toStatus,
  onOk,
  onCancel,
}: Props) => {
  const { TextArea } = Input
  const [canSubmit, setCanSubmit] = useState<boolean>(toStatus)

  const emptyCheck = (text: string | undefined) =>
    text === null || text === undefined || text.match(/^ *$/) !== null

  const onReasonChange = (e: string | any) => {
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
          {
            <Col span={2}>
              <StyledExclamationCircleOutlined />
            </Col>
          }
          <Col span={22}>
            {`Are you sure you would like to change status user "${
              selectedRecord?.name ?? ''
            }" ?`}
          </Col>
        </Row>
      }
      maskClosable={false}
      closable={false}
      okText="Change"
      cancelText="Cancel"
      okType="primary"
      okButtonProps={{ disabled: !canSubmit }}
      onOk={onOk}
      onCancel={onCancel}
      visible={showModal}
      confirmLoading={modalLoading}
      getContainer={false}
    >
      {`${selectedRecord?.name ?? 'User'}'s status will change to ${
        toStatus ? 'active' : 'inactive'
      }. ${
        !toStatus
          ? `Please specify the reason for disabling User ${
              selectedRecord?.name ?? 'name not found'
            } (${selectedRecord?.employee_id ?? ''}).`
          : ''
      }`}
      {!toStatus && (
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
