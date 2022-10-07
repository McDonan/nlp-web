import { atom } from 'recoil'
import { AccessTokenData } from '../types/permission'
import { ChannelJSON } from '../types/channel'
import jwt_decode from 'jwt-decode'

const storageChannel = localStorage.getItem('channel')
export const SelectedChannel = atom<ChannelJSON>({
  key: 'channel',
  default:
    storageChannel
      ? JSON.parse(storageChannel) as ChannelJSON
      : {
          id: null,
          name: null,
          active: null,
        },
})

export const AccessToken = atom<string| null>({
  key: 'accessToken',
  default: localStorage.getItem('accessToken'),
})

const convertToken = (token: string | null): AccessTokenData | null => {
  if (token !== null) {
    return jwt_decode(token)
  }
  return null
}

export const AccessData = atom<AccessTokenData| null>({
  key: 'accessData',
  default: convertToken(localStorage.getItem('accessToken')),
})

export const RefreshToken = atom<string| null>({
  key: 'refreshToken',
  default: localStorage.getItem('refreshToken'),
})
