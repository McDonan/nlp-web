import React from 'react'
import styled from 'styled-components'
import { Col, Popover, Row, Space, Spin } from 'antd'
import Button from 'antd-button-color'
import { ExportOutlined } from '@ant-design/icons'
import { EXPORT_TYPE } from '../configs/constants'

import {
  StyledFileExcelOutlined,
  StyledFileTextOutlined,
  StyledTitle,
  StyledCard,
} from './StyledComponents'

type Props = {
  title: string
  isLoading: boolean
  isSelecting: boolean
  onExport: (isExport: boolean, type: string) => void
}

const StyledExportSelectButton = styled(Button)`
  background: #556ee6;
  &:hover {
    background: #778beb;
  }
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
