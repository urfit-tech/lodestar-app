import { DeleteOutlined } from '@ant-design/icons'
import { Button } from '@chakra-ui/button'
import { useDisclosure } from '@chakra-ui/hooks'
import { Input } from '@chakra-ui/input'
import { Divider, HStack, Spacer, VStack } from '@chakra-ui/layout'
import dayjs from 'dayjs'
import { identity } from 'lodash'
import { BREAK_POINT } from 'lodestar-app-element/src/components/common/Responsive'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import moment from 'moment'
import momentTz from 'moment-timezone'
import {
  always,
  append,
  ascend,
  converge,
  defaultTo,
  equals,
  filter,
  ifElse,
  includes,
  isEmpty,
  map,
  mergeRight,
  pipe,
  project,
  prop,
  props,
  sort,
  tap,
  without,
} from 'ramda'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useMediaQuery } from 'react-responsive'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { PodcastProgramProps } from '../../containers/podcast/PodcastProgramTimeline'
import { useMember } from '../../hooks/member'
import { AppointmentPeriod, AppointmentPlan } from '../../types/appointment'
import { Category } from '../../types/general'
import { ProgramBriefProps, ProgramPlan, ProgramRole } from '../../types/program'
import { AuthModalContext } from '../auth/AuthModal'
import OverviewBlock from '../common/OverviewBlock'
import AppointmentPeriodCollection from './AppointmentPeriodCollection'
import MultiPeriodCheckoutModal from './MultiPeriodCheckoutModal'
import appointmentMessages from './translation'

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

const AppointmentCollectionTabsWrapper: React.VFC<{
  creatorId: string
  appointmentPlans: Array<AppointmentPlan & { periods: AppointmentPeriod[] }>
  programs: Array<
    ProgramBriefProps & {
      supportLocales: string[] | null
      categories: Category[]
      roles: ProgramRole[]
      plans: ProgramPlan[]
    }
  >
  isAuthenticated: boolean
  podcastPrograms: PodcastProgramProps[]
  setActiveKey: any
  setAuthModalVisible: React.Dispatch<React.SetStateAction<boolean>> | undefined
}> = ({
  creatorId,
  appointmentPlans,
  programs,
  isAuthenticated,
  podcastPrograms,
  setActiveKey,
  setAuthModalVisible,
}) => {
  const [selectedAppointmentPlanId, setSelectedAppointmentPlanId] = useState<string>(appointmentPlans[0].id)
  const [selectedPeriods, setSelectedPeriods] = useState<Array<AppointmentPeriod>>([])
  const { currentMemberId, isAuthenticating, authToken } = useAuth()
  const { member: currentMember } = useMember(currentMemberId || '')
  const { isOpen: isCheckOutModalOpen, onOpen: onCheckOutModalOpen, onClose: onCheckOutModalClose } = useDisclosure()

  const [appointmentPeriodLengthLimit, setAppointmentPeriodLengthLimit] = useState<number>(Infinity)

  const safelySetSelectedPeriods: Dispatch<SetStateAction<AppointmentPeriod[]>> = pipe(
    (ifElse as any)(
      pipe(always(selectedPeriods.length + 1 > appointmentPeriodLengthLimit)),
      pipe(
        tap(() => window.alert('選取堂數超過設定總數！')),
        always(selectedPeriods),
      ),
      identity,
    ),
    setSelectedPeriods,
  )

  const isDesktop = useMediaQuery({ minWidth: BREAK_POINT })

  if (isAuthenticating || currentMember === null) {
    setAuthModalVisible?.(true)
    return <></>
  }

  return (
    <div className="row">
      <div className="col-lg-8 col-12 mb-3">
        <AppointmentCollectionTabs
          creatorId={creatorId}
          appointmentPlans={appointmentPlans}
          selectedAppointmentPlanId={selectedAppointmentPlanId}
          setSelectedAppointmentPlanId={setSelectedAppointmentPlanId}
          selectedPeriods={selectedPeriods}
          setSelectedPeriods={safelySetSelectedPeriods}
          setAppointmentPeriodLengthLimit={setAppointmentPeriodLengthLimit}
        />
      </div>

      <div className="col-lg-4 col-12">
        {isEmpty(selectedPeriods) ? (
          <OverviewBlock
            programs={programs}
            previousPage={`creators_${creatorId}`}
            podcastPrograms={podcastPrograms}
            onChangeTab={key => setActiveKey(key)}
            onSubscribe={() => (isAuthenticated ? onCheckOutModalOpen?.() : setAuthModalVisible?.(true))}
          />
        ) : (
          <Card
            style={
              isDesktop
                ? {
                    borderRadius: '4%',
                    boxShadow: '0 0 2vmin 0 rgba(0, 0, 0, 0.15)',
                    padding: '2vmin',
                    background: 'white',
                    maxHeight: '50vh',
                    overflow: 'auto',
                    position: 'fixed',
                    top: '50vh',
                    transform: 'translateY(-50%)',
                  }
                : {}
            }
          >
            <Card.Title style={{ fontSize: '1.2em', fontWeight: 'bold', padding: '1.2em 0' }}>
              已選擇 {selectedPeriods.length}{' '}
              {appointmentPeriodLengthLimit === Infinity ? `` : `/ ${appointmentPeriodLengthLimit}`} 堂
            </Card.Title>
            <VStack align="stretch">
              {map(
                converge(subtotalListItem(setSelectedPeriods) as any, [
                  pipe(props(['id', 'startedAt', 'endedAt'])),
                  always(selectedPeriods),
                ]),
              )(selectedPeriods)}
              <Button variant="outline" onClick={onCheckOutModalOpen}>
                立即購買
              </Button>
              {isCheckOutModalOpen ? (
                <MultiPeriodCheckoutModal
                  defaultProductId={`AppointmentPlan_${selectedAppointmentPlanId}`}
                  defaultProductDetails={
                    pipe(
                      project(['startedAt', 'endedAt']),
                      (map as any)(mergeRight({ quantity: 1 })),
                    )(selectedPeriods) as any
                  }
                  isCheckOutModalOpen={isCheckOutModalOpen}
                  onCheckOutModalOpen={onCheckOutModalOpen}
                  onCheckOutModalClose={onCheckOutModalClose}
                />
              ) : (
                <></>
              )}
            </VStack>
          </Card>
        )}
      </div>
    </div>
  )
}

const pickPeriodById: (id: string) => (selectedPeriods: Array<AppointmentPeriod>) => Array<AppointmentPeriod> = id =>
  pipe(filter((pipe as any)(prop('id'), equals(id))))

const subtotalListItem =
  (setSelectedPeriods: Dispatch<SetStateAction<Array<AppointmentPeriod>>>) =>
  ([id, start, end]: [string, Date, Date], selectedPeriods: Array<AppointmentPeriod>) =>
    (
      <>
        <HStack justify="space-around" key={id} id={id}>
          {}
          <p>
            {dayjs(start).format('YYYY-MM-DD (ddd) HH:mm')} ~ {dayjs(end).format('HH:mm')}
          </p>
          <DeleteOutlined
            rev={undefined}
            onClick={() =>
              (pipe(converge(without, [pickPeriodById(id), identity]), setSelectedPeriods) as any)(selectedPeriods)
            }
          />
        </HStack>
        <Divider />
      </>
    )

const AppointmentCollectionTabs: React.VFC<{
  creatorId: string
  appointmentPlans: (AppointmentPlan & { periods: AppointmentPeriod[] & { appointmentScheduleCreatedAt: Date }[] })[]
  selectedAppointmentPlanId: string
  setSelectedAppointmentPlanId: Dispatch<SetStateAction<string>>
  selectedPeriods: Array<AppointmentPeriod>
  setSelectedPeriods: Dispatch<SetStateAction<Array<AppointmentPeriod>>>
  setAppointmentPeriodLengthLimit: Dispatch<SetStateAction<number>>
}> = ({
  creatorId,
  appointmentPlans,
  selectedAppointmentPlanId,
  setSelectedAppointmentPlanId,
  selectedPeriods,
  setSelectedPeriods,
  setAppointmentPeriodLengthLimit,
}) => {
  const { formatMessage } = useIntl()

  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const appointmentPlanId = query.get('appointment_plan')

  useEffect(() => {
    if (!!appointmentPlanId) {
      setSelectedAppointmentPlanId(appointmentPlanId)
    }
  }, [appointmentPlanId, setSelectedAppointmentPlanId])

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

  const handleAppointmentClick = (appointmentPlan: AppointmentPlan) => {
    if (isEmpty(selectedPeriods) || window.confirm('尚有課程等待結帳，是否跳至其他系列？')) {
      setSelectedAppointmentPlanId(appointmentPlan.id)
      setSelectedPeriods([])
    }
  }

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
                onClick={() => handleAppointmentClick(appointmentPlan)}
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

      <HStack padding="1em">
        <span className="col-lg-4 col-12" style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
          選擇堂數
        </span>
        <Spacer />
        <Input
          className="col-lg-8 col-12"
          type="number"
          onChange={e => setAppointmentPeriodLengthLimit(defaultTo(Infinity)(Number(e.target.value)))}
        />
      </HStack>

      <AppointmentPlanCollection
        creatorId={creatorId}
        appointmentPlans={appointmentPlans
          .filter(v =>
            appointmentPlanId ? v.id === appointmentPlanId || v.isPrivate === false : v.isPrivate === false,
          )
          .filter((appointmentPlan, index) =>
            selectedAppointmentPlanId ? selectedAppointmentPlanId === appointmentPlan.id : index === 0,
          )}
        selectedPeriods={selectedPeriods}
        setSelectedPeriods={setSelectedPeriods}
      />
    </>
  )
}

export const AppointmentPlanCollection: React.FC<{
  creatorId: string
  appointmentPlans: (AppointmentPlan & { periods: AppointmentPeriod[] })[]
  selectedPeriods: Array<AppointmentPeriod>
  setSelectedPeriods: Dispatch<SetStateAction<Array<AppointmentPeriod>>>
}> = ({ creatorId, appointmentPlans, selectedPeriods, setSelectedPeriods }) => {
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const { isAuthenticated } = useAuth()
  const tracking = useTracking()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)

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
            {formatMessage(appointmentMessages.AppointmentCollectionTabs.timezone, {
              city: momentTz.tz.guess().split('/')[1],
              timezone: moment().zone(momentTz.tz.guess()).format('Z'),
            })}
          </StyledTimeStandardBlock>
          <AppointmentPeriodCollection
            creatorId={creatorId}
            appointmentPlan={{
              id: appointmentPlan.id,
              defaultMeetGateway: appointmentPlan.defaultMeetGateway,
              reservationType: appointmentPlan.reservationType,
              reservationAmount: appointmentPlan.reservationAmount,
              capacity: appointmentPlan.capacity,
            }}
            appointmentPeriods={appointmentPlan.periods}
            onClick={period => {
              if (!isAuthenticated) {
                setAuthModalVisible?.(true)
              } else {
                setSelectedPeriods(
                  (ifElse as any)(
                    includes(period),
                    without([period]),
                    pipe(append(period), sort(ascend((prop as any)('startedAt')))),
                  )(selectedPeriods),
                )
                ReactGA.plugin.execute('ec', 'addProduct', {
                  id: appointmentPlan.id,
                  name: appointmentPlan.title,
                  category: 'AppointmentPlan',
                  price: `${appointmentPlan.price}`,
                  quantity: '1',
                  currency: appointmentPlan.currency.id === 'LSC' ? 'LSC' : 'TWD',
                })
                ReactGA.plugin.execute('ec', 'setAction', 'add')
                ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart')
                const resource = resourceCollection[idx]
                resource && tracking.click(resource, { position: idx + 1 })
              }
            }}
          />

          {/* {appointmentPlan.currency.id === 'LSC' ? (
            <CoinCheckoutModal
              productId={`AppointmentPlan_${appointmentPlan.id}`}
              amount={appointmentPlan.price}
              currencyId={appointmentPlan.currency.id}
              phoneInputEnabled={true}
              startedAt={pipe<Array<AppointmentPeriod>, Date[], number[], number, Date>(pluck('startedAt'), map(date => Number(date)), apply(Math.min), num => new Date(num))(selectedPeriods)}
              renderTrigger={({ setVisible }) => (
                <AppointmentPeriodCollection
                  creatorId={creatorId}
                  appointmentPlan={{
                    id: appointmentPlan.id,
                    defaultMeetGateway: appointmentPlan.defaultMeetGateway,
                    reservationType: appointmentPlan.reservationType,
                    reservationAmount: appointmentPlan.reservationAmount,
                    capacity: appointmentPlan.capacity,
                  }}
                  appointmentPeriods={appointmentPlan.periods}
                  onClick={period => {
                    if (!isAuthenticated) {
                      setAuthModalVisible?.(true)
                    } else {
                      setSelectedPeriods(append(period)(selectedPeriods))
                      setVisible?.()
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
                      const resource = resourceCollection[idx]
                      resource && tracking.click(resource, { position: idx + 1 })
                    }
                  }}
                />
              )}
            />
          ) : (
            <CheckoutProductModal
              defaultProductId={`AppointmentPlan_${appointmentPlan.id}`}
              startedAt={pipe<Array<AppointmentPeriod>, Date[], number[], number, Date>(pluck('startedAt'), map(date => Number(date)), apply(Math.min), num => new Date(num))(selectedPeriods)}
              renderTrigger={({ onOpen }) => (
                <AppointmentPeriodCollection
                  creatorId={creatorId}
                  appointmentPlan={{
                    id: appointmentPlan.id,
                    defaultMeetGateway: appointmentPlan.defaultMeetGateway,
                    reservationType: appointmentPlan.reservationType,
                    reservationAmount: appointmentPlan.reservationAmount,
                    capacity: appointmentPlan.capacity,
                  }}
                  appointmentPeriods={appointmentPlan.periods}
                  onClick={period => {
                    if (!isAuthenticated) {
                      setAuthModalVisible?.(true)
                    } else {
                      onOpen?.()
                      setSelectedPeriods(append(period)(selectedPeriods))
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
                      const resource = resourceCollection[idx]
                      resource && tracking.click(resource, { position: idx + 1 })
                    }
                  }}
                />
              )}
            />
          )} */}
        </div>
      ))}
    </>
  )
}

export default AppointmentCollectionTabsWrapper
