import {
  Button,
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
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useMembershipCardTerms } from '../../hooks/membershipCardTerms'

interface MembershipCardTermsModalProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
  title: string
  id: string
}

const MembershipCardTermsModal: React.FC<MembershipCardTermsModalProps> = ({ isOpen, onClose, onOpen, title, id }) => {
  const { data } = useMembershipCardTerms(id)

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent maxW={{ base: '80%', sm: '70%', md: '60%', lg: '40%' }}>
        <ModalHeader>{title}</ModalHeader>
        <ModalHeader>優惠條件</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div style={{ overflowX: 'auto' }}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Column 1</Th>
                  <Th>Column 2</Th>
                  <Th>Column 3</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Data 1</Td>
                  <Td>Data 2</Td>
                  <Td>Data 3</Td>
                </Tr>
                <Tr>
                  <Td>Data 4</Td>
                  <Td>Data 5</Td>
                  <Td>Data 6</Td>
                </Tr>
                <Tr>
                  <Td>Data 7</Td>
                  <Td>Data 8</Td>
                  <Td>Data 9</Td>
                </Tr>
              </Tbody>
            </Table>
          </div>
        </ModalBody>
        <ModalHeader>使用描述</ModalHeader>
        <ModalBody>
          <span>
            ★折價券使用須知
            <br />
            ①
            折價券使用是以券號為依據，不限使用會員身分，故請妥善保管折價券號；為維護自身權益，以確保該折價券為您本人使用。
            <br />
            ② 折價券使用是以每筆訂單為單位，每筆訂單限使用一張折價券，不可與紅利點數或是其他優惠方案合併使用。
            <br />
            ③ 每張折價券包含券號、活動規則及使用效期，提醒您於使用效期前使用，逾期則視為棄權。
            <br />
            ④
            折價券一經使用立即失效，若事後取消訂單或辦理退貨，僅會退還您實際所支付的金額，不再補發折價券，折價券也不得重複使用。
            <br />
            ★注意事項
            <br />
            ① 結帳時，若有紅利點數折抵優惠，可選擇【折價券折抵】或【點數折抵】(二擇一)，單筆訂單只可使用一種優惠折抵。
            <br />
            ② 不得折抵現金，逾期無效，不再補發。
            <br />
            ③ 折價券不再另開立發票，發票金額以該訂單「購買時實際支付的金額」來計算。
            <br />
            ④ 折價券不得兌換現金、找零或折換其他贈品，恕無法抵扣運費。
            <br />
            ⑤ 折價券為贈品，係屬無償取得，不適用商品（服務）禮券記載之規範。
            <br />⑥ 本學會有權決定終止及變更折價券贈送辦法及折抵方式的權利。
          </span>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default MembershipCardTermsModal
