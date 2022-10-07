import React from 'react'
import styled from 'styled-components'
import { Button, Space, Spin, Table, Empty, Card } from 'antd'
import { Link } from 'react-router-dom'
import TextWithToolTip from '../../../components/TextWithToolTip'
import { useGetDataSet } from '../../../api/dataset'

type Props = {
  definitionID?: string
}

const StyledSpace = styled(Space)`
  width: 100%;
`

const StyledCard = styled(Card)`
  margin: 0px 0px 20px 30px;
  .ant-card-body {
    padding: 0 24px 18px 24px;
  }
`

const DataSetByDefinitionIDTable = ({ definitionID }: Props) => {
  const { data, isLoading } = useGetDataSet({
    page: 0,
    limit: 5,
    searchText: '',
    definitionID,
  })

  const columns = [
    {
      title: 'Dataset Text',
      dataIndex: 'text',
      key: 'text',
      width: '100%',
      render: (text: string) => <TextWithToolTip text={text} />,
    },
  ]

  const total = data?.meta_data?.total || 0
  const dataLength = data?.items?.length || 0

  return (
    <StyledCard>
      <StyledSpace size="large" direction="vertical">
        <Spin spinning={isLoading}>
          <Table
            dataSource={data?.items}
            columns={columns}
            locale={{
              emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />,
            }}
            size="small"
            pagination={false}
          />
        </Spin>
        <Space size="small">
          {Math.min(dataLength, 1)} - {dataLength} of {total || 0}
          {`Sample${total > 1 ? 's' : ''}`}
        </Space>
        <Button type="primary" size="large" block disabled={total < 5}>
          <Link to={`/dataset`} state={{definitionID:definitionID}}>Show All Members</Link>
        </Button>
      </StyledSpace>
    </StyledCard>
  )
}

export default DataSetByDefinitionIDTable
