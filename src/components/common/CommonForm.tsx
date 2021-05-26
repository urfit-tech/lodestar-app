import { Input as ChakraInput, InputProps } from '@chakra-ui/react'
import React from 'react'
import styled, { css } from 'styled-components'

const StyledInput = styled(ChakraInput)<{ isSuccess: true }>`
  && {
    ${props =>
      props.isSuccess &&
      css`
        border-color: var(--success);
        box-shadow: 0 0 0 1px var(--success);
      `}
  }
`

const Input: React.VFC<{ status?: 'error' | 'validating' | 'success' } & InputProps> = ({ status, ...inputProps }) => {
  return (
    <StyledInput
      isInvalid={status === 'error'}
      isDisabled={status === 'validating'}
      isSuccess={status === 'success'}
      focusBorderColor="primary.500"
      errorBorderColor="danger.500"
      {...inputProps}
    />
  )
}

export { Input }
