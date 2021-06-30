import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { commonMessages } from '../../../helpers/translation'
import { useMember } from '../../../hooks/member'
import { ProgramPlanProps, ProgramProps } from '../../../types/program'
import { useAuth } from '../../auth/AuthContext'
import CheckoutProductModal from '../../checkout/CheckoutProductModal'
import { useAddProgramToCart } from '../../checkout/ProgramPaymentButton'
import PriceLabel from '../../common/PriceLabel'
import { BREAK_POINT } from '../../common/Responsive'

const StyledTitle = styled.span`
  font-family: NotoSansCJKtc;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.57;
  letter-spacing: 0.18px;
`

const StyledMenuList = styled(MenuList)`
  && {
    min-width: 236px;
    width: 100vw;
    max-width: 510px;

    @media (min-width: 768px) {
      max-width: 690px;
    }

    @media (min-width: ${BREAK_POINT}px) {
      width: clamp(236px, 23vw, 298px);
    }
  }
`

const StyledMenuItem = styled(MenuItem)`
  height: 48px;
  letter-spacing: 0.2px;
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: 500;
  color: var(--gray-darker);

  &:hover {
    color: ${props => props.theme['@primary-color']};
  }
`

const messages = defineMessages({
  perpetualProgram: { id: 'groupBuying.ui.perpetualProgram', defaultMessage: '單人方案' },
})

const ProgramGroupBuyingInfo: React.FC<{
  isOnSale: boolean
  program: Pick<ProgramProps, 'id' | 'listPrice' | 'salePrice' | 'title' | 'isSoldOut'>
  programPlans: Pick<ProgramPlanProps, 'id' | 'title' | 'listPrice' | 'salePrice'>[]
  hideProgramPlanPrice?: boolean
}> = ({ isOnSale, hideProgramPlanPrice, program, programPlans }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { member } = useMember(currentMemberId || '')
  const { isProgramInCart, handleAddCartProgram } = useAddProgramToCart(program)
  const history = useHistory()

  return (
    <div>
      <div className="mb-2">
        <span className="d-flex justify-content-between">
          <StyledTitle>{formatMessage(messages.perpetualProgram)}</StyledTitle>
          <PriceLabel
            variant="inline"
            listPrice={program.listPrice || 0}
            salePrice={isOnSale ? program.salePrice : undefined}
          />
        </span>
        {!hideProgramPlanPrice &&
          programPlans.map(v => (
            <span key={v.id} className="d-flex justify-content-between">
              <StyledTitle>{v.title}</StyledTitle>
              <PriceLabel variant="inline" listPrice={v.listPrice} salePrice={isOnSale ? v.salePrice : undefined} />
            </span>
          ))}
      </div>

      <CheckoutProductModal
        member={member}
        paymentType="perpetual"
        renderTrigger={(onOpen, onProductChange) => (
          <Menu placement="top">
            <MenuButton as={Button} colorScheme="primary" isFullWidth>
              {formatMessage(commonMessages.ui.purchase)}
            </MenuButton>
            <StyledMenuList>
              {program.isSoldOut ? (
                <MenuItem isDisabled>{formatMessage(commonMessages.button.soldOut)}</MenuItem>
              ) : (
                <StyledMenuItem
                  onClick={() =>
                    isProgramInCart ? history.push(`/cart`) : handleAddCartProgram()?.then(() => history.push('/cart'))
                  }
                >
                  <StyledTitle className="mr-1">{formatMessage(messages.perpetualProgram)}</StyledTitle>
                  <PriceLabel
                    listPrice={isOnSale ? program.salePrice || program.listPrice || 0 : program.listPrice || 0}
                  />
                </StyledMenuItem>
              )}

              {programPlans.map(v => (
                <StyledMenuItem
                  key={v.id}
                  onClick={() => {
                    onProductChange?.(`ProgramPlan_${v.id}`)
                    onOpen?.()
                  }}
                >
                  <StyledTitle className="mr-1">{v.title}</StyledTitle>
                  <PriceLabel listPrice={isOnSale ? v.salePrice || v.listPrice : v.listPrice} />
                </StyledMenuItem>
              ))}
            </StyledMenuList>
          </Menu>
        )}
      />
    </div>
  )
}

export default ProgramGroupBuyingInfo
