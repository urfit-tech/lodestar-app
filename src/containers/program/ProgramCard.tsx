import { Box } from '@chakra-ui/react'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common/index'
import { sum } from 'ramda'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CustomRatioImage } from '../../components/common/Image'
import MemberAvatar from '../../components/common/MemberAvatar'
import ProgressBar from '../../components/common/ProgressBar'
import { useProgramContentProgress } from '../../contexts/ProgressContext'
import { useProgram } from '../../hooks/program'
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
  ${MultiLineTruncationMixin}
  ${CommonTitleMixin}
  margin-bottom: 1.25rem;
  height: 3em;
`
const StyledDescription = styled.div`
  ${MultiLineTruncationMixin}
  margin-bottom: 1.25rem;
  height: 3em;
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const AvatarPlaceHolder = styled.div`
  height: 2rem;
`

const ProgramCard: React.VFC<{
  memberId: string
  programId: string
  programType?: string
  noInstructor?: boolean
  noPrice?: boolean
  withProgress?: boolean
  isExpired?: boolean
  previousPage?: string
}> = ({ memberId, programId, programType, noInstructor, noPrice, withProgress, isExpired, previousPage }) => {
  const { program } = useProgram(programId)
  const { loadingProgress, programContentProgress } = useProgramContentProgress(programId, memberId)

  const viewRate = programContentProgress?.length
    ? sum(programContentProgress.map(contentProgress => contentProgress.progress)) / programContentProgress.length
    : 0

  return (
    <Box opacity={isExpired ? '50%' : '100%'}>
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
          isExpired
            ? `/programs/${programId}?visitIntro=1`
            : programType && previousPage
            ? `/programs/${programId}?type=${programType}&back=${previousPage}`
            : programType
            ? `/programs/${programId}?type=${programType}`
            : previousPage
            ? `/programs/${programId}?back=${previousPage}`
            : `/programs/${programId}`
        }
      >
        <StyledWrapper>
          <CustomRatioImage
            width="100%"
            ratio={9 / 16}
            src={(program && (program.coverThumbnailUrl || program.coverUrl || program.coverMobileUrl)) || EmptyCover}
            shape="rounded"
          />
          <StyledMeta>
            <StyledTitle>{program && program.title}</StyledTitle>
            <StyledDescription>{program && program.abstract}</StyledDescription>

            {withProgress && !loadingProgress && <ProgressBar percent={Math.floor(viewRate * 100)} />}
          </StyledMeta>
        </StyledWrapper>
      </Link>
    </Box>
  )
}

export default ProgramCard
