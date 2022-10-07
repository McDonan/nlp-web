import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import NotFound from './NotFound'

type IsLoginProps = {
  pagePermission?: boolean
}

const AccessFilter: React.FC<IsLoginProps> = ({ pagePermission, children }) => {
    const {accessPermission, channel, token} = useUser()
    const isLoginPage = (useLocation().pathname === '/login')

    if(isLoginPage && accessPermission){
        if(accessPermission?.view_users){
            return <Navigate to="/user" replace/>
        }
        else{
            return <Navigate to="/select-channel" replace />
        }
    }
    if(!isLoginPage && token === null){
        return <Navigate to="/login" replace />
    }
    if(!isLoginPage && channel.id === null && useLocation().pathname !== '/select-channel' && useLocation().pathname !== '/user' && useLocation().pathname !== '/channel'){
        return <Navigate to="/select-channel" replace />
    }
    if(pagePermission !== undefined && !pagePermission){
        return <NotFound type={403} />
    }
    return <>{children}</>
}

export default AccessFilter
