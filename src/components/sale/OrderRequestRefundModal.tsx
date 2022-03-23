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
} from '@chakra-ui/react'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'
import { OrderDiscountProps } from '../../types/checkout'
import { ProductType } from '../../types/product'
import PriceLabel from '../common/PriceLabel'
import ProductTypeLabel from '../common/ProductTypeLabel'

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
    orderProductId: string
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
}> = ({ orderId, orderProducts, orderDiscounts, totalPrice }) => {
  const theme = useAppTheme()
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [refundIds, setRefundIds] = useState<string[]>([])

  const handleRequestRefund = () => {}

  return (
    <>
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
                {orderProducts.map(orderProduct => (
                  <Tr
                    id={orderProduct.id}
                    key={orderProduct.id}
                    // TODO: get product refund info then distinguish
                    // color={orderProduct.refundable ? '#cdcdcd' : ''}
                  >
                    <Td>
                      <Checkbox
                        // TODO: get product refund info then distinguish
                        // disabled={orderProduct.refundable}
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
                      {/* {orderProduct.refundPrice} */}
                    </Td>
                    <Td isNumeric>{orderProduct.price}</Td>
                  </Tr>
                ))}
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
                // TODO: get the total refund price then calculate
                listPrice={0}
              />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
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
