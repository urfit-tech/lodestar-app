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
import { PracticePreviewProps } from '../../types/practice'
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

const PracticeDisplayedCollection: React.VFC<{
  isPrivate: boolean
  programContentId: string
}> = ({ isPrivate, programContentId }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId, currentUserRole } = useAuth()
  const { loadingPracticeCollection, errorPracticeCollection, practiceCollection } = usePracticeCollection({
    programContentId,
    memberId: currentUserRole === 'general-member' && isPrivate ? currentMemberId : null,
  })

  if (loadingPracticeCollection || errorPracticeCollection || !practiceCollection || !currentMemberId) {
    return (
      <Box padding="6" boxShadow="lg" bg="white">
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
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

      {practiceCollection.length < 1 && (
        <StyledBlock className="d-flex flex-column justify-content-center align-items-center">
          <Icon as={RocketIcon} className="mb-4" w="120px" h="120px" />
          <StyledParagraph>{formatMessage(programMessages.text.uploadPractice)}</StyledParagraph>
        </StyledBlock>
      )}

      <div className="row">
        {practiceCollection.map(v => (
          <div className="col-12 col-lg-4 mb-4" key={v.id}>
            <PracticeDisplayedCard {...v} currentMemberId={currentMemberId} />
          </div>
        ))}
      </div>
    </>
  )
}

const StyledCard = styled.div`
  overflow: hidden;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px 0 var(--gray);
`
const StyledTitle = styled.h3`
  overflow: hidden;
  color: var(--gray-darker);
  font-size: 18px;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.3s;

  &:hover {
    color: ${props => props.theme['@primary-color']};
  }
`
const StyledGroup = styled.div`
  color: var(--gray-dark);
  font-size: 12px;
`
const StyledLike = styled.span<{ isActive: boolean }>`
  ${props =>
    props.isActive &&
    css`
      color: ${props.theme['@primary-color']};
      text-shadow: 0 0 3px ${props.theme['@primary-color']}33;
    `}

  cursor: pointer;
  user-select: none;
`

const PracticeDisplayedCard: React.VFC<
  PracticePreviewProps & {
    currentMemberId: string
  }
> = ({
  id,
  coverUrl,
  title,
  memberId,
  suggestCount,
  isCoverRequired,
  reactedMemberIds,
  reactedMemberIdsCount,
  currentMemberId,
}) => {
  const { deletePracticeReaction, insertPracticeReaction } = useMutatePractice(id)
  const [likeStatus, setLikeStatus] = useState({
    isLiked: reactedMemberIds.includes(currentMemberId),
    likedCount: reactedMemberIdsCount,
  })

  const handleLikeStatus = async () => {
    if (likeStatus.isLiked) {
      await deletePracticeReaction()
    } else {
      await insertPracticeReaction()
    }
    setLikeStatus(prev => ({
      isLiked: !prev.isLiked,
      likedCount: prev.isLiked ? prev.likedCount - 1 : prev.likedCount + 1,
    }))
  }

  return (
    <a href={`/practices/${id}`} target="_blank" rel="noopener noreferrer">
      <StyledCard>
        {isCoverRequired && <CustomRatioImage width="100%" ratio={9 / 16} src={coverUrl || EmptyCover} />}
        <div className="p-3">
          <StyledTitle className="mb-2">{title}</StyledTitle>

          <div className="d-flex align-items-center justify-content-between">
            <MemberAvatar memberId={memberId} withName />
            <StyledGroup className="text-right">
              <span className="mr-3">
                <Icon as={CommentIcon} className="mr-1" />
                <span>{suggestCount}</span>
              </span>
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
        </div>
      </StyledCard>
    </a>
  )
}

export default PracticeDisplayedCollection
