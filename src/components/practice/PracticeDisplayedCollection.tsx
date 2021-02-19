import { Box, Icon, SkeletonText } from '@chakra-ui/react'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { programMessages } from '../../helpers/translation'
import { useMutatePractice, usePracticeCollection } from '../../hooks/practice'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as CommentIcon } from '../../images/icon-comment.svg'
import { ReactComponent as HeartIcon } from '../../images/icon-heart-o.svg'
import { ReactComponent as HeartFillIcon } from '../../images/icon-heart.svg'
import { ReactComponent as LockIcon } from '../../images/icon-lock.svg'
import { ReactComponent as RocketIcon } from '../../images/icon-rocket.svg'
import { useAuth } from '../auth/AuthContext'
import { CommonTextMixin } from '../common'
import { CustomRatioImage } from '../common/Image'
import MemberAvatar from '../common/MemberAvatar'

const StyledBlock = styled.div`
  margin: 50px 0;
`
const StyledParagraph = styled.p`
  ${CommonTextMixin};
`
const StyledNotice = styled.div`
  ${CommonTextMixin};
  border-radius: 4px;
  padding: 12px;
  background-color: var(--gray-lighter);
`

const messages = defineMessages({
  privatePractice: {
    id: 'program.text.privatePractice',
    defaultMessage: '老師已將作業成果設為私密，因此僅能看到自己的作業成果',
  },
})

const PracticeDisplayedCollection: React.FC<{
  isPrivate: boolean
  programContentId: string
}> = ({ isPrivate, programContentId }) => {
  const { currentMemberId, currentUserRole } = useAuth()
  const { formatMessage } = useIntl()
  const { loadingPracticeCollection, errorPracticeCollection, practiceCollection } = usePracticeCollection({
    programContentId,
    memberId: currentUserRole === 'general-member' && isPrivate ? currentMemberId : null,
  })

  if (loadingPracticeCollection || errorPracticeCollection || !practiceCollection) {
    return (
      <Box padding="6" boxShadow="lg" bg="white">
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
      </Box>
    )
  }
  return (
    <>
      {isPrivate && (
        <StyledNotice className="mb-4">
          <Icon as={LockIcon} className="mr-2" />
          <span>{formatMessage(messages.privatePractice)}</span>
        </StyledNotice>
      )}
      {practiceCollection.every(practice => practice.memberId !== currentMemberId) && (
        <StyledBlock className="d-flex flex-column justify-content-center align-items-center">
          <Icon as={RocketIcon} className="mb-4" w="120px" h="120px" />
          <StyledParagraph>{formatMessage(programMessages.text.uploadPractice)}</StyledParagraph>
        </StyledBlock>
      )}

      <div className="row">
        {practiceCollection.map(v => (
          <div className="col-12 col-lg-4 mb-4" key={v.id}>
            <PracticeDisplayedCard
              id={v.id}
              title={v.title}
              coverUrl={v.coverUrl}
              memberId={v.memberId}
              suggestCount={v.suggestCount}
              isLiked={v.reactedMemberIds?.some(memberId => memberId === currentMemberId) || false}
              likedCount={v?.reactedMemberIdsCount || 0}
            />
          </div>
        ))}
      </div>
    </>
  )
}

const StyledTitle = styled.h3`
  height: 20px;
  color: var(--gray-darker);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.3s;

  &:hover {
    color: ${props => props.theme['@primary-color']};
  }
`
const StyledContainer = styled.div`
  border-radius: 4px;
  box-shadow: 0 2px 10px 0 var(--gray);
  background-color: #ffffff;
  overflow: hidden;
`
const StyledGroup = styled.div`
  line-height: 1;
  font-size: 12px;
`
const StyledLike = styled.div<{ isActive: boolean }>`
  ${props =>
    props.isActive &&
    css`
      color: ${props.theme['@primary-color']};
      text-shadow: 0 0 3px ${props.theme['@primary-color']}33;
    `}

  cursor: pointer;
  user-select: none;
`

const PracticeDisplayedCard: React.FC<{
  id: string
  coverUrl: string | null
  title: string
  memberId: string
  suggestCount: number
  likedCount: number
  isLiked: boolean
}> = ({ id, coverUrl, title, memberId, suggestCount, isLiked, likedCount }) => {
  const [likeStatus, setLikeStatus] = useState({
    isLiked,
    likedCount,
  })
  const { deletePracticeReaction, insertPracticeReaction } = useMutatePractice(id)

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
  }
  return (
    <StyledContainer>
      <a href={`/practices/${id}`} target="_blank" rel="noopener noreferrer">
        <CustomRatioImage width="100%" ratio={9 / 16} src={coverUrl || EmptyCover} className="mb-3" />
        <StyledTitle className="mx-3">{title}</StyledTitle>

        <div className="d-flex justify-content-between align-items-end m-3">
          <MemberAvatar memberId={memberId} withName />
          <StyledGroup className="d-flex">
            <div className="mr-3">
              <Icon as={CommentIcon} className="mr-1" />
              <span>{suggestCount}</span>
            </div>
            <StyledLike
              isActive={likeStatus.isLiked}
              onClick={e => {
                e.preventDefault()
                handleLikeStatus()
              }}
            >
              <Icon as={likeStatus.isLiked ? HeartFillIcon : HeartIcon} className="mr-1" />
              <span>{likeStatus.likedCount}</span>
            </StyledLike>
          </StyledGroup>
        </div>
      </a>
    </StyledContainer>
  )
}

export default PracticeDisplayedCollection
