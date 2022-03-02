import {
  Button,
  Checkbox,
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
import { useState } from 'hoist-non-react-statics/node_modules/@types/react'

const RequestRefundModal: React.VFC<{ orderId: string }> = ({ orderId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [refundIds, setRefundIds] = useState<string[]>([])

  return (
    <>
      <Button onClick={onOpen}>申請退款</Button>

      <Modal isOpen={isOpen} size="xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>申請退款</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table>
              <Thead>
                <Tr>
                  <Th />
                  <Th>類別</Th>
                  <Th>項目名稱</Th>
                  <Th isNumeric>退款金額</Th>
                  <Th>售價</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr id="orderId_123">
                  <Td>
                    <Checkbox
                      isChecked={refundIds.includes('orderId_123')}
                      onChange={e =>
                        setRefundIds(
                          refundIds.includes('orderId_123')
                            ? refundIds.filter(v => v !== 'orderId_123')
                            : ['orderId_123', ...refundIds],
                        )
                      }
                    />
                  </Td>
                  <Td>類別</Td>
                  <Td>項目名稱</Td>
                  <Td isNumeric>退款金額</Td>
                  <Td>售價</Td>
                </Tr>
              </Tbody>
            </Table>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="primary" w="100%" onClick={onClose}>
              申請退款
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default RequestRefundModal
