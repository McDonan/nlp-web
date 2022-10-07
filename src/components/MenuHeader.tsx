import React from 'react'
import styled from 'styled-components'
import {
  AppstoreOutlined,
  BookOutlined,
  FileSearchOutlined,
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  SmileFilled,
  BranchesOutlined,
} from '@ant-design/icons'
import { Col, Menu, Row, Typography } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
const { Title } = Typography
type StyledLinkProps = {
  color: string
}

const StyledColLogoContainer = styled(Col)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
`

const StyledTitle = styled(Title)`
  margin-top: 0.5rem;
`

const StyledSpan = styled.span<StyledLinkProps>`
  color: ${(props) => props.color}!important;
`

const StyledSpanBold = styled(StyledSpan)`
  font-weight: 900;
`

const StyledMenu = styled(Menu)`
  border-right: 0;
  justify-content: flex-end;
  .ant-menu-overflow-item.ant-menu-item.ant-menu-item-selected {
    background: #61a6a8 !important;
  }
  .ant-menu-overflow-item.ant-menu-item:hover {
    background: #61a6a8 !important;
  }
`
const StyledRow = styled(Row)`
  height: 64px;
`
const MenuHeader: React.FC = () => {
  const { token, userData, logout, channel, accessPermission } = useUser()

  const dashboardView = accessPermission?.view_dashboard || false
  const definitionView = accessPermission?.view_definitions || false
  const datasetView = accessPermission?.view_data_sets || false
  const knowledgeView = accessPermission?.view_knowledge || false
  const userView = accessPermission?.view_users || false
  const channelView = accessPermission?.view_channels || false
  const selectChannel = accessPermission?.select_channel || false

  const headerLogo = (
    <StyledTitle level={4}>
      <Link to="/">
        <StyledSpanBold color="#61a6a8">K</StyledSpanBold>
        <StyledSpan color="#61a6a8">NLP&nbsp;</StyledSpan>
        <StyledSpan color="#ffffff">Chatbot Training</StyledSpan>
      </Link>
    </StyledTitle>
  )
  const currentChannel = (
    <Link to="/select-channel">
      <StyledSpan color="#ffffff">
        {channel?.name ? `Channel: ${channel?.name}` : ''}
      </StyledSpan>
    </Link>
  )
  const userMenuDropdown = (
    <Menu.SubMenu
      key="UserMenuDropdown"
      title={userData?.email}
      icon={<SmileFilled />}
    >
      {selectChannel && (
      <Menu.Item key="/select-channel" disabled={false}>
        <BranchesOutlined />
        <span>Select Channel</span>
        <Link to="/select-channel" />
      </Menu.Item>)}
      <Menu.Item key="/logout" onClick={() => logout()}>
        <LogoutOutlined />
        <span>Logout</span>
      </Menu.Item>
    </Menu.SubMenu>
  )

  if (token === null) {
    return (
      <StyledRow>
        <StyledColLogoContainer span={6}>{headerLogo}</StyledColLogoContainer>
      </StyledRow>
    )
  }
  return (
    <StyledRow>
      <StyledColLogoContainer span={5}>{headerLogo}</StyledColLogoContainer>
      <StyledColLogoContainer span={4}>{selectChannel && (currentChannel)}</StyledColLogoContainer>
      <Col span={15}>
        <StyledMenu
          mode={'horizontal'}
          theme={'dark'}
          selectedKeys={[useLocation().pathname]}
        >
          {dashboardView && (<Menu.Item key="/">
            <HomeOutlined />
            <span>Home</span>
            <Link to="/" />
          </Menu.Item>)}
          {definitionView && (<Menu.Item key="/definition">
            <AppstoreOutlined />
            <span>Definition</span>
            <Link to="/definition" />
          </Menu.Item>)}
          {datasetView && (<Menu.Item key="/dataset">
            <FileSearchOutlined />
            <span>Dataset</span>
            <Link to="/dataset" />
          </Menu.Item>)}
          {knowledgeView && (<Menu.Item key="/knowledge">
            <BookOutlined />
            <span>Knowledge</span>
            <Link to="/knowledge" />
          </Menu.Item>)}
          {/*(<Menu.Item key="/training" disabled={true}>
            <RobotOutlined />
            <span>Training</span>
            <Link to="/training" />
          </Menu.Item>
          <Menu.Item key="/explore" disabled={true}>
            <RocketOutlined />
            <span>Explore</span>
            <Link to="/explore" />
  </Menu.Item>)*/}
          {channelView && (<Menu.Item key="/channel">
            <BookOutlined />
            <span>Channel</span>
            <Link to="/channel" />
          </Menu.Item>)}
          {userView && (<Menu.Item key="/user">
            <UserOutlined />
            <span>User</span>
            <Link to="/user" />
          </Menu.Item>)}
          {userMenuDropdown}
        </StyledMenu>
      </Col>
    </StyledRow>
  )
}
export default MenuHeader
