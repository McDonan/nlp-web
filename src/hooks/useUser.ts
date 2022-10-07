import { useRecoilState } from 'recoil'
import {
  SelectedChannel,
  RefreshToken,
  AccessData,
  AccessToken,
} from '../userPermission/AtomInit'
import jwt_decode from 'jwt-decode'
import { AccessTokenData } from '../types/permission'

const convertToken = (token: string | null): AccessTokenData | null => {
  if (token !== null) {
    return jwt_decode(token)
  }
  return null
}

export const useUser = () => {
  const [channel, setChannel] = useRecoilState(SelectedChannel)
  const [accessToken, setAccessToken] = useRecoilState(AccessToken)
  const [accessData, setAccessData] = useRecoilState(AccessData)
  const [refreshToken, setRefreshToken] = useRecoilState(RefreshToken)

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    setAccessData(convertToken(accessToken))
    return true
  }
  const logout = () => {
    setRefreshToken(null)
    setAccessToken(null)
    setAccessData(null)
    setChannel({
      id: null,
      name: null,
      active: null,
    })
    localStorage.removeItem('channel')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
  const token = refreshToken
  const userData = accessData?.user_data
  const accessPermission = userData?.permissions
  
  return {
    userData,
    accessToken,
    setAccessToken,
    accessPermission,
    refreshToken,
    setRefreshToken,
    channel,
    setChannel,
    token,
    login,
    logout,
  }
}
