import moment from 'moment'
import momentTz from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import CheckoutProductModal from '../../components/checkout/CheckoutProductModal'
import { productMessages } from '../../helpers/translation'
import { useMember } from '../../hooks/member'
import { AppointmentPeriodProps, AppointmentPlanProps } from '../../types/appointment'
import { useAuth } from '../auth/AuthContext'
import PriceLabel from '../common/PriceLabel'
import { BraftContent } from '../common/StyledBraftEditor'
import AppointmentPeriodCollection from './AppointmentPeriodCollection'

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
  font-family: NotoSansCJKtc;
  color: var(--gray-darker);
  background-color: var(--gray-lighter);
`

const AppointmentCollectionTabs: React.FC<{
  appointmentPlans: (AppointmentPlanProps & { periods: AppointmentPeriodProps[] })[]
}> = ({ appointmentPlans }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { member } = useMember(currentMemberId || '')
  const [selectedAppointmentPlanId, setSelectedAppointmentPlanId] = useState<string | null>(appointmentPlans[0].id)
  const [selectedPeriod, setSelectedPeriod] = useState<AppointmentPeriodProps | null>(null)
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const appointmentPlanId = query.get('appointment_plan')

  const diffPlanBookedTimes = [
    ...appointmentPlans.map(appointmentPlan =>
      appointmentPlan.periods.filter(period => period.booked).map(v => moment(v.startedAt).format('YYYY-MM-DD HH:mm')),
    ),
  ].flat(1)

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

      {appointmentPlans
        .filter(v => (appointmentPlanId ? v.id === appointmentPlanId || v.isPrivate === false : v.isPrivate === false))
        .filter((appointmentPlan, index) =>
          selectedAppointmentPlanId ? selectedAppointmentPlanId === appointmentPlan.id : index === 0,
        )
        .map(appointmentPlan => (
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

            <CheckoutProductModal
              renderTrigger={onOpen => (
                <AppointmentPeriodCollection
                  appointmentPeriods={appointmentPlan.periods}
                  reservationAmount={appointmentPlan.reservationAmount}
                  reservationType={appointmentPlan.reservationType}
                  onClick={period => {
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
                    onOpen()
                  }}
                  diffPlanBookedTimes={diffPlanBookedTimes}
                />
              )}
              paymentType="perpetual"
              defaultProductId={`AppointmentPlan_${appointmentPlan.id}`}
              startedAt={selectedPeriod?.startedAt}
              warningText={formatMessage(productMessages.appointment.warningText.news)}
              member={member}
            />
          </div>
        ))}
    </>
  )
}

export default AppointmentCollectionTabs
