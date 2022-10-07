import React from 'react'
import { Button, Popconfirm } from 'antd'

type Props = {
  haveEdit: boolean
  disable?: boolean
  onCloseModal: () => void
}
const CloseModalButton = ({ haveEdit, disable, onCloseModal }: Props) => {
  if (haveEdit) {
    return (
      <Popconfirm
        placement="bottom"
        arrowPointAtCenter
        title="All of unsaved data will be lose if you close this."
        onConfirm={onCloseModal}
        okText="Leave"
        okButtonProps={{
          type: 'default',
          danger: true,
        }}
        cancelText="Continue"
      >
        <Button disabled={disable}>Cancel</Button>
      </Popconfirm>
    )
  }
  return (
    <Button disabled={disable} onClick={onCloseModal}>
      Cancel
    </Button>
  )
}
export default CloseModalButton
