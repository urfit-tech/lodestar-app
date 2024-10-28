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
import { ascend, defaultTo, path, prop, sortWith } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useMembershipCardTerms } from '../../hooks/membershipCardTerms'
import { MembershipCardTermsModalProps, MembershipCardTermsProductType } from '../../types/membershipCard'
import membershipCardMessages from './translation'

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
const MembershipCardTermsModal: React.FC<MembershipCardTermsModalProps> = ({
  isOpen,
  onClose,
  title,
  membershipCardId,
}) => {
  const { cardTerm } = useMembershipCardTerms(membershipCardId)
  const { formatMessage } = useIntl()

  const renderProductType = (productType: MembershipCardTermsProductType) => {
    return membershipCardMessages.MembershipCardDiscount[productType]
      ? formatMessage(membershipCardMessages.MembershipCardDiscount[productType])
      : productType
  }

  const renderDiscount = (discount: { type: string; amount: number }) => {
    switch (discount.type) {
      case 'cash':
        return `${formatMessage(membershipCardMessages.MembershipCardDiscount.cashDiscount, {
          amount: `${discount.amount}`,
        })}`
      case 'percentage':
        return `${formatMessage(membershipCardMessages.MembershipCardDiscount.percentageDiscount, {
          amount: `${discount.amount}`,
        })}`
      case 'equity':
        return `${formatMessage(membershipCardMessages.MembershipCardDiscount.equityType)}`
      default:
        return `${formatMessage(membershipCardMessages.MembershipCardDiscount.generalDiscount)} ${discount.amount}`
    }
  }

  const generateProductLink = (details: {
    productName: string
    id: string
    creatorId?: string
    mainProductId?: string
  }) => {
    switch (details.productName) {
      case 'ActivityTicket':
        return `/activities/${details.id}`
      case 'ProgramPlan':
        return `/programs/${details.id}?visitIntro=1`
      case 'ProgramPackagePlan':
        return `/program-packages/${details.id}`
      case 'PodcastProgram':
        return `/podcasts?scrollTo=${details.id}`
      case 'PodcastPlan':
        return `/creators/${details.creatorId}?tabkey=podcasts`
      case 'AppointmentPlan':
        return `/creators/${details.creatorId}?tabkey=appointments&appointment_plan=${details.id}`
      case 'MerchandiseSpec':
        return `/merchandises/${details.mainProductId}`
      case 'ProjectPlan':
        return `/projects/${details.mainProductId}`
      default:
        return '/'
    }
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent
        maxW={{ base: '90%', sm: '70%', md: '60%', lg: '50%' }}
        pt="20px"
        pb="40px"
        py="30px"
        maxH="100%"
        overflow="scroll"
      >
        <ModalHeader>{title}</ModalHeader>
        <StyledModalHeader>
          {formatMessage(membershipCardMessages.MembershipCardDiscount.discountTerms)}
        </StyledModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <StyledTable variant="simple">
            <Thead>
              <Tr>
                <StyledTableTh>{formatMessage(membershipCardMessages.MembershipCardDiscount.type)}</StyledTableTh>
                <StyledTableTh>
                  {formatMessage(membershipCardMessages.MembershipCardDiscount.discountName)}
                </StyledTableTh>
                <StyledTableTh>
                  {formatMessage(membershipCardMessages.MembershipCardDiscount.discountType)}
                </StyledTableTh>
              </Tr>
            </Thead>
            <Tbody>
              {sortWith(
                [
                  ascend(discount => defaultTo('', prop('type', discount))),
                  ascend(discount => defaultTo('', path(['product', 'type'], discount))),
                ],
                cardTerm?.cardDiscounts.filter(discount => !!discount.product.details) || [],
              ).map(discount => {
                const discountProductId = discount?.product?.details?.productId
                const discountProductType = discount?.product?.type as MembershipCardTermsProductType
                const discountProductPlanName = discount?.product?.details?.productPlanName
                const discountProductName = discount?.product?.details?.productName
                const discountName = `${discount.product.details?.mainProduct?.title ?? discountProductName}${
                  discountProductPlanName
                    ? ` - ${discountProductPlanName}`
                    : discount.product.details?.mainProduct?.title
                    ? ` - ${discountProductName}`
                    : ''
                }`
                return (
                  <Tr key={discount.id}>
                    <Td>{renderProductType(discountProductType)}</Td>
                    <Td>
                      <a
                        href={generateProductLink({
                          productName: discountProductType,
                          id: discountProductId as string,
                          creatorId: discount.product.details?.creatorId,
                          mainProductId: discount.product.details?.mainProduct?.id,
                        })}
                        onClick={() => console.log()}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {discountName}
                      </a>
                    </Td>
                    <Td>{renderDiscount(discount)}</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </StyledTable>
        </ModalBody>
        <StyledModalHeader>
          {formatMessage(membershipCardMessages.MembershipCardDiscount.usageDescription)}
        </StyledModalHeader>
        <ModalBody>{cardTerm?.description}</ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default MembershipCardTermsModal
