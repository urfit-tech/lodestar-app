import { AvatarProps } from 'antd/lib/avatar'
import React from 'react'
import styled from 'styled-components'
import { usePublicMember } from '../../hooks/member'
import { MemberPublicProps } from '../../types/member'
import { AvatarImage } from './Image'

export const MemberName = styled.span`
  font-size: 14px;
  color: #9b9b9b;
`

type MemberAvatarProps = AvatarProps & {
  memberId: string
  renderAvatar?: (member: MemberPublicProps) => React.ReactNode
  renderText?: (member: MemberPublicProps) => React.ReactNode
  withName?: boolean
}
const MemberAvatar: React.VFC<MemberAvatarProps> = ({ memberId, shape, size, renderAvatar, renderText, withName }) => {
  const { member } = usePublicMember(memberId)

  if (!member) {
    return <AvatarImage shape={shape} size={size} />
  }

  return (
    <div className="d-flex align-items-center">
      {renderAvatar ? renderAvatar(member) : <AvatarImage src={member.pictureUrl || ''} shape={shape} size={size} />}
      {renderText && renderText(member)}
      {withName && <MemberName className="ml-3">{member.name}</MemberName>}
    </div>
  )
}

export default MemberAvatar
