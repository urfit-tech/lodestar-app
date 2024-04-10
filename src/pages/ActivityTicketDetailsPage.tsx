import {
  Button,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  SkeletonText,
  useDisclosure,
} from '@chakra-ui/react'
import { CommonLargeTitleMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import QRCode from 'qrcode.react'
import React, { useEffect, useState } from 'react'
import { AiOutlineRight } from 'react-icons/ai'
import { HiExternalLink } from 'react-icons/hi'
import { defineMessages, useIntl } from 'react-intl'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import ActivityBanner from '../components/activity/ActivityBanner'
import ActivitySessionItem from '../components/activity/ActivitySessionItem'
import DefaultLayout from '../components/layout/DefaultLayout'
import { handleError } from '../helpers'
import { activityMessages, commonMessages, productMessages } from '../helpers/translation'
import { useActivityAttendance, useAttendSession } from '../hooks/activity'
import { useMemberRightActivityTicket } from '../hooks/activityTicket'
import { MapOIcon, TimesIcon, VideoIcon } from '../images'
import NotFoundPage from './NotFoundPage'

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
const StyledModalBody = styled(ModalBody)`
  && {
    padding: 0;
    iframe {
      width: 100%;
      height: 100%;
    }
  }
`

const messages = defineMessages({
  attended: { id: 'activity.ui.attended', defaultMessage: '已簽到' },
  attendNow: { id: 'activity.ui.attendNow', defaultMessage: '立即簽到' },
  enterLinkPage: { id: 'activity.ui.enterLinkPage', defaultMessage: '進入直播頁面' },
})

type ActivityTicket = {
  id: string
  activity: {
    id: string
    title: string
    coverUrl: string
    categories: { id: string; name: string }[]
  }
}

type ActivitySession = {
  id: string
  startedAt: string
  endedAt: string
  location: string | null
  description: string | null
  threshold: string | null
  onlineLink: string | null
  title: string
  maxAmount: { online: number; offline: number }
  participants: { online: number; offline: number }
  isEnrolled: boolean
  type: 'both' | 'offline' | 'online'
}

type Invoice = {
  name: string
  email: string
  phone: string
  orderProductId: string
}

const ActivityTicketDetailsPage = () => {
  const { activityTicketId } = useParams<{ activityTicketId: string }>()
  console.log({ activityTicketId })
  const { activityTicketData, activityTicketDataLoading } = useMemberRightActivityTicket(activityTicketId)
  console.log({ activityTicketData })
  const { isOpen, onClose, onOpen } = useDisclosure()

  const [ticket, setTicket] = useState<ActivityTicket | null>(null)
  const [sessions, setSessions] = useState<ActivitySession[]>([])
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const { enabledModules } = useApp()
  const { currentMemberId, currentUserRole } = useAuth()
  const [loading, setLoading] = useState(false)
  const { attendActivitySession, leaveActivitySession } = useAttendSession()
  const { loadingAttendance, attendance, refetchAttendance } = useActivityAttendance(
    currentMemberId as string,
    activityTicketId,
  )

  const { formatMessage } = useIntl()

  useEffect(() => {
    if (activityTicketData) {
      setTicket({
        id: activityTicketData?.id,
        activity: {
          id: activityTicketData.activity.id,
          title: activityTicketData.activity.title,
          coverUrl: activityTicketData.activity.coverUrl,
          categories: activityTicketData.activity.categories,
        },
      })

      setSessions(activityTicketData.sessions)

      setInvoice({
        name: activityTicketData.invoice.name,
        email: activityTicketData.invoice.email,
        phone: activityTicketData.invoice.phone,
        orderProductId: activityTicketData.invoice.orderProductId,
      })
    }
  }, [activityTicketData])

  if (!activityTicketDataLoading && !activityTicketData) {
    return <NotFoundPage />
  }

  if (activityTicketDataLoading) {
    return (
      <DefaultLayout noFooter>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout noFooter white>
      <ActivityBanner
        activityCategories={
          ticket?.activity.categories.map(v => ({
            id: v.id,
            name: v.name,
          })) || []
        }
        activityTitle={ticket?.activity.title || ''}
        coverImage={ticket?.activity.coverUrl || ''}
      >
        {enabledModules.qrcode && currentUserRole === 'general-member' && (
          <QRCode value={window.location.href} size={256} />
        )}
      </ActivityBanner>

      <StyledContainer className="container">
        <div className="text-center mb-5">
          <StyledTitle>{invoice?.name}</StyledTitle>
          <div className="d-flex justify-content-center">
            <StyledMeta>
              {typeof invoice?.email === 'string' && (
                <div>
                  {formatMessage(productMessages.activity.content.email)}
                  {invoice?.email}
                </div>
              )}
              {typeof invoice?.phone === 'string' && invoice?.phone.length !== 0 && (
                <div>
                  {formatMessage(productMessages.activity.content.phone)}
                  {invoice?.phone}
                </div>
              )}
              <div>
                {formatMessage(productMessages.activity.content.orderNo)}
                {invoice?.orderProductId?.split('-', 1)[0]}
              </div>
            </StyledMeta>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="mb-5">
              {sessions.map(session => (
                <div key={session.id} className="mb-4">
                  <ActivitySessionItem
                    session={{
                      id: session.id,
                      location: session.location,
                      onlineLink: session.onlineLink,
                      title: session.title,
                      startedAt: session.startedAt,
                      endedAt: session.endedAt,
                      activityTitle: ticket?.activity.title || '',
                      isEnrolled: session.isEnrolled,
                      threshold: session.threshold || '',
                      isParticipantsVisible: true,
                      maxAmount: session.maxAmount,
                      participants: session.participants,
                    }}
                    renderSessionType={` - ${formatMessage(activityMessages.label[session.type])}`}
                    renderLocation={
                      <>
                        {session.type === 'offline' && (
                          <div>
                            <Icon as={MapOIcon} className="mr-2" />
                            <span>{session.location}</span>
                          </div>
                        )}
                        {session.type === 'online' && session.onlineLink && (
                          <div className="d-flex align-items-center">
                            <Icon as={VideoIcon} className="mr-2" />
                            <span>
                              {session.onlineLink.startsWith('https') ? (
                                <div className="d-flex align-items-center" style={{ lineHeight: 1.5 }}>
                                  <a href={session.onlineLink} target="_blank" rel="noopener noreferrer">
                                    <div className="d-flex align-items-center">
                                      <div className="mr-1">{formatMessage(activityMessages.text.liveLink)}</div>
                                      <HiExternalLink />
                                    </div>
                                  </a>
                                </div>
                              ) : session.onlineLink.startsWith('<iframe') ? (
                                <div className="d-flex align-items-center">
                                  <Modal onClose={onClose} size="full" isOpen={isOpen}>
                                    <ModalContent style={{ margin: 0 }}>
                                      <div className="d-flex align-items-center p-3">
                                        <IconButton
                                          className="flex-shrink-0"
                                          aria-label="close"
                                          onClick={onClose}
                                          icon={<TimesIcon />}
                                        />
                                        <ModalHeader className="flex-grow-1 py-0">{ticket?.activity.title}</ModalHeader>
                                      </div>
                                      <StyledModalBody dangerouslySetInnerHTML={{ __html: session.onlineLink }} />
                                    </ModalContent>
                                  </Modal>
                                  <Button variant="link" onClick={onOpen} style={{ lineHeight: 1.5 }}>
                                    {formatMessage(messages.enterLinkPage)}
                                  </Button>
                                </div>
                              ) : (
                                session.onlineLink
                              )}
                            </span>
                          </div>
                        )}
                      </>
                    }
                    renderAttend={
                      <Button
                        colorScheme="primary"
                        isFullWidth
                        isLoading={loading}
                        disabled={attendance[session.id]}
                        onClick={() => {
                          setLoading(true)
                          attendActivitySession({
                            variables: {
                              orderProductId: invoice?.orderProductId,
                              activitySessionId: session.id,
                            },
                          })
                            .then(() => refetchAttendance())
                            .catch(error => handleError(error))
                            .finally(() => setLoading(false))
                        }}
                      >
                        {attendance[session.id] ? formatMessage(messages.attended) : formatMessage(messages.attendNow)}
                      </Button>
                    }
                  />
                </div>
              ))}
            </div>

            <StyledLink to={`/activities/${ticket?.activity.id}`} target="_blank">
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

export default ActivityTicketDetailsPage
