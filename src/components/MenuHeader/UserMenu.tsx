import React from 'react'
import { Col, Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
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

import { StyledMenu } from './StyledComponents'

type Props = {
  userData: any
  logout: any
  accessPermission: any
  selectChannel: any
}

const UserMenu: React.FC<Props> = ({
  userData,
  logout,
  accessPermission,
  selectChannel,
}) => {
  const dashboardView = accessPermission?.view_dashboard || false
  const definitionView = accessPermission?.view_definitions || false
  const datasetView = accessPermission?.view_data_sets || false
  const knowledgeView = accessPermission?.view_knowledge || false
  const userView = accessPermission?.view_users || false
  const channelView = accessPermission?.view_channels || false

  return (
    <Col span={15}>
      <StyledMenu
        mode="horizontal"
        theme="dark"
        selectedKeys={[useLocation().pathname]}
      >
        {dashboardView && (
          <Menu.Item key="/">
            <HomeOutlined />
            <span>Home</span>
            <Link to="/" />
          </Menu.Item>
        )}
        {definitionView && (
          <Menu.Item key="/definition">
            <AppstoreOutlined />
            <span>Definition</span>
            <Link to="/definition" />
          </Menu.Item>
        )}
        {datasetView && (
          <Menu.Item key="/dataset">
            <FileSearchOutlined />
            <span>Dataset</span>
            <Link to="/dataset" />
          </Menu.Item>
        )}
        {knowledgeView && (
          <Menu.Item key="/knowledge">
            <BookOutlined />
            <span>Knowledge</span>
            <Link to="/knowledge" />
          </Menu.Item>
        )}
        {channelView && (
          <Menu.Item key="/channel">
            <BookOutlined />
            <span>Channel</span>
            <Link to="/channel" />
          </Menu.Item>
        )}
        {userView && (
          <Menu.Item key="/user">
            <UserOutlined />
            <span>User</span>
            <Link to="/user" />
          </Menu.Item>
        )}

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
            </Menu.Item>
          )}
          <Menu.Item key="/logout" onClick={() => logout()}>
            <LogoutOutlined />
            <span>Logout</span>
          </Menu.Item>
        </Menu.SubMenu>
      </StyledMenu>
    </Col>
  )
}

export default UserMenu
