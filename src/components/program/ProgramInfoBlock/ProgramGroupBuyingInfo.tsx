import { Icon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages } from '../../../helpers/translation'
import { useMember } from '../../../hooks/member'
import { ReactComponent as ArrowRightIcon } from '../../../images/angle-right.svg'
import { useAuth } from '../../auth/AuthContext'
import CheckoutProductModal from '../../checkout/CheckoutProductModal'
import PriceLabel from '../../common/PriceLabel'

const StyledTitle = styled.span`
  font-family: NotoSansCJKtc;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.57;
  letter-spacing: 0.18px;
  color: var(--gray-darker);
`

const StyledGroupBuyingButton = styled(Button)`
  && {
    height: 68px;
  }
`

const ProgramGroupBuyingInfo: React.FC<{
  programPlans: {
    id: string
    title: string
    listPrice: number
    salePrice: number | null
  }[]
}> = ({ programPlans }) => {
  const { formatMessage } = useIntl()
  const [isVisible, setIsVisible] = useState(false)
  const { currentMemberId } = useAuth()
  const { member } = useMember(currentMemberId || '')

  return (
    <div>
      <div className="mb-2">
        {programPlans.map(v => (
          <span key={v.id} className="d-flex justify-content-between">
            <StyledTitle>{v.title}</StyledTitle>

            <PriceLabel variant="inline" listPrice={v.listPrice} salePrice={v.salePrice} />
          </span>
        ))}
      </div>

      <Button colorScheme="primary" isFullWidth onClick={() => setIsVisible(prev => !prev)}>
        {formatMessage(commonMessages.ui.purchase)}
      </Button>

      {isVisible && (
        <div className="px-1">
          {programPlans.map(v => (
            <CheckoutProductModal
              member={member}
              paymentType="perpetual"
              defaultProductId={`ProgramPlan_${v.id}`}
              renderTrigger={onOpen => (
                <StyledGroupBuyingButton
                  variant="outline"
                  isFullWidth
                  className="d-flex justify-content-between align-items-center my-2"
                  onClick={onOpen}
                >
                  <div className="d-flex flex-column align-items-start">
                    <StyledTitle>{v.title}</StyledTitle>
                    <PriceLabel listPrice={v.salePrice || v.listPrice} />
                  </div>
                  <Icon as={ArrowRightIcon} />
                </StyledGroupBuyingButton>
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProgramGroupBuyingInfo
