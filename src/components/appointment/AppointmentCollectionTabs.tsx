import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import CheckoutProductModal from 'lodestar-app-element/src/components/modals/CheckoutProductModal'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import moment from 'moment'
import momentTz from 'moment-timezone'
import React, { useContext, useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { productMessages } from '../../helpers/translation'
import { AppointmentPeriod, AppointmentPlan } from '../../types/appointment'
import { AuthModalContext } from '../auth/AuthModal'
import AppointmentPeriodCollection from './AppointmentPeriodCollection'
import hasura from '../../hasura'
import { useQuery, gql } from '@apollo/client'
import CoinCheckoutModal from '../checkout/CoinCheckoutModal'

const StyledTab = styled.div`
  margin-bottom: 0.75rem;
  padding: 1rem;
  height: 104px;
  user-select: none;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  background: white;

  > .title {
    font-size: 18px;
    font-weight: bold;
    color: var(--gray-darker);
    transition: color 0.3s ease-in-out;
  }

  > .info {
    margin: 0;
    color: ${props => props.theme['@primary-color']};
    font-size: 14px;
    letter-spacing: 0.18px;
    transition: color 0.3s ease-in-out;
  }

  &:hover,
  &.active {
    background: ${props => props.theme['@primary-color']};

    > .title,
    > .info {
      color: white;
    }
  }
`
const StyledTimeStandardBlock = styled.div`
  border-radius: 4px;
  width: 100%;
  height: 30px;
  padding: 4px 8px;
  line-height: 1.57;
  letter-spacing: 0.18px;
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-darker);
  background-color: var(--gray-lighter);
`

const AppointmentCollectionTabs: React.VFC<{
  appointmentPlans: (AppointmentPlan & { periods: AppointmentPeriod[] })[]
}> = ({ appointmentPlans }) => {
  const { formatMessage } = useIntl()
  const [selectedAppointmentPlanId, setSelectedAppointmentPlanId] = useState<string | null>(appointmentPlans[0].id)
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const appointmentPlanId = query.get('appointment_plan')

  useEffect(() => {
    if (appointmentPlans) {
      appointmentPlans.forEach((appointmentPlan, index) => {
        ReactGA.plugin.execute('ec', 'addProduct', {
          id: appointmentPlan.id,
          name: appointmentPlan.title,
          category: 'AppointmentPlan',
          price: `${appointmentPlan.price}`,
          quantity: '1',
          currency: 'TWD',
        })
        ReactGA.plugin.execute('ec', 'addImpression', {
          id: appointmentPlan.id,
          name: appointmentPlan.title,
          category: 'AppointmentPlan',
          price: `${appointmentPlan.price}`,
          position: index + 1,
        })
      })
      if (appointmentPlans.length > 0) {
        ReactGA.plugin.execute('ec', 'setAction', 'detail')
      }
      ReactGA.ga('send', 'pageview')
    }
  }, [appointmentPlans])

  useEffect(() => {
    if (appointmentPlanId) setSelectedAppointmentPlanId(appointmentPlanId)
  }, [appointmentPlanId])

  return (
    <>
      <div className="row mb-4">
        {appointmentPlans
          .filter(v =>
            appointmentPlanId ? v.id === appointmentPlanId || v.isPrivate === false : v.isPrivate === false,
          )
          .map((appointmentPlan, index) => (
            <div key={appointmentPlan.id} className="col-lg-4 col-6">
              <StyledTab
                key={appointmentPlan.title}
                className={`d-flex flex-column justify-content-between ${
                  selectedAppointmentPlanId === appointmentPlan.id ||
                  (selectedAppointmentPlanId === null && index === 0)
                    ? 'active'
                    : ''
                }`}
                onClick={() => setSelectedAppointmentPlanId(appointmentPlan.id)}
              >
                <div className="title">{appointmentPlan.title}</div>
                <div className="info">
                  {formatMessage(
                    {
                      id: 'product.appointment.unit',
                      defaultMessage: '每 {duration} 分鐘 {price}',
                    },
                    {
                      duration: appointmentPlan.duration,
                      price: <PriceLabel currencyId={appointmentPlan.currency.id} listPrice={appointmentPlan.price} />,
                    },
                  )}
                </div>
              </StyledTab>
            </div>
          ))}
      </div>

      <AppointmentPlanCollection
        appointmentPlans={appointmentPlans
          .filter(v =>
            appointmentPlanId ? v.id === appointmentPlanId || v.isPrivate === false : v.isPrivate === false,
          )
          .filter((appointmentPlan, index) =>
            selectedAppointmentPlanId ? selectedAppointmentPlanId === appointmentPlan.id : index === 0,
          )}
      />
    </>
  )
}

const AppointmentPlanCollection: React.FC<{
  appointmentPlans: (AppointmentPlan & { periods: AppointmentPeriod[] })[]
}> = ({ appointmentPlans }) => {
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const { isAuthenticated, currentMemberId } = useAuth()
  const tracking = useTracking()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)

  const { remainingCoins } = useMemberCoinsRemaining(currentMemberId || '')
  const [selectedPeriod, setSelectedPeriod] = useState<AppointmentPeriod | null>(null)

  const diffPlanBookedTimes = [
    ...appointmentPlans.map(appointmentPlan =>
      appointmentPlan.periods.filter(period => period.booked).map(v => moment(v.startedAt).format('YYYY-MM-DD HH:mm')),
    ),
  ].flat(1)

  const { resourceCollection } = useResourceCollection(
    appId ? appointmentPlans.map(appointmentPlan => `${appId}:appointment_plan:${appointmentPlan.id}`) : [],
    true,
  )

  return (
    <>
      <Tracking.Impression resources={resourceCollection} />
      {appointmentPlans.map((appointmentPlan, idx) => (
        <div key={appointmentPlan.id}>
          {appointmentPlan.description && (
            <div className="mb-4">
              <BraftContent>{appointmentPlan.description}</BraftContent>
            </div>
          )}
          <StyledTimeStandardBlock className="mb-4">
            {formatMessage(productMessages.appointment.content.timezone, {
              city: momentTz.tz.guess().split('/')[1],
              timezone: moment().zone(momentTz.tz.guess()).format('Z'),
            })}
          </StyledTimeStandardBlock>
          {appointmentPlan.currency.id === 'LSC' ? (
            <CoinCheckoutModal
              productId={`AppointmentPlan_${appointmentPlan.id}`}
              amount={1}
              currencyId={appointmentPlan.currency.id}
              phoneInputEnabled={true}
              renderTrigger={({ setVisible }) => (
                <AppointmentPeriodCollection
                  appointmentPeriods={appointmentPlan.periods}
                  reservationAmount={appointmentPlan.reservationAmount}
                  reservationType={appointmentPlan.reservationType}
                  onClick={period => {
                    if (!isAuthenticated) {
                      setAuthModalVisible?.(true)
                    } else {
                      ReactGA.plugin.execute('ec', 'addProduct', {
                        id: appointmentPlan.id,
                        name: appointmentPlan.title,
                        category: 'AppointmentPlan',
                        price: `${appointmentPlan.price}`,
                        quantity: '1',
                        currency: 'LTC',
                      })
                      ReactGA.plugin.execute('ec', 'setAction', 'add')
                      ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart')
                      setSelectedPeriod(period)
                      setVisible?.()

                      const resource = resourceCollection[idx]
                      resource && tracking.click(resource, { position: idx + 1 })
                    }
                  }}
                  diffPlanBookedTimes={diffPlanBookedTimes}
                />
              )}
            />
          ) : (
            <CheckoutProductModal
              defaultProductId={`AppointmentPlan_${appointmentPlan.id}`}
              renderTrigger={({ onOpen }) => (
                <AppointmentPeriodCollection
                  appointmentPeriods={appointmentPlan.periods}
                  reservationAmount={appointmentPlan.reservationAmount}
                  reservationType={appointmentPlan.reservationType}
                  onClick={period => {
                    if (!isAuthenticated) {
                      setAuthModalVisible?.(true)
                    } else {
                      ReactGA.plugin.execute('ec', 'addProduct', {
                        id: appointmentPlan.id,
                        name: appointmentPlan.title,
                        category: 'AppointmentPlan',
                        price: `${appointmentPlan.price}`,
                        quantity: '1',
                        currency: 'TWD',
                      })
                      ReactGA.plugin.execute('ec', 'setAction', 'add')
                      ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart')
                      setSelectedPeriod(period)
                      onOpen?.()

                      const resource = resourceCollection[idx]
                      resource && tracking.click(resource, { position: idx + 1 })
                    }
                  }}
                  diffPlanBookedTimes={diffPlanBookedTimes}
                />
              )}
              startedAt={selectedPeriod?.startedAt}
            />
          )}
        </div>
      ))}
    </>
  )
}

const useMemberCoinsRemaining = (memberId: string) => {
  const { data } = useQuery<hasura.GET_MEMBER_COIN_REMAINING, hasura.GET_MEMBER_COIN_REMAININGVariables>(
    gql`
      query GET_MEMBER_COIN_REMAINING($memberId: String!) {
        coin_status(where: { member_id: { _eq: $memberId } }) {
          remaining
        }
      }
    `,
    {
      variables: { memberId },
    },
  )
  const remainingCoins =
    data?.coin_status.reduce((total, coin) => {
      return (total += coin.remaining)
    }, 0) || 0

  return { remainingCoins }
}

export default AppointmentCollectionTabs
