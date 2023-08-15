import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import { groupBy } from 'ramda'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { AppointmentPeriod, ReservationType } from '../../types/appointment'
import { AuthModalContext } from '../auth/AuthModal'
import AppointmentItem from './AppointmentItem'

const StyledScheduleTitle = styled.h3`
  margin-bottom: 1.25rem;
  display: block;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const AppointmentPeriodCollection: React.VFC<{
  appointmentPeriods: AppointmentPeriod[]
  reservationType?: ReservationType
  reservationAmount?: number
  diffPlanBookedTimes?: String[]
  onClick?: (period: AppointmentPeriod) => void
}> = ({ appointmentPeriods, reservationType, reservationAmount, diffPlanBookedTimes, onClick }) => {
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { isAuthenticated } = useAuth()

  const periods = groupBy(
    period => moment(period.startedAt).format('YYYY-MM-DD(dd)'),
    appointmentPeriods
      .filter(v => v.available)
      .filter(
        v =>
          !diffPlanBookedTimes?.some(
            diffPlanBookedTime => moment(v.startedAt).format('YYYY-MM-DD HH:mm').toString() === diffPlanBookedTime,
          ),
      )
      .filter(v =>
        reservationType && reservationAmount && reservationAmount !== 0
          ? moment(v.startedAt).subtract(reservationType, reservationAmount).toDate() > moment().toDate()
          : v,
      ),
  )

  return (
    <>
      {Object.values(periods).map(periods => (
        <div key={periods[0].id} className="mb-4">
          <StyledScheduleTitle>{moment(periods[0].startedAt).format('YYYY-MM-DD(dd)')}</StyledScheduleTitle>

          <div className="d-flex flex-wrap justify-content-start">
            {periods.map(period => {
              const ItemElem = (
                <AppointmentItem
                  key={period.id}
                  id={period.id}
                  startedAt={period.startedAt}
                  isEnrolled={period.currentMemberBooked}
                />
              )

              return isAuthenticated ? (
                <div key={period.id} onClick={() => onClick && onClick(period)}>
                  {ItemElem}
                </div>
              ) : (
                <div key={period.id} onClick={() => setAuthModalVisible && setAuthModalVisible(true)}>
                  {ItemElem}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </>
  )
}

export default AppointmentPeriodCollection
