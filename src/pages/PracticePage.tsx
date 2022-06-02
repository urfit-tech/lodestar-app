import { ChevronDownIcon } from '@chakra-ui/icons'
import { Box, Button, Icon, Menu, MenuButton, MenuItem, MenuList, SkeletonText, Spinner } from '@chakra-ui/react'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common/index'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import LikedCountButton from '../components/common/LikedCountButton'
import MemberAvatar, { MemberName } from '../components/common/MemberAvatar'
import { BraftContent } from '../components/common/StyledBraftEditor'
import DefaultLayout from '../components/layout/DefaultLayout'
import MessageSuggestItem from '../components/practice/MessageSuggestItem'
import PracticeUploadModal from '../components/practice/PracticeUploadModal'
import SuggestionCreationModal from '../components/practice/SuggestionCreationModal'
import { downloadFile, getFileDownloadableLink, rgba } from '../helpers'
import { commonMessages, practiceMessages } from '../helpers/translation'
import { useMutatePractice, usePractice } from '../hooks/practice'
import { ReactComponent as CalendarOIcon } from '../images/calendar-alt-o.svg'
import { ReactComponent as MoreIcon } from '../images/ellipsis.svg'

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

const StyledDivider = styled.div`
  border-bottom: 1px solid var(--gray-light);
`
const StyledLink = styled(Link)`
  color: ${props => props.theme['@primary-color']};
  &&:hover {
    color: ${props => rgba(props.theme['@primary-color'], 0.8)};
  }
`

const messages = defineMessages({
  practiceSuggestion: { id: 'program.label.practiceSuggestion', defaultMessage: '作業建議' },
  practiceFile: { id: 'program.ui.practiceFile', defaultMessage: '作業檔案' },
  view: { id: 'program.ui.view', defaultMessage: '查看' },
  editSuggestion: { id: 'program.ui.editSuggestion', defaultMessage: '編輯建議' },
  deleteSuggestion: { id: 'program.ui.deleteSuggestion', defaultMessage: '刪除建議' },
})

const PracticePage: React.VFC = () => {
  const { practiceId } = useParams<{ practiceId: string }>()
  const { formatMessage } = useIntl()
  const { currentMemberId, authToken } = useAuth()
  const history = useHistory()
  const { loadingPractice, errorPractice, practice, refetchPractice } = usePractice({ practiceId })

  const { deletePractice, insertPracticeReaction, deletePracticeReaction } = useMutatePractice(practiceId)
  const [isDownloading, setIsDownloading] = useState(false)

  if (loadingPractice) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }

  if (errorPractice || !practice) {
    return <div>{formatMessage(commonMessages.status.readingError)}</div>
  }

  const isLiked = practice?.reactedMemberIds?.some(memberId => memberId === currentMemberId) || false
  const files: {
    id: string
    name: string
    from: string
  }[] = practice.attachments.map(attachment => ({
    id: attachment.id,
    name: attachment.data.name,
    from: 'practice',
  }))

  const handleDownload = async (fileIndex: number) => {
    setIsDownloading(true)
    const file = files[fileIndex]
    const fileKey = `attachments/${file.id}`
    try {
      const fileLink = await getFileDownloadableLink(fileKey, authToken)
      const fileRequest = new Request(fileLink)
      const response = await fetch(fileRequest)
      response.url &&
        downloadFile(file.name, { url: response.url }).then(() => {
          setIsDownloading(false)
        })
    } catch (error) {
      process.env.NODE_ENV === 'development' && console.error(error)
    }
  }
  const handleDelete = async () => {
    if (practice.memberId === currentMemberId) {
      await deletePractice()
      history.push(`/programs/${practice.programId}/contents/${practice.programContentId}`)
    }
  }
  const handleLikeStatus = async () => {
    if (isLiked) {
      await deletePracticeReaction()
    } else {
      await insertPracticeReaction()
    }

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
          <StyledLink to={`/programs/${practice.programId}/contents/${practice.programContentId}`}>
            {formatMessage(messages.view)}
          </StyledLink>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <StyledTitle>{practice.title}</StyledTitle>
          {practice.memberId === currentMemberId && (
            <Box className="d-flex" h="40px">
              <PracticeUploadModal
                programContentId={practice.programContentId}
                isCoverRequired={practice.isCoverRequired}
                practice={practice}
                onRefetch={refetchPractice}
                onSubmit={() => window.location.reload()}
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
            <div />
          )}
          <LikedCountButton onClick={handleLikeStatus} count={practice.reactedMemberIdsCount} isLiked={isLiked} />
        </div>

        <StyledDivider className="my-5" />

        <div className="mb-4">
          <StyledPracticeTitle className="mb-3">{formatMessage(messages.practiceSuggestion)}</StyledPracticeTitle>
          <SuggestionCreationModal threadId={`/practices/${practice.id}`} onRefetch={() => refetchPractice()} />
          {practice.suggests.map(v => (
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
          ))}
        </div>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default PracticePage
