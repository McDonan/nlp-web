import React from 'react'
import { Link } from 'react-router-dom'

import { ChannelJSON } from '../../types/channel'
import { StyledSpan, StyledColLogoContainer } from '../StyledComponents'

type Props = {
  channel: ChannelJSON
  selectChannel: boolean
}

const CurrentChannel: React.FC<Props> = ({ channel, selectChannel }) => {
  return (
    <StyledColLogoContainer span={4}>
      {selectChannel && (
        <Link to="/select-channel">
          <StyledSpan color="#ffffff">
            {channel?.name ? `Channel: ${channel?.name}` : ''}
          </StyledSpan>
        </Link>
      )}
    </StyledColLogoContainer>
  )
}

export default CurrentChannel
