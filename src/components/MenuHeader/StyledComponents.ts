import styled from 'styled-components'
import { Col, Typography, Menu, Row } from 'antd'

const { Title } = Typography

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
