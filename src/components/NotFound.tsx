import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Layout } from 'antd'
import styled from 'styled-components'
import { useUser } from '../hooks/useUser'

type Props = {
    type: number
}

const StyledLoginLayout = styled(Layout)`
  background-color: white;
  padding: 5%;
  margin: 4% 20%;
`
const StyledLoginHeader = styled.h1`
  font-size: 5vh;
`

const NotFound = ({type}: Props) => {
  const { accessPermission, logout } = useUser()
  const navigate = useNavigate()
  const userView = accessPermission?.view_users || false
  const redirectToDefaultPage = () => {
    if (userView){
      navigate('/user')
    }
    else{
      navigate('/')
    } 
  }
  let errorText = ""
  if (type === 403){
    errorText = `Your account have not permission to access ${useLocation().pathname}. Please contact administator to grant your permission.`
  }
  else if (type === 404){
    errorText = `We couldn't find the page you were looking for in path ${useLocation().pathname}.`
  }
  return (
    <Layout>
      <StyledLoginLayout>
        <StyledLoginHeader>
          {"Can't access this page"}
        </StyledLoginHeader>
        <p>{errorText}</p>
        <Button type="primary" onClick={redirectToDefaultPage} block>
          Go to your default page.
        </Button>
        <Button type="default" onClick={logout} block>
          Logout
        </Button>
      </StyledLoginLayout>
    </Layout>
  )
}

export default NotFound