import { Button, Divider, SkeletonText } from '@chakra-ui/react'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import React, { useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import ActivityBanner from '../../components/activity/ActivityBanner'
import ActivitySessionItem from '../../components/activity/ActivitySessionItem'
import ActivityTicketCard from '../../components/activity/ActivityTicketCard'
import ActivityTicketPaymentButton from '../../components/activity/ActivityTicketPaymentButton'
import { AuthModalContext } from '../../components/auth/AuthModal'
import CreatorCard from '../../components/common/CreatorCard'
import { BREAK_POINT } from '../../components/common/Responsive'
import DefaultLayout from '../../components/layout/DefaultLayout'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useActivity } from '../../hooks/activity'
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
  const { loading, error, activity } = useActivity({ activityId, memberId: currentMemberId || '' })

  useEffect(() => {
    if (activity) {
      activity.tickets.forEach((activityTicket, index) => {
        ReactGA.plugin.execute('ec', 'addProduct', {
          id: activityTicket.id,
          name: `${activity.title} - ${activityTicket.title}`,
          category: 'ActivityTicket',
          price: `${activityTicket.price}`,
          quantity: '1',
          currency: 'TWD',
        })
        ReactGA.plugin.execute('ec', 'addImpression', {
          id: activityTicket.id,
          name: `${activity.title} - ${activityTicket.title}`,
          category: 'ActivityTicket',
          price: `${activityTicket.price}`,
          position: index + 1,
        })
      })
      if (activity.tickets.length > 0) {
        ReactGA.plugin.execute('ec', 'setAction', 'detail')
      }
      ReactGA.ga('send', 'pageview')
    }
  }, [activity])

  if (loading) {
    return (
      <DefaultLayout white>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  if (error || !activity) {
    return <NotFoundPage />
  }

  return (
    <DefaultLayout white>
      <ActivityPageHelmet activity={activity} />
      {resourceCollection[0] && <Tracking.Detail resource={resourceCollection[0]} />}
      <ActivityBanner
        coverImage={activity.coverUrl || ''}
        activityTitle={activity.title}
        activityCategories={activity.categories}
      />
      <ActivityContent>
        <Row>
          <Col xs={12} lg={8}>
            <div className="mb-5">
              <BraftContent>{activity.description}</BraftContent>
            </div>

            <StyledTitle>{formatMessage(productMessages.activity.title.event)}</StyledTitle>
            <Divider className="mb-4" />

            {activity.sessions.map(({ id }) => (
              <div key={id} className="mb-4">
                <ActivitySessionItem activitySessionId={id} />
              </div>
            ))}
          </Col>

          <Col xs={12} lg={4}>
            <AuthModalContext.Consumer>
              {({ setVisible: setAuthModalVisible }) =>
                activity.tickets.map(ticket => {
                  return (
                    <div key={ticket.id} className="mb-4">
                      <ActivityTicketCard
                        title={ticket.title}
                        description={ticket.description || undefined}
                        price={ticket.price}
                        count={ticket.count}
                        startedAt={ticket.startedAt}
                        endedAt={ticket.endedAt}
                        isPublished={ticket.isPublished}
                        sessions={activity.ticketSessions
                          .filter(ticketSession => ticketSession.ticket.id === ticket.id)
                          .map(ticketSession => ({
                            id: ticketSession.session.id,
                            type: ticketSession.session.type,
                            title: ticketSession.session.title,
                          }))}
                        participants={ticket.participants}
                        currencyId={ticket.currencyId}
                        extra={
                          !activity ||
                          !activity.publishedAt ||
                          activity.publishedAt.getTime() > Date.now() ||
                          ticket.startedAt.getTime() > Date.now() ? (
                            <Button isFullWidth isDisabled>
                              {formatMessage(commonMessages.button.unreleased)}
                            </Button>
                          ) : ticket.enrollments.length > 0 ? (
                            <Button
                              variant="outline"
                              isFullWidth
                              onClick={() =>
                                history.push(
                                  `/orders/${ticket.enrollments[0].orderId}/products/${ticket.enrollments[0].orderProductId}`,
                                )
                              }
                            >
                              {formatMessage(commonMessages.button.ticket)}
                            </Button>
                          ) : ticket.participants >= ticket.count ? (
                            <Button isFullWidth isDisabled>
                              {formatMessage(commonMessages.button.soldOut)}
                            </Button>
                          ) : ticket.endedAt.getTime() < Date.now() ? (
                            <Button isFullWidth isDisabled>
                              {formatMessage(commonMessages.button.cutoff)}
                            </Button>
                          ) : isAuthenticated ? (
                            <ActivityTicketPaymentButton
                              ticketId={ticket.id}
                              ticketPrice={ticket.price}
                              ticketCurrencyId={ticket.currencyId}
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
          </Col>
        </Row>

        <Row className="mb-5">
          <ActivityOrganizer xs={12} lg={8}>
            <StyledTitle className="mb-0">{formatMessage(productMessages.activity.title.organizer)}</StyledTitle>
            <Divider className="mb-4" />

            <ActivityOrganizerIntro memberId={activity.organizerId} />
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
