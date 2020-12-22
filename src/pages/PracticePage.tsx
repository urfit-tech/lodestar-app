import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import moment from 'moment'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { useAuth } from '../components/auth/AuthContext'
import { CustomRatioImage } from '../components/common/Image'
import MessageItem from '../components/common/MessageItem'
import MessageModal from '../components/common/MessageModal'
import { BraftContent } from '../components/common/StyledBraftEditor'
import DefaultLayout from '../components/layout/DefaultLayout'
import { MemberInfoBlock } from '../components/practice/PracticeDisplayedCollection'
import { ReactComponent as CalendarOIcon } from '../images/calendar-alt-o.svg'
import EmptyCover from '../images/empty-cover.png'
import { ReactComponent as HeartIcon } from '../images/icon-heart-o.svg'
import { ReactComponent as HeartFillIcon } from '../images/icon-heart.svg'

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
  && {
    border: 1px solid ${props => (props.isActive ? props.theme['@primary-color'] : 'var(--gray-light)')};
    color: ${props => (props.isActive ? props.theme['@primary-color'] : 'var(--gray)')};
    border-radius: 50%;
    padding: 12px;
  }
`
const StyledLikedCount = styled.span<{ isActive?: boolean }>`
  color: var(--gray);
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
  practiceFile: { id: 'program.ui.practiceFile', defaultMessage: '作業檔案' },
  view: { id: 'program.ui.view', defaultMessage: '查看' },
})

const PracticePage: React.FC<{}> = ({}) => {
  const { practiceId } = useParams<{ practiceId: string }>()
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { loading, error, practice } = usePractice(practiceId)
  const [likeStatus, setLikeStatus] = useState({
    isLiked: true,
    likedCount: 120,
  })

  const handleDownload = () => {}

  if (loading || error || !practice) {
    return null
  }

  return (
    <DefaultLayout white noFooter>
      <div className="container mt-5">
        <div className="d-flex mb-2">
          <StyledSubTitle className="mr-2">
            <span>{practice.programContent.program.title}</span>
            <span> - </span>
            <span>{practice.programContent.title}</span>
          </StyledSubTitle>
          <Link to={`/programs/${practice.programContent.program.id}/contents/${practice.programContent.id}`}>
            {formatMessage(messages.view)}
          </Link>
        </div>

        <StyledTitle className="mb-3">{practice.title}</StyledTitle>
        <div className="d-flex align-items-center">
          <MemberInfoBlock avatarUrl={practice.member.avatarUrl} name={practice.member.name} className="mr-2" />
          <StyledDate>
            <Icon as={CalendarOIcon} className="mr-1" />
            {moment(practice.createdAt).format('YYYY-MM-DD')}
          </StyledDate>
        </div>

        {practice.coverUrl && (
          <CustomRatioImage width="100%" ratio={9 / 16} src={practice.coverUrl || EmptyCover} className="my-4" />
        )}

        <BraftContent>{practice.description}</BraftContent>

        <div className="d-flex justify-content-between mt-4">
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline">
              {formatMessage(messages.practiceFile)}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleDownload}>Download</MenuItem>
              <MenuItem onClick={handleDownload}>Create a Copy</MenuItem>
            </MenuList>
          </Menu>
          <div
            onClick={() =>
              setLikeStatus({
                isLiked: !likeStatus.isLiked,
                likedCount: likeStatus.isLiked ? likeStatus.likedCount - 1 : likeStatus.likedCount + 1,
              })
            }
          >
            <StyledIconButton
              variant="ghost"
              isActive={likeStatus.isLiked}
              icon={<Icon as={likeStatus.isLiked ? HeartFillIcon : HeartIcon} />}
              className="mr-2"
            />
            <StyledLikedCount isActive={likeStatus.isLiked}>{likeStatus.likedCount}</StyledLikedCount>
          </div>
        </div>

        <StyledDivider className="my-3" />

        <div className="mb-4">
          <MessageModal />
          {practice.suggests.map(v => (
            <MessageItem
              memberId={v.memberId}
              createdAt={v.createdAt}
              content={v.content}
              isLiked={v.isLiked}
              likedCount={v.likedCount}
            />
          ))}
        </div>
      </div>
    </DefaultLayout>
  )
}

export default PracticePage

const usePractice = (id: string) => {
  const { currentMemberId } = useAuth()
  const practice: {
    title: string
    createdAt: Date
    coverUrl: string | null
    description: string | null
    member: {
      avatarUrl: string | null
      name: string
    }
    programContent: {
      id: string
      title: string
      program: {
        id: string
        title: string
      }
    }
    suggests: {
      memberId: string
      createdAt: Date
      content: string
      isLiked: boolean
      likedCount: number
    }[]
  } = {
    title: '我是主題名稱主題喔我是主題名稱主題喔我是主題名稱主題',
    createdAt: new Date('2020-06-01'),
    coverUrl: 'https://fakeimg.pl/1920x1080/',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum est vel ipsam tenetur dolorem esse tempora eos necessitatibus beatae. Temporibus laudantium saepe obcaecati corporis facilis porro nostrum dignissimos praesentium blanditiis!',
    member: {
      avatarUrl: null,
      name: 'sasali Wang',
    },
    programContent: {
      id: 'c8407f21-bad9-4037-834a-f55f634f743e',
      title: 'untitle',
      program: {
        id: 'acb315c7-6eb0-4001-90d0-cae3a0175532',
        title: '作業',
      },
    },
    suggests: new Array(5).fill({
      memberId: currentMemberId || '',
      createdAt: new Date(),
      content: 'hahahahha',
      isLiked: false,
      likedCount: 5,
    }),
  }

  return {
    loading: false,
    error: null,
    practice,
  }
}
