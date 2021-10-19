import { SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import CreatorCard from '../../components/common/CreatorCard'
import { StyledDivider } from '../../components/review/ReviewCollectionBlock'
import { productMessages } from '../../helpers/translation'
import { usePublicMember } from '../../hooks/member'
import { Program, ProgramRole } from '../../types/program'

const StyledTitle = styled.h2`
  font-size: 24px;
  letter-spacing: 0.2px;
  color: #585858;
`

const ProgramInstructorCollectionBlock: React.VFC<{
  program: Program & {
    roles: ProgramRole[]
  }
  title?: string
}> = ({ program, title }) => {
  const { formatMessage } = useIntl()

  return (
    <div>
      <StyledTitle>{title || formatMessage(productMessages.program.title.instructorIntro)}</StyledTitle>
      <StyledDivider className="mt-1" />

      {program.roles
        .filter(role => role.name === 'instructor')
        .map(role => (
          <RoleProfile key={role.id} role={role} />
        ))}
    </div>
  )
}

const RoleProfile: React.VFC<{ role: ProgramRole }> = ({ role }) => {
  const { loadingMember, member } = usePublicMember(role.memberId)

  if (loadingMember || !member) {
    return (
      <>
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
      </>
    )
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
