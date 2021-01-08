import { sum } from 'ramda'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CommonTitleMixin } from '../../components/common'
import { CustomRatioImage } from '../../components/common/Image'
import MemberAvatar from '../../components/common/MemberAvatar'
import ProgressBar from '../../components/common/ProgressBar'
import { useProgramContentProgress } from '../../contexts/ProgressContext'
import { useEnrolledProgramIds, useProgram } from '../../hooks/program'
import EmptyCover from '../../images/empty-cover.png'

const StyledWrapper = styled.div`
  overflow: hidden;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);
`
const StyledMeta = styled.div`
  padding: 1.25rem;
`
const StyledTitle = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 1.25rem;
  height: 3em;
  ${CommonTitleMixin}
`
const StyledDescription = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 1.25rem;
  height: 3em;
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const AvatarPlaceHolder = styled.div`
  height: 2rem;
`

const ProgramCard: React.FC<{
  memberId: string
  programId: string
  programType?: string
  noInstructor?: boolean
  noPrice?: boolean
  withProgress?: boolean
}> = ({ memberId, programId, programType, noInstructor, noPrice, withProgress }) => {
  const { program } = useProgram(programId)
  const { enrolledProgramIds } = useEnrolledProgramIds(memberId)
  const { loadingProgress, programContentProgress } = useProgramContentProgress(programId, memberId)

  const viewRate = programContentProgress.length
    ? sum(programContentProgress.map(contentProgress => contentProgress.progress)) / programContentProgress.length
    : 0
  const isEnrolled = enrolledProgramIds.includes(programId)

  return (
    <>
      {!noInstructor && program?.roles && (
        <AvatarPlaceHolder className="my-3">
          {program.roles
            .filter(role => role.name === 'instructor')
            .slice(0, 1)
            .map(role => (
              <MemberAvatar key={role.memberId} memberId={role.memberId} withName />
            ))}
        </AvatarPlaceHolder>
      )}

      <Link
        to={
          isEnrolled
            ? `/programs/${programId}/contents`
            : `/programs/${programId}` + (programType ? `?type=${programType}` : '')
        }
      >
        <StyledWrapper>
          <CustomRatioImage
            width="100%"
            ratio={9 / 16}
            src={program && program.coverUrl ? program.coverUrl : EmptyCover}
            shape="rounded"
          />
          <StyledMeta>
            <StyledTitle>{program && program.title}</StyledTitle>
            <StyledDescription>{program && program.abstract}</StyledDescription>

            {withProgress && !loadingProgress && <ProgressBar percent={Math.floor(viewRate * 100)} />}
          </StyledMeta>
        </StyledWrapper>
      </Link>
    </>
  )
}

export default ProgramCard
