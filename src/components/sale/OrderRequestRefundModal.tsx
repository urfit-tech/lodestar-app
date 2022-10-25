import {
  Box,
  Button,
  Checkbox,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import ProductTypeLabel from 'lodestar-app-element/src/components/labels/ProductTypeLabel'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { sum } from 'ramda'
import { useEffect, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { handleError } from '../../helpers'
import { codeMessages, commonMessages } from '../../helpers/translation'
import { OrderDiscountProps } from '../../types/checkout'
import { ProductType } from '../../types/product'

const messages = defineMessages({
  requestRefund: { id: 'order.OrderRequestRefundModal.requestRefund', defaultMessage: '申請退款' },
  type: { id: 'order.OrderRequestRefundModal.type', defaultMessage: '類別' },
  itemName: { id: 'order.OrderRequestRefundModal.itemName', defaultMessage: '項目名稱' },
  refundPrice: { id: 'order.OrderRequestRefundModal.refundPrice', defaultMessage: '退款金額' },
  listPrice: { id: 'order.OrderRequestRefundModal.listPrice', defaultMessage: '售價' },
  totalPrice: { id: 'order.OrderRequestRefundModal.totalPrice', defaultMessage: '總金額' },
  totalRefundPrice: { id: 'order.OrderRequestRefundModal.totalRefundPrice', defaultMessage: '退款總額' },
})

type RefundOrderList = {
  orderId: string
  orderProducts: {
    id: string
    refundPrice: number
    refundable: boolean
    refundDesc: string
  }[]
}

const OrderRequestRefundModal: React.VFC<{
  orderId: string
  orderProducts: {
    id: string
    name: string
    price: number
    startedAt: Date | null
    endedAt: Date | null
    product: {
      id: string
      type: ProductType
    }
    quantity: number
    currencyId: string
  }[]
  orderDiscounts: OrderDiscountProps[]
  totalPrice: number
  onRefetch?: () => void
}> = ({ orderId, orderProducts, orderDiscounts, totalPrice, onRefetch }) => {
  const { settings } = useApp()
  const theme = useAppTheme()
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { authToken } = useAuth()
  const [refundIds, setRefundIds] = useState<string[]>([])
  const [refundableChecking, setRefundableChecking] = useState(false)
  const [refundableProducts, setRefundableProducts] = useState<RefundOrderList['orderProducts']>([])
  const [refunding, setRefunding] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }
    setRefundableChecking(true)
    axios
      .get<{
        code: string
        message: string
        result: {
          orderId: string
          orderProducts: {
            id: string
            refundPrice: number
            refundable: boolean
            message?: string
          }[]
        }
      }>(`${process.env.REACT_APP_API_BASE_ROOT}/order/detail/${orderId}`, {
        headers: { authorization: `Bearer ${authToken}` },
      })
      .then(({ data: { code, message, result } }) => {
        if (code === 'SUCCESS') {
          setRefundableProducts(
            result.orderProducts
              .filter(v => v.refundable)
              .map(v => ({
                id: v.id,
                refundPrice: v.refundPrice,
                refundable: v.refundable,
                refundDesc: v.message || '',
              })),
          )
        } else {
          throw new Error(code)
        }
      })
      .catch(handleError)
      .finally(() => setRefundableChecking(false))
  }, [authToken, orderId, isOpen])

  const handleRequestRefund = () => {
    if (!refundIds.length) {
      return
    }
    setRefunding(true)
    axios
      .post<{
        code: string
        message: string
        result: string
      }>(
        `${process.env.REACT_APP_API_BASE_ROOT}/payment/refund`,
        {
          orderId,
          refundOrderProducts: refundableProducts.filter(product => refundIds.includes(product.id)),
        },
        {
          headers: { authorization: `Bearer ${authToken}` },
        },
      )
      .then(({ data: { code } }) => {
        if (code === 'SUCCESS') {
          onRefetch?.()
          onClose()
        } else {
          throw new Error(code)
        }
      })
      .catch((error: Error) => {
        const code = error.message as keyof typeof codeMessages
        toast({
          title: formatMessage(codeMessages[code]),
          status: 'error',
          duration: 3000,
          isClosable: false,
          position: 'top',
        })
      })
      .finally(() => setRefunding(false))
  }

  return (
    <>
      {settings['order.apply_refund.enabled'] === 'true' && (
        <Button
          onClick={onOpen}
          variant="outline"
          _hover={{
            color: theme.colors.primary[500],
            borderColor: theme.colors.primary[500],
          }}
        >
          {formatMessage(messages.requestRefund)}
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minWidth="60%">
          <ModalHeader>{formatMessage(messages.requestRefund)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table size="lg">
              <Thead>
                <Tr>
                  <Th />
                  <Th>{formatMessage(messages.type)}</Th>
                  <Th>{formatMessage(messages.itemName)}</Th>
                  <Th isNumeric>{formatMessage(messages.refundPrice)}</Th>
                  <Th isNumeric>{formatMessage(messages.listPrice)}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orderProducts.map(orderProduct => {
                  const isRefundable = !!refundableProducts.find(product => product.id === orderProduct.id)
                  const refundPrice =
                    refundableProducts.find(product => product.id === orderProduct.id)?.refundPrice || 0
                  return (
                    <Tr id={orderProduct.id} key={orderProduct.id} color={!isRefundable ? '#cdcdcd' : ''}>
                      <Td>
                        <Checkbox
                          isDisabled={!isRefundable}
                          size="lg"
                          colorScheme="primary"
                          isChecked={refundIds.includes(orderProduct.id)}
                          onChange={e => {
                            e.target.checked
                              ? setRefundIds([orderProduct.id, ...refundIds])
                              : setRefundIds(refundIds.filter(w => w !== orderProduct.id))
                          }}
                        />
                      </Td>

                      <Td>
                        {orderProduct.product.type ? (
                          <span>
                            <ProductTypeLabel productType={orderProduct.product.type} />
                          </span>
                        ) : (
                          <span>{formatMessage(commonMessages.unknown.type)}</span>
                        )}
                      </Td>
                      <Td>{orderProduct.name}</Td>
                      <Td isNumeric color={theme.colors.primary[500]}>
                        {refundPrice}
                      </Td>
                      <Td isNumeric>{orderProduct.price}</Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>

            <Box p="1.5rem">
              {orderDiscounts.map(orderDiscount => (
                <Flex key={orderDiscount.name}>
                  <Box flex="1" />
                  <Box mr="1.5rem">{orderDiscount.name}</Box>
                  <PriceLabel listPrice={-orderDiscount.price} />
                </Flex>
              ))}

              <Flex>
                <Box flex="1" />
                <Box mr="24px">{formatMessage(messages.totalPrice)}</Box>
                <PriceLabel listPrice={totalPrice} />
              </Flex>
            </Box>

            <Box p="24px" bg="#f7f8f8" w="100%" textAlign="center" color={theme.colors.primary[500]} fontWeight="bold">
              {formatMessage(messages.totalRefundPrice)}
              <PriceLabel
                listPrice={sum(
                  refundableProducts
                    .filter(product => refundIds.includes(product.id))
                    ?.map(product => product.refundPrice) || [],
                )}
              />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={refundableChecking || refunding}
              disabled={refundIds.length === 0}
              colorScheme="primary"
              w="100%"
              onClick={() => handleRequestRefund()}
            >
              {formatMessage(messages.requestRefund)}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default OrderRequestRefundModal
