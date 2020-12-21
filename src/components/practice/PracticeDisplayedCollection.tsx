import { Icon } from '@chakra-ui/react'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { programMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as CommentIcon } from '../../images/icon-comment.svg'
import { ReactComponent as HeartIcon } from '../../images/icon-heart-o.svg'
import { ReactComponent as HeartFillIcon } from '../../images/icon-heart.svg'
import { ReactComponent as LockIcon } from '../../images/icon-lock.svg'
import { ReactComponent as RocketIcon } from '../../images/icon-rocket.svg'
import { AvatarImage, CustomRatioImage } from '../common/Image'

const StyledBlock = styled.div`
  margin: 50px 0;
`
export const StyledText = css`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`
const StyledParagraph = styled.p`
  ${StyledText};
`
const StyledNotice = styled.div`
  border-radius: 4px;
  height: 44px;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-dark);
  background-color: var(--gray-lighter);
  letter-spacing: 0.4px;
`

const StyledName = styled.span`
  width: 67px;
  height: 18px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.6px;
  color: var(--gray-dark);
`

const messages = defineMessages({
  privatePractice: {
    id: 'program.text.privatePractice',
    defaultMessage: '老師已將作業成果設為私密，因此僅能看到自己的作業成果',
  },
})

const PracticeDisplayedCollection: React.FC<{ fakeData?: boolean }> = ({ fakeData }) => {
  const { formatMessage } = useIntl()
  const practiceCollection = fakeData
    ? new Array(12).fill({
        coverUrl: null,
        title: 'title title title title title title title title title title title title title title',
        avatarUrl: null,
        name: 'name',
        isLiked: true,
        likedCount: 50,
      })
    : []

  if (!practiceCollection.length) {
    return (
      <StyledBlock className="d-flex flex-column justify-content-center align-items-center">
        <Icon as={RocketIcon} className="mb-4" w="120px" h="120px" />
        <StyledParagraph>{formatMessage(programMessages.text.uploadPractice)}</StyledParagraph>
      </StyledBlock>
    )
  }

  return (
    <>
      <StyledNotice className="mb-4">
        <Icon as={LockIcon} className="mr-2" />
        <span>{formatMessage(messages.privatePractice)}</span>
      </StyledNotice>
      <div className="row">
        {practiceCollection.map(v => (
          <div className="col-12 col-lg-4 mb-4">
            <PracticeDisplayedCard
              title={v.title}
              coverUrl={v.coverUrl}
              avatarUrl={v.avatarUrl}
              name={v.name}
              isLiked={v.isLiked}
              likedCount={v.likedCount}
            />
          </div>
        ))}
      </div>
    </>
  )
}

const StyledTitle = styled.h3`
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  coverUrl: string | null
  title: string
  avatarUrl: string | null
  name: string
  likedCount: number
  isLiked: boolean
}> = ({ coverUrl, title, avatarUrl, name, isLiked, likedCount }) => {
  const [likeStatus, setLikeStatus] = useState({
    isLiked,
    likedCount,
  })

  return (
    <StyledContainer>
      <CustomRatioImage width="100%" ratio={9 / 16} src={coverUrl || EmptyCover} />
      <div className="p-3">
        <StyledTitle className="mb-3">{title}</StyledTitle>
        <div className="d-flex justify-content-between align-items-end">
          <div className="d-flex align-items-center">
            <AvatarImage className="mr-2" size="28px" src={avatarUrl} />
            <StyledName>{name}</StyledName>
          </div>
          <StyledGroup className="d-flex">
            <div className="mr-3">
              <Icon as={CommentIcon} className="mr-1" />
              <span>1</span>
            </div>
            <StyledLike
              isActive={likeStatus.isLiked}
              onClick={() =>
                setLikeStatus({
                  isLiked: !likeStatus.isLiked,
                  likedCount: likeStatus.isLiked ? likeStatus.likedCount - 1 : likeStatus.likedCount + 1,
                })
              }
            >
              <Icon as={likeStatus.isLiked ? HeartFillIcon : HeartIcon} className="mr-1" />
              <span>{likeStatus.likedCount}</span>
            </StyledLike>
          </StyledGroup>
        </div>
      </div>
    </StyledContainer>
  )
}

export default PracticeDisplayedCollection
