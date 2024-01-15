import { Icon } from '@chakra-ui/icons'
import { Button, IconButton, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { HiExternalLink } from 'react-icons/hi'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { dateRangeFormatter } from '../../helpers'
import { activityMessages, commonMessages, productMessages } from '../../helpers/translation'
import { useActivitySessionEnrollment } from '../../hooks/activity'
import { CalendarOIcon, MapOIcon, TimesIcon, VideoIcon } from '../../images'

const messages = defineMessages({
  attended: { id: 'activity.ui.attended', defaultMessage: '已簽到' },
  attendNow: { id: 'activity.ui.attendNow', defaultMessage: '立即簽到' },
  enterLinkPage: { id: 'activity.ui.enterLinkPage', defaultMessage: '進入直播頁面' },
})

const StyledWrapper = styled.div`
  padding: 1.5rem 0;
  background: #f7f8f8;
  border-radius: 4px;
  color: #585858;
`
const StyledTitle = styled.h2`
  padding-left: 1.5rem;
  border-left: 2px solid ${props => props.theme['@primary-color']};
  font-size: 16px;
`
const StyledContent = styled.div`
  line-height: 1.5;
  padding: 0 1.5rem;

  > div + div {
    margin-top: 0.75rem;
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

const ActivitySessionItemRefactor: React.VFC<{
  session: {
    id: string
    location: string | null
    onlineLink: string | null
    title: string
    startedAt: string
    endedAt: string
    activityTitle: string
    isEnrolled: boolean
    threshold: string
    isParticipantsVisible: boolean
    // maxAmount: { online: number; offline: number }
  }
  renderSessionType?: string
  renderLocation?: React.ReactNode
  renderAttend?: React.ReactNode
}> = ({ session, renderSessionType, renderLocation, renderAttend }) => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  const { currentMemberId } = useAuth()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { session: sessionEnrollmentAmount } = useActivitySessionEnrollment(session.id, currentMemberId || '')

  if (!session) {
    return <StyledWrapper>{formatMessage(commonMessages.status.loadingError)}</StyledWrapper>
  }

  const sessionType =
    session.location && session.onlineLink ? 'both' : session.location ? 'offline' : session.onlineLink ? 'online' : ''

  return (
    <StyledWrapper>
      <StyledTitle className="mb-3">
        {session.title}
        {renderSessionType}
      </StyledTitle>
      <StyledContent>
        <div>
          <Icon as={CalendarOIcon} className="mr-2" />
          <span>
            {dateRangeFormatter({
              startedAt: dayjs(session.startedAt).toDate(),
              endedAt: dayjs(session.endedAt).toDate(),
            })}
          </span>
        </div>

        {renderLocation || (
          <>
            {(sessionType === 'offline' || sessionType === 'both') && (
              <div className="mt-2">
                <Icon as={MapOIcon} className="mr-2" />
                <span>{session.location}</span>
              </div>
            )}

            {enabledModules.activity_online && session.onlineLink && (
              <div className="mt-2">
                {session.isEnrolled === false && formatMessage(activityMessages.text.live)}
                {session.isEnrolled === true && (
                  <div className="d-flex align-items-center">
                    <Icon as={VideoIcon} className="mr-2" />

                    {['https', '<iframe'].some(prefix => session.onlineLink?.startsWith(prefix)) === false && (
                      <span>{session.onlineLink}</span>
                    )}
                    {session.onlineLink.startsWith('https') && (
                      <div className="d-flex align-items-center" style={{ lineHeight: 1.5 }}>
                        <a href={session.onlineLink} target="_blank" rel="noopener noreferrer">
                          <div className="d-flex align-items-center">
                            <div className="mr-1">{formatMessage(activityMessages.text.liveLink)}</div>
                            <HiExternalLink />
                          </div>
                        </a>
                      </div>
                    )}
                    {session.onlineLink.startsWith('<iframe') && (
                      <>
                        <Button variant="link" onClick={onOpen} style={{ lineHeight: 1.5 }}>
                          {formatMessage(messages.enterLinkPage)}
                        </Button>
                        <Modal onClose={onClose} size="full" isOpen={isOpen}>
                          <ModalContent style={{ margin: 0 }}>
                            <div className="d-flex align-items-center p-3">
                              <IconButton
                                className="flex-shrink-0"
                                aria-label="close"
                                onClick={onClose}
                                icon={<TimesIcon />}
                              />
                              <ModalHeader className="flex-grow-1 py-0">{session.activityTitle}</ModalHeader>
                            </div>
                            <StyledModalBody dangerouslySetInnerHTML={{ __html: session.onlineLink }} />
                          </ModalContent>
                        </Modal>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div>
          {/* {session.isParticipantsVisible && (
            <>
              <Icon as={UserOIcon} className="mr-2" />
              {sessionType === 'offline' && (
                <span className="mr-3">
                  {sessionEnrollmentAmount?.enrollmentAmount['offline'] || 0} / {session.maxAmount['offline']}
                </span>
              )}
              {enabledModules.activity_online && sessionType === 'online' && (
                <span className="mr-3">
                  {sessionEnrollmentAmount?.enrollmentAmount['online'] || 0} / {session.maxAmount['online']}
                </span>
              )}
              {enabledModules.activity_online && sessionType === 'both' && (
                <>
                  <span className="mr-2">
                    {`${formatMessage(activityMessages.label['offline'])} `}
                    {sessionEnrollmentAmount?.enrollmentAmount['offline'] || 0} / {session.maxAmount['offline']}
                  </span>
                  <span className="mr-2">
                    {`${formatMessage(activityMessages.label['online'])} `}
                    {sessionEnrollmentAmount?.enrollmentAmount['online'] || 0} / {session.maxAmount['online']}
                  </span>
                </>
              )}
            </>
          )} */}
          {session.threshold && (
            <span>
              {formatMessage(productMessages.activity.content.least)}
              {session.threshold}
            </span>
          )}
        </div>

        {renderAttend && <div className="pt-2">{renderAttend}</div>}
      </StyledContent>
    </StyledWrapper>
  )
}

export default ActivitySessionItemRefactor
