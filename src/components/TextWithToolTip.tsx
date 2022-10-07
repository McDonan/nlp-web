import React from 'react'
import styled from 'styled-components'
import { Tooltip, Typography } from 'antd'

type Props = {
  text: string | number
  color?: string
}
type StyledTextProps = {
  color: string
  ref: React.ForwardedRef<HTMLElement>
}

const StyledText = styled(Typography.Text) <StyledTextProps>`
  color: ${(props: { color: string }) => props.color};
`

const TextWithToolTip = React.forwardRef<HTMLElement, Props>(
  ({ text, color = 'black' }: Props, ref): JSX.Element => {
    return (
      <Tooltip title={text} ref={ref}>
        <StyledText color={color} ellipsis={true} ref={ref}>
          {text}
        </StyledText>
      </Tooltip>
    )
  }
)

TextWithToolTip.displayName = 'TextWithToolTip'
export default TextWithToolTip
