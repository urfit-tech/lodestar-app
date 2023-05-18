import { Button } from '@chakra-ui/react'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import CheckoutProductModal from 'lodestar-app-element/src/components/modals/CheckoutProductModal'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useProductGiftPlan } from 'lodestar-app-element/src/hooks/giftPlan'
import React, { useContext } from 'react'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { AuthModalContext } from '../../../components/auth/AuthModal'
import AdminCard from '../../../components/common/AdminCard'
import CountDownTimeBlock from '../../../components/common/CountDownTimeBlock'
import GiftPlanTag from '../../../components/common/GiftPlanTag'
import PaymentButton from '../../../components/common/PaymentButton'
import { commonMessages, productMessages } from '../../../helpers/translation'
import { useEnrolledPlanIds } from '../../../hooks/program'
import { ProgramPlan } from '../../../types/program'

const StyledAdminCard = styled(AdminCard)`
  color: ${props => props.theme['@label-color']};

  header {
    margin-bottom: 20px;
    border-bottom: solid 1px #cdcdcd;
    padding-bottom: 20px;

    h2.title {
      margin: 0 0 20px;
      letter-spacing: 0.2px;
      font-size: 16px;
      font-weight: bold;
    }
  }
`
const StyledPriceBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledCountDownBlock = styled.div`
  margin-top: 20px;
  span {
    font-size: 14px;
  }
`
const StyledBraftContent = styled.div`
  margin-bottom: 12px;
  font-size: 14px;
`

const StyledEnrollment = styled.div`
  color: var(--black-45);
  text-align: right;
  font-size: 14px;
  letter-spacing: 0.18px;
`

const ProgramPlanCard: React.VFC<{
  programId: string
  programPlan: ProgramPlan & {
    isSubscription: boolean
    groupBuyingPeople: number
  }
  enrollmentCount: number
  isProgramSoldOut?: boolean
}> = ({ programId, programPlan, enrollmentCount, isProgramSoldOut }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { isAuthenticated } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { productGiftPlan } = useProductGiftPlan(`ProgramPlan_${programPlan?.id}`)
  const { enabledModules } = useApp()

  const { programPlanIds: enrolledProgramIds } = useEnrolledPlanIds()

  const { salePrice, listPrice, discountDownPrice, periodType, periodAmount, currency, isSubscription } = programPlan
  const currencyId = currency.id || 'TWD'
  const isOnSale = (programPlan.soldAt?.getTime() || 0) > Date.now()
  const enrolled = enrolledProgramIds.includes(programPlan.id)

  return (
    <StyledAdminCard key={programPlan.id}>
      <header>
        <h2 className="title">{programPlan.title}</h2>
        <StyledPriceBlock>
          <PriceLabel
            variant="full-detail"
            listPrice={listPrice}
            salePrice={isOnSale ? salePrice : undefined}
            downPrice={discountDownPrice}
            periodAmount={periodAmount}
            periodType={periodType}
            currencyId={currencyId}
          />
          {productGiftPlan.id && <GiftPlanTag />}
        </StyledPriceBlock>
        {programPlan.isCountdownTimerVisible && programPlan.soldAt && isOnSale && (
          <StyledCountDownBlock>
            <CountDownTimeBlock expiredAt={programPlan?.soldAt} />
          </StyledCountDownBlock>
        )}
      </header>
      <StyledBraftContent>
        <BraftContent>{programPlan.description}</BraftContent>
        {programPlan.isParticipantsVisible && (
          <StyledEnrollment>
            <span className="mr-2">{enrollmentCount}</span>
            <span>{formatMessage(commonMessages.unit.people)}</span>
          </StyledEnrollment>
        )}
      </StyledBraftContent>
      {isProgramSoldOut ? (
        <Button isFullWidth isDisabled>
          {formatMessage(commonMessages.button.soldOut)}
        </Button>
      ) : enrolled ? (
        <Button
          variant="outline"
          colorScheme="primary"
          isFullWidth
          onClick={() => history.push(`/programs/${programId}/contents?back=programs_${programId}`)}
        >
          {formatMessage(commonMessages.button.enter)}
        </Button>
      ) : programPlan.isSubscription ? (
        <CheckoutProductModal
          renderTrigger={({ isLoading, onOpen, isSubscription }) => (
            <Button
              colorScheme="primary"
              isFullWidth
              isDisabled={isAuthenticated && isLoading}
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
            </Button>
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
            <Button
              colorScheme="primary"
              isFullWidth
              isDisabled={isAuthenticated && isLoading}
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
            </Button>
          )}
        />
      ) : (
        <>
          <PaymentButton
            type="ProgramPlan"
            target={programPlan.id}
            price={isOnSale && salePrice ? salePrice : listPrice}
            currencyId={currency.id}
            isSubscription={isSubscription}
          ></PaymentButton>
        </>
      )}
    </StyledAdminCard>
  )
}

export default ProgramPlanCard
