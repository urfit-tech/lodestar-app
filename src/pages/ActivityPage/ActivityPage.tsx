import { Button, Divider, SkeletonText } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import ActivityBanner from '../../components/activity/ActivityBanner'
import ActivitySessionItemRefactor from '../../components/activity/ActivitySessionItemRefactor'
import ActivityTicketCard from '../../components/activity/ActivityTicketCard'
import ActivityTicketPaymentButton from '../../components/activity/ActivityTicketPaymentButton'
import { AuthModalContext } from '../../components/auth/AuthModal'
import CreatorCard from '../../components/common/CreatorCard'
import { BREAK_POINT } from '../../components/common/Responsive'
import DefaultLayout from '../../components/layout/DefaultLayout'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useEnrolledActivity } from '../../hooks/activity'
import { usePublicMember } from '../../hooks/member'
import NotFoundPage from '../NotFoundPage'
import ActivityPageHelmet from './ActivityPageHelmet'

const ActivityContent = styled(Container)`
  && {
    padding-top: 56px;
  }
`
const ActivityOrganizer = styled(Col)`
  @media (min-width: 320px) and (max-width: ${BREAK_POINT}px) {
    text-align: center;
    h3 {
      padding-top: 24px;
    }
    p {
      text-align: left;
    }
  }
`
const StyledTitle = styled.h2`
  margin: 0;
  font-size: 24px;
`

const ActivityPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { activityId } = useParams<{ activityId: string }>()
  const { isAuthenticated, currentMemberId } = useAuth()
  const { id: appId } = useApp()
  const { resourceCollection } = useResourceCollection([`${appId}:activity:${activityId}`], true)
  const { loading, data: activityData, error } = useEnrolledActivity(activityId, currentMemberId || '')
  const [isPlanListSticky, setIsPlanListSticky] = useState(false)
  const planListHeightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activityData) {
      activityData.activityTickets.forEach((activityTicket, index) => {
        ReactGA.plugin.execute('ec', 'addProduct', {
          id: activityTicket.id,
          name: `${activityData.title} - ${activityTicket.title}`,
          category: 'ActivityTicket',
          price: `${activityTicket.price}`,
          quantity: '1',
          currency: 'TWD',
        })
        ReactGA.plugin.execute('ec', 'addImpression', {
          id: activityTicket.id,
          name: `${activityData.title} - ${activityTicket.title}`,
          category: 'ActivityTicket',
          price: `${activityTicket.price}`,
          position: index + 1,
        })
      })
      if (activityData.activityTickets.length > 0) {
        ReactGA.plugin.execute('ec', 'setAction', 'detail')
      }
      ReactGA.ga('send', 'pageview')
      setIsPlanListSticky(window.innerHeight > (planListHeightRef.current?.clientHeight || 0) + 110)
    }
  }, [activityData])

  if (loading) {
    return (
      <DefaultLayout white>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  if (error || !activityData) {
    return <NotFoundPage />
  }

  const flatSessions = activityData.activityTickets
    .flatMap(ticket =>
      ticket.activitySessionTickets.map(session => ({
        ...session.activitySession,
        type: session.activitySessionType,
        ticket: { count: ticket.count, isEnrolled: !!ticket.orderId },
      })),
    )
    .sort((a, b) => dayjs(a.startedAt).valueOf() - dayjs(b.startedAt).valueOf())

  const mergedSessions: {
    [key: string]: {
      id: string
      startedAt: string
      endedAt: string
      location: string | null
      description: string | null
      threshold: string | null
      onlineLink: string | null
      attended: boolean
      title: string
      maxAmount: { online: number; offline: number }
      isEnrolled: boolean
    }
  } = {}
  flatSessions.forEach(item => {
    const sessionId = item.id

    if (!mergedSessions[sessionId]) {
      mergedSessions[sessionId] = { ...item, isEnrolled: false, maxAmount: { online: 0, offline: 0 } }
    }
    item.type === 'online' && (mergedSessions[sessionId].maxAmount.online += item.ticket.count)
    item.type === 'offline' && (mergedSessions[sessionId].maxAmount.offline += item.ticket.count)
    mergedSessions[sessionId].isEnrolled =
      mergedSessions[sessionId].isEnrolled || (!mergedSessions[sessionId].isEnrolled && !!item.ticket.isEnrolled)
  })

  return (
    <DefaultLayout white>
      <ActivityPageHelmet
        activity={{
          ...activityData,
          sessions: activityData.activityTickets
            .map(ticket => ticket.activitySessionTickets.map(st => st.activitySession))
            .flat() as any,
          tags: activityData.activityTags.map(tag => tag.activityTagName),
          tickets: activityData.activityTickets,
          publishedAt: activityData.publishedAt ? dayjs(activityData.publishedAt).toDate() : null,
        }}
      />
      {resourceCollection[0] && <Tracking.Detail resource={resourceCollection[0]} />}
      <ActivityBanner
        coverImage={activityData.coverUrl || ''}
        activityTitle={activityData.title}
        activityCategories={activityData.activityCategories.map(c => ({ id: c.id, name: c.category.name }))}
      />
      <ActivityContent>
        <Row>
          <Col xs={12} lg={8}>
            <div className="mb-5">
              <BraftContent>{activityData.description}</BraftContent>
            </div>

            <StyledTitle>{formatMessage(productMessages.activity.title.event)}</StyledTitle>
            <Divider className="mb-4" />

            {Object.values(mergedSessions).map(session => {
              return (
                <div key={session.id} className="mb-4">
                  <ActivitySessionItemRefactor
                    session={{
                      id: session.id,
                      location: session.location,
                      onlineLink: session.onlineLink,
                      title: session.title,
                      startedAt: session.startedAt,
                      endedAt: session.endedAt,
                      activityTitle: activityData.title,
                      isEnrolled: session.isEnrolled,
                      threshold: session.threshold || '',
                      isParticipantsVisible: activityData.isParticipantsVisible,
                      maxAmount: session.maxAmount,
                    }}
                  />
                </div>
              )
            })}
          </Col>

          <Col xs={12} lg={4}>
            <div className={`${isPlanListSticky ? 'activityPlanSticky' : ''}`} ref={planListHeightRef}>
              <AuthModalContext.Consumer>
                {({ setVisible: setAuthModalVisible }) =>
                  activityData.activityTickets.map(ticket => {
                    return (
                      <div key={ticket.id} className="mb-4">
                        <ActivityTicketCard
                          title={ticket.title}
                          description={ticket.description || undefined}
                          price={ticket.price}
                          count={ticket.count}
                          startedAt={dayjs(ticket.startedAt).toDate()}
                          endedAt={dayjs(ticket.endedAt).toDate()}
                          isPublished={ticket.isPublished}
                          sessions={ticket.activitySessionTickets.map(ticketSession => ({
                            id: ticketSession.activitySession.id,
                            type: ticketSession.activitySessionType,
                            title: ticketSession.activitySession.title,
                          }))}
                          participants={ticket.participants}
                          currencyId={ticket.currencyId}
                          extra={
                            !activityData ||
                            !activityData.publishedAt ||
                            dayjs(activityData.publishedAt).isAfter(dayjs()) ||
                            dayjs(ticket.startedAt).isAfter(dayjs()) ? (
                              <Button isFullWidth isDisabled>
                                {formatMessage(commonMessages.button.unreleased)}
                              </Button>
                            ) : ticket.orderId ? (
                              <Button
                                variant="outline"
                                isFullWidth
                                onClick={() =>
                                  history.push(`/orders/${ticket.orderId}/products/${ticket.orderProductId}`)
                                }
                              >
                                {formatMessage(commonMessages.button.ticket)}
                              </Button>
                            ) : ticket.participants >= ticket.count ? (
                              <Button isFullWidth isDisabled>
                                {formatMessage(commonMessages.button.soldOut)}
                              </Button>
                            ) : dayjs(ticket.endedAt).isBefore(dayjs()) ? (
                              <Button isFullWidth isDisabled>
                                {formatMessage(commonMessages.button.cutoff)}
                              </Button>
                            ) : isAuthenticated ? (
                              <ActivityTicketPaymentButton
                                ticketId={ticket.id}
                                ticketPrice={ticket.price}
                                ticketCurrencyId={ticket.currencyId}
                                isPublished={Boolean(activityData.publishedAt)}
                              />
                            ) : (
                              <Button
                                colorScheme="primary"
                                isFullWidth
                                onClick={() => setAuthModalVisible && setAuthModalVisible(true)}
                              >
                                {formatMessage(commonMessages.button.register)}
                              </Button>
                            )
                          }
                        />
                      </div>
                    )
                  })
                }
              </AuthModalContext.Consumer>
            </div>
          </Col>
        </Row>

        <Row className="mb-5">
          <ActivityOrganizer xs={12} lg={8}>
            <StyledTitle className="mb-0">{formatMessage(productMessages.activity.title.organizer)}</StyledTitle>
            <Divider className="mb-4" />

            <ActivityOrganizerIntro memberId={activityData.organizerId} />
          </ActivityOrganizer>
        </Row>
      </ActivityContent>
    </DefaultLayout>
  )
}

const ActivityOrganizerIntro: React.VFC<{
  memberId: string
}> = ({ memberId }) => {
  const { member } = usePublicMember(memberId)

  if (!member) {
    return null
  }

  return (
    <CreatorCard
      id={memberId}
      avatarUrl={member.pictureUrl}
      title={member.name || member.username}
      jobTitle={member.title}
      description={member.abstract}
      noPadding
    />
  )
}

export default ActivityPage
