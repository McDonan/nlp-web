import React from 'react'
import { Link } from 'react-router-dom'
import {
  StyledSpan,
  StyledSpanBold,
  StyledTitle,
  StyledColLogoContainer,
} from '../StyledComponents'

const HeaderLogo = () => {
  return (
    <StyledColLogoContainer span={5}>
      <StyledTitle level={4}>
        <Link to="/">
          <StyledSpanBold color="#61a6a8">K</StyledSpanBold>
          <StyledSpan color="#61a6a8">NLP </StyledSpan>
          <StyledSpan color="#ffffff">Chatbot Training</StyledSpan>
        </Link>
      </StyledTitle>
    </StyledColLogoContainer>
  )
}

export default HeaderLogo
