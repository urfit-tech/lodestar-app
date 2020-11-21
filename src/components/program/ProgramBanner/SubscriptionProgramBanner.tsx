import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { StyledReactPlayer, StyledTags, StyledTitle, StyledVideoWrapper } from '.'
import { productMessages } from '../../../helpers/translation'
import { ProgramProps, ProgramRoleProps } from '../../../types/program'
import MemberAvatar from '../../common/MemberAvatar'
import { BREAK_POINT } from '../../common/Responsive'

const StyledWrapper = styled.div`
  background: #f7f8f8;

  ${StyledTags} {
    color: #9b9b9b;
  }
  ${StyledTitle} {
    color: #585858;
    margin-bottom: 2rem;
  }

  @media (min-width: ${BREAK_POINT}px) {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`
const StyledMediaBlock = styled.div`
  @media (min-width: ${BREAK_POINT}px) {
    order: 1;
    width: ${(700 / 12).toFixed(6)}%;
  }
`
const StyledTitleBlock = styled.div`
  width: 100%;
  padding: 1.5rem;

  @media (min-width: ${BREAK_POINT}px) {
    max-width: 520px;
  }
`
const StyledTag = styled.span`
  padding: 2px 8px;
  border: 1px solid #cdcdcd;
  border-radius: 12px;
  font-size: 12px;
`

const StyledLink = styled(Link)`
  color: #9b9b9b;
`

const SubscriptionProgramBanner: React.FC<{
  program: ProgramProps & {
    tags: string[]
    roles: ProgramRoleProps[]
  }
}> = ({ program }) => {
  const { formatMessage } = useIntl()
  const instructorId = program.roles.filter(role => role.name === 'instructor').map(role => role.memberId)[0] || ''

  return (
    <StyledWrapper id="program-banner">
      <StyledMediaBlock>
        <StyledVideoWrapper backgroundImage={program.coverUrl || ''}>
          {program.coverVideoUrl && (
            <StyledReactPlayer controls url={program.coverVideoUrl} width="100%" height="100%" />
          )}
        </StyledVideoWrapper>
      </StyledMediaBlock>

      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <StyledTitleBlock>
          <StyledTags>
            <StyledTag className="mr-2">{formatMessage(productMessages.program.content.subscribe)}</StyledTag>
            {program.tags.map(programTag => (
              <StyledLink key={programTag} to={`/search?tag=${programTag}&tab=programs`} className="mr-2">
                #{programTag}
              </StyledLink>
            ))}
          </StyledTags>
          <StyledTitle>{program.title}</StyledTitle>
          <MemberAvatar memberId={instructorId} withName={true} />
        </StyledTitleBlock>
      </div>
    </StyledWrapper>
  )
}

export default SubscriptionProgramBanner
