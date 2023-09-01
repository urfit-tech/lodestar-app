import moment from 'moment'
import { groupBy } from 'ramda'
import React from 'react'
import styled from 'styled-components'
import { AppointmentPeriod, ReservationType } from '../../types/appointment'
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
  onClick: (period: AppointmentPeriod) => void
}> = ({ appointmentPeriods, reservationType, reservationAmount, diffPlanBookedTimes, onClick }) => {
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
            {periods.map(period => (
              <AppointmentItem
                key={period.id}
                id={period.id}
                startedAt={period.startedAt}
                isEnrolled={period.currentMemberBooked}
                onClick={() => (!period.currentMemberBooked ? onClick(period) : null)}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export default AppointmentPeriodCollection
