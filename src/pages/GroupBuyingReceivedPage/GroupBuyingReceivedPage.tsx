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

const GroupBuyingReceivedContainer: React.VFC = () => {
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
        return {
          idleTitle: formatMessage(GroupBuyingReceivedPageMessages.productWording.receiveProgram),
          name: formatMessage(GroupBuyingReceivedPageMessages.productWording.programPlanName),
          successMessage: formatMessage(GroupBuyingReceivedPageMessages.productWording.availableProgram),
        }
      case 'ActivityTicket':
        return {
          idleTitle: formatMessage(GroupBuyingReceivedPageMessages.productWording.receiveTicket),
          name: formatMessage(GroupBuyingReceivedPageMessages.productWording.ticketName),
          successMessage: formatMessage(GroupBuyingReceivedPageMessages.productWording.availableActivity),
        }
      default:
        return {
          idleTitle: formatMessage(GroupBuyingReceivedPageMessages.productWording.receiveProduct),
          name: formatMessage(GroupBuyingReceivedPageMessages.productWording.productName),
          successMessage: formatMessage(GroupBuyingReceivedPageMessages.productWording.availableProduct),
        }
    }
  }
  const setAuthModalVisible = () => {
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
      buttonTitle: formatMessage(GroupBuyingReceivedPageMessages.productWording.confirmReceive),
      title: productWording().idleTitle,
      message: formatMessage(GroupBuyingReceivedPageMessages.productWording.idleMessage, {
        ownerName: payload?.ownerName,
        title: payload?.title,
        productName: productWording().name,
        expDate: dayjs(new Date((payload?.exp as number) * 1000 || 0)).format('YYYY-MM-DD'),
      }),
      onClick: () => {
        if (!isAuthenticated) {
          setAuthModalVisible()
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
      buttonTitle: formatMessage(GroupBuyingReceivedPageMessages.productWording.receiveNow),
      title: formatMessage(GroupBuyingReceivedPageMessages.productWording.receiveTitle, {
        productName: productWording().name,
      }),
      message: formatMessage(GroupBuyingReceivedPageMessages.productWording.loadingMessage, {
        ownerName: payload?.ownerName,
        title: payload?.title,
        exp: payload?.exp,
      }),
      onClick: null,
    },
    success: {
      Icon: <ChakraIcon as={SuccessIcon} w="64px" h="64px" />,
      buttonTitle: formatMessage(GroupBuyingReceivedPageMessages.productWording.viewNow),
      title: formatMessage(GroupBuyingReceivedPageMessages.productWording.successTitle, {
        productName: productWording().name,
      }),
      message: productWording().successMessage,
      onClick: () => history.push(`/members/${currentMemberId}`),
    },
    failed: {
      Icon: <ChakraIcon as={AlertIcon} w="64px" h="64px" />,
      buttonTitle: formatMessage(GroupBuyingReceivedPageMessages.productWording.backToHome),
      title: formatMessage(GroupBuyingReceivedPageMessages.productWording.expired),
      message: formatMessage(GroupBuyingReceivedPageMessages.productWording.failedMessage, {
        productName: productWording().name,
        ownerName: payload?.ownerName,
      }),
      onClick: () => history.push('/'),
    },
    transferred: {
      Icon: <ChakraIcon as={AlertIcon} w="64px" h="64px" />,
      buttonTitle: formatMessage(GroupBuyingReceivedPageMessages.productWording.backToHome),
      title: formatMessage(GroupBuyingReceivedPageMessages.productWording.itemReceived),
      message: formatMessage(GroupBuyingReceivedPageMessages.productWording.transferredMessage, {
        ownerName: payload?.ownerName,
      }),
      onClick: () => history.push('/'),
    },
  }

  return (
    <StyledContainer>
      <div className="mb-4">{sendingStateOject[sendingState].Icon}</div>
      {isLoading ? (
        <Spin />
      ) : payload ? (
        <>
          <StyledTitle>{sendingStateOject[sendingState].title}</StyledTitle>
          <StyledItemInfo>{sendingStateOject[sendingState].message}</StyledItemInfo>
          <Button
            w="150px"
            variant="primary"
            isLoading={sendingState === 'loading'}
            onClick={() => sendingStateOject[sendingState].onClick?.()}
          >
            {sendingStateOject[sendingState].buttonTitle}
          </Button>
        </>
      ) : (
        <>{formatMessage(GroupBuyingReceivedPageMessages['*'].noItem)}</>
      )}
    </StyledContainer>
  )
}

const GroupBuyingReceivedPage: React.VFC = () => {
  return (
    <DefaultLayout noFooter centeredBox>
      <GroupBuyingReceivedContainer />
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
