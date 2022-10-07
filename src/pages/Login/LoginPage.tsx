import React, { useState, useEffect } from 'react'
import { Button, Layout, Alert, Spin, Input, Form } from 'antd'
import styled from 'styled-components'
import { useUser } from '../../hooks/useUser'
import configs from '../../configs/configs'
import { useErrorMessage } from '../../hooks/useErrorMessage'
import { setHeader } from '../../libs/axios'
import { useEmailLogin, useLogin } from '../../api/auth'

const StyledAlert = styled(Alert)`
  text-align: center;
  margin-top: 20px;
`

const StyledLoginLayout = styled(Layout)`
  background-color: white;
  padding: 5%;
  margin: 4% 20%;
`
const StyledLoginHeader = styled.h1`
  font-size: 5vh;
`

const LoginPage = () => {
  const { login } = useUser()
  const { errMsg, clearErrMsg } = useErrorMessage()
  const [forLocalDev, setForLocalDev] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const params = new Proxy(new URLSearchParams(window.location.search), {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    get: (searchParams: any, prop: any) => searchParams.get(prop),
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const code = params.code
  const redirect = () => {
    window.location.replace(
      `https://login.microsoftonline.com/${configs.REACT_APP_TANENT_ID}/oauth2/v2.0/authorize?client_id=${configs.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${configs.REACT_APP_REDIRECT_URL}&response_mode=query&scope=openid profile email offline_access&state=success`
    )
  }

  // const login = useLogin()
  // const handleSetAuth = (code: string) => {
  //   if (code) {
  //     setIsLoading(true)
  //     useAuth.mutate(
  //       { code },
  //       {
  //         onSuccess: (data) => {
  //           setHeader(data.data.access_token.token)
  //           login(data.data.access_token?.token, data.data.refresh_token?.token)
  //           setIsLoading(false)
  //         },
  //         onError: () => {
  //           setIsLoading(false)
  //         }
  //       }
  //     )
  //   }
  // }

  // useEffect(() => {
  //   if (code) {
  //     if (window.location.origin === 'https://nlp-backoffice.web.app' || window.location.origin === "https://knlpweb-dev.kasikornbank.com") {
  //       const forLocalDev = confirm("For Dev Local ? ")
  //       forLocalDev ? setForLocalDev(true) : handleSetAuth(String(code))
  //     } else {
  //       handleSetAuth(String(code))
  //     }
  //   }
  // }, [code])

  const [form] = Form.useForm()

  const loginWithEmail = useEmailLogin()

  const handleLogin = (values: { email: string }) => {
    setIsLoading(true)
    
    loginWithEmail.mutate(
      { email: values.email },
      {
        onSuccess: (data) => {
          setHeader(data.data.access_token.token)
          login(data.data.access_token?.token, data.data.refresh_token?.token)
          setIsLoading(false)
        },
        onError: () => {
          setIsLoading(false)
        }
      }
    )
  }
  return (
    <Form
      form={form}
      onFinish={handleLogin}
    >
      <Layout>
        <Spin spinning={isLoading}>
        <StyledLoginLayout>
          <StyledLoginHeader>
            KNLP Chatbot
          </StyledLoginHeader>
          {forLocalDev && code}
          {errMsg && (
            <StyledAlert
              message={errMsg}
              type="error"
              showIcon
              closable
              onClose={clearErrMsg}
            />
          )}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Email is required.',
              },
            ]}
          >
            <Input placeholder="user796.02-004@kasikornthaibank.in.th" allowClear />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Sign in
          </Button>
        </StyledLoginLayout>
        </Spin>
      </Layout>
    </Form>
  )
}
export default LoginPage
