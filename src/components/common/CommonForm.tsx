import { Icon } from '@chakra-ui/icons'
import { Input as ChakraInput, InputGroup, InputProps, InputRightElement } from '@chakra-ui/react'
import React from 'react'
import styled, { css } from 'styled-components'
import { ReactComponent as CheckCircleIcon } from '../../images/checked-circle.svg'
import { ReactComponent as ExclamationCircleIcon } from '../../images/exclamation-circle.svg'

type Status = 'error' | 'validating' | 'success'

// Todo: Can move Input style to lodestar-app-element but must check Input used components.

const StyledInput = styled(ChakraInput)<{ variants: Status }>`
  && {
    ${props =>
      props.variants === 'success' &&
      css`
        border-color: var(--success);
        box-shadow: 0 0 0 1px var(--success);
      `}
  }
`

const StyledInputRightElement = styled(InputRightElement)<{ variants: Status }>`
  && {
    font-size: 20px;
    ${props =>
      props.variants === 'success' &&
      css`
        color: var(--success);
      `}
    ${props =>
      props.variants === 'error' &&
      css`
        color: var(--error);
      `}
  }
`

const Input: React.VFC<
  {
    status?: Status
  } & InputProps
> = ({ status, ...inputProps }) => {
  const icon = {
    success: CheckCircleIcon,
    error: ExclamationCircleIcon,
    validating: undefined,
  }

  return (
    <InputGroup>
      <StyledInput variants={status} focusBorderColor="primary.500" errorBorderColor="danger.500" {...inputProps} />
      {status && icon[status] && <StyledInputRightElement variants={status} children={<Icon as={icon[status]} />} />}
    </InputGroup>
  )
}

export { Input }
