import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { SummaryDefinitionMember } from '../../../types/summary'

type Props = {
  data: SummaryDefinitionMember[]
}

const MostDefinitionMemberGraph = ({ data }: Props): JSX.Element => {
  const graphData = {
    labels: data?.map((item: SummaryDefinitionMember): string => item?.name),
    datasets: [
      {
        data: data?.map((item: SummaryDefinitionMember): number => item?.count),
        backgroundColor: [
          '#5B8FF9',
          '#CDDDFD',
          '#61DDAA',
          '#CDF3E4',
          '#65789B',
          '#CED4DE',
          '#F6BD16',
          '#FCEBB9',
          '#7262FD',
          '#D3CEFD',
          '#CCCCCC',
        ],
      },
    ],
  }
  return <Doughnut data={graphData} />
}

export default MostDefinitionMemberGraph
