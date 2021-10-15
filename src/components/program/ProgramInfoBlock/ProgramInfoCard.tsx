import { Card } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { usePublicMember } from '../../../hooks/member'
import { Category } from '../../../types/general'
import { Program, ProgramContent, ProgramContentSection, ProgramPlan, ProgramRole } from '../../../types/program'
import { AvatarImage } from '../../common/Image'
import ProgramContentCountBlock from './ProgramContentCountBlock'

const StyledInstructorName = styled.div`
  margin-bottom: 28px;
  color: #585858;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`

export const StyledProgramInfoCard = styled(Card)`
  && {
    margin-bottom: 2.5rem;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  }

  .ant-card-body {
    padding: 1rem;
  }
`

const ProgramInfoCard: React.FC<{
  instructorId: string
  program: Program & {
    roles: ProgramRole[]
    categories: Category[]
    plans: ProgramPlan[]
    contentSections: (ProgramContentSection & {
      contents: ProgramContent[]
    })[]
  }
}> = ({ instructorId, program, children }) => {
  const { member } = usePublicMember(instructorId)

  return (
    <StyledProgramInfoCard>
      {member && (
        <>
          <Link to={`/creators/${member.id}?tabkey=introduction`}>
            <AvatarImage src={member.pictureUrl || ''} size={96} className="my-3 mx-auto" />
          </Link>
          <Link to={`/creators/${member.id}?tabkey=introduction`}>
            <StyledInstructorName>{member.name}</StyledInstructorName>
          </Link>
        </>
      )}

      <ProgramContentCountBlock program={program} />

      {children}
    </StyledProgramInfoCard>
  )
}

export default ProgramInfoCard
