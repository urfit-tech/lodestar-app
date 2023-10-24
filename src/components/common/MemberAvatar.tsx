import { Text } from '@chakra-ui/react'
import { AvatarProps } from 'antd/lib/avatar'
import React from 'react'
import styled from 'styled-components'
import { usePublicMember } from '../../hooks/member'
import { MemberPublicProps } from '../../types/member'
import { AvatarImage } from './Image'

export const MemberName = styled.span<{ view?: string }>`
  ${props =>
    props.view === 'List' &&
    `
    width:60%;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  `}
  font-size: 14px;
  color: #9b9b9b;
`

type MemberAvatarProps = AvatarProps & {
  memberId: string
  renderAvatar?: (member: MemberPublicProps) => React.ReactNode
  renderText?: (member: MemberPublicProps) => React.ReactNode
  withName?: boolean
  view?: string
  noAvatar?: boolean
}
const MemberAvatar: React.VFC<MemberAvatarProps> = ({
  memberId,
  shape,
  size,
  renderAvatar,
  renderText,
  withName,
  view,
  noAvatar,
}) => {
  const { member } = usePublicMember(memberId)

  if (!member) {
    return null
  }

  return (
    <>
      {noAvatar ? (
        <Text fontSize="14px" color="#9b9b9b" overflow="hidden" textOverflow="ellipsis" noOfLines={2}>
          {member.name}
        </Text>
      ) : (
        <div className="d-flex align-items-center">
          {renderAvatar ? (
            renderAvatar(member)
          ) : (
            <AvatarImage src={member.pictureUrl || ''} shape={shape} size={size} />
          )}
          {renderText && renderText(member)}
          {withName && (
            <MemberName className="ml-3" view={view}>
              {member.name}
            </MemberName>
          )}
        </div>
      )}
    </>
  )
}

export default MemberAvatar
