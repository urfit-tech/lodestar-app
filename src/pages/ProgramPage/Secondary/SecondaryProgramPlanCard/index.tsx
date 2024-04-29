import { Divider } from '@chakra-ui/react'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import CheckoutProductModal from 'lodestar-app-element/src/components/modals/CheckoutProductModal'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useContext } from 'react'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { AuthModalContext } from '../../../../components/auth/AuthModal'
import AdminCard from '../../../../components/common/AdminCard'
import CountDownTimeBlock from '../../../../components/common/CountDownTimeBlock'
import { commonMessages, productMessages } from '../../../../helpers/translation'
import { useEnrolledPlanIds } from '../../../../hooks/program'
import { ProgramPlan } from '../../../../types/program'
import { SecondaryCartButton, SecondaryEnrollButton } from '../SecondaryCTAButton'
import SecondaryPaymentButton from './SecondaryPaymentButton'
import SecondaryPriceLabel from './SecondaryPriceLabel'

const StyledAdminCard = styled(AdminCard)`
  color: ${props => props.theme['@label-color']};
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  header {
    h2.title {
      letter-spacing: 0.2px;
      font-size: 16px;
      font-weight: bold;
      color: #585858;
    }
  }
`
const StyledPriceBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledCountDownBlock = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`
const StyledBraftContent = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
  font-size: 14px;
`

const StyledEnrollment = styled.div`
  margin-top: 12px;
  color: var(--black-45);
  text-align: right;
  font-size: 14px;
  letter-spacing: 0.18px;
`

const SecondaryProgramPlanCard: React.VFC<{
  programId: string
  programPlan: ProgramPlan & {
    isSubscription: boolean
    groupBuyingPeople: number
  }
  enrollmentCount?: number
  isProgramSoldOut?: boolean
  isPublished?: boolean
}> = ({ programId, programPlan, enrollmentCount, isProgramSoldOut, isPublished }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { isAuthenticated } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { enabledModules } = useApp()

  const { programPlanIds: enrolledProgramIds } = useEnrolledPlanIds()

  const { salePrice, listPrice, discountDownPrice, currency, isSubscription } = programPlan
  const currencyId = currency.id || 'TWD'
  const isOnSale = (programPlan.soldAt?.getTime() || 0) > Date.now()
  const enrolled = enrolledProgramIds.includes(programPlan.id)

  return (
    <StyledAdminCard key={programPlan.id}>
      <header>
        <h2 className="title">{programPlan.title}</h2>
        <Divider my="12px" />
        <StyledPriceBlock>
          <SecondaryPriceLabel
            listPrice={listPrice}
            salePrice={isOnSale ? salePrice : undefined}
            downPrice={discountDownPrice}
            currencyId={currencyId}
          />
        </StyledPriceBlock>
        <StyledCountDownBlock>
          <CountDownTimeBlock
            secondary
            renderIcon={() => <div />}
            expiredAt={new Date(new Date().getFullYear(), 6, 24)} //TODO: Remove mock data
          />
        </StyledCountDownBlock>
      </header>
      <StyledBraftContent>
        <BraftContent>{programPlan.description}</BraftContent>
        {programPlan.isParticipantsVisible && enrollmentCount && (
          <StyledEnrollment>
            <span className="mr-2">{enrollmentCount}</span>
            <span>{formatMessage(commonMessages.unit.people)}</span>
          </StyledEnrollment>
        )}
      </StyledBraftContent>
      {isProgramSoldOut ? (
        <SecondaryEnrollButton isDisabled>{formatMessage(commonMessages.button.soldOut)}</SecondaryEnrollButton>
      ) : enrolled ? (
        <SecondaryCartButton onClick={() => history.push(`/programs/${programId}/contents?back=programs_${programId}`)}>
          {formatMessage(commonMessages.button.enter)}
        </SecondaryCartButton>
      ) : programPlan.isSubscription ? (
        <CheckoutProductModal
          renderTrigger={({ isLoading, onOpen, isSubscription }) => (
            <SecondaryEnrollButton
              isDisabled={(isAuthenticated && isLoading) || !programPlan.publishedAt}
              onClick={() => {
                if (!isAuthenticated) {
                  setAuthModalVisible?.(true)
                } else {
                  ReactGA.plugin.execute('ec', 'addProduct', {
                    id: programPlan.id,
                    name: programPlan.title,
                    category: 'ProgramPlan',
                    price: `${programPlan.listPrice}`,
                    quantity: '1',
                    currency: currencyId,
                  })
                  ReactGA.plugin.execute('ec', 'setAction', 'add')
                  ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart')
                  onOpen?.()
                }
              }}
            >
              {isSubscription
                ? formatMessage(commonMessages.button.subscribeNow)
                : formatMessage(commonMessages.ui.purchase)}
            </SecondaryEnrollButton>
          )}
          defaultProductId={`ProgramPlan_${programPlan.id}`}
          warningText={
            listPrice <= 0 || (typeof salePrice === 'number' && salePrice <= 0)
              ? formatMessage(productMessages.program.defaults.warningText)
              : ''
          }
        />
      ) : enabledModules.group_buying && programPlan.groupBuyingPeople > 1 ? (
        <CheckoutProductModal
          defaultProductId={`ProgramPlan_${programPlan.id}`}
          renderTrigger={({ isLoading, onOpen }) => (
            <SecondaryEnrollButton
              isDisabled={(isAuthenticated && isLoading) || !programPlan.publishedAt}
              onClick={() => {
                if (!isAuthenticated) {
                  setAuthModalVisible?.(true)
                } else {
                  ReactGA.plugin.execute('ec', 'addProduct', {
                    id: programPlan.id,
                    name: programPlan.title,
                    category: 'ProgramPlan',
                    price: `${programPlan.listPrice}`,
                    quantity: '1',
                    currency: currencyId,
                  })
                  ReactGA.plugin.execute('ec', 'setAction', 'add')
                  ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart')
                  onOpen?.()
                }
              }}
            >
              {formatMessage(commonMessages.ui.groupBuy)}
            </SecondaryEnrollButton>
          )}
        />
      ) : (
        <>
          <SecondaryPaymentButton
            type="ProgramPlan"
            target={programPlan.id}
            price={isOnSale && salePrice ? salePrice : listPrice}
            currencyId={currency.id}
            isSubscription={isSubscription}
            isPublished={isPublished}
          />
        </>
      )}
    </StyledAdminCard>
  )
}

export default SecondaryProgramPlanCard
