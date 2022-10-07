import React, { lazy, Suspense } from 'react'
import styled from 'styled-components'
import { Layout, Spin } from 'antd'
import { Routes, BrowserRouter, Route } from 'react-router-dom'
import MenuHeader from './components/MenuHeader'
import './App.css'
import { useUser } from './hooks/useUser'
import AccessFilter from './components/AccessFilter'
import NotFound from './components/NotFound'

const { Header } = Layout
const Home = lazy(() => import('./pages/Home/Home'))
const DefinitionPage = lazy(() => import('./pages/Definition/DefinitionPage'))
const KnowledgePage = lazy(() => import('./pages/Knowledge/KnowledgePage'))
const DataSetPage = lazy(() => import('./pages/DataSet/DataSetPage'))
const ChannelPage = lazy(() => import('./pages/Channel/ChannelPage'))
const LoginPage = lazy(() => import('./pages/Login/LoginPage'))
const UserPage = lazy(() => import('./pages/User/UserPage'))
const SelectChannel = lazy(
  () => import('./pages/SelectChannel/SelectChannelPage')
)
const StyledLayout = styled(Layout)`
  min-height: 100vh;
  height: 100%;
`

const StyledHeader = styled(Header)`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
  padding-left: 25px;
  padding-right: 25px;
`

const StyledContainer = styled.div`
  margin-top: 64px;
  padding: 15px 25px 15px 25px;
`

const StyledContainerLoading = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
`

const App: React.FC = () => {
  const { accessPermission } = useUser()
  const dashboardView = accessPermission?.view_dashboard || false
  const definitionView = accessPermission?.view_definitions || false
  const datasetView = accessPermission?.view_data_sets || false
  const knowledgeView = accessPermission?.view_knowledge || false
  const userView = accessPermission?.view_users || false
  const channelView = accessPermission?.view_channels || false
  const selectChannel = accessPermission?.select_channel || false
  return (
    <Suspense
      fallback={
        <StyledLayout>
          <StyledContainerLoading>
            <Spin />
          </StyledContainerLoading>
        </StyledLayout>
      }
    >
      <BrowserRouter>
        <StyledLayout>
          <StyledHeader>
            <MenuHeader />
          </StyledHeader>
          <StyledContainer>
            <Routes>
              <Route
                path="/"
                element={
                  <AccessFilter pagePermission={dashboardView}>
                    <Home />
                  </AccessFilter>
                }
              />
              <Route
                path="/definition"
                element={
                  <AccessFilter pagePermission={definitionView}>
                    <DefinitionPage />
                  </AccessFilter>
                }
              />
              <Route
                path="/dataset"
                element={
                  <AccessFilter pagePermission={datasetView}>
                    <DataSetPage />
                  </AccessFilter>
                }
              />
              <Route
                path="/knowledge"
                element={
                  <AccessFilter pagePermission={knowledgeView}>
                    <KnowledgePage />
                  </AccessFilter>
                }
              />
              <Route
                path="/user"
                element={
                  <AccessFilter pagePermission={userView}>
                    <UserPage />
                  </AccessFilter>
                }
              />
              <Route
                path="/channel"
                element={
                  <AccessFilter pagePermission={channelView}>
                    <ChannelPage />
                  </AccessFilter>
                }
              />
              <Route
                path="/select-channel"
                element={
                  <AccessFilter pagePermission={selectChannel}>
                    <SelectChannel />
                  </AccessFilter>
                }
              />
              <Route path="/login" element={<AccessFilter><LoginPage /></AccessFilter>} />
              <Route path='*' element={<AccessFilter><NotFound type={404}/></AccessFilter>} />
            </Routes>
          </StyledContainer>
        </StyledLayout>
      </BrowserRouter>
    </Suspense>
  )
}
export default App
