import { Button, Icon as ChakraIcon } from '@chakra-ui/react'
import { Spin } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import jwt from 'jsonwebtoken'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { AuthModalContext } from '../../components/auth/AuthModal'
import { BREAK_POINT } from '../../components/common/Responsive'
import DefaultLayout from '../../components/layout/DefaultLayout'
import { rgba } from '../../helpers'
import { useAuthModal } from '../../hooks/auth'
import { ReactComponent as GiftIcon } from '../../images/gift.svg'
import { ReactComponent as AlertIcon } from '../../images/status-alert.svg'
import { ReactComponent as SuccessIcon } from '../../images/status-success.svg'
import { ApiResponse } from '../../types/general'
import GroupBuyingReceivedPageMessages from './translation'

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

const GroupBuyingReceivedPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const [token] = useQueryParam('token', StringParam)
  const [type] = useQueryParam('type', StringParam)
  const { isAuthenticated, currentMemberId, authToken } = useAuth()
  const authModal = useAuthModal()
  const { setVisible } = useContext(AuthModalContext)
  const [sendingState, setSendingState] = useState<'idle' | 'loading' | 'success' | 'failed' | 'transferred'>('idle')
  const [payload, setPayload] = useState<{
    appId: string
    email: string
    orderId: string
    orderProductId: string
    title: string
    ownerName: string
    exp: number
  } | null>(null)
  const { isLoading, orderLog } = useGetOrderLog(payload?.orderId, authToken || '')
  const productWording: () => { idleTitle: string; name: string; successMessage: string } = () => {
    switch (type) {
      case 'ProgramPlan':
        return { idleTitle: '你已收到一堂課程', name: '課程', successMessage: '現在你可使用課程囉！' }
      case 'ActivityTicket':
        return { idleTitle: '你已收到一張票券', name: '票券', successMessage: '接下來就可以參與活動囉！' }
      default:
        return { idleTitle: '你已收到一個商品', name: '商品', successMessage: '現在你可使用產品囉！' }
    }
  }
  const handleAuthButtonClick = () => {
    authModal.open(setVisible)
  }
  useEffect(() => {
    if (!token) {
      return
    }
    try {
      const tmpPayload = jwt.decode(token) as any
      if (
        !tmpPayload ||
        !tmpPayload?.appId ||
        !tmpPayload?.email ||
        !tmpPayload?.orderLogId ||
        !tmpPayload?.orderProductId ||
        !tmpPayload?.title ||
        !tmpPayload?.ownerName ||
        !tmpPayload?.exp
      ) {
        return
      }
      setPayload({
        appId: tmpPayload.appId,
        email: tmpPayload.email,
        orderId: tmpPayload.orderLogId,
        orderProductId: tmpPayload.orderProductId,
        title: tmpPayload.title,
        ownerName: tmpPayload.ownerName,
        exp: tmpPayload.exp,
      })
      if (tmpPayload.exp < Math.floor(Date.now() / 1000)) setSendingState(() => 'failed')
      if (orderLog?.transferredAt) setSendingState(() => 'transferred')
      if (orderLog?.memberId === currentMemberId) setSendingState(() => 'success')
    } catch (error) {
      handleError(error)
    }
  }, [token, currentMemberId, authToken, orderLog])

  const handleSubmit = () => {
    setSendingState('loading')
    if (currentMemberId) {
      axios
        .put<ApiResponse>(
          `${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}/orders/transfer-received-order`,
          {
            token,
            memberId: currentMemberId,
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
        .catch(error => {
          handleError(error)
          setSendingState('failed')
        })
    }
  }

  const sendingStateOject = {
    idle: {
      Icon: (
        <StyledIcon className="mx-auto">
          <ChakraIcon as={GiftIcon} />
        </StyledIcon>
      ),
      buttonTitle: '確認領取',
      title: productWording().idleTitle,
      message: `來自 ${payload?.ownerName} 贈送的「${payload?.title}」的${productWording().name}，請於 ${dayjs(
        new Date((payload?.exp as number) * 1000 || 0),
      ).format('YYYY-MM-DD')} 前領取。`,
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
      title: `接收${productWording().name}`,
      message: `來自 ${payload?.ownerName} 贈送的「${payload?.title}」${payload?.exp}`,
      onClick: null,
    },
    success: {
      Icon: <ChakraIcon as={SuccessIcon} w="64px" h="64px" />,
      buttonTitle: '立即查看',
      title: `已收到${productWording().name}`,
      message: productWording().successMessage,
      onClick: () => history.push(`/members/${currentMemberId}`),
    },
    failed: {
      Icon: <ChakraIcon as={AlertIcon} w="64px" h="64px" />,
      buttonTitle: '回首頁',
      title: `超過領取效期`,
      message: `${productWording().name}已超過領取效期，請與 ${payload?.ownerName} 聯繫。`,
      onClick: () => history.push('/'),
    },
    transferred: {
      Icon: <ChakraIcon as={AlertIcon} w="64px" h="64px" />,
      buttonTitle: '回首頁',
      title: `該項目已被領取`,
      message: `該項目已被領取，請與 ${payload?.ownerName} 聯繫。`,
      onClick: () => history.push('/'),
    },
  }

  return (
    <DefaultLayout noFooter centeredBox>
      <StyledContainer>
        <div className="mb-4">{sendingStateOject[sendingState].Icon}</div>
        {isLoading ? (
          <Spin />
        ) : payload ? (
          <>
            <StyledTitle>{sendingStateOject[sendingState].title}</StyledTitle>
            <StyledItemInfo>{sendingStateOject[sendingState].message}</StyledItemInfo>
            <Button w="150px" variant="primary" isLoading={sendingState === 'loading'} onClick={handleAuthButtonClick}>
              {sendingStateOject[sendingState].buttonTitle}
            </Button>
          </>
        ) : (
          <>{formatMessage(GroupBuyingReceivedPageMessages['*'].noItem)}</>
        )}
      </StyledContainer>
    </DefaultLayout>
  )
}

export default GroupBuyingReceivedPage

const useGetOrderLog = (orderId: string | undefined, authToken: string) => {
  const [orderLog, setOrderLog] = useState<any>(null)
  const [error, setError] = useState<any>('')
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}/orders/${orderId}`,
          {
            headers: { authorization: `Bearer ${authToken}` },
          },
        )
        setOrderLog(() => response.data.result)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [orderId, authToken])

  return { isLoading, orderLog, error }
}
