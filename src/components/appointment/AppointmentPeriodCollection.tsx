import { CalendarOutlined, TableOutlined } from '@ant-design/icons'
import { Button } from '@chakra-ui/button'
import { HStack, Spacer } from '@chakra-ui/layout'
import dayjs from 'dayjs'
import moment from 'moment'
import { groupBy } from 'ramda'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useService } from '../../hooks/service'
import { AppointmentPeriod, ReservationType, UiMode } from '../../types/appointment'
import AppointmentItem from './AppointmentItem'
import AppointmentPeriodBlockCalendar from './AppointmentPeriodBlockCalendar'
import appointmentMessages from './translation'

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
  const [overLapPeriods, setOverLapPeriods] = useState<string[]>([])

  return (
    <div key={periods[0].id} className="mb-4">
      {overLapPeriods.length !== periods.length ? (
        <StyledScheduleTitle>{moment(periods[0].startedAt).format('YYYY-MM-DD(dd)')}</StyledScheduleTitle>
      ) : null}
      <div className="d-flex flex-wrap justify-content-start">
        {Object.values(groupBy(period => dayjs(period.startedAt).format('YYYY-MM-DDTHH:mm:00Z'), periods))
          .map((periods: any) =>
            periods.sort(
              (a: any, b: any) => a.appointmentScheduleCreatedAt.getTime() - b.appointmentScheduleCreatedAt.getTime(),
            ),
          )
          .map(periods => periods[0])
          .map(period => {
            return (
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
                  !period.currentMemberBooked && !period.isBookedReachLimit && period.available ? onClick(period) : null
                }
                overLapPeriods={overLapPeriods}
                onOverlapPeriodsChange={setOverLapPeriods}
              />
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
  const { formatMessage } = useIntl()
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

  const [uiMode, setUiMode] = useState<UiMode>('calendar')

  return (
    <>
      <HStack padding="1em">
        <span className="col-lg-4 col-12" style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
          {formatMessage(appointmentMessages.AppointmentPeriodCollection.selectTimeSlot)}
        </span>
        <Spacer className="col-lg-5 col-12" />
        <Button
          variant="outline"
          className="col-lg-3 col-12"
          style={{ verticalAlign: 'middle', fontSize: '1em', fontWeight: 'bold' }}
          onClick={() => setUiMode(uiMode === 'grid' ? 'calendar' : 'grid')}
          leftIcon={
            uiMode === 'grid' ? (
              <CalendarOutlined style={{ fontSize: '1.2em', verticalAlign: 'middle' }} />
            ) : (
              <TableOutlined style={{ fontSize: '1.2em', verticalAlign: 'middle' }} />
            )
          }
        >
          {uiMode === 'grid'
            ? formatMessage(appointmentMessages.AppointmentPeriodCollection.switchToCalendarView)
            : formatMessage(appointmentMessages.AppointmentPeriodCollection.switchToGridView)}
        </Button>
      </HStack>
      {uiMode === 'grid' ? (
        Object.values(periods).map(
          periods =>
            periods && (
              <AppointmentPeriodBlock
                periods={periods}
                creatorId={creatorId}
                appointmentPlan={appointmentPlan}
                onClick={onClick}
                services={services}
                loadingServices={loadingServices}
              />
            ),
        )
      ) : (
        <AppointmentPeriodBlockCalendar
          periods={periods as Record<string, AppointmentPeriod[]>}
          creatorId={creatorId}
          appointmentPlan={appointmentPlan}
          onClick={onClick}
          services={services}
          loadingServices={loadingServices}
        />
      )}
    </>
  )
}

export default AppointmentPeriodCollection
