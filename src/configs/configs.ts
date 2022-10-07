/* eslint-disable @typescript-eslint/no-unsafe-assignment */
declare global {
  interface ImportMeta {
    env: {
      REACT_APP_ENV: string
      REACT_APP_REDIRECT_URL: string
      REACT_APP_API_URL: string
      REACT_APP_CLIENT_ID: string
      REACT_APP_TANENT_ID: string
    }
  }
  const env_config: {
    REACT_APP_ENV: string
    REACT_APP_REDIRECT_URL: string
    REACT_APP_API_URL: string
    REACT_APP_CLIENT_ID: string
    REACT_APP_TANENT_ID: string
  }
}

const configs = {
  REACT_APP_ENV: process.env.REACT_APP_ENV || env_config?.REACT_APP_ENV,
  REACT_APP_REDIRECT_URL: 
    process.env.REACT_APP_REDIRECT_URL || env_config?.REACT_APP_REDIRECT_URL,
  REACT_APP_API_URL:
    process.env.REACT_APP_API_URL || env_config?.REACT_APP_API_URL,
  REACT_APP_CLIENT_ID:
    process.env.REACT_APP_CLIENT_ID || env_config?.REACT_APP_CLIENT_ID,
  REACT_APP_TANENT_ID: 
    process.env.REACT_APP_TANENT_ID || env_config?.REACT_APP_TANENT_ID
}

export default configs
