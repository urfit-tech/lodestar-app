import { Button } from '@chakra-ui/react'
import styled from 'styled-components'

export const SecondaryEnrollButton = styled(Button)`
  && {
    width: 100%;
    height: 45px;
    border-radius: 21.5px;
    background-color: #ff2f1a;
    font-weight: 600;
    color: white;
    &&:hover {
      color: #585858;
    }
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
  &&:hover {
    background: #585858;
  }
`

export const SecondaryCartButton = styled(Button)`
  && {
    width: 100%;
    height: 45px;
    font-weight: 600;
    border-radius: 21.5px;
    border: solid 1px #cdcdcd;
    background: white;
    color: #585858;
  }
  &&:hover {
    background: #585858;
    color: white;
  }
`
