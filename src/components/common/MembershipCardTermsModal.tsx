import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table as ChakraTable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { useMembershipCardTerms } from '../../hooks/membershipCardTerms'

interface MembershipCardTermsModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  id: string
}

type ProductType = 'ActivityTicket' | 'ProgramPlan' | 'ProgramPackagePlan' | 'PodcastProgram'

const messages = defineMessages({
  ActivityTicket: { id: 'common.membershipCardTerm.activityTicket', defaultMessage: '活動' },
  ProgramPlan: { id: 'common.membershipCardTerm.program', defaultMessage: '課程' },
  ProgramPackagePlan: { id: 'common.membershipCardTerm.programPackage', defaultMessage: '課程組合' },
  PodcastProgram: { id: 'common.membershipCardTerm.podcastProgram', defaultMessage: '廣播' },
  cashDiscount: { id: 'common.membershipCardTerm.cashDiscount', defaultMessage: '折抵金額' },
  percentageDiscount: { id: 'common.membershipCardTerm.percentageDiscount', defaultMessage: '折抵比例' },
  generalDiscount: { id: 'common.membershipCardTerm.generalDiscount', defaultMessage: '折抵' },
  type: { id: 'common.membershipCardTerm.type', defaultMessage: '類型' },
  discountName: { id: 'common.membershipCardTerm.discountName', defaultMessage: '名稱' },
  discountType: { id: 'common.membershipCardTerm.discountType', defaultMessage: '優惠類型' },
  equityType: { id: 'common.membershipCardTerm.equityType', defaultMessage: '權益開通' },
})

const StyledTable = styled(ChakraTable)`
  && {
    font-size: 16px;
  }
  a {
    color: #4c5b8f;
  }
  .th-type {
    font-size: 16px;
    color: #585858;
    font-weight: bold;
  }
`

const StyledModalHeader = styled(ModalHeader)`
  && {
    font-size: 16px;
  }
`

const MembershipCardTermsModal: React.FC<MembershipCardTermsModalProps> = ({ isOpen, onClose, title, id }) => {
  const { cards } = useMembershipCardTerms(id)
  const { formatMessage } = useIntl()

  const renderProductType = (productType: string) => {
    return messages[productType as ProductType] ? formatMessage(messages[productType as ProductType]) : productType
  }

  const renderDiscount = (discount: { type: string; amount: number }) => {
    switch (discount.type) {
      case 'cash':
        return `${formatMessage(messages.cashDiscount)} ${discount.amount}`
      case 'percentage':
        return `${formatMessage(messages.percentageDiscount)} ${discount.amount}%`
      case 'equity':
        return `${formatMessage(messages.equityType)}`
      default:
        return `${formatMessage(messages.generalDiscount)} ${discount.amount}`
    }
  }

  const generateProductLink = (details: { productName: string; id: string }) => {
    switch (details.productName) {
      case 'ActivityTicket':
        return `/activities/${details.id}`
      case 'ProgramPlan':
        return `/programs/${details.id}`
      case 'ProgramPackagePlan':
        return `/program-packages/${details.id}`
      case 'PodcastProgram':
        return `/podcasts/${details.id}`
      default:
        return '/'
    }
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent maxW={{ base: '80%', sm: '70%', md: '60%', lg: '40%' }} pt="20px" pb="40px" py="30px">
        <ModalHeader>{title}</ModalHeader>
        <StyledModalHeader>優惠條件</StyledModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div style={{ overflowX: 'auto' }}>
            <StyledTable variant="simple">
              <Thead>
                <Tr>
                  <Th className="th-type">{formatMessage(messages.type)}</Th>
                  <Th className="th-type">{formatMessage(messages.discountName)}</Th>
                  <Th className="th-type">{formatMessage(messages.discountType)}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cards?.card_discounts?.map(discount => (
                  <Tr key={discount.id}>
                    <Td>{renderProductType(discount?.product?.type)}</Td>
                    <Td>
                      <a
                        href={generateProductLink({
                          productName: discount?.product?.type as string,
                          id: discount?.product?.details?.productId as string,
                        })}
                      >
                        {discount?.product?.details?.productPlanName
                          ? `${discount?.product?.details?.productName} - ${discount?.product?.details?.productPlanName}`
                          : discount?.product?.details?.productName}
                      </a>
                    </Td>
                    <Td>{renderDiscount(discount)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </StyledTable>
          </div>
        </ModalBody>
        <StyledModalHeader>使用描述</StyledModalHeader>
        <ModalBody>{cards?.description}</ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default MembershipCardTermsModal
