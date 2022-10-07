import React from 'react'
import styled from 'styled-components'
import { Card, Col, Popover, Row, Space, Spin, Typography } from 'antd'
import Button from 'antd-button-color'
import {
  ExportOutlined,
  FileTextOutlined,
  FileExcelOutlined,
} from '@ant-design/icons'
import { EXPORT_TYPE } from '../configs/constants'

type Props = {
  title: string
  isLoading: boolean
  isSelecting: boolean
  onExport: (isExport: boolean, type: string) => void
}

type StyledCardProps = {
  background: string
}

const StyledExportSelectButton = styled(Button)`
  background: #556ee6;
  &:hover {
    background: #778beb;
  }
`

const StyledCard = styled(Card)<StyledCardProps>`
  background: ${(props: { background: string }) => props.background};
  width: 100%;
  height: 100%;
  color: #ffffff;
  text-align: center;
`

const StyledTitle = styled(Typography.Title)`
  color: #ffffff !important;
`

const StyledFileTextOutlined = styled(FileTextOutlined)`
  font-size: 30px;
  color: #ffffff;
`

const StyledFileExcelOutlined = styled(FileExcelOutlined)`
  font-size: 30px;
  color: #ffffff;
`

const ExportSelectButton = ({
  title,
  isLoading,
  isSelecting,
  onExport,
}: Props) => {
  const handleExport = (type: string) => {
    onExport(true, type)
  }

  return (
    <Popover
      content={
        <Spin spinning={isLoading}>
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <StyledCard
                onClick={() => {
                  handleExport(EXPORT_TYPE.JSON)
                }}
                bordered={false}
                hoverable={true}
                background="#2e72f8"
              >
                <Space direction="vertical">
                  <StyledFileTextOutlined />
                  <StyledTitle level={5}>JSON</StyledTitle>
                </Space>
              </StyledCard>
            </Col>
            <Col span={12}>
              <StyledCard
                onClick={() => {
                  handleExport(EXPORT_TYPE.EXCEL)
                }}
                bordered={false}
                hoverable={true}
                background="#1d6f42"
              >
                <Space direction="vertical">
                  <StyledFileExcelOutlined />
                  <StyledTitle level={5}>Excel</StyledTitle>
                </Space>
              </StyledCard>
            </Col>
          </Row>
        </Spin>
      }
      title={title}
      trigger="click"
    >
      <StyledExportSelectButton
        type="info"
        icon={<ExportOutlined />}
        disabled={!isSelecting}
      >
        Export
      </StyledExportSelectButton>
    </Popover>
  )
}
export default ExportSelectButton
