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
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useMembershipCardTerms } from '../../hooks/membershipCardTerms'
import commonMessages from './translation'

interface MembershipCardTermsModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  id: string
}

type ProductType = 'ActivityTicket' | 'ProgramPlan' | 'ProgramPackagePlan' | 'PodcastProgram'

const StyledTable = styled(ChakraTable)`
  && {
    font-size: 14px;
  }
  a {
    color: #4c5b8f;
  }
  .th-type {
    font-size: 14px;
    color: #585858;
    font-weight: bold;
  }
`

const StyledModalHeader = styled(ModalHeader)`
  && {
    font-size: 16px;
  }
`
const StyledTableTh = styled(Th)`
  && {
    font-size: 14px;
    color: #585858;
    font-weight: bold;
  }
`
const MembershipCardTermsModal: React.FC<MembershipCardTermsModalProps> = ({ isOpen, onClose, title, id }) => {
  const { cards } = useMembershipCardTerms(id)
  const { formatMessage } = useIntl()

  const renderProductType = (productType: string) => {
    return commonMessages.MembershipCardTermsModal[productType as ProductType]
      ? formatMessage(commonMessages.MembershipCardTermsModal[productType as ProductType])
      : productType
  }

  const renderDiscount = (discount: { type: string; amount: number }) => {
    switch (discount.type) {
      case 'cash':
        return `${formatMessage(commonMessages.MembershipCardTermsModal.cashDiscount)} ${discount.amount}`
      case 'percentage':
        return `${formatMessage(commonMessages.MembershipCardTermsModal.percentageDiscount)} ${discount.amount}%`
      case 'equity':
        return `${formatMessage(commonMessages.MembershipCardTermsModal.equityType)}`
      default:
        return `${formatMessage(commonMessages.MembershipCardTermsModal.generalDiscount)} ${discount.amount}`
    }
  }

  const generateProductLink = (details: { productName: string; id: string }) => {
    switch (details.productName) {
      case 'ActivityTicket':
        return `/activities/${details.id}`
      case 'ProgramPlan':
        return `/programs/${details.id}?visitIntro=1`
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
      <ModalContent maxW={{ base: '90%', sm: '70%', md: '60%', lg: '45%' }} pt="20px" pb="40px" py="30px">
        <ModalHeader>{title}</ModalHeader>
        <StyledModalHeader>{formatMessage(commonMessages.MembershipCardTermsModal.discountTerms)}</StyledModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <StyledTable variant="simple">
            <Thead>
              <Tr>
                <StyledTableTh>{formatMessage(commonMessages.MembershipCardTermsModal.type)}</StyledTableTh>
                <StyledTableTh>{formatMessage(commonMessages.MembershipCardTermsModal.discountName)}</StyledTableTh>
                <StyledTableTh>{formatMessage(commonMessages.MembershipCardTermsModal.discountType)}</StyledTableTh>
              </Tr>
            </Thead>
            <Tbody>
              {cards?.card_discounts?.map(discount => (
                <Tr key={discount.id}>
                  <Td>{renderProductType(discount?.product?.type)}</Td>
                  <Td>
                    <a
                      href={generateProductLink({
                        productName: discount?.product?.type,
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
        </ModalBody>
        <StyledModalHeader>{formatMessage(commonMessages.MembershipCardTermsModal.usageDescription)}</StyledModalHeader>
        <ModalBody>{cards?.description}</ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default MembershipCardTermsModal
