import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal, Upload, Space, Alert } from 'antd'
import Button from 'antd-button-color'
import {
  ImportOutlined,
  FileExcelOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { RcFile, UploadFile } from 'antd/lib/upload/interface'
import { useErrorMessage } from '../hooks/useErrorMessage'

type Props = {
  title: string
  showModal: boolean
  isLoading: boolean
  onShowModal: (isOpen: boolean) => void
  onImport: (file: FormData, type: string) => void
}

const StyledSpaceContainer = styled(Space)`
  width: 100%;
  align-items: center;
  .ant-space-item {
    text-align: center;
    width: 100%;
  }
`

const StyledFileExcelOutlined = styled(FileExcelOutlined)`
  color: #1d6f42 !important;
`

const StyledFileTextOutlined = styled(FileTextOutlined)`
  font-size: 30px;
  color: #2e72f8 !important;
`
const StyledAlert = styled(Alert)`
  text-align: center;
  margin-top: 20px;
`
const ImportButton = ({
  title,
  showModal,
  isLoading,
  onShowModal,
  onImport,
}: Props) => {
  const { errMsg, clearErrMsg } = useErrorMessage()

  const [fileList, setFileList] = useState<
    UploadFile<string | Blob | RcFile>[]
  >([])
  const [file, setFile] = useState<File>()

  const handleSubmit = () => {
    if (file) {
      const formData = new FormData()
      formData.append('file', file, file.name)
      onImport(formData, file.type)
    }
  }

  return (
    <>
      <Button
        onClick={() => onShowModal(true)}
        type="warning"
        icon={<ImportOutlined />}
      >
        Import
      </Button>
      <Modal
        title={title}
        visible={showModal}
        confirmLoading={isLoading}
        onCancel={() => onShowModal(false)}
        footer={null}
        width="80%"
      >
        <StyledSpaceContainer direction="vertical">
          <Upload.Dragger
            multiple={false}
            listType="picture"
            fileList={fileList}
            accept=".xlsx, .json"
            onChange={(e) => {
              let fileList = [...e.fileList]
              fileList = fileList.slice(-1)
              setFileList(fileList)
            }}
            beforeUpload={(file: File) => {
              setFile(file)
              return false
            }}
            disabled={isLoading}
          >
            <p className="ant-upload-drag-icon">
              <StyledFileExcelOutlined />
              <StyledFileTextOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file (.xlsx, .json) to this area to upload
            </p>
            <p className="ant-upload-hint">Support for a single upload.</p>
          </Upload.Dragger>
          <Button
            type="primary"
            loading={isLoading}
            onClick={handleSubmit}
            disabled={fileList?.length === 0}
          >
            Upload
          </Button>
          {errMsg && (
            <StyledAlert
              message={errMsg}
              type="error"
              showIcon
              closable
              onClose={clearErrMsg}
            />
          )}
        </StyledSpaceContainer>
      </Modal>
    </>
  )
}

export default ImportButton
