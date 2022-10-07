import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { SummaryDefinitionTag } from '../../../types/summary'

type Props = {
  data: SummaryDefinitionTag[]
}

const MostDefinitionTagGraph = ({ data }: Props): JSX.Element => {
  const graphData = {
    labels: data?.map((item: SummaryDefinitionTag): string => item?.name),
    datasets: [
      {
        data: data?.map((item: SummaryDefinitionTag): number => item?.count),
        backgroundColor: [
          '#78D3F8',
          '#D3EEF9',
          '#9661BC',
          '#DECFEA',
          '#F6903D',
          '#FFE0C7',
          '#008685',
          '#BBDEDE',
          '#F08BB4',
          '#FFE0ED',
          '#CCCCCC',
        ] as string[],
      },
    ],
  }
  return <Doughnut data={graphData} />
}

export default MostDefinitionTagGraph
