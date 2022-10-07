import React from 'react'
import { Card, Col, Row, Typography, Spin } from 'antd'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)
import {
  useSummaryDefinitionTag,
  useSummaryDatasetCount,
  useSummaryDefinitionCount,
  useSummaryDefinitionMember,
} from '../../api/summary'
import DefinitionCountGraph from './components/DefinitionCountGraph'
import DataSetCountGraph from './components/DataSetCountGraph'
import MostDefinitionMemberGraph from './components/MostDefinitionMemberGraph'
import MostDefinitionTagGraph from './components/MostDefinitionTagGraph'

const Home = (): JSX.Element => {
  const {
    data: defTag,
    isLoading: defTagIsLoading,
    isRefetching: defTagIsRefetching,
  } = useSummaryDefinitionTag()
  const {
    data: defMember,
    isLoading: defMemberIsLoading,
    isRefetching: defMemberIsRefetching,
  } = useSummaryDefinitionMember()
  const {
    data: defCount,
    isLoading: defCountIsLoading,
    isRefetching: defCountIsRefetching,
  } = useSummaryDefinitionCount(12)
  const {
    data: dataSetCount,
    isLoading: dataSetCountIsLoading,
    isRefetching: dataSetCountIsRefetching,
  } = useSummaryDatasetCount(12)

  return (
    <>
      <Row>
        <Col span={12}>
          <Card>
            <Typography.Title level={5}>
              No. of Definitions by time
            </Typography.Title>
            <Spin spinning={defCountIsLoading || defCountIsRefetching}>
              <DefinitionCountGraph data={defCount ?? []} />
            </Spin>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Typography.Title level={5}>
              No. of Datasets by time
            </Typography.Title>
            <Spin spinning={dataSetCountIsLoading || dataSetCountIsRefetching}>
              <DataSetCountGraph data={dataSetCount ?? []} />
            </Spin>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Typography.Title level={5}>
              Most member Definition
            </Typography.Title>
            <Spin spinning={defMemberIsLoading || defMemberIsRefetching}>
              <MostDefinitionMemberGraph data={defMember ?? []} />
            </Spin>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Typography.Title level={5}>Most Tagged</Typography.Title>
            <Spin spinning={defTagIsLoading || defTagIsRefetching}>
              <MostDefinitionTagGraph data={defTag ?? []} />
            </Spin>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Home
