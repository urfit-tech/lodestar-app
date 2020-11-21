import { useQuery } from '@apollo/react-hooks'
import { Button, Divider, Skeleton } from 'antd'
import BraftEditor from 'braft-editor'
import gql from 'graphql-tag'
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
import { useAuth } from '../components/auth/AuthContext'
import { AuthModalContext } from '../components/auth/AuthModal'
import CreatorCard from '../components/common/CreatorCard'
import { BREAK_POINT } from '../components/common/Responsive'
import { BraftContent } from '../components/common/StyledBraftEditor'
import DefaultLayout from '../components/layout/DefaultLayout'
import CheckoutProductModal from '../containers/checkout/CheckoutProductModal'
import { useApp } from '../containers/common/AppContext'
import { commonMessages, productMessages } from '../helpers/translation'
import { useMember, usePublicMember } from '../hooks/member'
import types from '../types'

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
const ActivityPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { activityId } = useParams<{ activityId: string }>()
  const { isAuthenticated, currentMemberId } = useAuth()
  const { settings, id: appId } = useApp()
  const { loadingMember, member } = useMember(currentMemberId || '')
  const { loading, error, data } = useQuery<types.GET_ACTIVITY, types.GET_ACTIVITYVariables>(GET_ACTIVITY, {
    variables: {
      activityId,
      memberId: currentMemberId || '',
    },
  })

  useEffect(() => {
    if (data?.activity_by_pk) {
      data.activity_by_pk.activity_tickets.forEach((activityTicket, index) => {
        ReactGA.plugin.execute('ec', 'addProduct', {
          id: activityTicket.id,
          name: `${data.activity_by_pk?.title} - ${activityTicket.title}`,
          category: 'ActivityTicket',
          price: `${activityTicket.price}`,
          quantity: '1',
          currency: 'TWD',
        })
        ReactGA.plugin.execute('ec', 'addImpression', {
          id: activityTicket.id,
          name: `${data.activity_by_pk?.title} - ${activityTicket.title}`,
          category: 'ActivityTicket',
          price: `${activityTicket.price}`,
          position: index + 1,
        })
      })
      if (data.activity_by_pk.activity_tickets.length > 0) {
        ReactGA.plugin.execute('ec', 'setAction', 'detail')
      }
      ReactGA.ga('send', 'pageview')
    }
  }, [data])

  if (loading || loadingMember) {
    return (
      <DefaultLayout white>
        <Skeleton active />
      </DefaultLayout>
    )
  }

  if (error || !data || !data.activity_by_pk) {
    return <DefaultLayout white>{formatMessage(commonMessages.status.readingError)}</DefaultLayout>
  }

  let seoMeta: { title?: string } | undefined
  try {
    seoMeta = JSON.parse(settings['seo.meta']).ActivityPage
  } catch (error) {}

  const siteTitle = data.activity_by_pk.title
    ? seoMeta?.title
      ? `${render(seoMeta.title, { activityTitle: data.activity_by_pk.title })}`
      : data.activity_by_pk.title
    : appId

  const siteDescription = BraftEditor.createEditorState(data.activity_by_pk.description)
    .toHTML()
    .replace(/(<([^>]+)>)/gi, '')
    .substr(0, 50)

  const ldData = JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: siteTitle,
    image: data.activity_by_pk.cover_url,
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
        <meta property="og:image" content={data.activity_by_pk.cover_url || ''} />
        <meta property="og:description" content={siteDescription} />
        <script type="application/ld+json">{ldData}</script>
      </Helmet>

      <ActivityBanner
        coverImage={data.activity_by_pk.cover_url || ''}
        activityTitle={data.activity_by_pk.title}
        activityCategories={data.activity_by_pk.activity_categories}
      />
      <ActivityContent>
        <Row>
          <Col xs={12} lg={8}>
            <div className="mb-5">
              <BraftContent>{data.activity_by_pk.description}</BraftContent>
            </div>

            <h2 className="mb-0">{formatMessage(productMessages.activity.title.event)}</h2>
            <Divider className="mt-0" />

            {data.activity_by_pk.activity_sessions.map((session: any, i: number) => (
              <div key={i} className="mb-4">
                <ActivitySessionItem activitySessionId={session.id} />
              </div>
            ))}
          </Col>

          <Col xs={12} lg={4}>
            <AuthModalContext.Consumer>
              {({ setVisible: setAuthModalVisible }) =>
                data.activity_by_pk?.activity_tickets.map(ticket => {
                  const participants = ticket.activity_ticket_enrollments_aggregate.aggregate
                    ? ticket.activity_ticket_enrollments_aggregate.aggregate.count || 0
                    : 0

                  return (
                    <div key={ticket.id} className="mb-4">
                      <ActivityTicket
                        id={ticket.id}
                        title={ticket.title}
                        description={ticket.description}
                        price={ticket.price}
                        count={ticket.count}
                        startedAt={new Date(ticket.started_at)}
                        endedAt={new Date(ticket.ended_at)}
                        isPublished={ticket.is_published}
                        activitySessionTickets={ticket.activity_session_tickets.map(sessionTicket => ({
                          id: sessionTicket.id,
                          activitySession: sessionTicket.activity_session,
                        }))}
                        participants={participants}
                        extra={
                          !data.activity_by_pk ||
                          !data.activity_by_pk.published_at ||
                          new Date(data.activity_by_pk.published_at).getTime() > Date.now() ||
                          new Date(ticket.started_at).getTime() > Date.now() ? (
                            <Button block disabled>
                              {formatMessage(commonMessages.button.unreleased)}
                            </Button>
                          ) : ticket.activity_ticket_enrollments.length > 0 ? (
                            <Button
                              block
                              onClick={() =>
                                history.push(
                                  `/orders/${ticket.activity_ticket_enrollments[0].order_log_id}/products/${ticket.activity_ticket_enrollments[0].order_product_id}`,
                                )
                              }
                            >
                              {formatMessage(commonMessages.button.ticket)}
                            </Button>
                          ) : participants >= ticket.count ? (
                            <Button block disabled>
                              {formatMessage(commonMessages.button.soldOut)}
                            </Button>
                          ) : new Date(ticket.ended_at).getTime() < Date.now() ? (
                            <Button block disabled>
                              {formatMessage(commonMessages.button.cutoff)}
                            </Button>
                          ) : isAuthenticated ? (
                            <CheckoutProductModal
                              renderTrigger={({ setVisible }) => (
                                <Button
                                  type="primary"
                                  block
                                  onClick={() => {
                                    ReactGA.plugin.execute('ec', 'addProduct', {
                                      id: ticket.id,
                                      name: `${data.activity_by_pk?.title} - ${ticket.title}`,
                                      category: 'ActivityTicket',
                                      price: `${ticket.price}`,
                                      quantity: '1',
                                      currency: 'TWD',
                                    })
                                    ReactGA.plugin.execute('ec', 'setAction', 'add')
                                    ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart')
                                    setVisible()
                                  }}
                                >
                                  {formatMessage(commonMessages.button.register)}
                                </Button>
                              )}
                              paymentType="perpetual"
                              defaultProductId={`ActivityTicket_${ticket.id}`}
                              member={member}
                            />
                          ) : (
                            <Button
                              type="primary"
                              block
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
            <h2 className="mb-0">{formatMessage(productMessages.activity.title.organizer)}</h2>
            <Divider className="mt-0" />

            <ActivityOrganizerIntro memberId={data.activity_by_pk.organizer_id} />
          </ActivityOrganizer>
        </Row>
      </ActivityContent>
    </DefaultLayout>
  )
}

const ActivityOrganizerIntro: React.FC<{
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

const GET_ACTIVITY = gql`
  query GET_ACTIVITY($activityId: uuid!, $memberId: String!) {
    activity_by_pk(id: $activityId) {
      id
      organizer_id
      cover_url
      title
      description
      published_at
      activity_categories {
        id
        category {
          id
          name
        }
      }
      activity_sessions(order_by: { started_at: asc }) {
        id
      }
      activity_tickets(where: { is_published: { _eq: true } }, order_by: { started_at: asc }) {
        id
        count
        description
        started_at
        is_published
        ended_at
        price
        title
        activity_session_tickets {
          id
          activity_session {
            id
            title
          }
        }
        activity_ticket_enrollments_aggregate {
          aggregate {
            count
          }
        }
        activity_ticket_enrollments(where: { member_id: { _eq: $memberId } }) {
          order_log_id
          order_product_id
        }
      }
    }
  }
`

export default ActivityPage
