import { Divider, Skeleton } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { productMessages } from '../../helpers/translation'
import { usePublicMember } from '../../hooks/member'
import { ProgramProps, ProgramRoleProps } from '../../types/program'
import CreatorCard from '../common/CreatorCard'

const StyledTitle = styled.h2`
  font-size: 24px;
  letter-spacing: 0.2px;
  color: #585858;
`

const ProgramInstructorCollectionBlock: React.FC<{
  program: ProgramProps & {
    roles: ProgramRoleProps[]
  }
  title?: string
}> = ({ program, title }) => {
  const { formatMessage } = useIntl()

  return (
    <div>
      <StyledTitle>{title || formatMessage(productMessages.program.title.instructorIntro)}</StyledTitle>
      <Divider className="mt-1" />

      {program.roles
        .filter(role => role.name === 'instructor')
        .map(role => (
          <RoleProfile key={role.id} role={role} />
        ))}
    </div>
  )
}

const RoleProfile: React.FC<{ role: ProgramRoleProps }> = ({ role }) => {
  const { loadingMember, member } = usePublicMember(role.memberId)

  if (loadingMember || !member) {
    return <Skeleton active avatar />
  }

  return (
    <CreatorCard
      id={member.id}
      avatarUrl={member.pictureUrl}
      title={member.name || member.username}
      labels={[
        {
          id: role.id,
          name: role.name,
        },
      ]}
      jobTitle={member.title}
      description={member.abstract}
      withProgram
      withPodcast
      withAppointment
      withBlog
      noPadding
    />
  )
}

export default ProgramInstructorCollectionBlock
