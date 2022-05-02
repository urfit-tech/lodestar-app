import { Button, Icon as ChakraIcon } from '@chakra-ui/react'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { AuthModalContext } from '../../components/auth/AuthModal'
import { BREAK_POINT } from '../../components/common/Responsive'
import DefaultLayout from '../../components/layout/DefaultLayout'
import { rgba } from '../../helpers'
import { ReactComponent as GiftIcon } from '../../images/gift.svg'
import { ReactComponent as AlertIcon } from '../../images/status-alert.svg'
import { ReactComponent as SuccessIcon } from '../../images/status-success.svg'
import { ApiResponse } from '../../types/general'
import redeemPageMessages from './translation'

const StyledContainer = styled.div`
  padding: 4rem 1rem;
  color: #585858;
  text-align: center;
  @media (min-width: ${BREAK_POINT}px) {
    padding: 4rem;
  }
`
const StyledTitle = styled.div`
  margin-bottom: 0.25rem;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.3;
  letter-spacing: 0.77px;
  color: var(--gray-darker);
`
const StyledItemInfo = styled.div`
  margin-bottom: 1rem;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2px;
  color: var(--gray-dark);
`
const StyledIcon = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  background: ${props => rgba(props.theme['@primary-color'], 0.1)};
  font-size: 2rem;
  border-radius: 50%;

  svg path {
    fill: ${props => props.theme['@primary-color']};
  }

  @media (min-width: ${BREAK_POINT}px) {
    display: flex;
  }
`

const RedeemPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const [token] = useQueryParam('token', StringParam)
  const { isAuthenticated, authToken } = useAuth()
  const [sendingState, setSendingState] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle')
  const [payload, setPayload] = useState<{
    type: string
    target: string
    ownerName: string
    title: string
  } | null>(null)

  useEffect(() => {
    if (!token) {
      return
    }
    try {
      const tmpPayload = jwt.decode(token) as any

      if (!tmpPayload || !tmpPayload?.type || !tmpPayload?.target || !tmpPayload?.owner?.name || !tmpPayload?.title) {
        return
      }
      setPayload({
        type: tmpPayload.type,
        target: tmpPayload.target,
        ownerName: tmpPayload.owner.name,
        title: tmpPayload.title,
      })
      if (tmpPayload.exp < Math.floor(Date.now() / 1000)) {
        setSendingState('failed')
      }
    } catch (error) {}
  }, [token])

  const handleSubmit = () => {
    setSendingState('loading')
    axios
      .post<ApiResponse>(
        `${process.env.REACT_APP_API_BASE_ROOT}/discount/redeem`,
        {
          token,
        },
        { headers: { authorization: `Bearer ${authToken}` } },
      )
      .then(({ data: { code } }) => {
        if (code === 'SUCCESS') {
          setSendingState('success')
        } else {
          setSendingState('failed')
        }
      })
      .catch(() => setSendingState('failed'))
  }

  // TODO discount type formate
  const discountTypeText = payload?.type === 'Voucher' ? '兌換券' : ''
  const sendingStateOject = {
    idle: {
      Icon: (
        <StyledIcon className="mx-auto">
          <ChakraIcon as={GiftIcon} />
        </StyledIcon>
      ),
      buttonTitle: '立即接收',
      title: `接收${discountTypeText}`,
      message: `來自 ${payload?.ownerName} 贈送的「${payload?.title}」${discountTypeText}`,
      onClick: (modalVisible?: (visible: boolean) => void) => {
        if (!isAuthenticated) {
          modalVisible?.(true)
        } else {
          handleSubmit()
        }
      },
    },
    loading: {
      Icon: (
        <StyledIcon className="mx-auto">
          <ChakraIcon as={GiftIcon} />
        </StyledIcon>
      ),
      buttonTitle: '立即接收',
      title: `接收${discountTypeText}`,
      message: `來自 ${payload?.ownerName} 贈送的「${payload?.title}」${discountTypeText}`,
      onClick: null,
    },
    success: {
      Icon: <ChakraIcon as={SuccessIcon} w="64px" h="64px" />,
      buttonTitle: '立即查看',
      title: `已收到${discountTypeText}`,
      message: `現在你可使用${discountTypeText}囉！`,
      onClick: () => history.push('/settings/voucher'),
    },
    failed: {
      Icon: <ChakraIcon as={AlertIcon} w="64px" h="64px" />,
      buttonTitle: '回首頁',
      title: `${discountTypeText}已失效`,
      message: `來自 ${payload?.ownerName} 贈送的「${payload?.title}」${discountTypeText}已失效`,
      onClick: () => history.push('/'),
    },
  }

  return (
    <DefaultLayout noFooter centeredBox>
      <StyledContainer>
        <div className="mb-4">{sendingStateOject[sendingState].Icon}</div>
        {payload ? (
          <>
            <StyledTitle>{sendingStateOject[sendingState].title}</StyledTitle>
            <StyledItemInfo>{sendingStateOject[sendingState].message}</StyledItemInfo>
            <AuthModalContext.Consumer>
              {({ setVisible: setAuthModalVisible }) => (
                <Button
                  w="150px"
                  variant="primary"
                  isLoading={sendingState === 'loading'}
                  onClick={() => sendingStateOject[sendingState].onClick?.(setAuthModalVisible)}
                >
                  {sendingStateOject[sendingState].buttonTitle}
                </Button>
              )}
            </AuthModalContext.Consumer>
          </>
        ) : (
          <>{formatMessage(redeemPageMessages['*'].noItem)}</>
        )}
      </StyledContainer>
    </DefaultLayout>
  )
}

export default RedeemPage
