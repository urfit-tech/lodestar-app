import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import { groupBy } from 'ramda'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { useService } from '../../hooks/service'
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
  creatorId: string
  appointmentPlan: {
    id: string
    defaultMeetGateway: string
    reservationType: ReservationType
    reservationAmount: number
    capacity: number
  }
  appointmentPeriods: AppointmentPeriod[]
  diffPlanBookedTimes?: String[]
  onClick: (period: AppointmentPeriod) => void
}> = ({ creatorId, appointmentPlan, appointmentPeriods, diffPlanBookedTimes, onClick }) => {
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { isAuthenticated } = useAuth()
  const { services } = useService()

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
        appointmentPlan.reservationType && appointmentPlan.reservationAmount && appointmentPlan.reservationAmount !== 0
          ? moment(v.startedAt).subtract(appointmentPlan.reservationType, appointmentPlan.reservationAmount).toDate() >
            moment().toDate()
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
                  creatorId={creatorId}
                  appointmentPlan={{
                    id: appointmentPlan.id,
                    capacity: appointmentPlan.capacity,
                    defaultMeetGateway: appointmentPlan.defaultMeetGateway,
                  }}
                  period={{
                    startedAt: period.startedAt,
                    endedAt: period.endedAt,
                  }}
                  services={services}
                  isPeriodExcluded={!period.available}
                  isEnrolled={period.currentMemberBooked}
                  onClick={() =>
                    !period.currentMemberBooked && !period.isBookedReachLimit && !period.available
                      ? onClick(period)
                      : null
                  }
                />
              )

              return isAuthenticated && !period.currentMemberBooked ? (
                <div key={period.id} onClick={() => onClick && onClick(period)}>
                  {ItemElem}
                </div>
              ) : isAuthenticated && period.currentMemberBooked ? (
                <div
                  key={period.id}
                  onClick={() => {
                    return
                  }}
                >
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
