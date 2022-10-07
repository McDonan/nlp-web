import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Spin, Typography } from 'antd'
const { Title } = Typography
import { Channel } from '../../types/channel'
import { useGetChannel } from '../../api/selectChannel'
import SelectChannelTable from './components/SelectChannelTable'

//got permission
import { useUser } from '../../hooks/useUser'

const SelectChannelPage = () => {
  const { setChannel, userData } = useUser()
  const { data, isLoading, isRefetching } = useGetChannel(userData?.id ?? '')
  const navigate = useNavigate()
  const handleClick = (record: Channel) => {
    setChannel(record)
    localStorage.setItem('channel', JSON.stringify(record))
    navigate('/')
  }

  return (
    <>
      <Title level={5}>Channel Service</Title>
      <Spin spinning={isLoading || isRefetching}>
        <SelectChannelTable data={data?.channels} onSelect={handleClick} />
      </Spin>
    </>
  )
}

export default SelectChannelPage
