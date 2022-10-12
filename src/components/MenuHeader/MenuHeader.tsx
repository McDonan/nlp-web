import React from 'react'
import { useUser } from '../../hooks/useUser'

import HeaderLogo from './HeaderLogo'
import CurrentChannel from './CurrentChannel'
import UserMenu from './UserMenu'
import { StyledRow } from './StyledComponents'

const MenuHeader: React.FC = () => {
  const { token, userData, logout, channel, accessPermission } = useUser()

  const selectChannel = accessPermission?.select_channel || false

  return (
    <StyledRow>
      <HeaderLogo />
      {token ? (
        <>
          <CurrentChannel channel={channel} selectChannel={selectChannel} />
          <UserMenu
            userData={userData}
            logout={logout}
            accessPermission={accessPermission}
            selectChannel={selectChannel}
          />
        </>
      ) : (
        <></>
      )}
    </StyledRow>
  )
}
export default MenuHeader
