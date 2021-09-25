import { Button, Icon, SkeletonText } from '@chakra-ui/react'
import QRCode from 'qrcode.react'
import React, { useState } from 'react'
import { AiOutlineRight } from 'react-icons/ai'
import { defineMessages, useIntl } from 'react-intl'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import ActivityBanner from '../components/activity/ActivityBanner'
import ActivitySessionItem from '../components/activity/ActivitySessionItem'
import { useAuth } from '../components/auth/AuthContext'
import { CommonLargeTitleMixin } from '../components/common'
import DefaultLayout from '../components/layout/DefaultLayout'
import { useApp } from '../containers/common/AppContext'
import { handleError } from '../helpers'
import { activityMessages, commonMessages, productMessages } from '../helpers/translation'
import { useActivityAttendance, useActivityTicket, useAttendSession } from '../hooks/activity'
import { ReactComponent as MapOIcon } from '../images/map-o.svg'
import { ReactComponent as VideoIcon } from '../images/video.svg'

const StyledContainer = styled.div`
  padding: 2.5rem 15px 5rem;
`
const StyledLink = styled(Link)`
  display: block;
  width: 100%;
  max-width: 15rem;
  margin: 0 auto;
`
const StyledTitle = styled.div`
  ${CommonLargeTitleMixin}
  margin-bottom: 0.75rem;
`
const StyledMeta = styled.div`
  color: var(--gray-darker);
  line-height: 1.69;
  letter-spacing: 0.2px;
  text-align: justify;

  > div {
    margin-bottom: 0.5rem;
  }
`

const messages = defineMessages({
  attended: { id: 'activity.ui.attended', defaultMessage: '已簽到' },
  attendNow: { id: 'activity.ui.attendNow', defaultMessage: '立即簽到' },
})

const ActivityTicketPage: React.VFC<{
  activityTicketId: string
  memberId: string
  orderProductId: string
  invoice?: any
}> = ({ activityTicketId, memberId, orderProductId, invoice }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId, currentUserRole } = useAuth()
  const { enabledModules } = useApp()
  const { loadingTicket, errorTicket, ticket } = useActivityTicket(activityTicketId)
  const { loadingAttendance, attendance, refetchAttendance } = useActivityAttendance(memberId, activityTicketId)
  const { attendActivitySession, leaveActivitySession } = useAttendSession()
  const [loading, setLoading] = useState(false)

  if (loadingTicket) {
    return (
      <DefaultLayout noFooter white>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  if (errorTicket || !ticket) {
    return <Redirect to={`/members/${currentMemberId}`} />
  }

  return (
    <DefaultLayout noFooter white>
      <ActivityBanner
        activityCategories={ticket.activity.categories.map(v => ({
          id: v.id,
          name: v.name,
        }))}
        activityTitle={ticket.activity.title}
        coverImage={ticket.activity.coverUrl || ''}
      >
        {enabledModules.qrcode && currentUserRole === 'general-member' && (
          <QRCode value={window.location.href} size={256} />
        )}
      </ActivityBanner>

      <StyledContainer className="container">
        <div className="text-center mb-5">
          <StyledTitle>{invoice.name}</StyledTitle>
          <div className="d-flex justify-content-center">
            <StyledMeta>
              {typeof invoice.email === 'string' && (
                <div>
                  {formatMessage(productMessages.activity.content.email)}
                  {invoice.email}
                </div>
              )}
              {typeof invoice.phone === 'string' && (
                <div>
                  {formatMessage(productMessages.activity.content.phone)}
                  {invoice.phone}
                </div>
              )}
              <div>
                {formatMessage(productMessages.activity.content.orderNo)}
                {orderProductId.split('-', 1)[0]}
              </div>
            </StyledMeta>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="mb-5">
              {ticket.sessions
                .filter(ticketSession => enabledModules.activity_online || ticketSession.type === 'offline')
                .map(ticketSession => (
                  <div key={ticketSession.id} className="mb-4">
                    <ActivitySessionItem
                      activitySessionId={ticketSession.id}
                      renderSessionType={` - ${formatMessage(activityMessages.label[ticketSession.type])}`}
                      renderLocation={
                        <>
                          {ticketSession.type === 'offline' && (
                            <div>
                              <Icon as={MapOIcon} className="mr-2" />
                              <span>{ticketSession.location}</span>
                            </div>
                          )}
                          {ticketSession.type === 'online' && ticketSession.onlineLink && (
                            <div className="d-flex align-items-center">
                              <Icon as={VideoIcon} className="mr-2" />
                              <span>
                                <span className="mr-1">{formatMessage(activityMessages.text.liveLink)}</span>
                                <a href={ticketSession.onlineLink} target="_blank" rel="noopener noreferrer">
                                  <Button variant="link">{ticketSession.onlineLink}</Button>
                                </a>
                              </span>
                            </div>
                          )}
                        </>
                      }
                      renderAttend={
                        enabledModules.qrcode &&
                        currentUserRole === 'app-owner' &&
                        !loadingAttendance &&
                        (attendance[ticketSession.id] ? (
                          <Button
                            isFullWidth
                            isLoading={loading}
                            onClick={() => {
                              setLoading(true)
                              leaveActivitySession({
                                variables: {
                                  orderProductId,
                                  activitySessionId: ticketSession.id,
                                },
                              })
                                .then(() => refetchAttendance())
                                .catch(error => handleError(error))
                                .finally(() => setLoading(false))
                            }}
                          >
                            <Icon type="check" /> {formatMessage(messages.attended)}
                          </Button>
                        ) : (
                          <Button
                            colorScheme="primary"
                            isFullWidth
                            isLoading={loading}
                            onClick={() => {
                              setLoading(true)
                              attendActivitySession({
                                variables: {
                                  orderProductId,
                                  activitySessionId: ticketSession.id,
                                },
                              })
                                .then(() => refetchAttendance())
                                .catch(error => handleError(error))
                                .finally(() => setLoading(false))
                            }}
                          >
                            {formatMessage(messages.attendNow)}
                          </Button>
                        ))
                      }
                    />
                  </div>
                ))}
            </div>

            <StyledLink to={`/activities/${ticket.activity.id}`} target="_blank">
              <Button colorScheme="link" isFullWidth>
                <span>{formatMessage(commonMessages.link.more)}</span>
                <Icon as={AiOutlineRight} />
              </Button>
            </StyledLink>
          </div>
        </div>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default ActivityTicketPage
