import React from 'react'
import { Line } from 'react-chartjs-2'
import { SummaryDatasetCount } from '../../../types/summary'
import { GRAPH_OPTIONS } from '../../../configs/constants'

type Props = {
  data: SummaryDatasetCount[]
}

const DataSetCountGraph = ({ data }: Props): JSX.Element => {
  const graphData = {
    labels: data?.map((item: SummaryDatasetCount): string => item.date),
    datasets: [
      {
        babel: '# of Datasets',
        data: data?.map((item: SummaryDatasetCount): number => item.count),
        backgroundColor: 'rgba(6, 207, 9, 0.3)',
        borderColor: 'rgb(6, 207, 9)',
        fill: true,
      },
    ],
  }
  return <Line data={graphData} options={GRAPH_OPTIONS} />
}

export default DataSetCountGraph
