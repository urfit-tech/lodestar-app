import { Box, Divider, HStack } from '@chakra-ui/layout'
import { DayCellMountArg } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import {
  converge,
  curry,
  equals,
  filter,
  flatten,
  forEach,
  forEachObjIndexed,
  head,
  identity,
  ifElse,
  includes,
  invoker,
  keys,
  map,
  pipe,
  prop,
  props,
  split,
  tap,
} from 'ramda'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { AppointmentPeriod, ReservationType } from '../../types/appointment'
import AppointmentItem from './AppointmentItem'
import appointmentMessages from './translation'

dayjs.extend(utc as any)

const periodKeyToDateString: (periodKey: string) => string = pipe(split('('), head, dayjs.utc, (date: any) =>
  new Date(date).toDateString(),
)

const periodsToDates: (periods: Record<string, AppointmentPeriod[]>) => Array<string> = pipe(
  keys,
  map<string, string>(periodKeyToDateString),
)

const isDateInPeriods: (periods: Record<string, AppointmentPeriod[]>, date: Date) => boolean = (periods, date) =>
  includes(date.toDateString())(periodsToDates(periods))

const getPeriodInDate: (date: Date) => (periods: Record<string, AppointmentPeriod[]>) => Array<AppointmentPeriod> = (
  date: Date,
) =>
  pipe(
    converge(props as any, [keys, identity]),
    flatten as any,
    filter((pipe as any)(prop('startedAt'), invoker(0, 'toDateString'), equals(date.toDateString()))),
  )

const intrusivelyChangeObject =
  <O extends object>(keyValueMap: Partial<Record<keyof O, O[keyof O]>>) =>
  (obj: O) =>
    forEachObjIndexed((val, key) => (obj[key] = val))(keyValueMap)

const changeObjectByCond: <O extends object>(
  cond: (...args: Array<any>) => boolean,
  keyValueMapForTrue: Partial<Record<keyof O, O[keyof O]>>,
  keyValueMapForFalse: Partial<Record<keyof O, O[keyof O]>>,
) => (obj: O) => O = (cond, keyValueMapForTrue, keyValueMapForFalse) =>
  (ifElse as any)(cond, intrusivelyChangeObject(keyValueMapForTrue), intrusivelyChangeObject(keyValueMapForFalse))

const restyleElement = (styleMap: Partial<CSSStyleDeclaration>) => (element: ChildNode) =>
  intrusivelyChangeObject(styleMap)((element as any).style)

const restyleByCond =
  (
    cond: (...args: Array<any>) => boolean,
    styleMapForTrue: Partial<CSSStyleDeclaration>,
    styleMapForFalse: Partial<CSSStyleDeclaration>,
  ) =>
  (element: ChildNode) =>
    changeObjectByCond(cond, styleMapForTrue, styleMapForFalse)((element as any).style)

const AppointmentPeriodBlockCalendar: React.FC<{
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
  const { formatMessage } = useIntl()
  const {
    colors: {
      primary: { 500: primaryColor },
    },
  } = useAppTheme()
  const [overLapPeriods, setOverLapPeriods] = useState<string[]>([])
  const [focusedDateClicked, setFocusedDateClicked] = useState<DateClickArg | undefined>(undefined)

  const makeDayCellStyled = (info: DayCellMountArg) => {
    const FC_DAYGRID_DAY_ELEMENT = info.el
    const FC_DAYGRID_DAY_FRAME_ELEMENT = FC_DAYGRID_DAY_ELEMENT.childNodes[0]

    const FC_DAYGRID_DAY_TOP_ELEMENT = FC_DAYGRID_DAY_FRAME_ELEMENT.childNodes[0]
    const FC_DAYGRID_DAY_EVENTS_ELEMENT = FC_DAYGRID_DAY_FRAME_ELEMENT.childNodes[1]
    const FC_DAYGRID_DAY_BG_ELEMENT = FC_DAYGRID_DAY_FRAME_ELEMENT.childNodes[2]

    const FC_DAYGRID_DAY_NUMBER = FC_DAYGRID_DAY_TOP_ELEMENT.childNodes[0]

    forEach(restyleElement({ display: 'none' }))([FC_DAYGRID_DAY_EVENTS_ELEMENT, FC_DAYGRID_DAY_BG_ELEMENT])

    restyleElement({ height: '1em', border: '0px' })(FC_DAYGRID_DAY_ELEMENT)

    restyleElement({
      display: 'block',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    })(FC_DAYGRID_DAY_TOP_ELEMENT)

    restyleElement({
      fontSize: '1.75em',
      lineHeight: '0',
      textAlign: 'center',
      cursor: 'default',
    })(FC_DAYGRID_DAY_NUMBER)

    restyleByCond(
      () => curry(isDateInPeriods)(periods)(info.date),
      { cursor: 'pointer' },
      { cursor: 'not-allowed' },
    )(FC_DAYGRID_DAY_NUMBER)

    pipe(
      tap(
        restyleByCond(
          () => curry(isDateInPeriods)(periods)(info.date),
          {
            cursor: 'pointer',
            border: `1px ${primaryColor ?? 'gray'} solid`,
            borderRadius: '0.5em',
            margin: '0.2em',
            height: 'calc(100% - 0.4em)',
            minHeight: '0',
          } as any,
          {
            cursor: 'not-allowed',
          },
        ),
      ),
    )(FC_DAYGRID_DAY_FRAME_ELEMENT)
  }

  const setDayCellContent = (info: DayCellMountArg) => <Box width="100%">{info.date.getDate()}</Box>

  const handleDateClick = (info: DateClickArg) => {
    if (focusedDateClicked) restyleElement({ background: 'none' })(focusedDateClicked.dayEl)
    restyleElement({ background: `color-mix(in srgb, ${primaryColor ?? 'gray'} 10%, transparent)` })(info.dayEl)
    setFocusedDateClicked(info.date === focusedDateClicked?.date ? undefined : info)
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
      {!focusedDateClicked ? (
        <></>
      ) : getPeriodInDate(focusedDateClicked.date)(periods).length > 0 ? (
        <>
          <Divider margin="0.5em auto" />
          <HStack>
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
            ))(getPeriodInDate(focusedDateClicked.date)(periods))}
          </HStack>
        </>
      ) : (
        <>
          <Divider margin="0.5em auto" />
          <p>{formatMessage(appointmentMessages.AppointmentPeriodBlockCalendar.noAvailableBookingSlots)}</p>
        </>
      )}
    </>
  )
}

export default AppointmentPeriodBlockCalendar
