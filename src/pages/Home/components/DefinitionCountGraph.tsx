import React from 'react'
import { Line } from 'react-chartjs-2'
import { SummaryDefinitionCount } from '../../../types/summary'
import { GRAPH_OPTIONS } from '../../../configs/constants'

type Props = {
  data: SummaryDefinitionCount[]
}

const DefinitionCountGraph = ({ data }: Props): JSX.Element => {
  const graphData = {
    labels: data?.map((item: SummaryDefinitionCount): string => item.date),
    datasets: [
      {
        babel: '# of Datasets',
        data: data?.map((item: SummaryDefinitionCount): number => item.count),
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        borderColor: 'rgb(255, 99, 132)',
        fill: true,
      },
    ],
  }
  return <Line data={graphData} options={GRAPH_OPTIONS} />
}

export default DefinitionCountGraph
