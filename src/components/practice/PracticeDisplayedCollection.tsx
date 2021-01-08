import { Icon } from '@chakra-ui/react'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { programMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as CommentIcon } from '../../images/icon-comment.svg'
import { ReactComponent as HeartIcon } from '../../images/icon-heart-o.svg'
import { ReactComponent as HeartFillIcon } from '../../images/icon-heart.svg'
import { ReactComponent as LockIcon } from '../../images/icon-lock.svg'
import { ReactComponent as RocketIcon } from '../../images/icon-rocket.svg'
import { CommonTextMixin } from '../common'
import { AvatarImage, CustomRatioImage } from '../common/Image'

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

const StyledName = styled.span`
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

const PracticeDisplayedCollection: React.FC = () => {
  const { formatMessage } = useIntl()
  // ! fake data
  const practiceCollection = new Array(12).fill({
    id: 'practiceId',
    coverUrl: null,
    title: 'title title title title title title title title title title title title title title',
    avatarUrl: null,
    name: 'name',
    suggestCount: 20,
    isLiked: true,
    likedCount: 50,
  })

  // if (!practiceCollection.length) {
  //   return (
  //     <StyledBlock className="d-flex flex-column justify-content-center align-items-center">
  //       <Icon as={RocketIcon} className="mb-4" w="120px" h="120px" />
  //       <StyledParagraph>{formatMessage(programMessages.text.uploadPractice)}</StyledParagraph>
  //     </StyledBlock>
  //   )
  // }

  return (
    <>
      <StyledBlock className="d-flex flex-column justify-content-center align-items-center">
        <Icon as={RocketIcon} className="mb-4" w="120px" h="120px" />
        <StyledParagraph>{formatMessage(programMessages.text.uploadPractice)}</StyledParagraph>
      </StyledBlock>

      <StyledNotice className="mb-4">
        <Icon as={LockIcon} className="mr-2" />
        <span>{formatMessage(messages.privatePractice)}</span>
      </StyledNotice>

      <div className="row">
        {practiceCollection.map(v => (
          <div className="col-12 col-lg-4 mb-4">
            <PracticeDisplayedCard
              id={v.id}
              title={v.title}
              coverUrl={v.coverUrl}
              avatarUrl={v.avatarUrl}
              name={v.name}
              suggestCount={v.suggestCount}
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
  avatarUrl: string | null
  name: string
  suggestCount: number
  likedCount: number
  isLiked: boolean
}> = ({ id, coverUrl, title, avatarUrl, name, suggestCount, isLiked, likedCount }) => {
  const [likeStatus, setLikeStatus] = useState({
    isLiked,
    likedCount,
  })

  return (
    <StyledContainer>
      <Link to={`/practices/${id}`}>
        <CustomRatioImage width="100%" ratio={9 / 16} src={coverUrl || EmptyCover} className="mb-3" />
        <StyledTitle className="mx-3">{title}</StyledTitle>
      </Link>

      <div className="d-flex justify-content-between align-items-end m-3">
        <MemberInfoBlock avatarUrl={avatarUrl} name={name} />

        <StyledGroup className="d-flex">
          <div className="mr-3">
            <Icon as={CommentIcon} className="mr-1" />
            <span>{suggestCount}</span>
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
    </StyledContainer>
  )
}

export const MemberInfoBlock: React.FC<{
  avatarUrl: string | null
  name: string
  className?: string
}> = ({ avatarUrl, name, className }) => (
  <div className={`d-flex align-items-center ${className}`}>
    <AvatarImage className="mr-2" size="28px" src={avatarUrl} />
    <StyledName>{name}</StyledName>
  </div>
)

export default PracticeDisplayedCollection
