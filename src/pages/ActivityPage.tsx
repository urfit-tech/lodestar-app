import { Button, Divider, SkeletonText } from '@chakra-ui/react'
import BraftEditor from 'braft-editor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { render } from 'mustache'
import React, { useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import ReactGA from 'react-ga'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import ActivityBanner from '../components/activity/ActivityBanner'
import ActivitySessionItem from '../components/activity/ActivitySessionItem'
import ActivityTicket from '../components/activity/ActivityTicket'
import ActivityTicketPaymentButton from '../components/activity/ActivityTicketPaymentButton'
import { AuthModalContext } from '../components/auth/AuthModal'
import CreatorCard from '../components/common/CreatorCard'
import { BREAK_POINT } from '../components/common/Responsive'
import { BraftContent } from '../components/common/StyledBraftEditor'
import DefaultLayout from '../components/layout/DefaultLayout'
import { commonMessages, productMessages } from '../helpers/translation'
import { useActivity } from '../hooks/activity'
import { usePublicMember } from '../hooks/member'

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
  const { settings, id: appId } = useApp()
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
    return <DefaultLayout white>{formatMessage(commonMessages.status.readingError)}</DefaultLayout>
  }

  let seoMeta: { title?: string } | undefined
  try {
    seoMeta = JSON.parse(settings['seo.meta']).ActivityPage
  } catch (error) {}

  const siteTitle = activity.title
    ? seoMeta?.title
      ? `${render(seoMeta.title, { activityTitle: activity.title })}`
      : activity.title
    : appId

  const siteDescription = BraftEditor.createEditorState(activity.description)
    .toHTML()
    .replace(/(<([^>]+)>)/gi, '')
    .substr(0, 50)

  const ldData = JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: siteTitle,
    image: activity.coverUrl,
    description: siteDescription,
    url: window.location.href,
    brand: {
      '@type': 'Brand',
      name: siteTitle,
      description: siteDescription,
    },
  })

  return (
    <DefaultLayout white>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={activity.coverUrl || ''} />
        <meta property="og:description" content={siteDescription} />
        <script type="application/ld+json">{ldData}</script>
      </Helmet>

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

            {activity.sessionIds.map(id => (
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
                      <ActivityTicket
                        id={ticket.id}
                        title={ticket.title}
                        description={ticket.description}
                        price={ticket.price}
                        count={ticket.count}
                        startedAt={ticket.startedAt}
                        endedAt={ticket.endedAt}
                        isPublished={ticket.isPublished}
                        activityTicketSessions={ticket.sessions}
                        participants={ticket.participants}
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
                            <ActivityTicketPaymentButton ticket={ticket} />
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
