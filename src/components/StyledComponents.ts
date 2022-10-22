import styled from 'styled-components'
import { Col, Typography, Menu, Row, Input, Alert } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { Title } = Typography
const { Search } = Input

type StyledLinkProps = {
  color: string
}

export const StyledSpan = styled.span<StyledLinkProps>`
  color: ${(props) => props.color} !important;
`

export const StyledColLogoContainer = styled(Col)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
`

export const StyledColSearch = styled(Col)`
  text-align: right;
`

export const StyledSearch = styled(Search)`
  width: 250px;
`

export const StyledTitle = styled(Title)`
  margin-top: 0.5rem;
`

export const StyledSpanBold = styled(StyledSpan)`
  font-weight: 900;
`

export const StyledMenu = styled(Menu)`
  border-right: 0;
  justify-content: flex-end;
  .ant-menu-overflow-item.ant-menu-item.ant-menu-item-selected {
    background: #61a6a8 !important;
  }
  .ant-menu-overflow-item.ant-menu-item:hover {
    background: #61a6a8 !important;
  }
`

export const StyledRow = styled(Row)`
  height: 64px;
`

export const StyledRowMenu = styled(Row)`
  padding-bottom: 15px;
  width: 100%;
  justify-content: space-between;
`

export const StyledExclamationCircleOutlined = styled(
  ExclamationCircleOutlined
)`
  font-size: 22px;
  color: #fbb437;
`
export const StyledColContainer = styled(Col)`
  text-align: center;
`

export const StyledAlert = styled(Alert)`
  text-align: center;
  margin-top: 20px;
`
