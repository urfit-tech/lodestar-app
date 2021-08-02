import { Button } from '@chakra-ui/react'
import React, { useContext } from 'react'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import CheckoutProductModal from '../../components/checkout/CheckoutProductModal'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useMember } from '../../hooks/member'
import { useEnrolledPlanIds, useProgram } from '../../hooks/program'
import { ProgramPlanProps } from '../../types/program'
import { useAuth } from '../auth/AuthContext'
import { AuthModalContext } from '../auth/AuthModal'
import AdminCard from '../common/AdminCard'
import CountDownTimeBlock from '../common/CountDownTimeBlock'
import PriceLabel from '../common/PriceLabel'
import { BraftContent } from '../common/StyledBraftEditor'

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
const ProgramSubscriptionPlanCard: React.VFC<{
  memberId: string
  programId: string
  programPlan: ProgramPlanProps
}> = ({ memberId, programId, programPlan }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { isAuthenticated } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { program } = useProgram(programId)
  const { programPlanIds: enrolledProgramIds } = useEnrolledPlanIds(memberId)
  const { member } = useMember(memberId)

  const { salePrice, listPrice, discountDownPrice, periodType, periodAmount, currency } = programPlan
  const currencyId = currency.id || 'TWD'
  const isOnSale = (programPlan.soldAt?.getTime() || 0) > Date.now()
  const enrolled = enrolledProgramIds.includes(programPlan.id)
  return (
    <StyledAdminCard key={programPlan.id}>
      <header>
        <h2 className="title">{programPlan.title}</h2>

        <PriceLabel
          variant="full-detail"
          listPrice={listPrice}
          salePrice={isOnSale ? salePrice : undefined}
          downPrice={discountDownPrice}
          periodAmount={periodAmount}
          periodType={periodType}
          currencyId={currencyId}
        />
        {programPlan.isCountdownTimerVisible && programPlan.soldAt && isOnSale && (
          <StyledCountDownBlock>
            <CountDownTimeBlock expiredAt={programPlan?.soldAt} icon />
          </StyledCountDownBlock>
        )}
      </header>
      <StyledBraftContent>
        <BraftContent>{programPlan.description}</BraftContent>
      </StyledBraftContent>
      {program?.isSoldOut ? (
        <Button isFullWidth isDisabled>
          {formatMessage(commonMessages.button.soldOut)}
        </Button>
      ) : enrolled ? (
        <Button
          variant="outline"
          colorScheme="primary"
          isFullWidth
          onClick={() => history.push(`/programs/${programId}/contents`)}
        >
          {formatMessage(commonMessages.button.enter)}
        </Button>
      ) : (
        <CheckoutProductModal
          renderTrigger={onOpen => (
            <Button
              colorScheme="primary"
              isFullWidth
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
              {formatMessage(commonMessages.button.subscribeNow)}
            </Button>
          )}
          paymentType="subscription"
          defaultProductId={`ProgramPlan_${programPlan.id}`}
          // TODO: Should take care of this warningText (maybe it would move to bottom)
          warningText={
            listPrice <= 0 || (typeof salePrice === 'number' && salePrice <= 0)
              ? formatMessage(productMessages.program.defaults.warningText)
              : ''
          }
          member={member}
        />
      )}
    </StyledAdminCard>
  )
}

export default ProgramSubscriptionPlanCard
