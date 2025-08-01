import { Button } from '@chakra-ui/react'
import styled from 'styled-components'
import { colors } from './style'

export const SecondaryEnrollButton = styled(Button).attrs({
  colorScheme: 'secondary',
})`
  && {
    width: 100%;
    height: 45px;
    border-radius: 21.5px;
    font-weight: 600;
  }
`

export const SecondaryOutlineButton = styled(Button)`
  && {
    width: 100%;
    height: 45px;
    font-weight: 600;
    border-radius: 21.5px;
    border: solid 1px #fff;
  }
`

export const SecondaryCartButton = styled(Button)`
  && {
    width: 100%;
    height: 45px;
    font-weight: 600;
    border-radius: 21.5px;
    border: solid 1px #cdcdcd;
    background: ${colors.white};
    color: ${colors.gray1};
  }
`
