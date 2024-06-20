import { Icon, useDisclosure } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import React from 'react'
import { AiOutlineCalendar } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import MembershipCard from '../common/MembershipCard'
import MembershipCardTermsModal from './MembershipCardTermsModal'

const StyledCardContainer = styled.div`
  min-width: 100px;
  margin-bottom: 2rem;
`
const StyledTitle = styled.h1`
  margin-bottom: 0.75rem;
  overflow: hidden;
  color: #585858;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.3;
  letter-spacing: 0.77px;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const StyledSubTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  letter-spacing: 0.18px;
  .expire {
    display: flex;
    align-items: center;
  }
  .discountTerm {
    color: #4c5b8f;
  }
`

const MembershipCardBlock: React.VFC<{
  template: string
  templateVars?: any
  title: string
  expiredAt?: Date
  description?: string
  variant?: string
  membershipCardId: string
}> = ({ template, templateVars, title, expiredAt, description, variant, membershipCardId }) => {
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (variant === 'list-item') {
    return (
      <div className="d-flex justify-content-between">
        <div className="flex-grow-1">
          <StyledTitle>{title}</StyledTitle>
          {description && <BraftContent>{description}</BraftContent>}
        </div>
        <StyledCardContainer className="m-0 ml-5">
          <MembershipCard template={template} templateVars={templateVars} />
        </StyledCardContainer>
      </div>
    )
  }

  return (
    <div>
      <StyledCardContainer>
        <MembershipCard template={template} templateVars={templateVars} />
      </StyledCardContainer>

      <StyledTitle>{title}</StyledTitle>

      <StyledSubTitle>
        <div className="expire">
          <Icon as={AiOutlineCalendar} className="mr-2" />
          {expiredAt
            ? formatMessage(
                { id: 'common.expiredTime', defaultMessage: '{expiredTime} 止' },
                {
                  expiredTime: dayjs(expiredAt).format('YYYY/MM/DD'),
                },
              )
            : formatMessage(commonMessages.content.noPeriod)}
        </div>

        <button className="discountTerm" onClick={onOpen}>
          {formatMessage(commonMessages.defaults.discountTerms)}
        </button>
      </StyledSubTitle>
      <MembershipCardTermsModal membershipCardId={membershipCardId} title={title} isOpen={isOpen} onClose={onClose} />
    </div>
  )
}

export default MembershipCardBlock
