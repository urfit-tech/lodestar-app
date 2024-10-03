import { Box, Divider } from '@chakra-ui/layout'
import { DayCellMountArg } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import {
  converge,
  curry,
  equals,
  filter,
  flatten,
  forEachObjIndexed,
  head,
  identity,
  ifElse,
  includes,
  invoker,
  keys,
  map,
  pipe,
  pipeWith,
  prop,
  props,
  split,
  tap,
} from 'ramda'
import { useState } from 'react'
import { AppointmentPeriod, ReservationType } from '../../types/appointment'
import AppointmentItem from './AppointmentItem'

dayjs.extend(utc as any)

const periodKeyToDateString: (periodKey: string) => string = pipe(split('('), head, dayjs.utc, (date: any) =>
  new Date(date).toDateString(),
)

const periodsToDates: (periods: Record<string, AppointmentPeriod[]>) => Array<string> = pipe<
  Record<string, AppointmentPeriod[]>,
  Array<string>,
  Array<string>
>(keys, map<string, string>(periodKeyToDateString))

const isDateInPeriods: (periods: Record<string, AppointmentPeriod[]>, date: Date) => boolean = (periods, date) =>
  includes(date.toDateString())(periodsToDates(periods))

const getPeriodInDate: (date: Date) => (periods: Record<string, AppointmentPeriod[]>) => Array<AppointmentPeriod> = (
  date: Date,
) =>
  pipe(
    converge(props, [keys, identity]),
    flatten,
    filter(
      pipe<AppointmentPeriod, Date, string, boolean>(
        prop('startedAt'),
        invoker(0, 'toDateString'),
        equals(date.toDateString()),
      ),
    ),
  )

const intrusivelyChangeObject: <O extends object>(keyValueMap: Record<keyof O, O[keyof O]>) => (obj: O) => O =
  keyValueMap =>
    forEachObjIndexed((val, key, o) => {
      if (isNaN(Number(key))) o[key] = keyValueMap[key]
    })

const changeObjectByCond: <O extends object>(
  cond: (...args: Array<any>) => boolean,
  keyValueMapForTrue: Record<keyof O, O[keyof O]>,
  keyValueMapForFalse: Record<keyof O, O[keyof O]>,
) => (obj: O) => O = (cond, keyValueMapForTrue, keyValueMapForFalse) =>
  ifElse(cond, intrusivelyChangeObject(keyValueMapForTrue), intrusivelyChangeObject(keyValueMapForFalse))

const AppointmentPeriodBlockCalendar: React.VFC<{
  periods: Record<string, AppointmentPeriod[]>
  creatorId: string
  appointmentPlan: {
    id: string
    defaultMeetGateway: string
    reservationType: ReservationType
    reservationAmount: number
    capacity: number
  }
  services: {
    id: string
    gateway: string
  }[]
  loadingServices: boolean
  onClick: (period: AppointmentPeriod) => void
}> = ({ periods, creatorId, appointmentPlan, services, loadingServices, onClick }) => {
  const [overLapPeriods, setOverLapPeriods] = useState<string[]>([])
  const [focusedDate, setFocusedDate] = useState<Date | undefined>(undefined)

  const makeDayCellStyled = (info: DayCellMountArg) => {
    pipeWith(tap)([
      changeObjectByCond(
        () => curry(isDateInPeriods)(periods)(info.date),
        {
          cursor: 'default',
          backgroundColor: 'hwb(from palegreen h w b / 0.5)',
        } as any,
        {
          cursor: 'pointer',
        },
      ),
    ])(info.el.style)
  }

  const setDayCellContent = (info: DayCellMountArg) => <Box width="100%">{info.date.getDate()}</Box>

  const handleDateClick = (info: DateClickArg) => {
    setFocusedDate(info.date === focusedDate ? undefined : info.date)
    changeObjectByCond(
      () => info.date === focusedDate,
      {
        borderWidth: '2px black solid',
      },
      {
        borderWidth: '1px',
      },
    )(info.dayEl.style)
  }

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dayCellDidMount={makeDayCellStyled}
        dayCellContent={setDayCellContent}
        dateClick={handleDateClick}
      />
      {!focusedDate ? (
        <></>
      ) : getPeriodInDate(focusedDate)(periods).length > 0 ? (
        <>
          <Divider margin="0.5em auto" />
          {map((period: AppointmentPeriod) => (
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
          ))(getPeriodInDate(focusedDate)(periods))}
        </>
      ) : (
        <>
          <Divider margin="0.5em auto" />
          <p>該日期無可預約時段</p>
        </>
      )}
    </>
  )
}

export default AppointmentPeriodBlockCalendar
