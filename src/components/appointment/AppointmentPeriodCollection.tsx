import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import dayjs from 'dayjs'
import { groupBy } from 'ramda'
import React, { useContext, useState } from 'react'
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
const AppointmentPeriodBlock: React.VFC<{
  periods: AppointmentPeriod[]
  creatorId: string
  appointmentPlan: {
    id: string
    defaultMeetGateway: string
    reservationType: ReservationType
    reservationAmount: number
    capacity: number
  }
  services: { id: string; gateway: string }[]
  loadingServices: boolean
  onClick: (period: AppointmentPeriod) => void
}> = ({ periods, creatorId, appointmentPlan, services, loadingServices, onClick }) => {
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { isAuthenticated } = useAuth()
  const [overLapPeriods, setOverLapPeriods] = useState<string[]>([])

  return (
    <div key={periods[0].id} className="mb-4">
      {overLapPeriods.length !== periods.length ? (
        <StyledScheduleTitle>{moment(periods[0].startedAt).format('YYYY-MM-DD(dd)')}</StyledScheduleTitle>
      ) : null}
      <div className="d-flex flex-wrap justify-content-start">
        {Object.values(groupBy(period => dayjs(period.startedAt).format('YYYY-MM-DDTHH:mm:00Z'), periods))
          .map(periods =>
            periods.sort((a, b) => a.appointmentScheduleCreatedAt.getTime() - b.appointmentScheduleCreatedAt.getTime()),
          )
          .map(periods => periods[0])
          .map(period => {
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
                loadingServices={loadingServices}
                isPeriodExcluded={!period.available}
                isEnrolled={period.currentMemberBooked}
                onClick={() =>
                  !period.currentMemberBooked && !period.isBookedReachLimit && !period.available
                    ? onClick(period)
                    : null
                }
                overLapPeriods={overLapPeriods}
                onOverlapPeriodsChange={setOverLapPeriods}
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
  )
}

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
  onClick: (period: AppointmentPeriod) => void
}> = ({ creatorId, appointmentPlan, appointmentPeriods, onClick }) => {
  const { loading: loadingServices, services } = useService()
  const periods = groupBy(
    period => dayjs(period.startedAt).format('YYYY-MM-DD(dd)'),
    appointmentPeriods.filter(v =>
      appointmentPlan.reservationType && appointmentPlan.reservationAmount && appointmentPlan.reservationAmount !== 0
        ? dayjs(v.startedAt).subtract(appointmentPlan.reservationAmount, appointmentPlan.reservationType).toDate() >
          dayjs().toDate()
        : v,
    ),
  )

  return (
    <>
      {Object.values(periods).map(periods => (
        <AppointmentPeriodBlock
          periods={periods}
          creatorId={creatorId}
          appointmentPlan={appointmentPlan}
          onClick={onClick}
          services={services}
          loadingServices={loadingServices}
        />
      ))}
    </>
  )
}

export default AppointmentPeriodCollection
