import React from 'react'
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import configs from '../configs/configs'
import { QueueItem } from '../types/auth'
import { ErrorCode } from '../configs/constants'

export const axios = Axios.create({
  baseURL: configs.REACT_APP_API_URL,
  //   timeout: 5000,
  //   withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const AxiosContext = React.createContext<AxiosInstance>(axios)

const AxiosProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  //const [fail, setFail] = useState(false)

  const axiosInstant = React.useMemo(() => {
    axios.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        if (config.headers === undefined) {
          config.headers = {}
        }
        const token = localStorage.getItem('accessToken')
        if (token) {
          // config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
          config.headers['Authorization'] = 'Bearer ' + token // for Node.js Express back-end
          setHeader(token)
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    axios.interceptors.request.use((config: AxiosRequestConfig) => config)

    let isRefreshing = false
    let failedQueue: QueueItem[] = []

    const processQueue = (error: any, token = '') => {
      failedQueue.forEach((prom) => {
        if (error) {
          prom.reject(error)
        } else {
          prom.resolve(token)
        }
      })

      failedQueue = []
    }

    const isForbidden = (error: any) => {
      const statusCode = error.response && error.response.status
      return (
        statusCode === 403 &&
        error.response.data.error_code === ErrorCode.FORBIDDEN
      )
    }

    const isInactiveChannel = (error: any) => {
      const statusCode = error.response && error.response.status
      return (
        statusCode === 500 &&
        error.response.data.error_code === ErrorCode.INACTIVE_CHANNEL
      )
    }

    // Middleware handle token expire, refreshToken
    axios.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        const originalRequest = error.config
        const statusCode = error.response && error.response.status
        if (
          !originalRequest._retry &&
          !(
            originalRequest.url.includes('/refresh') ||
            originalRequest.url.includes('/login')
          )
        ) {
          if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
              .then((authorization) => {
                originalRequest.headers['Authorization'] = authorization
                return axios(originalRequest)
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          }

          originalRequest._retry = true
          isRefreshing = true

          if (
            statusCode === 401 &&
            error.response.data.error_code === ErrorCode.UNAUTHORIZED
          ) {
            const refresh_token: string | null =
              localStorage.getItem('refreshToken')
            if (refresh_token) {
              return axios
                .post(`/refresh`, { refresh_token })
                .then((data) => {
                  localStorage.setItem(
                    'accessToken',
                    data.data.access_token?.token
                  )
                  localStorage.setItem(
                    'refreshToken',
                    data.data.refresh_token?.token
                  )
                  const accessToken = data.data?.access_token?.token
                  const authorization = 'Bearer ${accessToken}'
                  setHeader(accessToken)
                  originalRequest.headers['Authorization'] = authorization
                  processQueue(null, authorization)
                  isRefreshing = false
                  return axios(originalRequest)
                })
                .catch((error) => {
                  if (
                    statusCode === 401 &&
                    error.response.data.error_code === ErrorCode.UNAUTHORIZED
                  ) {
                    processQueue(error, '')
                    isRefreshing = false
                    localStorage.clear()
                    alert(
                      `error ${String(statusCode)} ${String(
                        error.response.data.error_code
                      )}`
                    )
                    localStorage.clear()
                  }
                  return Promise.reject(error)
                })
            }
          } else if (isForbidden(error) || isInactiveChannel(error)) {
            processQueue(error, '')
            isRefreshing = false
            alert(
              `error ${String(statusCode)} ${String(
                error.response.data.error_code
              )}`
            )
            localStorage.clear()
            return Promise.reject(error)
          } else {
            processQueue(error, '')
            isRefreshing = false
            originalRequest._retry = false
          }
        }
        return Promise.reject(error)
      }
    )
    return axios
  }, [])

  return (
    <AxiosContext.Provider value={axiosInstant}>
      {children}
    </AxiosContext.Provider>
  )
}

export const setHeader = (token: string) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
}

export const useAxios = () => React.useContext(AxiosContext)

export default AxiosProvider
