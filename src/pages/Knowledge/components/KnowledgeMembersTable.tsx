import React from 'react'
import styled from 'styled-components'

import { Table, Spin, Typography, Empty, Card } from 'antd'
import { useKnowledgeMembers } from '../../../api/knowledge'

type Props = {
  id: string
}

const StyledCard = styled(Card)`
  margin: 0px 0px 20px 30px;
  .ant-card-body {
    padding: 18px 24px 18px 24px;
  }
`

const KnowledgeMembersTable = ({ id }: Props): JSX.Element => {
  const { data, isLoading } = useKnowledgeMembers(id)
  const knowledgeTableColumns = [
    { title: 'Word', dataIndex: 'word', key: 'word' },
    { title: 'Confidence', dataIndex: 'confidence', key: 'confidence' },
  ]

  return (
    <Spin spinning={isLoading}>
      <StyledCard>
        <Typography.Title level={5}>Suggestions</Typography.Title>
        <Table
          size="small"
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
          columns={knowledgeTableColumns}
          dataSource={data ? data.suggestions : []}
          pagination={false}
        />
      </StyledCard>
    </Spin>
  )
}

export default KnowledgeMembersTable
