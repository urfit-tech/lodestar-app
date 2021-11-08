import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import CheckoutProductModal from '../../../components/checkout/CheckoutProductModal'
import { useAddProgramToCart } from '../../../components/checkout/ProgramPaymentButton'
import PriceLabel from '../../../components/common/PriceLabel'
import { BREAK_POINT } from '../../../components/common/Responsive'
import { commonMessages } from '../../../helpers/translation'
import { Category } from '../../../types/general'
import { Program, ProgramPlan, ProgramRole } from '../../../types/program'

const StyledTitle = styled.span`
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
  program: Program & {
    plans: ProgramPlan[]
    categories: Category[]
    roles: ProgramRole[]
  }
  programPlans: Pick<ProgramPlan, 'id' | 'title' | 'listPrice' | 'salePrice'>[]
  hideProgramPlanPrice?: boolean
}> = ({ isOnSale, hideProgramPlanPrice, program, programPlans }) => {
  const { formatMessage } = useIntl()
  const { isProgramInCart, handleAddCartProgram } = useAddProgramToCart(program)
  const history = useHistory()

  return (
    <div>
      <div className="mb-2">
        <span className="d-flex justify-content-between">
          <StyledTitle>{formatMessage(messages.perpetualProgram)}</StyledTitle>
          <PriceLabel
            variant="inline"
            listPrice={program.plans[0]?.listPrice || 0}
            salePrice={isOnSale ? program.plans[0]?.salePrice : undefined}
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
        defaultProductId={`ProgramPlan_${programPlans[0].id}`}
        renderTrigger={({ onProductChange, onOpen }) => (
          <Menu placement="top">
            <MenuButton as={Button} colorScheme="primary" isFullWidth>
              {formatMessage(commonMessages.ui.purchase)}
            </MenuButton>
            <StyledMenuList>
              {program.isSoldOut ? (
                <MenuItem isDisabled>{formatMessage(commonMessages.button.soldOut)}</MenuItem>
              ) : (
                program.plans.map(plan => (
                  <StyledMenuItem
                    onClick={() =>
                      isProgramInCart
                        ? history.push(`/cart`)
                        : handleAddCartProgram(plan.id)?.then(() => history.push('/cart'))
                    }
                  >
                    <StyledTitle className="mr-1">{formatMessage(messages.perpetualProgram)}</StyledTitle>
                    <PriceLabel listPrice={isOnSale ? plan.salePrice || plan.listPrice || 0 : plan.listPrice || 0} />
                  </StyledMenuItem>
                ))
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
