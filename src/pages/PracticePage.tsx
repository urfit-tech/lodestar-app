import { ChevronDownIcon } from '@chakra-ui/icons'
import { Box, Button, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Spinner } from '@chakra-ui/react'
import { message, Skeleton } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link, useHistory, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { useAuth } from '../components/auth/AuthContext'
import { CommonTitleMixin } from '../components/common'
import MemberAvatar, { MemberName } from '../components/common/MemberAvatar'
import { BraftContent } from '../components/common/StyledBraftEditor'
import DefaultLayout from '../components/layout/DefaultLayout'
import MessageSuggestItem from '../components/practice/MessageSuggestItem'
import PracticeUploadModal from '../components/practice/PracticeUploadModal'
import SuggestionCreationModal from '../components/practice/SuggestionCreationModal'
import { downloadFile, getFileDownloadableLink } from '../helpers'
import { commonMessages, practiceMessages } from '../helpers/translation'
import { useMutatePractice, usePractice } from '../hooks/practice'
import { ReactComponent as CalendarOIcon } from '../images/calendar-alt-o.svg'
import { ReactComponent as MoreIcon } from '../images/ellipsis.svg'
import { ReactComponent as HeartIcon } from '../images/icon-heart-o.svg'
import { ReactComponent as HeartFillIcon } from '../images/icon-heart.svg'

const StyledContainer = styled.div`
  max-width: 720px;
`
const StyledSubTitle = styled.h4`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`
const StyledTitle = styled.h3`
  font-size: clamp(24px, 2vw, 40px);
  font-weight: bold;
  line-height: 1.1;
  letter-spacing: 1px;
  color: var(--gray-darker);
  margin-right: 20px;
  line-height: 1.5;
`
const StyledPracticeTitle = styled.h3`
  ${CommonTitleMixin}
`
const StyledDate = styled.span`
  border-left: 1px solid var(--gray);
  font-size: 14px;
  font-weight: 500;
  padding-left: 8px;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`
const StyledIconButton = styled(IconButton)<{ isActive?: boolean }>`
  &&& {
    border: 1px solid ${props => (props.isActive ? props.theme['@primary-color'] : 'var(--gray-dark)')};
    color: ${props => (props.isActive ? props.theme['@primary-color'] : 'var(--gray-dark)')};
    border-radius: 50%;
    background: white;
  }
`
const StyledIcon = styled(Icon)`
  margin-top: 2px;
`
const StyledLikedCount = styled.span<{ isActive?: boolean }>`
  color: var(--gray-dark);
  font-size: 12px;
  font-weight: 500;

  ${props =>
    props.isActive &&
    css`
      color: ${props.theme['@primary-color']};
      text-shadow: 0 0 3px ${props.theme['@primary-color']}33;
    `}
`
const StyledDivider = styled.div`
  border-bottom: 1px solid var(--gray-light);
`

const messages = defineMessages({
  practiceSuggestion: { id: 'program.label.practiceSuggestion', defaultMessage: '作業建議' },
  practiceFile: { id: 'program.ui.practiceFile', defaultMessage: '作業檔案' },
  view: { id: 'program.ui.view', defaultMessage: '查看' },
  editSuggestion: { id: 'program.ui.editSuggestion', defaultMessage: '編輯建議' },
  deleteSuggestion: { id: 'program.ui.deleteSuggestion', defaultMessage: '刪除建議' },
})

const PracticePage: React.FC = () => {
  const { practiceId } = useParams<{ practiceId: string }>()
  const { formatMessage } = useIntl()
  const { currentMemberId, authToken, apiHost } = useAuth()
  const history = useHistory()
  const { loadingPractice, errorPractice, practice, refetchPractice } = usePractice({ practiceId })
  const { deletePractice, insertPracticeReaction, deletePracticeReaction } = useMutatePractice(practiceId)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)

  const [likeStatus, setLikeStatus] = useState({
    isLiked: practice?.reactedMemberIds?.some(memberId => memberId === currentMemberId) || false,
    likedCount: practice?.reactedMemberIdsCount || 0,
  })

  useEffect(() => {
    if (currentMemberId) {
      setLikeStatus({
        isLiked: practice?.reactedMemberIds.includes(currentMemberId) || false,
        likedCount: practice?.reactedMemberIdsCount || 0,
      })
    }
  }, [currentMemberId, practice?.id])

  if (loadingPractice) {
    return <Skeleton active />
  }

  if (errorPractice || !practice) {
    return <div>{formatMessage(commonMessages.status.readingError)}</div>
  }

  const files: {
    id: string
    name: string
    from: string
  }[] = [
    ...practice.attachments.map(attachment => ({
      id: attachment.id,
      name: attachment.data.name,
      from: 'practice',
    })),
  ]

  const handleDownload = async (fileIndex: number) => {
    setIsDownloading(true)
    const file = files[fileIndex]
    const fileKey = `attachments/${file.id}`
    try {
      const fileLink = await getFileDownloadableLink(fileKey, authToken, apiHost)
      const fileRequest = new Request(fileLink)
      const response = await fetch(fileRequest)
      response.url &&
        downloadFile(file.name, { url: response.url }).then(() => {
          setIsDownloading(false)
        })
    } catch (error) {
      message.error(error)
    }
  }
  const handleDelete = async () => {
    if (practice.memberId === currentMemberId) {
      await deletePractice()
      history.push(`/programs/${practice.programId}/contents/${practice.programContentId}`)
    }
  }
  const handleLikeStatus = async () => {
    if (likeStatus.isLiked) {
      await deletePracticeReaction()
    } else {
      await insertPracticeReaction()
    }
    setLikeStatus({
      isLiked: !likeStatus.isLiked,
      likedCount: likeStatus.isLiked ? likeStatus?.likedCount - 1 : likeStatus?.likedCount + 1,
    })
    await refetchPractice()
  }

  return (
    <DefaultLayout white noFooter>
      <StyledContainer className="container mt-5">
        <div className="d-flex mb-2">
          <StyledSubTitle className="mr-2">
            <span>{practice.programTitle}</span>
            <span> - </span>
            <span>{practice.programContentTitle}</span>
          </StyledSubTitle>
          <Link to={`/programs/${practice.programId}/contents/${practice.programContentId}`}>
            {formatMessage(messages.view)}
          </Link>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <StyledTitle>{practice.title}</StyledTitle>
          {practice.memberId === currentMemberId && (
            <Box className="d-flex" h="40px">
              <PracticeUploadModal
                practice={practice}
                programContentId={practice.programContentId}
                onRefetch={refetchPractice}
                onSubmit={() => window.location.reload(true)}
              />

              <Menu>
                <MenuButton className="p-2">
                  <Icon as={MoreIcon} />
                </MenuButton>
                <MenuList minWidth="110px">
                  <MenuItem onClick={handleDelete}>{formatMessage(practiceMessages.button.delete)}</MenuItem>
                </MenuList>
              </Menu>
            </Box>
          )}
        </div>

        <div className="mb-3 d-flex align-items-center">
          <MemberAvatar
            memberId={practice.memberId || ''}
            renderText={member => <MemberName className="ml-2">{member.name}</MemberName>}
          />
          <StyledDate className="ml-2">
            <Icon as={CalendarOIcon} className="mr-1" />
            {moment(practice.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </StyledDate>
        </div>

        <BraftContent>{practice.description}</BraftContent>

        <div className="d-flex justify-content-between mt-4">
          {files.length ? (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={isDownloading ? <Spinner size="sm" /> : <ChevronDownIcon />}
                variant="outline"
              >
                {formatMessage(messages.practiceFile)}
              </MenuButton>
              <MenuList>
                {files.map((file, index) => (
                  <MenuItem key={file.id} onClick={() => handleDownload(index)}>
                    {file.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ) : (
            <div></div>
          )}
          <div onClick={handleLikeStatus}>
            <StyledIconButton
              variant="ghost"
              isActive={likeStatus.isLiked}
              icon={<StyledIcon as={likeStatus.isLiked ? HeartFillIcon : HeartIcon} />}
              className="mr-2"
            />
            <StyledLikedCount isActive={likeStatus.isLiked}>{likeStatus.likedCount}</StyledLikedCount>
          </div>
        </div>

        <StyledDivider className="my-5" />

        <div className="mb-4">
          <StyledPracticeTitle className="mb-3">{formatMessage(messages.practiceSuggestion)}</StyledPracticeTitle>
          <SuggestionCreationModal threadId={`/practices/${practice.id}`} onRefetch={() => refetchPractice()} />
          {practice.suggests.map(v => {
            return (
              <div key={v.id}>
                <MessageSuggestItem
                  key={v.id}
                  suggestId={v.id}
                  memberId={v.memberId}
                  description={v.description}
                  suggestReplyCount={v.suggestReplyCount}
                  programRoles={practice?.programRoles || []}
                  reactedMemberIds={v.reactedMemberIds}
                  createdAt={v.createdAt}
                  onRefetch={() => refetchPractice()}
                />
              </div>
            )
          })}
        </div>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default PracticePage
